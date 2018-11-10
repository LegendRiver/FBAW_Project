<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-08-09
 * Time: 15:40
 */
class CLog
{
    private $Config = null;
    private $LogLevel = Debug;
    private $LogTarget = PHPLOG;
    private $LogPath = DefaultLogPath;
    private $LogLevelNameTable = null;

    public function  __construct($config)
    {
        $this->Config = $config;
        $this->LogLevelNameTable = array();
        $this->initLogPth();
        $this->initLogLevelNameTable();
    }

    public function __destruct()
    {
        unset($this);
    }

    private function initLogPth()
    {
        $this->LogPath = $this->Config->getConfigItemValue(LogPath);
        if(!file_exists($this->LogPath))
        {
            $this->LogPath = DefaultLogPath;
            return;
        }
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

    private function writeLogUsePHPErrorLog($logLevel, $file, $function, $line, $msg)
    {
        $logFile = sprintf("%s/%s", $this->LogPath, sprintf("%s.log", date("Y-m-d")));

        if (!file_exists($this->LogPath))
        {
            if (!mkdir($this->LogPath, 0777, true))
            {
                return CREATE_LOG_DIR_FAIL;
            }
        }

        if ($this->getLogLevel() >= $logLevel)
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

    private function writeLogUseSysLog($logLevel, $file, $function, $line, $msg)
    {
        $result = openlog(APP_NAME, LOG_CONS | LOG_PID | LOG_NDELAY, LOG_USER);
        if ($result) {
            if (self::getLogLevel() >= $logLevel) {
                $currentTime = date('Y-m-d H:i:s');
                $logMsg = sprintf("[%s][%s,%s,%d][%s]", $currentTime, $file, $function, $line, $msg);
                if (!syslog($logLevel, $logMsg)) {
                    closelog();
                    return WRITE_TO_SYSLOG_FAIL;
                }
            }
            closelog();

            return OK;
        }

        return OPEN_SYSLOG_FAIL;
    }

    public function writeLog($logLevel, $file, $function, $line, $msg)
    {
        if ($this->Config != NULL) {
            $this->LogTarget = $this->Config->getConfigItemValue(LogTarget);
            if ($this->LogTarget == FALSE) {
                $this->LogTarget = PHPLOG;
            }
        }

        switch ($this->LogTarget) {
            case SYSLOG:
                return $this->writeLogUseSysLog($logLevel, $file, $function, $line, $msg);
            case PHPLOG:
                return $this->writeLogUsePHPErrorLog($logLevel, $file, $function, $line, $msg);
            default:
                return $this->writeLogUsePHPErrorLog($logLevel, $file, $function, $line, $msg);
        }
    }

    private function getLogLevel()
    {
        if (!$this->Config == NULL)
        {
            $this->LogLevel = $this->Config->getConfigItemValue(LogLevel);
            if ($this->LogLevel == FALSE)
            {
                $this->LogLevel = Debug;
            }
        }

        return $this->LogLevel;
    }
}