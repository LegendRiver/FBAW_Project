<?php


abstract class AbstractDBManager extends ELIBaseObject
{
    protected $field2FunctinName;

    protected $dbEntityInstance;

    protected function selectDbRecord($fieldArray, $whereParamMap)
    {
        $whereFieldArray = array_keys($whereParamMap);
        $selectSql = DBHelper::buildSelectSql($this->TableName, $fieldArray, $whereFieldArray);
        if(empty($selectSql))
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to build the select sql.');
            return false;
        }

        $selectParameters = array_values($whereParamMap);

        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($selectSql, $selectParameters, $recordRows);
        if($errorCode != OK)
        {
            ServerLogger::instance()->writeLog(Error, sprintf("Execute sql <%s> failed.", $selectSql));
            return false;
        }

        $entityArray = array();
        foreach($recordRows as $row)
        {
            $entityArray[] = $this->buildDBEntity($row);
        }

        return $entityArray;
    }

    protected function updateDbRecord($fieldParamMap, $whereParamMap)
    {
        $updateField = array_keys($fieldParamMap);
        $whereField = array_keys($whereParamMap);

        $updateSql = DBHelper::buildUpdateSql($this->TableName, $updateField, $whereField);
        if(empty($updateSql))
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to build the update sql.');
            return ERR_HANDLE_SQL_EXCEPTION;
        }

        $updateParameters = array_values($fieldParamMap);
        $whereParameters = array_values($whereParamMap);
        $sqlParameters = array_merge($updateParameters, $whereParameters);

        $rowNum = 0;
        $errorCode = $this->DbMySqlInterface->update($updateSql, $sqlParameters, $rowNum);
        if($errorCode != OK)
        {
            $message = sprintf("Update campaign status sql <%s> failed.", $updateSql);
            ServerLogger::instance()->writeLog(Error, $message);
            return $errorCode;
        }

        return OK;
    }

    private function buildDBEntity($selectRow)
    {
        $this->initEntityCondition();

        foreach ($this->field2FunctinName as $fieldName => $functionName)
        {
            if(!array_key_exists($fieldName, $selectRow))
            {
                ServerLogger::instance()->writeLog(Debug, 'The field: ' . $fieldName . 'does not exist in db result');
                continue;
            }

            if(!method_exists($this->dbEntityInstance, $functionName))
            {
                $className = get_class($this->dbEntityInstance);
                ServerLogger::instance()->writeLog(Warning, 'The method: ' . $functionName .
                    'does not exist in class: ' . $className);
                continue;
            }

            call_user_func_array(array($this->dbEntityInstance, $functionName), array($selectRow[$fieldName]));
        }

        return $this->dbEntityInstance;
    }

    protected abstract function initEntityCondition();
}