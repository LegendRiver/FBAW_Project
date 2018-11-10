<?php


class BDConfReader
{
    private $channelId;
    private $startDate;
    private $endDate;
    private $isByOs;

    protected $productConfMap;

    public function __construct($bdConfFile)
    {
        $configInfos = FileHelper::readJsonFile($bdConfFile);
        $this->channelId = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_CHANNEL_ID];
        $this->startDate = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_START_DATE];
        $this->endDate = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_END_DATE];
        $this->isByOs = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_OS];
        $this->productConfMap = array();

        $productConfigList = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_PRODUCT_CONFIG];
        $this->getProductInfoMap($productConfigList);

    }

    /**
     * @return mixed
     */
    public function getChannelId()
    {
        return $this->channelId;
    }

    /**
     * @return mixed
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * @return mixed
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * @return mixed
     */
    public function getIsByOs()
    {
        return $this->isByOs;
    }

    /**
     * @return array
     */
    public function getProductConfMap()
    {
        return $this->productConfMap;
    }

    protected function getProductInfoMap($productConfigList)
    {
        foreach($productConfigList as $productInfo)
        {
            $productName = $productInfo[ReporterConstants::REPORT_CONFIG_NAME_PRODUCT_NAME];
            $nodeIds = $productInfo[ReporterConstants::REPORT_CONFIG_NAME_NODE_ID];
            $nodeType = $productInfo[ReporterConstants::REPORT_CONFIG_NAME_NODE_TYPE];

            $this->reconstructInfo($productName, $nodeIds, $nodeType);
        }
    }

    private function getExportType($nodeType)
    {
        if($nodeType == ReporterConstants::NODE_TYPE_ACCOUNT)
        {
            return AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT;
        }
        elseif($nodeType == ReporterConstants::NODE_TYPE_CAMPAIGN)
        {
            return AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN;
        }
        else
        {
            return '';
        }
    }

    private function checkAdsetValue($adsetId)
    {
        $insightArray = AdManagerFacade::getAllFiledInsight($adsetId, AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET,
            $this->startDate, $this->endDate);
        if(false === $insightArray)
        {
            ServerLogger::instance()->writeLog(Error, 'Exception to query adset insight: ' . $adsetId);
            return true;
        }

        if(0 == count($insightArray))
        {
            return false;
        }

        $insightData = $insightArray[0];
        $installConf = InsightValueReader::buildInstallConfig();
        $spendConf =InsightValueReader::buildSpendConfig();
        $fieldConf = array_merge($installConf, $spendConf);
        $insightValueArray = InsightValueReader::readInsightValue($insightData, $fieldConf);
        $install = $insightValueArray[0];
        $spend = $insightValueArray[1];

        return $install > 0 || $spend > 0;
    }

    private function reconstructInfo($productName, $nodeIds, $nodeType)
    {
        if($this->isByOs && $nodeType != ReporterConstants::NODE_TYPE_ADSET)
        {
            $exportType = $this->getExportType($nodeType);
            $androidAdsetIds = array();
            $iosAdsetIds = array();
            foreach ($nodeIds as $nodeId)
            {
                $adsetEntities = AdManagerFacade::getAdSetEntity($nodeId, $exportType);
                if(false === $adsetEntities)
                {
                    return;
                }
                foreach ($adsetEntities as $entity)
                {
                    $id = $entity->getId();
                    if(!$this->checkAdsetValue($id))
                    {
                        continue;
                    }
                    $os = AdSetUtil::getAdsetOs($entity);

                    if(AdManageConstants::OS_ANDROID == $os)
                    {
                        $androidAdsetIds[] = $id;
                    }
                    elseif(AdManageConstants::OS_IOS == $os)
                    {
                        $iosAdsetIds[] = $id;
                    }
                    else
                    {
                        continue;
                    }
                }
            }

            $androidName = $productName . '_' . AdManageConstants::OS_ANDROID;
            $iosName = $productName . '_' . AdManageConstants::OS_IOS;
            $this->productConfMap[$androidName] = array(
                ReporterConstants::REPORT_CONFIG_NAME_NODE_ID => $androidAdsetIds,
                ReporterConstants::REPORT_CONFIG_NAME_NODE_TYPE => ReporterConstants::NODE_TYPE_ADSET,
            );
            $this->productConfMap[$iosName] = array(
                ReporterConstants::REPORT_CONFIG_NAME_NODE_ID => $iosAdsetIds,
                ReporterConstants::REPORT_CONFIG_NAME_NODE_TYPE => ReporterConstants::NODE_TYPE_ADSET,
            );
        }
        else
        {
            $this->productConfMap[$productName] = array(
                ReporterConstants::REPORT_CONFIG_NAME_NODE_ID => $nodeIds,
                ReporterConstants::REPORT_CONFIG_NAME_NODE_TYPE => $nodeType,
            );
        }
    }
}