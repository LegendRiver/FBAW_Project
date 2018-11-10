<?php


class LocationCriteriaEntity
{
    private $id;

    private $locationName;

    private $displayType;

    private $status;

    private $canonicalName;

    private $reach;


    public function __construct()
    {
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getLocationName()
    {
        return $this->locationName;
    }

    /**
     * @param mixed $locationName
     */
    public function setLocationName($locationName)
    {
        $this->locationName = $locationName;
    }

    /**
     * @return mixed
     */
    public function getDisplayType()
    {
        return $this->displayType;
    }

    /**
     * @param mixed $displayType
     */
    public function setDisplayType($displayType)
    {
        $this->displayType = $displayType;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return mixed
     */
    public function getCanonicalName()
    {
        return $this->canonicalName;
    }

    /**
     * @param mixed $canonicalName
     */
    public function setCanonicalName($canonicalName)
    {
        $this->canonicalName = $canonicalName;
    }

    /**
     * @return mixed
     */
    public function getReach()
    {
        return $this->reach;
    }

    /**
     * @param mixed $reach
     */
    public function setReach($reach)
    {
        $this->reach = $reach;
    }

}