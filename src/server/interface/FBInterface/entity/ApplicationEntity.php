<?php


class ApplicationEntity
{
    private $id;
    private $name;
    private $description;
    private $imageUrl;
    private $originalUrl;
    private $storeUrl;

    private $supportDeviceArray;


    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }


    public function getName()
    {
        return $this->name;
    }


    public function setName($name)
    {
        $this->name = $name;
    }

    public function getDescription()
    {
        return $this->description;
    }


    public function setDescription($description)
    {
        $this->description = $description;
    }


    public function getImageUrl()
    {
        return $this->imageUrl;
    }


    public function setImageUrl($imageUrl)
    {
        $this->imageUrl = $imageUrl;
    }


    public function getOriginalUrl()
    {
        return $this->originalUrl;
    }


    public function setOriginalUrl($originalUrl)
    {
        $this->originalUrl = $originalUrl;
    }


    public function getStoreUrl()
    {
        return $this->storeUrl;
    }


    public function setStoreUrl($storeUrl)
    {
        $this->storeUrl = $storeUrl;
    }


    public function getSupportDeviceArray()
    {
        return $this->supportDeviceArray;
    }


    public function setSupportDeviceArray(array $supportDeviceArray)
    {
        $this->supportDeviceArray = $supportDeviceArray;
    }

}