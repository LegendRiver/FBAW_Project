<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");

queryAccountPerformTest();

function queryBalanceTest()
{
    $result = ServiceManager::instance()->callService('QueryAccountBalanceService', 'AccountInfoManager',
        'queryCountryPerformance', array('PRODUCT_ID' => 4));
    print_r($result);
}

function queryAccountBasicInfoTest()
{
    $result = ServiceManager::instance()->callService('QueryAccountBalanceService', 'AccountInfoManager',
        'queryActBasicInfo', array('PRODUCT_ID'=> 1));
    print_r($result);
}

function queryProductTest()
{
    $result = ServiceManager::instance()->callService('QueryProductService', 'ProductInfoManager',
        'queryProductInfo', array());
    print_r($result);
}

function queryProductStateTest()
{
    $productState = BasicInfoDataHandler::instance()->getProductStateData();
    var_dump($productState);
}

function queryAccountPerformTest()
{
    $manager = new AccountInfoManager();
    $productState = $manager->queryCountryPerformance(array('PRODUCT_ID'=> 4));
    var_dump($productState);
}


