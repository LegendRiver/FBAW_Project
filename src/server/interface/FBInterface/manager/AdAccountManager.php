<?php

use FacebookAds\Object\Fields\AdAccountFields;
use FacebookAds\Object\AdAccountUser;
use FacebookAds\Object\AdAccount;
use \FacebookAds\Object\Business;

class AdAccountManager
{
    private static $instance = null;

    private $defaultAccountField;

    private $campaignMgr;

    private $params;

    //测试用
    private $allAccountField;

    private function __construct()
    {
        $this->defaultAccountField = array(
            AdAccountFields::ID,
            AdAccountFields::NAME,
            //AdAccountFields::END_ADVERTISER,
            AdAccountFields::CURRENCY,
            AdAccountFields::TIMEZONE_ID,
            AdAccountFields::TIMEZONE_NAME,
            AdAccountFields::TIMEZONE_OFFSET_HOURS_UTC,
            AdAccountFields::ACCOUNT_STATUS,
            //AdAccountFields::TOS_ACCEPTED,
            //AdAccountFields::AGE,
            AdAccountFields::CREATED_TIME,
            AdAccountFields::SPEND_CAP,
            AdAccountFields::AMOUNT_SPENT,
        );
        $this->initAllFields();

        $this->campaignMgr = AdCampaignManager::instance();

        $this->params = array(
            AdManageConstants::QUERY_PARAM_LIMIT => AdManageConstants::QUERY_ACCOUNT_AMOUNT_LIMIT,
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

    public function getAccountByBMId($bmId)
    {
        try
        {
            $businessManager = new Business($bmId);
            $clientAccountCursor = $businessManager->getClientAdAccounts($this->defaultAccountField, $this->params);
            $clientAccountList = $this->traverseAccountCursor($clientAccountCursor);

            $ownedAccountCursor = $businessManager->getOwnedAdAccounts($this->defaultAccountField, $this->params);
            $ownedAccountList = $this->traverseAccountCursor($ownedAccountCursor);

            $accountList = array_merge($clientAccountList, $ownedAccountList);
            if(empty($accountList))
            {
                return array();
            }
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

        return $accountList;
    }

    public function getAccountCount($userID)
    {
        $accountArray = $this->getAllAccountByUser($userID);
        if(false === $accountArray)
        {
            return 0;
        }
        return count($accountArray);
    }


    public function getAllAccountByUser($userId)
    {
        try
        {
            $sdkUser = new AdAccountUser($userId);
            $sdkAccountCursor = $sdkUser->getAdAccounts($this->defaultAccountField, $this->params);
            $accountArray = $this->traverseAccountCursor($sdkAccountCursor);

            ServerLogger::instance()->writeLog(Info, 'Read accounts of user: ' . $userId . ' succeed.');
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

        return $accountArray;
    }

    public function getProperAccount($userId)
    {
        //根据现有account逻辑返回，相当于选择合适的Account，目前获取Campaign最少的
        //判断account状态； 交替变换账户防止超过调用限制

        return false;
    }

    public function getAccountById($accountId)
    {
        $entity = null;
        try
        {
            $account = new AdAccount($accountId);
            $account->read($this->defaultAccountField);
            $entity = $this->initAccountEntity($account);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

        return $entity;
    }

    private function traverseAccountCursor($accountCursor)
    {
        $accountArray = array();
        while($accountCursor->valid())
        {
            $sdkAccount = $accountCursor->current();
//            $endAdvertiser = $sdkAccount->{AdAccountFields::END_ADVERTISER};

//            //去除自带的Account
//            if(!is_null($endAdvertiser))
//            {
                //封装成实体
            $accountEntity = $this->initAccountEntity($sdkAccount);
            $accountArray[] = $accountEntity;
//            }

            $accountCursor->next();
        }

        return $accountArray;
    }

    private function initAccountEntity($sdkAccount)
    {
        $entity = new AdAccountEntity();
        $entity->setName($sdkAccount->{AdAccountFields::NAME});
        $entity->setId($sdkAccount->{AdAccountFields::ID});
        $entity->setStatus($sdkAccount->{AdAccountFields::ACCOUNT_STATUS});
        $entity->setCurrency($sdkAccount->{AdAccountFields::CURRENCY});
        $entity->setTimezoneId($sdkAccount->{AdAccountFields::TIMEZONE_ID});
        $entity->setTimezoneName($sdkAccount->{AdAccountFields::TIMEZONE_NAME});
        $entity->setTimezoneOffset($sdkAccount->{AdAccountFields::TIMEZONE_OFFSET_HOURS_UTC});
        //$entity->setAge($sdkAccount->{AdAccountFields::AGE});

//        $acceptedTos = $sdkAccount->{AdAccountFields::TOS_ACCEPTED};
//        if(is_array($acceptedTos))
//        {
//            $entity->setTosAccepted(array_keys($acceptedTos));
//        }
        $entity->setCreateTime($sdkAccount->{AdAccountFields::CREATED_TIME});
        $entity->setSpendCap($sdkAccount->{AdAccountFields::SPEND_CAP});
        $entity->setAmountSpend($sdkAccount->{AdAccountFields::AMOUNT_SPENT});
        return $entity;
    }

    /**
     * 获取AdAccount的所有Fields, 测试用
     */
    private function initAllFields()
    {
        $accountFields = new AdAccountFields();
        $this->allAccountField = $accountFields->getValues();
    }

    private function createAccount()
    {
        //每个用户最多25个Adaccount
    }

    private function removeAccount($accountId)
    {

    }

}