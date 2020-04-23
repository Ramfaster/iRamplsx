var redrawCallbacks = [], chart1, chart2, chart3, chart4, chart5, chart6, chart7, graph2Label, graph4Label;
var isKorean = false;
if ( lang == locale.korea || lang == locale.korean )
{
    isKorean = true;
}

function appendRedrawEvent ( callback )
{
    redrawCallbacks.push ( callback );
}

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type1' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $imageType = $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
    // 조회기간
    var $dateType = $ ( '#dateType' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    var $selType = $ ( '#alarmGrpCd, #alarmSubGrpCd, #alarmGradCd' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

// set datetimepicker
function setdatetimepicker ()
{
    var $dateType = $ ( '#dateType' );
    $dateType.change ( function ()
    {
        var $from = $ ( '#fromDate' ), $to = $ ( '#toDate' );
        var options = {
            language : language,
            pickerPosition : "bottom-right",
            autoclose : true,
            todayHighlight : true,
            todayBtn : true
        };

        $from.datetimepicker ( 'remove' );
        $to.datetimepicker ( 'remove' );

        if ( this.value === 'D' )
        {
            options.format = 'yyyy-mm-dd';
            options.startView = 2;
            options.minView = 2;

            $from.val ( homUtil.getIntervalDate ( date, 'DA', -7 ) );
            $to.val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );
        } else if ( this.value === 'M' )
        {
            options.format = 'yyyy-mm';
            options.startView = 3;
            options.minView = 3;

            $from.val ( homUtil.getIntervalDate ( date, 'MO', -12 ) );
            $to.val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );
        } else if ( this.value === 'Y' )
        {
            options.format = 'yyyy';
            options.startView = 4;
            options.minView = 4;

            $from.val ( homUtil.getIntervalDate ( date, 'YE', -6 ) );
            $to.val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );
        }

        $from.datetimepicker ( options ).on ( 'changeDate', function ( selected )
        {
            var fromDate = new Date ( selected.date.valueOf () );
            fromDate.setDate ( fromDate.getDate ( new Date ( selected.date.valueOf () ) ) );
            $to.datetimepicker ( 'setStartDate', fromDate );
        } );

        $to.datetimepicker ( options ).on ( 'changeDate', function ( selected )
        {
            var toDate = new Date ( selected.date.valueOf () );
            toDate.setDate ( toDate.getDate ( new Date ( selected.date.valueOf () ) ) );
            $from.datetimepicker ( 'setEndDate', toDate );
        } );

        $from.datetimepicker ( 'setEndDate', $to.val () );
        $to.datetimepicker ( 'setStartDate', $from.val () );

        $from.datetimepicker ().on ( 'changeDate', function ()
        {
            setPeriodTitle ( $from.val (), $to.val () );
        } );
        $to.datetimepicker ().on ( 'changeDate', function ()
        {
            setPeriodTitle ( $from.val (), $to.val () );
        } );

        setPeriodTitle ( $from.val (), $to.val () );
    } );
    $dateType.val ( 'D' );
    $dateType.trigger ( 'change' );
}

// 날짜 유형 customize
function customizeDateType ()
{
    // 조회기간
    var $dateType = $ ( '#dateType' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );
}

var graph1Data = {
    chart : {
        renderTo : 'graph1',
        marginTop : 50
    },
    title : {
        text : '',
        style : {
            display : 'none'
        }
    },
    subtitle : {
        text : '',
        style : {
            display : 'none'
        }
    },
    exporting : {
        enabled : true,
        sourceWidth : 914
    },
    credits : {
        enabled : false
    },
    xAxis : {
        crosshair : true
    },
    yAxis : [ {
        min : 0,
        title : {
            text : i18nMessage.msg_alarmCount
        }
    } ],
    plotOptions : {
        column : {
            pointPadding : 0,
            borderWidth : 0
        }
    },
    series : [ {
        type : 'column',
        yAxis : 0,
        color : '#ffd183',
        name : i18nMessage.msg_alarmCount
    } ]
};

var graph2Data = {
    chart : {
        renderTo : 'graph2',
        events : {
            redraw : function ()
            {
                for ( var i = 0; i < redrawCallbacks.length; ++i )
                {
                    redrawCallbacks[i].call ( this, event );
                }
            }
        },
        height : 290,
        type : 'pie'
    },
    legend : {
        labelFormatter : function ()
        {
            return '<div>' + this.name + '<br /><span style="font-weight:normal;">' + this.y_label + '</span>'
                    + '<span style="font-weight:normal;"> (' + this.y + '%)</span></div>';
        },
        align : 'right',
        verticalAlign : 'middle',
        layout : 'vertical',
        itemMarginBottom : 20
    },
    credits : {
        enabled : false
    },
    colors : [ '#7cb5ec', '#f7a35c' ],
    title : {
        text : '',
        style : {
            display : 'none'
        }
    },
    plotOptions : {
        pie : {
            shadow : false,
            size : '100%',
            innerSize : '70%',
            dataLabels : {
                enabled : false
            },
            showInLegend : true
        }
    },
    exporting : {
        enabled : true,
        sourceWidth : 488
    },
    series : [ {
        type : 'pie',
        name : i18nMessage.msg_alarmOccurRate
    } ]
};

var graph3Data = {
    chart : {
        renderTo : 'graph3',
        plotBackgroundColor : null,
        plotBorderWidth : null,
        plotShadow : false,
        height : 290,
        type : 'pie'
    },
    legend : {
        align : 'right',
        verticalAlign : 'middle',
        layout : 'vertical',
        x : 0,
        y : 0
    },
    credits : {
        enabled : false
    },
    title : {
        text : '',
        style : {
            display : 'none'
        }
    },
    plotOptions : {
        pie : {
            allowPointSelect : true,
            cursor : 'pointer',
            dataLabels : {
                enabled : false
            },
            showInLegend : true
        }
    },
    series : [ {
        colorByPoint : true
    } ]
};

var graph4Data = {
    chart : {
        renderTo : 'graph4',
        plotBackgroundColor : null,
        plotBorderWidth : null,
        plotShadow : false,
        height : 325,
        type : 'pie',
        events : {
            redraw : function ()
            {
                for ( var i = 0; i < redrawCallbacks.length; ++i )
                {
                    redrawCallbacks[i].call ( this, event );
                }
            }
        }
    },
    legend : {
        align : 'left'
    },
    credits : {
        enabled : false
    },
    title : {
        text : '',
        style : {
            display : 'none'
        }
    },
    plotOptions : {
        pie : {
            center : [ 100, 100 ],
            allowPointSelect : true,
            cursor : 'pointer',
            dataLabels : {
                enabled : false
            },
            showInLegend : true
        }
    },
    series : [ {
        colorByPoint : true
    } ]
};

var graph5Data = {
    chart : {
        renderTo : 'graph5',
        height : 290,
        type : 'pie'
    },
    legend : {

        align : 'left'
    },
    credits : {
        enabled : false
    },
    title : {
        text : '',
        style : {
            display : 'none'
        }
    },
    plotOptions : {
        pie : {
            center : [ 125, 90 ],
            shadow : false,
            size : '100%',
            innerSize : '70%',
            dataLabels : {
                enabled : false
            },
            showInLegend : true
        }
    },
    series : [ {
        type : 'pie',
        name : i18nMessage.msg_alarmOccurRate
    } ]
};

var graph6Data = {
    chart : {
        renderTo : 'graph6',
        plotBackgroundColor : null,
        plotBorderWidth : null,
        plotShadow : false,
        height : 290,
        type : 'pie'
    },
    legend : {
        align : 'right',
        verticalAlign : 'middle',
        layout : 'vertical',
        x : 0,
        y : 0
    },
    credits : {
        enabled : false
    },
    title : {
        text : '',
        style : {
            display : 'none'
        }
    },
    plotOptions : {
        pie : {
            allowPointSelect : true,
            size : '80%',
            innerSize : '70%',
            cursor : 'pointer',
            dataLabels : {
                enabled : false
            },
            showInLegend : true
        }
    },
    series : [ {
        colorByPoint : true
    } ]
};

var graph7Data = {
    chart : {
        renderTo : 'graph7',
        marginTop : 50
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
        categories : [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ],
        crosshair : true
    },
    yAxis : [ {
        min : 0,
        title : {
            text : i18nMessage.msg_alarmCount
        }
    } ],
    plotOptions : {
        line : {
            pointPadding : 0,
            borderWidth : 0,
            lineWidth : 1,
            marker : {
                enabled : false
            }
        }
    },
    series : []
};

var gridBasic = {
    mtype : 'POST',
    datatype : 'json',
    loadonce : true,
    autowidth : true,
    shrinkToFit : false,
    postData : {},
    rowNum : 10,
    formatter : {
        integer : {
            thousandsSeparator : ",",
            defaultValue : '0'
        }
    },
    multiselect : false,
    multiboxonly : false,
    page : 1,
    scroll : true,
    emptyrecords : i18nMessage.msg_sentenceGridNoData,
    viewrecords : false
};

function customSort ( cell, rowObject )
{
    if ( typeof cell === "string" && /^test(\d)+$/i.test ( cell ) )
    {
        return parseInt ( cell.substring ( 4 ), 10 );
    } else
    {
        return cell;
    }
}

function customFormat ( cellValue, options, rowdata, action )
{
    return homUtil.addNumberComma ( parseInt ( cellValue, 10 ) );
}

var grid1Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectAlarmStatisticsGridList.ajax',
    height : 330,
    sortname : "occrrncDt",
    sortorder : "desc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_date, i18nMessage.msg_totalAlarmCount ],
    colModel : [ {
        name : 'occrrncDt',
        index : '',
        align : 'center',
        width : '115',
        sorttype : customSort
    }, {
        name : 'alarmCount',
        index : '',
        align : 'center',
        width : '115',
        sorttype : customSort,
        formatter : customFormat
    } ],
    loadComplete : function ( data )
    {
        var $gqNodata = $ ( '.gq_nodata' );

        if ( data.records === 0 )
        {
            $gqNodata.show ();
        } else
        {
            $gqNodata.hide ();

            $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
        }

        // 조회결과 타이틀
        var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
        $ ( "#totalRowCount1" ).text ( resultText );
    }
}, gridBasic );

var grid2Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectGroupOfAlarmRateAndCountGridList.ajax',
    height : 255,
    sortname : "alarmRate",
    sortorder : "asc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_assortment, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
    colModel : [ {
        name : 'eachGrpCdNm',
        index : '',
        align : 'center',
        width : '110',
        sorttype : customSort
    }, {
        name : 'alarmCount',
        index : '',
        align : 'center',
        width : '60',
        sorttype : customSort,
        formatter : customFormat
    }, {
        name : 'alarmRate',
        index : '',
        align : 'center',
        width : '60',
        sorttype : customSort
    } ],
    loadComplete : function ( data )
    {
        var $gqNodata = $ ( '.gq_nodata' );

        if ( data.records === 0 )
        {
            $gqNodata.show ();
        } else
        {
            $gqNodata.hide ();

            $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
        }

        // 조회결과 타이틀
        var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
        $ ( "#totalRowCount2" ).text ( resultText );
    }
}, gridBasic );

var grid3Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectGroupOfAlarmRateAndCountGridList.ajax',
    height : 346,
    sortname : "alarmRate",
    sortorder : "asc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_assortment, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
    colModel : [ {
        name : 'eachGrpCdNm',
        index : '',
        align : 'center',
        width : '140',
        sorttype : customSort
    }, {
        name : 'alarmCount',
        index : '',
        align : 'center',
        width : '120',
        sorttype : customSort,
        formatter : customFormat
    }, {
        name : 'alarmRate',
        index : '',
        align : 'center',
        width : '120',
        sorttype : customSort
    } ],
    loadComplete : function ( data )
    {
        var $gqNodata = $ ( '.gq_nodata' );

        if ( data.records === 0 )
        {
            $gqNodata.show ();
        } else
        {
            $gqNodata.hide ();

            $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
        }

        // 조회결과 타이틀
        var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
        $ ( "#totalRowCount3" ).text ( resultText );
    }
}, gridBasic );

var grid4Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectParameterOfAlarmRateAndCountGridList.ajax',
    height : 325,
    sortname : "alarmRate",
    sortorder : "desc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_assortment, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
    colModel : [ {
        name : 'tagNm',
        index : '',
        align : 'center',
        width : '100',
        sorttype : customSort
    }, {
        name : 'alarmCount',
        index : '',
        align : 'center',
        width : '60',
        sorttype : customSort,
        formatter : customFormat
    }, {
        name : 'alarmRate',
        index : '',
        align : 'center',
        width : '60',
        sorttype : customSort
    } ],
    loadComplete : function ( data )
    {
        var $gqNodata = $ ( '.gq_nodata' );

        if ( data.records === 0 )
        {
            $gqNodata.show ();
        } else
        {
            $gqNodata.hide ();

            $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
        }

        // 조회결과 타이틀
        var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
        $ ( "#totalRowCount4" ).text ( resultText );
    }
}, gridBasic );

var grid5Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectCodAlarmStatisticsGridList.ajax',
    height : 204,
    sortname : "years",
    sortorder : "desc",
    rownumbers : false,
    colNames : [ i18nMessage.msg_years, i18nMessage.msg_january, i18nMessage.msg_febuary, i18nMessage.msg_march,
            i18nMessage.msg_april, i18nMessage.msg_may, i18nMessage.msg_june, i18nMessage.msg_july,
            i18nMessage.msg_august, i18nMessage.msg_september, i18nMessage.msg_october, i18nMessage.msg_november,
            i18nMessage.msg_december, i18nMessage.msg_subtotal ],
    colModel : [ {
        name : 'years',
        index : '',
        align : 'center',
        width : '85',
        sorttype : customSort
    }, {
        name : 'january',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'febuary',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'march',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'april',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'may',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'june',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'july',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'august',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'september',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'october',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'november',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'december',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'totalAlarmCount',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort,
        formatter : customFormat
    } ],
    loadComplete : function ( data )
    {
        var $gqNodata = $ ( '.gq_nodata' );

        if ( data.records === 0 )
        {
            $gqNodata.show ();
        } else
        {
            $gqNodata.hide ();

            $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
        }

        // 조회결과 타이틀
        var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
        $ ( "#totalRowCount5" ).text ( resultText );
    },
    gridComplete : function ()
    {
        var ids = $ ( '#gridList5' ).jqGrid ( 'getDataIDs' );
        var rows = $ ( '#gridList5' ).jqGrid ( 'getRowData' );
        var reverseRows = _.sortBy ( rows, 'years' ).reverse ();
        var monthRangeKeys = _.keys ( reverseRows[0] ).slice ( 1, 13 );

        for ( var i = 0; i < ids.length; i++ )
        {
            var id = ids[i];
            var subtractionArray = [];
            var customDataArray = [];
            var rowValues1 = _.toArray ( reverseRows[i] ).slice ( 1, 13 ).map ( function ( item )
            {
                return parseInt ( item, 10 )
            } );
            var customData;

            if ( i < ids.length - 1 )
            {
                var rowValues2 = _.toArray ( reverseRows[i + 1] ).slice ( 1, 13 ).map ( function ( item )
                {
                    return parseInt ( item, 10 )
                } );

                for ( var j = 0; j < rowValues1.length; j++ )
                {
                    var subtractionValue = rowValues1[j] - rowValues2[j];
                    subtractionArray.push ( subtractionValue );
                }

                for ( var k = 0; k < subtractionArray.length; k++ )
                {
                    if ( subtractionArray[k] > 0 )
                    {
                        customData = homUtil.addNumberComma ( rowValues1[k] )
                                + ' <span class="t_org">(<i class="icon_up"></i> ' + subtractionArray[k] + ')</span>';
                    } else if ( subtractionArray[k] < 0 )
                    {
                        customData = homUtil.addNumberComma ( rowValues1[k] )
                                + ' <span class="t_blue">(<i class="icon_down"></i> ' + Math.abs ( subtractionArray[k] )
                                + ')</span>';
                    } else
                    {
                        customData = homUtil.addNumberComma ( rowValues1[k] ) + ' ( - 0)';
                    }
                    customDataArray.push ( customData );
                }

                $ ( '#gridList5' ).jqGrid ( 'setRowData', id, _.object ( monthRangeKeys, customDataArray ) );
            } else
            {
                for ( var y = 0; y < rowValues1.length; y++ )
                {
                    customData = homUtil.addNumberComma ( rowValues1[y] ) + ' ( - 0)';
                    customDataArray.push ( customData );
                }

                $ ( '#gridList5' ).jqGrid ( 'setRowData', id, _.object ( monthRangeKeys, customDataArray ) );
            }
        }
    }
}, gridBasic );

// 팝업 보기
function showPopup ()
{
    $ ( '.btn_popup' ).each ( function ()
    {
        $ ( this ).magnificPopup ( {
            type : 'ajax',
            alignTop : false,
            overflowY : 'scroll'
        } )
    } )
}

// 기간 타이틀 설정 ( fromDate : 조회 시작, toDate : 조회 종료)
function setPeriodTitle ( fromDate, toDate )
{
    $ ( '#period' ).html ( fromDate + '~' + toDate );
}

// 알람 통계 차트 목록 조회
function getAlarmStatisticsChartList ()
{
    $.ajax ( {
        url : contextPath + '/hom/analysis/alarm/selectAlarmStatisticsChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( !_.isEmpty ( json.data ) )
                {
                    var xAxisCate = [], // x축 카테고리
                    alarmCount = []; // 알람 건수

                    $.each ( json.data, function ()
                    {
                        xAxisCate.push ( this.occrrncDt );
                        alarmCount.push ( parseInt ( this.alarmCount, 10 ) );
                    } );

                    // 차트 데이터 설정
                    chart1.xAxis[0].setCategories ( xAxisCate );
                    chart1.series[0].setData ( alarmCount );
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

// 유형별 알람 발생 비율/건수 차트 목록 조회
function getTypeOfAlarmRateAndCountChartList ()
{
    $.ajax ( {
        url : contextPath + '/hom/analysis/alarm/selectTypeOfAlarmRateAndCountChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( !_.isEmpty ( json.data ) )
                {
                    var data = [], totalAlarmCount = homUtil.addNumberComma ( parseInt ( json.data[0].totalAlarmCount,
                            10 ) );

                    $.each ( json.data, function ()
                    {
                        var jsonData = {};
                        jsonData.name = this.alarmGrpCd == 'ALG01' ? i18nMessage.msg_eqmtAlarm
                                : i18nMessage.msg_systemAlarm;
                        jsonData.y = parseFloat ( this.alarmRate );
                        jsonData.y_label = homUtil.addNumberComma ( parseInt ( this.alarmCount, 10 ) );
                        data.push ( jsonData );
                    } );

                    redrawCallbacks = [];
                    appendRedrawEvent ( function ()
                    {
                        if ( graph2Label )
                        {
                            graph2Label.destroy ();
                        }
                        graph2Label = this.renderer.label (
                                '<div><span style="font-size:14px;color:#4c4743;">' + i18nMessage.msg_totalOccurCount
                                        + '</span>' + '<br />' + '<span style="font-size:30px;color:#231815;">'
                                        + totalAlarmCount + '</span></div>' ).add ();
                        graph2Label.align ( Highcharts.extend ( graph2Label.getBBox (), {
                            align : 'left',
                            x : 90,
                            verticalAlign : 'middle',
                            y : 0
                        } ), null, 'spacingBox' );
                    } );

                    // 차트 데이터 설정
                    chart2.series[0].setData ( data );
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

// 알람 그룹별 비율/건수 차트 목록 조회
function getGroupOfAlarmRateAndCountChartList ()
{
    $.ajax ( {
        url : contextPath + '/hom/analysis/alarm/selectGroupOfAlarmRateAndCountChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( !_.isEmpty ( json.data ) )
                {
                    var data = [], totalAlarmCount = homUtil.addNumberComma ( parseInt ( json.data[0].totalAlarmCount,
                            10 ) );

                    $.each ( json.data, function ()
                    {
                        var jsonData = {};
                        jsonData.name = this.eachGrpCdNm;
                        jsonData.y = parseInt ( this.alarmRate, 10 );
                        data.push ( jsonData );
                    } );

                    var sortedData = _.sortBy ( data, 'y' ).reverse ();
                    sortedData[0].sliced = true;
                    sortedData[0].selected = true;

                    var alarmGrpCd = $ ( '#alarmGrpCd' ).val ();

                    if ( alarmGrpCd == '' )
                    {
                        // 차트 데이터 설정
                        chart3.series[0].setData ( sortedData );
                    } else
                    {
                        redrawCallbacks = [];
                        appendRedrawEvent ( function ()
                        {
                            if ( graph4Label )
                            {
                                graph4Label.destroy ();
                            }
                            graph4Label = this.renderer.label (
                                    '<div><span style="font-size:24px;color:#231815;">' + i18nMessage.msg_totalOccur
                                            + '</span>' + '<br />' + '<span style="font-size:24px;color:#231815;">'
                                            + totalAlarmCount + i18nMessage.msg_count + '</span></div>' ).add ();
                            graph4Label.align ( Highcharts.extend ( graph4Label.getBBox (), {
                                align : 'right',
                                x : 0,
                                verticalAlign : 'middle',
                                y : 0
                            } ), null, 'spacingBox' );
                        } );

                        // 차트 데이터 설정
                        chart4.series[0].setData ( sortedData );
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

// 알람 등급별 발생 건수 차트 목록 조회
function getGradeOfAlarmRateAndCountChartList ()
{
    $.ajax ( {
        url : contextPath + '/hom/analysis/alarm/selectGradeOfAlarmRateAndCountChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( !_.isEmpty ( json.data ) )
                {
                    var data = [], gradeMap = {}, colorMap = {}, totalAlarmCount = homUtil.addNumberComma ( parseInt (
                            json.data[0].totalAlarmCount, 10 ) );
                    gradeMap.ALVL01 = 'Notice';
                    gradeMap.ALVL02 = 'Warning';
                    gradeMap.ALVL03 = 'Fault';
                    gradeMap.ALVL04 = 'Disconnect';

                    colorMap.ALVL01 = '#009944';
                    colorMap.ALVL02 = '#ffb230';
                    colorMap.ALVL03 = '#d75024';
                    colorMap.ALVL04 = '#6c7176';

                    $ ( '#gradeTotal' ).html ( totalAlarmCount + i18nMessage.msg_count );

                    $ ( '.grph_list li' ).each ( function ( index )
                    {
                        if ( index > 0 )
                        {
                            $ ( 'span:eq(1)', this ).text ( 0 );
                            $ ( 'span:eq(2)', this ).text ( 0 + '%' );
                        }
                    } );

                    $ ( '.grph_list li' ).each (
                            function ( index )
                            {
                                if ( index > 0 )
                                {
                                    var liId = this.id;
                                    for ( var i = 0; i < json.data.length; i++ )
                                    {
                                        var jsonValue = json.data[i];
                                        if ( liId == jsonValue.alarmGradCd )
                                        {
                                            $ ( 'span:eq(1)', this ).text (
                                                    homUtil.addNumberComma ( parseInt ( jsonValue.alarmCount, 10 ) ) );
                                            $ ( 'span:eq(2)', this ).text ( jsonValue.alarmRate + '%' );
                                        }
                                    }
                                }
                            } );

                    $.each ( _.sortBy ( json.data, 'alarmGradCd' ).reverse (), function ()
                    {
                        var jsonData = {};
                        jsonData.name = _.values ( _.pick ( gradeMap, this.alarmGradCd ) );
                        jsonData.y = parseInt ( this.alarmRate, 10 );
                        jsonData.color = _.values ( _.pick ( colorMap, this.alarmGradCd ) )[0];
                        data.push ( jsonData );
                    } );

                    // 차트 데이터 설정
                    chart5.series[0].setData ( data );
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

// 파라미터별 알람 발생 건/비율 차트 목록 조회
function getParameterOfAlarmRateAndCountChartList ()
{
    $
            .ajax ( {
                url : contextPath + '/hom/analysis/alarm/selectParameterOfAlarmRateAndCountChartList.ajax',
                type : 'POST',
                dataType : 'json',
                data : $ ( "form" ).serialize (),
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        if ( !_.isEmpty ( json.data ) )
                        {
                            var data = [], totalAlarmCount = homUtil.addNumberComma ( parseInt (
                                    json.data[0].totalAlarmCount, 10 ) );

                            $.each ( json.data, function ()
                            {
                                var jsonData = {};
                                jsonData.name = (lang === locale.korea || lang === locale.korean) ? this.tagKorNm
                                        : this.tagEngNm;
                                jsonData.y = parseInt ( this.alarmRate, 10 );
                                data.push ( jsonData );
                            } );

                            var gradeName = $ ( '#alarmGradCd option:selected' ).text ();

                            $ ( '#gradeTitle' ).html (
                                    '<i class="icon_blt03"></i>' + gradeName + ' ' + i18nMessage.msg_alarm );
                            $ ( '#gradeCount' ).html ( totalAlarmCount + i18nMessage.msg_count );

                            var sortedData = _.sortBy ( data, 'y' ).reverse ();
                            sortedData[0].sliced = true;
                            sortedData[0].selected = true;

                            // 차트 데이터 설정
                            chart6.series[0].setData ( data );
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

// COD 알람 통계 차트 목록 조회
function getCodAlarmStatisticsChartList ()
{
    $ ( '#toDate' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );

    $.ajax ( {
        url : contextPath + '/hom/analysis/alarm/selectCodAlarmStatisticsChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var len = chart7.series.length;
                for ( var i = len - 1; i > -1; i-- )
                {
                    chart7.series[i].remove ();
                }

                if ( !_.isEmpty ( chart7.options.series ) )
                {
                    chart7.options.series = [];
                }

                if ( !_.isEmpty ( json.data ) )
                {
                    $.each ( json.data, function ()
                    {
                        var jsonData = {}, data = [ this.january, this.febuary, this.march, this.april, this.may,
                                this.june, this.july, this.august, this.september, this.october, this.november,
                                this.december ];

                        jsonData.type = 'line';
                        jsonData.yAxis = 0;
                        jsonData.name = this.years;
                        jsonData.data = data;

                        chart7.addSeries ( jsonData );
                        chart7.options.series.push ( jsonData );
                    } );
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
            if ( xhr.status === staticVariable.statusUnapproved )
            {
                location.href = contextPath + '/login.do?session=true';
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
    } );
}

// 알람 통계 템플릿
function getContentTemplate ( alarmGrpCd )
{
    var alarmAnalsContentTpl;

    if ( alarmGrpCd == 'all' )
    {
        // 전체
        alarmAnalsContentTpl = getTemplate ( contextPath + '/template/anals/alarmAnals/alarmAnalsAll.html' );
    } else if ( alarmGrpCd == 'group' )
    {
        // 시스템 & 설비
        alarmAnalsContentTpl = getTemplate ( contextPath + '/template/anals/alarmAnals/alarmAnalsGroup.html' );
    } else
    {
        // COD
        alarmAnalsContentTpl = getTemplate ( contextPath + '/template/anals/alarmAnals/alarmAnalsCod.html' );
    }

    if ( alarmAnalsContentTpl !== null )
    {
        $ ( '#contents' ).empty ();

        var contentTemplate = _.template ( alarmAnalsContentTpl );
        var contentHtml = contentTemplate ( getTemplateObject () );

        $ ( '#contents' ).html ( contentHtml );
    }
}

// 템플릿 전달 객체 생성
function getTemplateObject ()
{
    var templateObject = {}, dateType = $ ( '#dateType' ).val ();

    // 공통코드
    var cmmnCdListMap = (function ()
    {
        var jsonData = null;
        $.ajax ( {
            url : contextPath + '/hom/analysis/alarm/selectAlarmStatisticsCdList.ajax',
            type : 'POST',
            dataType : 'json',
            async : false,
            data : $ ( "form" ).serialize (),
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    jsonData = json.data;
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
        return jsonData;
    }) ();

    templateObject.cmmnCdDateTypeList = cmmnCdListMap.cmmnCdDateTypeList;
    templateObject.cmmnCdAlarmGrpList = cmmnCdListMap.cmmnCdAlarmGrpList;
    templateObject.cmmnCdEqmtGrpList = cmmnCdListMap.cmmnCdEqmtGrpList;
    templateObject.cmmnCdAlarmGradeList = cmmnCdListMap.cmmnCdAlarmGradeList;

    templateObject.fromDate = $ ( '#fromDate' ).val ();
    templateObject.toDate = homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD );

    templateObject.isKorean = isKorean;

    return templateObject;
}

// 검색 기본 설정
function searchBasic ()
{
    var alarmGrpCd = $ ( '#alarmGrpCd' ).val (), retrieveType = $ ( 'input[name=retrieveType]:checked' ).val ();

    if ( alarmGrpCd == "" && retrieveType == "period" )
    {
        initAllContent ();
    } else if ( alarmGrpCd != "" && retrieveType == "period" )
    {
        initGroupContent ();
    } else
    {
        initCODContent ();
    }
}

// 알람 통계 조회
function searchAlarmStatisticsByClick ()
{
    $ ( '#btnSubmit' ).off ( 'click', searchBasic ).on ( 'click', searchBasic );
}

// 알람 통계 조회
function searchAlarmStatisticsByChange ()
{
    $ ( '#alarmGrpCd' ).off ( 'change', searchBasic ).on ( 'change', searchBasic );
}

// 조회 기준별 화면
function changePageByRetrieveType ()
{
    $ ( 'input[name=retrieveType]' ).change ( function ()
    {
        if ( this.value === "period" )
        {
            // 기간 조회
            location.href = contextPath + '/hom/analysis/alarm/list.do?pageType=period';
        } else
        {
            // COD 기준 조회
            location.href = contextPath + '/hom/analysis/alarm/list.do?pageType=cod';
        }
    } );
}

// 각 조회별 화면 뷰
function showPageByRetrieveType ()
{
    var retrieveType = $ ( '#pageType' ).val ();
    $ ( 'input:radio[name=retrieveType]:input[value=' + retrieveType + ']' ).attr ( "checked", true );
    customizeForm ();
    if ( retrieveType === "period" )
    {
        // date settings
        setdatetimepicker ();

        // 기간 조회
        initAllContent ();
    } else
    {
        // COD 기준 조회
        initCODContent ();
    }
}

// jqgrid reload
function reloadGridList ( gridListId )
{
    var $gridBox = $ ( '#gbox_' + gridListId ), gridTo = {
        gridList1 : '.grid_tit:first',
        gridList2 : '.grid_tit:last',
        gridList3 : '.gcont_lft',
        gridList4 : '.graph_wrap10',
        gridList5 : '.grid_tbl_wrap'
    };

    if ( $gridBox.length > 0 )
    {
        $gridBox.remove ();

        if ( gridListId === 'gridList1' || gridListId === 'gridList2' )
        {
            $ ( '<table/>' ).attr ( 'id', gridListId ).insertAfter ( gridTo[gridListId] );
        } else if ( gridListId === 'gridList3' || gridListId === 'gridList4' || gridListId === 'gridList5' )
        {
            $ ( '<table/>' ).attr ( 'id', gridListId ).appendTo ( gridTo[gridListId] );
        }
    }
}

// 알람 통계 그리드 목록 조회
function getAlarmStatisticsGridList ()
{
    var tpl = getTemplate ( templates.noData );

    reloadGridList ( 'gridList1' );

    grid1Data.postData = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#fromDate' ).val (),
        toDate : $ ( '#toDate' ).val ()
    };

    $ ( '#gridList1' ).jqGrid ( grid1Data );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList1' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 알람 그룹별 비율/건수 그리드 목록 조회
function getGroupOfAlarmRateAndCountGridList ()
{
    var tpl = getTemplate ( templates.noData );

    reloadGridList ( 'gridList2' );

    grid2Data.postData = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#fromDate' ).val (),
        toDate : $ ( '#toDate' ).val ()
    };

    $ ( '#gridList2' ).jqGrid ( grid2Data );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList2' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 알람 설비/시스템별 비율/건수 그리드 목록 조회
function getEachGroupOfAlarmRateAndCountGridList ()
{
    var tpl = getTemplate ( templates.noData );

    reloadGridList ( 'gridList3' );

    grid3Data.postData = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#fromDate' ).val (),
        toDate : $ ( '#toDate' ).val (),
        alarmGrpCd : $ ( '#alarmGrpCd' ).val ()
    };

    $ ( '#gridList3' ).jqGrid ( grid3Data );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList3' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 파라미터별 알람 발생 비율/건수 그리드 목록 조회
function getParameterOfAlarmRateAndCountGridList ()
{
    var tpl = getTemplate ( templates.noData );

    reloadGridList ( 'gridList4' );

    grid4Data.postData = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#fromDate' ).val (),
        toDate : $ ( '#toDate' ).val (),
        alarmGrpCd : $ ( '#alarmGrpCd' ).val (),
        alarmGradCd : $ ( '#alarmGradCd' ).val ()
    };

    $ ( '#gridList4' ).jqGrid ( grid4Data );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList4' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// COD 알람 통계 그리드 목록 조회
function getCodAlarmStatisticsGridList ()
{
    var tpl = getTemplate ( templates.noData );

    reloadGridList ( 'gridList5' );

    grid5Data.postData = {
        fromDate : $ ( '#fromDate' ).val (),
        toDate : $ ( '#toDate' ).val (),
        alarmGrpCd : $ ( '#alarmGrpCd' ).val (),
        alarmSubGrpCd : $ ( '#alarmSubGrpCd' ).val ()
    };

    $ ( '#gridList5' ).jqGrid ( grid5Data );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList5' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 차트 UI 초기화
function initAllChartUI ()
{
    chart1 = new Highcharts.Chart ( graph1Data );
    chart2 = new Highcharts.Chart ( graph2Data );
    chart3 = new Highcharts.Chart ( graph3Data );
}

// 차트 UI 초기화
function initGroupChartUI ()
{
    chart4 = new Highcharts.Chart ( graph4Data );
    chart5 = new Highcharts.Chart ( graph5Data );
    chart6 = new Highcharts.Chart ( graph6Data );
}

// 차트 UI 초기화
function initCodChartUI ()
{
    chart7 = new Highcharts.Chart ( graph7Data );
}

// Group 화면 동적 이벤트
function initSelectBoxEvent ()
{
    // 알람 그룹 하위 그룹
    $ ( '#alarmSubGrpCd' ).change ( function ()
    {
        getGradeOfAlarmRateAndCountChartList ();
    } );

    // 알람 등급
    $ ( '#alarmGradCd' ).change ( function ()
    {
        getParameterOfAlarmRateAndCountChartList ();
        getParameterOfAlarmRateAndCountGridList ();
    } );
}

// 엑셀 다운로드 객체
var excelObj = {
    type : 'image/png',
    async : true,
    exportUrl : 'http://export.highcharts.com/'
};

// 엑셀 다운로드 base
function downloadExcelBasic ( obj )
{
    var exportUrl = obj.exportUrl;
    obj = _.omit ( obj, 'exportUrl' );
    return $.ajax ( {
        type : 'POST',
        data : obj,
        url : exportUrl,
        success : function ( data )
        {
            return exportUrl + data;
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

// 알람 통계 엑셀다운로드(전체)
function downloadExcelAll ()
{
    $ ( '#btnExcel1' ).click (
            function ()
            {
                var obj1, obj2, obj3;

                obj1 = $.extend ( {
                    options : JSON.stringify ( chart1.options )
                }, excelObj );

                obj2 = $.extend ( {
                    options : JSON.stringify ( chart2.options )
                }, excelObj );

                obj3 = $.extend ( {
                    options : JSON.stringify ( chart3.options )
                }, excelObj );

                $.when ( downloadExcelBasic ( obj1 ), downloadExcelBasic ( obj2 ), downloadExcelBasic ( obj3 ) ).done (
                        function ( down1, down2, down3 )
                        {
                            var downArr = [ down1[0], down2[0], down3[0] ];

                            for ( var i = 0; i < downArr.length; i++ )
                            {
                                $ ( '<input />' ).attr ( 'type', 'hidden' ).attr ( 'name', 'url' ).attr ( 'value',
                                        excelObj.exportUrl + downArr[i] ).appendTo ( 'form' );
                            }

                            $ ( 'form' ).prop ( 'action', contextPath + '/hom/excel/analysis/alarmAll/download.do' );
                            $ ( 'form' ).submit ();
                            $ ( 'input[name=url]' ).remove ();
                        } );
            } );
}

// 알람 통계 엑셀다운로드(그룹)
function downloadExcelGroup ()
{
    $ ( '#btnExcel2' ).click (
            function ()
            {
                var obj4, obj5, obj6;

                obj4 = $.extend ( {
                    options : JSON.stringify ( chart4.options )
                }, excelObj );

                obj5 = $.extend ( {
                    options : JSON.stringify ( chart5.options )
                }, excelObj );

                obj6 = $.extend ( {
                    options : JSON.stringify ( chart6.options )
                }, excelObj );

                $.when ( downloadExcelBasic ( obj4 ), downloadExcelBasic ( obj5 ), downloadExcelBasic ( obj6 ) ).done (
                        function ( down4, down5, down6 )
                        {
                            var downArr = [ down4[0], down5[0], down6[0] ];

                            for ( var i = 0; i < downArr.length; i++ )
                            {
                                $ ( '<input />' ).attr ( 'type', 'hidden' ).attr ( 'name', 'url' ).attr ( 'value',
                                        excelObj.exportUrl + downArr[i] ).appendTo ( 'form' );
                            }

                            $ ( 'form' ).prop ( 'action', contextPath + '/hom/excel/analysis/alarmGroup/download.do' );
                            $ ( 'form' ).submit ();
                            $ ( 'input[name=url]' ).remove ();
                        } );
            } );
}

// 알람 통계 엑셀다운로드(COD)
function downloadExcelCod ()
{
    $ ( '#btnExcel3' ).click (
            function ()
            {
                var obj7;

                obj7 = $.extend ( {
                    options : JSON.stringify ( chart7.options )
                }, excelObj );

                $.when ( downloadExcelBasic ( obj7 ) ).done (
                        function ( down7 )
                        {
                            $ ( '<input />' ).attr ( 'type', 'hidden' ).attr ( 'name', 'url' ).attr ( 'value',
                                    excelObj.exportUrl + down7 ).appendTo ( 'form' );

                            $ ( 'form' ).prop ( 'action', contextPath + '/hom/excel/analysis/alarmCod/download.do' );
                            $ ( 'form' ).submit ();
                            $ ( 'input[name=url]' ).remove ();
                        } );
            } );
}

function initCommonContent ()
{
    // 검색
    searchAlarmStatisticsByClick ();
    searchAlarmStatisticsByChange ();

    // 팝업
    showPopup ();

    // 커스텀 DOM
    customizeForm ();
}

function initAllContent ()
{
    // 컨텐츠 템플릿
    $.when ( getContentTemplate ( 'all' ) ).done ( function ()
    {
        if ( $ ( '#period' ).is ( ':empty' ) )
        {
            setPeriodTitle ( $ ( '#fromDate' ).val (), $ ( '#toDate' ).val () );
        }

        // 공통
        initCommonContent ();

        // 차트 UI
        initAllChartUI ();

        // 차트
        getAlarmStatisticsChartList ();
        getTypeOfAlarmRateAndCountChartList ();
        getGroupOfAlarmRateAndCountChartList ();

        // 그리드
        getAlarmStatisticsGridList ();
        getGroupOfAlarmRateAndCountGridList ();

        // 엑셀
        downloadExcelAll ();
    } );
}

function initGroupContent ()
{
    // 컨텐츠 템플릿
    $.when ( getContentTemplate ( 'group' ) ).done ( function ()
    {
        if ( $ ( '#period' ).is ( ':empty' ) )
        {
            setPeriodTitle ( $ ( '#fromDate' ).val (), $ ( '#toDate' ).val () );
        }

        // 공통
        initCommonContent ();

        // 차트 UI
        initGroupChartUI ();

        // 차트
        getGroupOfAlarmRateAndCountChartList ();
        getGradeOfAlarmRateAndCountChartList ();
        getParameterOfAlarmRateAndCountChartList ();

        // 그리드
        getEachGroupOfAlarmRateAndCountGridList ();
        getParameterOfAlarmRateAndCountGridList ();

        // selectbox event
        initSelectBoxEvent ();

        // 엑셀
        downloadExcelGroup ();
    } );
}

function initCODContent ()
{
    // 컨텐츠 템플릿
    $.when ( getContentTemplate () ).done ( function ()
    {
        // 공통
        initCommonContent ();

        // 차트 UI
        initCodChartUI ();

        // 차트
        getCodAlarmStatisticsChartList ();

        // 그리드
        getCodAlarmStatisticsGridList ();

        // 엑셀
        downloadExcelCod ();
    } );
}

$ ( function ()
{
    changePageByRetrieveType ();
    showPageByRetrieveType ();
} );