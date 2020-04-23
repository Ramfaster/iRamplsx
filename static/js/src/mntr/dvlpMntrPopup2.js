// 조회 조건에 해당하는 타이틀 세팅
function setPeriodPopupTitle ()
{
    var dateType = $ ( '#dateType' ).val ();
    var className = null;

    if ( dateType === homConstants.dateTypeYYYYMMDDHH )
    {
        className = staticVariable.formatYYYYMMDDHH;
    } else if ( dateType === homConstants.dateTypeYYYYMMDD )
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

// 발전량 jqgrid popup 조회(초기 세팅 및 조회)
function searchEnergyJqgridPopup ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    var tpl = getTemplate ( templates.noData );
    var noDataId = 'energy_jqgridPopup_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    var $gridListPop = $ ( '#gridListPop' );

    $gridListPop.jqGrid ( {
        url : contextPath + '/hom/monitoring/energy/selectEnergyGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtId,
            isEqmtGrp : isEqmtGrp,
            parntsEqmtId : parntsEqmtId,
            unit : unit
        },
        colNames : [ dateTypeText, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_expected,
                i18nMessage.msg_acmslt, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_expected,
                i18nMessage.msg_averageEnergyYield, i18nMessage.msg_rdtn, i18nMessage.msg_temperature, 'energyUnitNm',
                'rdtnUnitNm', 'avgEnergyYieldUnitNm', 'atmpsUnitNm' ],
        colModel : [
                {
                    name : 'stdrDate',
                    align : 'center',
                    width : '100',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'expectedEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltEnergy',
                    align : 'right',
                    width : '110',
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
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, dvlpMntr2.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearGap',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, dvlpMntr2.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'expectedGap',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, dvlpMntr2.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'avgEnergyYield',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtn',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'temprt',
                    align : 'right',
                    width : '100',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyUnitNm',
                    hidden : true
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                }, {
                    name : 'avgEnergyYieldUnitNm',
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

                updateJqgridEnergyPopupHeader ( $gridListPop );
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

    mergeJqgridEnergyPopupHeader ( $gridListPop );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더 병합
function mergeJqgridEnergyPopupHeader ( $gridListPop )
{
    // 헤더 병합
    $gridListPop.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalEnergy',
            numberOfColumns : 4,
            titleText : i18nMessage.msg_energy
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_gap + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

// 헤더명 변경
function updateJqgridEnergyPopupHeader ( $gridListPop )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridListPop.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridListPop.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;
    var avgEnergyYieldUnitNm = rowData.avgEnergyYieldUnitNm;
    var rdtnUnitNm = rowData.rdtnUnitNm;
    var atmpsUnitNm = rowData.atmpsUnitNm;

    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
    {
        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
    }

    avgEnergyYieldUnitNm = homUtil.wrapWord ( avgEnergyYieldUnitNm, '(', ')' );
    if ( avgEnergyYieldUnitNm !== '' )
    {
        avgEnergyYieldUnitNm = '<br />' + avgEnergyYieldUnitNm;
    }

    rdtnUnitNm = homUtil.wrapWord ( rdtnUnitNm, '(', ')' );
    if ( rdtnUnitNm !== '' )
    {
        rdtnUnitNm = '<br />' + rdtnUnitNm;
    }

    // 헤더명 변경(발전량, 평균발전시간, 일사량, 온도 with 단위)
    $ ( '#gridListPop_stdrDate' ).next ( 'th' ).html (
            i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_gridListPop_avgEnergyYield' ), i18nMessage.msg_averageEnergyYield
            + avgEnergyYieldUnitNm );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_gridListPop_rdtn' ), i18nMessage.msg_rdtn + rdtnUnitNm );
    $ ( '#jqgh_gridListPop_temprt' ).html ( i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' ) );
}

$ ( function ()
{
    setPeriodPopupTitle ();
    searchEnergyJqgridPopup ();
} );