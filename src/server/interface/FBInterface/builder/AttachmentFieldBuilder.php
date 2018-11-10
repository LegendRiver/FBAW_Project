<?php

use FacebookAds\Object\Fields\AdCreativeLinkDataChildAttachmentFields;

class AttachmentFieldBuilder implements IFieldBuilder
{
    private $link;

    private $imageHash;

    private $name;

    private $description;

    private $videoId;

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
        if(isset($this->name))
        {
            $this->outputArray[AdCreativeLinkDataChildAttachmentFields::NAME] = $this->name;
        }
        if(isset($this->link))
        {
            $this->outputArray[AdCreativeLinkDataChildAttachmentFields::LINK] = $this->link;
        }
        if(isset($this->imageHash))
        {
            $this->outputArray[AdCreativeLinkDataChildAttachmentFields::IMAGE_HASH] = $this->imageHash;
        }
        if(isset($this->description))
        {
            $this->outputArray[AdCreativeLinkDataChildAttachmentFields::DESCRIPTION] = $this->description;
        }
        if(isset($this->videoId))
        {
            $this->outputArray[AdCreativeLinkDataChildAttachmentFields::VIDEO_ID] = $this->videoId;
        }

        if(!empty($this->callToActionArray))
        {
            $this->outputArray[AdCreativeLinkDataChildAttachmentFields::CALL_TO_ACTION] = $this->callToActionArray;
        }

        return $this->outputArray;
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
    public function getCallToActionArray()
    {
        return $this->callToActionArray;
    }

    /**
     * @param mixed $callToActionArray
     */
    public function setCallToActionArray($callToActionArray)
    {
        $this->callToActionArray = $callToActionArray;
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
    public function getLink()
    {
        return $this->link;
    }

    /**
     * @param mixed $link
     */
    public function setLink($link)
    {
        $this->link = $link;
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

}