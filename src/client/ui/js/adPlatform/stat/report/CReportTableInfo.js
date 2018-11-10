/**
 * Created by yangtian on 16/10/19.
 */
function CReportTableInfo()
{
    Object.call(this);
    this.__Id = newGuid();

    this.__SERVICE_URL = SERVICE_URL;
    this.__METHOD_TYPE = "POST";
    this.__ServiceName = "EliAccountManagerService";
    this.__ClassInstance = "CEliAccountManager";
    this.__AjaxCompletedCallbackEvent = null;
    this.__AjaxClient = null;

    this.__PARAMETER_SERVICE_NAME = "SERVICE_NAME";
    this.__PARAMETER_CLASS_INSTANCE = "CLASS_INSTANCE";
    this.__PARAMETER_FUNCTION_NAME = "FUNCTION_NAME";
    this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN = "ELI_SESSION_ACCESS_TOKEN";
    this.__PARAMETER_CALL_TAG = "CALL_TAG";
    this.__FunctionGetCampaignList = "getCampaignList";

    this.__EliApplication = null;
    this.__Parent = null;

}

CReportTableInfo.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__AjaxClient = new CAjax(this.__SERVICE_URL, this.__METHOD_TYPE, this);
};

CReportTableInfo.prototype.setData = function(responseData)
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

CReportTableInfo.prototype.getId = function()
{
    return this.__Id;
};

CReportTableInfo.prototype.getCampaignList = function(accessToken, callTag, callBackFunction)
{
    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionGetCampaignList);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ELI_SESSION_ACCESS_TOKEN, accessToken);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.callAjax();
};

