<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-08-26
 * Time: 16:22
 */
class CEliSystemUser extends CBaseObject
{
    /*
     *  +------------------+--------------+------+-----+---------+-------+
        | Field            | Type         | Null | Key | Default | Extra |
        +------------------+--------------+------+-----+---------+-------+
        | ID               | varchar(40)  | NO   | PRI | NULL    |       |
        | NAME             | varchar(32)  | YES  |     | NULL    |       |
        | ACCOUNT          | varchar(64)  | NO   | UNI | NULL    |       |
        | PASSWORD         | varchar(256) | NO   |     | NULL    |       |
        | CELL_PHONE       | varchar(18)  | YES  |     | NULL    |       |
        | STATUS           | int(11)      | YES  |     | NULL    |       |
        | E_MAIL           | varchar(256) | YES  |     | NULL    |       |
        | CREATE_TIME      | datetime     | YES  |     | NULL    |       |
        | LAST_MODIFY_TIME | datetime     | YES  |     | NULL    |       |
        +------------------+--------------+------+-----+---------+-------+
     */
    public static $TABLE_NAME = "T_ELI_SYSTEM_USER";
    public static $ID = "ID";
    public static $NAME = "NAME";
    public static $ACCOUNT = "ACCOUNT";
    public static $PASSWORD = "PASSWORD";
    public static $CELL_PHONE = "CELL_PHONE";
    public static $STATUS = "STATUS";
    public static $E_MAIL = "E_MAIL";
    public static $CREATE_TIME = "CREATE_TIME";
    public static $LAST_MODIFY_TIME = "LAST_MODIFY_TIME";
    public static $IS_CAN_RECHARGE = "IS_CAN_RECHARGE";
    public static $RECHARGE_PASSWORD = "RECHARGE_PASSWORD";

    private $EliLoginRecord = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliSystemUser";
        $this->TableName = self::$TABLE_NAME;
        $this->EliLoginRecord = new CEliLoginRecord($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function login($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(PARAMETER_USER_ACCOUNT,
            self::$PASSWORD,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $account = $parameters[PARAMETER_USER_ACCOUNT];
        $userPassword = sha1($parameters[self::$PASSWORD]);
        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $recordRows = array();
        $dbParameters = array();
        $emailParameter = new CDbParameter(self::$E_MAIL, $account, STRING);
        array_push($dbParameters, $emailParameter);

        $cellPhoneParameter = new CDbParameter(self::$CELL_PHONE, $account, STRING);
        array_push($dbParameters, $cellPhoneParameter);

        $passwordParameter = new CDbParameter(self::$PASSWORD, $userPassword, STRING);
        array_push($dbParameters, $passwordParameter);

        $querySql = $this->createLoginSql();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Check user account <%s> failed.", $account));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if(count($recordRows) == 0)
        {
            $result->setErrorCode(ERR_USER_ACCOUNT_OR_PASSWORD_INVALID);
            $result->setMessage(sprintf("User account or password wrong <%s> failed.", $account));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $accountId = null;
        foreach($recordRows as $row)
        {
            $accountId = $row[self::$ID];
        }

        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $accountId);
        $errorCode = $this->load();
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("User <%s> not exits or load from db failed. error code<%d>.", $accountId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $accessToken = CPublic::getGuid();
        $errorCode = $this->EliLoginRecord->login($accountId, $clientIP, $accessToken);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("User <%s> login failed.", $accountId));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($accessToken));

        return $result;
    }

    private function createLoginSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            sprintf("%s", self::$ID),
            sprintf(" %s WHERE ((%s=?) OR (%s=?)) AND (%s=?)",
                $this->TableName, self::$E_MAIL,self::$CELL_PHONE, self::$PASSWORD));
    }

    public function deleteUser($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            self::$ID,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);
        $operatorUserId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $operatorUserId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("User token <%s> invalid, error code<%d>.", $accessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $userId = $parameters[self::$ID];
        $currentTime = date('Y-m-d H:i:s');
        $this->setPrimaryKey(self::$ID, $userId);
        $this->setFieldValue(self::$STATUS, SYSTEM_USER_DELETED);
        $this->setFieldValue(self::$LAST_MODIFY_TIME, $currentTime);
        $recordNumber = 0;
        $errorCode = $this->updateRecord($recordNumber);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Delete user <%s> failed, error code<%d>.", $parameters[self::$ACCOUNT], $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($userId));
        return $result;
    }

    public function createUser($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            self::$NAME,
            self::$ACCOUNT,
            self::$PASSWORD,
            self::$CELL_PHONE,
            self::$E_MAIL,
            self::$IS_CAN_RECHARGE,
            self::$RECHARGE_PASSWORD,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);
        $operatorUserId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $operatorUserId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("User token <%s> invalid, error code<%d>.", $accessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $account = $parameters[self::$ACCOUNT];
        $cellPhone = $parameters[self::$CELL_PHONE];
        $eMail = $parameters[self::$E_MAIL];
        $checkUserAccountParameters = array();
        $checkUserAccountParameters[self::$ACCOUNT] = $account;
        $checkUserAccountParameters[self::$CELL_PHONE] = $cellPhone;
        $checkUserAccountParameters[self::$E_MAIL] = $eMail;
        $isAccountExist = true;
        $accountId = false;
        $errorCode = $this->checkUserInfo($checkUserAccountParameters, $isAccountExist, $accountId);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Check user account information <%s> failed, error code<%d>.", $account, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if($isAccountExist)
        {
            $result->setErrorCode(ERR_USER_EXISTS);
            $result->setMessage(sprintf("User account <%s> exist, error code<%d>.", $account, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $userId = CPublic::getGuid();
        $currentTime = date('Y-m-d H:i:s');
        $this->setFieldValue(self::$ID, $userId);
        $this->setFieldValue(self::$NAME, $parameters[self::$NAME]);
        $this->setFieldValue(self::$ACCOUNT, $account);
        $this->setFieldValue(self::$PASSWORD, sha1($parameters[self::$PASSWORD]));
        $this->setFieldValue(self::$CELL_PHONE, $cellPhone);
        $this->setFieldValue(self::$STATUS, SYSTEM_USER_NORMAL);
        $this->setFieldValue(self::$E_MAIL, $eMail);
        $this->setFieldValue(self::$IS_CAN_RECHARGE, $parameters[self::$IS_CAN_RECHARGE]);
        $this->setFieldValue(self::$RECHARGE_PASSWORD, sha1($parameters[self::$RECHARGE_PASSWORD]));
        $this->setFieldValue(self::$CREATE_TIME, $currentTime);
        $this->setFieldValue(self::$LAST_MODIFY_TIME, $currentTime);
        $recordNumber = 0;
        $errorCode = $this->addRecord($recordNumber);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Create user <%s> failed, error code<%d>.", $parameters[self::$ACCOUNT], $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($userId));
        return $result;
    }

    public function editUser($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            self::$ID,
            self::$NAME,
            self::$ACCOUNT,
            self::$PASSWORD,
            self::$CELL_PHONE,
            self::$E_MAIL,
            self::$IS_CAN_RECHARGE,
            self::$RECHARGE_PASSWORD,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,$result->getMessage());
            return $result;
        }

        $accessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);
        $operatorUserId = false;

        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, false, $clientIP, $operatorUserId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("User token <%s> invalid, error code<%d>.", $accessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $userId = $parameters[self::$ID];
        $account = $parameters[self::$ACCOUNT];
        $cellPhone = $parameters[self::$CELL_PHONE];
        $eMail = $parameters[self::$E_MAIL];

        $checkUserAccountParameters = array();
        $checkUserAccountParameters[self::$ACCOUNT] = $account;
        $checkUserAccountParameters[self::$CELL_PHONE] = $cellPhone;
        $checkUserAccountParameters[self::$E_MAIL] = $eMail;
        $isAccountExist = true;
        $accountId = false;
        $errorCode = $this->checkUserInfo($checkUserAccountParameters, $isAccountExist, $accountId);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Check user account information <%s> failed, error code<%d>.", $account, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if($isAccountExist && ($userId !== $accountId))
        {
            $result->setErrorCode(ERR_USER_EXISTS);
            $result->setMessage(sprintf("User account information <%s> exist, user Id <%s>, exist user id <%s>, error code<%d>.", $account, $userId, $accountId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $currentTime = date('Y-m-d H:i:s');
        $this->setPrimaryKey(self::$ID, $userId);

        $errorCode = $this->load();
        if($errorCode != OK)
        {
            $result->setErrorCode(ERR_USER_EXISTS);
            $result->setMessage(sprintf("User account <%s> not exist, user Id <%s>, error code<%d>.", $userId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $this->setFieldValue(self::$NAME, $parameters[self::$NAME]);
        $this->setFieldValue(self::$ACCOUNT, $account);
        $this->setFieldValue(self::$PASSWORD, sha1($parameters[self::$PASSWORD]));
        $this->setFieldValue(self::$CELL_PHONE, $cellPhone);
        $this->setFieldValue(self::$STATUS, SYSTEM_USER_NORMAL);
        $this->setFieldValue(self::$E_MAIL, $eMail);
        $this->setFieldValue(self::$IS_CAN_RECHARGE, $parameters[self::$IS_CAN_RECHARGE]);
        $this->setFieldValue(self::$RECHARGE_PASSWORD, sha1($parameters[self::$RECHARGE_PASSWORD]));
        $this->setFieldValue(self::$LAST_MODIFY_TIME, $currentTime);
        $recordNumber = 0;
        $errorCode = $this->updateRecord($recordNumber);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Edit user <%s> failed, error code<%d>.", $parameters[self::$ACCOUNT], $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($userId));
        return $result;
    }

    public function checkRechargePassword($operatorId, $rechargePassword)
    {
        $dbParameters = array();
        $userIdParameter = new CDbParameter(self::$ID, $operatorId, STRING);
        array_push($dbParameters, $userIdParameter);

        $rechargePasswordParameter = new CDbParameter(self::$RECHARGE_PASSWORD, $rechargePassword, STRING);
        array_push($dbParameters, $rechargePasswordParameter);

        $querySql = $this->createCheckRechargePassword();
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Operator <%s> not allowed to recharge for eli account.", $operatorId));
            return $errorCode;
        }

        return $errorCode;
    }

    private function checkUserInfo($checkUserAccountParameters, &$isAccountExist, &$accountId)
    {
        $whereParts = array();
        $dbParameters = array();
        foreach($checkUserAccountParameters as $key=>$parameter)
        {
            $dbParameter = new CDbParameter($key, $parameter, $this->Fields[$key]->Type);
            array_push($dbParameters, $dbParameter);
            array_push($whereParts, sprintf("%s=?", $key));
        }

        $querySql = sprintf($this->SELECT_QUERY_TEMPLATE,
            sprintf("%s", self::$ID),
            sprintf(" %s WHERE (%s)",
                $this->TableName,
                implode(" OR ", $whereParts)));
        $recordRows = array();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $isAccountExist = true;
            $accountId = false;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Check user account information <%s> failed.", $account));
            return $errorCode;
        }

        $recordNumber = count($recordRows);
        $isAccountExist = ($recordNumber > 0?true:false);
        if($recordNumber > 0)
        {
            $accountId =$recordRows[0][self::$ID];
        }

        return $errorCode;
    }

    private function createCheckRechargePassword()
    {
        //$SELECT_QUERY_TEMPLATE = "SELECT %s FROM %s";
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            sprintf("%s", self::$ID),
            sprintf(" %s WHERE ((%s=1) AND (%s=?) AND (%s=?))",
                $this->TableName,
                self::$IS_CAN_RECHARGE,
                self::$ID,
                self::$RECHARGE_PASSWORD));
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$NAME, STRING, "");
        $this->addField(self::$ACCOUNT, STRING, "");
        $this->addField(self::$PASSWORD, STRING, sha1("123456"));
        $this->addField(self::$CELL_PHONE, INTEGER, "");
        $this->addField(self::$STATUS, INTEGER, SYSTEM_USER_NORMAL);
        $this->addField(self::$E_MAIL, INTEGER, "");
        $this->addField(self::$CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$LAST_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$IS_CAN_RECHARGE, INTEGER, 0);
        $this->addField(self::$RECHARGE_PASSWORD, STRING, "");
    }
}