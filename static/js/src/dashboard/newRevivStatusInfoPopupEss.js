
// init highcharts


function initHighcharts ()
{

    console.log("ess_dt ::",$("#ess_dt").val());            // PV_ID
    console.log("ess_plan ::",$("#ess_plan").val());
    console.log("ess_acmslt ::",$("#ess_acmslt").val());
    var planArray = JSON.parse($("#ess_plan").val());
    var acmsltArray = JSON.parse($("#ess_acmslt").val());
    var pv_id = $("#ess_dt").val();    

    $.ajax ( {
        url : contextPath + '/dashboard/execdashboard/execDashboardGetPvName.ajax',
        type : 'POST',
        data : {pv_id : pv_id },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
               
                var pv_lang = $('html').attr('lang');
                var pv_name = '';
                
                if (pv_lang == 'ko')
                        pv_name =  json.data.pvKorName;
                else    pv_name =  json.data.pvEngName;
                    
                $('#ess_title').html(pv_name+ " ESS " + "["+$("#ess_year").val()
                		+i18nMessage.msg_year+" "+i18nMessage.msg_currentStatus+"]" );
                console.log("pv_lang ::",pv_lang);
                console.log("json data ::",json.data);
                
                
                
                //document.getElementById("#ess_dt").val());
                //alert(document.getElementById("ess_dt").value);
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
                            text: i18nMessage.msg_energyKWh,
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
                        name: i18nMessage.msg_plan,
                        data: planArray
                     }, {
                        type: 'column',
                        yAxis: 0,
                        color: '#33f8ff',
                        name: i18nMessage.msg_dischargeRatio,
                        data: acmsltArray
                    }]
                });

            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
                                
            }
        },
        error : function ( xhr, textStatus, error )
        {
            // abort error not show(user request cancel or aborted)
            if ( !(xhr.status === 0 || xhr.readyState === 0) )
            {
                if ( xhr.status === homConstants.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else if ( xhr.status === homConstants.statusNoPermission )
                {
                    location.href = contextPath + '/page/forbidden.do';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        }
    } ); 
    
    
    /*
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
                text: '방전량 (kWh)',
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
            name: '방전량',
            data: [200, 250, 270, 350, 410, 510, 680, 800, 815, 810, 805, 790]
        }]
    });
    */


}

/*$(document).ready(function(){
    $('body,html').animate({scrollTop: 156}, 800); 
});*/


$ ( function ()
{
    initHighcharts ();
} );