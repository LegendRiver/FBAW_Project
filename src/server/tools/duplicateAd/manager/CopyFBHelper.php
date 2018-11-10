<?php

use FacebookAds\Object\Fields\AdSetFields;
use FacebookAds\Object\Fields\AdCreativeFields;
use FacebookAds\Object\Fields\AdCreativeObjectStorySpecFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataCallToActionFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataCallToActionValueFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataChildAttachmentFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataFields;
use FacebookAds\Object\Fields\AdCreativeVideoDataFields;
use FacebookAds\Object\Values\AdStatusValues;
use FacebookAds\Object\AdCreativeObjectStorySpec;
use FacebookAds\Object\AdCreativeLinkData;
use FacebookAds\Object\AdCreativeVideoData;

class CopyFBHelper
{
    private $templateAdset;

    private $campaignId;

    private $accountId;

    private $adsetId;

    private $adsetName;

    private $templateCreative;

    private $attachments;

    public function __construct($adsetId, $adId)
    {
        $adsetInfo= AdManagerFacade::getAllFieldAdsetById($adsetId);
        $this->adsetId = $adsetId;
        $this->campaignId = $adsetInfo[AdSetFields::CAMPAIGN_ID];
        $this->accountId = AdManageConstants::ADACCOUNT_ID_PREFIX . $adsetInfo[AdSetFields::ACCOUNT_ID];
        $this->adsetName = $adsetInfo[AdSetFields::NAME];
        $this->templateAdset = CommonHelper::filterMapByKeys($adsetInfo, self::$adsetFields);

        $creativeInfo = $this->getCreativeInfo($adId);
        $this->templateCreative = CommonHelper::filterMapByKeys($creativeInfo, self::$creativeFields);
        $this->attachments = $this->getAttachment();
    }

    public function getAccountId()
    {
        return $this->accountId;
    }

    public function getAdsetName()
    {
        return $this->adsetName;
    }

    public function duplicateAdsetByCopy($adsetName, $copyParams = array())
    {
        $copyResult = AdManagerFacade::copyAdset($this->adsetId, $copyParams);
        if(false === $copyResult)
        {
            return false;
        }

        if(!array_key_exists(AdManageConstants::COPY_ADSET_ID, $copyResult))
        {
            ServerLogger::instance()->writeLog(Warning, '#copyAdset#There is not field [copied_adset_id] in result.');
            return false;
        }

        $copiedAdsetId = $copyResult[AdManageConstants::COPY_ADSET_ID];
        $updateResult = AdManagerFacade::updateAdsetName($copiedAdsetId, $adsetName);
        if(false === $updateResult)
        {
            return false;
        }

        return $copiedAdsetId;
    }

    public function duplicateAdset($adsetName='', $toCampaignId='')
    {
        $adsetFields = $this->templateAdset;
        if(!empty($adsetName))
        {
            $adsetFields[AdSetFields::NAME] = $adsetName;
        }

        if(!empty($toCampaignId))
        {
            $adsetFields[AdSetFields::CAMPAIGN_ID] = $toCampaignId;
        }

        $result = AdManagerFacade::createAdsetByFields($this->accountId, $adsetFields);
        if(false === $result)
        {
            return false;
        }

        return $result->getId();
    }

    public static function getTemplateAdId($adId, $adsetId)
    {
        if(!empty($adId))
        {
            return $adId;
        }

        $adList = AdManagerFacade::getAdEntity($adsetId, AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET);
        if(false === $adList)
        {
            ServerLogger::instance()->writeLog(Error, '#duplicate#Failed to get ad by adset: ' . $adsetId);
            return false;
        }

        if(empty($adList))
        {
            ServerLogger::instance()->writeLog(Error, '#duplicate#There is no ad in adset: ' . $adsetId);
            return false;
        }

        $adEntity = $adList[0];
        return $adEntity->getId();

    }

    public function getAdType()
    {
        $storySpec = $this->templateCreative[AdCreativeFields::OBJECT_STORY_SPEC];
        if(array_key_exists(AdCreativeObjectStorySpecFields::LINK_DATA, $storySpec))
        {
            return AdManageConstants::STORY_LINK_DATA;
        }
        else if(array_key_exists(AdCreativeObjectStorySpecFields::VIDEO_DATA, $storySpec))
        {
            return AdManageConstants::STORY_VIDEO_DATA;
        }
        else
        {
            return -1;
        }
    }

    public function getCarouselType()
    {
        if(empty($this->attachments))
        {
            return -1;
        }
        else
        {
            $firstChild = $this->attachments[0];

            //顺序不能变，因为视频也有ImageHash
            if(array_key_exists(AdCreativeLinkDataChildAttachmentFields::VIDEO_ID, $firstChild))
            {
                return AdManageConstants::STORY_VIDEO_DATA;
            }
            else if(array_key_exists(AdCreativeLinkDataChildAttachmentFields::IMAGE_HASH, $firstChild))
            {
                return AdManageConstants::STORY_LINK_DATA;
            }
            else
            {
                return -1;
            }
        }
    }

    public function getAttachmentCount()
    {
        if(!is_array($this->attachments))
        {
            return 0;
        }
        return count($this->attachments);
    }

    private function getAttachment()
    {
        $storySpec = $this->templateCreative[AdCreativeFields::OBJECT_STORY_SPEC];
        if(array_key_exists(AdCreativeObjectStorySpecFields::LINK_DATA, $storySpec))
        {
            $linkData = $storySpec[AdCreativeObjectStorySpecFields::LINK_DATA];
            if(array_key_exists(AdCreativeLinkDataFields::CHILD_ATTACHMENTS, $linkData))
            {
                return $linkData[AdCreativeLinkDataFields::CHILD_ATTACHMENTS];
            }
            else
            {
                return array();
            }
        }
        else
        {
            return array();
        }
    }

    private function getCreativeInfo($adId)
    {
        $adEntity = AdManagerFacade::getAdById($adId);
        if(false === $adEntity)
        {
            ServerLogger::instance()->writeLog(Error, '#copy#Failed to read ad by id: ' .$adId);
            return array();
        }
        $creativeId = $adEntity->getCreativeId();

        $creativeInfo = AdManagerFacade::getAllFieldCreativeById($creativeId);
        if(false === $creativeInfo)
        {
            ServerLogger::instance()->writeLog(Error, '#copy#Failed to read creative by id: ' .$creativeId);
            return array();
        }

        return $creativeInfo;
    }

    public function duplicateCarouselToAdset($adsetId, $adName, $materialInfo, $textInfo = array())
    {
        $templateAttachCount = $this->getAttachmentCount();
        if(empty($templateAttachCount))
        {
            ServerLogger::instance()->writeLog(Error, 'The template ad is not carousel.');
            return false;
        }

        $materialCount = count($materialInfo);
        if($materialCount == 0)
        {
            ServerLogger::instance()->writeLog(Warning, 'The material is empty.');
            return false;
        }

        $creativeEnity = $this->createCarouselCreative($materialInfo, $textInfo, $adName);
        if(false === $creativeEnity)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to create creative for ad : ' . $adName);
            return false;
        }

        return $this->createAdByCreative($creativeEnity, $adName, $adsetId, $adName);
    }

    private function createCarouselCreative($materialInfo, $textInfo, $adName)
    {
        $creativeInfo = $this->templateCreative;
        if(!empty($adName))
        {
            $creativeInfo[AdCreativeFields::NAME] = $adName . '_creative_' . time();
        }

        $firstMaterialPath = key($materialInfo);
        $firstText = $this->getTextInfo($firstMaterialPath, $textInfo);
        if(!empty($firstText))
        {
            $message = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_MESSAGE, $firstText);
            if(!empty($message))
            {
                $creativeInfo[AdCreativeFields::BODY] = $message;
            }

            $headline = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_HEADLINE, $firstText);
            if(!empty($headline))
            {
                $creativeInfo[AdCreativeFields::TITLE] = $headline;
            }
        }

        $storySpec = $creativeInfo[AdCreativeFields::OBJECT_STORY_SPEC];
        if(array_key_exists(AdCreativeObjectStorySpecFields::LINK_DATA, $storySpec))
        {
            $linkData = $storySpec[AdCreativeObjectStorySpecFields::LINK_DATA];
            $replacedAttachment = $this->replaceAttachments($materialInfo, $textInfo);
            if(empty($replacedAttachment))
            {
                ServerLogger::instance()->writLog(Error, '#duplicate carousel#The replaced attachment is empty.');
                return false;
            }
            else
            {
                $linkData[AdCreativeLinkDataFields::CHILD_ATTACHMENTS] = $replacedAttachment;
            }

            if(!empty($message))
            {
                $linkData[AdCreativeLinkDataFields::MESSAGE] = $message;
            }

            $linkDataObject = new AdCreativeLinkData();
            $linkDataObject->setData($linkData);
            $storySpec[AdCreativeObjectStorySpecFields::LINK_DATA] = $linkDataObject;

            $storySpecObject = new AdCreativeObjectStorySpec();
            $storySpecObject->setData($storySpec);
            $creativeInfo[AdCreativeFields::OBJECT_STORY_SPEC] = $storySpecObject;
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, '#copy# There is not link data in creative.');
            return false;
        }

        return AdManagerFacade::createCreativeByField($this->accountId, $creativeInfo);
    }

    private function replaceAttachments($materialInfo, $textInfoMap)
    {
        $attachments = $this->attachments;
        $materialCount = min(count($attachments), count($materialInfo));
        ServerLogger::instance()->writeLog(Info, 'attachments count: ' . count($attachments) . '; material count: ' . count($materialInfo));

        $newAttachment = array();
        for($index=0; $index < $materialCount; ++$index)
        {
            $attachInfo = $attachments[$index];
            list($path, $materialId) = each($materialInfo);
            $textInfo = $this->getTextInfo($path, $textInfoMap);
            if(empty($textInfo))
            {
                $headline = '';
            }
            else
            {
                $headline = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_HEADLINE, $textInfo);
            }

            $adType = $this->getCarouselType();
            if($adType == AdManageConstants::STORY_LINK_DATA )
            {
                $attachInfo[AdCreativeLinkDataChildAttachmentFields::IMAGE_HASH] = $materialId;
            }
            else if($adType == AdManageConstants::STORY_VIDEO_DATA)
            {
                if(array_key_exists(AdCreativeLinkDataChildAttachmentFields::IMAGE_HASH, $attachInfo))
                {
                    unset($attachInfo[AdCreativeLinkDataChildAttachmentFields::IMAGE_HASH]);
                }
                $attachInfo[AdCreativeLinkDataChildAttachmentFields::VIDEO_ID] = $materialId;
            }

            if(!empty($headline))
            {
                $attachInfo[AdCreativeLinkDataChildAttachmentFields::NAME] = $headline;
            }

            if($adType == AdManageConstants::STORY_VIDEO_DATA)
            {
                $thumbnailUrl = $this->getThumbnails($materialId);
                $attachInfo[AdCreativeLinkDataChildAttachmentFields::PICTURE] = $thumbnailUrl;
            }

            $newAttachment[$index] = $attachInfo;
        }

        return $newAttachment;
    }

    private function getTextInfo($imagePath, $textInfoMap)
    {
        if(empty($textInfoMap))
        {
            return array();
        }
        $imageName = FileHelper::getFileNameFromPath($imagePath);
        if(array_key_exists($imageName, $textInfoMap))
        {
            return $textInfoMap[$imageName];
        }
        else
        {
            return array();
        }
    }

    public function duplicateAdToAdset($adsetId, $adName, $adType, $materialId, $textInfo = array())
    {
        //创建Creative
        if($adType == AdManageConstants::STORY_LINK_DATA)
        {
            $creativeEntity = $this->createImageCreative($materialId, $adName, $textInfo);
        }
        elseif($adType == AdManageConstants::STORY_VIDEO_DATA)
        {
            $imageUrl = $this->getThumbnails($materialId);
            $creativeEntity = $this->createVideoCreative($materialId, $imageUrl, $adName, $textInfo);
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, '#copy# the adtype is not adapted: ' . $adType);
            return false;
        }

        return $this->createAdByCreative($creativeEntity, $materialId, $adsetId, $adName);
    }

    private function createAdByCreative($creativeEntity, $logContent, $adsetId, $adName)
    {
        if(false === $creativeEntity)
        {
            ServerLogger::instance()->writeLog(Error, '#copy# Failed to create creative by materialId: ' . $logContent);
            return false;
        }
        else
        {
            ServerLogger::instance()->writeLog(Info, '#copy# Succeed to create creative: ' . $creativeEntity->getId() .
                ' by material: ' . $logContent);
        }

        $creativeId = $creativeEntity->getId();
        $adBuilder = new AdFieldBuilder();
        $adBuilder->setAdsetId($adsetId);
        $adBuilder->setCreativeId($creativeId);
        $adBuilder->setName($adName);
        $adBuilder->setStatus(AdStatusValues::ACTIVE);

        return AdManagerFacade::createAdByField($this->accountId, $adBuilder->getOutputField());
    }

    private function getThumbnails($videoId)
    {
        $videoEntity = AdManagerFacade::getVedioById($videoId);
        if(false === $videoEntity)
        {
            return '';
        }

        $thumbnails = $videoEntity->getThumbNails();
        if(empty($thumbnails))
        {
            return '';
        }

        $imageList = $thumbnails['data'];

        if(empty($imageList))
        {
            return '';
        }
        else
        {
            $nailArray = $imageList[0];
            return $nailArray['uri'];
        }
    }

    private function createImageCreative($imageHash, $adName='', $textInfo=array())
    {
        $creativeInfo = $this->templateCreative;
        if(!empty($adName))
        {
            $creativeInfo[AdCreativeFields::NAME] = $adName . '_creative_' . time();
        }

        $message = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_MESSAGE, $textInfo);
        $headline = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_HEADLINE, $textInfo);
        $deepLink = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_DEEP_LINK, $textInfo);

        $creativeInfo[AdCreativeFields::IMAGE_HASH] = $imageHash;
        if(!empty($message))
        {
            $creativeInfo[AdCreativeFields::BODY] = $message;
        }
        if(!empty($headline))
        {
            $creativeInfo[AdCreativeFields::TITLE] = $headline;
        }

        $storySpec = $creativeInfo[AdCreativeFields::OBJECT_STORY_SPEC];
        if(array_key_exists(AdCreativeObjectStorySpecFields::LINK_DATA, $storySpec))
        {
            $linkData = $storySpec[AdCreativeObjectStorySpecFields::LINK_DATA];
            $linkData[AdCreativeLinkDataFields::IMAGE_HASH] = $imageHash;
            if(!empty($message))
            {
                $linkData[AdCreativeLinkDataFields::MESSAGE] = $message;
            }
            if(!empty($headline))
            {
                $linkData[AdCreativeLinkDataFields::NAME] = $headline;
            }

            $callToAction = CommonHelper::getArrayValueByKey(AdCreativeLinkDataFields::CALL_TO_ACTION, $linkData);
            $callToAction = $this->setDeepLink($callToAction, $deepLink);
            $linkData[AdCreativeLinkDataFields::CALL_TO_ACTION] = $callToAction;

            $linkDataObject = new AdCreativeLinkData();
            $linkDataObject->setData($linkData);
            $storySpec[AdCreativeObjectStorySpecFields::LINK_DATA] = $linkDataObject;

            $storySpecObject = new AdCreativeObjectStorySpec();
            $storySpecObject->setData($storySpec);
            $creativeInfo[AdCreativeFields::OBJECT_STORY_SPEC] = $storySpecObject;
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, '#copy# There is not link data in creative.');
            return false;
        }

        $creativeEnity = AdManagerFacade::createCreativeByField($this->accountId, $creativeInfo);
        return $creativeEnity;
    }

    private function setDeepLink($callToAction, $deepLink)
    {
        if(empty($callToAction))
        {
            return array();
        }

        if(!array_key_exists(AdCreativeLinkDataCallToActionFields::VALUE, $callToAction))
        {
            return $callToAction;
        }

        $callValue = $callToAction[AdCreativeLinkDataCallToActionFields::VALUE];
        if(empty($deepLink))
        {
            if(array_key_exists(AdCreativeLinkDataCallToActionValueFields::APP_LINK, $callValue))
            {
                unset($callValue[AdCreativeLinkDataCallToActionValueFields::APP_LINK]);
            }
        }
        else
        {
            $callValue[AdCreativeLinkDataCallToActionValueFields::APP_LINK] = $deepLink;
        }

        $callToAction[AdCreativeLinkDataCallToActionFields::VALUE] = $callValue;
        return $callToAction;
    }

    private function createVideoCreative($videoId, $imageUrl='', $adName='', $textInfo=array())
    {
        $creativeInfo = $this->templateCreative;
        if(!empty($adName))
        {
            $creativeInfo[AdCreativeFields::NAME] = $adName . '_creative_' . time();
        }

        $message = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_MESSAGE, $textInfo);
        $headline = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_HEADLINE, $textInfo);
        $deepLink = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CSV_COL_DEEP_LINK, $textInfo);

        if(!empty($message))
        {
            $creativeInfo[AdCreativeFields::BODY] = $message;
        }
        if(!empty($headline))
        {
            $creativeInfo[AdCreativeFields::TITLE] = $headline;
        }

        $creativeInfo[AdCreativeFields::VIDEO_ID] = $videoId;
        $storySpec = $creativeInfo[AdCreativeFields::OBJECT_STORY_SPEC];
        if(array_key_exists(AdCreativeObjectStorySpecFields::VIDEO_DATA, $storySpec))
        {
            $videoData = $storySpec[AdCreativeObjectStorySpecFields::VIDEO_DATA];
            $videoData[AdCreativeVideoDataFields::VIDEO_ID] = $videoId;
            if(!empty($imageUrl))
            {
                $videoData[AdCreativeVideoDataFields::IMAGE_URL] = $imageUrl;
            }
            unset($videoData[AdCreativeVideoDataFields::IMAGE_HASH]);

            if(!empty($message))
            {
                $videoData[AdCreativeVideoDataFields::MESSAGE] = $message;
            }
            if(!empty($headline))
            {
                $videoData[AdCreativeVideoDataFields::TITLE] = $headline;
            }

            $callToAction = CommonHelper::getArrayValueByKey(AdCreativeVideoDataFields::CALL_TO_ACTION, $videoData);
            $callToAction = $this->setDeepLink($callToAction, $deepLink);
            $videoData[AdCreativeLinkDataFields::CALL_TO_ACTION] = $callToAction;

            $videoDataObject = new AdCreativeVideoData();
            $videoDataObject->setData($videoData);
            $storySpec[AdCreativeObjectStorySpecFields::VIDEO_DATA] = $videoDataObject;

            $storySpecObject = new AdCreativeObjectStorySpec();
            $storySpecObject->setData($storySpec);
            $creativeInfo[AdCreativeFields::OBJECT_STORY_SPEC] = $storySpecObject;
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, '#copy# There is not video data in creative.');
            return false;
        }

        $creativeEnity = AdManagerFacade::createCreativeByField($this->accountId, $creativeInfo);
        return $creativeEnity;
    }

    /**
     * @param string $accountId
     */
    public function setAccountId($accountId)
    {
        $this->accountId = $accountId;
    }

    private static $adsetFields = array(
//        AdSetFields::ACCOUNT_ID,
        AdSetFields::CAMPAIGN_ID,
        AdSetFields::ATTRIBUTION_SPEC,
        AdSetFields::BID_AMOUNT,
        AdSetFields::BID_INFO,
        AdSetFields::BILLING_EVENT,
        AdSetFields::STATUS,
        AdSetFields::DAILY_BUDGET,
        AdSetFields::END_TIME,
        AdSetFields::IS_AUTOBID,
        AdSetFields::IS_AVERAGE_PRICE_PACING,
        AdSetFields::LIFETIME_BUDGET,
        AdSetFields::NAME,
        AdSetFields::OPTIMIZATION_GOAL,
        AdSetFields::PACING_TYPE,
        AdSetFields::PROMOTED_OBJECT,
        AdSetFields::START_TIME,
        AdSetFields::TARGETING,
    );

    private static $creativeFields = array(
        AdCreativeFields::BODY,
        AdCreativeFields::IMAGE_HASH,
        AdCreativeFields::NAME,
        AdCreativeFields::OBJECT_STORY_SPEC,
        AdCreativeFields::OBJECT_TYPE,
        AdCreativeFields::TITLE,
        AdCreativeFields::VIDEO_ID,
        AdCreativeFields::CALL_TO_ACTION,
        AdCreativeFields::INSTAGRAM_ACTOR_ID,
        AdCreativeFields::INSTAGRAM_PERMALINK_URL,
    );
}