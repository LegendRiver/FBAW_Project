<?php


class ServiceObject
{
    public function callFunction($functionName, $parameters)
    {
        $result = new CResult();
        if (method_exists($this, $functionName))
        {
            return call_user_func_array(array($this, $functionName), array($parameters));
        }

        $result->setErrorCode(ERR_NOT_FOUND_FUNCTION);
        $result->setMessage(sprintf("Not found function<%s>.", $functionName));
        $result->setData(array());
        return $result;
    }
}