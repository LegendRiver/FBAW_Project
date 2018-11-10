<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 9/23/16
 * Time: 12:25 PM
 */
class CEliSystemManager extends CBaseObject
{
    private $EliSystemUser = null;
    private $EliLoginRecord = null;
    private $EliRechargeRecord = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliSystemManager";
        $this->TableName = "NONE_TABLE";
        $this->EliSystemUser = new CEliSystemUser($config, $log, $dbInterface);
        $this->EliLoginRecord = new CEliLoginRecord($config, $log, $dbInterface);
        $this->EliRechargeRecord = new CEliRechargeRecord($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);

        $this->addAllowAccessFunction("createUser");
        $this->addAllowAccessFunction("editUser");
        $this->addAllowAccessFunction("deleteUser");
        $this->addAllowAccessFunction("logout");
        $this->addAllowAccessFunction("login");
        $this->addAllowAccessFunction("isUserTokenStillValid");
        $this->addAllowAccessFunction("recharge");
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function createUser($parameters)
    {
        return $this->EliSystemUser->createUser($parameters);
    }

    public function editUser($parameters)
    {
        return $this->EliSystemUser->editUser($parameters);
    }

    public function deleteUser($parameters)
    {
        return $this->EliSystemUser->deleteUser($parameters);
    }

    public function isUserTokenStillValid($parameters)
    {
        return $this->EliLoginRecord->isUserTokenStillValid($parameters);
    }

    public function login($parameters)
    {
        return $this->EliLoginRecord->login($parameters);
    }

    public function logout($parameters)
    {
        return $this->EliLoginRecord->logout($parameters);
    }

    public function recharge($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_ELI_ACCOUNT_ID,
            PARAMETER_RECHARGE_AMOUNT,
            PARAMETER_RECHARGE_PASSWORD,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $eliAccount = $parameters[PARAMETER_ELI_ACCOUNT_ID];
        $rechargePassword = $parameters[PARAMETER_RECHARGE_PASSWORD];
        $amount = $parameters[PARAMETER_RECHARGE_AMOUNT];

        if(!is_numeric($amount))
        {
            $errorCode = ERR_AMOUNT_FORMAT_INVALID;
            $result->setErrorCode($errorCode);
            $result->setMessage(sprintf("Amount format <%s> invalid, error code<%d>.", $amount, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $amount = intval($amount);
        if($amount <= 0)
        {
            $errorCode = ERR_ELI_ACCOUNT_RECHARGE_AMOUNT_INVALID;
            $result->setErrorCode($errorCode);
            $result->setMessage(sprintf("Recharge amount <%s> invalid,must more than zero, error code<%d>.", $amount, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $operatorId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $operatorId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $errorCode = $this->EliSystemUser->checkRechargePassword($operatorId, $rechargePassword);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Recharge operator <%s> password check failed, error code<%d>.", $operatorId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $rechargeToken = "";
        $errorCode = $this->EliRechargeRecord->recharge($operatorId, $eliAccount, $clientIP, $rechargeToken);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Recharge for <%s> failed, operator <%s>, error code<%d>.", $eliAccount, $operatorId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($rechargeToken, $amount));
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