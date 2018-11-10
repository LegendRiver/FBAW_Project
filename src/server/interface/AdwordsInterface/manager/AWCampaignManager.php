<?php
use Google\AdsApi\AdWords\v201705\cm\Campaign;
use Google\AdsApi\AdWords\v201705\cm\Budget;
use Google\AdsApi\AdWords\v201705\cm\AdServingOptimizationStatus;
use Google\AdsApi\AdWords\v201705\cm\CampaignOperation;
use Google\AdsApi\AdWords\v201705\cm\CampaignCriterionOperation;
use Google\AdsApi\AdWords\v201705\cm\Operator;

class AWCampaignManager extends AbstractAWManager
{
    private $campaignService;

    private $defaultFields;

    private $allFields;

    protected function __construct()
    {
        $this->campaignService = AWServiceManager::getInstance()->getCampaignService();

        $this->defaultFields = array(
            CampaignFieldConstants::NAME,
            CampaignFieldConstants::ID,
            CampaignFieldConstants::STATUS,
            CampaignFieldConstants::START_DATE,
            CampaignFieldConstants::END_DATE,
            CampaignFieldConstants::SERVING_STATUS,
            CampaignFieldConstants::AD_SERVER_OPT_STATUS,
            CampaignFieldConstants::SETTING,
            CampaignFieldConstants::CHANNEL_TYPE,
            CampaignFieldConstants::CHANNEL_SUBTYPE,
        );

        $this->allFields = $this->getAllFields();
    }

    public function getAllCampaign()
    {
        $accountList = AWAccountManager::getInstance()->getAllAccount();
        if(empty($accountList))
        {
            ServerLogger::instance()->writeAdwordsLog(Error, 'The account list is empty');
            return array();
        }

        $campaignList = array();
        foreach ($accountList as $accountEntity)
        {
            $accountId = $accountEntity->getId();
            $campaigns = $this->getCampaignByAccountId($accountId);
            if(empty($campaigns))
            {
                ServerLogger::instance()->writeAdwordsLog(Warning, 'The campaigns of account is empty: ' . $accountId);
                continue;
            }
            $campaignList = array_merge($campaignList, $campaigns);
        }

        return $campaignList;
    }

    public function getCampaignByAccountId($accountId)
    {
        $pageNum = self::PAGE_NUM_LIMIT;
        return $this->traversePage($pageNum, $this->defaultFields, $accountId);
    }

    public function createCampaign(AWCampaignParam $campaignParam)
    {
        try
        {
            if (!$campaignParam->checkParam())
            {
                ServerLogger::instance()->writeAdwordsLog(Error, 'The campaign param is invalid.');
                return false;
            }

            $campaign = new Campaign();
            $this->campaignBasicSet($campaign, $campaignParam);

            $campaignType = $campaignParam->getCampaignType();

            if (AWCampaignValues::CAMPAIGN_TYPE_UAC == $campaignType)
            {
                $this->buildUACParam($campaign, $campaignParam);
            } else
            {
                $this->buildOtherParam($campaign, $campaignParam);
            }

            $accountId = $campaignParam->getAccountId();

            $operation = new CampaignOperation();
            $operation->setOperand($campaign);
            $operation->setOperator(Operator::ADD);
            $operations[] = $operation;

            $result = $this->getService($accountId)->mutate($operations);
            $campaignList = $result->getValue();
            if(empty($campaignList))
            {
                return false;
            }
            else
            {
                $campaignEntity = $this->buildEntity($campaignList[0]);
                return $campaignEntity;
            }
        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeAdwordsExceptionLog(Error, $e);
            return false;
        }
    }

    public function addCountryCriteria($accountId, $criteriaList)
    {
        try
        {
            if (empty($criteriaList))
            {
                return true;
            }

            $operations = array();
            foreach ($criteriaList as $campaignCriterion)
            {
                $operation = new CampaignCriterionOperation();
                $operation->setOperator(Operator::ADD);
                $operation->setOperand($campaignCriterion);
                $operations[] = $operation;
            }

            $result = $this->getCriteriaService($accountId)->mutate($operations);

            if(false === $result)
            {
                return false;
            }
            else
            {
                return true;
            }

        }
        catch (Exception $e)
        {
            ServerLogger::instance()->writeAdwordsExceptionLog(Error, $e);
            return false;
        }
    }

    private function buildUACParam(Campaign $campaign, UACCampaignParam $campaignParam)
    {
        $uacSetting = $campaignParam->getUacSetting();

        $campaignSetting = [$uacSetting];
        $campaign->setSettings($campaignSetting);
    }
    private function buildOtherParam(Campaign $campaign, AWCampaignParam $campaignParam)
    {
        $campaign->setAdServingOptimizationStatus(AdServingOptimizationStatus::ROTATE);

        $networkSetting = CampaignSettingFactory::createNetworkSetting();
        $campaign->setNetworkSetting($networkSetting);

        $frequencyCap = FrequencyCapFactory::createFrequencyCap();
        $campaign->setFrequencyCap($frequencyCap);
    }

    private function campaignBasicSet(Campaign $campaign, AWCampaignParam $campaignParam)
    {
        $campaign->setName($campaignParam->getName());
        $campaign->setAdvertisingChannelType($campaignParam->getChannelType());
        $campaign->setStatus($campaignParam->getStatus());

        $budgetId = $campaignParam->getBudgetId();
        $campaign->setBudget(new Budget());
        $campaign->getBudget()->setBudgetId($budgetId);

        $bidConfig = $campaignParam->getBidConfig();
        $campaign->setBiddingStrategyConfiguration($bidConfig);

        if(!empty($campaignParam->getChannelSubType()))
        {
            $campaign->setAdvertisingChannelSubType($campaignParam->getChannelSubType());
        }

        if(!empty($campaignParam->getStartDate()))
        {
            $campaign->setStartDate($campaignParam->getStartDate());
        }

        if(!empty($campaignParam->getEndDate()))
        {
            $campaign->setEndDate($campaignParam->getEndDate());
        }
    }

    protected function buildEntity($entry)
    {
        $entity = new AWCampaignEntity();
        $entity->setId($entry->getId());
        $entity->setName($entry->getName());
        $entity->setStatus($entry->getStatus());
        $entity->setStartDate($entry->getStartDate());
        $entity->setEndDate($entry->getEndDate());
        $entity->setChannelType($entry->getAdvertisingChannelType());
        $entity->setSubChannelType($entry->getAdvertisingChannelSubType());
        $entity->setServingStatus($entry->getServingStatus());
        $entity->setOptimizationStatus($entry->getAdServingOptimizationStatus());
        $entity->setSetting($entry->getSettings());

        return $entity;
    }

    protected function getService($customerAccountId = null)
    {
        if(is_null($customerAccountId))
        {
            return $this->campaignService;
        }
        else
        {
            return AWServiceManager::getInstance()->getCampaignService($customerAccountId);
        }
    }

    private function getCriteriaService($accountId)
    {
        return AWServiceManager::getInstance()->getCampaignCriterionService($accountId);
    }

    private function getAllFields()
    {
        return CampaignFieldConstants::getInstance()->getValues();
    }

    const PAGE_NUM_LIMIT = 100;
}