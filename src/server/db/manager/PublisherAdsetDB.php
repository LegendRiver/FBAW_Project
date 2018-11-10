<?php


class PublisherAdsetDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::PUBLISHER_ADSET_TABLE_NAME;
        parent::__construct();
    }

    public function selectByFBAdsetId($fbAdsetId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $adsetWParam = new CDbParameter(DBConstants::PUBLISHER_ADSET_ADSETID, $fbAdsetId, STRING);
        $selectParamMap[DBConstants::PUBLISHER_ADSET_ADSETID] = $adsetWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function addAdsetRecord(PublisherAdSetEntity $entity)
    {
        try
        {
            $this->initDBField($entity);

            $recordNum = 0;
            $errorCode = $this->addRecord($recordNum);
            if ($errorCode != OK)
            {
                $message = sprintf("Insert Fb adset <%s> failed, error code<%d>.", $entity->getName(), $errorCode);
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

    public function updateStatus($statusValue, $fbAdsetId)
    {
        try
        {
            $updateParameters = array();
            $statusParam = new CDbParameter(DBConstants::PUBLISHER_ADSET_STATUS, $statusValue, INTEGER);
            $updateParameters[DBConstants::PUBLISHER_ADSET_STATUS] = $statusParam;

            $modifyParam = new CDbParameter(DBConstants::PUBLISHER_ADSET_MODIFY_TIME, date('Y-m-d H:i:s'), STRING);
            $updateParameters[DBConstants::PUBLISHER_ADSET_MODIFY_TIME] = $modifyParam;

            $whereParameters = array();
            $adsetIdWParam = new CDbParameter(DBConstants::PUBLISHER_ADSET_ADSETID, $fbAdsetId, STRING);
            $whereParameters[DBConstants::PUBLISHER_ADSET_ADSETID] = $adsetIdWParam;

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
        $this->dbEntityInstance = new PublisherAdSetEntity();

        $this->field2FunctinName = array(
            DBConstants::PUBLISHER_ADSET_UUID => 'setUid',
            DBConstants::PUBLISHER_ADSET_CAM_UUID => 'setCampaignUid',
            DBConstants::PUBLISHER_ADSET_ADSETID => 'setAdsetId',
            DBConstants::PUBLISHER_ADSET_BUDGET => 'setBudget',
            DBConstants::PUBLISHER_ADSET_PUBLISHER_TYPE => 'setPublisherType',
            DBConstants::PUBLISHER_ADSET_SCHEDULE_START => 'setScheduleStart',
            DBConstants::PUBLISHER_ADSET_SCHEDULE_END => 'setScheduleEnd',
            DBConstants::PUBLISHER_ADSET_TIME_START => 'setTimeStart',
            DBConstants::PUBLISHER_ADSET_TIME_END => 'setTimeEnd',
            DBConstants::PUBLISHER_ADSET_AUDIENCE => 'setAudience',
            DBConstants::PUBLISHER_ADSET_BID => 'setBid',
            DBConstants::PUBLISHER_ADSET_BID_TYPE => 'setBidType',
            DBConstants::PUBLISHER_ADSET_CHARGE_TYPE => 'setChargeType',
            DBConstants::PUBLISHER_ADSET_DELIVERY_TYPE => 'setDeliveryType',
            DBConstants::PUBLISHER_ADSET_BUDGET_TYPE => 'setBudgetType',
            DBConstants::PUBLISHER_ADSET_STATUS => 'setStatus',
            DBConstants::PUBLISHER_ADSET_KEYWORD => 'setKeyWord',
            DBConstants::PUBLISHER_ADSET_MATCH_TYPE => 'setMatchType',
            DBConstants::PUBLISHER_ADSET_CREATETIME => 'setCreateTime',
            DBConstants::PUBLISHER_ADSET_MODIFY_TIME => 'setModifyTime',
        );
    }

    private function initDBField(PublisherAdSetEntity $entity)
    {
        $uuid = $entity->getUid();
        $campaignUid = $entity->getCampaignUid();
        $adsetId = $entity->getAdsetId();
        $budget = $entity->getBudget();
        $publisherType = $entity->getPublisherType();
        $scheduleStart = $entity->getScheduleStart();
        $scheduleEnd = $entity->getScheduleEnd();
        $timeStart = $entity->getTimeStart();
        $timeEnd = $entity->getTimeEnd();
        $audience = $entity->getAudience();
        $bid = $entity->getBid();
        $bidType = $entity->getBidType();
        $chargeType = $entity->getChargeType();
        $deliveryType = $entity->getDeliveryType();
        $budgetType = $entity->getBudgetType();
        $status = $entity->getStatus();
        $keyWord = $entity->getKeyWord();
        $matchType = $entity->getMatchType();
        $createTime = $entity->getCreateTime();
        $modifyTime = $entity->getModifyTime();

        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_UUID, $uuid);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_CAM_UUID, $campaignUid);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_ADSETID, $adsetId);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_BUDGET, $budget);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_PUBLISHER_TYPE, $publisherType);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_SCHEDULE_START, $scheduleStart);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_SCHEDULE_END, $scheduleEnd);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_TIME_START, $timeStart);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_TIME_END, $timeEnd);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_AUDIENCE, $audience);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_BID, $bid);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_BID_TYPE, $bidType);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_CHARGE_TYPE, $chargeType);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_DELIVERY_TYPE, $deliveryType);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_BUDGET_TYPE, $budgetType);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_STATUS, $status);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_KEYWORD, $keyWord);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_MATCH_TYPE, $matchType);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_CREATETIME, $createTime);
        $this->setFieldValue(DBConstants::PUBLISHER_ADSET_MODIFY_TIME, $modifyTime);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::PUBLISHER_ADSET_UUID, STRING, "");
        $this->addField(DBConstants::PUBLISHER_ADSET_CAM_UUID, STRING, "");
        $this->addField(DBConstants::PUBLISHER_ADSET_ADSETID, STRING, "");
        $this->addField(DBConstants::PUBLISHER_ADSET_BUDGET, DOUBLE, 0);
        $this->addField(DBConstants::PUBLISHER_ADSET_PUBLISHER_TYPE, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_ADSET_SCHEDULE_START, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::PUBLISHER_ADSET_SCHEDULE_END, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::PUBLISHER_ADSET_TIME_START, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_ADSET_TIME_END, INTEGER, DBConstants::TIME_END_LIMIT);
        $this->addField(DBConstants::PUBLISHER_ADSET_AUDIENCE, STRING, "");
        $this->addField(DBConstants::PUBLISHER_ADSET_BID, DOUBLE, 0);
        $this->addField(DBConstants::PUBLISHER_ADSET_BID_TYPE, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_ADSET_CHARGE_TYPE, INTEGER, 1);
        $this->addField(DBConstants::PUBLISHER_ADSET_DELIVERY_TYPE, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_ADSET_BUDGET_TYPE, INTEGER, 1);
        $this->addField(DBConstants::PUBLISHER_ADSET_STATUS, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_ADSET_KEYWORD, STRING, "");
        $this->addField(DBConstants::PUBLISHER_ADSET_MATCH_TYPE, INTEGER, 0);
        $this->addField(DBConstants::PUBLISHER_ADSET_CREATETIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::PUBLISHER_ADSET_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }

}