/**
 * Created by yangtian on 16/8/23.
 */

function CCompleteUserInfo() {
    BiDialog.call(this);
    this.__PanelWidth = 1000;
    this.__PanelHeight = 600;
    this.setWidth(this.__PanelWidth);
    this.setHeight(this.__PanelHeight);
    this.setZIndex(30);

    this.__Space = 15;
    this.__LeftSpace = 240;

    this.__CloseButtonWidth = 20;
    this.__CloseButtonHeight = this.__CloseButtonWidth;
    this.__TitlePanelWidth = 150;
    this.__TitlePanelHeight = 39;
    this.__TopPanelHeight = 40;
    this.__InfoMainPanelWidth = 800;
    this.__InfoMainPanelHeight = 40;

    this.__CompanyNamePanelWidth = 500;
    this.__CompanyNamePanelLeft = 50;
    this.__CompanyInfoLabelWidth = 150;

    this.__CompanyNameLabelWidth = 100;

    this.__SubmitButtonWidth = 100;

    this.__EliApplication = null;
    this.__RegisterContentPanel = null;

    this.__CloseButton = null;
    this.__TopPanel = null;
    this.__TitlePanel = null;

    this.__InfoMainPanel = null;
    this.__ProcessStepPanel = null;
    this.__BusinessLicencePanel = null;

    this.__CurrentStep = null;

    this.__LastPanelBottom = 0;
    this.__LastStepLabelLeft = 0;

    this.__CompleteStatus = true;

    this.__AccessToken = null;

    this.__InputLabelName = {
        companyName : "CompanyName",
        companyAddress : "CompanyAddress",
        uploadFile : "uploadFile",
    };

    this.__StepLabelName = {
        companyInfo : "CompanyInfo",
        accountCheck : "AccountCheck",
        checkSuccess : "CheckSuccess"
    };


    //image upload
    this.__fileUploadComponent = null;
    this.__Businesslicence = "";

    //companyInfoHash
    this.__InputLabelHash = new BiHashTable();
    this.__StepLabelHash = new BiHashTable();
    this.__MsgLabelHash = new BiHashTable();
    this.__SucessImgHash = new BiHashTable();



    this.__TitleContent = "请完善公司信息";
    this.__CompanyInfoLabelContent = "公司信息";
    this.__AccountCheckLabelContent = "信息审核";
    this.__AccountCheckSuccessContent = "审核成功";

    this.__CompanyNameContent = "公司名称";
    this.__CompanyNameInputHolder = "请输入公司名称全称";
    this.__CompanyAddressContent = "公司地址";
    this.__CompanyAddressInputHolder = "请输入公司详细地址：省市县街道门牌号";
    this.__BusinessLicenceContent = "营业执照";
    this.__BusinessLicenceInputHolder = "请上传公司营业执照彩色照片";
    this.__SubmitButtonContent = "提交审核";
    this.__ModifyButtonContent = "编辑信息";

    this.__FileName = "";
    this.__FileId = "";

}

CCompleteUserInfo.prototype = new BiDialog;
CCompleteUserInfo.prototype._className = "CCompleteUserInfo";

CCompleteUserInfo.prototype.initObject = function (eliApplication) {
    this.__EliApplication = eliApplication;
    this._initELiAccount();
    this._initVerification();
    this.__setAccessToken(this.__EliApplication.getAccessToken());
    this._init();
};

CCompleteUserInfo.prototype._initELiAccount = function()
{
    if(!this.__EliAccount)
    {
        this.__EliAccount = new CEliAccount();
        this.__EliAccount.initObject(this.__EliApplication);
    }
};

CCompleteUserInfo.prototype._initVerification = function()
{
    if(!this.__Verification)
    {
        this.__Verification = new CVerification();
        this.__Verification.initObject(this.__EliApplication);
    }
    this.__ErrorCode = this.__Verification.getErrorCode();
    this.__ErrorMsg = this.__Verification.getErrorMsg();
};

CCompleteUserInfo.prototype._init = function () {
    this.__RegisterContentPanel = this.getContentPane();
    this.__RegisterContentPanel.setId(newGuid());
    this.__RegisterContentPanel.setCssClassName("eli-login-main-panel");

    this._initTopPanel();
    this._initCloseButton();
    this._initTitlePanel();
    this._initInfoMainPanel();
    this._initProcessStepPanel();
    this.__LastPanelBottom = this.__LastPanelBottom + 50;

    // companyName
    this._initLabelPanel(this.__InputLabelName.companyName, this.__LastPanelBottom,
        this.__CompanyNameContent, this.__CompanyNameInputHolder);

    // CompanyAddress

    this._initLabelPanel(this.__InputLabelName.companyAddress, this.__LastPanelBottom,
        this.__CompanyAddressContent, this.__CompanyAddressInputHolder);

    //this._initCompanyNamePanel();
    //this._initCompanyAddressPanel();
    this._initBusinessLicencePanel();
    this._initSubmitButton();
};

CCompleteUserInfo.prototype._initTopPanel = function () {
    this.__TopPanel = new BiComponent();
    this.__TopPanel.setId(newGuid());
    this.__TopPanel.setCssClassName("eli-complete-panel");
    this.__TopPanel.setLeft(10);
    this.__TopPanel.setRight(0);
    this.__TopPanel.setTop(0);
    this.__TopPanel.setHeight(this.__TopPanelHeight);
    this.__RegisterContentPanel.add(this.__TopPanel);
};

CCompleteUserInfo.prototype._initCloseButton = function () {
    this.__CloseButton = new BiComponent();
    this.__CloseButton.setId(newGuid());
    this.__CloseButton.setCssClassName("eli-login-close-image");
    this.__CloseButton.setWidth(this.__CloseButtonWidth);
    this.__CloseButton.setHeight(this.__CloseButtonHeight);
    this.__CloseButton.setTop(5);
    this.__CloseButton.setRight(0);
    this.__CloseButton.addEventListener("click", function () {
        this._onCloseButtonClick();
    }, this);
    this.__TopPanel.add(this.__CloseButton);
};

CCompleteUserInfo.prototype._onCloseButtonClick = function () {
    this.setVisible(false);
};

CCompleteUserInfo.prototype._initTitlePanel = function () {
    this.__TitlePanel = new BiLabel();
    this.__TitlePanel.setId(newGuid());
    this.__TitlePanel.setCssClassName("eli-login-button-text");
    this.__TitlePanel.setWidth(this.__TitlePanelWidth);
    this.__TitlePanel.setHeight(this.__TitlePanelHeight);
    this.__TitlePanel.setTop(0);
    this.__TitlePanel.setLeft(0);
    this.__TitlePanel.setText(this.__TitleContent);
    this.__TitlePanel.setStyleProperty("line-height", sprintf("%dpx", this.__TitlePanelHeight));
    this.__TopPanel.add(this.__TitlePanel);
};

CCompleteUserInfo.prototype._initInfoMainPanel = function () {
    this.__InfoMainPanel = new BiComponent();
    this.__InfoMainPanel.setId(newGuid());
    this.__InfoMainPanel.setCssClassName("eli-complete-step-panel");
    this.__InfoMainPanel.setTop(this.__TopPanelHeight);
    this.__InfoMainPanel.setBottom(5);
    this.__InfoMainPanel.setWidth(this.__InfoMainPanelWidth);
    this.__RegisterContentPanel.add(this.__InfoMainPanel);

};

CCompleteUserInfo.prototype._initProcessStepPanel = function()
{
    this.__ProcessStepPanel = new BiComponent();
    this.__ProcessStepPanel.setId(newGuid());
    this.__ProcessStepPanel.setCssClassName("eli-complete-step-panel");
    this.__ProcessStepPanel.setWidth(this.__InfoMainPanelWidth);
    this.__ProcessStepPanel.setHeight(this.__InfoMainPanelHeight);
    this.__ProcessStepPanel.setTop(50);
    this.__InfoMainPanel.add(this.__ProcessStepPanel);

    // companyInfo
    this._initStepInfoLabel(this.__ProcessStepPanel, this.__StepLabelName.companyInfo,
        this.__CompanyInfoLabelContent, "eli-complete-text-highlight");

    this.__CurrentStep = this.__StepLabelHash.item(this.__StepLabelName.companyInfo);

    this._initLineComponent(120, this.__InfoMainPanelHeight/2);

    // accountCheck
    this._initStepInfoLabel(this.__ProcessStepPanel, this.__StepLabelName.accountCheck,
        this.__AccountCheckLabelContent,"eli-complete-text");

    this._initLineComponent(360, this.__InfoMainPanelHeight/2);

    // checkSuccess
    this._initStepInfoLabel(this.__ProcessStepPanel, this.__StepLabelName.checkSuccess,
        this.__AccountCheckSuccessContent, "eli-complete-text");

    this.__LastPanelBottom = this.__ProcessStepPanel.getTop() + this.__ProcessStepPanel.getHeight();
};

CCompleteUserInfo.prototype._initStepInfoLabel = function(parent, userData, text, cssName)
{
    var stepLabel = new BiLabel();
    stepLabel.setId(newGuid());
    stepLabel.setCssClassName(cssName);
    stepLabel.setUserData(userData);
    stepLabel.setHeight(parent.getHeight());
    stepLabel.setWidth(this.__CompanyInfoLabelWidth);
    stepLabel.setLeft(this.__LastStepLabelLeft);
    stepLabel.setText(text);
    stepLabel.setStyleProperty("line-height", sprintf("%dpx", stepLabel.getHeight()));
    parent.add(stepLabel);
    this.__LastStepLabelLeft = this.__LastStepLabelLeft + this.__LeftSpace;
    this.__StepLabelHash.add(userData, stepLabel);
};

CCompleteUserInfo.prototype._initLineComponent = function(left, top)
{
    this.__LineComponet = new BiComponent();
    this.__LineComponet.setId(newGuid());
    this.__LineComponet.setCssClassName("eli-complete-line-component");
    this.__LineComponet.setWidth(this.__CompanyInfoLabelWidth);
    this.__LineComponet.setHeight(1);
    this.__LineComponet.setLeft(left);
    this.__LineComponet.setTop(top);
    this.__ProcessStepPanel.add(this.__LineComponet);
};

CCompleteUserInfo.prototype._initLabelPanel = function(userData, top, name, holder)
{
    var component = new BiComponent();
    component.setId(newGuid());
    component.setUserData(userData);
    component.setCssClassName("eli-complete-info-panel");
    component.setTop(top);
    component.setWidth(this.__CompanyNamePanelWidth);
    component.setHeight(this.__InfoMainPanelHeight);
    component.setLeft(this.__CompanyNamePanelLeft);
    this.__InfoMainPanel.add(component);

    var nameLabel = new BiLabel();
    nameLabel.setId(newGuid());
    nameLabel.setCssClassName("eli-complete-name-label");
    nameLabel.setText(name);
    nameLabel.setLeft(0);
    nameLabel.setTop(0);
    nameLabel.setBottom(0);
    nameLabel.setWidth(this.__CompanyNameLabelWidth);
    nameLabel.setStyleProperty("line-height", sprintf("%dpx", this.__InfoMainPanelHeight));

    component.add(nameLabel);

    var inputLabel = new BiTextField();
    inputLabel.setId(newGuid());
    inputLabel.setCssClassName("eli-login-context");
    inputLabel.setUserData(userData);
    inputLabel.setLeft(nameLabel.getLeft()+nameLabel.getWidth());
    inputLabel.setTop(0);
    inputLabel.setRight(0);
    inputLabel.setBottom(0);
    inputLabel.setHtmlProperty("placeholder", holder);
    this.__InputLabelHash.add(userData, inputLabel);
    component.add(inputLabel);

    var msgLabel = new BiLabel();
    msgLabel.setId(newGuid());
    msgLabel.setCssClassName("eli-msg-context");
    msgLabel.setUserData(userData);
    msgLabel.setLeft(component.getLeft()+ component.getWidth()+5);
    msgLabel.setTop(component.getTop());
    msgLabel.setHeight(component.getHeight());
    msgLabel.setWidth(100);
    msgLabel.setStyleProperty("line-height", sprintf("%dpx", component.getHeight()));
    this.__InfoMainPanel.add(msgLabel);
    this.__MsgLabelHash.add(userData, msgLabel);

    var successImg = new BiComponent();
    successImg.setId(newGuid());
    successImg.setCssClassName("eli-success-image");
    successImg.setUserData(userData);
    successImg.setLeft(component.getLeft()+ component.getWidth());
    successImg.setTop(component.getTop());
    successImg.setHeight(component.getHeight());
    successImg.setWidth(component.getHeight());
    successImg.setVisible(false);
    this.__InfoMainPanel.add(successImg);
    this.__SucessImgHash.add(userData,successImg);

    this.__LastPanelBottom = top + this.__InfoMainPanelHeight + this.__Space;
};

CCompleteUserInfo.prototype._initBusinessLicencePanel= function()
{
    this.__BusinessLicencePanel = new BiComponent();
    this.__BusinessLicencePanel.setId(newGuid());
    this.__BusinessLicencePanel.setCssClassName("eli-complete-info-panel");
    this.__BusinessLicencePanel.setWidth(this.__CompanyNamePanelWidth);
    this.__BusinessLicencePanel.setLeft(this.__CompanyNamePanelLeft);
    this.__BusinessLicencePanel.setHeight(this.__InfoMainPanelHeight);
    this.__BusinessLicencePanel.setTop(this.__LastPanelBottom);
    this.__InfoMainPanel.add(this.__BusinessLicencePanel);


    this.__BusinessLicenceLabel = new BiLabel();
    this.__BusinessLicenceLabel.setId(newGuid());
    this.__BusinessLicenceLabel.setText(this.__BusinessLicenceContent);
    this.__BusinessLicenceLabel.setCssClassName("eli-complete-name-label");
    this.__BusinessLicenceLabel.setWidth(this.__CompanyNameLabelWidth);
    this.__BusinessLicenceLabel.setTop(0);
    this.__BusinessLicenceLabel.setBottom(0);
    this.__BusinessLicenceLabel.setLeft(0);
    this.__BusinessLicenceLabel.setStyleProperty("line-height", sprintf("%dpx", this.__InfoMainPanelHeight));
    this.__BusinessLicencePanel.add(this.__BusinessLicenceLabel);

    this.__fileUploadComponent = new CFileUpload();
    this.__fileUploadComponent.initObject(this, this.__EliApplication);
    this.__fileUploadComponent.setCssClassName("eli-login-context");
    this.__fileUploadComponent.setTop(0);
    this.__fileUploadComponent.setLeft(this.__BusinessLicenceLabel.getWidth());
    this.__fileUploadComponent.setRight(0);
    this.__fileUploadComponent.setBottom(0);
    this.__BusinessLicencePanel.add(this.__fileUploadComponent);

    this.__fileUploadMsgLabel = new BiLabel();
    this.__fileUploadMsgLabel.setId(newGuid());
    this.__fileUploadMsgLabel.setCssClassName("eli-msg-context");
    this.__fileUploadMsgLabel.setUserData(this.__InputLabelName.uploadFile);
    this.__fileUploadMsgLabel.setLeft(this.__BusinessLicencePanel.getLeft()+ this.__BusinessLicencePanel.getWidth() + 5);
    this.__fileUploadMsgLabel.setWidth(100);
    this.__fileUploadMsgLabel.setHeight(this.__BusinessLicencePanel.getHeight());
    this.__fileUploadMsgLabel.setTop(this.__BusinessLicencePanel.getTop());
    this.__fileUploadMsgLabel.setStyleProperty("line-height", sprintf("%dpx", this.__BusinessLicencePanel.getHeight()));
    this.__InfoMainPanel.add(this.__fileUploadMsgLabel);
    this.__MsgLabelHash.add(this.__InputLabelName.uploadFile, this.__fileUploadMsgLabel);

    this.__UploadSuccessLabel = new BiComponent();
    this.__UploadSuccessLabel.setId(newGuid());
    this.__UploadSuccessLabel.setUserData(this.__InputLabelName.uploadFile);
    this.__UploadSuccessLabel.setCssClassName("eli-success-image");
    this.__UploadSuccessLabel.setLeft(this.__BusinessLicencePanel.getLeft()+ this.__BusinessLicencePanel.getWidth());
    this.__UploadSuccessLabel.setWidth(this.__BusinessLicencePanel.getHeight());
    this.__UploadSuccessLabel.setHeight(this.__BusinessLicencePanel.getHeight());
    this.__UploadSuccessLabel.setTop(this.__BusinessLicencePanel.getTop());
    this.__UploadSuccessLabel.setVisible(false);
    this.__SucessImgHash.add("uploadFile", this.__UploadSuccessLabel);
    this.__InfoMainPanel.add(this.__UploadSuccessLabel);
};

CCompleteUserInfo.prototype.setUploadSuccessLabelVisible = function(label,status)
{
    label.setVisible(status);
};

CCompleteUserInfo.prototype.getFileUploadMsgLabel = function()
{
    return this.__fileUploadMsgLabel;
};

CCompleteUserInfo.prototype.getUploadSuccessLabelHash = function()
{
    return this.__SucessImgHash;
};

CCompleteUserInfo.prototype.setSelectComponentCaller = function()
{
    this.__fileUploadComponent.setFileSelectComponentCaller();
};

CCompleteUserInfo.prototype._initSubmitButton = function()
{
    this.__SubmitButton = new BiLabel();
    this.__SubmitButton.setId(newGuid());
    this.__SubmitButton.setText(this.__SubmitButtonContent);
    this.__SubmitButton.setCssClassName("eli-complete-submit-button");
    this.__SubmitButton.setTop(this.__BusinessLicencePanel.getTop()
        + this.__BusinessLicencePanel.getHeight()+this.__Space);

    this.__SubmitButton.setWidth(this.__SubmitButtonWidth);
    this.__SubmitButton.setHeight(this.__InfoMainPanelHeight);
    this.__SubmitButton.setLeft(this.__BusinessLicencePanel.getLeft()
        +this.__CompanyNamePanelWidth-this.__SubmitButtonWidth);

    this.__SubmitButton.setStyleProperty("line-height", sprintf("%dpx", this.__InfoMainPanelHeight));

    this.__SubmitButton.addEventListener("click", function () {
        this._onSubmitButtonClick(this.__StepLabelHash.item(this.__StepLabelName.accountCheck));
    }, this);

    this.__InfoMainPanel.add(this.__SubmitButton);

    this.__ModifyButton = new BiLabel();
    this.__ModifyButton.setId(newGuid());
    this.__ModifyButton.setCssClassName("eli-complete-submit-button");
    this.__ModifyButton.setText(this.__ModifyButtonContent);
    this.__ModifyButton.setWidth(this.__SubmitButtonWidth);
    this.__ModifyButton.setHeight(this.__InfoMainPanelHeight);
    this.__ModifyButton.setLeft(this.__SubmitButton.getLeft() - this.__SubmitButton.getWidth()-15);
    this.__ModifyButton.setTop(this.__SubmitButton.getTop());
    this.__ModifyButton.setStyleProperty("line-height", sprintf("%dpx", this.__InfoMainPanelHeight));

    this.__ModifyButton.addEventListener("click", function(){
        this._onModifyButtonClick()
    }, this);

    this.__InfoMainPanel.add(this.__ModifyButton);

    this._checkCompleteStatus();

};

CCompleteUserInfo.prototype._checkCompleteStatus = function()
{
    var accountStatus = this.__EliApplication.getAccountStatus();
    if(accountStatus == 2)
    {
        this._updateStyle(this.__StepLabelHash.item(this.__StepLabelName.accountCheck));
        this._SetInputTextReadOnly(true);
    }
};

CCompleteUserInfo.prototype.setBusinessLicence = function(id)
{
    this.__Businesslicence = id;
};

CCompleteUserInfo.prototype._onSubmitButtonClick = function()
{

    this._initInputText();
    var flag = this._inputPreCheck(this.__CompanyNameInput, this.__CompanyAddressInput, this.__Businesslicence);
    if(flag)
    {
        return;
    }
    this._SetInputTextReadOnly(true);
};

CCompleteUserInfo.prototype._onModifyButtonClick = function()
{
    this._setInputStatus(false);
};

CCompleteUserInfo.prototype._setInputStatus = function(flag)
{
    this._SetInputTextReadOnly(flag);
    this.__fileUploadComponent.getUploadButton().setVisible(flag);
    this.__UploadSuccessLabel.setVisible(flag);
    this.__SucessImgHash.item(this.__InputLabelName.companyName).setVisible(flag);
    this.__SucessImgHash.item(this.__InputLabelName.companyAddress).setVisible(flag);
};

CCompleteUserInfo.prototype._SetInputTextReadOnly = function(status)
{
    this.__InputLabelHash.item(this.__InputLabelName.companyName).setReadOnly(status);
    this.__InputLabelHash.item(this.__InputLabelName.companyAddress).setReadOnly(status);
};

CCompleteUserInfo.prototype._updateStyle = function(step)
{
    this.__CurrentStep.setCssClassName("eli-complete-text");
    this.__CurrentStep = step;
    this.__CurrentStep.setCssClassName("eli-complete-text-highlight");
};

CCompleteUserInfo.prototype._initInputText = function()
{
    this.__CompanyNameInput = this.__InputLabelHash.item(this.__InputLabelName.companyName).getText();
    this.__CompanyAddressInput = this.__InputLabelHash.item(this.__InputLabelName.companyAddress).getText();
    this.__CompleteStatus = true;
};

CCompleteUserInfo.prototype._updateMsgText = function(userData, msg)
{
    this.__MsgLabelHash.item(userData).setText(msg);
};

CCompleteUserInfo.prototype.__setCompleteStatus = function(status)
{
    this.__CompleteStatus = status;
};

CCompleteUserInfo.prototype.__setAccessToken = function(accessToken)
{
    this.__AccessToken = accessToken;
};

CCompleteUserInfo.prototype.getAccessToken = function()
{
    return this.__EliApplication.getAccessToken();
};

CCompleteUserInfo.prototype._inputPreCheck = function(companyName, companyAddress, businessLicence)
{
    var msg = this.__Verification.inputCheck(companyName);

    if(msg !=0)
    {
        this._updateMsgText(this.__InputLabelName.companyName, msg);
        this.__setCompleteStatus(false);
    }

    this.__SucessImgHash.item(this.__InputLabelName.companyName).setVisible(true);

    msg = this.__Verification.inputCheck(companyAddress);
    if(msg !=0)
    {
        this._updateMsgText(this.__InputLabelName.companyAddress, msg);
        this.__setCompleteStatus(false);
    }

    this.__SucessImgHash.item(this.__InputLabelName.companyAddress).setVisible(true);

    msg = this.__Verification.uploadFileCheck(businessLicence);
    if(msg != 0)
    {
        this._updateMsgText(this.__InputLabelName.uploadFile, msg);
        this.__setCompleteStatus(false);
    }

    if(!this.__CompleteStatus)
    {
        return 1;
    }

    this.__EliAccount.completeInfo(this.__EliApplication.getAccessToken(), companyName, companyAddress
        ,"", "", "", "", businessLicence, "completeInfo", this._completeCallBackFunction);

    //this.__setAccessToken(this.__EliApplication.getAccessToken());
    return 0;
};

CCompleteUserInfo.prototype.getStepLabelHash = function()
{
    return this.__StepLabelHash;
};

CCompleteUserInfo.prototype.getStepLabelName = function()
{
    return this.__StepLabelName;
};

CCompleteUserInfo.prototype._completeCallBackFunction = function(response)
{
    var completePanel = this.__EliApplication.getAdPlatformPanel().getCompleteInfoPanel();
    var stepLabelHash = completePanel.getStepLabelHash();
    var stepLabelName = completePanel.getStepLabelName();
    var errorCode = parseInt(response.errorCode);


    if(0 == errorCode)
    {
        completePanel._updateStyle(stepLabelHash.item(stepLabelName.accountCheck));
    }
    else{

    }
};


