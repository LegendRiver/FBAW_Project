/**
 * Created by yangtian on 16/10/4.
 */

function CCampaignInfo()
{
    Object.call(this);

    this.__EliApplication = null;
    this.__Parent = null;

    this.__SERVICE_URL = SERVICE_URL;
    this.__METHOD_TYPE = "POST";
    this.__ServiceName = "EliAccountManagerService";
    this.__ClassInstance = "CEliAccountManager";
    this.__FunctionCreateCampaign = "createEliCampaign";
    this.__FunctionGetAudienceList = "getAudienceList";
    this.__FunctionGetPublisher = "getPublisherOwnerList";
    this.__FunctionGetCampaignList = "getCampaignList";

    this.__PARAMETER_SERVICE_NAME = "SERVICE_NAME";
    this.__PARAMETER_CLASS_INSTANCE = "CLASS_INSTANCE";
    this.__PARAMETER_FUNCTION_NAME = "FUNCTION_NAME";
    this.__PARAMETER_CALL_TAG = "CALL_TAG";
    this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN = "ELI_SESSION_ACCESS_TOKEN";
    this.__PARAMETER_NAME = "NAME";
    this.__PARAMETER_CAMPAIGN_TYPE = "CAMPAIGN_TYPE";
    this.__PARAMETER_URL = "URL";
    this.__PARAMETER_SCHEDULE_START = "SCHEDULE_START";
    this.__PARAMETER_SCHEDULE_END = "SCHEDULE_END";
    this.__PARAMETER_TIME_START = "TIME_START";
    this.__PARAMETER_TIME_END = "TIME_END";
    this.__PARAMETER_BUDGET = "budget";
    this.__PARAMETER_PUBLISHER_LIST = "PUBLISHER_LIST";
    this.__PARAMETER_TITLE = "TITLE";
    this.__PARAMETER_DESCRIPTION = "DESCRIPTION";
    this.__PARAMETER_START_TIME = "START_DATE";
    this.__PARAMETER_END_TIME = "END_DATE";

    this.__ResponseObj = null;

}

CCampaignInfo.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__AjaxClient = new CAjax(this.__SERVICE_URL, this.__METHOD_TYPE, this);
};

CCampaignInfo.prototype.setData = function(responseData)
{
    if(responseData != null)
    {
        var resultObj = null;
        try
        {
            resultObj = eval('(' + responseData + ')');
        }
        catch(e)
        {

            writeLogMessage("ERROR", sprintf("Data format invalid, error message<%s>.", e.message));
            return;
        }

        this.__ResponseObj = resultObj;

        if(this.__AjaxCompletedCallbackEvent)
        {
            this.__AjaxCompletedCallbackEvent(this.__ResponseObj);
        }
        return;
    }
};

CCampaignInfo.prototype.getId = function()
{
    return this.__Id;
};

CCampaignInfo.prototype.getPublisher = function(accessToken, callTag, callBackFunction)
{
    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionGetPublisher);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN, accessToken);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.callAjax();
};

CCampaignInfo.prototype.createCampaign = function(accessToken, callTag, campaignInfo, callBackFunction)
{

    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionCreateCampaign);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN, accessToken);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.registerParameter(this.__PARAMETER_NAME, campaignInfo.campaignName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CAMPAIGN_TYPE, campaignInfo.campaignType);
    this.__AjaxClient.registerParameter(this.__PARAMETER_URL, campaignInfo.url);
    this.__AjaxClient.registerParameter(this.__PARAMETER_SCHEDULE_START, campaignInfo.scheduleStart);
    this.__AjaxClient.registerParameter(this.__PARAMETER_SCHEDULE_END, campaignInfo.scheduleEnd);
    this.__AjaxClient.registerParameter(this.__PARAMETER_TIME_START, campaignInfo.timeStart);
    this.__AjaxClient.registerParameter(this.__PARAMETER_BUDGET, campaignInfo.budget);
    this.__AjaxClient.registerParameter(this.__PARAMETER_PUBLISHER_LIST, campaignInfo.publisherList);
    this.__AjaxClient.registerParameter(this.__PARAMETER_TITLE, campaignInfo.title);
    this.__AjaxClient.registerParameter(this.__PARAMETER_DESCRIPTION, campaignInfo.description);
    this.__AjaxClient.callAjax();
};

CCampaignInfo.prototype.getAudience = function(accessToken, callTag, callBackFunction)
{
    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionGetAudienceList);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN, accessToken);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.callAjax();
};

CCampaignInfo.prototype.getCampaignList = function(accessToken, callTag, callBackFunction, startTime, endTime)
{

    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionGetCampaignList);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN, accessToken);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);

    if(startTime !== undefined && endTime !== undefined)
    {
        this.__AjaxClient.registerParameter(this.__PARAMETER_START_TIME, startTime);
        this.__AjaxClient.registerParameter(this.__PARAMETER_END_TIME, endTime);
    }

    this.__AjaxClient.callAjax();
};

