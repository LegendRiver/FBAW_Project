<?php


class DBConstants
{
    const SELECT_QUERY_FORMAT = "SELECT %s FROM %s";
    const UPDATE_QUERY_FORMAT = "UPDATE %s SET %s WHERE %s";
    const DELETE_QUERY_FORMAT = "DELETE FROM %s WHERE %s";
    const INSERT_QUERY_FORMAT = "INSERT INTO %s(%s) VALUES(%s)";

    const SQL_EQUAL_FORMAT = '%s=?';
    const SQL_COMMA_SPACE = ', ';
    const SQL_AND_SPACE = ' and ';
    const SQL_WHERE_SPACE = ' WHERE ';

    const TIME_END_LIMIT = 1440;

    //ELI 前端campaign DB
    /*
     *  +------------------+---------------+------+-----+---------+-------+
        | Field            | Type          | Null | Key | Default | Extra |
        +------------------+---------------+------+-----+---------+-------+
        | ID               | varchar(40)   | NO   | PRI | NULL    |       |
        | ELI_ACCOUNT_ID   | varchar(40)   | NO   | MUL | NULL    |       |
        | NAME             | varchar(128)  | NO   |     | NULL    |       |
        | CAMPAIGN_TYPE    | int(11)       | NO   |     | 0       |       |
        | URL              | varchar(1024) | NO   |     | NULL    |       |
        | TITLE            | varchar(128)  | NO   |     | NULL    |       |
        | DESCRIPTION      | varchar(256)  | YES  |     | NULL    |       |
        | IMAGE_LIST       | varchar(512)  | YES  |     | NULL    |       |
        | SCHEDULE_START   | datetime      | NO   |     | NULL    |       |
        | SCHEDULE_END     | datetime      | NO   |     | NULL    |       |
        | TIME_START       | datetime      | NO   |     | NULL    |       |
        | TIME_END         | datetime      | NO   |     | NULL    |       |
        | AUDIENCE         | text          | NO   |     | NULL    |       |
        | STATUS           | int(11)       | NO   |     | NULL    |       |
        | BUDGET           | decimal(12,2) | NO   |     | 0.00    |       |
        | SPENT            | decimal(12,2) | NO   |     | NULL    |       |
        | DELIVERY_TYPE    | int(11)       | NO   |     | NULL    |       |
        | KEYWORD          | text          | YES  |     | NULL    |       |
        | MATCH_TYPE       | int(11)       | YES  |     | NULL    |       |
        | CREATE_TIME      | datetime      | YES  |     | NULL    |       |
        | LAST_MODIFY_TIME | datetime      | YES  |     | NULL    |       |
        +------------------+---------------+------+-----+---------+-------+

     */
    const ELI_CAMPAIGN_TABLE_NAME = "T_ELI_CAMPAIGN";

    const ELI_CAMPAIGN_ID = "ID";
    const ELI_CAMPAIGN_ELI_ACCOUNT_ID = "ELI_ACCOUNT_ID";
    const ELI_CAMPAIGN_NAME = "NAME";
    const ELI_CAMPAIGN_CAMPAIGN_TYPE = "CAMPAIGN_TYPE";
    const ELI_CAMPAIGN_URL = "URL";
    const ELI_CAMPAIGN_TITLE = "TITLE";
    const ELI_CAMPAIGN_DESCRIPTION = "DESCRIPTION";
    const ELI_CAMPAIGN_IMAGE_LIST = "IMAGE_LIST";
    const ELI_CAMPAIGN_SCHEDULE_START = "SCHEDULE_START";
    const ELI_CAMPAIGN_SCHEDULE_END = "SCHEDULE_END";
    const ELI_CAMPAIGN_TIME_START = "TIME_START";
    const ELI_CAMPAIGN_TIME_END = "TIME_END";
    const ELI_CAMPAIGN_AUDIENCE = "AUDIENCE";
    const ELI_CAMPAIGN_STATUS = "STATUS";
    const ELI_CAMPAIGN_BUDGET = "BUDGET";
    const ELI_CAMPAIGN_SPENT = "SPENT";
    const ELI_CAMPAIGN_DELIVERY_TYPE = "DELIVERY_TYPE";
    const ELI_CAMPAIGN_KEYWORD = "KEYWORD";
    const ELI_CAMPAIGN_MATCH_TYPE = "MATCH_TYPE";
    const ELI_CAMPAIGN_CREATE_TIME = "CREATE_TIME";
    const ELI_CAMPAIGN_LAST_MODIFY_TIME = "LAST_MODIFY_TIME";


    /*
     *  +------------------+---------------+------+-----+---------+-------+
        | Field            | Type          | Null | Key | Default | Extra |
        +------------------+---------------+------+-----+---------+-------+
        | ID               | decimal(40,0) | NO   | PRI | NULL    |       |
        | ELI_CAMPAIGN_ID  | varchar(40)   | NO   | MUL | NULL    |       |
        | ELI_PUBLISHER_ID | varchar(40)   | NO   |     | NULL    |       |
        | BUDGET           | decimal(12,2) | NO   |     | 0.00    |       |
        | SPENT            | decimal(12,2) | YES  |     | 0.00    |       |
        | STATUS           | int(11)       | YES  |     | 0       |       |
        | CREATE_TIME      | datetime      | YES  |     | NULL    |       |
        | LAST_MODIFY_TIME | datetime      | YES  |     | NULL    |       |
        +------------------+---------------+------+-----+---------+-------+
     */
    const ELI_CAM_CONFIG_TABLE_NAME = "T_ELI_CAMPAIGN_CONFIG";

    const ELI_CAM_CONFIG_ID = "ID";
    const ELI_CAM_CONFIG_CAMPAIGN_ID = "ELI_CAMPAIGN_ID";
    const ELI_CAM_CONFIG_PUBLISHER_ID = "ELI_PUBLISHER_ID";
    const ELI_CAM_CONFIG_BUDGET = "BUDGET";
    const ELI_CAM_CONFIG_SPENT = "SPENT";
    const ELI_CAM_CONFIG_STATUS = "STATUS";
    const ELI_CAM_CONFIG_CREATE_TIME = "CREATE_TIME";
    const ELI_CAM_CONFIG_LAST_MODIFY_TIME = "LAST_MODIFY_TIME";


    /*
     * +------------------------------------+
     */
    const PUBLISHER_CAMPAIGN_TABLE_NAME = "T_ELI_PUBLISHER_CAMPAIGN";

    const PUBLISHER_CAMPAIGN_UUID = "ID";
    const PUBLISHER_CAMPAIGN_CONFIG_ID = "ELI_CAMPAIGN_CONFIG_ID";
    const PUBLISHER_CAMPAIGN_ID = "PUBLISHER_CAMPAIGN_ID";
    const PUBLISHER_CAMPAIGN_ACCOUNTID = "PUBLISHER_ACCOUNT_ID";
    const PUBLISHER_CAMPAIGN_NAME = "NAME";
    const PUBLISHER_CAMPAIGN_TYPE = "CAMPAIGN_TYPE";
    const PUBLISHER_CAMPAIGN_PUBLISHER_TYPE = 'PUBLISHER_TYPE';
    const PUBLISHER_CAMPAIGN_SPENDCAP = "SPEND_CAP";
    const PUBLISHER_CAMPAIGN_STATUS = "STATUS";
    const PUBLISHER_CAMPAIGN_CREATE_TIME = "CREATE_TIME";
    const PUBLISHER_CAMPAIGN_MODIFY_TIME = "LAST_MODIFY_TIME";


    /*
     *+--------------------------------------+
     */
    const PUBLISHER_ADSET_TABLE_NAME = "T_ELI_PUBLISHER_ADSET";

    const PUBLISHER_ADSET_UUID = "ID";
    const PUBLISHER_ADSET_CAM_UUID = "ELI_CAMPAIGN_UUID";
    const PUBLISHER_ADSET_ADSETID = "PUBLISHER_ADSET_ID";
    const PUBLISHER_ADSET_PUBLISHER_TYPE = "PUBLISHER_TYPE";
    const PUBLISHER_ADSET_BUDGET = "ADSET_BUDGET";
    const PUBLISHER_ADSET_SCHEDULE_START = "ADSET_SCHEDULE_START";
    const PUBLISHER_ADSET_SCHEDULE_END = "ADSET_SCHEDULE_END";
    const PUBLISHER_ADSET_TIME_START = "TIME_START";
    const PUBLISHER_ADSET_TIME_END = "TIME_END";
    const PUBLISHER_ADSET_AUDIENCE = "AUDIENCE";
    const PUBLISHER_ADSET_BID = "BID";
    const PUBLISHER_ADSET_BID_TYPE = "BID_TYPE";
    const PUBLISHER_ADSET_CHARGE_TYPE = "CHARGE_TYPE";
    const PUBLISHER_ADSET_DELIVERY_TYPE = "DELIVERY_TYPE";
    const PUBLISHER_ADSET_BUDGET_TYPE = "BUDGET_TYPE";
    const PUBLISHER_ADSET_STATUS = "STATUS";
    const PUBLISHER_ADSET_KEYWORD = "KEYWORD";
    const PUBLISHER_ADSET_MATCH_TYPE = "MATCH_TYPE";
    const PUBLISHER_ADSET_CREATETIME = "CREATE_TIME";
    const PUBLISHER_ADSET_MODIFY_TIME = "LAST_MODIFY_TIME";


    /*
     * +------------------------------------------+
     */
    const CREATIVE_TABLE_NAME = "T_ELI_PUBLISHER_CREATIVE";

    const CREATIVE_UUID = "ID";
    const CREATIVE_ID = "PUBLISHER_CREATIVE_ID";
    const CREATIVE_ACCOUNT_ID = "PUBLISHER_ACCOUNT_ID";
    const CREATIVE_NAME = "CREATIVE_NAME";
    const CREATIVE_AD_FORMAT = "AD_FORMAT";
    const CREATIVE_LINK_TYPE = "LINK_DATA_TYPE";
    const CREATIVE_TITLE = "TITLE";
    const CREATIVE_DESCRIPTION = "DESCRIPTION";
    const CREATIVE_CAPTION = "CAPTION";
    const CREATIVE_MESSAGE = "MESSAGE";
    const CREATIVE_PAGE_ID = "PAGE_ID";
    const CREATIVE_IMAGE_HASH = "IMAGE_HASH";
    const CREATIVE_URL = "LINK_URL";
    const CREATIVE_CALLTOACTION_TYPE = "CALLTOACTION_TYPE";
    const CREATIVE_IMAGE_UUIDS = "IMAGE_UUID_LIST";
    const CREATIVE_CAROUSEL_NAMES = "CAROUSEL_NAME_LIST";
    const CREATIVE_CAROUSEL_DESCS = "CAROUSEL_DESC_LIST";
    const CREATIVE_SLIDESHOW_DURATION = "SLIDESHOW_DURATION_TIME";
    const CREATIVE_SLIDESHOW_TRANSITION = "SLIDESHOW_TRANSITION_TIME";
    const CREATIVE_CREATE_TIME = "CREATE_TIME";
    const CREATIVE_MODIFY_TIME = "LAST_MODIFY_TIME";


    /*
     * +------------------------------------------+
     */
    const AD_TABLE_NAME = "T_ELI_PUBLISHER_AD";

    const AD_UUID = "ID";
    const AD_ADSET_UUID = "ELI_ADSET_UUID";
    const AD_ID = "PUBLISHER_AD_ID";
    const AD_CREATIVE_UUID = "ELI_CREATIVE_UUID";
    const AD_PUBLISHER_TYPE = "PUBLISHER_TYPE";
    const AD_STATUS = "STATUS";
    const AD_NAME = "NAME";
    const AD_CREATE_TIME = "CREATE_TIME";
    const AD_MODIFY_TIME = "LAST_MODIFY_TIME";


    /*
     * +------------------------------------------+
     */
    const IMAGE_TABLE_NAME = "T_ELI_PUBLISHER_IMAGE";

    const IMAGE_UUID = "ID";
    const IMAGE_ID = "PUBLISHER_IMAGE_ID";
    const IMAGE_ACCOUNT = "PUBLISHER_ACCOUNT_ID";
    const IMAGE_HASH = "IMAGE_HASH";
    const IMAGE_URL = "IMAGE_URL";
    const IMAGE_NAME = "IMAGE_NAME";
    const IMAGE_HEIGHT = "HEIGHT";
    const IMAGE_WIDTH = "WIDTH";
    const IMAGE_LOCAL_PATH = "LOCAL_PATH";
    const IMAGE_ORIGINAL_URL = "ORIGINAL_URL";


    /*
     * +----------------------------------------------+
     */
    const AD_REPORT_TABLE_NAME = 'T_ELI_AD_REPORT';

    const AD_REPORT_ID = 'ID';
    const AD_REPORT_CAMPAIGN_UID = 'ELI_CAMPAIGN_ID';
    const AD_REPORT_ADSET_UID = 'ELI_ADSET_ID';
    const AD_REPORT_AD_UID = 'ELI_AD_ID';
    const AD_REPORT_CAMPAIGN_ID = 'PUBLISHER_CAMPAIGN_ID';
    const AD_REPORT_ADSET_ID = 'PUBLISHER_ADSET_ID';
    const AD_REPORT_AD_ID = 'PUBLISHER_AD_ID';
    const AD_REPORT_START_TIME = 'REPORT_START_TIME';
    const AD_REPORT_END_TIME = 'REPORT_END_TIME';
    const AD_REPORT_REQUEST_TIME = 'REQUEST_TIME';
    const AD_REPORT_RESULT_VALUE = 'RESULT_VALUE';
    const AD_REPORT_RESULT_TYPE = 'RESULT_TYPE';
    const AD_REPORT_REACH = 'REACH';
    const AD_REPORT_RESULT_COST = 'COST_PER_RESULT';
    const AD_REPORT_SPENT = 'SPENT';
    const AD_REPORT_IMPRESSIONS = 'IMPRESSIONS';
    const AD_REPORT_CLICKS = 'CLICKS';
    const AD_REPORT_CPC = 'CPC';
    const AD_REPORT_CTR = 'CTR';
    const AD_REPORT_RESULT_RATE = 'RESULT_RATE';
    const AD_REPORT_CPM = 'CPM';
    const AD_REPORT_INSTALLS = 'INSTALLS';
    const AD_REPORT_CPI = 'CPI';
    const AD_REPORT_CVR = 'CVR';

    /*
     * +----------------------------------------------+
     */
    const CAMPAIGN_REPORT_TABLE_NAME = 'T_ELI_CAMPAIGN_REPORT';

    const CAMPAIGN_REPORT_ID = 'ID';
    const CAMPAIGN_REPORT_CAMPAIGN_UID = 'ELI_CAMPAIGN_ID';
    const CAMPAIGN_REPORT_CAMPAIGN_ID = 'PUBLISHER_CAMPAIGN_ID';
    const CAMPAIGN_REPORT_CONFIG_ID = 'ELI_CONFIG_ID';
    const CAMPAIGN_REPORT_START_TIME = 'REPORT_START_TIME';
    const CAMPAIGN_REPORT_END_TIME = 'REPORT_END_TIME';
    const CAMPAIGN_REPORT_REQUEST_TIME = 'REQUEST_TIME';
    const CAMPAIGN_REPORT_RESULT_VALUE = 'RESULT_VALUE';
    const CAMPAIGN_REPORT_RESULT_TYPE = 'RESULT_TYPE';
    const CAMPAIGN_REPORT_REACH = 'REACH';
    const CAMPAIGN_REPORT_RESULT_COST = 'COST_PER_RESULT';
    const CAMPAIGN_REPORT_SPENT = 'SPENT';
    const CAMPAIGN_REPORT_IMPRESSIONS = 'IMPRESSIONS';
    const CAMPAIGN_REPORT_CLICKS = 'CLICKS';
    const CAMPAIGN_REPORT_CPC = 'CPC';
    const CAMPAIGN_REPORT_CTR = 'CTR';
    const CAMPAIGN_REPORT_RESULT_RATE = 'RESULT_RATE';
    const CAMPAIGN_REPORT_CPM = 'CPM';
    const CAMPAIGN_REPORT_INSTALLS = 'INSTALLS';
    const CAMPAIGN_REPORT_CPI = 'CPI';
    const CAMPAIGN_REPORT_CVR = 'CVR';
    const CAMPAIGN_REPORT_BOUNCE_RATE = "BOUNCE_RATE";
    const CAMPAIGN_REPORT_AVERAGE_PAGE_VIEWS = "AVERAGE_PAGE_VIEWS";
    const CAMPAIGN_REPORT_AVERAGE_POSITION = "AVERAGE_POSITION";
    const CAMPAIGN_REPORT_AVERAGE_TIME_ON_SITE = "AVERAGE_TIME_ON_SITE";


    /*
     * +----------------------------------------------+
     */
    const VIDEO_TABLE_NAME = 'T_ELI_PUBLISHER_VIDEO';

    const VIDEO_UUID = 'ID';
    const VIDEO_PUBLISHER_ID = 'PUBLISHER_VIDEO_ID';
    const VIDEO_TYPE = 'VIDEO_TYPE';
    const VIDEO_DURATION_TIME = 'SLIDESHOW_DURATION_TIME';
    const VIDEO_TRANSITION_TIME = 'SLIDESHOW_TRANSITION_TIME';

    /*
     * +----------------------------------------------+
     */
    const PROFIT_TABLE_NAME = 'T_ELI_PROFIT';

    const PROFIT_CONFIG_ID = 'ELI_CONFIG_ID';
    const PROFIT_DAILY_BUDGET = 'DAILY_BUDGET';
    const PROFIT_PROFIT = 'PROFIT';
    const PROFIT_OBJECTIVE_MARGIN = 'OBJECTIVE_MARGIN';
    const PROFIT_UPDATE_TIME = 'UPDATE_TIME';


    /*
     * +----------------------------------------------+
     */
    const DAILY_SPEND_TABLE_NAME = 'T_ELI_DAILY_SPEND';

    const DAILY_SPEND_UUID = 'ID';
    const DAILY_SPEND_CONFIG_ID = 'CONFIG_ID';
    const DAILY_SPEND_CURRENT_DATE = 'REPORT_DATE';
    const DAILY_SPEND_DAILY_BUDGET = 'DAILY_BUDGET';
    const DAILY_SPEND_DAILY_SPEND = 'DAILY_SPEND';
    const DAILY_SPEND_PROFIT = 'PROFIT';
    const DAILY_SPEND_OBJECTIVE_MARGIN = 'OBJECTIVE_MARGIN';

}