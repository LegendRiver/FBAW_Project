<?php


class ServiceCallUtil
{
    public static function callService($requestParameters)
    {
        try
        {
            $result = new CResult();
            $checkResult = self::checkBaseParameters($requestParameters, $result);
            if (!$checkResult)
            {
                return json_encode($result->getValue());
            }

            $requestParameters[PARAMETER_CLIENT_IP] = CPublic::getClientIP();
            $serviceName = $requestParameters[SERVICE_NAME];
            $classInstanceName = $requestParameters[CLASS_INSTANCE];
            $functionName = $requestParameters[FUNCTION_NAME];
            ServerLogger::instance()->writeLog(Warning, sprintf("Request parameters <%s>", implode("#", array_values($requestParameters))));

            $result = ServiceManager::instance()->callService($serviceName, $classInstanceName, $functionName, $requestParameters);
            return json_encode($result);
        } catch (Exception $e)
        {
            return json_encode(array("error" => "catch exception"));
        }
    }

    private static function checkBaseParameters($parameters, &$result)
    {
        $keyNames = array(SERVICE_NAME, CLASS_INSTANCE, FUNCTION_NAME);
        foreach($keyNames as $keyName)
        {
            if(!array_key_exists($keyName, $parameters))
            {
                $result->setErrorCode(ERR_NOT_FOUND_PARAMETER);
                $result->setMessage(sprintf("Not found parameter<%s>.", $keyName));
                $result->setData("");
                ServerLogger::instance()->writeLog(Error, $result->getMessage());
                return false;
            }
        }

        return true;
    }
}