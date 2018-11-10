<?php


class ReachFrequencyHelper
{
    private $reachPoints;

    private $budgetPoints;

    private $impressionPoints;

    private $clickPoints;

    private $conversionPoints;

    private $pointsNum;

    public function __construct($curveData)
    {
        $decodeData = json_decode($curveData, true);
        $this->reachPoints = $decodeData[ReachFrequencyConstants::FIELD_CURVE_REACH];
        $this->budgetPoints = $decodeData[ReachFrequencyConstants::FIELD_CURVE_BUDGET];
        $this->impressionPoints = $decodeData[ReachFrequencyConstants::FIELD_CURVE_IMPRESSION];
        $this->clickPoints = $decodeData[ReachFrequencyConstants::FIELD_CURVE_CLICK];
        $this->conversionPoints = $decodeData[ReachFrequencyConstants::FIELD_CURVE_CONVERSION];

        $this->pointsNum = $decodeData[ReachFrequencyConstants::FIELD_CURVE_NUM_POINTS];
    }

    public function exportCurveData()
    {
        $csvTitle = array(
            ReachFrequencyConstants::FIELD_CURVE_BUDGET,
            ReachFrequencyConstants::FIELD_CURVE_REACH,
            ReachFrequencyConstants::FIELD_CURVE_IMPRESSION,
            ReachFrequencyConstants::FIELD_CURVE_CLICK,
            ReachFrequencyConstants::FIELD_CURVE_CONVERSION,
        );

        $csvData = $this->getTCsvData();
        array_unshift($csvData, $csvTitle);

        return $csvData;
    }


    public function getCurValuesByBudget($curBudget, $isExportClick=false, $isExportConversion=false)
    {
        $indexArray = $this->getNeighbourPointIndex($this->budgetPoints, $curBudget);
        $minIndex = $indexArray[ReachFrequencyConstants::POINT_MIN_INDEX];
        $maxIndex = $indexArray[ReachFrequencyConstants::POINT_MAX_INDEX];
        $proportion = ($curBudget - $this->budgetPoints[$minIndex])/($this->budgetPoints[$maxIndex] - $this->budgetPoints[$minIndex]);

        $resultArray = array();
        $reach = $this->reachPoints[$minIndex] + $proportion*($this->reachPoints[$maxIndex] - $this->reachPoints[$minIndex]);
        $impression = $this->impressionPoints[$minIndex] + $proportion*($this->impressionPoints[$maxIndex] - $this->impressionPoints[$minIndex]);
        $frequency = round($impression/$reach, 2);
        $cpm = round($curBudget*10/$impression, 2);
        $resultArray['budget'] = $curBudget;
        $resultArray['reach'] = round($reach, 0);
        $resultArray['impression'] = round($impression, 0);
        $resultArray['frequency'] = $frequency;
        $resultArray['cpm'] = $cpm;

        if($isExportClick)
        {
            $click = $this->clickPoints[$minIndex] + $proportion*($this->clickPoints[$maxIndex] - $this->clickPoints[$minIndex]);
            $ctr = round($click*100/$impression, 2);
            $cpc = round($curBudget/($click*100), 2);
            $resultArray['click'] = round($click, 0);
            $resultArray['ctr'] = $ctr;
            $resultArray['cpc'] = $cpc;
        }
        if($isExportConversion)
        {
            $click = $this->clickPoints[$minIndex] + $proportion*($this->clickPoints[$maxIndex] - $this->clickPoints[$minIndex]);
            $conversion = $this->conversionPoints[$minIndex] + $proportion*($this->conversionPoints[$maxIndex] - $this->conversionPoints[$minIndex]);
            $cvr = round($conversion*100/$click, 2);
            $cpi = round($curBudget/($conversion*100), 2);
            $resultArray['conversion'] = round($conversion, 0);
            $resultArray['cvr'] = $cvr;
            $resultArray['cpi'] = $cpi;

        }

        return $resultArray;
    }

    private function getTCsvData()
    {
        $csvArray = array();
        for($index=0; $index<$this->pointsNum; ++$index)
        {
            $oneRow = array();
            $oneRow[]=$this->budgetPoints[$index];
            $oneRow[]=$this->reachPoints[$index];
            $oneRow[]=$this->impressionPoints[$index];
            $oneRow[]=$this->clickPoints[$index];
            $oneRow[]=$this->conversionPoints[$index];

            $csvArray[] = $oneRow;
        }

        return $csvArray;
    }

    private function getNeighbourPointIndex($valueArray, $curValue)
    {
        $resultArray = array();

        $arrayCount = count($valueArray);
        for($index=0; $index<$arrayCount; ++$index)
        {
           if($valueArray[$index]>=$curValue)
           {
               break;
           }
        }

        $resultArray[ReachFrequencyConstants::POINT_MIN_INDEX] = $index-1;
        $resultArray[ReachFrequencyConstants::POINT_MAX_INDEX] = $index;

        return $resultArray;
    }
}