<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

exportMain();

function exportMain()
{
    $basicConfigPath = __DIR__ . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF .
        DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_BASIC_NAME;
    $basicConfigInfo = FileHelper::readJsonFile($basicConfigPath);

    $exportDimension = $basicConfigInfo[InsightExporterConstants::BASIC_INFO_DIMENSION];
    $parentId = $basicConfigInfo[InsightExporterConstants::BASIC_INFO_PARENT_ID];
    $sinceDate = $basicConfigInfo[InsightExporterConstants::BASIC_INFO_SINCE_DATE];
    $utilDate = $basicConfigInfo[InsightExporterConstants::BASIC_INFO_UTIL_DATE];
    $exportPath = $basicConfigInfo[InsightExporterConstants::BASIC_INFO_EXPORT_PATH];
    $filePrefix = $basicConfigInfo[InsightExporterConstants::BASIC_INFO_NAME_PREFIX];

    $insightInfoPath = __DIR__ . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF .
        DIRECTORY_SEPARATOR. $basicConfigInfo[InsightExporterConstants::BASIC_INFO_INSIGHT_INFO_NAME];

    AdInsightExportHelper::getInstance()->exportCsvFile($insightInfoPath, $parentId, $sinceDate, $utilDate, $exportDimension,
        $exportPath, $filePrefix);

}