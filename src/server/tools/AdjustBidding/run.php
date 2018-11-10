<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

adjust();

function adjust()
{
   $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'conf.json';
   $manager = new BidAdjustManager();
   $manager->initAdjustConf($configFile);
   $manager->adjustBid();
}