<?php


class EliDBEntityBuilder
{
    public static function buildEliCampaignEntity($campainInfo, $profitMap)
    {
        $entity = new EliCampaignEntity();
        $entity->setId($campainInfo[DBConstants::ELI_CAMPAIGN_ID]);
        $entity->setAccountId($campainInfo[DBConstants::ELI_CAMPAIGN_ELI_ACCOUNT_ID]);
        $entity->setName($campainInfo[DBConstants::ELI_CAMPAIGN_NAME]);
        $entity->setCampaignType($campainInfo[DBConstants::ELI_CAMPAIGN_CAMPAIGN_TYPE]);
        $entity->setUrl($campainInfo[DBConstants::ELI_CAMPAIGN_URL]);
        $entity->setTitle($campainInfo[DBConstants::ELI_CAMPAIGN_TITLE]);
        $entity->setDescription($campainInfo[DBConstants::ELI_CAMPAIGN_DESCRIPTION]);
        $entity->setImageList($campainInfo[DBConstants::ELI_CAMPAIGN_IMAGE_LIST]);
        $entity->setScheduleStart($campainInfo[DBConstants::ELI_CAMPAIGN_SCHEDULE_START]);
        $entity->setScheduleEnd($campainInfo[DBConstants::ELI_CAMPAIGN_SCHEDULE_END]);
        $entity->setTimeStart($campainInfo[DBConstants::ELI_CAMPAIGN_TIME_START]);
        $entity->setTimeEnd($campainInfo[DBConstants::ELI_CAMPAIGN_TIME_END]);
        $entity->setAudience(json_encode($campainInfo[DBConstants::ELI_CAMPAIGN_AUDIENCE]));
        $entity->setStatus($campainInfo[DBConstants::ELI_CAMPAIGN_STATUS]);
        $entity->setBudget($campainInfo[DBConstants::ELI_CAMPAIGN_BUDGET]);
        $entity->setSpend($campainInfo[DBConstants::ELI_CAMPAIGN_SPENT]);
        $entity->setDeliveryType($campainInfo[DBConstants::ELI_CAMPAIGN_DELIVERY_TYPE]);
        $entity->setKeyWord($campainInfo[DBConstants::ELI_CAMPAIGN_KEYWORD]);
        $entity->setMatchType($campainInfo[DBConstants::ELI_CAMPAIGN_MATCH_TYPE]);
        $entity->setCreateTime($campainInfo[DBConstants::ELI_CAMPAIGN_CREATE_TIME]);
        $entity->setModifyTime($campainInfo[DBConstants::ELI_CAMPAIGN_LAST_MODIFY_TIME]);

        $configs = $campainInfo[SyncConstants::CAMPAIGN_JSON_CONFIGS];
        $configEntitys = static::buildCamConfigList($configs, $profitMap);
        $entity->setCamConfigArray($configEntitys);

        return $entity;

    }

    private static function buildCamConfigList($configArray, $profitMap)
    {
        $entityArray = array();

        foreach($configArray as $configParam)
        {
            $entity = new CamConfigEntity();
            $configId = $configParam[DBConstants::ELI_CAM_CONFIG_ID];
            $entity->setConfigId($configId);
            $entity->setCampaignId($configParam[DBConstants::ELI_CAM_CONFIG_CAMPAIGN_ID]);
            $entity->setPublisherId($configParam[DBConstants::ELI_CAM_CONFIG_PUBLISHER_ID]);

            $uiBudget = $configParam[DBConstants::ELI_CAM_CONFIG_BUDGET];
            if(array_key_exists($configId, $profitMap))
            {
                $profitEntity = $profitMap[$configId];
                $profitPercent = $profitEntity->getProfitPercent();
            }
            else
            {
                ServerLogger::instance()->writeLog(Warning, 'Cannot get profit by configId : ' . $configId);
                $profitPercent = ProfitConstants::PROFIT_PERCENT_DEFAULT;
            }
            $actualBudget = $uiBudget*(1-($profitPercent/100));
            $entity->setBudget($actualBudget);

            $entity->setSpent($configParam[DBConstants::ELI_CAM_CONFIG_SPENT]);
            $entity->setStatus($configParam[DBConstants::ELI_CAM_CONFIG_STATUS]);
            $entity->setCreateTime($configParam[DBConstants::ELI_CAM_CONFIG_CREATE_TIME]);
            $entity->setModifyTime($configParam[DBConstants::ELI_CAM_CONFIG_LAST_MODIFY_TIME]);

            $entityArray[] = $entity;
        }

        return $entityArray;
    }
}