<?php

use FacebookAds\Object\Values\AdsInsightsActionAttributionWindowsValues;
use FacebookAds\Object\Fields\AdsInsightsFields;
use FacebookAds\Object\Fields\AdReportRunFields;

class AdSetAttributeHelper extends AdSetInsightExportHelper
{
    protected function getNodeInsights($nodeId, $sinceDate, $utilDate)
    {
        $attributeValues = array(
            AdsInsightsActionAttributionWindowsValues::VALUE_1D_VIEW,
            AdsInsightsActionAttributionWindowsValues::VALUE_7D_VIEW,
            AdsInsightsActionAttributionWindowsValues::VALUE_28D_VIEW,
            AdsInsightsActionAttributionWindowsValues::VALUE_1D_CLICK,
            AdsInsightsActionAttributionWindowsValues::VALUE_7D_CLICK,
            AdsInsightsActionAttributionWindowsValues::VALUE_28D_CLICK,
        );

        $attributeParam = array(
            AdReportRunFields::ACTION_ATTRIBUTION_WINDOWS => $attributeValues,
        );

        $insightField = array(
            AdsInsightsFields::ACCOUNT_ID,
            AdsInsightsFields::ACCOUNT_NAME,
            AdsInsightsFields::ACTIONS,
            AdsInsightsFields::AD_ID,
            AdsInsightsFields::AD_NAME,
            AdsInsightsFields::ADSET_ID,
            AdsInsightsFields::ADSET_NAME,
            AdsInsightsFields::CAMPAIGN_ID,
            AdsInsightsFields::CAMPAIGN_NAME,
            AdsInsightsFields::DATE_START,
        );
        $insightArray = AdManagerFacade::getFlexibleInsight($nodeId, AdManageConstants::INSIGHT_EXPORT_TYPE_ADSET,
            $sinceDate, $utilDate, $insightField, $attributeParam);
        if(empty($insightArray))
        {
            return array();
        }

        return $insightArray;
    }

    protected function initOptionInstance($insightData)
    {
        $this->entities = array();
    }
}