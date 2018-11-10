<?php


class ELICampaignDB extends AbstractDBManager
{
    private $configDbManager;

    public function __construct()
    {
        $this->TableName = DBConstants::ELI_CAMPAIGN_TABLE_NAME;
        $this->configDbManager = new ELICamConfigDB();
        parent::__construct();
    }

    public function selectById($eliCampaignId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $adWParam = new CDbParameter(DBConstants::ELI_CAMPAIGN_ID, $eliCampaignId, STRING);
        $selectParamMap[DBConstants::ELI_CAMPAIGN_ID] = $adWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function addCampaignRecord(EliCampaignEntity $entity)
    {
        $this->initInsertFields($entity);

        $recordNumber = 0;
        $errorCode = OK;
        try
        {
            $this->DbMySqlInterface->closeAutoCommit();
            $this->DbMySqlInterface->beginTransaction();

            $errorCode = $this->addRecord($recordNumber);
            if($errorCode != OK)
            {
                $this->rollbackDBOperations();
                $message = sprintf("Create campaign <%s> failed, error code<%d>.", $entity->getName(), $errorCode);
                ServerLogger::instance()->writeLog(Error, $message);
                return $errorCode;
            }

            $configArray = $entity->getCamConfigArray();
            $errorCode = $this->addCampaignConfigs($configArray);
            if($errorCode != OK)
            {
                $this->rollbackDBOperations();
                $message = sprintf("Create campaign configs <%s> failed, error code<%d>.", $entity->getName(), $errorCode);
                ServerLogger::instance()->writeLog(Error, $message);
                return $errorCode;
                
            }

            $this->DbMySqlInterface->commit();
            $this->DbMySqlInterface->openAutoCommit();
        }
        catch(Exception $ex)
        {
            $this->rollbackDBOperations();
            $message = sprintf("Commit db transaction failed, error code<%d,%s>.", $errorCode, $ex->getMessage());
            ServerLogger::instance()->writeLog(Error, $message);
            return ERR_SERVER_DB_EXCEPTION;
        }

        if($errorCode != OK)
        {
            $message = sprintf("Create campaign <%s> failed, error code<%d>.", $entity->getName(), $errorCode);
            ServerLogger::instance()->writeLog(Error, $message);
        }

        return $errorCode;

    }

    private function rollbackDBOperations()
    {
        $this->DbMySqlInterface->rollback();
        $this->DbMySqlInterface->openAutoCommit();
    }

    private function addCampaignConfigs($configArray)
    {
        foreach($configArray as $configEntity)
        {
            $errorCode = $this->configDbManager->addCamConfigRecord($configEntity);
            if($errorCode != OK)
            {
                $message = sprintf("Create campaign config <%s> failed, campaign Id <%d> ,error code <%d>.", $configEntity->getConfigId(),
                    $configEntity->getCampaignId(), $errorCode);
                ServerLogger::instance()->writeLog(Error, $message);
                return $errorCode;
            }
        }

        return OK;
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new EliCampaignEntity();

        $this->field2FunctinName = array(
            DBConstants::ELI_CAMPAIGN_ID => 'setId',
            DBConstants::ELI_CAMPAIGN_ELI_ACCOUNT_ID => 'setAccountId',
            DBConstants::ELI_CAMPAIGN_NAME => 'setName',
            DBConstants::ELI_CAMPAIGN_CAMPAIGN_TYPE => 'setCampaignType',
            DBConstants::ELI_CAMPAIGN_URL => 'setUrl',
            DBConstants::ELI_CAMPAIGN_TITLE => 'setTitle',
            DBConstants::ELI_CAMPAIGN_DESCRIPTION => 'setDescription',
            DBConstants::ELI_CAMPAIGN_IMAGE_LIST => 'setImageList',
            DBConstants::ELI_CAMPAIGN_SCHEDULE_START => 'setScheduleStart',
            DBConstants::ELI_CAMPAIGN_SCHEDULE_END => 'setScheduleEnd',
            DBConstants::ELI_CAMPAIGN_TIME_START => 'setTimeStart',
            DBConstants::ELI_CAMPAIGN_TIME_END => 'setTimeEnd',
            DBConstants::ELI_CAMPAIGN_AUDIENCE => 'setAudience',
            DBConstants::ELI_CAMPAIGN_STATUS => 'setStatus',
            DBConstants::ELI_CAMPAIGN_BUDGET => 'setBudget',
            DBConstants::ELI_CAMPAIGN_SPENT => 'setSpend',
            DBConstants::ELI_CAMPAIGN_DELIVERY_TYPE => 'setDeliveryType',
            DBConstants::ELI_CAMPAIGN_KEYWORD => 'setKeyWord',
            DBConstants::ELI_CAMPAIGN_MATCH_TYPE => 'setMatchType',
            DBConstants::ELI_CAMPAIGN_CREATE_TIME => 'setCreateTime',
            DBConstants::ELI_CAMPAIGN_LAST_MODIFY_TIME => 'setModifyTime',
        );
    }

    private function initInsertFields(EliCampaignEntity $entity)
    {
        $id = $entity->getId();
        $accountId = $entity->getAccountId();
        $name = $entity->getName();
        $campaignType = $entity->getCampaignType();
        $url = $entity->getUrl();
        $title = $entity->getTitle();
        $description = $entity->getDescription();
        $imageList = $entity->getImageList();
        $scheduleStart = $entity->getScheduleStart();
        $scheduleEnd = $entity->getScheduleEnd();
        $timeStart = $entity->getTimeStart();
        $timeEnd = $entity->getTimeEnd();
        $audience = $entity->getAudience();
        $status = $entity->getStatus();
        $budget =$entity->getBudget();
        $spend = $entity->getSpend();
        $deliveryType = $entity->getDeliveryType();
        $keyWord = $entity->getKeyWord();
        $matchType = $entity->getMatchType();
        $createTime = $entity->getCreateTime();
        $modifyTime = $entity->getModifyTime();

        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_ID, $id);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_ELI_ACCOUNT_ID,$accountId);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_NAME,$name);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_CAMPAIGN_TYPE, $campaignType);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_URL, $url);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_TITLE, $title);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_DESCRIPTION, $description);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_IMAGE_LIST, $imageList);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_SCHEDULE_START, $scheduleStart);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_SCHEDULE_END, $scheduleEnd);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_TIME_START, $timeStart);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_TIME_END, $timeEnd);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_AUDIENCE, $audience);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_STATUS, $status);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_BUDGET, $budget);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_SPENT, $spend);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_DELIVERY_TYPE, $deliveryType);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_KEYWORD, $keyWord);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_MATCH_TYPE, $matchType);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_CREATE_TIME, $createTime);
        $this->setFieldValue(DBConstants::ELI_CAMPAIGN_LAST_MODIFY_TIME, $modifyTime);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::ELI_CAMPAIGN_ID, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_ELI_ACCOUNT_ID, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_NAME, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_CAMPAIGN_TYPE, INTEGER, 0);
        $this->addField(DBConstants::ELI_CAMPAIGN_URL, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_TITLE, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_DESCRIPTION, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_IMAGE_LIST, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_SCHEDULE_START, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_SCHEDULE_END, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_TIME_START, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_TIME_END, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_AUDIENCE, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_STATUS, INTEGER, ELI_ACCOUNT_STATUS_INIT);
        $this->addField(DBConstants::ELI_CAMPAIGN_BUDGET, INTEGER, 0);
        $this->addField(DBConstants::ELI_CAMPAIGN_SPENT, INTEGER, 0);
        $this->addField(DBConstants::ELI_CAMPAIGN_DELIVERY_TYPE, INTEGER, 0);
        $this->addField(DBConstants::ELI_CAMPAIGN_KEYWORD, STRING, "");
        $this->addField(DBConstants::ELI_CAMPAIGN_MATCH_TYPE, INTEGER, 0);
        $this->addField(DBConstants::ELI_CAMPAIGN_CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::ELI_CAMPAIGN_LAST_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }
}