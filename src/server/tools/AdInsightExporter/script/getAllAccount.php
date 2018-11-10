<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

$accountEntities = AdManagerFacade::getAllAccountsByBMId(AdManageConstants::DEFAULT_BM_ID);
if(false === $accountEntities)
{
    return;
}

$rootPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF .
    DIRECTORY_SEPARATOR;
$accountListConfigPath = $rootPath . InsightExporterConstants::CONFIG_ACCOUNT_LIST_NAME;
$actListInfo = FileHelper::readJsonFile($accountListConfigPath);

$excludesId = $actListInfo[InsightExporterConstants::BASIC_INFO_EXCLUDE_ACCOUNT];
$includesId = $actListInfo[InsightExporterConstants::BASIC_INFO_INCLUDE_ACCOUNT];

$parentIds = array();
foreach($accountEntities as $account)
{
    $accountId = $account->getId();
    if(in_array($accountId, $excludesId))
    {
        continue;
    }
    $accountId = str_replace(AdManageConstants::ADACCOUNT_ID_PREFIX, '', $accountId);
    $parentIds[] = $accountId;
}

if(empty($parentIds))
{
    foreach($includesId as $actId)
    {
        $actId = str_replace(AdManageConstants::ADACCOUNT_ID_PREFIX, '', $actId);
        $parentIds[] = $actId;
    }
}

echo implode(',', $parentIds);