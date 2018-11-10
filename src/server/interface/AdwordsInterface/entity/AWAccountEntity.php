<?php


class AWAccountEntity
{
    private $name;

    private $id;

    private $currencyCode;

    private $timeZone;

    private $canManageClient;

    private $isTestAccount;

    private $label;

    private $depth;

    public function __construct()
    {
        $this->depth = -1;
    }

    /**
     * @return mixed
     */
    public function getCurrencyCode()
    {
        return $this->currencyCode;
    }

    /**
     * @param mixed $currencyCode
     */
    public function setCurrencyCode($currencyCode)
    {
        $this->currencyCode = $currencyCode;
    }

    /**
     * @return mixed
     */
    public function getTimeZone()
    {
        return $this->timeZone;
    }

    /**
     * @param mixed $timeZone
     */
    public function setTimeZone($timeZone)
    {
        $this->timeZone = $timeZone;
    }

    /**
     * @return mixed
     */
    public function getCanManageClient()
    {
        return $this->canManageClient;
    }

    /**
     * @param mixed $canManageClient
     */
    public function setCanManageClient($canManageClient)
    {
        $this->canManageClient = $canManageClient;
    }

    /**
     * @return mixed
     */
    public function getIsTestAccount()
    {
        return $this->isTestAccount;
    }

    /**
     * @param mixed $isTestAccount
     */
    public function setIsTestAccount($isTestAccount)
    {
        $this->isTestAccount = $isTestAccount;
    }

    /**
     * @return mixed
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param mixed $label
     */
    public function setLabel($label)
    {
        $this->label = $label;
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

    /**
     * @return mixed
     */
    public function getDepth()
    {
        return $this->depth;
    }

    /**
     * @param mixed $depth
     */
    public function setDepth($depth)
    {
        $this->depth = $depth;
    }


}