<?php


class CampaignReportEntity extends CommonReportEntity
{
    private $campaignUid;

    private $campaignId;

    private $configId;

    /**
     * @return mixed
     */
    public function getConfigId()
    {
        return $this->configId;
    }

    /**
     * @param mixed $configId
     */
    public function setConfigId($configId)
    {
        $this->configId = $configId;
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