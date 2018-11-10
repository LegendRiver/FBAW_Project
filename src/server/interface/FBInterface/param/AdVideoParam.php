<?php


class AdVideoParam
{
    private $accountId;

    private $videoType;

    //slideshow 参数
    private $imageUrls;

    private $durationMs;

    private $transitionMs;

    //一般video参数
    private $source;

    public function __construct()
    {
        $this->durationMs = AdManageConstants::SLIDESHOW_DURATION_TIME_DEFAULT;
        $this->transitionMs = AdManageConstants::SLIDESHOW_TRANSITION_TIME_DEFAULT;
    }

    /**
     * @return mixed
     */
    public function getAccountId()
    {
        return $this->accountId;
    }

    /**
     * @param mixed $accountId
     */
    public function setAccountId($accountId)
    {
        $this->accountId = $accountId;
    }

    /**
     * @return mixed
     */
    public function getDurationMs()
    {
        return $this->durationMs;
    }

    /**
     * @param mixed $durationMs
     */
    public function setDurationMs($durationMs)
    {
        $this->durationMs = $durationMs;
    }

    /**
     * @return mixed
     */
    public function getImageUrls()
    {
        return $this->imageUrls;
    }

    /**
     * @param mixed $imageUrls
     */
    public function setImageUrls($imageUrls)
    {
        $this->imageUrls = $imageUrls;
    }

    /**
     * @return mixed
     */
    public function getSource()
    {
        return $this->source;
    }

    /**
     * @param mixed $source
     */
    public function setSource($source)
    {
        $this->source = $source;
    }

    /**
     * @return mixed
     */
    public function getTransitionMs()
    {
        return $this->transitionMs;
    }

    /**
     * @param mixed $transitionMs
     */
    public function setTransitionMs($transitionMs)
    {
        $this->transitionMs = $transitionMs;
    }

    /**
     * @return mixed
     */
    public function getVideoType()
    {
        return $this->videoType;
    }

    /**
     * @param mixed $videoType
     */
    public function setVideoType($videoType)
    {
        $this->videoType = $videoType;
    }


}