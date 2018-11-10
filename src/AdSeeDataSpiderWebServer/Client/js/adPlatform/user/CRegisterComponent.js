/**
 * Created by yangtian on 16/8/19.
 */

function CRegisterComponent() {
    BiDialog.call(this);
    this.setHeight(400);
    this.setWidth(600);

    this._containerLabelWidth = 325;
    this._containerLabelHeight = 38;
    this._sendButtonWidth = 95;
    this._space = 15;

    this._imageLabelHeight = this._containerLabelHeight - 2;
    this._imageLabelWidth = this._imageLabelHeight;

    this._contentLabelWidth = this._containerLabelWidth - this._imageLabelWidth - 2;
    this._contentLabelHeight = this._imageLabelHeight;

    this._loginButtonWidth = this._containerLabelWidth;
    this._loginButtonHeight = this._containerLabelHeight;
    this._closeButtonWidth = 20;
    this._closeButtonHeight = this._closeButtonWidth;

    this._emailContent = "请输入邮箱";
    this._passwordContent = "请输入密码";
    this._cellPhoneContent = "请输入手机号";
    this._verificationContent = "请输入验证码";
    this._sendVerficationContent = "发送验证码";
    this._registerContent = "注册";

    this._emailErrorMsg = "邮箱格式错误";
    this._emailNull = "邮箱不能为空"

    this.__RegisterContentPanel = null;
    this.__EliApplication = null;

    this.__EliAccount = null;
    this.__AccessToken = null;

    this.__EmailPattern = "";
    this.__PhonePattern = "";

    this.__Verification = null;

    this.__ErrorCode = null;
    this.__MsgHash = new BiHashTable();
    this.__sucess = true;
    this.__ServerErrorCode = null;
    this.__ServerErrorMsgPanel = null;
}

CRegisterComponent.prototype = new BiDialog;
CRegisterComponent.prototype._className = "CRegisterComponent";

CRegisterComponent.prototype.initObject = function (eliApplication) {
    this.__EliApplication = eliApplication;
    this._init();
    this._initELiAccount();
    this._initVerification();
};

CRegisterComponent.prototype._init = function () {
    this.__RegisterContentPanel = this.getContentPane();
    this.__RegisterContentPanel.setId(newGuid());
    this.__RegisterContentPanel.setCssClassName("eli-login-main-panel");
    this._createEmailLabel();
    this._createPhoneLabel();
    this._createPasswordLabel();
    this._createVerificationCodeLabel();
    this._createRegisterButton();
    this._createCloseButton();
};

CRegisterComponent.prototype._createEmailLabel = function () {
    this.__EmailComponent = new BiComponent();
    this.__EmailComponent.setId(newGuid());
    this.__EmailComponent.setTop(50);
    this.__EmailComponent.setCssClassName("eli-login-panel");
    this.__EmailComponent.setWidth(this._containerLabelWidth);
    this.__EmailComponent.setHeight(this._containerLabelHeight);
    this.__RegisterContentPanel.add(this.__EmailComponent);

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

    this.__EmailMsg = new BiLabel();
    this.__EmailMsg.setId(newGuid());
    this.__EmailMsg.setTop(this.__EmailComponent.getTop());
    this.__EmailMsg.setCssClassName("eli-msg-context");
    this.__EmailMsg.setWidth(120);
    this.__EmailMsg.setRight(0);
    this.__EmailMsg.setHeight(this._containerLabelHeight);
    this.__EmailMsg.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__RegisterContentPanel.add(this.__EmailMsg)

};

CRegisterComponent.prototype._createPhoneLabel = function () {
    this.__PhoneComponent = new BiComponent();
    this.__PhoneComponent.setId(newGuid());
    this.__PhoneComponent.setTop(this.__EmailComponent.getTop()+ this.__EmailComponent.getHeight()+ this._space);
    this.__PhoneComponent.setCssClassName("eli-login-panel");
    this.__PhoneComponent.setWidth(this.__EmailComponent.getWidth());
    this.__PhoneComponent.setHeight(this.__EmailComponent.getHeight());
    this.__RegisterContentPanel.add(this.__PhoneComponent);

    this.__PhoneImage = new BiComponent();
    this.__PhoneImage.setId(newGuid());
    this.__PhoneImage.setCssClassName("eli-login-phone-image");
    this.__PhoneImage.setWidth(this._imageLabelWidth);
    this.__PhoneImage.setHeight(this._imageLabelHeight);
    this.__PhoneComponent.add(this.__PhoneImage);

    this.__PhoneContext = new BiTextField();
    this.__PhoneContext.setId(newGuid());
    this.__PhoneContext.setCssClassName("eli-login-context");
    this.__PhoneContext.setHtmlProperty("placeholder", this._cellPhoneContent);
    this.__PhoneContext.setWidth(this._contentLabelWidth);
    this.__PhoneContext.setHeight(this._contentLabelHeight);
    this.__PhoneContext.setLeft(this.__PhoneImage.getWidth());
    this.__PhoneComponent.add(this.__PhoneContext);

    this.__PhoneMsg = new BiLabel();
    this.__PhoneMsg.setId(newGuid());
    this.__PhoneMsg.setTop(this.__EmailComponent.getTop()+ this.__EmailComponent.getHeight()+ this._space);
    this.__PhoneMsg.setCssClassName("eli-msg-context");
    this.__PhoneMsg.setWidth(120);
    this.__PhoneMsg.setRight(0);
    this.__PhoneMsg.setHeight(this._containerLabelHeight);
    this.__PhoneMsg.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__RegisterContentPanel.add(this.__PhoneMsg)
};

CRegisterComponent.prototype._createPasswordLabel = function () {
    this.__PasswordComponent = new BiComponent();
    this.__PasswordComponent.setId(newGuid());
    this.__PasswordComponent.setTop(this.__PhoneComponent.getTop() + this.__PhoneComponent.getHeight()+this._space);
    this.__PasswordComponent.setCssClassName("eli-login-panel");
    this.__PasswordComponent.setWidth(this.__EmailComponent.getWidth());
    this.__PasswordComponent.setHeight(this.__EmailComponent.getHeight());
    this.__RegisterContentPanel.add(this.__PasswordComponent);

    this.__PasswordImage = new BiComponent();
    this.__PasswordImage.setId(newGuid);
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

    this.__PasswordMsg = new BiLabel();
    this.__PasswordMsg.setId(newGuid());
    this.__PasswordMsg.setTop(this.__PhoneComponent.getTop()+this.__PhoneComponent.getHeight()+this._space);
    this.__PasswordMsg.setCssClassName("eli-msg-context");
    this.__PasswordMsg.setWidth(120);
    this.__PasswordMsg.setRight(0);
    this.__PasswordMsg.setHeight(this._containerLabelHeight);
    this.__PasswordMsg.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__RegisterContentPanel.add(this.__PasswordMsg)
};

CRegisterComponent.prototype._createVerificationCodeLabel = function () {
    this.__VerificationComponent = new BiComponent();
    this.__VerificationComponent.setId(newGuid());
    this.__VerificationComponent.setTop(this.__PasswordComponent.getTop() + this.__PasswordComponent.getHeight()+this._space);
    this.__VerificationComponent.setCssClassName("eli-login-panel");
    this.__VerificationComponent.setWidth(this.__EmailComponent.getWidth());
    this.__VerificationComponent.setHeight(this.__EmailComponent.getHeight());
    this.__RegisterContentPanel.add(this.__VerificationComponent);

    this.__SendButton = new BiLabel();
    this.__SendButton.setId(newGuid());
    this.__SendButton.setCssClassName("eli-login-send-button");
    this.__SendButton.setWidth(this._sendButtonWidth);
    this.__SendButton.setHeight(this._contentLabelHeight);
    this.__SendButton.setText(this._sendVerficationContent);
    this.__SendButton.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__VerificationComponent.add(this.__SendButton);

    this.__VerificationContext = new BiTextField();
    this.__VerificationContext.setId(newGuid());
    this.__VerificationContext.setCssClassName("eli-login-context");
    this.__VerificationContext.setHtmlProperty("placeholder", this._verificationContent);
    this.__VerificationContext.setWidth(this._contentLabelWidth - this.__SendButton.getWidth());
    this.__VerificationContext.setHeight(this._contentLabelHeight);
    this.__VerificationContext.setLeft(this.__SendButton.getWidth());
    this.__VerificationComponent.add(this.__VerificationContext);

    this.__VerificationMsg = new BiLabel();
    this.__VerificationMsg.setId(newGuid());
    this.__VerificationMsg.setTop(this.__PasswordComponent.getTop() + this.__PasswordComponent.getHeight()+this._space);
    this.__VerificationMsg.setCssClassName("eli-msg-context");
    this.__VerificationMsg.setWidth(120);
    this.__VerificationMsg.setRight(0);
    this.__VerificationMsg.setHeight(this._containerLabelHeight);
    this.__VerificationMsg.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__RegisterContentPanel.add(this.__VerificationMsg)
};

CRegisterComponent.prototype._createRegisterButton = function () {
    this.__RegisterButton = new BiLabel();
    this.__RegisterButton.setId(newGuid());
    this.__RegisterButton.setCssClassName("eli-login-button");
    this.__RegisterButton.setWidth(this._containerLabelWidth);
    this.__RegisterButton.setHeight(this._containerLabelHeight);
    this.__RegisterButton.setText(this._registerContent);
    this.__RegisterButton.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__RegisterButton.setTop(this.__VerificationComponent.getTop() + this.__VerificationComponent.getHeight()+ +this._space);
    this.__RegisterButton.addEventListener("click", function () {
        this._onRegisterButtonClick();
    }, this);
    this.__RegisterContentPanel.add(this.__RegisterButton);

    this.__ServerErrorMsgPanel = new BiLabel();
    this.__ServerErrorMsgPanel.setId(newGuid());
    this.__ServerErrorMsgPanel.setCssClassName("eli-server-msg-context");
    this.__ServerErrorMsgPanel.setWidth(this._containerLabelWidth);
    this.__ServerErrorMsgPanel.setHeight(this._containerLabelHeight);
    this.__ServerErrorMsgPanel.setLeft(this.__RegisterButton.getLeft());
    this.__ServerErrorMsgPanel.setStyleProperty("line-height", sprintf("%dpx", this._contentLabelHeight));
    this.__ServerErrorMsgPanel.setTop(this.__RegisterButton.getTop()+ this.__RegisterButton.getHeight()+this._space);
    this.__RegisterContentPanel.add(this.__ServerErrorMsgPanel);
};

CRegisterComponent.prototype.getServerErrorMsgPanel = function()
{
    return this.__ServerErrorMsgPanel;
};
CRegisterComponent.prototype._onRegisterButtonClick = function () {

    this._msgVisible();
    var email = this.__EmailContext.getText();
    var msg = this.__Verification.checkEmail(email);
    if(msg != 0)
    {
        this._updateCheckMsg(this.__EmailMsg, msg);
        this.__sucess = false;
    }

    var phone = this.__PhoneContext.getText();
    msg = this.__Verification.checkPhone(phone);
    if(0 != msg)
    {
        this._updateCheckMsg(this.__PhoneMsg, msg);
        this.__sucess = false;
    }

    //var code = this.__VerificationContext.getText();
    var password = this.__PasswordContext.getText();
    msg = this.__Verification.checkPassword(password);
    if(0 != msg)
    {
        this._updateCheckMsg(this.__PasswordMsg, msg);
        this.__sucess = false;
    }
    var accountType = 0;

    if(!this.__sucess)
    {
        return;
    }
    this.__EliAccount.register(email,phone,password, accountType, "register", this.__callBackComplete);
};

CRegisterComponent.prototype._updateCheckMsg = function(label, text)
{
    label.setText(text);
    label.setVisible(true);
};

CRegisterComponent.prototype._msgVisible = function()
{
    this.__EmailMsg.setVisible(false);
    this.__PasswordMsg.setVisible(false);
    this.__PhoneMsg.setVisible(false);
    this.__VerificationMsg.setVisible(false);
    this.__sucess = true;
}

CRegisterComponent.prototype.__callBackComplete = function(response)
{
    var registerPanel = this.__EliApplication.getRegisterComponent();
    var errorCode = parseInt(response.errorCode);

    if(0 == errorCode)
    {
        registerPanel.setVisible(false);
        var accessToken = response.data[0];
        var accountStatus = response.data[1];
        this.__EliApplication.setAccessToken(accessToken);
        this.__EliApplication.setAccountStatus(accountStatus);
        this.__EliApplication.showAdPlatformPanel(accountStatus, accessToken);
    }
    else
    {
        var msg = this.getServerHashCode().item(errorCode);
        registerPanel.getServerErrorMsgPanel().setText(msg);
    }
};

CRegisterComponent.prototype._initELiAccount = function()
{
    if(!this.__EliAccount)
    {
        this.__EliAccount = new CEliAccount();
        this.__EliAccount.initObject(this.__EliApplication);
    }
};

CRegisterComponent.prototype._createCloseButton = function () {
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
    this.__RegisterContentPanel.add(this.__CloseButton);
};

CRegisterComponent.prototype._onCloseButtonClick = function () {
    this.setVisible(false);
};

CRegisterComponent.prototype._initVerification = function()
{
    if(!this.__Verification)
    {
        this.__Verification = new CVerification();
        this.__Verification.initObject(this.__EliApplication);
    }
    this.__ErrorCode = this.__Verification.getErrorCode();
    this.__ErrorMsg = this.__Verification.getErrorMsg();
};
