// 조회 조건에 해당하는 타이틀 세팅
function setEquipPopupTitle ()
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

    $ ( '#search_equip_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 접속반 스트링 성능비 jqgrid popup 조회(초기 세팅 및 조회)
function searchEquipJqgridPopup ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var eqmtId = $ ( '#junEqmtId' ).val ();

    var noDataId = 'equip_popup_jqgrid_nodata';

    var tpl = getTemplate ( templates.noData );
    var $equipGridListPop = $ ( '#equipGridListPop' );

    $equipGridListPop.jqGrid ( {
        url : contextPath + '/hom/analysis/effectiveness/selectEquipGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            eqmtId : eqmtId
        },
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
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalEquipPopupRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridEquipPopupHeader ( $equipGridListPop );
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

        $equipGridListPop.parent ().append ( html );
    }

    mergeJqgridEfficiencyHeader ( $equipGridListPop );

    $equipGridListPop.closest ( '.popup_cont' ).find ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 접속반 스트링 성능비 팝업 헤더명 변경
function updateJqgridEquipPopupHeader ( $equipGridListPop )
{
    var ids = $equipGridListPop.jqGrid ( 'getDataIDs' );
    var rowData = $equipGridListPop.getRowData ( ids[0] );

    var prUnitNm = rowData.prUnitNm;

    // 헤더명 변경
    $ ( '#equipGridListPop_eqmtNm' ).next ( 'th' ).html (
            i18nMessage.msg_effectiveness + homUtil.wrapWord ( prUnitNm, '(', ')' ) );
    $ ( '#jqgh_equipGridListPop_goalGap' ).html ( i18nMessage.msg_gap + homUtil.wrapWord ( prUnitNm, '(', ')' ) );
}

$ ( function ()
{
    setEquipPopupTitle ();
    searchEquipJqgridPopup ();
} );