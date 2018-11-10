<?php


class UACParameterBuilder
{
    private $paramConfigList;

    private $defaultMaterialPath;

    public function __construct($configFile)
    {
        $paramConfig = FileHelper::readJsonFile($configFile);
        $this->paramConfigList = $paramConfig[UACConstants::CONF_CAMPAIGN_LIST];
        $this->defaultMaterialPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'material';
    }

    public function buildUacParam()
    {
        $uacCampaignParamList = array();

        foreach ($this->paramConfigList as $camConf)
        {
            if(false === $this->checkParamValid($camConf))
            {
                continue;
            }

            $camParam = $this->createParamByConf($camConf);
            if(false === $camParam)
            {
                continue;
            }
            $uacCampaignParamList[] = $camParam;
        }

        return $uacCampaignParamList;
    }

    private function createParamByConf($camConf)
    {
        $uacParam = new UACCampaignParam();

        $accountId = $camConf[UACConstants::CONF_ACCOUNT_ID];
        $camName = $camConf[UACConstants::CONF_CAMPAIGN_NAME] . '_' . time();
        $budgetId = $camConf[UACConstants::CONF_BUDGET_ID];
        $budgetAmount = $camConf[UACConstants::CONF_BUDGET_AMOUNT];
        $bidAmount = $camConf[UACConstants::CONF_BID_AMOUNT];
        $startDate = $camConf[UACConstants::CONF_START_DATE];
        $endDate = $camConf[UACConstants::CONF_END_DATE];
        $appId = $camConf[UACConstants::CONF_APP_ID];
        $countryCodes = $camConf[UACConstants::CONF_COUNTRY_CODE];
        $descList = $camConf[UACConstants::CONF_DESC_LIST];
        $languages = $camConf[UACConstants::CONF_LANGUAGE];
        $imagePath = $camConf[UACConstants::CONF_IMAGE_PATH];
        $imageIds = $camConf[UACConstants::CONF_IMAGE_IDS];

        $campaignStatus = AWCampaignValues::CAMPAIGN_STATUS_PAUSED;
        $campaignType = AWCampaignValues::CAMPAIGN_TYPE_UAC;

        $imageIds = $this->getImageIds($imagePath, $imageIds, $accountId);
        $uacSetting = AWManagerFacade::buildUACSetting($appId, $descList, $imageIds);

        if(empty($budgetId))
        {
            $budgetName = 'budget_api_' . time();
            $budget = AWManagerFacade::createBudget($budgetName, $budgetAmount, $accountId, false);
            if(false === $budget)
            {
                return false;
            }
            $budgetId = $budget->getBudgetId();
        }

        $bidConfig = AWManagerFacade::createCpaBidConfig($bidAmount);
        $locationIDs = $this->getLocationIdByCountryCode($countryCodes);
        $languageIDs = $this->getLanguageIdByName($languages);

        $uacParam->setAccountId($accountId);
        $uacParam->setName($camName);
        $uacParam->setStatus($campaignStatus);
        $uacParam->setCampaignType($campaignType);
        $uacParam->setStartDate($startDate);
        $uacParam->setEndDate($endDate);
        $uacParam->setBudgetId($budgetId);
        $uacParam->setBidConfig($bidConfig);
        $uacParam->setUacSetting($uacSetting);
        $uacParam->setLocationId($locationIDs);
        $uacParam->setLanguageId($languageIDs);

        return $uacParam;
    }

    private function getImageIds($imagePath, $imageIds, $accountId)
    {
        if(!empty($imageIds))
        {
            return $imageIds;
        }
        else
        {
            return $this->uploadImages($imagePath, $accountId);
        }
    }


    private function uploadImages($imagePath, $accountId)
    {
        if(empty($imagePath))
        {
            $imagePath = $this->defaultMaterialPath;
        }

        $imageFiles = FileHelper::getRecursiveFileList($imagePath, array('.jpg', '.png'));

        $imageEntities = AWMediaManager::getInstance()->uploadImageToAdwords($imageFiles, $accountId);

        if(false === $imageEntities)
        {
            return array();
        }
        else
        {
            $imageIds = array();
            foreach ($imageEntities as $entity)
            {
               $imageIds[] = $entity->getMediaId();
            }
            return $imageIds;
        }
    }

    private function getLanguageIdByName($lanNames)
    {
        $idList = array();
        foreach ($lanNames as $name)
        {

            $id = AWConstantDataManager::getInstance()->getLanguageIdByName($name);
            if(empty($id))
            {
               continue;
            }

            $idList[] = $id;
        }
        return $idList;
    }

    private function getLocationIdByCountryCode($countryCodes)
    {
        if(empty($countryCodes))
        {
            return array();
        }
        else
        {
            $locationId = AWLocationManager::getInstance()->getIdByCountryCode($countryCodes);
            return $locationId;
        }
    }

    private function checkParamValid($camParam)
    {
        $accountId = $camParam[UACConstants::CONF_ACCOUNT_ID];
        $camName = $camParam[UACConstants::CONF_CAMPAIGN_NAME];
        $budgetId = $camParam[UACConstants::CONF_BUDGET_AMOUNT];
        $budgetAmount = $camParam[UACConstants::CONF_BUDGET_AMOUNT];
        $bidAmount = $camParam[UACConstants::CONF_BID_AMOUNT];
        $appId = $camParam[UACConstants::CONF_APP_ID];

        if(empty($appId))
        {
            ServerLogger::instance()->writeAdwordsLog(Error, '#UAC param# The appId id is empty.');
            return false;
        }

        if(empty($accountId))
        {
            ServerLogger::instance()->writeAdwordsLog(Error, '#UAC param# The account id is empty.');
            return false;
        }

        if(empty($camName))
        {
            ServerLogger::instance()->writeAdwordsLog(Error, '#UAC param# The campaign name is empty.');
            return false;
        }

        if(empty($budgetId) && empty($budgetAmount))
        {
            ServerLogger::instance()->writeAdwordsLog(Error, '#UAC param# The budget id is empty.');
            return false;
        }

        if(empty($bidAmount))
        {
            ServerLogger::instance()->writeAdwordsLog(Error, '#UAC param# The bid is empty.');
            return false;
        }

        return true;
    }
}