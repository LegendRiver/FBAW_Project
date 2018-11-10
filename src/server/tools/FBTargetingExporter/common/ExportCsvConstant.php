<?php

class ExportCsvConstant
{
    const CSV_FIELD_NAME_ID = 'ID';
    const CSV_FIELD_NAME_NAME = 'Name';
    const CSV_FIELD_NAME_AUDIENCE_SIZE = 'AudienceSize';
    const CSV_FIELD_NAME_PATH = 'Path_';
    const CSV_FIELD_NAME_DESCRIPTION = 'Description';
    const CSV_FIELD_NAME_TYPE = 'Type';
    const CSV_FIELD_NAME_PLATFORM = 'Platform';
    const CSV_FIELD_NAME_COUNTRY_CODE = 'CountryCode';
    const CSV_FIELD_NAME_COUNTRY_AUDIENCE_SIZE = 'AudienceSize_';
    const CSV_FIELD_NAME_COUNTRY_BID_MAX = 'BidMax_';
    const CSV_FIELD_NAME_COUNTRY_BID_MIN = 'BidMin_';
    const CSV_FIELD_NAME_COUNTRY_BID_MEDIAN = 'BidSuggest_';
    const CSV_FIELD_NAME_COUNTRY_DAILY_REACH_MIN = 'DailyReachMin_';
    const CSV_FIELD_NAME_COUNTRY_DAILY_REACH_MAX = 'DailyReachMax_';

    const CSV_FILE_NAME_CONNECTOR = '___';

    const CONFIG_ITEM_NAME_FLEXIBLE = 'flexible';
    const CONFIG_ITEM_NAME_LOCATION = 'location';
    const CONFIG_ITEM_NAME_BASIC = 'basic';
    const CONFIG_ITEM_NAME_CLASS = 'searchClassList';
    const CONFIG_ITEM_NAME_COUNTRY_CODE = 'countryCodeList';
    const CONFIG_ITEM_NAME_LOCALE = 'localesList';
    const CONFIG_ITEM_NAME_COMMON = 'common';
    const CONFIG_ITEM_NAME_COM_COUNTRY = 'com_country';
    const CONFIG_ITEM_NAME_COM_GENDER = 'com_gender';
    const CONFIG_ITEM_NAME_ACCOUNT_ID = 'accountId';
    const CONFIG_ITEM_NAME_APP_URL = 'appUrl';
    const CONFIG_ITEM_NAME_EXCEL_PREFIX = 'excelFilePre';
    const CONFIG_ITEM_NAME_DAILY_BUDGET = 'dailyBudget';
    const CONFIG_ITEM_NAME_BID_AMOUNT = 'bidAmount';
    const CONFIG_ITEM_NAME_ESTIMATE_PARAM = 'estimateParam';
    const CONFIG_ITEM_NAME_PLACEMENT = 'placement';

    const CURVE_DATA_FIELD_BID = 'bid';

    const ESTIMATE_REACH_MIN = 'minReach';
    const ESTIMATE_REACH_MAX = 'maxReach';

    const TITLE_CLASS_WITHOUT_ID = 'withoutId';

    public static $CSV_CLASS_KEY_FILED_MAP = array(
        TargetingConstants::SEARCH_CLASS_INTEREST => self::CSV_FIELD_NAME_ID,
        TargetingConstants::SEARCH_CLASS_BEHAVIOR => self::CSV_FIELD_NAME_ID,
        TargetingConstants::SEARCH_CLASS_LIFE_EVENT => self::CSV_FIELD_NAME_ID,
        TargetingConstants::SEARCH_CLASS_INDUSTRY => self::CSV_FIELD_NAME_ID,
        TargetingConstants::SEARCH_CLASS_POLITICS => self::CSV_FIELD_NAME_ID,
        TargetingConstants::SEARCH_CLASS_FAMILY_STATUSES => self::CSV_FIELD_NAME_ID,
        TargetingConstants::SEARCH_CLASS_HOUSEHOLD_COMPOSITION => self::CSV_FIELD_NAME_ID,
        TargetingConstants::SEARCH_CLASS_GENERATION => self::CSV_FIELD_NAME_ID,
        TargetingConstants::SEARCH_CLASS_ETHNIC_AFFINITY => self::CSV_FIELD_NAME_ID,

        TargetingConstants::P_SEARCH_CLASS_RELATIONSHIP_STATUS => self::CSV_FIELD_NAME_NAME,
        TargetingConstants::P_SEARCH_CLASS_EDUCATION_STATUS => self::CSV_FIELD_NAME_NAME,
        TargetingConstants::SEARCH_CLASS_USER_DEVICE => self::CSV_FIELD_NAME_NAME,

        ExportCsvConstant::CONFIG_ITEM_NAME_LOCALE => self::CSV_FIELD_NAME_NAME,
    );
}