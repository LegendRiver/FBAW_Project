<?php


class ApiConfManager
{
    private static $instance = null;

    private $configFileMap;

    private $configPath;

    private function __construct()
    {
        $this->configFileMap = array(
            AWCommonConstants::KEY_TEST_CONF => AWCommonConstants::API_TEST_CONF_FILE,
        );

        $this->configPath = EL_AWINTERFACE_PATH . 'conf';
    }

    public static function getInstance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function getApiInitFile($fileKey = AWCommonConstants::KEY_TEST_CONF)
    {
        if(array_key_exists($fileKey, $this->configFileMap))
        {
            $fileName = $this->configFileMap[$fileKey];
        }
        else
        {
            $fileName = $this->configFileMap[AWCommonConstants::KEY_TEST_CONF];
        }

        return $this->configPath . DIRECTORY_SEPARATOR . $fileName;
    }


}