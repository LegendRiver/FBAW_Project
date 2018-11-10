<?php


class PublisherCampaignDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::PUBLISHER_CAMPAIGN_TABLE_NAME;
        parent::__construct();
    }

    public function selectByConfigId($configId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $configWParam = new CDbParameter(DBConstants::PUBLISHER_CAMPAIGN_CONFIG_ID, $configId, STRING);
        $selectParamMap[DBConstants::PUBLISHER_CAMPAIGN_CONFIG_ID] = $configWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }


    public function selectByFBCampaignId($fbCampaignId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $campaignWParam = new CDbParameter(DBConstants::PUBLISHER_CAMPAIGN_ID, $fbCampaignId, STRING);
        $selectParamMap[DBConstants::PUBLISHER_CAMPAIGN_ID] = $campaignWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function selectCampaignInfoByAdsetId($fbAdsetId)
    {
        try
        {
            $joinAdsetSql = $this->getJoinAdsetSql();

            $selectParams = array();
            $adsetIdParam = new CDbParameter(DBConstants::PUBLISHER_ADSET_ADSETID, $fbAdsetId, STRING);
            $selectParams[] = $adsetIdParam;

            $recordRows = array();
            $errorCode = $this->DbMySqlInterface->queryRecords($joinAdsetSql, $selectParams, $recordRows);
            if ($errorCode != OK)
            {
                ServerLogger::instance()->writeLog(Error, sprintf("Execute sql <%s> failed.", $joinAdsetSql));
                return false;
            }
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

        return $recordRows;
    }

    public function updateStatus($statusValue, $fbCampaignId)
    {
        try
        {
            $updateParameters = array();
            $statusParam = new CDbParameter(DBConstants::PUBLISHER_CAMPAIGN_STATUS, $statusValue, INTEGER);
            $updateParameters[DBConstants::PUBLISHER_CAMPAIGN_STATUS] = $statusParam;

            $modifyParam = new CDbParameter(DBConstants::PUBLISHER_CAMPAIGN_MODIFY_TIME, date('Y-m-d H:i:s'), STRING);
            $updateParameters[DBConstants::PUBLISHER_CAMPAIGN_MODIFY_TIME] = $modifyParam;

            $whereParameters = array();
            $campaigIdWParam = new CDbParameter(DBConstants::PUBLISHER_CAMPAIGN_ID, $fbCampaignId, STRING);
            $whereParameters[DBConstants::PUBLISHER_CAMPAIGN_ID] = $campaigIdWParam;

            return $this->updateDbRecord($updateParameters, $whereParameters);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return ERR_SERVER_DB_EXCEPTION;
        }

    }

    public function addPublisherCamRecord(PublisherCampaignEntity $entity)
    {
        try
        {
            $this->initDBField($entity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert Fb campaign <%s> failed, error code<%d>.", $entity->getName(), $errorCode);
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

    private function getJoinAdsetSql()
    {
        $sql = 'select campaign.';
        $sql .= DBConstants::PUBLISHER_CAMPAIGN_ACCOUNTID;
        $sql .= ' ,campaign.';
        $sql .= DBConstants::PUBLISHER_CAMPAIGN_TYPE;
        $sql .= ' from ';
        $sql .= DBConstants::PUBLISHER_CAMPAIGN_TABLE_NAME;
        $sql .= ' as campaign inner join ';
        $sql .= DBConstants::PUBLISHER_ADSET_TABLE_NAME;
        $sql .= ' as adset on adset.';
        $sql .= DBConstants::PUBLISHER_ADSET_CAM_UUID;
        $sql .= ' = campaign.';
        $sql .= DBConstants::PUBLISHER_CAMPAIGN_UUID;
        $sql .= ' where adset.';
        $sql .= DBConstants::PUBLISHER_ADSET_ADSETID;
        $sql .= ' = ?';

        return $sql;
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new PublisherCampaignEntity();

        $this->field2FunctinName = array(
            DBConstants::PUBLISHER_CAMPAIGN_UUID => 'setUid',
            DBConstants::PUBLISHER_CAMPAIGN_CONFIG_ID => 'setConfigId',
            DBConstants::PUBLISHER_CAMPAIGN_ID => 'setCampaignId',
            DBConstants::PUBLISHER_CAMPAIGN_NAME => 'setName',
            DBConstants::PUBLISHER_CAMPAIGN_ACCOUNTID => 'setAccountId',
            DBConstants::PUBLISHER_CAMPAIGN_SPENDCAP => 'setSpendCap',
            DBConstants::PUBLISHER_CAMPAIGN_TYPE => 'setCampaignType',
            DBConstants::PUBLISHER_CAMPAIGN_PUBLISHER_TYPE => 'setPublisherType',
            DBConstants::PUBLISHER_CAMPAIGN_STATUS => 'setStatus',
            DBConstants::PUBLISHER_CAMPAIGN_CREATE_TIME => 'setCreateTime',
            DBConstants::PUBLISHER_CAMPAIGN_MODIFY_TIME => 'setModifyTime',
        );
    }

    private function initDBField(PublisherCampaignEntity $entity)
    {
        $uid = $entity->getUid();
        $configId = $entity->getConfigId();
        $fbCampaignId = $entity->getCampaignId();
        $fbAccountId = $entity->getAccountId();
        $name = $entity->getName();
        $spendCap = $entity->getSpendCap();
        $campaignType = $entity->getCampaignType();
        $publisherType = $entity->getPublisherType();
        $status = $entity->getStatus();
        $createTime = $entity->getCreateTime();
        $modifyTime = $entity->getModifyTime();

        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_UUID, $uid);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_CONFIG_ID, $configId);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_ID, $fbCampaignId);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_NAME,$name);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_ACCOUNTID,$fbAccountId);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_SPENDCAP, $spendCap);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_TYPE, $campaignType);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_PUBLISHER_TYPE, $publisherType);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_STATUS, $status);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_CREATE_TIME, $createTime);
        $this->setFieldValue(DBConstants::PUBLISHER_CAMPAIGN_MODIFY_TIME, $modifyTime);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_UUID, STRING, "");
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_CONFIG_ID, STRING, "");
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_ID, STRING, "");
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_NAME, STRING, "");
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_ACCOUNTID, STRING, "");
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_SPENDCAP, DOUBLE, 0);
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_TYPE, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_PUBLISHER_TYPE, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_STATUS, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::PUBLISHER_CAMPAIGN_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }
}