// 기간 조회 & 접속반 스트링 조회 
function searchEfficiencyEquip ( initFlag )
{
    var tpl = getTemplate ( templates.noData );
    var $equipGridList = $ ( '#equipGridList' );

    if ( initFlag )
    {
        initEquipViewAllPopup ();

        searchEquipJqgrid ( $equipGridList, tpl );
    } else
    {
        reloadEquipJqgrid ( $equipGridList );
    }

    searchEquipChart ();
}

// 엑셀 버튼 분석 > 접속반/스트링
function setAnalsrEquipExcelBtn ()
{
    var $btnEquipmentExcel = $ ( '#btn_equipment_excel' );
    $btnEquipmentExcel.on ( 'click', function ()
    {
        var graphChart = $ ( '#equipment_graph1' ).highcharts ();
        var dataString = encodeURI ( 'async=true&type=png&width=600&options='
                + JSON.stringify ( graphChart.userOptions ) );
        $.ajax ( {
            url : staticVariable.exportUrl,
            type : 'POST',
            data : dataString,
            success : function ( data )
            {
                var $excelUrl = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_excelUrl',
                    name : 'url',
                    value : staticVariable.exportUrl + data
                } );

                var $dateType = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_dateType',
                    name : 'excelDateType',
                    value : $ ( '#dateType' ).val ()
                } );

                var $fromDate = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_fromDate',
                    name : 'excelFromDate',
                    value : $ ( '#fromDate' ).val ()
                } );

                var $toDate = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_toDate',
                    name : 'excelToDate',
                    value : $ ( '#toDate' ).val ()
                } );

                var $eqmtGrpCd = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_eqmtGrpCd',
                    name : 'excelEqmtGrpCd',
                    value : $ ( '#eqmtGrpCd' ).val ()
                } );

                var $eqmtId = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_eqmtId',
                    name : 'excelEqmtId',
                    value : $ ( '#junctionboxEqmtId' ).val ()
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

                $ ( 'form' ).prepend ( $excelUrl, $dateType, $fromDate, $toDate, $eqmtGrpCd, $eqmtId, $menuName ).prop (
                        'action', contextPath + '/hom/excel/analysis/effectiveness/equipDownload.do' ).submit ();

                $excelUrl.remove ();
                $dateType.remove ();
                $fromDate.remove ();
                $toDate.remove ();
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

// 접속반 스트링 성능비 그리드 전체보기 팝업 호출
function initEquipViewAllPopup ()
{
    $ ( '#btn_all_equipment_jqgrid' ).magnificPopup ( {
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

// 접속반 스트링 성능비 jqgrid 조회(초기 세팅 및 조회)
function searchEquipJqgrid ( $equipGridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var eqmtId = $ ( '#junctionboxEqmtId' ).val ();

    var noDataId = 'equip_jqgrid_nodata';

    $equipGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/effectiveness/selectEquipGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            eqmtId : eqmtId
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
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject,
                                efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
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
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalEquipmentRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridEquipHeader ( $equipGridList );
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

        $equipGridList.parent ().append ( html );
    }

    mergeJqgridEfficiencyHeader ( $equipGridList );

    $ ( '#equipGridList1_wrap div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더 병합
function mergeJqgridEfficiencyHeader ( $equipGridList )
{
    $equipGridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalPr',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_effectiveness
        } ]
    } );
}

// 설비 비율 헤더명 변경
function updateJqgridEquipHeader ( $equipGridList )
{
    var ids = $equipGridList.jqGrid ( 'getDataIDs' );
    var rowData = $equipGridList.getRowData ( ids[0] );

    var prUnitNm = rowData.prUnitNm;

    // 헤더명 변경
    $ ( '#equipGridList_eqmtNm' ).next ( 'th' ).html (
            i18nMessage.msg_effectiveness + homUtil.wrapWord ( prUnitNm, '(', ')' ) );
    $ ( '#jqgh_equipGridList_goalGap' ).html ( i18nMessage.msg_gap + homUtil.wrapWord ( prUnitNm, '(', ')' ) );
}

// 접속반 스트링 성능비 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadEquipJqgrid ( $equipGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var eqmtId = $ ( '#junctionboxEqmtId' ).val ();

    $equipGridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            eqmtId : eqmtId
        }
    } ).trigger ( 'reloadGrid' );
}

// 접속반 스트링 성능비 차트 조회
function searchEquipChart ()
{
    var $equipmentGraph1 = $ ( '#equipment_graph1' );
    var $btnAllEquipmentJqgrid = $ ( '#btn_all_equipment_jqgrid' );
    var $btnEquipmentExcel = $ ( '#btn_equipment_excel' );

    var $dateType = $ ( '#dateType' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );
    var $eqmtGrpCd = $ ( '#eqmtGrpCd' );
    var $eqmtId = $ ( '#junctionboxEqmtId' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/effectiveness/selectEquipChartList.ajax',
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
                homUtil.clearHighcharts ( [ $ ( '#equipment_graph1' ).highcharts () ] );

                if ( json.data !== null && json.data.length > 0 )
                {
                    $btnAllEquipmentJqgrid.show ();
                    $btnEquipmentExcel.show ();

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
                                text : i18nMessage.msg_effectiveness + homUtil.wrapWord ( prUnitNm, '(', ')' )
                            }
                        };

                        yAxisArray.push ( prYaxis );

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

                        $equipmentGraph1.highcharts ( {
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
                    } else
                    {
                        setPrRankNoData ( $btnAllEquipmentJqgrid, $btnEquipmentExcel, $equipmentGraph1 );
                    }
                } else
                {
                    setPrRankNoData ( $btnAllEquipmentJqgrid, $btnEquipmentExcel, $equipmentGraph1 );
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

function setPrRankNoData ( $btnAllEquipmentJqgrid, $btnEquipmentExcel, $equipmentGraph1 )
{
    $btnAllEquipmentJqgrid.hide ();
    $btnEquipmentExcel.hide ();

    $equipmentGraph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData
            + '</div>' );
}