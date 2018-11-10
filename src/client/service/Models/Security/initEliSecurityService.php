<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-09-28
 * Time: 21:14
 */


date_default_timezone_set("Asia/Shanghai");

define('__ROOT__', dirname(dirname(__FILE__)));
define('__LIB_PATH__', __ROOT__."/lib");
define('__ELI_SECURITY__', __ROOT__."/Security");

require (__LIB_PATH__.'/aws-sdk-php/vendor/autoload.php');

require_once(__LIB_PATH__."/Common/ERROR_CODE_DEFINE.php");
require_once(__LIB_PATH__."/Common/SYSTEM_CONST_DEFINE.php");

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

if(!class_exists('CEliAwsSNSClient'))
{
    require_once(__ELI_SECURITY__."/CEliAwsSNSClient.php");
}

if(!class_exists('CEliVerificationCode'))
{
    require_once(__ELI_SECURITY__."/CEliVerificationCode.php");
}

if(!class_exists('CSecurityManager'))
{
    require_once(__ELI_SECURITY__."/CSecurityManager.php");
}

CPublic::InitSystemDefLogLevels();


$GLOBALS['gSystemConfigFile'] = CPublic::getSystemConfigFile(__ROOT__.'/../');
$GLOBALS['gSystemConfig'] = new CConfig($GLOBALS['gSystemConfigFile']);
$GLOBALS['gLog'] = new CLog($GLOBALS['gSystemConfig']);
$GLOBALS['gDbMySqliInterface'] = new CDbMySqliInterface($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);
$GLOBALS['gServiceFactory'] = new CServiceFactory($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);

registerEliVerificationService();

/**
 * init eli system manager service
 */
function registerEliVerificationService()
{
    $config = $GLOBALS['gSystemConfig'];
    $log = $GLOBALS['gLog'];
    $dbInterface = $GLOBALS['gDbMySqliInterface'];

    $eliVerificationCodeService = new CService(ELI_SECURITY_SERVICE, $config, $log);
    if(!$GLOBALS['gServiceFactory']->registerService($eliVerificationCodeService->getServiceName(), $eliVerificationCodeService))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register service <%s> failed.", $eliVerificationCodeService->getServiceName()));
        return;
    }

    $eliSecurityManager = new CSecurityManager($config, $log, $dbInterface);
    if(!$eliVerificationCodeService->registerClassInstance($eliSecurityManager->getClassName(), $eliSecurityManager))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register class <%s> failed.", $eliSecurityManager->getClassName()));
        return;
    }
}