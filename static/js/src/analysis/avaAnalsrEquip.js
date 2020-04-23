// jqgird customize
function customizeEquipJqGrid ()
{
    var noDataId = 'avaAnlsr_equip_grid_nodata';

    equipJqGrid ( noDataId );

    var $avaAnlsrEquipGridList = $ ( '#avaAnlsr_equip_gridList' );

    if ( avaAnalsr.templates.noData !== null )
    {
        var template = _.template ( avaAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $avaAnlsrEquipGridList.parent ().append ( html );
    }

    addEquipAvaGroupHeader ( $avaAnlsrEquipGridList );
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// ava jqgrid 헤더 병합
function addEquipAvaGroupHeader ( $avaAnlsrEquipGridList )
{
    $avaAnlsrEquipGridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalAvaty',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_avaty + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

function equipJqGrid ( noDataId )
{
    var $avaAnlsrEquipGridList = $ ( '#avaAnlsr_equip_gridList' );

    $avaAnlsrEquipGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/ava/selectAvatyEquipGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            dateType : $ ( '#dateType' ).val (),
            fromDate : $ ( '#fromDate' ).val (),
            toDate : $ ( '#toDate' ).val (),
            eqmtGrpCd : $ ( '#eqmtGrpCd' ).val ()
        },
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        colNames : [ i18nMessage.msg_increaseDecreaseRanking, i18nMessage.msg_division, i18nMessage.msg_goal,
                i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt, i18nMessage.msg_gap, 'avaUnitNm' ],
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
                    name : 'goalAvaty',
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
                    name : 'beforeYearAvaty',
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
                    name : 'acmsltAvaty',
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
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, avaAnalsr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'avaUnitNm',
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
            $ ( '#avaAnlsr_equip_gridList_RowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridList = $ ( '#avaAnlsr_equip_gridList' );

                var ids = $gridList.jqGrid ( 'getDataIDs' );

                var rowData = $gridList.getRowData ( ids[0] );

                $ ( '#avaAnlsr_equip_gridList_goalGap' ).html (
                        i18nMessage.msg_gap + homUtil.wrapWord ( rowData.avaUnitNm, '(', ')' ) );
            }
        }
    } );
}

// rank jqgrid 리로드
function reloadEquipJqGrid ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();

    $ ( '#avaAnlsr_equip_gridList' ).setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd
        }
    } ).trigger ( 'reloadGrid' );
}

// init highcharts
function initEquipHighcharts ()
{
    var $avaAnslrEquipGraph = $ ( '#avaAnlsr_equip_graph' );
    var $btnAllAvaAnlsrEquip = $ ( '#btn_all_avaAnlsr_equip' );
    var $btnExcelAvaAnlsrEquip = $ ( '#btn_excel_avaAnlsr_equip' );

    var $dateType = $ ( '#dateType' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );
    var $eqmtGrpCd = $ ( '#eqmtGrpCd' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/ava/selectAvatyEquipChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            dateType : $dateType.val (),
            fromDate : $fromDate.val (),
            toDate : $toDate.val (),
            eqmtGrpCd : $eqmtGrpCd.val ()
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#avaAnlsr_equip_graph' ).highcharts () ] );

                if ( json.data !== null && json.data.length > 0 )
                {
                    $btnAllAvaAnlsrEquip.show ();
                    $btnExcelAvaAnlsrEquip.show ();

                    // 가동률 단위
                    var avaUnitNm = json.data[0].avaUnitNm;
                    var items = new Object ();
                    var standardArray = [];
                    var count = 0;
                    $.each ( json.data, function ( index, item )
                    {
                        var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                        if ( item.avatyMntrList !== null && item.avatyMntrList.length > 0 )
                        {
                            count++;
                            $.each ( item.avatyMntrList, function ( j, detlItem )
                            {
                                if ( typeof items[detlItem.eqmtNm] === 'undefined' )
                                {
                                    items[detlItem.eqmtNm] = [];
                                }

                                items[detlItem.eqmtNm].push ( [ targetDate,
                                        homUtil.mathFloor ( detlItem.acmsltAvaty, staticVariable.decimalPoint ) ] );
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

                        var avaMinArray = [];
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
                        var avaYaxis = {
                            title : {
                                text : i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( avaUnitNm, '(', ')' )
                            }
                        };

                        yAxisArray.push ( avaYaxis );

                        renderEquipHighcharts ( $avaAnslrEquipGraph, series, yAxisArray );
                    } else
                    {
                        setAvatyEquipNoData ( $btnAllAvaAnlsrEquip, $btnExcelAvaAnlsrEquip, $avaAnslrEquipGraph );
                    }
                } else
                {
                    setAvatyEquipNoData ( $btnAllAvaAnlsrEquip, $btnExcelAvaAnlsrEquip, $avaAnslrEquipGraph );
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

function setAvatyEquipNoData ( $btnAllAvaAnlsrEquip, $btnExcelAvaAnlsrEquip, $avaAnslrEquipGraph )
{
    $btnAllAvaAnlsrEquip.hide ();
    $btnExcelAvaAnlsrEquip.hide ();

    $avaAnslrEquipGraph.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
            + i18nMessage.msg_sentenceGridNoData + '</div>' );
}

// 하이차트 렌더링
function renderEquipHighcharts ( $avaAnslrEquipGraph, series, yAxisArray )
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

    $avaAnslrEquipGraph.highcharts ( {
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
