<?php


class CampaignCreateParam
{
    private $name;

    private $adAccountId;

    /*可选值：
    APP = 0;
    WEBSITE = 1;*/
    private $campaignType;

    /*可选值：
    ACTIVE = 0;
    PAUSED = 1;*/
    private $status;

    private $productCatalogId;

    //必须大于$100,单位美分
    private $spendCap;

    public function __construct()
    {
        $this->status = AdManageConstants::PARAM_STATUS_PAUSED;
    }

    /**
     * @return mixed
     */
    public function getProductCatalogId()
    {
        return $this->productCatalogId;
    }

    /**
     * @param mixed $productCatalogId
     */
    public function setProductCatalogId($productCatalogId)
    {
        $this->productCatalogId = $productCatalogId;
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
    public function getAdAccountId()
    {
        return $this->adAccountId;
    }

    /**
     * @param mixed $adAccountId
     */
    public function setAdAccountId($adAccountId)
    {
        $this->adAccountId = $adAccountId;
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

}