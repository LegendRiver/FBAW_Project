<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

duplicateCarousel();

function duplicateCarousel()
{
    $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'conf/duplicate_conf.json';

    $handler = new CarouselHandler($configFile);
    $handler->duplicateAd();
}