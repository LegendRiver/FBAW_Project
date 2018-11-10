<?php


class DailySpendEntity
{
    private $uuid;

    private $configId;

    //整数
    private $currentDate;

    private $dailyBudget;

    private $dailySpend;

    private $profitPercent;

    private $marginPercent;

    /**
     * @return mixed
     */
    public function getConfigId()
    {
        return $this->configId;
    }

    /**
     * @param mixed $configId
     */
    public function setConfigId($configId)
    {
        $this->configId = $configId;
    }

    /**
     * @return mixed
     */
    public function getCurrentDate()
    {
        return $this->currentDate;
    }

    /**
     * @param mixed $currentDate
     */
    public function setCurrentDate($currentDate)
    {
        $this->currentDate = $currentDate;
    }

    /**
     * @return mixed
     */
    public function getDailyBudget()
    {
        return $this->dailyBudget;
    }

    /**
     * @param mixed $dailyBudget
     */
    public function setDailyBudget($dailyBudget)
    {
        $this->dailyBudget = $dailyBudget;
    }

    /**
     * @return mixed
     */
    public function getDailySpend()
    {
        return $this->dailySpend;
    }

    /**
     * @param mixed $dailySpend
     */
    public function setDailySpend($dailySpend)
    {
        $this->dailySpend = $dailySpend;
    }

    /**
     * @return mixed
     */
    public function getMarginPercent()
    {
        return $this->marginPercent;
    }

    /**
     * @param mixed $marginPercent
     */
    public function setMarginPercent($marginPercent)
    {
        $this->marginPercent = $marginPercent;
    }

    /**
     * @return mixed
     */
    public function getProfitPercent()
    {
        return $this->profitPercent;
    }

    /**
     * @param mixed $profitPercent
     */
    public function setProfitPercent($profitPercent)
    {
        $this->profitPercent = $profitPercent;
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