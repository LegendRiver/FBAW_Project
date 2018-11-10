/**
 * Created by mac on 16/9/20.
 */

function CADToolBarPanel ()
{
    BiComponent.call(this);
    this.setCssClassName("eli-page-left-panel");

    this.__ToolBarWidth = 190;

    this.setLeft(0);
    this.setTop(0);
    this.setBottom(0);
    this.setWidth(this.__ToolBarWidth);

    this.__LastToolBottom = 120;


    this.__ToolBarName =
    {
        dashboard : "dashboard",
        campaign  : "campaign",
        report    : "report",
        payment   : "payment",
        statement : "statement",
        setting  : "setting",
        help      : "help"
    };

    this.__CallTag = "CAdToolBarPanel";

    this.__DashboardComponent = null;
    this.__CampaignComponent = null;
    this.__ReportComponent = null;
    this.__PaymentComponent = null;
    this.__StatementComponent = null;
    this.__SettingComponent = null;
    this.__HelpComponent = null;

    this.__ToolComponentHash = new BiHashTable();
    this.__ToolButtonHash = new BiHashTable();
    this.__CurrentTool = null;
    this.__CurrentToolButton = null;
    this.__CampaignsInfoData = [];

    this.__PanelSize = {
        ToolLeftRight : 10,
        ToolPanelHeight : 70,
        ToolImageWidth : 58
    };
}

CADToolBarPanel.prototype = new BiComponent;
CADToolBarPanel.prototype._className = "CADToolBarPanel";

CADToolBarPanel.prototype.initObject = function (eliApplication, parent)
{
    this.__Parent = parent;
    this.__EliApplication = eliApplication;
    this.__MainPanel  = this.__EliApplication.__AdPlatformPanel.__MainPanel;
    this._init();
};

CADToolBarPanel.prototype._init = function ()
{
    this._initButtons();
    this._createToolComponent(ToolsButtonFields.Dashboard.userData);

    this.__CurrentTool = this.__DashboardComponent;
    this.__CurrentToolButton = this.__ToolButtonHash.item(ToolsButtonFields.Dashboard.userData);

    this.__CurrentToolButton.setCssClassName("eli-page-left-tool-select");

    this._initCampaignsData();
};

CADToolBarPanel.prototype._initCampaignsData = function()
{
    if(!this.__CampaignDataRequest)
    {
        this.__CampaignDataRequest = new CCampaignInfo();
        this.__CampaignDataRequest.initObject(this.__EliApplication, this);
    }
};

CADToolBarPanel.prototype._initButtons = function()
{
    // Dashboard
    this._initToolsButton(
        this.__LastToolBottom,
        ToolsButtonFields.Dashboard.userData,
        ToolsButtonFields.Dashboard.imageCss,
        ToolsButtonFields.Dashboard.Chinese
    );

    // Campaign
    this._initToolsButton(
        this.__LastToolBottom,
        ToolsButtonFields.Campaign.userData,
        ToolsButtonFields.Campaign.imageCss,
        ToolsButtonFields.Campaign.Chinese
    );

    // report
    this._initToolsButton(
        this.__LastToolBottom,
        ToolsButtonFields.Report.userData,
        ToolsButtonFields.Report.imageCss,
        ToolsButtonFields.Report.Chinese
    );

    // statement
    this._initToolsButton(
        this.__LastToolBottom,
        ToolsButtonFields.Statement.userData,
        ToolsButtonFields.Statement.imageCss,
        ToolsButtonFields.Statement.Chinese
    );

    // setting
    this._initToolsButton(
        this.__LastToolBottom,
        ToolsButtonFields.Setting.userData,
        ToolsButtonFields.Setting.imageCss,
        ToolsButtonFields.Setting.Chinese
    );

    // payment
    this._initToolsButton(
        this.__LastToolBottom,
        ToolsButtonFields.Payment.userData,
        ToolsButtonFields.Payment.imageCss,
        ToolsButtonFields.Payment.Chinese
    );

    // help
    /*this._initToolsButton(
        this.__LastToolBottom,
        ToolsButtonFields.Help.userData,
        ToolsButtonFields.Help.imageCss,
        ToolsButtonFields.Help.Chinese
    );*/
};

CADToolBarPanel.prototype._initToolsButton = function(top, userData, imageCss, text)
{
    var toolButton = new BiComponent();
    toolButton.setUserData(userData);
    toolButton.setId(newGuid());
    toolButton.setCssClassName("eli-page-left-tool");
    toolButton.setLeft(this.__PanelSize.ToolLeftRight);
    toolButton.setRight(this.__PanelSize.ToolLeftRight);
    toolButton.setHeight(this.__PanelSize.ToolPanelHeight);
    toolButton.setTop(top);

    toolButton.addEventListener("click", function () {
        this._onToolsButtonClick(userData);
    }, this);

    var buttonImage = new BiComponent();
    buttonImage.setId(newGuid());
    buttonImage.setUserData(userData);
    buttonImage.setCssClassName(imageCss);
    buttonImage.setLeft(0);
    buttonImage.setWidth(this.__PanelSize.ToolImageWidth);
    buttonImage.setTop(5);
    buttonImage.setBottom(5);
    toolButton.add(buttonImage);

    var buttonText = new BiLabel();
    buttonText.setId(newGuid());
    buttonText.setUserData(userData);
    buttonText.setCssClassName("eli-toolbar-text");
    buttonText.setText(text);
    buttonText.setLeft(buttonImage.getLeft() + buttonImage.getWidth());
    buttonText.setRight(0);
    buttonText.setTop(0);
    buttonText.setBottom(0);
    buttonText.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.ToolPanelHeight));
    toolButton.add(buttonText);

    this.add(toolButton);
    this.__ToolButtonHash.add(userData, toolButton);
    this.__LastToolBottom = this.__LastToolBottom + toolButton.getHeight();
};

CADToolBarPanel.prototype._onToolsButtonClick = function(name)
{

    this._createToolComponent(name);

    this.__CurrentTool.setVisible(false);
    this.__CurrentTool = this.__ToolComponentHash.item(name);
    this.__CurrentTool.setVisible(true);

    this.__CurrentToolButton.setCssClassName("eli-page-left-tool");
    this.__CurrentToolButton = this.__ToolButtonHash.item(name);
    this.__CurrentToolButton.setCssClassName("eli-page-left-tool-select");
};

CADToolBarPanel.prototype._createToolComponent = function(name)
{
    switch (name)
    {
        case ToolsButtonFields.Dashboard.userData :
            if(!this.__DashboardComponent)
            {
                this.__DashboardComponent = new CDashboardComponent();
                this.__DashboardComponent.initObject(this.__EliApplication);
                this.__MainPanel.add(this.__DashboardComponent);
                this.__ToolComponentHash.add(name, this.__DashboardComponent);
            }
            this.__DashboardComponent.setVisible(true);
            this.__Parent.accountInfo(this.__EliApplication.getAccessToken());
            break;

        case ToolsButtonFields.Campaign.userData :
            if(!this.__CampaignComponent)
            {
                this.__CampaignComponent = new CCampaignComponent();
                this.__CampaignComponent.initObject(this.__EliApplication);
                this.__MainPanel.add(this.__CampaignComponent);
                this.__ToolComponentHash.add(name, this.__CampaignComponent);
            }
            this.__CampaignComponent.setVisible(true);

            break;

        case ToolsButtonFields.Report.userData :
            if(!this.__ReportComponent)
            {
                this.__ReportComponent = new CReportComponent();
                this.__ReportComponent.initObject(this.__EliApplication);
                this.__MainPanel.add(this.__ReportComponent);
                this.__ToolComponentHash.add(name, this.__ReportComponent);
            }

            this.__ReportComponent.setVisible(true);
            this.__ReportComponent.updateReportInfo();
            this.__ReportComponent.initDateComponentTimeText();
            break;

        case ToolsButtonFields.Payment.userData :
            if(!this.__PaymentComponent)
            {
                this.__PaymentComponent = new CPaymentComponent();
                this.__PaymentComponent.initObject(this.__EliApplication);
                this.__MainPanel.add(this.__PaymentComponent);
                this.__ToolComponentHash.add(name, this.__PaymentComponent);
            }

            this.__PaymentComponent.setVisible(true);
            break;

        case ToolsButtonFields.Statement.userData :
            if(!this.__StatementComponent)
            {
                this.__StatementComponent = new CStatementComponent();
                this.__StatementComponent.initObject(this.__EliApplication, this);
                this.__MainPanel.add(this.__StatementComponent);
                this.__ToolComponentHash.add(name, this.__StatementComponent);
            }

            this.__StatementComponent.setVisible(true);
            break;

        case ToolsButtonFields.Setting.userData :
            if(!this.__SettingComponent)
            {
                this.__SettingComponent = new CSettingComponent();
                this.__SettingComponent.initObject(this.__EliApplication);
                this.__MainPanel.add(this.__SettingComponent);
                this.__ToolComponentHash.add(name, this.__SettingComponent);
            }

            this.__SettingComponent.setVisible(true);
            break;

        case this.__ToolBarName.help :
            if(!this.__HelpComponent)
            {
                this.__HelpComponent = new CHelpComponent();
                this.__HelpComponent.initObject(this.__EliApplication);
                this.__MainPanel.add(this.__HelpComponent);
                this.__ToolComponentHash.add(name, this.__HelpComponent);
            }

            this.__HelpComponent.setVisible(true);
            break;
        default :
    }
};

/*------get report data*/

CADToolBarPanel.prototype.getAccountFiledsData = function()
{
    return this.__AccountFields;
};

CADToolBarPanel.prototype.updateAccountFieldsData = function(accountFields)
{
    //this.__DashboardComponent.updateAccountFieldsData(accountFields);
    this.__AccountFields = accountFields;
    this.updateAccountData();
};

CADToolBarPanel.prototype.updateAccountData = function()
{
    this._getAllCampaignData();
};

CADToolBarPanel.prototype._getAllCampaignData = function()
{
    this.__CampaignDataRequest.getCampaignList(
        this.__EliApplication.getAccessToken(),
        this.__CallTag,
        this._getAllCampaignDataCallBack
    );
};

CADToolBarPanel.prototype._getAllCampaignDataCallBack = function(response)
{
    var errorCode = parseInt(response.errorCode);
    if(0 != errorCode)
    {
        return;
    }

    var dataLen = response.data.RECORDS.length;
    if(0 == dataLen)
    {
        this.__Parent.updateDashboardVisible(true);
        return;
    }


    var data = response.data.RECORDS
    this.__Parent.clearCampaignsInfo();
    this.__Parent.updateDashboardVisible(false);
    //this.__Parent._processCampaignsData(this.__Parent.getAccountFiledsData(), this.__Parent.__AllTestData);
    this.__Parent._processCampaignsData(this.__Parent.getAccountFiledsData(), data);

};

CADToolBarPanel.prototype.clearCampaignsInfo = function()
{
    this.__CampaignsInfoData = [];
};

CADToolBarPanel.prototype._processCampaignsData = function(accountFields, campaignsData)
{
    var accountDataObject = new CAccountData();
    accountDataObject.initObject(this, campaignsData);

    this.__DashboardComponent.updateAccountData(accountFields, accountDataObject)
};

CADToolBarPanel.prototype.updateDashboardVisible = function(flag)
{
    this.__DashboardComponent.updateDashboardChartPanelVisible(flag);
};
