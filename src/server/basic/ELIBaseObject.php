<?php


abstract class ELIBaseObject extends CBaseObject
{
    public function __construct()
    {
        $dbInterface = DBManager::instance()->getDbInterface();
        $config = DBManager::instance()->getConfig();
        $logger = DBManager::instance()->getLogger();
        parent::__construct($config, $logger, $dbInterface);
    }

    protected function initResultFields()
    {
        // TODO: Implement initResultFields() method.
    }

    protected function initTableFields()
    {
        // TODO: Implement initTableFields() method.
    }
}