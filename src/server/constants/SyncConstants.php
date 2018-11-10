<?php


class SyncConstants
{
    const CAMPAIGN_JSON_CONFIGS = 'CONFIGS';

    const AUDIENCE_COUNTRIES = 'COUNTRIES';
    const AUDIENCE_GENDER = 'GENDER';
    const AUDIENCE_AGE = 'AGE';

    const STRATEGY_PARAM_ACCOUNT_ID = 'adAccountId';
    const STRATEGY_PARAM_OPERATION = 'adOperation';
    const STRATEGY_PARAM_BID_DISCOUNT = 'bidDiscounts';
    const STRATEGY_PARAM_SPEND_CAP = 'campaignSpendCap';
    const STRATEGY_PARAM_CAMPAIGN_TYPE = 'campaignType';
    const STRATEGY_PARAM_CONFIG_ID = 'configId';
    const STRATEGY_PARAM_COUNTRIES = 'countries';
    const STRATEGY_PARAM_AGE_MIN = 'ageMin';
    const STRATEGY_PARAM_AGE_MAX = 'ageMax';
    const STRATEGY_PARAM_GENDER = 'gender';
    const STRATEGY_PARAM_PUBLISHER = 'publisher';
    const STRATEGY_PARAM_PYOBJECT = 'py/object';
    const STRATEGY_PARAM_SUGGEST_BID = 'suggestedBid';
    const STRATEGY_PARAM_TIME_END = 'timeEnd';
    const STRATEGY_PARAM_TIME_START = 'timeStart';
    const STRATEGY_PARAM_URL = 'url';

    const PARAM_OPERATE_VALUE_NEW = 'NEW';
    const PARAM_OPERATE_VALUE_UPDATE = 'UPDATE';

    const PARAM_CAMPAIGN_TYPE_APP_INSTALL = 'AppInstall';
    const PARAM_CAMPAIGN_TYPE_WEB_SITE = 'LinkClick';
    const ELI_DB_CAMLPAIGN_TYPE_APP = 0;
    const ELI_DB_CAMLPAIGN_TYPE_WEBSITE = 1;

    const PARAM_PYOBJECT_DEFAULT_VALUE = 'Promotion.PromotionInfo';

    const PARAM_PUBLSHER_FACEBOOK = 'facebook';
    const PARAM_PUBLSHER_INSTAGRAM = 'instagram';
    const PARAM_PUBLSHER_GOOGLE = 'google';
    const PARAM_PUBLSHER_YOUTUBE = 'youtube';

    const SYNC_INTERFACED_PARAM_DATA = 'DATA';

    const FRONT_SERVER_SYNC_URL = 'http://www.eliads.com:9090/EliAccountManagerService.php';
}