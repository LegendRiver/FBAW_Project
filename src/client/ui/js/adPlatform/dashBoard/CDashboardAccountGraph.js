/**
 * Created by yangtian on 16/11/1.
 */

function CDashboardAccountGraph()
{
    BiComponent.call(this);
    this.setCssClassName("eli-dashboard-account-chart-component");
    this.setId(newGuid());
    this.__GraphTop = 0;
    this.__GraphLeft =0;

    this.__DataFormat = {
        currency : 'currency',
        decimal : 'decimal',
        percent : 'percent',
    };

    this.__AccountPieChartTitle = "账户余额";
    this.__AccountImpressionChartTitle = "展现";
}

CDashboardAccountGraph.prototype = new BiComponent;
CDashboardAccountGraph.prototype._className = "CDashboardAccountGraph";

CDashboardAccountGraph.prototype.initObject = function(parent, charts, accountData)
{
    this.__Parent = parent;
    this.__Charts = charts;
    this.__AccountDailyData = accountData;
    this._init();
};

CDashboardAccountGraph.prototype._init = function()
{
    this._initBudgetPieChartComponent();
    this._initLineChartComponent();
    this._initClickChart();
    this._initAccountCtrChart();
    this._initAccountCPMChart();
    this._initAccountCPCChart();
};

CDashboardAccountGraph.prototype._initBudgetPieChartComponent = function()
{

    this.__PieChart = new CChartPieComponent();
    this.__PieChart.initObject(this, this.__Charts);
    this.__PieChart.setLeft(0);
    this.__PieChart.setTop(0);
    this.add(this.__PieChart);
    this.__Charts.AccountPieCall = this.__PieChart;
};

CDashboardAccountGraph.prototype.updateBudgetPieChart = function(data)
{
    this.__PieChart.upPieCharData(data, this.__AccountPieChartTitle, "", this._AccountBudgetCaller);
};

CDashboardAccountGraph.prototype._AccountBudgetCaller = function()
{
    google.charts.AccountPieCall.drawPieChart();
};

CDashboardAccountGraph.prototype._initLineChartComponent = function()
{
    this.__ImpressionChart = new CChartLineComponent();
    this.__ImpressionChart.initObject(this, this.__Charts);
    this.__ImpressionChart.setLeft(this.__PieChart.getWidth());
    this.__ImpressionChart.setTop(0);
    this.__Charts.ImpressionCaller = this.__ImpressionChart;
    this.add(this.__ImpressionChart);
};

CDashboardAccountGraph.prototype.updateImpressionChartData = function(data)
{
    this.__ImpressionChart.updateLineChartData(data, this.__AccountImpressionChartTitle, this.__DataFormat.decimal,this._impressionCaller);
};

CDashboardAccountGraph.prototype._impressionCaller = function()
{
    google.charts.ImpressionCaller.drawLineChart();
};

CDashboardAccountGraph.prototype._initClickChart = function()
{
    if(!this.__ClickChart)
    {
        this.__ClickChart = new CChartLineComponent();
        this.__ClickChart.initObject(this, this.__Charts);
        this.__ClickChart.setLeft(this.__ImpressionChart.getLeft() + this.__ImpressionChart.getWidth());
        this.__ClickChart.setTop(this.__PieChart.getTop());
        this.__Charts.ClickCaller = this.__ClickChart;
        this.add(this.__ClickChart);
    }
    this.__GraphLeft = this.__ClickChart.getLeft() + this.__ClickChart.getWidth();
};

CDashboardAccountGraph.prototype.updateClickChartData = function(data)
{
    var clickTitle = "点击";
    this.__ClickChart.updateLineChartData(data, clickTitle, this.__DataFormat.decimal, this._clickCaller);
};

CDashboardAccountGraph.prototype._clickCaller = function()
{
    google.charts.ClickCaller.drawLineChart();
};

CDashboardAccountGraph.prototype._initAccountCtrChart = function()
{
    if(!this.__AccountCtrChart)
    {
        this.__AccountCtrChart = new CChartLineComponent();
        this.__AccountCtrChart.initObject(this, this.__Charts);
        this.__AccountCtrChart.setLeft(this.__PieChart.getLeft());
        this.__AccountCtrChart.setTop(this.__PieChart.getTop() + this.__PieChart.getHeight());
        this.__Charts.accountCtrCaller = this.__AccountCtrChart;
        this.add(this.__AccountCtrChart);
    }
};

CDashboardAccountGraph.prototype.updateCTRChartData = function(data)
{
    var clickTitle = "CTR";
    this.__AccountCtrChart.updateLineChartData(data, clickTitle, this.__DataFormat.percent, this._accountCtrCaller);
};

CDashboardAccountGraph.prototype._accountCtrCaller = function()
{
    google.charts.accountCtrCaller.drawLineChart();
};

CDashboardAccountGraph.prototype._initAccountCPMChart = function()
{
    if(!this.__AccountCPMChart)
    {
        this.__AccountCPMChart = new CChartLineComponent();
        this.__AccountCPMChart.initObject(this, this.__Charts);
        this.__AccountCPMChart.setLeft(this.__AccountCtrChart.getLeft() + this.__AccountCtrChart.getWidth());
        this.__AccountCPMChart.setTop(this.__AccountCtrChart.getTop() );
        this.__Charts.accountCPMCaller = this.__AccountCPMChart;
        this.add(this.__AccountCPMChart);
    }
};

CDashboardAccountGraph.prototype.updateAccountCPMData = function(data)
{
    var clickTitle = "CPM";
    this.__AccountCPMChart.updateLineChartData(data, clickTitle, this.__DataFormat.currency, this._accountCPMCaller);
};

CDashboardAccountGraph.prototype._accountCPMCaller = function()
{
    google.charts.accountCPMCaller.drawLineChart();
};

CDashboardAccountGraph.prototype._initAccountCPCChart = function()
{
    if(!this.__AccountCPCChart)
    {
        this.__AccountCPCChart = new CChartLineComponent();
        this.__AccountCPCChart.initObject(this, this.__Charts);
        this.__AccountCPCChart.setLeft(this.__AccountCPMChart.getLeft() + this.__AccountCPMChart.getWidth());
        this.__AccountCPCChart.setTop(this.__AccountCtrChart.getTop() );
        this.__Charts.accountCPCCaller = this.__AccountCPCChart;
        this.add(this.__AccountCPCChart);
    }
};

CDashboardAccountGraph.prototype.updateAccountCPCData = function(data)
{
    var clickTitle = "CPC";
    this.__AccountCPCChart.updateLineChartData(data, clickTitle, this.__DataFormat.currency, this._accountCPCCaller);
};

CDashboardAccountGraph.prototype._accountCPCCaller = function()
{
    google.charts.accountCPCCaller.drawLineChart();
};

CDashboardAccountGraph.prototype._initPublisherBudgetChart = function()
{
    if(!this.__PublisherBudgetChart)
    {
        this.__PublisherBudgetChart = new CChartPieComponent();
        this.__PublisherBudgetChart.initObject(this, this.__Charts);
        this.__PublisherBudgetChart.setLeft(this.__PieChart.getLeft());
        this.__PublisherBudgetChart.setTop(this.__PieChart.getTop() + this.__PieChart.getHeight());
        this.add(this.__PublisherBudgetChart);
        google.charts.publisherPieChartCaller = this.__PublisherBudgetChart;
    }

    var  data = [
        ['Effort', 'Amount given'],
        ['Facebook', 1000],
        ['Google', 2340],
        ['Instagram', 2302],
        ['Youtube', 2342]
    ];

    var title = "媒体消费占比";
    this.__PublisherBudgetChart.upPieCharData(data, title, "", this._publisherBudgetCaller);
};

CDashboardAccountGraph.prototype._publisherBudgetCaller = function()
{
    google.charts.publisherPieChartCaller.drawPieChart();
};

CDashboardAccountGraph.prototype.getAccountPanelWidth = function()
{
    return this.__GraphLeft;

};

CDashboardAccountGraph.prototype.getAccountPanelHeight = function()
{
    return this.__GraphTop;
};


