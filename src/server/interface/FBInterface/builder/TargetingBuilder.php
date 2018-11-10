<?php

use FacebookAds\Object\Fields\TargetingFields;

class TargetingBuilder implements IFieldBuilder
{
    private $basicArray;

    private $locationArray;

    private $osPlacementArray;

    private $flexibleArray;

    private $exclusionArray;

    private $outputArray;

    public function __construct()
    {
        $this->basicArray = array();
        $this->osPlacementArray = array();
        $this->locationArray = array();
        $this->flexibleArray = array();
        $this->exclusionArray = array();
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();

        if(!empty($this->basicArray))
        {
            $this->outputArray = array_merge($this->outputArray, $this->basicArray);
        }

        if(!empty($this->osPlacementArray))
        {
            $this->outputArray = array_merge($this->outputArray, $this->osPlacementArray);
        }
        if(!empty($this->locationArray))
        {
            $this->outputArray[TargetingFields::GEO_LOCATIONS] = $this->locationArray;
        }
        if(!empty($this->flexibleArray))
        {
            $this->outputArray[TargetingFields::FLEXIBLE_SPEC] = $this->flexibleArray;
        }
        if(!empty($this->exclusionArray))
        {
            $this->outputArray[TargetingFields::EXCLUSIONS] = $this->exclusionArray;
        }

        ServerLogger::instance()->writeLog(Debug, print_r($this->outputArray, true));

        return $this->outputArray;
    }

    /**
     * @param array $exclusionArray
     */
    public function setExclusionArray($exclusionArray)
    {
        $this->exclusionArray = $exclusionArray;
    }

    /**
     * @param mixed $basicArray
     */
    public function setBasicArray($basicArray)
    {
        $this->basicArray = $basicArray;
    }

    /**
     * @param mixed $flexibleArray
     */
    public function setFlexibleArray($flexibleArray)
    {
        $this->flexibleArray = $flexibleArray;
    }

    /**
     * @param mixed $locationArray
     */
    public function setLocationArray($locationArray)
    {
        $this->locationArray = $locationArray;
    }

    /**
     * @param mixed $osPlacementArray
     */
    public function setOsPlacementArray($osPlacementArray)
    {
        $this->osPlacementArray = $osPlacementArray;
    }


}