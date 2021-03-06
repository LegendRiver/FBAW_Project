using System;
using System.Collections.Generic;
using System.Linq;

namespace AppsflyerSpiderServer
{
    public enum E_ERROR_CODE
    {
        OK = 0,
        ERROR,
        ERROR_FILE_NOT_EXIST,
        ERROR_FILE_EXIST,
        ERROR_READ_FILE_FAILED,
        ERROR_QUERY_DEVICE_FROM_SERVICE_FAILED,
        ERROR_JSON_PARSE_FAILED,
        ERROR_SERVER_RESULT_HAS_SOME_ERROR,
        ERROR_NO_DEVICE_DATA,
        ERROR_CONNECT_DB_FAILED,
        ERROR_CONFIG_ITEM_USER_LOG_PATH_NOT_EXIST,
        CONFIG_ITEM_IS_WRITE_LOG_TO_SCREEN_NOT_EXIST,
        CONFIG_ITEM_WRITR_LOG_LEVEL_NOT_EXIST,
        CONFIG_ITEM_DB_MYSQL_CONNECT_STR_NOT_EXIST,
        CONFIG_ITEM_PINEN_BEIDOU_SERVICE_URL_NOT_EXIST,
        CONFIG_ITEM_REQUEST_CYCLE_NOT_EXIST
    }
}
