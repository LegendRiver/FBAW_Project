<?php

use FacebookAds\Object\Values\CampaignObjectiveValues;

class FBInsightTransformer
{
    private $dbManager;

    public function __construct(AdManagerDBFacade $dbFacade)
    {
        $this->dbManager = $dbFacade;
    }

    public function transfromToAdDb(InsightEntity $fbAdEntity)
    {
        $adReportDbEntity = new AdReportEntity();

        $setResult = $this->transformCommonDbField($fbAdEntity, $adReportDbEntity);
        if(false === $setResult)
        {
            ServerLogger::instance()->writeReportLog(Warning, '[ad]Failed to transform common field.');
            return false;
        }

        $adId = $fbAdEntity->getAdId();
        $adDbEntity = $this->getAdDbInfo($adId);
        if(false === $adDbEntity)
        {
            ServerLogger::instance()->writeReportLog(Warning, '[ad]Failed to get db data by adId . ' . $adId);
            return false;
        }
        $adUid = $adDbEntity->getUuid();
        $adReportDbEntity->setAdId($adId);
        $adReportDbEntity->setAdUid($adUid);

        $adsetId = $fbAdEntity->getAdSetId();
        $adSetDbEntity = $this->getAdSetDbInfo($adsetId);
        if(false === $adSetDbEntity)
        {
            ServerLogger::instance()->writeReportLog(Warning, '[ad]Failed to get db data by adsetId . ' . $adsetId);
            return false;
        }
        $adSetUid = $adSetDbEntity->getUid();
        $adReportDbEntity->setAdsetId($adsetId);
        $adReportDbEntity->setAdsetUid($adSetUid);

        $campaignId = $fbAdEntity->getCampaignId();
        $campaignDbEntity = $this->getCampaignDbInfo($campaignId);
        if(false === $campaignDbEntity)
        {
            ServerLogger::instance()->writeReportLog(Warning, '[ad]Failed to get db data by campaignId . ' . $campaignId);
            return false;
        }
        $campaignUid = $campaignDbEntity->getUid();
        $adReportDbEntity->setCampaignId($campaignId);
        $adReportDbEntity->setCampaignUid($campaignUid);

        return $adReportDbEntity;
    }

    public function transformToCampaignDb(InsightEntity $fbAdEntity)
    {
        $campaignReportDbEntity = new CampaignReportEntity();

        $setResult = $this->transformCommonDbField($fbAdEntity, $campaignReportDbEntity);
        if(false === $setResult)
        {
            ServerLogger::instance()->writeReportLog(Warning, 'Failed to transform common field.');
            return false;
        }

        $campaignId = $fbAdEntity->getCampaignId();
        $campaignDbEntity = $this->getCampaignDbInfo($campaignId);
        if(false === $campaignDbEntity)
        {
            ServerLogger::instance()->writeReportLog(Warning, 'Failed to get db data by campaignId . ' . $campaignId);
            return false;
        }
        $campaignUid = $campaignDbEntity->getUid();
        $campaignReportDbEntity->setCampaignId($campaignId);
        $campaignReportDbEntity->setCampaignUid($campaignUid);
        $campaignReportDbEntity->setConfigId($campaignDbEntity->getConfigId());

        return $campaignReportDbEntity;
    }

    private function transformCommonDbField(InsightEntity $fbAdEntity, CommonReportEntity $commonReportDbEntity)
    {
        $commonReportDbEntity->setRequestTime(date('Y-m-d H:i:s'));

        $uuid = CPublic::getGuid();
        $commonReportDbEntity->setUuid($uuid);

        $commonReportDbEntity->setStartTime($fbAdEntity->getStartDate());
        $commonReportDbEntity->setEndTime($fbAdEntity->getStopDate());

        $commonReportDbEntity->setReach($fbAdEntity->getReach());
        $commonReportDbEntity->setClick($fbAdEntity->getClicks());
        $commonReportDbEntity->setCpc($fbAdEntity->getCpc());
        $commonReportDbEntity->setCtr($fbAdEntity->getCtr());
        $commonReportDbEntity->setCpm($fbAdEntity->getCpm());

        //以下代码需要实际运行各种目标的广告进行验证
        $impression = $fbAdEntity->getImpressions();
        $commonReportDbEntity->setImpression($impression);

        $spend = $fbAdEntity->getSpend();
        $commonReportDbEntity->setSpend($spend);

        $objective = $fbAdEntity->getObjective();
        $actions = $fbAdEntity->getActionsArray();
        $actionType = $this->getResultType($objective);
        if(false === $actionType)
        {
            return false;
        }
        $actionValue = $this->getActionValue($actions, $actionType);

        $commonReportDbEntity->setResultValue($actionValue);
        $commonReportDbEntity->setResultType($actionType);
        $resultRate = CommonHelper::divisionOperate($actionValue,$impression)*100;
        $commonReportDbEntity->setResultRate(round($resultRate, ReportConstants::REPORT_PERCENT_DECIMAL_PRECISION));
        $costPResult = CommonHelper::divisionOperate($spend,$actionValue);
        $commonReportDbEntity->setCostPerResult(round($costPResult, ReportConstants::REPORT_SPEND_DECIMAL_PRECISION));

        $installAmount = $this->getActionValue($actions, AdManageConstants::INSIGHT_ACTION_TYPE_MOBIEL_INSTALL);
        $cpi = CommonHelper::divisionOperate($spend, $installAmount);
        $cvr = CommonHelper::divisionOperate($installAmount, $impression);
        $commonReportDbEntity->setInstalls($installAmount);
        $commonReportDbEntity->setCpi(round($cpi, ReportConstants::REPORT_SPEND_DECIMAL_PRECISION));
        $commonReportDbEntity->setCvr(round($cvr, ReportConstants::REPORT_PERCENT_DECIMAL_PRECISION));

        return true;
    }

    private function getResultType($objective)
    {
        if($objective == CampaignObjectiveValues::APP_INSTALLS)
        {
            return AdManageConstants::INSIGHT_ACTION_TYPE_MOBIEL_INSTALL;
        }
        else if($objective == CampaignObjectiveValues::LINK_CLICKS)
        {
            return AdManageConstants::INSIGHT_ACTION_TYPE_LINK_CLICK;
        }
        else if($objective == CampaignObjectiveValues::PRODUCT_CATALOG_SALES)
        {
            return 'WAIT TO TEST';
        }
        else if($objective == CampaignObjectiveValues::PAGE_LIKES)
        {
            return 'WAIT TO TEST';
        }
        else if($objective == CampaignObjectiveValues::BRAND_AWARENESS)
        {
            return 'WAIT TO TEST';
        }
        else
        {
            ServerLogger::instance()->writeReportLog(Error, 'The objective is not defined. : ' . $objective);
            return false;
        }
    }

    private function getActionValue($actions, $actionType)
    {
        $actionMap = $this->getActionMap($actions);

        if(array_key_exists($actionType, $actionMap))
        {
            $actionValue = $actionMap[$actionType];
        }
        else
        {
            ServerLogger::instance()->writeReportLog(Info, 'Can not find action value by : ' . $actionType);
            $actionValue = 0;
        }

        return $actionValue;

    }

    private function getActionMap($actionArray)
    {
        $actionMap = array();
        if(!is_array($actionArray))
        {
            return $actionMap;
        }
        foreach ($actionArray as $actionInfo)
        {
            $actionType = $actionInfo[AdManageConstants::INSIGHT_ACTION_TYPE];
            $actionValue = $actionInfo[AdManageConstants::INSIGHT_ACTION_VALUE];
            $actionMap[$actionType] = $actionValue;
        }

        return $actionMap;
    }

    public function getAdDbInfo($adId)
    {
        $dbEntitys = $this->dbManager->getAdInfo($adId);
        if(false === $dbEntitys)
        {
            ServerLogger::instance()->writeReportLog(Error, 'Failed to get adinfo from db by adId : '.$adId);
            return false;
        }

        $recordCount = count($dbEntitys);
        if($recordCount === 0)
        {
            ServerLogger::instance()->writeReportLog(Error, 'Failed to get adinfo from db by adId : '.$adId);
            return false;
        }

        if($recordCount > 1)
        {
            ServerLogger::instance()->writeReportLog(Warning, 'The count of ad records is greater than 1. count: ' . $recordCount);
        }

        $entity = $dbEntitys[0];

        return $entity;
    }

    private function getCampaignDbInfo($campaignId)
    {
        $dbEntitys = $this->dbManager->getCampaignInfo($campaignId);
        if(false === $dbEntitys)
        {
            ServerLogger::instance()->writeReportLog(Error, 'Failed to get campaigninfo from db by campaignId : '.$campaignId);
            return false;
        }

        $recordCount = count($dbEntitys);
        if($recordCount === 0)
        {
            ServerLogger::instance()->writeReportLog(Error, 'Failed to get campaigninfo from db by campaignId : '.$campaignId);
            return false;
        }

        if($recordCount > 1)
        {
            ServerLogger::instance()->writeReportLog(Warning, 'The count of campaign records is greater than 1. count: ' . $recordCount);
        }

        $entity = $dbEntitys[0];

        return $entity;
    }

    public function getAdSetDbInfo($adSetId)
    {
        $dbEntitys = $this->dbManager->getAdSetInfo($adSetId);
        if(false === $dbEntitys)
        {
            ServerLogger::instance()->writeReportLog(Error, 'Failed to get adSetinfo from db by adSetId : '.$adSetId);
            return false;
        }

        $recordCount = count($dbEntitys);
        if($recordCount === 0)
        {
            ServerLogger::instance()->writeReportLog(Error, 'Failed to get adSetinfo from db by adSetId : '.$adSetId);
            return false;
        }

        if($recordCount > 1)
        {
            ServerLogger::instance()->writeReportLog(Warning, 'The count of adSet records is greater than 1. count: ' . $recordCount);
        }

        $entity = $dbEntitys[0];

        return $entity;
    }

    public function getCreativeDbInfo($creativeUid)
    {
        $dbEntitys = $this->dbManager->getCreativeInfoByUid($creativeUid);
        if(false === $dbEntitys)
        {
            ServerLogger::instance()->writeReportLog(Error, 'Failed to get creativeInfo from db by creativeUid : '.$creativeUid);
            return false;
        }

        $recordCount = count($dbEntitys);
        if($recordCount === 0)
        {
            ServerLogger::instance()->writeReportLog(Warning, 'Failed to get creativeInfo from db by creativeUid : '.$creativeUid);
            return false;
        }

        if($recordCount > 1)
        {
            ServerLogger::instance()->writeReportLog(Warning, 'The count of creativeInfo records is greater than 1. count: ' . $recordCount);
        }

        $entity = $dbEntitys[0];

        return $entity;
    }
}