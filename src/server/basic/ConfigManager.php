<?php


class ConfigManager
{
    private static $instance = null;

    private $serverConfig;

    private $loggerConfig;


    private function __construct()
    {
        $configFile = EL_SERVER_PATH . BasicConstants::DIRECTORY_CONF . DIRECTORY_SEPARATOR .
            BasicConstants::FILE_SEVERLOG_CONF;

        $logConfigFile = EL_SERVER_PATH . BasicConstants::DIRECTORY_CONF . DIRECTORY_SEPARATOR .
            BasicConstants::FILE_LOGGER_CONF;

        $this->serverConfig = new ServerConfig($configFile);
        $this->parseLoggerConf($logConfigFile);
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function getServerConfig()
    {
        return $this->serverConfig;
    }

    public function getConfigValue($configName)
    {
        return $this->serverConfig->getConfigItemValue($configName);
    }

    public function getLoggerConf()
    {
        return $this->loggerConfig;
    }

    private function parseLoggerConf($logConfigFile)
    {
        $configInfo = FileHelper::readJsonFile($logConfigFile);
        $infoList = $configInfo[BasicConstants::LOGGER_CONF_FIELD_LIST];
        $this->loggerConfig = array();
        foreach ($infoList as $info)
        {
            $moduleName = $info[BasicConstants::LOGGER_CONF_FIELD_MODULE];
            $this->loggerConfig[$moduleName] = $info;
        }
    }
}