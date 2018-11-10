<?php


class ExportConfigHelper
{
    private $configRootPath;

    private $configFilePath;

    private $commonConfigInfo;

    private $adConfigInfo;

    private $adSetConfigInfo;

    private $campaignConfigInfo;

    private $currentConfigInfo;

    private $isExportAllAccount;

    private $allAccountIds;

    public function __construct($rootPath, $configName, $nodeType)
    {
        $this->configRootPath = $rootPath;
        $this->configFilePath = $rootPath . DIRECTORY_SEPARATOR . $configName;
        $this->isExportAllAccount = false;
        $this->allAccountIds = array();
        $this->currentConfigInfo = array();

        $this->parseConfig();
        $this->getAllAccountIds();

        $this->setCurrentConfig($nodeType);
    }

    public function getExportDimension()
    {
        if($this->isExportAllAccount)
        {
            return AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT;
        }
        else
        {
            return $this->currentConfigInfo[InsightExporterConstants::BASIC_INFO_DIMENSION];
        }
    }

    public function getParentIds()
    {
        if($this->isExportAllAccount)
        {
            return $this->allAccountIds;
        }
        else
        {
            return $this->currentConfigInfo[InsightExporterConstants::BASIC_INFO_PARENT_ID];
        }
    }

    public function getSinceDate()
    {
        return $this->currentConfigInfo[InsightExporterConstants::BASIC_INFO_SINCE_DATE];
    }

    public function getUtilDate()
    {
        return $this->currentConfigInfo[InsightExporterConstants::BASIC_INFO_UTIL_DATE];
    }

    public function getExportPath()
    {
        return $this->currentConfigInfo[InsightExporterConstants::BASIC_INFO_EXPORT_PATH];
    }

    public function getFilePrefix()
    {
        return $this->currentConfigInfo[InsightExporterConstants::BASIC_INFO_NAME_PREFIX];
    }

    public function getInsightConfigPath()
    {
        $configFileName = $this->currentConfigInfo[InsightExporterConstants::BASIC_INFO_INSIGHT_INFO_NAME];
        return $this->configRootPath . DIRECTORY_SEPARATOR . $configFileName;
    }

    public function getRetentionDays()
    {
        return $this->commonConfigInfo[InsightExporterConstants::BASIC_INFO_RETENTION_DAYS];
    }

    private function setCurrentConfig($nodeType)
    {
        if(AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET == $nodeType)
        {
            $this->currentConfigInfo = $this->adSetConfigInfo;
        }
        else if(AdManageConstants::INSIGHT_EXPORT_TYPE_AD == $nodeType)
        {
            $this->currentConfigInfo = $this->adConfigInfo;
        }
        else if(AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN == $nodeType)
        {
            $this->currentConfigInfo = $this->campaignConfigInfo;
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'The node type is invalid : ' . $nodeType);
        }
    }

    private function parseConfig()
    {
        $taskConfigInfo = FileHelper::readJsonFile($this->configFilePath);

        $this->commonConfigInfo = CommonHelper::getArrayValueByKey(InsightExporterConstants::BASIC_TASK_INFO_COMMON,
            $taskConfigInfo);
        $this->adConfigInfo = CommonHelper::getArrayValueByKey(InsightExporterConstants::BASIC_TASK_INFO_AD,
            $taskConfigInfo);
        $this->adSetConfigInfo = CommonHelper::getArrayValueByKey(InsightExporterConstants::BASIC_TASK_INFO_ADSET,
            $taskConfigInfo);
        $this->campaignConfigInfo = CommonHelper::getArrayValueByKey(InsightExporterConstants::BASIC_TASK_INFO_CAMPAIGN,
            $taskConfigInfo);

        $this->isExportAllAccount = CommonHelper::getArrayValueByKey(InsightExporterConstants::BASIC_INFO_EXPORT_ALL_ACCOUNT,
            $this->commonConfigInfo);

    }

    private function getAllAccountIds()
    {
        if($this->isExportAllAccount)
        {
            $accountListConfigPath = $this->configRootPath. DIRECTORY_SEPARATOR . InsightExporterConstants::CONFIG_ACCOUNT_LIST_NAME;
            $this->allAccountIds = ExporterUtil::getAllValidAccounts($accountListConfigPath);
        }
    }




}