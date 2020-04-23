var chart1, chart2, chart3;
var isKorean = false;
if ( lang == locale.korea || lang == locale.korean )
{
    isKorean = true;
}

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    // 조회기간
    var $dateType = $ ( '#dateType' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    var $selType = $ ( '#eqmtGrpCd' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

// set datetimepicker
function setdatetimepicker ()
{
    var $dateType = $ ( '#dateType' );
    $dateType.change ( function ()
    {
        var $from = $ ( '#fromDate' ), $to = $ ( '#toDate' );
        var options = {
            language : language,
            pickerPosition : "bottom-right",
            autoclose : true,
            todayHighlight : true,
            todayBtn : true
        };

        $from.datetimepicker ( 'remove' );
        $to.datetimepicker ( 'remove' );

        if ( this.value === 'D' )
        {
            options.format = 'yyyy-mm-dd';
            options.startView = 2;
            options.minView = 2;

            $from.val ( homUtil.getIntervalDate ( new Date (), 'DA', -7 ) );
            $to.val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );
        } else if ( this.value === 'M' )
        {
            options.format = 'yyyy-mm';
            options.startView = 3;
            options.minView = 3;

            $from.val ( homUtil.getIntervalDate ( new Date (), 'MO', -12 ) );
            $to.val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMM ) );
        } else if ( this.value === 'Y' )
        {
            options.format = 'yyyy';
            options.startView = 4;
            options.minView = 4;

            $from.val ( homUtil.getIntervalDate ( new Date (), 'YE', -6 ) );
            $to.val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYY ) );
        }

        $from.datetimepicker ( options ).on ( 'changeDate', function ( selected )
        {
            var fromDate = new Date ( selected.date.valueOf () );
            fromDate.setDate ( fromDate.getDate ( new Date ( selected.date.valueOf () ) ) );
            $to.datetimepicker ( 'setStartDate', fromDate );
        } );

        $to.datetimepicker ( options ).on ( 'changeDate', function ( selected )
        {
            var toDate = new Date ( selected.date.valueOf () );
            toDate.setDate ( toDate.getDate ( new Date ( selected.date.valueOf () ) ) );
            $from.datetimepicker ( 'setEndDate', toDate );
        } );

        $from.datetimepicker ( 'setEndDate', $to.val () );
        $to.datetimepicker ( 'setStartDate', $from.val () );

        $from.datetimepicker ().on ( 'changeDate', function ()
        {
            setPeriodTitle ( $from.val (), $to.val () );
        } );
        $to.datetimepicker ().on ( 'changeDate', function ()
        {
            setPeriodTitle ( $from.val (), $to.val () );
        } );

        setPeriodTitle ( $from.val (), $to.val () );
    } );
    $dateType.val ( 'D' );
    $dateType.trigger ( 'change' );
}

var graph1Data = {
    chart : {
        renderTo : 'graph1',
        marginTop : 50
    },
    title : {
        text : '',
        style : {
            display : 'none'
        }
    },
    subtitle : {
        text : '',
        style : {
            display : 'none'
        }
    },
    exporting : {
        enabled : false
    },
    credits : {
        enabled : false
    },
    xAxis : {
        crosshair : true
    },
    yAxis : [ {
        min : 0,
        title : {
            text : i18nMessage.msg_avaty + '(%)'
        }
    }, {
        min : 0,
        opposite : true,
        title : {
            text : i18nMessage.msg_temperature + '(℃)'
        }
    }, {
        min : 0,
        opposite : true,
        title : {
            text : i18nMessage.msg_rdtn + '(kW/m²/d)'
        }
    } ],
    plotOptions : {
        column : {
            pointPadding : 0.1,
            borderWidth : 0
        },
        line : {
            marker : {
                enabled : false
            }
        }
    },
    series : []
};
var graph2Data = {};
var graph3Data = {};
var gridBasic = {
    mtype : 'POST',
    datatype : 'json',
    loadonce : true,
    autowidth : true,
    shrinkToFit : false,
    postData : {},
    rowNum : 10,
    formatter : {
        integer : {
            thousandsSeparator : ",",
            defaultValue : '0'
        }
    },
    multiselect : false,
    multiboxonly : false,
    page : 1,
    scroll : true,
    emptyrecords : i18nMessage.msg_sentenceGridNoData,
    viewrecords : false
};

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
    return homUtil.addNumberComma ( cellValue );
}

var grid1Data = _.extend ( {
    url : contextPath + '/hom/analysis/ava/selectAvaAllStatisticsGridList.ajax',
    height : 179,
    sortname : "statsDt",
    sortorder : "desc",
    rownumbers : true,
    colNames : [ i18nMessage.msg_date, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt,
            i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_rdtn + "(kW/m²)",
            i18nMessage.msg_temperature + "(℃)" ],
    colModel : [ {
        name : 'statsDt',
        index : '',
        align : 'center',
        width : '140',
        sorttype : customSort
    }, {
        name : 'goalAva',
        index : '',
        align : 'center',
        width : '150',
        sorttype : customSort
    }, {
        name : 'lastYearAva',
        index : '',
        align : 'center',
        width : '150',
        sorttype : customSort
    }, {
        name : 'ava',
        index : '',
        align : 'center',
        width : '150',
        sorttype : customSort
    }, {
        name : 'goalGap',
        index : '',
        align : 'center',
        width : '150',
        sorttype : customSort
    }, {
        name : 'lastYearGap',
        index : '',
        align : 'center',
        width : '150',
        sorttype : customSort
    }, {
        name : 'rdtn',
        index : '',
        align : 'center',
        width : '150',
        sorttype : customSort,
        formatter : customFormat
    }, {
        name : 'temprt',
        index : '',
        align : 'center',
        width : '150',
        sorttype : customSort
    } ],
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
        var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
        $ ( "#totalRowCount1" ).text ( resultText );
    }
}, gridBasic );
var grid2Data = _.extend ( {}, gridBasic );
var grid3Data = _.extend ( {}, gridBasic );

// 팝업 보기
function showPopup ()
{
    $ ( '.btn_popup' ).each ( function ()
    {
        $ ( this ).magnificPopup ( {
            type : 'ajax',
            alignTop : false,
            overflowY : 'scroll'
        } )
    } )
}

// 기간 타이틀 설정 ( fromDate : 조회 시작, toDate : 조회 종료)
function setPeriodTitle ( fromDate, toDate )
{
    $ ( '#period' ).html ( fromDate + '~' + toDate );
}

// 가동률 통계 차트 목록 조회(발전소 전체)
function getAvaAllStatisticsChartList ()
{
    $
            .ajax ( {
                url : contextPath + '/hom/analysis/ava/selectAvaAllStatisticsChartList.ajax',
                type : 'POST',
                dataType : 'json',
                data : $ ( "form" ).serialize (),
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        var len = chart1.series.length;
                        for ( var i = len - 1; i > -1; i-- )
                        {
                            chart1.series[i].remove ();
                        }

                        if ( !_.isEmpty ( chart1.options.series ) )
                        {
                            chart1.options.series = [];
                        }

                        var unitObj = {}, dateType = $ ( '#dateType' ).val ();
                        unitObj.D = '(kW/m²/d)';
                        unitObj.M = '(kW/m²/m)';
                        unitObj.Y = '(kW/m²/y)';
                        chart1.yAxis[2].update ( {
                            title : {
                                text : i18nMessage.msg_rdtn + unitObj[dateType]
                            }
                        } );

                        if ( !_.isEmpty ( json.data ) )
                        {
                            var xAxisCate = [], goalData = [], beforeYearData = [], acmsltData = [], temperatureData = [], rdtnData = [];

                            var jsonData = [ {
                                type : 'column',
                                yAxis : 0,
                                color : '#6e7591',
                                name : i18nMessage.msg_goal + ' ' + i18nMessage.msg_avaty,
                                data : []
                            }, {
                                type : 'column',
                                yAxis : 0,
                                color : '#a5a5a8',
                                name : i18nMessage.msg_beforeYear + ' ' + i18nMessage.msg_avaty,
                                data : []
                            }, {
                                type : 'column',
                                yAxis : 0,
                                color : '#ffd183',
                                name : i18nMessage.msg_acmslt + ' ' + i18nMessage.msg_avaty,
                                data : []
                            }, {
                                type : 'line',
                                yAxis : 1,
                                color : '#4bc5c3',
                                name : i18nMessage.msg_temperature,
                                data : []
                            }, {
                                type : 'line',
                                yAxis : 2,
                                color : '#ed6c44',
                                name : i18nMessage.msg_rdtn,
                                data : []
                            } ];

                            $.each ( json.data, function ()
                            {
                                goalData.push ( parseFloat ( this.goalAva ) );
                                beforeYearData.push ( parseFloat ( this.lastYearAva ) );
                                acmsltData.push ( parseFloat ( this.ava ) );
                                temperatureData.push ( parseFloat ( this.temprt ) );
                                rdtnData.push ( parseFloat ( this.rdtn ) );
                                xAxisCate.push ( this.statsDt );
                            } );

                            jsonData[0].data = goalData;
                            jsonData[1].data = beforeYearData;
                            jsonData[2].data = acmsltData;
                            jsonData[3].data = temperatureData;
                            jsonData[4].data = rdtnData;

                            for ( var j = 0; j < jsonData.length; j++ )
                            {
                                chart1.addSeries ( jsonData[j] );
                                chart1.options.series.push ( jsonData[j] );
                            }

                            // 차트 데이터 설정
                            chart1.xAxis[0].setCategories ( xAxisCate );
                        }
                    } else if ( json.status === staticVariable.jsonStatusError )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : json.message,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                    }
                },
                error : function ( xhr, textStatus, error )
                {
                    // abort error not show(user request cancel or aborted)
                    if ( !(xhr.status === 0 || xhr.readyState === 0) )
                    {
                        if ( xhr.status === homConstants.statusUnapproved )
                        {
                            location.href = contextPath + '/login.do?session=true';
                        } else if ( xhr.status === homConstants.statusNoPermission )
                        {
                            location.href = contextPath + '/page/forbidden.do';
                        } else
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_alertServerError,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );
                        }
                    }
                }
            } );
}

// 가동률 통계 차트 목록 조회(구분)
function getAvaAssortmentStatisticsChartList ()
{

}

// 가동률 통계 차트 목록 조회(COD)
function getAvaCodStatisticsChartList ()
{

}

// 가동률 통계 템플릿
function getContentTemplate ( eqmtGrpCd )
{
    var avaAnalsContentTpl;

    if ( eqmtGrpCd == 'all' )
    {
        // 발전소 전체
        avaAnalsContentTpl = getTemplate ( contextPath + '/template/anals/avaAnals/avaAnalsAll.html' );
    } else if ( eqmtGrpCd == 'assortment' )
    {
        // 구분
        avaAnalsContentTpl = getTemplate ( contextPath + '/template/anals/avaAnals/avaAnalsAssortment.html' );
    } else
    {
        // COD
        avaAnalsContentTpl = getTemplate ( contextPath + '/template/anals/avaAnals/avaAnalsCod.html' );
    }

    if ( avaAnalsContentTpl !== null )
    {
        $ ( '#contents' ).empty ();

        var contentTemplate = _.template ( avaAnalsContentTpl );
        var contentHtml = contentTemplate ( getTemplateObject () );

        $ ( '#contents' ).html ( contentHtml );
    }
}

// 템플릿 전달 객체 생성
function getTemplateObject ()
{
    var templateObject = {}, dateType = $ ( '#dateType' ).val ();

    templateObject.fromDate = $ ( '#fromDate' ).val ();
    templateObject.toDate = homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD );

    templateObject.isKorean = isKorean;

    return templateObject;
}

// 검색 기본 설정
function searchBasic ()
{
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val (), retrieveType = $ ( 'input[name=retrieveType]:checked' ).val ();

    if ( eqmtGrpCd == "" && retrieveType == "period" )
    {
        initAllContent ();
    } else if ( eqmtGrpCd != "" && retrieveType == "period" )
    {
        initAssortmentContent ();
    } else
    {
        initCODContent ();
    }
}

// 가동률 통계 조회
function searchAvaStatisticsByClick ()
{
    $ ( '#btnSubmit' ).off ( 'click', searchBasic ).on ( 'click', searchBasic );
}

// 가동률 통계 조회
function searchAvaStatisticsByChange ()
{
    $ ( '#eqmtGrpCd' ).off ( 'change', searchBasic ).on ( 'change', searchBasic );
}

// 조회 기준별 화면
function changePageByRetrieveType ()
{
    $ ( 'input[name=retrieveType]' ).change ( function ()
    {
        if ( this.value === "period" )
        {
            // 기간 조회
            location.href = contextPath + '/hom/analysis/ava/list.do?pageType=period';
        } else
        {
            // COD 기준 조회
            location.href = contextPath + '/hom/analysis/ava/list.do?pageType=cod';
        }
    } );
}

// 각 조회별 화면 뷰
function showPageByRetrieveType ()
{
    var retrieveType = $ ( '#pageType' ).val ();
    $ ( 'input:radio[name=retrieveType]:input[value=' + retrieveType + ']' ).attr ( "checked", true );
    customizeForm ();
    if ( retrieveType === "period" )
    {
        // date settings
        setdatetimepicker ();

        // 기간 조회
        initAllContent ();
    } else
    {
        // COD 기준 조회
        initCODContent ();
    }
}

// jqgrid reload
function reloadGridList ( gridListId )
{
    var $gridBox = $ ( '#gbox_' + gridListId ), gridTo = {
        gridList1 : '.grid_tbl_wrap',
        gridList2 : '',
        gridList3 : ''
    };

    if ( $gridBox.length > 0 )
    {
        $gridBox.remove ();

        if ( gridListId === '' || gridListId === '' )
        {
            $ ( '<table/>' ).attr ( 'id', gridListId ).insertAfter ( gridTo[gridListId] );
        } else if ( gridListId === 'gridList1' || gridListId === '' || gridListId === '' )
        {
            $ ( '<table/>' ).attr ( 'id', gridListId ).appendTo ( gridTo[gridListId] );
        }
    }
}

// 가동률 통계 그리드 목록 조회(발전소 전체)
function getAvaAllStatisticsGridList ()
{
    var tpl = getTemplate ( templates.noData );

    reloadGridList ( 'gridList1' );

    grid1Data.postData = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#fromDate' ).val (),
        toDate : $ ( '#toDate' ).val ()
    };

    $ ( '#gridList1' ).jqGrid ( grid1Data );

    $ ( '#gridList1' ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalAva',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_avaty + '(%)'
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 2,
            titleText : 'GAP(%)'
        } ]
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList1' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 가동률 통계 그리드 목록 조회(구분)
function getAvaAssortmentStatisticsGridList ()
{

}

// 가동률 통계 그리드 목록 조회(COD)
function getAvaCodStatisticsGridList ()
{

}

// 차트 UI 초기화
function initAllChartUI ()
{
    chart1 = new Highcharts.Chart ( graph1Data );
}

// 차트 UI 초기화
function initAssortmentChartUI ()
{
    chart2 = new Highcharts.Chart ( graph2Data );
}

// 차트 UI 초기화
function initCodChartUI ()
{
    chart3 = new Highcharts.Chart ( graph3Data );
}

// 엑셀 다운로드 객체
var excelObj = {
    type : 'image/png',
    async : true,
    exportUrl : 'http://export.highcharts.com/'
};

// 엑셀 다운로드 base
function downloadExcelBasic ( obj )
{
    var exportUrl = obj.exportUrl;
    obj = _.omit ( obj, 'exportUrl' );
    return $.ajax ( {
        type : 'POST',
        data : obj,
        url : exportUrl,
        success : function ( data )
        {
            return exportUrl + data;
        },
        error : function ( xhr, textStatus, error )
        {
            // abort error not show(user request cancel or aborted)
            if ( !(xhr.status === 0 || xhr.readyState === 0) )
            {
                if ( xhr.status === homConstants.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else if ( xhr.status === homConstants.statusNoPermission )
                {
                    location.href = contextPath + '/page/forbidden.do';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        }
    } );
}

// 가동률 통계 엑셀다운로드(발전소 전체)
function downloadExcelAll ()
{
    $ ( '#btnExcel1' ).click ( function ()
    {

    } );
}

// 가동률 통계 엑셀다운로드(구분)
function downloadExcelAssortment ()
{
    $ ( '#btnExcel2' ).click ( function ()
    {

    } );
}

// 가동률 통계 엑셀다운로드(COD)
function downloadExcelCod ()
{
    $ ( '#btnExcel3' ).click ( function ()
    {

    } );
}

function initCommonContent ()
{
    // 검색
    searchAvaStatisticsByClick ();
    searchAvaStatisticsByChange ();

    // 팝업
    showPopup ();

    // 커스텀 DOM
    customizeForm ();
}

function initAllContent ()
{
    // 컨텐츠 템플릿
    $.when ( getContentTemplate ( 'all' ) ).done ( function ()
    {
        if ( $ ( '#period' ).is ( ':empty' ) )
        {
            setPeriodTitle ( $ ( '#fromDate' ).val (), $ ( '#toDate' ).val () );
        }

        // 공통
        initCommonContent ();

        // 차트 UI
        initAllChartUI ();

        // 차트
        getAvaAllStatisticsChartList ();

        // 그리드
        getAvaAllStatisticsGridList ();

        // 엑셀
        downloadExcelAll ();
    } );
}

function initAssortmentContent ()
{
    // 컨텐츠 템플릿
    $.when ( getContentTemplate ( 'assortment' ) ).done ( function ()
    {
        if ( $ ( '#period' ).is ( ':empty' ) )
        {
            setPeriodTitle ( $ ( '#fromDate' ).val (), $ ( '#toDate' ).val () );
        }

        // 공통
        initCommonContent ();

        // 차트 UI
        initAssortmentChartUI ();

        // 차트
        getAvaAssortmentStatisticsChartList ();

        // 그리드
        getAvaAssortmentStatisticsGridList ();

        // 엑셀
        downloadExcelAssortment ();
    } );
}

function initCODContent ()
{
    // 컨텐츠 템플릿
    $.when ( getContentTemplate () ).done ( function ()
    {
        // 공통
        initCommonContent ();

        // 차트 UI
        initCodChartUI ();

        // 차트
        getAvaCodStatisticsChartList ();

        // 그리드
        getAvaCodStatisticsGridList ();

        // 엑셀
        downloadExcelCod ();
    } );
}

$ ( function ()
{
    changePageByRetrieveType ();
    showPageByRetrieveType ();
} );
