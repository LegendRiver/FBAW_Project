<?php

use FacebookAds\Object\AdImage;
use FacebookAds\Object\Fields\AdImageFields;
use FacebookAds\Http\RequestInterface;
/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2018/1/30
 * Time: 下午7:20
 */
class EliImage extends AdImage
{
    public function createByBytes(array $params = array())
    {
        if ($this->data[static::FIELD_ID]) {
            throw new \Exception("Object has already an ID");
        }

        $data = $this->exportData();
        $params = array_merge($data, $params);

        $request = $this->getApi()->prepareRequest(
            '/'.$this->assureParentId().'/'.$this->getEndpoint(),
            RequestInterface::METHOD_POST,
            $params
        );

        $response = $this->getApi()->executeRequest($request);

        $this->clearHistory();
        $content = $response->getContent();
        $data = $content['images'][basename($this->{AdImageFields::FILENAME})];

        $this->data[AdImageFields::HASH] = $data[AdImageFields::HASH];

        $this->data[static::FIELD_ID]
            = substr($this->getParentId(), 4).':'.$this->data[AdImageFields::HASH];

        return $this;
    }
}