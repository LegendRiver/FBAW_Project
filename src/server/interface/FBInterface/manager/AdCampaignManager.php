<?php

use FacebookAds\Object\AdAccount;
use FacebookAds\Object\Fields\CampaignFields;
use FacebookAds\Object\Campaign;

class AdCampaignManager
{
    private static $instance = null;

    //测试用
    private $allCampaignField;

    private $defaultCampaignField;

    private $params;

    private function __construct()
    {
        $this->defaultCampaignField = array(
            CampaignFields::ID,
            CampaignFields::ACCOUNT_ID,
            CampaignFields::NAME,
            CampaignFields::OBJECTIVE,
            CampaignFields::STATUS,
            CampaignFields::EFFECTIVE_STATUS,
            CampaignFields::SPEND_CAP,
            CampaignFields::BUYING_TYPE,
            CampaignFields::START_TIME,
            CampaignFields::STOP_TIME,
            CampaignFields::CREATED_TIME,
            CampaignFields::UPDATED_TIME,
        );

        $this->initAllCampaignFields();

        $this->params = array(
            AdManageConstants::QUERY_PARAM_LIMIT => AdManageConstants::QUERY_AD_AMOUNT_LIMIT,
        );
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function getCampaignById($campaignId)
    {
        try
        {
            $campaign = new Campaign($campaignId);
            $campaign->read($this->defaultCampaignField);
            $campaignEntity = $this->initCampaignEntity($campaign);

            return $campaignEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getCampaignCountByAccount($accountId)
    {
        $campaignArray = $this->getCampaignByAccount($accountId);
        if(empty($campaignArray))
        {
            return 0;
        }
        else
        {
            return count($campaignArray);
        }
    }

    public function createCampaign($accountId, $campaignFieldArray)
    {
        try
        {
            //获取account下的Campaign信息,并获取campaign数量
            $campaignCount = $this->getCampaignCountByAccount($accountId);
            if($campaignCount > AdManageConstants::CAMPAIGN_MAX_NUM)
            {
                ServerLogger::instance()->writeLog(Error, 'The number of campaigns is greater than ' .
                    AdManageConstants::CAMPAIGN_MAX_NUM . '; account: ' . $accountId);
                return false;
            }

            //获取参数
            $campaign = new Campaign(null, $accountId);

            $campaign->setData($campaignFieldArray);

            $campaign->create();

            $campaign->read($this->defaultCampaignField);
            $campaignEntity = $this->initCampaignEntity($campaign);

            return $campaignEntity;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    public function getCampaignByAccount($accountId)
    {
        $campaignArray = array();
        try
        {
            $sdkAccount = new AdAccount($accountId);
            $campaignCursor = $sdkAccount->getCampaigns($this->defaultCampaignField, $this->params);

            while($campaignCursor->valid())
            {
                $currentCampaign = $campaignCursor->current();
                $campaignEntity = $this->initCampaignEntity($currentCampaign);
                $campaignArray[] = $campaignEntity;

                $campaignCursor->next();
            }

            return $campaignArray;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    private function initCampaignEntity(Campaign $sdkCampaign)
    {
        $entity = new CampaignEntity();
        $accountId = AdManageConstants::ADACCOUNT_ID_PREFIX . $sdkCampaign->{CampaignFields::ACCOUNT_ID};
        $entity->setAccountId($accountId);
        $entity->setCampaignId($sdkCampaign->{CampaignFields::ID});
        $entity->setName($sdkCampaign->{CampaignFields::NAME});
        $entity->setObjective($sdkCampaign->{CampaignFields::OBJECTIVE});
        $entity->setStatus($sdkCampaign->{CampaignFields::STATUS});
        $entity->setEffectiveStatus($sdkCampaign->{CampaignFields::EFFECTIVE_STATUS});
        $entity->setCreatedTime($sdkCampaign->{CampaignFields::CREATED_TIME});
        $entity->setStartTime($sdkCampaign->{CampaignFields::START_TIME});
        $entity->setUpdateTime($sdkCampaign->{CampaignFields::UPDATED_TIME});
        $entity->setStopTime($sdkCampaign->{CampaignFields::STOP_TIME});
        $entity->setSpendCap($sdkCampaign->{CampaignFields::SPEND_CAP});
        return $entity;
    }


    public function deleteCampaign($campaignId)
    {
        try
        {
            $campaign = new Campaign($campaignId);
            $campaign->deleteSelf();

            return true;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }

    /**
     * 切换campaign状态
     * @param $campaignId
     * @param $status
     * @return bool
     */
    public function switchStatus($campaignId, $status)
    {
        try
        {
            $campaign = new Campaign($campaignId);
            $campaign->{CampaignFields::STATUS} = $status;
            $campaign->update();

            return true;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }
    }


    private function initAllCampaignFields()
    {
        $objectFields = new CampaignFields();
        $this->allCampaignField = $objectFields->getValues();
    }

}