<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 10:24
 */
class CEliPublisher extends CBaseObject
{
    /*
     *  +-----------------------+--------------+------+-----+---------+-------+
        | Field                 | Type         | Null | Key | Default | Extra |
        +-----------------------+--------------+------+-----+---------+-------+
        | ELI_PUBLISHER_OWNER_ID | varchar(40)  | NO   | MUL | NULL    |       |
        | ID                    | varchar(40)  | NO   | PRI | NULL    |       |
        | NAME                  | varchar(64)  | NO   | UNI | NULL    |       |
        | DESCRIPTION           | varchar(256) | YES  |     | NULL    |       |
        | APPLICATION_ID        | varchar(40)  | NO   |     | NULL    |       |
        +-----------------------+--------------+------+-----+---------+-------+
     */
    private static $TABLE_NAME = "T_ELI_PUBLISHER";
    private static $ELI_PUBLISHER_OWNER_ID = "ELI_PUBLISHER_OWNER_ID";
    private static $ID = "ID";
    private static $NAME = "NAME";
    private static $DESCRIPTION = "DESCRIPTION";
    private static $APPLICATION_ID = "APPLICATION_ID";


    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliPublisher";
        $this->TableName = self::$TABLE_NAME;
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function getPublisherList($publisherOwnerId, &$publisherList)
    {
        $dbParameters = array();
        $publisherOwnerIdParameter = new CDbParameter(self::$ELI_PUBLISHER_OWNER_ID, $publisherOwnerId, STRING);
        array_push($dbParameters, $publisherOwnerIdParameter);

        $querySql = $this->createGetPublisherListSql();
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        foreach($recordRows as $publisherRow)
        {
            array_push($publisherList, array_values($publisherRow));
        }

        return $errorCode;
    }

    public function getPublisherName($publisherId, &$publisherName)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $publisherId);
        $errorCode = $this->load();
        if($errorCode == OK)
        {
            $publisherName = $this->Fields[self::$NAME]->Value;
        }

        return $errorCode;
    }

    private  function createGetPublisherListSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?)",
                $this->TableName,
                self::$ELI_PUBLISHER_OWNER_ID));
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
        $this->addField(self::$ELI_PUBLISHER_OWNER_ID, STRING, "");
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$NAME, STRING, "");
        $this->addField(self::$DESCRIPTION, STRING, "");
        $this->addField(self::$APPLICATION_ID, STRING, "");
    }
}