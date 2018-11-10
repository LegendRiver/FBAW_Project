<?php
require_once(__DIR__ . "/../../includeFile/basicIncludeFile.php");
require_once(__DIR__ . "/../../includeFile/googleIncludeFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

//exportCampaignPerformance();
autoExportConversion();

function autoExportConversion()
{
    $conversionFile = exportCampaignPerformance();
    if(!file_exists($conversionFile))
    {
        return;
    }

    $mergerFile = execPython();
    $toAddressList = array('business@eliads.com');
    $subject = sprintf('AW_Conversion_%s', CommonHelper::getTodayDate());
    $message = 'Adwords conversions.';
    MailerHelper::instance()->sendMail($toAddressList, $subject, $message, array(), $attachmentFilePath = array($mergerFile));

}

function execPython()
{
    $dateStr = CommonHelper::getTodayDate();
    $currentDir = "/var/www/html/eli/server/awConversion" . DIRECTORY_SEPARATOR . $dateStr;

    $pythonCommand = "/home/ubuntu/anaconda2/envs/eli_analysis/bin/python";
    $spiderPath = PathManager::instance()->getSpiderPythonPath();
    $spiderScript = "appsfly_spider/af_aw_main.py";
    $spiderScript = $spiderPath . $spiderScript;

    $mergerPath = PathManager::instance()->getAnalysisPythonPath();
    $mergerScript = "insight_analysis/script/aw_conversion/aw_conv_reten_export.py";
    $mergerScript = $mergerPath . $mergerScript;

    $spiderCommand = $pythonCommand . ' ' . $spiderScript;
    exec($spiderCommand, $resultArray, $returnValue);
    if(0 !== $returnValue)
    {
        ServerLogger::instance()->writeLog(Error, '#aw_conversion#Failed to exec spider script: ' . $returnValue);
        return false;
    }
    $afFile = $currentDir . DIRECTORY_SEPARATOR . 'retention_data.xlsx';
    if(!file_exists($afFile))
    {
        ServerLogger::instance()->writeLog(Error, '#aw_conversion#Failed to generate file: ' . $afFile);
        return false;
    }

    $mergerCommand = $pythonCommand . ' ' . $mergerScript;
    exec($mergerCommand, $resultArray, $returnValue);
    if(0 !== $returnValue)
    {
        ServerLogger::instance()->writeLog(Error, '#aw_conversion#Failed to exec merger script: ' . $returnValue);
        return false;
    }
    $profitFile = $currentDir . DIRECTORY_SEPARATOR . 'adword_conversion.xlsx';
    if(!file_exists($profitFile))
    {
        ServerLogger::instance()->writeLog(Error, '#aw_conversion#Failed to generate file: ' . $profitFile);
        return false;
    }

    return $profitFile;
}

function exportCampaignPerformance()
{
    $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'conf' . DIRECTORY_SEPARATOR . 'cam_performance_conf.json';
    $configInfo = FileHelper::readJsonFile($configFile);
    $nodeList = $configInfo['configList'];
    $outputPath = $configInfo['outputPath'];
    $dateStr = CommonHelper::getTodayDate();
    $currentDir = $outputPath . DIRECTORY_SEPARATOR . $dateStr;
    if(false === FileHelper::createDir($currentDir))
    {
        ServerLogger::instance()->writeLog(Error, '#conversion export#Failed to create dir: ' . $currentDir);
        return '';
    }

    $awqlTem = 'SELECT AccountDescriptiveName, Date, CampaignName, CampaignId, Conversions, AllConversions, Cost'.
        ' FROM CAMPAIGN_PERFORMANCE_REPORT DURING ';
    $reportData = array();
    foreach($nodeList as $node)
    {
        $nodeIds = $node['accountId'];
        $startDate = $node['startDate'];
        $endDate = $node['endDate'];
        if(empty($endDate))
        {
            $endDate = CommonHelper::getDeltaDate(-2, 'Ymd');
        }

        if(empty($startDate))
        {
            $startDate = CommonHelper::getDeltaDate(-9, 'Ymd');
        }

        $awql = $awqlTem . $startDate . ',' . $endDate;

        foreach($nodeIds as $accountId)
        {
            $campaignData = AWManagerFacade::queryCampaignReport($accountId, $awql);
            if(false === $campaignData)
            {
                ServerLogger::instance()->writeLog(Error, 'Failed to export campaign performance.');
                continue;
            }

            $reportData = array_merge($reportData, $campaignData);
        }
    }

    if(!empty($reportData))
    {
        $conversionFile = $currentDir . DIRECTORY_SEPARATOR . 'conversion.csv';
        FileHelper::saveCsv($conversionFile, $reportData);
        return $conversionFile;
    }
    return '';
}