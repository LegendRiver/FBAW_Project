/**
 * Created by yangtian on 16/10/26.
 */

function CPublisherMainPanel()
{
    BiComponent.call(this);

    this.__FieldsData = ["媒体", "状态", "创建时间", "预算", "已花费", "余额", "展现", "点击", "CTR(%)","CPM($)", "CPC($)"];
    this.__NumPerPage = 4;
}

CPublisherMainPanel.prototype = new BiComponent;
CPublisherMainPanel.prototype._className = "CPublisherMainPanel";

CPublisherMainPanel.prototype.initObject = function(applicaiton, parent)
{
    this.__EliApplication = applicaiton;
    this.__Parent = parent;
    this.__PublishersData = null;
    this._init();
};

CPublisherMainPanel.prototype._init = function()
{
    this._initPublisherTableComponent();
    this._initPublisherPageControl();
    this._initPublisherChartsComponent();
};

CPublisherMainPanel.prototype._initPublisherTableComponent = function()
{
    if(!this.__PublisherTable)
    {
        this.__PublisherTable = new CReportTableComponent();
        this.__PublisherTable.initObject(this.__EliApplication, this, this.__FieldsData, this.__NumPerPage);
        this.__PublisherTable.setCssClassName("eli-table-panel");
        this.__PublisherTable.setLeft(0);
        this.__PublisherTable.setTop(0);
        this.__PublisherTable.setRight(0);
        this.__PublisherTable.setHeight(this.__PublisherTable.getTableHeight());
        this.add(this.__PublisherTable);
    }
};

CPublisherMainPanel.prototype._initPublisherChartsComponent = function()
{
    if(!this.__PublisherChartComponent)
    {
        this.__PublisherChartComponent = new CReportPublisherChartsComponent();
        this.__PublisherChartComponent.initObject(this);
        this.__PublisherChartComponent.setLeft(0);
        this.__PublisherChartComponent.setTop(0);
        this.__PublisherChartComponent.setBottom(0);
        this.__PublisherChartComponent.setRight(0);
        this.__PublisherChartComponent.setVisible(false);
        this.add(this.__PublisherChartComponent)
    }
};

CPublisherMainPanel.prototype._initPublisherPageControl = function()
{
    if(!this.__PublisherPageControl)
    {
        this.__PublisherPageControl = new CReportTablePageControl();
        this.__PublisherPageControl.initObject(this.__PublisherTable, this);
        this.__PublisherPageControl.setTop(this.__PublisherTable.getTop() + this.__PublisherTable.getHeight());
        this.add(this.__PublisherPageControl);
    }
};

CPublisherMainPanel.prototype.getTableHeight = function()
{
    return this.__PublisherTable.getTableHeight();
};

CPublisherMainPanel.prototype.updatePublishersData = function(publishersData)
{
    this.__PublishersData = publishersData;
    this.__PublisherTable.updateTableData(this.__PublishersData);
    var pages = this._segmentData(this.__PublishersData);
    this.__PublisherPageControl.updatePageControlInfo(0, pages);
};

CPublisherMainPanel.prototype.getPublisherFields = function()
{
    return this.__FieldsData;
};

CPublisherMainPanel.prototype._segmentData = function(data)
{
    var len = data.length;
    var perNum = this.__NumPerPage;
    var pages = [];
    var pageNum = Math.ceil(len/perNum);
    //this._setPageNum(pageNum);

    for(var i=0; i<pageNum; i++)
    {
        var pageArrays = [];
        for(var j=0; j< perNum; j++)
        {
            var index = j+i*perNum;
            pageArrays.push(data[index]);
        }
        pages.push(pageArrays);
    }

    return pages;
};

CPublisherMainPanel.prototype.updatePublisherName = function(name, flag)
{
    this.__Parent.setPublisherName(name,flag);
};

CPublisherMainPanel.prototype.updatePublisherChartVisible = function(flag)
{
    this.__PublisherChartComponent.setVisible(flag);
};

CPublisherMainPanel.prototype.updatePublisherChartData = function(data)
{
    var dates = data.getPublisherDate();
    if(0 == dates.length)
    {
        this.__Parent.setNoDataPanelVisible(true);
        this.setVisible(false);
        return;
    }
    else{
        this.__Parent.setNoDataPanelVisible(false);
        this.setVisible(true);
    }
    this.__PublisherChartComponent.updateReportPublisherData(data);
};

CPublisherMainPanel.prototype.updatePublisherTableVisible = function(flag)
{
    this.__PublisherTable.setVisible(flag);
    this.__PublisherPageControl.setVisible(flag);
    this.__PublisherChartComponent.setVisible(!flag);
};

CPublisherMainPanel.prototype.updatePanelHeight = function(flag)
{
    if(flag)
    {
        this.setHeight(this.__PublisherChartComponent.getChartComponentHeight());
    }
    else
    {
        this.setHeight(this.getTableHeight() + 100);
    }

};

