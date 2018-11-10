<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");


exportAdsetInsight();

function exportAdsetInsight()
{
    ServerLogger::instance()->writeLog(Warning, 'Start to export AdSet Insight .....');
    //与ad错峰
    sleep(25);

    $rootPath = __DIR__ . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF;
    $configName = InsightExporterConstants::CONFIG_BASIC_TASK_NAME;
    $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET;

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
        AdSetInsightExportHelper::getInstance()->exportCsvFile($insightInfoPath, $parentId, $sinceDate, $utilDate, $exportDimension,
            $exportPath, $filePrefix);
    }

    ServerLogger::instance()->writeLog(Warning, 'Succeed to export AdSet Insight.');
}