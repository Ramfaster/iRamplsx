// init highcharts
function initHighcharts ()
{
    $('#graph1-1').highcharts({
        chart: {
          type: 'solidgauge',
          spacingBottom: 0,
          spacingTop: 0,
          spacingLeft: 0,
          spacingRight: 0,
          marginTop: 28,
          marginLeft: 28,
          marginRight: 28,
          marginBottom: 28,
          backgroundColor:'rgba(255, 255, 255, 0.0)',
          style: {
            fontFamily: 'Nanum Gothic'
            }
        },

        title: {
            text: '',
            style: {
                display: 'none',
            }
        },

        pane: {
          startAngle: 0,
          endAngle: 360,
          background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '88%',
            backgroundColor:'rgba(17, 17, 26, 1)',
            borderWidth: 0
          }]
        },

        yAxis: {
          min: 0,
          max: 100,
          lineWidth: 0,
          tickPositions: [],
          stops: [
            [0, '#218ad8'],
            [1, '#69ff05'] // red
          ],
        },

        plotOptions: {
          solidgauge: {
            borderWidth: '15px',
            linecap: 'round',
            dataLabels: {
              enabled: false
            }
          }
        },

        series: [{
          data: [{
            borderColor: 'red',
            color: Highcharts.getOptions().colors[0],
            radius: '100%',
            innerRadius: '100%',
            y: 100
          }]
        }]
      },function(chart) {
        var y = this.series[0].data[0].y;
        for (var i = y; i >= 0; i = i - (y / 80)) {
          chart.addSeries({
            data: [{
              y: i,
              radius: '100%',
              innerRadius: '100%',
            }],
            stickyTracking: false,
            enableMouseTracking: false
          }, false)
        }
        chart.redraw();
        Highcharts.each(chart.series, function(s) {
          s.update({
            borderColor: s.data[0].color
          }, false);
        });
        chart.redraw();
      });

    $('#graph1-2').highcharts({
       chart: {
          type: 'solidgauge',
          spacingBottom: 0,
          spacingTop: 0,
          spacingLeft: 0,
          spacingRight: 0,
          marginTop: 28,
          marginLeft: 28,
          marginRight: 28,
          marginBottom: 28,
          backgroundColor:'rgba(255, 255, 255, 0.0)',
          style: {
            fontFamily: 'Nanum Gothic'
            }
        },

        title: {
            text: '',
            style: {
                display: 'none',
            }
        },

        pane: {
          startAngle: 0,
          endAngle: 360,
          background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '88%',
            backgroundColor:'rgba(17, 17, 26, 1)',
            borderWidth: 0
          }]
        },

        yAxis: {
          min: 0,
          max: 100,
          lineWidth: 0,
          tickPositions: [],
          stops: [
            [0, '#218ad8'],
            [1, '#69ff05'] // red
          ],
        },

        plotOptions: {
          solidgauge: {
            borderWidth: '15px',
            linecap: 'round',
            dataLabels: {
              enabled: false
            }
          }
        },

        series: [{
          data: [{
            borderColor: 'red',
            color: Highcharts.getOptions().colors[0],
            radius: '100%',
            innerRadius: '100%',
            y: 98
          }]
        }]
      },function(chart) {
        var y = this.series[0].data[0].y;
        for (var i = y; i >= 0; i = i - (y / 80)) {
          chart.addSeries({
            data: [{
              y: i,
              radius: '100%',
              innerRadius: '100%',
            }],
            stickyTracking: false,
            enableMouseTracking: false
          }, false)
        }
        chart.redraw();
        Highcharts.each(chart.series, function(s) {
          s.update({
            borderColor: s.data[0].color
          }, false);
        });
        chart.redraw();
      });

    $('#graph1-3').highcharts({
        chart: {
          type: 'solidgauge',
          spacingBottom: 0,
          spacingTop: 0,
          spacingLeft: 0,
          spacingRight: 0,
          marginTop: 28,
          marginLeft: 28,
          marginRight: 28,
          marginBottom: 28,
          backgroundColor:'rgba(255, 255, 255, 0.0)',
          style: {
            fontFamily: 'Nanum Gothic'
            }
        },

        title: {
            text: '',
            style: {
                display: 'none',
            }
        },

        pane: {
          startAngle: 0,
          endAngle: 360,
          background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '88%',
            backgroundColor:'rgba(17, 17, 26, 1)',
            borderWidth: 0
          }]
        },

        yAxis: {
          min: 0,
          max: 100,
          lineWidth: 0,
          tickPositions: [],
          stops: [
            [0, '#218ad8'],
            [1, '#69ff05'] // red
          ],
        },

        plotOptions: {
          solidgauge: {
            borderWidth: '15px',
            linecap: 'round',
            dataLabels: {
              enabled: false
            }
          }
        },

        series: [{
          data: [{
            borderColor: 'red',
            color: Highcharts.getOptions().colors[0],
            radius: '100%',
            innerRadius: '100%',
            y: 96
          }]
        }]
      },function(chart) {
        var y = this.series[0].data[0].y;
        for (var i = y; i >= 0; i = i - (y / 80)) {
          chart.addSeries({
            data: [{
              y: i,
              radius: '100%',
              innerRadius: '100%',
            }],
            stickyTracking: false,
            enableMouseTracking: false
          }, false)
        }
        chart.redraw();
        Highcharts.each(chart.series, function(s) {
          s.update({
            borderColor: s.data[0].color
          }, false);
        });
        chart.redraw();
      });

    $('#graph1-4').highcharts({
        chart: {
          type: 'solidgauge',
          spacingBottom: 0,
          spacingTop: 0,
          spacingLeft: 0,
          spacingRight: 0,
          marginTop: 28,
          marginLeft: 28,
          marginRight: 28,
          marginBottom: 28,
          backgroundColor:'rgba(255, 255, 255, 0.0)',
          style: {
            fontFamily: 'Nanum Gothic'
            }
        },

        title: {
            text: '',
            style: {
                display: 'none',
            }
        },

        pane: {
          startAngle: 0,
          endAngle: 360,
          background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '88%',
            backgroundColor:'rgba(17, 17, 26, 1)',
            borderWidth: 0
          }]
        },

        yAxis: {
          min: 0,
          max: 100,
          lineWidth: 0,
          tickPositions: [],
          stops: [
            [0, '#218ad8'],
            [1, '#69ff05'] // red
          ],
        },

        plotOptions: {
          solidgauge: {
            borderWidth: '15px',
            linecap: 'round',
            dataLabels: {
              enabled: false
            }
          }
        },

        series: [{
          data: [{
            borderColor: 'red',
            color: Highcharts.getOptions().colors[0],
            radius: '100%',
            innerRadius: '100%',
            y: 94
          }]
        }]
      },function(chart) {
        var y = this.series[0].data[0].y;
        for (var i = y; i >= 0; i = i - (y / 80)) {
          chart.addSeries({
            data: [{
              y: i,
              radius: '100%',
              innerRadius: '100%',
            }],
            stickyTracking: false,
            enableMouseTracking: false
          }, false)
        }
        chart.redraw();
        Highcharts.each(chart.series, function(s) {
          s.update({
            borderColor: s.data[0].color
          }, false);
        });
        chart.redraw();
      });

    $('#graph1-5').highcharts({
        chart: {
          type: 'solidgauge',
          spacingBottom: 0,
          spacingTop: 0,
          spacingLeft: 0,
          spacingRight: 0,
          marginTop: 28,
          marginLeft: 28,
          marginRight: 28,
          marginBottom: 28,
          backgroundColor:'rgba(255, 255, 255, 0.0)',
          style: {
            fontFamily: 'Nanum Gothic'
            }
        },

        title: {
            text: '',
            style: {
                display: 'none',
            }
        },

        pane: {
          startAngle: 0,
          endAngle: 360,
          background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '88%',
            backgroundColor:'rgba(17, 17, 26, 1)',
            borderWidth: 0
          }]
        },

        yAxis: {
          min: 0,
          max: 100,
          lineWidth: 0,
          tickPositions: [],
          stops: [
            [0, '#218ad8'],
            [1, '#69ff05'] // red
          ],
        },

        plotOptions: {
          solidgauge: {
            borderWidth: '15px',
            linecap: 'round',
            dataLabels: {
              enabled: false
            }
          }
        },

        series: [{
          data: [{
            borderColor: 'red',
            color: Highcharts.getOptions().colors[0],
            radius: '100%',
            innerRadius: '100%',
            y: 90
          }]
        }]
      },function(chart) {
        var y = this.series[0].data[0].y;
        for (var i = y; i >= 0; i = i - (y / 80)) {
          chart.addSeries({
            data: [{
              y: i,
              radius: '100%',
              innerRadius: '100%',
            }],
            stickyTracking: false,
            enableMouseTracking: false
          }, false)
        }
        chart.redraw();
        Highcharts.each(chart.series, function(s) {
          s.update({
            borderColor: s.data[0].color
          }, false);
        });
        chart.redraw();
      });


    //그래프
    $('#graph2').highcharts({
         chart: {
            marginTop: 50,
            marginBottom: 78,
            backgroundColor:'rgba(255, 255, 255, 0.0)',
            style: {
                fontFamily: 'Nanum Gothic'
            }
        },
        legend: {
            itemStyle: {
                color: '#ffffff',
                fontSize: '16',
            },
            itemHoverStyle: {
                color: '#ffffff'
            },
            squareSymbol : true
        },
        title: {
            text: '',
            style: {
                display: 'none',
            }
        },
        subtitle: {
            text: '',
            style: {
                display: 'none'
            }
        },
        exporting: { enabled: false },
        credits: {
                      enabled: false
                },
        xAxis: {
            categories: [
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00'
            ],
            crosshair: true,
            labels: {
                style: {
                    color: 'rgba(160,160,160,1)',
                    fontFamily: 'Nanum Gothic'
                }
            }
        },
        yAxis: [{
            min: 0,
            title: {
                text: '발전량 (kWh)',
                style: {
                    color: '#e6e6e6',
                    fontFamily: 'Nanum Gothic'
                }
            },
            gridLineColor: 'rgba(160,160,160,0.3)',
            labels: {
                style: {
                    color: 'rgba(160,160,160,1)',
                    fontFamily: 'Nanum Gothic'
                }
            }
        },{
            min: 0,
            opposite: true,
            title: {
                text: '일사량 (Wh/m2/d)',
                style: {
                    color: '#e6e6e6',
                    fontFamily: 'Nanum Gothic'
                }
            },
            gridLineColor: 'rgba(160,160,160,0.3)',
            labels: {
                style: {
                    color: 'rgba(160,160,160,1)',
                    fontFamily: 'Nanum Gothic'
                }
            }
        }],
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            },
            line: {
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            type: 'column',
            yAxis: 0,
            color: '#1eddff',
            name: '발전량',
            data: [350, 390, 470, 445, 525, 510, 505, 610, 615, 710, 710, 710, 620, 620, 520]
         }, {
            type: 'line',
            yAxis: 1,
            color: '#ff5a09',
            name: '일사량',
            data: [200, 250, 270, 350, 410, 510, 680, 800, 815, 810, 805, 790, 650, 600, 590]
        }]
    });


}

function select2Custom(){
  $('.select_ds select').select2({
  });
}

$ ( function ()
{
    initHighcharts ();
    select2Custom();
} );