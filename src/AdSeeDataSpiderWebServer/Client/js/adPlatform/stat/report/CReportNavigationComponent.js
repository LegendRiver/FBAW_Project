/**
 * Created by yangtian on 16/10/27.
 */
function CReportNavigationComponent()
{
    BiHBox.call(this);

    this.__LevelName = ["allCampaign", "campaign", "publisher"];

    this.__PanelSize = {
        allCampaignWidth : 150,
        levelHeight : 40,
    };

    this.__LastPanelLeft = 0;
    this.__SeparatorHash = new BiHashTable();
}

CReportNavigationComponent.prototype = new BiHBox;
CReportNavigationComponent.prototype._className = "CReportNavigationComponent";

CReportNavigationComponent.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;

    this._init();
};

CReportNavigationComponent.prototype._init = function()
{
    this._allCampaignLevel(this.__LastPanelLeft);
    this._campaignLevel(this.__LastPanelLeft);
    this._publisherLevel(this.__LastPanelLeft);
};

CReportNavigationComponent.prototype._levelSeparator = function(userData, left)
{
    var separator = new BiLabel();
    separator.setCssClassName("eli-level-navigation-separator");
    separator.setText("/");
    separator.setUserData(userData);
    separator.setLeft(left);
    separator.setWidth(this.__PanelSize.levelHeight);
    separator.setTop(0);
    separator.setBottom(0);
    separator.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.levelHeight));
    this.add(separator);
    this.__SeparatorHash.add(userData, separator);

    this.__LastPanelLeft = left + separator.getWidth();
};

CReportNavigationComponent.prototype._allCampaignLevel = function(left)
{
    this.__AllCampaign = new BiLabel();
    this.__AllCampaign.setUserData(this.__LevelName[0]);
    this.__AllCampaign.setText("全部计划");
    this.__AllCampaign.setCssClassName("eli-level-navigation-label");
    this.__AllCampaign.setLeft(left);
    this.__AllCampaign.setTop(0);
    this.__AllCampaign.setBottom(0);
    this.__AllCampaign.setWidth(this.__PanelSize.allCampaignWidth);
    this.__AllCampaign.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.levelHeight));
    this.__AllCampaign.addEventListener("click", function () {
        this._onButtonClick(this.__AllCampaign.getUserData());
    }, this);
    this.add(this.__AllCampaign);
    this.__LastPanelLeft = left + this.__AllCampaign.getWidth();

    this._levelSeparator(this.__AllCampaign.getUserData(), this.__LastPanelLeft);
};

CReportNavigationComponent.prototype._campaignLevel = function(left)
{
    this.__CampaignLevel = new BiLabel();
    this.__CampaignLevel.setUserData(this.__LevelName[1]);
    this.__CampaignLevel.setCssClassName("eli-level-navigation-label");
    this.__CampaignLevel.setLeft(left);
    this.__CampaignLevel.setWidth(this.__PanelSize.allCampaignWidth);
    this.__CampaignLevel.setTop(0);
    this.__CampaignLevel.setBottom(0);
    this.__CampaignLevel.setVisible(false);
    this.__CampaignLevel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.levelHeight));
    this.__CampaignLevel.addEventListener("click", function () {
        this._onButtonClick(this.__CampaignLevel.getUserData());
    }, this);
    this.add(this.__CampaignLevel);
    this.__LastPanelLeft = left + this.__CampaignLevel.getWidth();

    this._levelSeparator(this.__CampaignLevel.getUserData(), this.__LastPanelLeft);
};

CReportNavigationComponent.prototype._publisherLevel = function(left)
{
    this.__PublisherLevel = new BiLabel();
    this.__PublisherLevel.setUserData(this.__LevelName[2]);
    this.__PublisherLevel.setCssClassName("eli-level-navigation-label");
    this.__PublisherLevel.setLeft(left);
    this.__PublisherLevel.setWidth(this.__PanelSize.allCampaignWidth);
    this.__PublisherLevel.setTop(0);
    this.__PublisherLevel.setBottom(0);
    this.__PublisherLevel.setVisible(false);
    this.__PublisherLevel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.levelHeight));
    this.add(this.__PublisherLevel);
    this.__LastPanelLeft = left + this.__PublisherLevel.getWidth();
};

CReportNavigationComponent.prototype._onButtonClick = function(userData)
{
    switch (userData) {
        case this.__LevelName[0] :
            this.__Parent.setPanelVisible(false);
            this.__CampaignLevel.setVisible(false);
            this.__CampaignLevel.setText("");
            this.__PublisherLevel.setVisible(false);
            this.__PublisherLevel.setText("");
            this.__Parent.setDateComponentVisible(true);
            this.__Parent.setNoDataPanelVisible(false);

            break;
        case this.__LevelName[1] :
            this.__Parent.getPublisherComponent().setVisible(true);
            this.__Parent.getPublisherComponent().updatePublisherChartVisible(false);
            this.__Parent.getPublisherComponent().updatePublisherTableVisible(true);
            this.__Parent.getPublisherComponent().updatePanelHeight(false);
            this.__PublisherLevel.setVisible(false);
            this.__PublisherLevel.setText("");
            this.updatePublisherTable();
            break;
        default :
            break;
    }

    //this.__Parent.setNoDataPanelVisible(false);
};


CReportNavigationComponent.prototype.updateCampaignLevelName = function(text, flag)
{
    this.__CampaignLevel.setText(text);
    this.__CampaignLevel.setVisible(flag);
    this.__SeparatorHash.item(this.__CampaignLevel.getUserData()).setVisible(flag);
    this.__PublisherLevel.setVisible(false);
    this.__PublisherLevel.setText("");
};

CReportNavigationComponent.prototype.updatePublisherLevelName = function(text, flag)
{
    this.__PublisherLevel.setText(text);
    this.__PublisherLevel.setVisible(flag);
};

CReportNavigationComponent.prototype.getPanelWidth = function()
{
    return this.__LastPanelLeft;
};

CReportNavigationComponent.prototype.updatePublisherTable = function()
{
    var reportMainComponet = this.getReportMainComponent();
    reportMainComponet.publishersObjectsNoData(reportMainComponet.getPublisherObjects());
};

CReportNavigationComponent.prototype.getReportMainComponent = function()
{
    return this.__Parent.getMainComponent();
};