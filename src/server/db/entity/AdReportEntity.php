<?php


class AdReportEntity extends CommonReportEntity
{
    private $campaignUid;

    private $adsetUid;

    private $adUid;

    private $campaignId;

    private $adsetId;

    private $adId;

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
    public function getAdUid()
    {
        return $this->adUid;
    }

    /**
     * @param mixed $adUid
     */
    public function setAdUid($adUid)
    {
        $this->adUid = $adUid;
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

}