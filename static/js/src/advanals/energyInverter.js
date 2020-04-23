// 인버터 vendor 조회 
function searchEnergyInverter ( initFlag )
{
    var tpl = getTemplate ( templates.noData );
    var $inverterRatioGridList = $ ( '#inverterRatioGridList' );
    var $inverterRankGridList = $ ( '#inverterRankGridList' );

    if ( initFlag )
    {
        initEnergyInverterRatioViewAllPopup ();
        initEnergyInverterRankViewAllPopup ();

        searchInverterRatioJqgrid ( $inverterRatioGridList, tpl );
        searchInverterRankJqgrid ( $inverterRankGridList, tpl );

        downloadEnergyInverterExcel ();

        customizeScrollInverter ();
    } else
    {
        reloadInverterRatioJqgrid ( $inverterRatioGridList );
        reloadInverterRankJqgrid ( $inverterRankGridList );
    }

    var inverterRatioResult = searchInverterRatioChart ();
    var inverterRatioPieResult = searchInverterRatioPieChart ();
    var rankResult = searchInverterRankChart ();

    var $btnInverterExcel = $ ( '#btn_inverter_excel' );

    if ( inverterRatioResult + inverterRatioPieResult + rankResult === 0 )
    {
        $btnInverterExcel.hide ();
    } else
    {
        $btnInverterExcel.show ();
    }
}

// 기간 별 발전 비율 그리드 전체보기 팝업 호출
function initEnergyInverterRatioViewAllPopup ()
{
    $ ( '#btn_all_inverter_ratio_jqgrid' ).magnificPopup ( {
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
function initEnergyInverterRankViewAllPopup ()
{
    $ ( '#btn_all_inverter_rank_jqgrid' ).magnificPopup ( {
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

// 인버터 vendor별 발전 비율 jqgrid 조회(초기 세팅 및 조회)
function searchInverterRatioJqgrid ( $inverterRatioGridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'ratio_jqgrid_nodata';

    $inverterRatioGridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/energy/selectInverterRatioGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit
        },
        colNames : [ i18nMessage.msg_rank, i18nMessage.msg_division,
                i18nMessage.msg_facilityCapacity + homUtil.wrapWord ( homConstants.unitDcCapacity, '(', ')' ),
                i18nMessage.msg_facilityCapacityRatio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                i18nMessage.msg_energy,
                i18nMessage.msg_energyRatio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                i18nMessage.msg_energyGap + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ), 'energyUnitNm' ],
        colModel : [ {
            name : 'no',
            align : 'center',
            width : '60',
            fixed : true,
            sortable : false
        }, {
            name : 'corprNm',
            align : 'left',
            width : '210',
            fixed : true,
            sortable : false
        }, {
            name : 'eqmtCpcty',
            align : 'right',
            width : '190',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'eqmtRatio',
            align : 'right',
            width : '190',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltVal',
            align : 'right',
            width : '190',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltRatio',
            align : 'right',
            width : '190',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'diffVal',
            align : 'right',
            width : '190',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject, staticVariable.decimalPoint );
            }
        }, {
            name : 'energyUnitNm',
            hidden : true
        } ],
        sortname : 'corprNm',
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
            $ ( '#totalInverterRatioRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridInverterRatioHeader ( $inverterRatioGridList );
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

        $inverterRatioGridList.parent ().append ( html );
    }

    $ ( '#inverterGridList1_wrap div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 인버터 vendor별 발전 비율 헤더명 변경
function updateJqgridInverterRatioHeader ( $inverterRatioGridList )
{
    var ids = $inverterRatioGridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $inverterRatioGridList.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;

    // 헤더명 변경(발전량 with 단위)
    $inverterRatioGridList.jqGrid ( 'setLabel', 'acmsltVal', i18nMessage.msg_energy
            + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
}

// 인버터 vendor별 발전 비율 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadInverterRatioJqgrid ( $inverterRatioGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();

    $inverterRatioGridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 기간 내 순위 조회 jqgrid 조회(초기 세팅 및 조회)
function searchInverterRankJqgrid ( $inverterRankGridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'rank_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $inverterRankGridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/energy/selectInverterRankGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
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
            name : 'corprNm',
            align : 'left',
            width : '240',
            fixed : true,
            sortable : false
        }, {
            name : 'acmsltTotal',
            align : 'right',
            width : '240',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltVal',
            align : 'right',
            width : '240',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltRatio',
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
        sortname : 'corprNm',
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
            $ ( '#totalInverterRankRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridInverterRankHeader ( $inverterRankGridList );
            }
        },
        gridComplete : function ()
        {
            $inverterRankGridList.rowspan ( 1, 1 );
            $inverterRankGridList.rowspan ( 3, 3 );
            $inverterRankGridList.rowspan ( 4, 4 );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $inverterRankGridList.parent ().append ( html );
    }

    mergeJqgridInverterRankHeader ( $inverterRankGridList );

    $ ( '#inverterGridList2_wrap div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 기간 내 순위 조회 헤더명 변경
function updateJqgridInverterRankHeader ( $inverterRankGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $inverterRankGridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $inverterRankGridList.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더명 변경(일/월/년, 발전량 with 단위)
    $inverterRankGridList.jqGrid ( 'setLabel', 'formatDate', dateTypeText );
    $ ( '#inverterRankGridList_corprNm' ).next ( 'th' ).html (
            i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
}

// 기간 내 순위 조회 헤더 병합
function mergeJqgridInverterRankHeader ( $inverterRankGridList )
{
    $inverterRankGridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'acmsltTotal',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy
        }, ]
    } );
}

// 기간 내 순위 조회 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadInverterRankJqgrid ( $inverterRankGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();

    $inverterRankGridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 기간 별 발전 비율 차트 조회
function searchInverterRatioChart ()
{
    var $inverterGraph1 = $ ( '#inverter_graph1' );
    var $btnAllInverterRatioJqgrid = $ ( '#btn_all_inverter_ratio_jqgrid' );

    var result = 0;

    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/selectInverterRatioChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#inverter_graph1' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    result = json.data.length;

                    $btnAllInverterRatioJqgrid.show ();

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

                    var acmsltRatioArray = [];
                    var acmsltRatioMinArray = [];
                    var seriesArray = [];

                    $.each ( json.data, function ( index, item )
                    {
                        acmsltRatioMinArray.push ( item.acmsltRatio );

                        acmsltRatioArray.push ( {
                            targetDate : homUtil.convertDateStringToLong ( item.pureDate ),
                            acmsltRatio : homUtil.mathFloor ( item.acmsltRatio ),
                            corprId : item.corprId,
                            corprNm : item.corprNm
                        } );
                    } );

                    var corprIdArray = _.uniq ( _.pluck ( acmsltRatioArray, 'corprId' ) );

                    _.each ( corprIdArray, function ( corprId )
                    {
                        var inverterRatioArray = _.where ( acmsltRatioArray, {
                            corprId : corprId
                        } );

                        var dataArray = [];
                        var seriesName = '';

                        if ( inverterRatioArray != null && inverterRatioArray.length > 0 )
                        {
                            var corprNmArray = _.compact ( _.pluck ( inverterRatioArray, 'corprNm' ) );

                            seriesName = corprNmArray[0];
                        }

                        _.each ( inverterRatioArray, function ( inverterRatio )
                        {
                            dataArray.push ( [ inverterRatio.targetDate, inverterRatio.acmsltRatio ] );
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

                    if ( _.min ( acmsltRatioMinArray ) > 0 )
                    {
                        yAxis.min = 0;
                    }

                    $inverterGraph1.highcharts ( {
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
                    $btnAllInverterRatioJqgrid.hide ();

                    $inverterGraph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

// 인버터 vendor별 발전 합계 비율 차트 조회
function searchInverterRatioPieChart ()
{
    var $inverterGraph2 = $ ( '#inverter_graph2' );

    var result = 0;

    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/searchInverterRatioPieChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#inverter_graph2' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    result = json.data.length;

                    var dataArray = [];

                    $.each ( json.data, function ( index, item )
                    {
                        dataArray.push ( {
                            name : item.corprNm,
                            y : item.acmsltRatio
                        } );
                    } );

                    $inverterGraph2
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
                    $inverterGraph2.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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
function searchInverterRankChart ()
{
    var $inverterGraph3 = $ ( '#inverter_graph3' );
    var $btnAllInverterRankJqgrid = $ ( '#btn_all_inverter_rank_jqgrid' );

    var result = 0;

    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/searchInverterRankChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {

                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#inverter_graph3' ).highcharts () ] );

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
                        } ), 'acmsltVal' ) );

                        if ( $.isNumeric ( maxValue ) && maxValue > 0 )
                        {
                            count++;
                        }
                    } );

                    var lineMarker = {
                        enabled : count === 1 ? true : false
                    }

                    $btnAllInverterRankJqgrid.show ();

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

                    var acmsltValArray = [];
                    var acmsltValMinArray = [];
                    var seriesArray = [];

                    // 발전량 단위
                    var energyUnitNm = json.data[0].energyUnitNm;

                    $.each ( json.data, function ( index, item )
                    {
                        acmsltValMinArray.push ( item.acmsltVal );

                        acmsltValArray.push ( {
                            targetDate : homUtil.convertDateStringToLong ( item.pureDate ),
                            acmsltVal : homUtil.mathFloor ( item.acmsltVal ),
                            corprId : item.corprId,
                            corprNm : item.corprNm
                        } );
                    } );

                    var corprIdArray = _.uniq ( _.pluck ( acmsltValArray, 'corprId' ) );

                    _.each ( corprIdArray, function ( corprId )
                    {
                        var inverterEnergyArray = _.where ( acmsltValArray, {
                            corprId : corprId
                        } );

                        var dataArray = [];
                        var seriesName = '';

                        if ( inverterEnergyArray != null && inverterEnergyArray.length > 0 )
                        {
                            var corprNmArray = _.compact ( _.pluck ( inverterEnergyArray, 'corprNm' ) );

                            seriesName = corprNmArray[0];
                        }

                        _.each ( inverterEnergyArray, function ( inverterEnergy )
                        {
                            dataArray.push ( [ inverterEnergy.targetDate, inverterEnergy.acmsltVal ] );
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

                    if ( _.min ( acmsltValMinArray ) > 0 )
                    {
                        yAxis.min = 0;
                    }

                    $inverterGraph3.highcharts ( {
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
                    $btnAllInverterRankJqgrid.hide ();

                    $inverterGraph3.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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
function customizeScrollInverter ()
{
    // custom scroll
    $ ( '#inverter_box .irradiation_scrd' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// 인버터 발전량 엑셀 다운로드
function downloadEnergyInverterExcel ()
{
    $ ( '#btn_inverter_excel' ).on (
            'click',
            function ()
            {
                var $inverterGraph1 = $ ( '#inverter_graph1' );
                var optionsStr1 = JSON.stringify ( $inverterGraph1.highcharts ().userOptions );
                var dataString1 = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr1 );
                var imageUrl1 = getHighchartsImagePath ( dataString1 );

                var $inverterGraph2 = $ ( '#inverter_graph2' );
                var optionsStr2 = JSON.stringify ( $inverterGraph2.highcharts ().userOptions );
                var dataString2 = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr2 );
                var imageUrl2 = getHighchartsImagePath ( dataString2 );

                var $inverterGraph3 = $ ( '#inverter_graph3' );
                var optionsStr3 = JSON.stringify ( $inverterGraph3.highcharts ().userOptions );
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
                            contextPath + '/hom/excel/advancedanalysis/energy/inverterDownload.do' ).submit ();

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