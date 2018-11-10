<?php

use FacebookAds\Api;
use FacebookAds\ApiRequest;
use FacebookAds\TypeChecker;
use FacebookAds\Http\RequestInterface;
use FacebookAds\Object\AbstractCrudObject;

class APIRequestUtil
{
    public static function sendRequest($point, $fields, $params, $nodeId='', $returnPrototype=null,
                                       $methodType=RequestInterface::METHOD_GET, $apiType='EDGE')
    {
        //此方法还没有调试通过，有需要时再调试，主要是response的处理没有调试
        try
        {
            $api = Api::instance();
            if (empty($nodeId)) {
                $endpoint = $point;
            } else {
                $endpoint = '/' . $point;
            }


            $paramTypes = array();
            $enums = array();
            $request = new ApiRequest($api, $nodeId, $methodType, $endpoint, $returnPrototype, $apiType, array(),
                new TypeChecker($paramTypes, $enums));
            $request->addParams($params);
            $request->addFields($fields);
            return $request->execute();
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to send request: ' . $point);
            return false;
        }
    }

    public static function getReachFrequencyEstimate($fields, $params)
    {
        //调用此接口需要将app 添加到FB白名单，具体怎么添加需要查一下
        $endpoint = 'reachfrequencyestimates';
        $response = self::sendRequest($endpoint, $fields, $params);
        print_r($response);
    }

    public static function getBMUserList($bmId)
    {
        //就是将Business createUserPermission 中方法改为 METHOD_GET
        $endpoint = 'userpermissions';
        $fields = array(
            'business_persona'
        );
        $prototype = new AbstractCrudObject();
        $response = self::sendRequest($endpoint, $fields, array(), $bmId, $prototype);
        return $response;
    }

}