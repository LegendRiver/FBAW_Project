<?php


class ReporterInsightHelper
{
    private $channelId;

    protected $dateList;

    protected $startDate;

    protected $endDate;

    private $configReader;

    private $insightFieldConfig;

    public function __construct(ConfigFileReader $reader, $insightFieldConf=array())
    {
        $this->configReader = $reader;
        $this->channelId = $reader->getChannelId();
        $this->endDate = $reader->getEndDate();
        if(empty($this->endDate))
        {
            $this->endDate = CommonHelper::getYesterdayDate();
        }
        $this->startDate = $reader->getStartDate();
        $this->dateList = CommonHelper::getDateListBetweenDate($this->startDate, $this->endDate, 'Ymd');

        if(empty($insightFieldConf))
        {
            $insightFieldConf = InsightValueReader::buildInstallConfig();
        }
        $this->insightFieldConfig = $insightFieldConf;
    }

    public function getReporterData()
    {
        $reportData = array();
        $productList = $this->configReader->getProductCampaignMap();
        foreach($productList as $name=>$campaignList)
        {
            $productData = $this->getOneProductData($name, $campaignList);
            if(false === $productData)
            {
                return array();
            }

            $reportData[$name] = $productData;
        }

        return $reportData;
    }

    private function getOneProductData($name, $campaignConfigList)
    {
        $productData = array();
        foreach($campaignConfigList as $campaignConfig)
        {
            $geo = $campaignConfig[ReporterConstants::REPORT_CONFIG_NAME_GEO];
            if(empty($geo))
            {
                continue;
            }

            $campaignIdList = $campaignConfig[ReporterConstants::REPORT_CONFIG_NAME_CAMPAIGN_ID];
            $insightData = $this->getGEOCampaignData($campaignIdList);
            if(false === $insightData)
            {
                return false;
            }

            $geoRows = $this->buildSheetRows($name, $geo, $insightData);

            $productData = array_merge($productData, $geoRows);
        }

        return $productData;
    }

    private function buildSheetRows($name, $geo, $insightData)
    {
        $sheetRowDatas = array();

        foreach($insightData as $date=>$result)
        {
            if(CommonHelper::isArrayAllEmpty($result))
            {
                continue;
            }

            $oneRow = array();
            $oneRow[] = $name;
            $oneRow[] = $date;
            $oneRow[] = $this->channelId;
            $oneRow[] = $geo;
            $oneRow = array_merge($oneRow, $result);

            $sheetRowDatas[] = $oneRow;
        }

        return $sheetRowDatas;
    }

    private function getGEOCampaignData($campaignIdList)
    {
        $resultValues = array();

        foreach($campaignIdList as $campaignId)
        {
            $campaignData = $this->getOneCampaignData($campaignId);
            if(false === $campaignData)
            {
                return false;
            }

            if(empty($campaignData))
            {
                continue;
            }

            if(empty($resultValues))
            {
                $resultValues = $campaignData;
                continue;
            }

            $resultValues = $this->addDateValueArray($resultValues, $campaignData);
        }

        return $resultValues;
    }

    private function addDateValueArray($firstArray, $secondArray)
    {
        foreach($this->dateList as $dateStr)
        {
            $firstArray[$dateStr] = array_map(array('CommonHelper','addOperate'), $firstArray[$dateStr],
                $secondArray[$dateStr]);
        }

        return $firstArray;
    }

    protected function getOneCampaignData($campaignId)
    {
        $campaignInsightValues = array();
        foreach($this->dateList as $dateStr)
        {
            $formatDate = CommonHelper::dateFormatConvert('Y-m-d', $dateStr);
            $insightArray = AdManagerFacade::getAllFiledInsight($campaignId,
                AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN, $formatDate, $formatDate);
            if(false === $insightArray)
            {
                ServerLogger::instance()->writeLog(Error, 'Exception to query campaign insight: ' . $campaignId);
                return false;
            }

            if(0 == count($insightArray))
            {
                $campaignInsightValues[$dateStr] = array();
                continue;
            }

            $insightData = $insightArray[0];
            $campaignInsightValues[$dateStr] = $this->getInsightFieldValue($insightData);
        }

        return $campaignInsightValues;
    }

    protected function getInsightFieldValue($insightData)
    {
        $insightValueArray = InsightValueReader::readInsightValue($insightData, $this->insightFieldConfig);
        return $insightValueArray;
    }
}