var nationStr = "";

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
            essResourceCrst : getTemplate ( templates.essResourceCrst ),
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

    getCntintEssInfo ();
    getEssResourceCrstInfo ();
    getGuageChart ( 1 );
    getLineChart ( 1 );
    essResourceInit ();
} );

function reloadInfo ()
{
    getEssResourceCrstInfo ();

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
function essResourceInit ()
{
    setInterval ( "reloadInfo()", pvResourceInfo.interval.TIME );

}
function getCntintEssInfo ()
{
    var $areaInfo = $ ( '#areaInfo' );

    $.ajax ( {
        url : contextPath + '/hom/dashboard/essResourceCrst/getCntintEssInfo.ajax',
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
function getEssResourceCrstInfo ()
{

    $.ajax ( {
        url : contextPath + '/hom/dashboard/essResourceCrst/getEssResourceCrstInfo.ajax',
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
                    dispEssResource ( json.data.totalPCS, json.data.totalBAT, json.data.totalChr,
                            json.data.totalDisChr, json.data.accmChr, json.data.accmDisChr );
                } else
                {
                    dispEssResource ( 0, 0, 0, 0, 0, 0 );
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

function dispEssResource ( totalPCS, totalBAT, totalChr, totalDisChr, accmChr, accmDisChr )
{
    var $totalPCS = $ ( '#totalPCS' );
    var $totalBAT = $ ( '#totalBAT' );
    var $totalChr = $ ( '#totalChr' );
    var $totalDisChr = $ ( '#totalDisChr' );
    var $accmChr = $ ( '#accmChr' );
    var $accmDisChr = $ ( '#accmDisChr' );

    $totalPCS.empty ();
    $totalPCS.html ( homUtil.addNumberComma ( totalPCS ) );

    $totalBAT.empty ();
    $totalBAT.html ( homUtil.addNumberComma ( totalBAT ) );

    $totalChr.empty ();
    $totalChr.html ( homUtil.mathFloorComma ( totalChr, 1 ) );

    $totalDisChr.empty ();
    $totalDisChr.html ( homUtil.mathFloorComma ( totalDisChr, 1 ) );

    $accmChr.empty ();
    $accmChr.html ( homUtil.addNumberComma ( accmChr ) );

    $accmDisChr.empty ();
    $accmDisChr.html ( homUtil.addNumberComma ( accmDisChr ) );

    // if ( accmChr.length >= 6 )
    // {
    // var unitCnvrtVal = accmGeneqty / 1000
    // $accmGeneqtyTitle.empty();
    // $accmGeneqtyTitle.html ( "누적 충전량 (GWh)" );
    // $accmGeneqty.empty();
    // $accmGeneqty.html ( homUtil.addNumberComma(homUtil.mathFloor(unitCnvrtVal,0)) );
    // }
    // else
    // {
    // $accmGeneqtyTitle.empty();
    // $accmGeneqtyTitle.html ( "누적 발전량 (MWh)")
    // $accmGeneqty.empty();
    // $accmGeneqty.html ( homUtil.addNumberComma(accmGeneqty) );
    // }
}

function getGuageChart ( type )
{
    var $gaugeDiv = $ ( '#gaugeDiv ul' );

    $.ajax ( {
        url : contextPath + '/hom/dashboard/essResourceCrst/getEfficncyTopBottom.ajax',
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
                if ( pvResourceInfo.tpl.essResourceCrst != null )
                {
                    if ( json.data != null && json.data.length > 0 )
                    {
                        var template = _.template ( pvResourceInfo.tpl.essResourceCrst );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            efficncyTopBottomList : json.data
                        } );

                        $gaugeDiv.empty ().html ( html )
                        initGuageChart ();
                    } else
                    {
                        $gaugeDiv.empty ()
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

function initGuageChart ()
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
            max : 100,
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
            max : 100,
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
            max : 100,
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
            max : 100,
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
            max : 100,
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

function getLineChart ( type )
{

    $.ajax ( {
        url : contextPath + '/hom/dashboard/essResourceCrst/getGeneTranstn.ajax',
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
                var chr = [];
                var dischr = [];

                $.each ( json.data, function ( index, item )
                {
                    var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                    chr.push ( [ targetDate, homUtil.mathFloor ( item.chr, staticVariable.decimalPoint ) ] );
                    dischr.push ( [ targetDate, homUtil.mathFloor ( item.dischr, staticVariable.decimalPoint ) ] );

                } );

                initLineChart ( chr, dischr, type );

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

function initLineChart ( chr, dischr, type )
{

    var dateFormat = null;
    var tooltipDateFormat = null;

    if ( type == 1 )
    {
        dateFormat = homUtil.dateFormat.convertMMDD;
        tooltipDateFormat = homUtil.dateFormat.convertMMDD;
    } else if ( type == 2 )
    {
        dateFormat = homUtil.dateFormat.convertYYYYMM;
        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
    } else if ( type == 3 )
    {
        dateFormat = homUtil.dateFormat.convertYYYY;
        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
    }

    $ ( '#graph2' ).highcharts ( {
        chart : {
            type : 'column',
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
                text : i18nMessage.msg_slashChrdischr + ' (MWh)',
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
        // tooltip: {
        // headerFormat: '<span style="font-size:16px">{point.key}</span><table>',
        // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        // '<td style="padding:0"><b>{point.y:.1f} kWh</b></td></tr>',
        // footerFormat: '</table>',
        // shared: true,
        // useHTML: true
        // },
        plotOptions : {
            column : {
                pointPadding : 0.2,
                borderWidth : 0
            }
        },
        series : [ {
            color : '#1eddff',
            name : i18nMessage.msg_chargeRatio,
            data : chr

        }, {
            color : '#7d3b7d',
            name : i18nMessage.msg_dischargeRatio,
            data : dischr

        } ]
    } );
}