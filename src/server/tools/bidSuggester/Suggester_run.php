<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");
require_once(__DIR__ . "/../../includeFile/adManagerIncludeFile.php");

runBidSuggest();

function runBidSuggest()
{
    $path = __DIR__;
    $jsonFile = $path . "/adsetInfo.json";

    $helper = new SuggestBidHelper($path);
    $helper->exportSuggestBidFile($jsonFile);
}
