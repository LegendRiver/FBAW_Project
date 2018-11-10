<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

scanAllAccount();

function scanAllAccount()
{
    $accountConfFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'AdInsightExporter' . DIRECTORY_SEPARATOR .
        'conf' . DIRECTORY_SEPARATOR . 'accountList.json';
    $handler = new ScannerHelper($accountConfFile);
    $handler->scanAd();
}
