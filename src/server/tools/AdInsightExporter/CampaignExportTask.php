<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");


exportCampaignInsight();

function exportCampaignInsight()
{
    ServerLogger::instance()->writeLog(Warning, 'Start to export Campaign Insight .....');
    //错峰
    sleep(30);

    $rootPath = __DIR__ . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF;
    $configName = InsightExporterConstants::CONFIG_BASIC_TASK_NAME;
    $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN;

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
        CampaignExportHelper::getInstance()->exportCsvFile($insightInfoPath, $parentId, $sinceDate, $utilDate, $exportDimension,
            $exportPath, $filePrefix);
    }
    ServerLogger::instance()->writeLog(Warning, 'Succeed to export Campaign Insight.');
}