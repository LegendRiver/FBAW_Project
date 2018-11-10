/**
 * Created by yangtian on 16/10/26.
 */

function CReportTableComponent()
{
    BiComponent.call(this);

    this.__FieldsHash = new BiHashTable();
    this.__TableHash = new BiHashTable();

    this.__PanelSize = {
        fieldsWidth : 150,
        fieldsHeight : 40,
        tablePanelHeight : 40,
    };

    this.__TableHeight = 0;
}

CReportTableComponent.prototype = new BiComponent();
CReportTableComponent.prototype._className = "CReportTableComponent";

CReportTableComponent.prototype.initObject = function(application, parent, fieldsData, numPerPage)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this.__FieldsData = fieldsData;
    this.__DefaultNumsPerPage = numPerPage;
    this._init();
};

CReportTableComponent.prototype._init = function()
{
    this._initPublisherNoDataPanel();
    this._initTableMainPanel();
    this._initFieldsPanel();
    this._initTablePanel();
};

CReportTableComponent.prototype._initTableMainPanel = function()
{
    this.__TableMainPanel = new BiComponent();
    this.__TableMainPanel.setId(newGuid());
    this.__TableMainPanel.setCssClassName("eli-report-main-panel");
    this.__TableMainPanel.setLeft(0);
    this.__TableMainPanel.setRight(0);
    this.__TableMainPanel.setTop(0);

    this.add(this.__TableMainPanel);
};

CReportTableComponent.prototype._initFieldsPanel = function()
{
    this.__FieldsPanel = new BiComponent();
    this.__FieldsPanel.setId(newGuid());
    this.__FieldsPanel.setCssClassName("eli-campaign-field-title-panel");
    this.__FieldsPanel.setLeft(0);
    this.__FieldsPanel.setHeight(this.__PanelSize.fieldsHeight);
    this.__FieldsPanel.setTop(0);
    this.__TableMainPanel.add(this.__FieldsPanel);

    var len = this.__FieldsData.length;
    var left = 0;
    var cssName = "eli-campaign-item-title-text";
    for(var index=0; index<len; index++)
    {
        if(index == len-1)
        {
            cssName = "eli-campaign-item-title-text-last";
        }
        this._initFieldItem(index, this.__FieldsData[index], left, this.__PanelSize.fieldsWidth, cssName);
        left += this.__PanelSize.fieldsWidth;
    }

    this.__TableWidth = left;
    this.__TableHeight = this.__PanelSize.fieldsHeight;
    this.__LastPanelBottom = this.__FieldsPanel.getTop() + this.__FieldsPanel.getHeight();
    this.__FieldsPanel.setWidth(left);
};

CReportTableComponent.prototype._initFieldItem = function(userData, text, left, width, cssName)
{
    var field = new BiLabel();
    field.setId(newGuid());
    field.setCssClassName(cssName);
    field.setUserData(userData);
    field.setText(text);
    field.setTop(0);
    field.setBottom(0);
    field.setLeft(left);
    field.setWidth(width);
    field.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.fieldsHeight));
    this.__FieldsPanel.add(field);

    this.__FieldsHash.add(userData,field);
};

CReportTableComponent.prototype._initTablePanel = function()
{
    this.__TablePanel = new BiComponent();
    this.__TablePanel.setId(newGuid());
    this.__TablePanel.setCssClassName("eli-table-panel");
    this.__TablePanel.setLeft(0);
    this.__TablePanel.setTop(this.__LastPanelBottom);
    this.__TablePanel.setWidth(this.__TableWidth);
    this.__TableMainPanel.add(this.__TablePanel);

    var len = this.__DefaultNumsPerPage;
    var top = 0;
    for(var index=0; index<len; index++)
    {
        this._initSingleTablePanel(index, top);
        top += this.__PanelSize.tablePanelHeight;
    }

    this.__TableHeight = top + this.__LastPanelBottom;
    this.__TablePanel.setHeight(top);
    this.__TableMainPanel.setHeight(this.__TableHeight);
};

CReportTableComponent.prototype._initSingleTablePanel = function(userData, top)
{
    var panel = new CReportTableItemComponent();
    panel.initObject(this.__EliApplication, this, this.__FieldsData, this.__PanelSize);
    panel.setId(newGuid());
    panel.setCssClassName("eli-single-table-panel");
    panel.setUserData(userData);
    panel.setLeft(0);
    panel.setTop(top);
    panel.setHeight(this.__PanelSize.tablePanelHeight);
    panel.setWidth(this.__TableWidth);
    panel.addEventListener("click", function () {
        this._onButtonClick(userData);
    }, this);
    panel.setVisible(false);

    this.__TablePanel.add(panel);
    this.__TableHash.add(userData, panel);
};

CReportTableComponent.prototype._initPublisherNoDataPanel = function()
{
    if(!this.__NoDataPanel)
    {
        this.__NoDataPanel = new CReportNoDataComponent();
        this.__NoDataPanel.setUserData("PublisherNoDataPanel");
        this.__NoDataPanel.initObject(this);
        this.__NoDataPanel.setTop(this.__PanelSize.mainHeadPanelHeight);
        this.__NoDataPanel.setLeft(0);
        this.__NoDataPanel.setRight(0);
        this.__NoDataPanel.setBottom(0);
        this.__NoDataPanel.setVisible(false);
        this.add(this.__NoDataPanel);
    }
};

CReportTableComponent.prototype._onButtonClick = function(userData)
{

    var publisherData = this.__PanelData[userData];
    var name = publisherData.getPublisherName();
    this.__Parent.updatePublisherName(name, true);
    this.__Parent.updatePublisherTableVisible(false);
    this.__Parent.updatePublisherChartVisible(true);
    this.__Parent.updatePublisherChartData(publisherData);
    this.__Parent.updatePanelHeight(true);
};

CReportTableComponent.prototype.getTableWidth = function()
{
    return this.__TableWidth;
};

CReportTableComponent.prototype.getTableHeight = function()
{
    return this.__TableHeight;
};

/* ----        update ------------*/

CReportTableComponent.prototype.updateTableData = function(panelData)
{
    this.__PanelData = panelData;
    //var len = this.__DefaultNumsPerPage;
    var len = this.__PanelData.length;

    for(var index=0; index<len; index++)
    {
        this.__TableHash.item(index).updateItemValue(panelData[index]);
        this.__TableHash.item(index).setVisible(true);
    }
};
