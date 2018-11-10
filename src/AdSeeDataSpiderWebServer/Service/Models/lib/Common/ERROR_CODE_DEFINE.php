<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 10/13/15
 * Time: 10:30 AM
 */

    /* 错误码 */
    define('OK',0);
    define('ERROR',1);

    define('FILE_NOT_EXIST',10001);
    define('OPEN_FILE_FAIL',10002);
    define('READ_FILE_FAIL',10003);

    define('KEY_EXIST',10007);
    define('KEY_NOT_EXIST',10008);
    define('CREATE_LOG_DIR_FAIL',10013);
    define('WRITE_LOG_TO_FILE_FAIL',10014);
    define('OPEN_SYSLOG_FAIL',10015);
    define('WRITE_TO_SYSLOG_FAIL',10016);
    define('WRITE_DATA_TO_FILE_FAIL',10116);

    define('SQL_RUN_ERROR',10017);
    define('CONNECT_DB_SERVER_FAIL',10018);
    define('SELECT_DB_FAIL',10019);

    define('ERR_CHANGE_DB_CHARSET_FAILED',10020);
    define('ERR_EXECUTE_SQL_FAILED',10021);
    define('ERR_STMT_PREPARE_SQL_FAILED',10022);
    define('ERR_STMT_BIND_PARAMETER_FAILED',10023);
    define('ERR_UNKNOWN_QUERY_SCHEME_TYPE',10024);
    define('ERR_EXECUTE_INSERT_RECORD_FAILED',10025);
    define('ERR_EXECUTE_UPDATE_RECORD_FAILED',10026);
    define('ERR_EXECUTE_DELETE_RECORD_FAILED',10027);
    define('ERR_LOAD_QUERY_SCHEME_FAILED',10028);
    define('ERR_UNKNOWN_PARAMETER_TYPE_FAILED',10029);
    define('ERR_NOT_SUPPORT',10030);
    define('ERR_TABLE_NOT_EXIST',10031);

    define('OPEN_DIR_FAIL',10032);
    define('LIST_DB_TABLES_FAIL',10034);
    define('CREATE_TABLE_FAIL',10035);
    define('TABLE_EXIST',10036);
    define('INSERT_RECORD_FAIL',10037);
    define('ERR_START_TRANSACTION_FAILED',10038);
    define('ERR_COMMIT_TRANSACTION_FAILED',10039);
    define('ERR_STMT_INIT_FAILED',10040);

    define('ERR_EXTRACT_CODE_IS_USED', 20000);
    define('ERR_UPLOAD_FILE_SESSION_ID_INVALID', 20001);
    define('ERR_WRITE_BLOCK_DATA_FAIL', 20002);
    define('ERR_CREATE_STORE_PATH_FAIL', 20003);
    define('ERR_OPEN_FILE_FAILED', 20004);
    define('ERR_FILE_HANDLE_IS_NULL', 20005);
    define('ERR_FILE_SEEK_FAILED', 20006);
    define('ERR_FILE_BLOCK_IS_NULL', 20007);
    define('ERR_UPLOAD_FILE_FAILED', 20008);
    define('ERR_WRITE_FILE_FAILED', 20009);


    define('ERR_USER_NOT_EXISTS', 50001);
    define('ERR_USER_ACCOUNT_OR_PASSWORD_INVALID', 50002);
    define('ERR_USER_EXISTS', 30003);
    define('ERR_ACCESS_TOKEN_INVALID', 50004);
    define('ERR_USER_LOGOUT_FAILED', 50005);
    define('ERR_USER_LOGIN_EXPIRED', 50006);
    define('ERR_USER_ALREADY_LOGOUT', 50007);
    define('ERR_USER_SUBMIT_DATA_INVALID', 50040);
    define('ERR_USER_NOT_LOGIN',50041);
    define('ERR_OLD_PASSWORD_INVALID', 50080);

    define('ERR_TASK_NOT_EXIST', 1042);
    define('ERR_DELETE_TASK_RUNTIME_FAIL', 1043);
    define('ERR_TASK_RUNTIME_NOT_EXIST', 1044);

    define('ERR_USER_INFO_BASE64_DECODER_FAIL', 1045);
    define('ERR_USER_RUN_TASK_LOG_BASE64_DECODER_FAIL', 1046);

    define('ERR_NOT_FOUND_PARAMETER_SERVICE_NAME', 10000);
    define('ERR_NOT_FOUND_PARAMETER_CLASS_INSTANCE_NAME', 10001);
    define('ERR_NOT_FOUND_PARAMETER_FUNCTION_NAME', 10002);
    define('ERR_NOT_FOUND_PARAMETER_NAME', 10003);
    define('ERR_NOT_FOUND_PARAMETER_DATA', 10004);
    define('ERR_NOT_FOUND_PARAMETER', 10005);
    define('ERR_NOT_FOUND_SERVICE', 10010);
    define('ERR_NOT_FOUND_CLASS_INSTANCE', 10015);
    define('ERR_NOT_FOUND_FUNCTION', 10020);
    define('ERR_FUNCTION_NOT_ALLOW_ACCESS', 10021);
    define('ERR_KEYWORDS_IS_EMPTY', 10030);
    define('ERR_NOT_FOUND_KEYWORDS', 10040);
    define('ERR_PARAMETER_VALUE_INVALID', 10050);
    define('ERR_LOAD_OBJECT_FROM_DB_FAILED', 10060);
    define('ERR_FOUND_RECORD_IN_DB', 10080);
    define('ERR_CONVERT_STR_TO_DATE', 10090);
    define('ERR_FUNCTION_PERMISSION_EXIST', 10100);
    define('ERR_FUNCTION_PERMISSION_NOT_EXIST', 10101);
    define('ERR_DATA_PERMISSION_NOT_EXIST', 10102);
    define('ERR_DATA_PERMISSION_EXIST', 10103);

    define('ERR_EXEC_SQL_FAILED', 11000);

    define('ERR_SYSTEM_EXIST', 12000);

    define('ERR_AMOUNT_FORMAT_INVALID', 13000);
    define('ERR_ELI_ACCOUNT_RECHARGE_FAILED', 13001);
    define('ERR_ELI_ACCOUNT_NOT_EXIST', 13002);
    define('ERR_ELI_ACCOUNT_INSUFFICIENT_BALANCE', 13004);
    define('ERR_ELI_ACCOUNT_RECHARGE_AMOUNT_INVALID', 13005);

    define('ERR_CAMPAIGN_EXIST', 14000);
    define('ERR_CREATE_CAMPAIGN_FAILED', 14001);
    define('ERR_CREATE_CAMPAIGN_CONFIG_FAILED', 14002);
    define('ERR_CAMPAIGN_PUBLISHER_IS_EMPTY', 14003);
    define('ERR_ELI_CAMPAIGN_CONFIG_SPENT_DATA_JSON_DECODE_FAILED', 14004);
    define('ERR_ELI_UPDATE_PUBLISHER_SPENT_RECORD_DATA_FAILED', 14005);
    define('ERR_ELI_CAMPAIGN_CONFIG_SPENT_DATA_BASE64_DECODE_FAILED', 14006);
    define('ERR_ELI_SYNC_RESULT_FIELD_ERROR_CODE_FORMAT_INVALID', 14007);
    define('ERR_ELI_SYNC_RESULT_DATA_FORMAT_INVALID', 14008);
    define('ERR_ELI_CAMPAIGN_CONFIG_SPENT_RECORD_NOT_HAVE_PROPERTY_FIELDS', 14009);
    define('ERR_ELI_CAMPAIGN_CONFIG_SPENT_RECORD_NOT_HAVE_PROPERTY_RECORDS', 14010);
    define('ERR_ELI_CAMPAIGN_CONFIG_SPENT_RECORD_PROPERTY_FIELDS_IS_ZERO', 14011);
    define('ERR_ELI_CAMPAIGN_CONFIG_SPENT_RECORDS_IS_EMPTY', 14012);

    /* verification code */
    define('ERR_VERIFICATION_CODE_EXPIRED', 15000);
    define('ERR_VERIFICATION_CODE_INVALID', 15001);

    /* File upload*/
    define('ERR_CHECK_USER_ACCESS_TOKEN_FAILED', 16000);
    define('ERR_CHECK_TOKEN_RESULT_DECODE_FAILED', 16001);
    define('ERR_MEDIA_TYPE_INVALID', 16002);
    define('ERR_PARAMETER_FILE_SIZE_FORMAT_INVALID', 16003);
    define('ERR_FILE_SIZE_INVALID', 16004);
    define('ERR_FILE_SIZE_IS_OVERFLOW', 16005);
    define('ERR_FILE_MD5_IS_NULL', 16007);
    define('ERR_FILE_MD5_NOT_EQUAL', 16008);
    define('ERR_WRITE_DATA_LENGTH_NOT_EQUAL_DATA_LENGTH', 16009);
    define('ERR_NOT_FOUND_ATTACHMENT', 16010);
    define('ERR_COMPRESS_PACKAGE_FAILED', 16011);
    define('ERR_COPY_ELEMENT_FAILED', 16012);
    define('ERR_FILE_EXISTS', 16013);
    define('ERR_CAL_FILE_MD5_FAILED', 16016);

    //report sync error
    define('ERR_CONFIG_REPORT_RESULT_FORMAT_INVALID', 19000);
    define('ERR_CONFIG_REPORT_ERRORCODE_FORMAT_INVALID', 19003);
    define('ERR_WRITE_REPORT_LOG', 19006);
    define('ERR_STRATEGY_DIR', 19009);

    //Stragety interface error
    define('ERR_STRATEGY_EXCEPTION', 20000);
    define('ERR_SERVER_DB_EXCEPTION', 20001);
    define('ERR_HANDLE_SQL_EXCEPTION', 20002);
    define('ERR_PARSE_STRATEGY_FILE_FAILED', 20003);
    define('ERR_RESET_IMAGE_PROCESSER', 20004);
    define('ERR_PARSE_STRATEGY_PARAM_ERROR', 20006);
    define('ERR_CREATE_CAMPAIGN_ERROR', 20009);
    define('ERR_CREATE_ADSET_ERROR', 20012);
    define('ERR_NO_CAMPAIGNID_CREATE_NODE', 20015);
    define('ERR_NO_CAMPAIGNUID_DB', 20018);
    define('ERR_CREATE_CREATIVE_ERROR', 20021);
    define('ERR_CREATE_VIDEO_ERROR', 20023);
    define('ERR_CREATE_AD_ERROR', 20024);
    define('ERR_CREATE_IMAGE_ERROR', 20025);
    define('ERR_CREATE_SLIDESHOW_ERROR', 20026);

    define('ERR_SPEND_CAP_SMALL', 20027);
    define('ERR_MONEY_IS_NOT_INT', 20028);
    define('ERR_PRODUCT_CATALOG_ID_NULL', 20029);
    define('ERR_BID_AMOUNT_SMALL', 20030);
    define('ERR_PRODUCT_SET_ID_NULL', 20031);
    define('ERR_VIDEO_PATH_NULL', 20032);
    define('ERR_DAILY_BUDGET_GREAT', 20033);
    define('ERR_VIDEO_CALL_ACTION_NULL', 20034);
    define('ERR_DAILY_BUDGET_SMALL', 20036);
    define('ERR_SCHEDULE_ZERO_DAY', 20039);
    define('ERR_AGE_MIN_SMALL', 20042);
    define('ERR_AGE_MAX_GREAT', 20045);
    define('ERR_COUNTRY_COUNT_GREAT', 20048);
    define('ERR_LOCALE_COUNT_GREAT', 20051);
    define('ERR_COUNTRY_NAME_INVALID', 20054);
    define('ERR_LOCALE_NAME_INVALID', 20057);
    define('ERR_IMAGE_COUNT_LESS', 20060);
    define('ERR_IMAGE_COUNT_GREAT', 20063);
    define('ERR_IMAGE_DOWNLOAD', 20066);
    define('ERR_IMAGE_WIDTH_LESS', 20069);
    define('ERR_IMAGE_HEIGHT_LESS', 20072);
    define('ERR_IMAGE_SIZE_GREAT', 20075);
    define('ERR_TITLE_LENGTH_LESS', 20078);
    define('ERR_TITLE_LENGTH_GREAT', 20081);
    define('ERR_MESSAGE_LENGTH_LESS', 20084);
    define('ERR_MESSAGE_LENGTH_GREAT', 20087);
    define('ERR_CAROUSEL_IMAGE_COUNT_NO_EQUAL', 20090);
    define('ERR_BILL_EVENT_VALUE', 20093);
    define('ERR_REPORT_DB_TRANSFORM', 20096);
    define('ERR_REPORT_LOG_TRANSFORM', 20099);

    define('ERR_INTERFACE_PARSE_CAMPAIGN_JSON', 20102);
    define('ERR_INTERFACE_NOTIFY_STRATEGY', 20103);
    define('ERR_INTERFACE_HAVE_SYNC_CAMPAIGN', 20104);
    define('ERR_INTERFACE_BUILDE_STRATEGY_PARAM', 20105);
    define('ERR_INTERFACE_GET_PROFIT', 20106);

    define('ERR_STRATEGY_CAMPAIGN_COMMON_CHECK', 20108);
    define('ERR_STRATEGY_ADSET_COMMON_CHECK', 20111);
    define('ERR_STRATEGY_CREATIVE_COMMON_CHECK', 20114);



    //AWS client
    define('ERR_AWS_CLIENT_SEND_MESSAGE_FAILED', 21000);
    define('ERR_AWS_CLIENT_SET_TOPIC_DISPLAY_NAME_FAILED', 21001);
    define('ERR_AWS_CLIENT_CREATE_TOPIC_FAILED', 21002);

    /* encrypt */
    define('ERR_DATA_BASE64_DECODE_FAILED', 22000);
    define('ERR_DATA_JSON_DECODE_FAILED', 22001);
    define('ERR_DATA_DECRYPT_FAILED', 22002);

    /* */
    define('ERR_PDF_CREATOR_INIT_FAILED', 23000);
    define('ERR_CREATE_REPORT_ROOT_PATH_FAILED', 23001);
    define('ERR_CREATE_REPORT_ROOT_PATH_EXCEPTION', 23002);
    define('ERR_REPORT_ROOT_PATH_IS_NOT_DIRECTORY', 23003);

    define('ERR_JSON_DECODE_AD_SUMMARY_DATA_FAILED', 33000);
    define('ERR_NOT_FOUND_FIELD_DATA', 33001);
    define('ERR_APP_EXIST', 33002);
    define('ERR_APP_AD_STORE_PATH_NOT_EXIST', 33003);
    define('ERR_APP_AD_SUMMARY_DATA_FILE_NOT_EXIST', 33004);
    define('ERR_READ_APP_AD_SUMMARY_DATA_FILE_FAILED', 33005);
    define('ERR_NOT_CONFIG_APP_AD_STORE_PATH', 33006);
    define('ERR_PARAMETER_APP_PACKAGE_NAME_NOT_EXIST', 33007);