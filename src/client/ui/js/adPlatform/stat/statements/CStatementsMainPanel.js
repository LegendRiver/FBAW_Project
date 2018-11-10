/**
 * Created by yangtian on 16/12/2.
 */

function CStatementsMainPanel()
{
    BiComponent.call(this);
    this.setLeft(0);
    this.setRight(0);
    this.setBottom(0);
    this.setCssClassName("eli-statements-main-panel");

    this.__PanelSize = {
        statisticLeft : 40,
        statisticWidth : 200,
        statisticHeight : 40,
        tableLeft : 150,
        pageControlLeft : 450,
        pageControlSpace : 30
    };

    this.__LastPanelBottom = 15;

    this.__MaxRecordNum = 10;
    this.__CurrentSegData = [];
    this.__CurrentPageNum = 0;
    this.__CurrentPage = 0;
    this.__SinglePanelArray = [];
}

CStatementsMainPanel.prototype = new BiComponent;
CStatementsMainPanel.prototype._className = "CStatementsMainPanel";

CStatementsMainPanel.prototype.initObject = function(application, parent)
{
    this.__EliApplication = application;
    this.__Parent = parent;
    this._init();
};

CStatementsMainPanel.prototype._init = function()
{
    this._initStatisticTitle(this.__LastPanelBottom);
    this._initTablePanel(this.__LastPanelBottom + 60);
    this._initPageControlPanel();
};

CStatementsMainPanel.prototype._initStatisticTitle = function(top)
{
    this.__StatisticTitle = new BiLabel();
    this.__StatisticTitle.setId(newGuid());
    this.__StatisticTitle.setCssClassName("eli-statements-statistic-panel");
    this.__StatisticTitle.setUserData("eli-statements-statistic-panel");
    this.__StatisticTitle.setTop(top);
    this.__StatisticTitle.setLeft(this.__PanelSize.statisticLeft);
    this.__StatisticTitle.setWidth(this.__PanelSize.statisticWidth);
    this.__StatisticTitle.setHeight(this.__PanelSize.statisticHeight);
    this.__StatisticTitle.setStyleProperty("line-height", sprintf("%dpx", this.__PanelSize.statisticHeight));
    this.add(this.__StatisticTitle);

    this.__LastPanelBottom = this.__StatisticTitle.getHeight() + top;
};

CStatementsMainPanel.prototype._initTablePanel = function(top)
{
    this.__TablePanel = new BiComponent();
    this.__TablePanel.setId(newGuid());
    this.__TablePanel.setCssClassName("eli-statements-table-panel");
    this.__TablePanel.setTop(top);
    this.__TablePanel.setLeft(this.__PanelSize.tableLeft);
    this.__TablePanel.setRight(0);
    this.add(this.__TablePanel);

    this._initTable();
};

CStatementsMainPanel.prototype._initPageControlPanel = function(top)
{
    this.__PageControl = new CPageController();
    this.__PageControl.initObject(this);
    this.__PageControl.setLeft(this.__PanelSize.pageControlLeft);
    this.__PageControl.setTop(top);
    this.__PageControl.setVisible(false);
    this.add(this.__PageControl);
};

CStatementsMainPanel.prototype._initTable = function()
{
    var top = 0;
    for(var i=0; i<this.__MaxRecordNum; i++)
    {
        var singlePanel = new CStatementSinglePanel();
        singlePanel.initObject(this);
        singlePanel.setTop(top);
        singlePanel.setLeft(0);
        singlePanel.setVisible(false);
        this.__TablePanel.add(singlePanel);
        this.__SinglePanelArray.push(singlePanel);

        top +=singlePanel.getHeight();
    }
};

CStatementsMainPanel.prototype._updateStatisticTitle = function(name, length)
{

    var title = this._generateStatisticTitle(name, length);
    this.__StatisticTitle.setText(title);
};

CStatementsMainPanel.prototype._generateStatisticTitle = function(name ,length)
{
    var preText = "总数";
    var title = name +preText + length;

    return title;
};

CStatementsMainPanel.prototype._clearTableData = function()
{
    var len = this.__SinglePanelArray.length;
    for(var i=0; i<len; i++)
    {
        this.__SinglePanelArray[i].clearText();
    }
};

CStatementsMainPanel.prototype._updateTableData = function(data)
{
    var len = data.length;
    var height = 0;
    for(var i=0; i<len; i++)
    {
        this.__SinglePanelArray[i].updateSinglePanelData(data[i]);
        this.__SinglePanelArray[i].setVisible(true);
        height += this.__SinglePanelArray[i].getSinglePanelHeight();
    }

    this.__TablePanel.setHeight(height);
    this.__PageControl.setTop(this.__TablePanel.getTop() + this.__TablePanel.getHeight()+this.__PanelSize.pageControlSpace);
    this.__PageControl.setVisible(true);
};

CStatementsMainPanel.prototype._segData = function(data)
{
    var len = data.length;
    this.__CurrentSegData = [];
    this.__CurrentPageNum = Math.ceil(len/this.__MaxRecordNum);

    for(var i=0; i<this.__CurrentPageNum; i++)
    {
        var array = [];
        for(var j=0; j<this.__MaxRecordNum; j++)
        {
            var index = this.__MaxRecordNum * i + j;
            if(index >= len)
            {
                break;
            }

            array.push(data[index]);
        }

        this.__CurrentSegData.push(array);
    }
};

CStatementsMainPanel.prototype.updateData = function(name, data)
{
    this.updateCurrentPageIndex(0);

    var length = data.length;
    this._updateStatisticTitle(name, length);
    this._segData(data);

    this.updateCurrentPageData();

};

CStatementsMainPanel.prototype.updateCurrentPageIndex = function(pageIndex)
{
    this.__CurrentPage = pageIndex;
};


CStatementsMainPanel.prototype.updateCurrentPageData = function()
{
    this._clearTableData();
    this._updateTableData(this.__CurrentSegData[this.__CurrentPage]);
    this.__PageControl.updatePageInfo(this.__CurrentPageNum, this.__CurrentPage);
};





