// 기간 조회 & 전체 발전소 조회 
function searchEnergyPlant ( initFlag )
{
    var tpl = getTemplate ( templates.noData );
    var $plantGridList = $ ( '#plantGridList' );

    if ( initFlag )
    {
        initEnergyPlantViewAllPopup ();
        searchEnergyPlantJqgrid ( $plantGridList, tpl );
        downloadEnergyPlantExcel ();
    } else
    {
        reloadEnergyPlantJqgrid ( $plantGridList );
    }

    searchEnergyPlantChart ();
}

// 그리드 전체보기 팝업 호출
function initEnergyPlantViewAllPopup ()
{
    $ ( '#btn_all_plant_jqgrid' ).magnificPopup ( {
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

// 전체 발전소 발전량 차트 조회
function searchEnergyPlantChart ()
{
    var $plantGraph1 = $ ( '#plant_graph1' );
    var $btnPlantExcel = $ ( '#btn_plant_excel' );
    var $btnAllPlantJqgrid = $ ( '#btn_all_plant_jqgrid' );
    var $unitBox = $ ( '#unit_box' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEnergyPlantChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#plant_graph1' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $btnPlantExcel.show ();
                    $btnAllPlantJqgrid.show ();
                    $unitBox.show ();

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

                    // 목표 발전량, 전년 발전량, 예상 발전량, 실적 발전량, 평균발전시간, 일사량, 온도
                    var goalEnergyArray = [];
                    var beforeYearEnergyArray = [];
                    var expectedEnergyArray = [];
                    var acmsltEnergyArray = [];
                    var avgEnergyYieldArray = [];
                    var rdtnArray = [];
                    var temprtArray = [];

                    // 발전량, 평균발전시간, 일사량, 온도 단위
                    var energyUnitNm = json.data[0].energyUnitNm;
                    var avgEnergyYieldUnitNm = json.data[0].avgEnergyYieldUnitNm;
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

                                goalEnergyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.goalEnergy, staticVariable.decimalPoint ) ] );
                                beforeYearEnergyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.beforeYearEnergy, staticVariable.decimalPoint ) ] );
                                expectedEnergyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.expectedEnergy, staticVariable.decimalPoint ) ] );
                                acmsltEnergyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.acmsltEnergy, staticVariable.decimalPoint ) ] );
                                avgEnergyYieldArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.avgEnergyYield, staticVariable.decimalPoint ) ] );
                                rdtnArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.rdtn, staticVariable.decimalPoint ) ] );
                                temprtArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.temprt, staticVariable.decimalPoint ) ] );
                            } );

                    // 최소값 판단을 통해 min 값 세팅
                    var energyMinArray = [];
                    energyMinArray.push ( _.min ( _.pluck ( goalEnergyArray, [ 1 ] ) ) );
                    energyMinArray.push ( _.min ( _.pluck ( beforeYearEnergyArray, [ 1 ] ) ) );
                    energyMinArray.push ( _.min ( _.pluck ( expectedEnergyArray, [ 1 ] ) ) );
                    energyMinArray.push ( _.min ( _.pluck ( acmsltEnergyArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var rdtnYaxis = {
                        title : {
                            text : i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' )
                        }
                    };
                    var energyYaxis = {
                        title : {
                            text : i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' )
                        }
                    };
                    var avgEnergyYieldYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_averageEnergyYield
                                    + homUtil.wrapWord ( avgEnergyYieldUnitNm, '(', ')' )
                        }
                    };
                    var atmpsYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( _.pluck ( rdtnArray, [ 1 ] ) ) > 0 )
                    {
                        rdtnYaxis.min = 0;
                    }
                    if ( _.min ( energyMinArray ) > 0 )
                    {
                        energyYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( avgEnergyYieldArray, [ 1 ] ) ) > 0 )
                    {
                        avgEnergyYieldYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( temprtArray, [ 1 ] ) ) > 0 )
                    {
                        atmpsYaxis.min = 0;
                    }

                    yAxisArray.push ( rdtnYaxis );
                    yAxisArray.push ( energyYaxis );
                    yAxisArray.push ( avgEnergyYieldYaxis );
                    yAxisArray.push ( atmpsYaxis );

                    $plantGraph1.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type3 ),
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

                                    dateXAxis = dateXAxis.replace ( / /g, '<br />' );

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
                            yAxis : 1,
                            name : i18nMessage.msg_targetEnergy,
                            data : goalEnergyArray
                        }, {
                            type : 'column',
                            yAxis : 1,
                            name : i18nMessage.msg_lastYearEnergy,
                            data : beforeYearEnergyArray
                        }, {
                            type : 'column',
                            yAxis : 1,
                            name : i18nMessage.msg_expectedEnergy,
                            data : expectedEnergyArray
                        }, {
                            type : 'column',
                            yAxis : 1,
                            name : i18nMessage.msg_actualEnergy,
                            data : acmsltEnergyArray
                        }, {
                            type : 'line',
                            dashStyle : 'shortdot',
                            yAxis : 2,
                            name : i18nMessage.msg_averageEnergyYield,
                            data : avgEnergyYieldArray
                        }, {
                            type : 'line',
                            yAxis : 0,
                            name : i18nMessage.msg_rdtn,
                            data : rdtnArray
                        }, {
                            type : 'line',
                            dashStyle : 'shortdot',
                            yAxis : 3,
                            name : i18nMessage.msg_temperature,
                            data : temprtArray
                        } ]
                    } );
                } else
                {
                    $btnPlantExcel.hide ();
                    $btnAllPlantJqgrid.hide ();
                    $unitBox.hide ();

                    $plantGraph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

// 발전량 jqgrid 조회(초기 세팅 및 조회)
function searchEnergyPlantJqgrid ( $plantGridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'plant_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $plantGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/energy/selectEnergyPlantGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 179,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit
        },
        colNames : [ dateTypeText, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_expected,
                i18nMessage.msg_acmslt, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_expected,
                i18nMessage.msg_averageEnergyYield, i18nMessage.msg_rdtn, i18nMessage.msg_temperature, 'energyUnitNm',
                'rdtnUnitNm', 'avgEnergyYieldUnitNm', 'atmpsUnitNm' ],
        colModel : [
                {
                    name : 'stdrDate',
                    align : 'center',
                    width : '100',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'expectedEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltEnergy',
                    align : 'right',
                    width : '110',
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
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, energyAnalysis.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearGap',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, energyAnalysis.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'expectedGap',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, energyAnalysis.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'avgEnergyYield',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtn',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'temprt',
                    align : 'right',
                    width : '100',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyUnitNm',
                    hidden : true
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                }, {
                    name : 'avgEnergyYieldUnitNm',
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
            $ ( '#totalPlantRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridEnergyPlantHeader ( $plantGridList );
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

        $plantGridList.parent ().append ( html );
    }

    mergeJqgridEnergyPlantHeader ( $plantGridList );

    $ ( '#plantGridList_wrap div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더 병합
function mergeJqgridEnergyPlantHeader ( $plantGridList )
{
    // 헤더 병합
    $plantGridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalEnergy',
            numberOfColumns : 4,
            titleText : i18nMessage.msg_energy
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_gap + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

// 헤더명 변경
function updateJqgridEnergyPlantHeader ( $plantGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $plantGridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $plantGridList.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;
    var avgEnergyYieldUnitNm = rowData.avgEnergyYieldUnitNm;
    var rdtnUnitNm = rowData.rdtnUnitNm;
    var atmpsUnitNm = rowData.atmpsUnitNm;

    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
    {
        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
    }

    avgEnergyYieldUnitNm = homUtil.wrapWord ( avgEnergyYieldUnitNm, '(', ')' );
    if ( avgEnergyYieldUnitNm !== '' )
    {
        avgEnergyYieldUnitNm = '<br />' + avgEnergyYieldUnitNm;
    }

    rdtnUnitNm = homUtil.wrapWord ( rdtnUnitNm, '(', ')' );
    if ( rdtnUnitNm !== '' )
    {
        rdtnUnitNm = '<br />' + rdtnUnitNm;
    }

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더명 변경(발전량, 평균발전시간, 일사량, 온도 with 단위)
    $plantGridList.jqGrid ( 'setLabel', 'stdrDate', dateTypeText );
    $ ( '#plantGridList_stdrDate' ).next ( 'th' ).html (
            i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_plantGridList_avgEnergyYield' ), i18nMessage.msg_averageEnergyYield
            + avgEnergyYieldUnitNm );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_plantGridList_rdtn' ), i18nMessage.msg_rdtn + rdtnUnitNm );
    $ ( '#jqgh_plantGridList_temprt' ).text ( i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' ) );
}

// 발전량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadEnergyPlantJqgrid ( $plantGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();

    $plantGridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 발전량 엑셀 다운로드
function downloadEnergyPlantExcel ()
{
    $ ( '#btn_plant_excel' ).on (
            'click',
            function ()
            {
                var optionsStr = JSON.stringify ( $ ( '#plant_graph1' ).highcharts ().userOptions );
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
                                contextPath + '/hom/excel/analysis/energy/energyAnalysisPlantDownload.do' ).submit ();

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