<?php


class StrategyManager
{
    private $fileParser;

    private $paramTransformer;

    private $dbManager;

    private $preccessInfoMgr;

    private $strategyChecher;

    private $imageProcesser;

    private $videoProcesser;

    public function __construct()
    {
        $this->fileParser = new StrategyFileParser();
        $this->paramTransformer = new FBParamTransformer();
        $this->dbManager = new AdManagerDBFacade();
        $this->preccessInfoMgr = new STProcessInfoManager();
        $this->imageProcesser = new ImageProcesser();
        $this->videoProcesser = new VideoProcesser();

        $this->strategyChecher = new StrategyCheckManager($this->fileParser, $this->imageProcesser);
    }

    public function handleStrategy($filePath)
    {
        try
        {
            //清空缓存
            $this->preccessInfoMgr->clearProcessInfo();

            //解析接口json文件
            $parseResult = $this->fileParser->parseStrategyParam($filePath);
            if (false === $parseResult) {
                ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to parse strategy file : ' . $filePath);
                return ERR_PARSE_STRATEGY_FILE_FAILED;
            }

            //下载所有图片
            if(false === $this->resetProcesser())
            {
                ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to reset processer.');
                return ERR_RESET_IMAGE_PROCESSER;
            }
            if(false === $this->imageProcesser->downloadImages())
            {
                return ERR_IMAGE_DOWNLOAD;
            }

            //校验参数
            $checkResult = $this->strategyChecher->checkStrategyJson();
            if(OK != $checkResult)
            {
                return $checkResult;
            }

            //上传所有图片验证
            if(false === $this->imageProcesser->upLoadToFB())
            {
                ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to upload images to FB.');
                return ERR_CREATE_IMAGE_ERROR;
            }

            //先创建视频
            $this->videoProcesser->clearBuffer();
            if(false === $this->createSlideShowVideo())
            {
                ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to create Slideshow.');
                return ERR_CREATE_SLIDESHOW_ERROR;
            }
            if(false === $this->createCommonVideo())
            {
                ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to create common video.');
                return ERR_CREATE_VIDEO_ERROR;
            }

            $campaignResult = $this->handleCampaign();
            if(OK != $campaignResult)
            {
                return $campaignResult;
            }
            ServerLogger::instance()->writeStrategyLog(Info, 'Successed to create Campaign.');

            $adResult = $this->handleAllAds();
            if(OK != $adResult)
            {
                $campaignId = $this->preccessInfoMgr->getCampaignId();
                $this->rollbackCampaign($campaignId);
                return $adResult;
            }

            return OK;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return ERR_STRATEGY_EXCEPTION;
        }
    }

    private function rollbackCampaign($campaignId)
    {
        if(CommonHelper::isStringEmpty($campaignId))
        {
            return;
        }
        else
        {
            if(AdManagerFacade::deleteCampaign($campaignId))
            {
                ServerLogger::instance()->writeStrategyLog(Info, 'Successed to delete Campaign : ' . $campaignId);
            }
            else
            {
                ServerLogger::instance()->writeStrategyLog(Info, 'Failed to delete Campaign : ' . $campaignId);
            }
        }
    }

    private function createCommonVideo()
    {
        $accountId = $this->fileParser->getAccountId();
        $creativeId2Videopaths = $this->fileParser->getVideoPath();

        $result = $this->videoProcesser->createCommonVideos($creativeId2Videopaths, $accountId);
        ServerLogger::instance()->writeStrategyLog(Info, 'Completed to create common video.');

        return $result;
    }

    private function createSlideShowVideo()
    {
        $accountId = $this->fileParser->getAccountId();
        $creativeId2ImagePaths = $this->fileParser->getSlideShowMap();
        $fbImageEntityMap = $this->imageProcesser->getUploadImageInfo();
        $creativeId2ImageUrls = array();

        foreach($creativeId2ImagePaths as $pid=>$imagePaths)
        {
            $imageUrls = array();
            foreach($imagePaths as $oUrl)
            {
                if (!array_key_exists($oUrl, $fbImageEntityMap))
                {
                    ServerLogger::instance()->writeStrategyLog(Warning, '[slideshow]Cannot find fb image info by url : ' . $oUrl);
                    return ERR_CREATE_IMAGE_ERROR;
                }
                $entity = $fbImageEntityMap[$oUrl];
                $imageUrls[] = $entity->getUrl();
            }

            $creativeId2ImageUrls[$pid] = $imageUrls;
        }

        $result = $this->videoProcesser->createSlideShowVideos($creativeId2ImageUrls, $accountId);

        ServerLogger::instance()->writeStrategyLog(Info, 'Completed to create Slideshow video.');
        return $result;
    }

    private function resetProcesser()
    {
        $campaignInfo = $this->fileParser->getCampaignInfo();
        $campaignName = $campaignInfo[StrategyConstants::ST_CAMPAIGN_NAME];
        $accountId = $this->fileParser->getAccountId();
        $images = $this->fileParser->getAllImages();
        return $this->imageProcesser->resetProcess($campaignName, $images, $accountId);
    }

    private function handleAllAds()
    {
        $adMap = $this->fileParser->getAdMap();

        foreach($adMap as $adsetPid=>$adArray)
        {
            //先创建Adset
            $handleResult = $this->handleAdset($adsetPid);
            if(OK != $handleResult)
            {
                return $handleResult;
            }
            ServerLogger::instance()->writeStrategyLog(Info, 'Successed to create one Adset');

            foreach($adArray as $oneAdInfo)
            {
                $oneResult = $this->handleOneAd($oneAdInfo, $adsetPid);
                if(OK != $oneResult)
                {
                    return $oneResult;
                }
                usleep(50000);
            }
            ServerLogger::instance()->writeStrategyLog(Info, 'Successed to create ads in one adset.');
        }

        return OK;
    }

    private function handleOneAd($adInfo, $adsetPid)
    {
        $creativeId = $adInfo[StrategyConstants::ST_AD_CREATIVE_ID];
        if (CommonHelper::isStringEmpty($creativeId))
        {
            $creativePid = $adInfo[StrategyConstants::ST_AD_CREATIVE_PSEUDO_ID];
            $creativeId = $this->preccessInfoMgr->getCreativeIdByPid($creativePid);
            if(false === $creativeId)
            {
                //创建Creative
                $creativeCode = $this->handleCreative($creativePid);
                if(OK != $creativeCode)
                {
                    return $creativeCode;
                }
                ServerLogger::instance()->writeStrategyLog(Info, 'Successed to create creative : ' . $creativePid);

                $creativeId = $this->preccessInfoMgr->getCreativeIdByPid($creativePid);
            }
        }
        else
        {
            //数据库查询
            $creativeUuid = '';
            $this->preccessInfoMgr->addCreativeUuid($creativeId, $creativeUuid);
        }

        $handleCode = $this->handleAdInfo($adInfo, $creativeId, $adsetPid);
        if(OK != $handleCode)
        {
            return $handleCode;
        }
        ServerLogger::instance()->writeStrategyLog(Info, 'Successed to create ad : ' . $adInfo[StrategyConstants::ST_AD_NAME]);

        return OK;
    }

    private function handleAdInfo($adInfo, $creativeId, $adsetPid)
    {
        //修改部分参数
        $adInfo[StrategyConstants::ST_AD_CREATIVE_ID] = $creativeId;

        $adsetId = $this->preccessInfoMgr->getAdsetIdByPid($adsetPid);
        $adInfo[StrategyConstants::ST_AD_ADSET_ID] = $adsetId;

        $accountId = $this->preccessInfoMgr->getAccountId();
        $adParam = $this->paramTransformer->buildCreateAdParam($adInfo, $accountId);
        if(false === $adParam)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to transform ad Param.');
            return ERR_PARSE_STRATEGY_PARAM_ERROR;
        }

        //创建FBAD
        $adFBEntity = AdManagerFacade::createMediaAd($adParam);
        if(false === $adFBEntity)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to create FB ad node');
            return ERR_CREATE_AD_ERROR;
        }

        //存储
        $creativeUid = $this->preccessInfoMgr->getCreativeUuid($creativeId);
        $adsetUid = $this->preccessInfoMgr->getAdsetUuid($adsetId);
        $dbEntity = PublisherDBEntityBuilder::buildAdDBEntity($adFBEntity, $adParam, $creativeUid, $adsetUid);
        $dbResult = $this->dbManager->insertAdRecord($dbEntity);
        if(OK != $dbResult)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to store ad entity : ' . print_r($dbEntity, true));
            return $dbResult;
        }

        return OK;
    }

    private function handleImage($imageUrl, $pCreativeId)
    {
        $imageOriginalUrl = (array)$imageUrl;
        $fbImageEntityMap = $this->imageProcesser->getUploadImageInfo();

        //存储
        $imageUuids = array();
        $imageHashes = array();
        foreach($imageOriginalUrl as $oUrl)
        {
            if(!array_key_exists($oUrl, $fbImageEntityMap))
            {
                ServerLogger::instance()->writeStrategyLog(Warning, 'Cannot find fb image info by url : ' . $oUrl);
                return ERR_CREATE_IMAGE_ERROR;
            }
            $entity = $fbImageEntityMap[$oUrl];

            if(CommonHelper::notSetValue($entity))
            {
                ServerLogger::instance()->writeStrategyLog(Warning, 'The fb image is null.');
                continue;
            }

            $imageDBEntity = PublisherDBEntityBuilder::buildImageDBEntity($entity);
            $dbResult = $this->dbManager->insertImageRecord($imageDBEntity);
            if(OK != $dbResult)
            {
                ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to store image entity : ' . print_r($imageDBEntity, true));
                return $dbResult;
            }

            $imageUuids[] = $imageDBEntity->getUuid();
            $imageHashes[] = $entity->getImageHash();
        }

        $this->preccessInfoMgr->addImageUuids($pCreativeId, $imageUuids);
        $this->preccessInfoMgr->addImageHashes($pCreativeId, $imageHashes);

        return OK;
    }

    private function handleCreative($pCreativeId)
    {
        $creativeInfo = $this->fileParser->getCreativeByPid($pCreativeId);
        if(empty($creativeInfo))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'There is not creative with the pid : ' . $pCreativeId);
            return ERR_PARSE_STRATEGY_FILE_FAILED;
        }

        //处理图片
        $imageOriginalUrl = $creativeInfo[StrategyConstants::ST_CREATIVE_IMAGE_PATHS];
        $imageResult = $this->handleImage($imageOriginalUrl, $pCreativeId);
        if(OK != $imageResult)
        {
            return $imageResult;
        }

        //添加图片信息
        $accountId = $this->preccessInfoMgr->getAccountId();
        $creativeInfo[StrategyConstants::ST_CREATIVE_ACCOUNT_ID] = $accountId;
        $imageHashes = $this->preccessInfoMgr->getImageHashes($pCreativeId);
        $creativeInfo[StrategyConstants::APPEND_CREATIVE_IMAGE_FBHASHES] = $imageHashes;

        //处理视频
        $videoId = $this->handleVideo($creativeInfo);
        if(false === $videoId)
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'Failed to handle video.');
            return ERR_PARSE_STRATEGY_PARAM_ERROR;
        }
        $creativeInfo[StrategyConstants::APPEND_CREATIVE_VIDEO_ID] = $videoId;

        //转换创造参数
        $campaigType = $this->preccessInfoMgr->getCampaignType();
        $creativeParam = $this->paramTransformer->buildCreativeParam($creativeInfo,$campaigType,$accountId);
        if(false === $creativeParam)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to transform creative Param.');
            return ERR_PARSE_STRATEGY_PARAM_ERROR;
        }

        //创建FBcreative
        $fbCreative = $this->createCreative($creativeParam, $videoId);
        if(false === $fbCreative)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to create FB creative node');
            return ERR_CREATE_CREATIVE_ERROR;
        }

        //存储
        $imageUuids = $this->preccessInfoMgr->getImageUuids($pCreativeId);
        $dbEntity = PublisherDBEntityBuilder::buildCreativeDBEntity($fbCreative, $creativeParam, $imageUuids);
        $storeResult = $this->dbManager->insertCreativeRecord($dbEntity);
        if(OK != $storeResult)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to store adset entity : ' . print_r($dbEntity, true));
            return $storeResult;
        }

        $this->preccessInfoMgr->addCreativeUuid($fbCreative->getId(), $dbEntity->getUuid());
        $this->preccessInfoMgr->addCreativePid($pCreativeId, $fbCreative->getId());

        return OK;
    }

    private function createCreative($creativeParam, $videoId)
    {
        $tryTimes = StrategyConstants::SLIDESHOW_CREATIVE_TRY_TIMES;
        do
        {
            if(strlen($videoId) > 0)
            {
                //有视频先等5分钟
                ServerLogger::instance()->writeStrategyLog(Info, 'First Waiting slideshow ready.');
                sleep(StrategyConstants::SLIDESHOW_PUBLISHED_INTERVAL);
            }

            $fbCreative = AdManagerFacade::createCreative($creativeParam);
            if(false === $fbCreative)
            {
                if(strlen($videoId) == 0)
                {
                    return $fbCreative;
                }
            }
            else
            {
                return $fbCreative;
            }

            //有slideshow场景，需要等待视频生效
            ServerLogger::instance()->writeStrategyLog(Info, 'Waiting slideshow ready.');
            sleep(StrategyConstants::SLIDESHOW_PUBLISHED_INTERVAL);

            --$tryTimes;
        } while ($tryTimes > 0);

        return $fbCreative;
    }

    private function handleVideo($creativeInfo)
    {
        $adFormat = $creativeInfo[StrategyConstants::ST_CREATIVE_ADFORMAT];
        if(StrategyConstants::ST_V_ADFORMAT_SLIDESHOW === $adFormat || StrategyConstants::ST_V_ADFORMAT_VIDEO === $adFormat)
        {
            $fbVideos = $this->videoProcesser->getVideoEntityMap();
            $creativeId = $creativeInfo[StrategyConstants::ST_CREATIVE_PSEUDO_ID];
            if(!array_key_exists($creativeId, $fbVideos))
            {
                ServerLogger::instance()->writeStrategyLog(Error, 'Cannot find created video by creativeId : ' . $creativeId);
                return false;
            }
            $videoEntity = $fbVideos[$creativeId];

            if(StrategyConstants::ST_V_ADFORMAT_SLIDESHOW === $adFormat)
            {
                $videoType = AdManageConstants::VIDEO_TYPE_SLIDESHOW;
            }
            else if(StrategyConstants::ST_V_ADFORMAT_VIDEO === $adFormat)
            {
                $videoType = AdManageConstants::VIDEO_TYPE_COMMON;
            }

            $dbEntity = PublisherDBEntityBuilder::buildVideoDBEntity($videoEntity, $videoType);
            $dbCode = $this->dbManager->insertVideoRecord($dbEntity);
            if(OK != $dbCode)
            {
                return false;
            }

            return $videoEntity->getVideoId();
        }
        return '';
    }

    private function handleAdset($pAdsetId)
    {
        $adsetInfo = $this->fileParser->getAdsetByPid($pAdsetId);
        if(empty($adsetInfo))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'There is not adset with the pid which the ad have.');
            return ERR_PARSE_STRATEGY_FILE_FAILED;
        }

        $adsetFlag = $adsetInfo[StrategyConstants::ST_ADSET_OPERATION];
        if($adsetFlag == StrategyConstants::ST_V_OPERATION_NEW)
        {
            $createResult = $this->createAdset($pAdsetId, $adsetInfo);
            if(OK != $createResult)
            {
                return $createResult;
            }
        }
        else
        {

        }

        return OK;
    }

    private function createAdset($pAdsetId, $adsetInfo)
    {
        $targetingArray = $adsetInfo[StrategyConstants::ST_ADSET_TARGETING];

        $accountId = $this->preccessInfoMgr->getAccountId();
        $campaignType = $this->preccessInfoMgr->getCampaignType();
        $campaignId = $this->preccessInfoMgr->getCampaignId();
        if(false === $campaignId)
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'Can not find CampaignId when creating Adset');
            return ERR_NO_CAMPAIGNID_CREATE_NODE;
        }

        $adsetCreateParam = $this->paramTransformer->buildCreateAdsetParam($adsetInfo, $accountId, $campaignId, $campaignType);
        if(false === $adsetCreateParam)
        {
            return ERR_PARSE_STRATEGY_PARAM_ERROR;
        }

        //创建FB
        $adsetEntity = AdManagerFacade::createMediaAdSet($adsetCreateParam);
        if(false === $adsetEntity)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed adset create param: ' .
                print_r($adsetCreateParam, true));
            return ERR_CREATE_ADSET_ERROR;
        }
        $this->preccessInfoMgr->addAdsetPid($pAdsetId, $adsetEntity->getId());

        //存储
        $campaignUuid = $this->preccessInfoMgr->getCampaignUuid();
        if(false === $campaignUuid)
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'Can not find CampaignUId when storing Adset');
            return ERR_NO_CAMPAIGNUID_DB;
        }
        $adsetDbEntity = PublisherDBEntityBuilder::buildAdSetDBEntity($campaignUuid, $targetingArray, $adsetCreateParam, $adsetEntity);
        $dbResult = $this->dbManager->insertAdsetRecord($adsetDbEntity);
        if(OK != $dbResult)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to store adset entity : ' . print_r($adsetDbEntity, true));
            return $dbResult;
        }
        $this->preccessInfoMgr->addAdsetUuid($adsetEntity->getId(), $adsetDbEntity->getUid());

        return OK;
    }


    private function handleCampaign()
    {
        $campaignInfo = $this->fileParser->getCampaignInfo();

        $campaignFlag = $campaignInfo[StrategyConstants::ST_CAMPAIGN_OPERATION];
        if(StrategyConstants::ST_V_OPERATION_NEW == $campaignFlag)
        {
           $createCode = $this->createCampaignNode($campaignInfo);
            if(OK != $createCode)
            {
                return $createCode;
            }
        }
        else
        {

        }

        return OK;
    }


    private function createCampaignNode($campaignInfo)
    {
        $configId = $campaignInfo[StrategyConstants::ST_CAMPAIGN_CONFIGID];
        //创建Campaign
        $campaignCreateParam = $this->paramTransformer->buildCreateCampaignParam($campaignInfo);
        if(false === $campaignCreateParam)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed json info : ' . $campaignInfo);
            return ERR_PARSE_STRATEGY_PARAM_ERROR;
        }

        //在FB创建
        $campaignEntity = AdManagerFacade::createMediaCampaign($campaignCreateParam);
        if(false === $campaignEntity)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed campaign create param: ' .
                print_r($campaignCreateParam, true));
            return ERR_CREATE_CAMPAIGN_ERROR;
        }

        //入库
        $camDbEntity = PublisherDBEntityBuilder::buildCampaignDBEntity($configId, $campaignCreateParam, $campaignEntity);
        $dbResult = $this->dbManager->insertCampaignRecord($camDbEntity);
        if(OK != $dbResult)
        {
            ServerLogger::instance()->writeStrategyLog(Warning, 'Failed to store campaign entity : ' . print_r($camDbEntity, true));
            return $dbResult;
        }

        //存储变量
        $this->preccessInfoMgr->setAccountId($campaignEntity->getAccountId());
        $this->preccessInfoMgr->setCampaignType($campaignCreateParam->getCampaignType());
        $this->preccessInfoMgr->setCampaignUuidMap($campaignEntity->getCampaignId(), $camDbEntity->getUid());

        return OK;
    }

}