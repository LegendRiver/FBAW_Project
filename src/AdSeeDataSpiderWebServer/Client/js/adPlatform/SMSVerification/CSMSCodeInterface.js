/**
 * Created by yangtian on 16/11/30.
 */

function CSMSCodeInterface()
{
    Object.call(this);
    this.__Id = newGuid();

    this.__EliApplication = null;
    this.__Parent = null;

    this.__SERVICE_URL = SECURITY_SERVICE_URL;
    this.__METHOD_TYPE = "POST";
    this.__AjaxCompletedCallbackEvent = null;
    this.__AjaxClient = null;

    this.__PARAMETER_SERVICE_NAME = "SERVICE_NAME";
    this.__PARAMETER_CLASS_INSTANCE = "CLASS_INSTANCE";
    this.__PARAMETER_FUNCTION_NAME = "FUNCTION_NAME";

    this.__ServiceName = "EliSecurityService";
    this.__ClassInstance = "CSecurityManager";
    this.__SendCodeFunctionName = "sendVerificationCode";
    this.__CheckCodeFunctionName = "checkVerificationCode";

    this.__PARAMETER_CALL_TAG = "CALL_TAG";
    this.__PARAMETER_CELL_PHONE = "CELL_PHONE";
    this.__PARAMETER_VERIFICATION_TOKEN = "VERIFICATION_TOKEN";
    this.__PARAMETER_VERIFICATION_CODE = "VERIFICATION_CODE";
}

CSMSCodeInterface.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__AjaxClient = new CAjax(this.__SERVICE_URL, this.__METHOD_TYPE, this);
    this.__AjaxClient.setIsEncryptData(false);
};

CSMSCodeInterface.prototype.getId = function()
{
    return this.__Id;
};

CSMSCodeInterface.prototype.setData = function(responseData)
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

CSMSCodeInterface.prototype.sendVerificationCodeService = function(callTag, cellPhone, callBackFunction)
{
    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__SendCodeFunctionName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CELL_PHONE, cellPhone);
    this.__AjaxClient.callAjax();
};

CSMSCodeInterface.prototype.checkVerificationCodeService = function(callTag, token, code, callBackFunction)
{
    this.__AjaxCompletedCallbackEvent = callBackFunction;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__CheckCodeFunctionName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.registerParameter(this.__PARAMETER_VERIFICATION_TOKEN, token);
    this.__AjaxClient.registerParameter(this.__PARAMETER_VERIFICATION_CODE, code);
    this.__AjaxClient.callAjax();
};


