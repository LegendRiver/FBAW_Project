<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/11/14
 * Time: 下午9:05
 */
class ProductInfoEntity
{
    private $id;

    private $name;

    private $advertiserId;

    private $imagePath;

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
    public function getAdvertiserId()
    {
        return $this->advertiserId;
    }

    /**
     * @param mixed $advertiserId
     */
    public function setAdvertiserId($advertiserId)
    {
        $this->advertiserId = $advertiserId;
    }

    /**
     * @return mixed
     */
    public function getImagePath()
    {
        return $this->imagePath;
    }

    /**
     * @param mixed $imagePath
     */
    public function setImagePath($imagePath)
    {
        $this->imagePath = $imagePath;
    }

}