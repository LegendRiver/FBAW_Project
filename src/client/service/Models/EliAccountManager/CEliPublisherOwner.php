<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 10:49
 */
class CEliPublisherOwner extends  CBaseObject
{
    /*
     *
     *  +-------------+--------------+------+-----+---------+-------+
        | Field       | Type         | Null | Key | Default | Extra |
        +-------------+--------------+------+-----+---------+-------+
        | ID          | varchar(40)  | NO   | PRI | NULL    |       |
        | NAME        | varchar(128) | NO   | UNI | NULL    |       |
        | DESCRIPTION | varchar(128) | YES  |     | NULL    |       |
        +-------------+--------------+------+-----+---------+-------+

     */
    public static $TABLE_NAME = "T_ELI_PUBLISHER_OWNER";
    public static $ID = "ID";
    public static $NAME = "NAME";
    public static $DESCRIPTION = "DESCRIPTION";

    private $EliPublisher = null;
    private $EliAudience = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CCEliPublisherOwner";
        $this->TableName = self::$TABLE_NAME;
        $this->EliPublisher = new CEliPublisher($config, $log, $dbInterface);
        $this->EliAudience = new CEliAudience($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function getPublisherOwnerList(&$publisherOwnerList)
    {
        $querySql = sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s ORDER BY %s",
                $this->TableName,
                self::$NAME));

        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, array(), $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s> failed.", $querySql));
            return $errorCode;
        }

        foreach($recordRows as $publisherOwnerRow)
        {
            $publisherOwnerId = $publisherOwnerRow[self::$ID];
            $publisherOwner = array_values($publisherOwnerRow);

            $publisherList = array();
            $this->EliPublisher->getPublisherList($publisherOwnerId, $publisherList);
            array_push($publisherOwner, $publisherList);

            $audienceList = array();
            $this->EliAudience->getAudienceList($publisherOwnerId, $audienceList);
            array_push($publisherOwner, $audienceList);

            array_push($publisherOwnerList, $publisherOwner);
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
        $this->addField(self::$DESCRIPTION, STRING, "");
    }
}