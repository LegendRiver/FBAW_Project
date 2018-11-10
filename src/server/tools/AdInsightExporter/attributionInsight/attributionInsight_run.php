<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

exportAttributionInsight();

function exportAttributionInsight()
{
    ServerLogger::instance()->writeLog(Warning, 'Start to export AdSet Attribute Insight .....');

    $rootPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF;
    $configName = InsightExporterConstants::CONFIG_ATTRIBUTE_NAME;
    $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET;

    $configHelper = new ExportConfigHelper($rootPath, $configName, $nodeType);

    $exportDimension = $configHelper->getExportDimension();
    $parentIds = $configHelper->getParentIds();
    $sinceDate = $configHelper->getSinceDate();
    $utilDate = $configHelper->getUtilDate();
    $exportPath = $configHelper->getExportPath();
    $filePrefix = $configHelper->getFilePrefix();
    $insightInfoPath = $configHelper->getInsightConfigPath();

    $dateList = CommonHelper::getDateListBetweenDate($sinceDate, $utilDate);

    foreach($parentIds as $parentId)
    {
        foreach($dateList as $dayDate)
        {
            print_r('Exporting attribute insight by parentId: '. $parentId . '; date: ' . $dayDate . ' ...' . PHP_EOL);

            AdSetAttributeHelper::getInstance()->exportCsvFile($insightInfoPath, $parentId, $dayDate, $dayDate, $exportDimension,
                $exportPath, $filePrefix);

            sleep(5);
        }
    }

    ServerLogger::instance()->writeLog(Warning, 'Succeed to export AdSet Attribute Insight.');
}
