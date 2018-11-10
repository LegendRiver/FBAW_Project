<?php


class ProfitHandler
{
    public static function handleSyncProfit($campaignInfo)
    {
        $configProfitArray = array();

        $configs = $campaignInfo[SyncConstants::CAMPAIGN_JSON_CONFIGS];
        $startDate = $campaignInfo[DBConstants::ELI_CAMPAIGN_SCHEDULE_START];
        $endDate = $campaignInfo[DBConstants::ELI_CAMPAIGN_SCHEDULE_END];

        $dayCount = self::getDayCount($startDate, $endDate);
        if(false === $dayCount)
        {
            return false;
        }

        foreach($configs as $camConfig)
        {
            $configId = $camConfig[DBConstants::ELI_CAM_CONFIG_ID];
            //先数据查
            $profitArray = ProfitDBFacade::instance()->getProfitByConfigId($configId);
            if(false === $profitArray)
            {
                ServerLogger::instance()->writeLog(Error, 'Exception when select profit by configId : ' . $configId);
                return false;
            }

            if(count($profitArray) > 0)
            {
                $entity = $profitArray[0];
            }
            else
            {
                //查不到再创建插入数据库
                $entity = new ProfitDBEntity();

                $configId = $camConfig[DBConstants::ELI_CAM_CONFIG_ID];
                $uiTotalBudget = $camConfig[DBConstants::ELI_CAM_CONFIG_BUDGET];
                $uiDailyBudget = CommonHelper::divisionOperate($uiTotalBudget, $dayCount);

                $entity->setConfigId($configId);
                $entity->setDailyBudget(round($uiDailyBudget));
                $entity->setProfitPercent(ProfitConstants::PROFIT_PERCENT_DEFAULT);
                $entity->setMarginPercent(ProfitConstants::MARGIN_PERCENT_DEFAULT);
                $entity->setUpdateTime(date('Y-m-d H:i:s'));

                $insertResult = ProfitDBFacade::instance()->insertProfitRecord($entity);
                if(OK != $insertResult)
                {
                    ServerLogger::instance()->writeLog(Error, 'Failed to insert profig : ' . $configId);
                    return false;
                }
            }

            $configProfitArray[$configId] = $entity;
        }

        return $configProfitArray;
    }

    private static function getDayCount($startDate, $endDate)
    {
        if(!is_string($startDate) || 0==strlen($startDate))
        {
            ServerLogger::instance()->writeLog(Error, 'The Start schedule date is invalid : ' . $startDate);
            return false;
        }

        if(!is_string($startDate) || 0==strlen($startDate))
        {
            return ProfitConstants::SCHEDULE_DAY_COUNT_DEFAULT;
        }

        $start = new DateTime($startDate);
        $end = new DateTime($endDate);
        $days = CommonHelper::getDayCountBetweenDate($start, $end);

        return $days;
    }

}