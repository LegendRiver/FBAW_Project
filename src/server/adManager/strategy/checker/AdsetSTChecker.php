<?php


class AdsetSTChecker extends AbstractStrategyChecker
{
    private $logPrefix = '';

    //数量限制
    //竞价最小值限制
    //安卓版本号验证
    //是否与campaign匹配
    //地域范围判断
    //各Targeting 数量等限制，如年龄大小，语言数量， 城市半径长度限制
    //appinstall targeting 要求要限制

    protected function checkJsonContent()
    {
        $adsetInfos = $this->fileParser->getAdsetMap();

        foreach($adsetInfos as $adsetPid => $adsetInfo)
        {
            $this->logPrefix = 'Adset name : ' . $adsetInfo[StrategyConstants::ST_ADSET_NAME] . ' ; ';
            //通用检查
            $commonCheckResult = $this->adsetCommonCheck($adsetInfo);
            if(false === $commonCheckResult)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'Failed to pass the adset common check.');
                return ERR_STRATEGY_ADSET_COMMON_CHECK;
            }

            $targetingInfo = $adsetInfo[StrategyConstants::ST_ADSET_TARGETING];
            $targetingResult = $this->checkTargeting($targetingInfo);
            if(OK != $targetingResult)
            {
                return $targetingResult;
            }

            $bidBudgetResult = $this->checkBidBudget($adsetInfo);
            if(OK != $bidBudgetResult)
            {
                return $bidBudgetResult;
            }

            $billEventResult = $this->checkBillEvent($adsetInfo);
            if(OK != $billEventResult)
            {
                return $billEventResult;
            }

            if($this->campaignType == StrategyConstants::ST_V_CAMPAIGN_TYPE_PROUCTSALES)
            {
                $productSetId = $adsetInfo[StrategyConstants::ST_ADSET_PROMOTED_PRODUCTSET_ID];
                if(empty($productSetId))
                {
                    ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix .
                        'The product set id of adset is empty in product sales Campaign.');
                    return ERR_PRODUCT_SET_ID_NULL;
                }
            }
        }

        return OK;
    }

    private function adsetCommonCheck($adsetInfo)
    {
        $targetingArray = $adsetInfo[StrategyConstants::ST_ADSET_TARGETING];
        unset($adsetInfo[StrategyConstants::ST_ADSET_TARGETING]);
        $checkInfo = array_merge($adsetInfo, $targetingArray);

        return $this->checkFieldValueValid($checkInfo);
    }

    private function checkBillEvent($adsetInfo)
    {
        $optimization = $adsetInfo[StrategyConstants::ST_ADSET_OPTIMIZATION_GOAL];
        $billEvent = $adsetInfo[StrategyConstants::ST_ADSET_BILL_EVENT];
        if($optimization == StrategyConstants::ST_V_OPTIMIZATION_APPINSTALL)
        {
            if($billEvent == StrategyConstants::ST_V_BILLEVENT_CLICK)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'There is not billEvent('. $billEvent .
                    ') in optimization goal('. $optimization .').');
                return ERR_BILL_EVENT_VALUE;
            }
        }
        else if($optimization  == StrategyConstants::ST_V_OPTIMIZATION_LINKCLICK)
        {
            if($billEvent == StrategyConstants::ST_V_BILLEVENT_APPINSTALL)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'There is not billEvent('. $billEvent .
                    ') in optimization goal('. $optimization .').');
                return ERR_BILL_EVENT_VALUE;
            }
        }

        return OK;
    }

    private function checkBidBudget($adsetInfo)
    {
        $adsetName = $adsetInfo[StrategyConstants::ST_ADSET_NAME];
        $bidAmount = $adsetInfo[StrategyConstants::ST_ADSET_BID_AMOUNT];
        $budgetAmount = $adsetInfo[StrategyConstants::ST_ADSET_BUDGET_AMOUNT];
        $budgetType = $adsetInfo[StrategyConstants::ST_ADSET_BUDGET_TYPE];
        $billEvent = $adsetInfo[StrategyConstants::ST_ADSET_BILL_EVENT];

        if(!CommonHelper::checkFbMoneyInt($bidAmount))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'The bidAmount is not int type : ' . $bidAmount);
            return ERR_MONEY_IS_NOT_INT;
        }
        if(!CommonHelper::checkFbMoneyInt($budgetAmount))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'The budgetAmount is not int type : ' . $budgetAmount);
            return ERR_MONEY_IS_NOT_INT;
        }

        if(0 != $bidAmount)
        {
            if($bidAmount < AdManageConstants::BID_AMOUNT_MIN_LIMIT)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The bid amount of ' . $adsetName . 'is less than 1 cent.');
                return ERR_BID_AMOUNT_SMALL;
            }
        }

        if(StrategyConstants::ST_V_BUDGET_TYPE_DAILY === $budgetType)
        {
            if(AdManageConstants::DAILY_BUDGET_MAX_LIMIT < $budgetAmount)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The daily budget is great than '.
                    AdManageConstants::DAILY_BUDGET_MAX_LIMIT . '. The adset is :' . $adsetName);
                return ERR_DAILY_BUDGET_GREAT;
            }

            $dailyBudgetMinLimit = $this->getDailyBudgetMinLimit($billEvent, $bidAmount);
            if($dailyBudgetMinLimit > $budgetAmount)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The daily budget is less than '.
                    $dailyBudgetMinLimit . '. The adset is :' . $adsetName);
                return ERR_DAILY_BUDGET_SMALL;
            }
        }
        else
        {
            $startTime = new DateTime($adsetInfo[StrategyConstants::ST_ADSET_START_TIME]);
            $endTime = new DateTime($adsetInfo[StrategyConstants::ST_ADSET_END_TIME]);
            $days = CommonHelper::getDayCountBetweenDate($startTime, $endTime);
            if(0 === $days)
            {
                return ERR_SCHEDULE_ZERO_DAY;
            }
            $budgetPerDay = $budgetAmount/$days;
            $dailyBudgetMinLimit = $this->getDailyBudgetMinLimit($billEvent, $bidAmount);
            if($dailyBudgetMinLimit > $budgetPerDay)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The daily budget is less than '.
                    $dailyBudgetMinLimit . '. The adset is :' . $adsetName);
                return ERR_DAILY_BUDGET_SMALL;
            }
        }

        return OK;
    }

    private function getDailyBudgetMinLimit($billEvent, $bidAmount)
    {
        if(0 == $bidAmount)
        {
            if($billEvent === StrategyConstants::ST_V_BILLEVENT_IMPRESSION)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_IMPRESSION_MIN_LIMIT;
            }
            else if($billEvent === StrategyConstants::ST_V_BILLEVENT_CLICK)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_CLICK_MIN_LIMIT;
            }
            else if($billEvent === StrategyConstants::ST_V_BILLEVENT_APPINSTALL)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_INSTALL_MIN_LIMIT;
            }
        }
        else
        {
            if($billEvent === StrategyConstants::ST_V_BILLEVENT_IMPRESSION)
            {
                return AdManageConstants::DAILY_BUDGET_AUTO_IMPRESSION_MIN_LIMIT;
            }
            else
            {
                return 5*$bidAmount;
            }
        }
    }


    private function checkTargeting($targetingInfo)
    {
        $ageMin = $targetingInfo[StrategyConstants::ST_TARGETING_AGE_MIN];
        if(!is_int($ageMin))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'The ageMin is not int type : ' . $ageMin);
            return ERR_MONEY_IS_NOT_INT;
        }
        if($ageMin < TargetingConstants::AGE_MIN_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The age min is less than ' . TargetingConstants::AGE_MIN_LIMIT);
            return ERR_AGE_MIN_SMALL;
        }

        $ageMax = $targetingInfo[StrategyConstants::ST_TARGETING_AGE_MAX];
        if(!is_int($ageMax))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'The ageMax is not int type : ' . $ageMax);
            return ERR_MONEY_IS_NOT_INT;
        }
        if($ageMax > TargetingConstants::AGE_MAX_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The age max is greater than ' . TargetingConstants::AGE_MAX_LIMIT);
            return ERR_AGE_MAX_GREAT;
        }

        $countries = $targetingInfo[StrategyConstants::ST_TARGETING_COUNTRIES];
        if(count($countries) > TargetingConstants::COUNTRY_COUNT_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count of countries is greater than ' . TargetingConstants::COUNTRY_COUNT_LIMIT);
            return ERR_COUNTRY_COUNT_GREAT;
        }

        $countryCheck = $this->checkCountry($countries);
        if(OK != $countryCheck)
        {
            return $countryCheck;
        }

        $locales = $targetingInfo[StrategyConstants::ST_TARGETING_LOCALE];
        if(is_array($locales) && count($locales) > TargetingConstants::LOCALE_LUANGUE_COUNT_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count of locales is greater than ' . TargetingConstants::LOCALE_LUANGUE_COUNT_LIMIT);
            return ERR_LOCALE_COUNT_GREAT;
        }

        $localeCheck = $this->checkLocales($locales);
        if(OK != $localeCheck)
        {
            return $localeCheck;
        }

        return OK;
    }

    private function checkCountry($countries)
    {
        foreach($countries as $country)
        {
            $isValid = CountryLocaleHelper::instance()->isCountryValid($country);
            if(!$isValid)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The country name can not find in table : ' . $country);
                return ERR_COUNTRY_NAME_INVALID;
            }
        }

        return OK;
    }

    private function checkLocales($locales)
    {
        foreach($locales as $locale)
        {
            $isValid = CountryLocaleHelper::instance()->isLocaleValid($locale);
            if(!$isValid)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The locale name can not find in table : ' . $locale);
                return ERR_LOCALE_NAME_INVALID;
            }
        }

        return OK;
    }

    protected function initFieldInfo()
    {
        $this->notNullFields = array(
            StrategyConstants::ST_ADSET_NAME,
            StrategyConstants::ST_ADSET_OPERATION,
            StrategyConstants::ST_ADSET_BUDGET_TYPE,
            StrategyConstants::ST_ADSET_SCHEDULE_TYPE,
            StrategyConstants::ST_ADSET_START_TIME,
            StrategyConstants::ST_ADSET_END_TIME,
            StrategyConstants::ST_ADSET_BUDGET_AMOUNT,
            StrategyConstants::ST_ADSET_OPTIMIZATION_GOAL,
            StrategyConstants::ST_ADSET_BILL_EVENT,
            StrategyConstants::ST_ADSET_BID_AMOUNT,
            StrategyConstants::ST_ADSET_APP_URL,

            StrategyConstants::ST_TARGETING_COUNTRIES,
        );

        $this->field2Values = array(
            StrategyConstants::ST_ADSET_STATUS => array(
                StrategyConstants::ST_V_NODE_STATUS_PAUSED,
                StrategyConstants::ST_V_NODE_STATUS_ACTIVE,),

            StrategyConstants::ST_ADSET_LINK_AD_TYPE => array(
                StrategyConstants::ST_V_LINKDATA_TYPE_ALL,
                StrategyConstants::ST_V_LINKDATA_TYPE_NORMAL,
                StrategyConstants::ST_V_LINKDATA_TYPE_NONE,),

            StrategyConstants::ST_TARGETING_GENDER => array(
                StrategyConstants::ST_V_GENDER_ALL,
                StrategyConstants::ST_V_GENDER_MALE,
                StrategyConstants::ST_V_GENDER_FEMALE,),

            StrategyConstants::ST_ADSET_BUDGET_TYPE => array(
                StrategyConstants::ST_V_BUDGET_TYPE_DAILY,
                StrategyConstants::ST_V_BUDGET_TYPE_SCHEDULE,),

            StrategyConstants::ST_ADSET_SCHEDULE_TYPE => array(
                StrategyConstants::ST_V_SCHEDULE_TYPE_ALLTIME,
                StrategyConstants::ST_V_SCHEDULE_TYPE_SCHEDULE,),

            StrategyConstants::ST_ADSET_OPTIMIZATION_GOAL => array(
                StrategyConstants::ST_V_OPTIMIZATION_APPINSTALL,
                StrategyConstants::ST_V_OPTIMIZATION_LINKCLICK,
                StrategyConstants::ST_V_OPTIMIZATION_OFFSITE_CONVERSION,),

            StrategyConstants::ST_ADSET_BILL_EVENT => array(
                StrategyConstants::ST_V_BILLEVENT_IMPRESSION,
                StrategyConstants::ST_V_BILLEVENT_CLICK,
                StrategyConstants::ST_V_BILLEVENT_APPINSTALL,),

            StrategyConstants::ST_ADSET_DELIVERY_TYPE => array(
                StrategyConstants::ST_V_DELIVERY_TYPE_STANDARD,
                StrategyConstants::ST_V_DELIVERY_TYPE_ACCELERATE,),
        );
    }
}