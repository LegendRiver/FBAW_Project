<?php


class BDReportHandler
{
    protected $reader;

    protected $channelId;

    protected $dateList;

    public function __construct(BDConfReader $configReader)
    {
        $this->reader = $configReader;
        $this->channelId = $this->reader->getChannelId();
        $endDate = $this->reader->getEndDate();
        if(empty($endDate))
        {
            $endDate = CommonHelper::getYesterdayDate();
        }
        $this->dateList = CommonHelper::getDateListBetweenDate($this->reader->getStartDate(), $endDate, 'Ymd');
    }

    public function exportBDReport()
    {
        $reportData = array();

        $productConfMap = $this->reader->getProductConfMap();
        foreach ($productConfMap as $productName=>$configInfo)
        {
            $productData = $this->getProductData($productName, $configInfo);
            $reportData[$productName] = $productData;
        }

        return $reportData;
    }

    private function getProductData($productName, $configInfo)
    {
        $productData = array();
        foreach ($this->dateList as $date)
        {
            $insightData = $this->getDateInsightData($date, $configInfo);
            foreach($insightData as $country=>$values)
            {
               $rowData = array();
               $rowData[] = $productName;
               $rowData[] = $date;
               $rowData[] = $this->channelId;
               $rowData[] = $country;
               $rowData = array_merge($rowData, $values);

               $productData[] = $rowData;
            }
        }

        return $productData;
    }

    private function getDateInsightData($date, $configInfo)
    {
        $countryDataMap = array();

        $nodeIds = $configInfo[ReporterConstants::REPORT_CONFIG_NAME_NODE_ID];
        $nodeType = $configInfo[ReporterConstants::REPORT_CONFIG_NAME_NODE_TYPE];

        foreach ($nodeIds as $nodeId)
        {
            $insightData = $this->getBDInsightData($nodeId, $nodeType, $date);
            foreach($insightData as $country=>$dataValues)
            {
                if(array_key_exists($country, $countryDataMap))
                {
                    $originalValues = $countryDataMap[$country];
                    $countryDataMap[$country] = array_map(array('CommonHelper','addOperate'), $originalValues, $dataValues);
                }
                else
                {
                    $countryDataMap[$country] = $dataValues;
                }
            }
        }

        return $countryDataMap;
    }

    private function getBDInsightData($nodeId, $nodeType, $dateStr)
    {
        $date = CommonHelper::dateFormatConvert('Y-m-d', $dateStr);
        if($nodeType == ReporterConstants::NODE_TYPE_ACCOUNT)
        {
            return BreakdownInsightHelper::getActBDInsightByCountry($nodeId, $date, $date);
        }
        elseif($nodeType == ReporterConstants::NODE_TYPE_CAMPAIGN)
        {
            return BreakdownInsightHelper::getCamBDInsightByCountry($nodeId, $date, $date);
        }
        elseif($nodeType == ReporterConstants::NODE_TYPE_ADSET)
        {
            return BreakdownInsightHelper::getAdsetBDInsightByCountry($nodeId, $date, $date);
        }
        else
        {
            return array();
        }
    }
}