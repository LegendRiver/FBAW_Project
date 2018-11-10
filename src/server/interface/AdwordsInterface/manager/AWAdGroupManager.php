<?php


class AWAdGroupManager extends AbstractAWManager
{

    protected function getService($customerAccountId = null)
    {
        return null;
    }

    protected function buildEntity($entry)
    {
        return $entry;
    }
}