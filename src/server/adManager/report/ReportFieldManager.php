<?php


class ReportFieldManager
{
    private static $instance = null;

    private $field2FunctionMap;

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    private function __construct()
    {
        $this->field2FunctionMap = array(
            ReportFieldManager::REPORT_FIELD_ELI_CAMPAIGN_ID => array('AdReportEntity','getCampaignUid'),
            ReportFieldManager::REPORT_FIELD_ELI_ADSET_ID => array('AdReportEntity','getAdsetUid'),
            ReportFieldManager::REPORT_FIELD_ELI_AD_ID => array('AdReportEntity','getAdUid'),
            ReportFieldManager::REPORT_FIELD_MEDIA_CAMPAIGN_ID => array('AdReportEntity','getCampaignId'),
            ReportFieldManager::REPORT_FIELD_MEDIA_ADSET_ID => array('AdReportEntity','getAdsetId'),
            ReportFieldManager::REPORT_FIELD_MEDIA_AD_ID => array('AdReportEntity','getAdId'),
            ReportFieldManager::REPORT_FIELD_REQUEST_TIME => array('FBInsightLogExporter','getRequestTime'),
            //ReportFieldEnum::REPORT_FIELD_DELIVERY => array('',''),
            ReportFieldManager::REPORT_FIELD_RESULTS => array('AdReportEntity','getResultValue'),
            ReportFieldManager::REPORT_FIELD_RESULT_TYPE => array('AdReportEntity','getResultType'),
            ReportFieldManager::REPORT_FIELD_REACH => array('AdReportEntity','getReach'),
            ReportFieldManager::REPORT_FIELD_COST_PER_RESULT => array('AdReportEntity','getCostPerResult'),
            //ReportFieldEnum::REPORT_FIELD_AMOUNT_SPENT => array('',''),
            ReportFieldManager::REPORT_FIELD_IMPRESSIONS => array('AdReportEntity','getImpression'),
            ReportFieldManager::REPORT_FIELD_CLICKS => array('AdReportEntity','getClick'),
            ReportFieldManager::REPORT_FIELD_CPC => array('AdReportEntity','getCpc'),
            ReportFieldManager::REPORT_FIELD_CTR => array('AdReportEntity','getCtr'),
            ReportFieldManager::REPORT_FIELD_RESULT_RATE => array('AdReportEntity','getResultRate'),
            ReportFieldManager::REPORT_FIELD_CPM => array('AdReportEntity','getCpm'),
            //ReportFieldEnum::REPORT_FIELD_CPI => array('',''),
            //ReportFieldEnum::REPORT_FIELD_CVR => array('',''),
            ReportFieldManager::REPORT_FIELD_SPENT => array('AdReportEntity','getSpend'),
            ReportFieldManager::REPORT_FIELD_URL => array('PublisherCreativeEntity','getUrl'),
            ReportFieldManager::REPORT_FIELD_TITLE => array('PublisherCreativeEntity','getTitle'),
            ReportFieldManager::REPORT_FIELD_DESCRIPTION => array('PublisherCreativeEntity','getDescription'),
            ReportFieldManager::REPORT_FIELD_IMAGE_LIST => array('PublisherCreativeEntity','getImageUids'),
            ReportFieldManager::REPORT_FIELD_CALL_TO_ACTION_BUTTON => array('PublisherCreativeEntity','getCallToActionType'),
            //ReportFieldEnum::REPORT_FIELD_VIDEO_URL => array('',''),
            //ReportFieldEnum::REPORT_FIELD_STATUS => array('',''),
            ReportFieldManager::REPORT_FIELD_ADSET_BUDGET => array('PublisherAdSetEntity','getBudget'),
            ReportFieldManager::REPORT_FIELD_BUDGET_TYPE => array('PublisherAdSetEntity','getBudgetType'),
            //ReportFieldEnum::REPORT_FIELD_ADSET_SPENT => array('',''),
            ReportFieldManager::REPORT_FIELD_ADSET_SCHEDULE_START => array('PublisherAdSetEntity','getScheduleStart'),
            ReportFieldManager::REPORT_FIELD_ADSET_SCHEDULE_END => array('PublisherAdSetEntity','getScheduleEnd'),
            ReportFieldManager::REPORT_FIELD_TIME_START => array('PublisherAdSetEntity','getTimeStart'),
            ReportFieldManager::REPORT_FIELD_TIME_END => array('PublisherAdSetEntity','getTimeEnd'),
            ReportFieldManager::REPORT_FIELD_BID => array('PublisherAdSetEntity','getBid'),
            ReportFieldManager::REPORT_FIELD_BID_TYPE => array('PublisherAdSetEntity','getBidType'),
            ReportFieldManager::REPORT_FIELD_CHARGE_TYPE => array('PublisherAdSetEntity','getChargeType'),
            ReportFieldManager::REPORT_FIELD_DELIVERY_TYPE => array('PublisherAdSetEntity','getDeliveryType'),
            //ReportFieldEnum::REPORT_FIELD_KEYWORD => array('',''),
            //ReportFieldEnum::REPORT_FIELD_MATCH_TYPE => array('',''),
            //ReportFieldEnum::REPORT_FIELD_CREATE_TIME => array('',''),
            //ReportFieldEnum::REPORT_FIELD_LAST_MODIFY_TIME => array('',''),
            ReportFieldManager::REPORT_FIELD_AUDIENCE => array('PublisherAdSetEntity','getAudience'),
            //ReportFieldEnum::REPORT_FIELD_LOCATIONS => array('',''),
            //ReportFieldEnum::REPORT_FIELD_AGE => array('',''),
            //ReportFieldEnum::REPORT_FIELD_GENDER => array('',''),
            //ReportFieldEnum::REPORT_FIELD_LANGUAGE => array('',''),
            //ReportFieldEnum::REPORT_FIELD_DEMOGRAPHICS => array('',''),
            //ReportFieldEnum::REPORT_FIELD_INTERESTS => array('',''),
            //ReportFieldEnum::REPORT_FIELD_BEHAVIORS => array('',''),
        );
    }

    public function getFunctionMap()
    {
        return $this->field2FunctionMap;
    }

    public function getConstants()
    {
        $oClass = new ReflectionClass(__CLASS__);
        $constantMap = $oClass->getConstants();
        return array_values($constantMap);
    }

    public function getTargetingExportLogTitle()
    {
        $targetingTitle = array(
            StrategyConstants::ST_TARGETING_COUNTRIES,
            StrategyConstants::ST_TARGETING_GENDER,
            StrategyConstants::ST_TARGETING_AGE_MIN,
            StrategyConstants::ST_TARGETING_AGE_MAX,
            StrategyConstants::ST_TARGETING_LOCALE,
            StrategyConstants::ST_TARGETING_DEVICE_PLATFORM,
            StrategyConstants::ST_TARGETING_PUBLISHER_PLATFORM,
            StrategyConstants::ST_TARGETING_POSITION,
            StrategyConstants::ST_TARGETING_INTEREST,
        );

        return $targetingTitle;
    }

    public function getCsvTitle()
    {
        $commonArray = $this->getConstants();
        $diffArray = array(ReportFieldManager::REPORT_FIELD_AUDIENCE);
        $targetingTitle = $this->getTargetingExportLogTitle();

        return array_merge(array_diff($commonArray, $diffArray), $targetingTitle);
    }

    const REPORT_FIELD_ELI_CAMPAIGN_ID = 'eli_campaign_id';
    const REPORT_FIELD_ELI_ADSET_ID = 'eli_adset_id';
    const REPORT_FIELD_ELI_AD_ID = 'eli_ad_id';
    const REPORT_FIELD_MEDIA_CAMPAIGN_ID = 'media_campaign_id';
    const REPORT_FIELD_MEDIA_ADSET_ID = 'media_adset_id';
    const REPORT_FIELD_MEDIA_AD_ID = 'media_ad_id';
    const REPORT_FIELD_REQUEST_TIME = 'request_time';
    //const REPORT_FIELD_DELIVERY = 'delivery';
    const REPORT_FIELD_RESULTS = 'results';
    const REPORT_FIELD_RESULT_TYPE = 'result_type';
    const REPORT_FIELD_REACH = 'reach';
    const REPORT_FIELD_COST_PER_RESULT = 'cost_per_result';
    //const REPORT_FIELD_AMOUNT_SPENT = 'amount_spent';
    const REPORT_FIELD_IMPRESSIONS = 'impressions';
    const REPORT_FIELD_CLICKS = 'clicks';
    const REPORT_FIELD_CPC = 'cpc';
    const REPORT_FIELD_CTR = 'ctr';
    const REPORT_FIELD_RESULT_RATE = 'result_rate';
    const REPORT_FIELD_CPM = 'cpm';
    //const REPORT_FIELD_CPI = 'cpi';
    //const REPORT_FIELD_CVR = 'cvr';
    const REPORT_FIELD_SPENT = 'spent';
    const REPORT_FIELD_URL = 'url';
    const REPORT_FIELD_TITLE = 'title';
    const REPORT_FIELD_DESCRIPTION = 'description';
    const REPORT_FIELD_IMAGE_LIST = 'image_list';
    const REPORT_FIELD_CALL_TO_ACTION_BUTTON = 'call_to_action_button';
    //const REPORT_FIELD_VIDEO_URL = 'video_url';
    //const REPORT_FIELD_STATUS = 'status';
    const REPORT_FIELD_ADSET_BUDGET = 'adset_budget';
    const REPORT_FIELD_BUDGET_TYPE = 'budget_type';
    //const REPORT_FIELD_ADSET_SPENT = 'adset_spent';
    const REPORT_FIELD_ADSET_SCHEDULE_START = 'adset_schedule_start';
    const REPORT_FIELD_ADSET_SCHEDULE_END = 'adset_schedule_end';
    const REPORT_FIELD_TIME_START = 'time_start';
    const REPORT_FIELD_TIME_END = 'time_end';
    const REPORT_FIELD_BID = 'bid';
    const REPORT_FIELD_BID_TYPE = 'bid_type';
    const REPORT_FIELD_CHARGE_TYPE = 'charge_type';
    const REPORT_FIELD_DELIVERY_TYPE = 'delivery_type';
    //const REPORT_FIELD_KEYWORD = 'keyword';
    //const REPORT_FIELD_MATCH_TYPE = 'match_type';
    //const REPORT_FIELD_CREATE_TIME = 'create_time';
    //const REPORT_FIELD_LAST_MODIFY_TIME = 'last_modify_time';
    const REPORT_FIELD_AUDIENCE = 'audience';
    //const REPORT_FIELD_LOCATIONS = 'locations';
    //const REPORT_FIELD_AGE = 'age';
    //const REPORT_FIELD_GENDER = 'gender';
    //const REPORT_FIELD_LANGUAGE = 'language';
    //const REPORT_FIELD_DEMOGRAPHICS = 'demographics';
    //const REPORT_FIELD_INTERESTS = 'interests';
    //const REPORT_FIELD_BEHAVIORS = 'behaviors';
}