<?php


class VideoProcesser
{
    private $creativePid2VideoEntity;

    private $imagesArray;

    private $videoSourcePathArray;

    public function __construct()
    {
        $this->clearBuffer();
    }

    public function clearBuffer()
    {
        $this->creativePid2VideoEntity = array();
        $this->imagesArray = array();
        $this->videoSourcePathArray = array();
    }

    public function getVideoEntityMap()
    {
        return $this->creativePid2VideoEntity;
    }

    public function createCommonVideos($creativePid2VideoPath, $accountId)
    {
        foreach($creativePid2VideoPath as $pid=>$videoPath)
        {
            $createdVideoPid = $this->isHaveCommonVideo($videoPath);
            if($createdVideoPid)
            {
                $createdVideoEntity = $this->creativePid2VideoEntity[$createdVideoPid];
                $this->creativePid2VideoEntity[$pid] = $createdVideoEntity;
                continue;
            }

            $videoParam = new AdVideoParam();
            $videoParam->setAccountId($accountId);
            $videoParam->setSource($videoPath);
            $videoParam->setVideoType(AdManageConstants::VIDEO_TYPE_COMMON);
            $videoEntity = AdManagerFacade::createAdVideo($videoParam);
            if(false === $videoEntity)
            {
                ServerLogger::instance()->writeLog(Error, 'Failed to create common video of creative : ' . $pid);
                return false;
            }

            $this->creativePid2VideoEntity[$pid] = $videoEntity;
            $this->videoSourcePathArray[$pid] = $videoPath;
        }

        return true;
    }

    public function createSlideShowVideos($creativePid2ImageUrls, $accountId)
    {
        foreach($creativePid2ImageUrls as $pid=>$imageUrls)
        {
            //减少重复创建
            $createdPid = $this->isHaveSlideshowVideo($imageUrls);
            if($createdPid)
            {
                $createdEntity = $this->creativePid2VideoEntity[$createdPid];
                $this->creativePid2VideoEntity[$pid] = $createdEntity;
                continue;
            }

            $videoParam = new AdVideoParam();
            $videoParam->setAccountId($accountId);
            $videoParam->setImageUrls($imageUrls);
            $videoParam->setVideoType(AdManageConstants::VIDEO_TYPE_SLIDESHOW);
            $videoEntity = AdManagerFacade::createAdVideo($videoParam);
            if(false === $videoEntity)
            {
                ServerLogger::instance()->writeLog(Error, 'Failed to create slideshow video of creative : ' . $pid);
                return false;
            }

            $this->creativePid2VideoEntity[$pid] = $videoEntity;
            $this->imagesArray[$pid] = $imageUrls;
        }

        return true;
    }

    private function isHaveCommonVideo($newPath)
    {
        foreach ($this->videoSourcePathArray as $pid=>$videoPath)
        {
            if($newPath === $videoPath)
            {
                return $pid;
            }
        }

        return false;

    }

    private function isHaveSlideshowVideo($imageUrls)
    {
        foreach($this->imagesArray as $pid=>$slideUrls)
        {
            $diffArray = array_diff($imageUrls, $slideUrls);
            if(count($diffArray) == 0)
            {
                return $pid;
            }
        }

        return false;
    }

}