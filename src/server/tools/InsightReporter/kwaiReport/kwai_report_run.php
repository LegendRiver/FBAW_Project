<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

generateKwaiReport();

function generateKwaiReport($isGenerateFBReport=true)
{
    $templetPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'kwaiTemplate';
    $outputName = 'kwai_facebook.xlsx';
    $tempFile = $templetPath . DIRECTORY_SEPARATOR . 'kwai_data.xlsx';
    $kwaiFile = $templetPath . DIRECTORY_SEPARATOR . 'kwai_data_new.xlsx';

    if($isGenerateFBReport)
    {
        exportFacebookReport($templetPath, $outputName);
    }

    $facebookFile = $templetPath . DIRECTORY_SEPARATOR . $outputName;
    $fbData = ReportExcelHelper::readFBReportData($facebookFile);
    ReportExcelHelper::rewriteKwaiReport($tempFile, $kwaiFile, $fbData);

}

function exportFacebookReport($outputPath, $outputName)
{
    $filePath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'conf'. DIRECTORY_SEPARATOR . 'basicConfig_kwai_ID.json';
    $templatePath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'template' . DIRECTORY_SEPARATOR . 'template.xlsx';

    ReportRun::exportDefaultReportByOs($filePath, $templatePath, $outputPath, $outputName);
}
