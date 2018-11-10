<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

export360Report();

function export360Report()
{
    $rootPath = __DIR__ . DIRECTORY_SEPARATOR;
    $configFile = $rootPath. 'conf'. DIRECTORY_SEPARATOR . 'basicConfig_yogrt.json';
    $templateFile = $rootPath. 'template'. DIRECTORY_SEPARATOR . 'template.xlsx';
    $outputPath = $rootPath . 'output';

    ReportRun::exportDefaultReport($configFile, $templateFile, $outputPath);
}