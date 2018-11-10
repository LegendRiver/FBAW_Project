<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-09-28
 * Time: 20:24
 */
class CEliVerificationCode extends CBaseObject
{
    /*
     *
     *  +-------------------+-------------+------+-----+---------+-------+
        | Field             | Type        | Null | Key | Default | Extra |
        +-------------------+-------------+------+-----+---------+-------+
        | ID                | varchar(40) | NO   | PRI | NULL    |       |
        | VERIFICATION_CODE | char(4)     | NO   |     | NULL    |       |
        | CELL_PHONE        | varchar(11) | NO   |     | NULL    |       |
        | SENDER_ID         | varchar(40) | NO   |     | NULL    |       |
        | EXPIRATION_TIME   | datetime    | NO   |     | NULL    |       |
        | AWS_MESSAGE_ID    | varchar(40) | NO   |     | NULL    |       |
        +-------------------+-------------+------+-----+---------+-------+

     */
    private static $TABLE_NAME = "T_ELI_VERIFICATION_CODE";
    private static $ID = "ID";
    private static $VERIFICATION_CODE = "VERIFICATION_CODE";
    private static $CELL_PHONE = "CELL_PHONE";
    private static $SENDER_ID = "SENDER_ID";
    private static $EXPIRATION_TIME = "EXPIRATION_TIME";
    private static $STATUS = "STATUS";
    private static $AWS_MESSAGE_ID = "AWS_MESSAGE_ID";

    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CVerificationCode";
        $this->TableName = self::$TABLE_NAME;
        parent::__construct($config, $log, $dbInterface);
    }

    public function sendVerificationCode($userId, $verificationCode, $cellPhone, $awsMessageId, $awsRequestId, &$verificationCodeToken)
    {
        $verificationCodeToken = CPublic::getGuid();

        $currentTime = date('Y-m-d H:i:s');
        $currentTimeObject = new DateTime($currentTime);
        $expirationTime = $currentTimeObject->add(new DateInterval('PT'. ELI_VERIFICATION_CODE_VALIDITY .'S'));

        $this->setFieldValue(self::$ID, $verificationCodeToken);
        $this->setFieldValue(self::$VERIFICATION_CODE, $verificationCode);
        $this->setFieldValue(self::$CELL_PHONE, $cellPhone);
        $this->setFieldValue(self::$SENDER_ID, $userId);
        $this->setFieldValue(self::$EXPIRATION_TIME, $expirationTime->format("Y-m-d H:i:s"));
        $this->setFieldValue(self::$AWS_MESSAGE_ID, $awsMessageId);
        $this->setFieldValue(self::$STATUS, SECURITY_CODE_STATUS_VALID);
        $insertRecordNumber = 0;
        return $this->addRecord($insertRecordNumber);
    }

    public function checkVerificationCode($verificationCode, $verificationCodeToken)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $verificationCodeToken);
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Load verification code from db failed, error code <%d>.", $errorCode));
            return $errorCode;
        }

        if(intval($this->Fields[self::$STATUS]->Value) != SECURITY_CODE_STATUS_VALID)
        {
            $errorCode = ERR_VERIFICATION_CODE_INVALID;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Verification code <%s> invalid, error code <%d>.", $verificationCode, $errorCode));
            return $errorCode;
        }

        if(strncmp($verificationCode, $this->Fields[self::$VERIFICATION_CODE]->Value, ELI_VERIFICATION_CODE_LENGTH) != 0)
        {
            $errorCode = ERR_VERIFICATION_CODE_INVALID;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Verification code <%s> invalid, error code <%d>.", $verificationCode, $errorCode));
            return $errorCode;
        }

        $recordNumber = 0;
        $currentTime = date('Y-m-d H:i:s');
        $currentTimeObject = new DateTime($currentTime);
        $expirationTime = new DateTime($this->Fields[self::$EXPIRATION_TIME]->Value);
        if($currentTimeObject > $expirationTime)
        {

            $this->setFieldValue(self::$STATUS, SECURITY_CODE_STATUS_EXPIRED);
            $errorCode = $this->updateRecord($recordNumber);
            if($errorCode != OK)
            {
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Update verification code <%s> status failed, error code <%d>.", $verificationCode, $errorCode));
                return $errorCode;
            }

            $errorCode = ERR_VERIFICATION_CODE_EXPIRED;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Verification code <%s> expired, error code <%d>.", $verificationCode, $errorCode));
            return $errorCode;
        }

        $this->setFieldValue(self::$STATUS, SECURITY_CODE_STATUS_USED);
        $errorCode = $this->updateRecord($recordNumber);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Update verification code <%s> status failed, error code <%d>.", $verificationCode, $errorCode));
            return $errorCode;
        }

        return OK;
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$VERIFICATION_CODE, STRING, "");
        $this->addField(self::$CELL_PHONE, STRING, "");
        $this->addField(self::$SENDER_ID, STRING, "");
        $this->addField(self::$EXPIRATION_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$STATUS, INTEGER, SECURITY_CODE_STATUS_INIT);
        $this->addField(self::$AWS_MESSAGE_ID, STRING, "");

    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
    }
}