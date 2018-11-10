<?php

class RuleToolHelper
{
    public static function getSubNodeIds($parentType, $parentId, $subType)
    {
        if(empty($parentType))
        {
            ServerLogger::instance()->writeLog(Error, 'The id of parent node is empty');
            return array();
        }

        if(empty($subType) || $subType == $parentType)
        {
            return array($parentId);
        }

        if(RuleToolConstants::NODE_TYPE_AD == $subType)
        {
            $subNodeId = self::getAdIds($parentType, $parentId);
        }
        else if(RuleToolConstants::NODE_TYPE_ADSET == $subType)
        {
            $subNodeId = self::getAdsetIds($parentType, $parentId);
        }
        else if(RuleToolConstants::NODE_TYPE_CAMPAIGN == $subType)
        {
            $subNodeId = self::getCampaignIds($parentType, $parentId);
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'The subType is invalid: ' . $subType);
            $subNodeId = array();
        }

        return $subNodeId;
    }

    public static function getInsightValue($nodeId, $nodeType, $configInfo)
    {
        $exportType = self::getExportType($nodeType);
        $insights = AdManagerFacade::getFlexibleInsight($nodeId, $exportType);
        if(empty($insights))
        {
            return array();
        }

        $insight = $insights[0];
        $insightValue = InsightValueReader::readInsightValue($insight, $configInfo);
        $insightTitle = InsightValueReader::generateInsightTitle($configInfo);
        $valueMap = array_combine($insightTitle, $insightValue);

        $cpi = self::getCpi($valueMap);
        $name = self::getNodeNameFromInsight($valueMap, $nodeType);

        $insightValue = array(
            RuleToolConstants::INSIGHT_CPI => round($cpi, 2),
            RuleToolConstants::INSIGHT_IMPRESSION => intval($valueMap[RuleToolConstants::INSIGHT_IMPRESSION]),
            RuleToolConstants::INSIGHT_NAME => $name,
            RuleToolConstants::INSIGHT_ACCOUNT_ID => $valueMap[RuleToolConstants::INSIGHT_ACCOUNT_ID],
            RuleToolConstants::INSIGHT_INSTALL => intval($valueMap[RuleToolConstants::INSIGHT_INSTALL]),
        );

        return $insightValue;
    }

    public static function isNodeActive($nodeId, $nodeType)
    {
        $entity = self::getNodeEntity($nodeId, $nodeType);

        if(empty($entity))
        {
            return false;
        }

        if($nodeType == RuleToolConstants::NODE_TYPE_ACCOUNT)
        {
            $status = $entity->getStatus();
            return (1 == $status);
        }
        else
        {
          $status = $entity->getEffectiveStatus();
          return ('ACTIVE' == $status);
        }
    }

    public static function getNodeNameById($nodeId, $nodeType)
    {
        $nodeName = '';

        $entity = self::getNodeEntity($nodeId, $nodeType);

        if(!empty($entity))
        {
            $nodeName = $entity->getName();
        }

        return $nodeName;
    }

    public static function getNodeUrl($accountId, $subNodeId, $nodeType)
    {
        if($nodeType == RuleToolConstants::NODE_TYPE_AD)
        {
            $apiNode = 'ads';
            $searchKey = 'SEARCH_BY_ADGROUP_ID';
        }
        else if($nodeType == RuleToolConstants::NODE_TYPE_ADSET)
        {
            $apiNode = 'adsets';
            $searchKey = 'SEARCH_BY_CAMPAIGN_ID';
        }
        else if($nodeType == RuleToolConstants::NODE_TYPE_CAMPAIGN)
        {
            $apiNode = 'campaigns';
            $searchKey = 'SEARCH_BY_CAMPAIGN_GROUP_ID';
        }
        else
        {
            return '';
        }

        $bmId = AdManageConstants::DEFAULT_BM_ID;
        $currentDate = CommonHelper::getTodayDate();
        $tomorrowDate = CommonHelper::getTomorrowDate();
        $formatDate = $currentDate . '_' . $tomorrowDate;

        $url = sprintf(RuleToolConstants::MAIL_TEMPLATE_URL, $apiNode, $accountId,
            $bmId, $formatDate, $searchKey, $subNodeId);
        return $url;
    }

    private static function getNodeEntity($nodeId, $nodeType)
    {
        if(RuleToolConstants::NODE_TYPE_ACCOUNT == $nodeType)
        {
            $entity = AdManagerFacade::getAccountById($nodeId);
        }
        else if(RuleToolConstants::NODE_TYPE_CAMPAIGN == $nodeType)
        {
            $entity = AdManagerFacade::getCampaignById($nodeId);
        }
        else if(RuleToolConstants::NODE_TYPE_ADSET == $nodeType)
        {
            $entity = AdManagerFacade::getAdsetById($nodeId);
        }
        else if(RuleToolConstants::NODE_TYPE_AD == $nodeType)
        {
            $entity = AdManagerFacade::getAdById($nodeId);
        }
        else
        {
            $entity = null;
        }

        return $entity;
    }

    private static function getNodeNameFromInsight($valueMap, $nodeType)
    {
        $nodeName = '';

        if(RuleToolConstants::NODE_TYPE_CAMPAIGN == $nodeType)
        {
            $nodeName = CommonHelper::getArrayValueByKey(RuleToolConstants::INSIGHT_CAMPAIGN_NAME, $valueMap);
        }
        else if(RuleToolConstants::NODE_TYPE_ADSET == $nodeType)
        {
            $nodeName = CommonHelper::getArrayValueByKey(RuleToolConstants::INSIGHT_ADSET_NAME, $valueMap);
        }
        else if(RuleToolConstants::NODE_TYPE_AD == $nodeType)
        {
            $nodeName = CommonHelper::getArrayValueByKey(RuleToolConstants::INSIGHT_AD_NAME, $valueMap);
        }

        return $nodeName;
    }

    private static function getCpi($valueMap)
    {
        $cpi = floatval($valueMap[RuleToolConstants::INSIGHT_CPI]);
        if(0 != $cpi)
        {
             return $cpi;
        }

        $install = intval($valueMap[RuleToolConstants::INSIGHT_INSTALL]);
        if(0 != $install)
        {
            return $cpi;
        }

        $spend = floatval($valueMap[RuleToolConstants::INSIGHT_SPEND]);
        $impression = intval($valueMap[RuleToolConstants::INSIGHT_IMPRESSION]);
        $reach = intval($valueMap[RuleToolConstants::INSIGHT_REACH]);
        if($reach == 0 || $impression == 0)
        {
            //暂时防护，后面查询之前数据来判断
            $cpi = 0;
        }
        else
        {
            $cpi = $spend;
        }
        return $cpi;
    }

    public static function pauseTheNode($nodeId, $nodeType)
    {
        $pauseStatus = 'PAUSED';
        if(RuleToolConstants::NODE_TYPE_CAMPAIGN == $nodeType)
        {
            $statusResult = AdManagerFacade::updateCampaignStatus($nodeId, $pauseStatus);
        }
        else if(RuleToolConstants::NODE_TYPE_ADSET == $nodeType)
        {
            $statusResult = AdManagerFacade::updateAdSetStatus($nodeId, $pauseStatus);
        }
        else if(RuleToolConstants::NODE_TYPE_AD == $nodeType)
        {
            $statusResult = AdManagerFacade::updateAdStatus($nodeId, $pauseStatus);
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'The nodeType is invalid: ' . $nodeType);
            $statusResult = false;
        }

        return $statusResult;
    }

    private static function getAdIds($parentType, $parentId, $isOnlyActive=true)
    {
        $exportType = self::getExportType($parentType);
        if(empty($exportType))
        {
            return array();
        }

        if($isOnlyActive)
        {
            $status = array(AdManageConstants::EFFECTIVE_STATUS_ACTIVE);
        }
        else
        {
            $status = array();
        }

        $adIdArray = AdManagerFacade::getAdIdsByParentId($parentId, $exportType, $status, true);
        return $adIdArray;
    }

    private static function getAdsetIds($parentType, $parentId, $isOnlyActive=true)
    {
        $exportType = self::getExportType($parentType);
        if(empty($exportType))
        {
            return array();
        }
        if($isOnlyActive)
        {
            $status = array(AdManageConstants::EFFECTIVE_STATUS_ACTIVE);
        }
        else
        {
            $status = array();
        }
        $adsetIdArray = AdManagerFacade::getAdSetIdsByParentId($parentId, $exportType, $status, true);
        return $adsetIdArray;
    }

    private static function getCampaignIds($parentType, $parentId)
    {
        $campaignIdArray = array();

        if(RuleToolConstants::NODE_TYPE_ACCOUNT == $parentType)
        {
            $campaignIdArray = AdManagerFacade::getCampaignIdsByAccount($parentId);
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'The parent type is invalid: '. $parentType);
        }

        return $campaignIdArray;
    }

    private static function getExportType($ruleNodeType)
    {
        if(RuleToolConstants::NODE_TYPE_ACCOUNT == $ruleNodeType)
        {
            return AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT;
        }
        else if(RuleToolConstants::NODE_TYPE_CAMPAIGN == $ruleNodeType)
        {
            return AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN;
        }
        else if(RuleToolConstants::NODE_TYPE_ADSET == $ruleNodeType)
        {
            return AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET;
        }
        else if(RuleToolConstants::NODE_TYPE_AD == $ruleNodeType)
        {
            return AdManageConstants::INSIGHT_EXPORT_TYPE_AD;
        }

        return '';
    }
}