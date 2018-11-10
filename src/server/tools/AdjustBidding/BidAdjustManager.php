<?php
use FacebookAds\Object\Fields\AdSetFields;
/**
 * Created by IntelliJ IDEA.
 * User: Feng
 * Date: 2018/1/29
 * Time: 下午1:47
 */
class BidAdjustManager
{

    private $accountList;

    private $percentage;

    private $action;

    const UP = 'increase';
    const DOWN = 'decrease';

    public function __construct()
    {
        $this->accountList = array();
        $this->percentage = 0;
        $this->action = self::UP;
    }

    public function initAdjustConf($configFile)
    {
        $configInfo = FileHelper::readJsonFile($configFile);
        $this->accountList = $configInfo['accountIds'];
        $this->percentage = $configInfo['percentage'];
        $this->action = $configInfo['action'];
    }

    public function adjustBid()
    {
        foreach ($this->accountList as $accountId)
        {
            $queryFields = array(AdSetFields::ID, AdSetFields::NAME, AdSetFields::BID_AMOUNT);
            $adsetList = AdManagerFacade::getAdSetEntity($accountId, AdManageConstants::INSIGHT_EXPORT_TYPE_ACCOUNT,
                array(), $queryFields, true);

            print_r('###Now adjust bid of account: ' . $accountId . ' . There are ' . count($adsetList) . ' adsets. ####');

            foreach ($adsetList as $adset)
            {
                $bidAmount = $adset->getBitAmount();
                if($bidAmount == 0)
                {
                    continue;
                }

                if($this->percentage <=0)
                {
                    print_r('The percentage in conf is little than 0.');
                    return ;
                }

                if($this->action == self::UP)
                {
                    $adjustedAmount = (1+$this->percentage) * $bidAmount;
                }
                else if($this->action == self::DOWN)
                {
                    $adjustedAmount = (1-$this->percentage) * $bidAmount;
                }
                else
                {
                    print_r('The action in conf is invalid.');
                    return;
                }

                if($adjustedAmount < 1)
                {
                    continue;
                }

                $updateResult = AdManagerFacade::updateAdsetBid($adset->getId(), $adjustedAmount);

                if(false === $updateResult)
                {
                    print_r('!!!!!!Failed to update bid of adset: ' . $adset->getName() . '(' . $adset->getId() . ')');
                }
            }

        }
    }
}