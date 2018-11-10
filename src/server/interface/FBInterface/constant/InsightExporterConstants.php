<?php


class InsightExporterConstants
{
    const INSIGHT_FIELD_TYPE_VALUE = '#VALUE#';
    const INSIGHT_FIELD_TYPE_MAP = '#MAPARRAY#';
    const INSIGHT_FIELD_TYPE_LIST = '#NUMARRAY#';
    const INSIGHT_FIELD_MANUAL = '#MANUAL#';
    const INSIGHT_FIELD_FROM_ENTITY = '#FROMENTITY#';

    const INSIGHT_INFO_TYPE = 'type';
    const INSIGHT_INFO_DISPLAY_KEYS = 'displayKeys';
    const INSIGHT_INFO_KEY_KEY = 'keyKey';
    const INSIGHT_INFO_VALUE_KEY = 'valueKey';
    const INSIGHT_INFO_ALIAS = 'alias';
    const INSIGHT_INFO_ENTITY_NAME = 'entityName';
    const INSIGHT_INFO_METHOD = 'method';
    const INSIGHT_INFO_OPTION_LEVEL = 'optionLevel';
    const INSIGHT_INFO_REAL_KEY = 'realKey';

    const INSIGHT_INFO_SPECIAL_REQUEST_TIME = 'request_time';

    const BASIC_INFO_EXPORT_PATH = "exportCsvPath";
    const BASIC_INFO_INSIGHT_INFO_NAME = "insightInfoConfigName";
    const BASIC_INFO_NAME_PREFIX = "csvFileNamePrefix";
    const BASIC_INFO_PARENT_ID = "parentId";
    const BASIC_INFO_DIMENSION = "parentType";
    const BASIC_INFO_SINCE_DATE = "sinceDate";
    const BASIC_INFO_UTIL_DATE = "utilDate";
    const BASIC_INFO_EXPORT_ALL_ACCOUNT = "isExportAllAccount";
    const BASIC_INFO_EXCLUDE_ACCOUNT = "excludeAccountIds";
    const BASIC_INFO_INCLUDE_ACCOUNT = "includeAccountIds";
    const BASIC_INFO_RETENTION_DAYS = "retentionDays";

    const BASIC_TASK_INFO_AD = "AD_CONFIG";
    const BASIC_TASK_INFO_ADSET = "ADSET_CONFIG";
    const BASIC_TASK_INFO_CAMPAIGN = "CAMPAIGN_CONFIG";
    const BASIC_TASK_INFO_COMMON = "COMMON_CONFIG";

    const CONFIG_DIRECTORY_CONF = "conf";
    const CONFIG_BASIC_NAME = "basicConfig.json";
    const CONFIG_BASIC_TASK_NAME = "basicConfig_task.json";
    const CONFIG_RETENTION_NAME = "retentionConfig_task.json";
    const CONFIG_ACCOUNT_LIST_NAME= "accountList.json";
    const CONFIG_ATTRIBUTE_NAME= "attributeConfig.json";

    const OPTION_LEVEL_AD = 'Ad';
    const OPTION_LEVEL_AD_SET = 'AdSet';
    const OPTION_LEVEL_CAMPAIGN = 'Campaign';

    const INSIGHT_EXPORT_FIELD_AD_ID = 'ad_id';
    const INSIGHT_EXPORT_FIELD_ADSET_ID = 'adset_id';

}