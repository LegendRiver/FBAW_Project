<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 12/12/16
 * Time: 12:12 PM
 */
class CWeekReport extends CBaseObject
{
    private static $TABLE_NAME = "T_ELI_ACCOUNT_REPORT";
    public static $ID = "ID";
    private static $ELI_ACCOUNT_ID = "ELI_ACCOUNT_ID";
    private static $START_DATE = "START_DATE";
    private static $END_DATE = "END_DATE";
    private static $REPORT_URL = "REPORT_URL";
    private static $BUILD_STATUS = "BUILD_STATUS";
    private static $BUILD_TIME = "BUILD_TIME";
    private static $REPORT_TITLE = "REPORT_TITLE";

    private $EliCampaignConfigSpentRecord = null;
    private $PdfCreater = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CWeekReport";
        $this->TableName = self::$TABLE_NAME;
        $this->EliCampaignConfigSpentRecord = new CEliCampaignConfigSpentRecord($config, $log, $dbInterface);
        parent::__construct($config, $log, $dbInterface);
    }


    public function  __destruct()
    {
        parent::__destruct();
    }

    public function buildReport($weekNumber)
    {
        $spentRecords = array();

        $errorCode = $this->EliCampaignConfigSpentRecord->queryWeekSpentRecords($weekNumber, $spentRecords);
        if($errorCode != OK)
        {
            return $errorCode;
        }


        return OK;
    }

    private function createAccountWeekReport()
    {
        $this->PdfCreater = new tFPDF('P','pt','A4');
        $this->initReportHeader();
    }

    private function initReportHeader($reportTitle)
    {
        // Logo
        // Arial bold 15
        $this->PdfCreater->AddFont('SimHei','','simhei.ttf',true);
        $this->PdfCreater->SetFont('SimHei','',15);

        $this->PdfCreater->Image('images/report/logo_en.png',76,22,115,36,'PNG','http://www.eliads.com');

        // Title
        $this->PdfCreater->Cell(464,61,$reportTitle,0,0,'C');

        $rightX = $this->PdfCreater->GetPageWidth() - 75;
        $this->PdfCreater->SetDrawColor(230,233,233);
        $this->PdfCreater->SetLineWidth(0.3);
        $this->PdfCreater->Line(75,100,$rightX,100);

        // Line break
        $this->PdfCreater->Ln(20);

    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
        $this->addField(self::$ID, STRING, "");
        $this->addField(self::$ELI_ACCOUNT_ID, STRING, "");
        $this->addField(self::$START_DATE, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$END_DATE, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$REPORT_URL, INTEGER, 0);
        $this->addField(self::$BUILD_STATUS, INTEGER, 0);
        $this->addField(self::$BUILD_TIME, STRING, date('Y-m-d H:i:s'));
        $this->addField(self::$REPORT_TITLE, STRING, "");
    }
}