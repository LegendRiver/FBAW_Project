<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 12/12/16
 * Time: 12:34 PM
 */

ini_alter('date.timezone','Asia/Shanghai');

define('__ROOT__', dirname(dirname(__FILE__)));
define('__ELI_ACCOUNT_MANAGER__', __ROOT__."/EliAccountManager");
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

if(!class_exists('CEliCampaignConfigSpentRecord'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliCampaignConfigSpentRecord.php");
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

if(!class_exists('CWeekReport'))
{
    require_once(__ELI_REPORT__."/CWeekReport.php");
}


if(!class_exists('CWeekReportThread'))
{
    require_once(__ELI_REPORT__."/CWeekReportThread.php");
}

CPublic::InitSystemDefLogLevels();

$GLOBALS['gSystemConfigFile'] = CPublic::getSystemConfigFile(__ROOT__.'/../');
$GLOBALS['gSystemConfig'] = new CConfig($GLOBALS['gSystemConfigFile']);
$GLOBALS['gLog'] = new CLog($GLOBALS['gSystemConfig']);
