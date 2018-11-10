<?php

use FacebookAds\Object\Fields\AdSetFields;
use FacebookAds\Object\Fields\DayPartFields;

/**
 * 预算与排期
 * Class ScheduleBuilder
 */
class ScheduleBuilder implements IFieldBuilder
{
    //daily or schedule
    private $budgetType;

    private $startTime;

    private $endTime;

    //单位是美分
    private $budgetAmount;

    private $dayArray;

    private $startMin;

    private $endMin;

    private $scheduleArray;
    private $outputArray;

    public function __construct()
    {
        $this->dayArray = array();
        $this->scheduleArray = array();
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();
        $this->outputArray[AdSetFields::START_TIME] = $this->startTime;
        $this->outputArray[AdSetFields::END_TIME] = $this->endTime;
        $this->appendBudgetAmount();

        if(!empty($this->dayArray))
        {
            $this->appendSchedule();
        }

        return $this->outputArray;

    }

    private function appendSchedule()
    {
        $this->scheduleArray = array();

        $unitArray = array();
        $unitArray[DayPartFields::DAYS] = $this->dayArray;
        $unitArray[DayPartFields::START_MINUTE] = $this->startMin;
        $unitArray[DayPartFields::END_MINUTE] = $this->endMin;

        $this->scheduleArray[] = $unitArray;

        $this->outputArray[AdSetFields::ADSET_SCHEDULE] = $this->scheduleArray;
    }

    private function appendBudgetAmount()
    {
        if(AdManageConstants::ADSET_BUDGET_TYPE_DAILY == $this->budgetType)
        {
            $this->outputArray[AdSetFields::DAILY_BUDGET] = $this->budgetAmount;
        }
        else if(AdManageConstants::ADSET_BUDGET_TYPE_SCHEDULE == $this->budgetType)
        {
            $this->outputArray[AdSetFields::LIFETIME_BUDGET] = $this->budgetAmount;
        }
        else
        {

        }
    }

    /**
     * @param array $dayArray
     */
    public function setDayArray($dayArray)
    {
        $this->dayArray = $dayArray;
    }

    /**
     * @param mixed $endMin
     */
    public function setEndMin($endMin)
    {
        $this->endMin = $endMin;
    }

    /**
     * @param mixed $startMin
     */
    public function setStartMin($startMin)
    {
        $this->startMin = $startMin;
    }

    /**
     * @param mixed $budgetAmount
     */
    public function setBudgetAmount($budgetAmount)
    {
        $this->budgetAmount = floor($budgetAmount);
    }

    /**
     * @param mixed $budgetType
     */
    public function setBudgetType($budgetType)
    {
        $this->budgetType = $budgetType;
    }

    /**
     * @param mixed $endTime
     */
    public function setEndTime($endTime)
    {
        $this->endTime = $endTime;
    }

    /**
     * @param mixed $startTime
     */
    public function setStartTime($startTime)
    {
        $this->startTime = $startTime;
    }


}