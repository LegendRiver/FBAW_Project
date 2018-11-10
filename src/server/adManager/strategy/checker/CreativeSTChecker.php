<?php


class CreativeSTChecker extends AbstractStrategyChecker
{
    private $imageProcesser;

    private $logPrefix;

    public function __construct(StrategyFileParser $parser, ImageProcesser $processer)
    {
        parent::__construct($parser);
        $this->imageProcesser = $processer;
        $this->logPrefix = '';
    }

    //creative 描述的长度限制
    protected function checkJsonContent()
    {
        $creativeMap = $this->fileParser->getCreativeMap();
        foreach($creativeMap as $pid=>$creativeInfo)
        {
            $commonCheckResult = $this->checkFieldValueValid($creativeInfo);
            if(false === $commonCheckResult)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'Failed to pass the creative common check.');
                return ERR_STRATEGY_CREATIVE_COMMON_CHECK;
            }

            $this->logPrefix = 'Creative Pid : ' . $pid . '; ';
            $titleResult = $this->checkTitleMessage($creativeInfo);
            if (OK != $titleResult)
            {
                return $titleResult;
            }

            $adFormat = $creativeInfo[StrategyConstants::ST_CREATIVE_ADFORMAT];
            if ($adFormat == StrategyConstants::ST_V_ADFORMAT_CAROUSEL)
            {
                $carouselResult = $this->checkCarousel($creativeInfo);
                if (OK != $carouselResult)
                {
                    return $carouselResult;
                }
            }
            else if($adFormat == StrategyConstants::ST_V_ADFORMAT_VIDEO || $adFormat == StrategyConstants::ST_V_ADFORMAT_SLIDESHOW)
            {
                $videoResult = $this->checkVideo($creativeInfo);
                if(OK != $videoResult)
                {
                    return $videoResult;
                }
            }

            if($this->campaignType == StrategyConstants::ST_V_CAMPAIGN_TYPE_PROUCTSALES)
            {
                $productSetId = $creativeInfo[StrategyConstants::ST_CREATIVE_PRODUCT_SET_ID];
                if(empty($productSetId))
                {
                    ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix .
                        'The product set id of creative is empty in product sales Campaign.');
                    return ERR_PRODUCT_SET_ID_NULL;
                }
            }
        }

        //最后统一校验图片
        $imageCheck = $this->checkImage($creativeMap);
        if(OK != $imageCheck)
        {
            return $imageCheck;
        }

        return OK;
    }

    private function checkVideo($creativeInfo)
    {
        $videoSourcePath = $creativeInfo[StrategyConstants::ST_CREATIVE_VIDEO_SOURCE_PATH];
        if(empty($videoSourcePath))
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The video source path is not existed');
            return ERR_VIDEO_PATH_NULL;
        }

        $callToAction = $creativeInfo[StrategyConstants::ST_CREATIVE_CALLTOACTION];
        if(empty($callToAction))
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The call to action of video is not existed');
            return ERR_VIDEO_CALL_ACTION_NULL;
        }

        return OK;
    }

    private function checkCarousel($creativeInfo)
    {
        $imagePaths = (array)$creativeInfo[StrategyConstants::ST_CREATIVE_IMAGE_PATHS];

        if(!array_key_exists(StrategyConstants::ST_CREATIVE_CAROUSEL_NAMES, $creativeInfo))
        {
            ServerLogger::instance()->writeStrategyLog(Info, $this->logPrefix . 'The carousel name is not existed');
            return OK;
        }
        $carouselNames = $creativeInfo[StrategyConstants::ST_CREATIVE_CAROUSEL_NAMES];

        $imagePathsCount = count($imagePaths);
        $namesCount = count($carouselNames);
        if($imagePathsCount !== $namesCount)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count of image(' . $imagePathsCount .
                ') is not equal to the count of names(' . $namesCount . ').');
            return ERR_CAROUSEL_IMAGE_COUNT_NO_EQUAL;
        }

        if(!array_key_exists(StrategyConstants::ST_CREATIVE_CAROUSEL_DESCS, $creativeInfo))
        {
            ServerLogger::instance()->writeStrategyLog(Info, $this->logPrefix . 'The carousel desc is not existed');
            return OK;
        }
        $carouseDescs = $creativeInfo[StrategyConstants::ST_CREATIVE_CAROUSEL_DESCS];

        $descCount = count($carouseDescs);
        if($descCount>0 && $descCount !== $imagePathsCount)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count of image(' . $imagePathsCount .
                ') is not equal to the count of descs(' . $descCount . ').');
            return ERR_CAROUSEL_IMAGE_COUNT_NO_EQUAL;
        }

        return OK;
    }

    private function checkTitleMessage($creativeInfo)
    {
        $titleLength = strlen($creativeInfo[StrategyConstants::ST_CREATIVE_TITLE]);
        if($titleLength < AdManageConstants::TITLE_LENGTH_MIN_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The length of title is less than ' .
                AdManageConstants::TITLE_LENGTH_MIN_LIMIT);
            return ERR_TITLE_LENGTH_LESS;
        }

        if($titleLength > AdManageConstants::TITLE_LENGTH_MAX_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The length of title is greater than ' .
                AdManageConstants::TITLE_LENGTH_MAX_LIMIT);
            return ERR_TITLE_LENGTH_GREAT;
        }

        $messageLength = strlen($creativeInfo[StrategyConstants::ST_CREATIVE_MESSAGE]);
        if($messageLength < AdManageConstants::MESSAGE_LENGTH_MIN_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The length of message is less than ' .
                AdManageConstants::MESSAGE_LENGTH_MIN_LIMIT);
            return ERR_MESSAGE_LENGTH_LESS;
        }

        if($messageLength > AdManageConstants::MESSAGE_LENGTH_MAX_LIMIT)
        {
            ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The length of message is greater than ' .
                AdManageConstants::MESSAGE_LENGTH_MAX_LIMIT);
            return ERR_MESSAGE_LENGTH_GREAT;
        }

    }

    private function checkImage($creativeMap)
    {
        foreach($creativeMap as $pid=>$creativeInfo)
        {
            $imageUrls = (array)$creativeInfo[StrategyConstants::ST_CREATIVE_IMAGE_PATHS];
            $adFormat = $creativeInfo[StrategyConstants::ST_CREATIVE_ADFORMAT];
            $imageCount = count($imageUrls);
            $countResult = $this->checkImageCount($adFormat, $imageCount);
            if(OK != $countResult)
            {
                return $countResult;
            }

            $sizeResult = $this->checkImageSizeAndDimension($imageUrls, $adFormat);
            if(OK != $sizeResult)
            {
                return $sizeResult;
            }

        }
        return OK;
    }

    private function checkImageSizeAndDimension($imageUrls, $adFormat)
    {
        $downloadImages = $this->imageProcesser->getDownloadImageInfo();
        foreach($imageUrls as $url)
        {
            if(!array_key_exists($url, $downloadImages))
            {
                ServerLogger::instance()->writeStrategyLog(Error, 'Failed to find download entity by url : ' . $url);
                return ERR_IMAGE_DOWNLOAD;
            }
            $imageEntity = $downloadImages[$url];

            $width = $imageEntity->getWidth();
            if($width < AdManageConstants::IMAGE_WIDTH_MIN_LIMIT)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The image width('. $width
                    . ') is less than '. AdManageConstants::IMAGE_WIDTH_MIN_LIMIT);
                return ERR_IMAGE_WIDTH_LESS;
            }

            $height = $imageEntity->getHeight();
            $minLimitHeight = $this->getImageHeightLimit($adFormat);
            if($height < $minLimitHeight)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The image height('. $height
                    . ') is less than '. $minLimitHeight);
                return ERR_IMAGE_HEIGHT_LESS;
            }

            $size = $imageEntity->getSize();
            if($size > AdManageConstants::IMAGE_SIZE_MAX_LIMIT)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The image size('. $size
                    . ') is greater than ' . AdManageConstants::IMAGE_SIZE_MAX_LIMIT);
                return ERR_IMAGE_SIZE_GREAT;
            }
        }

        return OK;
    }

    private function getImageHeightLimit($adFormat)
    {
        if(StrategyConstants::ST_V_ADFORMAT_CAROUSEL == $adFormat)
        {
            return AdManageConstants::IMAGE_CAROUSEL_HEIGHT_MIN_LIMIT;
        }
        else
        {
            return AdManageConstants::IMAGE_HEIGHT_MIN_LIMIT;
        }
    }

    private function checkImageCount($adFormat, $count)
    {
        if(StrategyConstants::ST_V_ADFORMAT_IMAGE === $adFormat || StrategyConstants::ST_V_ADFORMAT_VIDEO === $adFormat)
        {
            if($count < AdManageConstants::IMAGE_COUNT_IMAGE_LIMIT)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count(' . $count . ') of image is less than ' .
                    AdManageConstants::IMAGE_COUNT_IMAGE_LIMIT);
                return ERR_IMAGE_COUNT_LESS;
            }
        }
        else if(StrategyConstants::ST_V_ADFORMAT_CAROUSEL === $adFormat)
        {
            $minLimit = $this->getCarouselImageMinLimit();
            if($count < $minLimit)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count(' . $count . ') of image is less than ' . $minLimit);
                return ERR_IMAGE_COUNT_LESS;
            }

            if($count > AdManageConstants::IMAGE_COUNT_CAROUSEL_MAX_LIMIT)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count(' . $count . ') of image is greater than ' .
                    AdManageConstants::IMAGE_COUNT_CAROUSEL_MAX_LIMIT);
                return ERR_IMAGE_COUNT_GREAT;
            }
        }
        else if(StrategyConstants::ST_V_ADFORMAT_SLIDESHOW === $adFormat)
        {
            if($count < AdManageConstants::IMAGE_COUNT_SLIDESHOW_MIN_LIMIT)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count(' . $count . ') of image is less than ' .
                    AdManageConstants::IMAGE_COUNT_SLIDESHOW_MIN_LIMIT);
                return ERR_IMAGE_COUNT_LESS;
            }

            if($count > AdManageConstants::IMAGE_COUNT_SLIDESHOW_MAX_LIMIT)
            {
                ServerLogger::instance()->writeStrategyLog(Error, $this->logPrefix . 'The count(' . $count . ') of image is greater than ' .
                    AdManageConstants::IMAGE_COUNT_SLIDESHOW_MAX_LIMIT);
                return ERR_IMAGE_COUNT_GREAT;
            }
        }

        return OK;
    }

    private function getCarouselImageMinLimit()
    {
        if($this->campaignType == StrategyConstants::ST_V_CAMPAIGN_TYPE_APPINSTALL)
        {
            return AdManageConstants::IMAGE_COUNT_CAROUSEL_INSTALL_LIMIT;
        }
        else
        {
            return AdManageConstants::IMAGE_COUNT_CAROUSEL_CLICK_LIMIT;
        }
    }

    protected function initFieldInfo()
    {
        $this->notNullFields = array(
            StrategyConstants::ST_CREATIVE_NAME,
            StrategyConstants::ST_CREATIVE_TITLE,
            StrategyConstants::ST_CREATIVE_MESSAGE,
            StrategyConstants::ST_CREATIVE_IMAGE_PATHS,
            StrategyConstants::ST_CREATIVE_LINK_URL,
            StrategyConstants::ST_CREATIVE_PAGE_ID,
            StrategyConstants::ST_CREATIVE_ADFORMAT,
        );

        $this->field2Values = array(
            StrategyConstants::ST_CREATIVE_LINK_AD_TYPE => array(
                StrategyConstants::ST_V_LINKDATA_TYPE_ALL,
                StrategyConstants::ST_V_LINKDATA_TYPE_NORMAL,
                StrategyConstants::ST_V_LINKDATA_TYPE_NONE,),

            StrategyConstants::ST_CREATIVE_ADFORMAT => array(
                StrategyConstants::ST_V_ADFORMAT_IMAGE,
                StrategyConstants::ST_V_ADFORMAT_CAROUSEL,
                StrategyConstants::ST_V_ADFORMAT_SLIDESHOW,
                StrategyConstants::ST_V_ADFORMAT_VIDEO,),

            StrategyConstants::ST_CREATIVE_CALLTOACTION => array(
                StrategyConstants::ST_V_CALLTOACTION_INSTALLMOBILEAPP,
                StrategyConstants::ST_V_CALLTOACTION_DOWNLOAD,
                StrategyConstants::ST_V_CALLTOACTION_OPENLINK,
                StrategyConstants::ST_V_CALLTOACTION_SHOPNOW,
                StrategyConstants::ST_V_CALLTOACTION_LIKEPAGE,
                StrategyConstants::ST_V_CALLTOACTION_INSTALLAPP,
                StrategyConstants::ST_V_CALLTOACTION_USEAPP,
                StrategyConstants::ST_V_CALLTOACTION_LEARNMORE,
                StrategyConstants::ST_V_CALLTOACTION_WATCHMORE,
                StrategyConstants::ST_V_CALLTOACTION_BUYNOW,
                StrategyConstants::ST_V_CALLTOACTION_PLAYGAME,
                StrategyConstants::ST_V_CALLTOACTION_NOBUTTON,),
        );
    }
}