<?php

use FacebookAds\Object\Fields\AdVideoFields;
use FacebookAds\Object\AdAccount;
use FacebookAds\Object\AdVideo;

class AdVideoManager
{
    private static $instance = null;

    private $defaultFields;

    private $params;

    private $allFields;

    private function __construct()
    {
        $this->defaultFields = array(
            AdVideoFields::ID,
            AdVideoFields::EMBED_HTML,
            AdVideoFields::PUBLISHED,
            AdVideoFields::CREATED_TIME,
            AdVideoFields::UPDATED_TIME,
            AdVideoFields::THUMBNAILS,
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

    public function createVideo($accountId, $fieldArray)
    {
        try
        {
            $video = new AdVideo(null, $accountId);
            $video->setData($fieldArray);
            $video->create();

            $video->read($this->defaultFields);
            $entity = $this->newVedioEntity($video);

            return $entity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function deleteVideo($videoId)
    {
        try
        {
            $video = new AdVideo($videoId);
            $video->deleteSelf();
            return true;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getVideoById($videoId)
    {
        try
        {
            $video = new AdVideo($videoId);
            $video->read($this->defaultFields);
            $entity = $this->newVedioEntity($video);
            return $entity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getVideoByAccount($accountId)
    {
        try
        {
            $arrayVideo = array();
            $account = new AdAccount($accountId);
            $videos = $account->getAdVideos($this->defaultFields, $this->params);
            while ($videos->valid())
            {
                $currentVideo = $videos->current();
                $entity = $this->newVedioEntity($currentVideo);
                $arrayVideo[] = $entity;
                $videos->next();
            }

            return $arrayVideo;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    private function newVedioEntity($currentVideo)
    {
        $entity = new AdVideoEntity();
        $entity->setVideoId($currentVideo->{AdVideoFields::ID});
        $entity->setCreateTime($currentVideo->{AdVideoFields::CREATED_TIME});
        $entity->setUpdateTime($currentVideo->{AdVideoFields::UPDATED_TIME});
        $entity->setEmbedHtml($currentVideo->{AdVideoFields::EMBED_HTML});
        $entity->setPublished($currentVideo->{AdVideoFields::PUBLISHED});
        $entity->setThumbNails($currentVideo->{AdVideoFields::THUMBNAILS});

        return $entity;
    }

    private function initAllFields()
    {
        $videoField = new AdVideoFields();
        $this->allFields = $videoField->getValues();

        $excludeField = array(
            //AdVideoFields::SLIDESHOW_SPEC,
            AdVideoFields::NAME,
        );

        $this->allFields = array_diff($this->allFields, $excludeField);
    }
}