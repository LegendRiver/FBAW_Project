<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 5/18/15
 * Time: 5:09 PM
 */

class CServiceFactory
{
    private $_ServiceTable;
    private $Config = null;
    private $Log = null;
    public function  __construct($config, $log)
    {
        $this->Config = $config;
        $this->Log = $log;
        $this->_ServiceTable = array();
    }

    public function  __destruct()
    {
        foreach($this->_ServiceTable as $key=>$item)
        {
            $this->unregisterService($key);
        }
        unset($this->_ServiceTable);
    }

    public function registerService($serviceName, $service)
    {
        if(array_key_exists($serviceName, $this->_ServiceTable))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Service <%s> exists.", $serviceName));
            return false;
        }

        $this->_ServiceTable[$serviceName] = $service;
        return true;
    }

    public function unregisterService($serviceName)
    {
        if(!array_key_exists($serviceName, $this->_ServiceTable))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Service <%s> not exists.", $serviceName));
            return false;
        }

        unset($this->_ServiceTable[$serviceName]);
        return true;
    }

    public function callService($serviceName, $classInstanceName, $functionName, $parameters)
    {
        if(!array_key_exists($serviceName, $this->_ServiceTable))
        {
            $result = new CResult();
            $result->setErrorCode(ERR_NOT_FOUND_SERVICE);
            $result->setMessage(sprintf("Service <%s> not exist.", $serviceName));
            $result->setData(array());
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        return $this->_ServiceTable[$serviceName]->callClassInstance($classInstanceName, $functionName, $parameters);
    }
}