// 조회 조건에 해당하는 타이틀 세팅
function setPeriodPopupTitle ( fromDate, toDate )
{
    $ ( '#search_period_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 일사량 COD jqgrid popup 조회(초기 세팅 및 조회)
function searchRadiationCodStatsJqgridPopup ()
{
    var unit = $ ( '#unit' ).val ();

    var tpl = getTemplate ( templates.noData );
    var noDataId = 'radiation_jqgrid_nodata';

    var $gridListPop = $ ( '#gridListPop' );

    $gridListPop.jqGrid ( {
        url : contextPath + '/hom/analysis/radiation/selectRadiationCodStatsGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            unit : unit
        },
        colNames : [ i18nMessage.msg_division, i18nMessage.msg_january, i18nMessage.msg_febuary, i18nMessage.msg_march,
                i18nMessage.msg_april, i18nMessage.msg_may, i18nMessage.msg_june, i18nMessage.msg_july,
                i18nMessage.msg_august, i18nMessage.msg_september, i18nMessage.msg_october, i18nMessage.msg_november,
                i18nMessage.msg_december, i18nMessage.msg_yearAverage ],
        colModel : [ {
            name : 'stdrYear',
            align : 'center',
            width : '75',
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
        }, {
            name : 'subTotal',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        } ],
        sortname : 'stdrDate',
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
            $ ( '#totalPopupRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var ids = $gridListPop.jqGrid ( "getDataIDs" );
                var lastRowCl = ids[ids.length - 1];
                var lastRowData = $gridListPop.getRowData ( lastRowCl );

                for ( var i = 0, length = ids.length - 1; i < length; i++ )
                {
                    var cl = ids[i];
                    var rowData = $gridListPop.getRowData ( cl );

                    // gap setting(1월 ~ 12월, 년평균)
                    rowData.janData = jqgridValueAbsGapFormatter ( lastRowData.janData, rowData.janData,
                            staticVariable.decimalPoint );
                    rowData.febData = jqgridValueAbsGapFormatter ( lastRowData.febData, rowData.febData,
                            staticVariable.decimalPoint );
                    rowData.marData = jqgridValueAbsGapFormatter ( lastRowData.marData, rowData.marData,
                            staticVariable.decimalPoint );
                    rowData.aprData = jqgridValueAbsGapFormatter ( lastRowData.aprData, rowData.aprData,
                            staticVariable.decimalPoint );
                    rowData.mayData = jqgridValueAbsGapFormatter ( lastRowData.mayData, rowData.mayData,
                            staticVariable.decimalPoint );
                    rowData.junData = jqgridValueAbsGapFormatter ( lastRowData.junData, rowData.junData,
                            staticVariable.decimalPoint );
                    rowData.julData = jqgridValueAbsGapFormatter ( lastRowData.julData, rowData.julData,
                            staticVariable.decimalPoint );
                    rowData.augData = jqgridValueAbsGapFormatter ( lastRowData.augData, rowData.augData,
                            staticVariable.decimalPoint );
                    rowData.sepData = jqgridValueAbsGapFormatter ( lastRowData.sepData, rowData.sepData,
                            staticVariable.decimalPoint );
                    rowData.otbData = jqgridValueAbsGapFormatter ( lastRowData.otbData, rowData.otbData,
                            staticVariable.decimalPoint );
                    rowData.novData = jqgridValueAbsGapFormatter ( lastRowData.otbData, rowData.novData,
                            staticVariable.decimalPoint );
                    rowData.dcbData = jqgridValueAbsGapFormatter ( lastRowData.dcbData, rowData.dcbData,
                            staticVariable.decimalPoint );
                    rowData.subTotal = jqgridValueAbsGapFormatter ( lastRowData.subTotal, rowData.subTotal,
                            staticVariable.decimalPoint );

                    $gridListPop.jqGrid ( 'setRowData', cl, rowData );
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

        $gridListPop.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

$ ( function ()
{
    searchRadiationCodStatsJqgridPopup ();
} );