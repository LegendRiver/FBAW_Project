<?php


class HotdayReportHandler
{
    private $templateFilePath;

    private $facebookTemplatePath;

    private $facebookFilePath;

    private $confFilePath;
    private $mailConfigFile;

    private $outputPath;
    private $outputFilePath;

    public function __construct($rootPath)
    {
        $hotdayTemplatePath = $rootPath . 'hotdayTemplate' . DIRECTORY_SEPARATOR;
        $this->facebookFilePath = $hotdayTemplatePath  . 'facebook_data.xlsx';
        $this->templateFilePath = $hotdayTemplatePath . 'hotday_template.xlsx';

        $confPath = $rootPath . 'conf'. DIRECTORY_SEPARATOR;
        $this->confFilePath = $confPath . 'basicConfig_hotday.json';
        $this->mailConfigFile = $confPath . 'mailConfig_hotday.json';

        $facebookTemplatePath = $rootPath . 'template' . DIRECTORY_SEPARATOR ;
        $this->facebookTemplatePath = $facebookTemplatePath . 'template.xlsx';

        $this->outputPath = $hotdayTemplatePath;
    }

    public function exportReport($isSendMail=true, $isGenerateFBReport=true)
    {
        $outputFileName = '投放数据日报_' . date('Ymd') . '.xlsx';

        if($isGenerateFBReport)
        {
            $this->exportFacebookReport();
        }

        $fbData = ReportExcelHelper::readFBReportData($this->facebookFilePath, true);
        if(!array_key_exists('Hotday', $fbData))
        {
            return;
        }
        $hotdayData = $fbData['Hotday'];
        $outputData = $this->reconstructData($hotdayData);

        $this->outputFilePath = $this->outputPath . $outputFileName;
        ReportExcelHelper::exportHotdayExcel($outputData, $this->templateFilePath, $this->outputFilePath);

        if($isSendMail)
        {
            $this->sendReportMail();
        }

    }

    private function sendReportMail()
    {
        $mailConfigInfo = FileHelper::readJsonFile($this->mailConfigFile);
        $subject = $mailConfigInfo['mailSubject'];
        $toAddress = $mailConfigInfo['mailToAddress'];
        $ccAddress = $mailConfigInfo['mailCCAddress'];

        $message = '您好：<br /><br />';
        $message .= 'Facebook投放数据见附件，请查收。<br /><br />';
        $message .= '谢谢！';

        $attachments = array(
            $this->outputFilePath,
        );

        MailerHelper::instance()->sendMail($toAddress, $subject, $message, $ccAddress, $attachments);
    }

    private function reconstructData($insightData)
    {
        $resultArray = array();
        array_shift($insightData);
        foreach($insightData as $dataArray)
        {
            $date = CommonHelper::dateFormatConvert('Y/m/d', $dataArray[1]);
            $geo = $dataArray[3];
            $install = $dataArray[4];
            $geoData = array($geo,$install);
            if(array_key_exists($date, $resultArray))
            {
                $resultArray[$date][] = $geoData;
            }
            else
            {
                $dateData = array($geoData);
                $resultArray[$date] = $dateData;
            }
        }

        return $resultArray;
    }

    private function exportFacebookReport()
    {
        $configReader = new ConfigFileReader($this->confFilePath);
        $configOutputPath = $configReader->getOutputPath();
        if(!empty($configOutputPath))
        {
            $this->outputPath = $configOutputPath;
        }

        $insightHelper = new ReporterInsightHelper($configReader);
        $fbData = $insightHelper->getReporterData();

        ReportExcelHelper::exportReportExecl($fbData, $this->facebookTemplatePath, $this->facebookFilePath);
    }
}