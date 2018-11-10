<?php

use Google\AdsApi\AdWords\v201705\cm\CampaignStatus;

abstract class AWCampaignParam
{
    protected $accountId;

    protected $name;

    protected $status;

    protected $channelType;

    protected $channelSubType;

    protected $budgetId;

    protected $bidConfig;

    protected $startDate;

    protected $endDate;

    protected $campaignType;

    protected $locationId;

    protected $languageId;

    abstract protected function initChannelType();
    abstract protected function checkOtherParam();

    public function __construct()
    {
        $this->initChannelType();
    }

    public function checkParam()
    {
        if(empty($this->name))
        {
            ServerLogger::instance()->writeAdwordsLog(Error, 'The Campaign name is empty.');
            return false;
        }

        if(empty($this->channelType))
        {
            ServerLogger::instance()->writeAdwordsLog(Error, 'The campaign channelType is empty.');
            return false;
        }

        if(empty($this->status))
        {
            ServerLogger::instance()->wrtieAdwordLog(Error, 'The campaign status is empty');
            return false;
        }

        if(empty($this->budgetId))
        {
            ServerLogger::instance()->wrtieAdwordLog(Error, 'The campaign budget is empty');
            return false;
        }

        if(empty($this->bidConfig))
        {
            ServerLogger::instance()->writeAdwordLog(Error, 'The campaign bid configuration is empty.');
            return false;
        }

        if(!$this->checkOtherParam())
        {
            return false;
        }

        return true;
    }

    public function setStatus($status)
    {
        if(AWCampaignValues::CAMPAIGN_STATUS_ENABLE == $status)
        {
            $this->status = CampaignStatus::ENABLED;
        }
        elseif(AWCampaignValues::CAMPAIGN_STATUS_PAUSED == $status)
        {
            $this->status = CampaignStatus::PAUSED;
        }
        elseif(AWCampaignValues::CAMPAIGN_STATUS_REMOVED == $status)
        {
            $this->status = CampaignStatus::REMOVED;
        }
        else
        {
            $this->status = CampaignStatus::PAUSED;
            ServerLogger::instance()->writeAdwordsLog(Warning, 'The status is invalid. ');
        }

    }

    /**
     * @return mixed
     */
    public function getLanguageId()
    {
        return $this->languageId;
    }

    /**
     * @param mixed $languageId
     */
    public function setLanguageId($languageId)
    {
        $this->languageId = $languageId;
    }

    /**
     * @return mixed
     */
    public function getLocationId()
    {
        return $this->locationId;
    }

    /**
     * @param mixed $locationId
     */
    public function setLocationId($locationId)
    {
        $this->locationId = $locationId;
    }

    /**
     * @return mixed
     */
    public function getCampaignType()
    {
        return $this->campaignType;
    }

    public function setCampaignType($campaignType)
    {
        $this->campaignType = $campaignType;
    }

    /**
     * @return mixed
     */
    public function getBudgetId()
    {
        return $this->budgetId;
    }

    /**
     * @param mixed $budgetId
     */
    public function setBudgetId($budgetId)
    {
        $this->budgetId = $budgetId;
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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getChannelType()
    {
        return $this->channelType;
    }

    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @return mixed
     */
    public function getChannelSubType()
    {
        return $this->channelSubType;
    }

    /**
     * @return mixed
     */
    public function getBidConfig()
    {
        return $this->bidConfig;
    }

    /**
     * @param mixed $bidConfig
     */
    public function setBidConfig($bidConfig)
    {
        $this->bidConfig = $bidConfig;
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
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * @param mixed $endDate
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;
    }

}