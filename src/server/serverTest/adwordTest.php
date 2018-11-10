<?php
require_once(__DIR__ . "/../includeFile/basicIncludeFile.php");
require_once(__DIR__ . "/../includeFile/googleIncludeFile.php");

queryReportTest();

function queryReportTest()
{
    $data = AWReportManager::getInstance()->queryReportData();
    var_dump($data) ;
}

function getReportField()
{
    AWReportManager::getInstance()->getReportFields(AWCommonConstants::REPORT_CAMPAIGN_PERFORMANCE);
}

function getAllVideo()
{
    $accountId = '492-992-9778';
    $videos = AWMediaManager::getInstance()->getAllVideos($accountId);
    print_r($videos);
}

function getAllImages()
{
    $accountId = '492-992-9778';
    $imageIds = AWMediaManager::getInstance()->getAllImages($accountId);
    print_r($imageIds);
}

function uploadImageTest()
{
    $imagePath = __DIR__ . DIRECTORY_SEPARATOR . 'downloadImage';
    $imageFiles = FileHelper::getRecursiveFileList($imagePath, array('jpg', 'png'));
    $imageIds = AWMediaManager::getInstance()->uploadImageToAdwords($imageFiles);
    print_r($imageIds);
}

function getAllLocales()
{
    $locales = AWConstantDataManager::getInstance()->getAllLocales();
    FileHelper::writeJsonFile($locales, 'locales_AW.json');
}

function locationCriteriaTest()
{
    $coutries = array('US', 'JP');
    $entityList = AWLocationManager::getInstance()->getIdByCountryCode($coutries);
    var_dump($entityList);
}

function configManagerTest()
{
    $initFile = ApiConfManager::getInstance()->getApiInitFile();
    print $initFile;
}

function createCampaign()
{
    $accountId = '3615514833';
    AWCampaignManager::getInstance()->createCampaign($accountId);
}

function createBudget()
{
    $name = 'budget_test_001';
    $amount = 50;
    $budget = AWBudgetManager::getInstance()->createBudget($name, $amount);
    var_dump($budget);
}

function getBudget()
{
    $budget = AWBudgetManager::getInstance()->getBudget();
    var_dump($budget);
}

function getAccountTest()
{
    $accountList = AWAccountManager::getInstance()->getAllAccount();
    var_dump($accountList);
}

function createAccountTest()
{
    $name = 'api_create_001';
    $account = AWAccountManager::getInstance()->createAccount($name);
    var_dump($account);
}

function getCampaignTest()
{
    $entityList = AWCampaignManager::getInstance()->getAllCampaign();
    var_dump($entityList);
}

function getCampaignByIdTest()
{
    $customerId = '8537408378';
    $entityList = AWCampaignManager::getInstance()->getCampaignByAccountId($customerId);
    var_dump($entityList);
}



