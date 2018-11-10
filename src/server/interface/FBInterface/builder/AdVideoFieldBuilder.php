<?php

use FacebookAds\Object\Fields\AdVideoFields;

class AdVideoFieldBuilder implements IFieldBuilder
{
    private $videoType;

    //slideshow 参数
    private $imageUrls;

    private $durationMs;

    private $transitionMs;

    //一般video参数
    private $source;

    private $outputArray;

    public function __construct()
    {
        $this->durationMs = 2000;
        $this->transitionMs = 200;
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->outputArray = array();

        if(AdManageConstants::VIDEO_TYPE_SLIDESHOW == $this->videoType)
        {
            $this->appendSlideShow();
        }
        else if(AdManageConstants::VIDEO_TYPE_COMMON)
        {
            if(!empty($this->source))
            {
               $this->outputArray[AdVideoFields::SOURCE] = $this->source;
            }
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'There is not videoType: ' . $this->videoType);
        }

        return $this->outputArray;
    }

    private function appendSlideShow()
    {
        $slideShowArray = array();
        $slideShowArray[AdManageConstants::SLIDE_SHOW_IMAGEURL] = $this->imageUrls;
        $slideShowArray[AdManageConstants::SLIDE_SHOW_DURATION] = $this->durationMs;
        $slideShowArray[AdManageConstants::SLIDE_SHOW_TRANSITION] = $this->transitionMs;

        $this->outputArray[AdVideoFields::SLIDESHOW_SPEC] = $slideShowArray;
    }

    /**
     * @param mixed $durationMs
     */
    public function setDurationMs($durationMs)
    {
        $this->durationMs = $durationMs;
    }

    /**
     * @param mixed $imageUrls
     */
    public function setImageUrls($imageUrls)
    {
        $this->imageUrls = $imageUrls;
    }

    /**
     * @param mixed $source
     */
    public function setSource($source)
    {
        $this->source = $source;
    }

    /**
     * @param mixed $videoType
     */
    public function setVideoType($videoType)
    {
        $this->videoType = $videoType;
    }

    /**
     * @param mixed $transitionMs
     */
    public function setTransitionMs($transitionMs)
    {
        $this->transitionMs = $transitionMs;
    }


}