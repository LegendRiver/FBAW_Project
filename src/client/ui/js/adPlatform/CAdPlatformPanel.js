/**
 * Created by yangtian on 16/8/23.
 */

function CAdPlatformPanel() {
    BiComponent.call(this);
    this.setCssClassName("eli-ad-platform-main");
    this.setLeft(0);
    this.setRight(0);
    this.setTop(0);
    this.setBottom(0);
    this.setZIndex(30);

    this.__PAGE_TOP_PANEL_HEIGHT = 60;
    this.__PageLeftPanelWidth = 190;
    this.__PageBottomPanelHeight = 60;
    this.__MainPanelLeft = this.__PageLeftPanelWidth;
    this.__MainPanelTop = this.__PAGE_TOP_PANEL_HEIGHT;
    this.__MainPanelBottom = this.__PageBottomPanelHeight;

    this.__LogoTop = 0;
    this.__LogoWidth = this.__PageLeftPanelWidth;
    this.__LogoHeight = this.__PAGE_TOP_PANEL_HEIGHT;
    this.__LogoLeft = 0;

    this.__ToolPanelLeft = 10;
    this.__ToolPanelHeight = 70;
    this.__ToolImageWidth = 58;
    this.__ToolImageHeight = 32;

    this.__EliApplication = null;
    this.__LogoComponent = null;
    this.__PageTopPanel = null;
    this.__PageBottomPanel = null;
    this.__MainPanel = null;
    this.__CompleteInfoPanel = null;

    //test
    this.__InfoCompleteFlag = false;

    this.__ToolButtonHash = new BiHashTable();
    this.__DashboardComponent = null;
    this.__CampaignComponent = null;

    this.__ToolBarPanel = null;
    this.__AccountFields = null;
    this.__AccountInfo = null;

}

CAdPlatformPanel.prototype = new BiComponent;
CAdPlatformPanel.prototype._className = "CAdPlatformPanel";

CAdPlatformPanel.prototype.initObject = function (eliApplication, status, token) {
    this.__EliApplication = eliApplication;
    this.__Status = status;
    this.__AccessToken = token;
    this._init();
};


CAdPlatformPanel.prototype._init = function () {

    this._initAccountInfo();
    this._initMainPanel();
    this._initPageTopPanel();
    this._initToolBarPanel();
    this._initPageBottomPanel();
    this._initCopyrightPanel();
    this._initLogoComponent();
    this._initAccountFields();

};

CAdPlatformPanel.prototype._initAccountFields = function()
{
    if(!this.__AccountFields)
    {
        this.__AccountFields = new CAccountFields();
    }
};

CAdPlatformPanel.prototype._initAccountInfo = function()
{
    if(!this.__AccountInfo)
    {
        this.__AccountInfo = new CAccountInfo();
        this.__AccountInfo.initObject(this.__EliApplication, this);
    }
};

CAdPlatformPanel.prototype.accountInfo = function(token)
{
    this.__AccessToken = token;
    this.__AccountInfo.getAccountInfo(token, "getAccount", this._getAccountCallBack);
};

CAdPlatformPanel.prototype._getAccountCallBack = function(response)
{
    var errorCode = parseInt(response.errorCode);
    var parent = this.__Parent;
        if(0 == errorCode)
        {

            var dataLen = response.data.RECORDS.length;
            if(dataLen == 0)
            {
                parent.updateDashboardVisible(true);
                return;
            }

            var accountData = response.data.RECORDS[0];
            var phone = accountData[AccountFields.CELL_PONE.Index];
            var email = accountData[AccountFields.EMAIL.Index];
            var accountBudget = accountData[AccountFields.BUDGET.Index];
            //var accountBudget = 100000;
            var companyName = accountData[AccountFields.COMPANY_NAME.Index];
            var companyAddress = accountData[AccountFields.COMPANY_ADDRESS.Index];
            var businessLicence = accountData[AccountFields.BUSINESS_LICENCE.Index];
            var imgURL = accountData[AccountFields.IMGURL.Index];

            parent._updateAccountFields(
                phone,
                email,
                accountBudget,
                companyName,
                companyAddress,
                businessLicence,
                imgURL
            );
            parent._setUserInfo(companyName);

            //parent.updateDashboardVisible(true);
            parent.updateAccountFieldsData(parent.getAccountFields());

            //var labelInfoHash = settingMainPanel.getLabelInfoHash();
            //var userData = settingMainPanel.getUserData();
            //var accountFields = settingMainPanel.getAccountFields();
            //settingMainPanel.updatePanelText(labelInfoHash, userData, accountFields);
        }
};

CAdPlatformPanel.prototype._updateAccountFields = function(phone, email, accountBudget,
                                                           companyName, companyAddress, businessLicence, imgURL)
{
    this.__AccountFields.phone = phone;
    this.__AccountFields.email = email;
    this.__AccountFields.accountBudget = accountBudget;
    this.__AccountFields.companyName = companyName;
    this.__AccountFields.companyAddress = companyAddress;
    this.__AccountFields.businessLicence = businessLicence;
    this.__AccountFields.imgURL = imgURL;
};

CAdPlatformPanel.prototype.updateAccountFieldsData = function(accountFields)
{
    this.__ToolBarPanel.updateAccountFieldsData(accountFields)
};

CAdPlatformPanel.prototype.updateDashboardVisible = function(flag)
{
    this.__ToolBarPanel.updateDashboardVisible(flag);
};

CAdPlatformPanel.prototype._initPageTopPanel = function () {
    this.__PageTopPanel = new BiComponent();
    this.__PageTopPanel.setId(newGuid());
    this.__PageTopPanel.setCssClassName("eli-page-top-panel");
    this.__PageTopPanel.setLeft(this.__PageLeftPanelWidth);
    this.__PageTopPanel.setTop(0);
    this.__PageTopPanel.setRight(0);
    this.__PageTopPanel.setHeight(this.__PAGE_TOP_PANEL_HEIGHT);
    this.add(this.__PageTopPanel);

    this._initUserInfoComponent();
};

CAdPlatformPanel.prototype._initUserInfoComponent = function()
{
    if(!this.__UserInfoComponent)
    {
        this.__UserInfoComponent = new CUserInfoComponent();
        this.__UserInfoComponent.initObject(this.__EliApplication, this);
        this.__PageTopPanel.add(this.__UserInfoComponent);
    }
};

CAdPlatformPanel.prototype._setUserInfo = function(text)
{
    this.__UserInfoComponent.setUserInfoData(text);
};

CAdPlatformPanel.prototype._initLogoComponent = function () {
    this.__LogoComponent = new BiComponent();
    this.__LogoComponent.setId(newGuid());
    this.__LogoComponent.setCssClassName("eli-platform-logo");
    this.__LogoComponent.setLeft(this.__LogoLeft);
    this.__LogoComponent.setTop(this.__LogoTop);
    this.__LogoComponent.setWidth(this.__LogoWidth);
    this.__LogoComponent.setHeight(this.__LogoHeight);
    this.add(this.__LogoComponent);
};


CAdPlatformPanel.prototype._initToolBarPanel = function()
{
    if(!this.__ToolBarPanel)
    {
        this.__ToolBarPanel = new CADToolBarPanel();
        this.__ToolBarPanel.initObject(this.__EliApplication, this);
        this.add(this.__ToolBarPanel);
    }

    this.__ToolBarPanel.setVisible(true);
};

CAdPlatformPanel.prototype._initPageBottomPanel = function () {
    this.__PageBottomPanel = new BiComponent();
    this.__PageBottomPanel.setId(newGuid());
    this.__PageBottomPanel.setCssClassName("eli-page-bottom-panel");
    this.__PageBottomPanel.setLeft(this.__PageLeftPanelWidth);
    this.__PageBottomPanel.setRight(0);
    this.__PageBottomPanel.setHeight(this.__PageBottomPanelHeight);
    this.__PageBottomPanel.setStyleProperty("bottom", "0px");
    this.add(this.__PageBottomPanel);
};

CAdPlatformPanel.prototype._initCopyrightPanel = function () {
    this.__CopyrightPanel = new CCopyRightComponent();
    this.__CopyrightPanel.initObject(this.__EliApplication);
    this.__CopyrightPanel.setLeft(0);
    this.__CopyrightPanel.setTop(0);
    this.__CopyrightPanel.setRight(0);
    this.__CopyrightPanel.setBottom(0);
    this.__PageBottomPanel.add(this.__CopyrightPanel);
};

CAdPlatformPanel.prototype._initMainPanel = function () {
    this.__MainPanel = new BiComponent();
    this.__MainPanel.setId(newGuid());
    //this.__MainPanel.setCssClassName("eli-platform-main-panel");
    this.__MainPanel.setCssClassName("eli-campaign-basic-panel");
    this.__MainPanel.setTop(this.__MainPanelTop);
    this.__MainPanel.setLeft(this.__MainPanelLeft);
    this.__MainPanel.setBottom(this.__MainPanelBottom);
    this.__MainPanel.setRight(0);
    this.add(this.__MainPanel);

    this._initCompleteUserInfoPanel();
    this.showCompleteInfoPanel(this.__Status);
};

CAdPlatformPanel.prototype.showCompleteInfoPanel = function (flag) {

    if (1 == flag) {
        this.__CompleteInfoPanel.setVisible(true);

    }
    else if(2 == flag){
        this.__CompleteInfoPanel.setVisible(false);
    }
    else {
        this.__CompleteInfoPanel.setVisible(false);
    }

    this.__CompleteInfoPanel.setSelectComponentCaller();
};

CAdPlatformPanel.prototype._initCompleteUserInfoPanel = function () {
    if (!this.__CompleteInfoPanel) {
        this.__CompleteInfoPanel = new CCompleteUserInfo();
        this.__CompleteInfoPanel.initObject(this.__EliApplication);
        this.__CompleteInfoPanel.setCentered(true);
        this.__MainPanel.add(this.__CompleteInfoPanel);
    }
};

CAdPlatformPanel.prototype.getCompleteInfoPanel = function()
{
    return this.__CompleteInfoPanel;
};

CAdPlatformPanel.prototype.getAccountFields = function()
{
    return this.__AccountFields;
};

CAdPlatformPanel.prototype.getAccountInfo = function()
{
    return this.__AccountInfo;
};

CAdPlatformPanel.prototype.getAccessToken = function()
{
    return this.__AccessToken;
};