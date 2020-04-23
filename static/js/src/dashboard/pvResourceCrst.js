$ ( function ()
{
    pvResourceInfo = {
        interval : {
            TIME : (1000 * 60 * 4) + 5000,
            siteRepInterval : null
        },
        selSite : {
            nation : "ALL"
        },
        tpl : {
            pvResourceCrst : getTemplate ( templates.pvResourceCrst ),
            pvCntintInfo : getTemplate ( templates.pvCntintInfo )
        }
    }

    $ ( '.select_ds select' ).select2 ( {

    } );

    $ ( '#search_option input' ).change ( function ()
    {
        var type = $ ( '#search_option input[name="epaSel"]:checked' ).val ();
        getLineChart ( type );
    } );

    $ ( '#selectType' ).change ( function ()
    {
        getGuageChart ( $ ( '#selectType' ).val () );
    } );

    $ ( "#allOn" ).click ( function ()
    {
        $ ( "input[type=checkbox]" ).prop ( "checked", true );
    } );

    $ ( "#allOff" ).click ( function ()
    {
        $ ( "input[type=checkbox]" ).prop ( "checked", false );
    } );

    $ ( "#btnApy" ).click ( function ()
    {

        var selNationIds = "";

        $ ( "#areaInfo input[type=checkbox]:checked" ).each ( function ()
        {

            if ( selNationIds == "" )
            {
                selNationIds = $ ( this ).val ();
            } else
            {
                selNationIds = selNationIds + "," + $ ( this ).val ();
            }
        } );
        pvResourceInfo.selSite.nation = selNationIds;

        reloadInfo ();
    } );

    getCntintPvInfo ();
    getPvResourceCrstInfo ();
    getGuageChart ( 1 );
    getLineChart ( 1 );
    pvResourceInit ();
} );

function reloadInfo ()
{
    getPvResourceCrstInfo ();
    if ( typeof $ ( '#guage1' ).highcharts () !== 'undefined' )
    {
        $ ( '#guage1' ).highcharts ().destroy ();
    }
    if ( typeof $ ( '#guage2' ).highcharts () !== 'undefined' )
    {
        $ ( '#guage2' ).highcharts ().destroy ();
    }
    if ( typeof $ ( '#guage3' ).highcharts () !== 'undefined' )
    {
        $ ( '#guage3' ).highcharts ().destroy ();
    }
    if ( typeof $ ( '#guage4' ).highcharts () !== 'undefined' )
    {
        $ ( '#guage4' ).highcharts ().destroy ();
    }
    if ( typeof $ ( '#guage5' ).highcharts () !== 'undefined' )
    {
        $ ( '#guage5' ).highcharts ().destroy ();
    }
    getGuageChart ( $ ( '#selectType' ).val () );

    if ( typeof $ ( '#graph2' ).highcharts () !== 'undefined' )
    {
        $ ( '#graph2' ).highcharts ().destroy ();
    }
    getLineChart ( $ ( '#search_option input[name="epaSel"]:checked' ).val () );
}

// Dashboard 화면 초기화
function pvResourceInit ()
{
    setInterval ( "reloadInfo()", pvResourceInfo.interval.TIME );

}

function getCntintPvInfo ()
{
    var $areaInfo = $ ( '#areaInfo' );

    $.ajax ( {
        url : contextPath + '/hom/dashboard/pvResourceCrst/getCntintPvInfo.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // console.log ( json.data );
                $areaInfo.empty ();

                var resultData = json.data;

                for ( var key in resultData )
                {
                    var cntint;
                    var pvInfoList = [];

                    cntint = key;
                    pvInfoList = resultData[key];

                    if ( pvResourceInfo.tpl.pvCntintInfo != null )
                    {
                        var template = _.template ( pvResourceInfo.tpl.pvCntintInfo );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            continent : pvInfoList[0].cntintKorNm,
                            pvList : pvInfoList,
                            unit : i18nMessage.msg_pvNum
                        } );
                        $areaInfo.html ( html )
                    }
                }
                $ ( "input[type=checkbox]" ).prop ( "checked", true );

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
}

function guageDataConvert ( value )
{
    var json = {}

    json.borderColor = 'red';
    json.color = Highcharts.getOptions ().colors[0];
    json.radius = '100%';
    json.innerRadius = '100%';

    if ( parseFloat ( value ) < 1 )
    {
        json.y = 0.01;
    } else
    {
        json.y = parseFloat ( value );
    }

    return json;
}

function initGuageChart ( maxValue )
{
    var eff1 = $ ( '#eff_1' ).text ();
    var guageData1 = [];
    guageData1.push ( guageDataConvert ( eff1 ) );

    var eff2 = $ ( '#eff_2' ).text ();
    var guageData2 = [];
    guageData2.push ( guageDataConvert ( eff2 ) );

    var eff3 = $ ( '#eff_3' ).text ();
    var guageData3 = [];
    guageData3.push ( guageDataConvert ( eff3 ) );

    var eff4 = $ ( '#eff_4' ).text ();
    var guageData4 = [];
    guageData4.push ( guageDataConvert ( eff4 ) );

    var eff5 = $ ( '#eff_5' ).text ();
    var guageData5 = [];
    guageData5.push ( guageDataConvert ( eff5 ) );

    $ ( '#guage1' ).highcharts ( {
        chart : {
            type : 'solidgauge',
            spacingBottom : 0,
            spacingTop : 0,
            spacingLeft : 0,
            spacingRight : 0,
            marginTop : 28,
            marginLeft : 28,
            marginRight : 28,
            marginBottom : 28,
            backgroundColor : 'rgba(255, 255, 255, 0.0)',
            style : {
                fontFamily : 'Nanum Gothic'
            }
        },

        title : {
            text : '',
            style : {
                display : 'none',
            }
        },

        pane : {
            startAngle : 0,
            endAngle : 360,
            background : [ { // Track for Move
                outerRadius : '112%',
                innerRadius : '88%',
                backgroundColor : 'rgba(17, 17, 26, 1)',
                borderWidth : 0
            } ]
        },

        yAxis : {
            min : 0,
            max : maxValue,
            lineWidth : 0,
            tickPositions : [],
            stops : [ [ 0, '#218ad8' ], [ 1, '#69ff05' ] // red
            ],
        },

        plotOptions : {
            solidgauge : {
                borderWidth : '15px',
                linecap : 'round',
                dataLabels : {
                    enabled : false
                }
            }
        },
        series : [ {
            data : guageData1
        } ]
    }, function ( chart )
    {

        var y = this.series[0].data[0].y;
        for ( var i = y; i >= 0; i = i - (y / 80) )
        {
            chart.addSeries ( {
                data : [ {
                    y : i,
                    radius : '100%',
                    innerRadius : '100%',
                } ],
                stickyTracking : false,
                enableMouseTracking : false
            }, false )
        }
        chart.redraw ();
        Highcharts.each ( chart.series, function ( s )
        {
            s.update ( {
                borderColor : s.data[0].color
            }, false );
        } );
        chart.redraw ();
    } );

    $ ( '#guage2' ).highcharts ( {
        chart : {
            type : 'solidgauge',
            spacingBottom : 0,
            spacingTop : 0,
            spacingLeft : 0,
            spacingRight : 0,
            marginTop : 28,
            marginLeft : 28,
            marginRight : 28,
            marginBottom : 28,
            backgroundColor : 'rgba(255, 255, 255, 0.0)',
            style : {
                fontFamily : 'Nanum Gothic'
            }
        },

        title : {
            text : '',
            style : {
                display : 'none',
            }
        },

        pane : {
            startAngle : 0,
            endAngle : 360,
            background : [ { // Track for Move
                outerRadius : '112%',
                innerRadius : '88%',
                backgroundColor : 'rgba(17, 17, 26, 1)',
                borderWidth : 0
            } ]
        },

        yAxis : {
            min : 0,
            max : maxValue,
            lineWidth : 0,
            tickPositions : [],
            stops : [ [ 0, '#218ad8' ], [ 1, '#69ff05' ] // red
            ],
        },

        plotOptions : {
            solidgauge : {
                borderWidth : '15px',
                linecap : 'round',
                dataLabels : {
                    enabled : false
                }
            }
        },

        series : [ {
            data : guageData2
        } ]
    }, function ( chart )
    {
        var y = this.series[0].data[0].y;
        for ( var i = y; i >= 0; i = i - (y / 80) )
        {
            chart.addSeries ( {
                data : [ {
                    y : i,
                    radius : '100%',
                    innerRadius : '100%',
                } ],
                stickyTracking : false,
                enableMouseTracking : false
            }, false )
        }
        chart.redraw ();
        Highcharts.each ( chart.series, function ( s )
        {
            s.update ( {
                borderColor : s.data[0].color
            }, false );
        } );
        chart.redraw ();
    } );

    $ ( '#guage3' ).highcharts ( {
        chart : {
            type : 'solidgauge',
            spacingBottom : 0,
            spacingTop : 0,
            spacingLeft : 0,
            spacingRight : 0,
            marginTop : 28,
            marginLeft : 28,
            marginRight : 28,
            marginBottom : 28,
            backgroundColor : 'rgba(255, 255, 255, 0.0)',
            style : {
                fontFamily : 'Nanum Gothic'
            }
        },

        title : {
            text : '',
            style : {
                display : 'none',
            }
        },

        pane : {
            startAngle : 0,
            endAngle : 360,
            background : [ { // Track for Move
                outerRadius : '112%',
                innerRadius : '88%',
                backgroundColor : 'rgba(17, 17, 26, 1)',
                borderWidth : 0
            } ]
        },

        yAxis : {
            min : 0,
            max : maxValue,
            lineWidth : 0,
            tickPositions : [],
            stops : [ [ 0, '#218ad8' ], [ 1, '#69ff05' ] // red
            ],
        },

        plotOptions : {
            solidgauge : {
                borderWidth : '15px',
                linecap : 'round',
                dataLabels : {
                    enabled : false
                }
            }
        },

        series : [ {
            data : guageData3
        } ]
    }, function ( chart )
    {
        var y = this.series[0].data[0].y;
        for ( var i = y; i >= 0; i = i - (y / 80) )
        {
            chart.addSeries ( {
                data : [ {
                    y : i,
                    radius : '100%',
                    innerRadius : '100%',
                } ],
                stickyTracking : false,
                enableMouseTracking : false
            }, false )
        }
        chart.redraw ();
        Highcharts.each ( chart.series, function ( s )
        {
            s.update ( {
                borderColor : s.data[0].color
            }, false );
        } );
        chart.redraw ();
    } );

    $ ( '#guage4' ).highcharts ( {
        chart : {
            type : 'solidgauge',
            spacingBottom : 0,
            spacingTop : 0,
            spacingLeft : 0,
            spacingRight : 0,
            marginTop : 28,
            marginLeft : 28,
            marginRight : 28,
            marginBottom : 28,
            backgroundColor : 'rgba(255, 255, 255, 0.0)',
            style : {
                fontFamily : 'Nanum Gothic'
            }
        },

        title : {
            text : '',
            style : {
                display : 'none',
            }
        },

        pane : {
            startAngle : 0,
            endAngle : 360,
            background : [ { // Track for Move
                outerRadius : '112%',
                innerRadius : '88%',
                backgroundColor : 'rgba(17, 17, 26, 1)',
                borderWidth : 0
            } ]
        },

        yAxis : {
            min : 0,
            max : maxValue,
            lineWidth : 0,
            tickPositions : [],
            stops : [ [ 0, '#218ad8' ], [ 1, '#69ff05' ] // red
            ],
        },

        plotOptions : {
            solidgauge : {
                borderWidth : '15px',
                linecap : 'round',
                dataLabels : {
                    enabled : false
                }
            }
        },

        series : [ {
            data : guageData4
        } ]
    }, function ( chart )
    {
        var y = this.series[0].data[0].y;
        for ( var i = y; i >= 0; i = i - (y / 80) )
        {
            chart.addSeries ( {
                data : [ {
                    y : i,
                    radius : '100%',
                    innerRadius : '100%',
                } ],
                stickyTracking : false,
                enableMouseTracking : false
            }, false )
        }
        chart.redraw ();
        Highcharts.each ( chart.series, function ( s )
        {
            s.update ( {
                borderColor : s.data[0].color
            }, false );
        } );
        chart.redraw ();
    } );

    $ ( '#guage5' ).highcharts ( {
        chart : {
            type : 'solidgauge',
            spacingBottom : 0,
            spacingTop : 0,
            spacingLeft : 0,
            spacingRight : 0,
            marginTop : 28,
            marginLeft : 28,
            marginRight : 28,
            marginBottom : 28,
            backgroundColor : 'rgba(255, 255, 255, 0.0)',
            style : {
                fontFamily : 'Nanum Gothic'
            }
        },

        title : {
            text : '',
            style : {
                display : 'none',
            }
        },

        pane : {
            startAngle : 0,
            endAngle : 360,
            background : [ { // Track for Move
                outerRadius : '112%',
                innerRadius : '88%',
                backgroundColor : 'rgba(17, 17, 26, 1)',
                borderWidth : 0
            } ]
        },

        yAxis : {
            min : 0,
            max : maxValue,
            lineWidth : 0,
            tickPositions : [],
            stops : [ [ 0, '#218ad8' ], [ 1, '#69ff05' ] // red
            ],
        },

        plotOptions : {
            solidgauge : {
                borderWidth : '15px',
                linecap : 'round',
                dataLabels : {
                    enabled : false
                }
            }
        },

        series : [ {
            data : guageData5
        } ]
    }, function ( chart )
    {
        var y = this.series[0].data[0].y;
        for ( var i = y; i >= 0; i = i - (y / 80) )
        {
            chart.addSeries ( {
                data : [ {
                    y : i,
                    radius : '100%',
                    innerRadius : '100%',
                } ],
                stickyTracking : false,
                enableMouseTracking : false
            }, false )
        }
        chart.redraw ();
        Highcharts.each ( chart.series, function ( s )
        {
            s.update ( {
                borderColor : s.data[0].color
            }, false );
        } );
        chart.redraw ();
    } );
}

function initLineChart ( acmsltEnergy, rdtn, type )
{

    var dateFormat = null;
    var tooltipDateFormat = null;

    if ( type == 1 )
    {
        dateFormat = homUtil.dateFormat.convertHHMM;
        tooltipDateFormat = homUtil.dateFormat.convertHHMM;
    } else if ( type == 2 )
    {
        dateFormat = homUtil.dateFormat.convertMMDD;
        tooltipDateFormat = homUtil.dateFormat.convertMMDD;
    } else if ( type == 3 )
    {
        dateFormat = homUtil.dateFormat.convertYYYYMM;
        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
    } else if ( type == 4 )
    {
        dateFormat = homUtil.dateFormat.convertYYYY;
        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
    }

    // 그래프
    $ ( '#graph2' ).highcharts ( {
        chart : {
            marginTop : 50,
            marginBottom : 78,
            backgroundColor : 'rgba(255, 255, 255, 0.0)',
            style : {
                fontFamily : 'Nanum Gothic'
            }
        },
        legend : {
            itemStyle : {
                color : '#ffffff',
                fontSize : '16',
            },
            itemHoverStyle : {
                color : '#ffffff'
            },
            squareSymbol : true
        },
        title : {
            text : '',
            style : {
                display : 'none',
            }
        },
        subtitle : {
            text : '',
            style : {
                display : 'none'
            }
        },
        exporting : {
            enabled : false
        },
        credits : {
            enabled : false
        },
        xAxis : {
            type : 'datetime',
            labels : {
                style : {
                    color : 'rgba(160,160,160,1)',
                    fontFamily : 'Nanum Gothic'
                },
                formatter : function ()
                {
                    var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                    return dateXAxis;
                }
            }
        },
        yAxis : [ {
            min : 0,
            title : {
                text : i18nMessage.msg_energy + ' (MWh)',
                style : {
                    color : '#e6e6e6',
                    fontFamily : 'Nanum Gothic'
                }
            },
            gridLineColor : 'rgba(160,160,160,0.3)',
            labels : {
                style : {
                    color : 'rgba(160,160,160,1)',
                    fontFamily : 'Nanum Gothic'
                }
            }
        }, {
            min : 0,
            opposite : true,
            title : {
                text : i18nMessage.msg_rdtn + ' (kWh/㎡/d)',
                style : {
                    color : '#e6e6e6',
                    fontFamily : 'Nanum Gothic'
                }
            },
            gridLineColor : 'rgba(160,160,160,0.3)',
            labels : {
                style : {
                    color : 'rgba(160,160,160,1)',
                    fontFamily : 'Nanum Gothic'
                }
            }
        } ],
        plotOptions : {
            column : {
                pointPadding : 0,
                borderWidth : 0
            },
            line : {
                marker : {
                    enabled : false
                }
            }
        },
        series : [ {
            type : 'column',
            yAxis : 0,
            color : '#1eddff',
            name : i18nMessage.msg_energy,
            data : acmsltEnergy
        }, {
            type : 'line',
            yAxis : 1,
            color : '#ff5a09',
            name : i18nMessage.msg_radiation,
            data : rdtn
        } ]
    } );
}
function getPvResourceCrstInfo ()
{
    $.ajax ( {
        url : contextPath + '/hom/dashboard/pvResourceCrst/getPvResourceCrstInfo.ajax',
        type : 'POST',
        data : {
            nationStr : pvResourceInfo.selSite.nation
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data != null )
                {
                    dispPvResource ( json.data.totalCpcty, json.data.genePw, json.data.todayGeneqty,
                            json.data.accmGeneqty, json.data.todayGenetm, json.data.accmltGenetm );
                } else
                {
                    dispPvResource ( 0, 0, 0, 0, 0, 0 );
                }

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
}

function dispPvResource ( totalCpcty, genePw, todayGeneqty, accmGeneqty, todayGenetm, accmltGenetm )
{
    var $totalCpcty = $ ( '#totalCpcty' );
    var $genePw = $ ( '#genePw' );
    var $todayGeneqty = $ ( '#todayGeneqty' );
    var $accmGeneqty = $ ( '#accmGeneqty' );
    var $accmGeneqtyTitle = $ ( '#accmGeneqtyTitle' );
    var $todayGenetm = $ ( '#todayGenetm' );
    var $acmltGenetm = $ ( '#acmltGenetm' );

    $totalCpcty.empty ();
    $totalCpcty.html ( homUtil.addNumberComma ( totalCpcty ) );

    $genePw.empty ();
    $genePw.html ( homUtil.addNumberComma ( genePw ) );

    $todayGeneqty.empty ();
    $todayGeneqty.html ( homUtil.addNumberComma ( todayGeneqty ) );

    if ( accmGeneqty.length >= 6 )
    {
        var unitCnvrtVal = accmGeneqty / 1000
        $accmGeneqtyTitle.empty ();
        $accmGeneqtyTitle.html ( i18nMessage.msg_cumulativePowerGeneration + " (GWh)" );
        $accmGeneqty.empty ();
        // PV 누적발전량 소수점2자리로 변경.
        // homUtil.mathFloor 를 사용할 경우 5.70 일 경우 5.7로 표시됨. homUtil.mathFloorComma 는 자리수 그대로 표시.
        $accmGeneqty.html ( homUtil.mathFloorComma ( unitCnvrtVal, 2 ) );

    } else
    {
        $accmGeneqtyTitle.empty ();
        $accmGeneqtyTitle.html ( i18nMessage.msg_cumulativePowerGeneration + " (MWh)" )
        $accmGeneqty.empty ();
        $accmGeneqty.html ( homUtil.addNumberComma ( accmGeneqty ) );
    }

    $todayGenetm.empty ();
    $acmltGenetm.empty ();
    $todayGenetm.html ( todayGenetm );
    $acmltGenetm.html ( accmltGenetm );
}

function getGuageChart ( type )
{
    var $gaugeDiv = $ ( '#gaugeDiv ul' );

    $.ajax ( {
        url : contextPath + '/hom/dashboard/pvResourceCrst/getEfficncyTopBottom.ajax',
        type : 'POST',
        data : {
            type : type,
            nationStr : pvResourceInfo.selSite.nation
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // console.log(json.data);
                if ( pvResourceInfo.tpl.pvResourceCrst != null )
                {
                    if ( json.data != null && json.data.length > 0 )
                    {
                        var template = _.template ( pvResourceInfo.tpl.pvResourceCrst );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            type : type,
                            efficncyTopBottomList : json.data
                        } );

                        $gaugeDiv.empty ().html ( html )
                        var maxValue = 100;
                        if ( type == '5' || type == '6' )
                        {
                            maxValue = 8;
                        }
                        initGuageChart ( maxValue );
                    } else
                    {
                        $gaugeDiv.empty ();
                    }
                }

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
}

function getLineChart ( type )
{

    date = new Date ();
    var today = homUtil.convertDateLongToString ( date.getTime (), homUtil.dateFormat.convertYYYYMMDD );
    $.ajax ( {
        url : contextPath + '/hom/dashboard/pvResourceCrst/getGeneTranstn.ajax',
        type : 'POST',
        data : {
            type : type,
            fromDate : today,
            toDate : homUtil.getIntervalDate ( date, 'DA', +1 ),
            nationStr : pvResourceInfo.selSite.nation
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // console.log(json.data);

                var lineChartList = json.data;
                var chartCategories = [];
                var acmsltEnergy = [];
                var rdtn = [];

                $.each ( json.data, function ( index, item )
                {
                    var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                    acmsltEnergy.push ( [ targetDate,
                            homUtil.mathFloor ( item.acmsltEnergy, staticVariable.decimalPoint ) ] );
                    rdtn.push ( [ targetDate, homUtil.mathFloor ( item.rdtn, staticVariable.decimalPoint ) ] );

                } );

                // for ( var i = 0 ; i < lineChartList.length; i++ )
                // {
                // chartCategories.push ( lineChartList[i].formatDate);
                // acmsltEnergy.push ( parseFloat(lineChartList[i].acmsltEnergy));
                // rdtn.push ( parseFloat(lineChartList[i].rdtn));
                // }

                initLineChart ( acmsltEnergy, rdtn, type );

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
}
