<?php


class PublisherImageEntity
{
    private $uuid;

    private $imageId;

    private $accountId;

    private $imageHash;

    private $imageUrl;

    private $localPath;

    private $imageName;

    private $height;

    private $width;

    private $originalUrl;

    /**
     * @return mixed
     */
    public function getOriginalUrl()
    {
        return $this->originalUrl;
    }

    /**
     * @param mixed $originalUrl
     */
    public function setOriginalUrl($originalUrl)
    {
        $this->originalUrl = $originalUrl;
    }

    /**
     * @return mixed
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * @param mixed $height
     */
    public function setHeight($height)
    {
        $this->height = $height;
    }

    /**
     * @return mixed
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param mixed $width
     */
    public function setWidth($width)
    {
        $this->width = $width;
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
    public function getImageHash()
    {
        return $this->imageHash;
    }

    /**
     * @param mixed $imageHash
     */
    public function setImageHash($imageHash)
    {
        $this->imageHash = $imageHash;
    }

    /**
     * @return mixed
     */
    public function getImageId()
    {
        return $this->imageId;
    }

    /**
     * @param mixed $imageId
     */
    public function setImageId($imageId)
    {
        $this->imageId = $imageId;
    }

    /**
     * @return mixed
     */
    public function getImageName()
    {
        return $this->imageName;
    }

    /**
     * @param mixed $imageName
     */
    public function setImageName($imageName)
    {
        $this->imageName = $imageName;
    }

    /**
     * @return mixed
     */
    public function getImageUrl()
    {
        return $this->imageUrl;
    }

    /**
     * @param mixed $imageUrl
     */
    public function setImageUrl($imageUrl)
    {
        $this->imageUrl = $imageUrl;
    }

    /**
     * @return mixed
     */
    public function getLocalPath()
    {
        return $this->localPath;
    }

    /**
     * @param mixed $localPath
     */
    public function setLocalPath($localPath)
    {
        $this->localPath = $localPath;
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


}