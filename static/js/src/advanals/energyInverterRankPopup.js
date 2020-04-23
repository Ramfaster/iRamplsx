// 조회 조건에 해당하는 타이틀 세팅
function setInverterRankPopupTitle ()
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

    $ ( '#search_inverter_rank_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 기간 내 순위 조회 jqgrid popup 조회(초기 세팅 및 조회)
function searchInverterRankJqgridPopup ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var selectJunctionbox = $ ( '#selectJunctionbox' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'inverter_rank_popup_jqgrid_nodata';

    var tpl = getTemplate ( templates.noData );
    var $inverterRankGridListPop = $ ( '#inverterRankGridListPopup' );

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $inverterRankGridListPop.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/energy/selectInverterRankGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit
        },
        colNames : [ dateTypeText, i18nMessage.msg_division, i18nMessage.msg_sum, i18nMessage.msg_acmslt,
                i18nMessage.msg_ratio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ), 'energyUnitNm' ],
        colModel : [ {
            name : 'formatDate',
            align : 'center',
            width : '240',
            fixed : true,
            sortable : false
        }, {
            name : 'corprNm',
            align : 'left',
            width : '250',
            fixed : true,
            sortable : false
        }, {
            name : 'acmsltTotal',
            align : 'right',
            width : '240',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltVal',
            align : 'right',
            width : '240',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltRatio',
            align : 'right',
            width : '240',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'energyUnitNm',
            hidden : true
        } ],
        sortname : 'pvNm',
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
            $ ( '#totalInverterRankPopupRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridInverterRankPopupHeader ( $inverterRankGridListPop );
            }
        },
        gridComplete : function ()
        {
            $inverterRankGridListPop.rowspan ( 1, 1 );
            $inverterRankGridListPop.rowspan ( 3, 3 );
            $inverterRankGridListPop.rowspan ( 4, 4 );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $inverterRankGridListPop.parent ().append ( html );
    }

    mergeJqgridInverterRankPopupHeader ( $inverterRankGridListPop );

    $inverterRankGridListPop.closest ( '.popup_cont' ).find ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 기간 내 순위 조회 팝업 헤더명 변경
function updateJqgridInverterRankPopupHeader ( $inverterRankGridListPop )
{
    var ids = $inverterRankGridListPop.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $inverterRankGridListPop.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;

    // 헤더명 변경(발전량 with 단위)
    $ ( '#inverterRankGridListPopup_corprNm' ).next ( 'th' ).html (
            i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
}

// 기간 내 순위 조회 헤더 팝업 병합
function mergeJqgridInverterRankPopupHeader ( $inverterRankGridListPop )
{
    $inverterRankGridListPop.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'acmsltTotal',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy
        }, ]
    } );
}

$ ( function ()
{
    setInverterRankPopupTitle ();
    searchInverterRankJqgridPopup ();
} );