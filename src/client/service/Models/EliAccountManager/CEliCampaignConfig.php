<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 11:14
 */
class CEliCampaignConfig extends CBaseObject
{

    /*
     *  +-----------------------+---------------+------+-----+---------+-------+
        | Field                 | Type          | Null | Key | Default | Extra |
        +-----------------------+---------------+------+-----+---------+-------+
        | ID                    | varchar(40)   | NO   | PRI | NULL    |       |
        | ELI_PUBLISHER_ID      | varchar(40)   | NO   |     | NULL    |       |
        | ELI_CAMPAIGN_ID       | varchar(40)   | NO   | MUL | NULL    |       |
        | PUBLISHER_CAMPAIGN_ID | varchar(40)   | YES  |     | NULL    |       |
        | NAME                  | varchar(64)   | NO   |     | NULL    |       |
        | DESCRIPTION           | varchar(128)  | YES  |     | NULL    |       |
        | BUDGET                | decimal(12,2) | YES  |     | NULL    |       |
        | SPENT                 | decimal(12,2) | YES  |     | NULL    |       |
        | STATUS                | int(11)       | YES  |     | NULL    |       |
        | CREATE_TIME           | datetime      | YES  |     | NULL    |       |
        | LAST_MODIFY_TIME      | datetime      | YES  |     | NULL    |       |
        +-----------------------+---------------+------+-----+---------+-------+
     */

    private static $TABLE_NAME = "T_ELI_CAMPAIGN_CONFIG";
    public static $ID = "ID";
    private static $ELI_CAMPAIGN_ID = "ELI_CAMPAIGN_ID";
    private static $ELI_PUBLISHER_ID = "ELI_PUBLISHER_ID";
    private static $BUDGET = "BUDGET";
    private static $SPENT = "SPENT";
    private static $SCHEDULE_LIST = "SCHEDULE_LIST";
    private static $STATUS = "STATUS";
    private static $CREATE_TIME = "CREATE_TIME";
    private static $LAST_MODIFY_TIME = "LAST_MODIFY_TIME";

    private $EliPublisher = null;
    private $EliCampaignConfigSpentRecord = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliPublisherCampaign";
        $this->TableName = self::$TABLE_NAME;
        $this->EliPublisher = new CEliPublisher($config, $log, $dbInterface);
        $this->EliCampaignConfigSpentRecord = new CEliCampaignConfigSpentRecord($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function getPublisherCampaignSpentRecords($startDate, $endDate, $publisherCampaignSpentRecordList)
    {
        return $this->EliCampaignConfigSpentRecord->getCampaignConfigSpentRecords($this->Field[self::$ID]->Value,$startDate, $endDate, $publisherCampaignSpentRecordList);
    }

    public function getEliCampaignConfigList($eliCampaignId, &$eliCampaignConfigList, $startDate, $endDate)
    {
        $dbParameters = array();
        $eliCampaignIdParameter = new CDbParameter(self::$ELI_CAMPAIGN_ID, $eliCampaignId, STRING);
        array_push($dbParameters, $eliCampaignIdParameter);

        $querySql = $this->createGetEliCampaignConfigListSql();
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        foreach($recordRows as $recordRow)
        {
            $publisherName = "";
            $eliCampaignConfigId = $recordRow[self::$ID];
            $eliCampaignSpentRecords = array();
            $this->EliCampaignConfigSpentRecord->getCampaignConfigAllSpentRecords($eliCampaignConfigId, $eliCampaignSpentRecords,$startDate, $endDate);

            $eliCampaignConfig = array_values($recordRow);
            $this->EliPublisher->getPublisherName($recordRow[self::$ELI_PUBLISHER_ID], $publisherName);
            array_push($eliCampaignConfig, $publisherName);
            array_push($eliCampaignConfig, $eliCampaignSpentRecords);

            array_push($eliCampaignConfigList, $eliCampaignConfig);
        }

        return $errorCode;
    }

    public function getEliCampaignConfigs($eliCampaignId, &$eliCampaignConfigData)
    {

        $dbParameters = array();
        $eliCampaignIdParameter = new CDbParameter(self::$ELI_CAMPAIGN_ID, $eliCampaignId, STRING);
        array_push($dbParameters, $eliCampaignIdParameter);

        $querySql = $this->createGetEliCampaignConfigListSql();
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        $fields = $this->getFieldNames();
        foreach($recordRows as $recordRow)
        {
            $eliCampaignConfig = array();
            foreach ($fields as $fieldName)
            {
                $eliCampaignConfig[$fieldName] = $recordRow[$fieldName];
            }

            array_push($eliCampaignConfigData, $eliCampaignConfig);
        }

        return $errorCode;
    }

    public function createEliPublisherCampaign($eliCampaignId, $eliPublisherId, $budget, $spent, $scheduleList)
    {
        $eliCampaignConfigId = CPublic::getGuid();
        $this->setFieldValue(self::$ID, $eliCampaignConfigId);
        $this->setFieldValue(self::$ELI_CAMPAIGN_ID, $eliCampaignId);
        $this->setFieldValue(self::$ELI_PUBLISHER_ID, $eliPublisherId);
        $this->setFieldValue(self::$BUDGET, $budget);
        $this->setFieldValue(self::$SPENT, $spent);
        $this->setPrimaryKey(self::$SCHEDULE_LIST, json_encode($scheduleList));
        $this->setFieldValue(self::$STATUS, 0);
        $this->setFieldValue(self::$CREATE_TIME, date('Y-m-d H:i:s'));
        $this->setFieldValue(self::$LAST_MODIFY_TIME, date('Y-m-d H:i:s'));

        $recordNumber = 0;
        return $this->addRecord($recordNumber);
    }

    private  function createGetEliCampaignConfigListSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?)",
                $this->TableName,
                self::$ELI_CAMPAIGN_ID));
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
        $this->addField(self::$ELI_PUBLISHER_ID, STRING, "");
        $this->addField(self::$BUDGET, INTEGER, -1);
        $this->addField(self::$SPENT, INTEGER, 0);
        $this->addField(self::$SCHEDULE_LIST, STRING, "[]");
        $this->addField(self::$STATUS, INTEGER, 0);
        $this->addField(self::$CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$LAST_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }
}