<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 12:15
 */


    date_default_timezone_set("Asia/Shanghai");

    define('__ROOT__', dirname(dirname(__FILE__)));
    define('__LIB_PATH__', __ROOT__."/lib");
    define('__AD_SEE_DATA_SPIDER_PATH__', __ROOT__."/AdSeeDataSpider");

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

    if(!class_exists('CAppAdSummary'))
    {
        require_once(__AD_SEE_DATA_SPIDER_PATH__."/CAppAdSummary.php");
    }

CPublic::InitSystemDefLogLevels();

$GLOBALS['gSystemConfigFile'] = CPublic::getSystemConfigFile(__ROOT__.'/../');
$GLOBALS['gSystemConfig'] = new CConfig($GLOBALS['gSystemConfigFile']);
$GLOBALS['gLog'] = new CLog($GLOBALS['gSystemConfig']);
$GLOBALS['gDbMySqliInterface'] = null;
$GLOBALS['gServiceFactory'] = new CServiceFactory($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);

registerAdSeeDataSpiderService();

/**
 * init poi search service
 */
function registerAdSeeDataSpiderService()
{
    $config = $GLOBALS['gSystemConfig'];
    $log = $GLOBALS['gLog'];
    $dbInterface = $GLOBALS['gDbMySqliInterface'];

    $appAdService = new CService(APP_AD_SERVICE_NAME, $config, $log);
    if(!$GLOBALS['gServiceFactory']->registerService($appAdService->getServiceName(), $appAdService))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register service <%s> failed.", $appAdService->getServiceName()));
        return;
    }

    $appAdSummary = new CAppAdSummary($config, $log, $dbInterface);
    if(!$appAdService->registerClassInstance($appAdSummary->getClassName(), $appAdSummary))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register class <%s> failed.", $appAdSummary->getClassName()));
        return;
    }
}