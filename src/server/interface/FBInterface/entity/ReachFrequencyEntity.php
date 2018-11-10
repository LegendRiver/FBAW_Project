<?php


class ReachFrequencyEntity
{
    private $accountId;

    private $startTime;

    private $stopTime;

    private $curveBudgetReach;

    private $destinationId;

    private $budget;

    private $reach;

    private $impression;

    private $frequencyCap;

    private $predictionId;

    private $audienceSize;

    private $intervalFrequency;

    private $frequencyDistribution;

    /**
     * @return mixed
     */
    public function getFrequencyDistribution()
    {
        return $this->frequencyDistribution;
    }

    /**
     * @param mixed $frequencyDistribution
     */
    public function setFrequencyDistribution($frequencyDistribution)
    {
        $this->frequencyDistribution = $frequencyDistribution;
    }

    /**
     * @return mixed
     */
    public function getIntervalFrequency()
    {
        return $this->intervalFrequency;
    }

    /**
     * @param mixed $intervalFrequency
     */
    public function setIntervalFrequency($intervalFrequency)
    {
        $this->intervalFrequency = $intervalFrequency;
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
    public function getAudienceSize()
    {
        return $this->audienceSize;
    }

    /**
     * @param mixed $audienceSize
     */
    public function setAudienceSize($audienceSize)
    {
        $this->audienceSize = $audienceSize;
    }

    /**
     * @return mixed
     */
    public function getBudget()
    {
        return $this->budget;
    }

    /**
     * @param mixed $budget
     */
    public function setBudget($budget)
    {
        $this->budget = $budget;
    }

    /**
     * @return mixed
     */
    public function getCurveBudgetReach()
    {
        return $this->curveBudgetReach;
    }

    /**
     * @param mixed $curveBudgetReach
     */
    public function setCurveBudgetReach($curveBudgetReach)
    {
        $this->curveBudgetReach = $curveBudgetReach;
    }

    /**
     * @return mixed
     */
    public function getDestinationId()
    {
        return $this->destinationId;
    }

    /**
     * @param mixed $destinationId
     */
    public function setDestinationId($destinationId)
    {
        $this->destinationId = $destinationId;
    }

    /**
     * @return mixed
     */
    public function getFrequencyCap()
    {
        return $this->frequencyCap;
    }

    /**
     * @param mixed $frequencyCap
     */
    public function setFrequencyCap($frequencyCap)
    {
        $this->frequencyCap = $frequencyCap;
    }

    /**
     * @return mixed
     */
    public function getImpression()
    {
        return $this->impression;
    }

    /**
     * @param mixed $impression
     */
    public function setImpression($impression)
    {
        $this->impression = $impression;
    }

    /**
     * @return mixed
     */
    public function getPredictionId()
    {
        return $this->predictionId;
    }

    /**
     * @param mixed $predictionId
     */
    public function setPredictionId($predictionId)
    {
        $this->predictionId = $predictionId;
    }

    /**
     * @return mixed
     */
    public function getReach()
    {
        return $this->reach;
    }

    /**
     * @param mixed $reach
     */
    public function setReach($reach)
    {
        $this->reach = $reach;
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
    public function getStopTime()
    {
        return $this->stopTime;
    }

    /**
     * @param mixed $stopTime
     */
    public function setStopTime($stopTime)
    {
        $this->stopTime = $stopTime;
    }

}