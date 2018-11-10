<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");

run();

function run()
{
    $configPath = __DIR__ . DIRECTORY_SEPARATOR . 'budgetConfig.json';
    $configInfo = FileHelper::readJsonFile($configPath);

    $updateList = $configInfo['updateInfo'];
    foreach($updateList as $updateInfo)
    {
        $adsetId = $updateInfo['adsetId'];
        $budgetAmount = $updateInfo['budgetAmount'];

        if(empty($adsetId))
        {
            continue;
        }
        $adsetEntity = AdManagerFacade::getAdsetById($adsetId);
        if(false === $adsetEntity)
        {
            echo 'Failed to read adset info : ' . $adsetId . PHP_EOL;
            continue;
        }

        $dailyBudget = $adsetEntity->getDailyBudget();
        $isDailyBudget = $dailyBudget > 0;

        $updateResult = AdManagerFacade::updateAdsetBudget($adsetId, $budgetAmount, $isDailyBudget);
        if(false === $updateResult)
        {
            echo 'Failed to update budget of adset : ' . $adsetId . PHP_EOL;
        }
    }
}
