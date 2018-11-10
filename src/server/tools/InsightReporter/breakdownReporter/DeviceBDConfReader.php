<?php


class DeviceBDConfReader extends BDConfReader
{
    protected function getProductInfoMap($productConfigList)
    {
        foreach($productConfigList as $productInfo)
        {
            $productName = $productInfo[ReporterConstants::REPORT_CONFIG_NAME_PRODUCT_NAME];
            $nodeConfigList = $productInfo[ReporterConstants::REPORT_CONFIG_NAME_NODE_CONFIG];

            $this->productConfMap[$productName] = $nodeConfigList;
        }
    }
}