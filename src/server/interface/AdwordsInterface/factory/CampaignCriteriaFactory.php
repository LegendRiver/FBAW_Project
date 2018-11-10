<?php
use Google\AdsApi\AdWords\v201705\cm\Location;
use Google\AdsApi\AdWords\v201705\cm\Language;
use Google\AdsApi\AdWords\v201705\cm\CampaignCriterion;

class CampaignCriteriaFactory
{
    public static function createLocationCriteria($locationId, $campaignId)
    {
        $locationName = 'L_' . $locationId . '_' . $campaignId . '_' . time();
        $location = new Location();
        $location->setId($locationId);
        $location->setLocationName($locationName);
        $criteria = new CampaignCriterion($campaignId, null, $location);
        return $criteria;
    }

    public static function createLanguageCriteria($languageId, $campaignId)
    {
        $language = new Language();
        $language->setId($languageId);
        $criteria = new CampaignCriterion($campaignId, null, $language);

        return $criteria;
    }
}