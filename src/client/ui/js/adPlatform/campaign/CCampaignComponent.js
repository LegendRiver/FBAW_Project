/**
 * Created by yangtian on 16/9/16.
 */

function CCampaignComponent()
{
    BiComponent.call(this);
    this.setCssClassName("eli-campaign-basic-panel");
    this.setId(newGuid());
    this.setLeft(0);
    this.setRight(0);
    this.setTop(0);
    this.setBottom(0);

    this.__MainHeadPanelHeight = 60;
    this.__TabBarPanelWidth = 320;
    this.__TabBarPanelHeight = 40;
    this.__TabBarPanelLeft = 20;
    this.__TabBarPanelTop = 10;

    this.__InfoComponent = null;

    this.__mainHeadText = "请填写推广计划";
}

CCampaignComponent.prototype = new BiComponent;
CCampaignComponent.prototype._className = "CCampaignComponent";

CCampaignComponent.prototype.initObject = function(eliApplication)
{
    this.__EliApplication = eliApplication;
    this._init();
};

CCampaignComponent.prototype._init = function()
{
    this._initMainHeadPanel();
    this._initMainPanel();
};

CCampaignComponent.prototype._initMainHeadPanel = function()
{
    this.__MainHeadPanel = new BiComponent();
    this.__MainHeadPanel.setId(newGuid());
    this.__MainHeadPanel.setCssClassName("eli-dashboard-head-panel");
    this.__MainHeadPanel.setLeft(0);
    this.__MainHeadPanel.setRight(0);
    this.__MainHeadPanel.setTop(0);
    this.__MainHeadPanel.setHeight(this.__MainHeadPanelHeight);

    this.__MainHeadTextLabel = new BiLabel();
    this.__MainHeadTextLabel.setId(newGuid());
    this.__MainHeadTextLabel.setText(this.__mainHeadText);
    this.__MainHeadTextLabel.setCssClassName("eli-campaign-main-head-text");
    this.__MainHeadTextLabel.setLeft(this.__TabBarPanelLeft);
    this.__MainHeadTextLabel.setTop(this.__TabBarPanelTop);
    this.__MainHeadTextLabel.setWidth(this.__TabBarPanelWidth);
    this.__MainHeadTextLabel.setHeight(this.__TabBarPanelHeight);
    this.__MainHeadTextLabel.setStyleProperty("line-height", sprintf("%dpx", this.__TabBarPanelHeight));
    this.__MainHeadPanel.add(this.__MainHeadTextLabel);
    this.add(this.__MainHeadPanel);
};

CCampaignComponent.prototype._initMainPanel = function()
{
    /*
    this.__MainInfoPanel = new BiComponent();
    this.__MainInfoPanel.setId(newGuid());
    this.__MainInfoPanel.setCssClassName("eli-campaign-main-panel");
    this.__MainInfoPanel.setTop(this.__MainHeadPanelHeight);
    this.__MainInfoPanel.setLeft(0);
    this.__MainInfoPanel.setRight(0);
    this.__MainInfoPanel.setBottom(0);
    this.add(this.__MainInfoPanel);*/

    this._initInfoComponent();
};


CCampaignComponent.prototype._initInfoComponent = function()
{
    if(!this.__InfoComponent)
    {
        this.__InfoComponent = new CCampaignMainComponent();
        this.__InfoComponent.initObject(this.__EliApplication);
        this.__InfoComponent.setCssClassName("eli-campaign-main-panel-scroll");
        this.__InfoComponent.setLeft(0);
        this.__InfoComponent.setRight(0);
        this.__InfoComponent.setTop(this.__MainHeadPanelHeight);

        this.add(this.__InfoComponent);
    }
    this.__InfoComponent.setVisible(true);
};
