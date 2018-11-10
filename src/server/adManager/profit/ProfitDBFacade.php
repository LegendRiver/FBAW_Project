<?php


class ProfitDBFacade
{
    private static $instance = null;

    private $profitDbManager;

    private $dailySpendManager;

    private $campaignDbManager;

    private function __construct()
    {
        $this->profitDbManager = new ProfitDB();
        $this->dailySpendManager = new DailySpendDB();
        $this->campaignDbManager = new PublisherCampaignDB();
    }

    public static function instance()
    {
        if(is_null(static::$instance))
        {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function getProfitByConfigId($configId)
    {
        return $this->profitDbManager->selectProfitByConfigId($configId);
    }

    public function insertProfitRecord(ProfitDBEntity $entity)
    {
        return $this->profitDbManager->addProfitRecord($entity);
    }

    public function insertDailySpendRecord(DailySpendEntity $entity)
    {
        return $this->dailySpendManager->addDailySpendRecord($entity);
    }

    public function updateProfitByConfigId($profitValue, $configId)
    {
        return $this->profitDbManager->updateProfit($profitValue, $configId);
    }

    public function getCampaignIdByConfigId($configId)
    {
        $campaignPublisherIds = array();
        $campaignEntities = $this->campaignDbManager->selectByConfigId($configId);
        if(empty($campaignEntities))
        {
            return $campaignPublisherIds;
        }

        foreach ($campaignEntities as $dbEntity)
        {
            $campaignPublisherIds[] = $dbEntity->getCampaignId();
        }

        return $campaignPublisherIds;
    }

}