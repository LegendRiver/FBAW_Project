<?php

/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 11/28/16
 * Time: 3:48 PM
 */

class CEliReport extends  CBaseObject
{
    public static $TABLE_NAME = "T_ELI_REPORT";
    public static $ID = "ID";

    private $EliLoginRecord = null;
    private $File = null;

    private $PdfCreater = null;
    public function  __construct($config, $log, $dbInterface)
    {
        $this->_ClassName = "CEliReport";
        $this->TableName = self::$TABLE_NAME;
        $this->EliLoginRecord = new CEliLoginRecord($config, $log, $dbInterface);
        $this->PdfCreater = new tFPDF('P','pt','A4');

        parent::__construct($config, $log, $dbInterface);
        $this->addAllowAccessFunction("createWeekReport");
    }

    public function  __destruct()
    {
        parent::__destruct();
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

    private function createTable($table)
    {
        $records = $table->getRecords();
        $columns = $table->getColumns();
        $this->PdfCreater->SetFont('SimHei','',10);
        $this->PdfCreater->SetDrawColor(0, 0, 0);
        $this->PdfCreater->SetLineWidth(0.2);

        foreach ($columns as $column)
        {
            $this->PdfCreater->Cell($column->Width, $column->Height, $column->Label, 1);
        }

        $this->PdfCreater->Ln();

        foreach($records as $record)
        {
            foreach ($columns as $column)
            {
                $this->PdfCreater->Cell($column->Width, $column->Height, $record[$column->Index], 1);
            }

            $this->PdfCreater->Ln();
        }
    }

    public function createWeekReport()
    {
        $result = new CResult();
        if(!$this->PdfCreater)
        {
            $result->setErrorCode(ERR_PDF_CREATOR_INIT_FAILED);
            $result->setMessage("Init pdf creator failed.");
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $reportStoreRootPath = $this->Config->getConfigItemValue(ReportStorePath);
        if(!file_exists($reportStoreRootPath))
        {
            try
            {
                $createResult = @mkdir($reportStoreRootPath, 777, true);
            }
            catch (Exception $ex)
            {
                $result->setErrorCode(ERR_CREATE_REPORT_ROOT_PATH_EXCEPTION);
                $result->setMessage(sprintf("Create report store path <%s> failed, error message <%s>.", $reportStoreRootPath, $ex->getMessage()));
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
                return $result;
            }

            if($createResult === FALSE)
            {
                $result->setErrorCode(ERR_CREATE_REPORT_ROOT_PATH_FAILED);
                $result->setMessage(sprintf("Create report store path <%s> failed.", $reportStoreRootPath));
                $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
                return $result;
            }
        }

        if(!is_dir($reportStoreRootPath))
        {
            $result->setErrorCode(ERR_REPORT_ROOT_PATH_IS_NOT_DIRECTORY);
            $result->setMessage(sprintf("Report store path <%s> is not a directory.", $reportStoreRootPath));
            $this->Log->writeLog(Error, __FILE__, __FUNCTION__, __LINE__, $result->getMessage());
            return $result;
        }

        $reportFile = sprintf("%s/%s.pdf", $reportStoreRootPath, CPublic::getGuid());
        $this->PdfCreater->AddPage();
        $this->initReportHeader('XX帐户消费周报');
        $table = $this->initReportTable();
        $this->createTable($table);
        $this->PdfCreater->Cell(40,10,'Hello World!');
        $this->PdfCreater->Output($reportFile, 'F');
        $this->PdfCreater->Close();
        $result->setErrorCode(OK);
        $result->setMessage("");
        return $result;
    }

    private function initReportTable()
    {
        $table = new CTable();
        $countryColumn = new CColumn();
        $countryColumn->Name = 'Country';
        $countryColumn->Label ='国家';
        $countryColumn->Width = 40;
        $countryColumn->Height = 6;
        $table->addColumn($countryColumn);

        $capitalColumn = new CColumn();
        $capitalColumn->Name = 'Capital';
        $capitalColumn->Label ='首都';
        $capitalColumn->Width = 40;
        $capitalColumn->Height = 6;
        $table->addColumn($capitalColumn);

        $areaColumn = new CColumn();
        $areaColumn->Name = 'Area';
        $areaColumn->Label ='面积';
        $areaColumn->Width = 40;
        $areaColumn->Height = 6;
        $table->addColumn($areaColumn);

        $record1 = array('Austria', 'Vienna', 83859);
        $record2 = array('Belgium', 'Brussels', 30518);

        $table->addRecord($record1);
        $table->addRecord($record2);

        return $table;
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