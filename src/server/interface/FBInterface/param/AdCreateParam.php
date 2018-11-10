<?php


class AdCreateParam
{
    private $accountId;

    private $name;

    private $creativeId;

    private $adsetId;

    private $status;

    public function __construct()
    {
        $this->status = AdManageConstants::PARAM_STATUS_PAUSED;
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

    public function setAdsetId($adsetId)
    {
        $this->adsetId = $adsetId;
    }

    public function setCreativeId($creativeId)
    {
        $this->creativeId = $creativeId;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return mixed
     */
    public function getAdsetId()
    {
        return $this->adsetId;
    }

    /**
     * @return mixed
     */
    public function getCreativeId()
    {
        return $this->creativeId;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

}