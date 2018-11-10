<?php


class ServiceInitializer
{
    private static $instance = null;

    private $serviceConfigMap;

    private function __construct()
    {
        $this->serviceConfigMap = array();
        $configFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'conf/serviceConf.json';
        $this->parseConfig($configFile);
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function registerServices()
    {
        foreach ($this->serviceConfigMap as $serviceName=>$classInfo)
        {
            foreach ($classInfo as $className=>$functionList)
            {
                $reflectInstance = new ReflectionClass($className);
                $classInstance = $reflectInstance->newInstance();
                ServiceManager::instance()->registerClassInstance($serviceName, $classInstance, $functionList);
            }
        }
    }

    private function parseConfig($configFile)
    {
        $configInfo = FileHelper::readJsonFile($configFile);
        $configList = $configInfo['serviceConfig'];
        foreach ($configList as $item)
        {
            $serviceName = $item['serviceName'];
            $classInfo = $item['classInfo'];
            $class2Function = array();
            foreach ($classInfo as $classConfig)
            {
                $className = $classConfig['className'];
                $functionList = $classConfig['functionList'];
                $class2Function[$className] = $functionList;
            }
            $this->serviceConfigMap[$serviceName] = $class2Function;
        }
    }
}