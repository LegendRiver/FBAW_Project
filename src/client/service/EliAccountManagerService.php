<?php
/**
 * Created by IntelliJ IDEA.
 * User: zengt
 * Date: 2016-09-11
 * Time: 12:11
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json;charset=utf-8");
require_once("Models/EliAccountManager/initEliAccountManagerService.php");

echo callService($_REQUEST);

/**
 * @param $requestParameters
 * @return string
 */
function callService($requestParameters)
{
    $log = $GLOBALS['gLog'];
    $encrypt = $GLOBALS['gEncrypt'];
    $result = new CResult();
    if(ENCRYPT_DEBUG)
    {
        if(!array_key_exists(PARAMETER_ELI_DATA, $requestParameters))
        {
            $result->setErrorCode(ERR_NOT_FOUND_PARAMETER);
            $result->setMessage(sprintf("Not found parameter<%s>.", PARAMETER_ELI_DATA));
            $result->setData("");
            $log->writeLog(Error,__FILE__,__FUNCTION__,__LINE__, $result->getMessage());
            return json_encode($result->getValue());
        }

        $encryptData = $requestParameters[PARAMETER_ELI_DATA];
        $data = base64_decode($encryptData);
        if(!$data)
        {
            $result->setErrorCode(ERR_DATA_BASE64_DECODE_FAILED);
            $result->setMessage("Data base64 decode failed.");
            return json_encode($result->getValue());
        }

        $dataObject = json_decode($data);
        if(!$dataObject)
        {
            $result->setErrorCode(ERR_DATA_JSON_DECODE_FAILED);
            $result->setMessage("Data json decode failed.");
            return json_encode($result->getValue());
        }

        $encryptData = $dataObject->{PARAMETER_ELI_DATA_BASE64};
        $keyData = $dataObject->{PARAMETER_ELI_KEY_BASE64};

        $decryptData = $encrypt->mcryptDecrypt($encryptData, $keyData);

        if((!$decryptData) || (strlen($decryptData) == 0))
        {
            $result->setErrorCode(ERR_DATA_DECRYPT_FAILED);
            $result->setMessage("Data decrypt failed.");
            return json_encode($result->getValue());
        }

        $dataObject = json_decode($decryptData);
        if(!$dataObject)
        {
            $result->setErrorCode(ERR_DATA_JSON_DECODE_FAILED);
            $result->setMessage("Data decrypt failed.");
            return json_encode($result->getValue());
        }

        foreach ($dataObject as $key=>$value)
        {
            $requestParameters[$key] = urldecode($value);
        }
    }

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