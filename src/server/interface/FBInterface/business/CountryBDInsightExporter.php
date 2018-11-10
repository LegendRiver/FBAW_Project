<?php
use FacebookAds\Object\Values\AdsInsightsBreakdownsValues;
use FacebookAds\Object\Fields\AdReportRunFields;
use FacebookAds\Object\Fields\AdsInsightsFields;

/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2017/11/21
 * Time: 下午8:01
 */
class CountryBDInsightExporter extends AbstractBDInsightExporter
{
    public function __construct()
    {

    }

    protected function buildBDParam()
    {
        $breakdownParam = array(
            AdReportRunFields::BREAKDOWNS => array(
                AdsInsightsBreakdownsValues::COUNTRY,
            ),
        );

        return $breakdownParam;
    }

    protected function buildInsightFields()
    {
        $insightFields = array(
            AdsInsightsFields::ACTIONS,
            AdsInsightsFields::COST_PER_ACTION_TYPE,
            AdsInsightsFields::SPEND,
            AdsInsightsFields::REACH,
            AdsInsightsFields::IMPRESSIONS,
            AdsInsightsFields::INLINE_LINK_CLICKS,
        );

        return $insightFields;
    }

    protected function buildReadConf()
    {
        $installConf = InsightValueReader::buildInstallConfig();
        $spendConf =InsightValueReader::buildSpendConfig();
        $countryConf =InsightValueReader::buildValueConfig("country");
        $cpi = InsightValueReader::buildCPIConfig();

        $fieldConf = array_merge($countryConf, $installConf, $spendConf, $cpi);

        return $fieldConf;
    }
}