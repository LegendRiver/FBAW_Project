<?php


class ELICamConfigDB extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = DBConstants::ELI_CAM_CONFIG_TABLE_NAME;
        parent::__construct();
    }

    public function selectByCampaignId($eliCampaignId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $adWParam = new CDbParameter(DBConstants::ELI_CAM_CONFIG_CAMPAIGN_ID, $eliCampaignId, STRING);
        $selectParamMap[DBConstants::ELI_CAM_CONFIG_CAMPAIGN_ID] = $adWParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function addCamConfigRecord(CamConfigEntity $configEntity)
    {
        try
        {
            $this->initInsertFields($configEntity);
            $recordNumber = 0;
            return $this->addRecord($recordNumber);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
        }
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new CamConfigEntity();

        $this->field2FunctinName = array(
            DBConstants::ELI_CAM_CONFIG_ID => 'setConfigId',
            DBConstants::ELI_CAM_CONFIG_CAMPAIGN_ID => 'setCampaignId',
            DBConstants::ELI_CAM_CONFIG_PUBLISHER_ID => 'setPublisherId',
            DBConstants::ELI_CAM_CONFIG_BUDGET => 'setBudget',
            DBConstants::ELI_CAM_CONFIG_SPENT => 'setSpent',
            DBConstants::ELI_CAM_CONFIG_STATUS => 'setStatus',
            DBConstants::ELI_CAM_CONFIG_CREATE_TIME => 'setCreateTime',
            DBConstants::ELI_CAM_CONFIG_LAST_MODIFY_TIME => 'setModifyTime',
        );
    }

    private function initInsertFields(CamConfigEntity $configEntity)
    {
        $eliCampaignConfigId = $configEntity->getConfigId();
        $eliCampaignId = $configEntity->getCampaignId();
        $eliPublisherId = $configEntity->getPublisherId();
        $budget = $configEntity->getBudget();
        $spent = $configEntity->getSpent();
        $status = $configEntity->getStatus();
        $createTime = $configEntity->getCreateTime();
        $modifyTime = $configEntity->getModifyTime();

        $this->setFieldValue(DBConstants::ELI_CAM_CONFIG_ID, $eliCampaignConfigId);
        $this->setFieldValue(DBConstants::ELI_CAM_CONFIG_CAMPAIGN_ID, $eliCampaignId);
        $this->setFieldValue(DBConstants::ELI_CAM_CONFIG_PUBLISHER_ID, $eliPublisherId);
        $this->setFieldValue(DBConstants::ELI_CAM_CONFIG_BUDGET, $budget);
        $this->setFieldValue(DBConstants::ELI_CAM_CONFIG_SPENT, $spent);
        $this->setFieldValue(DBConstants::ELI_CAM_CONFIG_STATUS, $status);
        $this->setFieldValue(DBConstants::ELI_CAM_CONFIG_CREATE_TIME, $createTime);
        $this->setFieldValue(DBConstants::ELI_CAM_CONFIG_LAST_MODIFY_TIME, $modifyTime);
    }

    protected function initTableFields()
    {
        $this->addField(DBConstants::ELI_CAM_CONFIG_ID, STRING, "");
        $this->addField(DBConstants::ELI_CAM_CONFIG_CAMPAIGN_ID, STRING, "");
        $this->addField(DBConstants::ELI_CAM_CONFIG_PUBLISHER_ID, STRING, "");
        $this->addField(DBConstants::ELI_CAM_CONFIG_BUDGET, INTEGER, 0);
        $this->addField(DBConstants::ELI_CAM_CONFIG_SPENT, INTEGER, 0);
        $this->addField(DBConstants::ELI_CAM_CONFIG_STATUS, INTEGER, 0);
        $this->addField(DBConstants::ELI_CAM_CONFIG_CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(DBConstants::ELI_CAM_CONFIG_LAST_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }

}