<?php


class ConfigFileReader
{
    private $channelId;
    private $outputPath;

    private $startDate;

    private $endDate;
    
    private $productCampaignMap;

    public function __construct($filePath)
    {
        $configInfos = FileHelper::readJsonFile($filePath);
        $this->channelId = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_CHANNEL_ID];
        $this->outputPath = CommonHelper::getArrayValueByKey(ReporterConstants::REPORT_CONFIG_NAME_OUTPUT_PATH,$configInfos);
        $this->startDate = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_START_DATE];
        $this->endDate = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_END_DATE];
        $productConfigList = $configInfos[ReporterConstants::REPORT_CONFIG_NAME_PRODUCT_CONFIG];

        foreach($productConfigList as $productConfig)
        {
            $productName = $productConfig[ReporterConstants::REPORT_CONFIG_NAME_PRODUCT_NAME];
            if(empty($productName))
            {
                continue;
            }

            $campaignConfigList = $productConfig[ReporterConstants::REPORT_CONFIG_NAME_CAMPAIGN_CONFIG];

            $this->productCampaignMap[$productName] = $campaignConfigList;
        }
    }

    /**
     * @return null
     */
    public function getOutputPath()
    {
        return $this->outputPath;
    }

    /**
     * @param null $outputPath
     */
    public function setOutputPath($outputPath)
    {
        $this->outputPath = $outputPath;
    }

    /**
     * @return mixed
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * @param mixed $endDate
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;
    }

    /**
     * @return mixed
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * @param mixed $startDate
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;
    }

    /**
     * @return mixed
     */
    public function getChannelId()
    {
        return $this->channelId;
    }

    /**
     * @param mixed $channelId
     */
    public function setChannelId($channelId)
    {
        $this->channelId = $channelId;
    }

    /**
     * @return mixed
     */
    public function getProductCampaignMap()
    {
        return $this->productCampaignMap;
    }

    /**
     * @param mixed $productCampaignMap
     */
    public function setProductCampaignMap($productCampaignMap)
    {
        $this->productCampaignMap = $productCampaignMap;
    }

}