/**
 * Created by yangtian on 16/8/13.
 */

google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {

    var data = google.visualization.arrayToDataTable([
        ['Effort', 'Amount given'],
        ['Spent', 20],
        ['balance', 80]
    ]);

    var options = {
        pieHole: 0.8,
        pieSliceTextStyle: {
            color: 'black',
        },
        colors: ['3AB3E7', '92C02C'],
        legend: {
            position: 'labeled', textStyle: {color: '#6E6E6E', fontSize: 12}
        },
        pieSliceText: 'none',
        slices: {
            0: {offset: 0.05},
        },
        title: 'Account Spent',
        titleTextStyle: {
            color: '#6E6E6E'
        },
        tooltip: {textStyle: {color: '#9C9EA3'}, showColorCode: true}

    };

    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}