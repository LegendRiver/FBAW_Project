<?php

use Google\AdsApi\AdWords\v201705\cm\FrequencyCap;
use Google\AdsApi\AdWords\v201705\cm\Level;
use Google\AdsApi\AdWords\v201705\cm\TimeUnit;

class FrequencyCapFactory
{
    public static function createFrequencyCap()
    {
        $frequencyCap = new FrequencyCap();
        $frequencyCap->setImpressions(5);
        $frequencyCap->setTimeUnit(TimeUnit::DAY);
        $frequencyCap->setLevel(Level::ADGROUP);

        return $frequencyCap;
    }
}