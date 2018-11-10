<?php


class CreativeParamHandler extends AbstractParamHandler
{

    protected function initParamInstanceFunction()
    {
        $this->paramInstance = new AdCreativeParam();

        $this->field2SetFunction = array(
            //$creativeParam->setAccountId($strategyParam);
            //$creativeParam->setCampaignType($strategyParam);
            StrategyConstants::ST_CREATIVE_LINK_AD_TYPE => 'setLinkAdType',
            StrategyConstants::ST_CREATIVE_ADFORMAT => 'setAdFormat',
            StrategyConstants::ST_CREATIVE_NAME => 'setName',
            StrategyConstants::ST_CREATIVE_TITLE => 'setTitle',
            StrategyConstants::ST_CREATIVE_MESSAGE => 'setMessage',
            StrategyConstants::ST_CREATIVE_LINK_URL => 'setObjectUrl',
            StrategyConstants::ST_CREATIVE_PAGE_ID => 'setPageId',
            StrategyConstants::APPEND_CREATIVE_IMAGE_HASH => 'setImageHash',
            //'setLinkDataDescription',
            //'setLinkDataCaption',
            StrategyConstants::APPEND_CREATIVE_CAROUSE_HASHES => 'setCarouselImageHashArray',
            StrategyConstants::ST_CREATIVE_CAROUSEL_NAMES => 'setCarouselNameArray',
            StrategyConstants::ST_CREATIVE_CAROUSEL_DESCS => 'setCarouselDescArray',
            StrategyConstants::ST_CREATIVE_CALLTOACTION => 'setCallToActionType',
            StrategyConstants::APPEND_CREATIVE_VIDEO_ID => 'setVideoId',
            StrategyConstants::ST_CREATIVE_PRODUCT_SET_ID => 'setProductSetId',
        );
    }

    protected function initValueMaps()
    {
        $this->field2Valuemaps = array();

        $linkdataTypeValue = array(
            StrategyConstants::ST_V_LINKDATA_TYPE_ALL => AdManageConstants::LINK_AD_TYPE_CALLTOACTION,
            StrategyConstants::ST_V_LINKDATA_TYPE_NORMAL => AdManageConstants::LINK_AD_TYPE_LINKDATA,
            StrategyConstants::ST_V_LINKDATA_TYPE_NONE => AdManageConstants::LINK_AD_TYPE_NULL,
        );
        $this->field2Valuemaps[StrategyConstants::ST_CREATIVE_LINK_AD_TYPE] = $linkdataTypeValue;

        $adformatValue = array(
            StrategyConstants::ST_V_ADFORMAT_IMAGE => AdManageConstants::AD_FORMAT_COMMON,
            StrategyConstants::ST_V_ADFORMAT_CAROUSEL => AdManageConstants::AD_FORMAT_CAROUSEL,
            StrategyConstants::ST_V_ADFORMAT_SLIDESHOW => AdManageConstants::AD_FORMAT_SLIDESHOW,
            StrategyConstants::ST_V_ADFORMAT_VIDEO => AdManageConstants::AD_FORMAT_VIDEO,
        );
        $this->field2Valuemaps[StrategyConstants::ST_CREATIVE_ADFORMAT] = $adformatValue;

        $calltoActionValue = array(
            StrategyConstants::ST_V_CALLTOACTION_INSTALLMOBILEAPP => AdManageConstants::CREATIVE_CALLTOACTION_MOBILEAPP_INSTALL,
            StrategyConstants::ST_V_CALLTOACTION_DOWNLOAD => AdManageConstants::CREATIVE_CALLTOACTION_DOWNLOAD,
            StrategyConstants::ST_V_CALLTOACTION_OPENLINK => AdManageConstants::CREATIVE_CALLTOACTION_OPEN_LINK,
            StrategyConstants::ST_V_CALLTOACTION_SHOPNOW => AdManageConstants::CREATIVE_CALLTOACTION_SHOPNOW,
            StrategyConstants::ST_V_CALLTOACTION_NOBUTTON => AdManageConstants::CREATIVE_CALLTOACTION_NOBUTTON,
            StrategyConstants::ST_V_CALLTOACTION_LIKEPAGE => AdManageConstants::CREATIVE_CALLTOACTION_LIKEPAGE,
            StrategyConstants::ST_V_CALLTOACTION_LEARNMORE => AdManageConstants::CREATIVE_CALLTOACTION_LEARNMORE,
            StrategyConstants::ST_V_CALLTOACTION_WATCHMORE => AdManageConstants::CREATIVE_CALLTOACTION_WATCHMORE,
            StrategyConstants::ST_V_CALLTOACTION_INSTALLAPP => AdManageConstants::CREATIVE_CALLTOACTION_INSTALLAPP,
            StrategyConstants::ST_V_CALLTOACTION_USEAPP => AdManageConstants::CREATIVE_CALLTOACTION_USEAPP,
            StrategyConstants::ST_V_CALLTOACTION_BUYNOW => AdManageConstants::CREATIVE_CALLTOACTION_BUYNOW,
            StrategyConstants::ST_V_CALLTOACTION_PLAYGAME => AdManageConstants::CREATIVE_CALLTOACTION_PLAYGAME,
        );
        $this->field2Valuemaps[StrategyConstants::ST_CREATIVE_CALLTOACTION] = $calltoActionValue;
    }

    protected function initOptionFields()
    {
        $this->optionFields = array(
            StrategyConstants::ST_CREATIVE_LINK_AD_TYPE,
            StrategyConstants::ST_CREATIVE_CALLTOACTION,
            StrategyConstants::APPEND_CREATIVE_CAROUSE_HASHES,
            StrategyConstants::APPEND_CREATIVE_VIDEO_ID,
            StrategyConstants::ST_CREATIVE_CAROUSEL_NAMES,
            StrategyConstants::ST_CREATIVE_CAROUSEL_DESCS,
            StrategyConstants::ST_CREATIVE_VIDEO_SOURCE_PATH,
            StrategyConstants::ST_CREATIVE_PRODUCT_SET_ID,
        );
    }

    protected function preHandleStrategyInfo($creativeInfo)
    {
        $imageHashes = $creativeInfo[StrategyConstants::APPEND_CREATIVE_IMAGE_FBHASHES];

        if(empty($imageHashes))
        {
            $pid = $creativeInfo[StrategyConstants::ST_AD_CREATIVE_PSEUDO_ID];
            ServerLogger::instance()->writeStrategyLog(Warning, 'The image Hashes is empty in creative : ' . $pid);
            return false;
        }
        $creativeInfo[StrategyConstants::APPEND_CREATIVE_IMAGE_HASH] = $imageHashes[0];

        $adFormat = $creativeInfo[StrategyConstants::ST_CREATIVE_ADFORMAT];
        if(StrategyConstants::ST_V_ADFORMAT_CAROUSEL == $adFormat)
        {
            $creativeInfo[StrategyConstants::APPEND_CREATIVE_CAROUSE_HASHES] = $imageHashes;

            $imageCount = count($imageHashes);
            if(!array_key_exists(StrategyConstants::ST_CREATIVE_CAROUSEL_NAMES, $creativeInfo))
            {
                $name = $creativeInfo[StrategyConstants::ST_CREATIVE_NAME];
                $creativeInfo[StrategyConstants::ST_CREATIVE_CAROUSEL_NAMES] = array_fill(0, $imageCount, $name);
            }
            if(!array_key_exists(StrategyConstants::ST_CREATIVE_CAROUSEL_DESCS, $creativeInfo))
            {
                $desc = $creativeInfo[StrategyConstants::ST_CREATIVE_DESC];
                $creativeInfo[StrategyConstants::ST_CREATIVE_CAROUSEL_DESCS] = array_fill(0, $imageCount, $desc);
            }
        }

        return $creativeInfo;
    }
}