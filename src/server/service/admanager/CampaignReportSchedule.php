<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");

queryCampaignReport();

function queryCampaignReport()
{
    $currentDate = date(BasicConstants::DATE_DEFAULT_FORMAT);
    ServerLogger::instance()->writeLog(Info, 'The script is running at ' . $currentDate);
    $tryTime = 20;
    while($tryTime > 0)
    {
        $task = new QueryFbInsightTask();
        $task->runCampaignReportExport();
        --$tryTime;
        ServerLogger::instance()->writeLog(Error, $tryTime . PHP_EOL);
        sleep(120);
    }
}