// 조회 조건에 해당하는 타이틀 세팅
function setPeriodPopupTitle ()
{
    var dateType = $ ( '#dateType' ).val ();
    var className = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
    }

    var fromDate = $ ( '#' + className + '_from_date' ).val ();
    var toDate = $ ( '#' + className + '_to_date' ).val ();

    $ ( '#search_period_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 설비 별 알람 발생 건/비율 그리드 조회
function searchEqmtJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGradCd = $ ( '#alarmGradCd' ).val ();

    var noDataId = 'alarmsEqmt_jqgrid_nodata';

    $gridList.jqGrid ( {
        url : contextPath + '/hom/analysis/alarmstats/selectEqmtAlarmCountRatioGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        width : 470,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            alarmGradCd : alarmGradCd
        },
        colNames : [ 'eqmtKorNm', 'eqmtEngNm', i18nMessage.msg_division, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
        colModel : [ {
            name : 'eqmtKorNm',
            align : 'center',
            hidden : true
        }, {
            name : 'eqmtEngNm',
            align : 'center',
            hidden : true
        }, {
            name : 'division',
            align : 'left',
            width : '420',
            fixed : true,
            sortable : false
        }, {
            name : 'alarmCount',
            align : 'right',
            width : '400',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return addNumberComma ( cellvalue );
            }
        }, {
            name : 'alarmRatio',
            align : 'right',
            width : '400',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        } ],
        sortname : 'division',
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
            $ ( '#totalRowCount1' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }

            updateJqgridEqmtHeader ( $gridList );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 그리드 데이터 Update
function updateJqgridHeader ( $gridList, keyNm )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var divisionKeyNm = keyNm;

    if ( lang == locale.korea || lang == locale.korean )
    {
        divisionKeyNm = divisionKeyNm + 'KorNm';
    } else
    {
        divisionKeyNm = divisionKeyNm + 'EngNm';
    }

    var alarmTotalCnt = 0;
    for ( var i = 0; i < ids.length; i++ )
    {
        var alarmCount = parseInt ( $gridList.getCell ( ids[i], 'alarmCount' ) );
        if ( alarmCount )
        {
            alarmTotalCnt += alarmCount;
        }
    }

    var no = 1;
    for ( var i = 0; i < ids.length; i++ )
    {
        var division = $gridList.getCell ( ids[i], divisionKeyNm );
        var alarmCount = parseInt ( $gridList.getCell ( ids[i], 'alarmCount' ) );

        if ( !alarmCount )
        {
            alarmCount = 0;
        }

        var ratio = alarmCount / alarmTotalCnt * 100;
        $gridList.jqGrid ( 'setCell', ids[i], 'division', division );
        $gridList.jqGrid ( 'setCell', ids[i], 'alarmRatio', ratio );
    }
}

// 설비 별 알람 발생 건/비율 그리드 데이터 Update
function updateJqgridEqmtHeader ( $gridList )
{
    updateJqgridHeader ( $gridList, 'eqmt' );
}

// 그리드 조회 (초기 세팅 이후 데이터 갱신 조회)
function reloadJqgrid ( $gridList )
{
    $gridList.setGridParam ( {
        postData : $ ( 'form' ).serialize ()
    } ).trigger ( 'reloadGrid' );
}

// 파라미터 별 알람/건 비율 그리드 조회
function searchParamJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGradCd = $ ( '#alarmGradCd' ).val ();

    var noDataId = 'alarmsParam_jqgrid_nodata';

    $gridList.jqGrid ( {
        url : contextPath + '/hom/analysis/alarmstats/selectParameterAlarmCountRatioGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        width : 128,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            alarmGradCd : alarmGradCd
        },
        colNames : [ 'alarmKorNm', 'alarmEngNm', i18nMessage.msg_division, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
        colModel : [ {
            name : 'alarmKorNm',
            align : 'center',
            hidden : true
        }, {
            name : 'alarmEngNm',
            align : 'center',
            hidden : true
        }, {
            name : 'division',
            align : 'left',
            width : '420',
            fixed : true,
            sortable : false
        }, {
            name : 'alarmCount',
            align : 'right',
            width : '400',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return addNumberComma ( cellvalue );
            }
        }, {
            name : 'alarmRatio',
            align : 'right',
            width : '400',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        } ],
        sortname : 'division',
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
            $ ( '#totalRowCount2' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }

            updateJqgridParamHeader ( $gridList );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 파라미터 별 알람 발생 건/비율 그리드 데이터 Update
function updateJqgridParamHeader ( $gridList )
{
    updateJqgridHeader ( $gridList, 'alarm' );
}

// COD jqgrid 조회(초기 세팅 및 조회)
function searchCodJqgrid ( $gridList, tpl )
{
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGrpCd = $ ( '#alarmGrpCd' ).val ();

    var noDataId = 'alarm_jqgrid_nodata';

    $gridList.jqGrid ( { // /hom/analysis/alarmstats
        url : contextPath + '/hom/analysis/alarmstats/selectCodAlarmGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        autowidth : true,
        height : 630,
        shrinkToFit : false,
        postData : {
            eqmtGrpCd : eqmtGrpCd,
            alarmGrpCd : alarmGrpCd
        },
        colNames : [ i18nMessage.msg_division, i18nMessage.msg_shortJanuary, i18nMessage.msg_shortFebuary,
                i18nMessage.msg_shortMarch, i18nMessage.msg_shortApril, i18nMessage.msg_shortMay,
                i18nMessage.msg_shortJune, i18nMessage.msg_shortJuly, i18nMessage.msg_shortAugust,
                i18nMessage.msg_shortSeptember, i18nMessage.msg_shortOctober, i18nMessage.msg_shortNovember,
                i18nMessage.msg_shortDecember, i18nMessage.msg_wordYearTotal ],
        colModel : [ {
            name : 'years',
            align : 'center',
            width : '75',
            fixed : true,
            sortable : false
        }, {
            name : 'january',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'febuary',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'march',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'april',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'may',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'june',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'july',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'august',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'september',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'october',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'november',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'december',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'totalAlarmCount',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        } ],
        sortname : 'years',
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
            $ ( '#totalRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridListPop = $ ( '#gridListPop' );
                var ids = $gridListPop.jqGrid ( "getDataIDs" );
                var lastRowCl = ids[ids.length - 1];
                var lastRowData = $gridListPop.getRowData ( lastRowCl );

                for ( var i = 0, length = ids.length - 1; i < length; i++ )
                {
                    var cl = ids[i];
                    var rowData = $gridListPop.getRowData ( cl );

                    // gap setting(1월 ~ 12월, 년평균)
                    rowData.january = jqgridPercentAbsGapFormatter ( lastRowData.january, rowData.january,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.febuary = jqgridPercentAbsGapFormatter ( lastRowData.febuary, rowData.febuary,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.march = jqgridPercentAbsGapFormatter ( lastRowData.march, rowData.march,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.april = jqgridPercentAbsGapFormatter ( lastRowData.april, rowData.april,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.may = jqgridPercentAbsGapFormatter ( lastRowData.may, rowData.may,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.june = jqgridPercentAbsGapFormatter ( lastRowData.june, rowData.june,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.july = jqgridPercentAbsGapFormatter ( lastRowData.july, rowData.july,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.august = jqgridPercentAbsGapFormatter ( lastRowData.august, rowData.august,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.september = jqgridPercentAbsGapFormatter ( lastRowData.september, rowData.september,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.october = jqgridPercentAbsGapFormatter ( lastRowData.october, rowData.october,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.november = jqgridPercentAbsGapFormatter ( lastRowData.november, rowData.november,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.december = jqgridPercentAbsGapFormatter ( lastRowData.december, rowData.december,
                            alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.totalAlarmCount = jqgridPercentAbsGapFormatter ( lastRowData.totalAlarmCount,
                            rowData.totalAlarmCount, alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );

                    $gridListPop.jqGrid ( 'setRowData', cl, rowData );
                }

                // 월평균 및 년평균의 평균 셋팅
                lastRowData.january = numberFloorComma ( lastRowData.january, staticVariable.decimalPoint );
                lastRowData.febuary = numberFloorComma ( lastRowData.febuary, staticVariable.decimalPoint );
                lastRowData.march = numberFloorComma ( lastRowData.march, staticVariable.decimalPoint );
                lastRowData.april = numberFloorComma ( lastRowData.april, staticVariable.decimalPoint );
                lastRowData.may = numberFloorComma ( lastRowData.may, staticVariable.decimalPoint );
                lastRowData.june = numberFloorComma ( lastRowData.june, staticVariable.decimalPoint );
                lastRowData.july = numberFloorComma ( lastRowData.july, staticVariable.decimalPoint );
                lastRowData.august = numberFloorComma ( lastRowData.august, staticVariable.decimalPoint );
                lastRowData.september = numberFloorComma ( lastRowData.september, staticVariable.decimalPoint );
                lastRowData.october = numberFloorComma ( lastRowData.october, staticVariable.decimalPoint );
                lastRowData.november = numberFloorComma ( lastRowData.november, staticVariable.decimalPoint );
                lastRowData.december = numberFloorComma ( lastRowData.december, staticVariable.decimalPoint );
                lastRowData.totalAlarmCount = numberFloorComma ( lastRowData.totalAlarmCount,
                        staticVariable.decimalPoint );
                $gridListPop.jqGrid ( 'setRowData', lastRowCl, lastRowData );
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

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadCodJqgrid ( $gridList )
{
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGrpCd = $ ( '#alarmGrpCd' ).val ();

    $gridList.setGridParam ( {
        postData : {
            eqmtGrpCd : eqmtGrpCd,
            alarmGrpCd : alarmGrpCd
        }
    } ).trigger ( 'reloadGrid' );
}

// 알람 jqgrid popup 조회(초기 세팅 및 조회)
function searchJqgridPopup ()
{
    var $popType = $ ( '#popType' );
    var $gridListPop = $ ( '#gridListPop' );
    var tpl = getTemplate ( templates.noData );
    if ( $popType.val () == staticVariable.popuptypeEqmt )
    {
        searchEqmtJqgrid ( $gridListPop, tpl );
    } else if ( $popType.val () == staticVariable.popuptypeParamtr )
    {
        searchParamJqgrid ( $gridListPop, tpl );
    } else if ( $popType.val () == staticVariable.popuptypeCod )
    {
        searchCodJqgrid ( $gridListPop, tpl );
    }
}

$ ( function ()
{
    setPeriodPopupTitle ();
    searchJqgridPopup ();
} );