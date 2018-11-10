<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 11/28/16
 * Time: 4:16 PM
 */


date_default_timezone_set("Asia/Shanghai");

define('__ROOT__', dirname(dirname(__FILE__)));
define('__ELI_REPORT__', __ROOT__."/Report");
define('__LIB_PATH__', __ROOT__."/lib");
define('__ELI_SYSTEM_USER__MANAGER__', __ROOT__."/EliSystemUserManager");

define("_SYSTEM_TTFONTS", __LIB_PATH__."/fpdf/font/unifont/");

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

if(!class_exists('CBaseObject'))
{
    require_once(__LIB_PATH__."/BaseObject/CBaseObject.php");
}

if(!class_exists('CEliLoginRecord'))
{
    require_once(__ELI_SYSTEM_USER__MANAGER__."/CEliLoginRecord.php");
}

if(!class_exists('FPDF'))
{
    require_once(__LIB_PATH__."/fpdf/fpdf.php");
}

if(!class_exists('tFPDF'))
{
    require_once(__LIB_PATH__."/fpdf/tFPDF.php");
}


if(!class_exists('CColumn'))
{
    require_once(__ELI_REPORT__."/CColumn.php");
}

if(!class_exists('CTable'))
{
    require_once(__ELI_REPORT__."/CTable.php");
}

if(!class_exists('CEliReport'))
{
    require_once(__ELI_REPORT__."/CEliReport.php");
}

CPublic::InitSystemDefLogLevels();


$GLOBALS['gSystemConfigFile'] = CPublic::getSystemConfigFile(__ROOT__.'/../');
$GLOBALS['gSystemConfig'] = new CConfig($GLOBALS['gSystemConfigFile']);
$GLOBALS['gLog'] = new CLog($GLOBALS['gSystemConfig']);
$GLOBALS['gDbMySqliInterface'] = new CDbMySqliInterface($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);
$GLOBALS['gServiceFactory'] = new CServiceFactory($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);

registerEliReportService();

/**
 * init eli system manager service
 */
function registerEliReportService()
{
    $config = $GLOBALS['gSystemConfig'];
    $log = $GLOBALS['gLog'];
    $dbInterface = $GLOBALS['gDbMySqliInterface'];

    $eliVReportService = new CService(ELI_REPORT_SERVICE, $config, $log);
    if(!$GLOBALS['gServiceFactory']->registerService($eliVReportService->getServiceName(), $eliVReportService))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register service <%s> failed.", $eliVReportService->getServiceName()));
        return;
    }

    $reporter = new CEliReport($config, $log, $dbInterface);
    if(!$eliVReportService->registerClassInstance($reporter->getClassName(), $reporter))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register class <%s> failed.", $reporter->getClassName()));
        return;
    }
}