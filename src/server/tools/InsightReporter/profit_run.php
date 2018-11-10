<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

exportProfitReport();

function exportProfitReport()
{
    try
    {
        ServerLogger::instance()->writeLog(Info, 'Start export profit ....');
        $rootPath = __DIR__ . DIRECTORY_SEPARATOR;
        $envFile = $rootPath . 'conf' . DIRECTORY_SEPARATOR . 'profit_env_conf.json';

        //read env conf
        $envConf = FileHelper::readJsonFile($envFile);
        $storePath = $envConf[ProfitAutoConstants::ENV_CONF_DATA];
        $delta = '-2';
        $dateStr = CommonHelper::getDeltaDate($delta);
        $currentDir = $storePath . DIRECTORY_SEPARATOR . $dateStr;
        if(false === FileHelper::createDir($currentDir))
        {
            ServerLogger::instance()->writeLog(Error, '#profit_auto#Failed to create dir: ' . $currentDir);
            return;
        }
        //$currentDir = $rootPath . 'output';

        //export fb data
        $configFile = $rootPath. 'conf'. DIRECTORY_SEPARATOR . 'conf_profit.json';
        $templateFile = $rootPath. 'template'. DIRECTORY_SEPARATOR . 'template_flexible.xlsx';
        ReportRun::exportProfitReportByOs($configFile, $templateFile, $currentDir,
            ProfitAutoConstants::FB_FILE_NAME, $dateStr, $dateStr);

        //调用python
        $profitFile = execPython($currentDir, $envConf, $delta);
        if(false === $profitFile)
        {
            return;
        }

        //发送email
        $toAddressList = $envConf[ProfitAutoConstants::TO_ADDRESS];
        $subject = sprintf($envConf[ProfitAutoConstants::MAIL_TITLE], $dateStr);
        $message = $envConf[ProfitAutoConstants::MAIL_CONTENT];
        MailerHelper::instance()->sendMail($toAddressList, $subject, $message, array(), $attachmentFilePath = array($profitFile));

        ServerLogger::instance()->writeLog(Info, 'Succeed to export profit');

    }
    catch (Exception $e)
    {
        ServerLogger::instance()->writeExceptionLog(Error, $e);
        return;
    }

}

function execPython($currentDir, $envConf, $days = '')
{
    if (empty($days))
    {
       $deltaDays = '';
    }
    else
    {
        $deltaDays = ' ' . $days;
    }

    $pythonCommand = $envConf[ProfitAutoConstants::ENV_CONF_PYTHON];
    $spiderPath = PathManager::instance()->getSpiderPythonPath();
    $spiderScript = $envConf[ProfitAutoConstants::ENV_CONF_SPIDER];
    $spiderScript = $spiderPath . $spiderScript;

    $mergerPath = PathManager::instance()->getAnalysisPythonPath();
    $mergerScript = $envConf[ProfitAutoConstants::ENV_CONF_MERGER];
    $mergerScript = $mergerPath . $mergerScript;

    $spiderCommand = $pythonCommand . ' ' . $spiderScript . $deltaDays;
    exec($spiderCommand, $resultArray, $returnValue);
    if(0 !== $returnValue)
    {
        ServerLogger::instance()->writeLog(Error, '#profit_auto#Failed to exec spider script: ' . $returnValue);
        return false;
    }
    $afFile = $currentDir . DIRECTORY_SEPARATOR . ProfitAutoConstants::AF_FILE_NAME;
    if(!file_exists($afFile))
    {
        ServerLogger::instance()->writeLog(Error, '#profit_auto#Failed to generate file: ' . $afFile);
        return false;
    }

    $mergerCommand = $pythonCommand . ' ' . $mergerScript . $deltaDays;
    exec($mergerCommand, $resultArray, $returnValue);
    if(0 !== $returnValue)
    {
        ServerLogger::instance()->writeLog(Error, '#profit_auto#Failed to exec merger script: ' . $returnValue);
        return false;
    }
    $profitFile = $currentDir . DIRECTORY_SEPARATOR . ProfitAutoConstants::PROFIT_FILE_NAME;
    if(!file_exists($profitFile))
    {
        ServerLogger::instance()->writeLog(Error, '#profit_auto#Failed to generate file: ' . $profitFile);
        return false;
    }

    return $profitFile;
}