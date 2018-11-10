<?php


class FBParamTransformer
{
    private $campaignHandler;

    private $adsetHandler;

    private $creativeHandler;

    private $adHandler;

    public function __construct()
    {
        $this->campaignHandler = new CampaignParamHandler();
        $this->adsetHandler = new AdsetParamHandler();
        $this->creativeHandler = new CreativeParamHandler();
        $this->adHandler = new AdParamHandler();

    }

    public function buildCreateCampaignParam($campaignInfo)
    {
        $campaignCreateParam = $this->campaignHandler->transformStrategy($campaignInfo);
        return $campaignCreateParam;
    }


    public function buildCreateAdsetParam($adsetStrategyInfo, $accountId, $campaignId, $campaignType)
    {
        $adsetCreateParam = $this->adsetHandler->transformStrategy($adsetStrategyInfo);
        if(false === $adsetCreateParam)
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'Failed to transform adset Param.');
            return false;
        }

        $adsetCreateParam->setCampaignId($campaignId);
        $adsetCreateParam->setCampaignType($campaignType);
        $adsetCreateParam->setAccountId($accountId);

        return $adsetCreateParam;
    }

    public function buildCreativeParam($creativeInfo, $campaignType, $accountId)
    {
        $creativeParam = $this->creativeHandler->transformStrategy($creativeInfo);
        if(false === $creativeParam)
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'Failed to transform adset Param.');
            return false;
        }

        $creativeParam->setAccountId($accountId);
        $creativeParam->setCampaignType($campaignType);

        return $creativeParam;
    }

    public function buildCreateAdParam($adInfo, $accountId)
    {
        $adParam = $this->adHandler->transformStrategy($adInfo);
        if(false === $adParam)
        {
            ServerLogger::instance()->writeStrategyLog(Error, 'Failed to transform ad Param.');
            return false;
        }

        $adParam->setAccountId($accountId);

        return $adParam;
    }
}