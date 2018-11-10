<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 11:24
 */
class CEliIndustry extends CBaseObject
{
    /*
     *  +-------------+--------------+------+-----+---------+-------+
        | Field       | Type         | Null | Key | Default | Extra |
        +-------------+--------------+------+-----+---------+-------+
        | ID          | varchar(40)  | NO   | PRI | NULL    |       |
        | NAME        | varchar(64)  | NO   | UNI | NULL    |       |
        | DESCRIPTION | varchar(128) | YES  |     | NULL    |       |
        | PARENT      | varchar(40)  | YES  |     | NULL    |       |
        +-------------+--------------+------+-----+---------+-------+
     */
    private static $TABLE_NAME = "T_ELI_INDUSTRY";
    private static $ID = "ID";
    private static $NAME = "NAME";
    private static $PARENT = "PARENT";
    private static $DESCRIPTION = "DESCRIPTION";

    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliIndustry";
        $this->TableName = self::$TABLE_NAME;
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function getIndustryList(&$industryList)
    {
        $querySql = sprintf($this->SELECT_QUERY_TEMPLATE, implode(",", array_keys($this->Fields)), $this->TableName);

        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, array(), $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        foreach($recordRows as $recordRow)
        {
            array_push($industryList, array_values($recordRow));
        }

        return $errorCode;
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$NAME, STRING, "");
        $this->addField(self::$PARENT, STRING, "");
        $this->addField(self::$DESCRIPTION, STRING, "");
    }
}