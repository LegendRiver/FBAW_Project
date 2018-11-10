<?php

use FacebookAds\Object\Fields\AdPromotedObjectFields;

class AppInstallObjectBuilder implements IFieldBuilder
{
    private $applicationId;

    private $applicationStoreUrl;

    private $outputArray = array();

    public function __construct()
    {
    }

    public function getOutputField()
    {
        $this->outputArray = array();
        if(isset($this->applicationId) && isset($this->applicationStoreUrl))
        {
            $this->outputArray[AdPromotedObjectFields::APPLICATION_ID] = $this->applicationId;
            $this->outputArray[AdPromotedObjectFields::OBJECT_STORE_URL] = $this->applicationStoreUrl;
        }
        else
        {
            ServerLogger::instance()->writeLog(Error, 'Failed to builder application Object.');
        }

        return $this->outputArray;
    }

    public function setApplicationId($applicationId)
    {
        $this->applicationId = $applicationId;
    }

    public function setApplicationStoreUrl($applicationStoreUrl)
    {
        $this->applicationStoreUrl = $applicationStoreUrl;
    }


}