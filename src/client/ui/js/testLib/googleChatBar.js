/**
 * Created by yangtian on 16/8/13.
 */

google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawMultSeries);

function drawMultSeries() {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350]
    ]);

    var options = {

        title: 'Company Performance',


        bars: 'horizontal', // Required for Material Bar Charts.
        hAxis: {format: 'decimal', direction: -1},
        height: 400,
        colors: ['#1b9e77', '#d95f02', '#7570b3']
    };
    var options1 = {

        title: 'Company Performance',


        bars: 'horizontal', // Required for Material Bar Charts.
        hAxis: {
            format: 'decimal',
            direction: -1,
        },

        height: 400,
        colors: ['#1b9e77', '#d95f02', '#7570b3'],
    };

    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}