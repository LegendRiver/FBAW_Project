/**
 * Created by yangtian on 16/10/5.
 */

function CAccountInfo()
{
    Object.call(this);
    this.__Id = newGuid();

    this.__EliApplication = null;
    this.__Parent = null;
    this.__SERVICE_URL = SERVICE_URL;
    this.__METHOD_TYPE = "POST";
    this.__ServiceName = "EliAccountManagerService";
    this.__ClassInstance = "CEliAccountManager";
    this.__FunctionName = "getEliAccount";
    this.__FunctionLoginOut = "logout";
    this.__FunctionChangePassword = "changePassword";

    this.__AjaxCompletedCallbackEvent = null;
    this.__AjaxClient = null;

    this.__PARAMETER_SERVICE_NAME = "SERVICE_NAME";
    this.__PARAMETER_CLASS_INSTANCE = "CLASS_INSTANCE";
    this.__PARAMETER_FUNCTION_NAME = "FUNCTION_NAME";
    this.__ELI_SESSION_ACCESS_TOKEN = "ELI_SESSION_ACCESS_TOKEN";
    this.__PARAMETER_CALL_TAG = "CALL_TAG";
    this.__PARAMETER_PASSWORD_OLD = "PASSWORD";
    this.__PARAMETER_PASSWORD_NEW = "NEW_PASSWORD";

    this.__ResponseObj = null;
    this.__ErrorCodeObject = null;
}

CAccountInfo.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__AjaxClient = new CAjax(this.__SERVICE_URL, this.__METHOD_TYPE, this);
    this._initHashCode();

};

CAccountInfo.prototype.getResponseObj = function()
{
    return this.__ResponseObj;
};

CAccountInfo.prototype.setData = function(responseData)
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

CAccountInfo.prototype.getId = function()
{
    return this.__Id;
};

CAccountInfo.prototype.getAccountInfo = function(accessToken, callTag, callBackFunction)
{
    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionName);
    this.__AjaxClient.registerParameter(this.__ELI_SESSION_ACCESS_TOKEN, accessToken);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.callAjax();
};

CAccountInfo.prototype.loginOut = function(accessToken, callTag, callBackFunction)
{
    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionLoginOut);
    this.__AjaxClient.registerParameter(this.__ELI_SESSION_ACCESS_TOKEN, accessToken);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.callAjax();
};

CAccountInfo.prototype.changePassword = function(oldPassword, newPassword, accessToken, callTag, callBackFunction)
{
    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionChangePassword);
    this.__AjaxClient.registerParameter(this.__ELI_SESSION_ACCESS_TOKEN, accessToken);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.registerParameter(this.__PARAMETER_PASSWORD_OLD, oldPassword);
    this.__AjaxClient.registerParameter(this.__PARAMETER_PASSWORD_NEW, newPassword);
    this.__AjaxClient.callAjax();
};

CAccountInfo.prototype._initHashCode = function()
{
    if(!this.__ErrorCodeObject)
    {
        this.__ErrorCodeObject = new CErrorCode();
    }
};

CAccountInfo.prototype.getErrorCodeHash = function()
{
    return this.__ErrorCodeObject.getErrorHash();
}





