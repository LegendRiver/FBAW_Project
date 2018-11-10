/**
 * Created by yangtian on 16/8/18.
 */

function CLoginComponent() {
    //BiDialog.call(this);

    BiComponent.call(this);
    this.setCssClassName("eli-login-component");
    this.setHeight(370);
    this.setWidth(400);

    this._containerLabelWidth = 325;
    this._containerLabelHeight = 38;
    this._space = 15;

    this._imageLabelHeight = this._containerLabelHeight - 2;
    this._imageLabelWidth = this._imageLabelHeight;

    this._contentLabelWidth = this._containerLabelWidth - this._imageLabelWidth - 2;
    this._contentLabelHeight = this._imageLabelHeight;

    this._loginButtonWidth = this._containerLabelWidth;
    this._loginButtonHeight = this._containerLabelHeight;
    this._closeButtonWidth = 20;
    this._closeButtonHeight = this._closeButtonWidth;

    this._emailContent = "请输入邮箱或手机号";
    this._passwordContent = "请输入密码";
    this._loginContent = "登录";

    this.__LoginContentPanel = null;
    this.__EliApplication = null;
    this.__EliAccount = null;

    this.__UserNameInput = "";
    this.__PasswordInput = "";

    this.__LoginStatus = true;
    this.__Verification = null;
    this.__EliApplication = null;
};

CLoginComponent.prototype = new BiDialog;
CLoginComponent.prototype._className = "CLoginComponent";

CLoginComponent.prototype.initObject = function (eliApplication) {
    this.__EliApplication = eliApplication;

    this._init();

};

CLoginComponent.prototype._init = function () {

    this._initTransparentPanel();
    this._initLoginInfoPanel();

    this._initEliLogoPanel();
    this._createEmailLabels();
    this._createPasswordLabels();
    this._createLoginButton();
    //this._createCloseButton();
    this._initVerification();
};

CLoginComponent.prototype._initTransparentPanel = function()
{
    this.__Transparent = new BiComponent();
    this.__Transparent.setId(newGuid());
    this.__Transparent.setCssClassName("eli-login-transparent-panel");
    this.__Transparent.setLeft(0);
    this.__Transparent.setRight(0);
    this.__Transparent.setTop(0);
    this.__Transparent.setBottom(0);
    this.add(this.__Transparent);
};

CLoginComponent.prototype._initLoginInfoPanel = function()
{
    this.__LoginContentPanel = new BiComponent();
    this.__LoginContentPanel.setId(newGuid());
    this.__LoginContentPanel.setCssClassName("eli-login-info-panel");
    this.__LoginContentPanel.setLeft(0);
    this.__LoginContentPanel.setRight(0);
    this.__LoginContentPanel.setTop(0);
    this.__LoginContentPanel.setBottom(0);
    this.add(this.__LoginContentPanel);
};

CLoginComponent.prototype._initEliLogoPanel = function()
{
    this.__LogoPanel = new BiComponent();
    this.__LogoPanel.setId(newGuid());
    this.__LogoPanel.setCssClassName("eli-login-logo-panel");
    this.__LogoPanel.setTop(0);
    this.__LogoPanel.setWidth(180);
    this.__LogoPanel.setHeight(90);
    this.__LogoPanel.setLeft((this.getWidth()-this.__LogoPanel.getWidth())/2);
    this.__LoginContentPanel.add(this.__LogoPanel);
};

CLoginComponent.prototype._createEmailLabels = function () {
    this.__EmailComponent = new BiComponent();
    this.__EmailComponent.setId(newGuid());
    this.__EmailComponent.setTop(this.__LogoPanel.getTop()+this.__LogoPanel.getHeight() + 20);
    this.__EmailComponent.setLeft((this.getWidth()-this._containerLabelWidth)/2);
    this.__EmailComponent.setCssClassName("eli-login-text-panel");
    this.__EmailComponent.setWidth(this._containerLabelWidth);
    this.__EmailComponent.setHeight(this._containerLabelHeight);
    this.__LoginContentPanel.add(this.__EmailComponent);
    //this.add(this.__EmailComponent);

    this.__EmailImage = new BiComponent();
    this.__EmailImage.setId(newGuid());
    this.__EmailImage.setCssClassName("eli-login-email-image");
    this.__EmailImage.setWidth(this._imageLabelWidth);
    this.__EmailImage.setHeight(this._imageLabelHeight);
    this.__EmailComponent.add(this.__EmailImage);

    this.__EmailContext = new BiTextField();
    this.__EmailContext.setId(newGuid());
    this.__EmailContext.setCssClassName("eli-login-context");
    this.__EmailContext.setHtmlProperty("placeholder", this._emailContent);
    this.__EmailContext.setWidth(this._contentLabelWidth);
    this.__EmailContext.setHeight(this._contentLabelHeight);
    this.__EmailContext.setLeft(this.__EmailImage.getWidth());
    this.__EmailComponent.add(this.__EmailContext);

    this.__LoginNameMsg = new BiLabel();
    this.__LoginNameMsg.setId(newGuid());
    this.__LoginNameMsg.setCssClassName("eli-msg-context");
    this.__LoginNameMsg.setTop(this.__EmailComponent.getTop());
    this.__LoginNameMsg.setWidth(120);
    this.__LoginNameMsg.setRight(0);
    this.__LoginNameMsg.setHeight(this._containerLabelHeight);
    this.__LoginNameMsg.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__LoginContentPanel.add(this.__LoginNameMsg);
    //this.add(this.__LoginNameMsg);
};

CLoginComponent.prototype._createPasswordLabels = function () {
    this.__PasswordComponent = new BiComponent();
    this.__PasswordComponent.setId(newGuid());
    this.__PasswordComponent.setTop(this.__EmailComponent.getTop() + this.__EmailComponent.getHeight()+this._space);
    this.__PasswordComponent.setLeft(this.__EmailComponent.getLeft());
    this.__PasswordComponent.setCssClassName("eli-login-text-panel");
    this.__PasswordComponent.setWidth(this.__EmailComponent.getWidth());
    this.__PasswordComponent.setHeight(this.__EmailComponent.getHeight());
    this.__LoginContentPanel.add(this.__PasswordComponent);
    //this.add(this.__PasswordComponent);

    this.__PasswordImage = new BiComponent();
    this.__PasswordImage.setId(newGuid());
    this.__PasswordImage.setCssClassName("eli-login-password-image");
    this.__PasswordImage.setWidth(this._imageLabelWidth);
    this.__PasswordImage.setHeight(this._imageLabelHeight);
    this.__PasswordComponent.add(this.__PasswordImage);

    this.__PasswordContext = new BiPasswordField();
    this.__PasswordContext.setId(newGuid());
    this.__PasswordContext.setCssClassName("eli-login-context");
    this.__PasswordContext.setHtmlProperty("placeholder", this._passwordContent);
    this.__PasswordContext.setWidth(this._contentLabelWidth);
    this.__PasswordContext.setHeight(this._contentLabelHeight);
    this.__PasswordContext.setLeft(this.__PasswordImage.getWidth());
    this.__PasswordComponent.add(this.__PasswordContext);

    this.__PasswordInputMsg = new BiLabel();
    this.__PasswordInputMsg.setId(newGuid());
    this.__PasswordInputMsg.setCssClassName("eli-msg-context");
    this.__PasswordInputMsg.setTop(this.__PasswordComponent.getTop());
    this.__PasswordInputMsg.setWidth(120);
    this.__PasswordInputMsg.setRight(0);
    this.__PasswordInputMsg.setHeight(this._containerLabelHeight);
    this.__PasswordInputMsg.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__LoginContentPanel.add(this.__PasswordInputMsg);
    //this.add(this.__PasswordInputMsg);
};

CLoginComponent.prototype._createLoginButton = function () {
    this.__LoginComponent = new BiComponent();
    this.__LoginComponent.setId(newGuid());
    this.__LoginComponent.setCssClassName("eli-login-button");
    this.__LoginComponent.setWidth(this.__EmailComponent.getWidth());
    this.__LoginComponent.setHeight(this.__EmailComponent.getHeight());
    this.__LoginComponent.setTop(this.__PasswordComponent.getTop() + this.__LoginComponent.getHeight()+this._space);
    this.__LoginComponent.setLeft(this.__PasswordComponent.getLeft());
    this.__LoginContentPanel.add(this.__LoginComponent);
    //this.add(this.__LoginComponent);


    this.__LoginButton = new BiLabel();
    this.__LoginButton.setId(newGuid());
    this.__LoginButton.setCssClassName("eli-login-button-text");
    this.__LoginButton.setWidth(this.__EmailComponent.getWidth());
    this.__LoginButton.setHeight(this.__EmailComponent.getHeight());
    this.__LoginButton.setText(this._loginContent);
    this.__LoginButton.setAlign("center");
    this.__LoginButton.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__LoginButton.addEventListener("click", function () {
        this._LoginOnClick();
    }, this);
    this.__LoginComponent.add(this.__LoginButton);

    this.__ServerErrorMsgPanel = new BiLabel();
    this.__ServerErrorMsgPanel.setId(newGuid());
    this.__ServerErrorMsgPanel.setCssClassName("eli-server-msg-context");
    this.__ServerErrorMsgPanel.setWidth(this._containerLabelWidth);
    this.__ServerErrorMsgPanel.setHeight(this._containerLabelHeight);
    this.__ServerErrorMsgPanel.setLeft(this.__LoginComponent.getLeft());
    this.__ServerErrorMsgPanel.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__ServerErrorMsgPanel.setTop(this.__LoginComponent.getTop()+ this.__LoginComponent.getHeight()+this._space);
    this.__LoginContentPanel.add(this.__ServerErrorMsgPanel);
    //this.add(this.__ServerErrorMsgPanel);

};

CLoginComponent.prototype._createCloseButton = function () {
    this.__CloseButton = new BiComponent();
    this.__CloseButton.setId(newGuid());
    this.__CloseButton.setCssClassName("eli-login-close-image");
    this.__CloseButton.setWidth(this._closeButtonWidth);
    this.__CloseButton.setHeight(this._closeButtonHeight);
    this.__CloseButton.setTop(5);
    this.__CloseButton.setRight(0);
    this.__CloseButton.addEventListener("click", function () {
        this._onCloseButtonClick();
    }, this);
    //this.__LoginContentPanel.add(this.__CloseButton);
};

CLoginComponent.prototype._initVerification = function()
{
    if(!this.__Verification)
    {
        this.__Verification = new CVerification();
        this.__Verification.initObject(this.__EliApplication);
    }
    this.__ErrorCode = this.__Verification.getErrorCode();
    this.__ErrorMsg = this.__Verification.getErrorMsg();
};

CLoginComponent.prototype._initELiAccount = function()
{
    if(!this.__EliAccount)
    {
        this.__EliAccount = new CEliAccount();
        this.__EliAccount.initObject(this.__EliApplication);
    }
};

CLoginComponent.prototype._onCloseButtonClick = function () {
    this.setVisible(false);
};

CLoginComponent.prototype._LoginOnClick = function () {
    this._initELiAccount();
    this._initLoginInputMsg();
    this._inputPreCheck(this.__UserNameInput, this.__PasswordInput);
};

CLoginComponent.prototype._initLoginInputMsg = function()
{
    this.__UserNameInput = this.__EmailContext.getText();
    this.__PasswordInput = this.__PasswordContext.getText();
    this.__LoginNameMsg.setVisible(false);
    this.__PasswordInputMsg.setVisible(false);
    this.__LoginStatus = true;
};

CLoginComponent.prototype._updateMsgText = function(label, text)
{
    label.setText(text);
    label.setVisible(true);
};

CLoginComponent.prototype._setLoginStatus = function(status)
{
    this.__LoginStatus = status;
};

CLoginComponent.prototype._inputPreCheck = function(username, password)
{
    var msg = this.__Verification.checkUsername(username);
    if(msg != 0)
    {
        this._updateMsgText(this.__LoginNameMsg, msg);
        this._setLoginStatus(false);
    }

    msg = this.__Verification.checkPassword(password);
    if(msg != 0)
    {
        this._updateMsgText(this.__PasswordInputMsg, msg);
        this._setLoginStatus(false);
    }

    if(!this.__LoginStatus)
    {
        return 1;
    }

    this.__EliAccount.login(this.__UserNameInput, this.__PasswordInput, "login", this.__LoginCompletedCallBack);
};

CLoginComponent.prototype.getServerErrorMsgPanel = function()
{
    return this.__ServerErrorMsgPanel;
};

CLoginComponent.prototype.__LoginCompletedCallBack = function(response)
{
    var loginPanel = this.__EliApplication.getLoginComponent();
    var errorCode = parseInt(response.errorCode);


    if(0 == errorCode)
    {

        loginPanel.setVisible(false);
        var accessToken = response.data[0];
        var accountStatus = response.data[1];
        this.__EliApplication.setAccessToken(accessToken);
        this.__EliApplication.setAccountStatus(accountStatus);
        this.__EliApplication.showAdPlatformPanel(accountStatus, accessToken);

    }
    else
    {
        var msg = this.getServerHashCode().item(errorCode);
        loginPanel.getServerErrorMsgPanel().setText(msg);
    }
};












