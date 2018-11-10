/**
 * Created by yangtian on 16/9/04.
 */

function CDashboardComponent()
{
    BiComponent.call(this);
    this.setCssClassName("eli-ad-platform-main");
    this.setLeft(0);
    this.setRight(0);
    this.setTop(0);
    this.setBottom(0);

    this.__MainHeadPanelHeight = 60;
    this.__TabBarPanelWidth = 320;
    this.__TabBarPanelHeight = 40;
    this.__TabBarPanelLeft = 20;
    this.__TabBarPanelTop = 10;

    this.__BasicButtonWidth = 80;
    this.__PublisherButtonWidth = 100;

    this.__basicButtonText = "概览";
    this.__publisherText = "媒体指标";
    this.__demographicsText = "人群指标";

    this.__ButtonName = {
        basic : "basic",
        publisher : "publisher",
        demographics : "demographics"
    };

    this.__MainHeadPanel = null;
    this.__TabBarPanel = null;

    this.__ButtonHash = new BiHashTable();
    this.__CurrentButton = null;
}

CDashboardComponent.prototype = new BiComponent;
CDashboardComponent.prototype._className = "CDashboardComponent";

CDashboardComponent.prototype.initObject = function (eliApplication)
{
    this.__EliApplication = eliApplication;
    this._init();
};

CDashboardComponent.prototype._init = function()
{
    this._initMainHeadPanel();
    this._initTabPanel();
    this._initBasicButton();
    //this._initPublisherButton();
    //this._initDemographicsButton();
    this._initGraphComponent();
    this._initDashboardNoDataPanel();
};

CDashboardComponent.prototype._initMainHeadPanel = function()
{
    this.__MainHeadPanel = new BiComponent();
    this.__MainHeadPanel.setId(newGuid());
    this.__MainHeadPanel.setCssClassName("eli-dashboard-head-panel");
    this.__MainHeadPanel.setLeft(0);
    this.__MainHeadPanel.setRight(0);
    this.__MainHeadPanel.setTop(0);
    this.__MainHeadPanel.setHeight(this.__MainHeadPanelHeight);

    this.add(this.__MainHeadPanel);
};

CDashboardComponent.prototype._initTabPanel = function()
{
    this.__TabBarPanel = new BiComponent();
    this.__TabBarPanel.setId(newGuid());
    this.__TabBarPanel.setCssClassName("eli-dashboard-tab-bar-panel");
    this.__TabBarPanel.setLeft(this.__TabBarPanelLeft);
    this.__TabBarPanel.setWidth(this.__TabBarPanelWidth);
    this.__TabBarPanel.setHeight(this.__TabBarPanelHeight);
    this.__TabBarPanel.setTop(this.__TabBarPanelTop);

    this.__MainHeadPanel.add(this.__TabBarPanel);
};

CDashboardComponent.prototype._initBasicButton = function()
{
    this.__BasicButton = new BiLabel();
    this.__BasicButton.setId(newGuid());
    this.__BasicButton.setCssClassName("eli-tab-bar-text-select");
    this.__BasicButton.setUserData(this.__ButtonName.basic);
    this.__BasicButton.setText(this.__basicButtonText);
    this.__BasicButton.setLeft(0);
    this.__BasicButton.setTop(0);
    this.__BasicButton.setBottom(0);
    this.__BasicButton.setWidth(this.__BasicButtonWidth);
    this.__BasicButton.setStyleProperty("line-height", sprintf("%dpx", this.__TabBarPanelHeight));

    this.__BasicButton.addEventListener("click", function () {
        this._onButtonClick(this.__BasicButton.getUserData());
    }, this);
    this.__TabBarPanel.add(this.__BasicButton);
    this.__ButtonHash.add(this.__BasicButton.getUserData(), this.__BasicButton);
    this.__CurrentButton = this.__BasicButton;

    this.__TabBarPanel.setWidth(this.__BasicButton.getWidth());
};

CDashboardComponent.prototype._initPublisherButton = function()
{
    this.__PublisherButton = new BiLabel();
    this.__PublisherButton.setId(newGuid());
    this.__PublisherButton.setCssClassName("eli-tab-bar-text");
    this.__PublisherButton.setUserData(this.__ButtonName.publisher);
    this.__PublisherButton.setText(this.__publisherText);
    this.__PublisherButton.setLeft(this.__BasicButton.getLeft()+this.__BasicButton.getWidth());
    this.__PublisherButton.setTop(0);
    this.__PublisherButton.setBottom(0);
    this.__PublisherButton.setWidth(this.__PublisherButtonWidth);
    this.__PublisherButton.setStyleProperty("line-height", sprintf("%dpx", this.__TabBarPanelHeight));

    this.__PublisherButton.addEventListener("click", function() {
        this._onButtonClick(this.__PublisherButton.getUserData());
    }, this);
    this.__TabBarPanel.add(this.__PublisherButton);

    this.__ButtonHash.add(this.__PublisherButton.getUserData(), this.__PublisherButton);

};

CDashboardComponent.prototype._initDemographicsButton = function()
{
    this.__DemographicsButton = new BiLabel();
    this.__DemographicsButton.setId(newGuid());
    this.__DemographicsButton.setCssClassName("eli-tab-bar-text");
    this.__DemographicsButton.setUserData(this.__ButtonName.demographics);
    this.__DemographicsButton.setText(this.__demographicsText);
    this.__DemographicsButton.setLeft(this.__PublisherButton.getLeft()+this.__PublisherButton.getWidth());
    this.__DemographicsButton.setRight(0);
    this.__DemographicsButton.setTop(0);
    this.__DemographicsButton.setBottom(0);
    this.__DemographicsButton.setStyleProperty("line-height", sprintf("%dpx", this.__TabBarPanelHeight));

    this.__DemographicsButton.addEventListener("click", function() {
        this._onButtonClick(this.__DemographicsButton.getUserData());
    }, this);
    this.__TabBarPanel.add(this.__DemographicsButton);

    this.__ButtonHash.add(this.__DemographicsButton.getUserData(), this.__DemographicsButton);
};

CDashboardComponent.prototype._onButtonClick = function(name)
{
    this._updateButtonStyle(name);
    var flag = false;
    if(name == this.__ButtonName.basic)
    {
        flag = true;
    }
    else
    {
        flag = false;
    }

    this.__GraphComponent.setAccountChartsVisible(flag);
};

CDashboardComponent.prototype._updateButtonStyle = function(name)
{
    this.__CurrentButton.setCssClassName("eli-tab-bar-text");
    this.__CurrentButton = this.__ButtonHash.item(name);
    this.__CurrentButton.setCssClassName("eli-tab-bar-text-select");
};

CDashboardComponent.prototype._initGraphComponent = function()
{
    this.__GraphComponent = new CDashboardChartComponent();
    this.__GraphComponent.initObject(this.__EliApplication, this);
    this.__GraphComponent.setCssClassName("eli-dashboard-graph-component");
    this.__GraphComponent.setTop(this.__MainHeadPanelHeight);
    this.__GraphComponent.setLeft(20);
    this.__GraphComponent.setRight(10);
    this.__GraphComponent.setBottom(20);
    this.add(this.__GraphComponent);
};

CDashboardComponent.prototype._initDashboardNoDataPanel = function()
{
    if(!this.__DashboardNoDataPanel)
    {
        this.__DashboardNoDataPanel = new CReportNoDataComponent();
        this.__DashboardNoDataPanel.initObject(this);
        this.__DashboardNoDataPanel.setLeft(0);
        this.__DashboardNoDataPanel.setTop(0);
        this.__DashboardNoDataPanel.setRight(0);
        this.__DashboardNoDataPanel.setHeight(0);
        this.__DashboardNoDataPanel.setVisible(false);
        this.add(this.__DashboardNoDataPanel);
    }
};

CDashboardComponent.prototype.updateDashboardChartPanelVisible = function(flag)
{
    this.__DashboardNoDataPanel.setVisible(flag);
    this.__GraphComponent.setVisible(!flag)
};

CDashboardComponent.prototype.updateAccountData = function(accountFields, accountDataObject)
{
    this.__GraphComponent.updateAccountChartsData(accountFields, accountDataObject);
};