// cod 기준 조회 
function searchEfficiencyCod ( initFlag )
{
    var tpl = getTemplate ( templates.noData );
    var $codGridList = $ ( '#codGridList' );

    if ( initFlag )
    {
        initEfficiencyCodViewAllPopup ();
        searchEfficiencyCodJqgrid ( $codGridList, tpl );
    } else
    {
        reloadEfficiencyCodJqgrid ( $codGridList );
    }

    searchEfficiencyCodChart ();
}

// 엑셀 버튼 분석 > COD
function setAnalsrCodExcelBtn ()
{
    var $btnCodExcel = $ ( '#btn_cod_excel' );
    $btnCodExcel.on ( 'click', function ()
    {
        var graphChart = $ ( '#cod_graph1' ).highcharts ();
        var dataString = encodeURI ( 'async=true&type=png&width=600&options='
                + JSON.stringify ( graphChart.userOptions ) );

        $.ajax ( {
            url : staticVariable.exportUrl,
            type : 'POST',
            data : dataString,
            success : function ( data )
            {
                var eqmtGrpCd = $ ( '#codEqmtGrpCd' ).val ();
                var eqmtId = $ ( '#codJunctionboxEqmtId' ).val ();

                var $excelUrl = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_excelUrl',
                    name : 'url',
                    value : staticVariable.exportUrl + data
                } );

                var $eqmtGrpCd = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_eqmtGrpCd',
                    name : 'excelEqmtGrpCd',
                    value : eqmtGrpCd
                } );

                var $eqmtId = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_eqmtId',
                    name : 'excelEqmtId',
                    value : eqmtId
                } );

                var menuName = '';
                $ ( '.lnb' ).find ( 'span' ).each ( function ()
                {
                    menuName += ($ ( this ).text () + '_');
                } );

                menuName += $ ( '.lnb' ).find ( 'strong' ).text ();

                var $menuName = $ ( '<input />', {
                    type : 'hidden',
                    id : 'menuName',
                    name : 'menuName',
                    value : menuName
                } );

                $ ( 'form' ).prepend ( $excelUrl, $eqmtGrpCd, $eqmtId, $menuName ).prop ( 'action',
                        contextPath + '/hom/excel/analysis/effectiveness/codDownload.do' ).submit ();

                $excelUrl.remove ();
                $eqmtGrpCd.remove ();
                $eqmtId.remove ();
                $menuName.remove ();
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

        return false;
    } );
}

// 그리드 전체보기 팝업 호출
function initEfficiencyCodViewAllPopup ()
{
    $ ( '#btn_all_cod_jqgrid' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            beforeOpen : function ()
            {
                setSearchedParamaeter ();
            }
        }
    } );
}

// cod 효율 차트 조회
function searchEfficiencyCodChart ()
{
    var $codGraph1 = $ ( '#cod_graph1' );
    var $btnCodExcel = $ ( '#btn_cod_excel' );
    var $btnAllCodJqgrid = $ ( '#btn_all_cod_jqgrid' );
    var $codGridTagUnit = $ ( '#cod_grid_tagUnit' );
    var $codGridTagUnitWrap = $codGridTagUnit.closest ( '.grid_noti' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/effectiveness/selectCodChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            eqmtGrpCd : $ ( '#codEqmtGrpCd' ).val (),
            eqmtId : $ ( '#codJunctionboxEqmtId' ).val ()
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#cod_graph1' ).highcharts () ] );

                if ( json.data !== null && json.data.length > 0 )
                {
                    $btnCodExcel.show ();
                    $btnAllCodJqgrid.show ();
                    $codGridTagUnitWrap.show ();

                    var unitNm = json.data[0].unitNm;
                    var dateFormat = homUtil.dateFormat.convertYYYYMM;
                    var tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;

                    if ( unitNm !== null && unitNm !== '' )
                    {
                        $codGridTagUnit.html ( unitNm );
                    }

                    var energyCodArray = [];
                    var lastIndex = json.data.length - 1;
                    $.each ( json.data, function ( index, item )
                    {
                        var monthEnergyArray = [];

                        monthEnergyArray.push ( item.janData );
                        monthEnergyArray.push ( item.febData );
                        monthEnergyArray.push ( item.marData );
                        monthEnergyArray.push ( item.aprData );
                        monthEnergyArray.push ( item.mayData );
                        monthEnergyArray.push ( item.junData );
                        monthEnergyArray.push ( item.julData );
                        monthEnergyArray.push ( item.augData );
                        monthEnergyArray.push ( item.sepData );
                        monthEnergyArray.push ( item.otbData );
                        monthEnergyArray.push ( item.novData );
                        monthEnergyArray.push ( item.dcbData );

                        energyCodArray.push ( monthEnergyArray );
                    } );

                    var energyCodMinArray = [];
                    $.each ( energyCodArray, function ( index, item )
                    {
                        energyCodMinArray.push ( _.min ( item ) );
                    } );

                    var energyYaxis = {
                        title : {
                            text : i18nMessage.msg_effectiveness + homUtil.wrapWord ( unitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( energyCodMinArray ) > 0 )
                    {
                        energyYaxis.min = 0;
                    }

                    var seriesArray = [];
                    $.each ( json.data, function ( index, item )
                    {
                        var type = 'line';
                        var name = item.stdrYear + '/' + item.eqmtNm;
                        if ( lastIndex === index )
                        {
                            type = 'column';
                            name = item.stdrYear;
                        }

                        var series = {
                            type : type,
                            yAxis : 0,
                            name : name,
                            data : energyCodArray[index]
                        };

                        if ( lastIndex === index )
                        {
                            seriesArray.splice ( 0, 0, series );
                        } else
                        {
                            seriesArray.push ( series );
                        }
                    } );

                    $codGraph1.highcharts ( {
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
                        yAxis : energyYaxis,
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
                    $btnCodExcel.hide ();
                    $btnAllCodJqgrid.hide ();
                    $codGridTagUnitWrap.hide ();

                    $codGraph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

// cod 효율 jqgrid 조회(초기 세팅 및 조회)
function searchEfficiencyCodJqgrid ( $codGridList, tpl )
{
    var noDataId = 'cod_jqgrid_nodata';

    $codGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/effectiveness/selectCodGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            eqmtGrpCd : $ ( '#codEqmtGrpCd' ).val (),
            eqmtId : $ ( '#codJunctionboxEqmtId' ).val ()
        },
        colNames : [ i18nMessage.msg_years, i18nMessage.msg_division, i18nMessage.msg_shortJanuary,
                i18nMessage.msg_shortFebuary, i18nMessage.msg_shortMarch, i18nMessage.msg_shortApril,
                i18nMessage.msg_shortMay, i18nMessage.msg_shortJune, i18nMessage.msg_shortJuly,
                i18nMessage.msg_shortAugust, i18nMessage.msg_shortSeptember, i18nMessage.msg_shortOctober,
                i18nMessage.msg_shortNovember, i18nMessage.msg_shortDecember ],
        colModel : [ {
            name : 'stdrYear',
            align : 'center',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'eqmtNm',
            align : 'center',
            width : '110',
            fixed : true,
            sortable : false
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
        } ],
        sortname : 'stdrDate',
        sortorder : 'asc',
        rownumbers : false,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        async : false,
        loadonce : false,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalCodRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var ids = $codGridList.jqGrid ( "getDataIDs" );
                var lastRowCl = ids[ids.length - 1];
                var lastRowData = $codGridList.getRowData ( lastRowCl );

                for ( var i = 0, length = ids.length - 1; i < length; i++ )
                {
                    var cl = ids[i];
                    var rowData = $codGridList.getRowData ( cl );

                    // gap setting(1월 ~ 12월, 년평균)
                    rowData.janData = jqgridPercentAbsGapFormatter ( lastRowData.janData, rowData.janData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.febData = jqgridPercentAbsGapFormatter ( lastRowData.febData, rowData.febData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.marData = jqgridPercentAbsGapFormatter ( lastRowData.marData, rowData.marData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.aprData = jqgridPercentAbsGapFormatter ( lastRowData.aprData, rowData.aprData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.mayData = jqgridPercentAbsGapFormatter ( lastRowData.mayData, rowData.mayData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.junData = jqgridPercentAbsGapFormatter ( lastRowData.junData, rowData.junData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.julData = jqgridPercentAbsGapFormatter ( lastRowData.julData, rowData.julData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.augData = jqgridPercentAbsGapFormatter ( lastRowData.augData, rowData.augData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.sepData = jqgridPercentAbsGapFormatter ( lastRowData.sepData, rowData.sepData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.otbData = jqgridPercentAbsGapFormatter ( lastRowData.otbData, rowData.otbData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.novData = jqgridPercentAbsGapFormatter ( lastRowData.novData, rowData.novData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.dcbData = jqgridPercentAbsGapFormatter ( lastRowData.dcbData, rowData.dcbData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );

                    $codGridList.jqGrid ( 'setRowData', cl, rowData );
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
                $codGridList.jqGrid ( 'setRowData', lastRowCl, lastRowData );
            }
        },
        gridComplete : function ()
        {
            $ ( this ).rowspan ( 0, 0 );
            colspanLastRow ( $codGridList, 0, 2 );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $codGridList.parent ().append ( html );
    }

    $ ( '#codGridList_wrap div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// cod 효율 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadEfficiencyCodJqgrid ( $codGridList )
{
    var codEqmtGrpCd = $ ( '#codEqmtGrpCd' ).val ();
    var codJunctionboxEqmtId = $ ( '#codJunctionboxEqmtId' ).val ();

    $codGridList.setGridParam ( {
        postData : {
            eqmtGrpCd : codEqmtGrpCd,
            eqmtId : codJunctionboxEqmtId
        }
    } ).trigger ( 'reloadGrid' );
}