<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

ruleTask();

function ruleTask()
{
    $configPath = __DIR__ . DIRECTORY_SEPARATOR . 'conf' .DIRECTORY_SEPARATOR;
    $configFileName = 'ruleConfig.json';

    $handler = new RuleHandler($configPath, $configFileName);

    $handler->handleRule();
}