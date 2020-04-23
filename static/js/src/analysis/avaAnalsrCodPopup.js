// 기간 내 대표 설비 그리드 팝업
function customizeCodJqGridPopup ()
{
    var noDataId = 'avaAnlsr_cod_grid_nodata_popup';

    popupCodJqGridBasic ( noDataId );

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

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function popupCodJqGridBasic ( noDataId )
{
    var $popupGridList = $ ( '#popup_grid_list' );

    $popupGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/ava/selectAvatyCodGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            cod : $ ( '#cod' ).val ()
        },
        height : 592,
        autowidth : true,
        shrinkToFit : false,
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
        sortname : 'stdrYear',
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

                var $gridList = $ ( '#popup_grid_list' );
                var ids = $gridList.jqGrid ( "getDataIDs" );
                var lastRowCl = ids[ids.length - 1];
                var lastRowData = $gridList.getRowData ( lastRowCl );

                for ( var i = 0, length = ids.length - 1; i < length; i++ )
                {

                    var cl = ids[i];
                    var rowData = $gridList.getRowData ( cl );

                    // gap setting(1월 ~ 12월, 년평균)
                    rowData.janData = jqgridPercentAbsGapFormatter ( lastRowData.janData, rowData.janData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.febData = jqgridPercentAbsGapFormatter ( lastRowData.febData, rowData.febData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.marData = jqgridPercentAbsGapFormatter ( lastRowData.marData, rowData.marData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.aprData = jqgridPercentAbsGapFormatter ( lastRowData.aprData, rowData.aprData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.mayData = jqgridPercentAbsGapFormatter ( lastRowData.mayData, rowData.mayData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.junData = jqgridPercentAbsGapFormatter ( lastRowData.junData, rowData.junData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.julData = jqgridPercentAbsGapFormatter ( lastRowData.julData, rowData.julData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.augData = jqgridPercentAbsGapFormatter ( lastRowData.augData, rowData.augData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.sepData = jqgridPercentAbsGapFormatter ( lastRowData.sepData, rowData.sepData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.otbData = jqgridPercentAbsGapFormatter ( lastRowData.otbData, rowData.otbData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.novData = jqgridPercentAbsGapFormatter ( lastRowData.novData, rowData.novData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.dcbData = jqgridPercentAbsGapFormatter ( lastRowData.dcbData, rowData.dcbData,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.subTotal = jqgridPercentAbsGapFormatter ( lastRowData.subTotal, rowData.subTotal,
                            avaAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );

                    $gridList.jqGrid ( 'setRowData', cl, rowData );
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
                $gridList.jqGrid ( 'setRowData', lastRowCl, lastRowData );
            }
        }
    } );
}

$ ( function ()
{
    customizeCodJqGridPopup ();
} );