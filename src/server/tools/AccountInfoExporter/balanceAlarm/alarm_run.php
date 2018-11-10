<?php
require_once(__DIR__ . "/../../../includeFile/interfaceInitFile.php");
require_once(__DIR__ . "/../../../includeFile/toolIncludeFile.php");

checkAccountBalance();

function checkAccountBalance()
{
    $configFile = __DIR__ . DIRECTORY_SEPARATOR . 'alarm_conf.json';
    $configInfo = FileHelper::readJsonFile($configFile);

    $alarmPercent = $configInfo['alarmPercent'];
    $alarmThreshold = $configInfo['alarmThreshold'];
    $mailSubject = $configInfo['mailSubject'];
    $mailToAddress = $configInfo['mailToAddress'];
    $excludeId = $configInfo['excludeAccountId'];

    $alarmInfos = getAlarmInfo($alarmPercent, $alarmThreshold, $excludeId);
    if(empty($alarmInfos))
    {
        return;
    }

    $mailContent = getAlarmMailContent($alarmInfos);

    $sendStatus = MailerHelper::instance()->sendMail($mailToAddress, $mailSubject, $mailContent);
    if(!$sendStatus)
    {
        ServerLogger::instance()->writeLog(Error, 'Failed to send mail: ' . $mailContent);
    }
}

function getAlarmMailContent($alarmInfos)
{
    $mailContent = AlarmConstants::ALARM_MAIL_BALANCE_ALARM;
    foreach ($alarmInfos as $alarm)
    {
        $accountInfo = sprintf(AlarmConstants::ALARM_MAIL_ACCOUNT_INFO,
            $alarm[AlarmConstants::ALARM_INFO_ACCOUNT_NAME],
            $alarm[AlarmConstants::ALARM_INFO_ACCOUNT_ID],
            $alarm[AlarmConstants::ALARM_INFO_CAP],
            $alarm[AlarmConstants::ALARM_INFO_SPEND],
            $alarm[AlarmConstants::ALARM_INFO_BALANCE_AMOUNT],
            $alarm[AlarmConstants::ALARM_INFO_BALANCE_AMOUNT]*100/$alarm[AlarmConstants::ALARM_INFO_CAP]
            );

        $mailContent .= $accountInfo;
    }

    return $mailContent;
}

function getAlarmInfo($alarmPercent, $alarmThreshold, $excludeId=array())
{
    $alarmInfo = array();
    $allAccounts = AdManagerFacade::getAllAccountsByBMId(AdManageConstants::DEFAULT_BM_ID);
    if(empty($allAccounts))
    {
        return $alarmInfo;
    }

    foreach($allAccounts as $accountEntity)
    {
        $accountId = $accountEntity->getId();
        if(in_array($accountId, $excludeId))
        {
            continue;
        }

        $spendCap = $accountEntity->getSpendCap()/100;
        if($spendCap <= 1)
        {
            continue;
        }

        $spendAmount = $accountEntity->getAmountSpend()/100;
        $balanceAmount = $spendCap - $spendAmount;
        $percentThreshold = $spendCap * $alarmPercent;

        if($balanceAmount > $percentThreshold && $balanceAmount > $alarmThreshold)
        {
            continue;
        }

        $accountName = $accountEntity->getName();
        $spendInfo = array(
            AlarmConstants::ALARM_INFO_ACCOUNT_NAME => $accountName,
            AlarmConstants::ALARM_INFO_ACCOUNT_ID => $accountId,
            AlarmConstants::ALARM_INFO_CAP => $spendCap,
            AlarmConstants::ALARM_INFO_SPEND => $spendAmount,
            AlarmConstants::ALARM_INFO_BALANCE_AMOUNT => $balanceAmount,
        );

        $alarmInfo[] = $spendInfo;
    }

    return $alarmInfo;
}