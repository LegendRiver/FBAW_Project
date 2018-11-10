<?php


class AdManageConstants
{
    const AD_USER_DES_DEFAULT = 'me';
    const ADACCOUNT_ID_PREFIX = 'act_';
    const ADIMAGE_PARAM_HASHES = 'hashes';
    const DEFAULT_PAGE_ID = 152556761834179;

    const CAMPAIGN_PARAM_TYPE_APP = 0;
    const CAMPAIGN_PARAM_TYPE_WEBSITE = 1;
    const CAMPAIGN_PARAM_TYPE_PRODUCT_SALES = 2;
    const CAMPAIGN_PARAM_TYPE_PROMOTE_PAGE = 3;
    const CAMPAIGN_PARAM_TYPE_BRAND_AWARENESS = 4;

    const PARAM_STATUS_ACTIVE = 0;
    const PARAM_STATUS_PAUSED = 1;

    const CHECK_SUCCESS = 'Check Success';
    const CAMPAIGN_SPEND_CAP_LIMIT = 10000;

    const CHECK_NOT_SET_FORMAT = 'The %s of %s is not setted.';
    const TRANSFORM_FAILED_FORMAT = 'The transform of %s param is failed';

    const LINK_AD_TYPE_CALLTOACTION = 1;
    const LINK_AD_TYPE_LINKDATA = 2;
    const LINK_AD_TYPE_NULL = 3;

    const ADSET_BUDGET_TYPE_DAILY = 0;
    const ADSET_BUDGET_TYPE_SCHEDULE = 1;

    const ADSET_OPTIMIZATION_APPINSTALL = 0;
    const ADSET_OPTIMIZATION_LINKCLICK = 1;
    const ADSET_OPTIMIZATION_OFFSITE_CONVERSION = 2;
    const ADSET_OPTIMIZATION_PAGE_LIKE = 3;
    const ADSET_OPTIMIZATION_BRAND_AWARENESS = 4;
    const ADSET_OPTIMIZATION_REACH= 5;

    const ADSET_BILL_EVENT_IMPRESSIONS = 0;
    const ADSET_BILL_EVENT_LINKCLICK = 1;
    const ADSET_BILL_EVENT_APPINSTALL = 2;

    const CREATIVE_CALLTOACTION_MOBILEAPP_INSTALL = 0;
    const CREATIVE_CALLTOACTION_OPEN_LINK = 1;
    const CREATIVE_CALLTOACTION_DOWNLOAD = 2;
    const CREATIVE_CALLTOACTION_NOBUTTON = 3;
    const CREATIVE_CALLTOACTION_SHOPNOW = 4;
    const CREATIVE_CALLTOACTION_LEARNMORE = 5;
    const CREATIVE_CALLTOACTION_WATCHMORE = 6;
    const CREATIVE_CALLTOACTION_LIKEPAGE = 7;
    const CREATIVE_CALLTOACTION_PLAYGAME = 8;
    const CREATIVE_CALLTOACTION_INSTALLAPP = 9;
    const CREATIVE_CALLTOACTION_USEAPP = 10;
    const CREATIVE_CALLTOACTION_BUYNOW = 11;

    const AD_FORMAT_COMMON = 0;
    const AD_FORMAT_CAROUSEL = 1;
    const AD_FORMAT_SLIDESHOW = 2;
    const AD_FORMAT_VIDEO = 3;

    const AD_CREATIVE_ID = 'creative_id';

    const CAMPAIGN_MAX_NUM = 5000;

    const STORY_LINK_DATA = 1;
    const STORY_OFFER_DATA = 2;
    const STORY_PHOTO_DATA = 3;
    const STORY_TEMPLATE_DATA = 4;
    const STORY_TEXT_DATA = 5;
    const STORY_VIDEO_DATA = 6;


    //insight
    const TIME_RANGE_SINCE = 'since';
    const TIME_RANGE_UNTIL = 'until';

    const ADSET_PACE_TYPE_STANDARD = 'standard';
    //加速投放，只有最大值手动竞标时有效
    const ADSET_PACE_TYPE_NOPACE = 'no_pacing';
    const ADSET_PACE_TYPE_DAYPARTING = 'day_parting';


    const DELIVERY_TYPE_STANDARD = 0;
    const DELIVERY_TYPE_ACCELERATE = 1;

    const SCHEDULE_TYPE_ALLTIMES = 0;
    const SCHEDULE_TYPE_SCHEDULE = 1;

    const BID_TYPE_AUTO = 0;
    const BID_TYPE_MANUAL = 1;

    const VIDEO_TYPE_SLIDESHOW = 0;
    const VIDEO_TYPE_COMMON = 1;

    const SLIDE_SHOW_IMAGEURL = 'images_urls';
    const SLIDE_SHOW_DURATION = 'duration_ms';
    const SLIDE_SHOW_TRANSITION = 'transition_ms';

    //reachEstimate
    const REACH_ESTIMATE_PARAM_CURRENCY = 'currency';
    const REACH_ESTIMATE_PARAM_DAILY_BUDGET = 'daily_budget';
    const REACH_ESTIMATE_PARAM_URL = 'object_store_url';
    const REACH_ESTIMATE_PARAM_OPTIMIZATION = 'optimize_for';
    const REACH_ESTIMATE_PARAM_TARGETING = 'targeting_spec';

    const DELIVERY_ESTIMATE_PARAM_TARGETING = 'targeting_spec';
    const DELIVERY_ESTIMATE_PARAM_OPTIMIZATION = 'optimization_goal';

    const REACH_ESTIMATE_BID_FIELD_MIN = 'min_bid';
    const REACH_ESTIMATE_BID_FIELD_MAX = 'max_bid';
    const REACH_ESTIMATE_BID_FIELD_MEDIAN = 'median_bid';
    const REACH_ESTIMATE_CPA_CURVE_DATA = 'cpa_curve_data';
    const REACH_ESTIMATE_DAU = 'estimate_DAU';
    const REACH_ESTIMATE_CURVE = 'curve';


    const BID_AMOUNT_MIN_LIMIT = 1;

    const DAILY_BUDGET_MAX_LIMIT = 100000000;

    const DAILY_BUDGET_AUTO_IMPRESSION_MIN_LIMIT = 100;
    const DAILY_BUDGET_AUTO_CLICK_MIN_LIMIT = 500;
    const DAILY_BUDGET_AUTO_INSTALL_MIN_LIMIT = 4000;

    const IMAGE_COUNT_IMAGE_LIMIT = 1;
    const IMAGE_COUNT_CAROUSEL_INSTALL_LIMIT = 3;
    const IMAGE_COUNT_CAROUSEL_CLICK_LIMIT = 2;
    const IMAGE_COUNT_CAROUSEL_MAX_LIMIT = 10;
    const IMAGE_COUNT_SLIDESHOW_MIN_LIMIT = 3;
    const IMAGE_COUNT_SLIDESHOW_MAX_LIMIT = 7;

    const IMAGE_WIDTH_MIN_LIMIT = 600;
    const IMAGE_HEIGHT_MIN_LIMIT = 314;
    const IMAGE_CAROUSEL_HEIGHT_MIN_LIMIT = 600;
    const IMAGE_SIZE_MAX_LIMIT = 1048576;

    const TITLE_LENGTH_MIN_LIMIT = 1;
    const TITLE_LENGTH_MAX_LIMIT = 30;
    const MESSAGE_LENGTH_MIN_LIMIT = 1;
    const MESSAGE_LENGTH_MAX_LIMIT = 90;

    const INSIGHT_ACTION_TYPE = 'action_type';
    const INSIGHT_ACTION_VALUE= 'value';
    const INSIGHT_ACTION_TYPE_MOBIEL_INSTALL = 'mobile_app_install';
    const INSIGHT_ACTION_TYPE_LINK_CLICK = 'link_click';

    const PUBLISHER_TYPE_FACEBOOK = 0;
    const PUBLISHER_TYPE_GOOGLE = 1;

    const SLIDESHOW_DURATION_TIME_DEFAULT = 1000;
    const SLIDESHOW_TRANSITION_TIME_DEFAULT = 200;

    const QUERY_PARAM_LIMIT = 'limit';
    const QUERY_AD_AMOUNT_LIMIT = 50000;
    const QUERY_CAMPAIGN_AMOUNT_LIMIT = 10000;
    const QUERY_ADSET_AMOUNT_LIMIT = 10000;
    const QUERY_ACCOUNT_AMOUNT_LIMIT = 10000;
    const QUERY_COMMON_AMOUNT_LIMIT = 50000;

    const INSIGHT_EXPORT_TYPE_ACCOUNT = 'exportAccount';
    const INSIGHT_EXPORT_TYPE_CAMPAIGN = 'exportCampaign';
    const INSIGHT_EXPORT_TYPE_ADSET = 'exportAdset';
    const INSIGHT_EXPORT_TYPE_AD = 'exportAd';

    const TARGETING_FIELD_AGE_MAX = 'age_max';
    const TARGETING_FIELD_AGE_MIN = 'age_min';
    const TARGETING_FIELD_GENDER = 'genders';
    const TARGETING_FIELD_LOCATION = 'geo_locations';
    const TARGETING_FIELD_COUNTRY = 'countries';
    const TARGETING_FIELD_LOCALE = 'locales';
    const TARGETING_FIELD_USER_OS = 'user_os';
    const TARGETING_FIELD_FLEXIBLE = 'flexible_spec';
    const TARGETING_FIELD_EXCLUSION = 'exclusions';
    const TARGETING_FIELD_INTEREST = 'interests';
    const TARGETING_FIELD_BEHAVIOR = 'behaviors';
    const TARGETING_FIELD_CUSTOM_AUDIENCE = 'custom_audiences';
    const TARGETING_FIELD_ID = 'id';
    const TARGETING_FIELD_NAME = 'name';

    const CREATIVE_TYPE_SINGLE_IMAGE = 'single_image';
    const CREATIVE_TYPE_SINGLE_VIDEO = 'single_video';
    const CREATIVE_TYPE_CAROUSEL_IMAGE = 'carousel_image';
    const CREATIVE_TYPE_CAROUSEL_VIDEO = 'carousel_video';

    const DEFAULT_BM_ID = '584936385020414';

    const COPY_ADSET_ID = 'copied_adset_id';

    //delivery_estimate
    const DELIVERY_FIELD_BID = 'bid_estimate';
    const DELIVERY_FIELD_CURVE = 'daily_outcomes_curve';
    const DELIVERY_FIELD_DAU = 'estimate_dau';
    const DELIVERY_FIELD_MAU = 'estimate_mau';

    const CURVE_DATA_FIELD_SPEND = 'spend';
    const CURVE_DATA_FIELD_REACH = 'reach';
    const CURVE_DATA_FIELD_IMPRESSION = 'impressions';
    const CURVE_DATA_FIELD_ACTION = 'actions';

    const OS_ANDROID = 'android';
    const OS_IOS = 'ios';

    const EFFECTIVE_STATUS_ACTIVE = 1;
    const EFFECTIVE_STATUS_REVIEW = 2;
}