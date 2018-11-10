<?php

use FacebookAds\Object\Fields\AdCreativeFields;
use FacebookAds\Object\AdAccount;
use FacebookAds\Object\AdSet;
use FacebookAds\Object\AdCreative;
use FacebookAds\Object\Fields\AdCreativeObjectStorySpecFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataCallToActionFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataCallToActionValueFields;
use FacebookAds\Object\Fields\AdCreativeVideoDataFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataChildAttachmentFields;

class AdCreativeManager
{
    private static $instance = null;

    private $id2Creative;

    private $defaultField;

    private $params;

    private $allField;

    private function __construct()
    {
        $this->id2Creative = array();

        $this->defaultField = array(
            AdCreativeFields::ID,
            AdCreativeFields::NAME,
            AdCreativeFields::TITLE,
            AdCreativeFields::BODY,
            AdCreativeFields::IMAGE_HASH,
            AdCreativeFields::OBJECT_URL,
            AdCreativeFields::STATUS,
            AdCreativeFields::OBJECT_TYPE,
            AdCreativeFields::EFFECTIVE_OBJECT_STORY_ID,
            AdCreativeFields::OBJECT_STORY_SPEC,
            AdCreativeFields::VIDEO_ID,
            //此属性API查不出值
            //AdCreativeFields::CALL_TO_ACTION,

        );

        $this->params = array(
            AdManageConstants::QUERY_PARAM_LIMIT => AdManageConstants::QUERY_COMMON_AMOUNT_LIMIT,
        );

        $this->initAllFields();
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function createCreative($accountId, $fieldArray)
    {
        try
        {
            $creative = new AdCreative(null, $accountId);
            $creative->setData($fieldArray);
            $creative->create();

            $creative->read($this->defaultField);
            $creativeEntity = $this->newCreativeEntity($creative);
            $creativeId = $creative->{AdCreativeFields::ID};

            if (!array_key_exists($creativeId, $this->id2Creative))
            {
                $this->id2Creative[$creativeId] = $creativeEntity;
            }

            return $creativeEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

    }


    //测试用
    public function getAllCreativeByAccount($accountId)
    {
        try
        {
            $account = new AdAccount($accountId);
            $creativeCursor = $account->getAdCreatives($this->defaultField, $this->params);

            return $this->traverseCreativeCursor($creativeCursor);

        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getAllFieldCreative($creativeId)
    {
        try
        {
            $creative = new AdCreative($creativeId);
            $creative->read($this->allField);
            return $creative->getData();
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getCreativeById($creativeId)
    {
        try
        {
            $creative = new AdCreative($creativeId);
            $creative->read($this->defaultField);
            $creativeEntity = $this->newCreativeEntity($creative);
            $creativeId = $creative->{AdCreativeFields::ID};

            if (!array_key_exists($creativeId, $this->id2Creative))
            {
                $this->id2Creative[$creativeId] = $creativeEntity;
            }

            return $creativeEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getAllCreativeByAdset($adSetId)
    {
        try
        {
            $adset = new AdSet($adSetId);
            $creativeCusor = $adset->getAdCreatives($this->defaultField, $this->params);

            return $this->traverseCreativeCursor($creativeCusor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    private function traverseCreativeCursor($creativeCursor)
    {
        $resultArray = array();
        while ($creativeCursor->valid())
        {
            $currentCreative = $creativeCursor->current();
            $creativeId = $currentCreative->{AdCreativeFields::ID};

            $creativeEntity = $this->newCreativeEntity($currentCreative);

            if (!array_key_exists($creativeId, $this->id2Creative))
            {
                $this->id2Creative[$creativeId] = $creativeEntity;
            }

            $resultArray[] = $creativeEntity;

            $creativeCursor->next();
        }

        return $resultArray;
    }

    private function newCreativeEntity(AdCreative $creative)
    {
        $entity = new AdCreativeEntity();
        $entity->setId($creative->{AdCreativeFields::ID});
        $entity->setName($creative->{AdCreativeFields::NAME});
        $entity->setObjectType($creative->{AdCreativeFields::OBJECT_TYPE});
        $entity->setRunStatus($creative->{AdCreativeFields::STATUS});
        $entity->setVideoId($creative->{AdCreativeFields::VIDEO_ID});

        $storySpec = $creative->{AdCreativeFields::OBJECT_STORY_SPEC};
        if(is_null($storySpec))
        {
            ServerLogger::instance()->writeLog(Info, 'The storySpec of Creative is null');

            $entity->setTitle($creative->{AdCreativeFields::TITLE});
            $entity->setImageHash($creative->{AdCreativeFields::IMAGE_HASH});
            $entity->setMessage($creative->{AdCreativeFields::BODY});
            $entity->setObjectUrl($creative->{AdCreativeFields::OBJECT_URL});
        }
        else
        {
            $entity->setEffectiveStoryId($creative->{AdCreativeFields::EFFECTIVE_OBJECT_STORY_ID});
            $entity->setPageId($storySpec[AdCreativeObjectStorySpecFields::PAGE_ID]);

            if(array_key_exists(AdCreativeObjectStorySpecFields::LINK_DATA, $storySpec))
            {
                $linkData = $storySpec[AdCreativeObjectStorySpecFields::LINK_DATA];
                if(!is_null($linkData))
                {
                    $this->parseLinkDataInfo($linkData, $entity);
                }
            }


            if(array_key_exists(AdCreativeObjectStorySpecFields::VIDEO_DATA, $storySpec))
            {
                $videoData = $storySpec[AdCreativeObjectStorySpecFields::VIDEO_DATA];
                if(!is_null($videoData))
                {
                    $this->parseVideoDataInfo($videoData, $entity);
                }
            }
        }

        $creativeType = $this->getCreativeType($entity);
        $entity->setType($creativeType);

        return $entity;
    }

    private function getCreativeType(AdCreativeEntity $entity)
    {
        $type = '';

        if(!empty($entity->getCarouselImageHashes()))
        {
            return AdManageConstants::CREATIVE_TYPE_CAROUSEL_IMAGE;
        }

        if(!empty($entity->getCarouselVideoIds()))
        {
            return AdManageConstants::CREATIVE_TYPE_CAROUSEL_VIDEO;
        }

        if(!empty($entity->getVideoId()))
        {
            return AdManageConstants::CREATIVE_TYPE_SINGLE_VIDEO;
        }

        if(!empty($entity->getImageHash()))
        {
            return AdManageConstants::CREATIVE_TYPE_SINGLE_IMAGE;
        }

        return $type;
    }

    private function parseVideoDataInfo($videoData, AdCreativeEntity $entity)
    {
        $entity->setMessage(CommonHelper::getArrayValueByKey(AdCreativeVideoDataFields::MESSAGE, $videoData));
        $entity->setVideoId(CommonHelper::getArrayValueByKey(AdCreativeVideoDataFields::VIDEO_ID, $videoData));
        $entity->setTitle(CommonHelper::getArrayValueByKey(AdCreativeVideoDataFields::TITLE, $videoData));
        $callAction = CommonHelper::getArrayValueByKey(AdCreativeVideoDataFields::CALL_TO_ACTION, $videoData);
        if(!is_null($callAction))
        {
            $this->parseCallToAction($callAction, $entity);
        }
    }

    private function parseLinkDataInfo($linkData, AdCreativeEntity $entity)
    {
        $entity->setMessage(CommonHelper::getArrayValueByKey(AdCreativeLinkDataFields::MESSAGE, $linkData));
        $entity->setImageHash(CommonHelper::getArrayValueByKey(AdCreativeLinkDataFields::IMAGE_HASH, $linkData));
        $entity->setObjectUrl(CommonHelper::getArrayValueByKey(AdCreativeLinkDataFields::LINK, $linkData));
        $entity->setTitle(CommonHelper::getArrayValueByKey(AdCreativeLinkDataFields::CAPTION, $linkData));

        if(array_key_exists(AdCreativeLinkDataFields::CHILD_ATTACHMENTS, $linkData))
        {
            $childAttachment = $linkData[AdCreativeLinkDataFields::CHILD_ATTACHMENTS];
            $this->parseAttachmentInfo($childAttachment, $entity);
            return;
        }

        if(array_key_exists(AdCreativeLinkDataFields::CALL_TO_ACTION, $linkData))
        {
            $callAction = $linkData[AdCreativeLinkDataFields::CALL_TO_ACTION];
            $this->parseCallToAction($callAction, $entity);
            return;
        }
    }

    private function parseAttachmentInfo($childAttachment, AdCreativeEntity $entity)
    {
        if(is_null($childAttachment))
        {
            return;
        }

        $titleList = array();
        $imageHashList = array();
        $videoList = array();
        foreach($childAttachment as $attachment)
        {
            $title = CommonHelper::getArrayValueByKey(AdCreativeLinkDataChildAttachmentFields::NAME, $attachment);
            if(!empty($title))
            {
                $titleList[] = $title;
            }
            $imageHash = CommonHelper::getArrayValueByKey(AdCreativeLinkDataChildAttachmentFields::IMAGE_HASH, $attachment);
            if(!empty($imageHash))
            {
                $imageHashList[] = $imageHash;
            }
            $videoId = CommonHelper::getArrayValueByKey(AdCreativeLinkDataChildAttachmentFields::VIDEO_ID, $attachment);
            if(!empty($videoId))
            {
                $videoList[] = $videoId;
            }
        }

        $entity->setCarouselTitles($titleList);
        $entity->setCarouselImageHashes($imageHashList);
        $entity->setCarouselVideoIds($videoList);
    }

    private function parseCallToAction($callAction, AdCreativeEntity $entity)
    {
        if(is_null($callAction))
        {
            return;
        }

        $entity->setCallToActionType($callAction[AdCreativeLinkDataCallToActionFields::TYPE]);

        if(array_key_exists(AdCreativeLinkDataCallToActionFields::VALUE, $callAction))
        {
            $appValue = $callAction[AdCreativeLinkDataCallToActionFields::VALUE];
            $entity->setApplicationId(CommonHelper::getArrayValueByKey(AdCreativeLinkDataCallToActionValueFields::APPLICATION, $appValue));
            $entity->setObjectUrl($appValue[AdCreativeLinkDataCallToActionValueFields::LINK]);

            //v2.9不用此字段
            //$entity->setTitle($appValue[AdCreativeLinkDataCallToActionValueFields::LINK_TITLE]);
        }
    }

    private function initAllFields()
    {
        $creativeField = new AdCreativeFields();
        $excludeField = array(
            AdCreativeFields::IMAGE_FILE,
            AdCreativeFields::CALL_TO_ACTION,
            AdCreativeFields::INSTAGRAM_STORY_ID,  //v2.9 deprecated, using effective_instagram_story_id
        );
         $allFields = $creativeField->getValues();
        $this->allField = array_diff($allFields, $excludeField);
    }

}