<?php
use FacebookAds\Api;

class APIInit
{
    public static function init()
    {
        //后续需要加密处理
        Api::init(APIConstants::APP_ID, APIConstants::APP_SECRET, APIConstants::ACCESS_TOKEN);
    }
}