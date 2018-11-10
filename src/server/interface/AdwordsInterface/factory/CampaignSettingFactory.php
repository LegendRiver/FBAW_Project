<?php
use Google\AdsApi\AdWords\v201705\cm\UniversalAppCampaignSetting;
use Google\AdsApi\AdWords\v201705\cm\UniversalAppBiddingStrategyGoalType;
use Google\AdsApi\AdWords\v201705\cm\NetworkSetting;
use Google\AdsApi\AdWords\v201705\cm\GeoTargetTypeSetting;
use Google\AdsApi\AdWords\v201705\cm\GeoTargetTypeSettingNegativeGeoTargetType;
use Google\AdsApi\AdWords\v201705\cm\GeoTargetTypeSettingPositiveGeoTargetType;


class CampaignSettingFactory
{
    public static function createNetworkSetting()
    {
        $networkSetting = new NetworkSetting();
        $networkSetting->setTargetGoogleSearch(true);
        $networkSetting->setTargetSearchNetwork(true);
        $networkSetting->setTargetContentNetwork(true);

        return $networkSetting;
    }

    public static function createUACSetting($appId, $descList=array(), $imageIds=array(), $videoIds=array())
    {
        $uacAppSetting = new UniversalAppCampaignSetting();
        $uacAppSetting->setAppId($appId);

        if(count($descList) > AWCommonConstants::UAC_DES_MAX)
        {
            $descList = array_slice($descList, 0, AWCommonConstants::UAC_DES_MAX);
        }

        if(count($imageIds) > AWCommonConstants::UAC_MEDIA_MAX)
        {
            $imageIds = array_slice($imageIds, 0, AWCommonConstants::UAC_MEDIA_MAX);
        }

        if(count($videoIds) > AWCommonConstants::UAC_MEDIA_MAX)
        {
            $videoIds = array_slice($videoIds, 0, AWCommonConstants::UAC_MEDIA_MAX);
        }

        if(array_key_exists(0, $descList))
        {
            $uacAppSetting->setDescription1($descList[0]);
        }
        if(array_key_exists(1, $descList))
        {
            $uacAppSetting->setDescription2($descList[1]);
        }
        if(array_key_exists(2, $descList))
        {
            $uacAppSetting->setDescription3($descList[2]);
        }
        if(array_key_exists(3, $descList))
        {
            $uacAppSetting->setDescription4($descList[3]);
        }

        if(!empty($imageIds))
        {
            $uacAppSetting->setImageMediaIds($imageIds);
        }

        if(!empty($videoIds))
        {
            $uacAppSetting->setYoutubeVideoMediaIds($videoIds);
        }

        //此处默认设置为install conversion, 如果增加另一种再添加（需要设置campgign conversionId）
        $uacAppSetting->setUniversalAppBiddingStrategyGoalType(UniversalAppBiddingStrategyGoalType::OPTIMIZE_FOR_INSTALL_CONVERSION_VOLUME);

        return $uacAppSetting;
    }

    public static function createGeoTargeting($includeType=AWCampaignValues::GEO_INCLUDE_TYPE_NOT_CARE,
                                              $excludeType=AWCampaignValues::GEO_EXCLUDE_TYPE_NOT_CARE)
    {
        $geoTargetTypeSetting = new GeoTargetTypeSetting();
        if($includeType == AWCampaignValues::GEO_INCLUDE_TYPE_INTEREST)
        {
            $geoTargetTypeSetting->setPositiveGeoTargetType(GeoTargetTypeSettingPositiveGeoTargetType::AREA_OF_INTEREST);
        }
        else if($includeType == AWCampaignValues::GEO_INCLUDE_TYPE_PRESENCE)
        {
            $geoTargetTypeSetting->setPositiveGeoTargetType(GeoTargetTypeSettingPositiveGeoTargetType::LOCATION_OF_PRESENCE);
        }
        else
        {
            $geoTargetTypeSetting->setPositiveGeoTargetType(GeoTargetTypeSettingPositiveGeoTargetType::DONT_CARE);
        }

        if($excludeType == AWCampaignValues::GEO_EXCLUDE_TYPE_PRESENCE)
        {
            $geoTargetTypeSetting->setNegativeGeoTargetType(GeoTargetTypeSettingNegativeGeoTargetType::LOCATION_OF_PRESENCE);
        }
        else
        {
            $geoTargetTypeSetting->setNegativeGeoTargetType(GeoTargetTypeSettingNegativeGeoTargetType::DONT_CARE);
        }


        return $geoTargetTypeSetting;
    }
}