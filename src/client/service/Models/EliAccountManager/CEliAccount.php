<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-08-18
 * Time: 15:37
 */
class CEliAccount extends CBaseObject
{
    /*
     *  +------------------------------+---------------+------+-----+---------+-------+
        | Field                        | Type          | Null | Key | Default | Extra |
        +------------------------------+---------------+------+-----+---------+-------+
        | ID                           | varchar(40)   | NO   | PRI | NULL    |       |
        | NAME                         | varchar(128)  | NO   | UNI | NULL    |       |
        | PASSWORD                     | varchar(256)  | NO   |     | NULL    |       |
        | CELL_PHONE                   | varchar(18)   | NO   | UNI | NULL    |       |
        | PHONE_NUMBER                 | varchar(18)   | YES  |     | NULL    |       |
        | E_MAIL                       | varchar(128)  | NO   | UNI | NULL    |       |
        | QQ_NUMBER                    | varchar(20)   | YES  |     | NULL    |       |
        | WECHAT_ID                    | varchar(20)   | YES  |     | NULL    |       |
        | ACCOUNT_TYPE                 | int(11)       | NO   |     | NULL    |       |
        | STATUS                       | int(11)       | NO   |     | NULL    |       |
        | BUSINESS_LICENSE             | varchar(1024) | YES  |     | NULL    |       |
        | ORGANIZATION_CODE            | varchar(40)   | NO   |     | NULL    |       |
        | TAX_REGISTRATION_CERTIFICATE | varchar(1024) | YES  |     | NULL    |       |
        | COMPANY_NAME                 | varchar(64)   | YES  |     | NULL    |       |
        | TRADE_LICENSE                | varchar(1024) | YES  |     | NULL    |       |
        | INDUSTRY_ID                  | varchar(40)   | YES  | MUL | NULL    |       |
        | BUDGET                       | decimal(12,2) | NO   |     | 0.00    |       |
        | SPENT                        | decimal(12,2) | NO   |     | 0.00    |       |
        | CREATE_TIME                  | datetime      | YES  |     | NULL    |       |
        | LAST_MODIFY_TIME             | datetime      | YES  |     | NULL    |       |
        | ELI_SESSION_ACCESS_TOKEN     | varchar(40)   | YES  |     | NULL    |       |
        | LOGIN_TIME                   | datetime      | YES  |     | NULL    |       |
        +------------------------------+---------------+------+-----+---------+-------+
     */
    public static $TABLE_NAME = "T_ELI_ACCOUNT";
    public static $ID = "ID";
    public static $NAME = "NAME";
    public static $PASSWORD = "PASSWORD";
    public static $CELL_PHONE = "CELL_PHONE";
    public static $PHONE_NUMBER = "PHONE_NUMBER";
    public static $E_MAIL = "E_MAIL";
    public static $QQ_NUMBER = "QQ_NUMBER";
    public static $WECHAT_ID = "WECHAT_ID";
    public static $ACCOUNT_TYPE = "ACCOUNT_TYPE";
    public static $STATUS = "STATUS";
    public static $BUSINESS_LICENSE = "BUSINESS_LICENSE";
    public static $ORGANIZATION_CODE = "ORGANIZATION_CODE";
    public static $TAX_REGISTRATION_CERTIFICATE = "TAX_REGISTRATION_CERTIFICATE";
    public static $COMPANY_NAME = "COMPANY_NAME";
    public static $COMPANY_ADDRESS = "COMPANY_ADDRESS";
    public static $TRADE_LICENSE = "TRADE_LICENSE";
    public static $INDUSTRY_ID = "INDUSTRY_ID";
    public static $BUDGET = "BUDGET";
    public static $SPENT = "SPENT";
    public static $CREATE_TIME = "CREATE_TIME";
    public static $LAST_MODIFY_TIME = "LAST_MODIFY_TIME";
    public static $CLIENT_IP = "CLIENT_IP";

    private $EliLoginRecord = null;
    private $EliCampaign = null;
    private $File = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliAccount";
        $this->TableName = self::$TABLE_NAME;
        $this->EliLoginRecord = new CEliLoginRecord($config, $log, $dbInterface);
        $this->EliCampaign = new CELiCampaign($config, $log, $dbInterface);
        $this->File = new CFile($config, $log, $dbInterface);

        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function getCampaignList($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $userAccessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $userAccountId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($userAccessToken, false, $clientIP, $userAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $userAccessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $data = array();
        $fields = array();
        $campaignList = array();
        $campaignNumber = 0;
        if($this->checkParameter(PARAMETER_START_DATE, $parameters, $result) &&
            $this->checkParameter(PARAMETER_END_DATE, $parameters, $result))
        {
            $startDate = DateTime::createFromFormat('Y-m-d', $parameters[PARAMETER_START_DATE]);
            if(!$startDate)
            {
                $result->setErrorCode(ERR_CONVERT_STR_TO_DATE);
                $result->setMessage(sprintf("Convert start date parameter <%s> to datetime failed", $parameters[PARAMETER_START_DATE]));
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
                return $result;
            }

            $endDate = DateTime::createFromFormat('Y-m-d', $parameters[PARAMETER_END_DATE]);
            if(!$endDate)
            {
                $result->setErrorCode(ERR_CONVERT_STR_TO_DATE);
                $result->setMessage(sprintf("Convert end date parameter <%s> to datetime failed", $parameters[PARAMETER_END_DATE]));
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
                return $result;
            }

            $errorCode = $this->EliCampaign->getCampaignListByDate($userAccountId, $startDate->format('Y-m-d'), $endDate->format('Y-m-d'), $fields, $campaignList, $campaignNumber);
            if($errorCode != OK)
            {
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("load campaign list failed, error code <%d>.", $errorCode));
            }
        }
        else
        {
            $errorCode = $this->EliCampaign->getCampaignList($userAccountId, $fields, $campaignList, $campaignNumber);
            if($errorCode != OK)
            {
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("load campaign list failed, error code <%d>.", $errorCode));
            }
        }

        $data[PARAMETER_ELI_FIELDS] = $fields;
        $data[PARAMETER_ELI_RECORDS] = $campaignList;
        $data[PARAMETER_ELI_RECORDS_NUMBER] = $campaignNumber;

        $campaignData = array();
        $campaignData[PARAMETER_ELI_FIELDS] = $this->EliCampaign->getFieldNames();
        $campaignData[PARAMETER_ELI_RECORDS] = $campaignList;
        $campaignData[PARAMETER_ELI_RECORDS_NUMBER] = count($campaignData[PARAMETER_ELI_RECORDS]);
        $result->setErrorCode($errorCode);
        $result->setData($data);
        $result->setMessage("");

        return $result;
    }

    public function createCampaign($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $userAccessToken = $parameters[PARAMETER_ACCESS_TOKEN];
        $userAccountId = false;
        $errorCode = $this->EliLoginRecord->checkUserToken($userAccessToken, false, $clientIP, $userAccountId);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $userAccessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $userAccountId);
        $errorCode = $this->load();
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Load eli account <%s> failed, error code<%d>.", $userAccountId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $eliAccountBudget = floatval($this->Fields[self::$BUDGET]->Value);
        if($eliAccountBudget <= 0.0)
        {
            $result->setErrorCode(ERR_ELI_ACCOUNT_INSUFFICIENT_BALANCE);
            $result->setMessage(sprintf("Account insufficient balance <%s,%.2f> failed, error code<%d>.", $userAccountId, $eliAccountBudget, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, sprintf("Account balance <%s, %.2f>", $userAccountId, $eliAccountBudget));

        $parameters[PARAMETER_ELI_ACCOUNT_ID] = $userAccountId;
        $parameters[PARAMETER_ELI_ACCOUNT_BALANCE] = $eliAccountBudget;

        return $this->EliCampaign->createCampaign($parameters, $this);
    }

    public function subBudget($accountId, $budget, &$updatedRecordNumber)
    {
        $dbParameters = array();

        $budgetParameter = new CDbParameter(self::$BUDGET, $budget, DOUBLE);
        array_push($dbParameters, $budgetParameter);

        $accountIdParameter = new CDbParameter(self::$ID, $accountId, STRING);
        array_push($dbParameters, $accountIdParameter);

        $querySql = $this->createSubBudgetSql();
        return $this->DbMySqlInterface->update($querySql, $dbParameters, $updatedRecordNumber);
    }

    private function createSubBudgetSql()
    {
        //$UPDATE_QUERY_TEMPLATE = "UPDATE %s SET %s WHERE %s";
        return sprintf($this->UPDATE_QUERY_TEMPLATE,
            $this->TableName,
            sprintf("%s=?", self::$BUDGET),
            sprintf("(%s=?)", self::$ID));
    }

    public function improveAccountInformation($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            self::$COMPANY_NAME,
            self::$COMPANY_ADDRESS,
            self::$INDUSTRY_ID,
            self::$ORGANIZATION_CODE,
            self::$TAX_REGISTRATION_CERTIFICATE,
            self::$TRADE_LICENSE,
            self::$BUSINESS_LICENSE,
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
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
            $result->setMessage(sprintf("Access token <%s> invalid, error code<%d>.", $accessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if(!$eliAccountId)
        {
            $result->setErrorCode(ERR_ELI_ACCOUNT_NOT_EXIST);
            $result->setMessage(sprintf("Not found eli account by access token <%s>, error code<%d>.", $accessToken, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $companyName = $parameters[self::$COMPANY_NAME];
        $companyAddress = $parameters[self::$COMPANY_ADDRESS];
        $industryId = $parameters[self::$INDUSTRY_ID];
        $organizationCode = $parameters[self::$ORGANIZATION_CODE];
        $taxRegistrationCertificate = $parameters[self::$TAX_REGISTRATION_CERTIFICATE];
        $tradeLicense = $parameters[self::$TRADE_LICENSE];
        $businessLicense = $parameters[self::$BUSINESS_LICENSE];

        $dbParameters = array();
        $companyNameParameter = new CDbParameter(self::$COMPANY_NAME, $companyName, STRING);
        array_push($dbParameters, $companyNameParameter);

        $companyAddressParameter = new CDbParameter(self::$COMPANY_ADDRESS, $companyAddress, STRING);
        array_push($dbParameters, $companyAddressParameter);

        $industryIdParameter = new CDbParameter(self::$INDUSTRY_ID, $industryId, STRING);
        array_push($dbParameters, $industryIdParameter);

        $organizationCodeParameter = new CDbParameter(self::$ORGANIZATION_CODE, $organizationCode, STRING);
        array_push($dbParameters, $organizationCodeParameter);

        $taxRegistrationCertificateParameter = new CDbParameter(self::$TAX_REGISTRATION_CERTIFICATE, $taxRegistrationCertificate, STRING);
        array_push($dbParameters, $taxRegistrationCertificateParameter);

        $tradeLicenseParameter = new CDbParameter(self::$TRADE_LICENSE, $tradeLicense, STRING);
        array_push($dbParameters, $tradeLicenseParameter);

        $businessLicenseParameter = new CDbParameter(self::$BUSINESS_LICENSE, $businessLicense, STRING);
        array_push($dbParameters, $businessLicenseParameter);

        $lastModifyTimeParameter = new CDbParameter(self::$LAST_MODIFY_TIME, date('Y-m-d H:i:s'), STRING);
        array_push($dbParameters, $lastModifyTimeParameter);

        $statusParameter = new CDbParameter(self::$STATUS, ELI_ACCOUNT_STATUS_WAIT_APPROVE_INFORMATION, INTEGER);
        array_push($dbParameters, $statusParameter);

        $eliAccountIdParameter = new CDbParameter(self::$ID, $eliAccountId, STRING);
        array_push($dbParameters, $eliAccountIdParameter);

        $updatedRecordNumber = 0;
        $querySql = $this->createUpdateInformationSql();
        $errorCode = $this->DbMySqlInterface->update($querySql, $dbParameters, $updatedRecordNumber);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage( sprintf("Update account information <%s> failed.", $eliAccountId));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData(array(ELI_ACCOUNT_STATUS_WAIT_APPROVE_INFORMATION));
        return $result;
    }

    private  function createUpdateInformationSql()
    {
        return sprintf($this->UPDATE_QUERY_TEMPLATE,
        $this->TableName,
        sprintf(" %s=?,%s=?,%s=?, %s=?,%s=?,%s=?, %s=?,%s=?,%s=?",
            self::$COMPANY_NAME, self::$COMPANY_ADDRESS, self::$INDUSTRY_ID,
            self::$ORGANIZATION_CODE, self::$TAX_REGISTRATION_CERTIFICATE, self::$TRADE_LICENSE,
            self::$BUSINESS_LICENSE, self::$LAST_MODIFY_TIME, self::$STATUS),
            sprintf("%s=?", self::$ID));
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

    public function getEliAccountCellPhone($eliAccountId, &$cellPhone)
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

    public function getEliAccount($eliAccountId, &$eliAccountValue)
    {
        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $eliAccountId);
        $errorCode = $this->load();
        if($errorCode != OK)
        {
            return $errorCode;
        }

        $eliAccount = $this->convertObject2Array();

        $fileInfoFields = array();
        $fieldInfoArray = array();
        $errorCode = $this->File->getAttachmentByID($this->Fields[self::$BUSINESS_LICENSE]->Value, ATTACHMENT_UPLOAD_SUCCESS, $fileInfoFields, $fieldInfoArray);
        if($errorCode == OK)
        {
            array_push($eliAccount, $fieldInfoArray[0]);
            array_push($eliAccount, $fieldInfoArray[1]);
        }
        else
        {
            array_push($eliAccount, "");
            array_push($eliAccount, "");
        }

        $eliAccountFields = $this->getFieldNames();
        array_push($eliAccountFields, $fileInfoFields[0]);
        array_push($eliAccountFields, $fileInfoFields[1]);

        $eliAccountValue[PARAMETER_ELI_FIELDS] = $eliAccountFields;
        $eliAccountValue[PARAMETER_ELI_RECORDS] = array();
        array_push($eliAccountValue[PARAMETER_ELI_RECORDS], $eliAccount);
        $eliAccountValue[PARAMETER_ELI_RECORDS_NUMBER] = count($eliAccountValue[PARAMETER_ELI_RECORDS]);
        return $errorCode;
    }

    public function createEliAccount($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            self::$E_MAIL,
            self::$PASSWORD,
            self::$CELL_PHONE,
            self::$ACCOUNT_TYPE,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP);
        if (!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[PARAMETER_CALL_TAG];
        $result->addResultField(PARAMETER_CALL_TAG, $callTag);

        $eMail = $parameters[self::$E_MAIL];
        $cellPhone = $parameters[self::$CELL_PHONE];
        $password = sha1(trim($parameters[self::$PASSWORD]));
        $clientIP = $parameters[PARAMETER_CLIENT_IP];
        $accountType = $parameters[self::$ACCOUNT_TYPE];
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
        $this->setFieldValue(self::$NAME, $eMail);
        $this->setFieldValue(self::$CELL_PHONE, $cellPhone);
        $this->setFieldValue(self::$PASSWORD, $password);
        $this->setFieldValue(self::$ACCOUNT_TYPE, $accountType);
        $this->setFieldValue(self::$CREATE_TIME, $currentTime);
        $this->setFieldValue(self::$LAST_MODIFY_TIME, $currentTime);
        $this->setFieldValue(self::$STATUS, ELI_ACCOUNT_STATUS_WAIT_COMPLETE_INFORMATION);
        $this->setFieldValue(self::$CLIENT_IP, $clientIP);
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
        $errorCode = $this->EliLoginRecord->login($userId, $clientIP, $accessToken);
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

    public function recharge($accountId, $amount)
    {
        $updatedRecordNumber = 0;
        $dbParameters = array();
        $amountParameter = new CDbParameter(self::$BUDGET, $amount, INTEGER);
        array_push($dbParameters, $amountParameter);

        $accountIdParameter = new CDbParameter(self::$ID, $accountId, STRING);
        array_push($dbParameters, $accountIdParameter);

        $querySql = $this->createRechargeSql();
        $errorCode = $this->DbMySqlInterface->update($querySql, $dbParameters, $updatedRecordNumber);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Recharge <%s> failed.", $accountId));
            return $errorCode;
        }

        return $errorCode;
    }

    private function createRechargeSql()
    {
        return sprintf($this->UPDATE_QUERY_TEMPLATE,
            $this->TableName,
            sprintf(" %s=? ", self::$BUDGET),
                sprintf(" (%s=?)", self::$ID));
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
        $errorCode = $this->EliLoginRecord->checkUserToken($accessToken, true, $clientIP, $eliAccountId);
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
        $errorCode = $this->EliLoginRecord->login($accountId, $clientIP, $accessToken);
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
            sprintf(" %s WHERE ((%s=?) OR (%s=?)) AND (%s=?)",
                $this->TableName, self::$E_MAIL,self::$CELL_PHONE, self::$PASSWORD));
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
        $this->addField(self::$ACCOUNT_TYPE, INTEGER, ELI_ACCOUNT_TYPE_COMPANY);
        $this->addField(self::$STATUS, INTEGER, ELI_ACCOUNT_STATUS_INIT);
        $this->addField(self::$BUSINESS_LICENSE, STRING, "");
        $this->addField(self::$ORGANIZATION_CODE, STRING, "");
        $this->addField(self::$TAX_REGISTRATION_CERTIFICATE, STRING, "");
        $this->addField(self::$COMPANY_NAME, STRING, "");
        $this->addField(self::$COMPANY_ADDRESS, STRING, "");
        $this->addField(self::$TRADE_LICENSE, STRING, "");
        $this->addField(self::$INDUSTRY_ID, STRING, "");
        $this->addField(self::$BUDGET, DOUBLE, 0.0);
        $this->addField(self::$SPENT, DOUBLE, 0.0);
        $this->addField(self::$CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$LAST_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$CLIENT_IP, STRING, "");
    }
}
