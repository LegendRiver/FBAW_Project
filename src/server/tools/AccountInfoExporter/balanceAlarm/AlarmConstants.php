<?php


class AlarmConstants
{
    const ALARM_INFO_ACCOUNT_NAME = 'account_name';
    const ALARM_INFO_ACCOUNT_ID = 'account_id';
    const ALARM_INFO_CAP = 'cap';
    const ALARM_INFO_SPEND = 'spend';
    const ALARM_INFO_BALANCE_AMOUNT = 'balance_amount';

    const ALARM_MAIL_BALANCE_ALARM ='<b>以下帐号余额告警, 请及时充值：</b><br /><br />';
    const ALARM_MAIL_ACCOUNT_INFO = '帐号: %s(%s) 花费上限为: $%.2f, 已花费: $%.2f, 剩余: $%.2f(%d%%). <br /><br />';
}