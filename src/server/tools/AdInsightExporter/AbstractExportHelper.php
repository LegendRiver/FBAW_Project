<?php


abstract class AbstractExportHelper
{
    protected static $instance = null;

    protected $entities = array();

    public static function getInstance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function exportCsvFile($insightInfoPath, $exportId, $sinceDate='', $utilDate='',
                                         $exportDimension = AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN,
                                         $exportPath = '', $fileNamePrefix = '', $isExportRetention=false)
    {
        $exportContent = array();
        $insightInfoConfig = FileHelper::readJsonFile($insightInfoPath);
        $csvTitle = $this->generateCSVTitle($insightInfoConfig, true);
        $exportContent[] = $csvTitle;

        $subNodeIds = $this->getNodeIds($exportId, $exportDimension);

        $currentDate = date("Y-m-d");
        $accountId = '';
        foreach($subNodeIds as $subNodeId)
        {
            $insightArray = $this->getNodeInsights($subNodeId, $sinceDate, $utilDate);
            $requestTime = $this->getRequestTime($isExportRetention);
            if(empty($insightArray))
            {
                continue;
            }
            //不支持breakdown
            $insightData = $insightArray[0];
            if(empty($accountId))
            {
                $accountId = $insightData['account_id'];
            }
            //如果获取当天insight，将date_start date_end 时间改为当前时区日期,只改结束时间（20170630 20:42）
            if(empty($sinceDate) || empty($utilDate))
            {
                //$insightData['date_start'] = $currentDate;
                $insightData['date_stop'] = $currentDate;
            }
            //初始化option实例
            $this->initOptionInstance($insightData);

            $csvLine = $this->buildOneAdInsightValue($insightData, $insightInfoConfig, $requestTime);
            $exportContent[] = $csvLine;
        }

        if(empty($exportPath))
        {
            $outputDir = __DIR__ . DIRECTORY_SEPARATOR . 'csvFiles/' . $accountId;
        }
        else
        {
            if(empty($accountId))
            {
                return;
            }
            $outputDir = $exportPath . DIRECTORY_SEPARATOR . $accountId;
        }

        if(false === FileHelper::createDir($outputDir, 0777, true))
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to create dir: ' . $outputDir);
            return;
        }

        if($isExportRetention)
        {
            $outputFile = $outputDir . DIRECTORY_SEPARATOR . $fileNamePrefix . $sinceDate . '.tsv';
        }
        else
        {
            $outputFile = $outputDir . DIRECTORY_SEPARATOR . $fileNamePrefix . $currentDate . '.tsv';
        }

        if(file_exists($outputFile))
        {
            array_shift($exportContent);
        }

        FileHelper::saveCsv($outputFile, $exportContent, "\t");
    }

    private function getRequestTime($isExportRetention)
    {
        if($isExportRetention)
        {
            return date('Y-m-d H:i:s');
        }
        else
        {
            return date('H:i:s');
        }
    }

    private function buildOneAdInsightValue($insightArray, $insightInfoConfig, $requestTime)
    {
        $insightValue = array();
        $manualMap = array(
            InsightExporterConstants::INSIGHT_INFO_SPECIAL_REQUEST_TIME => $requestTime,
        );
        foreach($insightInfoConfig as $infoKey=>$infoContent)
        {
            if(!$this->checkOption($infoContent))
            {
                continue;
            }

            $value = InsightValueReader::getInsightByConf($infoKey, $infoContent, $insightArray,
                $this->entities, $manualMap);

            if(is_array($value))
            {
                $insightValue = array_merge($insightValue, $value);
            }
            else
            {
                $insightValue[] = $value;
            }
        }

        return $insightValue;
    }

    public function generateCSVTitle($insightInfoConfig, $isAlias=false, $isWrite = false)
    {
        $csvTitle = array();
        foreach ($insightInfoConfig as $insightKey=>$keyConfig)
        {
            if(!$this->checkOption($keyConfig))
            {
                continue;
            }

            $titleName = InsightValueReader::getTitleByConf($insightKey, $keyConfig, $isAlias);
            if(is_array($titleName))
            {
                $csvTitle = array_merge($csvTitle, $titleName);
            }
            else
            {
                $csvTitle[] = $titleName;
            }
        }

        if($isWrite)
        {
            $outputFile = __DIR__ . DIRECTORY_SEPARATOR . 'conf/csvTitle.json';
            FileHelper::writeJsonFile($csvTitle, $outputFile);
        }

        return $csvTitle;
    }

    private function checkOption($keyConfig)
    {
        if(array_key_exists(InsightExporterConstants::INSIGHT_INFO_OPTION_LEVEL, $keyConfig))
        {
            $optionLevels = $keyConfig[InsightExporterConstants::INSIGHT_INFO_OPTION_LEVEL];
        }
        else
        {
            $optionLevels = array();
        }

        return $this->isNodeLevelExport($optionLevels);
    }

    abstract protected function getNodeInsights($nodeId, $sinceDate, $utilDate);
    abstract protected function getNodeIds($parentId, $parentType);
    abstract protected function initOptionInstance($insightData);
    abstract protected function isNodeLevelExport($optionLevels);
}