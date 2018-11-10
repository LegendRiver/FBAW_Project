<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/11/16
 * Time: 下午6:32
 */
class AccountDBManager extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = OrionTableNameConstants::ACCOUNT_INFO;
        parent::__construct();
    }

    public function selectAccountByProductId($productId, $fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $productIdParam = new CDbParameter(AccountDBFields::PRODUCT_ID, $productId, INTEGER);
        $selectParamMap[AccountDBFields::PRODUCT_ID] = $productIdParam;

        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new AccountInfoEntity();

        $this->field2FunctinName = array(
            AccountDBFields::ID => 'setId',
            AccountDBFields::NAME => 'setName',
            AccountDBFields::PRODUCT_ID => 'setProductId',
            AccountDBFields::ACCOUNT_ID => 'setAccountId',
            AccountDBFields::AGENCY => 'setAgency',
            AccountDBFields::IS_DISPLAY => 'setIsDisplay',
        );
    }

    protected function initTableFields()
    {
        $this->addField(AccountDBFields::ID, INTEGER, 0);
        $this->addField(AccountDBFields::NAME, STRING, "");
        $this->addField(AccountDBFields::PRODUCT_ID, INTEGER, 0);
        $this->addField(AccountDBFields::ACCOUNT_ID, STRING, "");
        $this->addField(AccountDBFields::AGENCY, STRING, "");
        $this->addField(AccountDBFields::IS_DISPLAY, INTEGER, 0);
    }
}