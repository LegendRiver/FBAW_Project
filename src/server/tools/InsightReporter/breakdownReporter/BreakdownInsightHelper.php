<?php

use FacebookAds\Object\Values\AdsInsightsBreakdownsValues;
use FacebookAds\Object\Fields\AdReportRunFields;
use FacebookAds\Object\Fields\AdsInsightsFields;

class BreakdownInsightHelper
{
    public static function getActBDInsightByCountry($accountId, $startDate='', $endDate='')
    {
        $nodeId = $accountId;
        $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT;

        return self::getInsightByBD($nodeId, $nodeType, $startDate, $endDate);
    }

    public static function getCamBDInsightByCountry($campaignId, $startDate='', $endDate='')
    {
        $nodeId = $campaignId;
        $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN;

        return self::getInsightByBD($nodeId, $nodeType, $startDate, $endDate);
    }

    public static function getAdsetBDInsightByCountry($adsetId, $startDate='', $endDate='')
    {
        $nodeId = $adsetId;
        $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET;

        return self::getInsightByBD($nodeId, $nodeType, $startDate, $endDate);
    }

    public static function getActBDInsightByDevice($accountId, $startDate='', $endDate='')
    {
        $nodeId = $accountId;
        $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT;

        return self::getInsightByBD($nodeId, $nodeType, $startDate, $endDate, self::BREAKDOWN_TYPE_DEVICE);
    }

    public static function getCamBDInsightByDevice($campaignId, $startDate='', $endDate='')
    {
        $nodeId = $campaignId;
        $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_CAMPAIGN;

        return self::getInsightByBD($nodeId, $nodeType, $startDate, $endDate, self::BREAKDOWN_TYPE_DEVICE);
    }

    public static function getAdsetBDInsightByDevice($adsetId, $startDate='', $endDate='')
    {
        $nodeId = $adsetId;
        $nodeType = AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET;

        return self::getInsightByBD($nodeId, $nodeType, $startDate, $endDate, self::BREAKDOWN_TYPE_DEVICE);
    }

    private static function getInsightByBD($nodeId, $nodeType, $startDate, $endDate, $bdType = self::BREAKDOWN_TYPE_COUNTRY)
    {
        $param = self::getBDParam($bdType);
        $fields = self::getInsightFields();

        $insightData = AdManagerFacade::getFlexibleInsight($nodeId, $nodeType, $startDate, $endDate, $fields, $param);
        if(empty($insightData))
        {
            return array();
        }

        return self::readBDFieldInsight($insightData, $bdType);
    }

    private static function readBDFieldInsight($insightList, $bdType)
    {
        $countryMap = array();
        $conf = self::getReadConf($bdType);
        foreach($insightList as $data)
        {
           $insightValue = InsightValueReader::readInsightValue($data, $conf);
           $country = array_pop($insightValue);
           $countryMap[$country] = $insightValue;
        }

        return $countryMap;
    }

    private static function getReadConf($bdType)
    {
        $installConf = InsightValueReader::buildInstallConfig();
        $spendConf =InsightValueReader::buildSpendConfig();
        $countryConf =self::getBDReaderConf($bdType);

        $fieldConf = array();
        $fieldConf = array_merge($fieldConf, $installConf);
        $fieldConf = array_merge($fieldConf, $spendConf);

        $fieldConf = array_merge($fieldConf, $countryConf);
        return $fieldConf;
    }

    private static function getBDReaderConf($bdType)
    {
        if($bdType == self::BREAKDOWN_TYPE_COUNTRY)
        {
            return InsightValueReader::buildValueConfig("country");
        }
        else if($bdType == self::BREAKDOWN_TYPE_DEVICE)
        {
            return InsightValueReader::buildValueConfig("impression_device");
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, '#bdReport_readconf#The bdType is not defined.');
            return array();
        }
    }

    private static function getBDParam($bdType)
    {
        if($bdType == self::BREAKDOWN_TYPE_COUNTRY)
        {
            return self::getCountryBDParam();
        }
        else if($bdType == self::BREAKDOWN_TYPE_DEVICE)
        {
            return self::getDeviceBDParam();
        }
        else
        {
            ServerLogger::instance()->writeLog(Warning, '#bdReport#The bdType is not defined.');
            return array();
        }
    }

    private static function getCountryBDParam()
    {
        $breakdownParam = array(
            AdReportRunFields::BREAKDOWNS => array(
                AdsInsightsBreakdownsValues::COUNTRY,
            ),
        );

        return $breakdownParam;
    }

    private static function getDeviceBDParam()
    {
        $breakdownParam = array(
            AdReportRunFields::BREAKDOWNS => array(
                AdsInsightsBreakdownsValues::IMPRESSION_DEVICE,
            ),
        );

        return $breakdownParam;
    }

    private static function getInsightFields()
    {
        $insightFields = array(
            AdsInsightsFields::ACTIONS,
            AdsInsightsFields::SPEND,
            AdsInsightsFields::REACH,
            AdsInsightsFields::IMPRESSIONS,
            AdsInsightsFields::INLINE_LINK_CLICKS,
        );

        return $insightFields;
    }

    const BREAKDOWN_TYPE_COUNTRY = 1;
    const BREAKDOWN_TYPE_DEVICE = 2;

}