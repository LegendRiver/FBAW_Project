/**
 * Created by yangtian on 16/11/29.
 */

function CSMSVerificationCode()
{
    BiComponent.call(this);
    this.setWidth(600);
    this.setHeight(47);

    this.__PanelSize = {
        width : 195,
        height : 45,
        space : 10
    }

    this.__VerificationCode = "";
    this.__VerificationToken = "";

    this.__CellPhone = "";
    this.__SendCallTag = "sendVerificationCodeInterface";
    this.__CheckCallTag = "checkVerificationCodeInterface";

    this.__CheckStatus = false;
}

CSMSVerificationCode.prototype = new BiComponent;
CSMSVerificationCode.prototype._className = "CSMSVerificationCode";

CSMSVerificationCode.prototype.initObject = function(application ,parent)
{
    this.__EliApplication = application;
    this.__Parent =parent;
    this._init();
};

CSMSVerificationCode.prototype._init = function()
{
    this._initSMSInterface();
    this._initVerificationCodeInput();
    this._initSendCodeButton();
    this._initMsgPanel();
    this._initCheckOkPanel();
};

CSMSVerificationCode.prototype._initSMSInterface = function()
{
    if(this.__SMSInterface == null)
    {
        this.__SMSInterface = new CSMSCodeInterface();
        this.__SMSInterface.initObject(this.__EliApplication, this);
    }
};

CSMSVerificationCode.prototype._initVerificationCodeInput = function()
{
    this.__CodeInputPanel = new BiTextField();
    this.__CodeInputPanel.setId(newGuid());
    this.__CodeInputPanel.setUserData("CodeInputPanel");
    this.__CodeInputPanel.setCssClassName("eli-verification-code-panel");
    this.__CodeInputPanel.setHtmlProperty("placeholder", ConstSettingContent.VerificationPlaceholder.Chinese);
    this.__CodeInputPanel.setWidth(this.__PanelSize.width+30);
    this.__CodeInputPanel.setHeight(this.__PanelSize.height);
    this.__CodeInputPanel.setTop(0);
    this.__CodeInputPanel.setLeft(0);
    this.__CodeInputPanel.setReadOnly(true);
    this.add(this.__CodeInputPanel);
};

CSMSVerificationCode.prototype._initSendCodeButton = function()
{
    this.__SendCodeButton = new BiLabel();
    this.__SendCodeButton.setId(newGuid());
    this.__SendCodeButton.setUserData("SendCodeButton");
    this.__SendCodeButton.setCssClassName("eli-verification-send-button");
    this.__SendCodeButton.setWidth(this.__PanelSize.width-40);
    this.__SendCodeButton.setHeight(this.__PanelSize.height);
    this.__SendCodeButton.setLeft(this.__CodeInputPanel.getLeft() + this.__CodeInputPanel.getWidth() + this.__PanelSize.space);
    this.__SendCodeButton.setTop(0);
    this.__SendCodeButton.setText(ConstSettingContent.SendVerificationCode.Chinese);
    this.__SendCodeButton.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.height));
    this.__SendCodeButton.setEnabled(false);
    this.__SendCodeButton.addEventListener("click", function () {
        this._onSendCodeButtonClick();
    }, this);
    this.add(this.__SendCodeButton);
};

CSMSVerificationCode.prototype._initCheckOkPanel = function()
{
    this.__SuccessImg = new BiComponent();
    this.__SuccessImg.setId(newGuid());
    this.__SuccessImg.setCssClassName("eli-success-image");
    this.__SuccessImg.setUserData("VerificationCodeSucessImage");
    this.__SuccessImg.setLeft(this.__SendCodeButton.getLeft() + this.__SendCodeButton.getWidth() + this.__PanelSize.space);
    this.__SuccessImg.setTop(0);
    this.__SuccessImg.setHeight(this.__PanelSize.height);
    this.__SuccessImg.setWidth(32);
    this.__SuccessImg.setVisible(false);
    this.add(this.__SuccessImg);
};

CSMSVerificationCode.prototype._initMsgPanel = function()
{
    this.__MsgPanel = new BiLabel();
    this.__MsgPanel.setId(newGuid());
    this.__MsgPanel.setUserData("SmsMsgPanel");
    this.__MsgPanel.setCssClassName("eli-msg-context");
    this.__MsgPanel.setWidth(this.__PanelSize.width);
    this.__MsgPanel.setHeight(this.__PanelSize.height);
    this.__MsgPanel.setLeft(this.__SendCodeButton.getLeft() + this.__SendCodeButton.getWidth() + this.__PanelSize.space);
    this.__MsgPanel.setTop(0);
    this.__MsgPanel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.height));
    this.add(this.__MsgPanel);
};

CSMSVerificationCode.prototype._onSendCodeButtonClick = function()
{
    this.clearText();
    this.__SMSInterface.sendVerificationCodeService(this.__SendCallTag, this.__CellPhone, this._sendVerificationCodeCallBack)
};

CSMSVerificationCode.prototype._sendVerificationCodeCallBack = function(response)
{
    var errorCode = parseInt(response.errorCode);

    var data = response.data;

    if(0 == errorCode && 0!=data.length)
    {
        var verificationToken = data[0];

        this.__Parent._setVerificationToken(verificationToken);
    }
    else
    {
        this.__Parent.updateVerificationCodeMsg(ConstSettingContent.SendVerificationCodeError.Chinese);
    }
};

CSMSVerificationCode.prototype._setVerificationToken = function(token)
{
    this.__VerificationToken = token;
};

CSMSVerificationCode.prototype._setStatus = function(flag)
{
    this.__CodeInputPanel.setReadOnly(flag);
    this.__SendCodeButton.setEnabled(!flag);
};

CSMSVerificationCode.prototype._setCellPhone = function(cellPhone)
{
    this.__CellPhone = cellPhone;
};

CSMSVerificationCode.prototype.updateSMSComponentStatusAndData = function(flag, cellPhone)
{
    this._setStatus(flag);
    this._setCellPhone(cellPhone);
};

CSMSVerificationCode.prototype.getVerificationToken = function()
{
    return this.__VerificationToken;
};

CSMSVerificationCode.prototype.getVerificationCode = function()
{
    this.__VerificationCode = this.__CodeInputPanel.getText();
    return this.__VerificationCode;
};

CSMSVerificationCode.prototype.checkVerificationCode = function(token, code)
{
    this.__SMSInterface.checkVerificationCodeService(this.__CheckCallTag, token, code, this._checkVerificationCodeCallback);
};

CSMSVerificationCode.prototype._checkVerificationCodeCallback =function(response)
{
    var errorCode = parseInt(response.errorCode);

    if(0 == errorCode)
    {
        this.__Parent._setCheckStatus(true);
        this.__Parent._checkPasswordAndUpdate();
        //this.__Parent.updateSuccessVisible(true);
    }
    else
    {
        this.__Parent._setCheckStatus(false);
    }
    this.__Parent.updateVerificationCodeMsg(ConstSettingContent.CheckVerificationCodeError.Chinese);
};

CSMSVerificationCode.prototype._checkPasswordAndUpdate = function()
{
    this.__Parent._changePassword();
};

CSMSVerificationCode.prototype._setCheckStatus = function(status)
{
    this.__CheckStatus = status;
};

CSMSVerificationCode.prototype.updateVerificationCodeMsg = function(text)
{
    if(this.__CheckStatus)
    {
        this.__MsgPanel.setText("");
    }
    else {
        this.__CodeInputPanel.setText("");
        this.__MsgPanel.setText(text);
        //this.updateSuccessVisible(false);
    }
};

CSMSVerificationCode.prototype.clearInputText = function()
{
    this.__CodeInputPanel.setText("");
};

CSMSVerificationCode.prototype.clearMsgText = function()
{
    this.__MsgPanel.setText("");
};

CSMSVerificationCode.prototype.clearText = function()
{
    this.clearInputText();
    this.clearMsgText();
};

CSMSVerificationCode.prototype.updateSuccessVisible = function(flag)
{
    this.__SuccessImg.setVisible(flag);
};

CSMSVerificationCode.prototype.updateSubmitButton = function(text)
{
    this.__SendCodeButton.setText(text);
};



