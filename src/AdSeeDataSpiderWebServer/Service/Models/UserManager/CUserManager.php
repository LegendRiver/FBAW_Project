<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 11:32
 */
class CUserManager extends CBaseObject
{
    private $User = null;
    private $LoginRecord = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CUserManager";
        $this->TableName = "NONE_TABLE";
        $this->User = new CUser($config, $log, $dbInterface);
        $this->LoginRecord = new CLoginRecord($config, $log, $dbInterface);

        parent::__construct($config, $log, $dbInterface);
        $this->addAllowAccessFunction("createUser");
        $this->addAllowAccessFunction("getUser");
        $this->addAllowAccessFunction("login");
        $this->addAllowAccessFunction("logout");
        $this->addAllowAccessFunction("changePassword");
        $this->addAllowAccessFunction("resetPassword");
        $this->addAllowAccessFunction("rebindCellPhone");
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function createUser($parameters)
    {
        return $this->User->createUser($parameters);
    }

    public function getUser($parameters)
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

        $userId = false;
        $errorCode = $this->LoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $userInfo = array();
        $errorCode = $this->User->getUser($userId, $userInfo);
        $result->setErrorCode($errorCode);
        $result->setData($userInfo);

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
        $errorCode = $this->User->checkExist($userAccount, $userAccount, $isAccountExist, $accountId);
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

        $errorCode = $this->User->setPassword($accountId, $newPassword);
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
        $errorCode = $this->LoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $cellPhone = $parameters[PARAMETER_ELI_CELL_PHONE];
        $newCellPhone = $parameters[PARAMETER_ELI_NEW_CELL_PHONE];

        $errorCode = $this->User->rebindCellPhone($eliAccountId, $cellPhone, $newCellPhone);
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
        $errorCode = $this->LoginRecord->checkUserToken($accessToken, false, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $password = $parameters[PARAMETER_ELI_PASSWORD];
        $newPassword = $parameters[PARAMETER_ELI_NEW_PASSWORD];

        $errorCode = $this->User->changePassword($eliAccountId, $password, $newPassword);
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
        return $this->User->login($parameters);
    }

    /**
     * @param $parameters
     * @return CResult
     */
    public function logout($parameters)
    {
        return $this->User->logout($parameters);
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