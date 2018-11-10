/**
 * Created by yangtian on 16/12/31.
 */

function CCampaignTypeComponent()
{
    BiComponent.call(this);

    this.__PanelSize = {
        componentHeight : 90,
        componentWidth : 580,
        namePanelWidth : 165,

        labelSpace : 35,
        panelSpace : 10,
    };

    this.__Options = ["app", "website"];
}

CCampaignTypeComponent.prototype = new BiComponent;
CCampaignTypeComponent.prototype._className = "CCampaignTypeComponent";

CCampaignTypeComponent.prototype.initObject = function(parent, top, left, userData, nameText)
{
    this.__Parent = parent;
    this.__Top = top;
    this.__Left = left;
    this.__UserData = userData;
    this.__NameText = nameText;
    this._init();
};

CCampaignTypeComponent.prototype._init = function()
{
    this._initNamePanel();
    this._initSelectBox();
    this._initGroupRadioBox();
    this._initComponentSize();
};

CCampaignTypeComponent.prototype._initNamePanel = function()
{
    this.__NamePanel = new BiLabel();
    this.__NamePanel.setId(newGuid());
    this.__NamePanel.setUserData(this.__UserData);
    this.__NamePanel.setCssClassName("eli-campaign-label-text");
    this.__NamePanel.setText(this.__NameText);
    this.__NamePanel.setTop(0);
    this.__NamePanel.setBottom(0);
    this.__NamePanel.setLeft(0);
    this.__NamePanel.setWidth(this.__PanelSize.namePanelWidth);
    this.__NamePanel.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.componentHeight));
    this.add(this.__NamePanel);
};

CCampaignTypeComponent.prototype._initSelectBox = function()
{
    this.__SelectBox = new BiComponent();
    this.__SelectBox.setCssClassName("eli-campaign-type-box-border");
    this.__SelectBox.setId(newGuid());
    this.__SelectBox.setUserData(this.__UserData);
    this.__SelectBox.setLeft(this.__NamePanel.getLeft()+this.__NamePanel.getWidth() + this.__PanelSize.labelSpace);
    this.__SelectBox.setTop(0);
    this.__SelectBox.setBottom(0);
    this.__SelectBox.setRight(0);
    this.add(this.__SelectBox);
};

CCampaignTypeComponent.prototype._initGroupRadioBox = function()
{
    this.__RadioGroupComponent = new CRadioGroup();
    this.__RadioGroupComponent.initObject(this.__Options);
    this.__RadioGroupComponent.setLeft(0);
    this.__RadioGroupComponent.setRight(0);
    this.__RadioGroupComponent.setTop(0);
    this.__RadioGroupHeight = this.__RadioGroupComponent.getRadioGroupHeight();
    this.__RadioGroupComponent.setHeight(this.__RadioGroupHeight);
    this.__SelectBox.add(this.__RadioGroupComponent);
};

CCampaignTypeComponent.prototype._initComponentSize = function()
{
    this.setId(newGuid());
    this.setCssClassName("eli-campaign-input-component");
    this.setUserData(this.__UserData);
    this.setHeight(this.__RadioGroupHeight);
    this.setWidth(this.__PanelSize.componentWidth);
    this.setLeft(this.__Left);
    this.setTop(this.__Top);
};

CCampaignTypeComponent.prototype.getSelectedCampaignType = function()
{
    return this.__RadioGroupComponent.getCurrentButtonUserData();
};

CCampaignTypeComponent.prototype.clearTypeSelectedStatus = function()
{
    this.__RadioGroupComponent.clearSelectedStatus();
};

