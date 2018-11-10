<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/11/16
 * Time: 下午8:06
 */
class AccountInfoEntity
{
    private $id;

    private $productId;

    private $accountId;

    private $name;

    private $agency;

    private $isDisplay;

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
    public function getProductId()
    {
        return $this->productId;
    }

    /**
     * @param mixed $productId
     */
    public function setProductId($productId)
    {
        $this->productId = $productId;
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
    public function getAgency()
    {
        return $this->agency;
    }

    /**
     * @param mixed $agency
     */
    public function setAgency($agency)
    {
        $this->agency = $agency;
    }

    /**
     * @return mixed
     */
    public function getIsDisplay()
    {
        return $this->isDisplay;
    }

    /**
     * @param mixed $isDisplay
     */
    public function setIsDisplay($isDisplay)
    {
        $this->isDisplay = $isDisplay;
    }


}