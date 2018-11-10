<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-09-29
 * Time: 07:06
 */
class CSecurityManager extends  CBaseObject
{
    private static $NUMBERS = array(0,1,2,3,4,5,6,7,8,9);
    private $EliVerificationCode = null;
    private $EliAwsClient = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CSecurityManager";
        $this->TableName = "NONE_TABLE";
        $this->EliVerificationCode = new CEliVerificationCode($config, $log, $dbInterface);
        $this->EliAwsClient = new CEliAwsSNSClient($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);

        $this->addAllowAccessFunction("sendVerificationCode");
        $this->addAllowAccessFunction("checkVerificationCode");
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function sendVerificationCode($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(PARAMETER_CALL_TAG,
            PARAMETER_ELI_CELL_PHONE);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);
        $cellPhone = $parameters[PARAMETER_ELI_CELL_PHONE];
        $verificationCode = CPublic::getRandCode(self::$NUMBERS, ELI_VERIFICATION_CODE_LENGTH);
        $verificationCodeToken = false;
        $messageId = '';
        $requestId = '';
        $messageContent = sprintf(VERIFICATION_CODE_SMS_TEMPLATE, $verificationCode);
        if(ELI_VERIFICATION_CODE_DEBUG)
        {
            $errorCode = OK;
        }
        else
        {
            $errorCode = $this->EliAwsClient->sendSms($cellPhone, $messageContent, $messageId, $requestId);
        }
        
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Send verification code <%s,%s> failed, error code <%d>.",
                $cellPhone, $verificationCode, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }
        
        $errorCode = $this->EliVerificationCode->sendVerificationCode('SYSTEM', 
        $verificationCode, 
        $cellPhone, 
        $messageId,
        $requestId,
        $verificationCodeToken);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Send verification code <%s,%s,%s> failed, error code <%d>.",
                $verificationCodeToken, $cellPhone, $verificationCode, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if(ELI_VERIFICATION_CODE_DEBUG)
        {
            $result->setData(array($verificationCodeToken, $verificationCode));
        }
        else
        {
            $result->setData(array($verificationCodeToken));
        }

        return $result;
    }

    public function checkVerificationCode($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(PARAMETER_CALL_TAG,
            PARAMETER_ELI_VERIFICATION_TOKEN,
            PARAMETER_ELI_VERIFICATION_CODE);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);
        $verificationCode = $parameters[PARAMETER_ELI_VERIFICATION_CODE];
        $verificationCodeToken = $parameters[PARAMETER_ELI_VERIFICATION_TOKEN];
        $errorCode = $this->EliVerificationCode->checkVerificationCode( $verificationCode, $verificationCodeToken);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Verification code <%s,%s> invalid, error code <%d>.",
                $verificationCodeToken, $verificationCode, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array());
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