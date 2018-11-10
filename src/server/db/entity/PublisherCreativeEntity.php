<?php


class PublisherCreativeEntity
{
    private $uuid;

    private $creativeId;

    private $accountId;

    private $creativeName;

    private $adFormat;

    private $linkType;

    private $title;

    private $description;

    private $caption;

    private $message;

    private $pageId;

    private $imageHash;

    private $createTime;

    private $modifyTime;

    private $url;

    private $callToActionType;

    //carousel 与 slideshow 的图像ids;
    //carousel使用Hashes，slideshow使用urls
    private $imageUids;

    private $carouselNames;
    private $carouselDescs;

    private $slideShowDurationTime;
    private $slideShowTransitionTime;

    /**
     * @return mixed
     */
    public function getCreativeName()
    {
        return $this->creativeName;
    }

    /**
     * @param mixed $creativeName
     */
    public function setCreativeName($creativeName)
    {
        $this->creativeName = $creativeName;
    }

    /**
     * @return mixed
     */
    public function getCaption()
    {
        return $this->caption;
    }

    /**
     * @param mixed $caption
     */
    public function setCaption($caption)
    {
        $this->caption = $caption;
    }

    /**
     * @return mixed
     */
    public function getCarouselDescs()
    {
        return $this->carouselDescs;
    }

    /**
     * @param mixed $carouselDescs
     */
    public function setCarouselDescs($carouselDescs)
    {
        $this->carouselDescs = $carouselDescs;
    }

    /**
     * @return mixed
     */
    public function getImageUids()
    {
        return $this->imageUids;
    }

    /**
     * @param mixed $imageUids
     */
    public function setImageUids($imageUids)
    {
        $this->imageUids = $imageUids;
    }

    /**
     * @return mixed
     */
    public function getCarouselNames()
    {
        return $this->carouselNames;
    }

    /**
     * @param mixed $carouselNames
     */
    public function setCarouselNames($carouselNames)
    {
        $this->carouselNames = $carouselNames;
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
    public function getLinkType()
    {
        return $this->linkType;
    }

    /**
     * @param mixed $linkType
     */
    public function setLinkType($linkType)
    {
        $this->linkType = $linkType;
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

    /**
     * @return mixed
     */
    public function getSlideShowDurationTime()
    {
        return $this->slideShowDurationTime;
    }

    /**
     * @param mixed $slideShowDurationTime
     */
    public function setSlideShowDurationTime($slideShowDurationTime)
    {
        $this->slideShowDurationTime = $slideShowDurationTime;
    }

    /**
     * @return mixed
     */
    public function getSlideShowTransitionTime()
    {
        return $this->slideShowTransitionTime;
    }

    /**
     * @param mixed $slideShowTransitionTime
     */
    public function setSlideShowTransitionTime($slideShowTransitionTime)
    {
        $this->slideShowTransitionTime = $slideShowTransitionTime;
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
    public function getCreativeId()
    {
        return $this->creativeId;
    }

    /**
     * @param mixed $creativeId
     */
    public function setCreativeId($creativeId)
    {
        $this->creativeId = $creativeId;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
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
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param mixed $url
     */
    public function setUrl($url)
    {
        $this->url = $url;
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