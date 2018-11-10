/**
 * Created by yangtian on 16/10/26.
 */

function CReportTableItemComponent()
{
    BiComponent.call(this);
    this.__EliApplication = null;
    this.__Parent = null;

    this.__LastPanelLeft = 0;

    this.__ValueHash = new BiHashTable();
}

CReportTableItemComponent.prototype = new BiComponent;
CReportTableItemComponent.prototype._className = "CReportItemComponent";

CReportTableItemComponent.prototype.initObject = function(application, parent, fieldsData, panelSize)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__FieldsData = fieldsData;
    this.__PanelSize = panelSize;
    this._init();
};

CReportTableItemComponent.prototype._init = function()
{
    this._initItems();
};

CReportTableItemComponent.prototype._initItems = function()
{
    var len = this.__FieldsData.length;
    var cssName = "eli-campaign-item-panel";
    var left = 0;
    for(var index=0; index< len; index++)
    {
        if(index == len-1)
        {
            cssName = "eli-campaign-item-panel-last";
        }

        this._initItemPanel(index, left, cssName);
        left += this.__PanelSize.fieldsWidth;
    }
};

CReportTableItemComponent.prototype._initItemPanel = function(userData, left, cssName)
{
    var label = new BiLabel();
    label.setId(newGuid());
    label.setCssClassName(cssName);
    label.setUserData(userData);
    label.setLeft(left);
    label.setTop(0);
    label.setWidth(this.__PanelSize.fieldsWidth);
    label.setHeight(this.__PanelSize.tablePanelHeight);
    label.setStyleProperty("line-height", sprintf("%dpx", label.getHeight()));
    this.add(label);
    this.__ValueHash.add(userData, label)
};

CReportTableItemComponent.prototype.updateItemValue = function(publisherData)
{
    var values = publisherData.getPublisherTotalData();
    var len = this.__FieldsData.length;
    for(var index=0; index<len; index++)
    {
        this.__ValueHash.item(index).setText(values[index]);
    }
};

CReportTableItemComponent.prototype.clearItemValue = function()
{
    var len = this.__FieldsData.length;
    for(var index=0; index<len; index++)
    {
        this.__ValueHash.item(index).setText("");
    }
};