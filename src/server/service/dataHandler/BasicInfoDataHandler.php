<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/11/16
 * Time: 下午9:21
 */
class BasicInfoDataHandler
{
    private static $instance = null;

    private $productInfoList;

    private $productAccountMap;

    private $productDb;

    private $accountDb;

    private function __construct()
    {
        $this->productInfoList = array();
        $this->productAccountMap = array();
        $this->productDb = new ProductDBManager();
        $this->accountDb = new AccountDBManager();
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function getProductStateData()
    {
        $productStateList = array();
        $this->productInfoList = $this->productDb->selectValidProduct();
        if(empty($this->productInfoList))
        {
            return array();
        }
        //临时用用于过滤多平台情况，暂时只考虑FB
        $productIdList = array();
        foreach ($this->productInfoList as $product)
        {
            //先暂时不考虑google, 后面需要重构增加google account
            $productId = $product[ProductDBFields::ID];
            $productName = $product[SelectAliasConstants::PRODUCT_NAME];
            $logoPath = $product[ProductDBFields::LOGO_PATH];
            $advertiser = $product[SelectAliasConstants::ADVERTISER_NAME];

            if(in_array($productId, $productIdList))
            {
                continue;
            }

            $accountList = $this->accountDb->selectAccountByProductId($productId);
            if(false === $accountList)
            {
                ServerLogger::instance()->writeLog(Error, 'Failed to select account by productId: ' .
                    $productId . '; productName: ' . $productName);
                continue;
            }

            if(empty($accountList))
            {
                continue;
            }

            //没有考虑平台，目前只是FB
            $this->productAccountMap = array( $productId => $accountList);
            $productIdList[] = $productId;

            $accountIdList = array();
            foreach ($accountList as $account)
            {
                $accountIdList[] = $account->getId();
            }

            $productState = array(
                ReactStateKeys::PRODUCT_ID => $productId,
                ReactStateKeys::PRODUCT_NAME => $productName,
                ReactStateKeys::PRODUCT_ADVERTISER => $advertiser,
                ReactStateKeys::PRODUCT_LOGO_PATH => $logoPath,
                ReactStateKeys::PRODUCT_ACCOUNT_LIST => $accountIdList,
            );

            $productStateList[$productId] = $productState;
        }

        return $productStateList;
    }

    public function getAccountBasicInfo($productId=-1)
    {
        $accountEntityList = $this->accountDb->selectAccountByProductId($productId);
        $accountInfo = array();
        $accountInfo[ReactStateKeys::ACCOUNT_BASIC_TITLE] = ReactStateDataConstants::$accountBasicTitle;
        $actData = array();
        foreach ($accountEntityList as $account)
        {
            $id = $account->getId();
            $accountId = $account->getAccountId();
            $name = $account->getName();
            $agency = $account->getAgency();

            $fbAccount = AdManagerFacade::getAccountById($accountId);
            $cap = 0;
            $totalSpend = 0;
            if(false !== $fbAccount)
            {
                $name = $fbAccount->getName();
                $cap = $fbAccount->getSpendCap();
                $totalSpend = $fbAccount->getAmountSpend();
            }

            $actData[$id] = array($accountId, $name, $agency, $cap/100, $totalSpend/100);

        }
        $accountInfo[ReactStateKeys::ACCOUNT_BASIC_DATA] = $actData;
        return $accountInfo;
    }

    public function getAccountIdByProductId($productId)
    {
        $accountEntityList = $this->accountDb->selectAccountByProductId($productId);
        $accountInfo = array();
        $accountInfo[ReactStateKeys::ACCOUNT_BASIC_TITLE] = ReactStateDataConstants::$accountBasicTitle;
        $actData = array();
        foreach ($accountEntityList as $account)
        {
            $id = $account->getId();
            $accountId = $account->getAccountId();
            $actData[$id] = $accountId;
        }

        return $actData;
    }


    public function getActCountryPerformance($productId, $startDate, $endDate)
    {
        $actIdMap = $this->getAccountIdByProductId($productId);
        $countryBDExporter = new CountryBDInsightExporter();
        $accountPerformanceData = array();
        foreach ($actIdMap as $id=>$actId)
        {
            $insightValue = $countryBDExporter->getInsightByBD($actId,
                AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT, $startDate, $endDate);
            $accountPerformanceData[$id] = $this->prehandleData($insightValue);
        }

        $actCountryData = array();
        $actCountryData[ReactStateKeys::ACCOUNT_PERFORMANCE_TITLE] = ReactStateDataConstants::$accountPerformanceTitle;
        $actCountryData[ReactStateKeys::ACCOUNT_PERFORMANCE_DATA] = $accountPerformanceData;
        return $actCountryData;
    }

    private function prehandleData($insightData)
    {
        $handledData = array();
        $mapfunc = function($value)
        {
            if(empty($value))
            {
                return '0';
            }
            else
            {
                return $value;
            }
        };

        foreach ($insightData as $rowData)
        {
            $handledRow = array_map($mapfunc, $rowData);
            $handledData[] = $handledRow;
        }

        return $handledData;
    }

}

