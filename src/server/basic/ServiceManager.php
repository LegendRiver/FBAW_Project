<?php


class ServiceManager
{
    private static $instance = null;

    private $serviceFactory;

    private $logger;

    private $config;

    private $serviceName2Instance;

    private $className2Function;

    private function __construct()
    {
        $this->logger = ServerLogger::instance()->getLogger();
        $this->config = ConfigManager::instance()->getServerConfig();
        $this->serviceFactory = new CServiceFactory($this->config, $this->logger);

        $this->serviceName2Instance = array();
        $this->className2Function = array();
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function callService($serviceName, $classInstanceName, $functionName, $parameters)
    {
        if(!$this->checkFunctionExporting($classInstanceName, $functionName))
        {
            ServerLogger::instance()->writeLog(Error, '#service# The function ' . $functionName .
                ' of class ' . $classInstanceName . 'is not exporting.');
            return false;
        }
        return $this->serviceFactory->callService($serviceName, $classInstanceName, $functionName, $parameters);
    }

    public function registerClassInstance($serviceName, $instance, $exportFunctions=array())
    {
        if(!array_key_exists($serviceName, $this->serviceName2Instance))
        {
            $this->registerNewService($serviceName);
        }

        $service = $this->serviceName2Instance[$serviceName];
        $className = get_class($instance);
        if (!$service->registerClassInstance($className, $instance))
        {
            ServerLogger::instance()->writeLog(Error, sprintf("Register class <%s> failed.", $className));
            return false;
        }
        else
        {
            if(array_key_exists($className, $this->className2Function))
            {
                $existingFunctions = $this->className2Function[$className];
                $this->className2Function[$className] = array_unique( array_merge($existingFunctions, $exportFunctions));
            }
            else
            {
                $this->className2Function[$className] = $exportFunctions;
            }
        }

        return true;
    }

    public function registerNewService($serviceName)
    {
        $newService = new CService($serviceName, $this->config, $this->logger);
        if(!$this->serviceFactory->registerService($newService->getServiceName(), $newService))
        {
            ServerLogger::instance()->writeLog(Error, sprintf("Register service <%s> failed.", $newService->getServiceName()));
            return;
        }

        $this->serviceName2Instance[$serviceName] = $newService;
    }

    private function checkFunctionExporting($className, $functionName)
    {
        if(!array_key_exists($className, $this->className2Function))
        {
            return false;
        }

        $functionList = $this->className2Function[$className];

        return in_array($functionName, $functionList);

    }

}