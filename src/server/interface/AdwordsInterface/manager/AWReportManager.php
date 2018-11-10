<?php
use Google\AdsApi\AdWords\v201705\cm\ReportDefinitionReportType;
use Google\AdsApi\AdWords\Reporting\v201705\ReportDownloader;
use Google\AdsApi\AdWords\Reporting\v201705\DownloadFormat;

class AWReportManager extends AbstractAWManager
{
    public function queryReportData($accountId, $awql)
    {
        try
        {
            $session = $this->getSession($accountId);
            $reportFormat = DownloadFormat::CSV;
            $reportDownloader = new ReportDownloader($session);
            $reportDownloadResult = $reportDownloader->downloadReportWithAwql($awql, $reportFormat);
            $data = $reportDownloadResult->getAsString();
            return $this->transformReportData($data);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeAdwordsExceptionLog(Error, $e);
            return false;
        }
    }

    private function transformReportData($dataStr)
    {
        $stringDataArray = explode("\n", $dataStr);
        array_shift($stringDataArray);
        array_pop($stringDataArray);
        array_pop($stringDataArray);

        $reportData = array();
        foreach ($stringDataArray as $row)
        {
            $rowArray = explode(',', $row);
            $reportData[] = $rowArray;
        }

        return $reportData;
    }

    public function getReportFields($reportType)
    {
        if(array_key_exists($reportType, self::$reportTypeMap))
        {
            $awReportType = self::$reportTypeMap[$reportType];
            $reportDefinitionFields = $this->getService()->getReportFields($awReportType);
            return $reportDefinitionFields;
        }
        else
        {
            ServerLogger::instance()->writeAdwordsLog(Warning, 'There is not report type in Map.');
            return false;
        }
    }

    private function getSession($accountId = null)
    {
        return AWServiceManager::getInstance()->getSessionByCustomer($accountId);
    }

    protected function getService($customerAccountId = null)
    {
        return AWServiceManager::getInstance()->getReportDefineService($customerAccountId);
    }

    protected function buildEntity($entry)
    {
        return $entry;
    }

    private static $reportTypeMap = array(
        AWCommonConstants::REPORT_CAMPAIGN_PERFORMANCE => ReportDefinitionReportType::CAMPAIGN_PERFORMANCE_REPORT,
    );
}