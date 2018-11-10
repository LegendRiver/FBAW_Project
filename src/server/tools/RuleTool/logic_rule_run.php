<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

ruleTask();

function ruleTask()
{
    $configPath = __DIR__ . DIRECTORY_SEPARATOR . 'conf' .DIRECTORY_SEPARATOR;
    $configFileName = 'ruleConfig_sougou.json';

    $handler = new LogicRuleHandler($configPath, $configFileName);

    $handler->handleRule();
}