<?php

use FacebookAds\Object\Fields\AdFields;
use FacebookAds\Object\Ad;

class AdFieldBuilder implements IFieldBuilder
{
    private $name;

    private $creativeId;

    private $adsetId;

    private $status;

    private $outputArray;

    public function __construct()
    {
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();

        $this->outputArray[AdFields::NAME] = $this->name;
        $this->outputArray[AdFields::STATUS] = $this->status;
        $this->outputArray[AdFields::ADSET_ID] = $this->adsetId;
        $this->outputArray[AdFields::CREATIVE] = array(
            AdManageConstants::AD_CREATIVE_ID => $this->creativeId,
        );
        return $this->outputArray;
    }

    /**
     * @param mixed $adsetId
     */
    public function setAdsetId($adsetId)
    {
        $this->adsetId = $adsetId;
    }

    /**
     * @param mixed $creativeId
     */
    public function setCreativeId($creativeId)
    {
        $this->creativeId = $creativeId;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }


}