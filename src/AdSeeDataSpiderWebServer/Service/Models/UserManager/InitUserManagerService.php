<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 1/1/16
 * Time: 6:08 PM
 */

date_default_timezone_set("Asia/Shanghai");

define('__ROOT__', dirname(dirname(__FILE__)));
define('__LIB_PATH__', __ROOT__."/lib");
define('__USER_MANAGER_PATH__', __ROOT__."/UserManager");

require_once(__LIB_PATH__."/Common/ERROR_CODE_DEFINE.php");
require_once(__LIB_PATH__."/Common/SYSTEM_CONST_DEFINE.php");
require_once(__USER_MANAGER_PATH__."/CONSET_USER_MANAGER.php");


if(!class_exists('CHttpRequest'))
{
    require_once(__LIB_PATH__."/Common/CHttpRequest.php");
}

if(!class_exists('CPublic'))
{
    require_once(__LIB_PATH__."/Common/CPublic.php");
}

/* config classes */
if(!class_exists('CConfigItem'))
{
    require_once(__LIB_PATH__."/Config/CConfigItem.php");
}

if(!class_exists('CConfig'))
{
    require_once(__LIB_PATH__."/Config/CConfig.php");
}


if(!class_exists('CLog'))
{
    require_once(__LIB_PATH__."/Log/CLog.php");
}

/* service classes */

if(!class_exists('CResult'))
{
    require_once(__LIB_PATH__."/ServiceFactory/CResult.php");
}

if(!class_exists('CService'))
{
    require_once(__LIB_PATH__."/ServiceFactory/CService.php");
}

if(!class_exists('CServiceFactory'))
{
    require_once(__LIB_PATH__."/ServiceFactory/CServiceFactory.php");
}

/* Db interface */

require_once(__LIB_PATH__."/DbInterface/DB_MYSQL_FIELD_TYPE_DEF.php");

if(!class_exists('CDbParameter'))
{
    require_once(__LIB_PATH__."/DbInterface/CDbParameter.php");
}

if(!class_exists('CDbMySqliInterface'))
{
    require_once(__LIB_PATH__."/DbInterface/CDbMySqliInterface.php");
}

if(!class_exists('CBaseObject'))
{
    require_once(__LIB_PATH__."/BaseObject/CBaseObject.php");
}

if(!class_exists('CLoginRecord'))
{
    require_once(__USER_MANAGER_PATH__."/CLoginRecord.php");
}

if(!class_exists('CUser'))
{
    require_once(__USER_MANAGER_PATH__."/CUser.php");
}

if(!class_exists('CUserManager'))
{
    require_once(__USER_MANAGER_PATH__."/CUserManager.php");
}


CPublic::InitSystemDefLogLevels();

$GLOBALS['gSystemConfigFile'] = CPublic::getSystemConfigFile(__ROOT__.'/../');
$GLOBALS['gSystemConfig'] = new CConfig($GLOBALS['gSystemConfigFile']);
$GLOBALS['gLog'] = new CLog($GLOBALS['gSystemConfig']);
$GLOBALS['gDbMySqliInterface'] = new CDbMySqliInterface($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);
$GLOBALS['gServiceFactory'] = new CServiceFactory($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);

registerUserManagerService();

/**
 * init poi search service
 */
function registerUserManagerService()
{
    $config = $GLOBALS['gSystemConfig'];
    $log = $GLOBALS['gLog'];
    $dbInterface = $GLOBALS['gDbMySqliInterface'];

    $userManagerService = new CService(USER_MANAGER_SERVICE, $config, $log);
    if(!$GLOBALS['gServiceFactory']->registerService($userManagerService->getServiceName(), $userManagerService))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register service <%s> failed.", $userManagerService->getServiceName()));
        return;
    }

    $userManager = new CUserManager($config, $log, $dbInterface);
    if(!$userManagerService->registerClassInstance($userManager->getClassName(), $userManager))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register class <%s> failed.", $userManager->getClassName()));
        return;
    }
}