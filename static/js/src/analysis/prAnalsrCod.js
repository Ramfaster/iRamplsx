// cod 성능비 jqgrid 조회
function customizeCodJqGrid ()
{
    var noDataId = 'equip_cod_jqgrid_nodata';

    codJqGridBasic ( noDataId );
    var $analsrCodGridList = $ ( '#analsr_cod_grid_list' );
    if ( prAnalsr.templates.noData !== null )
    {
        var template = _.template ( prAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $analsrCodGridList.parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function codJqGridBasic ( noDataId )
{
    var $analsrCodGridList = $ ( '#analsr_cod_grid_list' );
    $analsrCodGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/pr/prCodList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            cod : $ ( '#cod' ).val ()
        },
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        colNames : [ i18nMessage.msg_division, i18nMessage.msg_shortJanuary, i18nMessage.msg_shortFebuary,
                i18nMessage.msg_shortMarch, i18nMessage.msg_shortApril, i18nMessage.msg_shortMay,
                i18nMessage.msg_shortJune, i18nMessage.msg_shortJuly, i18nMessage.msg_shortAugust,
                i18nMessage.msg_shortSeptember, i18nMessage.msg_shortOctober, i18nMessage.msg_shortNovember,
                i18nMessage.msg_shortDecember, i18nMessage.msg_yearAverage ],
        colModel : [ {
            name : 'stdrYear',
            align : 'center',
            width : '85'
        }, {
            name : 'janData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'febData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'marData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'aprData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'mayData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'junData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'julData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'augData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'sepData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'otbData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'novData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'dcbData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'subTotal',
            align : 'right',
            width : '110',
            fixed : true,
            sortable : false
        } ],
        sortname : 'stdrYear',
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
            $ ( '#analsr_cod_count' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridList = $ ( '#analsr_cod_grid_list' );
                var ids = $gridList.jqGrid ( "getDataIDs" );
                var lastRowCl = ids[ids.length - 1];
                var lastRowData = $gridList.getRowData ( lastRowCl );

                for ( var i = 0, length = ids.length - 1; i < length; i++ )
                {
                    var cl = ids[i];
                    var rowData = $gridList.getRowData ( cl );

                    // gap setting(1월 ~ 12월, 년평균)
                    rowData.janData = jqgridPercentAbsGapFormatter ( lastRowData.janData, rowData.janData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.febData = jqgridPercentAbsGapFormatter ( lastRowData.febData, rowData.febData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.marData = jqgridPercentAbsGapFormatter ( lastRowData.marData, rowData.marData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.aprData = jqgridPercentAbsGapFormatter ( lastRowData.aprData, rowData.aprData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.mayData = jqgridPercentAbsGapFormatter ( lastRowData.mayData, rowData.mayData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.junData = jqgridPercentAbsGapFormatter ( lastRowData.junData, rowData.junData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.julData = jqgridPercentAbsGapFormatter ( lastRowData.julData, rowData.julData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.augData = jqgridPercentAbsGapFormatter ( lastRowData.augData, rowData.augData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.sepData = jqgridPercentAbsGapFormatter ( lastRowData.sepData, rowData.sepData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.otbData = jqgridPercentAbsGapFormatter ( lastRowData.otbData, rowData.otbData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.novData = jqgridPercentAbsGapFormatter ( lastRowData.novData, rowData.novData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.dcbData = jqgridPercentAbsGapFormatter ( lastRowData.dcbData, rowData.dcbData,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.subTotal = jqgridPercentAbsGapFormatter ( lastRowData.subTotal, rowData.subTotal,
                            prAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );

                    $gridList.jqGrid ( 'setRowData', cl, rowData );
                }

                // 월평균 및 년평균의 평균 셋팅
                lastRowData.janData = numberFloorComma ( lastRowData.janData, staticVariable.decimalPoint );
                lastRowData.febData = numberFloorComma ( lastRowData.febData, staticVariable.decimalPoint );
                lastRowData.marData = numberFloorComma ( lastRowData.marData, staticVariable.decimalPoint );
                lastRowData.aprData = numberFloorComma ( lastRowData.aprData, staticVariable.decimalPoint );
                lastRowData.mayData = numberFloorComma ( lastRowData.mayData, staticVariable.decimalPoint );
                lastRowData.junData = numberFloorComma ( lastRowData.junData, staticVariable.decimalPoint );
                lastRowData.julData = numberFloorComma ( lastRowData.julData, staticVariable.decimalPoint );
                lastRowData.augData = numberFloorComma ( lastRowData.augData, staticVariable.decimalPoint );
                lastRowData.sepData = numberFloorComma ( lastRowData.sepData, staticVariable.decimalPoint );
                lastRowData.otbData = numberFloorComma ( lastRowData.otbData, staticVariable.decimalPoint );
                lastRowData.novData = numberFloorComma ( lastRowData.novData, staticVariable.decimalPoint );
                lastRowData.dcbData = numberFloorComma ( lastRowData.dcbData, staticVariable.decimalPoint );
                lastRowData.subTotal = numberFloorComma ( lastRowData.subTotal, staticVariable.decimalPoint );
                $gridList.jqGrid ( 'setRowData', lastRowCl, lastRowData );
            }
        }
    } );
}

// cod jqgrid 리로드
function reloadCodJqGrid ()
{
    $ ( '#analsr_cod_grid_list' ).trigger ( 'reloadGrid' );
}

// cod highcharts
function anlsrCodPRChart ()
{
    var $analsrCodGraph = $ ( '#analsr_cod_graph' );
    var $analsrCodAll = $ ( '#analsr_cod_all' );
    var $analsrCodExcelBtn = $ ( '#analsr_cod_excel_btn' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/pr/selectCodChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            cod : $ ( '#cod' ).val ()
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#analsr_cod_graph' ).highcharts () ] );

                if ( json.data !== null && json.data.length > 0 )
                {
                    $analsrCodAll.show ();
                    $analsrCodExcelBtn.show ();

                    var prUnitNm = json.data[0].unitNm;
                    var dateFormat = homUtil.dateFormat.convertYYYYMM;
                    var tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;

                    var prArray = [];
                    $.each ( json.data, function ( index, item )
                    {
                        var monthPrArray = [];

                        monthPrArray.push ( item.janData );
                        monthPrArray.push ( item.febData );
                        monthPrArray.push ( item.marData );
                        monthPrArray.push ( item.aprData );
                        monthPrArray.push ( item.mayData );
                        monthPrArray.push ( item.junData );
                        monthPrArray.push ( item.julData );
                        monthPrArray.push ( item.augData );
                        monthPrArray.push ( item.sepData );
                        monthPrArray.push ( item.otbData );
                        monthPrArray.push ( item.novData );
                        monthPrArray.push ( item.dcbData );

                        prArray.push ( monthPrArray );
                    } );

                    var prMinArray = [];
                    $.each ( prArray, function ( index, item )
                    {
                        prMinArray.push ( _.min ( item ) );
                    } );

                    var prYaxis = {
                        title : {
                            text : i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( prUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( prMinArray ) > 0 )
                    {
                        prYaxis.min = 0;
                    }

                    var seriesArray = [];
                    var lastIndex = json.data.length - 1;
                    $.each ( json.data, function ( index, item )
                    {
                        var type = 'line';
                        if ( lastIndex === index )
                        {
                            type = 'column';
                        }

                        var series = {
                            type : type,
                            yAxis : 0,
                            name : item.stdrYear,
                            data : prArray[index]
                        };

                        if ( lastIndex === index )
                        {
                            seriesArray.splice ( 0, 0, series );
                        } else
                        {
                            seriesArray.push ( series );
                        }
                    } );

                    $analsrCodGraph.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
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
                            categories : [ i18nMessage.msg_shortJanuary, i18nMessage.msg_shortFebuary,
                                    i18nMessage.msg_shortMarch, i18nMessage.msg_shortApril, i18nMessage.msg_shortMay,
                                    i18nMessage.msg_shortJune, i18nMessage.msg_shortJuly, i18nMessage.msg_shortAugust,
                                    i18nMessage.msg_shortSeptember, i18nMessage.msg_shortOctober,
                                    i18nMessage.msg_shortNovember, i18nMessage.msg_shortDecember ],
                            labels : {
                                style : {
                                    color : '#3c3c3c'
                                }
                            }
                        },
                        yAxis : prYaxis,
                        tooltip : homUtil.generateLabelTooltip ( staticVariable.decimalPoint ),
                        plotOptions : {
                            line : {
                                pointPadding : 0,
                                borderWidth : 0,
                                lineWidth : 1,
                                marker : {
                                    enabled : false
                                }
                            },
                            column : {
                                pointPadding : 0.4
                            }
                        },
                        series : seriesArray
                    } );
                } else
                {
                    $analsrCodAll.hide ();
                    $analsrCodExcelBtn.hide ();
                    $analsrCodGraph.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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
