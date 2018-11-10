/**
 * Created by yangtian on 16/10/29.
 */

function CChartLineComponent()
{
    BiComponent.call(this);
    this.setId(newGuid());
    //this.__Charts = google.charts;
    //this.__Charts.Caller = this;
    this.setWidth(460);
    this.setHeight(300);

    /*this.__Options = {
        hAxis: {
            title: 'Time',
            gridlines:{color:'transparent',count:5},
            baselineColor:'transparent'
        },
        vAxis: {
            title: 'dollar',
            gridlines:{color:'#eeeeee',count:3},
            baselineColor:'#cdcdcd'
        },
        backgroundColor: '#FFFFFF',
        lineWidth: 3,
        //colors:['#36A2EB'],
        title: '账户消费',
        titleTextStyle: {
            color: '#6E6E6E',
            fontSize: 16,
        },
        colors:['3AB3E7'],
        pointSize: 0,
        pointShape: 'circle',
        dataOpacity: 0.8,
        legend:{position: 'top',alignment:'center',maxLines:2, textStyle: {color: '#CCCCCC', fontSize: 16,bold:false,fontName:"黑体"}}
    };*/
    this.__Options = {
        title: '消费',
        titleTextStyle: {
            color: '#6E6E6E',
            fontSize: 14,
        },
        legend: {position: 'bottom', textStyle: {color: '#6E6E6E', fontSize: 14}},
        hAxis: {
            gridlines:{color:'transparent',count:5},
            baselineColor:'transparent',
            format: 'y MMM, d'

        },
        vAxis: {
            gridlines:{color:'#eeeeee',count:3},
            baselineColor:'#cdcdcd',
            format: 'currency',
            minValue : 0
        },
        colors : ['#36A2EB'],
        tooltip: {textStyle: {color: '#9C9EA3'}, showColorCode: true}
    };

    this.__Data = null;
}

CChartLineComponent.prototype = new BiComponent;
CChartLineComponent.prototype._className = "CChartLineComponent";

CChartLineComponent.prototype.initObject = function(parent, chart)
{
    this.__Parent = parent;
    this.__Charts = chart;
    //this.__Charts.CallerLine = this;
};

CChartLineComponent.prototype.updateLineChartData = function(data, graphTitle, format, caller, pointsNum)
{
    this.__Data = data;
    this.__Options.title = graphTitle;
    this.__Options.hAxis.gridlines.count = pointsNum;
    this.__Options.vAxis.format = format;
    //this.__Caller = caller;
    this.__Charts.setOnLoadCallback(caller, this);
};

CChartLineComponent.prototype._drawLineChartCall = function()
{
    //google.charts.CallerLine._drawLineChart();
    //this.__Caller._drawLineChart();
};

CChartLineComponent.prototype.drawLineChart = function()
{
    var data = google.visualization.arrayToDataTable(
        this.__Data
    );

    var chart = new google.visualization.LineChart(document.getElementById(this.getId()));

    chart.draw(data, this.__Options);

};
