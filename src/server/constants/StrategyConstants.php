<?php


class StrategyConstants
{
    //campaign接口常量
    const ST_CAMPAIGN_NAME = 'name';
    const ST_CAMPAIGN_ACCOUNT_ID = 'adAccountId';
    const ST_CAMPAIGN_ID = 'campaignId';
    const ST_CAMPAIGN_OPERATION = 'adOperation';
    const ST_CAMPAIGN_SPEND_CAP = 'campaignSpendCap';
    const ST_CAMPAIGN_TYPE = 'campaignType';
    const ST_CAMPAIGN_ADSETS = 'adsets';
    const ST_CAMPAIGN_CREATIVES = 'creatives';

    const ST_CAMPAIGN_STATUS = 'status'; //策略暂无值
    const ST_CAMPAIGN_CONFIGID = 'configId'; //策略暂无值
    const ST_CAMPAIGN_PRODUCT_CATALOG_ID = 'productCatalogId'; //策略暂无值

    //creative
    const ST_CREATIVE_NAME = 'name';
    const ST_CREATIVE_PSEUDO_ID = 'pseudoId';
    const ST_CREATIVE_TITLE = 'title';
    const ST_CREATIVE_MESSAGE = 'message';
    const ST_CREATIVE_DESC = 'description';
    const ST_CREATIVE_IMAGE_PATHS = 'imagePaths';
    const ST_CREATIVE_LINK_URL = 'linkUrl';
    const ST_CREATIVE_PAGE_ID = 'pageId';
    const ST_CREATIVE_CALLTOACTION = 'callToActionType';
    const ST_CREATIVE_ADFORMAT = 'adFormat';

    const ST_CREATIVE_LINK_AD_TYPE = 'linkAdType';//策略暂无值
    const ST_CREATIVE_ACCOUNT_ID = 'adAccountId';//策略暂无值
    const ST_CREATIVE_CAROUSEL_NAMES = 'carouselNames';//策略暂无值
    const ST_CREATIVE_CAROUSEL_DESCS = 'carouselDescs';//策略暂无值
    const ST_CREATIVE_PRODUCT_SET_ID = 'productSetId';//策略暂无值
    const ST_CREATIVE_VIDEO_SOURCE_PATH = 'videoSourcePath';//策略暂无值

    const APPEND_CREATIVE_IMAGE_HASH = 'imageHash';//新增字段
    const APPEND_CREATIVE_VIDEO_ID = 'vedioId';//新增字段
    const APPEND_CREATIVE_CAROUSE_HASHES = 'carouselHashes';//新增字段
    const APPEND_CREATIVE_IMAGE_FBHASHES = 'imageFbImageHashes';//新增字段

    //adset
    const ST_ADSET_NAME = 'name';
    const ST_ADSET_CAMPAIGN_ID = 'campaignId';
    const ST_ADSET_ID = 'adsetId';
    const ST_ADSET_OPERATION = 'adOperation';
    const ST_ADSET_TARGETING = 'targeting';
    const ST_ADSET_BUDGET_TYPE = 'budgetType';
    const ST_ADSET_SCHEDULE_TYPE = 'scheduleType';
    const ST_ADSET_START_TIME = 'timeStart';
    const ST_ADSET_END_TIME = 'timeEnd';
    const ST_ADSET_BUDGET_AMOUNT = 'budgetAmount';
    const ST_ADSET_OPTIMIZATION_GOAL = 'optimizationGoal';
    const ST_ADSET_BILL_EVENT = 'billEvent';
    const ST_ADSET_BID_AMOUNT = 'bidAmount';
    const ST_ADSET_APP_URL = 'appStoreUrl';
    const ST_ADSET_ADS = 'ads';

    const ST_ADSET_DELIVERY_TYPE = 'deliveryType';//策略暂无值
    const ST_ADSET_STATUS = 'status';//策略暂无值
    const ST_ADSET_LINK_AD_TYPE = 'linkAdType';//策略暂无值
    const ST_ADSET_START_MIN = 'startMin';//策略暂无值
    const ST_ADSET_END_MIN = 'endMin';//策略暂无值
    const ST_ADSET_PROMOTED_PRODUCTSET_ID = 'promotedProductSetId';//策略暂无值

    const APPEND_ADSET_SCHEDULE_DAYS = 'days';//新增字段

    //targeting
    const ST_TARGETING_GENDER = 'gender';
    const ST_TARGETING_AGE_MIN = 'ageMin';
    const ST_TARGETING_AGE_MAX = 'ageMax';
    const ST_TARGETING_LOCALE = 'locales';
    const ST_TARGETING_COUNTRIES = 'countries';
    const ST_TARGETING_INTEREST = 'interest';
    const ST_TARGETING_USER_OS = 'userOSs';
    const ST_TARGETING_DEVICE_PLATFORM = 'devicePlatforms';
    const ST_TARGETING_PUBLISHER_PLATFORM = 'publisherPlatforms';
    const ST_TARGETING_POSITION = 'positions';

    const ST_TARGETING_USER_DEVICE = 'userDevices';//策略暂无值
    const ST_TARGETING_EXCLUDE_DEVICE = 'excludeUserDevices';//策略暂无值
    const ST_TARGETING_WIRELESS = 'wirelessCarrier';//策略暂无值
    const ST_TARGETING_CUSTOM_AUDIENCE = 'customAudienceIds';//策略暂无值

    //ad
    const ST_AD_NAME = 'name';
    const ST_AD_ADSET_ID = 'adsetId';
    const ST_AD_CREATIVE_ID = 'creativeId';
    const ST_AD_CREATIVE_PSEUDO_ID = 'creativePseudoId';

    const ST_AD_STATUS = 'status';//策略暂无值


    //接口值
    const ST_V_ADFORMAT_IMAGE = 'Image';
    const ST_V_ADFORMAT_CAROUSEL = 'Carousel';
    const ST_V_ADFORMAT_SLIDESHOW = 'Slideshow';
    const ST_V_ADFORMAT_VIDEO = 'Video';

    const ST_V_BUDGET_TYPE_DAILY = 'Daily';
    const ST_V_BUDGET_TYPE_SCHEDULE = 'Schedule';

    const ST_V_SCHEDULE_TYPE_ALLTIME = 'AllTime';
    const ST_V_SCHEDULE_TYPE_SCHEDULE = 'Schedule';

    const ST_V_CAMPAIGN_TYPE_APPINSTALL = 'AppInstall';
    const ST_V_CAMPAIGN_TYPE_APPUSE = 'AppUse';
    const ST_V_CAMPAIGN_TYPE_LINKCLICK = 'LinkClick';
    const ST_V_CAMPAIGN_TYPE_PROUCTSALES = 'ProductSales';
    const ST_V_CAMPAIGN_TYPE_PAGELIKE = 'PageLike';
    const ST_V_CAMPAIGN_TYPE_BRANDAWARENESS = 'BrandAwareness';

    const ST_V_OPTIMIZATION_APPINSTALL = 'AppInstall';
    const ST_V_OPTIMIZATION_LINKCLICK = 'LinkClick';
    const ST_V_OPTIMIZATION_OFFSITE_CONVERSION = 'OffsiteConversion';
    const ST_V_OPTIMIZATION_PAGE_LIKE = 'PageLike';
    const ST_V_OPTIMIZATION_BRAND_AWARENESS = 'BrandAwareness';
    const ST_V_OPTIMIZATION_REACH = 'Reach';

    const ST_V_BILLEVENT_IMPRESSION = 'Impression';
    const ST_V_BILLEVENT_CLICK = 'LinkClick';
    const ST_V_BILLEVENT_APPINSTALL = 'AppInstall';

    const ST_V_CALLTOACTION_INSTALLMOBILEAPP = 'INSTALL_MOBILE_APP';
    const ST_V_CALLTOACTION_DOWNLOAD = 'DOWNLOAD';
    const ST_V_CALLTOACTION_OPENLINK = 'OPEN_LINK';
    const ST_V_CALLTOACTION_SHOPNOW = 'SHOP_NOW';
    const ST_V_CALLTOACTION_NOBUTTON = 'NO_BUTTON';
    const ST_V_CALLTOACTION_INSTALLAPP = 'INSTALL_APP';
    const ST_V_CALLTOACTION_LEARNMORE = 'LEARN_MORE';
    const ST_V_CALLTOACTION_WATCHMORE = 'WATCH_MORE';
    const ST_V_CALLTOACTION_LIKEPAGE = 'LIKE_PAGE';
    const ST_V_CALLTOACTION_PLAYGAME = 'PLAY_GAME';
    const ST_V_CALLTOACTION_USEAPP = 'USE_APP';
    const ST_V_CALLTOACTION_BUYNOW = 'BUY_NOW';

    const ST_V_GENDER_ALL = 'All';
    const ST_V_GENDER_MALE = 'Male';
    const ST_V_GENDER_FEMALE = 'Female';

    const ST_V_OPERATION_NOOP = "NOOP";
    const ST_V_OPERATION_NEW = "NEW";
    const ST_V_OPERATION_UPDATE = "UPDATE";

    const ST_V_NODE_STATUS_ACTIVE = 'Active';//策略暂无值
    const ST_V_NODE_STATUS_PAUSED = 'Paused';//策略暂无值

    const ST_V_LINKDATA_TYPE_ALL = 'All';//策略暂无值
    const ST_V_LINKDATA_TYPE_NORMAL = 'Normal';//策略暂无值
    const ST_V_LINKDATA_TYPE_NONE = 'None';//策略暂无值

    const ST_V_DELIVERY_TYPE_STANDARD = 'Standard';//策略暂无值
    const ST_V_DELIVERY_TYPE_ACCELERATE = 'Accelerate';//策略暂无值

    //check Field Value
    const TRANSFORM_CHECK_FIELD_OPTION = 'optionValid';

    const DOWNLOAD_IMAGE_TRY_TIMES = 5;
    const DOWNLOAD_IMAGE_TRY_INTERVAL = 10000;

    const UPLOAD_IMAGE_TRY_TIMES = 2;
    const UPLOAD_IMAGE_TRY_INTERVAL = 60000;
    const UPLOAD_IMAGE_CREATE_INTERVAL = 10000;

    const SLIDESHOW_PUBLISHED_INTERVAL = 300;
    const SLIDESHOW_CREATIVE_TRY_TIMES = 2;

    const READ_STRATEGY_FILE_INTERVAL = 10000;

    const STRATEGY_JSON_FILE_EXTENSION = '.json';

    const STRATEGY_FILE_READY_STATUS = '_ready';
    const STRATEGY_FILE_SUCCESS_STATUS = '_success';
    const STRATEGY_FILE_FAILED_STATUS = '_failed';

}