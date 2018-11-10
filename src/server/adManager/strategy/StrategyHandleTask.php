<?php


class StrategyHandleTask
{
    private $strategyManager;

    public function __construct()
    {
        $this->strategyManager = new StrategyManager();
    }

    public function run()
    {
        //$strategyRoot = EL_SERVER_PATH . 'serverTest/strategyOutput';
        $strategyRoot = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_STRATEGY_OUTPUT_DIR);
        if(!FileHelper::createDir($strategyRoot))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'There is not strategy dir :' . $strategyRoot);
            return ERR_STRATEGY_DIR;
        }
        //$strategyBackupDir = EL_SERVER_PATH . 'serverTest/strategyBackup';
        $strategyBackupDir = ConfigManager::instance()->getConfigValue(BasicConstants::CONFIG_STRATEGY_OUTPUT_BACKUP_DIR);
        if(!FileHelper::createDir($strategyBackupDir))
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'There is not strategy backup dir :' . $strategyBackupDir);
            return ERR_STRATEGY_DIR;
        }

        while(true)
        {
            $fileList = scandir($strategyRoot);
            foreach($fileList as $jsonFile)
            {
                $filePath = $this->getValidPath($strategyRoot, $jsonFile);
                if(false === $filePath)
                {
                    ServerLogger::instance()->writeStrategyLog(Info, 'The file is not ready strategy file : ' . $jsonFile);
                    continue;
                }

                $result = $this->strategyManager->handleStrategy($filePath);
                if(OK == $result)
                {
                    $newName = str_replace(StrategyConstants::STRATEGY_FILE_READY_STATUS,
                        StrategyConstants::STRATEGY_FILE_SUCCESS_STATUS, $jsonFile);
                }
                else
                {
                    $newName = str_replace(StrategyConstants::STRATEGY_FILE_READY_STATUS,
                        StrategyConstants::STRATEGY_FILE_FAILED_STATUS, $jsonFile);
                }

                $newPath = $strategyBackupDir . DIRECTORY_SEPARATOR . $newName;
                if(false === rename($filePath, $newPath))
                {
                    //重命名失败要做些防护，防止重复创建
                    ServerLogger::instance()->writeStrategyLog(Error, 'Failed to rename strategy Name : ' . $jsonFile);
                    continue;
                }

                usleep(StrategyConstants::READ_STRATEGY_FILE_INTERVAL);
            }

            //sleep(3600);
            break;
        }
    }

    private function getValidPath($rootPath, $fileName)
    {
        if(false === strstr($fileName, StrategyConstants::STRATEGY_JSON_FILE_EXTENSION))
        {
           return false;
        }

        if(false === strstr($fileName, StrategyConstants::STRATEGY_FILE_READY_STATUS))
        {
            return false;
        }

        $fullPath = $rootPath . DIRECTORY_SEPARATOR . $fileName;
        if(!is_file($fullPath))
        {
            return false;
        }

        return $fullPath;
    }
}