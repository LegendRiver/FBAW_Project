<?php

use Google\AdsApi\AdWords\v201705\cm\AdvertisingChannelSubType;
use Google\AdsApi\AdWords\v201705\cm\AdvertisingChannelType;

class UACCampaignParam extends AWCampaignParam
{
    private $uacSetting;

    protected function initChannelType()
    {
        $this->channelType = AdvertisingChannelType::MULTI_CHANNEL;
        $this->channelSubType = AdvertisingChannelSubType::UNIVERSAL_APP_CAMPAIGN;
    }

    protected function checkOtherParam()
    {
        return true;
    }

    /**
     * @return mixed
     */
    public function getUacSetting()
    {
        return $this->uacSetting;
    }

    /**
     * @param mixed $uacSetting
     */
    public function setUacSetting($uacSetting)
    {
        $this->uacSetting = $uacSetting;
    }

}