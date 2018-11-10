<?php

use FacebookAds\Object\Values\AdSetOptimizationGoalValues;
use FacebookAds\Object\Values\ReachEstimateOptimizeForValues;
use FacebookAds\Object\Values\AdSetBillingEventValues;
use FacebookAds\Object\AdSet;
use FacebookAds\Object\Fields\AdPromotedObjectFields;


class AdSetUtil
{
    /**
     * 转换参数
     * @param AdsetCreateParam $param
     * @return array
     */
    public static function transformAdSetField(AdsetCreateParam $param)
    {
        $adsetFieldBuilder = new AdSetFieldBuilder();
        $adsetFieldBuilder->setName($param->getName());
        $adsetFieldBuilder->setCampaignId($param->getCampaignId());

        $status = self::getAdSetStatus($param->getStatus());
        $adsetFieldBuilder->setStatus($status);

        $targetingFields = self::getTargetingField($param);
        $adsetFieldBuilder->setTargetingArray($targetingFields);

        $scheduleFields = self::getScheduleField($param);
        $adsetFieldBuilder->setScheduleArray($scheduleFields);

        $bidFields = self::getBidField($param);
        $adsetFieldBuilder->setBidArray($bidFields);

        $campaignType = $param->getCampaignType();
        if(AdManageConstants::CAMPAIGN_PARAM_TYPE_APP == $campaignType)
        {
            $appObjectField = self::getAppObjectField($param);
            if(false === $appObjectField)
            {
                return false;
            }
            $adsetFieldBuilder->setObjectiveArray($appObjectField);
        }

        if(AdManageConstants::CAMPAIGN_PARAM_TYPE_PRODUCT_SALES == $campaignType)
        {
            $productSetId = $param->getPromoteProductSetId();
            if(empty($productSetId))
            {
                ServerLogger::instance()->writeLog(Error, 'There is not productSetId In product sales adset.');
                return false;
            }
            $promotedArray = array(
                AdPromotedObjectFields::PRODUCT_SET_ID => $productSetId,
            );
            $adsetFieldBuilder->setObjectiveArray($promotedArray);
        }

        return $adsetFieldBuilder->getOutputField();
    }

    public static function getReachEstimateParam(AdsetCreateParam $param)
    {
        $targetingFields = self::getTargetingField($param);
        $budgetType = $param->getBudgetType();
        if(AdManageConstants::ADSET_BUDGET_TYPE_DAILY == $budgetType)
        {
            $dailyBudget = $param->getBudgetAmount();
        }

        $optimizationType = $param->getOptimization();
        $optimization = self::getOptimization($optimizationType);
        if(false === $optimization)
        {
            ServerLogger::instance()->writeLog(Warning, 'The Campaign Type in param is not defined.');
        }

        $url = $param->getApplicationUrl();

        $estimateParam = array();
        if(isset($dailyBudget))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_DAILY_BUDGET] = $dailyBudget;
        }

        if(!empty($targetingFields))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_TARGETING] = $targetingFields;
        }

        if(isset($optimization))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_OPTIMIZATION] = $optimization;
        }

        if(isset($url))
        {
            $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_URL] = $url;
        }

        $estimateParam[AdManageConstants::REACH_ESTIMATE_PARAM_CURRENCY] = 'USD';

        return $estimateParam;

    }

    private static function getAppObjectField(AdsetCreateParam $param)
    {
        $appUrl = $param->getApplicationUrl();
        $appEntity = TargetingSearchUtil::searchApplicationEntity($appUrl);

        if(CommonHelper::notSetValue($appEntity))
        {
            ServerLogger::instance()->writeLog(Error, 'Can not find app id.');
            return false;
        }

        $appBuilder = new AppInstallObjectBuilder();
        $appBuilder->setApplicationId($appEntity->getId());
        $appBuilder->setApplicationStoreUrl($appEntity->getStoreUrl());

        return $appBuilder->getOutputField();
    }

    private static function getBidField(AdsetCreateParam $param)
    {
        $optimizationType = $param->getOptimization();
        $optimization = self::getOptimization($optimizationType);
        if(false === $optimization)
        {
            return false;
        }

        $pBillEvent = $param->getBillEvent();
        $billEvent = self::getBillEvent($pBillEvent);
        if(false === $billEvent)
        {
            return false;
        }

        $bidAmount = $param->getBidAmount();
        $paceTpyeArray = array();
        if($bidAmount > 0)
        {
            //只有手动竞价，且采用最大值形式才能设置加速投放
            $pDeliveryType = $param->getDeliveryType();
            $paceTpyeArray = self::getPaceType($pDeliveryType);
        }

        $scheduleType = $param->getScheduleType();
        if(AdManageConstants::SCHEDULE_TYPE_SCHEDULE == $scheduleType)
        {
            $paceTpyeArray[] = AdManageConstants::ADSET_PACE_TYPE_DAYPARTING;
        }

        $builder = new BidBuilder();
        $builder->setBidAmount($bidAmount);
        $builder->setBillEvent($billEvent);
        $builder->setOptimizationGoal($optimization);
        if(!empty($paceTpyeArray))
        {
            $builder->setPaceTypeArray($paceTpyeArray);
        }

        return $builder->getOutputField();
    }

    public static function getOptimization($optimizationType)
    {
        if(AdManageConstants::ADSET_OPTIMIZATION_APPINSTALL == $optimizationType)
        {
            $optimization = AdSetOptimizationGoalValues::APP_INSTALLS;
        }
        else if(AdManageConstants::ADSET_OPTIMIZATION_LINKCLICK == $optimizationType)
        {
            $optimization = AdSetOptimizationGoalValues::LINK_CLICKS;
        }
        else if(AdManageConstants::ADSET_OPTIMIZATION_OFFSITE_CONVERSION == $optimizationType)
        {
            $optimization = AdSetOptimizationGoalValues::OFFSITE_CONVERSIONS;
        }
        else if(AdManageConstants::ADSET_OPTIMIZATION_PAGE_LIKE == $optimizationType)
        {
            $optimization = AdSetOptimizationGoalValues::PAGE_LIKES;
        }
        else if(AdManageConstants::ADSET_OPTIMIZATION_BRAND_AWARENESS == $optimizationType)
        {
            $optimization = AdSetOptimizationGoalValues::BRAND_AWARENESS;
        }
        else if(AdManageConstants::ADSET_OPTIMIZATION_REACH == $optimizationType)
        {
            $optimization = AdSetOptimizationGoalValues::REACH;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'The Campaign Type in param is not defined.');
            return false;
        }

        return $optimization;
    }

    private static function getPaceType($deliveryType)
    {
        $paceArray = array();
        if(AdManageConstants::DELIVERY_TYPE_STANDARD == $deliveryType)
        {
            $paceArray[] = AdManageConstants::ADSET_PACE_TYPE_STANDARD;
        }
        else if(AdManageConstants::DELIVERY_TYPE_ACCELERATE == $deliveryType)
        {
            $paceArray[] = AdManageConstants::ADSET_PACE_TYPE_NOPACE;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'The deliveryType in param is not defined.');
        }
        return $paceArray;
    }

    private static function getBillEvent($pBillEvent)
    {
        if(AdManageConstants::ADSET_BILL_EVENT_IMPRESSIONS == $pBillEvent)
        {
            $billEvent = AdSetBillingEventValues::IMPRESSIONS;
        }
        else if(AdManageConstants::ADSET_BILL_EVENT_LINKCLICK == $pBillEvent)
        {
            $billEvent = AdSetBillingEventValues::LINK_CLICKS;
        }
        else if(AdManageConstants::ADSET_BILL_EVENT_APPINSTALL == $pBillEvent)
        {
            $billEvent = AdSetBillingEventValues::APP_INSTALLS;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'The BillEvent in param is not defined.');
            $billEvent = false;
        }

        return $billEvent;
    }

    private static function getScheduleField(AdsetCreateParam $param)
    {
        $budgetType = $param->getBudgetType();
        $budgetAmount = $param->getBudgetAmount();

        $pStartTime = $param->getStartTime();
        $startTime = (new DateTime($pStartTime))->format(\DateTime::ISO8601);

        $pEndTime = $param->getEndTime();
        $endTime = (new DateTime($pEndTime))->format(\DateTime::ISO8601);

        $builder = new ScheduleBuilder();
        $builder->setBudgetType($budgetType);
        $builder->setBudgetAmount($budgetAmount);
        $builder->setStartTime($startTime);
        $builder->setEndTime($endTime);

        $pScheduleType = $param->getScheduleType();
        if(AdManageConstants::SCHEDULE_TYPE_SCHEDULE == $pScheduleType)
        {
            $dayArray = $param->getDayArray();
            if(isset($dayArray) && !empty($dayArray))
            {
                $builder->setDayArray($dayArray);
                $builder->setStartMin($param->getStartMin());
                $builder->setEndMin($param->getEndMin());
            }
        }

        return $builder->getOutputField();
    }


    private static function getTargetingField(AdsetCreateParam $param)
    {
        $targetingBuilder = new TargetingBuilder();

        $basicBuilder = new BasicTargetingBuilder();
        $basicBuilder->setGenderArray($param->getGenderArray());
        $basicBuilder->setAgeMaxInt($param->getAgeMax());
        $basicBuilder->setAgeMinInt($param->getAgeMin());
        $basicBuilder->setLocaleArray($param->getLocaleArray());
        $basicBuilder->setDynamicAudienceIdArray($param->getDynamicAudienceIdArray());
        $basicBuilder->setCustomAudienceArray($param->getCustomAudienceIdArray());
        $basicBuilder->setConnectionsArray($param->getConnectionIdArray());
        $basicBuilder->setFriendConnectionArray($param->getFriendConnectionIdArray());
        $targetingBuilder->setBasicArray($basicBuilder->getOutputField());

        $locationBuilder = new LocationTargetingBuilder();
        $locationBuilder->setCountryArray($param->getCountryArray());
        $locationBuilder->setCityArray($param->getCityArray());
        $targetingBuilder->setLocationArray($locationBuilder->getOutputField());

        $flexibleBuilder = new FlexibleTargetingBuilder();
        $interestArray = TargetingSearchUtil::searchInterestId($param->getInterestDesc());
        $interestIds = $param->getInterestIds();
        $flexibleBuilder->setInterestArray(array_merge($interestArray, $interestIds));
        $flexibleBuilder->setBehaviorArray($param->getBehaviorIds());
        $flexibleBuilder->setLifeEventArray($param->getLifeEventIds());
        $flexibleBuilder->setIndustryArray($param->getIndustryIds());
        $flexibleBuilder->setPoliticsArray($param->getPoliticIds());
        $flexibleBuilder->setGenerationArray($param->getGenerationIds());
        $flexibleBuilder->setFamilyStatusArray($param->getFamilyStatusIds());
        $flexibleBuilder->setHouseholdCompositionArray($param->getHouseholdCompositionIds());
        $flexibleBuilder->setEthnicAffinityArray($param->getEthnicIds());
        $flexibleBuilder->setRelationShipArray($param->getRelationShipStatus());
        $flexibleBuilder->setEducationStatusArray($param->getEducationStatus());

        $targetingBuilder->setFlexibleArray($flexibleBuilder->getOutputField());

        $exclusionBuilder = new FlexibleTargetingBuilder();
        $exclusionBuilder->setInterestArray($param->getExcludeInterestIds());

        $targetingBuilder->setExclusionArray($exclusionBuilder->getInnerOutputField());

        $campaignType = $param->getCampaignType();
        $linkAdType = $param->getLinkAdType();
        if(($campaignType == AdManageConstants::CAMPAIGN_PARAM_TYPE_APP) ||
            ($linkAdType != AdManageConstants::LINK_AD_TYPE_NULL) )
        {
            $osbuilder = new OsPlacementTargetingBuilder();
            $osbuilder->setUserOSArray($param->getUserOsArray());
            $osbuilder->setUserDeviceArray($param->getUserDeviceArray());
            $osbuilder->setExcludeDeviceArray($param->getExcludeDeviceArray());
            if(!empty($param->getWirelessCarrier()))
            {
              $osbuilder->setWirelessCarrierArray($param->getWirelessCarrier());
            }
            $osbuilder->setDevicePlatFormArray($param->getDevicePlatformArray());

            $publisherPlatForm = self::getPublisherPlatFormArray($param->getPublisherArray());
            $osbuilder->setPublisherPlatFormArray($publisherPlatForm);
            $osbuilder->setFacebookPositionArray($param->getFbPositionArray());

            $targetingBuilder->setOsPlacementArray($osbuilder->getOutputField());
        }

        return $targetingBuilder->getOutputField();
    }

    private static function getPublisherPlatFormArray($platformParam)
    {
        if(array_key_exists(TargetingConstants::PUBLISHER_PLATFORM_AUDIENCENETWORK, $platformParam) &&
         !array_key_exists(TargetingConstants::PUBLISHER_PLATFORM_FACEBOOK, $platformParam))
        {
            ServerLogger::instance()->writeLog(Warning, 'PublisherPlatform only contain audience, do not contain facebook.');
            $platformParam[] = TargetingConstants::PUBLISHER_PLATFORM_FACEBOOK;
            return $platformParam;
        }
        else
        {
            return $platformParam;
        }
    }

    private static function getAdSetStatus($paramStatus)
    {
        $resultStatus = AdSet::STATUS_ACTIVE;
        if(CommonHelper::notSetValue($paramStatus))
        {
            return $resultStatus;
        }

        if(AdManageConstants::PARAM_STATUS_ACTIVE == $paramStatus)
        {
            $resultStatus = AdSet::STATUS_ACTIVE;
        }
        else if(AdManageConstants::PARAM_STATUS_PAUSED == $paramStatus)
        {
            $resultStatus = AdSet::STATUS_PAUSED;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'Only ACTIVE and PAUSED are valid during creation');
        }

        return $resultStatus;
    }

    public static function getAdsetOs($adsetEntity)
    {
        $appUrl = $adsetEntity->getPromoteObjectAppUrl();
        $id = $adsetEntity->getId();

        if(CommonHelper::strContains($appUrl, 'play.google.com'))
        {
            return AdManageConstants::OS_ANDROID;
        }
        else if(CommonHelper::strContains($appUrl, 'itunes.apple.com'))
        {
            return AdManageConstants::OS_IOS;
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to catalog appurl : ' . $appUrl . 'of adset: ' . $id);
            return false;
        }
    }
}