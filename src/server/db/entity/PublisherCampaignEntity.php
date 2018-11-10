<?php


class PublisherCampaignEntity
{
    private $uid;

    private $configId;

    private $campaignId;

    private $accountId;

    private $name;

    private $spendCap;

    private $campaignType;

    private $publisherType;

    private $status;

    private $createTime;

    private $modifyTime;

    /**
     * @return mixed
     */
    public function getPublisherType()
    {
        return $this->publisherType;
    }

    /**
     * @param mixed $publisherType
     */
    public function setPublisherType($publisherType)
    {
        $this->publisherType = $publisherType;
    }

    /**
     * @return mixed
     */
    public function getCreateTime()
    {
        return $this->createTime;
    }

    /**
     * @param mixed $createTime
     */
    public function setCreateTime($createTime)
    {
        $this->createTime = $createTime;
    }

    /**
     * @return mixed
     */
    public function getModifyTime()
    {
        return $this->modifyTime;
    }

    /**
     * @param mixed $modifyTime
     */
    public function setModifyTime($modifyTime)
    {
        $this->modifyTime = $modifyTime;
    }

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
    public function getCampaignType()
    {
        return $this->campaignType;
    }

    /**
     * @param mixed $campaignType
     */
    public function setCampaignType($campaignType)
    {
        $this->campaignType = $campaignType;
    }

    /**
     * @return mixed
     */
    public function getSpendCap()
    {
        return $this->spendCap;
    }

    /**
     * @param mixed $spendCap
     */
    public function setSpendCap($spendCap)
    {
        $this->spendCap = $spendCap;
    }

    /**
     * @return mixed
     */
    public function getUid()
    {
        return $this->uid;
    }

    /**
     * @param mixed $uid
     */
    public function setUid($uid)
    {
        $this->uid = $uid;
    }


}