// 조회 조건에 해당하는 타이틀 세팅 
function setEquipPeriodPopupTitle ()
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

// 기간 내 대표 설비 그리드 팝업
function customizeCodJqGridPopup ()
{
    var noDataId = 'avaAnlsr_equip_grid_nodata_popup';

    popupEquipJqGrid ( noDataId );

    var $popupGridList = $ ( '#popup_grid_list' );
    if ( avaAnalsr.templates.noData !== null )
    {
        var template = _.template ( avaAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $popupGridList.parent ().append ( html );
    }

    addEquipAvaGroupHeader ( $popupGridList );
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function popupEquipJqGrid ( noDataId )
{
    var $popupGridList = $ ( '#popup_grid_list' );

    $popupGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/ava/selectAvatyEquipGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            dateType : $ ( '#dateType' ).val (),
            fromDate : $ ( '#fromDate' ).val (),
            toDate : $ ( '#toDate' ).val (),
            eqmtGrpCd : $ ( '#eqmtGrpCd' ).val ()
        },
        height : 592,
        autowidth : true,
        shrinkToFit : false,
        colNames : [ i18nMessage.msg_increaseDecreaseRanking, i18nMessage.msg_division, i18nMessage.msg_goal,
                i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt, i18nMessage.msg_gap, 'avaUnitNm' ],
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
                    name : 'goalAvaty',
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
                    name : 'beforeYearAvaty',
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
                    name : 'acmsltAvaty',
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
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, avaAnalsr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'avaUnitNm',
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
            $ ( '#avaAnlsr_equip_gridList_RowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridList = $ ( '#avaAnlsr_equip_gridList' );

                var ids = $gridList.jqGrid ( 'getDataIDs' );

                var rowData = $gridList.getRowData ( ids[0] );

                $ ( '#popup_grid_list_goalGap' ).html (
                        i18nMessage.msg_gap + homUtil.wrapWord ( rowData.avaUnitNm, '(', ')' ) );
            }
        }
    } );
}

$ ( function ()
{
    setEquipPeriodPopupTitle ();
    customizeCodJqGridPopup ();
} );