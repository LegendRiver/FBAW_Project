<?php


class QueryFbInsightTask
{
    private $reportQuery;

    private $configStaticManager;

    public function __construct()
    {
        $this->reportQuery = new FBReportQuery();
        $this->configStaticManager = new ConfigReportManager();
    }

    public function runCampaignReportExport()
    {
        while (true)
        {
            $this->configStaticManager->resetMgr();

            $accounts = AdManagerFacade::getCurrentUserAllAccounts();

            if(!is_array($accounts))
            {
                ServerLogger::instance()->writeReportLog(Error, 'Cannot get account.');
                break;
            }
            foreach ($accounts as $accountEntity)
            {
                $accountId = $accountEntity->getId();
                $campaignIds = AdManagerFacade::getCampaignIdsByAccount($accountId);
                if(false == $campaignIds)
                {
                    ServerLogger::instance()->writeReportLog(Warning, 'Failed to get CampaigIds by accountId : ' . $accountId);
                    continue;
                }
                $this->configStaticManager->addQueriedCampaignIds($campaignIds);

                $dbReports = $this->reportQuery->queryFbCampaignReport($campaignIds);
                $this->configStaticManager->addCampaignReports($dbReports);

                ServerLogger::instance()->writeReportLog(Info, 'Completed to read campaign insight of account : ' . $accountEntity->getName());
                usleep(ReportConstants::READ_CAMPAIGN_INSIGHT_ACCOUNT_INTERVAL);
            }

            //统计config报表，并通知前台
            //$syncResult = $this->configStaticManager->syncFrontReport();
            //if(false === $syncResult)
            //{
            //    ServerLogger::instance()->writeReportLog(Warning, 'Failed to sync reports.');
            //}

            //调整利率
            //$configId2CampaignReports = $this->configStaticManager->getCampaignReports();
            //ProfitManager::instance()->adjustProfit($configId2CampaignReports);

            //usleep(1000);
            ServerLogger::instance()->writeReportLog(Info, 'Completed to Read all campaign insights.');
            break;
        }
    }

    public function runAdReportExport()
    {
//        while (true)
//        {
            $accounts = AdManagerFacade::getCurrentUserAllAccounts();
            $currentDate = date('Y-m-d');
            $currentTime = time();
            foreach ($accounts as $accountEntity)
            {
                $accountId = $accountEntity->getId();
                $adIds = AdManagerFacade::getAdIdsByParentId($accountId);
                if(false == $adIds)
                {
                    ServerLogger::instance()->writeReportLog(Warning, 'Failed to get ad ids by accountId : ' . $accountId);
                    continue;
                }

                $this->reportQuery->queryFbAdReport($adIds, $currentDate, $currentTime, true);

                ServerLogger::instance()->writeReportLog(Info, 'Completed to read ad insight of account : ' . $accountEntity->getName());
                usleep(ReportConstants::READ_AD_INSIGHT_ACCOUNT_INTERVAL);
            }

            ServerLogger::instance()->writeReportLog(Info, 'Completed to Read all ad insights.');
//            break;
//        }
    }
}