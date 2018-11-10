<?php


class ExportRun
{
    private $configFile;
    private $csvDir;
    private $mergerCsvDir;

    public function __construct($configFile, $csvDir, $mergerCsvDir)
    {
        $this->configFile = $configFile;
        $this->csvDir = $csvDir;
        $this->mergerCsvDir = $mergerCsvDir;
    }

    public function exportData($isMerger = false, $isExportFlexible = false, $changeApp='')
    {
        if(!empty($changeApp))
        {
            FBAPIManager::instance()->changeApi($changeApp);
        }

        $configInfos = FileHelper::readJsonFile($this->configFile);
        $this->generateTargetingCsv($configInfos,$isExportFlexible);

        if($isMerger)
        {
            TargetingCsvFileHandler::mergerCsvFiles($this->csvDir, $this->mergerCsvDir);
            $filePrefix = $configInfos[ExportCsvConstant::CONFIG_ITEM_NAME_EXCEL_PREFIX];
            ExportExcelHandler::exportExcel($this->mergerCsvDir, $filePrefix);
        }

    }

    private function generateTargetingCsv($configInfos, $isExportFlexible = false)
    {
        $commonFields = $configInfos[ExportCsvConstant::CONFIG_ITEM_NAME_COMMON];
        $searchClasses = $configInfos[ExportCsvConstant::CONFIG_ITEM_NAME_FLEXIBLE][ExportCsvConstant::CONFIG_ITEM_NAME_CLASS];
        $locales = $configInfos[ExportCsvConstant::CONFIG_ITEM_NAME_BASIC][ExportCsvConstant::CONFIG_ITEM_NAME_LOCALE];
        $estimateParam = $configInfos[ExportCsvConstant::CONFIG_ITEM_NAME_ESTIMATE_PARAM];


        if(empty($commonFields))
        {
            ServerLogger::instance()->writeLog(Warning, 'The country code is empty.');
            return;
        }

        $commonEntityList = TargetingSearchCsvUtil::getCommonParamList($commonFields, $estimateParam);

        if(!empty($searchClasses) && $isExportFlexible)
        {
            $this->generateSearchClassCsv($searchClasses, $commonEntityList);
        }

        if(!empty($locales))
        {
            $this->generateLocaleCsv($locales, $commonEntityList);
        }
    }

    private function generateSearchClassCsv($searchClasses, $commonEntityList)
    {
//    $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'searchConfig.json';
//    $configInfos = FileHelper::readJsonFile($configFile);
//    $searchClasses = $configInfos[ExportCsvConstant::CONFIG_ITEM_NAME_CLASS];
//    $countryCodes = $configInfos[ExportCsvConstant::CONFIG_ITEM_NAME_COUNTRY_CODE];

        $exportFilePath = $this->csvDir;
        foreach($searchClasses as $searchClass)
        {
            print_r('######## Now exporting ' . $searchClass . ' ###########' . PHP_EOL);

            foreach($commonEntityList as $configEntity)
            {
                print_r('++++++++ Now exporting country : ' . $configEntity->getDescription() . ' +++++++' . PHP_EOL);

                if($searchClass == TargetingConstants::P_SEARCH_CLASS_RELATIONSHIP_STATUS ||
                    $searchClass == TargetingConstants::P_SEARCH_CLASS_EDUCATION_STATUS)
                {
                    $this->generateOneStatusCsv($searchClass, $exportFilePath, $configEntity);
                }
                else
                {
                    TargetingSearchCsvUtil::exportTargetingInfo($searchClass, $exportFilePath, $configEntity);
                }

                sleep(30);
            }
        }

    }

    private function generateOneStatusCsv($statusClass, $exportFilePath, $configEntity)
    {
        $classParam = array(ExportCsvConstant::CONFIG_ITEM_NAME_FLEXIBLE, $statusClass);

        if($statusClass == TargetingConstants::P_SEARCH_CLASS_RELATIONSHIP_STATUS)
        {
            $statusMap = TargetingSearchCsvUtil::$relationShipMap;
        }
        else if($statusClass == TargetingConstants::P_SEARCH_CLASS_EDUCATION_STATUS)
        {
            $statusMap = TargetingSearchCsvUtil::$educationStatusMap;
        }
        else
        {
            $statusMap = array();
        }

        TargetingSearchCsvUtil::exportGeneralTargetingCsv($classParam, $exportFilePath, $configEntity, $statusMap);
    }

    private function generateLocaleCsv($locales, $commonEntityList)
    {
        $classParam = array(ExportCsvConstant::CONFIG_ITEM_NAME_BASIC, ExportCsvConstant::CONFIG_ITEM_NAME_LOCALE);
        $csvPath = $this->csvDir;

        $localeMap = FileHelper::readJsonFile(EL_SERVER_PATH . 'conf/locales_FB.json');
        $valueLocaleMap = array_flip($localeMap);

        print_r('######## Now exporting locales ###########' . PHP_EOL);

        foreach($commonEntityList as $paramEntity)
        {
            $valueNameMap = array();
            foreach($locales as $locale)
            {
                $localeName = $valueLocaleMap[$locale];
                $valueNameMap[$locale] = $localeName;
            }

            TargetingSearchCsvUtil::exportGeneralTargetingCsv($classParam, $csvPath, $paramEntity, $valueNameMap);
        }
    }
}