<?php


class ProfitDBEntity
{
    private $configId;

    private $dailyBudget;

    private $profitPercent;

    private $marginPercent;

    private $updateTime;

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
    public function getUpdateTime()
    {
        return $this->updateTime;
    }

    /**
     * @param mixed $updateTime
     */
    public function setUpdateTime($updateTime)
    {
        $this->updateTime = $updateTime;
    }

}