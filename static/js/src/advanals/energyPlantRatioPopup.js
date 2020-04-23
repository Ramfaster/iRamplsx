// 조회 조건에 해당하는 타이틀 세팅
function setPlantRatioPopupTitle ()
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

    $ ( '#search_plant_ratio_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 발전소별 발전 비율 jqgrid popup 조회(초기 세팅 및 조회)
function searchPlantRatioJqgridPopup ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var selectJunctionbox = $ ( '#selectJunctionbox' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'plant_ratio_popup_jqgrid_nodata';

    var tpl = getTemplate ( templates.noData );
    var $plantRatioGridListPop = $ ( '#plantRatioGridListPopup' );

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $plantRatioGridListPop.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/energy/selectPlantRatioGridList.ajax',
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
        colNames : [ i18nMessage.msg_rank, i18nMessage.msg_pvName, i18nMessage.msg_area,
                i18nMessage.msg_capacity + homUtil.wrapWord ( homConstants.unitDcCapacity, '(', ')' ),
                i18nMessage.msg_facilityCapacityRatio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                i18nMessage.msg_energy,
                i18nMessage.msg_energyRatio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                i18nMessage.msg_gap + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ), 'energyUnitNm' ],
        colModel : [ {
            name : 'no',
            align : 'center',
            width : '60',
            fixed : true,
            sortable : false
        }, {
            name : 'pvNm',
            align : 'left',
            width : '210',
            fixed : true,
            sortable : false
        }, {
            name : 'areaNm',
            align : 'left',
            width : '100',
            fixed : true,
            sortable : false
        }, {
            name : 'eqmtCpcty',
            align : 'right',
            width : '150',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'eqmtRatio',
            align : 'right',
            width : '150',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltVal',
            align : 'right',
            width : '190',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltRatio',
            align : 'right',
            width : '190',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'diffVal',
            align : 'right',
            width : '190',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject, staticVariable.decimalPoint );
            }
        }, {
            name : 'energyUnitNm',
            hidden : true
        } ],
        sortname : 'pvNm',
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
            $ ( '#totalPlantRatioPopupRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                updateJqgridPlantRatioPopupHeader ( $plantRatioGridListPop );
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

        $plantRatioGridListPop.parent ().append ( html );
    }

    $plantRatioGridListPop.closest ( '.popup_cont' ).find ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 발전소별 발전 비율 팝업 헤더명 변경
function updateJqgridPlantRatioPopupHeader ( $plantRatioGridListPop )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $plantRatioGridListPop.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $plantRatioGridListPop.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더명 변경(일,월,년, 발전량 with 단위)
    $plantRatioGridListPop.jqGrid ( 'setLabel', 'formatDate', dateTypeText );
    $plantRatioGridListPop.jqGrid ( 'setLabel', 'acmsltVal', i18nMessage.msg_energy
            + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
}

$ ( function ()
{
    setPlantRatioPopupTitle ();
    searchPlantRatioJqgridPopup ();
} );