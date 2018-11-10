<?php


class PublisherDBEntityBuilder
{
    public static function buildCampaignDBEntity($configId, CampaignCreateParam $createParam, CampaignEntity $entity)
    {
        $camDbEntity = new PublisherCampaignEntity();

        $uuid = CPublic::getGuid();
        $camDbEntity->setUid($uuid);
        $camDbEntity->setConfigId($configId);
        $camDbEntity->setCampaignId($entity->getCampaignId());
        $camDbEntity->setAccountId($entity->getAccountId());
        $camDbEntity->setName($entity->getName());

        //目前只为Facebook
        $camDbEntity->setPublisherType(AdManageConstants::PUBLISHER_TYPE_FACEBOOK);

        $camDbEntity->setSpendCap($entity->getSpendCap());
        $camDbEntity->setCampaignType($createParam->getCampaignType());
        $camDbEntity->setStatus($createParam->getStatus());

        $createTime = CommonHelper::dateFormatConvert('Y-m-d H:i:s', $entity->getCreatedTime());
        $updateTime = CommonHelper::dateFormatConvert('Y-m-d H:i:s', $entity->getUpdateTime());
        $camDbEntity->setCreateTime($createTime);
        $camDbEntity->setModifyTime($updateTime);

        return $camDbEntity;
    }

    public static function buildAdSetDBEntity($campaignUid, $targetingArray, AdsetCreateParam $adsetParam, AdsetEntity $adsetEntity)
    {
        $adsetDbEntity = new PublisherAdSetEntity();

        $uuid = CPublic::getGuid();
        $adsetDbEntity->setUid($uuid);

        $adsetDbEntity->setCampaignUid($campaignUid);

        $adsetDbEntity->setAdsetId($adsetEntity->getId());
        $adsetDbEntity->setName($adsetEntity->getName());
        $adsetDbEntity->setBudget($adsetParam->getBudgetAmount());

        //目前只为Facebook
        $adsetDbEntity->setPublisherType(AdManageConstants::PUBLISHER_TYPE_FACEBOOK);

        $scheduleStartTime = CommonHelper::dateFormatConvert('Y-m-d H:i:s', $adsetEntity->getStartTime());
        $scheduleEndTime = CommonHelper::dateFormatConvert('Y-m-d H:i:s', $adsetEntity->getEndTime());
        $adsetDbEntity->setScheduleStart($scheduleStartTime);
        $adsetDbEntity->setScheduleEnd($scheduleEndTime);

        $adsetDbEntity->setTimeStart($adsetParam->getStartMin());
        $adsetDbEntity->setTimeEnd($adsetParam->getEndMin());

        $jsonTargeting = json_encode($targetingArray);
        $adsetDbEntity->setAudience($jsonTargeting);

        $adsetDbEntity->setBid($adsetParam->getBidAmount());

        if($adsetParam->getBidAmount() > 0)
        {
            $bidType = AdManageConstants::BID_TYPE_AUTO;
        }
        else
        {
            $bidType = AdManageConstants::BID_TYPE_MANUAL;
        }
        $adsetDbEntity->setBidType($bidType);

        $adsetDbEntity->setChargeType($adsetParam->getBillEvent());
        $adsetDbEntity->setDeliveryType($adsetParam->getDeliveryType());
        $adsetDbEntity->setBudgetType($adsetParam->getBudgetType());
        $adsetDbEntity->setStatus($adsetParam->getStatus());
        $adsetDbEntity->setKeyWord('');
        $adsetDbEntity->setMatchType(0);

        $createTime = CommonHelper::dateFormatConvert('Y-m-d H:i:s', $adsetEntity->getCreatedTime());
        $updateTime = CommonHelper::dateFormatConvert('Y-m-d H:i:s', $adsetEntity->getUpdateTime());
        $adsetDbEntity->setCreateTime($createTime);
        $adsetDbEntity->setModifyTime($updateTime);

        return $adsetDbEntity;
    }

    public static function buildCreativeDBEntity(AdCreativeEntity $fbEntity, AdCreativeParam $param, $imageUuids)
    {
        $creativeDbEntity = new PublisherCreativeEntity();

        $uuid = CPublic::getGuid();
        $creativeDbEntity->setUuid($uuid);
        $creativeDbEntity->setCreativeId($fbEntity->getId());
        $creativeDbEntity->setAccountId($param->getAccountId());
        $creativeDbEntity->setCreativeName($fbEntity->getName());
        $creativeDbEntity->setAdFormat($param->getAdFormat());
        $creativeDbEntity->setLinkType($param->getLinkAdType());
        $creativeDbEntity->setTitle($param->getTitle());
        $creativeDbEntity->setDescription($param->getLinkDataDescription());
        $creativeDbEntity->setCaption($param->getLinkDataCaption());
        $creativeDbEntity->setMessage($param->getMessage());
        $creativeDbEntity->setPageId($param->getPageId());
        $creativeDbEntity->setImageHash($param->getImageHash());

        //creative 在fb没有时间，所以取当前时间
        $creativeDbEntity->setCreateTime(date('Y-m-d H:i:s'));
        $creativeDbEntity->setModifyTime(date('Y-m-d H:i:s'));

        $creativeDbEntity->setUrl($param->getObjectUrl());
        $creativeDbEntity->setCallToActionType($param->getCallToActionType());

        $strImageUids = json_encode($imageUuids);
        $creativeDbEntity->setImageUids($strImageUids);

        $carouseNames = $param->getCarouselNameArray();
        $strNames = json_encode($carouseNames);
        $creativeDbEntity->setCarouselNames($strNames);

        $carouseDescs = $param->getCarouselDescArray();
        $strDescs = json_encode($carouseDescs);
        $creativeDbEntity->setCarouselDescs($strDescs);

        //后续删除，增加videoId
        $creativeDbEntity->setSlideShowDurationTime(1000);
        $creativeDbEntity->setSlideShowTransitionTime(200);

        return $creativeDbEntity;
    }

    public static function buildAdDBEntity(AdEntity $fbEntity, AdCreateParam $param, $adsetUid, $creativeUid)
    {
        $adDBEntity = new PublisherAdEntity();

        $uuid = CPublic::getGuid();
        $adDBEntity->setUuid($uuid);

        $adDBEntity->setAdsetUid($adsetUid);
        $adDBEntity->setAdId($fbEntity->getId());
        $adDBEntity->setCreativeUid($creativeUid);
        $adDBEntity->setStatus($param->getStatus());
        $adDBEntity->setName($fbEntity->getName());

        //目前只为Facebook
        $adDBEntity->setPublisherType(AdManageConstants::PUBLISHER_TYPE_FACEBOOK);

        $createTime = CommonHelper::dateFormatConvert('Y-m-d H:i:s', $fbEntity->getCreateTime());
        $updateTime = CommonHelper::dateFormatConvert('Y-m-d H:i:s', $fbEntity->getUpdateTime());
        $adDBEntity->setCreateTime($createTime);
        $adDBEntity->setModifyTime($updateTime);

        return $adDBEntity;
    }

    public static function buildImageDBEntity(AdImageEntity $fbImageInfo)
    {
        $imageDBEntity = new PublisherImageEntity();

        $imageUuid = CPublic::getGuid();
        $imageDBEntity->setUuid($imageUuid);

        $imageDBEntity->setimageId($fbImageInfo->getId());
        $imageDBEntity->setAccountId($fbImageInfo->getAccountId());
        $imageDBEntity->setImageHash($fbImageInfo->getImageHash());
        $imageDBEntity->setImageUrl($fbImageInfo->getUrl());
        $imageDBEntity->setImageName($fbImageInfo->getFileName());
        $imageDBEntity->setHeight($fbImageInfo->getHeight());
        $imageDBEntity->setWidth($fbImageInfo->getWidth());
        $imageDBEntity->setLocalPath($fbImageInfo->getLocalPath());
        $imageDBEntity->setOriginalUrl($fbImageInfo->getOriginalUrl());

        return $imageDBEntity;
    }

    public static function buildVideoDBEntity(AdVideoEntity $fbVideoInfo, $videoType)
    {
        $videoDBEntity = new PublisherVideoEntity();

        $videoUuid = CPublic::getGuid();
        $videoDBEntity->setUuid($videoUuid);

        $videoDBEntity->setVideoType($videoType);
        $videoDBEntity->setVideoId($fbVideoInfo->getVideoId());
        $videoDBEntity->setDurationTime(AdManageConstants::SLIDESHOW_DURATION_TIME_DEFAULT);
        $videoDBEntity->setTransitionTime(AdManageConstants::SLIDESHOW_TRANSITION_TIME_DEFAULT);

        return $videoDBEntity;
    }
}