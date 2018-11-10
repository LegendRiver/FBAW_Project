<?php


class AdAccountEntity
{
    private $id;

    private $name;

    private $tosAccepted;

    private $timezoneId;

    private $timezoneName;

    private $timezoneOffset;

    private $currency;

    private $status;

    private $age;

    private $createTime;

    private $spendCap;

    private $amountSpend;

    /**
     * @return mixed
     */
    public function getAmountSpend()
    {
        return $this->amountSpend;
    }

    /**
     * @param mixed $amountSpend
     */
    public function setAmountSpend($amountSpend)
    {
        $this->amountSpend = $amountSpend;
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
    public function getAge()
    {
        return $this->age;
    }

    /**
     * @param mixed $age
     */
    public function setAge($age)
    {
        $this->age = $age;
    }

    /**
     * @return mixed
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * @param mixed $currency
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;
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
    public function getTimezoneId()
    {
        return $this->timezoneId;
    }

    /**
     * @param mixed $timezoneId
     */
    public function setTimezoneId($timezoneId)
    {
        $this->timezoneId = $timezoneId;
    }

    /**
     * @return mixed
     */
    public function getTimezoneName()
    {
        return $this->timezoneName;
    }

    /**
     * @param mixed $timezoneName
     */
    public function setTimezoneName($timezoneName)
    {
        $this->timezoneName = $timezoneName;
    }

    /**
     * @return mixed
     */
    public function getTimezoneOffset()
    {
        return $this->timezoneOffset;
    }

    /**
     * @param mixed $timezoneOffset
     */
    public function setTimezoneOffset($timezoneOffset)
    {
        $this->timezoneOffset = $timezoneOffset;
    }

    /**
     * @return mixed
     */
    public function getTosAccepted()
    {
        return $this->tosAccepted;
    }

    /**
     * @param mixed $tosAccepted
     */
    public function setTosAccepted($tosAccepted)
    {
        $this->tosAccepted = $tosAccepted;
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