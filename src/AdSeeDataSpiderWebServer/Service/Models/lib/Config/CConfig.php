<?php

class CConfig
{
    private $ErrorNo = ERROR;
    private $ConfigFile;
    private $ConfigItems = array();

    /**
     *
     * @param String $systemConfFile
     */
    function CConfig($systemConfFile)
    {
        $this->ConfigFile = $systemConfFile;
		$this->initConfigItems();
        if(!file_exists($this->ConfigFile))
        {
            $this->ErrorNo = FILE_NOT_EXIST;
            $this->ErrorNo = $this->createConfigFile();
            return;
        }

        $this->ErrorNo = $this->parseConfigFile();
        return;
    }

    private function createConfigFile()
    {
        $configFileHandle = fopen($this->ConfigFile, "w");
        if($configFileHandle == FALSE)
        {
            return OPEN_FILE_FAIL;
        }

        reset($this->ConfigItems);
        while(list($key,$value) = each($this->ConfigItems))
        {
            if(strcmp($key, LogLevel) == 0)
            {
                $ItemStr = sprintf("%s=%d\r\n",$key, Error);
            }
            else
            {
                $ItemStr = sprintf("%s=%d\r\n",$key, $value->Value);
            }

            if(fwrite($configFileHandle, $ItemStr, strlen($ItemStr)) == FALSE)
            {
                fclose($configFileHandle);
                return WRITE_DATA_TO_FILE_FAIL;
            }
        }

        fclose($configFileHandle);
        unset($configFileHandle);

        return OK;
    }

    private function initConfigItems()
    {
        $this->ConfigItems[DbServerIp]= new CConfigItem(DbServerIp, DbServerIp);
        $this->ConfigItems[DbServerPort]= new CConfigItem(DbServerPort, DbServerPort);
        $this->ConfigItems[DbUserId]= new CConfigItem(DbUserId, DbUserId);
        $this->ConfigItems[DbUserPassword]= new CConfigItem(DbUserPassword, DbUserPassword);
        $this->ConfigItems[DbDatabaseName]= new CConfigItem(DbDatabaseName, DbDatabaseName);
        $this->ConfigItems[UploadFileStorePath]= new CConfigItem(UploadFileStorePath, UploadFileStorePath);
        $this->ConfigItems[ReportStorePath]= new CConfigItem(ReportStorePath, ReportStorePath);
        $this->ConfigItems[LogTarget]= new CConfigItem(LogTarget, PHPLOG);
        $this->ConfigItems[LogLevel]= new CConfigItem(LogLevel, Info);
        $this->ConfigItems[LogPath]= new CConfigItem(LogPath, DefaultLogPath);
        $this->ConfigItems[APP_AD_STORE_PATH]= new CConfigItem(APP_AD_STORE_PATH, "");
        $this->initExtendItems();
    }

    private function initExtendItems()
    {
        //用于不同模块扩展
        $configMap = $this->getExtendMap();
        if(empty($configMap))
        {
            return;
        }
        foreach ($configMap as $key=>$defaultValue)
        {
            $this->ConfigItems[$key]= new CConfigItem($key, $defaultValue);
        }
    }

    protected function getExtendMap()
    {
        //用于不同模块继承扩展
        return array();
    }

    public function getConfigItemValue($ConfigItemName)
    {
        if(array_key_exists($ConfigItemName, $this->ConfigItems))
        {
            return $this->ConfigItems[$ConfigItemName]->Value;
        }

        return null;
    }

    function __destruct()
    {
        unset($this->ConfigItems);
        unset($this);
    }

    /**
     * parse config file
     * @return int
     */
    private function parseConfigFile()
    {
        $configFileHandle = @fopen($this->ConfigFile, "r");
        if(!$configFileHandle)
        {
            $this->ErrorNo = OPEN_FILE_FAIL;
            return $this->ErrorNo;
        }

        while(!feof($configFileHandle))
        {
            $readLine= trim(fgets($configFileHandle));
            if((strlen($readLine) > 0) && ($readLine))
            {

                if(!$this->isCommentLine($readLine))
                {
                    $configItemName = $this->parseConfigItemName($readLine,EqualSign);
                    $configItemValue = $this->parseConfigItemValue($readLine, EqualSign);
                    if(array_key_exists($configItemName, $this->ConfigItems))
                    {
                        $this->ConfigItems[$configItemName]->Value = $configItemValue;
                    }
                }
            }
        }

        fclose ($configFileHandle);

        $this->ErrorNo = OK;

        return $this->ErrorNo;
    }

    private function isCommentLine($configItemLine)
    {
        $noteSignPos = strpos($configItemLine, NoteSign);
        if ($noteSignPos == FALSE)
        {
            return FALSE;
        }

        if ($noteSignPos == 0)
        {
            return TRUE;
        }

        return FALSE;
    }

    private function parseConfigItemName($configItemLine, $separator)
    {
        $SeparatorPos = strpos($configItemLine, $separator);
        return substr($configItemLine, 0, $SeparatorPos);
    }

    private function parseConfigItemValue($configItemLine, $separator)
    {
        $SeparatorPos = strpos($configItemLine, $separator);
        return substr($configItemLine, $SeparatorPos + 1);
    }

    function GetErrorNo()
    {
        return $this->ErrorNo;
    }
}
?>