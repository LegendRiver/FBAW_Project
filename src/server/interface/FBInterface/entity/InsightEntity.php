<?php


class InsightEntity
{
    private $accountId;

    private $campaignId;

    private $adSetId;

    private $adId;

    private $startDate;

    private $stopDate;

    private $objective;

    private $results;
    private $resultType;
    private $actionsArray;

    private $spend;

    private $impressions;

    private $reach;

    private $clicks;

    private $callToActionClicks;

    private $uniqueClicks;

    private $cpc;

    private $cpm;

    private $ctr;

    private $cpp;

    /**
     * @return mixed
     */
    public function getActionsArray()
    {
        return $this->actionsArray;
    }

    /**
     * @param mixed $actionsArray
     */
    public function setActionsArray($actionsArray)
    {
        $this->actionsArray = $actionsArray;
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
    public function getAdId()
    {
        return $this->adId;
    }

    /**
     * @param mixed $adId
     */
    public function setAdId($adId)
    {
        $this->adId = $adId;
    }

    /**
     * @return mixed
     */
    public function getAdSetId()
    {
        return $this->adSetId;
    }

    /**
     * @param mixed $adSetId
     */
    public function setAdSetId($adSetId)
    {
        $this->adSetId = $adSetId;
    }

    /**
     * @return mixed
     */
    public function getCallToActionClicks()
    {
        return $this->callToActionClicks;
    }

    /**
     * @param mixed $callToActionClicks
     */
    public function setCallToActionClicks($callToActionClicks)
    {
        $this->callToActionClicks = $callToActionClicks;
    }

    /**
     * @return mixed
     */
    public function getCampaignId()
    {
        return $this->campaignId;
    }

    /**
     * @param mixed $campaignId
     */
    public function setCampaignId($campaignId)
    {
        $this->campaignId = $campaignId;
    }

    /**
     * @return mixed
     */
    public function getClicks()
    {
        return $this->clicks;
    }

    /**
     * @param mixed $clicks
     */
    public function setClicks($clicks)
    {
        $this->clicks = $clicks;
    }

    /**
     * @return mixed
     */
    public function getCpc()
    {
        return $this->cpc;
    }

    /**
     * @param mixed $cpc
     */
    public function setCpc($cpc)
    {
        $this->cpc = $cpc;
    }

    /**
     * @return mixed
     */
    public function getCpm()
    {
        return $this->cpm;
    }

    /**
     * @param mixed $cpm
     */
    public function setCpm($cpm)
    {
        $this->cpm = $cpm;
    }

    /**
     * @return mixed
     */
    public function getCpp()
    {
        return $this->cpp;
    }

    /**
     * @param mixed $cpp
     */
    public function setCpp($cpp)
    {
        $this->cpp = $cpp;
    }

    /**
     * @return mixed
     */
    public function getCtr()
    {
        return $this->ctr;
    }

    /**
     * @param mixed $ctr
     */
    public function setCtr($ctr)
    {
        $this->ctr = $ctr;
    }

    /**
     * @return mixed
     */
    public function getImpressions()
    {
        return $this->impressions;
    }

    /**
     * @param mixed $impressions
     */
    public function setImpressions($impressions)
    {
        $this->impressions = $impressions;
    }

    /**
     * @return mixed
     */
    public function getObjective()
    {
        return $this->objective;
    }

    /**
     * @param mixed $objective
     */
    public function setObjective($objective)
    {
        $this->objective = $objective;
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
    public function getResults()
    {
        return $this->results;
    }

    /**
     * @param mixed $results
     */
    public function setResults($results)
    {
        $this->results = $results;
    }

    /**
     * @return mixed
     */
    public function getResultType()
    {
        return $this->resultType;
    }

    /**
     * @param mixed $resultType
     */
    public function setResultType($resultType)
    {
        $this->resultType = $resultType;
    }

    /**
     * @return mixed
     */
    public function getSpend()
    {
        return $this->spend;
    }

    /**
     * @param mixed $spend
     */
    public function setSpend($spend)
    {
        $this->spend = $spend;
    }

    /**
     * @return mixed
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * @param mixed $startDate
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;
    }

    /**
     * @return mixed
     */
    public function getStopDate()
    {
        return $this->stopDate;
    }

    /**
     * @param mixed $stopDate
     */
    public function setStopDate($stopDate)
    {
        $this->stopDate = $stopDate;
    }

    /**
     * @return mixed
     */
    public function getUniqueClicks()
    {
        return $this->uniqueClicks;
    }

    /**
     * @param mixed $uniqueClicks
     */
    public function setUniqueClicks($uniqueClicks)
    {
        $this->uniqueClicks = $uniqueClicks;
    }

}