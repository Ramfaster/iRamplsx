// 조회 조건에 해당하는 타이틀 세팅
function setCodPeriodPopupTitle ()
{
    var fromDate = $ ( '#cod' ).val ();
    var toDate = homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD );

    $ ( '#search_cod_period_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// cod 효율 jqgrid popup 조회(초기 세팅 및 조회)
function searchEfficiencyCodJqgridPopup ()
{
    var noDataId = 'cod_popup_jqgrid_nodata';

    var tpl = getTemplate ( templates.noData );
    var $codGridListPopup = $ ( '#codGridListPopup' );

    $codGridListPopup.jqGrid ( {
        url : contextPath + '/hom/analysis/effectiveness/selectCodGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            eqmtGrpCd : $ ( '#codEqmtGrpCd' ).val (),
            eqmtId : $ ( '#codJunctionboxEqmtId' ).val ()
        },
        colNames : [ i18nMessage.msg_years, i18nMessage.msg_division, i18nMessage.msg_shortJanuary,
                i18nMessage.msg_shortFebuary, i18nMessage.msg_shortMarch, i18nMessage.msg_shortApril,
                i18nMessage.msg_shortMay, i18nMessage.msg_shortJune, i18nMessage.msg_shortJuly,
                i18nMessage.msg_shortAugust, i18nMessage.msg_shortSeptember, i18nMessage.msg_shortOctober,
                i18nMessage.msg_shortNovember, i18nMessage.msg_shortDecember ],
        colModel : [ {
            name : 'stdrYear',
            align : 'center',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'eqmtNm',
            align : 'center',
            width : '110',
            fixed : true,
            sortable : false
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
        } ],
        sortname : 'stdrDate',
        sortorder : 'asc',
        rownumbers : false,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        async : false,
        loadonce : false,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalCodRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var ids = $codGridListPopup.jqGrid ( "getDataIDs" );
                var lastRowCl = ids[ids.length - 1];
                var lastRowData = $codGridListPopup.getRowData ( lastRowCl );

                for ( var i = 0, length = ids.length - 1; i < length; i++ )
                {
                    var cl = ids[i];
                    var rowData = $codGridListPopup.getRowData ( cl );

                    // gap setting(1월 ~ 12월, 년평균)
                    rowData.janData = jqgridPercentAbsGapFormatter ( lastRowData.janData, rowData.janData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.febData = jqgridPercentAbsGapFormatter ( lastRowData.febData, rowData.febData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.marData = jqgridPercentAbsGapFormatter ( lastRowData.marData, rowData.marData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.aprData = jqgridPercentAbsGapFormatter ( lastRowData.aprData, rowData.aprData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.mayData = jqgridPercentAbsGapFormatter ( lastRowData.mayData, rowData.mayData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.junData = jqgridPercentAbsGapFormatter ( lastRowData.junData, rowData.junData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.julData = jqgridPercentAbsGapFormatter ( lastRowData.julData, rowData.julData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.augData = jqgridPercentAbsGapFormatter ( lastRowData.augData, rowData.augData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.sepData = jqgridPercentAbsGapFormatter ( lastRowData.sepData, rowData.sepData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.otbData = jqgridPercentAbsGapFormatter ( lastRowData.otbData, rowData.otbData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.novData = jqgridPercentAbsGapFormatter ( lastRowData.novData, rowData.novData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );
                    rowData.dcbData = jqgridPercentAbsGapFormatter ( lastRowData.dcbData, rowData.dcbData,
                            efficiencyAnalysis.pvAcmsltRateList, staticVariable.decimalPoint );

                    $codGridListPopup.jqGrid ( 'setRowData', cl, rowData );
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
                $codGridListPopup.jqGrid ( 'setRowData', lastRowCl, lastRowData );
            }
        },
        gridComplete : function ()
        {
            $ ( this ).rowspan ( 0, 0 );
            colspanLastRow ( $codGridListPopup, 0, 2 );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $codGridListPopup.parent ().append ( html );
    }

    $codGridListPopup.closest ( '.popup_cont' ).find ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

$ ( function ()
{
    setCodPeriodPopupTitle ();
    searchEfficiencyCodJqgridPopup ();
} );