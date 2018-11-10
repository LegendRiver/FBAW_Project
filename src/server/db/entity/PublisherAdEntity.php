<?php


class PublisherAdEntity
{
    private $uuid;

    private $adsetUid;

    private $adId;

    private $creativeUid;

    private $publisherType;

    private $status;

    private $name;

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
    public function getAdId()
    {
        return $this->adId;
    }

    /**
     * @param mixed $adId
     */
    public function setAdId($adId)
    {
        $this->adId = $adId;
    }

    /**
     * @return mixed
     */
    public function getAdsetUid()
    {
        return $this->adsetUid;
    }

    /**
     * @param mixed $adsetUid
     */
    public function setAdsetUid($adsetUid)
    {
        $this->adsetUid = $adsetUid;
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
    public function getCreativeUid()
    {
        return $this->creativeUid;
    }

    /**
     * @param mixed $creativeUid
     */
    public function setCreativeUid($creativeUid)
    {
        $this->creativeUid = $creativeUid;
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