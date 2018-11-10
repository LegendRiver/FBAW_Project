<?php


class RuleHandler
{
    private $warningList;
    private $errorList;
    private $failedSwitchList;
    protected $nodeCommonInfoList;

    private $configList;
    private $ruleParser;
    protected $mailSubject;
    protected $mailToAddress;

    private $insightConfInfo;

    public function __construct($configPath, $configFileName)
    {
        $this->reset();
        $configFilePath = $configPath . $configFileName;
        $configInfo = FileHelper::readJsonFile($configFilePath);
        $this->configList = $configInfo[RuleToolConstants::CONF_ITEM_RULE_INFO];
        $this->mailSubject = $configInfo[RuleToolConstants::CONF_ITEM_MAIL_SUBJECT];
        $this->mailToAddress = $configInfo[RuleToolConstants::CONF_ITEM_MAIL_TO_ADDRESS];

        $this->ruleParser = new RuleParser($this->configList);
        $this->insightConfInfo = FileHelper::readJsonFile($configPath . 'insight_fields.json');
    }

    public function handleRule($isSendEmail=true)
    {
        $this->reset();
        foreach($this->configList as $oneConfig)
        {
            $this->handleOneConfig($oneConfig);
        }

        if($isSendEmail)
        {
            $this->sendMail();
        }
    }

    private function reset()
    {
        $this->warningList = array();
        $this->errorList = array();
        $this->failedSwitchList = array();
        $this->nodeCommonInfoList = array();
    }

    protected function sendMail()
    {
        $mailBody = '';
        if(!empty($this->errorList))
        {
            $mailBody .= $this->getMailContent(RuleToolConstants::MAIL_CONTENT_TYPE_ERROR);
        }

        if(!empty($this->failedSwitchList))
        {
            $mailBody .= $this->getMailContent(RuleToolConstants::MAIL_CONTENT_TYPE_FAILED);
        }

        if(!empty($this->warningList))
        {
            $mailBody .= $this->getMailContent(RuleToolConstants::MAIL_CONTENT_TYPE_WARNING);
        }

        if(empty($mailBody))
        {
            return;
        }
        MailerHelper::instance()->sendMail($this->mailToAddress, $this->mailSubject, $mailBody);
    }

    private function getMailContent($contentType)
    {
        $mailContent = "";
        $contentList = $this->getContentList($contentType);
        foreach($contentList as $parentId => $subNodeInfos)
        {
            $commonInfo = CommonHelper::getArrayValueByKey($parentId, $this->nodeCommonInfoList);
            if(is_null($commonInfo))
            {
                ServerLogger::instance()->writeLog(Error, 'There is no commonInfo by :' . $parentId);
                continue;
            }

            $parentType = $commonInfo[RuleToolConstants::INSIGHT_PARENT_TYPE];
            $parentName = $commonInfo[RuleToolConstants::INSIGHT_PARENT_NAME];
            $parentID = $commonInfo[RuleToolConstants::INSIGHT_PARENT_ID];
            $subType = $commonInfo[RuleToolConstants::INSIGHT_TYPE];

            $thresholdTemplate = $this->getThresholdTemplate($contentType);

            $mailContent .= sprintf($thresholdTemplate, $parentType, $parentName, $parentID, $subType);

            $classifyNodeInfo = $this->classifyByRuleType($subNodeInfos);

            foreach($classifyNodeInfo as $ruleType => $nodeInfoList)
            {
                if(empty($nodeInfoList))
                {
                    continue;
                }
                $sampleNode = $nodeInfoList[0];
                $ruleFields = $sampleNode[RuleToolConstants::INSIGHT_FIELDS];

                if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_WARNING)
                {
                    $thresholdValue = $sampleNode[RuleToolConstants::INSIGHT_WARNING_THRESHOLD];
                }
                else
                {
                    $thresholdValue = $sampleNode[RuleToolConstants::INSIGHT_ERROR_THRESHOLD];
                }
                $mailContent .= sprintf(RuleToolConstants::MAIL_TEMPLATE_FIELD, implode(', ',$ruleFields),
                    implode(', ',$thresholdValue));

                foreach($nodeInfoList as $nodeInfo)
                {
                    $id = $nodeInfo[RuleToolConstants::INSIGHT_ID];
                    $name = $nodeInfo[RuleToolConstants::INSIGHT_NAME];
                    $accountId = $nodeInfo[RuleToolConstants::INSIGHT_ACCOUNT_ID];
                    $url = RuleToolHelper::getNodeUrl($accountId, $id, $subType);

                    $insightValue = $this->getInsightValue($ruleFields, $nodeInfo);
                    $mailContent .= sprintf(RuleToolConstants::MAIL_TEMPLATE_SUBVALUE, $url, $name, $id,
                        implode(', ',$insightValue));
                }
            }

        }

        $mailTitle = $this->getContentTitle($contentType);
        $mailBody = $mailTitle . $mailContent;
        return $mailBody;
    }

    private function getInsightValue($fields, $nodeInfo)
    {
        $insightValue = array();
        foreach ($fields as $field)
        {
            if(array_key_exists($field, $nodeInfo))
            {
                $insightValue[] = $nodeInfo[$field];
            }
            else
            {
                $insightValue[] = 0;
            }
        }

        return $insightValue;
    }

    private function classifyByRuleType($subNodeInfos)
    {
       $classifyResult = array();
       foreach($subNodeInfos as $nodeInfo)
       {
           $ruleType = $nodeInfo[RuleToolConstants::INSIGHT_RULE_TYPE];
           if(array_key_exists($ruleType, $classifyResult))
           {
               $classifyResult[$ruleType][] = $nodeInfo;
           }
           else
           {
               $classifyResult[$ruleType] = array($nodeInfo);
           }
       }

       return $classifyResult;
    }

    private function getThresholdTemplate($contentType)
    {
        $thresholdTemplate = RuleToolConstants::MAIL_TEMPLATE_THRESHOLD;
        if(RuleToolConstants::MAIL_CONTENT_TYPE_FAILED == $contentType)
        {
            $thresholdTemplate = RuleToolConstants::MAIL_TEMPLATE_FAILED_SWITCH;
        }

        return $thresholdTemplate;
    }

    private function getContentTitle($contentType)
    {
        $title = '';
        if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_ERROR)
        {
            $title = RuleToolConstants::MAIL_TEMPLATE_ERROR;
        }
        else if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_WARNING)
        {
            $title = RuleToolConstants::MAIL_TEMPLATE_WARNING;
        }
        else if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_FAILED)
        {
            $title = RuleToolConstants::MAIL_TEMPLATE_FAILED;
        }

        return $title;
    }

    private function getContentList($contentType)
    {
        $contentList = array();
        if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_ERROR)
        {
            $contentList = $this->errorList;
        }
        else if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_WARNING)
        {
            $contentList = $this->warningList;
        }
        else if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_FAILED)
        {
            $contentList = $this->failedSwitchList;
        }

        return $contentList;
    }


    protected function handleOneConfig($configInfo)
    {
        $parentType = $configInfo[RuleToolConstants::CONF_ITEM_PARENT_TYPE];
        $parentIdList = $configInfo[RuleToolConstants::CONF_ITEM_PARENT_ID];
        $subType = $configInfo[RuleToolConstants::CONF_ITEM_SUB_TYPE];
        $ruleKey = $configInfo[RuleToolConstants::CONF_ITEM_RULE_KEY];

        $subNodeIdMap = $this->getSubNodeId($parentType, $parentIdList, $subType);

        if(empty($subType))
        {
            $subType = $parentType;
        }

        foreach($subNodeIdMap as $parentId=>$subNodeIds)
        {
            $needCommonInfo = false;
            foreach($subNodeIds as $nodeId)
            {
//                if(!RuleToolHelper::isNodeActive($nodeId, $subType))
//                {
//                    continue;
//                }

                $insightValue = RuleToolHelper::getInsightValue($nodeId, $subType, $this->insightConfInfo);
                if(empty($insightValue))
                {
                    continue;
                }
                $ruleCheckers = $this->ruleParser->getRuleChecker($ruleKey);
                $errorResult = $this->checkError($ruleCheckers, $insightValue, $nodeId, $subType, $parentId);
                if(false === $errorResult)
                {
                    $needCommonInfo = true;
                    continue;
                }

                $warningResult = $this->checkWarning($ruleCheckers, $insightValue, $nodeId, $parentId);
                if(false === $warningResult)
                {
                    $needCommonInfo = true;
                    continue;
                }
            }

            if($needCommonInfo)
            {
                $commonInfo = array();
                $parentName = RuleToolHelper::getNodeNameById($parentId, $parentType);
                $commonInfo[RuleToolConstants::INSIGHT_TYPE] = $subType;
                $commonInfo[RuleToolConstants::INSIGHT_PARENT_NAME] = $parentName;
                $commonInfo[RuleToolConstants::INSIGHT_PARENT_ID] = $parentId;
                $commonInfo[RuleToolConstants::INSIGHT_PARENT_TYPE] = $parentType;
                $commonInfo[RuleToolConstants::INSIGHT_TYPE] = $subType;
                $this->nodeCommonInfoList[$parentId] = $commonInfo;
            }
        }
    }

    private function checkError($ruleCheckers, $insightValue, $nodeId, $subType, $parentId)
    {
        foreach ($ruleCheckers as $checker)
        {
            $isOk = $checker->checkError($insightValue);
            if(!$isOk)
            {
                $result = RuleToolHelper::pauseTheNode($nodeId, $subType);

                $fields = $checker->getFields();
                $errorThreshold = $checker->getErrorThreshold();
                $ruleType = $checker->getType();
                $insightValue[RuleToolConstants::INSIGHT_ID] = $nodeId;
                $insightValue[RuleToolConstants::INSIGHT_ERROR_THRESHOLD] = $errorThreshold;
                $insightValue[RuleToolConstants::INSIGHT_FIELDS] = $fields;
                $insightValue[RuleToolConstants::INSIGHT_RULE_TYPE] = $ruleType;

                if($result)
                {
                    $this->addValueToList(RuleToolConstants::MAIL_CONTENT_TYPE_ERROR, $insightValue, $parentId);
                }
                else
                {
                    $this->addValueToList(RuleToolConstants::MAIL_CONTENT_TYPE_FAILED, $insightValue, $parentId);
                }
                return false;
            }
        }

        return true;
    }

    private function checkWarning($ruleCheckers, $insightValue, $nodeId, $parentId)
    {
        foreach ($ruleCheckers as $checker)
        {
            $isOk = $checker->checkWarning($insightValue);
            if(!$isOk)
            {
                $fields = $checker->getFields();
                $warningThreshold = $checker->getWarningThreshold();
                $ruleType = $checker->getType();
                $insightValue[RuleToolConstants::INSIGHT_ID] = $nodeId;
                $insightValue[RuleToolConstants::INSIGHT_WARNING_THRESHOLD] = $warningThreshold;
                $insightValue[RuleToolConstants::INSIGHT_FIELDS] = $fields;
                $insightValue[RuleToolConstants::INSIGHT_RULE_TYPE] = $ruleType;
                $this->addValueToList(RuleToolConstants::MAIL_CONTENT_TYPE_WARNING, $insightValue, $parentId);
                return false;
            }
        }

        return true;
    }

    protected function addValueToList($contentType, $value, $id)
    {
        if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_ERROR)
        {
            if(array_key_exists($id, $this->errorList))
            {
                $this->errorList[$id][] = $value;
            }
            else
            {
                $this->errorList[$id] = array($value);
            }
        }
        else if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_WARNING)
        {
            if(array_key_exists($id, $this->warningList))
            {
                $this->warningList[$id][] = $value;
            }
            else
            {
                $this->warningList[$id] = array($value);
            }
        }
        else if($contentType == RuleToolConstants::MAIL_CONTENT_TYPE_FAILED)
        {
            if(array_key_exists($id, $this->failedSwitchList))
            {
                $this->failedSwitchList[$id][] = $value;
            }
            else
            {
                $this->failedSwitchList[$id] = array($value);
            }
        }
    }

    protected function getSubNodeId($parentType, $parentIdList, $subType, $isAll=false)
    {
        $allSubNode = array();
        foreach($parentIdList as $parentId)
        {
            if(!$isAll && !RuleToolHelper::isNodeActive($parentId, $parentType))
            {
                continue;
            }
            $subNodeIds = RuleToolHelper::getSubNodeIds($parentType, $parentId, $subType);
            $allSubNode[$parentId] = $subNodeIds;
        }

        return $allSubNode;
    }
}