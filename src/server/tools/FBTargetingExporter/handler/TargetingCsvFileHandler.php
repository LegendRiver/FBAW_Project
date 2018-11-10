<?php


class TargetingCsvFileHandler
{
    //只针对此工具导出的文件
    public static function mergerCsvFiles($fileRootPath, $mergerFilePath)
    {
        $csvFiles = FileHelper::getFileList($fileRootPath, '.csv');

        $classifyFileMap = self::classifyFiles($csvFiles);

        foreach($classifyFileMap as $fileKey=>$filePath)
        {
            print_r('######## Now mergering ' . $fileKey . ' ###########' . PHP_EOL);

            $keyField = ExportCsvConstant::$CSV_CLASS_KEY_FILED_MAP[$fileKey];
            if(empty($keyField))
            {
                ServerLogger::instance()->writeLog(Warning, 'Can not find key field by :' . $fileKey);
                continue;
            }
            $fileContent = self::mergerOneClassFiles($filePath, $keyField);

            $saveFilePath = $mergerFilePath . DIRECTORY_SEPARATOR . $fileKey .
                ExportCsvConstant::CSV_FILE_NAME_CONNECTOR . time() . '.csv';
            FileHelper::saveCsv($saveFilePath, $fileContent);
        }
    }

    private static function mergerOneClassFiles($filePathArray, $keyField)
    {
        $mergerContent = array();

        $mergerTitle = array();
        $mergerValue = array();
        $appendTitleCount = count(TargetingSearchCsvUtil::$countryFieldList);

        foreach($filePathArray as $filePath)
        {
            $fileContent = FileHelper::readCsv($filePath);
            $titleContent = array_shift($fileContent);
            if(empty($fileContent))
            {
                continue;
            }
            if(empty($mergerTitle))
            {
                $mergerTitle = array_merge($mergerTitle, $titleContent);
            }
            else
            {
                $appendTitle = array_slice($titleContent, -$appendTitleCount, $appendTitleCount);
                $mergerTitle = array_merge($mergerTitle, $appendTitle);
            }

            $keyPos = array_search($keyField, $titleContent);
            if(false === $keyPos)
            {
                $keyPos = 0;
            }

            $keyValueBackup = array();
            foreach($fileContent as $line)
            {
                $lineKey = $line[$keyPos];
                if(in_array($lineKey, $keyValueBackup))
                {
                    continue;
                }
                else
                {
                    $keyValueBackup[] = $lineKey;
                }

                if(array_key_exists($lineKey, $mergerValue))
                {
                    $appendValue = array_slice($line, -$appendTitleCount, $appendTitleCount);
                    $mergerValue[$lineKey] = array_merge( $mergerValue[$lineKey], $appendValue);
                }
                else
                {
                    $mergerValue[$lineKey] = $line;
                }
            }

        }

        $mergerContent[] = $mergerTitle;
        $mergerContent = array_merge($mergerContent, $mergerValue);

        return $mergerContent;

    }


    private static function classifyFiles($fileList)
    {
        $classifyResult = array();

        foreach ($fileList as $filePath)
        {
            $fileName = basename($filePath);
            $splitArray = explode(ExportCsvConstant::CSV_FILE_NAME_CONNECTOR, $fileName);
            $fileKey = $splitArray[0];
            if(array_key_exists($fileKey, $classifyResult))
            {
                $classifyResult[$fileKey][] = $filePath;
            }
            else
            {
                $classifyResult[$fileKey] = array($filePath,);
            }
        }

        return $classifyResult;
    }

}
