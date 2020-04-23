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
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();

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
        url : contextPath + '/hom/monitoring/ava/selectAvatyGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
//        loadonce : true,
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtId,
            isEqmtGrp : isEqmtGrp,
            parntsEqmtId : parntsEqmtId
        },
        colNames : [ dateTypeText, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt,
                i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_systemAvaty, i18nMessage.msg_rdtn,
                i18nMessage.msg_temperature, 'avaUnitNm', 'rdtnUnitNm', 'atmpsUnitNm' ],
        colModel : [
                {
                    name : 'stdrDate',
                    align : 'center',
                    width : '110',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalAvaty',
                    align : 'right',
                    width : '150',
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
                    width : '150',
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
                    width : '150',
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
                    width : '107',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, avatyMntr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearGap',
                    align : 'right',
                    width : '107',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, avatyMntr.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'systemAvaty',
                    align : 'right',
                    width : '140',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtn',
                    align : 'right',
                    width : '140',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'temprt',
                    align : 'right',
                    width : '140',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'avaUnitNm',
                    hidden : true
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                }, {
                    name : 'atmpsUnitNm',
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

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더 병합
function mergeJqgridAvatyPopupHeader ( $gridListPop )
{
    $gridListPop.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalAvaty',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_avaty
        }, {
            startColumnName : 'goalGap',
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
    var rdtnUnitNm = rowData.rdtnUnitNm;
    var atmpsUnitNm = rowData.atmpsUnitNm;

    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
    {
        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
    }

    // 헤더 명 변경
    $ ( '#gridListPop_stdrDate' ).next ( 'th' )
            .html ( i18nMessage.msg_avaty + homUtil.wrapWord ( avaUnitNm, '(', ')' ) );
    $ ( '#jqgh_gridListPop_systemAvaty' )
            .html ( i18nMessage.msg_systemAvaty + homUtil.wrapWord ( avaUnitNm, '(', ')' ) );
    $ ( '#gridListPop_rdtn' ).html ( i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' ) );
    $ ( '#jqgh_gridListPop_temprt' ).html ( i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' ) );
}

$ ( function ()
{
    setPeriodPopupTitle ();
    searchAvatyJqgridPopup ();
} );