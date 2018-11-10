<?php


class AdCreativeEntity
{
    //基本信息
    private $id;

    private $type;

    private $name;

    private $objectType;

    private $runStatus;

    private $message;

    private $title;

    private $objectUrl;

    private $imageHash;

    //storySpec 信息
    private $effectiveStoryId;
    private $pageId;

    private $callToActionType;
    private $applicationId;

    private $videoId;

    //carousel info
    private $carouselImageHashes;
    private $carouselVideoIds;
    private $carouselTitles;

    /**
     * @return mixed
     */
    public function getCarouselTitles()
    {
        return $this->carouselTitles;
    }

    /**
     * @param mixed $carouselTitles
     */
    public function setCarouselTitles($carouselTitles)
    {
        $this->carouselTitles = $carouselTitles;
    }

    /**
     * @return mixed
     */
    public function getCarouselVideoIds()
    {
        return $this->carouselVideoIds;
    }

    /**
     * @param mixed $carouselVideoIds
     */
    public function setCarouselVideoIds($carouselVideoIds)
    {
        $this->carouselVideoIds = $carouselVideoIds;
    }

    /**
     * @return mixed
     */
    public function getCarouselImageHashes()
    {
        return $this->carouselImageHashes;
    }

    /**
     * @param mixed $carouselImageHashes
     */
    public function setCarouselImageHashes($carouselImageHashes)
    {
        $this->carouselImageHashes = $carouselImageHashes;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
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
    public function getApplicationId()
    {
        return $this->applicationId;
    }

    /**
     * @param mixed $applicationId
     */
    public function setApplicationId($applicationId)
    {
        $this->applicationId = $applicationId;
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
    public function getEffectiveStoryId()
    {
        return $this->effectiveStoryId;
    }

    /**
     * @param mixed $effectiveStoryId
     */
    public function setEffectiveStoryId($effectiveStoryId)
    {
        $this->effectiveStoryId = $effectiveStoryId;
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
    public function getObjectUrl()
    {
        return $this->objectUrl;
    }

    /**
     * @param mixed $objectUrl
     */
    public function setObjectUrl($objectUrl)
    {
        $this->objectUrl = $objectUrl;
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
    public function getObjectType()
    {
        return $this->objectType;
    }

    /**
     * @param mixed $objectType
     */
    public function setObjectType($objectType)
    {
        $this->objectType = $objectType;
    }

    /**
     * @return mixed
     */
    public function getRunStatus()
    {
        return $this->runStatus;
    }

    /**
     * @param mixed $runStatus
     */
    public function setRunStatus($runStatus)
    {
        $this->runStatus = $runStatus;
    }


}
