<?php


class AdVideoEntity
{
    private $videoId;

    private $createTime;

    private $updateTime;

    private $embedHtml;

    private $published;

    private $thumbNails;

    /**
     * @return mixed
     */
    public function getThumbNails()
    {
        return $this->thumbNails;
    }

    /**
     * @param mixed $thumbNails
     */
    public function setThumbNails($thumbNails)
    {
        $this->thumbNails = $thumbNails;
    }

    /**
     * @return mixed
     */
    public function getPublished()
    {
        return $this->published;
    }

    /**
     * @param mixed $published
     */
    public function setPublished($published)
    {
        $this->published = $published;
    }

    /**
     * @return mixed
     */
    public function getCreateTime()
    {
        return $this->createTime;
    }

    /**
     * @param mixed $createTime
     */
    public function setCreateTime($createTime)
    {
        $this->createTime = $createTime;
    }

    /**
     * @return mixed
     */
    public function getEmbedHtml()
    {
        return $this->embedHtml;
    }

    /**
     * @param mixed $embedHtml
     */
    public function setEmbedHtml($embedHtml)
    {
        $this->embedHtml = $embedHtml;
    }

    /**
     * @return mixed
     */
    public function getUpdateTime()
    {
        return $this->updateTime;
    }

    /**
     * @param mixed $updateTime
     */
    public function setUpdateTime($updateTime)
    {
        $this->updateTime = $updateTime;
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

}