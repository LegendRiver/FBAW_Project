<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-08-26
 * Time: 09:22
 */
class CEliLoginRecord extends CBaseObject
{
    public static $TABLE_NAME = "T_ELI_LOGIN_RECORD";
    public static $ID = "ID";
    public static $USER_ID = "USER_ID";
    public static $LOGIN_TIME = "LOGIN_TIME";
    public static $LOGOUT_TIME = "LOGOUT_TIME";
    public static $STATUS = "STATUS";
    public static $LONGITUDE = "LONGITUDE";
    public static $LATITUDE = "LATITUDE";
    public static $CLIENT_IP = "CLIENT_IP";

    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliLoginRecord";
        $this->TableName = self::$TABLE_NAME;
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function login($accountId, $clientIP, $accessToken)
    {
        $currentTime = date('Y-m-d H:i:s');
        $currentTimeObject = new DateTime($currentTime);
        $logoutTime = $currentTimeObject->add(new DateInterval('PT'. USER_LOGIN_VALIDITY .'S'));
        $this->setFieldValue(self::$ID, $accessToken);
        $this->setFieldValue(self::$USER_ID, $accountId);
        $this->setFieldValue(self::$CLIENT_IP, $clientIP);
        $this->setFieldValue(self::$LOGIN_TIME, $currentTime);
        $this->setFieldValue(self::$LOGOUT_TIME, $logoutTime->format('Y-m-d H:i:s'));
        $this->setFieldValue(self::$STATUS, USER_ACCESS_TOKEN_STATUS_VALID);
        $this->setFieldValue(self::$LONGITUDE, 0);
        $this->setFieldValue(self::$LATITUDE, 0);
        $insertRecordNumber = 0;
        return $this->addRecord($insertRecordNumber);
    }

    public function isUserTokenStillValid($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(PARAMETER_ACCESS_TOKEN, PARAMETER_CALL_TAG);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $clientIp = $parameters[PARAMETER_CLIENT_IP];
        $userAccessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $userId = false;
        $errorCode = $this->checkUserToken($userAccessToken, false, $clientIp, $userId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setErrorCode($errorCode);
            $result->setMessage(sprintf("User token <%s> invalid, error code<%d>.", $userAccessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($userId, $userAccessToken));
        $result->setMessage("");

        return $result;
    }

    public function checkUserToken($userAccessToken, $isLogout, $clientIP, &$userAccountId)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $userAccessToken);
        $recordNumber = 0;
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Access token <%s> invalid.", $userAccessToken));
            return $errorCode;
        }

        $userLoginDateTime = false;
        $this->getFieldValue(self::$LOGIN_TIME, $userLoginDateTime);
        $loginTime = new DateTime($userLoginDateTime);
        $currentTime = new DateTime(date('Y-m-d H:i:s'));
        $seconds = ($currentTime->getTimestamp() - $loginTime->getTimestamp());

        if($seconds >= USER_LOGIN_VALIDITY)
        {
            $this->setFieldValue(self::$STATUS, USER_ACCESS_TOKEN_STATUS_EXPIRED);
            $this->setFieldValue(self::$LOGOUT_TIME, $currentTime->format('Y-m-d H:i:s'));
            $this->setFieldValue(self::$CLIENT_IP, $clientIP);

            $errorCode = $this->updateRecord($recordNumber);
            if($errorCode != OK)
            {
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Change access token <%s> status failed, error code <%d>.", $userAccessToken, $errorCode));
                return $errorCode;
            }

            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Access token <%s> expired.", $userAccessToken));
            return ERR_USER_LOGIN_EXPIRED;
        }

        $userLoginStatus = USER_ACCESS_TOKEN_STATUS_INVALID;
        $this->getFieldValue(self::$STATUS, $userLoginStatus);
        if($userLoginStatus == USER_ACCESS_TOKEN_STATUS_INVALID)
        {
            $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, "User already logout.");
            return ERR_USER_ALREADY_LOGOUT;
        }

        if($userLoginStatus == USER_ACCESS_TOKEN_STATUS_EXPIRED)
        {
            $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, "Access token already expired.");
            return ERR_USER_LOGIN_EXPIRED;
        }

        if($isLogout)
        {
            $this->setFieldValue(self::$STATUS, USER_ACCESS_TOKEN_STATUS_INVALID);
            $this->setFieldValue(self::$LOGOUT_TIME, $currentTime->format('Y-m-d H:i:s'));
            $this->setFieldValue(self::$CLIENT_IP, $clientIP);
            $errorCode = $this->updateRecord($recordNumber);
            if($errorCode != OK)
            {
                return ERR_USER_LOGOUT_FAILED;
            }
        }

        $this->getFieldValue(self::$USER_ID, $userAccountId);

        return OK;
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$USER_ID, STRING, "");
        $this->addField(self::$LOGIN_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$LOGOUT_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$STATUS, INTEGER, USER_ACCESS_TOKEN_STATUS_INVALID);
        $this->addField(self::$LONGITUDE, INTEGER, 0);
        $this->addField(self::$LATITUDE, INTEGER, 0);
        $this->addField(self::$CLIENT_IP, STRING, "");
    }
}