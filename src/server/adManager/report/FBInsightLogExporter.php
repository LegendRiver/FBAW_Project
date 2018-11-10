<?php


class FBInsightLogExporter
{
    private $className2Instance;

    public function __construct()
    {
        $this->className2Instance = array();
    }

    public function setInstances($instanceArray)
    {
        foreach($instanceArray as $instance)
        {
            $className = get_class($instance);
            $this->className2Instance[$className] = $instance;
        }

        $this->className2Instance[__CLASS__] = $this;
    }

    public function getCsvTitle()
    {
        return ReportFieldManager::instance()->getCsvTitle();
    }

    public function exportLog()
    {
        $exportContent = array();
        $fields = ReportFieldManager::instance()->getConstants();
        $functionMap = ReportFieldManager::instance()->getFunctionMap();
        foreach ($fields as $field)
        {
            if(!array_key_exists($field, $functionMap))
            {
                ServerLogger::instance()->writeReportLog(Warning, 'There is not field in function map. field : ' . $field);
                return false;
            }
            $methodArray = $functionMap[$field];
            $className = $methodArray[0];

            if(!array_key_exists($className, $this->className2Instance))
            {
                ServerLogger::instance()->writeReportLog(Warning, 'There is not instance in instance map by class name : ' . $className);
                return false;
            }
            $instance = $this->className2Instance[$className];
            $methodArray[0] = $instance;

            $value = call_user_func_array($methodArray, array());
            if($field == ReportFieldManager::REPORT_FIELD_AUDIENCE)
            {
                $audienceValues = $this->extractTargetingValue($value);
                $exportContent = array_merge($exportContent, $audienceValues);
            }
            else
            {
                $exportContent[] = $value;
            }
        }

        return $exportContent;
    }


    private function extractTargetingValue($packageValue)
    {
        $targetingValues = array();

        $packageArray = FileHelper::decodeJsonString($packageValue);
        $targetingReportField = ReportFieldManager::instance()->getTargetingExportLogTitle();
        foreach($targetingReportField as $targetingField)
        {
            if(array_key_exists($targetingField, $packageArray))
            {
                $targetingV = $packageArray[$targetingField];
                if(is_array($targetingV))
                {
                    $targetingV = implode(';', $targetingV);
                }
                $targetingValues[] = $targetingV;
            }
            else
            {
                $targetingValues = '';
            }
        }

        return $targetingValues;
    }

    public function getRequestTime()
    {
        return date('Y-m-d H:i:s');
    }

}