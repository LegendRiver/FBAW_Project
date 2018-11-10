<?php
require_once(__DIR__ . "/../includeFile/interfaceInitFile.php");

queryAdReport();

function queryAdReport()
{
    $currentDate = date(BasicConstants::DATE_DEFAULT_FORMAT);
    ServerLogger::instance()->writeLog(Info, 'The script is running at ' . $currentDate);
    $task = new QueryFbInsightTask();
    $task->runAdReportExport();
}