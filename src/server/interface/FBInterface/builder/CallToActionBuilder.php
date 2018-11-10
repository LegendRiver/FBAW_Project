<?php

use FacebookAds\Object\Fields\AdCreativeLinkDataCallToActionFields;
use FacebookAds\Object\Fields\AdCreativeLinkDataCallToActionValueFields;

class CallToActionBuilder implements IFieldBuilder
{
    private $type;

    private $linkUrl;

    //v2.9 deprecated
    private $linkTitle;

    private $valueArray;

    private $outputArray;

    public function __construct()
    {
        $this->valueArray = array();
        $this->outputArray = array();
    }

    public function getOutputField()
    {
        $this->valueArray = array();
        $this->outputArray = array();

        if(isset($this->linkUrl))
        {
            $this->valueArray[AdCreativeLinkDataCallToActionValueFields::LINK] = $this->linkUrl;
        }
        else
        {
            ServerLogger::instance()->writeLog(Info, 'The linkurl of callToAction is null');
        }

        if(isset($this->type))
        {
            $this->outputArray[AdCreativeLinkDataCallToActionFields::TYPE] = $this->type;
        }
        else
        {
            ServerLogger::instance()->writeLog(Info, 'The type of callToAction is null');
        }

        if(!empty($this->valueArray))
        {
            $this->outputArray[AdCreativeLinkDataCallToActionFields::VALUE] = $this->valueArray;
        }

        return $this->outputArray;
    }



    /**
     * @param mixed $linkTitle
     */
    public function setLinkTitle($linkTitle)
    {
        $this->linkTitle = $linkTitle;
    }

    /**
     * @param mixed $linkUrl
     */
    public function setLinkUrl($linkUrl)
    {
        $this->linkUrl = $linkUrl;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

}