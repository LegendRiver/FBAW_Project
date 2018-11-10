/**
 * Created by yangtian on 16/9/21.
 */

function CReportMainComponent()
{
    BiComponent.call(this);

    this.__EliApplication = null;
    this.__Parent = null;
    this.__Campaigns = null;
    this.__PageNum = null;

    this.__Pages = [];


    this.__LastPanelBottom = 0;
    this.__LastFieldLeft = 0;
    this.__CurrentPage = 0;

    this.__PanelSize = {
        campaignPanelLeft : 50,
        campaignPanelHeight : 40,
        campaignTitleHeight : 40,
        campaignNameLabelLeft : 60,
        pageControlLeft : 200,
        itemTop : 10,
        itemBottom : 10,
        panelWidth : 150,
        labelHeight : 40,
        fieldHeight : 40
    };

    this.__UserData = {
        name : "name",
        status : "status",
        createTime : "createTime",
        budget : "budget",
        spent : "spent",
        balance : "balance",
        impression : "impression",
        click : "click",
        ctr : "ctr",
        cpm : "cpm",
        cpc : "cpc",
        id : "id"
    };

    this.__Content = {
        name : "推广计划",
        status : "投放状态",
        createTime : "创建时间",
        budget : "预算",
        spent : "已花费",
        balance : "余额",
        impression : "展现",
        click : "点击",
        ctr : "CTR(%)",
        cpm : "CPM($)",
        cpc : "CPC($)"
    };

    this.__CampaignPanelHash = new BiHashTable();
    this.__NameLabelHash = new BiHashTable();
    this.__ItemComponentHash = new BiHashTable();

    this.__PublisherObjects = null;

    this.__CampaignFields = [];
}

CReportMainComponent.prototype = new BiComponent;
CReportMainComponent.prototype._className = "CReportMainComponent";

CReportMainComponent.prototype.initObject = function(eliApplication, parent)
{
    this.__EliApplication = eliApplication;
    this.__Parent = parent;
    this.__NumOfCampaignPerPage = this.__Parent.getCampaignPageNum();
    this._init();
};

CReportMainComponent.prototype._init = function()
{
    this._initFieldsPanel(this.__LastPanelBottom);
    this._initCampaignsTemplate();
};

CReportMainComponent.prototype._initFieldsPanel = function(top)
{
    var fieldsPanel = new BiComponent();
    fieldsPanel.setId(newGuid());
    fieldsPanel.setCssClassName("eli-campaign-field-title-panel");
    fieldsPanel.setLeft(0);
    fieldsPanel.setTop(top);
    fieldsPanel.setHeight(this.__PanelSize.fieldHeight);

    this.__LastPanelBottom = this.__LastPanelBottom + this.__PanelSize.fieldHeight;

    this.add(fieldsPanel);

    //name
    this._initFieldItem(this.__UserData.name, this.__Content.name, this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //status
    this._initFieldItem(this.__UserData.status, this.__Content.status,  this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //createtime
    this._initFieldItem(this.__UserData.createTime, this.__Content.createTime,  this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //budget
    this._initFieldItem(this.__UserData.budget, this.__Content.budget, this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //spent
    this._initFieldItem(this.__UserData.spent, this.__Content.spent,  this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //balance
    this._initFieldItem(this.__UserData.balance, this.__Content.balance, this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //impression
    this._initFieldItem(this.__UserData.impression, this.__Content.impression, this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //click
    this._initFieldItem(this.__UserData.click, this.__Content.click, this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //ctr
    this._initFieldItem(this.__UserData.ctr, this.__Content.ctr, this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //cpm
    this._initFieldItem(this.__UserData.cpm, this.__Content.cpm, this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text");
    //cpc
    this._initFieldItem(this.__UserData.cpc, this.__Content.cpc, this.__LastFieldLeft, fieldsPanel, "eli-campaign-item-title-text-last");

    fieldsPanel.setWidth(this.__LastFieldLeft);
};

CReportMainComponent.prototype._initFieldItem = function(userData, text, left, parent, cssName)
{
    var field = new BiLabel();
    field.setId(newGuid());
    field.setCssClassName(cssName);
    field.setUserData(userData);
    field.setText(text);
    field.setLeft(left);
    field.setTop(0);
    field.setBottom(0);
    field.setHeight(this.__PanelSize.fieldHeight);
    field.setWidth(this.__PanelSize.panelWidth);
    field.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.fieldHeight));

    parent.add(field);
    this.__CampaignFields.push(userData);
    this.__LastFieldLeft = this.__LastFieldLeft + this.__PanelSize.panelWidth;
};

CReportMainComponent.prototype._initCampaignsTemplate = function()
{
    for(var i=0; i<this.__NumOfCampaignPerPage; i++)
    {
        this._initCampaignPanel(i, this.__LastPanelBottom);
    }
};

CReportMainComponent.prototype._initCampaignPanel = function(userData, top)
{
    var panel = new BiComponent();
    panel.setId(newGuid());
    panel.setCssClassName("eli-campaign-panel");
    panel.setUserData(userData);
    panel.setLeft(0);
    panel.setTop(top);
    panel.setHeight(this.__PanelSize.campaignPanelHeight);
    panel.setWidth(this.__LastFieldLeft);
    panel.addEventListener("click", function () {
        this._onButtonClick(userData);
    }, this);
    panel.setVisible(false);

    this.__CampaignPanelHash.add(userData, panel);
    this.add(panel);

    this.__LastPanelBottom = this.__LastPanelBottom + this.__PanelSize.campaignPanelHeight;
    this._initCampaignDetailPanel(userData, panel);
};

CReportMainComponent.prototype._onButtonClick = function(userData)
{
    this.__Parent.setPanelVisible(true);
    this.__Parent.setDateComponentVisible(false);
    var campaignObject = this.__CurrentPageCampaigns[userData];
    var campaignName =campaignObject.getCampaignName();
    this.__Parent.setCampaignName(campaignName, true);
    this.__PublisherObjects = campaignObject.getPublisherObject();
    this.publishersObjectsNoData(this.__PublisherObjects);
};

CReportMainComponent.prototype.getPublisherObjects = function()
{
    return this.__PublisherObjects;
};

CReportMainComponent.prototype.publishersObjectsNoData = function(publisherObjects)
{
    var publisherComponent = this.__Parent.getPublisherComponent();
    if(0 != publisherObjects.length)
    {
        publisherComponent.updatePublishersData(publisherObjects);
        this.__Parent.getPublisherComponent().setVisible(true);
        this.__Parent.setNoDataPanelVisible(false);
    }
    else
    {
        this.__Parent.getPublisherComponent().setVisible(false);
        this.__Parent.setNoDataPanelVisible(true);
    }
};

CReportMainComponent.prototype._initCampaignDetailPanel = function(userData, parent)
{
    var itemComponent = new CReportItemComponent();
    itemComponent.initObject(this.__EliApplication, this);
    itemComponent.setLeft(0);
    itemComponent.setRight(0);
    itemComponent.setTop(0);
    itemComponent.setBottom(0);
    itemComponent.setUserData(userData);
    itemComponent.setCssClassName("eli-campaign-items-panel");
    parent.add(itemComponent);
    this.__ItemComponentHash.add(userData, itemComponent);
};

/*----- update data ------------------------*/
CReportMainComponent.prototype.updateCampaignData = function(campaignObjects)
{
    this.__CurrentPageCampaigns = campaignObjects;
    this.resetCampaignPanelVisible();

    this.updateItemsValue(campaignObjects);
};

CReportMainComponent.prototype.resetCampaignPanelVisible = function()
{
    for(var i=0; i<this.__NumOfCampaignPerPage; i++)
    {
        this._clearCampaignPanelData(i);
    }
};

CReportMainComponent.prototype._clearCampaignPanelData = function(index)
{
    this.__ItemComponentHash.item(index).clearItemValue();
    this.__CampaignPanelHash.item(index).setVisible(false);
};

CReportMainComponent.prototype.updateItemsValue = function(data)
{
    for(var i=0; i<this.__NumOfCampaignPerPage; i++)
    {
        if(!data[i])
        {
            break;
        }

        var campaignTotalData = data[i].getCampaignTotalData();
        this.__CampaignPanelHash.item(i).setVisible(true);
        this.__ItemComponentHash.item(i).updateItemValue(campaignTotalData);
    }
};

CReportMainComponent.prototype.getReportUserData = function()
{
    return this.__UserData;
};

CReportMainComponent.prototype.getContent = function()
{
    return this.__Content;
};

CReportMainComponent.prototype.getPanelSize = function()
{
    return this.__PanelSize;
};

CReportMainComponent.prototype.getCampaignFields = function()
{
    return this.__CampaignFields;
};

CReportMainComponent.prototype.getLastPanelBottom = function()
{
    return this.__LastPanelBottom;
};

