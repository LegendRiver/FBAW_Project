<?php
use Google\AdsApi\AdWords\v201705\cm\CpcBid;
use Google\AdsApi\AdWords\v201705\cm\Money;

class BidFactory
{
    public static function createCpcBid()
    {
        $bid = new CpcBid();
        $money = new Money();
        $money->setMicroAmount(1000000);
        $bid->setBid($money);
        return $bid;
    }
}