// cod 기준 조회 
function searchEnergyCod ( initFlag )
{
    var tpl = getTemplate ( templates.noData );
    var $codGridList = $ ( '#codGridList' );

    if ( initFlag )
    {
        initEnergyCodViewAllPopup ();
        searchEnergyCodJqgrid ( $codGridList, tpl );
        downloadEnergyCodExcel ();
    } else
    {
        reloadEnergyCodJqgrid ( $codGridList );
    }

    searchEnergyCodChart ();

}

// 그리드 전체보기 팝업 호출
function initEnergyCodViewAllPopup ()
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

// cod 발전량 차트 조회
function searchEnergyCodChart ()
{
    var $codGraph1 = $ ( '#cod_graph1' );
    var $btnCodExcel = $ ( '#btn_cod_excel' );
    var $btnAllCodJqgrid = $ ( '#btn_all_cod_jqgrid' );
    var $unitBox = $ ( '#unit_box' );
    var $codGridTagUnit = $ ( '#cod_grid_tagUnit' );
    var $codGridTagUnitWrap = $codGridTagUnit.closest ( '.grid_noti' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEnergyCodChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#cod_graph1' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $btnCodExcel.show ();
                    $btnAllCodJqgrid.show ();
                    $unitBox.show ();
                    $codGridTagUnitWrap.show ();

                    var energyUnitNm = json.data[0].unitNm;
                    var dateFormat = homUtil.dateFormat.convertYYYYMM;
                    var tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;

                    if ( energyUnitNm !== null && energyUnitNm !== '' )
                    {
                        $codGridTagUnit.html ( energyUnitNm );
                    }

                    var energyCodArray = [];
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
                            text : i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( energyCodMinArray ) > 0 )
                    {
                        energyYaxis.min = 0;
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
                    $unitBox.hide ();
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

// 발전량 cod jqgrid 조회(초기 세팅 및 조회)
function searchEnergyCodJqgrid ( $codGridList, tpl )
{
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'cod_jqgrid_nodata';

    $codGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/energy/selectEnergyCodGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            unit : unit
        },
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
        sortname : 'stdrDate',
        sortorder : 'asc',
        rownumbers : false,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
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
                    rowData.janData = jqgridValueAbsGapFormatter ( lastRowData.janData, rowData.janData,
                            staticVariable.decimalPoint );
                    rowData.febData = jqgridValueAbsGapFormatter ( lastRowData.febData, rowData.febData,
                            staticVariable.decimalPoint );
                    rowData.marData = jqgridValueAbsGapFormatter ( lastRowData.marData, rowData.marData,
                            staticVariable.decimalPoint );
                    rowData.aprData = jqgridValueAbsGapFormatter ( lastRowData.aprData, rowData.aprData,
                            staticVariable.decimalPoint );
                    rowData.mayData = jqgridValueAbsGapFormatter ( lastRowData.mayData, rowData.mayData,
                            staticVariable.decimalPoint );
                    rowData.junData = jqgridValueAbsGapFormatter ( lastRowData.junData, rowData.junData,
                            staticVariable.decimalPoint );
                    rowData.julData = jqgridValueAbsGapFormatter ( lastRowData.julData, rowData.julData,
                            staticVariable.decimalPoint );
                    rowData.augData = jqgridValueAbsGapFormatter ( lastRowData.augData, rowData.augData,
                            staticVariable.decimalPoint );
                    rowData.sepData = jqgridValueAbsGapFormatter ( lastRowData.sepData, rowData.sepData,
                            staticVariable.decimalPoint );
                    rowData.otbData = jqgridValueAbsGapFormatter ( lastRowData.otbData, rowData.otbData,
                            staticVariable.decimalPoint );
                    rowData.novData = jqgridValueAbsGapFormatter ( lastRowData.otbData, rowData.novData,
                            staticVariable.decimalPoint );
                    rowData.dcbData = jqgridValueAbsGapFormatter ( lastRowData.dcbData, rowData.dcbData,
                            staticVariable.decimalPoint );
                    rowData.subTotal = jqgridValueAbsGapFormatter ( lastRowData.subTotal, rowData.subTotal,
                            staticVariable.decimalPoint );

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
                lastRowData.subTotal = numberFloorComma ( lastRowData.subTotal, staticVariable.decimalPoint );
                $codGridList.jqGrid ( 'setRowData', lastRowCl, lastRowData );
            }
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

// 발전량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadEnergyCodJqgrid ( $codGridList )
{
    var unit = $ ( '#unit' ).val ();

    $codGridList.setGridParam ( {
        postData : {
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 발전량 엑셀 다운로드
function downloadEnergyCodExcel ()
{
    $ ( '#btn_cod_excel' ).on (
            'click',
            function ()
            {
                var optionsStr = JSON.stringify ( $ ( '#cod_graph1' ).highcharts ().userOptions );
                var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

                setSearchedParamaeter ();

                $.ajax ( {
                    type : 'POST',
                    data : dataString,
                    url : staticVariable.exportUrl,
                    success : function ( data )
                    {
                        var $excelUrl = $ ( '<input />', {
                            type : 'hidden',
                            id : 'excelUrl',
                            name : 'url',
                            value : staticVariable.exportUrl + data
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

                        $ ( 'form' ).prepend ( $excelUrl, $menuName ).prop ( 'action',
                                contextPath + '/hom/excel/analysis/energy/energyAnalysisCodDownload.do' ).submit ();

                        $excelUrl.remove ();
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

            } );
}