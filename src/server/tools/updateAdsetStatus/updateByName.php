<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

pauseAdsetByName();

function pauseAdsetByName()
{
    $csvfile = __DIR__ . DIRECTORY_SEPARATOR . 'adsetName.csv';
    $nameArray = FileHelper::readCsv($csvfile);
    $nameList = getAdsetName($nameArray);

    $accountIds = array(
        'act_783764875138673',
        'act_783764881805339',
        'act_783764878472006',
    );

    $adsetList = array();
    $filterStatus = array(AdManageConstants::EFFECTIVE_STATUS_ACTIVE);
    foreach ($accountIds as $actId)
    {
        $adsets = AdManagerFacade::getAdSetEntity($actId, AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT, $filterStatus, true);
        $adsetList = array_merge($adsetList, $adsets);
    }

    $status = 'PAUSED';
    foreach($adsetList as $entity)
    {
        $adsetName = $entity->getName();
        if(in_array($adsetName, $nameList))
        {
            $adsetId = $entity->getId();
            $updateStatus = AdManagerFacade::updateAdSetStatus($adsetId, $status);
            if(false === $updateStatus)
            {
                print_r('!!!!!Failed to pause adset: ' . $adsetName .'......'. PHP_EOL);
                ServerLogger::instance()->writeLog(Info, '!!!!!Failed to pause adset: ' . $adsetName);
            }
            else
            {
                print_r('@@@@@@Succeed to pause adset:' . $adsetName .'......'. PHP_EOL);
                ServerLogger::instance()->writeLog(Info, '@@@@@@Succeed to pause adset:' . $adsetName);
            }
        }
    }
}

function getAdsetName($nameArray)
{
    $result = array();
    foreach ($nameArray as $row)
    {
        $result[] = $row[0];
    }

    return $result;
}