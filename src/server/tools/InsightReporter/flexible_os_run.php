<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

exportFlexibleOSReport();

function exportFlexibleOSReport()
{
    $rootPath = __DIR__ . DIRECTORY_SEPARATOR;
    $configFile = $rootPath. 'conf'. DIRECTORY_SEPARATOR . 'basicConfig_yeecall.json';
    $templateFile = $rootPath. 'template'. DIRECTORY_SEPARATOR . 'template_flexible.xlsx';
    $outputPath = $rootPath . 'output';
    $outputFile = 'facebook_data.xlsx';

    ReportRun::exportProfitReportByOs($configFile, $templateFile, $outputPath, $outputFile);
}