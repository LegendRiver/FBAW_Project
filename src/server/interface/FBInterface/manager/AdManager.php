<?php

use FacebookAds\Object\Ad;
use FacebookAds\Object\Fields\AdFields;
use FacebookAds\Object\AdSet;
use FacebookAds\Object\AdAccount;
use FacebookAds\Object\Campaign;
use FacebookAds\Object\Fields\AdCreativeFields;
use FacebookAds\Object\Values\AdStatusValues;
use FacebookAds\Object\Values\AdEffectiveStatusValues;
use FacebookAds\Object\Values\ArchivableCrudObjectEffectiveStatuses;

class AdManager
{
    private static $instance = null;

    private $id2Ad;

    private $defaultField;

    private $allField;

    private $params;

    private function __construct()
    {
        $this->id2Ad = array();
        $this->defaultField = array(
            AdFields::ID,
            AdFields::NAME,
            AdFields::BID_TYPE,
            AdFields::STATUS,
            AdFields::EFFECTIVE_STATUS,
            AdFields::CREATED_TIME,
            AdFields::UPDATED_TIME,
            AdFields::RECOMMENDATIONS,
            AdFields::ADSET_ID,
            AdFields::CREATIVE,
            AdFields::ACCOUNT_ID,
        );

        $this->params = array(
            AdManageConstants::QUERY_PARAM_LIMIT => AdManageConstants::QUERY_AD_AMOUNT_LIMIT,
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

    public function createAd($accountId, $adFieldsArray)
    {
        try
        {
            $ad = new Ad(null, $accountId);
            $ad->setData($adFieldsArray);
            $ad->create();

            $ad->read($this->defaultField);
            $adEntity = $this->newAdEntity($ad);
            return $adEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getAdById($adId)
    {
        try {
            $ad = new Ad($adId);
            $ad->read($this->defaultField);
            $adEntity = $this->newAdEntity($ad);
            return $adEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getDisapprovedAdByAccount($accountId)
    {
        try
        {
            $account = new AdAccount($accountId);

            $queryParam = array_merge($this->params, array(
                AdFields::EFFECTIVE_STATUS => array(ArchivableCrudObjectEffectiveStatuses::DISAPPROVED)
            ));
            $adCursor = $account->getAds($this->defaultField, $queryParam);

            return $this->traverseAdCursor($adCursor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getAdsByAccount($accountId, $status = array())
    {
        try
        {
            $account = new AdAccount($accountId);

            $queryParam = $this->getStatusParam($status);
            $adCursor = $account->getAds($this->defaultField, $queryParam);

            return $this->traverseAdCursor($adCursor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

    }
    public function getAdsByCampaign($campaignId, $status = array())
    {
        try
        {
            $campaign = new Campaign($campaignId);

            $queryParam = $this->getStatusParam($status);
            $adCursor = $campaign->getAds($this->defaultField, $queryParam);

            return $this->traverseAdCursor($adCursor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

    }

    public function getAdsByAdSet($adSetId, $status = array())
    {
        try
        {
            $adset = new AdSet($adSetId);
            $queryParam = $this->getStatusParam($status);
            $adCursor = $adset->getAds($this->defaultField, $queryParam);

            return $this->traverseAdCursor($adCursor);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function switchStatus($adId, $status)
    {
        try
        {
            $ad = new Ad($adId);
            $ad->{AdFields::STATUS} = $status;
            $ad->update();

            return true;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    private function getStatusParam($statusList)
    {
        $queryParam = $this->params;

        $convertStatus = array();
        foreach($statusList as $statusFlag)
        {
            if(AdManageConstants::EFFECTIVE_STATUS_ACTIVE == $statusFlag)
            {
                $convertStatus[] = AdEffectiveStatusValues::ACTIVE;
            }
            else if(AdManageConstants::EFFECTIVE_STATUS_REVIEW == $statusFlag)
            {
                $convertStatus[] = AdEffectiveStatusValues::PENDING_REVIEW;
            }
        }


        if(!empty($convertStatus))
        {
            $queryParam = array_merge($queryParam, array(
                AdFields::EFFECTIVE_STATUS => $convertStatus,
            ));
        }

        return $queryParam;
    }

    private function traverseAdCursor($adCursor)
    {
        $resultArray = array();
        while ($adCursor->valid())
        {
            $currentAd = $adCursor->current();
            $adId = $currentAd->{AdFields::ID};

            $adEntity = $this->newAdEntity($currentAd);
            $this->id2Ad[$adId] = $adEntity;
            $resultArray[] = $adEntity;

            $adCursor->next();
        }

        return $resultArray;
    }

    private function newAdEntity(Ad $ad)
    {
        $entity = new AdEntity();
        $entity->setId($ad->{AdFields::ID});
        $entity->setName($ad->{AdFields::NAME});
        $entity->setBidType($ad->{AdFields::BID_TYPE});
        $entity->setCreateTime($ad->{AdFields::CREATED_TIME});
        $entity->setEffectiveStatus($ad->{AdFields::EFFECTIVE_STATUS});
        $entity->setStatus($ad->{AdFields::STATUS});
        $entity->setUpdateTime($ad->{AdFields::UPDATED_TIME});

        $creative = $ad->{AdFields::CREATIVE};
        $entity->setCreativeId($creative[AdCreativeFields::ID]);

        $entity->setRecommendArray($ad->{AdFields::RECOMMENDATIONS});
        $entity->setAdSetId($ad->{AdFields::ADSET_ID});
        $entity->setAccountId($ad->{AdFields::ACCOUNT_ID});

        return $entity;
    }

    private function initAllFields()
    {
        $adFields = new AdFields();
        $this->allField = $adFields->getValues();
    }

}