<?php
abstract class CBaseObject
{
    protected $SELECT_QUERY_TEMPLATE = "SELECT %s FROM %s";
    protected $UPDATE_QUERY_TEMPLATE = "UPDATE %s SET %s WHERE %s";
    protected $DELETE_QUERY_TEMPLATE = "DELETE FROM %s WHERE %s";
    protected $INSERT_QUERY_TEMPLATE = "INSERT INTO %s(%s) VALUES(%s)";
    protected $REPLACE_INTO_QUERY_TEMPLATE = "REPLACE INTO %s(%s) VALUES(%s)";

    protected $PrimaryKeys = null;
    protected $Fields = null;
    protected $TableName = "";
    protected $DbMySqlInterface = null;

    protected $_ClassName = null;
    protected $_ResultFields = null;

    protected $Log = null;
    protected $Config = null;

    /**
     * construct for base object
     * @param $config
     * @param $log
     */
    protected  $AllowAccessFunctions = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->Config = $config;
        $this->Log = $log;
        $this->DbMySqlInterface = $dbInterface;
        $this->Fields = array();
        $this->AllowAccessFunctions = array();
        $this->PrimaryKeys = array();
        $this->_ResultFields = array();
        $this->initTableFields();
        $this->initResultFields();
    }

    public function __destruct()
    {
        unset($this);
    }

    public function getClassName()
    {
        return $this->_ClassName;
    }

    public function addAllowAccessFunction($functionName)
    {
        if(array_key_exists($functionName, $this->AllowAccessFunctions))
        {
            return false;
        }

        $this->AllowAccessFunctions[$functionName] = $functionName;
        return true;
    }

    public function addField($name, $type, $defaultValue)
    {
        if(array_key_exists($name, $this->Fields))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Field <%s> exist.", $name));
            return false;
        }

        $field = new CDbParameter($name, $defaultValue, $type);
        $field->Index = count($this->Fields);
        $this->Fields[$name] = $field;

        return true;
    }

    public function setFieldValue($name, $value)
    {
        if(array_key_exists($name, $this->Fields))
        {
            $this->Fields[$name]->Value = $value;
            return true;
        }

        $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Field <%s> not exist.", $name));
        return false;
    }

    public function getFieldValue($name, &$value)
    {
        if(array_key_exists($name, $this->Fields))
        {
            $value = $this->Fields[$name]->Value;
            return true;
        }

        $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Field <%s> not exist.", $name));
        return false;
    }

    public function getFieldNames()
    {
        return array_keys($this->Fields);
    }

    /**
     * load object from db
     * @return int
     */
    public function load()
    {
        $dbParameters = array();
        $recordRow = array();
        $querySql = $this->createQuerySql($dbParameters);
	$this->Log->writeLog(Debug, __FILE__, __FUNCTION__, __LINE__, sprintf("Query Sql <%s>.", $querySql));
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRow);
        if($errorCode != OK)
        {
            return $errorCode;
        }

        if(count($recordRow) == 0)
        {
            return ERR_FOUND_RECORD_IN_DB;
        }

        foreach ($recordRow as $row)
        {
            foreach(array_keys($this->Fields) as $fieldName)
            {
                $this->Fields[$fieldName]->Value = $row[$fieldName];
            }
        }

        return $errorCode;
    }

    public function replaceIntoRecord(&$changedRecordNumber)
    {
        $dbParameters = array();
        $querySql = $this->createReplaceIntoSql($dbParameters);
        $this->Log->writeLog(Debug, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s>.", $querySql));
        return $this->DbMySqlInterface->executeSql($querySql, $dbParameters,$changedRecordNumber);
    }

    /**
     * add object to db
     * @param $insertRecordNumber insert record number
     * @return int error code
     */
    public function addRecord($insertRecordNumber)
    {
        $dbParameters = array();
        $querySql = $this->createInsertSql($dbParameters);
        $this->Log->writeLog(Debug, __FILE__, __FUNCTION__, __LINE__, sprintf("Execute sql <%s>.", $querySql));
        return $this->DbMySqlInterface->insert($querySql, $dbParameters,$insertRecordNumber);
    }


    /**
     * delete object from db
     * @param $deleteRecordNumber deleted record number
     * @return int error code
     */
    public function deleteRecord($deleteRecordNumber)
    {
        $dbParameters = array();
        $deleteSql = $this->createDeleteSql($dbParameters);
        return $this->DbMySqlInterface->deleteRecords($deleteSql, $dbParameters, $deleteRecordNumber);
    }

    /**
     * update object to db
     * @param $updateRecordNumber updated record number
     * @return int error code
     */
    public function updateRecord($updateRecordNumber)
    {
        $dbParameters = array();
        $updateSql = $this->createUpdateSql($dbParameters);
        return $this->DbMySqlInterface->update($updateSql, $dbParameters, $updateRecordNumber);
    }

    private function createDeleteSql(&$dbParameters)
    {
        return sprintf($this->DELETE_QUERY_TEMPLATE,
            $this->TableName,
            $this->getWherePart($dbParameters));
    }

    private function createQuerySql(&$dbParameters)
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf("%s WHERE %s",
                $this->TableName,
                $this->getWherePart($dbParameters)));
    }

    private function getWherePart(&$dbParameters)
    {
        if(count($this->PrimaryKeys) == 0)
        {
            return 0;
        }

        $keyFields = array();
        foreach($this->PrimaryKeys as $primaryKey)
        {
            array_push($keyFields, sprintf("(%s=%s)", $primaryKey, "?"));
            array_push($dbParameters, $this->Fields[$primaryKey]);
        }

        return sprintf("(%s)", implode(" AND ", $keyFields));
    }

    private function createUpdateSql(&$dbParameters)
    {
        return sprintf($this->UPDATE_QUERY_TEMPLATE,
            $this->TableName,
            $this->getUpdatePart($dbParameters),
            $this->getWherePart($dbParameters));
    }

    private function getUpdatePart(&$dbParameters)
    {
        $updateFields = array();
        foreach($this->Fields as $field)
        {
            array_push($updateFields, sprintf("%s=%s",$field->Name, "?"));
            array_push($dbParameters, $field);
        }

        return sprintf("%s", implode(" , ", $updateFields));
    }

    private function createReplaceIntoSql(&$dbParameters)
    {
        return sprintf($this->REPLACE_INTO_QUERY_TEMPLATE,
            $this->TableName,
            implode(",", array_keys($this->Fields)),
            $this->getInsertFieldPart($dbParameters));
    }

    private function createInsertSql(&$dbParameters)
    {
        return sprintf($this->INSERT_QUERY_TEMPLATE,
            $this->TableName,
            implode(",", array_keys($this->Fields)),
            $this->getInsertFieldPart($dbParameters));
    }

    private function getInsertFieldPart(&$dbParameters)
    {
        $insertField = array();
        foreach($this->Fields as $field)
        {
            array_push($insertField, sprintf("%s", "?"));
            array_push($dbParameters, $field);
        }

        return implode(",", $insertField);
    }

    public function clearPrimaryKeys()
    {
        unset($this->PrimaryKeys);
        $this->PrimaryKeys = array();
    }

    public function setPrimaryKey($keyName, $keyValue)
    {
        if(!in_array($keyName, $this->PrimaryKeys))
        {
            array_push($this->PrimaryKeys, $keyName);
        }

        $this->setFieldValue($keyName, $keyValue);
        return;
    }

    public function getValue()
    {
        return $this->Fields;
    }

    /**
     * convert object to array
     * @return array
     */
    public function convertObject2Array()
    {
        $valueArray = array();
        foreach($this->Fields as $field)
        {
            array_push($valueArray, $field->Value);
        }

        return $valueArray;
    }

    /**
     * call function of this class
     * @param $functionName
     * @param $parameters
     * @return CResult|mixed
     */
    public function callFunction($functionName, $parameters)
    {
        $result = new CResult();
        if(!array_key_exists($functionName, $this->AllowAccessFunctions))
        {
            $result->setErrorCode(ERR_FUNCTION_NOT_ALLOW_ACCESS);
            $result->setMessage(sprintf("Function <%s> not allow access.", $functionName));
            $result->setData(array());
            return $result;
        }

        if (method_exists($this, $functionName)) {
            return call_user_func_array(array($this, $functionName), array($parameters));
        }

        $result->setErrorCode(ERR_NOT_FOUND_FUNCTION);
        $result->setMessage(sprintf("Not found function<%s>.", $functionName));
        $result->setData(array());
        return $result;
    }

    /**
     * check parameters
     * @param $parameterName
     * @param $parameters
     * @param $result
     * @return bool
     */
    public function checkParameter($parameterName, $parameters, &$result)
    {
        if(!array_key_exists($parameterName, $parameters))
        {
            $result->setErrorCode(ERR_NOT_FOUND_PARAMETER_NAME);
            $result->setMessage(sprintf("No parameter <%s>.", $parameterName));
            $this->Log->writeLog(Error,__FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return false;
        }

        return true;
    }

    /**
     * check parameter exist
     * @param $needCheckParameters
     * @param $parameters
     * @param $result
     * @return bool
     */
    public function checkParameters($needCheckParameters, $parameters, &$result)
    {
        foreach($needCheckParameters as $parameter)
        {
            if(!$this->checkParameter($parameter, $parameters, $result))
            {
                return false;
            }
        }

        return true;
    }

    protected abstract function initResultFields();
    protected abstract function initTableFields();
}

?>
