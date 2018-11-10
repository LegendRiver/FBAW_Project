<?php

class ScannerHelper
{
    private $accountList;

    private $disabledAccount;

    private $disapprovedAd;

    public function __construct($accountListConfFile)
    {
        $this->accountList = ExporterUtil::getAllValidAccounts($accountListConfFile);
        $this->accountList = array_diff($this->accountList, self::$blackAccountList);
        $this->disabledAccount = array();
        $this->disapprovedAd = array();
    }

    public function scanAd($isSendEmail=true)
    {
        foreach($this->accountList as $accountId)
        {
            $this->scanOneAccount($accountId);
        }

        if($isSendEmail)
        {
            $this->sendEMail();
        }
        else
        {
            print_r($this->disabledAccount);
            print_r($this->disapprovedAd);
        }

    }

    private function sendEMail()
    {
        $message = $this->getMailContent();
        if(empty($message))
        {
            return;
        }
        $subject = ScannerConstants::MAIL_TITLE;
        MailerHelper::instance()->sendMail(self::$toAddress, $subject, $message);
    }

    private function getMailContent()
    {
        $content = '';
        if(!empty($this->disabledAccount))
        {
            $content .= ScannerConstants::MAIL_DISABLE_ACCOUNT;
            foreach($this->disabledAccount as $account)
            {
                $accountMessage = sprintf(ScannerConstants::MAIL_NODE_LIST, $account->getName(), $account->getId());
                $content .= $accountMessage;
            }
        }

        if(!empty($this->disapprovedAd))
        {
            $content .= ScannerConstants::MAIL_DISAPPROVED_AD;
            foreach($this->disapprovedAd as $ad)
            {
                $accountId = $ad->getAccountId();
                $accountId = str_replace(AdManageConstants::ADACCOUNT_ID_PREFIX, '', $accountId);
                $adId = $ad->getId();
                $adName = $ad->getName();
                $url = RuleToolHelper::getNodeUrl($accountId, $adId, RuleToolConstants::NODE_TYPE_AD);
                $adMessage = sprintf(ScannerConstants::MAIL_NODE_LIST_URL, $url, $adName, $adId, $accountId);
                $content .= $adMessage;
            }
        }

        return $content;
    }

    private function scanOneAccount($accountId)
    {
        $accountEntity = AdManagerFacade::getAccountById($accountId);
        if(false === $accountEntity)
        {
            return;
        }

        $status = $accountEntity->getStatus();
        if(2 == $status)
        {
            $this->disabledAccount[] = $accountEntity;
        }

        $accountId = $accountEntity->getId();
        $adEntities = AdManagerFacade::getDisapprovedAdByAccount($accountId);
        if(false === $adEntities)
        {
            ServerLogger::instance()->writeLog(Error, '#scanner# Failed to get ads by account id : ' . $accountId);
            return;
        }

        $this->disapprovedAd = array_merge($this->disapprovedAd, $adEntities);
    }

    private static $toAddress = array(
        'business@eliads.com',
        'gina@eliads.com',
        'hanzhen@eliads.com'
    );

    private static $blackAccountList = array(
        "act_1227059300703760",
        "act_821366218045205"
    );

}