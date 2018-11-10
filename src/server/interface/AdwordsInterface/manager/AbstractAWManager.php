<?php


abstract class AbstractAWManager
{
    protected static $instances = array();

    public static function getInstance()
    {
        $fqn = get_called_class();
        if (!array_key_exists($fqn, static::$instances))
        {
            static::$instances[$fqn] = new static();
        }

        return static::$instances[$fqn];
    }

    protected function getSelector($pageNum, $fields, $predicateList=array())
    {
        $builder = new SelectorBuilder();
        $builder->setFields($fields);
        $builder->setPaging($pageNum);

        if(!empty($predicateList))
        {
            $builder->setPredicate($predicateList);
        }

        return $builder->build();
    }

    protected function traversePage($pageNum, $fields, $customerId = null, $predicates = array())
    {
        $selector = $this->getSelector($pageNum, $fields, $predicates);
        $entityList = array();
        $totalNumEntries = 0;

        try
        {
            do
            {
                $page = $this->getService($customerId)->get($selector);

                if ($page->getEntries() !== null)
                {
                    $totalNumEntries = $page->getTotalNumEntries();

                    foreach ($page->getEntries() as $entry)
                    {
                        $entity = $this->buildEntity($entry);
                        $entityList[] = $entity;
                    }
                }

                $selector->getPaging()->setStartIndex($selector->getPaging()->getStartIndex() + $pageNum);

            } while ($selector->getPaging()->getStartIndex() < $totalNumEntries);

            return $entityList;
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeAdwordsExceptionLog(Error, $e);
            return false;
        }
    }

    abstract protected function getService($customerAccountId = null);

    abstract protected function buildEntity($entry);
}