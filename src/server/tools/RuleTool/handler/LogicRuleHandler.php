<?php


class LogicRuleHandler extends RuleHandler
{
    private $mailContent;

    public function __construct($configPath, $configFileName)
    {
        parent::__construct($configPath, $configFileName);
        $this->mailContent = '';
    }

    protected function handleOneConfig($configInfo)
    {
        $parentType = $configInfo[RuleToolConstants::CONF_ITEM_PARENT_TYPE];
        $parentIdList = $configInfo[RuleToolConstants::CONF_ITEM_PARENT_ID];
        $subType = $configInfo[RuleToolConstants::CONF_ITEM_SUB_TYPE];
        $logicType = $configInfo[RuleToolConstants::CONF_ITEM_LOGIC_TYPE];
        $warningThs = $configInfo[RuleToolConstants::CONF_ITEM_WARNING_THRESHOLD];
        $errorThs = $configInfo[RuleToolConstants::CONF_ITEM_ERROR_THRESHOLD];
        $description = $configInfo[RuleToolConstants::CONF_ITEM_DESCRIPTION];

        $subNodeIdMap = $this->getSubNodeId($parentType, $parentIdList, $subType, true);

        if(empty($subType))
        {
            $subType = $parentType;
        }

        $keyWarningTH = $this->getKeyThreshold($warningThs);
        $keyErrorTH = $this->getKeyThreshold($errorThs);
        $insightValueList = $this->buildSubNodeInfo($subNodeIdMap, $subType, $parentType, $keyWarningTH, $keyErrorTH);

        if(RuleToolConstants::LOGIC_TYPE_SUM == $logicType)
        {
            $parentIds = array_keys($insightValueList);
            $errorFields = $errorThs[RuleToolConstants::CONF_ITEM_INSIGHT_FIELD];
            $errorThValues = $errorThs[RuleToolConstants::CONF_ITEM_INSIGHT_VALUE];
            $insightEValues = $this->getSumInsightValues($errorFields, $insightValueList);
            $errorCompareValues = array_map(array('CommonHelper','compareOperate'), $errorThValues, $insightEValues);
            if(array_sum($errorCompareValues) != count($errorThValues))
            {
                //告警
                foreach ($parentIds as $handleId)
                {
                    $result = RuleToolHelper::pauseTheNode($handleId, $parentType);
                    if(false == $result)
                    {
                        ServerLogger::instance()->writeLog(Error, '#logic_alarm# Failed to pause: ' . $parentType . ' : ', $handleId);
                    }
                }

                $this->mailContent .= RuleToolConstants::MAIL_TEMPLATE_ERROR;
                $warning = $description . '(' . implode(',', $parentIds) . ')安装量' .
                    '(' . implode(',', $insightEValues) . ')' . '超过阈值: ' . $keyErrorTH . '<br />';
                $this->mailContent .= $warning;
                return;
            }

            $warningFields = $warningThs[RuleToolConstants::CONF_ITEM_INSIGHT_FIELD];
            $warningThValues = $warningThs[RuleToolConstants::CONF_ITEM_INSIGHT_VALUE];
            $insightWValues = $this->getSumInsightValues($warningFields, $insightValueList);
            $warningCompareValues = array_map(array('CommonHelper','compareOperate'), $warningThValues, $insightWValues);
            if(array_sum($warningCompareValues) != count($warningThValues))
            {
                //告警
                $this->mailContent .= RuleToolConstants::MAIL_TEMPLATE_WARNING;
                $warning = $description . '(' . implode(',', $parentIds) . ')安装量' .
                    '(' . implode(',', $insightWValues) . ')' . '超过阈值: ' . $keyWarningTH . '<br />';
                $this->mailContent .= $warning;
            }
        }
        else
        {
            //后续添加
        }
    }

    protected function sendMail()
    {
        MailerHelper::instance()->sendMail($this->mailToAddress, $this->mailSubject, $this->mailContent);
    }

    private function getSumInsightValues($fields, $insightValueMap)
    {
        $fieldNum = count($fields);
        $sumValue = array_fill(0, $fieldNum, 0);
        foreach ($insightValueMap as $parentId => $valueList)
        {
            $valueArray= array();
            foreach ($valueList as $value)
            {
                foreach ($fields as $field)
                {
                    $valueArray[] = $value[$field];
                }
            }
            $sumValue = array_map(array('CommonHelper','addOperate'), $sumValue, $valueArray);
        }

        return $sumValue;
    }

    private function getKeyThreshold($thresholdInfo)
    {
        $thresholdList = $thresholdInfo[RuleToolConstants::CONF_ITEM_INSIGHT_VALUE];
        if(empty($thresholdList))
        {
            return 0;
        }

        return $thresholdList[0];
    }

    private function buildSubNodeInfo($subNodeIdMap, $subType, $parentType, $warningTh, $errorTh)
    {
        $subNodeInsights = array();
        foreach($subNodeIdMap as $parentId=>$subNodeIds)
        {
            $nodeInsightList = array();
            foreach($subNodeIds as $nodeId)
            {
                if(!RuleToolHelper::isNodeActive($nodeId, $subType))
                {
                    ServerLogger::instance()->writeLog(Warning, '#logic_alarm# The node has been inactive : ' . $nodeId);
                    continue;
                }
                $insightValue = RuleToolHelper::getInsightValue($nodeId, $subType);
                if(empty($insightValue))
                {
                    ServerLogger::instance()->writeLog(Warning, '#logic_alarm# The insight is empty , nodeId: ' . $nodeId);
                    continue;
                }
                $insightValue[RuleToolConstants::INSIGHT_ID] = $nodeId;
                $nodeInsightList[] = $insightValue;
            }

            if(empty($nodeInsightList))
            {
                continue;
            }

            $subNodeInsights[$parentId] = $nodeInsightList;

            $commonInfo = array();
            $parentName = RuleToolHelper::getNodeNameById($parentId, $parentType);
            $commonInfo[RuleToolConstants::INSIGHT_TYPE] = $subType;
            $commonInfo[RuleToolConstants::INSIGHT_PARENT_NAME] = $parentName;
            $commonInfo[RuleToolConstants::INSIGHT_PARENT_ID] = $parentId;
            $commonInfo[RuleToolConstants::INSIGHT_PARENT_TYPE] = $parentType;
            $commonInfo[RuleToolConstants::INSIGHT_TYPE] = $subType;
            $commonInfo[RuleToolConstants::INSIGHT_ERROR_THRESHOLD] = $errorTh;
            $commonInfo[RuleToolConstants::INSIGHT_WARNING_THRESHOLD] = $warningTh;

            $this->nodeCommonInfoList[$parentId] = $commonInfo;
        }

        return $subNodeInsights;
    }
}