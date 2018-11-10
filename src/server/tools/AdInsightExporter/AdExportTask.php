<?php

require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

exportAdInsight();

function exportAdInsight()
{
    ServerLogger::instance()->writeLog(Warning, 'Start to export Ad Insight .....');

    $rootPath = __DIR__ . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF;
    $configName = InsightExporterConstants::CONFIG_BASIC_TASK_NAME;
    $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_AD;

    $configHelper = new ExportConfigHelper($rootPath, $configName, $nodeType);

    $exportDimension = $configHelper->getExportDimension();
    $parentIds = $configHelper->getParentIds();
    $sinceDate = $configHelper->getSinceDate();
    $utilDate = $configHelper->getUtilDate();
    $exportPath = $configHelper->getExportPath();
    $filePrefix = $configHelper->getFilePrefix();
    $insightInfoPath = $configHelper->getInsightConfigPath();

    foreach($parentIds as $parentId)
    {
        AdInsightExportHelper::getInstance()->exportCsvFile($insightInfoPath, $parentId, $sinceDate, $utilDate, $exportDimension,
            $exportPath, $filePrefix);

        sleep(4);
    }

    ServerLogger::instance()->writeLog(Warning, 'Succeed to export Ad Insight.');
}