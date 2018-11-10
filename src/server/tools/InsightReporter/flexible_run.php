<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

exportFlexibleReport();

function exportFlexibleReport()
{
    $rootPath = __DIR__ . DIRECTORY_SEPARATOR;
    $configFile = $rootPath. 'conf'. DIRECTORY_SEPARATOR . 'basicConfig_sougou.json';
    $templateFile = $rootPath. 'template'. DIRECTORY_SEPARATOR . 'template_flexible.xlsx';
    $outputPath = $rootPath . 'output';
    $outputFile = 'facebook_data.xlsx';

    ReportRun::exportSpendReport($configFile, $templateFile, $outputPath, $outputFile);
}
