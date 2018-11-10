<?php

use FacebookAds\Object\AdAccount;
use FacebookAds\Object\AdImage;
use FacebookAds\Object\Fields\AdImageFields;

class AdImageManager
{
    private static $instance = null;

    private $allFields;

    private $defaultFields;

    private $params;

    private function __construct()
    {
        $this->defaultFields = array(
            AdImageFields::ID,
            AdImageFields::ACCOUNT_ID,
            AdImageFields::HASH,
            AdImageFields::HEIGHT,
            AdImageFields::WIDTH,
            AdImageFields::NAME,
            AdImageFields::STATUS,
            AdImageFields::URL,
        );

        $this->params = array(
            AdManageConstants::QUERY_PARAM_LIMIT => AdManageConstants::QUERY_COMMON_AMOUNT_LIMIT,
        );

        $this->initAllFields();
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function createImageByByte($byte, $accountId)
    {
        try
        {
            $image = new EliImage(null, $accountId);
            $image->{AdImageFields::BYTES} = $byte;
            $image->createByBytes();

            $image->read($this->defaultFields);
            $imageEntity = $this->newAImage($image);

            return $imageEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function createImage($imagePath, $accountId)
    {
        try
        {
            $image = new AdImage(null, $accountId);
            $image->{AdImageFields::FILENAME} = $imagePath;
            $image->create();

            $image->read($this->defaultFields);
            $imageEntity = $this->newAImage($image);

            return $imageEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

    }

    public function createFromZip($zipPath, $accountId)
    {

    }

    public function deleteImageById($imageId, $imageHash, $accountId)
    {
        try
        {
            $adImage = new AdImage($imageId, $accountId);
            $adImage->{AdImageFields::HASH} = $imageHash;
            $adImage->delete();
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function deleteImageByHashes(array $imageHashes, $accountId)
    {
        $imageEntities = $this->getImageInfoByHash($imageHashes, $accountId);
        foreach ($imageEntities as $image)
        {
            $imageHash = $image->getImageHash();
            $imageId = $image->getId();
            $this->deleteImageById($imageId, $imageHash, $accountId);
        }

        return $imageEntities;
    }

    public function getImageInfoByHash(array $imageHash, $accountId)
    {
        $images = $this->queryImageByhashes($imageHash, $accountId);

        return $images;
    }

    public function getAllImagesByAccount($accountId)
    {
        try
        {
            $arrayImage = array();
            $account = new AdAccount($accountId);
            $images = $account->getAdImages($this->defaultFields, $this->params);
            while($images->valid())
            {
                $currentImage = $images->current();
                $imageEntity = $this->newAImage($currentImage);
                $arrayImage[] = $imageEntity;

                $images->next();
            }

            return $arrayImage;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    private function queryImageByhashes(array $hashes, $accountId)
    {
        $arrayImage = array();
        if(empty($hashes))
        {
            return $arrayImage;
        }

        try
        {
            $account = new AdAccount($accountId);
            $param = array(AdManageConstants::ADIMAGE_PARAM_HASHES => $hashes);
            $images = $account->getAdImages($this->defaultFields, $param);
            while ($images->valid())
            {
                $currentImage = $images->current();
                $imageEntity = $this->newAImage($currentImage);

                $arrayImage[] = $imageEntity;
                $images->next();
            }

            return $arrayImage;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

    }

    private function newAImage(AdImage $image)
    {
        $entity = new AdImageEntity();
        $entity->setId($image->{AdImageFields::ID});

        $accountId = AdManageConstants::ADACCOUNT_ID_PREFIX . $image->{AdImageFields::ACCOUNT_ID};
        $entity->setAccountId($accountId);

        $entity->setFileName($image->{AdImageFields::NAME});
        $entity->setStatus($image->{AdImageFields::STATUS});
        $entity->setImageHash($image->{AdImageFields::HASH});
        $entity->setHeight($image->{AdImageFields::HEIGHT});
        $entity->setWidth($image->{AdImageFields::WIDTH});
        $entity->setUrl($image->{AdImageFields::URL});

        return $entity;
    }

    private function initAllFields()
    {
        $fields = new AdImageFields();
        $this->allFields = $fields->getValues();
    }

}