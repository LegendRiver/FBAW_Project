<?php

use Google\AdsApi\AdWords\v201705\mcm\ManagedCustomerOperation;
use Google\AdsApi\AdWords\v201705\mcm\ManagedCustomer;
use Google\AdsApi\AdWords\v201705\cm\Operator;

class AWAccountManager extends AbstractAWManager
{
    private $manageCustomerService;

    private $defaultFields;

    private $allFields;

    protected function __construct()
    {
        $this->manageCustomerService = AWServiceManager::getInstance()->getManagerCustomerService();
        $this->defaultFields = array(
            AccountFieldConstants::CUSTOMER_ID,
            AccountFieldConstants::NAME,
            AccountFieldConstants::CAN_MANAGE_CLIENT,
            AccountFieldConstants::CURRENCY_CODE,
            AccountFieldConstants::TIME_ZONE,
            AccountFieldConstants::TEST_ACCOUNT,
            AccountFieldConstants::LABEL,
        );

        $this->allFields = $this->getAllFields();
    }

    public function createAccount($name, $currencyCode = self::CURRENCY_USD, $timeZone = self::TIME_ZONE_HONGKONG)
    {
        $customer = new ManagedCustomer();
        $customer->setName($name);
        $customer->setCurrencyCode($currencyCode);
        $customer->setDateTimeZone($timeZone);

        $operations = [];
        $operation = new ManagedCustomerOperation();
        $operation->setOperator(Operator::ADD);
        $operation->setOperand($customer);
        $operations[] = $operation;

        try
        {
            $mutateResponse = $this->manageCustomerService->mutate($operations);
            $customers = $mutateResponse->getValue();

            $entityList = array();
            if (!empty($customers))
            {
                foreach ($customers as $responseCustomer)
                {
                    $entity = $this->buildEntity($responseCustomer);
                    $entityList[] = $entity;
                }
            }

            return $entityList;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeAdwordsExceptionLog(Error, $e);
            return false;
        }
    }

    public function getAllAccount()
    {
        $pageNum = self::PAGE_NUM_LIMIT;
        return $this->traversePage($pageNum, $this->defaultFields);
    }

    protected function getService($customerAccountId = null)
    {
        return $this->manageCustomerService;
    }

    protected function buildEntity($entry)
    {
        $entity = new AWAccountEntity();
        $entity->setName($entry->getName());
        $entity->setId($entry->getCustomerId());
        $entity->setCanManageClient($entry->getCanManageClients());
        $entity->setCurrencyCode($entry->getCurrencyCode());
        $entity->setTimeZone($entry->getDateTimeZone());
        $entity->setIsTestAccount($entry->getTestAccount());
        $entity->setLabel($entry->getAccountLabels());

        return $entity;
    }

    private function getAllFields()
    {
        return AccountFieldConstants::getInstance()->getValues();
    }


    const CURRENCY_USD = 'USD';
    const TIME_ZONE_HONGKONG = 'Asia/Hong_Kong';
    const PAGE_NUM_LIMIT = 50;
}