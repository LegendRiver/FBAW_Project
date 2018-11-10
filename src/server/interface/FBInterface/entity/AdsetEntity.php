<?php


class AdsetEntity
{
    private $id;
    private $name;
    private $campaignId;
    private $accountId;
    private $optimizationGoal;
    private $promoteObjectAppId;
    private $promoteObjectAppUrl;
    private $dailyBudget;
    private $lifetimeBudget;
    private $budgetRemaining;
    private $isAutobid;
    private $bitAmount;
    private $createdTime;
    private $startTime;
    private $endTime;
    private $status;
    private $effectiveStatus;
    private $billEvents;
    private $updateTime;

    private $targeting;

    /**
     * @return mixed
     */
    public function getEffectiveStatus()
    {
        return $this->effectiveStatus;
    }

    /**
     * @param mixed $effectiveStatus
     */
    public function setEffectiveStatus($effectiveStatus)
    {
        $this->effectiveStatus = $effectiveStatus;
    }

    /**
     * @return mixed
     */
    public function getTargeting()
    {
        return $this->targeting;
    }

    /**
     * @param mixed $targeting
     */
    public function setTargeting($targeting)
    {
        $this->targeting = $targeting;
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

    /**
     * @return mixed
     */
    public function getBillEvents()
    {
        return $this->billEvents;
    }

    /**
     * @param mixed $billEvents
     */
    public function setBillEvents($billEvents)
    {
        $this->billEvents = $billEvents;
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
    }/**
     * @return mixed
     */
    public function getBitAmount()
    {
        return $this->bitAmount;
    }/**
     * @param mixed $bitAmount
     */
    public function setBitAmount($bitAmount)
    {
        $this->bitAmount = $bitAmount;
    }/**
     * @return mixed
     */
    public function getBudgetRemaining()
    {
        return $this->budgetRemaining;
    }/**
     * @param mixed $budgetRemaining
     */
    public function setBudgetRemaining($budgetRemaining)
    {
        $this->budgetRemaining = $budgetRemaining;
    }/**
     * @return mixed
     */
    public function getCampaignId()
    {
        return $this->campaignId;
    }/**
     * @param mixed $campaignId
     */
    public function setCampaignId($campaignId)
    {
        $this->campaignId = $campaignId;
    }/**
     * @return mixed
     */
    public function getCreatedTime()
    {
        return $this->createdTime;
    }/**
     * @param mixed $createdTime
     */
    public function setCreatedTime($createdTime)
    {
        $this->createdTime = $createdTime;
    }/**
     * @return mixed
     */
    public function getDailyBudget()
    {
        return $this->dailyBudget;
    }/**
     * @param mixed $dailyBudget
     */
    public function setDailyBudget($dailyBudget)
    {
        $this->dailyBudget = $dailyBudget;
    }/**
     * @return mixed
     */
    public function getEndTime()
    {
        return $this->endTime;
    }/**
     * @param mixed $endTime
     */
    public function setEndTime($endTime)
    {
        $this->endTime = $endTime;
    }/**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }/**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }/**
     * @return mixed
     */
    public function getIsAutobid()
    {
        return $this->isAutobid;
    }/**
     * @param mixed $isAutobid
     */
    public function setIsAutobid($isAutobid)
    {
        $this->isAutobid = $isAutobid;
    }/**
     * @return mixed
     */
    public function getLifetimeBudget()
    {
        return $this->lifetimeBudget;
    }/**
     * @param mixed $lifetimeBudget
     */
    public function setLifetimeBudget($lifetimeBudget)
    {
        $this->lifetimeBudget = $lifetimeBudget;
    }/**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }/**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }/**
     * @return mixed
     */
    public function getOptimizationGoal()
    {
        return $this->optimizationGoal;
    }/**
     * @param mixed $optimizationGoal
     */
    public function setOptimizationGoal($optimizationGoal)
    {
        $this->optimizationGoal = $optimizationGoal;
    }/**
     * @return mixed
     */
    public function getPromoteObjectAppId()
    {
        return $this->promoteObjectAppId;
    }/**
     * @param mixed $promoteObjectAppId
     */
    public function setPromoteObjectAppId($promoteObjectAppId)
    {
        $this->promoteObjectAppId = $promoteObjectAppId;
    }/**
     * @return mixed
     */
    public function getStartTime()
    {
        return $this->startTime;
    }/**
     * @param mixed $startTime
     */
    public function setStartTime($startTime)
    {
        $this->startTime = $startTime;
    }/**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }/**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return mixed
     */
    public function getPromoteObjectAppUrl()
    {
        return $this->promoteObjectAppUrl;
    }

    /**
     * @param mixed $promoteObjectAppUrl
     */
    public function setPromoteObjectAppUrl($promoteObjectAppUrl)
    {
        $this->promoteObjectAppUrl = $promoteObjectAppUrl;
    }





}