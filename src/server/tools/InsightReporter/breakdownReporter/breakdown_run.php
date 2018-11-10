<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

//exportBDReport();
exportDeviceBDReport();

function exportBDReport()
{
    $rootPath = dirname(__DIR__) . DIRECTORY_SEPARATOR;
    $configFile = $rootPath. 'breakdownConf'. DIRECTORY_SEPARATOR . 'conf_mobi.json';
    $templateFile = $rootPath. 'template'. DIRECTORY_SEPARATOR . 'template_flexible.xlsx';
    $outputPath = $rootPath . 'output';

    ReportRun::exportBreakdownReport($configFile, $templateFile, $outputPath);
}

function exportDeviceBDReport()
{
    $rootPath = dirname(__DIR__) . DIRECTORY_SEPARATOR;
    $configFile = $rootPath. 'breakdownConf'. DIRECTORY_SEPARATOR . 'conf_device_kwai.json';
    $templateFile = $rootPath. 'template'. DIRECTORY_SEPARATOR . 'template_flexible.xlsx';
    $outputPath = $rootPath . 'output';

    ReportRun::exportDeviceBreakdownReport($configFile, $templateFile, $outputPath);
}