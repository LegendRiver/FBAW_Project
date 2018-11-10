<?php


class EliCampaignEntity
{
    private $id;
    private $accountId;
    private $name;
    private $campaignType;
    private $url;
    private $title;
    private $description;
    private $imageList;
    private $scheduleStart;
    private $scheduleEnd;
    private $timeStart;
    private $timeEnd;
    private $audience;
    private $status;
    private $budget;
    private $spend;
    private $deliveryType;
    private $keyWord;
    private $matchType;
    private $createTime;
    private $modifyTime;

    private $camConfigArray;

    public function __construct()
    {

    }

    /**
     * @return mixed
     */
    public function getCamConfigArray()
    {
        return $this->camConfigArray;
    }

    /**
     * @param mixed $camConfigArray
     */
    public function setCamConfigArray($camConfigArray)
    {
        $this->camConfigArray = $camConfigArray;
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
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
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

    /**
     * @return mixed
     */
    public function getImageList()
    {
        return $this->imageList;
    }

    /**
     * @param mixed $imageList
     */
    public function setImageList($imageList)
    {
        $this->imageList = $imageList;
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
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return mixed
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param mixed $url
     */
    public function setUrl($url)
    {
        $this->url = $url;
    }

}