<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");

queryApplicationId();

function queryApplicationId()
{
    $infoFile = __DIR__ . "/applicationInfo.json";
    $jsonArray = FileHelper::readJsonFile($infoFile);
    if(false === $jsonArray)
    {
        print_r("Failed to read info File.");
        return;
    }

    $idResult = "";
    $urlArray = $jsonArray['applicationURL'];
    foreach($urlArray as $url)
    {
        $appEntity = TargetingSearchUtil::searchApplicationEntity($url);
        if(isset($appEntity))
        {
            $idResult .= $appEntity->getOriginalUrl();
            $idResult .= ' => ';
            $idResult .= $appEntity->getId();
            $idResult .= PHP_EOL;
        }
    }

    $fileName = "queryResult_" . time();
    $outputFile = __DIR__ . DIRECTORY_SEPARATOR. $fileName .".txt";
    if(empty($idResult))
    {
        print_r('The query result is empty.');
        print_r(PHP_EOL);
    }
    else
    {
        FileHelper::writeFileContent($idResult, $outputFile);
        print_r("The application id is in file : " . $outputFile);
        print_r(PHP_EOL);
    }

}
