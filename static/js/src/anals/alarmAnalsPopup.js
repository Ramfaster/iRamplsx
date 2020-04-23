var gridBasic = {
    mtype : 'POST',
    datatype : 'json',
    loadonce : true,
    autowidth : true,
    shrinkToFit : false,
    postData : {},
    rowNum : 10,
    multiselect : false,
    multiboxonly : false,
    page : 1,
    scroll : true,
    emptyrecords : i18nMessage.msg_sentenceGridNoData,
    viewrecords : false,
    loadComplete : function ( data )
    {
        var $gqNodata = $ ( '.gq_nodata' );

        if ( data.records === 0 )
        {
            $gqNodata.show ();
        } else
        {
            $gqNodata.hide ();

            $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
        }

        // 조회결과 타이틀
        var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " " + data.records
                + i18nMessage.msg_count;
        $ ( "#totalRowCount" ).text ( resultText );
    }
};

function numberWithCommas ( x )
{
    return x.toString ().replace ( /\B(?=(\d{3})+(?!\d))/g, "," );
}

function customSort ( cell, rowObject )
{
    if ( typeof cell === "string" && /^test(\d)+$/i.test ( cell ) )
    {
        return parseInt ( cell.substring ( 4 ), 10 );
    } else
    {
        return cell;
    }
}

function customFormat ( cellValue, options, rowdata, action )
{
    return numberWithCommas ( parseInt ( cellValue, 10 ) );
}

var grid1Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectAlarmStatisticsGridList.ajax',
    height : 330,
    sortname : "occrrncDt",
    sortorder : "desc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_date, i18nMessage.msg_totalAlarmCount ],
    colModel : [ {
        name : 'occrrncDt',
        index : '',
        align : 'center',
        width : '115',
        sorttype : customSort
    }, {
        name : 'alarmCount',
        index : '',
        align : 'center',
        width : '115',
        sorttype : customSort,
        formatter : customFormat
    } ]
}, gridBasic );

var grid2Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectGroupOfAlarmRateAndCountGridList.ajax',
    height : 255,
    sortname : "alarmRate",
    sortorder : "asc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_assortment, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
    colModel : [ {
        name : 'eachGrpCdNm',
        index : '',
        align : 'center',
        width : '110',
        sorttype : customSort
    }, {
        name : 'alarmCount',
        index : '',
        align : 'center',
        width : '60',
        sorttype : customSort,
        formatter : customFormat
    }, {
        name : 'alarmRate',
        index : '',
        align : 'center',
        width : '60',
        sorttype : customSort
    } ]
}, gridBasic );

var grid3Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectGroupOfAlarmRateAndCountGridList.ajax',
    height : 346,
    sortname : "alarmRate",
    sortorder : "asc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_assortment, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
    colModel : [ {
        name : 'eachGrpCdNm',
        index : '',
        align : 'center',
        width : '140',
        sorttype : customSort
    }, {
        name : 'alarmCount',
        index : '',
        align : 'center',
        width : '120',
        sorttype : customSort,
        formatter : customFormat
    }, {
        name : 'alarmRate',
        index : '',
        align : 'center',
        width : '120',
        sorttype : customSort
    } ]
}, gridBasic );

var grid4Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectParameterOfAlarmRateAndCountGridList.ajax',
    height : 345,
    sortname : "alarmRate",
    sortorder : "asc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_assortment, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
    colModel : [ {
        name : 'tagNm',
        index : '',
        align : 'center',
        width : '100',
        sorttype : customSort
    }, {
        name : 'alarmCount',
        index : '',
        align : 'center',
        width : '60',
        sorttype : customSort,
        formatter : customFormat
    }, {
        name : 'alarmRate',
        index : '',
        align : 'center',
        width : '60',
        sorttype : customSort
    } ]
}, gridBasic );

var grid5Data = _.extend ( {
    url : contextPath + '/hom/analysis/alarm/selectCodAlarmStatisticsGridList.ajax',
    height : 204,
    sortname : "years",
    sortorder : "desc",
    rownumbers : false,
    colNames : [ i18nMessage.msg_years, i18nMessage.msg_january, i18nMessage.msg_febuary, i18nMessage.msg_march,
            i18nMessage.msg_april, i18nMessage.msg_may, i18nMessage.msg_june, i18nMessage.msg_july,
            i18nMessage.msg_august, i18nMessage.msg_september, i18nMessage.msg_october, i18nMessage.msg_november,
            i18nMessage.msg_december, i18nMessage.msg_subtotal ],
    colModel : [ {
        name : 'years',
        index : '',
        align : 'center',
        width : '85',
        sorttype : customSort
    }, {
        name : 'january',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'febuary',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'march',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'april',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'may',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'june',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'july',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'august',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'september',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'october',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'november',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'december',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort
    }, {
        name : 'totalAlarmCount',
        index : '',
        align : 'center',
        width : '90',
        sorttype : customSort,
        formatter : customFormat
    } ],
    gridComplete : function ( data )
    {
        var ids = $ ( '#gridListPop' ).jqGrid ( 'getDataIDs' );
        var rows = $ ( '#gridListPop' ).jqGrid ( 'getRowData' );
        var reverseRows = _.sortBy ( rows, 'years' ).reverse ();
        var monthRangeKeys = _.keys ( reverseRows[0] ).slice ( 1, 13 );

        for ( var i = 0; i < ids.length; i++ )
        {
            var id = ids[i];
            var subtractionArray = [];
            var customDataArray = [];
            var rowValues1 = _.toArray ( reverseRows[i] ).slice ( 1, 13 ).map ( function ( item )
            {
                return parseInt ( item, 10 )
            } );
            var customData;

            if ( i < ids.length - 1 )
            {
                var rowValues2 = _.toArray ( reverseRows[i + 1] ).slice ( 1, 13 ).map ( function ( item )
                {
                    return parseInt ( item, 10 )
                } );

                for ( var j = 0; j < rowValues1.length; j++ )
                {
                    var subtractionValue = rowValues1[j] - rowValues2[j];
                    subtractionArray.push ( subtractionValue );
                }

                for ( var k = 0; k < subtractionArray.length; k++ )
                {
                    if ( subtractionArray[k] > 0 )
                    {
                        customData = numberWithCommas ( rowValues1[k] )
                                + ' <span class="t_org">(<i class="icon_up"></i> ' + subtractionArray[k] + ')</span>';
                    } else if ( subtractionArray[k] < 0 )
                    {
                        customData = numberWithCommas ( rowValues1[k] )
                                + ' <span class="t_blue">(<i class="icon_down"></i> ' + Math.abs ( subtractionArray[k] )
                                + ')</span>';
                    } else
                    {
                        customData = numberWithCommas ( rowValues1[k] ) + ' ( - 0)';
                    }
                    customDataArray.push ( customData );
                }

                $ ( '#gridListPop' ).jqGrid ( 'setRowData', id, _.object ( monthRangeKeys, customDataArray ) );
            } else
            {
                for ( var y = 0; y < rowValues1.length; y++ )
                {
                    customData = numberWithCommas ( rowValues1[y] ) + ' ( - 0)';
                    customDataArray.push ( customData );
                }

                $ ( '#gridListPop' ).jqGrid ( 'setRowData', id, _.object ( monthRangeKeys, customDataArray ) );
            }
        }
    }
}, gridBasic );

function getBasicGridList ( gridData, postData )
{
    var tpl = getTemplate ( templates.noData );

    gridData.postData = _.extend ( {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#hidFromDate' ).val (),
        toDate : $ ( '#hidToDate' ).val ()
    }, postData );

    $ ( '#gridListPop' ).jqGrid ( gridData );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridListPop' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 알람 통계 그리드 목록 조회
function getAlarmStatisticsGridListPopup ()
{
    getBasicGridList ( grid1Data );
}

// 알람 그룹별 비율/건수 그리드 목록 조회
function getGroupOfAlarmRateAndCountGridListPopup ()
{
    getBasicGridList ( grid2Data );
}

// 알람 설비/시스템별 비율/건수 그리드 목록 조회
function getEachGroupOfAlarmRateAndCountGridListPopup ()
{
    var postData = {
        alarmGrpCd : $ ( '#alarmGrpCd' ).val ()
    };
    getBasicGridList ( grid3Data, postData );
}

// 파라미터별 알람 발생 비율/건수
function getParameterOfAlarmRateAndCountGridListPopup ()
{
    var postData = {
        alarmGrpCd : $ ( '#alarmGrpCd' ).val (),
        alarmGradCd : $ ( '#alarmGradCd' ).val ()
    };
    getBasicGridList ( grid4Data, postData );
}

// COD 알람 통계 그리드 목록 조회
function getCodAlarmStatisticsGridListPopup ()
{
    getBasicGridList ( grid5Data );
}

$ ( function ()
{
    var popType = $ ( '#popType' ).val ();

    if ( popType === 'grid1' )
    {
        getAlarmStatisticsGridListPopup ();
    } else if ( popType === 'grid2' )
    {
        getGroupOfAlarmRateAndCountGridListPopup ();
    } else if ( popType === 'grid3' )
    {
        getEachGroupOfAlarmRateAndCountGridListPopup ();
    } else if ( popType === 'grid4' )
    {
        getParameterOfAlarmRateAndCountGridListPopup ();
    } else if ( popType === 'grid5' )
    {
        getCodAlarmStatisticsGridListPopup ();
    }
} );