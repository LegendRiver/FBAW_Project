<?php
require_once(__DIR__ . "/../../includeFile/basicIncludeFile.php");
require_once(__DIR__ . "/../../includeFile/googleIncludeFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

createUAC();

function createUAC()
{
    $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'conf' . DIRECTORY_SEPARATOR . 'uac_conf.json';
    $builder = new UACParameterBuilder($configFile);
    $paramList = $builder->buildUacParam();
    foreach ($paramList as $param)
    {
        AWManagerFacade::createUAC($param);
    }

}

