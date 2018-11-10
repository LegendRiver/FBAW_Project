<?php

use FacebookAds\Object\Fields\AdCreativeVideoDataFields;

class CreativeVideoDataBuilder implements IFieldBuilder
{
    private $description;

    private $videoId;

    private $imageHash;

    private $imageUrl;

    private $callToActionArray;

    private $outputArray;

    public function __construct()
    {
        $this->callToActionArray = array();
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();
        if(isset($this->description))
        {
            $this->outputArray[AdCreativeVideoDataFields::LINK_DESCRIPTION] = $this->description;
        }
        if(isset($this->videoId))
        {
            $this->outputArray[AdCreativeVideoDataFields::VIDEO_ID] = $this->videoId;
        }
        if(isset($this->imageHash))
        {
            $this->outputArray[AdCreativeVideoDataFields::IMAGE_HASH] = $this->imageHash;
        }
        if(isset($this->imageUrl))
        {
            $this->outputArray[AdCreativeVideoDataFields::IMAGE_URL] = $this->imageUrl;
        }
        if(!empty($this->callToActionArray))
        {
            $this->outputArray[AdCreativeVideoDataFields::CALL_TO_ACTION] = $this->callToActionArray;
        }

        return $this->outputArray;
    }

    /**
     * @param mixed $imageHash
     */
    public function setImageHash($imageHash)
    {
        $this->imageHash = $imageHash;
    }

    /**
     * @param mixed $imageUrl
     */
    public function setImageUrl($imageUrl)
    {
        $this->imageUrl = $imageUrl;
    }

    /**
     * @param mixed $callToActionArray
     */
    public function setCallToActionArray($callToActionArray)
    {
        $this->callToActionArray = $callToActionArray;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @param mixed $videoId
     */
    public function setVideoId($videoId)
    {
        $this->videoId = $videoId;
    }

}