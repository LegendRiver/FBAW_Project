<?php


class AWManagerFacade
{
    public static function queryCampaignReport($accountId, $awql)
    {
        return AWReportManager::getInstance()->queryReportData($accountId, $awql);
    }

    public static function createUAC(UACCampaignParam $param)
    {
        $campaign = AWCampaignManager::getInstance()->createCampaign($param);
        $accountId = $param->getAccountId();
        if(false === $campaign)
        {
            //删除budget
            $budgetId = $param->getBudgetId();
            $removedBudget = AWBudgetManager::getInstance()->removeBudget($accountId, $budgetId);
            if(false === $removedBudget)
            {
                ServerLogger::instance()->writeAdwordsLog(Error, 'Failed to remove budget: ' . $budgetId .
                    ' of account: ' . $accountId);
            }
            return false;
        }

        $campaignId = $campaign->getId();
        $criteriaList = self::buildCampaignCriteria($param, $campaignId);
        $result = AWCampaignManager::getInstance()->addCountryCriteria($accountId, $criteriaList);
        if(false === $result)
        {
            ServerLogger::instance()->writeAdwordsLog(Error, 'Failed to add location to campaign: ' . $campaignId);
        }

        return $campaign;
    }

    private static function buildCampaignCriteria(AWCampaignParam $param, $campaignId)
    {
        $criteriaList = array();
        $locationIds = $param->getLocationId();
        if(!empty($locationIds))
        {
            foreach ($locationIds as $id)
            {
                $criteria = CampaignCriteriaFactory::createLocationCriteria($id, $campaignId);
                $criteriaList[] = $criteria;
            }
        }

        $languageIds = $param->getLanguageId();
        if(!empty($languageIds))
        {
            foreach($languageIds as $lanId)
            {
                $criteriaLan = CampaignCriteriaFactory::createLanguageCriteria($lanId, $campaignId);
                $criteriaList[] = $criteriaLan;
            }
        }

        return $criteriaList;
    }

    public static function buildUACSetting($appId, $descList, $imageIds = array())
    {
        return CampaignSettingFactory::createUACSetting($appId, $descList, $imageIds);
    }

    public static function createBudget($budgetName, $budgetAmount, $accountId, $isExplicitly = true, $isAccelerate=false)
    {
        return  AWBudgetManager::getInstance()->createBudget($budgetName, $budgetAmount, $accountId, $isExplicitly, $isAccelerate);
    }

    public static function createCpaBidConfig($bidAmount)
    {
        return AWBidStrategyManager::getInstance()->createCpaBidConfig($bidAmount);
    }
}