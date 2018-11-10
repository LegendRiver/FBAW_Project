<?php


class DailySpendDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::DAILY_SPEND_TABLE_NAME;
        parent::__construct();
    }

    public function selectDailySpendByConfigId($configId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $adWParam = new CDbParameter(DBConstants::DAILY_SPEND_CONFIG_ID, $configId, STRING);
        $selectParamMap[DBConstants::DAILY_SPEND_CONFIG_ID] = $adWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function addDailySpendRecord(DailySpendEntity $entity)
    {
        try
        {
            $this->initDBField($entity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert daily spend <%s> failed, error code<%d>.", $entity->getConfigId(), $errorCode);
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
        $this->dbEntityInstance = new DailySpendEntity();

        $this->field2FunctinName = array(
            DBConstants::DAILY_SPEND_UUID => 'setUuid',
            DBConstants::DAILY_SPEND_CONFIG_ID => 'setConfigId',
            DBConstants::DAILY_SPEND_CURRENT_DATE => 'setCurrentDate',
            DBConstants::DAILY_SPEND_DAILY_BUDGET => 'setDailyBudget',
            DBConstants::DAILY_SPEND_DAILY_SPEND => 'setDailySpend',
            DBConstants::DAILY_SPEND_PROFIT => 'setProfitPercent',
            DBConstants::DAILY_SPEND_OBJECTIVE_MARGIN => 'setMarginPercent',
        );
    }

    private function initDBField(DailySpendEntity $entity)
    {
        $uuid = $entity->getUuid();
        $configId = $entity->getConfigId();
        $currentDate = $entity->getCurrentDate();
        $dailyBudget = $entity->getDailyBudget();
        $dailySpent = $entity->getDailySpend();
        $profit = $entity->getProfitPercent();
        $margin = $entity->getMarginPercent();

        $this->setFieldValue(DBConstants::DAILY_SPEND_UUID, $uuid);
        $this->setFieldValue(DBConstants::DAILY_SPEND_CONFIG_ID, $configId);
        $this->setFieldValue(DBConstants::DAILY_SPEND_CURRENT_DATE, $currentDate);
        $this->setFieldValue(DBConstants::DAILY_SPEND_DAILY_BUDGET, $dailyBudget);
        $this->setFieldValue(DBConstants::DAILY_SPEND_DAILY_SPEND, $dailySpent);
        $this->setFieldValue(DBConstants::DAILY_SPEND_PROFIT, $profit);
        $this->setFieldValue(DBConstants::DAILY_SPEND_OBJECTIVE_MARGIN, $margin);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::DAILY_SPEND_UUID, STRING, "");
        $this->addField(DBConstants::DAILY_SPEND_CONFIG_ID, STRING, "");
        $this->addField(DBConstants::DAILY_SPEND_CURRENT_DATE, INTEGER, 0);
        $this->addField(DBConstants::DAILY_SPEND_DAILY_BUDGET, DOUBLE, 0);
        $this->addField(DBConstants::DAILY_SPEND_DAILY_SPEND, DOUBLE, 0);
        $this->addField(DBConstants::DAILY_SPEND_PROFIT, INTEGER, 0);
        $this->addField(DBConstants::DAILY_SPEND_OBJECTIVE_MARGIN, INTEGER, 0);
    }
}