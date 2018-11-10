<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-08-18
 * Time: 15:37
 */
class CUser extends CBaseObject
{
    /*
     *  +------------------+--------------+------+-----+---------+-------+
        | Field            | Type         | Null | Key | Default | Extra |
        +------------------+--------------+------+-----+---------+-------+
        | ID               | varchar(40)  | NO   | PRI | NULL    |       |
        | NAME             | varchar(128) | NO   | UNI | NULL    |       |
        | PASSWORD         | varchar(256) | NO   |     | NULL    |       |
        | CELL_PHONE       | varchar(18)  | NO   | UNI | NULL    |       |
        | PHONE_NUMBER     | varchar(18)  | YES  |     | NULL    |       |
        | E_MAIL           | varchar(128) | NO   | UNI | NULL    |       |
        | QQ_NUMBER        | varchar(20)  | YES  |     | NULL    |       |
        | WECHAT_ID        | varchar(20)  | YES  |     | NULL    |       |
        | STATUS           | int(11)      | YES  |     | NULL    |       |
        | CREATE_TIME      | datetime     | YES  |     | NULL    |       |
        | LAST_MODIFY_TIME | datetime     | YES  |     | NULL    |       |
        +------------------+--------------+------+-----+---------+-------+
     */
    public static $TABLE_NAME = "T_USER_INFO";
    public static $ID = "ID";
    public static $NAME = "NAME";
    public static $PASSWORD = "PASSWORD";
    public static $CELL_PHONE = "CELL_PHONE";
    public static $PHONE_NUMBER = "PHONE_NUMBER";
    public static $E_MAIL = "E_MAIL";
    public static $QQ_NUMBER = "QQ_NUMBER";
    public static $WECHAT_ID = "WECHAT_ID";
    public static $STATUS = "STATUS";
    public static $CREATE_TIME = "CREATE_TIME";
    public static $LAST_MODIFY_TIME = "LAST_MODIFY_TIME";

    private $LoginRecord = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CUser";
        $this->TableName = self::$TABLE_NAME;
        $this->LoginRecord = new CLoginRecord($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function changePassword($eliAccountId, $password, $newPassword)
    {
        $errorCode = $this->checkPassword($eliAccountId, $password);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Account <%s> or password wrong.", $eliAccountId));
            return $errorCode;
        }

        return $this->setPassword($eliAccountId, $newPassword);
    }

    public function setPassword($eliAccountId, $password)
    {
        $updatedRecordNumber = 0;
        $dbParameters = array();
        $passwordParameter = new CDbParameter(self::$PASSWORD, sha1($password), STRING);
        array_push($dbParameters, $passwordParameter);

        $lastModifyTimeParameter = new CDbParameter(self::$LAST_MODIFY_TIME, date('Y-m-d H:i:s'), STRING);
        array_push($dbParameters, $lastModifyTimeParameter);

        $eliAccountIdParameter = new CDbParameter(self::$ID, $eliAccountId, STRING);
        array_push($dbParameters, $eliAccountIdParameter);

        $querySql = $this->createUpdatePasswordSql();
        $errorCode = $this->DbMySqlInterface->update($querySql, $dbParameters, $updatedRecordNumber);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Change password <%s> failed.", $eliAccountId));
            return $errorCode;
        }

        $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, sprintf("Account <%s> change password success.", $eliAccountId));

        return $errorCode;
    }

    public function rebindCellPhone($eliAccountId, $cellPhone, $newCellPhone)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $eliAccountId);
        $this->setPrimaryKey(self::$CELL_PHONE, $cellPhone);
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Account <%s> or cell phone <%s> is wrong.", $eliAccountId, $cellPhone));
            return $errorCode;
        }

        $updatedRecordNumber = 0;
        $dbParameters = array();

        $passwordParameter = new CDbParameter(self::$CELL_PHONE, $newCellPhone, STRING);
        array_push($dbParameters, $passwordParameter);

        $lastModifyTimeParameter = new CDbParameter(self::$LAST_MODIFY_TIME, date('Y-m-d H:i:s'), STRING);
        array_push($dbParameters, $lastModifyTimeParameter);

        $eliAccountIdParameter = new CDbParameter(self::$ID, $eliAccountId, STRING);
        array_push($dbParameters, $eliAccountIdParameter);

        $querySql = $this->createUpdateCellPhoneSql();
        $errorCode = $this->DbMySqlInterface->update($querySql, $dbParameters, $updatedRecordNumber);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Change password <%s> failed.", $eliAccountId));
            return $errorCode;
        }

        $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, sprintf("Account <%s,%s,%s> rebind cellphone success.", $eliAccountId, $cellPhone, $newCellPhone));

        return $errorCode;
    }

    private function createUpdateCellPhoneSql()
    {
        return sprintf($this->UPDATE_QUERY_TEMPLATE,
            $this->TableName,
            sprintf(" %s=?,%s=?", self::$CELL_PHONE, self::$LAST_MODIFY_TIME),
            sprintf("%s=?", self::$ID));
    }

    private function createUpdatePasswordSql()
    {
        return sprintf($this->UPDATE_QUERY_TEMPLATE,
            $this->TableName,
            sprintf(" %s=?,%s=?", self::$PASSWORD, self::$LAST_MODIFY_TIME),
            sprintf("%s=?", self::$ID));
    }

    private function checkPassword($eliAccountId, $password)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $eliAccountId);
        $this->setPrimaryKey(self::$PASSWORD, sha1($password));
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            return $errorCode;
        }

        return OK;
    }

    public function getCellPhone($eliAccountId, &$cellPhone)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $eliAccountId);
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            return $errorCode;
        }

        $cellPhone = $this->Fields[self::$CELL_PHONE]->Value;
        return $errorCode;
    }

    public function getUser($userId, &$userInfo)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $userId);
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            return $errorCode;
        }

        array_push($userInfo, $this->convertObject2Array());
        return $errorCode;
    }

    public function createUser($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            self::$NAME,
            self::$E_MAIL,
            self::$PASSWORD,
            self::$CELL_PHONE,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $name = $parameters[self::$NAME];
        $eMail = $parameters[self::$E_MAIL];
        $cellPhone = $parameters[self::$CELL_PHONE];
        $password = sha1(trim($parameters[self::$PASSWORD]));
        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $isAccountExist = false;
        $accountId = false;
        $errorCode = $this->checkExist($eMail, $cellPhone, $isAccountExist, $accountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if($isAccountExist)
        {
            $result->setErrorCode(ERR_USER_EXISTS);
            $result->setMessage(sprintf("User account <%s> exist, error code<%d>.", $eMail, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $currentTime = date('Y-m-d H:i:s');
        $userId = CPublic::getGuid();

        $this->setFieldValue(self::$ID, $userId);
        $this->setFieldValue(self::$E_MAIL, $eMail);
        $this->setFieldValue(self::$NAME, $name);
        $this->setFieldValue(self::$CELL_PHONE, $cellPhone);
        $this->setFieldValue(self::$PASSWORD, $password);
        $this->setFieldValue(self::$CREATE_TIME, $currentTime);
        $this->setFieldValue(self::$LAST_MODIFY_TIME, $currentTime);
        $this->setFieldValue(self::$STATUS, ELI_ACCOUNT_STATUS_WAIT_COMPLETE_INFORMATION);
        $insertRecordNumber = 0;
        $errorCode = $this->addRecord($insertRecordNumber);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("User <%s> register failed, error code<%d>.", $eMail, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $accessToken = CPublic::getGuid();
        $errorCode = $this->LoginRecord->login($userId, $clientIP, $accessToken);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("User <%s> auto login failed, error code<%d>.", $eMail, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($accessToken, ELI_ACCOUNT_STATUS_WAIT_COMPLETE_INFORMATION));
        return $result;
    }

    public function logout($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(PARAMETER_ACCESS_TOKEN, PARAMETER_CALL_TAG, PARAMETER_CLIENT_IP);
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
        $errorCode = $this->LoginRecord->checkUserToken($accessToken, true, $clientIP, $eliAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $errorCode));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array());
        $result->setErrorCode($errorCode);
        $result->setMessage(sprintf("User <%s> logout success.", $accessToken));
        $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        return $result;
    }

    public function login($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(PARAMETER_USER_ACCOUNT, self::$PASSWORD, PARAMETER_CALL_TAG, PARAMETER_CLIENT_IP);
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
            $result->setMessage(sprintf("User account or password wrong <%s, %d> failed.", $account, $result->getErrorCode()));
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
        $errorCode = $this->LoginRecord->login($accountId, $clientIP, $accessToken);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("User <%s> login failed.", $accountId));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array($accessToken, $this->Fields[self::$STATUS]->Value));

        return $result;
    }

    private function createLoginSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            sprintf("%s", self::$ID),
            sprintf(" %s WHERE (%s=?) AND (%s=?)",
                $this->TableName, self::$E_MAIL, self::$PASSWORD));
    }

    public function checkExist($eMail, $cellPhone, &$isAccountExist, &$accountId)
    {
        $querySql = $this->createCheckAccountSql();
        $recordRows = array();
        $dbParameters = array();
        $emailParameter = new CDbParameter(self::$E_MAIL, $eMail, STRING);
        array_push($dbParameters, $emailParameter);

        $cellPhoneParameter = new CDbParameter(self::$CELL_PHONE, $cellPhone, STRING);
        array_push($dbParameters, $cellPhoneParameter);


        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $isAccountExist = false;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Check user account <%s> failed.", $eMail));
            return $errorCode;
        }

        if(count($recordRows) > 0)
        {
            foreach ($recordRows as $recordRow)
            {
                $accountId = $recordRow[self::$ID];
            }

            $isAccountExist = true;
        }

        return $errorCode;
    }

    private function createCheckAccountSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            sprintf("%s", self::$ID),
            sprintf(" %s WHERE ((%s=?) OR (%s=?))",
                $this->TableName, self::$E_MAIL,self::$CELL_PHONE));
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
        $this->addField(self::$PASSWORD, STRING, "");
        $this->addField(self::$CELL_PHONE, STRING, "");
        $this->addField(self::$PHONE_NUMBER, STRING, "");
        $this->addField(self::$E_MAIL, STRING, "");
        $this->addField(self::$QQ_NUMBER, STRING, "");
        $this->addField(self::$WECHAT_ID, STRING, "");
        $this->addField(self::$STATUS, INTEGER, ELI_ACCOUNT_STATUS_INIT);
        $this->addField(self::$CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$LAST_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }
}
