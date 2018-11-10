<?php

class ReportRun
{
    public static function exportDefaultReport($configFile, $templateFile, $outputPath)
    {
        self::exportReport($configFile, $templateFile, $outputPath);
    }

    public static function exportDefaultReportByOs($configFile, $templateFile, $outputPath, $outputFileName='')
    {
        self::exportReportByOs($configFile, $templateFile, $outputPath, $outputFileName);
    }

    public static function exportSpendReport($configFile, $templateFile, $outputPath, $outputFileName='')
    {
        $installConf = InsightValueReader::buildInstallConfig();
        $spendConf =InsightValueReader::buildSpendConfig();
        $fieldConf = array_merge($installConf, $spendConf);
        self::exportReport($configFile, $templateFile, $outputPath, $outputFileName, $fieldConf);
    }

    public static function exportProfitReport($configFile, $templateFile, $outputPath, $outputFileName='',
                                              $startDate='', $endDate='')
    {
        $installConf = InsightValueReader::buildInstallConfig();
        $spendConf =InsightValueReader::buildSpendConfig();
        $fieldConf = array_merge($installConf, $spendConf);
        self::exportReport($configFile, $templateFile, $outputPath, $outputFileName, $fieldConf, $startDate, $endDate);
    }

    public static function exportProfitReportByOs($configFile, $templateFile, $outputPath, $outputFileName='',
                                              $startDate='', $endDate='')
    {
        $installConf = InsightValueReader::buildInstallConfig();
        $spendConf =InsightValueReader::buildSpendConfig();
        $fieldConf = array_merge($installConf, $spendConf);
        self::exportReportByOs($configFile, $templateFile, $outputPath, $outputFileName, $fieldConf, $startDate, $endDate);
    }

    private static function exportReportByOs($configFile, $templateFile, $outputPath, $outputFileName='',
                                             $insightFieldConf=array(), $startDate='', $endDate='')
    {
        $configReader = new ConfigFileReader($configFile);
        if(!empty($startDate))
        {
            $configReader->setStartDate($startDate);
        }
        if(!empty($endDate))
        {
            $configReader->setEndDate($endDate);
        }
        $insightHelper = new OSInsightHelper($configReader, $insightFieldConf);

        $firstData = $insightHelper->getReporterData();
        $insightHelper->switchPlatform();
        $secondData = $insightHelper->getReporterData();

        $insightAll = array();

        $productNames = array_keys($firstData);
        foreach ($productNames as $product)
        {
            $androidName = $product . '_' . AdManageConstants::OS_ANDROID;
            $iosName = $product . '_' . AdManageConstants::OS_IOS;
            if($insightHelper->isGetAndroid())
            {
                $insightAll[$androidName] = $secondData[$product];
                $insightAll[$iosName] = $firstData[$product];
            }
            else
            {
                $insightAll[$androidName] = $firstData[$product];
                $insightAll[$iosName] = $secondData[$product];
            }
        }

        self::exportInsightExcel($insightAll, $templateFile, $configReader, $outputFileName, $outputPath);
    }

    private static function exportReport($configFile, $templateFile, $outputPath, $outputFileName='',
                                         $insightFieldConf=array(), $startDate='', $endDate='')
    {
        $configReader = new ConfigFileReader($configFile);
        if(!empty($startDate))
        {
            $configReader->setStartDate($startDate);
        }
        if(!empty($endDate))
        {
            $configReader->setEndDate($endDate);
        }

        $insightHelper = new ReporterInsightHelper($configReader, $insightFieldConf);

        $reportData = $insightHelper->getReporterData();

        self::exportInsightExcel($reportData, $templateFile, $configReader, $outputFileName, $outputPath);
    }

    public static function exportBreakdownReport($configFile, $templateFile, $outputPath)
    {
        $reader = new BDConfReader($configFile);
        $handler = new BDReportHandler($reader);
        $reportData = $handler->exportBDReport();

        self::exportInsightExcel($reportData, $templateFile, $reader, '', $outputPath);
    }

    public static function exportDeviceBreakdownReport($configFile, $templateFile, $outputPath)
    {
        $reader = new DeviceBDConfReader($configFile);
        $handler = new DeviceBDHandler($reader);
        $reportData = $handler->exportBDReport();

        self::exportInsightExcel($reportData, $templateFile, $reader, '', $outputPath);
    }

    private static function exportInsightExcel($reportData, $templateFile, $configReader, $outputFileName, $outputPath)
    {
        if(empty($outputFileName))
        {
            $startDate = CommonHelper::dateFormatConvert('Ymd', $configReader->getStartDate());
            $endDate = CommonHelper::dateFormatConvert('Ymd', $configReader->getEndDate());
            $fileName = '投放数据_Facebook(' . $startDate . '-' . $endDate . ').xlsx';
        }
        else
        {
            $fileName = $outputFileName;
        }

        $outputFile = $outputPath . DIRECTORY_SEPARATOR . $fileName;

        ReportExcelHelper::exportReportExecl($reportData, $templateFile, $outputFile);
    }
}