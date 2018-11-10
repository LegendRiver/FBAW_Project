<?php


class ReportExcelHelper
{
    public static function exportReportExecl($reportData, $excelTemplatePath, $outputFilePath)
    {
        $excelObject = PHPExcel_IOFactory::load($excelTemplatePath);
        $templateSheet = $excelObject->getSheet(0);
        $style = $templateSheet->getStyle('A2');

        foreach ($reportData as $sheetName=>$sheetData)
        {
            if(empty($sheetData))
            {
                continue;
            }
            $rowNum = count($sheetData)+1;
            $dataRange = 'A1:E'.$rowNum;
            $cloneSheet = clone $templateSheet;
            $cloneSheet->setTitle($sheetName);
            $cloneSheet->fromArray($sheetData, NULL, 'A2');
            $cloneSheet->duplicateStyle($style, $dataRange);
            $excelObject->addSheet($cloneSheet);
        }
        $excelObject->removeSheetByIndex(0);

        $writer = new PHPExcel_Writer_Excel2007($excelObject);
        $writer->save($outputFilePath);
    }

    public static function readFBReportData($fbReportPath, $isOriginalRead=false)
    {
        $excelObject = PHPExcel_IOFactory::load($fbReportPath);
        $sheetNames = $excelObject->getSheetNames();

        $allSheetData = array();
        foreach($sheetNames as $sheetName)
        {
            $sheet = $excelObject->getSheetByName($sheetName);
            if($isOriginalRead)
            {
                $sheetData = $sheet->toArray();
            }
            else
            {
                $sheetData = self::getOneSheetData($sheet);
            }

            $allSheetData[$sheetName] = $sheetData;
        }

        return $allSheetData;
    }

    private static function getOneSheetData(PHPExcel_Worksheet $sheet)
    {
        $sheetArray = $sheet->toArray();
        array_shift($sheetArray);

        $dataMap = array();
        foreach($sheetArray as $row)
        {
            $date = $row[1];
            $geo = $row[3];
            $key = $date . strtolower($geo);
            $value = $row[4];
            $dataMap[$key] = $value;
        }

        return $dataMap;
    }

    public static function rewriteKwaiReport($kwaiReportPath, $outputPath, $fbData)
    {
        $objPHPExcel = PHPExcel_IOFactory::load($kwaiReportPath);
        $newExcel = clone $objPHPExcel;

        $andriodSheet = $newExcel->getSheetByName('eliads android pro fb');
        $iosSheet = $newExcel->getSheetByName('eliads ios pro fb');

        $andriodData = CommonHelper::getArrayValueByKey('Kwai_android', $fbData);
        $iosData = CommonHelper::getArrayValueByKey('Kwai_ios', $fbData);

        if($andriodData && $andriodSheet)
        {
            self::updateSheetData($andriodSheet, $andriodData);
        }

        if($iosData && $iosSheet)
        {
            self::updateSheetData($iosSheet, $iosData);
        }

        $writer = new PHPExcel_Writer_Excel2007($newExcel);
        $writer->save($outputPath);
    }

    private static function updateSheetData(PHPExcel_Worksheet $sheet, $fbData)
    {
        $highestRow = $sheet->getHighestRow();
        for ($row = 2; $row <= $highestRow; ++$row)
        {
            $cohortDay = $sheet->getCellByColumnAndRow(0, $row)->getValue();
            $dayDate = date('Ymd', PHPExcel_Shared_Date::ExcelToPHP($cohortDay));
            $geo = $sheet->getCellByColumnAndRow(1, $row)->getValue();
            $key = $dayDate . strtolower($geo);

            $fbValue = 0;
            if(!empty($fbData) && array_key_exists($key, $fbData))
            {
                $fbValue = $fbData[$key];
            }

            $sheet->getCellByColumnAndRow(2, $row)->setValue($fbValue);
        }

    }

    public static function exportHotdayExcel($fbData, $excelTemplatePath, $outputFilePath)
    {
        $excelObject = PHPExcel_IOFactory::load($excelTemplatePath);
        $templateSheet = $excelObject->getSheet(0);

        $insightSheet = clone $templateSheet;
        $insightSheet->setTitle('FB投放数据');

        $startRowNum = 2;
        foreach($fbData as $date => $insightData)
        {
            $dateRowNum = count($insightData);
            $endRowNum = $startRowNum + $dateRowNum -1;

            $insightSheet->getCellByColumnAndRow(0,$startRowNum)->setValue($date);
            $insightSheet->mergeCellsByColumnAndRow(0, $startRowNum, 0, $endRowNum);

            $dataCellStr = 'B' . $startRowNum;
            $insightSheet->fromArray($insightData, NULL, $dataCellStr);

            $startRowNum = $endRowNum + 1;
        }
        $excelObject->addSheet($insightSheet);
        $excelObject->removeSheetByIndex(0);

        $writer = new PHPExcel_Writer_Excel2007($excelObject);
        $writer->save($outputFilePath);
    }
}