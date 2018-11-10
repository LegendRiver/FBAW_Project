<?php


class CountryLocaleHelper
{
    private static $instance = null;

    private $countryCodeMap;

    private $localeMap;

    private function __construct()
    {
        $result = $this->initData();
        if(false === $result)
        {
            $this->countryCodeMap = array();
            $this->localeMap = array();
            ServerLogger::instance()->writeLog(Error, 'Failed to init Country and locale data.');
        }
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function getCountryCode($countryName)
    {
        if(array_key_exists($countryName, $this->countryCodeMap))
        {
            return $this->countryCodeMap[$countryName];
        }
        else
        {
            return false;
        }
    }

    public function getLocaleCode($localeName)
    {
        if(array_key_exists($localeName, $this->localeMap))
        {
            return $this->localeMap[$localeName];
        }
        else
        {
            return false;
        }
    }

    public function isCountryValid($countryName)
    {
        return array_key_exists($countryName, $this->countryCodeMap);
    }

    public function isLocaleValid($localeName)
    {
        return array_key_exists($localeName, $this->localeMap);
    }

    private function initData()
    {
        $configDir = EL_SERVER_PATH . BasicConstants::DIRECTORY_CONF . DIRECTORY_SEPARATOR;
        $countryFile = $configDir . 'countryCodes_FB.json';
        $localeFile = $configDir . 'locales_FB.json';

        $countryResult = FileHelper::readJsonFile($countryFile);
        if(false === $countryResult)
        {
            return false;
        }
        $this->countryCodeMap = $countryResult;

        $localeResult = FileHelper::readJsonFile($localeFile);
        if(false === $localeResult)
        {
            return false;
        }
        $this->localeMap = $localeResult;

        return true;
    }
}