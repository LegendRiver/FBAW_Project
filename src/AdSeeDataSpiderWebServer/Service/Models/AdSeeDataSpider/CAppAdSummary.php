<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2/4/2017
 * Time: 2:50 PM
 */
class CAppAdSummary extends CBaseObject
{
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CAppAdSummary";
        $this->TableName = "NONE";

        parent::__construct($config, $log, $dbInterface);
        $this->addAllowAccessFunction('getAppList');
        $this->addAllowAccessFunction('getAppAdSummary');
        $this->addAllowAccessFunction('getAppAdListByPage');
    }

    public function  __destruct()
    {
        parent::__destruct();
    }

    public function getAppList($parameters)
    {
        $result = new CResult();
        if(!$this->checkParameter(CALL_TAG, $parameters, $result))
        {
            $result->setData(array());
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[CALL_TAG];
        $result->addResultField(CALL_TAG, $callTag);

        $path = $this->Config->getConfigItemValue(APP_AD_STORE_PATH);
        if($path == null)
        {
            $result->setErrorCode(ERR_NOT_CONFIG_APP_AD_STORE_PATH);

            $result->setData(array());
            $result->setMessage(sprintf("Not config App ad store path<%s> not exist.", APP_AD_STORE_PATH));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        if(!$this->isFolderExist($path))
        {
            $result->setErrorCode(ERR_APP_AD_STORE_PATH_NOT_EXIST);
            $result->setData(array());
            $result->setMessage(sprintf("App ad store path<%s> not exist.", $path));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $AppList= array();

        $dir = new DirectoryIterator($path);
        foreach ($dir as $fileInfo)
        {
            if ($fileInfo->isDir() && !$fileInfo->isDot())
            {
                $app = array();
                $app['APP_PACKAGE_NAME'] = $fileInfo->getFilename();
                $app['APP_AD_SUMMARY_DATA'] = $this->getAppAdSummaryData($app['APP_PACKAGE_NAME']);
                $app['APP_AD_COUNT_ONE_PAGE'] = 20;
                array_push($AppList, $app);
            }
        }

        $result->setErrorCode(OK);
        $result->setData($AppList);
        $result->setMessage("");

        return $result;
    }

    public function getAppAdSummary($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(APP_PACKAGE_NAME, CALL_TAG);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $result->setData(array());
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[CALL_TAG];
        $result->addResultField(CALL_TAG, $callTag);

        $appPackageName = $parameters[APP_PACKAGE_NAME];
        $path = $this->Config->getConfigItemValue(APP_AD_STORE_PATH);
        $appAdSummaryDataFile = sprintf("%s/%s/%s%s", $path, $appPackageName,$appPackageName, APP_AD_SUMMARY_FILE_SUFFIX);
        if(!file_exists($appAdSummaryDataFile))
        {
            $result->setErrorCode(ERR_APP_AD_SUMMARY_DATA_FILE_NOT_EXIST);
            $result->setData(array());
            $result->setMessage(sprintf("App ad summary data file<%s> not exist.", $appAdSummaryDataFile));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $fileContent = $this->getAppAdSummaryData($appPackageName);
        if($fileContent === FALSE)
        {
            $result->setErrorCode(ERR_READ_APP_AD_SUMMARY_DATA_FILE_FAILED);
            $result->setData(array());
            $result->setMessage(sprintf("Read app ad summary data file<%s> failed.", $appAdSummaryDataFile));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $appAdSummaryData = array();
        $appAdSummaryData['APP_PACKAGE_NAME'] = $appPackageName;
        $appAdSummaryData['APP_AD_SUMMARY_DATA'] = $fileContent;
        $appAdSummaryData['APP_AD_COUNT_ONE_PAGE'] = 20;

        $result->setErrorCode(OK);
        $result->setData($appAdSummaryData);
        $result->setMessage("");

        return $result;
    }

    private function getAppAdSummaryData($appPackageName)
    {
        $path = $this->Config->getConfigItemValue(APP_AD_STORE_PATH);
        $appAdSummaryDataFile = sprintf("%s/%s/%s%s", $path, $appPackageName,$appPackageName, APP_AD_SUMMARY_FILE_SUFFIX);
        if(!file_exists($appAdSummaryDataFile))
        {
            return FALSE;
        }

        $fileContent = file_get_contents($appAdSummaryDataFile);
        if($fileContent === FALSE)
        {
            return FALSE;
        }

        $fileContentNoUEEF = preg_replace('/\x{FEFF}/u', '', $fileContent);

        return base64_encode(urlencode($fileContentNoUEEF));
    }

    public function getAppAdListByPage($parameters)
    {
        $result = new CResult();
        $needCheckParameters = array(APP_PACKAGE_NAME, APP_AD_PAGE_NUMBER, CALL_TAG);
        if(!$this->checkParameters($needCheckParameters, $parameters, $result))
        {
            $result->setErrorCode(ERR_PARAMETER_APP_PACKAGE_NAME_NOT_EXIST);
            $result->setData(array());
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $callTag = $parameters[CALL_TAG];
        $result->addResultField(CALL_TAG, $callTag);

        $appPackageName = $parameters[APP_PACKAGE_NAME];
        $appAdPageNumber = $parameters[APP_AD_PAGE_NUMBER];
        $path = $this->Config->getConfigItemValue(APP_AD_STORE_PATH);
        //com.mt.reader_P1_ad_list.dat
        $appAdListDataFile = sprintf("%s/%s/%s_P%d%s", $path, $appPackageName,$appPackageName, $appAdPageNumber, APP_AD_LIST_FILE_SUFFIX);
        if(!file_exists($appAdListDataFile))
        {
            $result->setErrorCode(ERR_APP_AD_SUMMARY_DATA_FILE_NOT_EXIST);
            $result->setData(array());
            $result->setMessage(sprintf("App ad summary data file<%s> not exist.", $appAdSummaryDataFile));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $fileContent = file_get_contents($appAdListDataFile);
        if($fileContent === FALSE)
        {
            $result->setErrorCode(ERR_READ_APP_AD_SUMMARY_DATA_FILE_FAILED);
            $result->setData(array());
            $result->setMessage(sprintf("Read app ad summary data file<%s> failed.", $appAdListDataFile));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $fileContentNoUEEF = preg_replace('/\x{FEFF}/u', '', $fileContent);
        $appAdSummaryData = array();
        $appAdSummaryData['APP_PACKAGE_NAME'] = $appPackageName;
        $appAdSummaryData['APP_AD_LIST_DATA'] = base64_encode(urlencode($fileContentNoUEEF));
        $appAdSummaryData['APP_AD_PAGE_NUMBER'] = $appAdPageNumber;

        $result->setErrorCode(OK);
        $result->setData($appAdSummaryData);
        $result->setMessage("");

        return $result;
    }

    private function isFolderExist($folder)
    {
        // Get canonicalized absolute pathname
        $path = realpath($folder);

        // If it exist, check if it's a directory
        if($path !== false AND is_dir($path))
        {
            // Return canonicalized absolute pathname
            return $path;
        }

        // Path/folder does not exist
        return false;
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
    }
}