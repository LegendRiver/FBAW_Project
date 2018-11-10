/**
 * Created by yangtian on 16/11/10.
 */

function CReportPublisherChartsComponent()
{
    BiComponent.call(this);
    this.setCssClassName("eli-report-publisher-chart-component");
    this.setId(newGuid());

    this.__DataFormat = {
        currency : 'currency',
        decimal : 'decimal',
        percent : 'percent',
    };

    this.__PublisherLineChartTitle = {
        impression : "展现",
        click : "点击",
        ctr : "CTR",
        cpm : "CPM",
        cpc : "CPC"
    };

    this.__PointsNum = 5;
}

CReportPublisherChartsComponent.prototype = new BiComponent;
CReportPublisherChartsComponent.prototype._className = "CReportPublisherChartsComponent";

CReportPublisherChartsComponent.prototype.initObject = function(parent)
{
    this.__Parent = parent;
    this.__Charts = google.charts;
    this._init();
};

CReportPublisherChartsComponent.prototype._init = function()
{
    this._initPieChart();
    this._initImpressionChart();
    this._initClickChart();
    this._initCtrChart();
    this._initCPMChart();
    this._initCPCChart();
};

CReportPublisherChartsComponent.prototype._initPieChart = function()
{
    this.__PieChart = new CChartPieComponent();
    this.__PieChart.initObject(this, this.__Charts);
    this.__PieChart.setLeft(0);
    this.__PieChart.setTop(0);
    this.add(this.__PieChart);


    this.__Charts.PublisherBudgetPiechartCall = this.__PieChart;
};

CReportPublisherChartsComponent.prototype._singlePublisherBudgetCaller = function()
{
    google.charts.PublisherBudgetPiechartCall.drawPieChart();
};

CReportPublisherChartsComponent.prototype._initImpressionChart = function()
{
    this.__ImpressionChart = new CChartLineComponent();
    this.__ImpressionChart.initObject(this, this.__Charts);
    this.__ImpressionChart.setLeft(this.__PieChart.getWidth());
    this.__ImpressionChart.setTop(0);
    this.__Charts.SinglePublisherImpressionCaller = this.__ImpressionChart;
    this.add(this.__ImpressionChart);
};

CReportPublisherChartsComponent.prototype._singlePublisherImpressionCaller = function()
{
    google.charts.SinglePublisherImpressionCaller.drawLineChart()
};

CReportPublisherChartsComponent.prototype._initClickChart = function()
{
    if(!this.__ClickChart)
    {
        this.__ClickChart = new CChartLineComponent();
        this.__ClickChart.initObject(this, this.__Charts);
        this.__ClickChart.setLeft(this.__ImpressionChart.getLeft() + this.__ImpressionChart.getWidth());
        this.__ClickChart.setTop(this.__PieChart.getTop());
        this.__Charts.SinglePublisherClickCaller = this.__ClickChart;
        this.add(this.__ClickChart);
    }
    this.__GraphLeft = this.__ClickChart.getLeft() + this.__ClickChart.getWidth();
};

CReportPublisherChartsComponent.prototype._singlePublisherClickCaller = function()
{
    google.charts.SinglePublisherClickCaller.drawLineChart();
};

CReportPublisherChartsComponent.prototype._initCtrChart = function()
{
    if(!this.__CtrChart)
    {
        this.__CtrChart = new CChartLineComponent();
        this.__CtrChart.initObject(this, this.__Charts);
        this.__CtrChart.setLeft(this.__PieChart.getLeft());
        this.__CtrChart.setTop(this.__PieChart.getTop() + this.__PieChart.getHeight());
        this.__Charts.SinglePublisherCtrCaller = this.__CtrChart;
        this.add(this.__CtrChart);
        this.__ChartComponentHeight = this.__CtrChart.getTop() + this.__CtrChart.getHeight();
    }
};

CReportPublisherChartsComponent.prototype._singlePublisherCTRCaller = function()
{
    google.charts.SinglePublisherCtrCaller.drawLineChart();
};

CReportPublisherChartsComponent.prototype._initCPMChart = function()
{
    if(!this.__CPMChart)
    {
        this.__CPMChart = new CChartLineComponent();
        this.__CPMChart.initObject(this, this.__Charts);
        this.__CPMChart.setLeft(this.__CtrChart.getLeft() + this.__CtrChart.getWidth());
        this.__CPMChart.setTop(this.__CtrChart.getTop() );
        this.__Charts.SinglePublisherCPMCaller = this.__CPMChart;
        this.add(this.__CPMChart);
    }
};

CReportPublisherChartsComponent.prototype._singlePublisherCPMCaller = function()
{
    google.charts.SinglePublisherCPMCaller.drawLineChart();
};

CReportPublisherChartsComponent.prototype._initCPCChart = function()
{
    if(!this.__CPCChart)
    {
        this.__CPCChart = new CChartLineComponent();
        this.__CPCChart.initObject(this, this.__Charts);
        this.__CPCChart.setLeft(this.__CPMChart.getLeft() + this.__CPMChart.getWidth());
        this.__CPCChart.setTop(this.__CtrChart.getTop());
        this.__Charts.SinglePublisherCPCCaller = this.__CPCChart;
        this.add(this.__CPCChart);
    }
};

CReportPublisherChartsComponent.prototype._singlePublisherCPCCaller = function()
{
    google.charts.SinglePublisherCPCCaller.drawLineChart();
};

/*---pie chart---*/
CReportPublisherChartsComponent.prototype._generatePieChartData = function(balance, spent, publisherName)
{
    var data = [["name", "money"]];
    var arrayBalance = ["余额", balance];
    var arraySpent = ["消费", spent];
    data.push(arraySpent);
    data.push(arrayBalance);

    this.updatePublisherBudgetChartData(data, publisherName);
};

CReportPublisherChartsComponent.prototype.updatePublisherBudgetChartData = function(data, publisherName)
{
    var title = publisherName+"消费";
    this.__PieChart.upPieCharData(data, title, "", this._singlePublisherBudgetCaller);
};

CReportPublisherChartsComponent.prototype.updateReportPublisherData = function(publisherObject)
{
    var balance = publisherObject.getPublisherBalance();
    var spent = publisherObject.getPublisherSpent();
    var publisherName = publisherObject.getPublisherName();
    var dates = publisherObject.getPublisherDate();
    var impressions = publisherObject.getPublisherDailyImpression();
    var clicks = publisherObject.getPublisherDailyClick();
    var ctr = publisherObject.getPublisherDailyCTR();
    var cpm = publisherObject.getPublisherDailyCPM();
    var cpc = publisherObject.getPublisherDailyCPC();

    this._generatePieChartData(balance, spent, publisherName);
    this._updatePublisherLineChartData(dates, impressions, this.__PublisherLineChartTitle.impression);
    this._updatePublisherLineChartData(dates, clicks, this.__PublisherLineChartTitle.click);
    this._updatePublisherLineChartData(dates, ctr, this.__PublisherLineChartTitle.ctr);
    this._updatePublisherLineChartData(dates, cpm, this.__PublisherLineChartTitle.cpm);
    this._updatePublisherLineChartData(dates, cpc, this.__PublisherLineChartTitle.cpc);
};

CReportPublisherChartsComponent.prototype._updatePublisherLineChartData = function(dates, dailyData, title)
{
    var chartDailyData = [
        ['date', title]
    ];
    var array = [];
    var len = dates.length;
    for(var index=0; index<len; index++)
    {
        array = [];
        array.push(dates[index]);
        array.push(dailyData[index]);
        chartDailyData.push(array);
    }

    var hAxisPointsNum = this._hAxisPointCount(len);

    switch (title)
    {
        case this.__PublisherLineChartTitle.impression:
            this.__ImpressionChart.updateLineChartData(
                chartDailyData,
                title,
                this.__DataFormat.decimal,
                this._singlePublisherImpressionCaller,
                hAxisPointsNum
            );
            break;

        case this.__PublisherLineChartTitle.click :
            this.__ClickChart.updateLineChartData(
                chartDailyData,
                title,
                this.__DataFormat.decimal,
                this._singlePublisherClickCaller,
                hAxisPointsNum
            );
            break;
        case this.__PublisherLineChartTitle.ctr :
            this.__CtrChart.updateLineChartData(
                chartDailyData,
                title+"(%)",
                this.__DataFormat.decimal,
                this._singlePublisherCTRCaller,
                hAxisPointsNum
            );
            break;
        case this.__PublisherLineChartTitle.cpm :
            this.__CPMChart.updateLineChartData(
                chartDailyData,
                title,
                this.__DataFormat.currency,
                this._singlePublisherCPMCaller,
                hAxisPointsNum
            );
            break;
        case this.__PublisherLineChartTitle.cpc :
            this.__CPCChart.updateLineChartData(
                chartDailyData,
                title,
                this.__DataFormat.currency,
                this._singlePublisherCPCCaller,
                hAxisPointsNum
            );
            break;
        default :
            break;
    }
};

CReportPublisherChartsComponent.prototype._hAxisPointCount = function(len)
{
    if(len < this.__PointsNum)
    {
        return len;
    }
    else{
        return this.__PointsNum;
    }
};

CReportPublisherChartsComponent.prototype.getChartComponentHeight = function()
{
    return this.__ChartComponentHeight;
};


