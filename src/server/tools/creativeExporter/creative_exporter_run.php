<?php
require_once(__DIR__ . "/../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../includeFile/toolIncludeFile.php");

exportCreativeData();

function exportCreativeData()
{
    $configPath = __DIR__ . DIRECTORY_SEPARATOR . "conf.json";
    $configInfo = FileHelper::readJsonFile($configPath);

    $nodeType = $configInfo["parentNodeType"];
    $nodeIds = $configInfo["parentNodeId"];
    $outputDir = $configInfo["outputDir"];

    $csvTitle = getCreativeTitle();
    $csvContent = array();
    $csvContent[] = $csvTitle;

    foreach ($nodeIds as $nodeId)
    {
        $adIds = AdManagerFacade::getAdIdsByParentId($nodeId, $nodeType);
        if(false === $adIds)
        {
            ServerLogger::instance()->writeLog(Error, "Failed to get ad ids by parent :" .
                $nodeType . "(". $nodeId. ")");

            continue;
        }

        $creativeInfos = getAdCreativeInfos($adIds);
        $csvContent = array_merge($csvContent, $creativeInfos);
    }

    $outputFile = __DIR__ . DIRECTORY_SEPARATOR . $outputDir . DIRECTORY_SEPARATOR . 'creativeData.csv';
    FileHelper::saveCsv($outputFile, $csvContent);
}

function getCreativeTitle()
{
    return array(
        'creative_id',
        'creative_type',
        'message',
        'title',
        'image_hash',
        'video_id',
        'carousel_title',
        'carousel_image_hash',
        'carousel_video_id',
    );
}

function getAdCreativeInfos($adIds)
{
    $creativeInfos = array();
    foreach($adIds as $adId)
    {
        $creativeEntity = AdManagerFacade::getCreativeByAdId($adId);
        if(false === $creativeEntity)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to get creative by ad id: ' . $adId);
            continue;
        }

        $creativeInfo = array(
            $creativeEntity->getId(),
            $creativeEntity->getType(),
            $creativeEntity->getMessage(),
            $creativeEntity->getTitle(),
            $creativeEntity->getImageHash(),
            $creativeEntity->getVideoId(),
            getArrayValueString($creativeEntity->getCarouselTitles()),
            getArrayValueString($creativeEntity->getCarouselImageHashes()),
            getArrayValueString($creativeEntity->getCarouselVideoIds()),
        );

        $creativeInfos[] = $creativeInfo;
    }

    return $creativeInfos;

}

function getArrayValueString($arrayValue)
{
    if(empty($arrayValue))
    {
        return '';
    }
    else
    {
        return implode(';', $arrayValue);
    }
}
