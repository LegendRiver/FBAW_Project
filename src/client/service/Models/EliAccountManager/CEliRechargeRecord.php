<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-08-26
 * Time: 16:05
 */
class CEliRechargeRecord extends CBaseObject
{
    public static $TABLE_NAME = "T_ELI_ACCOUNT_RECHARGE_RECORD";
    public static $ID = "ID";
    public static $OPERATOR_ID = "OPERATOR_ID";
    public static $ELI_ACCOUNT_ID = "ELI_ACCOUNT_ID";
    public static $RECHARGE_TIME = "RECHARGE_TIME";
    public static $AMOUNT = "AMOUNT";
    public static $STATUS = "STATUS";
    public static $CLIENT_IP = "CLIENT_IP";

    private $EliAccount = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliRechargeRecord";
        $this->TableName = self::$TABLE_NAME;
        $this->EliAccount = new CEliAccount($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function recharge($operatorId, $eliAccount, $amount, $clientIP, &$rechargeToken)
    {
        $rechargeToken = CPublic::getGuid();
        $this->setFieldValue(self::$ID, $rechargeToken);
        $this->setFieldValue(self::$OPERATOR_ID, $operatorId);
        $this->setFieldValue(self::$ELI_ACCOUNT_ID, $eliAccount);
        $this->setFieldValue(self::$RECHARGE_TIME, date('Y-m-d H:i:s'));
        $this->setFieldValue(self::$AMOUNT, $amount);
        $this->setFieldValue(self::$STATUS, 0);
        $this->setFieldValue(self::$CLIENT_IP, $clientIP);
        $insertRecordNumber = 0;
        $isAllCompleted = true;
        $this->DbMySqlInterface->closeAutoCommit();
        $this->DbMySqlInterface->beginTransaction();
        $errorCode = $this->addRecord($insertRecordNumber);
        if ($errorCode != OK)
        {
            $isAllCompleted = false;
        }

        $errorCode = $this->EliAccount->recharge($eliAccount, $amount);
        if ($errorCode != OK)
        {
            $isAllCompleted = false;
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Recharge <%s> failed, error code<%d>.", $operatorId, $errorCode));
        }

        if ($isAllCompleted)
        {
            $this->DbMySqlInterface->commit();
            $errorCode = OK;
        }
        else
        {
            $this->DbMySqlInterface->rollback();
            $errorCode = ERR_ELI_ACCOUNT_RECHARGE_FAILED;
        }

        $this->DbMySqlInterface->openAutoCommit();
        if ($errorCode != OK)
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Recharge <%s,%s,%s> failed, error code<%d>.",
                $operatorId, $eliAccount, $errorCode, $amount));
            return $errorCode;
        }

        return $errorCode;
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