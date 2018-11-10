<?php

use Google\AdsApi\AdWords\v201705\cm\BiddingStrategyConfiguration;
use Google\AdsApi\AdWords\v201705\cm\BiddingStrategyType;
use Google\AdsApi\AdWords\v201705\cm\ManualCpcBiddingScheme;
use Google\AdsApi\AdWords\v201705\cm\TargetCpaBiddingScheme;
use Google\AdsApi\AdWords\v201705\cm\Money;

class AWBidStrategyManager extends AbstractAWManager
{

    public function createManualCpcBidConfig($isEnhanceCpc = false)
    {
        $biddingStrategyConfiguration = new BiddingStrategyConfiguration();
        $biddingStrategyConfiguration->setBiddingStrategyType(BiddingStrategyType::MANUAL_CPC);

        $biddingScheme = new ManualCpcBiddingScheme();
        $biddingScheme->setEnhancedCpcEnabled($isEnhanceCpc);
        $biddingStrategyConfiguration->setBiddingScheme($biddingScheme);

        return $biddingStrategyConfiguration;
    }

    public function createCpaBidConfig($bidAmount)
    {
        $biddingStrategyConfiguration = new BiddingStrategyConfiguration();
        $biddingStrategyConfiguration->setBiddingStrategyType(BiddingStrategyType::TARGET_CPA);

        $biddingScheme = new TargetCpaBiddingScheme();
        $money = new Money();
        $money->setMicroAmount($bidAmount * 1000000);
        $biddingScheme->setTargetCpa($money);
        $biddingStrategyConfiguration->setBiddingScheme($biddingScheme);

        return $biddingStrategyConfiguration;
    }

    protected function getService($customerAccountId = null)
    {
        return null;
    }

    protected function buildEntity($entry)
    {
        return $entry;
    }
}