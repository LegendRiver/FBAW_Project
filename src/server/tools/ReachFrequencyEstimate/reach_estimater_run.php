<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

getReachFrequencyEstimate();

function getReachFrequencyEstimate()
{
    $estimateParamConf = __DIR__ . DIRECTORY_SEPARATOR . 'param_conf.json';
    $estimateParam = FileHelper::readJsonFile($estimateParamConf);

    $ctlFile = __DIR__ . DIRECTORY_SEPARATOR . 'ctl_conf.json';
    $ctlInfo = FileHelper::readJsonFile($ctlFile);
    $accountId = $ctlInfo['actId'];
    $targetingAdset = $ctlInfo['targetingAdsetId'];
    $budgetList = $ctlInfo['budgetList'];
    $isExportClick = $ctlInfo['isExportClick'];
    $isExportConversion = $ctlInfo['isExportConversion'];

    $estimateParam = updateTargeting($targetingAdset, $estimateParam);
    $entity = TargetingSearchUtil::estimateReachFrequency($accountId, $estimateParam);

    if(false === $entity)
    {
        ServerLogger::instance()->writeLog(Error, 'Failed to estimate reach and frequency.');
        return;
    }

    $curveData = $entity->getCurveBudgetReach();
    $helper = new ReachFrequencyHelper($curveData);

    $outputPath = __DIR__ . DIRECTORY_SEPARATOR . 'output';
    $estimateFile = $outputPath . DIRECTORY_SEPARATOR . 'estimate_' . time() . '.csv';
    $estimateArray = array();
    foreach($budgetList as $budget)
    {
        $budgetEstimate = $helper->getCurValuesByBudget($budget, $isExportClick, $isExportConversion);
        if(empty($estimateArray))
        {
            $estimateArray[] = array_keys($budgetEstimate);
        }

        $estimateArray[] = array_values($budgetEstimate);
    }
    if(!empty($estimateArray))
    {
        FileHelper::saveCsv($estimateFile, $estimateArray);
    }

    $reachCurveData = $helper->exportCurveData();
    $curveFile = $outputPath . DIRECTORY_SEPARATOR . 'reach_curve_' . time() . '.csv';
    FileHelper::saveCsv($curveFile, $reachCurveData);
}


function updateTargeting($adsetId, $param)
{
    if(empty($adsetId))
    {
        return $param;
    }

    $adsetInfo = AdManagerFacade::getAdsetById($adsetId);
    $targeting = $adsetInfo->getTargeting();

    $param['target_spec'] = $targeting;
    return $param;
}