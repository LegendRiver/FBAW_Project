<?php

use FacebookAds\Object\Fields\AdSetFields;
use FacebookAds\Object\Values\AdSetBillingEventValues;

/**
 * 竞价
 * Class BidBuilder
 */
class BidBuilder implements IFieldBuilder
{
    private $optimizationGoal;

    private $billEvent;

    //如果为零则为自动报价
    private $bidAmount;

    private $paceTypeArray;

    private $outputArray;

    public function __construct()
    {
        $this->bidAmount = 0;
        $this->billEvent = AdSetBillingEventValues::IMPRESSIONS;
        $this->paceTypeArray = array(AdManageConstants::ADSET_PACE_TYPE_STANDARD);
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();
        $this->outputArray[AdSetFields::BILLING_EVENT] = $this->billEvent;
        if(isset($this->optimizationGoal))
        {
            $this->outputArray[AdSetFields::OPTIMIZATION_GOAL] = $this->optimizationGoal;
        }
        $this->appendBidAmount();

        if(isset($this->paceTypeArray) && !empty($this->paceTypeArray))
        {
           $this->outputArray[AdSetFields::PACING_TYPE] = $this->paceTypeArray;
        }

        return $this->outputArray;
    }

    private function appendBidAmount()
    {
        if($this->bidAmount > 0)
        {
            $this->outputArray[AdSetFields::BID_AMOUNT] = $this->bidAmount;
            $this->outputArray[AdSetFields::IS_AUTOBID] = false;
        }
        else
        {
            $this->outputArray[AdSetFields::IS_AUTOBID] = true;
        }
    }


    /**
     * @param int $bidAmount
     */
    public function setBidAmount($bidAmount)
    {
        $this->bidAmount = floor($bidAmount);
    }

    /**
     * @param int $billEvent
     */
    public function setBillEvent($billEvent)
    {
        $this->billEvent = $billEvent;
    }

    /**
     * @param mixed $optimizationGoal
     */
    public function setOptimizationGoal($optimizationGoal)
    {
        $this->optimizationGoal = $optimizationGoal;
    }

    /**
     * @param mixed $paceTypeArray
     */
    public function setPaceTypeArray($paceTypeArray)
    {
        $this->paceTypeArray = $paceTypeArray;
    }

}