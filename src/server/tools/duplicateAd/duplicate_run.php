<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

duplicateAd();

function duplicateAd()
{
   $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'conf/duplicate_conf.json';

   $handler = new DuplicateHandler($configFile);
   $handler->duplicateAd();
}