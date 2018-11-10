<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-08-29
 * Time: 08:55
 */

class CELiCampaign extends CBaseObject
{
    /*
     *  +------------------+---------------+------+-----+---------+-------+
        | Field            | Type          | Null | Key | Default | Extra |
        +------------------+---------------+------+-----+---------+-------+
        | ID               | varchar(40)   | NO   | PRI | NULL    |       |
        | ELI_ACCOUNT_ID   | varchar(40)   | NO   | MUL | NULL    |       |
        | NAME             | varchar(128)  | NO   |     | NULL    |       |
        | CAMPAIGN_TYPE    | int(11)       | NO   |     | 0       |       |
        | URL              | varchar(1024) | NO   |     | NULL    |       |
        | TITLE            | varchar(128)  | NO   |     | NULL    |       |
        | DESCRIPTION      | varchar(256)  | YES  |     | NULL    |       |
        | IMAGE_LIST       | varchar(512)  | YES  |     | NULL    |       |
        | SCHEDULE_START   | datetime      | NO   |     | NULL    |       |
        | SCHEDULE_END     | datetime      | NO   |     | NULL    |       |
        | TIME_START       | datetime      | NO   |     | NULL    |       |
        | TIME_END         | datetime      | NO   |     | NULL    |       |
        | AUDIENCE         | text          | NO   |     | NULL    |       |
        | STATUS           | int(11)       | NO   |     | NULL    |       |
        | BUDGET           | decimal(12,2) | NO   |     | 0.00    |       |
        | SPENT            | decimal(12,2) | NO   |     | NULL    |       |
        | DELIVERY_TYPE    | int(11)       | NO   |     | NULL    |       |
        | KEYWORD          | text          | YES  |     | NULL    |       |
        | MATCH_TYPE       | int(11)       | YES  |     | NULL    |       |
        | CREATE_TIME      | datetime      | YES  |     | NULL    |       |
        | LAST_MODIFY_TIME | datetime      | YES  |     | NULL    |       |
        +------------------+---------------+------+-----+---------+-------+
     */

    public static $TABLE_NAME = "T_ELI_CAMPAIGN";
    public static $ID = "ID";
    public static $ELI_ACCOUNT_ID = "ELI_ACCOUNT_ID";
    public static $NAME = "NAME";
    public static $CAMPAIGN_TYPE = "CAMPAIGN_TYPE";
    public static $URL = "URL";
    public static $TITLE = "TITLE";
    public static $DESCRIPTION = "DESCRIPTION";
    public static $IMAGE_LIST = "IMAGE_LIST";
    public static $SCHEDULE_START = "SCHEDULE_START";
    public static $SCHEDULE_END = "SCHEDULE_END";
    public static $TIME_START = "TIME_START";
    public static $TIME_END = "TIME_END";
    public static $AUDIENCE = "AUDIENCE";
    public static $STATUS = "STATUS";
    public static $BUDGET = "BUDGET";
    public static $SPENT = "SPENT";
    public static $DELIVERY_TYPE = "DELIVERY_TYPE";
    public static $KEYWORD = "KEYWORD";
    public static $MATCH_TYPE = "MATCH_TYPE";
    public static $CREATE_TIME = "CREATE_TIME";
    public static $LAST_MODIFY_TIME = "LAST_MODIFY_TIME";

    private static $PARAMETER_AUDIENCE_COUNTRIES = "COUNTRIES";
    private static $PARAMETER_AUDIENCE_AGE = "AGE";
    private static $PARAMETER_AUDIENCE_GENDER = "GENDER";

    private static $PARAMETER_CONFIG_LIST = "PUBLISHER_LIST";

    private $EliLoginRecord = null;
    private $EliCampaignConfig = null;
    private $EliPublisherConfigSpentRecord = null;
    private $EliAudience = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CELiCampaign";
        $this->TableName = self::$TABLE_NAME;
        $this->EliLoginRecord = new CEliLoginRecord($config, $log, $dbInterface);
        $this->EliCampaignConfig = new CEliCampaignConfig($config, $log, $dbInterface);
        $this->EliPublisherConfigSpentRecord = new CEliCampaignConfigSpentRecord($config, $log, $dbInterface);
        $this->EliAudience = new CEliAudience($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function getCampaignListByDate($eliAccountId, $startDate, $endDate, &$fields, &$campaignList, &$campaignNumber)
    {
        $dbParameters = array();
        $userAccountParameter = new CDbParameter(self::$ELI_ACCOUNT_ID, $eliAccountId, STRING);
        array_push($dbParameters, $userAccountParameter);

        $recordRows = array();
        $querySql = $this->createGetCampaignSql();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $campaignNumber = 0;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Load campaign <%s> failed.", $eliAccountId));
            unset($recordRows);
            return $errorCode;
        }

        $fields['CAMPAIGN'] = $this->getFieldNames();
        $fields['CAMPAIGN_CONFIG'] = $this->EliCampaignConfig->getFieldNames();
        array_push($fields['CAMPAIGN_CONFIG'], "ELI_PUBLISHER_NAME");
        $fields['CAMPAIGN_CONFIG_SPENT'] = $this->EliPublisherConfigSpentRecord->getFieldNames();

        foreach ($recordRows as $recordRow)
        {
            $campaignId = $recordRow[self::$ID];
            $publisherList = array();
            $this->EliCampaignConfig->getEliCampaignConfigList($campaignId, $publisherList, $startDate, $endDate);
            $campaign = array_values($recordRow);
            array_push($campaign, $publisherList);

            array_push($campaignList, $campaign);

            $campaignNumber+=1;
        }

        unset($recordRows);
        return $errorCode;
    }

    public function getCampaignList($eliAccountId, &$fields, &$campaignList, &$campaignNumber)
    {
        $dbParameters = array();
        $userAccountParameter = new CDbParameter(self::$ELI_ACCOUNT_ID, $eliAccountId, STRING);
        array_push($dbParameters, $userAccountParameter);

        $recordRows = array();
        $querySql = $this->createGetCampaignSql();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $campaignNumber = 0;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Load campaign <%s> failed.", $eliAccountId));
            unset($recordRows);
            return $errorCode;
        }

        $fields['CAMPAIGN'] = $this->getFieldNames();
        $fields['CAMPAIGN_CONFIG'] = $this->EliCampaignConfig->getFieldNames();
        array_push($fields['CAMPAIGN_CONFIG'], "ELI_PUBLISHER_NAME");

        $fields['CAMPAIGN_CONFIG_SPENT'] = $this->EliPublisherConfigSpentRecord->getFieldNames();

        foreach ($recordRows as $recordRow)
        {
            $campaignId = $recordRow[self::$ID];
            $publisherList = array();
            $this->EliCampaignConfig->getEliCampaignConfigList($campaignId, $publisherList, false, false);
            $campaign = array_values($recordRow);
            array_push($campaign, $publisherList);

            array_push($campaignList, $campaign);
            $campaignNumber += 1;
        }

        unset($recordRows);
        return $errorCode;
    }

    private function createQueryCampaignByDateSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?) AND ((%s >= ?) AND (%s<?))",
                $this->TableName,
                self::$ELI_ACCOUNT_ID,
                self::$CREATE_TIME,
                self::$CREATE_TIME));
    }

    private function createGetCampaignSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            implode(",", array_keys($this->Fields)),
            sprintf(" %s WHERE (%s=?)",
                $this->TableName,
                self::$ELI_ACCOUNT_ID));
    }

    public function getEliCampaign($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            self::$ID,
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

        $campaignId = $parameters[self::$ID];
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
        $this->setPrimaryKey(self::$ID, $campaignId);
        $errorCode = $this->load();
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Load campaign <%s> from db failed, error code<%d>.", $campaignId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $result->setData($this->convertObject2Array());
        return $result;
    }

    public function updateCampaignConfigSpent($parameters)
    {
        return $this->EliPublisherConfigSpentRecord->updateCampaignConfigSpent($parameters);
    }

    public function getCampaignSpentRecords($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(
            PARAMETER_ACCESS_TOKEN,
            PARAMETER_CALL_TAG,
            PARAMETER_CLIENT_IP,
            PARAMETER_START_DATE,
            PARAMETER_END_DATE);
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

        $eliPublisherCampaigns = array();
        $errorCode = $this->EliCampaignConfig->getEliCampaignConfigList($userAccountId, $eliPublisherCampaigns);
        $result->setErrorCode($errorCode);
        if($errorCode != OK)
        {
            $result->setMessage(sprintf("Load eli publisher campaign <%s> failed, error code<%d>.", $userAccountId, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $startDate = $parameters[PARAMETER_START_DATE];
        $endDate = $parameters[PARAMETER_END_DATE];

        $eliPublisherCampaignSpentRecords = array();
        foreach ($eliPublisherCampaigns as $eliPublisherCampaign)
        {
            $eliPublisherCampaignId = $eliPublisherCampaign[0];
            $this->EliCampaignConfig->setFieldValue(CEliPublisherCampaign::$ID);
            $errorCode = $this->EliCampaignConfig->getPublisherCampaignSpentRecords($startDate, $endDate, $eliPublisherCampaignSpentRecords);
            if($errorCode != OK)
            {
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Load eli publisher campaign <%s> spent records failed, error code<%d>.", $eliPublisherCampaignId, $errorCode));
            }
        }

        $result->setData($eliPublisherCampaignSpentRecords);
        return $result;
    }

    public function createCampaign($parameters, $eliAccount)
    {
        $result = new CResult();
        $needCheckParameters = array(
            self::$NAME,
            self::$URL,
            self::$CAMPAIGN_TYPE,
            self::$SCHEDULE_START,
            self::$SCHEDULE_END,
            self::$TIME_START,
            self::$TIME_END,
            self::$BUDGET,
            self::$PARAMETER_AUDIENCE_COUNTRIES,
            self::$PARAMETER_AUDIENCE_GENDER,
            self::$PARAMETER_AUDIENCE_AGE,
            self::$PARAMETER_CONFIG_LIST,
            PARAMETER_ELI_ACCOUNT_ID,
            PARAMETER_ELI_ACCOUNT_BALANCE,
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

        $userAccountId = $parameters[PARAMETER_ELI_ACCOUNT_ID];
        $accountBalance = floatval($parameters[PARAMETER_ELI_ACCOUNT_BALANCE]);
        $budget = floatval($parameters[self::$BUDGET]);
        $balance = ($accountBalance - $budget);
        if ( $balance < 0.0)
        {
            $result->setErrorCode(ERR_ELI_ACCOUNT_INSUFFICIENT_BALANCE);
            $result->setMessage(sprintf("Account insufficient balance <%s,%.2f,%.2f> failed, error code<%d>.",
                $userAccountId, $accountBalance, $budget, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $campaignName = $parameters[self::$NAME];
        $isExists = true;
        $errorCode = $this->checkCampaignName($campaignName, $userAccountId, $isExists);
        $result->setErrorCode($errorCode);
        if ($errorCode != OK)
        {
            $result->setMessage(sprintf("Check campaign name <%s> failed, error code<%d>.", $campaignName, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if ($isExists)
        {
            $result->setErrorCode(ERR_CAMPAIGN_EXIST);
            $result->setMessage(sprintf("Campaign name <%s> exist, error code<%d>.", $campaignName, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $campaignType = intval($parameters[self::$CAMPAIGN_TYPE]);
        $urlAddress = $parameters[self::$URL];
        $scheduleStart = $parameters[self::$SCHEDULE_START];
        $scheduleEnd = $parameters[self::$SCHEDULE_END];
        $timeStart = $parameters[self::$TIME_START];
        $timeEnd = $parameters[self::$TIME_END];
        $countries = $parameters[self::$PARAMETER_AUDIENCE_COUNTRIES];
        $age = $parameters[self::$PARAMETER_AUDIENCE_AGE];
        $gender = intval($parameters[self::$PARAMETER_AUDIENCE_GENDER]);
        $audience = array();

        switch($gender)
        {
            case 0:
                $audience[self::$PARAMETER_AUDIENCE_GENDER] = GENDER_ALL;
                break;
            case 1:
                $audience[self::$PARAMETER_AUDIENCE_GENDER] = GENDER_MALE;
                break;
            case 2:
                $audience[self::$PARAMETER_AUDIENCE_GENDER] = GENDER_FEMALE;
                break;
            default:
                $audience[self::$PARAMETER_AUDIENCE_GENDER] = GENDER_ALL;
                break;
        }

        $audience[self::$PARAMETER_AUDIENCE_AGE] = $age;
        $audience[self::$PARAMETER_AUDIENCE_COUNTRIES] = array();
        $this->EliAudience->getCountryListByIds(json_decode($countries), $audience[self::$PARAMETER_AUDIENCE_COUNTRIES]);


        $title = "";
        if ($this->checkParameter(self::$TITLE, $parameters, $result))
        {
            $title = $parameters[self::$TITLE];
        }

        $description = "";
        if ($this->checkParameter(self::$DESCRIPTION, $parameters, $result))
        {
            $description = $parameters[self::$DESCRIPTION];
        }

        $publisherList = json_decode($parameters[self::$PARAMETER_CONFIG_LIST]);
        if (count($publisherList) == 0)
        {
            $result->setErrorCode(ERR_CAMPAIGN_PUBLISHER_IS_EMPTY);
            $result->setMessage(sprintf("Campaign <%s> publisher can't empty, error code<%d>.", $campaignName, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $campaignId = CPublic::getGuid();
        $this->setFieldValue(self::$ID, $campaignId);
        $this->setFieldValue(self::$NAME, $campaignName);
        $this->setFieldValue(self::$ELI_ACCOUNT_ID, $userAccountId);
        $this->setFieldValue(self::$CAMPAIGN_TYPE, $campaignType);
        $this->setFieldValue(self::$URL, $urlAddress);
        $this->setFieldValue(self::$AUDIENCE, json_encode($audience));
        $this->setFieldValue(self::$SCHEDULE_START, $scheduleStart);
        $this->setFieldValue(self::$SCHEDULE_END, $scheduleEnd);
        $this->setFieldValue(self::$TIME_START, $timeStart);
        $this->setFieldValue(self::$TIME_END, $timeEnd);
        $this->setFieldValue(self::$BUDGET, $budget);
        $this->setFieldValue(self::$SPENT, 0);
        $this->setFieldValue(self::$TITLE, $title);
        $this->setFieldValue(self::$DESCRIPTION, $description);
        $this->setFieldValue(self::$CREATE_TIME, date('Y-m-d H:i:s'));
        $this->setFieldValue(self::$LAST_MODIFY_TIME, date('Y-m-d H:i:s'));

        $recordNumber = 0;

        $isAllSuccess = true;
        $this->DbMySqlInterface->closeAutoCommit();
        $this->DbMySqlInterface->beginTransaction();

        $errorCode = $eliAccount->subBudget($userAccountId, $balance, $recordNumber);
        $result->setErrorCode($errorCode);
        if ($errorCode != OK)
        {
            $isAllSuccess = false;
            $result->setMessage(sprintf("Update eli account <%s> balance <%.2f> failed, error code<%d>.", $userAccountId,
                $budget, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        }

        $errorCode = $this->addRecord($recordNumber);
        $result->setErrorCode($errorCode);
        if ($errorCode != OK)
        {
            $isAllSuccess = false;
            $result->setMessage(sprintf("Create campaign <%s> failed, error code<%d>.", $campaignName, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        }

        $errorCode = $this->saveEliCampaignConfigs($publisherList, $campaignId);
        $result->setErrorCode($errorCode);
        if ($errorCode != OK)
        {
            $isAllSuccess = false;
            $result->setMessage(sprintf("Create campaign configs <%s> failed, error code<%d>.", $campaignName, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        }

        if ($isAllSuccess)
        {
            $this->DbMySqlInterface->commit();
            $this->DbMySqlInterface->openAutoCommit();
            $result->setErrorCode($errorCode);
        }
        else
        {
            $this->DbMySqlInterface->rollback();
            $this->DbMySqlInterface->openAutoCommit();
            $result->setErrorCode(ERR_COMMIT_TRANSACTION_FAILED);
            $result->setMessage(sprintf("Commit db transaction failed, error code<%d>.", $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
        }

        if ($errorCode != OK)
        {
            $result->setMessage(sprintf("Create campaign <%s> failed, error code<%d>.", $campaignName, $result->getErrorCode()));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, sprintf("Create campaign <%s,%s> success, wait sync to strategy server.", $campaignId, $campaignName));

        $errorCode = $this->syncCampaignToStrategyServer();
        $result->addResultField('SYNC_ERROR_CODE', $errorCode);
        $result->setData(array($campaignId));
        $result->setMessage("");
        return $result;
    }

    private function syncCampaignToStrategyServer()
    {
        $recordNumber = 0;
        $syncData = array();
        foreach ($this->Fields as $key=>$field)
        {
            $syncData[$key] = $field->Value;
        }

        $campaignId = $this->Fields[self::$ID]->Value;
        $syncData['CONFIGS'] = array();
        $errorCode = $this->EliCampaignConfig->getEliCampaignConfigs($campaignId, $syncData['CONFIGS'] );
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Load campaign <%s> config from db failed, error code <%d>.", $campaignId, $errorCode));
            return $errorCode;
        }

        $jsonData = json_encode($syncData);
        $dataValue = base64_encode($jsonData);

        $parameters= array();
        $parameters[SERVICE_NAME] = 'SyncFrontDataService';
        $parameters[CLASS_INSTANCE] = 'SyncManager';
        $parameters[FUNCTION_NAME] = 'syncEliCampaignData';
        $parameters[PARAMETER_ELI_DATA] = $dataValue;
        $resultJsonValue = CHttpRequest::sendPost(SERVICE_URL_STRATEGY_SERVER, $parameters, true, null);

        $result = json_decode($resultJsonValue);
        if(!$result)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Sync campaign <%s> to strategy server failed, result  <%s,%s> format invalid.", $campaignId, $resultJsonValue,$result));

            $this->clearPrimaryKeys();
            $this->setPrimaryKey(self::$ID, $this->Fields[self::$ID]->Value);
            $this->setFieldValue(self::$STATUS, ELI_CAMPAIGN_SYNC_FAILED);
            $errorCode = $this->updateRecord($recordNumber);
            if($errorCode != OK)
            {
                $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, sprintf("Update campaign <%s> sync status failed, error code <%d>.", $campaignId, $errorCode));
            }

            return ERR_ELI_SYNC_RESULT_DATA_FORMAT_INVALID;
        }

        $errorCodeField = $result->{'errorCode'};
        if(!is_numeric($errorCodeField))
        {
            return ERR_ELI_SYNC_RESULT_FIELD_ERROR_CODE_FORMAT_INVALID;
        }

        $errorCode = intval($errorCodeField);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Sync campaign <%s> to strategy server failed, error code <%d>.", $campaignId, $errorCode));
        }
        else
        {
            $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, sprintf("Sync campaign <%s> to strategy server success, error code <%d>.", $campaignId, $errorCode));
        }

        $this->clearPrimaryKeys();
        $this->setPrimaryKey(self::$ID, $this->Fields[self::$ID]->Value);
        $this->setFieldValue(self::$STATUS, ($errorCode == OK?ELI_CAMPAIGN_SYNC_SUCCESS:ELI_CAMPAIGN_SYNC_FAILED));
        $errorCode = $this->updateRecord($recordNumber);
        if($errorCode != OK)
        {
            $this->Log->writeLog(Info, __FILE__, __FUNCTION__, __LINE__, sprintf("Update campaign <%s> sync status failed, error code <%d>.", $campaignId, $errorCode));
        }

        return $errorCode;
    }

    private function saveEliCampaignConfigs($publisherList, $eliCampaignId)
    {
        foreach($publisherList as $publisherRow)
        {
            $publisherId = $publisherRow[0];
            $configBudget = floatval($publisherRow[1]);
            $configScheduleList = $publisherRow[2];
            $errorCode = $this->EliCampaignConfig->createEliPublisherCampaign($eliCampaignId, $publisherId, $configBudget, 0, $configScheduleList);
            if($errorCode != OK)
            {
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__,
                    sprintf("Create campaign config <%s,%d> failed, error code <%d>.",
                        $publisherId, $configBudget, $errorCode));
                return $errorCode;
            }
        }

        return OK;
    }

    private function checkCampaignName($campaignName, $userAccountId, &$isExists)
    {
        $dbParameters = array();
        $userAccountParameter = new CDbParameter(self::$ELI_ACCOUNT_ID, $userAccountId, STRING);
        array_push($dbParameters, $userAccountParameter);

        $campaignNameParameter = new CDbParameter(self::$NAME, $campaignName, STRING);
        array_push($dbParameters, $campaignNameParameter);

        $recordRows = array();
        $querySql = $this->createCheckCampaignSql();
        $errorCode = $this->DbMySqlInterface->queryRecords($querySql, $dbParameters, $recordRows);
        if($errorCode != OK)
        {
            $isExists = true;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Check campaign name <%s> failed.", $campaignName));
            unset($recordRows);
            return $errorCode;
        }

        $isExists = (count($recordRows) > 0);

        unset($recordRows);
        return $errorCode;
    }

    private function createCheckCampaignSql()
    {
        return sprintf($this->SELECT_QUERY_TEMPLATE,
            sprintf("%s", self::$ID),
            sprintf(" %s WHERE ((%s=?) AND (%s=?))",
                $this->TableName,
                self::$ELI_ACCOUNT_ID,
                self::$NAME));
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$ELI_ACCOUNT_ID, STRING, "");
        $this->addField(self::$NAME, STRING, "");
        $this->addField(self::$CAMPAIGN_TYPE, INTEGER, 0);
        $this->addField(self::$URL, STRING, "");
        $this->addField(self::$TITLE, STRING, "");
        $this->addField(self::$DESCRIPTION, STRING, "");
        $this->addField(self::$IMAGE_LIST, STRING, "");
        $this->addField(self::$SCHEDULE_START, STRING, "");
        $this->addField(self::$SCHEDULE_END, STRING, "");
        $this->addField(self::$TIME_START, STRING, "");
        $this->addField(self::$TIME_END, STRING, "");
        $this->addField(self::$AUDIENCE, STRING, "");
        $this->addField(self::$STATUS, INTEGER, ELI_CAMPAIGN_SYNC_INIT);
        $this->addField(self::$BUDGET, INTEGER, 0);
        $this->addField(self::$SPENT, INTEGER, 0);
        $this->addField(self::$DELIVERY_TYPE, INTEGER, 0);
        $this->addField(self::$KEYWORD, STRING, "");
        $this->addField(self::$MATCH_TYPE, INTEGER, 0);
        $this->addField(self::$CREATE_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$LAST_MODIFY_TIME, STRING, date('Y-m-d H:i:s'));
    }
}