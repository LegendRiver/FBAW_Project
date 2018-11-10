<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

exportData(false, true);

function exportData($isMerger = false, $isExportFlexible = false)
{
    $configFile_yt = __DIR__ . DIRECTORY_SEPARATOR . 'conf'. DIRECTORY_SEPARATOR . 'targetingConfig_yt.json';
    $configFile_002 = __DIR__ . DIRECTORY_SEPARATOR . 'conf'. DIRECTORY_SEPARATOR . 'targetingConfig_002.json';
    $configFile_river = __DIR__ . DIRECTORY_SEPARATOR . 'conf'. DIRECTORY_SEPARATOR . 'targetingConfig.json';
    $csvFile = __DIR__ . "/csvFiles";
    $mergerFile = __DIR__ . "/mergerCsvFiles";

//    $runner = new ExportRun($configFile_yt, $csvFile, $mergerFile);
//    $runner->exportData($isMerger, $isExportFlexible, FBAPIConfConstants::KEY_YT);
//
//    $runner = new ExportRun($configFile_002, $csvFile, $mergerFile);
//    $runner->exportData($isMerger, $isExportFlexible, FBAPIConfConstants::KEY_ELIX_TWO);
//
//    $runner = new ExportRun($configFile_river, $csvFile, $mergerFile);
//    $runner->exportData($isMerger, $isExportFlexible, FBAPIConfConstants::KEY_RIVER);
}
