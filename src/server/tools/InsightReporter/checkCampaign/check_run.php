<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

checkCampaign();

function checkCampaign()
{
    $checkConfigFile =__DIR__ . DIRECTORY_SEPARATOR . 'check_conf.json';
    $configInfo = FileHelper::readJsonFile($checkConfigFile);

    $configList = $configInfo['checkInfos'];

    $reportConfigPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'conf' . DIRECTORY_SEPARATOR;
    $mailInfo = '';
    foreach($configList as $config)
    {
       $productName = $config['productName'];
       $accountList = $config['accountList'];
       $configFile = $config['reportConfig'];
       $offset = $config['offset'];

       $actualCampaignIds = getCampaignIds($accountList);
       $configFilePath = $reportConfigPath . $configFile;
       $configCampaignIds = getCampaignIdFromConf($configFilePath);

       $diffArray = array_diff($actualCampaignIds, $configCampaignIds);
       //$idString = implode(',', $diffArray);

       if(count($diffArray) > $offset)
       {
           $outputString = $productName . ':' . PHP_EOL;
           $nameMap = getCampaignNames($diffArray);
           $outputString .= print_r($nameMap, true) . PHP_EOL;

           $mailInfo .= $outputString;

           echo $outputString;
       }

    }

    if(!empty($mailInfo))
    {
        MailerHelper::instance()->sendMail(array('xufeng@eliads.com'), 'check campaign', $mailInfo);
    }
}

function getCampaignNames($campaignIdList)
{
    $nameList = array();
    foreach ($campaignIdList as $id)
    {
        $campaignEnitity = AdManagerFacade::getCampaignById($id);
        $name = $campaignEnitity->getName();
        $nameList[$id] = $name;
    }

    return $nameList;
}

function getCampaignIds($accountList)
{
    $idList = array();

    foreach($accountList as $actId)
    {
        $campaignIds = AdManagerFacade::getCampaignIdsByAccount($actId);
        if(false === $campaignIds)
        {
            continue;
        }

        $idList = array_merge($idList, $campaignIds);
    }

    return $idList;
}

function getCampaignIdFromConf($configFile)
{
    $configInfo = FileHelper::readJsonFile($configFile);
    $productList = $configInfo['productConfig'];
    $idList = array();
    foreach($productList as $product)
    {
        $campaignConfigList = $product['campaignConfig'];
        foreach ($campaignConfigList as $camConfig)
        {
            $campaignIds = $camConfig['campaignIds'];
            $idList = array_merge($idList, $campaignIds);
        }
    }

    return $idList;
}