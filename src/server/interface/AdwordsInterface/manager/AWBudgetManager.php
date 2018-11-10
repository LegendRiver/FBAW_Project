<?php

use Google\AdsApi\AdWords\v201705\cm\Budget;
use Google\AdsApi\AdWords\v201705\cm\Money;
use Google\AdsApi\AdWords\v201705\cm\BudgetBudgetDeliveryMethod;
use Google\AdsApi\AdWords\v201705\cm\BudgetOperation;
use Google\AdsApi\AdWords\v201705\cm\Operator;

class AWBudgetManager extends AbstractAWManager
{
    private $budgetService;

    private $selectFields;

    public function __construct()
    {
        $this->budgetService = AWServiceManager::getInstance()->getBudgetService();
        $this->selectFields = BudgetFieldConstants::getInstance()->getValues();
    }

    public function createBudget($name, $amount, $accountId = null, $isExplicitly = true, $isAccelerate=false)
    {
        try
        {
            $budget = new Budget();
            $budget->setName($name);
            $money = new Money();
            $microAmount = $amount * 1000000;
            $money->setMicroAmount($microAmount);
            $budget->setAmount($money);
            if ($isAccelerate)
            {
                $budget->setDeliveryMethod(BudgetBudgetDeliveryMethod::ACCELERATED);
            }
            else
            {
                $budget->setDeliveryMethod(BudgetBudgetDeliveryMethod::STANDARD);
            }

            if (!$isExplicitly)
            {
                $budget->setIsExplicitlyShared(false);
            }

            $operations = [];
            // Create a budget operation.
            $operation = new BudgetOperation();
            $operation->setOperand($budget);
            $operation->setOperator(Operator::ADD);
            $operations[] = $operation;

            // Create the budget on the server.
            $result = $this->getService($accountId)->mutate($operations);
            $budgets = $result->getValue();
            if(empty($budgets))
            {
                return false;
            }
            return $budgets[0];
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeAdwordsExceptionLog(Error, $e);
            return false;
        }
    }

    public function getBudget()
    {
        $pageNum = self::PAGE_NUM_LIMIT;
        return $this->traversePage($pageNum, $this->selectFields);
    }

    public function removeBudget($accountId, $budgetId)
    {
        try
        {
            $budget = new Budget();
            $budget->setBudgetId($budgetId);

            $operations = [];
            // Create a budget operation.
            $operation = new BudgetOperation();
            $operation->setOperand($budget);
            $operation->setOperator(Operator::REMOVE);
            $operations[] = $operation;

            // Create the budget on the server.
            $result = $this->getService($accountId)->mutate($operations);
            $budgets = $result->getValue();
            if (empty($budgets))
            {
                return false;
            }
            return $budgets[0];
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeAdwordsExceptionLog(Error, $e);
            return false;
        }
    }

    protected function getService($customerAccountId = null)
    {
        if(is_null($customerAccountId))
        {
            return $this->budgetService;
        }
        else
        {
            return AWServiceManager::getInstance()->getBudgetService($customerAccountId);
        }
    }

    protected function buildEntity($entry)
    {
        return $entry;
    }

    const PAGE_NUM_LIMIT = 50;
}