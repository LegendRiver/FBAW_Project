/**
 * Created by yangtian on 16/11/1.
 */

function CAccountPublisherGraph()
{
    BiComponent.call(this);
    this.setCssClassName("eli-dashboard-account-chart-component");
    this.setId(newGuid());
    this.__GraphTop = 0;
    this.__GraphLeft =0;

    this.__DataFormat = {
        currency : 'currency',
        decimal : 'decimal'
    };
}

CAccountPublisherGraph.prototype = new BiComponent;
CAccountPublisherGraph.prototype._className = "CAccountPublisherGraph";

CAccountPublisherGraph.prototype.initObject = function(parent, charts, accountData)
{
    this.__Parent = parent;
    this.__Charts = charts;
    this.__AccountDailyData = accountData;
    this._init();
};

CAccountPublisherGraph.prototype._init = function()
{
    this._initBudgetPieChartComponent();
    //this._initLineChartComponent();
    //this._initClickChart();
    //this._initAccountCtrChart();
    //this._initAccountCPMChart();
    //this._initAccountCPCChart();
};

CAccountPublisherGraph.prototype._initBudgetPieChartComponent = function()
{
    this.__PieChart = new CChartPieComponent();
    this.__PieChart.initObject(this, this.__Charts);
    this.__PieChart.setLeft(0);
    this.__PieChart.setTop(0);
    this.add(this.__PieChart);
    this.__Charts.PublisherPieCall = this.__PieChart;
    var  data = [
        ['Effort', 'Amount given'],
        ['Facebook', 2529.11],
        ['Google', 2529.11],
        ['Instagram', 2529.11],
        ['Youtube', 2529.11],
        ['余额', 18470.89]
    ];

    var title = "媒体消费";
    this.__PieChart.upPieCharData(data, title, "", this._AccountBudgetCaller);
};

CAccountPublisherGraph.prototype._AccountBudgetCaller = function()
{
    google.charts.PublisherPieCall.drawPieChart();
};

CAccountPublisherGraph.prototype._initLineChartComponent = function()
{
    this.__ImpressionChart = new CChartLineComponent();
    this.__ImpressionChart.initObject(this, this.__Charts);
    this.__ImpressionChart.setLeft(this.__PieChart.getWidth());
    this.__ImpressionChart.setTop(0);
    this.__Charts.PublisherImpressionCaller = this.__ImpressionChart;

    var data = [
        ['date', '展现'],
        [new Date(2016,10,01), 18912],
        [new Date(2016,10,02), 17655],
        [new Date(2016,10,04), 19004],
        [new Date(2016,10,05), 17373],
        [new Date(2016,10,06), 19554],
        [new Date(2016,10,07), 16546],
        [new Date(2016,10,08), 18546],
        [new Date(2016,10,09), 18333],
        [new Date(2016,10,10), 19180],
        [new Date(2016,10,11), 18876],
        [new Date(2016,10,12), 18765],
        [new Date(2016,10,13), 19876],
        [new Date(2016,10,14), 17689],
        [new Date(2016,10,15), 18887],
        [new Date(2016,10,16), 18897],
        [new Date(2016,10,17), 18679],
        [new Date(2016,10,18), 18657],
        [new Date(2016,10,19), 19012],
    ];

    this.__ImpressionChart.updateLineChartData(data, '展现', this.__DataFormat.decimal,this._impressionCaller);
    this.add(this.__ImpressionChart);
};

CAccountPublisherGraph.prototype._impressionCaller = function()
{
    google.charts.PublisherImpressionCaller.drawLineChart()
};


CAccountPublisherGraph.prototype._initClickChart = function()
{
    if(!this.__ClickChart)
    {
        this.__ClickChart = new CChartLineComponent();
        this.__ClickChart.initObject(this, this.__Charts);
        this.__ClickChart.setLeft(this.__ImpressionChart.getLeft() + this.__ImpressionChart.getWidth());
        this.__ClickChart.setTop(this.__PieChart.getTop());
        this.__Charts.PublisherClickCaller = this.__ClickChart;
        this.add(this.__ClickChart);
    }

    var data = [
        ['date', '点击'],
        [new Date(2016,10,01), 132],
        [new Date(2016,10,02), 134],
        [new Date(2016,10,04), 143],
        [new Date(2016,10,05), 118],
        [new Date(2016,10,06), 125],
        [new Date(2016,10,07), 114],
        [new Date(2016,10,08), 141],
        [new Date(2016,10,09), 130],
        [new Date(2016,10,10), 138],
        [new Date(2016,10,11), 138],
        [new Date(2016,10,12), 141],
        [new Date(2016,10,13), 153],
        [new Date(2016,10,14), 122],
        [new Date(2016,10,15), 149],
        [new Date(2016,10,16), 151],
        [new Date(2016,10,17), 155],
        [new Date(2016,10,18), 151],
        [new Date(2016,10,19), 160],
    ];

    var clickTitle = "点击";
    this.__ClickChart.updateLineChartData(data, clickTitle, this.__DataFormat.decimal, this._clickCaller);
    this.__GraphLeft = this.__ClickChart.getLeft() + this.__ClickChart.getWidth();
};

CAccountPublisherGraph.prototype._clickCaller = function()
{
    google.charts.PublisherClickCaller.drawLineChart();
};

CAccountPublisherGraph.prototype._initAccountCtrChart = function()
{
    if(!this.__AccountCtrChart)
    {
        this.__AccountCtrChart = new CChartLineComponent();
        this.__AccountCtrChart.initObject(this, this.__Charts);
        this.__AccountCtrChart.setLeft(this.__PieChart.getLeft());
        this.__AccountCtrChart.setTop(this.__PieChart.getTop() + this.__PieChart.getHeight());
        this.__Charts.PublisherCtrCaller = this.__AccountCtrChart;
        this.add(this.__AccountCtrChart);
    }

    var data = [
        ['date', 'CTR'],
        [new Date(2016,10,01), 0.007],
        [new Date(2016,10,02), 0.0076],
        [new Date(2016,10,04), 0.0075],
        [new Date(2016,10,05), 0.0068],
        [new Date(2016,10,06), 0.0064],
        [new Date(2016,10,07), 0.0069],
        [new Date(2016,10,08), 0.0076],
        [new Date(2016,10,09), 0.0071],
        [new Date(2016,10,10), 0.0072],
        [new Date(2016,10,11), 0.0073],
        [new Date(2016,10,12), 0.0075],
        [new Date(2016,10,13), 0.0077],
        [new Date(2016,10,14), 0.0069],
        [new Date(2016,10,15), 0.0079],
        [new Date(2016,10,16), 0.0080],
        [new Date(2016,10,17), 0.0083],
        [new Date(2016,10,18), 0.0081],
        [new Date(2016,10,19), 0.0084],
    ];

    var clickTitle = "CTR";
    this.__AccountCtrChart.updateLineChartData(data, clickTitle, this.__DataFormat.percent, this._accountCtrCaller);
};

CAccountPublisherGraph.prototype._accountCtrCaller = function()
{
    google.charts.PublisherCtrCaller.drawLineChart();
};

CAccountPublisherGraph.prototype._initAccountCPMChart = function()
{
    if(!this.__AccountCPMChart)
    {
        this.__AccountCPMChart = new CChartLineComponent();
        this.__AccountCPMChart.initObject(this, this.__Charts);
        this.__AccountCPMChart.setLeft(this.__AccountCtrChart.getLeft() + this.__AccountCtrChart.getWidth());
        this.__AccountCPMChart.setTop(this.__AccountCtrChart.getTop() );
        this.__Charts.PublisherCPMCaller = this.__AccountCPMChart;
        this.add(this.__AccountCPMChart);
    }

    var data = [
        ['date', 'CPM'],
        [new Date(2016,10,01), 4.54],
        [new Date(2016,10,02), 4.63],
        [new Date(2016,10,04), 4.81],
        [new Date(2016,10,05), 4.47],
        [new Date(2016,10,06), 4.66],
        [new Date(2016,10,07), 4.78],
        [new Date(2016,10,08), 4.46],
        [new Date(2016,10,09), 4.51],
        [new Date(2016,10,10), 4.52],
        [new Date(2016,10,11), 4.45],
        [new Date(2016,10,12), 4.51],
        [new Date(2016,10,13), 4.57],
        [new Date(2016,10,14), 4.55],
        [new Date(2016,10,15), 4.63],
        [new Date(2016,10,16), 4.58],
        [new Date(2016,10,17), 4.59],
        [new Date(2016,10,18), 4.49],
        [new Date(2016,10,19), 4.56]
    ];

    var clickTitle = "CPM";
    this.__AccountCPMChart.updateLineChartData(data, clickTitle, this.__DataFormat.currency, this._accountCPMCaller);
};

CAccountPublisherGraph.prototype._accountCPMCaller = function()
{
    google.charts.PublisherCPMCaller.drawLineChart();
};

CAccountPublisherGraph.prototype._initAccountCPCChart = function()
{
    if(!this.__AccountCPCChart)
    {
        this.__AccountCPCChart = new CChartLineComponent();
        this.__AccountCPCChart.initObject(this, this.__Charts);
        this.__AccountCPCChart.setLeft(this.__AccountCPMChart.getLeft() + this.__AccountCPMChart.getWidth());
        this.__AccountCPCChart.setTop(this.__AccountCtrChart.getTop() );
        this.__Charts.PublisherCPCCaller = this.__AccountCPCChart;
        this.add(this.__AccountCPCChart);
    }

    var data = [
        ['date', 'CPC'],
        [new Date(2016,10,01), 0.64],
        [new Date(2016,10,02), 0.61],
        [new Date(2016,10,04), 0.64],
        [new Date(2016,10,05), 0.66],
        [new Date(2016,10,06), 0.73],
        [new Date(2016,10,07), 0.69],
        [new Date(2016,10,08), 0.59],
        [new Date(2016,10,09), 0.64],
        [new Date(2016,10,10), 0.63],
        [new Date(2016,10,11), 0.61],
        [new Date(2016,10,12), 0.60],
        [new Date(2016,10,13), 0.59],
        [new Date(2016,10,14), 0.66],
        [new Date(2016,10,15), 0.59],
        [new Date(2016,10,16), 0.57],
        [new Date(2016,10,17), 0.55],
        [new Date(2016,10,18), 0.55],
        [new Date(2016,10,19), 0.54],
    ];

    var clickTitle = "CPC";
    this.__AccountCPCChart.updateLineChartData(data, clickTitle, this.__DataFormat.currency, this._accountCPCCaller);
};

CAccountPublisherGraph.prototype._accountCPCCaller = function()
{
    google.charts.PublisherCPCCaller.drawLineChart();
};

CAccountPublisherGraph.prototype._initPublisherBudgetChart = function()
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

CAccountPublisherGraph.prototype._publisherBudgetCaller = function()
{
    google.charts.publisherPieChartCaller.drawPieChart();
};

CAccountPublisherGraph.prototype.getAccountPanelWidth = function()
{
    return this.__GraphLeft;

};

CAccountPublisherGraph.prototype.getAccountPanelHeight = function()
{
    return this.__GraphTop;
}



