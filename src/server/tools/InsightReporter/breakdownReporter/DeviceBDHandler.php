<?php


class DeviceBDHandler extends BDReportHandler
{
    public function exportBDReport()
    {
        $reportData = array();

        $productConfMap = $this->reader->getProductConfMap();
        foreach ($productConfMap as $productName=>$configInfo)
        {
            $productData = $this->getProductData($productName, $configInfo);
            $reportData = array_merge($reportData, $productData);
        }

        return $reportData;
    }

    private function getProductData($productName, $configInfo)
    {
        $productData = array();
        $androidData = array();
        $iosData = array();
        foreach ($this->dateList as $date)
        {
            $insightData = $this->getDateInsightData($date, $configInfo);
            foreach($insightData as $os=>$osData)
            {
                foreach($osData as $osInsightData)
                {
                    $rowData = array();
                    $rowData[] = $productName;
                    $rowData[] = $date;
                    $rowData[] = $this->channelId;
                    $rowData = array_merge($rowData, $osInsightData);
                    if($os == self::OS_ANDROID)
                    {
                        $androidData[] = $rowData;
                    }
                    else if($os == self::OS_IOS)
                    {
                        $iosData[] = $rowData;
                    }
                    else
                    {
                        ServerLogger::instance()->writeLog(Warning, '#device breakdown# os is invalid.');
                    }

                }
            }
        }

        $andProductName = $productName . '_' . self::OS_ANDROID;
        $iosProductName = $productName . '_' . self::OS_IOS;
        $productData[$andProductName] = $androidData;
        $productData[$iosProductName] = $iosData;

        return $productData;
    }

    private function getDateInsightData($date, $configInfoList)
    {
        $dateData = array();
        $androidData = array();
        $iosData = array();
        foreach($configInfoList as $configInfo)
        {
            $nodeIds = $configInfo[ReporterConstants::REPORT_CONFIG_NAME_NODE_ID];
            $nodeType = $configInfo[ReporterConstants::REPORT_CONFIG_NAME_NODE_TYPE];
            $countryCode = $configInfo[ReporterConstants::REPORT_CONFIG_NAME_GEO];
            $oneCountryData = $this->getOneCountryData($date, $nodeIds, $nodeType, $countryCode);
            if(array_key_exists(self::OS_ANDROID, $oneCountryData))
            {
               $geoAndData = $oneCountryData[self::OS_ANDROID];
               $androidData[] = $geoAndData;
            }

            if(array_key_exists(self::OS_IOS, $oneCountryData))
            {
                $geoIosData = $oneCountryData[self::OS_IOS];
                $iosData[] = $geoIosData;
            }
        }

        $dateData[self::OS_ANDROID] = $androidData;
        $dateData[self::OS_IOS] = $iosData;
        return $dateData;
    }

    private function getOneCountryData($date, $nodeIds, $nodeType, $countryCode)
    {
        $osDataMap = array();
        foreach ($nodeIds as $nodeId)
        {
            $insightData = $this->getBDInsightDataByDevice($nodeId, $nodeType, $date);
            foreach($insightData as $device=>$dataValues)
            {
                $osType = self::$deviceOsMap[$device];
                if(array_key_exists($osType, $osDataMap))
                {
                    $originalValues = $osDataMap[$osType];
                    $osDataMap[$osType] = array_map(array('CommonHelper','addOperate'), $originalValues, $dataValues);
                }
                else
                {
                    $osDataMap[$osType] = $dataValues;
                }
            }
        }

        $osCountryMap = array();
        foreach ($osDataMap as $os=>$values)
        {
            array_unshift($values, $countryCode);
            $osCountryMap[$os] = $values;
        }

        return $osCountryMap;
    }


    private function getBDInsightDataByDevice($nodeId, $nodeType, $dateStr)
    {
        $date = CommonHelper::dateFormatConvert('Y-m-d', $dateStr);
        if($nodeType == ReporterConstants::NODE_TYPE_ACCOUNT)
        {
            return BreakdownInsightHelper::getActBDInsightByDevice($nodeId, $date, $date);
        }
        elseif($nodeType == ReporterConstants::NODE_TYPE_CAMPAIGN)
        {
            return BreakdownInsightHelper::getCamBDInsightByDevice($nodeId, $date, $date);
        }
        elseif($nodeType == ReporterConstants::NODE_TYPE_ADSET)
        {
            return BreakdownInsightHelper::getAdsetBDInsightByDevice($nodeId, $date, $date);
        }
        else
        {
            return array();
        }
    }

    private static $deviceOsMap = array(
        'android_smartphone' => self::OS_ANDROID,
        'android_tablet' => self::OS_ANDROID,
        'iphone' => self::OS_IOS,
        'ipad' => self::OS_IOS,
        'ipod' => self::OS_IOS,
        'other' => self::OS_ANDROID,
    );

    const OS_ANDROID = 'android';
    const OS_IOS = 'ios';
}