<?php


class RuleToolConstants
{
    const CONF_ITEM_RULE_INFO = "ruleInfos";
    const CONF_ITEM_MAIL_TO_ADDRESS = "mailToAddress";
    const CONF_ITEM_MAIL_SUBJECT = "mailSubject";
    const CONF_ITEM_DESCRIPTION = "description";
    const CONF_ITEM_PARENT_TYPE = "parentNodeType";
    const CONF_ITEM_PARENT_ID = "parentNodeIds";
    const CONF_ITEM_SUB_TYPE = "handleNodeType";

    const CONF_ITEM_RULE_LIST = "ruleList";
    const CONF_ITEM_RULE_TYPE = "type";
    const CONF_ITEM_RULE_KEY = "ruleKey";
    const CONF_ITEM_FIELDS = "fields";

    const CONF_ITEM_LOGIC_TYPE = "logicType";
    const CONF_ITEM_WARNING_THRESHOLD = "warningThreshold";
    const CONF_ITEM_ERROR_THRESHOLD = "errorThreshold";
    const CONF_ITEM_INSIGHT_FIELD = "insightField";
    const CONF_ITEM_INSIGHT_VALUE = "insightValue";
    const LOGIC_TYPE_SUM = 'sum';
    const LOGIC_TYPE_NONE = 'none';

    const NODE_TYPE_ACCOUNT = "Account";
    const NODE_TYPE_CAMPAIGN = "Campaign";
    const NODE_TYPE_ADSET = "Adset";
    const NODE_TYPE_AD = "Ad";

    const INSIGHT_CPI = 'cpi';
    const INSIGHT_IMPRESSION = 'impressions';
    const INSIGHT_INSTALL = 'install';
    const INSIGHT_ACCOUNT_ID = 'account_id';
    const INSIGHT_CAMPAIGN_ID = 'campaign_id';
    const INSIGHT_CAMPAIGN_NAME = 'campaign_name';
    const INSIGHT_ADSET_ID = 'adset_id';
    const INSIGHT_ADSET_NAME = 'adset_name';
    const INSIGHT_AD_ID = 'ad_id';
    const INSIGHT_AD_NAME = 'ad_name';
    const INSIGHT_SPEND = 'spend';
    const INSIGHT_REACH = 'reach';

    const INSIGHT_NAME = 'name';
    const INSIGHT_ID = 'id';
    const INSIGHT_TYPE = 'type';
    const INSIGHT_PARENT_NAME = 'parentName';
    const INSIGHT_PARENT_ID = 'parentId';
    const INSIGHT_PARENT_TYPE = 'parentType';
    const INSIGHT_ERROR_THRESHOLD = 'errorThreshold';
    const INSIGHT_WARNING_THRESHOLD = 'warningThreshold';
    const INSIGHT_FIELDS = 'checkFields';
    const INSIGHT_RULE_TYPE = 'ruleType';

    const MAIL_TEMPLATE_ERROR = "<br /><b>CPI 红色告警,已成功关闭： </b><br />";
    const MAIL_TEMPLATE_FAILED = "<br /><b>关闭失败告警：</b><br />";
    const MAIL_TEMPLATE_WARNING = "<br /><b>CPI 黄色告警： </b><br />";
    const MAIL_TEMPLATE_THRESHOLD = "<b>%s</b>(%s#%s)中<b>%s</b>的下列指标超过阈值：<br /> ";
    const MAIL_TEMPLATE_FAILED_SWITCH = "<b>%s</b>(%s#%s)中<b>%s</b>的下列指标超过阈值, 但关闭失败：<br /> ";
    const MAIL_TEMPLATE_FIELD = "<br />指标(%s)超过阈值(%s): <br />";
    const MAIL_TEMPLATE_SUBVALUE = '(<a href="%s">%s#%s</a>) => (%s)  <br />';

    const MAIL_TEMPLATE_URL = 'https://business.facebook.com/ads/manage/powereditor/manage/%s?act=%s&business_id=%s&date=%s&filter_set=%s-STRING%%1EEQUAL%%1E%%22%s%%22';

    const MAIL_CONTENT_TYPE_ERROR = 'Error';
    const MAIL_CONTENT_TYPE_WARNING = 'Warning';
    const MAIL_CONTENT_TYPE_FAILED = 'Failed';

    const RULE_TYPE_IMP_CPI = "imp_cpi";
    const RULE_TYPE_INSTALL_CPI = "install_cpi";


}