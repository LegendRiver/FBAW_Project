<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/11/14
 * Time: 下午9:04
 */
class ProductDBManager extends AbstractDBManager
{
    public function __construct()
    {
        $this->TableName = OrionTableNameConstants::PRODUCT_INFO;
        parent::__construct();
    }

    public function selectAllProduct($fieldArray = array())
    {
        if(empty($fieldArray))
        {
            $fieldArray = array_keys($this->Fields);
        }

        $selectParamMap = array();
        $entityArray = $this->selectDbRecord($fieldArray, $selectParamMap);
        if(false === $entityArray)
        {
            return false;
        }

        return $entityArray;
    }

    public function selectValidProduct()
    {
        try
        {
            $selectSql = $this->buildProductJoinSql();

            $validStatus = 1;
            $selectParams = array();
            $deliveryStatusParams = new CDbParameter(ProductDeliveryMapFields::STATUS, $validStatus, INTEGER);
            $selectParams[] = $deliveryStatusParams;

            $recordRows = array();
            $errorCode = $this->DbMySqlInterface->queryRecords($selectSql, $selectParams, $recordRows);
            if ($errorCode != OK)
            {
                ServerLogger::instance()->writeLog(Error, sprintf("Execute sql <%s> failed.", $selectParams));
                return false;
            }
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            return false;
        }

        return $recordRows;
    }

    private function buildProductJoinSql()
    {
        $sql = 'SELECT product.'. ProductDBFields::ID .', ';
        $sql .= 'product.' . ProductDBFields::NAME . ' as ' . SelectAliasConstants::PRODUCT_NAME . ', ';
        $sql .= 'product.'. ProductDBFields::LOGO_PATH . ', ';
        $sql .= 'advertiser.' . AdvertiserDBFields::NAME . ' as ' . SelectAliasConstants::ADVERTISER_NAME . ', ';
        $sql .= 'delivery.' . ProductDeliveryMapFields::PLATFORM_ID . ', ';
        $sql .= 'platform.' . PlatformDBFields::NAME . ' as ' . SelectAliasConstants::PLATFORM_NAME . ' ';
        $sql .= 'FROM ' . OrionTableNameConstants::PRODUCT_INFO . ' as product ';
        $sql .= 'inner join ' . OrionTableNameConstants::PRODUCT_PLATFORM_DELIVERY . ' as delivery ';
        $sql .= 'on product.' . ProductDBFields::ID . ' = delivery.' . ProductDeliveryMapFields::PRODUCT_ID . ' ';
        $sql .= 'inner join ' . OrionTableNameConstants::ADVERTISER_INFO . ' as advertiser ';
        $sql .= 'on product.' .ProductDBFields::ADVERTISER_ID . ' = advertiser.' . AdvertiserDBFields::ID . ' ';
        $sql .= 'inner join ' .OrionTableNameConstants::PLATFORM_INFO . ' as platform ';
        $sql .= 'on delivery.' .ProductDeliveryMapFields::PLATFORM_ID . ' = platform.' . PlatformDBFields::ID . ' ';
        $sql .= 'where delivery.' . ProductDeliveryMapFields::STATUS . ' = ?';

        return $sql;
    }

    protected function initEntityCondition()
    {
        $this->dbEntityInstance = new ProductInfoEntity();

        $this->field2FunctinName = array(
            ProductDBFields::ID => 'setId',
            ProductDBFields::NAME => 'setName',
            ProductDBFields::ADVERTISER_ID => 'setAdvertiserId',
            ProductDBFields::LOGO_PATH => 'setImagePath',
        );
    }

    protected function initTableFields()
    {
        $this->addField(ProductDBFields::ID, INTEGER, 0);
        $this->addField(ProductDBFields::NAME, STRING, "");
        $this->addField(ProductDBFields::ADVERTISER_ID, INTEGER, 0);
        $this->addField(ProductDBFields::LOGO_PATH, STRING, "");
    }
}