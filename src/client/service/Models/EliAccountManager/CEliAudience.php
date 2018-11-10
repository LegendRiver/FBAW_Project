<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 10:57
 */
class CEliAudience extends CBaseObject
{
    /*
     *  +--------------------+-------------+------+-----+---------+-------+
        | Field              | Type        | Null | Key | Default | Extra |
        +--------------------+-------------+------+-----+---------+-------+
        | PUBLISHER_OWNER_ID | varchar(40) | NO   |     | NULL    |       |
        | ID                 | varchar(40) | NO   | PRI | NULL    |       |
        | NAME               | varchar(64) | NO   |     | NULL    |       |
        | PARENT_ID          | varchar(40) | YES  |     | NULL    |       |
        | TYPE               | int(11)     | YES  |     | NULL    |       |
        | ORDER_VALUE        | int(11)     | NO   |     | 100     |       |
        | SIMPLY_NAME        | varchar(64) | YES  |     | NULL    |       |
        | CNAME              | varchar(64) | YES  |     | NULL    |       |
        +--------------------+-------------+------+-----+---------+-------+
     */

    private static $TABLE_NAME = "T_ELI_AUDIENCE";
    private static $PUBLISHER_OWNER_ID = "PUBLISHER_OWNER_ID";
    private static $ID = "ID";
    private static $NAME = "NAME";
    private static $PARENT_ID = "PARENT_ID";
    private static $TYPE = "TYPE";
    private static $ORDER_VALUE = "ORDER_VALUE";
    private static $SIMPLY_NAME = "SIMPLY_NAME";
    private static $CNAME = "CNAME";

    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliAudience";
        $this->TableName = self::$TABLE_NAME;
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public  function getCountryListByIds($countryIds, &$countryList)
    {
        $dbParameters = array();

        $idsParameter = sprintf("'%s'", implode("','", $countryIds));
        $querySql = $this->createQueryCountryAudienceSql($idsParameter);
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        foreach($recordRows as $audienceRow)
        {
            array_push($countryList, array_values($audienceRow));
        }

        return $errorCode;
    }

    private function createQueryCountryAudienceSql($idsParameter)
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            sprintf("%s,%s", self::$NAME, self::$SIMPLY_NAME),
            sprintf(" %s WHERE (%s IN (%s))",
                $this->TableName,
                self::$ID,
                $idsParameter));
    }

    public function getPublicAudience(&$audienceList)
    {
        $publisherOwnerId = 'NULL';
        $dbParameters = array();
        $publisherOwnerIdParameter = new CDbParameter(self::$PUBLISHER_OWNER_ID, $publisherOwnerId, STRING);
        array_push($dbParameters, $publisherOwnerIdParameter);
        $querySql = $this->createQueryPublicAudience();
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        $audienceList[PARAMETER_ELI_FIELDS] = array_keys($this->Fields);
        $audienceList[PARAMETER_ELI_RECORDS] = array();
        foreach($recordRows as $audienceRow)
        {
            array_push($audienceList[PARAMETER_ELI_RECORDS], array_values($audienceRow));
        }

        $audienceList[PARAMETER_ELI_RECORDS_NUMBER] = count($audienceList[PARAMETER_ELI_RECORDS]);
        return $errorCode;
    }

    public function getAudienceListByType($publisherOwnerId, $audienceType, &$audienceList)
    {
        $dbParameters = array();
        $publisherOwnerIdParameter = new CDbParameter(self::$PUBLISHER_OWNER_ID, $publisherOwnerId, STRING);
        array_push($dbParameters, $publisherOwnerIdParameter);

        $typeParameter = new CDbParameter(self::$TYPE, $audienceType, INTEGER);
        array_push($dbParameters, $typeParameter);

        $querySql = $this->createGetAudienceListByTypeSql();
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        $audienceList[PARAMETER_ELI_FIELDS] = array_keys($this->Fields);
        $audienceList[PARAMETER_ELI_RECORDS] = array();
        foreach($recordRows as $audienceRow)
        {
            array_push($audienceList[PARAMETER_ELI_RECORDS], array_values($audienceRow));
        }

        return $errorCode;
    }

    public function getAudienceList($publisherOwnerId, &$audienceList)
    {
        $dbParameters = array();
        $publisherOwnerIdParameter = new CDbParameter(self::$PUBLISHER_OWNER_ID, $publisherOwnerId, STRING);
        array_push($dbParameters, $publisherOwnerIdParameter);

        $querySql = $this->createGetAudienceListSql();
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        $audienceList[PARAMETER_ELI_FIELDS] = array_keys($this->Fields);
        $audienceList[PARAMETER_ELI_RECORDS] = array();
        foreach($recordRows as $audienceRow)
        {
            array_push($audienceList[PARAMETER_ELI_RECORDS], array_values($audienceRow));
        }

        return $errorCode;
    }

    private  function createGetAudienceListSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?)", $this->TableName, self::$PUBLISHER_OWNER_ID));
    }

    private function createQueryPublicAudience()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?)",
                $this->TableName,
                self::$PUBLISHER_OWNER_ID));
    }

    private  function createGetAudienceListByTypeSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?) AND (%s=?)",
                $this->TableName,
                self::$PUBLISHER_OWNER_ID,
                self::$TYPE));
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
        $this->addField(self::$PUBLISHER_OWNER_ID, STRING, "");
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$NAME, STRING, "");
        $this->addField(self::$PARENT_ID, STRING, "");
        $this->addField(self::$TYPE, INTEGER, AUDIENCE_TYPE_UNKNOWN);
        $this->addField(self::$ORDER_VALUE, INTEGER, 100);
        $this->addField(self::$SIMPLY_NAME, STRING, "");
        $this->addField(self::$CNAME, STRING, "");
    }
}