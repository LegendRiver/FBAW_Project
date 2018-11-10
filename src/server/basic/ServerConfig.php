<?php


class ServerConfig extends CConfig
{
    protected function getExtendMap()
    {
        $extendItems = array();
        $extendItems[BasicConstants::CONFIG_STRATEGY_OUTPUT_DIR] = BasicConstants::CONFIG_STRATEGY_OUTPUT_DIR_DEFAULT;
        $extendItems[BasicConstants::CONFIG_STRATEGY_INPUT_PARAM_DIR] = BasicConstants::CONFIG_STRATEGY_INPUT_PARAM_DIR_DEFAULT;
        $extendItems[BasicConstants::CONFIG_DOWNLOAD_IMAGE_DIR] = BasicConstants::CONFIG_DOWNLOAD_IMAGE_DIR_DEFAULT;
        $extendItems[BasicConstants::CONFIG_PROFIT_CONFIG_FILE] = BasicConstants::CONFIG_PROFIT_CONFIG_FILE_DEFAULT;
        $extendItems[BasicConstants::CONFIG_LOCAL_IMAGE_DIR] = BasicConstants::CONFIG_LOCAL_IMAGE_DIR_DEFAULT;
        return $extendItems;
    }
}