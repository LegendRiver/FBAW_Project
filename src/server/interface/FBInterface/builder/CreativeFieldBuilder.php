<?php

use FacebookAds\Object\Fields\AdCreativeObjectStorySpecFields;
use FacebookAds\Object\AdCreativeLinkData;
use FacebookAds\Object\AdCreativeVideoData;
use FacebookAds\Object\AdCreativeObjectStorySpec;
use FacebookAds\Object\Fields\AdCreativeFields;

/**
 * Link creative 分为三种
 *带callToAction(有linkData, calltoaction)
 *不带callToAction , 但关联page(只有linkData)
 *不带callToAction , 也不关联page(无)
 * Class CreativeFieldEntity
 */
class CreativeFieldBuilder implements IFieldBuilder
{
    private $name;

    private $title;

    private $body;

    private $objectUrl;

    private $imageHash;

    private $pageId;

    private $promoteProductSetId;

    /*STORY_LINK_DATA = 1;STORY_OFFER_DATA = 2;STORY_PHOTO_DATA = 3;
    STORY_TEMPLATE_DATA = 4;STORY_TEXT_DATA = 5;STORY_VIDEO_DATA = 6;*/
    private $objectDataType;

    private $objectDataArray;

    private $storySpecArray;

    private $outputArray;

    public function __construct()
    {
        $this->storySpecArray = array();
        $this->outputArray = array();
        $this->objectDataArray = array();
        $this->objectDataType = AdManageConstants::STORY_LINK_DATA;
    }

    public function getOutputField()
    {
        $this->outputArray = array();

        if(isset($this->name))
        {
            $this->outputArray[AdCreativeFields::NAME] = $this->name;
        }
        if(isset($this->title))
        {
            $this->outputArray[AdCreativeFields::TITLE] = $this->title;
        }
        if(isset($this->objectUrl))
        {
            $this->outputArray[AdCreativeFields::OBJECT_URL] = $this->objectUrl;
        }
        if(isset($this->body))
        {
            $this->outputArray[AdCreativeFields::BODY] = $this->body;
        }
        if(isset($this->imageHash))
        {
            $this->outputArray[AdCreativeFields::IMAGE_HASH] = $this->imageHash;
        }
        if(isset($this->promoteProductSetId))
        {
            $this->outputArray[AdCreativeFields::PRODUCT_SET_ID] = $this->promoteProductSetId;
        }

        $this->appendStorySpec();

        return $this->outputArray;
    }

    private function appendStorySpec()
    {
        if(isset($this->pageId))
        {
            $this->storySpecArray[AdCreativeObjectStorySpecFields::PAGE_ID] = $this->pageId;
        }
        if(!empty($this->objectDataArray))
        {
            $this->appendObjectData();
        }

        if(!empty($this->storySpecArray))
        {
            $storySpec = new AdCreativeObjectStorySpec();
            $storySpec->setData($this->storySpecArray);
            $this->outputArray[AdCreativeFields::OBJECT_STORY_SPEC] = $storySpec;
        }
    }

    private function appendObjectData()
    {
        if(AdManageConstants::STORY_LINK_DATA == $this->objectDataType)
        {
            $linkData = new AdCreativeLinkData();
            $linkData->setData($this->objectDataArray);
            $this->storySpecArray[AdCreativeObjectStorySpecFields::LINK_DATA] = $linkData;
        }
        else if(AdManageConstants::STORY_VIDEO_DATA == $this->objectDataType)
        {
            $videoDate = new AdCreativeVideoData();
            $videoDate->setData($this->objectDataArray);
            $this->storySpecArray[AdCreativeObjectStorySpecFields::VIDEO_DATA] = $videoDate;
        }
        else if(AdManageConstants::STORY_TEMPLATE_DATA == $this->objectDataType)
        {
            $templateData = new AdCreativeLinkData();
            $templateData->setData($this->objectDataArray);
            $this->storySpecArray[AdCreativeObjectStorySpecFields::TEMPLATE_DATA] = $templateData;
        }
        else
        {

        }
    }

    /**
     * @param mixed $promoteProductSetId
     */
    public function setPromoteProductSetId($promoteProductSetId)
    {
        $this->promoteProductSetId = $promoteProductSetId;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @param mixed $objectDataArray
     */
    public function setObjectDataArray($objectDataArray)
    {
        $this->objectDataArray = $objectDataArray;
    }

    /**
     * @param mixed $pageId
     */
    public function setPageId($pageId)
    {
        $this->pageId = $pageId;
    }

    /**
     * @param mixed $objectDataType
     */
    public function setObjectDataType($objectDataType)
    {
        $this->objectDataType = $objectDataType;
    }

    /**
     * @param mixed $body
     */
    public function setBody($body)
    {
        $this->body = $body;
    }

    /**
     * @param mixed $imageHash
     */
    public function setImageHash($imageHash)
    {
        $this->imageHash = $imageHash;
    }

    /**
     * @param mixed $objectUrl
     */
    public function setObjectUrl($objectUrl)
    {
        $this->objectUrl = $objectUrl;
    }

    /**
     * @param mixed $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }


}