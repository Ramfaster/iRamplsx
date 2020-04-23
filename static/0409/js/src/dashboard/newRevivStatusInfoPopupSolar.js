
// init highcharts
function initHighcharts ()
{
    //그래프
    $('#graph1').highcharts({
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
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12'
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
            color: '#7d7d7d',
            name: '계획',
            data: [350, 390, 470, 445, 525, 510, 505, 610, 615, 710, 710, 710]
         }, {
            type: 'column',
            yAxis: 0,
            color: '#33f8ff',
            name: '발전량',
            data: [200, 250, 270, 350, 410, 510, 680, 800, 815, 810, 805, 790]
        }]
    });


}


$ ( function ()
{
    initHighcharts ();
} );