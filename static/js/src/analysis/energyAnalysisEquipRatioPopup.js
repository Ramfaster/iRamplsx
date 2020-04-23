// 조회 조건에 해당하는 타이틀 세팅
function setEquipRatioPopupTitle ()
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

    $ ( '#search_equip_ratio_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 설비별 비율 jqgrid popup 조회(초기 세팅 및 조회)
function searchEquipRatioJqgridPopup ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var junctionboxEqmtId = $ ( '#junctionboxEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'equip_ratio_popup_jqgrid_nodata';

    var tpl = getTemplate ( templates.noData );
    var $equipRatioGridListPop = $ ( '#equipRatioGridListPop' );

    $equipRatioGridListPop.jqGrid ( {
        url : contextPath + '/hom/analysis/energy/selectEquipRatioGridList.ajax',
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
        colNames : [ i18nMessage.msg_rank, i18nMessage.msg_division,
                i18nMessage.msg_facilityCapacity + homUtil.wrapWord ( homConstants.unitDcCapacity, '(', ')' ),
                i18nMessage.msg_facilityCapacityRatio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                i18nMessage.msg_energy,
                i18nMessage.msg_energyRatio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                i18nMessage.msg_energyGap + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ), 'energyUnitNm' ],
        colModel : [
                {
                    name : 'no',
                    align : 'center',
                    width : '70',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'eqmtNm',
                    align : 'left',
                    width : '190',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'eqmtCpcty',
                    align : 'right',
                    width : '200',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'eqmtCpctyRatio',
                    align : 'right',
                    width : '200',
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
                    width : '200',
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
                    width : '200',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'energyGap',
                    align : 'right',
                    width : '190',
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
        rownumbers : false,
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
            $ ( '#totalEquipRatioPopupRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridEquipRatioPopupHeader ( $equipRatioGridListPop );
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

        $equipRatioGridListPop.parent ().append ( html );
    }

    $equipRatioGridListPop.closest ( '.popup_cont' ).find ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 설비 비율 팝업 헤더명 변경
function updateJqgridEquipRatioPopupHeader ( $equipRatioGridListPop )
{
    var ids = $equipRatioGridListPop.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $equipRatioGridListPop.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;

    // 헤더명 변경(발전량 with 단위)
    $equipRatioGridListPop.jqGrid ( 'setLabel', 'energy', i18nMessage.msg_energy
            + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
}

$ ( function ()
{
    setEquipRatioPopupTitle ();
    searchEquipRatioJqgridPopup ();
} );