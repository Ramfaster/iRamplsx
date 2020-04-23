// 기간 조회 & 설비 조회 
function searchEnergyEquipment ( initFlag )
{
    var tpl = getTemplate ( templates.noData );
    var $equipRatioGridList = $ ( '#equipRatioGridList' );
    var $equipRankGridList = $ ( '#equipRankGridList' );

    if ( initFlag )
    {
        initEnergyEquipRatioViewAllPopup ();
        initEnergyEquipRankViewAllPopup ();

        searchEquipRatioJqgrid ( $equipRatioGridList, tpl );
        searchEquipRankJqgrid ( $equipRankGridList, tpl );

        downloadEnergyEquipExcel ();

        customizeScrollEquipment ();
    } else
    {
        reloadEquipRatioJqgrid ( $equipRatioGridList );
        reloadEquipRankJqgrid ( $equipRankGridList );
    }

    var equipRatioResult = searchEquipRatioChart ();
    var equipRatioPieResult = searchEquipRatioPieChart ();
    var rankResult = searchEquipRankChart ();

    var $btnEquipmentExcel = $ ( '#btn_equipment_excel' );

    if ( equipRatioResult + equipRatioPieResult + rankResult === 0 )
    {
        $btnEquipmentExcel.hide ();
    } else
    {
        $btnEquipmentExcel.show ();
    }
}

// 기간 별 발전 비율 그리드 전체보기 팝업 호출
function initEnergyEquipRatioViewAllPopup ()
{
    $ ( '#btn_all_equipment_ratio_jqgrid' ).magnificPopup ( {
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

// 기간 내 순위조회 그리드 전체보기 팝업 호출
function initEnergyEquipRankViewAllPopup ()
{
    $ ( '#btn_all_equipment_rank_jqgrid' ).magnificPopup ( {
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

// 설비별 비율 jqgrid 조회(초기 세팅 및 조회)
function searchEquipRatioJqgrid ( $equipRatioGridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var junctionboxEqmtId = $ ( '#junctionboxEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'ratio_jqgrid_nodata';

    $equipRatioGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/energy/selectEquipRatioGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            junctionboxEqmtId : junctionboxEqmtId,
            unit : unit
        },
        colNames : [ i18nMessage.msg_rank, i18nMessage.msg_division,
                i18nMessage.msg_facilityCapacity + homUtil.wrapWord ( homConstants.unitDcCapacity, '(', ')' ),
                i18nMessage.msg_facilityCapacityRatio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                i18nMessage.msg_energy,
                i18nMessage.msg_energyRatio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                i18nMessage.msg_gap + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ), 'energyUnitNm' ],
        colModel : [
                {
                    name : 'no',
                    align : 'center',
                    width : '70',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'eqmtNm',
                    align : 'left',
                    width : '190',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'eqmtCpcty',
                    align : 'right',
                    width : '200',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'eqmtCpctyRatio',
                    align : 'right',
                    width : '200',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'energy',
                    align : 'right',
                    width : '200',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'energyRatio',
                    align : 'right',
                    width : '190',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'energyGap',
                    align : 'right',
                    width : '190',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, energyAnalysis.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyUnitNm',
                    hidden : true
                } ],
        sortname : 'eqmtNm',
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
            $ ( '#totalEquipmentRatioRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridEquipRatioHeader ( $equipRatioGridList );
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

        $equipRatioGridList.parent ().append ( html );
    }

    $ ( '#equipmentGridList1_wrap div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 설비 비율 헤더명 변경
function updateJqgridEquipRatioHeader ( $equipRatioGridList )
{
    var ids = $equipRatioGridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $equipRatioGridList.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var eqmtCpctyUnitNm = homConstants.unitDcCapacity;

    if ( eqmtGrpCd === staticVariable.eqmtGrpCdEqgr07 || eqmtGrpCd === staticVariable.eqmtGrpCdEqgr08 )
    {
        eqmtCpctyUnitNm = homConstants.unitEquipCapacity;
    }

    // 헤더명 변경(발전량 with 단위, 설치용량 with 단위)
    $equipRatioGridList.jqGrid ( 'setLabel', 'energy', i18nMessage.msg_energy
            + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
    $equipRatioGridList.jqGrid ( 'setLabel', 'eqmtCpcty', i18nMessage.msg_facilityCapacity
            + homUtil.wrapWord ( eqmtCpctyUnitNm, '(', ')' ) );
}

// 설비별 비율 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadEquipRatioJqgrid ( $equipRatioGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var junctionboxEqmtId = $ ( '#junctionboxEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    $equipRatioGridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            junctionboxEqmtId : junctionboxEqmtId,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 기간 내 순위 조회 jqgrid 조회(초기 세팅 및 조회)
function searchEquipRankJqgrid ( $equipRankGridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var junctionboxEqmtId = $ ( '#junctionboxEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'rank_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $equipRankGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/energy/selectEquipRankGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            junctionboxEqmtId : junctionboxEqmtId,
            unit : unit
        },
        colNames : [ dateTypeText, i18nMessage.msg_division, i18nMessage.msg_sum, i18nMessage.msg_acmslt,
                i18nMessage.msg_ratio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ), 'energyUnitNm' ],
        colModel : [ {
            name : 'formatDate',
            align : 'center',
            width : '234',
            fixed : true,
            sortable : false
        }, {
            name : 'eqmtNm',
            align : 'left',
            width : '240',
            fixed : true,
            sortable : false
        }, {
            name : 'energySum',
            align : 'right',
            width : '240',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'energy',
            align : 'right',
            width : '240',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'energyRatio',
            align : 'right',
            width : '240',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'energyUnitNm',
            hidden : true
        } ],
        sortname : 'eqmtNm',
        sortorder : 'asc',
        rownumbers : true,
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
            $ ( '#totalEquipmentRankRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridEquipRankHeader ( $equipRankGridList );
            }
        },
        gridComplete : function ()
        {
            $equipRankGridList.rowspan ( 1, 1 );
            $equipRankGridList.rowspan ( 3, 3 );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $equipRankGridList.parent ().append ( html );
    }

    mergeJqgridEquipRankHeader ( $equipRankGridList );

    $ ( '#equipmentGridList2_wrap div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 기간 내 순위 조회 헤더명 변경
function updateJqgridEquipRankHeader ( $equipRankGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $equipRankGridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $equipRankGridList.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더명 변경(일/월/년, 발전량 with 단위)
    $equipRankGridList.jqGrid ( 'setLabel', 'formatDate', dateTypeText );
    $ ( '#equipRankGridList_eqmtNm' ).next ( 'th' ).html (
            i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
}

// 기간 내 순위 조회 헤더 병합
function mergeJqgridEquipRankHeader ( $equipRankGridList )
{
    $equipRankGridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'energySum',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy
        }, ]
    } );
}

// 기간 내 순위 조회 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadEquipRankJqgrid ( $equipRankGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var junctionboxEqmtId = $ ( '#junctionboxEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    $equipRankGridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            junctionboxEqmtId : junctionboxEqmtId,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 기간 별 발전 비율 차트 조회
function searchEquipRatioChart ()
{
    var $equipmentGraph1 = $ ( '#equipment_graph1' );
    var $btnAllEquipmentRatioJqgrid = $ ( '#btn_all_equipment_ratio_jqgrid' );

    var result = 0;

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEquipRatioChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#equipment_graph1' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    result = json.data.length;

                    $btnAllEquipmentRatioJqgrid.show ();

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

                    var energyRatioArray = [];
                    var energyRatioMinArray = [];
                    var seriesArray = [];

                    $.each ( json.data, function ( index, item )
                    {
                        energyRatioMinArray.push ( item.energyRatio );

                        energyRatioArray.push ( {
                            targetDate : homUtil.convertDateStringToLong ( item.pureDate ),
                            energyRatio : homUtil.mathFloor ( item.energyRatio ),
                            eqmtId : item.eqmtId,
                            eqmtNm : item.eqmtNm
                        } );
                    } );

                    var eqmtIdArray = _.uniq ( _.pluck ( energyRatioArray, 'eqmtId' ) );

                    _.each ( eqmtIdArray, function ( eqmtId )
                    {
                        var eqmtRatioArray = _.where ( energyRatioArray, {
                            eqmtId : eqmtId
                        } );

                        var dataArray = [];
                        var seriesName = '';

                        if ( eqmtRatioArray != null && eqmtRatioArray.length > 0 )
                        {
                            seriesName = eqmtRatioArray[0].eqmtNm;
                        }

                        _.each ( eqmtRatioArray, function ( eqmtRatio )
                        {
                            dataArray.push ( [ eqmtRatio.targetDate, eqmtRatio.energyRatio ] );
                        } );

                        seriesArray.push ( {
                            type : 'column',
                            yAxis : 0,
                            name : seriesName,
                            data : dataArray
                        } );
                    } );

                    var yAxis = {
                        title : {
                            text : i18nMessage.msg_ratio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' )
                        }
                    }

                    if ( _.min ( energyRatioMinArray ) > 0 )
                    {
                        yAxis.min = 0;
                    }

                    $equipmentGraph1.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                        chart : {
                            marginTop : 30,
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
                        yAxis : yAxis,
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                        legend : {
                            align : 'right',
                            verticalAlign : 'top',
                            layout : 'vertical',
                            x : 0,
                            y : 15
                        },
                        plotOptions : {
                            column : {
                                pointPadding : 0.25,
                                borderWidth : 0,
                                stacking : 'normal'
                            }
                        },
                        series : seriesArray
                    } );
                } else
                {
                    $btnAllEquipmentRatioJqgrid.hide ();

                    $equipmentGraph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

    return result;
}

// 설비별 발전량 합계 비율 차트 조회
function searchEquipRatioPieChart ()
{
    var $equipmentGraph2 = $ ( '#equipment_graph2' );

    var result = 0;

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/searchEquipRatioPieChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#equipment_graph2' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    result = json.data.length;

                    var dataArray = [];

                    $.each ( json.data, function ( index, item )
                    {
                        dataArray.push ( {
                            name : item.eqmtNm,
                            y : item.energyRatio
                        } );
                    } );

                    $equipmentGraph2
                            .highcharts ( {
                                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                                chart : {
                                    plotBackgroundColor : null,
                                    plotBorderWidth : null,
                                    plotShadow : false,
                                    type : 'pie'
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
                                tooltip : {
                                    formatter : function ()
                                    {
                                        return '<span style="color:'
                                                + this.color
                                                + '">\u25CF</span> '
                                                + this.key
                                                + ' : '
                                                + homUtil
                                                        .mathFloorComma ( this.percentage, staticVariable.decimalPoint )
                                                + '%';
                                    }
                                },
                                legend : {
                                    layout : 'vertical',
                                    align : 'right',
                                    verticalAlign : 'middle',
                                    floating : false,
                                    symbolWidth : 8,
                                    symbolHeight : 8,
                                    padding : 30
                                },
                                plotOptions : {
                                    pie : {
                                        size : '80%',
                                        borderWidth : 0,
                                        allowPointSelect : true,
                                        cursor : 'pointer',
                                        dataLabels : {
                                            enabled : false
                                        },
                                        showInLegend : true
                                    }
                                },
                                series : [ {
                                    colorByPoint : true,
                                    data : dataArray
                                } ]
                            } );
                } else
                {
                    $equipmentGraph2.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

    return result;
}

// 기간 내 순위 차트 조회
function searchEquipRankChart ()
{
    var $equipmentGraph3 = $ ( '#equipment_graph3' );
    var $btnAllEquipmentRankJqgrid = $ ( '#btn_all_equipment_rank_jqgrid' );

    var result = 0;

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/searchEquipRankChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {

                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#equipment_graph3' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    result = json.data.length;

                    // 일자별 데이터가 1개만 있을 경우 line marker를 보여주고 여러개 있을 경우 보여주지 않음
                    var pureDateArray = _.uniq ( _.pluck ( json.data, 'pureDate' ) );
                    var count = 0;
                    _.each ( pureDateArray, function ( pureDate )
                    {
                        var maxValue = _.max ( _.pluck ( _.where ( json.data, {
                            pureDate : pureDate
                        } ), 'energy' ) );

                        if ( $.isNumeric ( maxValue ) && maxValue > 0 )
                        {
                            count++;
                        }
                    } );

                    var lineMarker = {
                        enabled : count === 1 ? true : false
                    }

                    $btnAllEquipmentRankJqgrid.show ();

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

                    var energyArray = [];
                    var energyMinArray = [];
                    var seriesArray = [];

                    // 발전량 단위
                    var energyUnitNm = json.data[0].energyUnitNm;

                    $.each ( json.data, function ( index, item )
                    {
                        energyMinArray.push ( item.energy );

                        energyArray.push ( {
                            targetDate : homUtil.convertDateStringToLong ( item.pureDate ),
                            energy : homUtil.mathFloor ( item.energy ),
                            eqmtId : item.eqmtId,
                            eqmtNm : item.eqmtNm
                        } );
                    } );

                    var eqmtIdArray = _.uniq ( _.pluck ( energyArray, 'eqmtId' ) );

                    _.each ( eqmtIdArray, function ( eqmtId )
                    {
                        var eqmtEnergyArray = _.where ( energyArray, {
                            eqmtId : eqmtId
                        } );

                        var dataArray = [];
                        var seriesName = '';

                        if ( eqmtEnergyArray != null && eqmtEnergyArray.length > 0 )
                        {
                            seriesName = eqmtEnergyArray[0].eqmtNm;
                        }

                        _.each ( eqmtEnergyArray, function ( eqmtEnergy )
                        {
                            dataArray.push ( [ eqmtEnergy.targetDate, eqmtEnergy.energy ] );
                        } );

                        seriesArray.push ( {
                            type : 'line',
                            yAxis : 0,
                            name : seriesName,
                            data : dataArray
                        } );
                    } );

                    var yAxis = {
                        title : {
                            text : i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' )
                        }
                    }

                    if ( _.min ( energyMinArray ) > 0 )
                    {
                        yAxis.min = 0;
                    }

                    $equipmentGraph3.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                        chart : {
                            marginTop : 30,
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
                        yAxis : yAxis,
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                        legend : {
                            align : 'right',
                            verticalAlign : 'top',
                            layout : 'vertical',
                            x : 0,
                            y : 15
                        },
                        plotOptions : {
                            line : {
                                pointPadding : 0,
                                borderWidth : 0,
                                lineWidth : 1,
                                marker : lineMarker
                            },
                            column : {
                                pointPadding : 0.4
                            }
                        },
                        series : seriesArray
                    } );
                } else
                {
                    $btnAllEquipmentRankJqgrid.hide ();

                    $equipmentGraph3.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

    return result;
}

// scroll customize
function customizeScrollEquipment ()
{
    // custom scroll
    $ ( '.irradiation_scrd' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// 발전량 엑셀 다운로드
function downloadEnergyEquipExcel ()
{
    $ ( '#btn_equipment_excel' ).on (
            'click',
            function ()
            {
                var $equipmentGraph1 = $ ( '#equipment_graph1' );
                var optionsStr1 = JSON.stringify ( $equipmentGraph1.highcharts ().userOptions );
                var dataString1 = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr1 );
                var imageUrl1 = getHighchartsImagePath ( dataString1 );

                var $equipmentGraph2 = $ ( '#equipment_graph2' );
                var optionsStr2 = JSON.stringify ( $equipmentGraph2.highcharts ().userOptions );
                var dataString2 = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr2 );
                var imageUrl2 = getHighchartsImagePath ( dataString2 );

                var $equipmentGraph3 = $ ( '#equipment_graph3' );
                var optionsStr3 = JSON.stringify ( $equipmentGraph3.highcharts ().userOptions );
                var dataString3 = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr3 );
                var imageUrl3 = getHighchartsImagePath ( dataString3 );

                if ( imageUrl1 !== null && imageUrl2 !== null && imageUrl3 !== null )
                {
                    setSearchedParamaeter ();

                    var $excelUrl1 = $ ( '<input />', {
                        type : 'hidden',
                        id : 'excelUrl1',
                        name : 'url1',
                        value : staticVariable.exportUrl + imageUrl1
                    } );

                    var $excelUrl2 = $ ( '<input />', {
                        type : 'hidden',
                        id : 'excelUrl2',
                        name : 'url2',
                        value : staticVariable.exportUrl + imageUrl2
                    } );

                    var $excelUrl3 = $ ( '<input />', {
                        type : 'hidden',
                        id : 'excelUrl3',
                        name : 'url3',
                        value : staticVariable.exportUrl + imageUrl3
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

                    $ ( 'form' ).prepend ( $excelUrl1, $excelUrl2, $excelUrl3, $menuName ).prop ( 'action',
                            contextPath + '/hom/excel/analysis/energy/energyAnalysisEquipDownload.do' ).submit ();

                    $excelUrl1.remove ();
                    $excelUrl2.remove ();
                    $excelUrl3.remove ();
                    $menuName.remove ();
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
            } );
}