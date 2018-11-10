<?php

use FacebookAds\Object\Fields\CampaignFields;

class CampaignFieldBuilder implements IFieldBuilder
{
    private $campaignName;

    private $objectType;

    private $status;

    //不低于$100,单位是美分
    private $spendCap;

    private $promotedObjectArray;

    private $outputArray;

    public function __construct()
    {
        $this->outputArray = array();
        $this->promotedObjectArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();
        $this->outputArray[CampaignFields::NAME] = $this->campaignName;
        $this->outputArray[CampaignFields::OBJECTIVE] = $this->objectType;
        $this->outputArray[CampaignFields::STATUS] = $this->status;

        if(!empty($this->promotedObjectArray))
        {
            $this->outputArray[CampaignFields::PROMOTED_OBJECT] = $this->promotedObjectArray;
        }

        if(!empty($this->spendCap))
        {
            $this->outputArray[CampaignFields::SPEND_CAP] = $this->spendCap;
        }
        return $this->outputArray;
    }

    /**
     * @return array
     */
    public function getPromotedObjectArray()
    {
        return $this->promotedObjectArray;
    }

    /**
     * @param array $promotedObjectArray
     */
    public function setPromotedObjectArray($promotedObjectArray)
    {
        $this->promotedObjectArray = $promotedObjectArray;
    }

    /**
     * @param mixed $campaignName
     */
    public function setCampaignName($campaignName)
    {
        $this->campaignName = $campaignName;
    }

    /**
     * @param mixed $objectType
     */
    public function setObjectType($objectType)
    {
        $this->objectType = $objectType;
    }

    /**
     * @param mixed $spendCap
     */
    public function setSpendCap($spendCap)
    {
        $this->spendCap = floor($spendCap);
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }



}