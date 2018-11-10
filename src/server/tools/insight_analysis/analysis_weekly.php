<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");

weekly_analysis_insight();

function weekly_analysis_insight()
{
    $rootPath = __DIR__ . DIRECTORY_SEPARATOR;
    $envFile = $rootPath . 'env_conf.json';

    //read env conf
    $envConf = FileHelper::readJsonFile($envFile);

    execPythonScript($envConf);

    sendEmail($envConf);
}

function execPythonScript($envConf)
{
    $pythonCommand = $envConf['pythonDir'];

    $analysisPath = PathManager::instance()->getAnalysisPythonPath();
    $pythonScript = $envConf['script'];
    $pythonScript = $analysisPath . $pythonScript;

    $weeklyCommand = $pythonCommand . ' ' . $pythonScript;
    exec($weeklyCommand, $resultArray, $returnValue);
    if(0 !== $returnValue)
    {
        ServerLogger::instance()->writeLog(Error, '#weekly analysis#Failed to exec weekly script: ' . $returnValue);
        return false;
    }
}

function sendEmail($envConf)
{
    $today_date = CommonHelper::getTodayDate();
    $outputPath = $envConf['outputPath'];
    if(empty($outputPath))
    {
        $outputPath = __DIR__;
    }

    $mailAddress = $envConf['mailToAddress'];
    $mailTitle = $envConf['mailTitle'];
    $mailContent = $envConf['mailContent'];

    $outputPath .= DIRECTORY_SEPARATOR;
    $outputPath .= $today_date;

    $fileList = FileHelper::getFileList($outputPath);
    foreach ($fileList as $analysisFile)
    {
        $fileName = basename($analysisFile);
        $pos = strpos($fileName, '_');
        if(false === $pos)
        {
            $pos = strlen($fileName);
        }
        $accountName = substr($fileName, 0, $pos);

        $title = sprintf($mailTitle, $accountName);
        MailerHelper::instance()-> sendMail($mailAddress, $title, $mailContent, array(), array($analysisFile));
    }
}