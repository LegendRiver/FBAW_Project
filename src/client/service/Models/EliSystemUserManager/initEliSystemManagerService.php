<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 9/22/16
 * Time: 9:21 AM
 */

date_default_timezone_set("Asia/Shanghai");

define('__ROOT__', dirname(dirname(__FILE__)));
define('__LIB_PATH__', __ROOT__."/lib");
define('__ELI_ACCOUNT_MANAGER__', __ROOT__."/EliAccountManager");
define('__ELI_SYSTEM_USER__MANAGER__', __ROOT__."/EliSystemUserManager");

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

if(!class_exists('CChunk'))
{
    require_once(__LIB_PATH__."/FileService/CChunk.php");
}

if(!class_exists('CFile'))
{
    require_once(__LIB_PATH__."/FileService/CFile.php");
}

if(!class_exists('CEliIndustry'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliIndustry.php");
}

if(!class_exists('CEliAccount'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliAccount.php");
}

if(!class_exists('CCEliPublisherOwner'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliPublisherOwner.php");
}

if(!class_exists('CEliPublisher'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliPublisher.php");
}

if(!class_exists('CEliRechargeRecord'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliRechargeRecord.php");
}

if(!class_exists('CEliAudience'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliAudience.php");
}

if(!class_exists('CEliPublisherCampaign'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliCampaignConfig.php");
}

if(!class_exists('CEliCampaignPublisherSpentRecord'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliCampaignConfigSpentRecord.php");
}

if(!class_exists('CELiCampaign'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CELiCampaign.php");
}


if(!class_exists('CEliLoginRecord'))
{
    require_once(__ELI_SYSTEM_USER__MANAGER__."/CEliLoginRecord.php");
}

if(!class_exists('CEliAccountManager'))
{
    require_once(__ELI_ACCOUNT_MANAGER__."/CEliAccountManager.php");
}

if(!class_exists('CEliLoginRecord'))
{
    require_once(__ELI_SYSTEM_USER__MANAGER__."/CEliLoginRecord.php");
}

if(!class_exists('CEliSystemUser'))
{
    require_once(__ELI_SYSTEM_USER__MANAGER__."/CEliSystemUser.php");
}

if(!class_exists('CEliSystemManager'))
{
    require_once(__ELI_SYSTEM_USER__MANAGER__."/CEliSystemManager.php");
}

CPublic::InitSystemDefLogLevels();

$GLOBALS['gSystemConfigFile'] = CPublic::getSystemConfigFile(__ROOT__.'/../');
$GLOBALS['gSystemConfig'] = new CConfig($GLOBALS['gSystemConfigFile']);
$GLOBALS['gLog'] = new CLog($GLOBALS['gSystemConfig']);
$GLOBALS['gDbMySqliInterface'] = new CDbMySqliInterface($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);
$GLOBALS['gServiceFactory'] = new CServiceFactory($GLOBALS['gSystemConfig'], $GLOBALS['gLog']);


registerEliSystemManagerService();

/**
 * init eli system manager service
 */
function registerEliSystemManagerService()
{
    $config = $GLOBALS['gSystemConfig'];
    $log = $GLOBALS['gLog'];
    $dbInterface = $GLOBALS['gDbMySqliInterface'];

    $eliSystemManagerService = new CService(ELI_SYSTEM_MANAGER_SERVICE, $config, $log);
    if(!$GLOBALS['gServiceFactory']->registerService($eliSystemManagerService->getServiceName(), $eliSystemManagerService))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register service <%s> failed.", $eliSystemManagerService->getServiceName()));
        return;
    }

    $eliSystemManager = new CEliSystemManager($config, $log, $dbInterface);
    if(!$eliSystemManagerService->registerClassInstance($eliSystemManager->getClassName(), $eliSystemManager))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register class <%s> failed.", $eliSystemManager->getClassName()));
        return;
    }

    $eliAccountResourceUploadService = new CService(ELI_ACCOUNT_RESOURCE_UPLOAD_SERVICE, $config, $log);
    if(!$GLOBALS['gServiceFactory']->registerService($eliAccountResourceUploadService->getServiceName(), $eliAccountResourceUploadService))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register service <%s> failed.", $eliAccountResourceUploadService->getServiceName()));
        return;
    }

    $eliFileUpload = new CFile($config, $log, $dbInterface);
    if(!$eliAccountResourceUploadService->registerClassInstance($eliFileUpload->getClassName(), $eliFileUpload))
    {
        $log->writeLog(Error, __FILE__,__FUNCTION__, __LINE__, sprintf("Register class <%s> failed.", $eliFileUpload->getClassName()));
        return;
    }
}