<?php


class AdReportDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::AD_REPORT_TABLE_NAME;
        parent::__construct();
    }

    public function addAdReportRecord(AdReportEntity $reportEntity)
    {
        try
        {
            $this->initDBField($reportEntity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert Fb AD Report <%s> failed, error code<%d>.", $reportEntity->getAdId(), $errorCode);
                ServerLogger::instance()->writeLog(Error, $message);
                return $errorCode;
            }

            return OK;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return ERR_SERVER_DB_EXCEPTION;
        }
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new AdReportEntity();

        $this->field2FunctinName = array(
            DBConstants::AD_REPORT_ID => 'setUuid',
            DBConstants::AD_REPORT_CAMPAIGN_UID => 'setCampaignUid',
            DBConstants::AD_REPORT_ADSET_UID => 'setAdsetUid',
            DBConstants::AD_REPORT_AD_UID => 'setAdUid',
            DBConstants::AD_REPORT_CAMPAIGN_ID => 'setCampaignId',
            DBConstants::AD_REPORT_ADSET_ID => 'setAdsetId',
            DBConstants::AD_REPORT_AD_ID => 'setAdId',
            DBConstants::AD_REPORT_START_TIME => 'setStartTime',
            DBConstants::AD_REPORT_END_TIME => 'setEndTime',
            DBConstants::AD_REPORT_REQUEST_TIME => 'setRequestTime',
            DBConstants::AD_REPORT_RESULT_VALUE => 'setResultValue',
            DBConstants::AD_REPORT_RESULT_TYPE => 'setResultType',
            DBConstants::AD_REPORT_REACH => 'setReach',
            DBConstants::AD_REPORT_RESULT_COST => 'setCostPerResult',
            DBConstants::AD_REPORT_SPENT => 'setSpend',
            DBConstants::AD_REPORT_IMPRESSIONS => 'setImpression',
            DBConstants::AD_REPORT_CLICKS => 'setClick',
            DBConstants::AD_REPORT_CPC => 'setCpc',
            DBConstants::AD_REPORT_CTR => 'setCtr',
            DBConstants::AD_REPORT_RESULT_RATE => 'setResultRate',
            DBConstants::AD_REPORT_CPM => 'setCpm',
            DBConstants::AD_REPORT_INSTALLS => 'setInstalls',
            DBConstants::AD_REPORT_CPI => 'setCpi',
            DBConstants::AD_REPORT_CVR => 'setCvr',
        );
    }

    private function initDBField(AdReportEntity $reportEntity)
    {
        $uuid = $reportEntity->getUuid();
        $camUid = $reportEntity->getCampaignUid();
        $adsetUid = $reportEntity->getAdsetUid();
        $adUid = $reportEntity->getAdUid();
        $camId = $reportEntity->getCampaignId();
        $adsetId = $reportEntity->getAdsetId();
        $adId = $reportEntity->getAdId();
        $startTime = $reportEntity->getStartTime();
        $endTime = $reportEntity->getEndTime();
        $requestTime = $reportEntity->getRequestTime();
        $resultValue = $reportEntity->getResultValue();
        $resultType = $reportEntity->getResultType();
        $resultCost = $reportEntity->getCostPerResult();
        $reach = $reportEntity->getReach();
        $spend = $reportEntity->getSpend();
        $impression = $reportEntity->getImpression();
        $click = $reportEntity->getClick();
        $cpc = $reportEntity->getCpc();
        $ctr = $reportEntity->getCtr();
        $resultRate = $reportEntity->getResultRate();
        $cpm = $reportEntity->getCpm();
        $installs = $reportEntity->getInstalls();
        $cpi = $reportEntity->getCpi();
        $cvr = $reportEntity->getCvr();

        $this->setFieldValue(DBConstants::AD_REPORT_ID, $uuid);
        $this->setFieldValue(DBConstants::AD_REPORT_CAMPAIGN_UID, $camUid);
        $this->setFieldValue(DBConstants::AD_REPORT_ADSET_UID, $adsetUid);
        $this->setFieldValue(DBConstants::AD_REPORT_AD_UID, $adUid);
        $this->setFieldValue(DBConstants::AD_REPORT_CAMPAIGN_ID, $camId);
        $this->setFieldValue(DBConstants::AD_REPORT_ADSET_ID, $adsetId);
        $this->setFieldValue(DBConstants::AD_REPORT_AD_ID, $adId);
        $this->setFieldValue(DBConstants::AD_REPORT_START_TIME, $startTime);
        $this->setFieldValue(DBConstants::AD_REPORT_END_TIME, $endTime);
        $this->setFieldValue(DBConstants::AD_REPORT_REQUEST_TIME, $requestTime);
        $this->setFieldValue(DBConstants::AD_REPORT_RESULT_VALUE, $resultValue);
        $this->setFieldValue(DBConstants::AD_REPORT_RESULT_TYPE, $resultType);
        $this->setFieldValue(DBConstants::AD_REPORT_REACH, $reach);
        $this->setFieldValue(DBConstants::AD_REPORT_RESULT_COST, $resultCost);
        $this->setFieldValue(DBConstants::AD_REPORT_SPENT, $spend);
        $this->setFieldValue(DBConstants::AD_REPORT_IMPRESSIONS, $impression);
        $this->setFieldValue(DBConstants::AD_REPORT_CLICKS, $click);
        $this->setFieldValue(DBConstants::AD_REPORT_CPC, $cpc);
        $this->setFieldValue(DBConstants::AD_REPORT_CTR, $ctr);
        $this->setFieldValue(DBConstants::AD_REPORT_RESULT_RATE, $resultRate);
        $this->setFieldValue(DBConstants::AD_REPORT_CPM, $cpm);
        $this->setFieldValue(DBConstants::AD_REPORT_INSTALLS, $installs);
        $this->setFieldValue(DBConstants::AD_REPORT_CPI, $cpi);
        $this->setFieldValue(DBConstants::AD_REPORT_CVR, $cvr);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::AD_REPORT_ID, STRING, "");
        $this->addField(DBConstants::AD_REPORT_CAMPAIGN_UID, STRING, "");
        $this->addField(DBConstants::AD_REPORT_ADSET_UID, STRING, "");
        $this->addField(DBConstants::AD_REPORT_AD_UID, STRING, "");
        $this->addField(DBConstants::AD_REPORT_CAMPAIGN_ID, STRING, "");
        $this->addField(DBConstants::AD_REPORT_ADSET_ID, STRING, "");
        $this->addField(DBConstants::AD_REPORT_AD_ID, STRING, "");
        $this->addField(DBConstants::AD_REPORT_START_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::AD_REPORT_END_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::AD_REPORT_REQUEST_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::AD_REPORT_RESULT_VALUE, INTEGER, 0);
        $this->addField(DBConstants::AD_REPORT_RESULT_TYPE, STRING, "");
        $this->addField(DBConstants::AD_REPORT_REACH, INTEGER, 0);
        $this->addField(DBConstants::AD_REPORT_RESULT_COST, DOUBLE, 0);
        $this->addField(DBConstants::AD_REPORT_SPENT, DOUBLE, 0);
        $this->addField(DBConstants::AD_REPORT_IMPRESSIONS, INTEGER, 0);
        $this->addField(DBConstants::AD_REPORT_CLICKS, INTEGER, 0);
        $this->addField(DBConstants::AD_REPORT_CPC, DOUBLE, 0);
        $this->addField(DBConstants::AD_REPORT_CTR, DOUBLE, 0);
        $this->addField(DBConstants::AD_REPORT_RESULT_RATE, DOUBLE, 0);
        $this->addField(DBConstants::AD_REPORT_CPM, DOUBLE, 0);
        $this->addField(DBConstants::AD_REPORT_INSTALLS, INTEGER, 0);
        $this->addField(DBConstants::AD_REPORT_CPI, DOUBLE, 0);
        $this->addField(DBConstants::AD_REPORT_CVR, DOUBLE, 0);
    }
}