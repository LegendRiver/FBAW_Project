<?php


class UserDeviceEntity
{
    private $name;

    private $description;

    private $platform;

    private $audienceSize;

    public function getCsvTitle()
    {
        $titleArray = array(
            'Name',
            'Description',
            'Platform',
            'AudienceSize',
        );
        return $titleArray;
    }

    public function getCsvValue()
    {
        $valueArray = array();
        $valueArray[] = $this->name;
        $valueArray[] = $this->description;
        $valueArray[] = $this->platform;
        $valueArray[] = $this->audienceSize;

        return $valueArray;
    }

    /**
     * @return mixed
     */
    public function getAudienceSize()
    {
        return $this->audienceSize;
    }

    /**
     * @param mixed $audienceSize
     */
    public function setAudienceSize($audienceSize)
    {
        $this->audienceSize = $audienceSize;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getPlatform()
    {
        return $this->platform;
    }

    /**
     * @param mixed $platform
     */
    public function setPlatform($platform)
    {
        $this->platform = $platform;
    }

}