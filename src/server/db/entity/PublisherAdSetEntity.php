<?php


class PublisherAdSetEntity
{
    private $uid;

    private $campaignUid;

    private $adsetId;

    private $publisherType;

    private $name;

    private $budget;

    private $scheduleStart;

    private $scheduleEnd;

    private $timeStart;

    private $timeEnd;

    //targeting
    private $audience;

    private $bid;

    private $bidType;

    private $chargeType;

    private $deliveryType;

    private $budgetType;

    private $status;

    private $keyWord;

    private $matchType;

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
    public function getAdsetId()
    {
        return $this->adsetId;
    }

    /**
     * @param mixed $adsetId
     */
    public function setAdsetId($adsetId)
    {
        $this->adsetId = $adsetId;
    }

    /**
     * @return mixed
     */
    public function getAudience()
    {
        return $this->audience;
    }

    /**
     * @param mixed $audience
     */
    public function setAudience($audience)
    {
        $this->audience = $audience;
    }

    /**
     * @return mixed
     */
    public function getBid()
    {
        return $this->bid;
    }

    /**
     * @param mixed $bid
     */
    public function setBid($bid)
    {
        $this->bid = $bid;
    }

    /**
     * @return mixed
     */
    public function getBidType()
    {
        return $this->bidType;
    }

    /**
     * @param mixed $bidType
     */
    public function setBidType($bidType)
    {
        $this->bidType = $bidType;
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
    public function getBudgetType()
    {
        return $this->budgetType;
    }

    /**
     * @param mixed $budgetType
     */
    public function setBudgetType($budgetType)
    {
        $this->budgetType = $budgetType;
    }

    /**
     * @return mixed
     */
    public function getCampaignUid()
    {
        return $this->campaignUid;
    }

    /**
     * @param mixed $campaignUid
     */
    public function setCampaignUid($campaignUid)
    {
        $this->campaignUid = $campaignUid;
    }

    /**
     * @return mixed
     */
    public function getChargeType()
    {
        return $this->chargeType;
    }

    /**
     * @param mixed $chargeType
     */
    public function setChargeType($chargeType)
    {
        $this->chargeType = $chargeType;
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
    public function getDeliveryType()
    {
        return $this->deliveryType;
    }

    /**
     * @param mixed $deliveryType
     */
    public function setDeliveryType($deliveryType)
    {
        $this->deliveryType = $deliveryType;
    }

    /**
     * @return mixed
     */
    public function getKeyWord()
    {
        return $this->keyWord;
    }

    /**
     * @param mixed $keyWord
     */
    public function setKeyWord($keyWord)
    {
        $this->keyWord = $keyWord;
    }

    /**
     * @return mixed
     */
    public function getMatchType()
    {
        return $this->matchType;
    }

    /**
     * @param mixed $matchType
     */
    public function setMatchType($matchType)
    {
        $this->matchType = $matchType;
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
    public function getScheduleEnd()
    {
        return $this->scheduleEnd;
    }

    /**
     * @param mixed $scheduleEnd
     */
    public function setScheduleEnd($scheduleEnd)
    {
        $this->scheduleEnd = $scheduleEnd;
    }

    /**
     * @return mixed
     */
    public function getScheduleStart()
    {
        return $this->scheduleStart;
    }

    /**
     * @param mixed $scheduleStart
     */
    public function setScheduleStart($scheduleStart)
    {
        $this->scheduleStart = $scheduleStart;
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
    public function getTimeEnd()
    {
        return $this->timeEnd;
    }

    /**
     * @param mixed $timeEnd
     */
    public function setTimeEnd($timeEnd)
    {
        $this->timeEnd = $timeEnd;
    }

    /**
     * @return mixed
     */
    public function getTimeStart()
    {
        return $this->timeStart;
    }

    /**
     * @param mixed $timeStart
     */
    public function setTimeStart($timeStart)
    {
        $this->timeStart = $timeStart;
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