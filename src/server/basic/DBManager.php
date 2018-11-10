<?php


class DBManager
{
    private static $instance = null;

    private $dbInterface;

    private $logger;

    private $config;


    private function __construct()
    {
        $this->config = ConfigManager::instance()->getServerConfig();
        $this->logger = ServerLogger::instance()->getLogger();

        $this->dbInterface = new CDbMySqliInterface($this->config, $this->logger);
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
           static::$instance = new static();
        }

        return static::$instance;
    }

    public function getDbInterface()
    {
        return $this->dbInterface;
    }

    public function getConfig()
    {
        return $this->config;
    }

    public function getLogger()
    {
        return $this->logger;
    }


}