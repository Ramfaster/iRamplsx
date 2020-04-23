// 기간 내 설비별 성능비 rank
function customizeRankJqGridPopup ()
{
    var noDataId = 'popup_equip_rank_jqgrid_nodata';

    popupRankJqGridBasic ( noDataId );
    var $popupGridList = $ ( '#popup_grid_list' );
    if ( prAnalsr.templates.noData !== null )
    {
        var template = _.template ( prAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $popupGridList.parent ().append ( html );
    }

    mergeJqgridPopupPrHeader ( $popupGridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function popupRankJqGridBasic ( noDataId )
{
    var $popupGridList = $ ( '#popup_grid_list' );
    $popupGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/pr/prRankList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            dateType : $ ( '#dateType' ).val (),
            fromDate : $ ( '#fromDate' ).val (),
            toDate : $ ( '#toDate' ).val (),
            eqmtGrpCd : $ ( '#eqmtGrpCd' ).val (),
            eqmtId : $ ( '#junEqmtId' ).val ()
        },
        height : 592,
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
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, prAnalsr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
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
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#popup_count' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridList = $ ( '#analsr_rank_grid_list' );
                var ids = $gridList.jqGrid ( 'getDataIDs' );
                var rowData = $gridList.getRowData ( ids[0] );

                // 헤더 갱신
                $ ( '#popup_grid_list_eqmtNm' ).next ( 'th' ).html (
                        i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( rowData.prUnitNm, '(', ')' ) );
                $ ( '#popup_grid_list_goalGap' ).html (
                        i18nMessage.msg_gap + homUtil.wrapWord ( rowData.prUnitNm, '(', ')' ) );
            }
        }
    } );
}

// 헤더 병합
function mergeJqgridPopupPrHeader ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalPr',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_prfomncRatio
        } ]
    } );
}

$ ( function ()
{
    customizeRankJqGridPopup ();
} );