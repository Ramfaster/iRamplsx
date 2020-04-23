// 성능비 chart 조회
function analsrEquipPrChart ()
{
    var $analsrEquipGraph = $ ( '#analsr_equip_graph' );
    var $analsrEquipAll = $ ( '#analsr_equip_all' );

    var $dateType = $ ( '#dateType' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/pr/selectPrChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            dateType : $dateType.val (),
            fromDate : $fromDate.val (),
            toDate : $toDate.val ()
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#analsr_equip_graph' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $analsrEquipAll.show ();
                    prAnalsr.count.equip++;

                    var dateType = $dateType.val ();
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

                    // 목표 성능비, 전년 성능비, 실적 성능비
                    var goalPrArray = [];
                    var beforeYearPrArray = [];
                    var acmsltPrArray = [];

                    // 성능비 단위
                    var prUnitNm = json.data[0].prUnitNm;

                    $.each ( json.data,
                            function ( index, item )
                            {
                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                goalPrArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.goalPr, staticVariable.decimalPoint ) ] );
                                beforeYearPrArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.beforeYearPr, staticVariable.decimalPoint ) ] );
                                acmsltPrArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.acmsltPr, staticVariable.decimalPoint ) ] );
                            } );

                    // 최소값 판단을 통해 min 값 세팅
                    var prMinArray = [];
                    prMinArray.push ( _.min ( _.pluck ( goalPrArray, [ 1 ] ) ) );
                    prMinArray.push ( _.min ( _.pluck ( beforeYearPrArray, [ 1 ] ) ) );
                    prMinArray.push ( _.min ( _.pluck ( acmsltPrArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var prYaxis = {
                        max : 200,
                        title : {
                            text : i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( prUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( prMinArray ) > 0 )
                    {
                        prYaxis.min = 0;
                    }

                    yAxisArray.push ( prYaxis );

                    $analsrEquipGraph.highcharts ( {
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
                            name : i18nMessage.msg_goal + ' ' + i18nMessage.msg_prfomncRatio,
                            data : goalPrArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_beforeYear + ' ' + i18nMessage.msg_prfomncRatio,
                            data : beforeYearPrArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_acmslt + ' ' + i18nMessage.msg_prfomncRatio,
                            data : acmsltPrArray
                        } ]
                    } );
                } else
                {
                    $analsrEquipAll.hide ();

                    $analsrEquipGraph.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

// 성능비 jqGrid 조회
function customizeEquipPrJqGrid ()
{
    var noDataId = 'equip_pr_jqgrid_nodata';

    prJqGridBasic ( noDataId );
    var $analsrEquipGridList = $ ( '#analsr_equip_grid_list' );
    if ( prAnalsr.templates.noData !== null )
    {
        var template = _.template ( prAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $analsrEquipGridList.parent ().append ( html );
    }
    addEquipPrGroupHeader ( $analsrEquipGridList );
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// pr jqgrid 헤더 병함
function addEquipPrGroupHeader ( $analsrEquipGridList )
{
    var groupHeaderName = 'User';
    $analsrEquipGridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalPr',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( '%', '(', ')' )
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_gap + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

// pr jqgrid
function prJqGridBasic ( noDataId )
{
    var $analsrEquipGridList = $ ( '#analsr_equip_grid_list' );
    $analsrEquipGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/pr/prList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            dateType : $ ( '#dateType' ).val (),
            fromDate : $ ( '#fromDate' ).val (),
            toDate : $ ( '#toDate' ).val ()
        },
        height : 251,
        autowidth : true,
        shrinkToFit : false,
        colNames : [ i18nMessage.msg_date, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt,
                i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_rdtn, i18nMessage.msg_temperature,
                'prUnitNm', 'rdtnUnit', 'atmpsUnitNm' ],
        colModel : [
                {
                    name : 'stdrDate',
                    align : 'center',
                    width : '90',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalPr',
                    align : 'right',
                    width : '55',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearPr',
                    align : 'right',
                    width : '55',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltPr',
                    align : 'right',
                    width : '55',
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
                    width : '65',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, prAnalsr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearGap',
                    align : 'right',
                    width : '65',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, prAnalsr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtn',
                    align : 'right',
                    width : '100',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'temprt',
                    align : 'right',
                    width : '55',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'prUnitNm',
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
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#analsr_equip_count' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridPrHeader ( $analsrEquipGridList );
            }
        }
    } );
}

// 헤더명 변경
function updateJqgridPrHeader ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );

    var prUnitNm = rowData.prUnitNm;
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

    atmpsUnitNm = homUtil.wrapWord ( atmpsUnitNm, '(', ')' );
    if ( atmpsUnitNm !== '' )
    {
        atmpsUnitNm = '<br />' + atmpsUnitNm;
    }

    // 헤더 명 변경
    $ ( '#gridList_stdrDate' ).next ( 'th' ).html (
            i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( prUnitNm, '(', ')' ) );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_analsr_equip_grid_list_rdtn' ), i18nMessage.msg_rdtn + rdtnUnitNm );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_analsr_equip_grid_list_temprt' ), i18nMessage.msg_temperature + atmpsUnitNm );
}

// 성능비 jqgrid 리로드
function reloadEquipPrJqGrid ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    $ ( '#analsr_equip_grid_list' ).setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate
        }
    } ).trigger ( 'reloadGrid' );
}

// 순시 성능비 chart 조회
function anlsrEquipIPRChart ()
{
    var $analsrEquipGraphIpr = $ ( '#analsr_equip_graph_ipr' );

    var $dateType = $ ( '#dateType' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/pr/selectIprChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            dateType : $dateType.val (),
            fromDate : $fromDate.val (),
            toDate : $toDate.val ()
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#analsr_equip_graph_ipr' ).highcharts () ] );

                var regressionData = json.data;
                if ( regressionData !== null && regressionData.indeAndDepDataList !== null
                        && regressionData.indeAndDepDataList.length > 0 && $.isNumeric ( regressionData.gradient )
                        && $.isNumeric ( regressionData.yIntercept ) && $.isNumeric ( regressionData.rSquare )
                        && $.isNumeric ( regressionData.sumSquaresError )
                        && $.isNumeric ( regressionData.sumSquaresRegression ) )
                {
                    prAnalsr.count.equip++;

                    var powerUnitNm = regressionData.powerUnitNm;
                    var ssrsUnitNm = regressionData.ssrsUnitNm;
                    var sirsUnitNm = regressionData.sirsUnitNm;
                    var setupCpctyUnitNm = regressionData.setupCpctyUnitNm;

                    var xAxis = {
                        min : 0,
                        title : {
                            enabled : true,
                            text : i18nMessage.msg_power + homUtil.wrapWord ( powerUnitNm, '(', ')' ) + ' / '
                                    + i18nMessage.msg_capacity + homUtil.wrapWord ( setupCpctyUnitNm, '(', ')' )
                        },
                        startOnTick : true,
                        endOnTick : true,
                        showLastLabel : true
                    };

                    var yAxis = [ {
                        min : 0,
                        title : {
                            text : i18nMessage.msg_inPlaneRdth + homUtil.wrapWord ( sirsUnitNm, '(', ')' ) + ' / '
                                    + i18nMessage.msg_stdrInPlaneRdtn + homUtil.wrapWord ( sirsUnitNm, '(', ')' )
                                    + ' [1,000]'
                        }
                    } ];

                    renderIPRHighCharts ( $analsrEquipGraphIpr, regressionData, xAxis, yAxis );
                } else
                {
                    $analsrEquipGraphIpr.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

// 순시 성능비 하이차트 rendering
function renderIPRHighCharts ( $analsrEquipGraphIpr, regressionData, xAxis, yAxis )
{
    var regressionScatterData = [];
    _.each ( regressionData.indeAndDepDataList, function ( data )
    {
        regressionScatterData.push ( [ data.indepdtValue, data.depdtValue ] );
    } );

    var minInfo = _.min ( regressionScatterData, function ( regressionScatter )
    {
        return regressionScatter[0];
    } );
    var maxInfo = _.max ( regressionScatterData, function ( regressionScatter )
    {
        return regressionScatter[0];
    } );

    var min = parseFloat ( minInfo[0] );
    var max = parseFloat ( maxInfo[0] );

    // y = ax + b
    var gradient = parseFloat ( regressionData.gradient );
    var yIntercept = parseFloat ( regressionData.yIntercept );

    var regressionLineData = [];
    regressionLineData.push ( [ min, gradient * min + yIntercept ] );
    regressionLineData.push ( [ max, gradient * max + yIntercept ] );

    $analsrEquipGraphIpr.highcharts ( {
        chart : {
            type : 'scatter',
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
        xAxis : xAxis,
        yAxis : yAxis,
        legend : {
            enabled : false
        },
        plotOptions : {
            line : {
                marker : {
                    enabled : false
                }
            },
            scatter : {
                marker : {
                    radius : 4,
                    states : {
                        hover : {
                            enabled : true,
                            lineColor : 'rgb(100,100,100)'
                        }
                    }
                },
            }
        },
        series : [ {
            name : i18nMessage.msg_power,
            type : 'scatter',
            color : 'rgba(95, 124, 146, .5)',
            data : regressionScatterData
        }, {
            name : i18nMessage.msg_inPlaneRdth,
            type : 'spline',
            yAxis : 0,
            color : '#ff6702',
            marker : {
                enabled : false
            },
            data : regressionLineData
        } ]
    } );
}

// 기간 내 사고 및 Fault 내역
function customizeFaultJqGrid ()
{
    var noDataId = 'equip_fault_jqgrid_nodata';

    faultJqGridBasic ( noDataId );
    var $analsrEquipGridListFault = $ ( '#analsr_equip_grid_list_fault' );
    if ( prAnalsr.templates.noData !== null )
    {
        var template = _.template ( prAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $analsrEquipGridListFault.parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function faultJqGridBasic ( noDataId )
{
    var $analsrEquipGridListFault = $ ( '#analsr_equip_grid_list_fault' );
    var $analsrEquipAllFault = $ ( '#analsr_equip_all_fault' );
    $analsrEquipGridListFault.jqGrid ( {
        url : contextPath + '/hom/analysis/pr/faultList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            dateType : $ ( '#dateType' ).val (),
            fromDate : $ ( '#fromDate' ).val (),
            toDate : $ ( '#toDate' ).val ()
        },
        height : 251,
        autowidth : true,
        shrinkToFit : false,
        colNames : [ i18nMessage.msg_occurrenceDate, i18nMessage.msg_releaseDate, i18nMessage.msg_terminateDate,
                i18nMessage.msg_faultContents ],
        colModel : [ {
            name : 'occrrncDt',
            align : 'center',
            width : '125'
        }, {
            name : 'releaseDt',
            align : 'center',
            width : '125'
        }, {
            name : 'trmnatDt',
            align : 'center',
            width : '125'
        }, {
            name : 'defectConts',
            align : 'center',
            width : '180'
        } ],
        sortname : 'occrrncDt',
        sortorder : 'asc',
        rownumbers : true,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#analsr_equip_count_fault' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
                $analsrEquipAllFault.hide ();
            } else
            {
                $gqNodata.hide ();
                $analsrEquipAllFault.show ();
                prAnalsr.count.equip++;

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }
        }
    } );
}

// fault jqgrid 리로드
function reloadEquipFaultJqGrid ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    $ ( '#analsr_equip_grid_list_fault' ).setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate
        }
    } ).trigger ( 'reloadGrid' );
}
