<?php


class StrategyInputParamBuilder
{

    public static function buildStrategyParam($campaignInfo)
    {
        $strategyParamArray = array();

        $commonParams = array();
        $accountId = 'act_584939305020122'; //需要重新调用
        $commonParams[SyncConstants::STRATEGY_PARAM_ACCOUNT_ID] = $accountId;

        $operation = SyncConstants::PARAM_OPERATE_VALUE_NEW;
        $commonParams[SyncConstants::STRATEGY_PARAM_OPERATION] = $operation;

        $discount = array();
        $commonParams[SyncConstants::STRATEGY_PARAM_BID_DISCOUNT] = $discount;
        $commonParams[SyncConstants::STRATEGY_PARAM_PYOBJECT] = SyncConstants::PARAM_PYOBJECT_DEFAULT_VALUE;

        $campaignType = self::getCampaignType($campaignInfo[DBConstants::ELI_CAMPAIGN_CAMPAIGN_TYPE]);
        if(false === $campaignType)
        {
            return false;
        }
        $commonParams[SyncConstants::STRATEGY_PARAM_CAMPAIGN_TYPE] = $campaignType;

        $startDate = $campaignInfo[DBConstants::ELI_CAMPAIGN_SCHEDULE_START];
        $endDate = $campaignInfo[DBConstants::ELI_CAMPAIGN_SCHEDULE_END];
        $commonParams[SyncConstants::STRATEGY_PARAM_TIME_END] = $endDate;
        $commonParams[SyncConstants::STRATEGY_PARAM_TIME_START] = $startDate;

        $url = $campaignInfo[DBConstants::ELI_CAMPAIGN_URL];
        $commonParams[SyncConstants::STRATEGY_PARAM_URL] = $url;

        $audience = $campaignInfo[DBConstants::ELI_CAMPAIGN_AUDIENCE];
        $commonParams[SyncConstants::STRATEGY_PARAM_GENDER] = $audience[SyncConstants::AUDIENCE_GENDER];

        $ageArray = $audience[SyncConstants::AUDIENCE_AGE];
        if(!is_array($ageArray))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'The age is not array.');
            return false;
        }
        $commonParams[SyncConstants::STRATEGY_PARAM_AGE_MIN] = max($ageArray[0], TargetingConstants::AGE_MIN_LIMIT);
        $commonParams[SyncConstants::STRATEGY_PARAM_AGE_MAX] = min($ageArray[1], TargetingConstants::AGE_MAX_LIMIT);

        $countries = $audience[SyncConstants::AUDIENCE_COUNTRIES];
        $countryNameArray = array();
        foreach ($countries as $countryTuple)
        {
            $name = $countryTuple[0];
            $countryNameArray[] = $name;
        }
        $commonParams[SyncConstants::STRATEGY_PARAM_COUNTRIES] = $countryNameArray;

        $configs = $campaignInfo[SyncConstants::CAMPAIGN_JSON_CONFIGS];

        foreach($configs as $config)
        {
            $partArray = array();
            $configId = $config[DBConstants::ELI_CAM_CONFIG_ID];
            $partArray[SyncConstants::STRATEGY_PARAM_CONFIG_ID] = $configId;

            $budget = $config[DBConstants::ELI_CAM_CONFIG_BUDGET];
            $partArray[SyncConstants::STRATEGY_PARAM_SPEND_CAP] = $budget;

            $publisherId = $config[DBConstants::ELI_CAM_CONFIG_BUDGET];
            $publisher = self::getPublisher($publisherId);
            $partArray[SyncConstants::STRATEGY_PARAM_PUBLISHER] = $publisher;

            $bidEstimate = self::getBidEstimate($commonParams, $budget, $campaignType, $url, $accountId);
            if(false === $bidEstimate)
            {
                ServerLogger::instance()->writeLog(Error, 'Failed to get bidEstimate');
                return false;
            }
            $partArray[SyncConstants::STRATEGY_PARAM_SUGGEST_BID] = $bidEstimate;

            $mergerArray = array_merge($commonParams, $partArray);

            $strategyParamArray[] = $mergerArray;
        }

        return $strategyParamArray;
    }

    private static function getBidEstimate($commonParams, $budget, $campaignType, $url, $accountId)
    {
        $adsetParam = new AdsetCreateParam();
        $adsetParam->setAccountId($accountId);

        $gender = self::getGender($commonParams[SyncConstants::STRATEGY_PARAM_GENDER]);
        $adsetParam->setGenderArray($gender);

        $adsetParam->setAgeMax($commonParams[SyncConstants::STRATEGY_PARAM_AGE_MAX]);
        $adsetParam->setAgeMin($commonParams[SyncConstants::STRATEGY_PARAM_AGE_MIN]);

        $countries = self::getCountryCodes($commonParams[SyncConstants::STRATEGY_PARAM_COUNTRIES]);
        if(false === $countries)
        {
            return false;
        }
        $adsetParam->setCountryArray($countries);

        //$adsetParam->setLocaleArray(array(6,));
        //$adsetParam->setInterestDesc('mobile game');
        //$adsetParam->setUserOsArray(array(TargetingConstants::USER_OS_IOS,));
        //$adsetParam->setDevicePlatformArray(array(TargetingConstants::DEVICE_PLATFORM_MOBILE));

        $adsetParam->setBudgetType(AdManageConstants::ADSET_BUDGET_TYPE_SCHEDULE);
        $adsetParam->setBudgetAmount($budget);

        if(SyncConstants::ELI_DB_CAMLPAIGN_TYPE_APP == $campaignType)
        {
            $adsetParam->setOptimization(AdManageConstants::ADSET_OPTIMIZATION_APPINSTALL);
            $adsetParam->setApplicationUrl($url);
        }

        $bidEstimates = BidEstimateBuilder::estimateBid($adsetParam);
        if(empty($bidEstimates))
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to get bid estimate by :' . print_r($adsetParam, true));
            return false;
        }

        return $bidEstimates;
    }

    private static function getCountryCodes($countryArray)
    {
        $codeArray = array();
        foreach($countryArray as $country)
        {
            $countryCode = CountryLocaleHelper::instance()->getCountryCode($country);
            if(false === $countryCode)
            {
                ServerLogger::instance()->writeLog(Error, 'Failed to get country Code by ' . $country);
                return false;
            }
            $codeArray[] = $countryCode;
        }

        return $codeArray;

    }

    private static function getGender($audienceGender)
    {
        if($audienceGender === StrategyConstants::ST_V_GENDER_FEMALE)
        {
            return array(TargetingConstants::GENDER_FEMALE);
        }
        else if($audienceGender === StrategyConstants::ST_V_GENDER_MALE)
        {
            return array(TargetingConstants::GENDER_MALE);
        }
        else
        {
            return array(TargetingConstants::GENDER_MALE, TargetingConstants::GENDER_FEMALE);
        }
    }

    private static function getPublisher($publisherId)
    {
        //后续增加判断
        return SyncConstants::PARAM_PUBLSHER_FACEBOOK;
    }

    private static function getCampaignType($dbType)
    {
        if(SyncConstants::ELI_DB_CAMLPAIGN_TYPE_APP == $dbType)
        {
            return SyncConstants::PARAM_CAMPAIGN_TYPE_APP_INSTALL;
        }
        else if(SyncConstants::ELI_DB_CAMLPAIGN_TYPE_WEBSITE == $dbType)
        {
            return SyncConstants::PARAM_CAMPAIGN_TYPE_WEB_SITE;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'Can not find the campaign type :' . $dbType);
            return false;
        }
    }
}