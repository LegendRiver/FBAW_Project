<?php


class AWCampaignEntity
{
    private $name;

    private $id;

    private $status;

    private $servingStatus;

    private $startDate;

    private $endDate;

    private $optimizationStatus;

    private $setting;

    private $channelType;

    private $subChannelType;

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return mixed
     */
    public function getServingStatus()
    {
        return $this->servingStatus;
    }

    /**
     * @param mixed $servingStatus
     */
    public function setServingStatus($servingStatus)
    {
        $this->servingStatus = $servingStatus;
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

    /**
     * @return mixed
     */
    public function getOptimizationStatus()
    {
        return $this->optimizationStatus;
    }

    /**
     * @param mixed $optimizationStatus
     */
    public function setOptimizationStatus($optimizationStatus)
    {
        $this->optimizationStatus = $optimizationStatus;
    }

    /**
     * @return mixed
     */
    public function getSetting()
    {
        return $this->setting;
    }

    /**
     * @param mixed $setting
     */
    public function setSetting($setting)
    {
        $this->setting = $setting;
    }

    /**
     * @return mixed
     */
    public function getChannelType()
    {
        return $this->channelType;
    }

    /**
     * @param mixed $channelType
     */
    public function setChannelType($channelType)
    {
        $this->channelType = $channelType;
    }

    /**
     * @return mixed
     */
    public function getSubChannelType()
    {
        return $this->subChannelType;
    }

    /**
     * @param mixed $subChannelType
     */
    public function setSubChannelType($subChannelType)
    {
        $this->subChannelType = $subChannelType;
    }

    public function __construct()
    {
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
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }


}