<?php


class ProfitDB extends AbstractDBManager
{

    public function __construct()
    {
        $this->TableName = DBConstants::PROFIT_TABLE_NAME;
        parent::__construct();
    }

    public function updateProfit($profitValue, $configId)
    {
        try
        {
            $updateParameters = array();
            $profitParam = new CDbParameter(DBConstants::PROFIT_PROFIT, $profitValue, INTEGER);
            $updateParameters[DBConstants::PROFIT_PROFIT] = $profitParam;

            $modifyParam = new CDbParameter(DBConstants::PROFIT_UPDATE_TIME, date('Y-m-d H:i:s'), STRING);
            $updateParameters[DBConstants::PROFIT_UPDATE_TIME] = $modifyParam;

            $whereParameters = array();
            $configIdWParam = new CDbParameter(DBConstants::PROFIT_CONFIG_ID, $configId, STRING);
            $whereParameters[DBConstants::PROFIT_CONFIG_ID] = $configIdWParam;

            return $this->updateDbRecord($updateParameters, $whereParameters);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return ERR_SERVER_DB_EXCEPTION;
        }

    }

    public function selectProfitByConfigId($configId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $adWParam = new CDbParameter(DBConstants::PROFIT_CONFIG_ID, $configId, STRING);
        $selectParamMap[DBConstants::PROFIT_CONFIG_ID] = $adWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function addProfitRecord(ProfitDBEntity $entity)
    {
        try
        {
            $this->initDBField($entity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert profit <%s> failed, error code<%d>.", $entity->getConfigId(), $errorCode);
                ServerLogger::instance()->writeLog(Error, $message);
                return $errorCode;
            }

            return OK;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return ERR_SERVER_DB_EXCEPTION;
        }
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new ProfitDBEntity();

        $this->field2FunctinName = array(
            DBConstants::PROFIT_CONFIG_ID => 'setConfigId',
            DBConstants::PROFIT_DAILY_BUDGET => 'setDailyBudget',
            DBConstants::PROFIT_PROFIT => 'setProfitPercent',
            DBConstants::PROFIT_OBJECTIVE_MARGIN => 'setMarginPercent',
            DBConstants::PROFIT_UPDATE_TIME => 'setUpdateTime',
        );
    }

    private function initDBField(ProfitDBEntity $profitEntity)
    {
        $configId = $profitEntity->getConfigId();
        $profitPercent = $profitEntity->getProfitPercent();
        $marginPercent = $profitEntity->getMarginPercent();
        $updateTime = $profitEntity->getUpdateTime();
        $dailyBudget = $profitEntity->getDailyBudget();

        $this->setFieldValue(DBConstants::PROFIT_CONFIG_ID, $configId);
        $this->setFieldValue(DBConstants::PROFIT_DAILY_BUDGET, $dailyBudget);
        $this->setFieldValue(DBConstants::PROFIT_PROFIT, $profitPercent);
        $this->setFieldValue(DBConstants::PROFIT_OBJECTIVE_MARGIN, $marginPercent);
        $this->setFieldValue(DBConstants::PROFIT_UPDATE_TIME, $updateTime);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::PROFIT_CONFIG_ID, STRING, "");
        $this->addField(DBConstants::PROFIT_DAILY_BUDGET, DOUBLE, 0);
        $this->addField(DBConstants::PROFIT_PROFIT, INTEGER, 0);
        $this->addField(DBConstants::PROFIT_OBJECTIVE_MARGIN, INTEGER, 0);
        $this->addField(DBConstants::PROFIT_UPDATE_TIME, STRING, "");
    }
}