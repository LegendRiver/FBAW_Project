<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

checkAccount();

function checkAccount()
{
    $accountConfFile = dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . 'AdInsightExporter' . DIRECTORY_SEPARATOR .
        'conf' . DIRECTORY_SEPARATOR . 'accountList.json';
    $actListInfo = FileHelper::readJsonFile($accountConfFile);

    $includeAccountIds = $actListInfo[InsightExporterConstants::BASIC_INFO_INCLUDE_ACCOUNT];
    $testAccountIds = array(
        'act_1093146064125710',
        'act_590058764508176',
        'act_584939305020122',
        "act_941077599407399",
        "act_933577406824085",
        "act_918035881711571",
        "act_906981029483723",
        "act_901144990067327",
        "act_901144996733993",
        "act_894267444088415",
        "act_868089753372851",
        "act_868089750039518",
        "act_857230797792080",
        "act_857230791125414",
        "act_857230794458747",
        "act_820315638150263",
        "act_820315634816930",
        "act_816899198491907",
        "act_816899195158574",
        "act_808991965949297",
        "act_791502277698266",
        "act_781022292079598",
        "act_1162684380534959",
        "act_631702523677133",
    );
    $includeAccountIds = array_merge($includeAccountIds, $testAccountIds);
    $accountEntities = AdManagerFacade::getAllAccountsByBMId(AdManageConstants::DEFAULT_BM_ID);
    if(empty($accountEntities))
    {
        return $includeAccountIds;
    }
    else
    {
        $allAccountIds = array();
        foreach($accountEntities as $account)
        {
            $accountId = $account->getId();
            $accountName = $account->getName();
            if(in_array($accountId, $includeAccountIds))
            {
                continue;
            }
            else
            {
                $campaigns = AdManagerFacade::getCampaignIdsByAccount($accountId);
                if(empty($campaigns))
                {
                    continue;
                }
                $allAccountIds[$accountId] = $accountName;
            }
        }

        if(!empty($allAccountIds))
        {
            $mailContent = 'AccountInfo: <br/>';
            $mailContent .= print_r($allAccountIds, true);
            MailerHelper::instance()->sendMail(array('xufeng@eliads.com'), 'check account', $mailContent);
        }
    }
}