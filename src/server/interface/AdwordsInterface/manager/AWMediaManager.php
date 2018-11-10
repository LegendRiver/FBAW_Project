<?php

use Google\AdsApi\AdWords\v201705\cm\Image;
use Google\AdsApi\AdWords\v201705\cm\Video;
use Google\AdsApi\AdWords\v201705\cm\MediaMediaType;
use Google\AdsApi\AdWords\v201705\cm\Predicate;
use Google\AdsApi\AdWords\v201705\cm\PredicateOperator;

class AWMediaManager extends AbstractAWManager
{
    private $defaultImageFields;

    private $defaultVideoFields;

    public function __construct()
    {
        $this->defaultImageFields = array(
            ImageFieldConstants::MEDIA_ID,
            ImageFieldConstants::TYPE,
            ImageFieldConstants::REFERENCE_ID,
            ImageFieldConstants::DIMENSIONS,
            ImageFieldConstants::URLS,
            ImageFieldConstants::MIME_TYPE,
            ImageFieldConstants::NAME,
            ImageFieldConstants::FILE_SIZE,
            ImageFieldConstants::CREATE_TIME,
        );

        $this->defaultVideoFields = VideoFieldConstants::getInstance()->getValues();
    }

    public function uploadImageToAdwords($imageFiles, $accountId='')
    {
        $imageArray = array();

        foreach ($imageFiles as $path)
        {
            $imageData = file_get_contents($path);
            if(false === $imageData)
            {
                ServerLogger::instance()->writeAdwordsLog(Error, 'Failed to open the image: ' . $path);
                continue;
            }
            $image = new Image();
            $image->setData($imageData);
            $image->setType(MediaMediaType::IMAGE);

            $imageArray[] = $image;
        }

        $uploadResult = array();
        if(empty($imageArray))
        {
            return false;
        }
        else
        {
            $imageList = $this->getService($accountId)->upload($imageArray);

            foreach($imageList as $imageEntry)
            {
                $entity = $this->buildEntity($imageEntry);
                $uploadResult[] = $entity;
            }
        }

        return $uploadResult;
    }

    public function getAllImages($accountId = null)
    {
        $pageNum = self::PAGE_NUM_LIMIT;
        $predicate = new Predicate('Type', PredicateOperator::EQUALS, array(MediaMediaType::IMAGE));
        return $this->traversePage($pageNum, $this->defaultImageFields, $accountId, array($predicate));
    }

    public function getAllVideos($accountId = null)
    {
        $pageNum = self::PAGE_NUM_LIMIT;
        $predicate = new Predicate('Type', PredicateOperator::EQUALS, array(MediaMediaType::VIDEO));
        return $this->traversePage($pageNum, $this->defaultVideoFields, $accountId, array($predicate));
    }

    protected function getService($customerAccountId = null)
    {
       return AWServiceManager::getInstance()->getMediaService($customerAccountId);
    }

    protected function buildEntity($entry)
    {
        $type = $entry->getType();
        if($type == MediaMediaType::IMAGE)
        {
            return $this->buildImageEntity($entry);
        }
        else
        {
            return $entry;
        }
    }

    private function buildImageEntity($entry)
    {
        $id = $entry->getMediaId();
        $type = $entry->getType();
        $referenceId = $entry->getReferenceId();

        $dimension = $entry->getDimensions()[0];
        $width = $dimension->getValue()->getWidth();
        $height = $dimension->getValue()->getHeight();

        $urlEntry = $entry->getUrls()[0];
        $url = $urlEntry->getValue();

        $mimeType = $entry->getMimeType();
        $fileSize = $entry->getFileSize();

        $entity = new AWImageEntity();
        $entity->setMediaId($id);
        $entity->setType($type);
        $entity->setReferenceId($referenceId);
        $entity->setWidth($width);
        $entity->setHeight($height);
        $entity->setUrl($url);
        $entity->setMimeType($mimeType);
        $entity->setFileSize($fileSize);

        return $entity;
    }

    const PAGE_NUM_LIMIT = 50;
}