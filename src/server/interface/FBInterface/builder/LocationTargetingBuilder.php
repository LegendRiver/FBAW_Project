<?php
use FacebookAds\Object\Fields\TargetingGeoLocationFields;

class LocationTargetingBuilder implements IFieldBuilder
{
    //小的区域不能包含在大的区域内
    private $countryArray = array();

    //二维数组
    private $regionArray = array();

    //二维数组
    private $cityArray = array();

    private $locationTypeArray = array();

    private $locationFields = array();


    public function getOutputField()
    {
        $this->locationFields = array();

        $this->appendField(TargetingGeoLocationFields::COUNTRIES, $this->countryArray);

        $cityFormatArray = $this->transformKeyFormat($this->cityArray);
        $this->appendField(TargetingGeoLocationFields::CITIES, $cityFormatArray);

        $this->appendField(TargetingGeoLocationFields::REGIONS, $this->regionArray);

        $this->appendField(TargetingGeoLocationFields::LOCATION_TYPES, $this->locationTypeArray);

        return $this->locationFields;
    }

    public function setCityArray($cityArray)
    {
        $this->cityArray = (array)$cityArray;
    }

    public function setCountryArray($countries)
    {
        $arrCountry = (array)$countries;
        $uniqueCountry = array_unique($arrCountry);
        if(count($uniqueCountry) > TargetingConstants::COUNTRY_COUNT_LIMIT)
        {
            ServerLogger::instance()->writeLog(Warning, 'The num of countries is more than ' .
                TargetingConstants::COUNTRY_COUNT_LIMIT);
            return false;
        }
        else
        {
            $this->countryArray = $uniqueCountry;
            return true;
        }

    }

    public function addCountryCode($countryCode)
    {
        $mergeCountry = array_merge($this->countryArray,(array)$countryCode);
        $uniqueCountry = array_unique($mergeCountry);
        if(count($uniqueCountry) > TargetingConstants::COUNTRY_COUNT_LIMIT)
        {
            ServerLogger::instance()->writeLog(Warning, 'The num of countries is more than ' .
                TargetingConstants::COUNTRY_COUNT_LIMIT);
            return false;
        }
        else
        {
            $this->countryArray = $uniqueCountry;
            return true;
        }
    }

    public function removeCountryCode($countryCode)
    {
        $this->countryArray = array_diff($this->countryArray, (array)$countryCode);
    }

    private function appendField($locationKey, $locationValue)
    {
        if(!empty($locationValue))
        {
            $this->locationFields[$locationKey] = $locationValue;
        }
    }

    private function transformKeyFormat($locationArray)
    {
        $formatArray = array();

        foreach($locationArray as $location)
        {
            $formatArray[] = array(
                'key' => $location,
            );
        }

        return $formatArray;
    }

}