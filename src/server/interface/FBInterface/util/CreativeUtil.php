<?php
use FacebookAds\Object\Values\AdCreativeCallToActionTypeValues;

class CreativeUtil
{
    public static function transformVideoField(AdVideoParam $param)
    {
        $videoBuilder = new AdVideoFieldBuilder();
        $videoBuilder->setVideoType($param->getVideoType());
        $videoBuilder->setImageUrls($param->getImageUrls());
        $videoBuilder->setDurationMs($param->getDurationMs());
        $videoBuilder->setTransitionMs($param->getTransitionMs());
        $videoBuilder->setSource($param->getSource());

        return $videoBuilder->getOutputField();
    }

    public static function transformCreativeField(AdCreativeParam $param)
    {
        $callToAction = $param->getCallToActionType();
        $campaignType = $param->getCampaignType();
        $linkAdType = $param->getLinkAdType();
        $adFormat = $param->getAdFormat();

        if(self::isNullDataFormat($callToAction, $linkAdType))
        {
            return self::getNullLinkCreativeField($param);
        }
        else
        {
            $creativeBuilder = new CreativeFieldBuilder();
            $creativeBuilder->setName($param->getName());
            $creativeBuilder->setPageId($param->getPageId());

            $dataType = self::getDataType($adFormat, $campaignType);
            $creativeBuilder->setObjectDataType($dataType);

            if(AdManageConstants::CAMPAIGN_PARAM_TYPE_PRODUCT_SALES == $campaignType)
            {
                $productSetId = $param->getProductSetId();
                if(empty($productSetId))
                {
                    ServerLogger::instance()->writeLog(Error, 'The product set id is null for creative.');
                    return false;
                }

                $creativeBuilder->setPromoteProductSetId($productSetId);
            }

            $dataArray = self::getDataArray($param, $dataType);
            if(empty($dataArray))
            {
                return false;
            }
            $creativeBuilder->setObjectDataArray($dataArray);

            return $creativeBuilder->getOutputField();
        }
    }

    private static function getDataArray(AdCreativeParam $param, $dataType)
    {
        if($dataType === AdManageConstants::STORY_VIDEO_DATA)
        {
            $videoDataArray = self::getVideoDataFieldArray($param);
            return $videoDataArray;
        }
        else
        {
            $linkDataArray = self::getLinkDataFieldArray($param);
            return $linkDataArray;
        }
    }

    private static function getDataType($adFormat, $campaignType)
    {
        if(AdManageConstants::CAMPAIGN_PARAM_TYPE_PRODUCT_SALES == $campaignType)
        {
            return AdManageConstants::STORY_TEMPLATE_DATA;
        }

        if(AdManageConstants::AD_FORMAT_SLIDESHOW == $adFormat || AdManageConstants::AD_FORMAT_VIDEO == $adFormat)
        {
            return AdManageConstants::STORY_VIDEO_DATA;
        }

        return AdManageConstants::STORY_LINK_DATA;
    }

    private static function isNullDataFormat($callToActionType, $linkAdType)
    {
        if(false !== self::getCallToActionType($callToActionType))
        {
            return false;
        }

        if(empty($linkAdType) || $linkAdType == AdManageConstants::LINK_AD_TYPE_NULL)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private static function getNullLinkCreativeField(AdCreativeParam $param)
    {
        $creativeBuilder = new CreativeFieldBuilder();
        $creativeBuilder->setName($param->getName());
        $creativeBuilder->setBody($param->getMessage());
        $creativeBuilder->setTitle($param->getTitle());
        $creativeBuilder->setObjectUrl($param->getObjectUrl());
        $creativeBuilder->setImageHash($param->getImageHash());

        return $creativeBuilder->getOutputField();
    }


    private static function getLinkDataFieldArray(AdCreativeParam $param)
    {
        $linkDataBuilder = new CreativeLinkDataBuilder();
        $linkDataBuilder->setMessage($param->getMessage());
        $linkDataBuilder->setLinkUrl($param->getObjectUrl());

        $adFormat = $param->getAdFormat();
        if(AdManageConstants::AD_FORMAT_CAROUSEL == $adFormat)
        {
            $attachmentField = self::getLinkDataAttachmentField($param);
            $linkDataBuilder->setAttachmentsArray($attachmentField);
        }
        else
        {
            $callToActionArray = self::getCallToActionField($param);
            $campaignType = $param->getCampaignType();
            if(AdManageConstants::CAMPAIGN_PARAM_TYPE_PRODUCT_SALES === $campaignType)
            {
                $linkDataBuilder->setName($param->getTitle());
                $linkDataBuilder->setDescription($param->getLinkDataDescription());
                $linkDataBuilder->setCallToActionArray($callToActionArray);
            }
            else
            {
                $linkDataBuilder->setImageHash($param->getImageHash());
                if(empty($callToActionArray))
                {
                    $linkDataBuilder->setName($param->getTitle());
                    $linkDataBuilder->setDescription($param->getLinkDataDescription());
                    $linkDataBuilder->setCaption($param->getLinkDataCaption());
                }
                else
                {
                    $linkDataBuilder->setCallToActionArray($callToActionArray);
                }
            }
        }

        return $linkDataBuilder->getOutputField();
    }

    private static function getVideoDataFieldArray(AdCreativeParam $param)
    {
        $videoDataBuilder = new CreativeVideoDataBuilder();
        $videoDataBuilder->setDescription($param->getMessage());
        $videoDataBuilder->setVideoId($param->getVideoId());
        //创建视频必须的
        $imageHash = $param->getImageHash();
        if(empty($imageHash))
        {
            ServerLogger::instance()->writeLog(Error, 'The image hash of video data is null.');
            return array();
        }
        $videoDataBuilder->setImageHash($imageHash);

        $callToActionArray = self::getCallToActionField($param);
        if(empty($callToActionArray))
        {
            ServerLogger::instance()->writeLog(Error, 'The call to action of video data is null.');
            return array();
        }
        $videoDataBuilder->setCallToActionArray($callToActionArray);

        return $videoDataBuilder->getOutputField();
    }

    private static function getLinkDataAttachmentField(AdCreativeParam $param)
    {
        $attachmentArray = array();

        $pType = $param->getCallToActionType();
        $callType = self::getCallToActionType($pType);

        $link = $param->getObjectUrl();
        $nameArray = $param->getCarouselNameArray();
        $descArray = $param->getCarouselDescArray();
        $imageHashArray = $param->getCarouselImageHashArray();
        $videoIdArray = $param->getCarouselVideoIdArray();
        $attachmentSize = count($imageHashArray);

        for($i = 0; $i < $attachmentSize; ++$i)
        {
            $attachmentBuilder = new AttachmentFieldBuilder();
            $attachmentBuilder->setLink($link);
            $attachmentBuilder->setImageHash($imageHashArray[$i]);
            if(!empty($videoIdArray) && (count($videoIdArray)>$i))
            {
                $attachmentBuilder->setVideoId($videoIdArray[$i]);
            }
            $cardName = $nameArray[$i];

            if(false === $callType)
            {
                $attachmentBuilder->setName($cardName);
                $attachmentBuilder->setDescription($descArray[$i]);
            }
            else
            {
                $callToActionArray = self::getCallToActionArray($callType, $cardName, $link);
                $attachmentBuilder->setCallToActionArray($callToActionArray);
            }


            $attachmentArray[] = $attachmentBuilder->getOutputField();
        }

        return $attachmentArray;
    }

    private static function getCallToActionField(AdCreativeParam $param)
    {
        $pType = $param->getCallToActionType();
        $callToAction = self::getCallToActionType($pType);
        if(false === $callToAction)
        {
            return array();
        }

        return self::getCallToActionArray($callToAction, $param->getTitle(), $param->getObjectUrl());
    }

    private static function getCallToActionArray($type, $title, $url)
    {
        $builder = new CallToActionBuilder();
        $builder->setType($type);
        $builder->setLinkTitle($title);
        $builder->setLinkUrl($url);

        return $builder->getOutputField();
    }

    private static function getCallToActionType($pType)
    {
        if(AdManageConstants::CREATIVE_CALLTOACTION_MOBILEAPP_INSTALL === $pType)
        {
            return AdCreativeCallToActionTypeValues::INSTALL_MOBILE_APP;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_OPEN_LINK === $pType)
        {
            return AdCreativeCallToActionTypeValues::OPEN_LINK;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_DOWNLOAD === $pType)
        {
            return AdCreativeCallToActionTypeValues::DOWNLOAD;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_NOBUTTON === $pType)
        {
            return AdCreativeCallToActionTypeValues::NO_BUTTON;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_SHOPNOW === $pType)
        {
            return AdCreativeCallToActionTypeValues::SHOP_NOW;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_LEARNMORE === $pType)
        {
            return AdCreativeCallToActionTypeValues::LEARN_MORE;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_WATCHMORE === $pType)
        {
            return AdCreativeCallToActionTypeValues::WATCH_MORE;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_LIKEPAGE === $pType)
        {
            return AdCreativeCallToActionTypeValues::LIKE_PAGE;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_PLAYGAME === $pType)
        {
            return AdCreativeCallToActionTypeValues::PLAY_GAME;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_BUYNOW === $pType)
        {
            return AdCreativeCallToActionTypeValues::BUY_NOW;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_INSTALLAPP === $pType)
        {
            return AdCreativeCallToActionTypeValues::INSTALL_APP;
        }
        else if(AdManageConstants::CREATIVE_CALLTOACTION_USEAPP === $pType)
        {
            return AdCreativeCallToActionTypeValues::USE_APP;
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, 'The callToAction Type in param is not defined: ' . $pType);
            return false;
        }

    }
}