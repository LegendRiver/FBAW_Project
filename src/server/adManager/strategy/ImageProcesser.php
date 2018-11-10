<?php


class ImageProcesser
{
    private $accountId;

    private $originalUrls;

    private $downloadDir;

    private $downloadEntities;
    private $downloadImagePaths;

    private $fbImageEntities;

    public function __construct()
    {
        $this->clearBuffer();
    }

    private function clearBuffer()
    {
        $this->downloadEntities = array();
        $this->downloadImagePaths = array();

        $this->fbImageEntities = array();
    }

    public function resetProcess($dirName, $urls, $accountId)
    {
        if(empty($dirName))
        {
            $dirName = time();
        }
        //初始化参数
        $this->downloadDir = $this->getDownloadDir($dirName);
        if(false === $this->downloadDir)
        {
            return false;
        }
        $this->originalUrls = array_values(array_unique($urls));
        $this->accountId = $accountId;
        $this->clearBuffer();

        return true;
    }

    public function getDownloadImageInfo()
    {
        return $this->downloadEntities;
    }

    public function getUploadImageInfo()
    {
        return $this->fbImageEntities;
    }

    public function upLoadToFB()
    {
        $imagePaths = array_keys($this->downloadImagePaths);
        $failedPath = array();
        $tryTimes = StrategyConstants::UPLOAD_IMAGE_TRY_TIMES;

        while($tryTimes > 0)
        {
            foreach ($imagePaths as $localPath)
            {
                $imageEntity = AdManagerFacade::createImage($localPath, $this->accountId);
                if(false === $imageEntity)
                {
                    $failedPath[] = $localPath;
                    usleep(StrategyConstants::UPLOAD_IMAGE_CREATE_INTERVAL);
                    continue;
                }

                $originalUrl = $this->downloadImagePaths[$localPath];
                $imageEntity->setLocalPath($localPath);
                $imageEntity->setOriginalUrl($originalUrl);

                $this->fbImageEntities[$originalUrl] = $imageEntity;
                ServerLogger::instance()->writeLog(Info, 'Successed to create one image: ' . $originalUrl);
                usleep(StrategyConstants::UPLOAD_IMAGE_CREATE_INTERVAL);
            }

            if(count($failedPath) > 0)
            {
                $imagePaths = $failedPath;
                $failedPath = array();
                --$tryTimes;
            }
            else
            {
                break;
            }
            usleep(StrategyConstants::UPLOAD_IMAGE_TRY_TIMES);
        }

        if($tryTimes == 0 && count($imagePaths) > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public function downloadImages()
    {
        $tryCounts = StrategyConstants::DOWNLOAD_IMAGE_TRY_TIMES;
        $imageUrlList = $this->originalUrls;
        $failedUrlList = array();

        while($tryCounts > 0)
        {
            foreach ($imageUrlList as $url)
            {
                $downloadEntity = self::readImageInfo($url);
                if(false === $downloadEntity)
                {
                    ServerLogger::instance()->writeLog(Error, 'Failed to download image: ' . $url);
                    $failedUrlList[] = $url;
                    continue;
                }
                $this->downloadEntities[$url] = $downloadEntity;
                $this->downloadImagePaths[$downloadEntity->getLocalPath()] = $url;
            }

            ServerLogger::instance()->writeLog(Info, 'Download image completed.');

            if(count($failedUrlList) > 0)
            {
                $imageUrlList = $failedUrlList;
                $failedUrlList = array();
                --$tryCounts;
            }
            else
            {
                break;
            }

            usleep(StrategyConstants::DOWNLOAD_IMAGE_TRY_INTERVAL);
        }

        if($tryCounts == 0 && count($imageUrlList) > 0)
        {
            //删除下载目录
            FileHelper::removeDir($this->downloadDir);
            return false;
        }
        else
        {
            return true;
        }

    }

    private function readImageInfo($urlPath)
    {
        $isLocalPath = (false === strripos($urlPath, 'http'));
        if($isLocalPath)
        {
            $localPath = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_DOWNLOAD_IMAGE_DIR);
            $imagePath = $localPath . DIRECTORY_SEPARATOR . $urlPath;
            $downloadEntity = FileHelper::readLocalImage($imagePath);
            $downloadEntity->setUrl($urlPath);
        }
        else
        {
            $downloadEntity = FileHelper::downloadImage($urlPath,$this->downloadDir);
        }

        return $downloadEntity;
    }

    private function getDownloadDir($dirName)
    {
        //$localPath = EL_SERVER_PATH . 'serverTest/downloadImage';
        $localPath = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_DOWNLOAD_IMAGE_DIR);
        if(!FileHelper::createDir($localPath))
        {
            ServerLogger::instance()->writeLog(Error, 'The image download dir is wrong : ' . $localPath);
            return false;
        }

        $convertedDir = str_replace(";","_",$dirName);
        $imageDir = $localPath . DIRECTORY_SEPARATOR . $convertedDir;
        if(file_exists($imageDir))
        {
            $imageDir .= '_';
            $imageDir .= time();
        }

        if(false === mkdir($imageDir))
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to create dir: ' . $imageDir);
            return false;
        }

        return $imageDir;
    }

}