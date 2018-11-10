<?php

use FacebookAds\Object\Fields\TargetingFields;

class BasicTargetingBuilder
{
    private $genderArray;

    private $ageMinInt;

    private $ageMaxInt;

    private $localeArray;

    private $dynamicAudienceIdArray;

    private $customAudienceArray;
    private $connectionsArray;
    private $friendConnectionArray;

    private $outputArray;

    function __construct()
    {
        $this->genderArray = array(TargetingConstants::GENDER_MALE, TargetingConstants::GENDER_FEMALE);
        $this->ageMaxInt = TargetingConstants::AGE_MAX_DEFAULT;
        $this->ageMinInt = TargetingConstants::AGE_MIN_DEFAULT;
        $this->localeArray = array();
        $this->dynamicAudienceIdArray = array();
        $this->customAudienceArray = array();
        $this->connectionsArray = array();
        $this->friendConnectionArray = array();
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();
        $this->outputArray[TargetingFields::GENDERS] = $this->genderArray;
        $this->outputArray[TargetingFields::AGE_MAX] = $this->ageMaxInt;
        $this->outputArray[TargetingFields::AGE_MIN] = $this->ageMinInt;

        if(!empty($this->localeArray))
        {
            $this->outputArray[TargetingFields::LOCALES] = $this->localeArray;
        }

        if(!empty($this->dynamicAudienceIdArray))
        {
            $this->outputArray[TargetingFields::DYNAMIC_AUDIENCE_IDS] = $this->dynamicAudienceIdArray;
        }

        if(!empty($this->customAudienceArray))
        {
            $this->outputArray[TargetingFields::CUSTOM_AUDIENCES] = $this->customAudienceArray;
        }
        if(!empty($this->connectionsArray))
        {
            $this->outputArray[TargetingFields::CONNECTIONS] = $this->connectionsArray;
        }
        if(!empty($this->friendConnectionArray))
        {
            $this->outputArray[TargetingFields::FRIENDS_OF_CONNECTIONS] = $this->friendConnectionArray;
        }

        return $this->outputArray;

    }

    /**
     * @param array $dynamicAudienceIdArray
     */
    public function setDynamicAudienceIdArray($dynamicAudienceIdArray)
    {
        $this->dynamicAudienceIdArray = (array)$dynamicAudienceIdArray;
    }


    public function setLocaleArray($localeArray)
    {
        $this->localeArray = $localeArray;
    }

    public function setGenderArray($genderArray)
    {
        if(TargetingUtil::checkGenderValid($genderArray))
        {
            $this->genderArray = (array)$genderArray;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'The input of gender is invalid.');
        }
    }

    public function setAgeMaxInt($ageMaxInt)
    {
        if(TargetingUtil::checkAgeValid($ageMaxInt) && ($ageMaxInt >= $this->ageMinInt))
        {
            $this->ageMaxInt = $ageMaxInt;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'The input of ageMax is invalid.' . $ageMaxInt);
        }
    }

    public function setAgeMinInt($ageMinInt)
    {
        if(TargetingUtil::checkAgeValid($ageMinInt))
        {
            $this->ageMinInt = $ageMinInt;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'The input of ageMin is invalid.' . $ageMinInt);
        }
    }

    /**
     * @param array $connectionsArray
     */
    public function setConnectionsArray($connectionsArray)
    {
        $this->connectionsArray = (array)$connectionsArray;
    }

    /**
     * @param array $customAudienceArray
     */
    public function setCustomAudienceArray($customAudienceArray)
    {
        $this->customAudienceArray = (array)$customAudienceArray;
    }

    /**
     * @param array $friendConnectionArray
     */
    public function setFriendConnectionArray($friendConnectionArray)
    {
        $this->friendConnectionArray = (array)$friendConnectionArray;
    }

}