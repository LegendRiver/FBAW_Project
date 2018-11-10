<?php

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/12/1
 * Time: 上午11:01
 */
class BasicLog
{
    private $logLevel = Debug;
    private $logPath;
    private $LogLevelNameTable = null;

    public function  __construct($loggerConfig)
    {
        $this->logLevel = $loggerConfig[BasicConstants::LOGGER_CONF_FIELD_LEVEL];
        $this->logPath = $loggerConfig[BasicConstants::LOGGER_CONF_FIELD_PATH];
        $this->LogLevelNameTable = array();
        $this->initLogLevelNameTable();

        if(empty($this->logPath))
        {
            $this->logPath = DefaultLogPath;
        }
    }

    public function __destruct()
    {
        unset($this);
    }



    private function initLogLevelNameTable()
    {
        $this->LogLevelNameTable[Emergency] = 'Emergency';
        $this->LogLevelNameTable[Alert] = 'Alert';
        $this->LogLevelNameTable[Critical] = 'Critical';
        $this->LogLevelNameTable[Error] = 'Error';
        $this->LogLevelNameTable[Warning] = 'Warning';
        $this->LogLevelNameTable[Notic] = 'Notic';
        $this->LogLevelNameTable[Info] = 'Info';
        $this->LogLevelNameTable[Debug] = 'Debug';
    }

    private function getLogLevelName($logLevel)
    {
        if(array_key_exists($logLevel, $this->LogLevelNameTable))
        {
            return $this->LogLevelNameTable[$logLevel];
        }

        return 'UNKNOWN';
    }

    public function writeLog($logLevel, $file, $function, $line, $msg)
    {
        $logFile = sprintf("%s/%s", $this->logPath, sprintf("%s.log", date("Y-m-d")));

        if (!file_exists($this->logPath))
        {
            if (!mkdir($this->logPath, 0777, true))
            {
                return CREATE_LOG_DIR_FAIL;
            }
        }

        if ($this->logLevel >= $logLevel)
        {
            $currentTime = date("Y-m-d H:i:s", time());
            $logMsg = sprintf("[%s][%s][%s,%s,%d][%s]\n", strtoupper($this->getLogLevelName($logLevel)), $currentTime, $file, $function, $line, $msg);
            $result = error_log($logMsg, 3, $logFile);
            if (!$result)
            {
                return WRITE_LOG_TO_FILE_FAIL;
            }
            return OK;
        }
        return OK;
    }

}