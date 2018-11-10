<?php


class ConfigReportManager
{
    private $configId2CampaignReport;

    private $queriedAllCampaignIds;

    private $validCampaignIds;

    private $campaignDbReports;

    private $id2ConfigReport;

    public function __construct()
    {
        $this->resetMgr();
    }

    public function resetMgr()
    {
        $this->configId2CampaignReport = array();
        $this->queriedAllCampaignIds = array();
        $this->validCampaignIds = array();
        $this->campaignDbReports = array();
        $this->id2ConfigReport = array();
    }

    public function addQueriedCampaignIds($campaignIds)
    {
        $this->queriedAllCampaignIds = array_merge($this->queriedAllCampaignIds, (array)$campaignIds);
    }

    public function addCampaignReports($campaignReportEntityArray)
    {
        $this->campaignDbReports = array_merge($this->campaignDbReports, $campaignReportEntityArray);
    }

    public function getCampaignReports()
    {
        return $this->configId2CampaignReport;
    }

    public function syncFrontReport()
    {
        //统计config报表
        $this->statisticConfigReport();

        if(count($this->id2ConfigReport) == 0)
        {
            ServerLogger::instance()->writeReportLog(Info, 'There is no report data in this query.');
            return false;
        }

        ServerLogger::instance()->writeReportLog(Info, 'Completed to static config report of camapaign: '
        . print_r($this->validCampaignIds, true));

        //同步前台
        $reportRecords = array();
        $fields = array();
        foreach($this->id2ConfigReport as $configId=>$reports)
        {
            if(count($fields) == 0)
            {
                $fields = array_keys($reports);
            }
            $oneRecord = array_values($reports);
            $reportRecords[] = $oneRecord;
        }

        $errorCode = OppositeSyncManager::updateConfigReportDB($fields, $reportRecords);
        if($errorCode != OK)
        {
            ServerLogger::instance()->writeReportLog(Error, sprintf("Sync config report to client failed, error code <%d>.", $errorCode));
            return false;
        }
        else
        {
            ServerLogger::instance()->writeReportLog(Info, "Sync config report to client success.");
            return true;
        }
    }

    private function statisticConfigReport()
    {
        //分组
        $this->categoryReportEntity();

        //统计
        foreach($this->configId2CampaignReport as $configId=>$entityArray)
        {
            $configReport = $this->sumCampaignReport($entityArray, $configId);
            $this->id2ConfigReport[$configId] = $configReport;
        }
    }

    private function sumCampaignReport($campaignReports, $configId)
    {
        $sumReport = array();
        if(count($campaignReports) > 0)
        {
            $oneCampaign = $campaignReports[0];
            $commonFieldArray = $this->extractCommonField($oneCampaign);
            $sumReport = $commonFieldArray;
        }
        else
        {
            return $sumReport;
        }

        $spend = 0;
        $resultValue = 0;
        $reach = 0;
        $impression = 0;
        $clicks = 0;
        $installs = 0;
        foreach($campaignReports as $reportEntity)
        {
            $resultValue += $reportEntity->getResultValue();
            $reach += $reportEntity->getReach();
            $spend += $reportEntity->getSpend();
            $impression += $reportEntity->getImpression();
            $clicks += $reportEntity->getClick();
            $installs += $reportEntity->getInstalls();
        }

        //获取ui预算
        $profitEntities = ProfitDBFacade::instance()->getProfitByConfigId($configId);
        if(!empty($profitEntities))
        {
           $spend = $profitEntities[0]->getDailyBudget();
        }

        $cpc = CommonHelper::divisionOperate($spend, $clicks);
        $cpm = CommonHelper::divisionOperate($spend, $impression)*1000;
        $costResult = CommonHelper::divisionOperate($spend, $resultValue);
        $cpi = CommonHelper::divisionOperate($spend, $installs);
        $ctr = CommonHelper::divisionOperate($clicks, $impression)*100;
        $cvr = CommonHelper::divisionOperate($installs, $impression)*100;
        $resultRate = CommonHelper::divisionOperate($resultValue, $impression);

        $sumReport[DBConstants::CAMPAIGN_REPORT_RESULT_VALUE] = $resultValue;
        $sumReport[DBConstants::CAMPAIGN_REPORT_REACH] = $reach;
        $sumReport[DBConstants::CAMPAIGN_REPORT_RESULT_COST] = round($costResult, ReportConstants::REPORT_SPEND_DECIMAL_PRECISION);
        $sumReport[DBConstants::CAMPAIGN_REPORT_SPENT] = $spend;
        $sumReport[DBConstants::CAMPAIGN_REPORT_IMPRESSIONS] = $impression;
        $sumReport[DBConstants::CAMPAIGN_REPORT_CLICKS] = $clicks;
        $sumReport[DBConstants::CAMPAIGN_REPORT_CPC] = round($cpc, ReportConstants::REPORT_SPEND_DECIMAL_PRECISION);
        $sumReport[DBConstants::CAMPAIGN_REPORT_CTR] = round($ctr, ReportConstants::REPORT_PERCENT_DECIMAL_PRECISION);
        $sumReport[DBConstants::CAMPAIGN_REPORT_RESULT_RATE] = round($resultRate, ReportConstants::REPORT_PERCENT_DECIMAL_PRECISION);
        $sumReport[DBConstants::CAMPAIGN_REPORT_CPM] = round($cpm, ReportConstants::REPORT_SPEND_DECIMAL_PRECISION);
        $sumReport[DBConstants::CAMPAIGN_REPORT_INSTALLS] = $installs;
        $sumReport[DBConstants::CAMPAIGN_REPORT_CPI] = round($cpi, ReportConstants::REPORT_SPEND_DECIMAL_PRECISION);
        $sumReport[DBConstants::CAMPAIGN_REPORT_CVR] = round($cvr, ReportConstants::REPORT_PERCENT_DECIMAL_PRECISION);

        return $sumReport;
    }

    private function extractCommonField(CampaignReportEntity $reportEntity)
    {
        $commonFields = array();
        $id = $reportEntity->getUuid();
        $campaignUid = $reportEntity->getCampaignUid();
        $campaignId = $reportEntity->getCampaignId();
        $configId = $reportEntity->getConfigId();
        $startTime = $reportEntity->getStartTime();
        $endTime = $reportEntity->getEndTime();
        $requestTime = $reportEntity->getRequestTime();
        $resultType = $reportEntity->getResultType();

        $commonFields[DBConstants::CAMPAIGN_REPORT_ID] = $id;
        $commonFields[DBConstants::CAMPAIGN_REPORT_CAMPAIGN_UID] = $campaignUid;
        $commonFields[DBConstants::CAMPAIGN_REPORT_CAMPAIGN_ID] = $campaignId;
        $commonFields[DBConstants::CAMPAIGN_REPORT_CONFIG_ID] = $configId;
        $commonFields[DBConstants::CAMPAIGN_REPORT_START_TIME] = $startTime;
        $commonFields[DBConstants::CAMPAIGN_REPORT_END_TIME] = $endTime;
        $commonFields[DBConstants::CAMPAIGN_REPORT_REQUEST_TIME] = $requestTime;
        $commonFields[DBConstants::CAMPAIGN_REPORT_RESULT_TYPE] = $resultType;

        return $commonFields;
    }

    private function categoryReportEntity()
    {
        foreach($this->campaignDbReports as $reportDbEntity)
        {
            $configId = $reportDbEntity->getConfigId();
            $campaignId = $reportDbEntity->getCampaignId();
            $this->validCampaignIds[] = $campaignId;

            if(array_key_exists($configId, $this->configId2CampaignReport))
            {
                $this->configId2CampaignReport[$configId][] = $reportDbEntity;
            }
            else
            {
                $dbEntityArray = array($reportDbEntity,);
                $this->configId2CampaignReport[$configId] = $dbEntityArray;
            }

        }
    }

}