<?php

use FacebookAds\Api;

class FBAPIManager
{
    private static $instance=null;

    private $apiMap = array();

    private function __construct()
    {
        $apiConfFile = EL_SERVER_PATH . BasicConstants::DIRECTORY_CONF . DIRECTORY_SEPARATOR . 'api_conf.json';
        $configInfo = FileHelper::readJsonFile($apiConfFile);
        $confList = $configInfo[FBAPIConfConstants::CONF_LIST];
        foreach ($confList as $conf)
        {
            $key = $conf[FBAPIConfConstants::KEY];
            $id = $conf[FBAPIConfConstants::ID];
            $token = $conf[FBAPIConfConstants::TOKEN];
            $secret = $conf[FBAPIConfConstants::SECRET];

            Api::init($id, $secret, $token);
            $apiInstance = Api::instance();
            $this->apiMap[$key] = $apiInstance;
        }

        $defaultInstance = $this->apiMap[FBAPIConfConstants::KEY_DON];
        Api::setInstance($defaultInstance);
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function changeApi($apiKey = FBAPIConfConstants::KEY_DON)
    {
        if(array_key_exists($apiKey, $this->apiMap))
        {
           $instance = $this->apiMap[$apiKey];
           Api::setInstance($instance);
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to find api instance by key: ' . $apiKey);
        }
    }

}