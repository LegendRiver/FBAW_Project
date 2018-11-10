<?php


class CommonReportEntity
{
    private $uuid;

    private $startTime;

    private $endTime;

    private $requestTime;

    private $resultValue;

    private $resultType;

    private $resultRate;

    private $costPerResult;

    private $reach;

    private $spend;

    private $impression;

    private $click;

    private $cpc;

    private $ctr;

    private $cpm;

    private $installs;

    private $cpi;

    private $cvr;

    private $bounceRate;

    private $averagePageView;

    private $averagePosition;

    private $averageTimeOnsite;

    public function __construct()
    {
        $this->cpi = 0;
        $this->cvr = 0;

        $this->bounceRate = 0;
        $this->averagePageView = 0;
        $this->averagePosition = 0;
        $this->averageTimeOnsite = 0;
    }

    /**
     * @return mixed
     */
    public function getInstalls()
    {
        return $this->installs;
    }

    /**
     * @param mixed $installs
     */
    public function setInstalls($installs)
    {
        $this->installs = $installs;
    }

    /**
     * @return mixed
     */
    public function getRequestTime()
    {
        return $this->requestTime;
    }

    /**
     * @param mixed $requestTime
     */
    public function setRequestTime($requestTime)
    {
        $this->requestTime = $requestTime;
    }

    /**
     * @return mixed
     */
    public function getClick()
    {
        return $this->click;
    }

    /**
     * @param mixed $click
     */
    public function setClick($click)
    {
        $this->click = $click;
    }

    /**
     * @return mixed
     */
    public function getCostPerResult()
    {
        return $this->costPerResult;
    }

    /**
     * @param mixed $costPerResult
     */
    public function setCostPerResult($costPerResult)
    {
        $this->costPerResult = $costPerResult;
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
    public function getCpi()
    {
        return $this->cpi;
    }

    /**
     * @param mixed $cpi
     */
    public function setCpi($cpi)
    {
        $this->cpi = $cpi;
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
    public function getCvr()
    {
        return $this->cvr;
    }

    /**
     * @param mixed $cvr
     */
    public function setCvr($cvr)
    {
        $this->cvr = $cvr;
    }

    /**
     * @return mixed
     */
    public function getEndTime()
    {
        return $this->endTime;
    }

    /**
     * @param mixed $endTime
     */
    public function setEndTime($endTime)
    {
        $this->endTime = $endTime;
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
    public function getResultRate()
    {
        return $this->resultRate;
    }

    /**
     * @param mixed $resultRate
     */
    public function setResultRate($resultRate)
    {
        $this->resultRate = $resultRate;
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
    public function getResultValue()
    {
        return $this->resultValue;
    }

    /**
     * @param mixed $resultValue
     */
    public function setResultValue($resultValue)
    {
        $this->resultValue = $resultValue;
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
    public function getUuid()
    {
        return $this->uuid;
    }

    /**
     * @param mixed $uuid
     */
    public function setUuid($uuid)
    {
        $this->uuid = $uuid;
    }

}