/**
 * Created by yangtian on 16/9/22.
 */
function CReportItemComponent()
{
    BiComponent.call(this);
    this.__EliApplication = null;
    this.__Parent = null;

    this.__LastPanelLeft = 0;

    this.__ValueHash = new BiHashTable();
}

CReportItemComponent.prototype = new BiComponent;
CReportItemComponent.prototype._className = "CReportItemComponent";

CReportItemComponent.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__UserData = this.__Parent.getReportUserData();
    this.__Content = this.__Parent.getContent();
    this.__PanelSize = this.__Parent.getPanelSize();
    this.__CampaignFields = this.__Parent.getCampaignFields();
    this._init();
};

CReportItemComponent.prototype._init = function()
{
    this._initItems();
};

CReportItemComponent.prototype._initItems = function()
{
    var len = this.__CampaignFields.length;
    var cssName = "eli-campaign-item-panel";
    for(var index=0; index< len; index++)
    {
        if(index == len-1)
        {
            cssName = "eli-campaign-item-panel-last";
        }

        this._initItemPanel(this.__CampaignFields[index], this.__LastPanelLeft, cssName);
    }
};

CReportItemComponent.prototype._initItemPanel = function(userData, left, cssName)
{
    var label = new BiLabel();
    label.setId(newGuid());
    label.setCssClassName(cssName);
    label.setUserData(userData);
    label.setLeft(left);
    label.setTop(0);
    label.setWidth(this.__PanelSize.panelWidth);
    label.setHeight(this.__PanelSize.campaignPanelHeight);
    label.setStyleProperty("line-height", sprintf("%dpx", label.getHeight()));
    this.add(label);
    this.__LastPanelLeft = this.__LastPanelLeft + this.__PanelSize.panelWidth;
    this.__ValueHash.add(userData, label)
};

CReportItemComponent.prototype.updateItemValue = function(campaignFieldValues)
{
    var len = this.__CampaignFields.length;
    for(var index=0; index<len; index++)
    {
        var key = this.__CampaignFields[index];
        var text = campaignFieldValues[index];
        this.__ValueHash.item(key).setText(text);
    }
};

CReportItemComponent.prototype.clearItemValue = function()
{
    var len = this.__CampaignFields.length;
    for(var index=0; index<len; index++)
    {
        var key = this.__CampaignFields[index];
        this.__ValueHash.item(key).setText("");
    }
};
