// 조회 조건에 해당하는 타이틀 세팅
function setEquipRankPopupTitle ()
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

    $ ( '#search_equip_rank_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 기간 내 순위 조회 jqgrid popup 조회(초기 세팅 및 조회)
function searchEquipRankJqgridPopup ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var junctionboxEqmtId = $ ( '#junctionboxEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'equip_rank_popup_jqgrid_nodata';

    var tpl = getTemplate ( templates.noData );
    var $equipRankGridListPop = $ ( '#equipRankGridListPop' );

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $equipRankGridListPop.jqGrid ( {
        url : contextPath + '/hom/analysis/energy/selectEquipRankGridList.ajax',
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
            junctionboxEqmtId : junctionboxEqmtId,
            unit : unit
        },
        colNames : [ dateTypeText, i18nMessage.msg_division, i18nMessage.msg_sum, i18nMessage.msg_acmslt,
                i18nMessage.msg_ratio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ), 'energyUnitNm' ],
        colModel : [
                {
                    name : 'formatDate',
                    align : 'center',
                    width : '230',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'eqmtNm',
                    align : 'left',
                    width : '240',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'energySum',
                    align : 'right',
                    width : '250',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'energy',
                    align : 'right',
                    width : '250',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'energyRatio',
                    align : 'right',
                    width : '250',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, energyAnalysis.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyUnitNm',
                    hidden : true
                } ],
        sortname : 'eqmtNm',
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
            $ ( '#totalEquipRankPopupRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridEquipRankPopupHeader ( $equipRankGridListPop );
            }
        },
        gridComplete : function ()
        {
            $equipRankGridListPop.rowspan ( 1, 1 );
            $equipRankGridListPop.rowspan ( 3, 3 );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $equipRankGridListPop.parent ().append ( html );
    }

    mergeJqgridEquipRankPopupHeader ( $equipRankGridListPop );

    $equipRankGridListPop.closest ( '.popup_cont' ).find ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 기간 내 순위 조회 팝업 헤더명 변경
function updateJqgridEquipRankPopupHeader ( $equipRankGridListPop )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $equipRankGridListPop.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $equipRankGridListPop.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더명 변경(일/월/년, 발전량 with 단위)
    $equipRankGridListPop.jqGrid ( 'setLabel', 'formatDate', dateTypeText );
    $ ( '#equipRankGridListPop_eqmtNm' ).next ( 'th' ).html (
            i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
}

// 기간 내 순위 조회 헤더 팝업 병합
function mergeJqgridEquipRankPopupHeader ( $equipRankGridListPop )
{
    $equipRankGridListPop.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'energySum',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy
        }, ]
    } );
}

$ ( function ()
{
    setEquipRankPopupTitle ();
    searchEquipRankJqgridPopup ();
} );