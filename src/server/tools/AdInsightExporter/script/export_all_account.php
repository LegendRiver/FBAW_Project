<?php

require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

exportAccountInfo();

function exportAccountInfo()
{
    $rootPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF .
        DIRECTORY_SEPARATOR;
    $accountListConfigPath = $rootPath . InsightExporterConstants::CONFIG_ACCOUNT_LIST_NAME;
    $actListInfo = FileHelper::readJsonFile($accountListConfigPath);

    $excludesId = $actListInfo[InsightExporterConstants::BASIC_INFO_EXCLUDE_ACCOUNT];
    $includesId = $actListInfo[InsightExporterConstants::BASIC_INFO_INCLUDE_ACCOUNT];

    $allId = array_merge($excludesId, $includesId);

    $csvTitle = array(
        'account_name',
        'account_id',
    );
    $exportData[] = $csvTitle;

    foreach ($allId as $actId)
    {
        $accountEntity = AdManagerFacade::getAccountById($actId);

        if(false === $accountEntity)
        {
            print_r('Failed get accountInfo by id  : ' . $actId . PHP_EOL);
            continue;
        }

        $rowData = array();
        $rowData[] = $accountEntity->getName();
        $rowData[] = $accountEntity->getId();
        $exportData[] = $rowData;

    }

    $outputFile = __DIR__ . DIRECTORY_SEPARATOR . 'account_name_' . time() . '.csv';
    FileHelper::saveCsv($outputFile, $exportData);
}