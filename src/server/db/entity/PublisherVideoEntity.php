<?php


class PublisherVideoEntity
{
    private $uuid;

    private $videoId;

    private $videoType;

    private $durationTime;

    private $transitionTime;

    /**
     * @return mixed
     */
    public function getDurationTime()
    {
        return $this->durationTime;
    }

    /**
     * @param mixed $durationTime
     */
    public function setDurationTime($durationTime)
    {
        $this->durationTime = $durationTime;
    }

    /**
     * @return mixed
     */
    public function getTransitionTime()
    {
        return $this->transitionTime;
    }

    /**
     * @param mixed $transitionTime
     */
    public function setTransitionTime($transitionTime)
    {
        $this->transitionTime = $transitionTime;
    }

    /**
     * @return mixed
     */
    public function getVideoId()
    {
        return $this->videoId;
    }

    /**
     * @param mixed $videoId
     */
    public function setVideoId($videoId)
    {
        $this->videoId = $videoId;
    }

    /**
     * @return mixed
     */
    public function getUuid()
    {
        return $this->uuid;
    }

    /**
     * @param mixed $uuid
     */
    public function setUuid($uuid)
    {
        $this->uuid = $uuid;
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