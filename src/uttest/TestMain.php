<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengtao
 * Date: 2016-08-12
 * Time: 10:44
 */
date_default_timezone_set("Asia/Shanghai");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json;charset=utf-8");

define('__ROOT__', dirname(dirname(__FILE__)));
require_once(__ROOT__."/lib/Common/SYSTEM_CONST_DEFINE.php");
require_once(__ROOT__."/lib/Common/ERROR_CODE_DEFINE.php");
require_once(__ROOT__."/lib/Common/CPublic.php");
require_once(__ROOT__."/lib/Common/CHttpRequest.php");
require_once(__ROOT__."/lib/BaseObject/CBaseObject.php");
require_once(__ROOT__."/lib/Config/CConfigItem.php");
require_once(__ROOT__."/lib/Config/CConfig.php");
require_once(__ROOT__."/lib/DbInterface/CDbParameter.php");
require_once(__ROOT__."/lib/DbInterface/CDbMySqliInterface.php");
require_once(__ROOT__."/lib/DbInterface/DB_MYSQL_FIELD_TYPE_DEF.php");

require_once(__ROOT__."/lib/Log/CLog.php");


if(!class_exists('CTestTable'))
{
    require_once("CTestTable.php");
}

$configFile = sprintf("%s/%s/%s", dirname(__FILE__), "conf", SystemConfFile);

$config = new CConfig($configFile);
$log = new CLog($config);

$testTable = new CTestTable($config, $log);
$testTable->setFieldValue(CTestTable::$ID, CPublic::getGuid());
$testTable->setFieldValue(CTestTable::$NAME,"Test");
$insertRecord = 0;
$errorCode = $testTable->addRecord($insertRecord);
if($errorCode == OK)
{
    $log->writeLog(Debug,__FILE__, __FUNCTION__, __LINE__, "Add record success.");
}
else
{
    $log->writeLog(Error,__FILE__, __FUNCTION__, __LINE__, "Add record failed.");
}

$queryFacebookUrl = "https://graph.facebook.com/v2.7/search?access_token=EAAI4BG12pyIBAEc5kalTQG2t6EOb7WVP6T46cqyUYhwmldAjSG8ZAZAZCDwZBiwxV3Ufdk7FdtrzUVrPbM7asJjnbsZCCgZBIuVW4DbwZBGNCqC43NRqPC2x8J3yOUAgiNzjR949nR05ZA7wCMHJ0jKEdf4PNVs0TGN1Iqgdy2kjtgZDZD&routing_control=avoid_c2&__business_id=1048950708545246&_reqName=search%3Aaddestination&_reqSrc=AdsCFXDestinationDataLoader&account_id=1048962291877421&include_headers=false&locale=en_US&method=get&object_url=https://itunes.apple.com/us/app/memoir/id544754670?mt=8&pretty=0&scraped_image_min_height=150&scraped_image_min_width=400&suppress_http_code=1&type=addestination";
$proxy = "192.168.1.100:1080";
$result = CHttpRequest::sendPost($queryFacebookUrl, array(), false, $proxy);
var_dump($result);

