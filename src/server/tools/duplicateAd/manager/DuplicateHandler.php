<?php



class DuplicateHandler
{
    protected $adConfigList;
    protected $textConfigList;

    protected $defaultPath;

    protected $currentMaterial;
    protected $defaultTextFilePath;

    protected $isCopyByParam;

    public function __construct($configFile)
    {
        $configInfos = FileHelper::readJsonFile($configFile);
        $this->adConfigList = $configInfos[DuplicateAdConstants::CONF_LIST];
        $this->defaultPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'material';

        $this->defaultTextFilePath = $this->getDefaultTextFilePath();
        if(!file_exists($this->defaultTextFilePath))
        {
           $this->defaultTextFilePath = '';
        }
        $textConfigFile = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CONF_TEXT_PATH, $configInfos);
        $this->textConfigList = $this->getImageTextMap($textConfigFile);

        $this->currentMaterial = array();

        $this->isCopyByParam = false;
        if(array_key_exists(DuplicateAdConstants::CONF_COPY_TYPE, $configInfos))
        {
            $copyType = $configInfos[DuplicateAdConstants::CONF_COPY_TYPE];
            if($copyType == 'byParam')
            {
                $this->isCopyByParam = true;
            }
        }

    }

    protected function getDefaultTextFilePath()
    {
        return $this->defaultPath . DIRECTORY_SEPARATOR . 'text.xlsx';
    }

    public function duplicateAd()
    {
        foreach ($this->adConfigList as $configInfo)
        {
            $isShareMaterial = $configInfo[DuplicateAdConstants::CONF_SHARE];
            $adsetId = $configInfo[DuplicateAdConstants::CONF_ADSET_ID];
            ServerLogger::instance()->writeLog(Info, '#duplicate ad# Now adsetId: ' . $adsetId);
            $adId = $configInfo[DuplicateAdConstants::CONF_AD_ID];
            $adId = CopyFBHelper::getTemplateAdId($adId, $adsetId);
            if(empty($adId))
            {
                ServerLogger::instance()->writeLog(Error, 'Failed to get ad Id.');
                continue;
            }

            $copyHelper = new CopyFBHelper($adsetId, $adId);
            //check ad 是图片还是video
            $adType = $this->getAdType($copyHelper);
            if(-1 == $adType)
            {
                ServerLogger::instance()->writeLog(Error, 'The adtype is not right');
                continue;
            }
            $toCampaignId = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CONF_CAMPAIGN_ID, $configInfo);
            $toAccountId = CommonHelper::getArrayValueByKey(DuplicateAdConstants::CONF_ACCOUNT_ID, $configInfo);
            if(!empty($toAccountId))
            {
                $copyHelper->setAccountId($toAccountId);
            }
            $accountId = $copyHelper->getAccountId();

            $adsetName = $copyHelper->getAdsetName();

            $materialPath = $configInfo[DuplicateAdConstants::CONF_MATERIAL_PATH];
            if(empty(($materialPath)))
            {
                $materialPath = $this->defaultPath;
            }

            if($isShareMaterial)
            {
                $materialMap = $this->currentMaterial;
            }
            else
            {
                $materialMap = $this->uploadMaterial($materialPath, $adType, $accountId);
                $this->currentMaterial = $materialMap;
            }

            if(empty($materialMap))
            {
                continue;
            }

            //休息一会
            if(!$isShareMaterial)
            {
                if($adType == AdManageConstants::STORY_VIDEO_DATA)
                {
                    print_r('Sleep for 120s. Waiting for the videos to be ready. zzzzz'. PHP_EOL);
                    sleep(120);
                }
                else
                {
                    print_r('Sleep for 10s. Waiting for the images to be ready. zzzzz' . PHP_EOL);
                    sleep(10);
                }
            }


            $this->copyAdByMaterial($materialMap, $copyHelper, $adsetName, $adType, $toCampaignId);
        }
    }

    protected function getAdType($copyHelper)
    {
        return $copyHelper->getAdType();
    }

    private function getImageTextMap($textCongfigFile)
    {
        if(empty($textCongfigFile))
        {
            if(empty($this->defaultTextFilePath))
            {
                return array();
            }
            else
            {
                $textCongfigFile = $this->defaultTextFilePath;
            }
        }

        $textInfos = FileHelper::readExcelFile($textCongfigFile);
        array_shift($textInfos);

        return $this->constructTextMap($textInfos);
    }

    protected function constructTextMap($textInfos)
    {
        $imageMap = array();
        foreach ($textInfos as $info)
        {
            $imageName = $info[0];
            $row = array(
                DuplicateAdConstants::CSV_COL_IMAGE_NAME => $imageName,
                DuplicateAdConstants::CSV_COL_MESSAGE => $info[1],
                DuplicateAdConstants::CSV_COL_HEADLINE => $info[2],
            );

            if(count($info)>=4)
            {
                $row[DuplicateAdConstants::CSV_COL_DEEP_LINK] = $info[3];
            }

            $imageMap[$imageName] = $row;
        }

        return $imageMap;
    }


    protected function uploadMaterial($materialPath, $adType, $accountId)
    {
        return $this->uploadOperation($materialPath, $adType, $accountId);
    }

    protected function uploadOperation($materialPath, $adType, $accountId)
    {
        $uploadHelper = new UploadMaterialManager($materialPath);

        if(AdManageConstants::STORY_LINK_DATA == $adType)
        {
            $failedImage = $uploadHelper->uploadImages($accountId);
            if(!empty($failedImage))
            {
                ServerLogger::instance()->writeLog(Warning, 'The images failed to upload: ' . print_r($failedImage, true));
            }

            $imageMap = $uploadHelper->getImages();
            $materialMap = $this->getImageHash($imageMap);
        }
        elseif(AdManageConstants::STORY_VIDEO_DATA == $adType)
        {
            $failedVideo = $uploadHelper->uploadVideos($accountId);
            if(!empty($failedVideo))
            {
                ServerLogger::instance()->writeLog(Warning, 'The videos failed to upload: ' . print_r($failedVideo, true));
            }

            $videoMap = $uploadHelper->getVideos();
            $materialMap = $this->getVideoId($videoMap);
        }
        else
        {
            $materialMap = array();
        }
        ServerLogger::instance()->writeLog(Info, 'The upload material: ' . print_r($materialMap, true));
        return $materialMap;
    }

    private function getImageHash($entityMap)
    {
        $idMap = array();
        foreach ($entityMap as $filePath=>$entity)
        {
            $idMap[$filePath] = $entity->getImageHash();
        }

        return $idMap;
    }

    private function getVideoId($entityMap)
    {
        $idMap = array();
        foreach ($entityMap as $filePath=>$entity)
        {
            $idMap[$filePath] = $entity->getVideoId();
        }

        return $idMap;
    }

    protected function copyAdByMaterial($materialMap, CopyFBHelper $copyHelper, $adsetName, $adType, $toCampaignId=null)
    {
        foreach ($materialMap as $filePath=>$materialId)
        {
            $imageName = FileHelper::getFileNameFromPath($filePath);
            $newAdsetName = $this->formatAdsetName($adsetName, $imageName);

            if($this->isCopyByParam && !empty($toCampaignId))
            {
                $newAdsetId = $copyHelper->duplicateAdset($newAdsetName, $toCampaignId);
            }
            else
            {
                $copyParam = array();
                if(!empty($toCampaignId))
                {
                    $copyParam['campaign_id']= $toCampaignId;
                }
                $newAdsetId = $copyHelper->duplicateAdsetByCopy($newAdsetName, $copyParam);
            }

            if(false === $newAdsetId)
            {
                ServerLogger::instance()->writeLog(Warning, 'Failed to duplicate adset for image: ' . $filePath);
                continue;
            }

            $adName = date('Ymd_') . $imageName;

            $textInfo = CommonHelper::getArrayValueByKey($imageName, $this->textConfigList);
            $copyResult = $copyHelper->duplicateAdToAdset($newAdsetId, $adName, $adType, $materialId, $textInfo);
            if(false === $copyResult)
            {
                $failedInfo = '!!!Failed to copy ad by file: ' . $filePath . '; adsetName: ' . $newAdsetName;
                ServerLogger::instance()->writeLog(Warning, 'Failed to copy ad in adsetName: ' . $newAdsetName);
                print_r( $failedInfo . PHP_EOL);
            }
            else
            {
                print_r('Succeed to copy ad by file: ' . $filePath . PHP_EOL);
            }
        }
    }

    protected function formatAdsetName($oldName, $materialName)
    {
        $currentTime = date('Ymd_Hi');

        $pattern = '/(\d{6,8}_\d{3,4})/';
        $replaceDate = preg_replace($pattern, $currentTime, $oldName);
        if ($replaceDate == $oldName) {
            ServerLogger::instance()->writeLog(Warning, 'Can not find date or same date.');
        }

        $pos = strrpos($replaceDate, '_');
        if (false === $pos) {
            $pos = strlen($replaceDate);
        }

        $subName = substr($replaceDate, 0, $pos);
        $newName = $subName . '_' . $materialName;
        return $newName;
    }

}