/**
 * Created by zengtao on 1/1/16.
 */

function CUserLoginWidow()
{
    BiDialog.call(this);
    this.setId(newGuid());
    this.setShowClose(false);
    this.setCanClose(false);
    this.setDisposeOnClose(false);
    this.setCentered(true);

    this.__AdSeeDataSpiderApplication = null;
    this.__ServiceUrl = "http://54.69.72.140/Service/UserManagerService.php";
    this.__PARAMETER_SERVICE_NAME = "SERVICE_NAME";
    this.__ServiceName = "UserManagerService";
    this.__PARAMETER_CLASS_INSTANCE = "CLASS_INSTANCE";
    this.__ClassInstance="CUserManager";
    this.__PARAMETER_FUNCTION_NAME = "FUNCTION_NAME";
    this.__FunctionName ="login";
    this.__PARAMETER_ACCOUNT="ACCOUNT";
    this.__PARAMETER_PASSWORD = "PASSWORD";
    this.__PARAMETER_CALL_TAG = "CALL_TAG";
    this.__LoginCallTag = newGuid();
    this.__AjaxClient = null;
}

CUserLoginWidow.prototype = new BiDialog;
CUserLoginWidow.prototype._className = "CUserLoginWidow";

CUserLoginWidow.prototype.initObject = function(adSeeDataSpiderApplication)
{
    this.__AdSeeDataSpiderApplication = adSeeDataSpiderApplication;
    this.__AjaxClient = new CAjax(this.__ServiceUrl, "POST", this);
    this.__init();
};

CUserLoginWidow.prototype.__init = function ()
{
    this.__ContentPanel = this.getContentPane();
    this.__UserAccountTextField = new BiTextField();
    this.__UserAccountTextField.setId(newGuid());
    this.__UserAccountTextField.setCssClassName("eli-user-login-window-account");
    this.__UserAccountTextField.setLeft(20);
    this.__UserAccountTextField.setTop(20);
    this.__UserAccountTextField.setRight(20);
    this.__UserAccountTextField.setHeight(44);
    this.__UserAccountTextField.setHtmlProperty("placeholder","请输入登录账号！");
    this.__ContentPanel.add(this.__UserAccountTextField);

    this.__PasswordTextField = new BiPasswordField();
    this.__PasswordTextField.setId(newGuid());
    this.__PasswordTextField.setCssClassName("eli-user-login-window-password");
    this.__PasswordTextField.setLeft(this.__UserAccountTextField.getLeft());
    this.__PasswordTextField.setTop(this.__UserAccountTextField.getTop() + this.__UserAccountTextField.getHeight() + 20);
    this.__PasswordTextField.setRight(this.__UserAccountTextField.getRight());
    this.__PasswordTextField.setHeight(44);
    this.__PasswordTextField.setHtmlProperty("placeholder","请输入密码！");
    this.__ContentPanel.add(this.__PasswordTextField);

    this.__LoginButton = new BiLabel();
    this.__LoginButton.setId(newGuid());
    this.__LoginButton.setCssClassName("eli-user-login-window-button");
    this.__LoginButton.setLeft(this.__PasswordTextField.getLeft());
    this.__LoginButton.setTop(this.__PasswordTextField.getTop() + this.__PasswordTextField.getHeight() + 20);
    this.__LoginButton.setRight(this.__PasswordTextField.getRight());
    this.__LoginButton.setHeight(44);
    this.__LoginButton.setText("登录");
    this.__LoginButton.setAlign("center");
    this.__LoginButton.addEventListener("click", function (event)
    {
        this.__login();
    }, this);
    this.__ContentPanel.add(this.__LoginButton);
};

CUserLoginWidow.prototype.__login = function ()
{
    var userName = this.__UserAccountTextField.getText();
    if(trim(userName).length == 0)
    {
        this.__UserAccountTextField.setCssClassName("eli-user-login-window-account-error");
        return;
    }

    var password = this.__PasswordTextField.getText();
    if(trim(password).length == 0)
    {
        this.__UserAccountTextField.setCssClassName("eli-user-login-window-password-error");
        return;
    }

    this.__AjaxClient.clearParameters();
    this.__AjaxClient.registerParameter(this.__PARAMETER_SERVICE_NAME, this.__ServiceName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CLASS_INSTANCE, this.__ClassInstance);
    this.__AjaxClient.registerParameter(this.__PARAMETER_FUNCTION_NAME, this.__FunctionName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_CALL_TAG, this.__LoginCallTag);
    this.__AjaxClient.registerParameter(this.__PARAMETER_ACCOUNT, userName);
    this.__AjaxClient.registerParameter(this.__PARAMETER_PASSWORD, password);
    this.__AjaxClient.callAjax();
};


CUserLoginWidow.prototype.setData = function (responseData)
{
    var convertObject = null;
    try
    {
        convertObject = eval('(' + responseData + ')');
    }
    catch(ex)
    {
        writeLogMessage("ERROR", sprintf("Response data format invalid, error message<%s>.", ex.message));
        return;
    }

    var errorCode = parseInt(convertObject.errorCode);
    if(errorCode != 0)
    {
        this.__UserAccountTextField.setCssClassName("eli-user-login-window-account-error");
        this.__UserAccountTextField.setCssClassName("eli-user-login-window-password-error");
        this.__AdSeeDataSpiderApplication.showErrorMessageBox("用户名或者密码错误！");
        return;
    }

    var callTag = convertObject.CALL_TAG;
    switch (callTag)
    {
        case this.__LoginCallTag:
            this.__processUserLogin(convertObject.data);
            break;
        default:
            break;
    }

};

CUserLoginWidow.prototype.__processUserLogin = function (userLoginData)
{
    this.setVisible(false);
    this.__AdSeeDataSpiderApplication.loadAppData(userLoginData);
};

CUserLoginWidow.prototype.initControl = function ()
{
    this.__UserAccountTextField.setText("");
    this.__PasswordTextField.setText("");
};