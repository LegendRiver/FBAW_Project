<?php

class KwaiReportHelper extends ReporterInsightHelper
{
    private $androidAdsetMap=array();
    private $iosAdsetMap=array();

    private $isAndroid = true;

    public function switchPlatform()
    {
        $this->isAndroid = !$this->isAndroid;
    }

    public function isGetAndroid()
    {
        return $this->isAndroid;
    }

    protected function getOneCampaignData($campaignId)
    {
        print_r('Exporting campaignId:' . $campaignId . ' ....' .PHP_EOL);
        $campaignInsightValues = array();
        self::catalogAdset($campaignId);

        foreach($this->dateList as $dateStr)
        {
            $formatDate = CommonHelper::dateFormatConvert('Y-m-d', $dateStr);
            $insightNum = self::getAdsetInsightSum($campaignId, $formatDate);

            $campaignInsightValues[$dateStr] = array($insightNum);
        }

        return $campaignInsightValues;
    }

    private function getAdsetInsightSum($campaignId, $dayDate)
    {
        if($this->isAndroid)
        {
            $adsetIds = CommonHelper::getArrayValueByKey($campaignId, $this->androidAdsetMap);
        }
        else
        {
            $adsetIds = CommonHelper::getArrayValueByKey($campaignId, $this->iosAdsetMap);
        }

        $insightSum = 0;
        if(empty($adsetIds))
        {
            return $insightSum;
        }

        foreach ($adsetIds as $id)
        {
            $insightArray = AdManagerFacade::getAllFiledInsight($id, AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET,
                $dayDate, $dayDate);
            if(false === $insightArray)
            {
                ServerLogger::instance()->writeLog(Error, 'Exception to query adset insight: ' . $id);
                continue;
            }

            if(0 == count($insightArray))
            {
                continue;
            }

            $adsetInsightData = $insightArray[0];
            $insightSum += self::getActionsInstallValue($adsetInsightData);
        }

        return $insightSum;
    }

    private function getActionsInstallValue($insightData)
    {
        $installConfig = InsightValueReader::buildInstallConfig();
        $values = InsightValueReader::readInsightValue($insightData, $installConfig);
        $installValue = intval($values[0]);
        return $installValue;
    }

    private function catalogAdset($campaignID)
    {
        if(array_key_exists($campaignID, $this->androidAdsetMap) ||
        array_key_exists($campaignID, $this->iosAdsetMap))
        {
            return;
        }

        $adsetEntities = AdManagerFacade::getAdsetByCampaignId($campaignID);
        if(false === $adsetEntities)
        {
            print_r('Failed to get Adsets by campaignId: ' .$campaignID . PHP_EOL);
            return;
        }

        $androidAdsetIds = array();
        $iosAdsetIds = array();
        foreach($adsetEntities as $adsetEntity)
        {
            $appUrl = $adsetEntity->getPromoteObjectAppUrl();
            $id = $adsetEntity->getId();

            if(CommonHelper::strContains($appUrl, 'play.google.com'))
            {
                $androidAdsetIds[]=$id;
            }
            else if(CommonHelper::strContains($appUrl, 'itunes.apple.com'))
            {
                $iosAdsetIds[]=$id;
            }
            else
            {
                $name = $adsetEntity->getName();
                print_r('Failed to catalog appurl : ' . $appUrl . 'of adset: ' . $name .PHP_EOL);
            }
        }

        $this->androidAdsetMap[$campaignID] = $androidAdsetIds;
        $this->iosAdsetMap[$campaignID] = $iosAdsetIds;
    }
}