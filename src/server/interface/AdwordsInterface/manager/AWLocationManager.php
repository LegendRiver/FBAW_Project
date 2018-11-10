<?php
use Google\AdsApi\AdWords\v201705\cm\Predicate;
use Google\AdsApi\AdWords\v201705\cm\PredicateOperator;

class AWLocationManager extends AbstractAWManager
{
    private $locationService;

    private $codeIDMap;

    public function __construct()
    {
       $this->locationService = AWServiceManager::getInstance()->getLocationCriterionService();

       $serverPath = PathManager::instance()->getServerPath();

       $csvFile = $serverPath . 'conf' . DIRECTORY_SEPARATOR . 'adwords_country_ID.csv';
       $countryInfo = FileHelper::readCsv($csvFile);
       $this->buildCountryMap($countryInfo);
    }

    private function buildCountryMap($countryInfo)
    {
        foreach ($countryInfo as $row)
        {
            $countryCode = $row[2];
            $criteriaID = $row[0];
            $this->codeIDMap[$countryCode] = $criteriaID;
        }
    }

    public function getCriterionIDByName($locationNames)
    {
        $predicate = new Predicate('LocationName', PredicateOperator::IN, $locationNames);

        $selector = $this->getSelector(0, self::$locationFileds, array($predicate));
        $locationCriteria = $this->locationService->get($selector);

        $criteriaList = array();
        if ($locationCriteria !== null)
        {
            foreach ($locationCriteria as $locationCriterion)
            {
                $entity = new LocationCriteriaEntity();
                $entity->setLocationName($locationCriterion->getLocation()->getLocationName());
                $entity->setDisplayType($locationCriterion->getLocation()->getDisplayType());
                $entity->setId($locationCriterion->getLocation()->getId());
                $entity->setReach($locationCriterion->getReach());
                $entity->setStatus($locationCriterion->getLocation()->getTargetingStatus());

                $criteriaList[] = $entity;
            }
        }
        else
        {
            ServerLogger::instance()->writeAdwordsLog(Info, "No location criteria were found.");
        }

        return $criteriaList;
    }

    public function getIdByCountryCode($countryCodeList)
    {
        if(!is_array($countryCodeList))
        {
            $countryCodeList = array($countryCodeList);
        }

        $countryIDs = array();
        foreach($countryCodeList as $countryCode)
        {
            $key = strtoupper($countryCode);
            if(array_key_exists($key, $this->codeIDMap))
            {
                $countryIDs[] = $this->codeIDMap[$key];
            }
            else
            {
                continue;
            }
        }
        return $countryIDs;
    }

    protected function getService($customerAccountId = null)
    {
        return $this->locationService;
    }

    protected function buildEntity($entry)
    {
        return $entry;
    }

    private static $locationFileds = array('Id', 'LocationName', 'CanonicalName',
        'DisplayType',  'ParentLocations', 'Reach', 'TargetingStatus');
}