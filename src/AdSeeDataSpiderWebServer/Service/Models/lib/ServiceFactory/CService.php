<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 5/18/15
 * Time: 5:27 PM
 */

class CService
{
    private $_ClassInstanceTable = null;
    private $_ServiceName = null;
    private $Config = null;
    private $Log = null;

    public function  __construct($serviceName, $config, $log)
    {
        $this->_ServiceName = $serviceName;
        $this->Config = $config;
        $this->Log = $log;
        $this->_ClassInstanceTable = array();
    }

    public function __destruct()
    {
        foreach($this->_ClassInstanceTable as $key=>$classIntance)
        {
            unset($this->_ClassInstanceTable[$key]);
        }

        unset($this);
    }

    public function getServiceName()
    {
        return $this->_ServiceName;
    }

    /**
     * 注册类实例
     * @param $className 实例名称
     * @param $classInstance 实例对象指针
     * @return bool 注册成功能返回True，失败返回False
     */
    public function registerClassInstance($className, $classInstance)
    {
        if(array_key_exists($className, $this->_ClassInstanceTable))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Class <%s> exists.", $className));
            return false;
        }

        $this->_ClassInstanceTable[$className] = $classInstance;
        return true;
    }

    /**
     * 注册销类实例
     * @param $className 实例名称
     * @return bool 成功返回true,失败返回false
     */
    public function unregisterClassInstance($className)
    {
        if(!array_key_exists($className, $this->_ClassInstanceTable))
        {
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, sprintf("Class <%s> not exists.", $className));
            return false;
        }

        unset($this->_ClassInstanceTable[$className]);
        return true;
    }

    public function callClassInstance($className, $functionName, $parameters)
    {
        if(!array_key_exists($className, $this->_ClassInstanceTable))
        {
            $result = new CResult();
            $result->setErrorCode(ERR_NOT_FOUND_CLASS_INSTANCE);
            $result->setMessage(sprintf("Class <%s> not exists.", $className));
            $result->setData("");
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        return $this->_ClassInstanceTable[$className]->callFunction($functionName, $parameters);
    }
}