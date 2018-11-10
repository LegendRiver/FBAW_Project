<?php


class AdEntity
{
    private $id;

    private $name;

    private $creativeId;

    private $effectiveStatus;

    private $bidType;

    private $status;

    private $createTime;

    private $updateTime;

    private $recommendArray;

    private $adSetId;

    private $accountId;

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
    public function getRecommendArray()
    {
        return $this->recommendArray;
    }

    /**
     * @param mixed $recommendArray
     */
    public function setRecommendArray($recommendArray)
    {
        $this->recommendArray = $recommendArray;
    }

    /**
     * @return mixed
     */
    public function getCreativeId()
    {
        return $this->creativeId;
    }

    /**
     * @param mixed $creativeId
     */
    public function setCreativeId($creativeId)
    {
        $this->creativeId = $creativeId;
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