<?php


class CallStrategyManager
{
    public function notifyStrategyCampaignInfo($inputParamArray)
    {
        $fileRootPath = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_STRATEGY_INPUT_PARAM_DIR);
        //$fileRootPath = EL_SERVER_PATH . 'serverTest/strategyInput';
        if(!FileHelper::createDir($fileRootPath))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'The strategy input dir is invalid : ' . $fileRootPath);
            return false;
        }

        $filePath = $fileRootPath . DIRECTORY_SEPARATOR . time() . StrategyConstants::STRATEGY_JSON_FILE_EXTENSION;
        //多个config一起写，如果后面调接口需要分开调
        FileHelper::writeJsonFile($inputParamArray, $filePath);
    }
}