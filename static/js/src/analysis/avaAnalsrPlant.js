// init highcharts
function initPlantHighcharts ()
{
    var $graph1 = $ ( '#avaAnlsr_plant_graph' );
    var $btnExcel = $ ( '#btn_excel_avaAnlsr_plant' );
    var $btnAllJqgrid = $ ( '#btn_all_avaAnlsr_plant' );

    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    $.ajax ( {
        url : contextPath + '/hom/analysis/ava/selectAvatyChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $graph1.highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid.show ();

                    avaAnalsr.count.plant++;

                    var dateType = $ ( '#dateType' ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;

                    if ( dateType === homConstants.dateTypeYYYYMMDD )
                    {
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === homConstants.dateTypeYYYYMM )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === homConstants.dateTypeYYYY )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    // 목표 가동률, 전년 가동률, 실적 가동률, 계통 가동률, 일사량, 온도
                    var goalAvatyArray = [];
                    var beforeYearAvatyArray = [];
                    var acmsltAvatyArray = [];
                    var systemAvatyArray = [];
                    var rdtnArray = [];
                    var temprtArray = [];

                    // 가동률, 일사량, 온도 단위
                    var avaUnitNm = json.data[0].avaUnitNm;
                    var rdtnUnitNm = json.data[0].rdtnUnitNm;
                    var atmpsUnitNm = json.data[0].atmpsUnitNm;

                    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
                    {
                        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
                    }

                    $.each ( json.data,
                            function ( index, item )
                            {
                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                goalAvatyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.goalAvaty, staticVariable.decimalPoint ) ] );
                                beforeYearAvatyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.beforeYearAvaty, staticVariable.decimalPoint ) ] );
                                acmsltAvatyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.acmsltAvaty, staticVariable.decimalPoint ) ] );
                                systemAvatyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.systemAvaty, staticVariable.decimalPoint ) ] );
                                rdtnArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.rdtn, staticVariable.decimalPoint ) ] );
                                temprtArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.temprt, staticVariable.decimalPoint ) ] );
                            } );

                    // 최소값 판단을 통해 min 값 세팅
                    var avaMinArray = [];
                    avaMinArray.push ( _.min ( _.pluck ( goalAvatyArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( beforeYearAvatyArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( acmsltAvatyArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( systemAvatyArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var avaYaxis = {
                        max : 200,
                        title : {
                            text : i18nMessage.msg_avaty + homUtil.wrapWord ( avaUnitNm, '(', ')' )
                        }
                    };
                    var rdtnYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' )
                        }
                    };
                    var atmpsYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( avaMinArray ) > 0 )
                    {
                        avaYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( rdtnArray, [ 1 ] ) ) > 0 )
                    {
                        rdtnYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( temprtArray, [ 1 ] ) ) > 0 )
                    {
                        atmpsYaxis.min = 0;
                    }

                    yAxisArray.push ( avaYaxis );
                    yAxisArray.push ( rdtnYaxis );
                    yAxisArray.push ( atmpsYaxis );

                    $graph1.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type4 ),
                        chart : {
                            marginTop : 50,
                            zoomType : 'x',
                            panning : true,
                            panKey : 'shift'
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
                                    color : '#3c3c3c'
                                },
                                formatter : function ()
                                {
                                    var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                                    return dateXAxis;
                                }
                            }
                        },
                        yAxis : yAxisArray,
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
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
                            name : i18nMessage.msg_goal + ' ' + i18nMessage.msg_avaty,
                            data : goalAvatyArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_beforeYear + ' ' + i18nMessage.msg_avaty,
                            data : beforeYearAvatyArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_acmslt + ' ' + i18nMessage.msg_avaty,
                            data : acmsltAvatyArray
                        }, {
                            type : 'line',
                            yAxis : 0,
                            name : i18nMessage.msg_systemAvaty,
                            data : systemAvatyArray
                        }, {
                            type : 'line',
                            yAxis : 1,
                            name : i18nMessage.msg_rdtn,
                            data : rdtnArray
                        }, {
                            type : 'line',
                            dashStyle : 'shortdot',
                            yAxis : 2,
                            name : i18nMessage.msg_temperature,
                            data : temprtArray
                        } ]
                    } );
                } else
                {
                    $btnExcel.hide ();
                    $btnAllJqgrid.hide ();

                    $graph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>' );
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

function plantJqGrid ()
{
    var $gridList = $ ( '#avaAnlsr_plant_gridList' );
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    var noDataId = 'avaAnlsr_plant_grid_nodata';

    var $selectedDateType = $ ( '#date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/analysis/ava/selectAvatyGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 175,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate
        },
        colNames : [ dateTypeText, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt,
                i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_systemAvaty, i18nMessage.msg_rdtn,
                i18nMessage.msg_temperature, 'avaUnitNm', 'rdtnUnitNm', 'atmpsUnitNm' ],
        colModel : [
                {
                    name : 'stdrDate',
                    align : 'center',
                    width : '110',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalAvaty',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearAvaty',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltAvaty',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'goalGap',
                    align : 'right',
                    width : '107',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, avaAnalsr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearGap',
                    align : 'right',
                    width : '107',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, avaAnalsr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'systemAvaty',
                    align : 'right',
                    width : '140',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtn',
                    align : 'right',
                    width : '140',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'temprt',
                    align : 'right',
                    width : '140',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'avaUnitNm',
                    hidden : true
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                }, {
                    name : 'atmpsUnitNm',
                    hidden : true
                } ],
        sortname : 'stdrDate',
        sortorder : 'asc',
        rownumbers : true,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#avaAnlsr_plant_gridList_RowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridAvatyHeader ( $gridList );
            }
        }
    } );

    if ( avaAnalsr.templates.noData !== null )
    {
        var template = _.template ( avaAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    mergeJqgridAvatyHeader ( $gridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 가동률 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadPlantJqgrid ()
{
    var $gridList = $ ( '#avaAnlsr_plant_gridList' );

    var $gridList = $ ( '#avaAnlsr_plant_gridList' );
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
        }
    } ).trigger ( 'reloadGrid' );
}

// 헤더 병합
function mergeJqgridAvatyHeader ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalAvaty',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_avaty
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_gap + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

// 헤더명 변경
function updateJqgridAvatyHeader ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );

    var avaUnitNm = rowData.avaUnitNm;
    var rdtnUnitNm = rowData.rdtnUnitNm;
    var atmpsUnitNm = rowData.atmpsUnitNm;

    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
    {
        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
    }

    rdtnUnitNm = homUtil.wrapWord ( rdtnUnitNm, '(', ')' );
    if ( rdtnUnitNm !== '' )
    {
        rdtnUnitNm = '<br />' + rdtnUnitNm;
    }

    var $selectedDateType = $ ( '#date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더 명 변경
    $gridList.jqGrid ( 'setLabel', 'stdrDate', dateTypeText );
    $ ( '#avaAnlsr_plant_gridList_stdrDate' ).next ( 'th' ).html (
            i18nMessage.msg_avaty + homUtil.wrapWord ( avaUnitNm, '(', ')' ) );
    $ ( '#jqgh_avaAnlsr_plant_gridList_systemAvaty' ).html (
            i18nMessage.msg_systemAvaty + homUtil.wrapWord ( avaUnitNm, '(', ')' ) );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_avaAnlsr_plant_gridList_rdtn' ), i18nMessage.msg_rdtn + rdtnUnitNm );
    $ ( '#jqgh_avaAnlsr_plant_gridList_temprt' ).html (
            i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' ) );
}
