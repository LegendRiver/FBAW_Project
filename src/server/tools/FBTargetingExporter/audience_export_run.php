<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

exportAudienceData(true, true);

function exportAudienceData($isMerger = false, $isExportFlexible = false)
{
    $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'conf'. DIRECTORY_SEPARATOR . 'audienceConfig.json';
    $csvFile = __DIR__ . "/csvFiles";
    $mergerFile = __DIR__ . "/mergerCsvFiles";
    $runner = new ExportRun($configFile, $csvFile, $mergerFile);
    $runner->exportData($isMerger, $isExportFlexible);
}