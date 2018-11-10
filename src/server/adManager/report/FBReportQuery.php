<?php


class FBReportQuery
{
    private $dbManager;

    private $insightTransformer;

    private $logExporter;

    public function __construct()
    {
        $this->dbManager = new AdManagerDBFacade();
        $this->insightTransformer = new FBInsightTransformer($this->dbManager);
        $this->logExporter = new FBInsightLogExporter();
    }

    //camapaign报表只存数据库不写日志
    public function queryFbCampaignReport($campaignIdArray)
    {
        //$yesterdayDate = CommonHelper::getYesterdayDate();
        $campaignDbReports = array();

        foreach($campaignIdArray as $campaignId)
        {
            $campaignInsight = AdManagerFacade::getOneCampaignInsight($campaignId, '2016-07-19', '2016-10-20');
            if(false === $campaignInsight)
            {
                ServerLogger::instance()->writeReportLog(Warning, 'Failed to read insight by campaignId: ' . $campaignId);
                continue;
            }
            if(count($campaignInsight) == 0)
            {
                ServerLogger::instance()->writeReportLog(Debug, 'Can not get insight by campaignId: ' . $campaignId);
                continue;
            }
            if(count($campaignInsight) > 1)
            {
                ServerLogger::instance()->writeReportLog(Warning, 'Get more than 1 insight by one campaignId: ' . $campaignId);
            }

            $oneInsight = $campaignInsight[0];

            //存储
//            $insightDbEntity = $this->insightTransformer->transformToCampaignDb($oneInsight);
//            if(false === $insightDbEntity)
//            {
//                ServerLogger::instance()->writeReportLog(Error, 'Failed to transform fb campaign entity to db.' . $campaignId);
//                continue;
//            }
//            $campaignDbReports[] = $insightDbEntity;
//
//            $resultCode = $this->dbManager->insertCampaignReportRecord($insightDbEntity);
//            if(OK != $resultCode)
//            {
//                ServerLogger::instance()->writeReportLog(Error, 'Failed to insert campaign Insight : ' .
//                    print_r($oneInsight, true) . '; error code : ' . $resultCode);
//                continue;
//            }
        }

        return $campaignDbReports;
    }

    public function queryFbAdReport($adIdArray, $currentDate, $currentTime, $isStoreDB = false, $isWithTitle = false)
    {
        $adLogArray = array();
        if($isWithTitle)
        {
            $logTitle = $this->logExporter->getCsvTitle();
            $adLogArray[] = $logTitle;
        }

        foreach($adIdArray as $adId)
        {
            //暂不支持细分场景
            $insightEntityArray = AdManagerFacade::getOneAdInsight($adId, '2016-07-19', '2016-10-20');
            if(false === $insightEntityArray)
            {
                ServerLogger::instance()->writeReportLog(Warning, 'Can not get insight by adId: '. $adId);
                continue;
            }
            if(count($insightEntityArray) == 0)
            {
                ServerLogger::instance()->writeReportLog(Debug, 'Can not get insight by adId: '. $adId);
                continue;
            }
            if(count($insightEntityArray) > 1)
            {
                ServerLogger::instance()->writeReportLog(Warning, 'Get more than 1 insight by one adId: '. $adId);
            }


            $oneInsight = $insightEntityArray[0];

            //处理日志（Log）
            $insightDbEntity = $this->insightTransformer->transfromToAdDb($oneInsight);
            if(false === $insightDbEntity)
            {
                ServerLogger::instance()->writeReportLog(Error, 'Failed to transform fb ad entity to db. Errorcode: '
                    . ERR_REPORT_DB_TRANSFORM);
                continue;
            }

            //处理DB
            if(true === $isStoreDB)
            {
                $dbCode = $this->dbManager->insertAdReportRecord($insightDbEntity);
                if(OK != $dbCode)
                {
                    ServerLogger::instance()->writeReportLog(Error, 'Failed to insert ad Insight : ' .
                        print_r($oneInsight, true) . '; error code : ' . $dbCode);
                    continue;
                }
            }

            $logContent = $this->handleAdInsightLog($insightDbEntity);
            if(false === $logContent)
            {
                ServerLogger::instance()->writeReportLog(Error, 'Failed to export fb ad info to log. ErrorCode: '
                    . ERR_REPORT_DB_TRANSFORM);
                continue;
            }
            $adLogArray[] = $logContent;

            ServerLogger::instance()->writeReportLog(Info, 'Successed to read ad insight of :' . $adId);
            usleep(ReportConstants::QUERY_AD_INSIGHT_INTERVAL);
        }

        $writeResult = $this->writeAdReportLog($adLogArray, $currentDate, $currentTime);
        if(false === $writeResult)
        {
            return ERR_WRITE_REPORT_LOG;
        }

        return OK;
    }

    private function handleAdInsightLog(AdReportEntity $adReportEntity)
    {
        $adDbInfo = $this->insightTransformer->getAdDbInfo($adReportEntity->getAdId());
        if(false === $adDbInfo)
        {
            return false;
        }

        $creativeEntity = $this->insightTransformer->getCreativeDbInfo($adDbInfo->getCreativeUid());
        if(false === $creativeEntity)
        {
            return false;
        }

        $adsetEntity = $this->insightTransformer->getAdSetDbInfo($adReportEntity->getAdsetId());
        if(false === $adsetEntity)
        {
            return false;
        }


        $instanceArray = array(
            $adReportEntity,
            $adsetEntity,
            $creativeEntity,
        );

        $this->logExporter->setInstances($instanceArray);
        $exportContent = $this->logExporter->exportLog();

        return $exportContent;
    }

    private function writeAdReportLog($logContentArray, $currentDate, $currentTime)
    {
        $adLogRoot = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_AD_REPORT_LOG_DIR);
        //$adLogRoot = EL_SERVER_PATH . 'serverTest/adReportLog';
        if(!FileHelper::createDir($adLogRoot))
        {
            ServerLogger::instance()->writeReportLog(Error, 'The ad report log root dir is not existed.');
            return false;
        }

        $datePath = $adLogRoot . DIRECTORY_SEPARATOR . $currentDate;
        if(!FileHelper::createDir($datePath))
        {
            ServerLogger::instance()->writeReportLog(Error, 'Failed to create ad report log dir : ' . $datePath);
            return false;
        }

        $fileName = $datePath . DIRECTORY_SEPARATOR . $currentTime . ReportConstants::AD_REPORT_LOG_EXTENSION;
        FileHelper::saveCsv($fileName, $logContentArray, "\t");

        return true;
    }
}
