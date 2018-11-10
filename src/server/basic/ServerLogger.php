<?php

use FacebookAds\Http\Exception\RequestException;

class ServerLogger
{
    private static $instance = null;

    private $loggerMap;

    private $filePath;

    private $function;

    private $line;

    private $exceptionMessagePrefix;

    private $currentModuleName;

    private function __construct()
    {
        $loggerConf = ConfigManager::instance()->getLoggerConf();
        $this->buildLoggerMap($loggerConf);

        $this->filePath = '';
        $this->function = '';
        $this->line = '';
        $this->exceptionMessagePrefix = '';
        $this->currentModuleName = BasicConstants::LOGGER_TYPE_VALUE_DEFAULT;
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function setLoggerModule($moduleName)
    {
        $this->currentModuleName = $moduleName;
    }

    private function buildLoggerMap($loggerConf)
    {
        foreach ($loggerConf as $moduleName=>$confInfo)
        {
            $logger = new BasicLog($confInfo);
            $this->loggerMap[$moduleName] = $logger;
        }
    }

    public function getLogger()
    {
        if(array_key_exists($this->currentModuleName, $this->loggerMap))
        {
            return $this->loggerMap[$this->currentModuleName];
        }
        else
        {
            return $this->loggerMap[BasicConstants::LOGGER_TYPE_VALUE_DEFAULT];
        }
    }

    public function writeReportLog($logLevel, $logMessage)
    {
        $logPreMessage = BasicConstants::LOGGER_REPORT_PREFIX . $logMessage;
        $this->writeLog($logLevel, $logPreMessage);
    }
    public function writeReportExceptionLog($logLevel, $e)
    {
        $this->exceptionMessagePrefix = BasicConstants::LOGGER_REPORT_PREFIX;
        $this->writeExceptionLogUnit($logLevel, $e);
    }

    public function writeAdwordsLog($logLevel, $logMessage)
    {
        $logPreMessage = BasicConstants::LOGGER_ADWORDS_PREFIX . $logMessage;
        $this->writeLog($logLevel, $logPreMessage);
    }
    public function writeAdwordsExceptionLog($logLevel, $e)
    {
        $this->exceptionMessagePrefix = BasicConstants::LOGGER_ADWORDS_PREFIX;
        $this->writeExceptionLogUnit($logLevel, $e);
    }

    public function writeStrategyLog($logLevel, $logMessage)
    {
        $logPreMessage = BasicConstants::LOGGER_STRATEGY_PREFIX . $logMessage;
        $this->writeLog($logLevel, $logPreMessage);
    }
    public function writeStrategyExceptionLog($logLevel, $e)
    {
        $this->exceptionMessagePrefix = BasicConstants::LOGGER_REPORT_PREFIX;
        $this->writeExceptionLogUnit($logLevel, $e);
    }

    public function writeLog($logLevel, $logMessage)
    {
        $this->getCallerInfo();
        $this->getLogger()->writeLog($logLevel, basename($this->filePath), $this->function, $this->line, $logMessage);
    }

    public function writeExceptionLog($logLevel, Exception $e)
    {
        $this->exceptionMessagePrefix = '';
        $this->writeExceptionLogUnit($logLevel, $e);
    }

    private function writeExceptionLogUnit($logLevel, Exception $e)
    {
        $this->getCallerInfo();

        $message = $this->exceptionMessagePrefix;
        $message .= 'Exception Info : ';
        $message .= $e->getMessage();
        $message .= ' ; ';
        $message .= $e->getCode();
        $message .= ' ; ';
        $message .= $e->getFile();
        $message .= ' ; ';
        $message .= $e->getLine();

        if($e instanceof RequestException)
        {
            $message .= ' ; ';
            $message .= $e->getErrorSubcode();
            $message .= ' ; ';
            $message .= $e->getErrorUserTitle();
            $message .= ' ; ';
            $message .= $e->getErrorUserMessage();
        }

        $this->getLogger()->writeLog($logLevel, basename($this->filePath), $this->function, $this->line, $message);

    }

    private function getCallerInfo()
    {
        $traceInfoArray = debug_backtrace();
        //直接获取有用堆栈信息
        $loginfo = $traceInfoArray[2];
        unset($traceInfoArray);
        $this->filePath = $loginfo['file'];
        $this->function = $loginfo['function'];
        $this->line = $loginfo['line'];
    }

}