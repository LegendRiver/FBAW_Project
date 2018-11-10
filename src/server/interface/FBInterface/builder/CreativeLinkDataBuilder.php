<?php

use FacebookAds\Object\Fields\AdCreativeLinkDataFields;
use FacebookAds\Object\AdCreativeLinkData;

class CreativeLinkDataBuilder implements IFieldBuilder
{
    private $message;

    private $linkUrl;

    private $imageHash;

    //无calltoAction的link creative 需要下面3个
    private $caption;
    private $description;
    private $name;

    private $callToActionArray;

    //casorsel Ad 才有, 带首张静态图片的product sale ad 也有（后续加）
    private $attachmentsArray;

    //product sale ad 的属性
    private $productImageIndex;
    private $isShareEndCard;

    private $outputArray;

    public function __construct()
    {
        $this->productImageIndex = 0;
        $this->isShareEndCard = false;
        $this->callToActionArray = array();
        $this->attachmentsArray = array();
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();

        if(isset($this->message))
        {
            $this->outputArray[AdCreativeLinkDataFields::MESSAGE] = $this->message;
        }

        if(isset($this->linkUrl))
        {
            $this->outputArray[AdCreativeLinkDataFields::LINK] = $this->linkUrl;
        }
        if(isset($this->imageHash))
        {
            $this->outputArray[AdCreativeLinkDataFields::IMAGE_HASH] = $this->imageHash;
        }
        if(isset($this->name))
        {
            $this->outputArray[AdCreativeLinkDataFields::NAME] = $this->name;
        }
        if(isset($this->caption))
        {
            $this->outputArray[AdCreativeLinkDataFields::CAPTION] = $this->caption;
        }
        if(isset($this->description))
        {
            $this->outputArray[AdCreativeLinkDataFields::DESCRIPTION] = $this->description;
        }
        if(!empty($this->productImageIndex))
        {
            $this->outputArray[AdCreativeLinkDataFields::ADDITIONAL_IMAGE_INDEX] = $this->productImageIndex;
        }
        if(is_bool($this->isShareEndCard))
        {
            $this->outputArray[AdCreativeLinkDataFields::MULTI_SHARE_END_CARD] = $this->isShareEndCard;
        }

        if(!empty($this->callToActionArray))
        {
            $this->outputArray[AdCreativeLinkDataFields::CALL_TO_ACTION] = $this->callToActionArray;
        }

        if(!empty($this->attachmentsArray))
        {
            $this->outputArray[AdCreativeLinkDataFields::CHILD_ATTACHMENTS] = $this->attachmentsArray;
        }

        return $this->outputArray;
    }

    /**
     * @param boolean $isShareEndCard
     */
    public function setIsShareEndCard($isShareEndCard)
    {
        if(is_bool($isShareEndCard))
        {
            $this->isShareEndCard = $isShareEndCard;
        }
    }

    /**
     * @param int $productImageIndex
     */
    public function setProductImageIndex($productImageIndex)
    {
        if(is_int($productImageIndex))
        {
            $this->productImageIndex = $productImageIndex;
        }
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
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
    public function getAttachmentsArray()
    {
        return $this->attachmentsArray;
    }

    /**
     * @param mixed $attachmentsArray
     */
    public function setAttachmentsArray($attachmentsArray)
    {
        $this->attachmentsArray = $attachmentsArray;
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
     * @param mixed $callToActionArray
     */
    public function setCallToActionArray($callToActionArray)
    {
        $this->callToActionArray = $callToActionArray;
    }

    /**
     * @param mixed $linkUrl
     */
    public function setLinkUrl($linkUrl)
    {
        $this->linkUrl = $linkUrl;
    }

    /**
     * @param mixed $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }

    /**
     * @param mixed $caption
     */
    public function setCaption($caption)
    {
        $this->caption = $caption;
    }

}