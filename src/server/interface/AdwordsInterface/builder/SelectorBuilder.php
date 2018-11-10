<?php

use Google\AdsApi\AdWords\v201705\cm\OrderBy;
use Google\AdsApi\AdWords\v201705\cm\Paging;
use Google\AdsApi\AdWords\v201705\cm\Predicate;
use Google\AdsApi\AdWords\v201705\cm\DateRange;
use Google\AdsApi\AdWords\v201705\cm\Selector;

class SelectorBuilder
{
    const DEFAULT_PAGE_LIMIT = 500;

    private $selectorFields;

    private $orderBy;

    private $paging;

    private $predicates;

    private $dateRange;

    public function __construct()
    {
        $this->resetBuilder();
    }

    private function resetBuilder()
    {
        $this->selectorFields = null;
        $this->orderBy = null;
        $this->paging = null;
        $this->predicates = null;
        $this->dateRange = null;
    }

    public function build()
    {
        $selector = new Selector();
        if(!empty($this->selectorFields))
        {
            $selector->setFields($this->selectorFields);
        }
        if(!empty($this->orderBy))
        {
            $selector->setOrdering($this->orderBy);
        }
        if(!empty($this->paging))
        {
            $selector->setPaging($this->paging);
        }
        if(!empty($this->predicates))
        {
            $selector->setPredicates($this->predicates);
        }
        if(!empty($this->dateRange))
        {
            $selector->setDateRange($this->dateRange);
        }

        return $selector;
    }

    public function setFields(array $fields)
    {
        $this->selectorFields = $fields;
    }

    public function setOrderBy($field, $order)
    {
        $this->orderBy = new OrderBy($field, $order);
    }

    public function setPaging($pageLimit = self::DEFAULT_PAGE_LIMIT, $startIndex = 0)
    {
        $this->paging = new Paging($startIndex, $pageLimit);
    }

    public function addPredicate($field, $operate, $values)
    {
        if(is_null($this->predicates))
        {
            $this->predicates = array();
        }

        $predicate = new Predicate($field, $operate, $values);
        $this->predicates[] = $predicate;
    }

    public function setPredicate($predicateList)
    {
        if(is_null($this->predicates))
        {
            $this->predicates = $predicateList;
        }
        else
        {
            $this->predicates = array_merge($this->predicates, $predicateList);
        }
    }


    public function setDateRange($startDate, $endDate)
    {
        $this->dateRange = new DateRange($startDate, $endDate);
    }

}