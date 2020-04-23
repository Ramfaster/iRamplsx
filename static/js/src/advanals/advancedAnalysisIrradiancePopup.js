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

// 일사량 (합, 실적, 비율) jqgrid 조회(초기 세팅 및 조회)
function searchRdtnPvJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rdtnPcName' ).val ();

    console.log ( '--selectAdvancedRadiationGridList--' );
    console.log ( dateType );
    console.log ( fromDate );
    console.log ( toDate );
    console.log ( unit );
    console.log ( pcName );
    console.log ( '-----------------------------------' );
    var noDataId = 'radiation_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/radiation/selectAdvRdtnPvDailyList.ajax',
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
        colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_area, i18nMessage.msg_sum,
                i18nMessage.msg_acmslt, i18nMessage.msg_rate, 'rdtnUnitNm' ],
        colModel : [ {
            name : 'statsDt',
            align : 'center',
            width : '155',
            fixed : true,
            sortable : false
        }, {
            name : 'pvNm',
            align : 'left',
            width : '335',
            fixed : true,
            sortable : false
        }, {
            name : 'areaNm',
            align : 'left',
            width : '160',
            fixed : true,
            sortable : false
        }, {
            name : 'acmsltTotal',
            align : 'right',
            width : '180',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltVal',
            align : 'right',
            width : '180',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltRatio',
            align : 'right',
            width : '180',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'rdtnUnitNm',
            hidden : true
        } ],
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
            
            console.log('searchRdtnPvJqgrid loadComplete ....');
            
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
        },
        gridComplete : function ()
        {
            console.log ( 'gridComplete' );
            $gridList.rowspan ( 1, 1 );
            $gridList.rowspan ( 3, 3 );
            $gridList.rowspan ( 4, 4 );
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

    mergeJqgridPvHeader ( $gridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnPvJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rdtnPcName' ).val ();

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
        var sumRdtn = i18nMessage.msg_sum + homUtil.wrapWord ( rdtnUnitNm + dateType.toLowerCase (), '(', ')' );
        var acmsltRdtn = i18nMessage.msg_acmslt
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );
        var ratioRdtn = i18nMessage.msg_rate;

        $ ( '#gridListPop_acmsltTotal' ).html ( sumRdtn );
        $ ( '#gridListPop_acmsltVal' ).html ( acmsltRdtn );
        $ ( '#gridListPop_acmsltRatio' ).html ( ratioRdtn );
    }
}

// 헤더 병합
function mergeJqgridPvHeader ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'acmsltTotal',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_radiation
        } ]
    } );
}

// 일사량 (합, 실적, 비율) jqgrid 조회(초기 세팅 및 조회)
function searchRdtnNationJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rdtnPcName' ).val ();

    console.log ( '--selectAdvancedRadiationGridList--' );
    console.log ( dateType );
    console.log ( fromDate );
    console.log ( toDate );
    console.log ( unit );
    console.log ( pcName );
    console.log ( '-----------------------------------' );
    var noDataId = 'radiation_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/radiation/selectAdvRdtnNationDailyList.ajax',
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
        colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_sum, i18nMessage.msg_acmslt,
                i18nMessage.msg_rate, 'rdtnUnitNm' ],
        colModel : [ {
            name : 'statsDt',
            align : 'center',
            width : '165',
            fixed : true,
            sortable : false
        }, {
            name : 'nationNm',
            align : 'left',
            width : '345',
            fixed : true,
            sortable : false
        }, {
            name : 'acmsltTotal',
            align : 'right',
            width : '190',
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
            name : 'rdtnUnitNm',
            hidden : true
        } ],
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
            console.log('searchRdtnNationJqgrid loadComplete ....');
            
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

        },
        gridComplete : function ()
        {
            $gridList.rowspan ( 1, 1 );
            $gridList.rowspan ( 2, 2 );
            $gridList.rowspan ( 3, 3 );
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

    mergeJqgridNationHeader ( $gridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnNationJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rdtnPcName' ).val ();

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


// 헤더 병합
function mergeJqgridNationHeader ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'acmsltTotal',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_radiation
        } ]
    } );
}

$ ( function ()
{
    setPeriodPopupTitle ();
    searchRadiationJqgridPopup ();
} );