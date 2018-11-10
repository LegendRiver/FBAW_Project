<?php


class ExportExcelHandler
{
    public static function exportExcel($csvRootPath, $filePrefix='')
    {
        $csvFileList = FileHelper::getFileList($csvRootPath, '.csv');

        $workbook = new PHPExcel();
        $workbook->removeSheetByIndex(0);
        foreach($csvFileList as $csvFilePath)
        {
            $sheetName = self::getSheetName($csvFilePath);
            $sheetContent = FileHelper::readCsv($csvFilePath);
            $title = $sheetContent[0];
            $lineCount = count($sheetContent);

            $sheet = $workbook->createSheet();
            $sheet->setTitle($sheetName);
            $sheet->fromArray($sheetContent);

            self::setIDColumnTxt($sheet, $title, $lineCount);
            self::setNumFormat($sheet, $title, $lineCount);
            self::setColumnAutoSize($sheet, count($title));

            print_r('####Imported csv file :' . $csvFilePath . '.....' . PHP_EOL);
        }

        $writer = new PHPExcel_Writer_Excel2007($workbook);
        $dateStr = date('Y-m-d-H-i-s');
        $excelName = $csvRootPath . DIRECTORY_SEPARATOR . $filePrefix .
            $dateStr . '.xlsx';
        $writer->save($excelName);
    }

    private static function setNumFormat(PHPExcel_Worksheet $sheet, $title, $lineCount)
    {
        $titleCount = count($title);

        for($columnIndex=0; $columnIndex<$titleCount; ++$columnIndex)
        {
            if(self::isSetNumFormatColumn($title[$columnIndex]))
            {
                for($rowNum=2; $rowNum <= $lineCount; ++$rowNum)
                {
                    $cell = $sheet->getCellByColumnAndRow($columnIndex, $rowNum);
                    $cell->getStyle()->getNumberFormat()->setFormatCode('#,##0');
                }
            }
        }
    }

    private static function isSetNumFormatColumn($columnTitle)
    {
        foreach(self::$titleKeys as $key)
        {
            if(false !== strpos($columnTitle, $key))
            {
                return true;
            }
        }

        return false;
    }

    private static function setIDColumnTxt(PHPExcel_Worksheet $sheet, $title, $lineCount)
    {
        $indexID = array_search(ExportCsvConstant::CSV_FIELD_NAME_ID, $title);
        if(false === $indexID)
        {
            return;
        }

        for($rowNum=2; $rowNum <= $lineCount; ++$rowNum)
        {
            $cell = $sheet->getCellByColumnAndRow($indexID, $rowNum);
            $cell->setDataType(PHPExcel_Cell_DataType::TYPE_STRING);
        }
    }

    private static function getSheetName($csvFilePath)
    {
        $fileName = basename($csvFilePath);
        $splitArray = explode(ExportCsvConstant::CSV_FILE_NAME_CONNECTOR, $fileName);
        $fileKey = $splitArray[0];

        return $fileKey;
    }

    private static function setColumnAutoSize(PHPExcel_Worksheet $sheet, $columnCount)
    {
        for($index=0; $index<$columnCount; ++$index)
        {
            $sheet->getColumnDimensionByColumn($index)->setAutoSize(true);
        }
    }

    private static $titleKeys = array(
        ExportCsvConstant::CSV_FIELD_NAME_AUDIENCE_SIZE,
        ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_DAILY_REACH_MIN,
        ExportCsvConstant::CSV_FIELD_NAME_COUNTRY_DAILY_REACH_MAX,
    );
}