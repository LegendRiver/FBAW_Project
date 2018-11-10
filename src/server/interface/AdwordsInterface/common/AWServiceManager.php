<?php

use Google\AdsApi\AdWords\AdWordsServices;
use Google\AdsApi\AdWords\v201705\mcm\ManagedCustomerService;
use Google\AdsApi\AdWords\v201705\cm\CampaignService;
use Google\AdsApi\AdWords\v201705\mcm\CustomerService;
use Google\AdsApi\AdWords\v201705\ch\CustomerSyncService;
use Google\AdsApi\AdWords\v201705\cm\BudgetService;
use Google\AdsApi\AdWords\v201705\cm\MediaService;
use Google\AdsApi\AdWords\v201705\cm\LocationCriterionService;
use Google\AdsApi\AdWords\v201705\cm\CampaignCriterionService;
use Google\AdsApi\AdWords\v201705\cm\ConstantDataService;
use Google\AdsApi\AdWords\v201705\cm\ReportDefinitionService;

class AWServiceManager
{
    private static $instance = null;

    private $adwordsService;

    private $commonSession;

    private function __construct()
    {
        $this->commonSession = SessionCredentialManager::getInstance()->getAdwordsSession();
        $this->adwordsService = new AdWordsServices();
    }

    public static function getInstance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    /**
     * @return AdWordsServices
     */
    public function getAdwordsService()
    {
        return $this->adwordsService;
    }

    public function getManagerCustomerService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, ManagedCustomerService::class);
    }

    public function getCampaignService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, CampaignService::class);
    }

    public function getCustomerSyncService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, CustomerSyncService::class);
    }

    public function getCustomerService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, CustomerService::class);
    }

    public function getBudgetService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, BudgetService::class);
    }

    public function getMediaService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, MediaService::class);
    }

    public function getLocationCriterionService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, LocationCriterionService::class);
    }

    public function getCampaignCriterionService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, CampaignCriterionService::class);
    }

    public function getConstantDataService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, ConstantDataService::class);
    }

    public function getReportDefineService($customerId = null)
    {
        $session = $this->getSessionByCustomer($customerId);
        return $this->adwordsService->get($session, ReportDefinitionService::class);
    }

    public function getSessionByCustomer($customerId)
    {
        if(empty($customerId))
        {
            return $this->commonSession;
        }
        else
        {
           $session = SessionCredentialManager::getInstance()->getSessionByCustomerId($customerId);
           if(empty($session))
           {
               ServerLogger::instance()->writeAdwordsLog(Error, 'Failed to get session by customer: ' . $customerId);
               return $this->commonSession;
           }

           return $session;
        }
    }

}