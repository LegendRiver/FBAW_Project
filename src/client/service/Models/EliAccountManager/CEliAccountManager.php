<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 11:32
 */
class CEliAccountManager extends CBaseObject
{
    private $EliAccount = null;
    private $EliPublisherOwner = null;
    private $Industry = null;
    private $EliCampaignConfigSpentRecord = null;
    private $EliAudience = null;
    private $EliLoginRecord = null;
    private $SecurityManager = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliAccountManager";
        $this->TableName = "NONE_TABLE";
        $this->Industry = new CEliIndustry($config, $log, $dbInterface);
        $this->EliAccount = new CEliAccount($config, $log, $dbInterface);
        $this->EliPublisherOwner = new CEliPublisherOwner($config, $log, $dbInterface);
        $this->EliCampaignConfigSpentRecord = new CEliCampaignConfigSpentRecord($config, $log, $dbInterface);
        $this->EliAudience = new CEliAudience($config, $log, $dbInterface);
        $this->EliLoginRecord = new CEliLoginRecord($config, $log, $dbInterface);
        $this->SecurityManager = new CSecurityManager($config, $log, $dbInterface);

        parent::__construct($config, $log, $dbInterface);
        $this->addAllowAccessFunction("createEliAccount");
        $this->addAllowAccessFunction("getEliAccount");
        $this->addAllowAccessFunction("login");
        $this->addAllowAccessFunction("logout");
        $this->addAllowAccessFunction("changePassword");
        $this->addAllowAccessFunction("resetPassword");
        $this->addAllowAccessFunction("sendResetPasswordVerificationCode");
        $this->addAllowAccessFunction("rebindCellPhone");
        $this->addAllowAccessFunction("improveAccountInformation");
        $this->addAllowAccessFunction("getPublisherOwnerList");
        $this->addAllowAccessFunction("createEliCampaign");
        $this->addAllowAccessFunction("getCampaignList");
        $this->addAllowAccessFunction("getIndustryList");
        $this->addAllowAccessFunction("updateCampaignConfigSpent");
        $this->addAllowAccessFunction("getAudienceListByType");
        $this->addAllowAccessFunction("getAudienceList");
        $this->addAllowAccessFunction("getPublicAudience");
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function getIndustryList($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $industryList = array();
        $errorCode = $this->Industry->getIndustryList($industryList);
        $result->setErrorCode($errorCode);
        $result->setData($industryList);

        return $result;
    }

    public function getAudienceListByType($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP,
            PARAMETER_ELI_PUBLISHER_OWNER_ID,
            PARAMETER_ELI_AUDIENCE_TYPE
            );
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];

        $eliAccountId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $publisherOwnerId = $parameters[PARAMETER_ELI_PUBLISHER_OWNER_ID];
        $audienceType = $parameters[PARAMETER_ELI_AUDIENCE_TYPE];
        $audienceList = array();

        $errorCode = $this->EliAudience->getAudienceListByType($publisherOwnerId, $audienceType, $audienceList);
        $result->setErrorCode($errorCode);
        $result->setData($audienceList);
        return $result;
    }

    public function getPublicAudience($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP
        );

        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];

        $eliAccountId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $audienceList = array();

        $errorCode = $this->EliAudience->getPublicAudience($audienceList);
        $result->setErrorCode($errorCode);
        $result->setData($audienceList);
        return $result;
    }

    public function getAudienceList($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP,
            PARAMETER_ELI_PUBLISHER_OWNER_ID
            );
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];

        $eliAccountId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $publisherOwnerId = $parameters[PARAMETER_ELI_PUBLISHER_OWNER_ID];
        $audienceData = array();

        $errorCode = $this->EliAudience->getAudienceList($publisherOwnerId, $audienceData);
        $result->setErrorCode($errorCode);
        $result->setData($audienceData);
        return $result;
    }

    public function createEliAccount($parameters)
    {
        return $this->EliAccount->createEliAccount($parameters);
    }

    public function getEliAccount($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP
        );
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];

        $eliAccountId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $eliAccount = array();
        $errorCode = $this->EliAccount->getEliAccount($eliAccountId, $eliAccount);
        $result->setErrorCode($errorCode);
        $result->setData($eliAccount);

        return $result;
    }

    public function sendResetPasswordVerificationCode($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP,
            PARAMETER_USER_ACCOUNT);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $userAccount = $parameters[PARAMETER_USER_ACCOUNT];
        $accountId = false;
        $isAccountExist = false;
        $errorCode = $this->EliAccount->checkExist($userAccount, $userAccount, $isAccountExist, $accountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Check account <%s> failed, error code<%d>.", $userAccount, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if(!$isAccountExist)
        {
            $result->setErrorCode(ERR_ELI_ACCOUNT_NOT_EXIST);
            $result->setMessage(sprintf("Account <%s> not exist, error code<%d>.", $userAccount, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $cellPhone = false;
        $errorCode = $this->EliAccount->getEliAccountCellPhone($accountId, $cellPhone);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Get account <%s>  cell phone failed, error code<%d>.", $accountId, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $parameters[PARAMETER_ELI_CELL_PHONE] = $cellPhone;
        $result = $this->SecurityManager->sendVerificationCode($parameters);
        if($result->getErrorCode() != OK)
        {
            $result->setMessage(sprintf("Send <%s,%s> reset password verification code failed, error code<%d>.", $accountId, $cellPhone, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        }

        return $result;
    }

    public function resetPassword($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP,
            PARAMETER_USER_ACCOUNT,
            PARAMETER_ELI_VERIFICATION_TOKEN,
            PARAMETER_ELI_VERIFICATION_CODE,
            PARAMETER_ELI_NEW_PASSWORD);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $userAccount = $parameters[PARAMETER_USER_ACCOUNT];
        $newPassword = $parameters[PARAMETER_ELI_NEW_PASSWORD];

        $accountId = false;
        $isAccountExist = false;
        $errorCode = $this->EliAccount->checkExist($userAccount, $userAccount, $isAccountExist, $accountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Check account <%s> failed, error code<%d>.", $userAccount, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if(!$isAccountExist)
        {
            $result->setErrorCode(ERR_ELI_ACCOUNT_NOT_EXIST);
            $result->setMessage(sprintf("Account <%s> not exist, error code<%d>.", $userAccount, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result = $this->checkVerificationCode->checkVerificationCode($parameters);
        $errorCode = $result->getErrorCode();
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $errorCode = $this->EliAccount->setPassword($accountId, $newPassword);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Account <%s> reset password failed, error code<%d>.", $userAccount, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        return $result;
    }

    public function rebindCellPhone($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP,
            PARAMETER_ELI_CELL_PHONE,
            PARAMETER_ELI_NEW_CELL_PHONE);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];

        $eliAccountId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $cellPhone = $parameters[PARAMETER_ELI_CELL_PHONE];
        $newCellPhone = $parameters[PARAMETER_ELI_NEW_CELL_PHONE];

        $errorCode = $this->EliAccount->rebindCellPhone($eliAccountId, $cellPhone, $newCellPhone);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Account rebind cellphone failed, account <%s,%s,%s>, error code<%d>.", $eliAccountId, $cellPhone, $newCellPhone, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($eliAccountId));
        $result->setMessage("");
        return $result;
    }

    public function changePassword($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP,
            PARAMETER_ELI_PASSWORD,
            PARAMETER_ELI_NEW_PASSWORD);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];

        $eliAccountId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $password = $parameters[PARAMETER_ELI_PASSWORD];
        $newPassword = $parameters[PARAMETER_ELI_NEW_PASSWORD];

        $errorCode = $this->EliAccount->changePassword($eliAccountId, $password, $newPassword);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Change password failed, account <%s>, error code<%d>.", $eliAccountId, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($eliAccountId));
        $result->setMessage("");
        return $result;
    }

    public function login($parameters)
    {
        return $this->EliAccount->login($parameters);
    }

    /**
     * @param $parameters
     * @return CResult
     */
    public function logout($parameters)
    {
        return $this->EliAccount->logout($parameters);
    }

    /**
     * @param $parameters
     * @return CResult|int
     */
    public function improveAccountInformation($parameters)
    {
        return $this->EliAccount->improveAccountInformation($parameters);
    }

    /**
     * @param $parameters
     * @return CResult
     */
    public function createEliCampaign($parameters)
    {
        return $this->EliAccount->createCampaign($parameters);
    }

    /**
     * @param $parameters
     * @return CResult
     */
    public function getCampaignList($parameters)
    {
        return $this->EliAccount->getCampaignList($parameters);
    }

    /**
     * @param $parameters
     * @return CResult
     */
    public function updateCampaignConfigSpent($parameters)
    {
        return $this->EliCampaignConfigSpentRecord->updateCampaignConfigSpent($parameters);
    }

    public function getPublisherOwnerList($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $publisherOwnerList = array();
        $errorCode = $this->EliPublisherOwner->getPublisherOwnerList($publisherOwnerList);
        $result->setErrorCode($errorCode);
        $result->setData($publisherOwnerList);

        return $result;
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
    }
}