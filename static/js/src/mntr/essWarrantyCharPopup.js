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

// 가동률 jqgrid popup 조회(초기 세팅 및 조회)
function searchAvatyJqgridPopup ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    var tpl = getTemplate ( templates.noData );
    var noDataId = 'avaty_jqgridPopup_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    var $gridListPop = $ ( '#gridListPop' );

    // jqgrid
    $gridListPop.jqGrid ( {
        url : contextPath + '/hom/monitoring/ess/efcny/selectChargyGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        loadonce : true,
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate
        },
        colNames : [ dateTypeText, i18nMessage.msg_chargy, i18nMessage.msg_dischargy, i18nMessage.msg_goal,
                     i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt, i18nMessage.msg_goal,
                     i18nMessage.msg_beforeYear ],
        colModel : [
                {
                    name : 'stdrDate',
                    align : 'center',
                    width : '100',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'chargy', // 충전량
                    align : 'right',
                    width : '160',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'dischargy', // 방전량
                    align : 'right',
                    width : '160',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'goalAvaty', // 목표
                    align : 'right',
                    width : '160',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'beforeYearAvaty', // 효율
                    align : 'right',
                    width : '160',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'effect', // 효율
                    align : 'right',
                    width : '160',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'goalGap', // GAP
                    align : 'right',
                    width : '155',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, avatyMntr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'beforeYearGap', // GAP
                    align : 'right',
                    width : '155',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, avatyMntr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                } ],
        sortname : 'stdrDate',
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
            $ ( '#totalPopupRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridAvatyPopupHeader ( $gridListPop );
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

        $gridListPop.parent ().append ( html );
    }

    mergeJqgridAvatyPopupHeader ( $gridListPop );

    $gridListPop.closest ( '.popup_cont' ).find  ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더 병합
function mergeJqgridAvatyPopupHeader ( $gridListPop )
{
    $gridListPop.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'chargy', // 충전량
            numberOfColumns : 2,
            titleText : i18nMessage.msg_charge + ' ' + i18nMessage.msg_word_electric_energy + i18nMessage.msg_kwh
        }, {
            startColumnName : 'goalAvaty', // 목표
            numberOfColumns : 3,
            titleText : i18nMessage.msg_charge + ' ' + i18nMessage.msg_effctiveness + homUtil.wrapWord ( '%', '(', ')' )
        }, {
            startColumnName : 'goalGap', // 목표
            numberOfColumns : 2,
            titleText : i18nMessage.msg_gap + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

// 헤더명 변경
function updateJqgridAvatyPopupHeader ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );

    var avaUnitNm = rowData.avaUnitNm;
    var yieldTmUnitNm = rowData.yieldTmUnitNm;

    // // 헤더 명 변경
    // $ ( '#gridListPop_stdrDate' ).next ( 'th' )
    // .html ( i18nMessage.msg_avaty + homUtil.wrapWord ( avaUnitNm, '(', ')' ) );
    // $ ( '#jqgh_gridListPop_yieldTm' ).html ( i18nMessage.msg_driveTime + homUtil.wrapWord ( yieldTmUnitNm, '(', ')' )
    // );
}

$ ( function ()
{
    setPeriodPopupTitle ();
    searchAvatyJqgridPopup ();
} );