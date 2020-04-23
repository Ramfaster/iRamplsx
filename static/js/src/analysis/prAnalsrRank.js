// 기간 내 설비별 성능비 rank
function customizeRankJqGrid ()
{
    var noDataId = 'equip_rank_jqgrid_nodata';

    rankJqGridBasic ( noDataId );
    var $analsrRankGridList = $ ( '#analsr_rank_grid_list' );
    if ( prAnalsr.templates.noData !== null )
    {
        var template = _.template ( prAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $analsrRankGridList.parent ().append ( html );
    }

    mergeJqgridPrHeader ( $analsrRankGridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function rankJqGridBasic ( noDataId )
{
    var $analsrRankGridList = $ ( '#analsr_rank_grid_list' );
    $analsrRankGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/pr/prRankList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            dateType : $ ( '#dateType' ).val (),
            fromDate : $ ( '#fromDate' ).val (),
            toDate : $ ( '#toDate' ).val (),
            eqmtGrpCd : $ ( '#eqmtGrpCd' ).val (),
            eqmtId : $ ( '#junEqmtId' ).val ()
        },
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        colNames : [ i18nMessage.msg_increaseDecreaseRanking, i18nMessage.msg_division, i18nMessage.msg_goal,
                i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt, i18nMessage.msg_gap, 'prUnitNm' ],
        colModel : [
                {
                    name : 'rank',
                    align : 'center',
                    width : '74',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'eqmtNm',
                    align : 'left',
                    width : '236',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalPr',
                    align : 'right',
                    width : '236',
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
                    width : '236',
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
                    width : '236',
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
                    width : '236',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, prAnalsr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'prUnitNm',
                    hidden : true
                } ],
        sortname : 'rank',
        sortorder : 'asc',
        rownumbers : false,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        async : false,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#analsr_rank_count' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridList = $ ( '#analsr_rank_grid_list' );
                var ids = $gridList.jqGrid ( 'getDataIDs' );
                var rowData = $gridList.getRowData ( ids[0] );

                // 헤더 갱신
                $ ( '#analsr_rank_grid_list_eqmtNm' ).next ( 'th' ).html (
                        i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( rowData.prUnitNm, '(', ')' ) );
                $ ( '#analsr_rank_grid_list_goalGap' ).html (
                        i18nMessage.msg_gap + homUtil.wrapWord ( rowData.prUnitNm, '(', ')' ) );
            }
        }
    } );
}

// 헤더 병합
function mergeJqgridPrHeader ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalPr',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_prfomncRatio
        } ]
    } );
}

// rank jqgrid 리로드
function reloadRankJqGrid ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var eqmtId = $ ( '#junEqmtId' ).val ();
    $ ( '#analsr_rank_grid_list' ).setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            eqmtId : eqmtId
        }
    } ).trigger ( 'reloadGrid' );
}

// 순시 성능비 chart 조회
function anlsrRankPRChart ()
{
    var $analsrRankGraph = $ ( '#analsr_rank_graph' );
    var $analsrRankAll = $ ( '#analsr_rank_all' );
    var $analsrRankExcelBtn = $ ( '#analsr_rank_excel_btn' );

    var $dateType = $ ( '#dateType' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );
    var $eqmtGrpCd = $ ( '#eqmtGrpCd' );
    var $eqmtId = $ ( '#junEqmtId' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/pr/selectRankPrChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            dateType : $dateType.val (),
            fromDate : $fromDate.val (),
            toDate : $toDate.val (),
            eqmtGrpCd : $eqmtGrpCd.val (),
            eqmtId : $eqmtId.val ()
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#analsr_rank_graph' ).highcharts () ] );

                if ( json.data !== null && json.data.length > 0 )
                {
                    $analsrRankAll.show ();
                    $analsrRankExcelBtn.show ();
                    // 성능비 단위
                    var prUnitNm = json.data[0].prUnitNm;
                    var items = new Object ();
                    var standardArray = [];
                    var count = 0;
                    $.each ( json.data, function ( index, item )
                    {
                        var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                        if ( item.prfomncRatioMntrList !== null && item.prfomncRatioMntrList.length > 0 )
                        {
                            count++;
                            $.each ( item.prfomncRatioMntrList, function ( j, detlItem )
                            {
                                if ( typeof items[detlItem.eqmtNm] === 'undefined' )
                                {
                                    items[detlItem.eqmtNm] = [];
                                }

                                items[detlItem.eqmtNm].push ( [ targetDate,
                                        homUtil.mathFloor ( detlItem.acmsltPr, staticVariable.decimalPoint ) ] );
                            } );
                        }
                        standardArray.push ( [ targetDate, null ] );
                    } );

                    if ( count > 0 )
                    {
                        var keys = new Array ();
                        for ( var prop in items )
                        {
                            keys.push ( prop );
                        }

                        var prMinArray = [];
                        var series = [];
                        // 최소값 판단을 통해 min 값 세팅 및 series 셋팅
                        _.each ( keys, function ( key )
                        {
                            series.push ( {
                                type : 'line',
                                yAxis : 0,
                                name : key,
                                data : items[key]
                            } );
                        } );
                        series.push ( {
                            data : standardArray,
                            showInLegend : false
                        } );

                        var yAxisArray = [];
                        var prYaxis = {
                            title : {
                                text : i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( prUnitNm, '(', ')' )
                            }
                        };

                        yAxisArray.push ( prYaxis );

                        renderRankHighcharts ( $analsrRankGraph, series, yAxisArray );
                    } else
                    {
                        setPrRankNoData ( $analsrRankAll, $analsrRankExcelBtn, $analsrRankGraph );
                    }
                } else
                {
                    setPrRankNoData ( $analsrRankAll, $analsrRankExcelBtn, $analsrRankGraph );
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

function setPrRankNoData ( $analsrRankAll, $analsrRankExcelBtn, $analsrRankGraph )
{
    $analsrRankAll.hide ();
    $analsrRankExcelBtn.hide ();

    $analsrRankGraph.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData
            + '</div>' );
}

// 하이차트 렌더링
function renderRankHighcharts ( $analsrRankGraph, series, yAxisArray )
{
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

    $analsrRankGraph.highcharts ( {
        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
        chart : {
            marginTop : 50,
            zoomType : 'x',
            panning : true,
            panKey : 'shift'
        },
        legend : {
            align : 'right',
            verticalAlign : 'top',
            layout : 'vertical',
            x : 0,
            y : 15
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
            line : {
                pointPadding : 0,
                borderWidth : 0,
                lineWidth : 1,
                marker : {
                    enabled : false
                }
            }
        },
        series : series
    } );
}

$ ( function ()
{

} );