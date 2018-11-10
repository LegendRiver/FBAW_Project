google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', '狗');

      data.addRows([
         [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
        [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
        [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
        [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
        [24, 60], [25, 50], [26, 52], [27, 51]
      ]);

      var options = {
        hAxis: {
          title: 'Time',
          gridlines:{color:'transparent',count:10},
          baselineColor:'transparent'
        },
        vAxis: {
          title: 'Spent',
          gridlines:{color:'#eeeeee',count:3},
          baselineColor:'#cdcdcd'
        },
        backgroundColor: '#FFFFFF',
        lineWidth: 3,
        colors:['#36A2EB'],
       pointSize: 0,
      pointShape: 'circle',
      dataOpacity: 0.8,
      legend:{position: 'top',alignment:'center',maxLines:2, textStyle: {color: '#CCCCCC', fontSize: 16,bold:false,fontName:"黑体"}}

      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }