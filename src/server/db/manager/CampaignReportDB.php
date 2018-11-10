<?php


class CampaignReportDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::CAMPAIGN_REPORT_TABLE_NAME;
        parent::__construct();
    }

    public function addCampaignReportRecord(CampaignReportEntity $reportEntity)
    {
        try
        {
            $this->initDBField($reportEntity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert Fb Campaign Report <%s> failed, error code<%d>.", $reportEntity->getCampaignId(), $errorCode);
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
        $this->dbEntityInstance = new CampaignReportEntity();

        $this->field2FunctinName = array(
            DBConstants::CAMPAIGN_REPORT_ID => 'setUuid',
            DBConstants::CAMPAIGN_REPORT_CAMPAIGN_UID => 'setCampaignUid',
            DBConstants::CAMPAIGN_REPORT_CAMPAIGN_ID => 'setCampaignId',
            DBConstants::CAMPAIGN_REPORT_CONFIG_ID => 'setConfigId',
            DBConstants::CAMPAIGN_REPORT_START_TIME => 'setStartTime',
            DBConstants::CAMPAIGN_REPORT_END_TIME => 'setEndTime',
            DBConstants::CAMPAIGN_REPORT_REQUEST_TIME => 'setRequestTime',
            DBConstants::CAMPAIGN_REPORT_RESULT_VALUE => 'setResultValue',
            DBConstants::CAMPAIGN_REPORT_RESULT_TYPE => 'setResultType',
            DBConstants::CAMPAIGN_REPORT_REACH => 'setReach',
            DBConstants::CAMPAIGN_REPORT_RESULT_COST => 'setCostPerResult',
            DBConstants::CAMPAIGN_REPORT_SPENT => 'setSpend',
            DBConstants::CAMPAIGN_REPORT_IMPRESSIONS => 'setImpression',
            DBConstants::CAMPAIGN_REPORT_CLICKS => 'setClick',
            DBConstants::CAMPAIGN_REPORT_CPC => 'setCpc',
            DBConstants::CAMPAIGN_REPORT_CTR => 'setCtr',
            DBConstants::CAMPAIGN_REPORT_RESULT_RATE => 'setResultRate',
            DBConstants::CAMPAIGN_REPORT_CPM => 'setCpm',
            DBConstants::CAMPAIGN_REPORT_INSTALLS => 'setInstalls',
            DBConstants::CAMPAIGN_REPORT_CPI => 'setCpi',
            DBConstants::CAMPAIGN_REPORT_CVR => 'setCvr',
        );
    }

    private function initDBField(CampaignReportEntity $reportEntity)
    {
        $uuid = $reportEntity->getUuid();
        $camUid = $reportEntity->getCampaignUid();
        $camId = $reportEntity->getCampaignId();
        $configId = $reportEntity->getConfigId();
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

        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_ID, $uuid);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CAMPAIGN_UID, $camUid);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CAMPAIGN_ID, $camId);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CONFIG_ID, $configId);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_START_TIME, $startTime);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_END_TIME, $endTime);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_REQUEST_TIME, $requestTime);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_RESULT_VALUE, $resultValue);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_RESULT_TYPE, $resultType);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_REACH, $reach);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_RESULT_COST, $resultCost);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_SPENT, $spend);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_IMPRESSIONS, $impression);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CLICKS, $click);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CPC, $cpc);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CTR, $ctr);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_RESULT_RATE, $resultRate);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CPM, $cpm);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_INSTALLS, $installs);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CPI, $cpi);
        $this->setFieldValue(DBConstants::CAMPAIGN_REPORT_CVR, $cvr);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::CAMPAIGN_REPORT_ID, STRING, "");
        $this->addField(DBConstants::CAMPAIGN_REPORT_CAMPAIGN_UID, STRING, "");
        $this->addField(DBConstants::CAMPAIGN_REPORT_CAMPAIGN_ID, STRING, "");
        $this->addField(DBConstants::CAMPAIGN_REPORT_CONFIG_ID, STRING, "");
        $this->addField(DBConstants::CAMPAIGN_REPORT_START_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::CAMPAIGN_REPORT_END_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::CAMPAIGN_REPORT_REQUEST_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::CAMPAIGN_REPORT_RESULT_VALUE, INTEGER, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_RESULT_TYPE, STRING, "");
        $this->addField(DBConstants::CAMPAIGN_REPORT_REACH, INTEGER, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_RESULT_COST, DOUBLE, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_SPENT, DOUBLE, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_IMPRESSIONS, INTEGER, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_CLICKS, INTEGER, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_CPC, DOUBLE, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_CTR, DOUBLE, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_RESULT_RATE, DOUBLE, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_CPM, DOUBLE, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_INSTALLS, INTEGER, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_CPI, DOUBLE, 0);
        $this->addField(DBConstants::CAMPAIGN_REPORT_CVR, DOUBLE, 0);
    }
}