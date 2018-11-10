<?php

use FacebookAds\Object\AdAccount;
use FacebookAds\Object\AbstractCrudObject;
use FacebookAds\ApiRequest;
use FacebookAds\Http\RequestInterface;
use FacebookAds\TypeChecker;

class EliAdAccount extends AdAccount
{
    public function getDeliveryEstimate(array $fields = array(), array $params = array(), $pending = false)
    {
        $this->assureId();

        $request = new ApiRequest(
            $this->api,
            $this->data['id'],
            RequestInterface::METHOD_GET,
            '/delivery_estimate',
            new AbstractCrudObject(),
            'EDGE',
            array(),
            new TypeChecker(array(), array())
        );
        $request->addParams($params);
        $request->addFields($fields);
        return $pending ? $request : $request->execute();
    }
}