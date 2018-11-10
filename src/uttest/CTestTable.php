<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-08-12
 * Time: 10:33
 */
class CTestTable extends CBaseObject
{
    public static $TABLE_NAME = "T_TEST_TABLE"; //?????
    private static $TABLE_SCRIPT = "CREATE TABLE IF NOT EXISTS T_TEST_TABLE( ID VARCHAR(40) NOT NULL, NAME VARCHAR (64) NOT NULL, PRIMARY KEY (ID));";
    public static $ID = "ID";//??
    public static $NAME = "NAME";//??

    public function  __construct($config, $log)
    {
        $this->_ClassName = "CTestTable";
        $this->TableName = self::$TABLE_NAME;
        parent::__construct($config, $log);
        $this->checkTable();
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    private function checkTable()
    {
        $isTableExist = false;
        $recordNumber = 0;
        $errorCode = $this->DbMySqlInterface->checkTableExists(self::$TABLE_NAME,$isTableExist);
        if($errorCode == OK)
        {
            if(!$isTableExist)
            {
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("Table <%s> not exist.", self::$TABLE_NAME));
                $errorCode = $this->DbMySqlInterface->queryRecords(self::$TABLE_SCRIPT, array(), $recordNumber);
                if($errorCode == OK)
                {
                    $this->Log->writeLog(Debug, __FILE__, __FUNCTION__, __LINE__,
                        sprintf("Create table <%s> success.", self::$TABLE_NAME));
                }
                else
                {
                    $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                        sprintf("Create table <%s> failed, error code <%d>.", self::$TABLE_NAME, $errorCode));
                }
            }
            else
            {
                $this->Log->writeLog(Debug, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("Table <%s> exist.", self::$TABLE_NAME));
            }
        }
        else
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                sprintf("Call check table <%s> function failed.", self::$TABLE_NAME));
        }

        return;
    }

    protected function initTableFields()
    {
        $this->addField(self::$ID, "", STRING);
        $this->addField(self::$NAME, "",STRING);
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }
}