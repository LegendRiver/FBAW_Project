<?php


class StrategyFileParser
{
    private $campaignArray;

    private $pid2adsetMap;

    private $adsetPid2AdMap;

    private $pid2CreativeMap;

    private $accountId;

    private $allImageUrls;

    private $slideShowImages;

    private $videoPaths;

    public function __construct()
    {
        $this->initResultArray();
    }

    public function parseStrategyParam($strategyFile)
    {
        $this->initResultArray();

        $jsonArray = FileHelper::readJsonFile($strategyFile);
        if(false === $jsonArray)
        {
           return false;
        }

        $parseResult = $this->parseSubNode($jsonArray);
        if(false === $parseResult)
        {
            return false;
        }

        return true;
    }

    public function getVideoPath()
    {
        return $this->videoPaths;
    }

    public function getSlideShowMap()
    {
        return $this->slideShowImages;
    }

    public function getAllImages()
    {
        return $this->allImageUrls;
    }

    public function getAccountId()
    {
        return $this->accountId;
    }

    public function getAdMap()
    {
        return $this->adsetPid2AdMap;
    }

    public function getCampaignInfo()
    {
        return $this->campaignArray;
    }

    public function getAdsetMap()
    {
        return $this->pid2adsetMap;
    }

    public function getCreativeMap()
    {
        return $this->pid2CreativeMap;
    }

    public function getCreativeByPid($pid)
    {
        if (array_key_exists($pid, $this->pid2CreativeMap))
        {
           return $this->pid2CreativeMap[$pid];
        }
        else
        {
            return array();
        }
    }

    public function getAdsetByPid($pid)
    {
        if (array_key_exists($pid, $this->pid2adsetMap))
        {
           return $this->pid2adsetMap[$pid];
        }
        else
        {
            return array();
        }
    }

    private function parseSubNode($jsonArray)
    {
        //处理Adset
        $adsetArray = $jsonArray[StrategyConstants::ST_CAMPAIGN_ADSETS];
        $this->parseAdsetNode($adsetArray);

        //处理creative
        $creativeArray = $jsonArray[StrategyConstants::ST_CAMPAIGN_CREATIVES];
        $creativeResult = $this->parseCreativeNode($creativeArray);
        if(false === $creativeResult)
        {
            return false;
        }

        unset($jsonArray[StrategyConstants::ST_CAMPAIGN_ADSETS]);
        unset($jsonArray[StrategyConstants::ST_CAMPAIGN_CREATIVES]);

        //修改accountId
        $this->accountId = $jsonArray[StrategyConstants::ST_CAMPAIGN_ACCOUNT_ID];
        if(!strstr($this->accountId, AdManageConstants::ADACCOUNT_ID_PREFIX))
        {
            $this->accountId = AdManageConstants::ADACCOUNT_ID_PREFIX . $this->accountId;
            $strategyInfoArray[StrategyConstants::ST_CAMPAIGN_ACCOUNT_ID] = $this->accountId;
        }
        $this->campaignArray = $jsonArray;

        return true;
    }

    private function parseAdsetNode($adsetArray)
    {
        foreach($adsetArray as $adsetInfo)
        {
            $adArray = $adsetInfo[StrategyConstants::ST_ADSET_ADS];
            //临时的键值
            $adsetUUId = CPublic::getGuid();
            unset($adsetInfo[StrategyConstants::ST_ADSET_ADS]);

            $this->pid2adsetMap[$adsetUUId] = $adsetInfo;
            $this->adsetPid2AdMap[$adsetUUId] = $adArray;
        }
    }

    private function parseCreativeNode($creativeArray)
    {
        foreach($creativeArray as $creativeInfo)
        {
            $pseudoId = $creativeInfo[StrategyConstants::ST_CREATIVE_PSEUDO_ID];
            if(empty($pseudoId))
            {
                $adsetName = $creativeInfo[StrategyConstants::ST_CREATIVE_NAME];
                ServerLogger::instance()->writeStrategyLog(Error, 'The pseudo id of adset(' . $adsetName . ') is empty.');
                return false;
            }
            $this->pid2CreativeMap[$pseudoId] = $creativeInfo;

            //图片信息
            $imagePaths = (array)$creativeInfo[StrategyConstants::ST_CREATIVE_IMAGE_PATHS];
            $this->allImageUrls = array_merge($this->allImageUrls, $imagePaths);

            //slideshow信息
            $adFormat = $creativeInfo[StrategyConstants::ST_CREATIVE_ADFORMAT];
            if($adFormat === StrategyConstants::ST_V_ADFORMAT_SLIDESHOW)
            {
                $this->slideShowImages[$pseudoId] = $imagePaths;
            }

            //video 路径信息
            if($adFormat === StrategyConstants::ST_V_ADFORMAT_VIDEO)
            {
                $this->videoPaths[$pseudoId] = $creativeInfo[StrategyConstants::ST_CREATIVE_VIDEO_SOURCE_PATH];
            }
        }

        return true;
    }

    private function initResultArray()
    {
        $this->campaignArray = array();
        $this->pid2adsetMap = array();
        $this->pid2CreativeMap = array();
        $this->adsetPid2AdMap = array();
        $this->allImageUrls = array();
        $this->slideShowImages = array();
        $this->accountId = '';
    }


}