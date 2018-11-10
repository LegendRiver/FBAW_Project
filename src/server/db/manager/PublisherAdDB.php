<?php


class PublisherAdDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::AD_TABLE_NAME;
        parent::__construct();
    }

    public function selectByFBAdId($fbAdId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $adWParam = new CDbParameter(DBConstants::AD_ID, $fbAdId, STRING);
        $selectParamMap[DBConstants::AD_ID] = $adWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function addAdRecord(PublisherAdEntity $entity)
    {
        try
        {
            $this->initDBField($entity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert Fb AD <%s> failed, error code<%d>.", $entity->getName(), $errorCode);
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

    public function updateStatus($statusValue, $fbAdId)
    {
        try
        {
            $updateParameters = array();
            $statusParam = new CDbParameter(DBConstants::AD_STATUS, $statusValue, INTEGER);
            $updateParameters[DBConstants::AD_STATUS] = $statusParam;

            $modifyParam = new CDbParameter(DBConstants::AD_MODIFY_TIME, date('Y-m-d H:i:s'), STRING);
            $updateParameters[DBConstants::AD_MODIFY_TIME] = $modifyParam;

            $whereParameters = array();
            $adsetIdWParam = new CDbParameter(DBConstants::AD_ID, $fbAdId, STRING);
            $whereParameters[DBConstants::AD_ID] = $adsetIdWParam;

            return $this->updateDbRecord($updateParameters, $whereParameters);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return ERR_SERVER_DB_EXCEPTION;
        }
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new PublisherAdEntity();

        $this->field2FunctinName = array(
            DBConstants::AD_UUID => 'setUuid',
            DBConstants::AD_ADSET_UUID => 'setAdsetUid',
            DBConstants::AD_ID => 'setAdId',
            DBConstants::AD_CREATIVE_UUID => 'setCreativeUid',
            DBConstants::AD_PUBLISHER_TYPE => 'setPublisherType',
            DBConstants::AD_STATUS => 'setStatus',
            DBConstants::AD_NAME => 'setName',
            DBConstants::AD_CREATE_TIME => 'setCreateTime',
            DBConstants::AD_MODIFY_TIME => 'setModifyTime',
        );
    }

    private function initDBField(PublisherAdEntity $entity)
    {
        $uid = $entity->getUuid();
        $adSetUid = $entity->getAdsetUid();
        $adId = $entity->getAdId();
        $creativeUid = $entity->getCreativeUid();
        $publisherType = $entity->getPublisherType();
        $status = $entity->getStatus();
        $name = $entity->getName();
        $createTime = $entity->getCreateTime();
        $modifyTime = $entity->getModifyTime();

        $this->setFieldValue(DBConstants::AD_UUID, $uid);
        $this->setFieldValue(DBConstants::AD_ADSET_UUID, $adSetUid);
        $this->setFieldValue(DBConstants::AD_ID, $adId);
        $this->setFieldValue(DBConstants::AD_CREATIVE_UUID, $creativeUid);
        $this->setFieldValue(DBConstants::AD_PUBLISHER_TYPE, $publisherType);
        $this->setFieldValue(DBConstants::AD_STATUS, $status);
        $this->setFieldValue(DBConstants::AD_NAME, $name);
        $this->setFieldValue(DBConstants::AD_CREATE_TIME, $createTime);
        $this->setFieldValue(DBConstants::AD_MODIFY_TIME, $modifyTime);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::AD_UUID, STRING, "");
        $this->addField(DBConstants::AD_ADSET_UUID, STRING, "");
        $this->addField(DBConstants::AD_ID, STRING, "");
        $this->addField(DBConstants::AD_CREATIVE_UUID, STRING, "");
        $this->addField(DBConstants::AD_PUBLISHER_TYPE, INTEGER, 0);
        $this->addField(DBConstants::AD_STATUS, INTEGER, 0);
        $this->addField(DBConstants::AD_NAME, STRING, "");
        $this->addField(DBConstants::AD_CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::AD_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }
}