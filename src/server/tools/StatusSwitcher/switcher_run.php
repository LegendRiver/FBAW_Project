<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

run();

function run()
{
    $configPath = __DIR__ . DIRECTORY_SEPARATOR . 'switchConfig.json';
    $configInfo = FileHelper::readJsonFile($configPath);

    $nodeConfigList = $configInfo[SwitcherConstants::CONFIG_ITEM_NODE];
    $currentTimeStamp = CommonHelper::getCurrentTimeStamp();
    $currentDate = date('Y-m-d');

    foreach($nodeConfigList as $nodeConfig)
    {
        $nodeIdList = $nodeConfig[SwitcherConstants::CONFIG_NODE_ID];
        $nodeType = $nodeConfig[SwitcherConstants::CONFIG_NODE_TYPE];
        $activeTime = $nodeConfig[SwitcherConstants::CONFIG_ACTIVE_TIME];
        $inactiveTime = $nodeConfig[SwitcherConstants::CONFIG_INACTIVE_TIME];

        $isActive = !empty(trim($activeTime));
        $isInActive = !empty(trim($inactiveTime));

        $activeTime = $currentDate . ' ' . $activeTime;
        $inactiveTime = $currentDate . ' ' . $inactiveTime;

        $activeStamp = strtotime($activeTime);
        $inactiveStamp = strtotime($inactiveTime);

        $activeCondition = abs($currentTimeStamp - $activeStamp);
        if($isActive && $activeCondition < SwitcherConstants::TIME_RANGE_THRESHOLD)
        {
            SwitcherHelper::activeNodes($nodeIdList, $nodeType);
        }

        $inactiveCondition = abs($currentTimeStamp - $inactiveStamp);
        if($isInActive && $inactiveCondition < SwitcherConstants::TIME_RANGE_THRESHOLD)
        {
            SwitcherHelper::inactiveNodes($nodeIdList, $nodeType);
        }
    }
}