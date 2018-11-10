/**
 * Created by zengt on 2016-09-11.
 */

function CEliAccount()
{
    Object.call(this);
    this.__Id = newGuid();
    this.__EliApplication = null;
    this.__SERVICE_URL = SERVICE_URL;
    this.__METHOD_TYPE = "POST";
    this.__AjaxCompletedCallbackEvent = null;
    this.__AjaxClient = null;

    this.__PARAMETER_SERVICE_NAME = "SERVICE_NAME";
    this.__PARAMETER_CLASS_INSTANCE = "CLASS_INSTANCE";
    this.__PARAMETER_FUNCTION_NAME = "FUNCTION_NAME";
    this.__FunctionNameLogin = "login";
    this.__FunctionNameRegister = "createEliAccount";

    this.__ServiceName = "EliAccountManagerService";
    this.__ClassInstance = "CEliAccountManager";

    this.__PARAMETER_ACCOUNT = "ACCOUNT";
    this.__PARAMETER_PASSWORD = "PASSWORD";
    this.__PARAMETER_EMAIL = "E_MAIL";
    this.__PARAMETER_CELLPHONE = "CELL_PHONE";
    this.__PARAMETER_ACCOUNT_TYPE = "ACCOUNT_TYPE";
    this.__PARAMETER_CALL_TAG = "CALL_TAG";


    this.__FunctionNameInfoComplete = "improveAccountInformation";
    this.__ELI_SESSION_ACCESS_TOKEN = "ELI_SESSION_ACCESS_TOKEN";
    this.__COMPANY_NAME = "COMPANY_NAME";
    this.__COMPANY_ADDRESS = "COMPANY_ADDRESS";
    this.__INDUSTRY_ID = "INDUSTRY_ID";
    this.__ORGANIZATION_CODE = "ORGANIZATION_CODE";
    this.__TAX_REGISTRATION_CERTIFICATE = "TAX_REGISTRATION_CERTIFICATE";
    this.__TRADE_LICENSE = "TRADE_LICENSE";
    this.__BUSINESS_LICENSE = "BUSINESS_LICENSE";



    this.__AccessToken = null;
    this.__AccountStatus = null;
    this.__Data  = null;
    this.__ErrorCodeObject = null;
}

CEliAccount.prototype.initObject = function(application)
{
    this._initHashCode();
    this.__EliApplication = application;
    this.__AjaxClient = new CAjax(this.__SERVICE_URL, this.__METHOD_TYPE, this);
    this.__AjaxClient.setIsEncryptData(false);
};

CEliAccount.prototype.login = function(userAccount, password, callTag, loginCompletedCallbackEvent)
{
    this.__AjaxCompletedCallbackEvent = loginCompletedCallbackEvent;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionNameLogin);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ACCOUNT, userAccount);
    this.__AjaxClient.registerParameter(this.__PARAMETER_PASSWORD, password);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.callAjax();
};

CEliAccount.prototype.register = function(email,cellPhone,password, accountType, callTag,
                                          registerCompletedCallBackEvent)
{
    this.__AjaxCompletedCallbackEvent = registerCompletedCallBackEvent;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionNameRegister);
    this.__AjaxClient.registerParameter(this.__PARAMETER_EMAIL, email);
    this.__AjaxClient.registerParameter(this.__PARAMETER_PASSWORD, password );
    this.__AjaxClient.registerParameter(this.__PARAMETER_CELLPHONE, cellPhone);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ACCOUNT_TYPE, accountType);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.callAjax();
};

CEliAccount.prototype.completeInfo = function(token, companyName, companyAddress, industryId,
                                              organizationCode, tax, tradeLicence, businessLicence, callTag,infoCompletedCallBackEvent)
{
    this.__AjaxCompletedCallbackEvent = infoCompletedCallBackEvent;
    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionNameInfoComplete);
    this.__AjaxClient.registerParameter(this.__ELI_SESSION_ACCESS_TOKEN, token);
    this.__AjaxClient.registerParameter(this.__COMPANY_NAME, companyName);
    this.__AjaxClient.registerParameter(this.__COMPANY_ADDRESS, companyAddress);
    this.__AjaxClient.registerParameter(this.__INDUSTRY_ID, industryId);
    this.__AjaxClient.registerParameter(this.__ORGANIZATION_CODE, organizationCode);
    this.__AjaxClient.registerParameter(this.__TAX_REGISTRATION_CERTIFICATE, tax);
    this.__AjaxClient.registerParameter(this.__TRADE_LICENSE, tradeLicence);
    this.__AjaxClient.registerParameter(this.__BUSINESS_LICENSE, businessLicence)
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, callTag);
    this.__AjaxClient.callAjax();
};

CEliAccount.prototype.setData = function(responseData)
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

        var errorCode = parseInt(resultObj.errorCode);

        this.__ResponseObj = resultObj;
        if(errorCode == 0)
        {

            this.__AccessToken = resultObj.data[0];
            this.__AccountStatus = resultObj.data[1];
        }

        if(this.__AjaxCompletedCallbackEvent)
        {
            this.__AjaxCompletedCallbackEvent(this.__ResponseObj);
        }
        return;
    }
};


CEliAccount.prototype.getAccessToken = function()
{
    return this.__AccessToken;
};

CEliAccount.prototype.getReponseObj = function()
{
    return this.__ResponseObj;
}

CEliAccount.prototype.getId = function()
{
    return this.__Id;
};

CEliAccount.prototype._initHashCode = function()
{
    if(!this.__ErrorCodeObject)
    {
        this.__ErrorCodeObject = new CErrorCode();
    }
};

CEliAccount.prototype.getServerHashCode = function()
{
    return this.__ErrorCodeObject.getErrorHash();
};


