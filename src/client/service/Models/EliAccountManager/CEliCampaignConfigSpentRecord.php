<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 9/19/16
 * Time: 5:06 PM
 */
class CEliCampaignConfigSpentRecord extends CBaseObject
{
    /*
     *  +-----------------------+---------------+------+-----+---------+-------+
        | Field                 | Type          | Null | Key | Default | Extra |
        +-----------------------+---------------+------+-----+---------+-------+
        | ID                    | varchar(40)   | NO   | PRI | NULL    |       |
        | ELI_CAMPAIGN_ID       | varchar(40)   | NO   |     | NULL    |       |
        | PUBLISHER_CAMPAIGN_ID | varchar(40)   | NO   |     | NULL    |       |
        | ELI_CONFIG_ID         | varchar(40)   | YES  |     | NULL    |       |
        | REPORT_START_TIME     | datetime      | YES  |     | NULL    |       |
        | REPORT_END_TIME       | datetime      | YES  |     | NULL    |       |
        | REQUEST_TIME          | datetime      | NO   |     | NULL    |       |
        | RESULT_VALUE          | int(11)       | YES  |     | 0       |       |
        | RESULT_TYPE           | varchar(64)   | YES  |     | NULL    |       |
        | REACH                 | int(11)       | YES  |     | 0       |       |
        | COST_PER_RESULT       | decimal(10,3) | YES  |     | 0.000   |       |
        | SPENT                 | decimal(10,2) | YES  |     | 0.00    |       |
        | IMPRESSIONS           | int(11)       | YES  |     | 0       |       |
        | CLICKS                | int(11)       | YES  |     | 0       |       |
        | CPC                   | decimal(10,3) | YES  |     | 0.000   |       |
        | CTR                   | decimal(10,2) | YES  |     | 0.00    |       |
        | RESULT_RATE           | decimal(10,2) | YES  |     | 0.00    |       |
        | CPM                   | decimal(10,3) | YES  |     | 0.000   |       |
        | INSTALLS              | int(11)       | YES  |     | 0       |       |
        | CPI                   | decimal(10,3) | YES  |     | 0.000   |       |
        | CVR                   | decimal(10,2) | YES  |     | 0.00    |       |
        +-----------------------+---------------+------+-----+---------+-------+
     */

    public static $TABLE_NAME = "T_ELI_CAMPAIGN_REPORT";
    public static $ID = "ID";
    public static $ELI_CAMPAIGN_ID = "ELI_CAMPAIGN_ID";
    public static $PUBLISHER_CAMPAIGN_ID = "PUBLISHER_CAMPAIGN_ID";
    public static $ELI_CONFIG_ID = "ELI_CONFIG_ID";
    public static $REPORT_START_TIME = "REPORT_START_TIME";
    public static $REPORT_END_TIME = "REPORT_END_TIME";
    public static $REQUEST_TIME = "REQUEST_TIME";
    public static $RESULT_VALUE = "RESULT_VALUE";
    public static $RESULT_TYPE = "RESULT_TYPE";
    public static $REACH = "REACH";
    public static $COST_PER_RESULT = "COST_PER_RESULT";
    public static $SPENT = "SPENT";
    public static $IMPRESSIONS = "IMPRESSIONS";
    public static $CLICKS = "CLICKS";
    public static $CPC = "CPC";
    public static $CTR = "CTR";
    public static $RESULT_RATE = "RESULT_RATE";
    public static $CPM = "CPM";
    public static $INSTALLS = "INSTALLS";
    public static $CPI = "CPI";
    public static $CVR = "CVR";

    /* after fields for google */
    public static $BOUNCE_RATE = "BOUNCE_RATE";
    public static $AVERAGE_PAGE_VIEWS = "AVERAGE_PAGE_VIEWS";
    public static $AVERAGE_POSITION = "AVERAGE_POSITION";
    public static $AVERAGE_TIME_ON_SITE = "AVERAGE_TIME_ON_SITE";

    public  static $WEEK = "WEEK";
    public  static $MONTH = "MONTH";
    public  static $YEAR = "YEAR";

    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliCampaignConfigSpentRecord";
        $this->TableName = self::$TABLE_NAME;
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function queryWeekSpentRecords($weekNumber, &$campaignConfigSpentRecords)
    {
        $querySql = $this->createQueryCampaignConfigWeekSpentRecordsSql();
        $dbParameters = array();
        $weekNumberParameter = new CDbParameter(self::$WEEK, $weekNumber, INTEGER);
        array_push($dbParameters, $weekNumberParameter);
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute load campaign publisher spent record for week <%s> failed.", $weekNumber));
            unset($recordRows);
            return $errorCode;
        }

        foreach ($recordRows as $recordRow)
        {
            array_push($campaignConfigSpentRecords, array_values($recordRow));
        }

        return OK;
    }

    private function createQueryCampaignConfigWeekSpentRecordsSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
        implode(",", array_keys($this->Fields)),
        sprintf(" %s WHERE (%s=?)",
            $this->TableName,
            self::$WEEK));
    }

    public function getCampaignConfigSpentRecords($eliCampaignConfigId, $startDate, $endDate, &$campaignConfigSpentRecords)
    {
        $querySql = $this->createQueryCampaignConfigSpentSql();
        $dbParameters = array();
        $eliCampaignConfigIdParameter = new CDbParameter(self::$ELI_CONFIG_ID, $eliCampaignConfigId, STRING);
        array_push($dbParameters, $eliCampaignConfigIdParameter);

        $startDateParameter = new CDbParameter(self::$REPORT_START_TIME, $startDate, STRING);
        array_push($dbParameters, $startDateParameter);

        $endDateParameter = new CDbParameter(self::$REPORT_START_TIME, $endDate, STRING);
        array_push($dbParameters, $endDateParameter);

        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute load campaign publisher spent record <%s> failed.", $eliCampaignConfigId));
            unset($recordRows);
            return $errorCode;
        }

        $resultFields = implode(",", array_keys($this->Fields));
        $records = array();
        foreach ($recordRows as $recordRow)
        {
            array_push($records, array_values($recordRow));
        }

        $campaignConfigSpentRecords[PARAMETER_ELI_FIELDS] = $resultFields;
        $campaignConfigSpentRecords[PARAMETER_ELI_RECORDS] = $records;

        unset($recordRows);
        return $errorCode;
    }

    public function getCampaignConfigAllSpentRecords($eliCampaignConfigId, &$eliCampaignSpentRecords, $startDate, $endDate)
    {
        $dbParameters = array();
        $eliCampaignConfigIdParameter = new CDbParameter(self::$ELI_CONFIG_ID, $eliCampaignConfigId, STRING);
        array_push($dbParameters, $eliCampaignConfigIdParameter);

        if($startDate && $endDate)
        {
            $querySql = $this->createQueryCampaignConfigSpentSql();
            $reportStartDateParameter = new CDbParameter(self::$REPORT_START_TIME, $startDate, STRING);
            array_push($dbParameters, $reportStartDateParameter);
            $reportEndDateParameter = new CDbParameter(self::$REPORT_START_TIME, $endDate, STRING);
            array_push($dbParameters, $reportEndDateParameter);
        }
        else
        {
            $querySql = $this->createQueryAllCampaignConfigSpentSql();
        }

        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute load campaign publisher spent record <%s> failed.", $eliCampaignConfigId));
            unset($recordRows);
            return $errorCode;
        }

        foreach ($recordRows as $recordRow)
        {
            array_push($eliCampaignSpentRecords, array_values($recordRow));
        }

        unset($recordRows);
        return $errorCode;
    }

    public function updateCampaignConfigSpent($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ELI_DATA,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP
        );

        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $campaignConfigDataDecode = base64_decode($parameters[PARAMETER_ELI_DATA]);
        if(!$campaignConfigDataDecode)
        {
            $result->setErrorCode(ERR_ELI_CAMPAIGN_CONFIG_SPENT_DATA_BASE64_DECODE_FAILED);
            $result->setMessage("Eli campaign config spent data base64 decode failed.");
            return $result;
        }

        $campaignConfigSpentData = json_decode($campaignConfigDataDecode);
        if(!$campaignConfigSpentData)
        {
            $result->setErrorCode(ERR_ELI_CAMPAIGN_CONFIG_SPENT_DATA_JSON_DECODE_FAILED);
            $result->setMessage("Eli campaign config spent data json decode failed.");
            return $result;
        }

        if(!property_exists($campaignConfigSpentData, PARAMETER_ELI_FIELDS))
        {
            $result->setErrorCode(ERR_ELI_CAMPAIGN_CONFIG_SPENT_RECORD_NOT_HAVE_PROPERTY_FIELDS);
            $result->setMessage("Eli campaign config spent record not have property 'FIELDS'.");
            return $result;
        }

        $recordFields = $campaignConfigSpentData->{PARAMETER_ELI_FIELDS};
        if(count($recordFields) == 0)
        {
            $result->setErrorCode(ERR_ELI_CAMPAIGN_CONFIG_SPENT_RECORD_PROPERTY_FIELDS_IS_ZERO);
            $result->setMessage("Eli campaign config spent record fields is 0.");
            return $result;
        }

        if(!property_exists($campaignConfigSpentData, PARAMETER_ELI_RECORDS))
        {
            $result->setErrorCode(ERR_ELI_CAMPAIGN_CONFIG_SPENT_RECORD_NOT_HAVE_PROPERTY_RECORDS);
            $result->setMessage("Eli campaign config spent record not have property 'RECORDS'.");
            return $result;
        }

        $records = $campaignConfigSpentData->{PARAMETER_ELI_RECORDS};
        if(count($records) == 0)
        {
            $result->setErrorCode(ERR_ELI_CAMPAIGN_CONFIG_SPENT_RECORDS_IS_EMPTY);
            $result->setMessage("Eli campaign config spent records is empty.");
            return $result;
        }

        $isAllSuccess = true;
        $week = date('W');
        $month = date('n');
        $year = date('Y');

        array_push($recordFields, self::$WEEK);
        array_push($recordFields, self::$MONTH);
        array_push($recordFields, self::$YEAR);

        $totalRecordNumber = 0;
        $this->DbMySqlInterface->closeAutoCommit();
        $this->DbMySqlInterface->beginTransaction();
        foreach ($records as $spentRecord)
        {
            $changedRecordNumber = 0;

            array_push($spentRecord, $week);
            array_push($spentRecord, $month);
            array_push($spentRecord, $year);

            $errorCode = $this->updateEliPublisherCampaignSpent($spentRecord, $recordFields, $changedRecordNumber);
            if($errorCode != OK)
            {
                $isAllSuccess = false;
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("Update publisher spent record <%s> failed, error code<%d>.", implode(">,<", $spentRecord), $result->getErrorCode()));
            }

            $totalRecordNumber += $changedRecordNumber;
        }

        if ($isAllSuccess)
        {
            $this->DbMySqlInterface->commit();
            $result->setErrorCode(OK);
            $result->addResultField(PARAMETER_ELI_RECORDS_NUMBER, $totalRecordNumber);
            $this->Log->writeLog(Debug, __FILE__, __FUNCTION__, __LINE__, "Update eli campaign config spent success.");
        }
        else
        {
            $this->DbMySqlInterface->rollback();
            $result->addResultField(PARAMETER_ELI_RECORDS_NUMBER, $totalRecordNumber);
            $result->setErrorCode(ERR_ELI_UPDATE_PUBLISHER_SPENT_RECORD_DATA_FAILED);
            $result->setMessage(sprintf("Update eli publisher campaign failed, error code<%d>.", $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        }

        $this->DbMySqlInterface->openAutoCommit();

        return $result;
    }

    private  function updateEliPublisherCampaignSpent($eliSpentRecord, $fields, &$changedRecordNumber)
    {
        foreach ($fields as $index=>$field)
        {
            $setResult = $this->setFieldValue($field, $eliSpentRecord[$index]);
            if(!$setResult)
            {
                $this->Log->writeLog(Warning, __FILE__, __FUNCTION__, __LINE__, sprintf("Field <%s> not in table <%s>.", $field, $this->TableName));
            }
        }

        return $this->replaceIntoRecord($changedRecordNumber);
    }

    private  function createQueryCampaignConfigSpentSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?) AND ((%s >= ?) AND (%s<?))",
                $this->TableName,
                self::$ELI_CONFIG_ID,
                self::$REPORT_START_TIME,
                self::$REPORT_START_TIME));
    }

    private function createQueryAllCampaignConfigSpentSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?)",
                $this->TableName,
                self::$ELI_CONFIG_ID));
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$ELI_CAMPAIGN_ID, STRING, "");
        $this->addField(self::$PUBLISHER_CAMPAIGN_ID, STRING, "");
        $this->addField(self::$ELI_CONFIG_ID, STRING, "");
        $this->addField(self::$REPORT_START_TIME, STRING, date('Y-m-d'));
        $this->addField(self::$REPORT_END_TIME, STRING, date('Y-m-d'));
        $this->addField(self::$REQUEST_TIME, STRING, date('Y-m-d'));
        $this->addField(self::$RESULT_VALUE, INTEGER, 0);
        $this->addField(self::$RESULT_TYPE, STRING, "");
        $this->addField(self::$REACH, INTEGER, 0);
        $this->addField(self::$COST_PER_RESULT, DOUBLE, 0.0);
        $this->addField(self::$IMPRESSIONS, INTEGER, 0);
        $this->addField(self::$CLICKS, INTEGER, 0);
        $this->addField(self::$CPC, DOUBLE, 0.0);
        $this->addField(self::$CTR, DOUBLE, 0.0);
        $this->addField(self::$RESULT_RATE, DOUBLE, 0.0);
        $this->addField(self::$CPM, DOUBLE, 0.0);
        $this->addField(self::$CPI, DOUBLE, 0.0);
        $this->addField(self::$CVR, DOUBLE, 0.0);
        $this->addField(self::$SPENT, DOUBLE, 0.0);
        $this->addField(self::$INSTALLS, INTEGER, 0);
        $this->addField(self::$BOUNCE_RATE, DOUBLE, 0.0);
        $this->addField(self::$AVERAGE_PAGE_VIEWS, DOUBLE, 0.0);
        $this->addField(self::$AVERAGE_POSITION, DOUBLE, 0.0);
        $this->addField(self::$AVERAGE_TIME_ON_SITE, DOUBLE, 0.0);
    }
}