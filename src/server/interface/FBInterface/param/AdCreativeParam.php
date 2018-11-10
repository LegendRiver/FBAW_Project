<?php


class AdCreativeParam
{
    private $accountId;

    private $campaignType;

    private $linkAdType;

    private $adFormat;

    private $name;

    private $title;

    private $message;

    private $ObjectUrl;

    private $pageId;

    private $imageHash;

    private $linkDataDescription;

    private $linkDataCaption;

    private $carouselImageHashArray;

    private $carouselNameArray;

    private $carouselDescArray;

    private $carouselVideoIdArray;

    private $callToActionType;

    private $videoId;

    private $productSetId;

    public function __construct()
    {
        $this->message = '';
        $this->linkDataCaption = '';
        $this->linkDataDescription = '';
        $this->carouselDescArray = array();
        $this->carouselNameArray = array();
        $this->carouselImageHashArray = array();
        $this->carouselVideoIdArray = array();
        $this->videoId = '';
        $this->linkAdType = AdManageConstants::LINK_AD_TYPE_LINKDATA;
    }

    /**
     * @return array
     */
    public function getCarouselVideoIdArray()
    {
        return $this->carouselVideoIdArray;
    }

    /**
     * @param array $carouselVideoIdArray
     */
    public function setCarouselVideoIdArray($carouselVideoIdArray)
    {
        $this->carouselVideoIdArray = $carouselVideoIdArray;
    }

    /**
     * @return mixed
     */
    public function getProductSetId()
    {
        return $this->productSetId;
    }

    /**
     * @param mixed $productSetId
     */
    public function setProductSetId($productSetId)
    {
        $this->productSetId = $productSetId;
    }

    /**
     * @return mixed
     */
    public function getLinkDataDescription()
    {
        return $this->linkDataDescription;
    }

    /**
     * @param mixed $linkDataDescription
     */
    public function setLinkDataDescription($linkDataDescription)
    {
        $this->linkDataDescription = $linkDataDescription;
    }

    /**
     * @return mixed
     */
    public function getLinkDataCaption()
    {
        return $this->linkDataCaption;
    }

    /**
     * @param mixed $linkDataCaption
     */
    public function setLinkDataCaption($linkDataCaption)
    {
        $this->linkDataCaption = $linkDataCaption;
    }

    /**
     * @return mixed
     */
    public function getVideoId()
    {
        return $this->videoId;
    }

    /**
     * @param mixed $videoId
     */
    public function setVideoId($videoId)
    {
        $this->videoId = $videoId;
    }

    /**
     * @return mixed
     */
    public function getCarouselDescArray()
    {
        return $this->carouselDescArray;
    }

    /**
     * @param mixed $carouselDescArray
     */
    public function setCarouselDescArray($carouselDescArray)
    {
        $this->carouselDescArray = $carouselDescArray;
    }

    /**
     * @return mixed
     */
    public function getCarouselNameArray()
    {
        return $this->carouselNameArray;
    }

    /**
     * @param mixed $carouselNameArray
     */
    public function setCarouselNameArray($carouselNameArray)
    {
        $this->carouselNameArray = $carouselNameArray;
    }

    /**
     * @return mixed
     */
    public function getAdFormat()
    {
        return $this->adFormat;
    }

    /**
     * @param mixed $adFormat
     */
    public function setAdFormat($adFormat)
    {
        $this->adFormat = $adFormat;
    }

    /**
     * @return mixed
     */
    public function getCarouselImageHashArray()
    {
        return $this->carouselImageHashArray;
    }

    /**
     * @param mixed $carouselImageHashArray
     */
    public function setCarouselImageHashArray($carouselImageHashArray)
    {
        $this->carouselImageHashArray = $carouselImageHashArray;
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
    public function getCallToActionType()
    {
        return $this->callToActionType;
    }

    /**
     * @param mixed $callToActionType
     */
    public function setCallToActionType($callToActionType)
    {
        $this->callToActionType = $callToActionType;
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
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param mixed $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }

    /**
     * @return mixed
     */
    public function getLinkAdType()
    {
        return $this->linkAdType;
    }

    /**
     * @param mixed $linkAdType
     */
    public function setLinkAdType($linkAdType)
    {
        $this->linkAdType = $linkAdType;
    }

    /**
     * @return mixed
     */
    public function getObjectUrl()
    {
        return $this->ObjectUrl;
    }

    /**
     * @param mixed $ObjectUrl
     */
    public function setObjectUrl($ObjectUrl)
    {
        $this->ObjectUrl = $ObjectUrl;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return mixed
     */
    public function getImageHash()
    {
        return $this->imageHash;
    }

    /**
     * @param mixed $imageHash
     */
    public function setImageHash($imageHash)
    {
        $this->imageHash = $imageHash;
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
    public function getPageId()
    {
        return $this->pageId;
    }

    /**
     * @param mixed $pageId
     */
    public function setPageId($pageId)
    {
        $this->pageId = $pageId;
    }


}