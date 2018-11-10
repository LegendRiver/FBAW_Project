<?php

use FacebookAds\Object\AdSet;
use FacebookAds\Object\Campaign;
use FacebookAds\Object\AdAccount;
use FacebookAds\Object\Fields\AdSetFields;
use FacebookAds\Object\Values\AdSetOptimizationGoalValues;
use FacebookAds\Object\Values\AdSetEffectiveStatusValues;
use FacebookAds\Object\Values\AdSetStatusValues;
use FacebookAds\Object\Fields\AdPromotedObjectFields;

class AdSetManager
{
    private static $singleInstance = null;

    private $defaultFields;

    private $allFields;

    private $params;

    private function __construct()
    {
        $this->defaultFields = array(
            AdSetFields::ID,
            AdSetFields::NAME,
            AdSetFields::CAMPAIGN_ID,
            AdSetFields::ACCOUNT_ID,
            AdSetFields::OPTIMIZATION_GOAL,
            AdSetFields::PROMOTED_OBJECT,
            AdSetFields::DAILY_BUDGET,
            AdSetFields::LIFETIME_BUDGET,
            AdSetFields::BUDGET_REMAINING,
            AdSetFields::BILLING_EVENT,
            AdSetFields::IS_AUTOBID,
            AdSetFields::BID_AMOUNT,
            AdSetFields::CREATED_TIME,
            AdSetFields::START_TIME,
            AdSetFields::END_TIME,
            AdSetFields::STATUS,
            AdSetFields::EFFECTIVE_STATUS,
            AdSetFields::UPDATED_TIME,
            AdSetFields::TARGETING,
        );

        $this->params = array(
            AdManageConstants::QUERY_PARAM_LIMIT => AdManageConstants::QUERY_ADSET_AMOUNT_LIMIT,
        );

        $this->initAllAdsetField();

    }

    public static function instance()
    {
        if(is_null(static::$singleInstance))
        {
            static::$singleInstance = new static();
        }

        return static::$singleInstance;
    }

    public function updateBudget($adsetId, $isDailyBudget, $budgetValue)
    {
        try
        {
            $adset = new Adset($adsetId);
            if($isDailyBudget)
            {
                $adset->{AdSetFields::DAILY_BUDGET} = $budgetValue;
            }
            else
            {
                $adset->{AdSetFields::LIFETIME_BUDGET} = $budgetValue;
            }

            $adset->update();

            return true;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function switchStatus($adsetId, $status)
    {
        try
        {
            $adset = new Adset($adsetId);
            $adset->{AdSetFields::STATUS} = $status;
            $adset->update();

            return true;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function updateName($adsetId, $name)
    {
        try
        {
            $adset = new Adset($adsetId);
            $adset->{AdSetFields::NAME} = $name;
            $adset->update();

            return true;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getAdsetById($adsetId)
    {
        try
        {
            $adset = new Adset($adsetId);
            $adset->read($this->defaultFields);
            $adsetEntity = $this->newAdSetEntity($adset);

            return $adsetEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getAllFieldAdsetById($adsetId)
    {
        try
        {
            $adset = new Adset($adsetId);
            $adset->read($this->allFields);

            return $adset->getData();
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function copyAdset($adsetId, $param=array())
    {
        try
        {
            $adset = new EliAdSet($adsetId);
            $copyResult = $adset->copyAdset($param);

            return $copyResult->getData();
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function createAdSet($accountId, $fieldArray)
    {
        try
        {
            $adSet = new AdSet(null, $accountId);
            $adSet->setData($fieldArray);
            $adSet->create();

            $adSet->read($this->defaultFields);
            $adsetEntity = $this->newAdSetEntity($adSet);
            return $adsetEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getAdsetsByCampaignId($campaignId, $status = array(), $fields=array())
    {
        try
        {
            $adsetArray = array();
            $campaign = new Campaign($campaignId);

            $queryParam = $this->getStatusParam($status);
            $queryFields = $this->defaultFields;
            if(!empty($fields))
            {
                $queryFields = $fields;
            }

            $adsetCursor = $campaign->getAdSets($queryFields, $queryParam);

            while ($adsetCursor->valid())
            {
                $currentAdset = $adsetCursor->current();
                $adsetEntity = $this->newAdSetEntity($currentAdset);
                $adsetArray[] = $adsetEntity;

                $adsetCursor->next();

            }

            return $adsetArray;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

    }

    public function getAdsetsByAccountId($accountId, $status = array())
    {
        try
        {
            $adsetArray = array();
            $account = new AdAccount($accountId);

            $queryParam = $this->getStatusParam($status);
            $adsetCursor = $account->getAdSets($this->defaultFields, $queryParam);

            while ($adsetCursor->valid())
            {
                $currentAdset = $adsetCursor->current();
                $adsetEntity = $this->newAdSetEntity($currentAdset);
                $adsetArray[] = $adsetEntity;

                $adsetCursor->next();

            }

            return $adsetArray;
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
            //adset 不支持状态 pending review
            if(AdManageConstants::EFFECTIVE_STATUS_ACTIVE == $statusFlag)
            {
               $convertStatus[] =  AdSetEffectiveStatusValues::ACTIVE;
            }
        }


        if(!empty($convertStatus))
        {
            $queryParam = array_merge($queryParam, array(
                AdSetFields::EFFECTIVE_STATUS => $convertStatus,
            ));
        }

        return $queryParam;
    }

    public function updateBid($adsetId, $bidAmount)
    {
        try
        {
            $adset = new Adset($adsetId);
            if($bidAmount < 1)
            {
                ServerLogger::instance()->writeLog(Warning, 'The bid amount is little than 1.');
                return false;
            }

            $bidAmount = round($bidAmount);
            $adset->{AdSetFields::BID_AMOUNT} = $bidAmount;

            $adset->update();

            return true;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    private function newAdSetEntity(AdSet $adset)
    {
        $entity = new AdsetEntity();
        $entity->setId($adset->{AdSetFields::ID});
        $entity->setName($adset->{AdSetFields::NAME});
        $entity->setCampaignId($adset->{AdSetFields::CAMPAIGN_ID});

        $accountId = AdManageConstants::ADACCOUNT_ID_PREFIX . $adset->{AdSetFields::ACCOUNT_ID};
        $entity->setAccountId($accountId);

        $entity->setDailyBudget($adset->{AdSetFields::DAILY_BUDGET});
        $entity->setLifetimeBudget($adset->{AdSetFields::LIFETIME_BUDGET});
        $entity->setBudgetRemaining($adset->{AdSetFields::BUDGET_REMAINING});
        $entity->setBillEvents($adset->{AdSetFields::BILLING_EVENT});

        $isAutobid = $adset->{AdSetFields::IS_AUTOBID};
        $entity->setIsAutobid($isAutobid);
        if($isAutobid === true)
        {
            $entity->setBitAmount(0);
        }
        else
        {
            $entity->setBitAmount($adset->{AdSetFields::BID_AMOUNT});
        }

        $goal = $adset->{AdSetFields::OPTIMIZATION_GOAL};
        $entity->setOptimizationGoal($goal);

        $sdkObject = $adset->{AdSetFields::PROMOTED_OBJECT};
        if(isset($sdkObject))
        {
            $appId = CommonHelper::getArrayValueByKey(AdPromotedObjectFields::APPLICATION_ID, $sdkObject);
            $appUrl = CommonHelper::getArrayValueByKey(AdPromotedObjectFields::OBJECT_STORE_URL, $sdkObject);
            $entity->setPromoteObjectAppId($appId);
            $entity->setPromoteObjectAppUrl($appUrl);
        }

        $entity->setStatus($adset->{AdSetFields::STATUS});
        $entity->setEffectiveStatus($adset->{AdSetFields::EFFECTIVE_STATUS});
        $entity->setCreatedTime($adset->{AdSetFields::CREATED_TIME});
        $entity->setUpdateTime($adset->{AdSetFields::UPDATED_TIME});
        $entity->setStartTime($adset->{AdSetFields::START_TIME});
        $entity->setEndTime($adset->{AdSetFields::END_TIME});
        $entity->setTargeting($adset->{AdSetFields::TARGETING});

        return $entity;
    }


    private function initAllAdsetField()
    {
        $objectFields = new AdSetFields();
        $this->allFields = $objectFields->getValues();
        //需要剔除部分属性，有些是不存在，有些是没有权限读，有些没有必要
        $excludeFields = array(
            AdSetFields::DAILY_IMPS,
            AdSetFields::REDOWNLOAD,
            AdSetFields::ADLABELS,
            AdSetFields::CAMPAIGN,
            AdSetFields::EXECUTION_OPTIONS,
            AdSetFields::CAMPAIGN_SPEC,
        );
        $this->allFields = array_diff($this->allFields, $excludeFields);
    }
}