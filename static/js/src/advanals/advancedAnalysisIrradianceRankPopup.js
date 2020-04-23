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

// 일사량 jqgrid popup 조회(초기 세팅 및 조회)
function searchRadiationJqgridPopup ()
{
    var $pageType = $ ( '#pageType' );
    var $gridListPop = $ ( '#gridListPop' );
    var tpl = getTemplate ( templates.noData );
    if ( $pageType.val () == staticVariable.pagetypePowerStation )
    {
        searchRdtnPvJqgrid ( $gridListPop, tpl );
    } else
    {
        searchRdtnNationJqgrid ( $gridListPop, tpl );
    }
}
// 일사량 (순위, 일사량, 일사량 비율 등) jqgrid 조회
function searchRdtnPvJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rankPcName' ).val ();

    var noDataId = 'radiation_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/radiation/selectAdvRdtnPvRankList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        },
        colNames : [ i18nMessage.msg_rank, i18nMessage.msg_pvName, i18nMessage.msg_area,
                i18nMessage.msg_targetRadiation, i18nMessage.msg_targetRadiationRate + '(%)',
                i18nMessage.msg_radiation, i18nMessage.msg_radiationRate + '(%)', i18nMessage.msg_gap + '(%)',
                'rdtnUnitNm' ],
        colModel : [
                {
                    name : 'rank',
                    align : 'center',
                    width : '50',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'pvNm',
                    align : 'left',
                    width : '275',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'areaNm',
                    align : 'left',
                    width : '160',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalRdtn',
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
                    name : 'goalRatio',
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
                    name : 'acmsltRdtn',
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
                    name : 'acmsltRatio',
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
                    name : 'diffVal',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                } ],
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
            $ ( '#totalPopupRowCount' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }

            updateJqgridPvHeader ( $gridList, dateType );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 (순위, 일사량, 일사량 비율 등) jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnPvJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rankPcName' ).val ();
    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        }
    } ).trigger ( 'reloadGrid' );
}

// 헤더명 변경
function updateJqgridPvHeader ( $gridList, dateType )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );
    var rdtnUnitNm = rowData.rdtnUnitNm;

    if ( rdtnUnitNm )
    {
        var goalRdtn = i18nMessage.msg_targetRadiation + '<br/>'
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );
        var acmsltRdtn = i18nMessage.msg_radiation + '<br/>'
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );

        $ ( '#gridListPop_goalRdtn' ).next ( 'th' ).html ( goalRdtn );
        $ ( '#gridListPop_acmsltRdtn' ).next ( 'th' ).html ( acmsltRdtn );
    }

    var rank = 1;
    for ( var i = 0; i < ids.length; i++ )
    {
        $gridList.jqGrid ( 'setCell', ids[i], 'rank', rank++ );
    }
}

// 일사량 (순위, 일사량, 일사량 비율 등) jqgrid 조회
function searchRdtnNationJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rankPcName' ).val ();

    var noDataId = 'radiation_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/radiation/selectAdvRdtnNationRankList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 630,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        },
        colNames : [ i18nMessage.msg_rank, i18nMessage.msg_nation, i18nMessage.msg_pvCount,
                i18nMessage.msg_targetRadiation, i18nMessage.msg_targetRadiationRate + '(%)',
                i18nMessage.msg_radiation, i18nMessage.msg_radiationRate + '(%)', i18nMessage.msg_gap + '(%)',
                'rdtnUnitNm' ],
        colModel : [
                {
                    name : 'rank',
                    align : 'center',
                    width : '50',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'nationNm',
                    align : 'left',
                    width : '275',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'pvCnt',
                    align : 'center',
                    width : '160',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalRdtn',
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
                    name : 'goalRatio',
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
                    name : 'acmsltRdtn',
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
                    name : 'acmsltRatio',
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
                    name : 'diffVal',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                } ],
        rownumbers : false,
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
            }

            updateJqgridNationHeader ( $gridList, dateType );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 (순위, 일사량, 일사량 비율 등) jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnNationJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rankPcName' ).val ();
    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        }
    } ).trigger ( 'reloadGrid' );
}

// 헤더명 변경
function updateJqgridNationHeader ( $gridList, dateType )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );
    var rdtnUnitNm = rowData.rdtnUnitNm;

    if ( rdtnUnitNm )
    {
        var goalRdtn = i18nMessage.msg_targetRadiation + '<br/>'
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );
        var acmsltRdtn = i18nMessage.msg_radiation + '<br/>'
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );

        $ ( '#gridListPop_goalRdtn' ).next ( 'th' ).html ( goalRdtn );
        $ ( '#gridListPop_acmsltRdtn' ).next ( 'th' ).html ( acmsltRdtn );
    }

    var rank = 1;
    for ( var i = 0; i < ids.length; i++ )
    {
        $gridList.jqGrid ( 'setCell', ids[i], 'rank', rank++ );
    }
}

$ ( function ()
{
    setPeriodPopupTitle ();
    searchRadiationJqgridPopup ();
} );