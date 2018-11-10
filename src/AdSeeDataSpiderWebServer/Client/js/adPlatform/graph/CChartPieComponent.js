/**
 * Created by yangtian on 16/10/29.
 */

function CChartPieComponent()
{
    BiComponent.call(this);
    this.setId(newGuid());
    this.setWidth(460);
    this.setHeight(300);


    //this.__Charts = google.charts;
    //this.__Charts.Caller = this;
    this.__Visualization = google.visualization;
    this.__Options = {
        pieHole: 0.8,
        pieSliceTextStyle: {
            color: 'black',
        },
        colors: ['3AB3E7', '92C02C'],
        legend: {
            position: 'right', textStyle: {color: '#6E6E6E', fontSize: 14}
        },
        pieSliceText: 'none',
        slices: {
            0: {offset: 0.05},
        },
        title: '账户消费',
        titleTextStyle: {
            color: '#6E6E6E',
            fontSize: 14,
        },
        tooltip: {textStyle: {color: '#9C9EA3'}, showColorCode: true}
    };

    this.__Data = null;
}

CChartPieComponent.prototype = new BiComponent;
CChartPieComponent.prototype._className = "CChartPieComponent";

CChartPieComponent.prototype.initObject = function(parent, charts)
{
    this.__Charts = charts;
    this.__Parent = parent;
    //this.__Charts.CallerPie = this;
};

CChartPieComponent.prototype.upPieCharData = function(data, title, yFormat, caller)
{
    this.__Data = data;
    this.__Options.title = title;
    this.__Charts.setOnLoadCallback(caller, this);

    //this._drawPieChartCall();
    //google.charts.setOnLoadCallBack(caller, this);
};

CChartPieComponent.prototype._drawPieChartCall = function()
{
    //google.charts.CallerPie._drawPieChart();
};

CChartPieComponent.prototype.drawPieChart = function()
{
    var data = google.visualization.arrayToDataTable(
        this.__Data
    );
    var charComponent = document.getElementById(this.getId());
    var chart = new google.visualization.PieChart(charComponent);
    chart.draw(data, this.__Options);
};