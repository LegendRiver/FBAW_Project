<?php


class AdManagerDBFacade
{
    private $campaignDB;

    private $adsetDB;

    private $creativeDB;

    private $adDB;

    private $imageDB;

    private $adReportDB;

    private $campaignReportDB;

    private $videoDB;

    public function __construct()
    {
        $this->campaignDB = new PublisherCampaignDB();
        $this->adsetDB = new PublisherAdsetDB();
        $this->creativeDB = new PublisherCreativeDB();
        $this->adDB = new PublisherAdDB();
        $this->imageDB = new PublisherImageDB();
        $this->adReportDB = new AdReportDB();
        $this->campaignReportDB = new CampaignReportDB();
        $this->videoDB = new PublisherVideoDB();
    }

    public function insertCampaignRecord(PublisherCampaignEntity $dbEntity)
    {
        return $this->campaignDB->addPublisherCamRecord($dbEntity);
    }

    public function insertAdsetRecord(PublisherAdSetEntity $dbEntity)
    {
        return $this->adsetDB->addAdsetRecord($dbEntity);
    }

    public function insertCreativeRecord(PublisherCreativeEntity $dbEntity)
    {
        return $this->creativeDB->addCreativeRecord($dbEntity);
    }

    public function insertAdRecord(PublisherAdEntity $dbEntity)
    {
        return $this->adDB->addAdRecord($dbEntity);
    }
    public function insertImageRecord(PublisherImageEntity $dbEntity)
    {
        return $this->imageDB->addImageRecord($dbEntity);
    }
    public function insertAdReportRecord(AdReportEntity $dbEntity)
    {
        return $this->adReportDB->addAdReportRecord($dbEntity);
    }
    public function insertCampaignReportRecord(CampaignReportEntity $dbEntity)
    {
        return $this->campaignReportDB->addCampaignReportRecord($dbEntity);
    }
    public function insertVideoRecord(PublisherVideoEntity $dbEntity)
    {
        return $this->videoDB->addVideoRecord($dbEntity);
    }


    public function getAdInfo($adId)
    {
        return $this->adDB->selectByFBAdId($adId);
    }
    public function getAdSetInfo($adSetId)
    {
        return $this->adsetDB->selectByFBAdsetId($adSetId);
    }
    public function getCampaignInfo($campaignId)
    {
        return $this->campaignDB->selectByFBCampaignId($campaignId);
    }

    public function getCreativeInfoByUid($creativeUid)
    {
        return $this->creativeDB->selectByCreativeUid($creativeUid);
    }
}