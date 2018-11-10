<?php

use FacebookAds\Object\Fields\TargetingFields;

class OsPlacementTargetingBuilder implements IFieldBuilder
{
    private $userOSArray;
    private $userDeviceArray;
    private $excludeDeviceArray;
    private $devicePlatFormArray;
    private $wirelessCarrierArray;

    private $publisherPlatFormArray;
    private $facebookPositionArray;

    private $outputArray;

    function __construct()
    {
        $this->userOSArray = array();
        $this->userDeviceArray = array();
        $this->excludeDeviceArray = array();
        $this->devicePlatFormArray = array();
        $this->wirelessCarrierArray = array();

        $this->publisherPlatFormArray = array();
        $this->facebookPositionArray = array();

        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();
        if(!empty($this->userOSArray))
        {
            $this->outputArray[TargetingFields::USER_OS] = $this->userOSArray;
        }
        if(!empty($this->devicePlatFormArray))
        {
            $this->outputArray[TargetingFields::DEVICE_PLATFORMS] = $this->devicePlatFormArray;
        }
        if(!empty($this->publisherPlatFormArray))
        {
            $this->outputArray[TargetingFields::PUBLISHER_PLATFORMS] = $this->publisherPlatFormArray;
        }
        if(!empty($this->facebookPositionArray))
        {
            $this->outputArray[TargetingFields::FACEBOOK_POSITIONS] = $this->facebookPositionArray;
        }
        if(!empty($this->userDeviceArray))
        {
            $this->outputArray[TargetingFields::USER_DEVICE] = $this->userDeviceArray;
        }
        if(!empty($this->excludeDeviceArray))
        {
            $this->outputArray[TargetingFields::EXCLUDED_USER_DEVICE] = $this->excludeDeviceArray;
        }
        if(!empty($this->wirelessCarrierArray))
        {
            $this->outputArray[TargetingFields::WIRELESS_CARRIER] = $this->wirelessCarrierArray;
        }

        return $this->outputArray;
    }

    /**
     * @param array $wirelessCarrierArray
     */
    public function setWirelessCarrierArray($wirelessCarrierArray)
    {
        $this->wirelessCarrierArray = $wirelessCarrierArray;
    }

    /**
     * @param mixed $excludeDeviceArray
     */
    public function setExcludeDeviceArray($excludeDeviceArray)
    {
        $this->excludeDeviceArray = $excludeDeviceArray;
    }

    /**
     * @param array $userDeviceArray
     */
    public function setUserDeviceArray($userDeviceArray)
    {
        $this->userDeviceArray = (array)$userDeviceArray;
    }

    /**
     * @param array $userOSArray
     */
    public function setUserOSArray($userOSArray)
    {
        $this->userOSArray = (array)$userOSArray;
    }

    /**
     * @param array $devicePlatFormArray
     */
    public function setDevicePlatFormArray($devicePlatFormArray)
    {
        $this->devicePlatFormArray = (array)$devicePlatFormArray;
    }

    /**
     * @param array $facebookPositionArray
     */
    public function setFacebookPositionArray($facebookPositionArray)
    {
        $this->facebookPositionArray = (array)$facebookPositionArray;
    }

    /**
     * @param array $publisherPlatFormArray
     */
    public function setPublisherPlatFormArray($publisherPlatFormArray)
    {
        $this->publisherPlatFormArray = (array)$publisherPlatFormArray;
    }



}