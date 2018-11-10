<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

generateHotdayReport();

function generateHotdayReport()
{
    $rootPath = dirname(__DIR__) . DIRECTORY_SEPARATOR;
    $handler = new HotdayReportHandler($rootPath);
    $handler->exportReport();
}