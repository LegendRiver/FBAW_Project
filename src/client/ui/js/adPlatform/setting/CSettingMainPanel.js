/**
 * Created by yangtian on 16/10/5.
 */

function CSettingMainPanel()
{
    BiComponent.call(this);
    this.__EliApplication = null;
    this.__Parent = null;

    this.__LastPanelBottom = 0;

    this.__PanelSpace = 10;

    this.__UserData = {
        accountTitle : "infoTitle",
        phone : "phone",
        email : "email",
        password : "password",
        accountBalance : "accountBalance",

        companyTitle : "companyTitle",
        companyName : "companyName",
        companyAddress : "companyAddress",
        businessLicence : "businessLicence",

        modifyButton : "modifyButton",
        updateButton : "updateButton",
        modifyPassword : "modifyPassword",
        updatePassword : "updatePassword",
        currentPasswordLabel : "currentPasswordLabel",
        inputNewPasswordLabel : "inputNewPasswordLabel",
        inputAgainPasswordLabel : "inputAgainPasswordLabel",
        oldPasswordMsg : "oldPasswordMsg",
        firstNewPasswordMsg : "firstNewPasswordMsg",
        secondNewPasswordMsg : "secondNewPasswordMsg"
    };

    this.__Content = {
        accountTitle : "账户信息",
        phone : "手机",
        email : "邮箱",
        passwordTitle : "密码服务",
        passwordButton : "修改密码",
        accountBalance : "账户余额",

        companyTitle : "公司信息",
        companyAddress: "公司地址",
        companyName : "公司名称",
        businessLicence : "营业执照",

        modifyButton : "修改",
        updateButton : "更新",
        modifyPassword : "修改密码",
        updatePassword : "更新密码",
        currentPasswordLabel : "旧密码",
        inputNewPasswordLabel : "新密码",
        inputAgainPasswordLabel : "再次确认",
        updateSuccess : "更新成功",
        changePasswordNotSame : "两次新密码不同"
    };

    this.__PanelSize = {
        firstTitleTop : 30,
        titlePanelLeft : 0,
        titlePanelWidth : 160,
        titlePanelHeight : 40,

        infoPanelLeft : 150,
        infoLabelWidth : 160,
        infoPanelHeight : 45,
        infoPanelWidth : 400,
        infoPanelSpace : 30,
        infoPanelLongWidth :580,

        buttonWidth : 100,
        buttonHeight : 35,

        imageHeight : 500,
        imagePreviewWidth : 500,
        imagePreviewHeight : 700,
    };

    this.__CallTag = "changePassword";

    this.__TitleHash = new BiHashTable();
    this.__InfoPanelHash = new BiHashTable();
    this.__LabelNameHash = new BiHashTable();
    this.__LabelInfoHash = new BiHashTable();
    this.__ButtonHash = new BiHashTable();
    this.__MsgLabelHash = new BiHashTable();

    this.__AccountInfo = null;
    this.__AccountFields = null;
    this.__AccessToken = null;
    this.__Verification = null;

    this.__ChangePasswordStatus = true;
    this.__AccountCellPhone = "";

    this.__FirstNewPassword = "";
    this.__OldPassword = "";
}

CSettingMainPanel.prototype = new BiComponent;
CSettingMainPanel.prototype._className = "CSettingMainPanel";

CSettingMainPanel.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__AccessToken = this.__EliApplication.getAccessToken();
    this._init();
};

CSettingMainPanel.prototype._init = function()
{
    this._initAccountFields();

    // account title
    this._createInfoTitlePanel(
        this.__UserData.accountTitle,
        this.__Content.accountTitle,
        this.__PanelSize.firstTitleTop,
        this.__PanelSize.titlePanelLeft,
        this.__PanelSize.titlePanelWidth,
        this.__PanelSize.titlePanelHeight
    );

    // email
    this._createSinglePanel(
        this.__UserData.email,
        this.__Content.email,
        this.__LastPanelBottom,
        this.__PanelSize.infoPanelLeft,
        new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.infoPanelHeight)
    );

    // phone
    this._createSinglePanel(
        this.__UserData.phone,
        this.__Content.phone,
        this.__LastPanelBottom,
        this.__PanelSize.infoPanelLeft,
        new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.infoPanelHeight)
    );

    // accountBalance
    this._createSinglePanel(
        this.__UserData.accountBalance,
        this.__Content.accountBalance,
        this.__LastPanelBottom,
        this.__PanelSize.infoPanelLeft,
        new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.infoPanelHeight)
    );

    // company title
    this._createInfoTitlePanel(
        this.__UserData.companyTitle,
        this.__Content.companyTitle,
        this.__LastPanelBottom+ this.__PanelSize.infoPanelSpace,
        this.__PanelSize.titlePanelLeft,
        this.__PanelSize.titlePanelWidth,
        this.__PanelSize.titlePanelHeight
    );

    // company name
    this._createSinglePanel(
        this.__UserData.companyName,
        this.__Content.companyName,
        this.__LastPanelBottom,
        this.__PanelSize.infoPanelLeft,
        new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.infoPanelHeight)
    );

    // company address
    this._createSinglePanel(
        this.__UserData.companyAddress,
        this.__Content.companyAddress,
        this.__LastPanelBottom,
        this.__PanelSize.infoPanelLeft,
        new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.infoPanelHeight)
    );

    // modify button
    /*this.__ModifyButton = this._createButton(
        this.__UserData.modifyButton,
        this.__PanelSize.infoPanelLeft,
        this.__LastPanelBottom+30,
        this.__PanelSize.buttonWidth,
        this.__PanelSize.buttonHeight,
        this.__Content.modifyButton
    );

    // update button
    this.__SubmitButton = this._createButton(
        this.__UserData.updateButton,
        this.__PanelSize.infoPanelLeft+this.__PanelSize.buttonWidth+30,
        this.__LastPanelBottom+30,
        this.__PanelSize.buttonWidth,
        this.__PanelSize.buttonHeight,
        this.__Content.updateButton
    );
    this._changeAccountButtonStatus(true);

    this._computeLastPanelBottom(this.__ButtonHash.item(this.__UserData.modifyButton), 20, this.__LastPanelBottom+30);
*/


    // business preview

    this._ImagePreviewer(
        this.__LastPanelBottom,
        this.__PanelSize.infoPanelLeft + 250,
        this.__PanelSize.imagePreviewWidth,
        this.__PanelSize.imagePreviewHeight
    );

    // businessLicence
    this._createImageLabel(
        this.__UserData.businessLicence,
        this.__Content.businessLicence,
        this.__LastPanelBottom + 30,
        this.__PanelSize.infoPanelLeft,
        new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.imageHeight)
    );

    this._createCutLine(this.__UserData.password,  this.__LastPanelBottom,20, 20, 3);

    //this.__UpdatePasswordButton.setEnabled(true);


    // modify password button
    var buttonLeft = this.__PanelSize.titlePanelLeft + this.__PanelSize.titlePanelWidth +180;
    this.__ModifyPasswordButton = this._createButton(
        this.__UserData.modifyPassword,
        buttonLeft,
        this.__LastPanelBottom,
        this.__PanelSize.buttonWidth,
        this.__PanelSize.buttonHeight,
        this.__Content.modifyPassword
    );

    // update password button
    this.__UpdatePasswordButton = this._createButton(
        this.__UserData.updatePassword,
        buttonLeft +this.__PanelSize.buttonWidth+30,
        this.__LastPanelBottom,
        this.__PanelSize.buttonWidth,
        this.__PanelSize.buttonHeight,
        this.__Content.updatePassword
    );

    // passwordTitle
    this._createInfoTitlePanel(
        this.__UserData.password,
        this.__Content.passwordTitle,
        this.__LastPanelBottom,
        this.__PanelSize.titlePanelLeft,
        this.__PanelSize.titlePanelWidth,
        this.__PanelSize.titlePanelHeight
    );



    // old password
    var msgLeft = this.__PanelSize.titlePanelLeft+this.__PanelSize.infoPanelLongWidth+5
    this._createMsgLabel(
        this.__UserData.oldPasswordMsg,
        this.__LastPanelBottom,
        msgLeft,
        this.__PanelSize.infoLabelWidth,
        this.__PanelSize.infoPanelHeight
    );

    this._createSinglePasswordPanel(
        this.__UserData.currentPasswordLabel,
        this.__Content.currentPasswordLabel,
        this.__LastPanelBottom,
        this.__PanelSize.infoPanelLeft,
        new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.infoPanelHeight),
        ConstSettingContent.InputOldPassword.Chinese
    );

    // new password
    this._createMsgLabel(
        this.__UserData.firstNewPasswordMsg,
        this.__LastPanelBottom,
        msgLeft,
        this.__PanelSize.infoLabelWidth,
        this.__PanelSize.infoPanelHeight
    );
    this._createSinglePasswordPanel(
            this.__UserData.inputNewPasswordLabel,
            this.__Content.inputNewPasswordLabel,
            this.__LastPanelBottom,
            this.__PanelSize.infoPanelLeft,
            new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.infoPanelHeight),
            ConstSettingContent.InputNewPassword.Chinese
    );

    // new again password
    this._createMsgLabel(
        this.__UserData.secondNewPasswordMsg,
        this.__LastPanelBottom,
        msgLeft,
        this.__PanelSize.infoLabelWidth,
        this.__PanelSize.infoPanelHeight
    );

    this._createSinglePasswordPanel(
        this.__UserData.inputAgainPasswordLabel,
        this.__Content.inputAgainPasswordLabel,
        this.__LastPanelBottom,
        this.__PanelSize.infoPanelLeft,
        new CSize(this.__PanelSize.infoPanelLongWidth, this.__PanelSize.infoPanelHeight),
        ConstSettingContent.InputNewPasswordAgain.Chinese
    );

    this._initVerificationCodePanel(this.__LastPanelBottom, this.__PanelSize.infoPanelLeft + 190);



    this._changeModifyPasswordStatus(true);

    this._initAccountInfo();
    this.updateSettingPanelInfo();


};

CSettingMainPanel.prototype._initVerificationCodePanel = function(top, left)
{
    this.__VerificationCodePanel = new CSMSVerificationCode();
    this.__VerificationCodePanel.initObject(this.__EliApplication, this);
    this.__VerificationCodePanel.setId(newGuid());
    this.__VerificationCodePanel.setCssClassName("eli-verification-component");
    this.__VerificationCodePanel.setUserData("VerificationPanel");
    this.__VerificationCodePanel.setTop(top);
    this.__VerificationCodePanel.setLeft(left);
    this.add(this.__VerificationCodePanel);
    this._computeLastPanelBottom(this.__VerificationCodePanel, this.__PanelSpace, top);
};


CSettingMainPanel.prototype.updateSettingPanelInfo = function()
{
    this.__AccountInfo.getAccountInfo(this.__AccessToken, "getAccount", this._getAccountCallBack);
};

CSettingMainPanel.prototype._initAccountInfo = function()
{
    if(!this.__AccountInfo)
    {
        this.__AccountInfo = new CAccountInfo();
        this.__AccountInfo.initObject(this.__EliApplication, this);
    }
};

CSettingMainPanel.prototype._initAccountFields = function()
{
    if(!this.__AccountFields)
    {
        this.__AccountFields = new CAccountFields();
    }
};

CSettingMainPanel.prototype._computeLastPanelBottom = function(panel, space, top)
{
    this.__LastPanelBottom = top + panel.getHeight() + space;
};

CSettingMainPanel.prototype.getLastPanelBottom  = function()
{
    return this.__LastPanelBottom;
};

CSettingMainPanel.prototype._createInfoTitlePanel = function(userData, title, top, left, width, height)
{
    var infoTitle = new BiLabel();
    infoTitle.setId(newGuid());
    infoTitle.setText(title);
    infoTitle.setCssClassName("eli-campaign-basic-title-text");
    infoTitle.setTop(top);
    infoTitle.setLeft(left);
    infoTitle.setWidth(width);
    infoTitle.setHeight(height);

    this.__TitleHash.add(userData, infoTitle);
    this.add(infoTitle);
    this._computeLastPanelBottom(infoTitle, this.__PanelSize.infoPanelSpace, top);
};

CSettingMainPanel.prototype._createMsgLabel = function(userData, top, left, width, height)
{
    var msgLabel = new BiLabel();
    msgLabel.setUserData(userData);
    msgLabel.setCssClassName("eli-msg-context");
    msgLabel.setTop(top);
    msgLabel.setLeft(left);
    msgLabel.setWidth(width);
    msgLabel.setHeight(height);
    msgLabel.setStyleProperty("line-height", sprintf("%dpx", height));

    this.__MsgLabelHash.add(userData, msgLabel);
    this.add(msgLabel);
};

CSettingMainPanel.prototype._createSinglePanel = function(userData, labelName, top, left, size)
{
    var panel = new BiComponent();
    panel.setId(newGuid());
    panel.setUserData(userData);
    panel.setCssClassName("eli-campaign-main-panel");
    panel.setLeft(left);
    panel.setTop(top);
    panel.setWidth(size.Width);
    panel.setHeight(size.Height);
    this.__InfoPanelHash.add(userData, panel);
    this.add(panel);
    this._createInfoPanel(userData, labelName, size.Height , panel);
    this._computeLastPanelBottom(panel, this.__PanelSpace, top);
};

CSettingMainPanel.prototype._createInfoPanel = function(userData, name, height, parent)
{
    var nameLabel = new BiLabel();
    nameLabel.setCssClassName("eli-setting-label-text");
    nameLabel.setId(newGuid());
    nameLabel.setUserData(userData);
    nameLabel.setText(name);
    nameLabel.setTop(0);
    nameLabel.setBottom(0);
    nameLabel.setLeft(0);
    nameLabel.setWidth(this.__PanelSize.infoLabelWidth);
    nameLabel.setStyleProperty("line-height", sprintf("%dpx", height));
    this.__LabelNameHash.add(userData, nameLabel);
    parent.add(nameLabel);

    var infoPanel = new BiTextField();
    infoPanel.setCssClassName("eli-setting-info-panel-underLine");
    infoPanel.setId(newGuid());
    infoPanel.setUserData(userData);
    infoPanel.setLeft(nameLabel.getLeft()+nameLabel.getWidth() + this.__PanelSize.infoPanelSpace);
    infoPanel.setTop(0);
    infoPanel.setBottom(0);
    infoPanel.setRight(0);
    infoPanel.setStyleProperty("line-height", sprintf("%dpx", height));
    infoPanel.setReadOnly(true);
    this.__LabelInfoHash.add(userData, infoPanel);
    parent.add(infoPanel);
    return infoPanel;
};


CSettingMainPanel.prototype._createSinglePasswordPanel = function(userData, labelName, top, left, size, text)
{
    var panel = new BiComponent();
    panel.setId(newGuid());
    panel.setUserData(userData);
    panel.setCssClassName("eli-campaign-main-panel");
    panel.setLeft(left);
    panel.setTop(top);
    panel.setWidth(size.Width);
    panel.setHeight(size.Height);
    this.__InfoPanelHash.add(userData, panel);
    this.add(panel);
    this._createPasswordInfoPanel(userData, labelName, size.Height , panel, text);
    this._computeLastPanelBottom(panel, this.__PanelSpace, top);
};

CSettingMainPanel.prototype._createPasswordInfoPanel = function(userData, name, height, parent, text)
{
    var nameLabel = new BiLabel();
    nameLabel.setCssClassName("eli-setting-label-text");
    nameLabel.setId(newGuid());
    nameLabel.setUserData(userData);
    nameLabel.setText(name);
    nameLabel.setTop(0);
    nameLabel.setBottom(0);
    nameLabel.setLeft(0);
    nameLabel.setWidth(this.__PanelSize.infoLabelWidth);
    nameLabel.setStyleProperty("line-height", sprintf("%dpx", height));
    this.__LabelNameHash.add(userData, nameLabel);
    parent.add(nameLabel);

    var infoPanel = new BiPasswordField();
    infoPanel.setCssClassName("eli-setting-info-panel-underLine");
    infoPanel.setId(newGuid());
    infoPanel.setUserData(userData);
    infoPanel.setLeft(nameLabel.getLeft()+nameLabel.getWidth() + this.__PanelSize.infoPanelSpace);
    infoPanel.setTop(0);
    infoPanel.setBottom(0);
    infoPanel.setRight(0);
    infoPanel.setHtmlProperty("placeholder", text);
    infoPanel.setStyleProperty("line-height", sprintf("%dpx", height));

    infoPanel.setReadOnly(true);
    this.__LabelInfoHash.add(userData, infoPanel);
    parent.add(infoPanel);
    return infoPanel;
};


CSettingMainPanel.prototype._createImageLabel = function(userData,labelName, top,left,size)
{
    var imagePanel = new BiComponent();
    imagePanel.setId(newGuid());
    imagePanel.setCssClassName("eli-campaign-main-panel");
    imagePanel.setUserData(userData);
    imagePanel.setLeft(left);
    imagePanel.setTop(top);
    imagePanel.setWidth(size.Width);
    imagePanel.setHeight(size.Height);

    this.add(imagePanel);

    var nameLabel = new BiLabel();
    nameLabel.setId(newGuid());
    nameLabel.setCssClassName("eli-setting-label-text");
    nameLabel.setText(labelName);
    nameLabel.setUserData(userData);
    nameLabel.setLeft(0);
    nameLabel.setTop(0);
    nameLabel.setBottom(0);
    nameLabel.setWidth(this.__PanelSize.infoLabelWidth);
    nameLabel.setStyleProperty("line-height", sprintf("%dpx", size.Height));

    imagePanel.add(nameLabel);

    var imageView = new BiComponent();
    imageView.setId(newGuid());
    imageView.setCssClassName("eli-setting-business-image");
    imageView.setUserData(userData);
    imageView.setTop(0);
    imageView.setBottom(0);
    imageView.setRight(0);
    imageView.setLeft(nameLabel.getLeft() + nameLabel.getWidth() + this.__PanelSize.infoPanelSpace);
    /*imageView.addEventListener("click", function () {
        this._onImageClick(true);
    }, this);*/

    this.__LabelInfoHash.add(userData, imageView);
    imagePanel.add(imageView);

    this._computeLastPanelBottom(imagePanel, this.__PanelSpace, top);
};

CSettingMainPanel.prototype._ImagePreviewer = function(top, left, width, height)
{

    this.__ImagePreviewer = new BiComponent();
    this.__ImagePreviewer.setId(newGuid());
    this.__ImagePreviewer.setCssClassName("eli-setting-business-image-preview");
    this.__ImagePreviewer.setTop(top);
    this.__ImagePreviewer.setLeft(left);
    this.__ImagePreviewer.setWidth(width);
    this.__ImagePreviewer.setHeight(height);
    this.__ImagePreviewer.setVisible(false);
    this.__ImagePreviewer.setZIndex(1000);
    this.add(this.__ImagePreviewer);

    this.__CloseButton = new BiComponent();
    this.__CloseButton.setId(newGuid());
    this.__CloseButton.setCssClassName("eli-login-close-image");
    this.__CloseButton.setTop(0);
    this.__CloseButton.setRight(0);
    this.__CloseButton.setWidth(20);
    this.__CloseButton.setHeight(20);
    this.__CloseButton.addEventListener("click", function () {
        this._onCloseButtonClick(false);
    }, this);
    this.__ImagePreviewer.add(this.__CloseButton);

    this.__ImagePanel = new BiComponent();
    this.__ImagePanel.setId(newGuid());
    this.__ImagePanel.setCssClassName("eli-setting-business-image-preview");
    this.__ImagePanel.setTop(this.__CloseButton.getTop() + this.__CloseButton.getHeight());
    this.__ImagePanel.setLeft(0);
    this.__ImagePanel.setRight(0);
    this.__ImagePanel.setBottom(0);
    this.__ImagePreviewer.add(this.__ImagePanel)
};

CSettingMainPanel.prototype._onCloseButtonClick = function(flag)
{
    this.__ImagePreviewer.setVisible(flag);
};

CSettingMainPanel.prototype._onImageClick = function(flag)
{
    this.__ImagePreviewer.setVisible(flag);
};

CSettingMainPanel.prototype._updateAccountFields = function(phone, email, accountBalance,
                                                            companyName, companyAddress, businessLicence,imgURL)
{
    this.__AccountFields.phone = phone;
    this.__AccountFields.email = email;
    this.__AccountFields.accountBalance = accountBalance;
    this.__AccountFields.companyName = companyName;
    this.__AccountFields.companyAddress = companyAddress;
    this.__AccountFields.businessLicence = businessLicence;
    this.__AccountFields.imgURL = imgURL;
};

CSettingMainPanel.prototype._getAccountCallBack = function(response)
{
    var errorCode = parseInt(response.errorCode);
    if(0 == errorCode)
    {
        var phone = response.data.RECORDS[0][3];
        var email = response.data.RECORDS[0][5];
        var accountBalance = response.data.RECORDS[0][17];
        var companyName = response.data.RECORDS[0][13];
        var companyAddress = response.data.RECORDS[0][14];
        var businessLicence = response.data.RECORDS[0][11];
        var imgURL = response.data.RECORDS[0][23];
        var settingMainPanel = this.__Parent;
        settingMainPanel._updateAccountFields(
            phone,
            email,
            accountBalance,
            companyName,
            companyAddress,
            businessLicence,
            imgURL
        );

        var labelInfoHash = settingMainPanel.getLabelInfoHash();
        var userData = settingMainPanel.getUserData();
        var accountFields = settingMainPanel.getAccountFields();
        settingMainPanel.updatePanelText(labelInfoHash, userData, accountFields);
    }
};

CSettingMainPanel.prototype.getLabelInfoHash = function()
{
    return this.__LabelInfoHash;
};

CSettingMainPanel.prototype.getUserData = function()
{
    return this.__UserData;
};

CSettingMainPanel.prototype.getAccountFields = function()
{
    return this.__AccountFields;
};

CSettingMainPanel.prototype.updatePanelText = function(labelInfoHash, userData, accountFields)
{
    this.__AccountCellPhone = accountFields.phone;
    labelInfoHash.item(userData.phone).setText(accountFields.phone);
    labelInfoHash.item(userData.email).setText(accountFields.email);
    labelInfoHash.item(userData.accountBalance).setText(accountFields.accountBalance);
    labelInfoHash.item(userData.companyName).setText(accountFields.companyName);
    labelInfoHash.item(userData.companyAddress).setText(accountFields.companyAddress);
    //labelInfoHash.item(userData.businessLicence).setText(accountFields.businessLicence);
    labelInfoHash.item(userData.businessLicence).setBackgroundImage(accountFields.imgURL);
};

CSettingMainPanel.prototype._createButton = function(userData, left, top, width, height, text)
{
    var button = new BiLabel();
    button.setId(newGuid());
    button.setCssClassName("eli-setting-button");
    button.setUserData(userData);
    button.setText(text);
    button.setLeft(left);
    button.setTop(top);
    button.setWidth(width);
    button.setHeight(height);
    button.setStyleProperty("line-height", sprintf("%dpx", height));
    button.addEventListener("click", function () {
        this._onButtonClick(userData);
    }, this);
    this.__ButtonHash.add(userData, button);

    this.add(button);
    //this._computeLastPanelBottom(button, this.__PanelSpace, top);

    return button;
};


CSettingMainPanel.prototype._onModifyButtonClick = function()
{

};

CSettingMainPanel.prototype._onButtonClick = function(userData)
{
    switch (userData)
    {
        case this.__UserData.modifyButton:
            this._changeAccountButtonStatus(false);
            break;

        case this.__UserData.updateButton:
            //alert(userData);
            this._changeAccountButtonStatus(true);
            break;
        case this.__UserData.modifyPassword:
            this._changeModifyPasswordStatus(false);
            this._changeText(this.__UpdatePasswordButton, this.__Content.updatePassword);
            break;
        case  this.__UserData.updatePassword:
            this._updatePasswordInfo();
            break;
        default :
            //alert("error");
            break;
    }
};

CSettingMainPanel.prototype._initVerification = function()
{
    if(!this.__Verification)
    {
        this.__Verification = new CVerification();
        this.__Verification.initObject(this.__EliApplication);
    }
};

CSettingMainPanel.prototype._SMSCodeCheck = function()
{
    var token = this.__VerificationCodePanel.getVerificationToken();
    var code = this.__VerificationCodePanel.getVerificationCode();
    this.__VerificationCodePanel.checkVerificationCode(token, code);

};

CSettingMainPanel.prototype._updatePasswordInfo = function()
{
    var ret = this._checkPassword();
    if(!ret)
    {
        return false;
    }
    this._SMSCodeCheck();
    /*if(!checkCodeStatus)
    {
        this.__VerificationCodePanel.updateVerificationCodeMsg(ConstSettingContent.CheckVerificationCodeError.Chinese);
        return;
    }*/
};

CSettingMainPanel.prototype._checkPassword = function()
{
    this._initVerification();
    this.__ChangePasswordStatus = true;
    var oldPasswordLabel = this.__LabelInfoHash.item(this.__UserData.currentPasswordLabel);
    var oldPasswordText = oldPasswordLabel.getText();
    var msg = this.__Verification.checkPassword(oldPasswordText);
    if(0 != msg)
    {
        this.__ChangePasswordStatus = false;
        this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.oldPasswordMsg), msg);
        return false;
    }
    this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.oldPasswordMsg), "");

    var firstPasswordLabel = this.__LabelInfoHash.item(this.__UserData.inputNewPasswordLabel);
    var firstPasswordText = firstPasswordLabel.getText();
    msg = this.__Verification.checkPassword(firstPasswordText);
    if(0 != msg)
    {
        this.__ChangePasswordStatus = false;
        this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.firstNewPasswordMsg), msg);
        return false;
    }
    this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.firstNewPasswordMsg), "");

    var secondPasswordLabel = this.__LabelInfoHash.item(this.__UserData.inputAgainPasswordLabel);
    var secondPasswordText = secondPasswordLabel.getText();
    msg = this.__Verification.checkPassword(secondPasswordText);
    if(0 != msg)
    {
        this.__ChangePasswordStatus = false;
        this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.secondNewPasswordMsg), msg);
        return false;
    }

    this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.secondNewPasswordMsg), "");

    if(firstPasswordText !== secondPasswordText)
    {
        this.__ChangePasswordStatus = false;
        this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.secondNewPasswordMsg),
            this.__Content.changePasswordNotSame);
        return false;
    }
    this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.secondNewPasswordMsg), "");

    this.__FirstNewPassword = firstPasswordText;
    this.__OldPassword = oldPasswordText;

    return true;
};

CSettingMainPanel.prototype._changePassword = function()
{
    if(!this.__ChangePasswordStatus)
    {
        return false;
    }

    var accessToken = this.__EliApplication.getAccessToken();

    this.__AccountInfo.changePassword(
        this.__OldPassword,
        this.__FirstNewPassword,
        accessToken,
        this.__CallTag,
        this._changePasswordCallBack
    );
};

CSettingMainPanel.prototype._updateSuccessStatus = function()
{
    this._changeModifyPasswordStatus(true);
    this._changeText(this.__UpdatePasswordButton, this.__Content.updateSuccess);
};

CSettingMainPanel.prototype._clearInputText = function()
{
    var msgKeys = this.__MsgLabelHash.getKeys();
    for(var i = 0; i<msgKeys.length; i++)
    {
        this.__MsgLabelHash.item(msgKeys[i]).setText("");
    }

    this.__LabelInfoHash.item(this.__UserData.currentPasswordLabel).setText("");
    this.__LabelInfoHash.item(this.__UserData.inputNewPasswordLabel).setText("");
    this.__LabelInfoHash.item(this.__UserData.inputAgainPasswordLabel).setText("");

    this.__VerificationCodePanel.clearInputText();
    this.__VerificationCodePanel.updateSubmitButton(ConstSettingContent.SendVerificationCode.Chinese);
};

CSettingMainPanel.prototype._changePasswordCallBack = function(response)
{
    var errorCode = parseInt(response.errorCode);
    if(0 == errorCode)
    {
        this.__Parent._updateSuccessStatus();
        this.__Parent._clearInputText();
    }
    else{
        var msg = this.getErrorCodeHash().item(errorCode);
        this.__Parent._updateOldPasswordMsg(msg);
        this.__Parent._updateCheckVerification();

    }
};

CSettingMainPanel.prototype._updateCheckVerification = function()
{
    this.__VerificationCodePanel.clearText();
    this.__VerificationCodePanel.updateSuccessVisible(false);
    this.__VerificationCodePanel.updateSubmitButton(ConstSettingContent.SendVerificationCodeAgain.Chinese);
};

CSettingMainPanel.prototype._updateOldPasswordMsg = function(msg)
{
    this._updateCheckMsg(this.__MsgLabelHash.item(this.__UserData.oldPasswordMsg), msg);
};

CSettingMainPanel.prototype._updateCheckMsg = function(label, text)
{
    label.setText(text);
    label.setVisible(true);
};

CSettingMainPanel.prototype._createCutLine = function(userData, top, left, right, height)
{
    var line = new BiComponent();
    line.setId(newGuid());
    line.setCssClassName("eli-campaign-line-component");
    line.setRight(right);
    line.setHeight(height);
    line.setLeft(left);
    line.setTop(top);
    this.add(line);
    this._computeLastPanelBottom(line, 30, top);
};

CSettingMainPanel.prototype._changeAccountButtonStatus = function(flag)
{
    this.__ModifyButton.setEnabled(flag);
    this.__SubmitButton.setEnabled(!flag);
};

CSettingMainPanel.prototype._changeModifyPasswordStatus = function(flag)
{
    this.__ModifyPasswordButton.setEnabled(flag);
    this.__UpdatePasswordButton.setEnabled(!flag);
    this.__LabelInfoHash.item(this.__UserData.currentPasswordLabel).setReadOnly(flag);
    this.__LabelInfoHash.item(this.__UserData.inputNewPasswordLabel).setReadOnly(flag);
    this.__LabelInfoHash.item(this.__UserData.inputAgainPasswordLabel).setReadOnly(flag);
    this.__VerificationCodePanel.updateSMSComponentStatusAndData(flag, this.__AccountCellPhone);
};

CSettingMainPanel.prototype._changeText = function(label, text)
{
    label.setText(text);
};

CSettingMainPanel.prototype.setAccountFields = function()
{

};













