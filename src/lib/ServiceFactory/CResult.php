<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 5/18/15
 * Time: 5:21 PM
 */

class CResult {
    public static $ERROR_CODE="errorCode";
    private static $MESSAGE = "message";
    public static $DATA = "data";
    private static $PAGE_SIZE = "pageSize";
    private static $PAGE_INDEX = "pageIndex";
    private static $RECORD_NUMBER = "recordNumber";
    public static $RESULT_TYPE = "resultType";
    private static $RESULT_RECORDS = "records";
    private $_ItemTable = null;

    public function  __construct()
    {
        $this->_ItemTable = array();
        $this->initBaseProperties();
    }

    public function __destruct()
    {
        unset($_ItemTable);
        unset($this);
    }

    public function setPageSize($pageSize)
    {
        $this->_ItemTable[CResult::$PAGE_SIZE] = $pageSize;
    }

    public function getPageSize()
    {
        return $this->_ItemTable[CResult::$PAGE_SIZE];
    }

    public function setPageIndex($pageIndex)
    {
        $this->_ItemTable[CResult::$PAGE_INDEX] = $pageIndex;
    }

    public function getPageIndex()
    {
        return $this->_ItemTable[CResult::$PAGE_INDEX];
    }

    public function setRecordNumber($recordNumber)
    {
        $this->_ItemTable[CResult::$RECORD_NUMBER] = $recordNumber;
    }

    public function getRecordNumber()
    {
        return $this->_ItemTable[CResult::$RECORD_NUMBER];
    }

    public function setErrorCode($errorCode)
    {
        $this->_ItemTable[CResult::$ERROR_CODE] = $errorCode;
    }

    public function getErrorCode()
    {
        return $this->_ItemTable[CResult::$ERROR_CODE];
    }

    public function setMessage($message)
    {
        $this->_ItemTable[CResult::$MESSAGE] = $message;
    }

    public function getMessage()
    {
        return $this->_ItemTable[CResult::$MESSAGE];
    }

    public function setData($data)
    {
        $this->_ItemTable[CResult::$DATA] = $data;
    }

    public function getData()
    {
        return $this->_ItemTable[CResult::$DATA];
    }

    public function addResultField($fieldName, $fieldValue)
    {
        $this->_ItemTable[$fieldName] = $fieldValue;
    }

    public function setDataByType($data, $type, $pageIndex, $pageSize, $recordNumber)
    {
        $this->_ItemTable[CResult::$DATA][$type][CResult::$RESULT_TYPE] = $type;
        $this->_ItemTable[CResult::$DATA][$type][CResult::$PAGE_INDEX] = $pageIndex;
        $this->_ItemTable[CResult::$DATA][$type][CResult::$PAGE_SIZE] = $pageSize;
        $this->_ItemTable[CResult::$DATA][$type][CResult::$RECORD_NUMBER] = $recordNumber;
        $this->_ItemTable[CResult::$DATA][$type][CResult::$RESULT_RECORDS] = $data;
    }

    private function initBaseProperties()
    {
        $this->_ItemTable[CResult::$ERROR_CODE] = ERROR;
        $this->_ItemTable[CResult::$DATA] = array();
        $this->_ItemTable[CResult::$MESSAGE] = "";
    }

    public function getValue()
    {
        return $this->_ItemTable;
    }
}