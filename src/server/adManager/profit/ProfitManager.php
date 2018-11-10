<?php

use FacebookAds\Object\Values\AdSetBillingEventValues;

class ProfitManager
{
    private static $instance = null;

    private function __construct()
    {

    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function adjustProfit($configCampaignReports)
    {
        foreach($configCampaignReports as $configId=>$campaignReports)
        {
            $oldProfit = $this->getOldProfit($configId);

            if(false === $oldProfit)
            {
                ServerLogger::instance()->writeLog(Error, 'Cannot get old profit by configId : ' . $configId);
                return false;
            }
            $dailySpendEntity = $this->getDailySpendEntity($configId, $oldProfit, $campaignReports);
            $insertResult = ProfitDBFacade::instance()->insertDailySpendRecord($dailySpendEntity);
            if(OK != $insertResult)
            {
                ServerLogger::instance()->writeLog(Error, 'Cannot insert daily Spend of configId : ' . $configId . '; errorCode: ' . $insertResult);
                return false;
            }

            //根据目标与实际参数差距重新调整profit(后面再详细设计)；现在打桩直接读取配置文件profit
            $newProfitPercent = $this->getNewProfit();

            //数据库更新profit
            $updateResult = ProfitDBFacade::instance()->updateProfitByConfigId($newProfitPercent, $configId);
            if(OK != $updateResult)
            {
                ServerLogger::instance()->writeLog(Error, 'Cannot update profit of configId : ' . $configId . '; errorCode: '
                    . $updateResult . '; new profit : ' . $newProfitPercent);
                return false;
            }

            //更新adset budget
            $oldProfitPercent = $oldProfit->getProfitPercent();
            $this->updateAllAdsetBudget($configId, $newProfitPercent, $oldProfitPercent);
        }
    }

    private function getNewProfit()
    {
        //$filePath = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_PROFIT_CONFIG_FILE);
        $filePath = EL_SERVER_PATH . 'serverTest/resources/profit.json';
        $profitArray = FileHelper::readJsonFile($filePath);
        if(!is_array($profitArray))
        {
            return ProfitConstants::PROFIT_PERCENT_DEFAULT;
        }
        if(array_key_exists(ProfitConstants::PROFIT_CONFIG_FILE_KEY, $profitArray))
        {
            return $profitArray[ProfitConstants::PROFIT_CONFIG_FILE_KEY];
        }

        return ProfitConstants::PROFIT_PERCENT_DEFAULT;
    }

    private function updateAllAdsetBudget($configId, $newProfit, $oldProfit)
    {
        $campaignIds = ProfitDBFacade::instance()->getCampaignIdByConfigId($configId);
        foreach ($campaignIds as $campaignId)
        {
            $adsetEntities = AdManagerFacade::getAdsetByCampaignId($campaignId);
            if(false === $adsetEntities)
            {
                ServerLogger::instance()->writeLog(Warning, 'Cannot get adset by campaignId : ' . $campaignId);
                continue;
            }

            $this->handleAdsets($adsetEntities, $newProfit, $oldProfit);
        }

        return true;
    }

    private function handleAdsets($adsets, $newProfit, $oldProfit)
    {
        $convertPercent = round(CommonHelper::divisionOperate((100-$newProfit), (100-$oldProfit)), 6);
        foreach($adsets as $adset)
        {
            $dailyBudget = $adset->getDailyBudget();
            $billEvent = $adset->getBillEvents();
            $isAutoBid = $adset->getIsAutobid();
            $bidAmount = $adset->getBitAmount();
            $minBudget = $this->getDailyBudgetMinLimit($billEvent, $isAutoBid, $bidAmount);

            if($dailyBudget > 0)
            {
                $newDailyBudget = floor($convertPercent*$dailyBudget);
                $validBudget = max($newDailyBudget, $minBudget);
                $updateResult = AdManagerFacade::updateAdsetBudget($adset->getId(), $validBudget, true);
                if(false === $updateResult)
                {
                    ServerLogger::instance()->writeLog(Error, 'Failed to update daily Budget of adset : '
                        . $adset->getId());
                }
                continue;
            }

            $lifeTimeBudget = $adset->getLifetimeBudget();
            if($lifeTimeBudget > 0)
            {
                $budgetRemain = $adset->getBudgetRemaining();
                $newLifetimeBudget = ($lifeTimeBudget - $budgetRemain) + floor($budgetRemain*$convertPercent);

                $startTime = new DateTime($adset->getStartTime());
                $endTime = new DateTime($adset->getEndTime());
                $dayCounts = CommonHelper::getDayCountBetweenDate($startTime, $endTime);
                $validLifeBudget = max($newLifetimeBudget, $dayCounts*$minBudget);

                $updateResult = AdManagerFacade::updateAdsetBudget($adset->getId(), $validLifeBudget, false);
                if(false === $updateResult)
                {
                    ServerLogger::instance()->writeLog(Error, 'Failed to update lifeTime Budget of adset : '
                        . $adset->getId());
                }
                continue;
            }
        }
    }

    private function getDailyBudgetMinLimit($billEvent, $isAutoBid, $bidAmount)
    {
        if($isAutoBid)
        {
            if($billEvent === AdSetBillingEventValues::IMPRESSIONS)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_IMPRESSION_MIN_LIMIT;
            }
            else if($billEvent === AdSetBillingEventValues::CLICKS)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_CLICK_MIN_LIMIT;
            }
            else if($billEvent === AdSetBillingEventValues::LINK_CLICKS)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_CLICK_MIN_LIMIT;
            }
            else if($billEvent === AdSetBillingEventValues::APP_INSTALLS)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_INSTALL_MIN_LIMIT;
            }
        }
        else
        {
            if($billEvent === AdSetBillingEventValues::IMPRESSIONS)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_IMPRESSION_MIN_LIMIT;
            }
            else
            {
                return 5*$bidAmount;
            }
        }
    }

    private function getDailySpendEntity($configId, $oldProfit, $campaignReports)
    {
        $profitPercent = $oldProfit->getProfitPercent();
        $marginPercent = $oldProfit->getMarginPercent();
        $dailyBudget = $oldProfit->getDailyBudget();

        $currentDateTime = CommonHelper::getCurrentDateTime();

        $spend = $this->getReportInfo($campaignReports);

        $dailySpendEntity = new DailySpendEntity();

        $uuid = CPublic::getGuid();
        $dailySpendEntity->setUuid($uuid);
        $dailySpendEntity->setConfigId($configId);
        $dailySpendEntity->setProfitPercent($profitPercent);
        $dailySpendEntity->setDailyBudget($dailyBudget);
        $dailySpendEntity->setMarginPercent($marginPercent);
        $dailySpendEntity->setDailySpend($spend);
        $dailySpendEntity->setCurrentDate($currentDateTime);

        return $dailySpendEntity;

    }

    private function getOldProfit($configId)
    {
        //获取原profit
        $oldProfits = ProfitDBFacade::instance()->getProfitByConfigId($configId);
        if(empty($oldProfits))
        {
            ServerLogger::instance()->writeLog(Error, 'Cannot get profit by configId : ' . $configId);
            return false;
        }

        return $oldProfits[0];
    }

    private function getReportInfo($campaignReports)
    {
        $spend = 0;
        foreach($campaignReports as $reportEntity)
        {
            $spend += $reportEntity->getSpend();
        }

        return $spend;
    }
}