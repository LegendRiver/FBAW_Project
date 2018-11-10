<?php


class FileHelper
{
    public static function getFileNameFromPath($path)
    {
      $baseName = basename($path);
      $pos = strrpos($baseName, '.');
      if(false === $pos)
      {
          return $baseName;
      }
      else
      {
          return substr($baseName, 0, $pos);
      }
    }

    public static function getFileList($dir, $extend = '.')
    {
        //dir 最后不能带/
        $fileArray = array();
        $allFileNames = scandir($dir);

        foreach($allFileNames as $fileName)
        {
            if ($fileName != "." && $fileName != ".." && strripos($fileName, $extend))
            {
                $filePath = $dir . DIRECTORY_SEPARATOR . $fileName;
                $fileArray[] = $filePath;
            }
        }

        asort($fileArray);

        return $fileArray;

    }

    public static function getSubDirList($dir)
    {
        $fileArray = array();
        $allFileNames = scandir($dir);

        foreach($allFileNames as $fileName)
        {
            if ($fileName != "." && $fileName != "..")
            {
                $filePath = $dir . DIRECTORY_SEPARATOR . $fileName;
                if(is_dir($filePath))
                {
                    $fileArray[] = $filePath;
                }
            }
        }

        return $fileArray;
    }

    public static function getRecursiveFileList($filePath, $extends = array('.'))
    {
        $fileList = array();
        if(is_dir($filePath))
        {
            $dp = dir($filePath);
            while (false !== ($file = $dp->read()))
            {
                if($file !="." && $file !="..")
                {
                    $subFileList = self::getRecursiveFileList($filePath . DIRECTORY_SEPARATOR . $file, $extends);
                    $fileList = array_merge($fileList, $subFileList);
                }
            }
            $dp ->close();
        }

        if(is_file($filePath))
        {
            if(self::filterExtend($filePath, $extends))
            {
                $fileList[] = $filePath;
            }
        }

        asort($fileList);

        return $fileList;
    }

    private static function filterExtend($filePath, $extendArray)
    {
        foreach($extendArray as $extend)
        {
            if(strripos($filePath, $extend))
            {
                return true;
            }
        }

        return false;
    }

    public static function readCsv($fileName, $length = 1000, $delimiter = ',')
    {
        $fileContent = array();
        try
        {
            if (($handle = fopen($fileName, "r")) !== false)
            {
                while (($data = fgetcsv($handle, $length, $delimiter)) !== false)
                {
                    $fileContent[] = $data;
                }

                fclose($handle);
            }
            else
            {
                ServerLogger::instance()->writeLog(Warning, 'Failed to open the file :' . $fileName);
            }

        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            if(!empty($handle))
            {
                fclose($handle);
            }
            return $fileContent;
        }

        return $fileContent;
    }

    public static function saveCsv($fileName, $contentArray, $delimiter=',')
    {
        /*$list = array (
            array('aaa', 'bbb', 'ccc', 'dddd'),
            array('123', '456', '789'),
            array('"aaa"', '"bbb"')
        );*/

        try
        {
            $fp = fopen($fileName, 'a');

            foreach ($contentArray as $fields)
            {
                fputcsv($fp, $fields, $delimiter);
            }

            fclose($fp);
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeExceptionLog(Error, $e);
            if(!empty($fp))
            {
                fclose($fp);
            }
        }
    }

    public static function removeDir($path)
    {
        try
        {
            $op = dir($path);
            $removeFlag = true;
            while (false != ($item = $op->read()))
            {
                if ($item == '.' || $item == '..')
                {
                    continue;
                }
                $itemPath = $op->path . DIRECTORY_SEPARATOR . $item;
                if (is_dir($itemPath))
                {
                    if(false === self::removeDir($itemPath))
                    {
                        $removeFlag = false;
                        break;
                    }
                }
                else
                {
                    if(false === unlink($itemPath))
                    {
                        ServerLogger::instance()->writeLog(Warning, 'Failed to delete file: ' . $itemPath);
                        $removeFlag = false;
                        break;
                    }
                }

            }

            if(false === $removeFlag)
            {
                $op->close();
                return false;
            }
            else
            {
                if(false === rmdir($path))
                {
                    ServerLogger::instance()->writeLog(Warning, 'Failed to delete empty dir: ' . $path);
                    $op->close();
                    return false;
                }
                $op->close();
                return true;
            }
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to remorve dir: ' . $path);
            return false;
        }
    }

    public static function createDir($dirPath, $mode=0777, $recursive=false)
    {
        if(file_exists($dirPath))
        {
            return is_dir($dirPath);
        }
        else
        {
            return mkdir($dirPath, $mode, $recursive);
        }
    }

    public static function writeJsonFile($objArray, $fileName)
    {
        //ksort($objArray, SORT_STRING);
        $jsonString = json_encode($objArray, JSON_PRETTY_PRINT);
        static::writeFileContent($jsonString . PHP_EOL, $fileName);
    }

    public static function writeFileContent($contentInfo, $filePath)
    {
        file_put_contents($filePath, $contentInfo, FILE_APPEND);
    }

    public static function readLocalImage($localImagePath)
    {
        $imageData = file_get_contents($localImagePath);

        return self::buildImageInfo($imageData, $localImagePath);
    }

    public static function downloadImage($url, $localPath, $fileName = '', $downLoadType = 1)
    {
        $localFileStream = null;
        try
        {
            if($url == '')
            {
                return false;
            }

            $ext = strrchr($url,'.');
            if($fileName == '')
            {
                if($ext!=".gif" && $ext!=".jpg" && $ext!=".png" && $ext!=".jpeg")
                {
                    ServerLogger::instance()->writeLog(Warning, 'The file extend is ' . $ext);
                    return false;
                }
                $fileName = time().'_'.basename($url);
            }
            else
            {
                $fileName .= $ext;
            }

            $saveFilePath = $localPath . DIRECTORY_SEPARATOR . $fileName;
            if(file_exists($saveFilePath))
            {
                ServerLogger::instance()->writeLog(Warning, 'The file have existed : ' . $saveFilePath);
                return false;
            }

            if(0 === $downLoadType)
            {
                $img = self::getImageByOb($url);
            }
            else
            {
                $img = self::getImageByCurl($url);
            }

            if(false === $img)
            {
                return false;
            }

            $localFileStream = @fopen($saveFilePath, 'a');
            fwrite($localFileStream, $img);
            fclose($localFileStream);

            return self::buildImageInfo($img, $saveFilePath, $url);
        }
        catch (Exception $e)
        {
            if(!is_null($localFileStream))
            {
                fclose($localFileStream);
            }

            ServerLogger::instance()->writeLog(Warning, 'Failed to download image: ' . $url);
        }
    }

    private static function buildImageInfo($imageData, $saveFilePath, $url = '')
    {
        $imageSize = strlen($imageData);
        $imageInfo = getimagesizefromstring($imageData);
        $imageEntity = new DownloadImageEntity();
        if(empty($url))
        {
            $imageEntity->setUrl($saveFilePath);
        }
        else
        {
            $imageEntity->setUrl($url);
        }

        $imageEntity->setLocalPath($saveFilePath);
        $imageEntity->setSize($imageSize);
        $imageEntity->setWidth($imageInfo[0]);
        $imageEntity->setHeight($imageInfo[1]);
        $imageEntity->setMimeType($imageInfo['mime']);

        return $imageEntity;
    }

    private static function getImageByOb($url)
    {
        //开启缓存
        ob_start();
        $imageSize = readfile($url);
        if(false === $imageSize)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to read image file by url : ' . $url);
            return false;
        }
        $img = ob_get_contents();
        ob_end_clean();

        return $img;
    }

    public static function getImageByCurl($url)
    {
        $ch=curl_init();
        if(false === $ch)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to initialize curl.');
            return false;
        }

        $timeout=5;
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);

        $img=curl_exec($ch);
        if(false === $img)
        {
            ServerLogger::instance()->writeLog(Warning, 'Failed to read image file by url : ' . $url);
            return false;
        }
        curl_close($ch);

        return $img;
    }

    public static function readJsonFile($filePath)
    {
        $jsonString = file_get_contents($filePath);
        if(false === $jsonString)
        {
            ServerLogger::instance()->writeLog(Warning, 'Parse json file failed!! : ' . $filePath);
            return false;
        }

        $jsonArray = self::decodeJsonString($jsonString);

        return $jsonArray;
    }

    public static function readExcelFile($filePath)
    {
        $excelObject = PHPExcel_IOFactory::load($filePath);
        $sheet = $excelObject->getSheet(0);
        if(empty($sheet))
        {
            return array();
        }
        return $sheet->toArray();
    }

    public static function decodeJsonString($jsonString)
    {
        $jsonArray = json_decode($jsonString, true);
        $jsonErrorCode = json_last_error();
        if(JSON_ERROR_NONE != $jsonErrorCode)
        {
            $errorMsg = self::decodeJsonCheck($jsonErrorCode);
            ServerLogger::instance()->writeLog(Error, $errorMsg . ' ;json string : '.$jsonString);
            return false;
        }

        return $jsonArray;
    }

    private static function decodeJsonCheck($jsonCode)
    {
        switch ($jsonCode) {
            case JSON_ERROR_NONE:
                return ' - No errors';
                break;
            case JSON_ERROR_DEPTH:
                return ' - Maximum stack depth exceeded';
                break;
            case JSON_ERROR_STATE_MISMATCH:
                return ' - Underflow or the modes mismatch';
                break;
            case JSON_ERROR_CTRL_CHAR:
                return ' - Unexpected control character found';
                break;
            case JSON_ERROR_SYNTAX:
                return ' - Syntax error, malformed JSON';
                break;
            case JSON_ERROR_UTF8:
                return ' - Malformed UTF-8 characters, possibly incorrectly encoded';
                break;
            default:
                return ' - Unknown error';
                break;
        }
    }
}