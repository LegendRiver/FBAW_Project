<?php


class AWConstantDataManager extends AbstractAWManager
{
    private $languageMap;

    public function __construct()
    {
        $serverPath = PathManager::instance()->getServerPath();
        $jsonFile = $serverPath . 'conf' . DIRECTORY_SEPARATOR . 'locales_AW.json';
        $this->languageMap = FileHelper::readJsonFile($jsonFile);
    }

    public function getAllLocales()
    {
        $languages = self::getService()->getLanguageCriterion();
        $nameIdMap = array();
        foreach ($languages as $language)
        {
            $name = $language->getName();
            $id = $language->getId();
            $nameIdMap[$name] = $id;
        }

        return $nameIdMap;
    }

    public function getAllCarrier()
    {
        $carriers = self::getService()->getCarrierCriterion();
        foreach ($carriers as $carrier)
        {
            printf(
                "Carrier with name '%s', country code '%s', and ID %d was found.\n",
                $carrier->getName(),
                $carrier->getCountryCode(),
                $carrier->getId()
            );
        }
    }

    public function getLanguageIdByName($name)
    {
        if(array_key_exists($name, $this->languageMap))
        {
            return $this->languageMap[$name];
        }
        else
        {
            ServerLogger::instance()->writeAdwordsLog(Warning, 'Failed to get language id by name: ' . $name);
            return false;
        }
    }

    protected function getService($customerAccountId = null)
    {
        return AWServiceManager::getInstance()->getConstantDataService();
    }

    protected function buildEntity($entry)
    {
        return $entry;
    }
}