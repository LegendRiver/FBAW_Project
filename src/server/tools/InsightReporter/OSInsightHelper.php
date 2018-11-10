<?php


class OSInsightHelper extends ReporterInsightHelper
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
        ServerLogger::instance()->writeLog(Info, '#osInsightReport# Exporting campaignId:' . $campaignId . ' ....');
        $campaignInsightValues = array();

        if(!$this->checkNodeInstall($campaignId, AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN))
        {
            return array();
        }

        self::catalogAdset($campaignId);

        foreach($this->dateList as $dateStr)
        {
            $formatDate = CommonHelper::dateFormatConvert('Y-m-d', $dateStr);
            $insightNum = $this->getAdsetInsightSum($campaignId, $formatDate);

            $campaignInsightValues[$dateStr] = $insightNum;
        }

        return $campaignInsightValues;
    }

    private function checkNodeInstall($nodeId, $nodeType)
    {
        $insightArray = AdManagerFacade::getAllFiledInsight($nodeId, $nodeType, $this->startDate, $this->endDate);
        if(false === $insightArray)
        {
            ServerLogger::instance()->writeLog(Error, 'Exception to query node insight: ' . $nodeId . 'type: ' . $nodeType);
            return true;
        }

        if(0 == count($insightArray))
        {
            return false;
        }

        $insightData = $insightArray[0];
        $insightValues = $this->getInsightFieldValue($insightData);
        $install = $insightValues[0];
        if(count($insightArray) > 1)
        {
            $spend = $insightValues[1];
        }
        else
        {
           $spend = 0;
        }


        return $install >0 || $spend >0;
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

        $insightSum = array();
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
            $insightValues = $this->getInsightFieldValue($adsetInsightData);
            $insightSum = array_map(array('CommonHelper','addOperate'), $insightSum, $insightValues);
        }

        return $insightSum;
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
            ServerLogger::instance()->writeLog(Error, 'Failed to get Adsets by campaignId: ' .$campaignID);
            return;
        }

        $androidAdsetIds = array();
        $iosAdsetIds = array();
        foreach($adsetEntities as $adsetEntity)
        {
            $id = $adsetEntity->getId();
            if(!$this->checkNodeInstall($id, AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET))
            {
                continue;
            }

            $os = AdSetUtil::getAdsetOs($adsetEntity);

            if($os == AdManageConstants::OS_ANDROID)
            {
                $androidAdsetIds[]=$id;
            }
            else if($os == AdManageConstants::OS_IOS)
            {
                $iosAdsetIds[]=$id;
            }
            else
            {
            }
        }

        $this->androidAdsetMap[$campaignID] = $androidAdsetIds;
        $this->iosAdsetMap[$campaignID] = $iosAdsetIds;
    }
}