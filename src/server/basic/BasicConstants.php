<?php


class BasicConstants
{
    const DIRECTORY_SERVER_INTERFACE = 'interface';
    const DIRECTORY_BASIC = 'basic';
    const DIRECTORY_SERVICE = 'service';
    const DIRECTORY_CONSTANTS = 'constants';
    const DIRECTORY_DB = 'db';
    const DIRECTORY_CONF = 'conf';
    const DIRECTORY_ADMANAGER = 'adManager';

    const FILE_SEVERLOG_CONF = 'server.conf';
    const FILE_LOGGER_CONF = 'log_conf.json';
    const DIRECTORY_SERVER_FBINTERFACE = 'FBInterface';
    const DIRECTORY_SERVER_AWINTERFACE = 'AdwordsInterface';
    const DIRECTORY_PYTHON_SPIDER = 'EliSpider';
    const DIRECTORY_PYTHON_ANALYSIS = 'EliPythonMoudle';

    const DIRECTORY_LIB = 'lib';
    const DIRECTORY_LIB_CONFIG = 'Config';
    const DIRECTORY_LIB_LOG = 'Log';
    const DIRECTORY_LIB_COMMON = 'Common';
    const DIRECTORY_LIB_BASEOBJECT = 'BaseObject';
    const DIRECTORY_LIB_DBINTERFACE = 'DbInterface';
    const DIRECTORY_LIB_SERVICE = 'ServiceFactory';
    const DIRECTORY_LIB_PHP_EXCEL = 'PHPExcel';
    const DIRECTORY_LIB_PHP_MAIL = 'phpmailer';

    const CONFIG_STRATEGY_OUTPUT_DIR = 'StrategyOutputDir';
    const CONFIG_STRATEGY_OUTPUT_BACKUP_DIR = 'StrategyBackupDir';
    const CONFIG_STRATEGY_OUTPUT_RECOVERY_DIR = 'StrategyRecoveryDir';
    const CONFIG_STRATEGY_INPUT_PARAM_DIR = 'StrategyInputDir';
    const CONFIG_DOWNLOAD_IMAGE_DIR = 'ImageDownloadDir';
    const CONFIG_LOCAL_IMAGE_DIR = 'LocalImageDir';
    const CONFIG_AD_REPORT_LOG_DIR = 'AdReportLogDir';
    const CONFIG_PROFIT_CONFIG_FILE = 'ProfitConfigFile';

    const CONFIG_STRATEGY_OUTPUT_DIR_DEFAULT = 'strategyOutput';
    const CONFIG_STRATEGY_INPUT_PARAM_DIR_DEFAULT = 'strategyInput';
    const CONFIG_DOWNLOAD_IMAGE_DIR_DEFAULT = 'image';
    const CONFIG_LOCAL_IMAGE_DIR_DEFAULT = 'localImage';
    const CONFIG_PROFIT_CONFIG_FILE_DEFAULT = 'profitConfig.json';

    const LOGGER_REPORT_PREFIX = '＃REPORT＃ ';
    const LOGGER_STRATEGY_PREFIX = '＃STRATEGY＃ ';
    const LOGGER_ADWORDS_PREFIX = '＃ADWORDS＃ ';

    const DATE_DEFAULT_FORMAT = 'Y-m-d H:i:s';

    const MAIL_SIGNATURE_TYPE_IMAGE = 'image';
    const MAIL_SIGNATURE_TYPE_TEXT = 'text';

    const LOGGER_CONF_FIELD_LIST = 'logConfig';
    const LOGGER_CONF_FIELD_MODULE = 'logModule';
    const LOGGER_CONF_FIELD_PATH = 'logPath';
    const LOGGER_CONF_FIELD_LEVEL = 'logLevel';

    const LOGGER_TYPE_VALUE_DEFAULT = 'default';
    const LOGGER_TYPE_VALUE_ORION = 'orionService';
}