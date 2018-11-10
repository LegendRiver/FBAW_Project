<?php


class UploadMaterialManager
{
    private $images;
    private $videos;

    private $materialPath;

    public function __construct($rootPath)
    {
        $this->materialPath = $rootPath;
        $this->reset();
    }

    private function reset()
    {
        $this->images = array();
        $this->videos = array();
    }

    public function getImages()
    {
        return $this->images;
    }

    public function getVideos()
    {
        return $this->videos;
    }

    public function uploadMaterial($accountId, $rootPath='')
    {
        $failedImage = $this->uploadImages($accountId, $rootPath);
        $failedVideo = $this->uploadVideos($accountId, $rootPath);
        return array_merge($failedImage, $failedVideo);
    }

    public function uploadVideos($accountId, $videoRootPath='', $extend = array('.mp4', '.gif'))
    {
        $this->videos = array();
        if(empty($videoRootPath))
        {
            $videoRootPath = $this->materialPath;
        }

        $videoFileList = FileHelper::getRecursiveFileList($videoRootPath, $extend);
        $tryTimes = 1;

        $failedList = array();
        while($tryTimes > 0)
        {
            $failedList = array();
            $totalCount = count($videoFileList);
            print_r('######## There is ' . $totalCount . ' videos. ######' . PHP_EOL);
            foreach($videoFileList as $videoFile)
            {
                print_r('Uploading video : ' . $videoFile . PHP_EOL);
                print_r('Leaving : ' . --$totalCount . ' videos .....' . PHP_EOL);

                $videoParam = new AdVideoParam();
                $videoParam->setVideoType(AdManageConstants::VIDEO_TYPE_COMMON);
                $videoParam->setSource($videoFile);
                $videoParam->setAccountId($accountId);
                $videoEntity = AdManagerFacade::createAdVideo($videoParam);

                if(false === $videoEntity)
                {
                    print_r('!!!!!! Failed to upload.' . PHP_EOL);
                    $failedList[] = $videoFile;
                }
                else
                {
                    $this->videos[$videoFile] = $videoEntity;
                    print_r('@@@@@@ Succeed. ' . PHP_EOL);
                }
            }

            if(count($failedList) == 0)
            {
                break;
            }
            else
            {
                --$tryTimes;
                $videoFileList = $failedList;
            }
        }
        print_r('The files failed to upload: ' . PHP_EOL);
        print_r($failedList);
        print_r(PHP_EOL);
        return $failedList;
    }

    public function uploadImages($accountId, $imageRootPath='', $extend = array('.jpg', '.png',))
    {
        $this->images = array();
        if(empty($imageRootPath))
        {
            $imageRootPath = $this->materialPath;
        }
        $imageFileList = FileHelper::getRecursiveFileList($imageRootPath, $extend);
        $totalCount = count($imageFileList);
        print_r('######## There is ' . $totalCount . ' images. ######' . PHP_EOL);

        $failedList = array();
        foreach($imageFileList as $imageFile)
        {
            print_r('Uploading image : ' . $imageFile . PHP_EOL);
            print_r('Leaving : ' . --$totalCount . ' images .....' . PHP_EOL);

            $imageEntity = AdManagerFacade::createImage($imageFile, $accountId);

            if(false === $imageEntity)
            {
                print_r('!!!!!! Failed to upload.' . PHP_EOL);
                $failedList[] = $imageFile;
            }
            else
            {
                $this->images[$imageFile] = $imageEntity;
                print_r('@@@@@@ Succeed. ' . PHP_EOL);
            }
        }

        print_r('The files failed to upload: ' . PHP_EOL);
        print_r($failedList);
        print_r(PHP_EOL);
        return $failedList;
    }
}