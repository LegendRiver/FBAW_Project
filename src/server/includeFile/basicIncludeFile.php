<?php

//初始化时区
date_default_timezone_set("Asia/Shanghai");

require_once(dirname(__DIR__) . DIRECTORY_SEPARATOR . 'basic/PathManager.php');
require_once(dirname(__DIR__) . DIRECTORY_SEPARATOR . 'basic/BasicConstants.php');

define('EL_FBINTERFACE_PATH', PathManager::instance()->getFbInterfacePath());
define('EL_AWINTERFACE_PATH', PathManager::instance()->getAwInterfacePath());
define('EL_LIB_PATH', PathManager::instance()->getLibPath());
define('EL_SRC_PATH', PathManager::instance()->getSrcPath());
define('EL_SERVER_PATH', PathManager::instance()->getServerPath());
define('EL_PROJECT_PATH', PathManager::instance()->getProjectPath());

require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_COMMON . DIRECTORY_SEPARATOR . 'SYSTEM_CONST_DEFINE.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_COMMON . DIRECTORY_SEPARATOR . 'ERROR_CODE_DEFINE.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_COMMON . DIRECTORY_SEPARATOR . 'CPublic.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_COMMON . DIRECTORY_SEPARATOR . 'CHttpRequest.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_CONFIG . DIRECTORY_SEPARATOR . 'CConfig.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_CONFIG . DIRECTORY_SEPARATOR . 'CConfigItem.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_LOG . DIRECTORY_SEPARATOR . 'CLog.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_BASEOBJECT . DIRECTORY_SEPARATOR . 'CBaseObject.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_DBINTERFACE . DIRECTORY_SEPARATOR . 'CDbMySqliInterface.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_DBINTERFACE . DIRECTORY_SEPARATOR . 'CDbParameter.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_DBINTERFACE . DIRECTORY_SEPARATOR . 'DB_MYSQL_FIELD_TYPE_DEF.php');

require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_PHP_EXCEL . DIRECTORY_SEPARATOR . 'PHPExcel.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_PHP_MAIL . DIRECTORY_SEPARATOR . 'PHPMailerAutoload.php');

require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_BASIC . DIRECTORY_SEPARATOR . 'ServerConfig.php');
require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_BASIC . DIRECTORY_SEPARATOR . 'ConfigManager.php');
require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_BASIC . DIRECTORY_SEPARATOR . 'BasicLog.php');
require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_BASIC . DIRECTORY_SEPARATOR . 'ServerLogger.php');

if(!class_exists('ELIBaseObject'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_BASIC . DIRECTORY_SEPARATOR . 'ELIBaseObject.php');
}

if(!class_exists('CommonHelper'))
{
    require_once(EL_SERVER_PATH . 'helper/CommonHelper.php');
}
if(!class_exists('FileHelper'))
{
    require_once(EL_SERVER_PATH . 'helper/FileHelper.php');
}
if(!class_exists('CountryLocaleHelper'))
{
    require_once(EL_SERVER_PATH . 'helper/CountryLocaleHelper.php');
}
if(!class_exists('MailerHelper'))
{
    require_once(EL_SERVER_PATH . 'helper/MailerHelper.php');
}

if(!class_exists('DownloadImageEntity'))
{
    require_once(EL_SERVER_PATH . 'common/entity/DownloadImageEntity.php');
}
if(!class_exists('AbstractConstants'))
{
    require_once(EL_SERVER_PATH . 'common/AbstractConstants.php');
}

//service
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_SERVICE . DIRECTORY_SEPARATOR . 'CService.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_SERVICE . DIRECTORY_SEPARATOR . 'CServiceFactory.php');
require_once(EL_LIB_PATH . BasicConstants::DIRECTORY_LIB_SERVICE . DIRECTORY_SEPARATOR . 'CResult.php');

if(!class_exists('ServiceManager'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_BASIC . DIRECTORY_SEPARATOR .'ServiceManager.php');
}

if(!class_exists('ServiceInitializer'))
{
    require_once(EL_SERVER_PATH . BasicConstants::DIRECTORY_SERVICE . DIRECTORY_SEPARATOR .'common/ServiceInitializer.php');
}





