<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 12:11
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json;charset=utf-8");
require_once("Models/AdSeeDataSpider/CONST_APP_AD.php");
require_once("Models/AdSeeDataSpider/initAdSeeDataSpiderService.php");

echo callService($_REQUEST);

/**
 * @param $requestParameters
 * @return string
 */
function callService($requestParameters)
{
    $log = $GLOBALS['gLog'];
    $result = new CResult();

    $checkResult = checkBaseParameters($requestParameters, $log, $result);
    if(!$checkResult)
    {
        return json_encode($result->getValue());
    }

    $requestParameters[PARAMETER_CLIENT_IP] = CPublic::getClientIP();
    $serviceName = $requestParameters[SERVICE_NAME];
    $classInstanceName = $requestParameters[CLASS_INSTANCE];
    $functionName = $requestParameters[FUNCTION_NAME];
    $log->writeLog(Debug, __FILE__,__FUNCTION__,__LINE__, sprintf("Request parameters <%s>", implode("|", array_values($requestParameters))));
    $result = $GLOBALS['gServiceFactory']->callService($serviceName, $classInstanceName, $functionName, $requestParameters);
    return json_encode($result->getValue());
}

function checkBaseParameters($parameters, $log, &$result)
{
    $keyNames = array(SERVICE_NAME, CLASS_INSTANCE, FUNCTION_NAME);
    foreach($keyNames as $keyName)
    {
        if(!array_key_exists($keyName, $parameters))
        {
            $result->setErrorCode(ERR_NOT_FOUND_PARAMETER);
            $result->setMessage(sprintf("Not found parameter<%s>.", $keyName));
            $result->setData("");
            $log->writeLog(Error,__FILE__,__FUNCTION__,__LINE__, $result->getMessage());
            return false;
        }
    }

    return true;
}