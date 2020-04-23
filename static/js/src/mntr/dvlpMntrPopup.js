// 조회 조건에 해당하는 타이틀 세팅
function setPeriodPopupTitle ()
{
    var fromDate = $ ( '#yyyymmddhh_from_date' ).val ();
    var toDate = $ ( '#yyyymmddhh_to_date' ).val ();

    $ ( '#search_period_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 발전출력 jqgrid popup 조회(초기 세팅 및 조회)
function searchPowerJqgridPopup ()
{
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    var tpl = getTemplate ( templates.noData );
    var noDataId = 'power_jqgridPopup_nodata';

    var $gridListPop = $ ( '#gridListPop' );

    $gridListPop.jqGrid ( {
        url : contextPath + '/hom/monitoring/energy/selectPowerGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtId,
            isEqmtGrp : isEqmtGrp,
            parntsEqmtId : parntsEqmtId,
            unit : unit
        },
        colNames : [ i18nMessage.msg_date, i18nMessage.msg_power, i18nMessage.msg_inPlaneRdtn,
                i18nMessage.msg_moduleTemperature, i18nMessage.msg_airTemperature, 'powerUnitNm', 'rdtnUnitNm',
                'atmpsUnitNm', 'mtmpsUnitNm' ],
        colModel : [ {
            name : 'stdrDate',
            align : 'center',
            width : '180',
            fixed : true,
            sortable : false
        }, {
            name : 'genePower',
            align : 'right',
            width : '270',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'rdtn',
            align : 'right',
            width : '270',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'temprt',
            align : 'right',
            width : '250',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'mtmps',
            align : 'right',
            width : '250',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'powerUnitNm',
            hidden : true
        }, {
            name : 'rdtnUnitNm',
            hidden : true
        }, {
            name : 'atmpsUnitNm',
            hidden : true
        }, {
            name : 'mtmpsUnitNm',
            hidden : true
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

                updateJqgridPowerPopupHeader ( $gridListPop );
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

// 헤더명 변경
function updateJqgridPowerPopupHeader ( $gridListPop )
{
    var ids = $gridListPop.jqGrid ( "getDataIDs" );
    var cl = ids[0];
    var rowData = $gridListPop.getRowData ( cl );

    var powerUnitNm = rowData.powerUnitNm;
    var rdtnUnitNm = rowData.rdtnUnitNm;
    var atmpsUnitNm = rowData.atmpsUnitNm;
    var mtmpsUnitNm = rowData.mtmpsUnitNm;

    // 헤더 명 변경
    $gridListPop.jqGrid ( 'setLabel', "genePower", i18nMessage.msg_power + homUtil.wrapWord ( powerUnitNm, '(', ')' ) );
    $gridListPop.jqGrid ( 'setLabel', "rdtn", i18nMessage.msg_inPlaneRdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' ) );
    $gridListPop.jqGrid ( 'setLabel', "temprt", i18nMessage.msg_airTemperature
            + homUtil.wrapWord ( atmpsUnitNm, '(', ')' ) );
    $gridListPop.jqGrid ( 'setLabel', "mtmps", i18nMessage.msg_moduleTemperature
            + homUtil.wrapWord ( mtmpsUnitNm, '(', ')' ) );
}

$ ( function ()
{
    setPeriodPopupTitle ();
    searchPowerJqgridPopup ();
} );