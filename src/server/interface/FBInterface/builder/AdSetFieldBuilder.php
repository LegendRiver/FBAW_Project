<?php

use FacebookAds\Object\Fields\AdSetFields;
use FacebookAds\Object\Targeting;
use FacebookAds\Object\AdSet;

class AdSetFieldBuilder implements IFieldBuilder
{
    private $name;

    private $campaignId;

    private $scheduleArray;

    private $bidArray;

    private $targetingArray;

    private $objectiveArray;

    private $otherSpecArray;

    private $outputArray;

    private $status;

    public function __construct()
    {
        $this->status = AdSet::STATUS_PAUSED;
        $this->scheduleArray = array();
        $this->bidArray = array();
        $this->targetingArray = array();
        $this->objectiveArray = array();
        $this->otherSpecArray = array();
        $this->outputArray = array();
    }


    public function getOutputField()
    {
        $this->outputArray[AdSetFields::NAME] = $this->name;
        $this->outputArray[AdSetFields::CAMPAIGN_ID] = $this->campaignId;
        $this->outputArray[AdSetFields::STATUS] = $this->status;
        if(!empty($this->scheduleArray))
        {
            $this->outputArray = array_merge($this->outputArray, $this->scheduleArray);
        }

        if(!empty($this->bidArray))
        {
            $this->outputArray = array_merge($this->outputArray, $this->bidArray);
        }

        if(!empty($this->objectiveArray))
        {
            $this->outputArray[AdSetFields::PROMOTED_OBJECT] = $this->objectiveArray;
        }

        if(!empty($this->targetingArray))
        {
            $targetingObject = new Targeting();
            $targetingObject->setData($this->targetingArray);
            $this->outputArray[AdSetFields::TARGETING] = $targetingObject;
        }


        return $this->outputArray;
    }


    public function setScheduleArray($scheduleArray)
    {
        $this->scheduleArray = $scheduleArray;
    }


    public function setObjectiveArray($objectiveArray)
    {
        $this->objectiveArray = $objectiveArray;
    }


    public function setOtherSpecArray($otherSpecArray)
    {
        $this->otherSpecArray = $otherSpecArray;
    }


    public function setTargetingArray($targetingArray)
    {
        $this->targetingArray = $targetingArray;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @param mixed $campaignId
     */
    public function setCampaignId($campaignId)
    {
        $this->campaignId = $campaignId;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @param array $bidArray
     */
    public function setBidArray($bidArray)
    {
        $this->bidArray = $bidArray;
    }


}