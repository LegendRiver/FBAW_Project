<?php


class DailyReachCalculator
{
    public static function calculateDailyReach(ExportTargetingEntity $exportEntity, $dailyBudget, $bidAmount)
    {
        $curveArray = $exportEntity->getCurve();
        if(empty($curveArray))
        {
            return;
        }
        $budgetCurveEntity = self::calEstimateReachByBudget($curveArray, $dailyBudget, $bidAmount);

        $estimateReachBound = self::getReachEstimateBounds($budgetCurveEntity->getReach(), $exportEntity->getDau());
        $reachMin = round($estimateReachBound[ExportCsvConstant::ESTIMATE_REACH_MIN]/100, 0)*100;
        $reachMax = round($estimateReachBound[ExportCsvConstant::ESTIMATE_REACH_MAX]/100, 0)*100;
        $exportEntity->setDailyReachMin($reachMin);
        $exportEntity->setDailyReachMax($reachMax);
    }

    public static function exportCurveCsv(ExportTargetingEntity $exportEntity)
    {
        $curveArray = $exportEntity->getCurve();

        $resultArray = array();
        $csvtitle = array('bid', 'spend', 'reach', 'impression', 'action');
        $resultArray[] = $csvtitle;

        foreach($curveArray as $curve)
        {
            $resultArray[] = array_values($curve);
        }

        $fileName = $exportEntity->getId() . '_' . $exportEntity->getTitleDescription() . '.csv';

        FileHelper::saveCsv($fileName, $resultArray);
    }

    public static function calculateCVR(ExportTargetingEntity $exportEntity)
    {
        $capCurveData = $exportEntity->getCpaCurveData();
        $dau = $exportEntity->getDau();
        if(empty($capCurveData))
        {
            return 0;
        }

        $parsedCurveData = self::parseCurveStrData($capCurveData);
        if(empty($parsedCurveData))
        {
            return 0;
        }

        $lastPointData = array_pop($parsedCurveData);
        $curveEntity = self::buildCurveDataEntity($lastPointData, $dau);

        return CommonHelper::divisionOperate($curveEntity->getActions(), $curveEntity->getImpression());
    }

    private static function getReachEstimateBounds($reach, $dau=0)
    {
        if(empty($dau))
        {
            $dau = PHP_INT_MAX;
        }

        $minValue = min($reach*(1 - 0.45), 0.98 * $dau);
        $maxValue = min($reach*(1+0.45), $dau);

        return array(ExportCsvConstant::ESTIMATE_REACH_MIN => $minValue, ExportCsvConstant::ESTIMATE_REACH_MAX => $maxValue,);
    }

    private static function calEstimateReachByBudget($curveArray, $dailyBudget, $bidAmount)
    {
        $curveDataEntity = new CurveDataEntity();

        if(empty($curveArray) || $dailyBudget <= 0)
        {
            return $curveDataEntity;
        }

        if(empty($bidAmount))
        {
            $bidAmount = PHP_INT_MAX;
        }

        $totalCount = count($curveArray);
        for($index=0; $index < $totalCount; ++$index)
        {
            $curveInfo = $curveArray[$index];
            $spend = $curveInfo[AdManageConstants::CURVE_DATA_FIELD_SPEND];
            $bid = $curveInfo[ExportCsvConstant::CURVE_DATA_FIELD_BID];

            if($spend > $dailyBudget || $bid > $bidAmount)
            {
                break;
            }
        }

        if(0 === $index)
        {
            $firstCurve = $curveArray[0];
            $emptyCurve = self::getEmptyCurve();
            $newBudget = self::getInterpolateBudget($dailyBudget, $bidAmount, $emptyCurve, $firstCurve);
            $interpolateCurve = self::interpolatePointFromSpend($newBudget, $emptyCurve, $firstCurve);
        }
        else if($index === $totalCount)
        {
            $interpolateCurve = $curveArray[$totalCount-1];
        }
        else
        {
            $preCurve = $curveArray[$index-1];
            $postCurve = $curveArray[$index];

            $newBudget = self::getInterpolateBudget($dailyBudget, $bidAmount, $preCurve, $postCurve);
            $interpolateCurve = self::interpolatePointFromSpend($newBudget, $preCurve, $postCurve);
        }

        $curveDataEntity->setSpend($interpolateCurve[AdManageConstants::CURVE_DATA_FIELD_SPEND]);
        $curveDataEntity->setActions($interpolateCurve[AdManageConstants::CURVE_DATA_FIELD_ACTION]);
        $curveDataEntity->setReach($interpolateCurve[AdManageConstants::CURVE_DATA_FIELD_REACH]);
        $curveDataEntity->setImpression($interpolateCurve[AdManageConstants::CURVE_DATA_FIELD_IMPRESSION]);
        $curveDataEntity->setBid($interpolateCurve[ExportCsvConstant::CURVE_DATA_FIELD_BID]);

        return $curveDataEntity;
    }

    private static function getInterpolateBudget($budget, $bid, $preCurve, $postCurve)
    {
        $budgetProportion = ($budget - $preCurve[AdManageConstants::CURVE_DATA_FIELD_SPEND]) / ($postCurve[AdManageConstants::CURVE_DATA_FIELD_SPEND] - $preCurve[AdManageConstants::CURVE_DATA_FIELD_SPEND]);
        if($bid > 0)
        {
            $bidProportion = ($bid - $preCurve[ExportCsvConstant::CURVE_DATA_FIELD_BID])/($postCurve[ExportCsvConstant::CURVE_DATA_FIELD_BID] - $preCurve[ExportCsvConstant::CURVE_DATA_FIELD_BID]);
            $budgetProportion = min($budgetProportion, $bidProportion);
        }

        return $preCurve[AdManageConstants::CURVE_DATA_FIELD_SPEND] + $budgetProportion * ($postCurve[AdManageConstants::CURVE_DATA_FIELD_SPEND] - $preCurve[AdManageConstants::CURVE_DATA_FIELD_SPEND]);
    }

    private static function interpolatePointFromSpend($budget, $curveFirst, $curveSecond)
    {
        $differenceSpend = $curveSecond[AdManageConstants::CURVE_DATA_FIELD_SPEND] - $curveFirst[AdManageConstants::CURVE_DATA_FIELD_SPEND];
        $differenceBudget = $budget - $curveFirst[AdManageConstants::CURVE_DATA_FIELD_SPEND];

        $newCurveData = array();
        foreach(self::$curveKeys as $key)
        {
            $proportion = ($curveSecond[$key] - $curveFirst[$key])/$differenceSpend;
            $newValue = $curveFirst[$key] + $differenceBudget * $proportion;
            $newCurveData[$key] = $newValue;
        }

        return $newCurveData;
    }

    private static function getEmptyCurve()
    {
        return array(
            AdManageConstants::CURVE_DATA_FIELD_ACTION => 0,
            ExportCsvConstant::CURVE_DATA_FIELD_BID => 0,
            AdManageConstants::CURVE_DATA_FIELD_IMPRESSION => 0,
            AdManageConstants::CURVE_DATA_FIELD_REACH => 0,
            AdManageConstants::CURVE_DATA_FIELD_SPEND => 0
        );
    }

    private static function parseCurveStrData($curveData)
    {
        $curveList = explode(';', $curveData);
        $fieldLen = count(self::$curveFieldNames);

        $parsedDataArray = array();

        foreach($curveList as $dataStr)
        {
            $dataTuple = explode(':', $dataStr);
            if(count($dataTuple) != $fieldLen)
            {
                return array();
            }

            $combineData = array_combine(self::$curveFieldNames, $dataTuple);
            $parsedDataArray[] = $combineData;
        }

        return $parsedDataArray;
    }

    private static function buildCurveDataEntity($originalData, $dua)
    {
        $entity = new CurveDataEntity();

        $entity->setActions($originalData["action_median"]);
        $entity->setBid($originalData["bid"]);
        $entity->setImpression($originalData["imp_median"]);
        $entity->setReach($originalData["reach_median"]*$dua/100);
        $entity->setSpend($originalData["spend_median"]);

        return $entity;
    }


    private static $curveFieldNames = array(
        "bid", "spend_median", "spend_min", "spend_max", "reach_median", "reach_min", "reach_max",
        "imp_median", "imp_min", "imp_max", "action_median", "action_min", "action_max");

    private static $curveKeys = array(
            AdManageConstants::CURVE_DATA_FIELD_ACTION,
            ExportCsvConstant::CURVE_DATA_FIELD_BID,
            AdManageConstants::CURVE_DATA_FIELD_IMPRESSION,
            AdManageConstants::CURVE_DATA_FIELD_REACH,
            AdManageConstants::CURVE_DATA_FIELD_SPEND
        );
}