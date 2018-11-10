<?php


class AdsetParamHandler extends AbstractParamHandler
{
    protected function initParamInstanceFunction()
    {
        $this->paramInstance = new AdsetCreateParam();

        $this->field2SetFunction = array(
            StrategyConstants::ST_ADSET_NAME => 'setName',
            StrategyConstants::ST_ADSET_STATUS => 'setStatus',
            StrategyConstants::ST_ADSET_LINK_AD_TYPE => 'setLinkAdType',

            StrategyConstants::ST_TARGETING_GENDER => 'setGenderArray',
            StrategyConstants::ST_TARGETING_AGE_MIN => 'setAgeMin',
            StrategyConstants::ST_TARGETING_AGE_MAX => 'setAgeMax',
            StrategyConstants::ST_TARGETING_LOCALE => 'setLocaleArray',
            StrategyConstants::ST_TARGETING_COUNTRIES => 'setCountryArray',
            StrategyConstants::ST_TARGETING_INTEREST => 'setInterestDesc',
            StrategyConstants::ST_TARGETING_USER_OS => 'setUserOsArray',
            StrategyConstants::ST_TARGETING_DEVICE_PLATFORM => 'setDevicePlatformArray',
            StrategyConstants::ST_TARGETING_PUBLISHER_PLATFORM => 'setPublisherArray',
            StrategyConstants::ST_TARGETING_POSITION => 'setFbPositionArray',
            StrategyConstants::ST_TARGETING_USER_DEVICE => 'setUserDeviceArray',
            StrategyConstants::ST_TARGETING_EXCLUDE_DEVICE => 'setExcludeDeviceArray',
            StrategyConstants::ST_TARGETING_WIRELESS => 'setWirelessCarrier',
            StrategyConstants::ST_TARGETING_CUSTOM_AUDIENCE => 'setCustomAudienceIdArray',

            StrategyConstants::ST_ADSET_BUDGET_TYPE => 'setBudgetType',
            StrategyConstants::ST_ADSET_BUDGET_AMOUNT => 'setBudgetAmount',
            StrategyConstants::ST_ADSET_START_TIME => 'setStartTime',
            StrategyConstants::ST_ADSET_END_TIME => 'setEndTime',
            StrategyConstants::ST_ADSET_SCHEDULE_TYPE => 'setScheduleType',
            StrategyConstants::ST_ADSET_START_MIN => 'setStartMin',
            StrategyConstants::ST_ADSET_END_MIN => 'setEndMin',
            StrategyConstants::ST_ADSET_BID_AMOUNT => 'setBidAmount',
            StrategyConstants::ST_ADSET_APP_URL => 'setApplicationUrl',
            StrategyConstants::ST_ADSET_OPTIMIZATION_GOAL => 'setOptimization',
            StrategyConstants::ST_ADSET_BILL_EVENT => 'setBillEvent',
            StrategyConstants::ST_ADSET_DELIVERY_TYPE => 'setDeliveryType',
            StrategyConstants::APPEND_ADSET_SCHEDULE_DAYS => 'setDayArray',
            StrategyConstants::ST_ADSET_PROMOTED_PRODUCTSET_ID => 'setPromoteProductSetId',
        );
    }

    protected function initValueMaps()
    {
        $this->field2Valuemaps = array();

        $statusValue = array(
            StrategyConstants::ST_V_NODE_STATUS_PAUSED => AdManageConstants::PARAM_STATUS_PAUSED,
            StrategyConstants::ST_V_NODE_STATUS_ACTIVE => AdManageConstants::PARAM_STATUS_ACTIVE,
        );
        $this->field2Valuemaps[StrategyConstants::ST_ADSET_STATUS] = $statusValue;

        $linkdataTypeValue = array(
            StrategyConstants::ST_V_LINKDATA_TYPE_ALL => AdManageConstants::LINK_AD_TYPE_CALLTOACTION,
            StrategyConstants::ST_V_LINKDATA_TYPE_NORMAL => AdManageConstants::LINK_AD_TYPE_LINKDATA,
            StrategyConstants::ST_V_LINKDATA_TYPE_NONE => AdManageConstants::LINK_AD_TYPE_NULL,
        );
        $this->field2Valuemaps[StrategyConstants::ST_ADSET_LINK_AD_TYPE] = $linkdataTypeValue;

        $genderValue = array(
            StrategyConstants::ST_V_GENDER_ALL => array(TargetingConstants::GENDER_MALE, TargetingConstants::GENDER_FEMALE),
            StrategyConstants::ST_V_GENDER_MALE => array(TargetingConstants::GENDER_MALE),
            StrategyConstants::ST_V_GENDER_FEMALE => array(TargetingConstants::GENDER_FEMALE),
        );
        $this->field2Valuemaps[StrategyConstants::ST_TARGETING_GENDER] = $genderValue;

        $bugetTypeValue = array(
            StrategyConstants::ST_V_BUDGET_TYPE_DAILY => AdManageConstants::ADSET_BUDGET_TYPE_DAILY,
            StrategyConstants::ST_V_BUDGET_TYPE_SCHEDULE => AdManageConstants::ADSET_BUDGET_TYPE_SCHEDULE,
        );
        $this->field2Valuemaps[StrategyConstants::ST_ADSET_BUDGET_TYPE] = $bugetTypeValue;

        $scheduleTypeValue = array(
            StrategyConstants::ST_V_SCHEDULE_TYPE_ALLTIME => AdManageConstants::SCHEDULE_TYPE_ALLTIMES,
            StrategyConstants::ST_V_SCHEDULE_TYPE_SCHEDULE => AdManageConstants::SCHEDULE_TYPE_SCHEDULE,
        );
        $this->field2Valuemaps[StrategyConstants::ST_ADSET_SCHEDULE_TYPE] = $scheduleTypeValue;

        $optimization = array(
           StrategyConstants::ST_V_OPTIMIZATION_APPINSTALL => AdManageConstants::ADSET_OPTIMIZATION_APPINSTALL,
           StrategyConstants::ST_V_OPTIMIZATION_LINKCLICK => AdManageConstants::ADSET_OPTIMIZATION_LINKCLICK,
           StrategyConstants::ST_V_OPTIMIZATION_OFFSITE_CONVERSION => AdManageConstants::ADSET_OPTIMIZATION_OFFSITE_CONVERSION,
           StrategyConstants::ST_V_OPTIMIZATION_PAGE_LIKE => AdManageConstants::ADSET_OPTIMIZATION_PAGE_LIKE,
           StrategyConstants::ST_V_OPTIMIZATION_BRAND_AWARENESS => AdManageConstants::ADSET_OPTIMIZATION_BRAND_AWARENESS,
           StrategyConstants::ST_V_OPTIMIZATION_REACH => AdManageConstants::ADSET_OPTIMIZATION_REACH,
        );
        $this->field2Valuemaps[StrategyConstants::ST_ADSET_OPTIMIZATION_GOAL] = $optimization;

        $billEvent = array(
            StrategyConstants::ST_V_BILLEVENT_IMPRESSION => AdManageConstants::ADSET_BILL_EVENT_IMPRESSIONS,
            StrategyConstants::ST_V_BILLEVENT_CLICK => AdManageConstants::ADSET_BILL_EVENT_LINKCLICK,
            StrategyConstants::ST_V_BILLEVENT_APPINSTALL=> AdManageConstants::ADSET_BILL_EVENT_APPINSTALL,
        );
        $this->field2Valuemaps[StrategyConstants::ST_ADSET_BILL_EVENT] = $billEvent;

        $deliveryType = array(
            StrategyConstants::ST_V_DELIVERY_TYPE_STANDARD => AdManageConstants::DELIVERY_TYPE_STANDARD,
            StrategyConstants::ST_V_DELIVERY_TYPE_ACCELERATE => AdManageConstants::DELIVERY_TYPE_ACCELERATE,
        );
        $this->field2Valuemaps[StrategyConstants::ST_ADSET_DELIVERY_TYPE] = $deliveryType;

    }

    protected function initOptionFields()
    {
        $this->optionFields = array(
            StrategyConstants::ST_ADSET_STATUS,
            StrategyConstants::ST_ADSET_LINK_AD_TYPE,
            StrategyConstants::ST_TARGETING_GENDER,
            StrategyConstants::ST_TARGETING_AGE_MIN,
            StrategyConstants::ST_TARGETING_AGE_MAX,
            StrategyConstants::ST_TARGETING_LOCALE,
            StrategyConstants::ST_TARGETING_INTEREST,
            StrategyConstants::ST_TARGETING_USER_OS,
            StrategyConstants::ST_TARGETING_DEVICE_PLATFORM,
            StrategyConstants::ST_TARGETING_PUBLISHER_PLATFORM,
            StrategyConstants::ST_TARGETING_POSITION,
            StrategyConstants::ST_TARGETING_USER_DEVICE,
            StrategyConstants::ST_TARGETING_EXCLUDE_DEVICE,
            StrategyConstants::ST_TARGETING_WIRELESS,
            StrategyConstants::ST_TARGETING_CUSTOM_AUDIENCE,
            StrategyConstants::ST_ADSET_SCHEDULE_TYPE,
            StrategyConstants::ST_ADSET_START_MIN,
            StrategyConstants::ST_ADSET_END_MIN,
            StrategyConstants::ST_ADSET_DELIVERY_TYPE,
            StrategyConstants::APPEND_ADSET_SCHEDULE_DAYS,
            StrategyConstants::ST_ADSET_PROMOTED_PRODUCTSET_ID,
        );
    }

    protected function preHandleStrategyInfo($strategyInfoArray)
    {
        $cpStrategyArray = $strategyInfoArray;

        // 将targeting 属性提升到adset
        $targetingInfo = $cpStrategyArray[StrategyConstants::ST_ADSET_TARGETING];
        unset($cpStrategyArray[StrategyConstants::ST_ADSET_TARGETING]);
        $mergerArray = array_merge($cpStrategyArray, $targetingInfo);

        //更换个别值
        $localeArray = self::getLocaleArray($mergerArray[StrategyConstants::ST_TARGETING_LOCALE]);
        if(false === $localeArray)
        {
            return false;
        }
        else
        {
            $mergerArray[StrategyConstants::ST_TARGETING_LOCALE] = $localeArray;
        }

        $countryArray = self::getCoutryCode($mergerArray[StrategyConstants::ST_TARGETING_COUNTRIES]);
        if(false === $countryArray)
        {
            return false;
        }
        else
        {
            $mergerArray[StrategyConstants::ST_TARGETING_COUNTRIES] = $countryArray;
        }

        $scheduleType = $mergerArray[StrategyConstants::ST_ADSET_SCHEDULE_TYPE];
        if($scheduleType == StrategyConstants::ST_V_SCHEDULE_TYPE_SCHEDULE)
        {
            $startDate = new DateTime($mergerArray[StrategyConstants::ST_ADSET_START_TIME]);
            $endDate = new DateTime($mergerArray[StrategyConstants::ST_ADSET_END_TIME]);
            $dayArray = CommonHelper::getWeekdaysBetweenDate($startDate, $endDate);
            $mergerArray[StrategyConstants::APPEND_ADSET_SCHEDULE_DAYS] = $dayArray;
        }

        return $mergerArray;

    }

    private function getLocaleArray($localNameArray)
    {
        $resultArray = array();
        foreach($localNameArray as $locale)
        {
            $localeCode = CountryLocaleHelper::instance()->getLocaleCode($locale);
            if(false === $localeCode)
            {
                ServerLogger::instance()->writeStrategyLog(Error, 'Failed to get locale code : ' . $locale);
                return false;
            }
            $resultArray[] = $localeCode;
        }

        return $resultArray;
    }

    private function getCoutryCode($countryNameArray)
    {
        $resultArray = array();
        foreach($countryNameArray as $country)
        {
            $countryCode = CountryLocaleHelper::instance()->getCountryCode($country);
            if(false === $countryCode)
            {
                ServerLogger::instance()->writeStrategyLog(Error, 'Failed to get country code : ' . $country);
                return false;
            }
            $resultArray[] = $countryCode;
        }

        return $resultArray;
    }

}