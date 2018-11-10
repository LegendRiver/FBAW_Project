<?php


class CarouselHandler extends DuplicateHandler
{
    protected function getAdType($copyHelper)
    {
        return $copyHelper->getCarouselType();
    }

    protected function uploadMaterial($materialPath, $adType, $accountId)
    {
        $dirMaterialMap = array();
        $subDirList = FileHelper::getSubDirList($materialPath);
        foreach($subDirList as $dir)
        {
            $dirName = basename($dir);
            $pathMap = $this->uploadOperation($dir, $adType, $accountId);
            $dirMaterialMap[$dirName] = $pathMap;
        }

        return $dirMaterialMap;
    }

    protected function copyAdByMaterial($materialMap, CopyFBHelper $copyHelper, $adsetName, $adType, $toCampaignId=null)
    {
        foreach ($materialMap as $dirName=>$materialInfo)
        {
            $newAdsetName = $this->formatAdsetName($adsetName, $dirName);

            if($this->isCopyByParam && !empty($toCampaignId))
            {
                $newAdsetId = $copyHelper->duplicateAdset($newAdsetName, $toCampaignId);
            }
            else
            {
                $copyParam = array();
                if(!empty($toCampaignId))
                {
                    $copyParam['campaign_id']= $toCampaignId;
                }
                $newAdsetId = $copyHelper->duplicateAdsetByCopy($newAdsetName, $copyParam);
            }

            if(false === $newAdsetId)
            {
                ServerLogger::instance()->writeLog(Warning, 'Failed to duplicate adset for dir: ' . $dirName);
                continue;
            }

            $adName = date('Ymd_') . $dirName;
            $textInfo = CommonHelper::getArrayValueByKey($dirName, $this->textConfigList);
            $copyResult = $copyHelper->duplicateCarouselToAdset($newAdsetId, $adName, $materialInfo, $textInfo);
            if(false === $copyResult)
            {
                $failedInfo = '!!!Failed to copy ad by dir: ' . $dirName . '; adsetName: ' . $newAdsetName;
                ServerLogger::instance()->writeLog(Warning, 'Failed to copy ad in adsetName: ' . $newAdsetName);
                print_r( $failedInfo . PHP_EOL);
            }
            else
            {
                print_r('Succeed to copy ad by dir: ' . $dirName . PHP_EOL);
            }
        }
    }

    protected function getDefaultTextFilePath()
    {
        return $this->defaultPath . DIRECTORY_SEPARATOR . 'text.xlsx';
    }

    protected function constructTextMap($csvList)
    {
        $dirNameMap = array();
        foreach ($csvList as $info)
        {
            $dirName = $info[0];
            $imageName = $info[1];
            $row = array(
                DuplicateAdConstants::CSV_COL_DIR_NAME => $dirName,
                DuplicateAdConstants::CSV_COL_IMAGE_NAME => $imageName,
                DuplicateAdConstants::CSV_COL_MESSAGE => $info[2],
                DuplicateAdConstants::CSV_COL_HEADLINE => $info[3],
                DuplicateAdConstants::CSV_COL_DEEP_LINK => $info[4],
            );

            if(array_key_exists($dirName, $dirNameMap))
            {
                $dirNameMap[$dirName][$imageName] = $row;
            }
            else
            {
                $imageMap = array($imageName => $row);
                $dirNameMap[$dirName] = $imageMap;
            }
        }

        return $dirNameMap;
    }

}