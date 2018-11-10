<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

exportAdRetention();

function exportAdRetention()
{
    ServerLogger::instance()->writeLog(Warning, 'Start to export Ad Retention .....');

    $rootPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_DIRECTORY_CONF;
    $configName = InsightExporterConstants::CONFIG_RETENTION_NAME;
    $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_AD;

    $configHelper = new ExportConfigHelper($rootPath, $configName, $nodeType);

    $exportDimension = $configHelper->getExportDimension();
    $parentIds = $configHelper->getParentIds();
    $exportPath = $configHelper->getExportPath();
    $filePrefix = $configHelper->getFilePrefix();
    $insightInfoPath = $configHelper->getInsightConfigPath();
    $retentionDays = $configHelper->getRetentionDays();

    foreach($parentIds as $parentId)
    {
        if(array_key_exists($parentId, $retentionDays))
        {
            $days = $retentionDays[$parentId];
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'The retention days config is wrong. There is no ' . $parentId);
            $days = 1;
        }

        $dateList = ExporterUtil::getRetentionDates($days);

        foreach($dateList as $reDate)
        {
            AdInsightExportHelper::getInstance()->exportCsvFile($insightInfoPath, $parentId, $reDate, $reDate,
                $exportDimension, $exportPath, $filePrefix, true);

            sleep(5);
        }
    }

    ServerLogger::instance()->writeLog(Warning, 'Succeed to export Ad Retention.');
}