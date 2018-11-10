<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

getAccountSpend();

function exportAccountInfo()
{
    $allAccounts = AdManagerFacade::getAllAccountsByBMId(AdManageConstants::DEFAULT_BM_ID);
    if(empty($allAccounts))
    {
        return;
    }

    $exportData = array();
    $csvTitle = array(
        'account_name',
        'account_id',
        'spend_cap',
        'amount_spend'
    );
    $exportData[] = $csvTitle;

    foreach($allAccounts as $accountEntity)
    {
        $spendCap = $accountEntity->getSpendCap();
        $spendAmount = $accountEntity->getAmountSpend();
        if($spendAmount > 1000 || $spendCap > 100)
        {
            $rowData = array();
            $rowData[] = $accountEntity->getName();
            $rowData[] = $accountEntity->getId();
            $rowData[] = $spendCap/100;
            $rowData[] = $spendAmount/100;
            $exportData[] = $rowData;
        }
    }

    $outputFile = __DIR__ . DIRECTORY_SEPARATOR . 'account_spend_' . time() . '.csv';
    FileHelper::saveCsv($outputFile, $exportData);
}

function getAccountSpend()
{
    $dateStart = '2018-04-01';
    $dateEnd = '2018-04-30';

    $allAccounts = AdManagerFacade::getAllAccountsByBMId(AdManageConstants::DEFAULT_BM_ID);
    if(empty($allAccounts))
    {
        return;
    }

    $exportData = array();
    $csvTitle = array(
        'account_name',
        'account_id',
        'spend'
    );
    $exportData[] = $csvTitle;

    foreach($allAccounts as $accountEntity)
    {
        $accountId = $accountEntity->getId();
        $accountName = $accountEntity->getName();
        $insightArray = AdManagerFacade::getOneAccountInsight($accountId, $dateStart, $dateEnd);
        if(false === $insightArray)
        {
            print_r('Failed to export insight of account : ' . $accountId . PHP_EOL);
            continue;
        }

        if(empty($insightArray))
        {
            continue;
        }
        $insightData = $insightArray[0];

        $spend = $insightData->getSpend();

        $rowData = array();
        $rowData[] = $accountName;
        $rowData[] = $accountId;
        $rowData[] = $spend;

        $exportData[] = $rowData;
    }

    $outputFile = __DIR__ . DIRECTORY_SEPARATOR . 'account_spend_' . time() . '.csv';
    FileHelper::saveCsv($outputFile, $exportData);

}