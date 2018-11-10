<?php


class AdsetCreateParam
{
    private $name;

    private $accountId;

    private $campaignId;

    /*PARAM_STATUS_ACTIVE = 0;
     *PARAM_STATUS_PAUSED = 1;
     */
    private $status;

    /*可选值：
     *APP = 0;
     *WEBSITE = 1;
     **/
    private $campaignType;

    /*
     * CALLTOACTION = 1;
     * LINKDATA = 2;
     * NULL = 3;
     */
    private $linkAdType;


    //*************Targeting**********************

    private $genderArray;

    private $ageMin;

    private $ageMax;

    private $localeArray;

    private $countryArray;
    private $cityArray;

    private $interestDesc;

    private $userOsArray;

    private $userDeviceArray;

    private $excludeDeviceArray;

    private $wirelessCarrier;

    private $devicePlatformArray;

    private $publisherArray;

    private $fbPositionArray;

    private $dynamicAudienceIdArray;

    private $customAudienceIdArray;

    private $connectionIdArray;

    private $friendConnectionIdArray;

    private $interestIds;
    private $excludeInterestIds;

    private $behaviorIds;

    private $lifeEventIds;

    private $industryIds;

    private $politicIds;
    private $ethnicIds;
    private $householdCompositionIds;
    private $generationIds;
    private $familyStatusIds;

    private $relationShipStatus;
    private $educationStatus;

    //*************Schedule**********************
    /*可选值:
     *ADSET_BUDGET_TYPE_DAILY = 0;
     *ADSET_BUDGET_TYPE_SCHEDULE = 1;
     **/
    private $budgetType;

    private $budgetAmount;

    private $startTime;

    private $endTime;

    private $scheduleType;

    private $dayArray;

    private $startMin;

    private $endMin;

    //************************bid**************************
    /*可选值：
     *APPINSTALL = 0;
     *LINKCLICK = 1;
     **/
    private $optimization;

    private $bidAmount;

   /* 可选值：
    *ADSET_BILL_EVENT_IMPRESSIONS = 0;
    **/
    private $billEvent;

    private $deliveryType;

    private $applicationUrl;

    private $promoteProductSetId;


    public function __construct()
    {
        $this->status = AdManageConstants::PARAM_STATUS_PAUSED;
        $this->genderArray = array(TargetingConstants::GENDER_MALE, TargetingConstants::GENDER_FEMALE);
        $this->ageMax = TargetingConstants::AGE_MAX_DEFAULT;
        $this->ageMin = TargetingConstants::AGE_MIN_DEFAULT;
        $this->localeArray = array();
        $this->countryArray = array();
        $this->userDeviceArray = array();
        $this->excludeDeviceArray = array();
        $this->wirelessCarrier = array();
        $this->interestIds = array();
        $this->behaviorIds = array();
        $this->lifeEventIds = array();
        $this->industryIds = array();
        $this->politicIds = array();
        $this->familyStatusIds = array();
        $this->ethnicIds = array();
        $this->householdCompositionIds = array();
        $this->generationIds = array();
        $this->publisherArray = array(TargetingConstants::PUBLISHER_PLATFORM_FACEBOOK);
        $this->fbPositionArray = array(TargetingConstants::FACEBOOK_POSITION_FEED);
        $this->billEvent = AdManageConstants::ADSET_BILL_EVENT_IMPRESSIONS;
        $this->bidAmount = 0;
        $this->countryArray = array();
        $this->deliveryType = AdManageConstants::DELIVERY_TYPE_STANDARD;
        $this->scheduleType = AdManageConstants::SCHEDULE_TYPE_ALLTIMES;
        $this->startMin = 0;
        $this->endMin = 1440;
        $this->dynamicAudienceIdArray = array();
    }

    /**
     * @return mixed
     */
    public function getExcludeInterestIds()
    {
        return $this->excludeInterestIds;
    }

    /**
     * @param mixed $excludeInterestIds
     */
    public function setExcludeInterestIds($excludeInterestIds)
    {
        $this->excludeInterestIds = $excludeInterestIds;
    }

    /**
     * @return mixed
     */
    public function getCityArray()
    {
        return $this->cityArray;
    }

    /**
     * @param mixed $cityArray
     */
    public function setCityArray($cityArray)
    {
        $this->cityArray = $cityArray;
    }

    /**
     * @return mixed
     */
    public function getEducationStatus()
    {
        return $this->educationStatus;
    }

    /**
     * @param mixed $educationStatus
     */
    public function setEducationStatus($educationStatus)
    {
        $this->educationStatus = $educationStatus;
    }

    /**
     * @return mixed
     */
    public function getRelationShipStatus()
    {
        return $this->relationShipStatus;
    }

    /**
     * @param mixed $relationShipStatus
     */
    public function setRelationShipStatus($relationShipStatus)
    {
        $this->relationShipStatus = $relationShipStatus;
    }

    /**
     * @return mixed
     */
    public function getEthnicIds()
    {
        return $this->ethnicIds;
    }

    /**
     * @param mixed $ethnicIds
     */
    public function setEthnicIds($ethnicIds)
    {
        $this->ethnicIds = $ethnicIds;
    }

    /**
     * @return mixed
     */
    public function getFamilyStatusIds()
    {
        return $this->familyStatusIds;
    }

    /**
     * @param mixed $familyStatusIds
     */
    public function setFamilyStatusIds($familyStatusIds)
    {
        $this->familyStatusIds = $familyStatusIds;
    }

    /**
     * @return mixed
     */
    public function getHouseholdCompositionIds()
    {
        return $this->householdCompositionIds;
    }

    /**
     * @param mixed $householdCompositionIds
     */
    public function setHouseholdCompositionIds($householdCompositionIds)
    {
        $this->householdCompositionIds = $householdCompositionIds;
    }

    /**
     * @return mixed
     */
    public function getGenerationIds()
    {
        return $this->generationIds;
    }

    /**
     * @param mixed $generationIds
     */
    public function setGenerationIds($generationIds)
    {
        $this->generationIds = $generationIds;
    }

    /**
     * @return mixed
     */
    public function getPoliticIds()
    {
        return $this->politicIds;
    }

    /**
     * @param mixed $politicIds
     */
    public function setPoliticIds($politicIds)
    {
        $this->politicIds = $politicIds;
    }

    /**
     * @return array
     */
    public function getIndustryIds()
    {
        return $this->industryIds;
    }

    /**
     * @param array $industryIds
     */
    public function setIndustryIds($industryIds)
    {
        $this->industryIds = $industryIds;
    }

    /**
     * @return array
     */
    public function getLifeEventIds()
    {
        return $this->lifeEventIds;
    }

    /**
     * @param array $lifeEventIds
     */
    public function setLifeEventIds($lifeEventIds)
    {
        $this->lifeEventIds = $lifeEventIds;
    }

    /**
     * @return array
     */
    public function getBehaviorIds()
    {
        return $this->behaviorIds;
    }

    /**
     * @param array $behaviorIds
     */
    public function setBehaviorIds($behaviorIds)
    {
        $this->behaviorIds = $behaviorIds;
    }

    /**
     * @return array
     */
    public function getInterestIds()
    {
        return $this->interestIds;
    }

    /**
     * @param array $interestIds
     */
    public function setInterestIds($interestIds)
    {
        $this->interestIds = $interestIds;
    }

    /**
     * @return mixed
     */
    public function getWirelessCarrier()
    {
        return $this->wirelessCarrier;
    }

    /**
     * @param mixed $wirelessCarrier
     */
    public function setWirelessCarrier($wirelessCarrier)
    {
        $this->wirelessCarrier = (array)$wirelessCarrier;
    }

    /**
     * @return mixed
     */
    public function getExcludeDeviceArray()
    {
        return $this->excludeDeviceArray;
    }

    /**
     * @param mixed $excludeDeviceArray
     */
    public function setExcludeDeviceArray($excludeDeviceArray)
    {
        $this->excludeDeviceArray = $excludeDeviceArray;
    }

    /**
     * @return mixed
     */
    public function getConnectionIdArray()
    {
        return $this->connectionIdArray;
    }

    /**
     * @param mixed $connectionIdArray
     */
    public function setConnectionIdArray($connectionIdArray)
    {
        $this->connectionIdArray = $connectionIdArray;
    }

    /**
     * @return mixed
     */
    public function getCustomAudienceIdArray()
    {
        return $this->customAudienceIdArray;
    }

    /**
     * @param mixed $customAudienceIdArray
     */
    public function setCustomAudienceIdArray($customAudienceIdArray)
    {
        $this->customAudienceIdArray = $customAudienceIdArray;
    }

    /**
     * @return mixed
     */
    public function getFriendConnectionIdArray()
    {
        return $this->friendConnectionIdArray;
    }

    /**
     * @param mixed $friendConnectionIdArray
     */
    public function setFriendConnectionIdArray($friendConnectionIdArray)
    {
        $this->friendConnectionIdArray = $friendConnectionIdArray;
    }

    /**
     * @return array
     */
    public function getUserDeviceArray()
    {
        return $this->userDeviceArray;
    }

    /**
     * @param array $userDeviceArray
     */
    public function setUserDeviceArray($userDeviceArray)
    {
        $this->userDeviceArray = $userDeviceArray;
    }

    /**
     * @return array
     */
    public function getDynamicAudienceIdArray()
    {
        return $this->dynamicAudienceIdArray;
    }

    /**
     * @param array $dynamicAudienceIdArray
     */
    public function setDynamicAudienceIdArray($dynamicAudienceIdArray)
    {
        $this->dynamicAudienceIdArray = $dynamicAudienceIdArray;
    }

    /**
     * @return mixed
     */
    public function getPromoteProductSetId()
    {
        return $this->promoteProductSetId;
    }

    /**
     * @param mixed $promoteProductSetId
     */
    public function setPromoteProductSetId($promoteProductSetId)
    {
        $this->promoteProductSetId = $promoteProductSetId;
    }

    /**
     * @return mixed
     */
    public function getDayArray()
    {
        return $this->dayArray;
    }

    /**
     * @param mixed $dayArray
     */
    public function setDayArray($dayArray)
    {
        $this->dayArray = $dayArray;
    }

    /**
     * @return mixed
     */
    public function getEndMin()
    {
        return $this->endMin;
    }

    /**
     * @param mixed $endMin
     */
    public function setEndMin($endMin)
    {
        $this->endMin = $endMin;
    }

    /**
     * @return mixed
     */
    public function getScheduleType()
    {
        return $this->scheduleType;
    }

    /**
     * @param mixed $scheduleType
     */
    public function setScheduleType($scheduleType)
    {
        $this->scheduleType = $scheduleType;
    }

    /**
     * @return mixed
     */
    public function getStartMin()
    {
        return $this->startMin;
    }

    /**
     * @param mixed $startMin
     */
    public function setStartMin($startMin)
    {
        $this->startMin = $startMin;
    }

    /**
     * @return mixed
     */
    public function getDeliveryType()
    {
        return $this->deliveryType;
    }

    /**
     * @param mixed $deliveryType
     */
    public function setDeliveryType($deliveryType)
    {
        $this->deliveryType = $deliveryType;
    }

    /**
     * @return mixed
     */
    public function getAccountId()
    {
        return $this->accountId;
    }

    /**
     * @param mixed $accountId
     */
    public function setAccountId($accountId)
    {
        $this->accountId = $accountId;
    }

    /**
     * @return mixed
     */
    public function getAgeMax()
    {
        return $this->ageMax;
    }

    /**
     * @param mixed $ageMax
     */
    public function setAgeMax($ageMax)
    {
        $this->ageMax = $ageMax;
    }

    /**
     * @return mixed
     */
    public function getAgeMin()
    {
        return $this->ageMin;
    }

    /**
     * @param mixed $ageMin
     */
    public function setAgeMin($ageMin)
    {
        $this->ageMin = $ageMin;
    }

    /**
     * @return mixed
     */
    public function getDevicePlatformArray()
    {
        return $this->devicePlatformArray;
    }

    /**
     * @param mixed $devicePlatformArray
     */
    public function setDevicePlatformArray($devicePlatformArray)
    {
        $this->devicePlatformArray = $devicePlatformArray;
    }

    /**
     * @return mixed
     */
    public function getFbPositionArray()
    {
        return $this->fbPositionArray;
    }

    /**
     * @param mixed $fbPositionArray
     */
    public function setFbPositionArray($fbPositionArray)
    {
        $this->fbPositionArray = $fbPositionArray;
    }

    /**
     * @return mixed
     */
    public function getGenderArray()
    {
        return $this->genderArray;
    }

    /**
     * @param mixed $genderArray
     */
    public function setGenderArray($genderArray)
    {
        $this->genderArray = $genderArray;
    }

    /**
     * @return mixed
     */
    public function getInterestDesc()
    {
        return $this->interestDesc;
    }

    /**
     * @param mixed $interestDesc
     */
    public function setInterestDesc($interestDesc)
    {
        $this->interestDesc = $interestDesc;
    }

    /**
     * @return mixed
     */
    public function getLinkAdType()
    {
        return $this->linkAdType;
    }

    /**
     * @param mixed $linkAdType
     */
    public function setLinkAdType($linkAdType)
    {
        $this->linkAdType = $linkAdType;
    }

    /**
     * @return mixed
     */
    public function getLocaleArray()
    {
        return $this->localeArray;
    }

    /**
     * @param mixed $localeArray
     */
    public function setLocaleArray($localeArray)
    {
        $this->localeArray = $localeArray;
    }

    /**
     * @return mixed
     */
    public function getPublisherArray()
    {
        return $this->publisherArray;
    }

    /**
     * @param mixed $publisherArray
     */
    public function setPublisherArray($publisherArray)
    {
        $this->publisherArray = $publisherArray;
    }

    /**
     * @return mixed
     */
    public function getUserOsArray()
    {
        return $this->userOsArray;
    }

    /**
     * @param mixed $userOsArray
     */
    public function setUserOsArray($userOsArray)
    {
        $this->userOsArray = $userOsArray;
    }

    /**
     * @return mixed
     */
    public function getCountryArray()
    {
        return $this->countryArray;
    }

    /**
     * @param mixed $countryArray
     */
    public function setCountryArray($countryArray)
    {
        $this->countryArray = $countryArray;
    }

    /**
     * @return mixed
     */
    public function getEndTime()
    {
        return $this->endTime;
    }

    /**
     * @param mixed $endTime
     */
    public function setEndTime($endTime)
    {
        $this->endTime = $endTime;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getOptimization()
    {
        return $this->optimization;
    }

    /**
     * @param mixed $optimization
     */
    public function setOptimization($optimization)
    {
        $this->optimization = $optimization;
    }

    /**
     * @return mixed
     */
    public function getStartTime()
    {
        return $this->startTime;
    }

    /**
     * @param mixed $startTime
     */
    public function setStartTime($startTime)
    {
        $this->startTime = $startTime;
    }

    /**
     * @return mixed
     */
    public function getApplicationUrl()
    {
        return $this->applicationUrl;
    }

    /**
     * @param mixed $applicationUrl
     */
    public function setApplicationUrl($applicationUrl)
    {
        $this->applicationUrl = $applicationUrl;
    }

    /**
     * @return mixed
     */
    public function getBidAmount()
    {
        return $this->bidAmount;
    }

    /**
     * @param mixed $bidAmount
     */
    public function setBidAmount($bidAmount)
    {
        $this->bidAmount = $bidAmount;
    }

    /**
     * @return mixed
     */
    public function getBillEvent()
    {
        return $this->billEvent;
    }

    /**
     * @param mixed $billEvent
     */
    public function setBillEvent($billEvent)
    {
        $this->billEvent = $billEvent;
    }

    /**
     * @return mixed
     */
    public function getBudgetType()
    {
        return $this->budgetType;
    }

    /**
     * @param mixed $budgetType
     */
    public function setBudgetType($budgetType)
    {
        $this->budgetType = $budgetType;
    }

    /**
     * @return mixed
     */
    public function getBudgetAmount()
    {
        return $this->budgetAmount;
    }

    /**
     * @param mixed $budgetAmount
     */
    public function setBudgetAmount($budgetAmount)
    {
        $this->budgetAmount = $budgetAmount;
    }

    /**
     * @return mixed
     */
    public function getCampaignId()
    {
        return $this->campaignId;
    }

    /**
     * @param mixed $campaignId
     */
    public function setCampaignId($campaignId)
    {
        $this->campaignId = $campaignId;
    }

    /**
     * @return mixed
     */
    public function getCampaignType()
    {
        return $this->campaignType;
    }

    /**
     * @param mixed $campaignType
     */
    public function setCampaignType($campaignType)
    {
        $this->campaignType = $campaignType;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }


}