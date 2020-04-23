var avatyMntr = null;

// init datetimepicker
function initDatetimepicker ()
{
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() - 1);
	
    var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#start_yyyy' );
    var $endYYYY = $ ( '#end_yyyy' );
    var $yyyyFromDate = $ ( '#yyyy_from_date' );
    var $yyyyToDate = $ ( '#yyyy_to_date' );

    var $yyyymm = $ ( '.yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );
    var $yyyymmToDate = $ ( '#yyyymm_to_date' );

    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );

    // 기간유형 datetimepicker 설정(일/월/년)
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        initialDate : date,
        endDate : date
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        initialDate : date,
        endDate : date
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        setDate : todayDate,
        endDate : todayDate
    } );

    $yyyy.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYY, $endYYYY, $yyyyFromDate, $yyyyToDate );
    } );

    $yyyymm.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMM, $endYYYYMM, $yyyymmFromDate, $yyyymmToDate );
    } );

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );
}

// form element customize
function customizeForm ()
{
    // 조회기간
    var $selectDateType = $ ( '#select_date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    $selectDateType.on ( 'change', function ()
    {
        var selectedDateType = $ ( this ).val ();
        var className = null;

        if ( selectedDateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedDateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectedDateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        $date.addClass ( 'dnone' );
        
        var todayDate = new Date();
    	todayDate.setDate(date.getDate() - 1);

        var localFromTodate = homUtil.getLocalFromToDate ( todayDate, selectedDateType, false, false );
        var $dateBox = $ ( '.' + className );

        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate )
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    $selectDateType.trigger ( 'change' );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(조회 조건, 시작, 종료, 설비 등)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParamaeter ()
{
    var dateType = $ ( '#dateType' ).val ();
    var className = null;
    var dateFormat = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
        dateFormat = homUtil.dateFormat.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
        dateFormat = homUtil.dateFormat.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
        dateFormat = homUtil.dateFormat.formatYYYY;
    }

    var fromDate = homUtil.convertDateStringToFormat ( $ ( '#fromDate' ).val (), dateFormat );
    var toDate = homUtil.convertDateStringToFormat ( $ ( '#toDate' ).val (), dateFormat );

    $ ( '#select_date_type' ).val ( dateType ).trigger ( 'change' );
    $ ( '#' + className + '_from_date' ).val ( fromDate );
    $ ( '#' + className + '_to_date' ).val ( toDate );

}

// 그리드 전체보기 팝업 호출
function initViewAllPopup ()
{
    $ ( '#btn_all_jqgrid' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            beforeOpen : function ()
            {
                setSearchedParamaeter ();
            }
        }
    } );
}

// scroll customize
function customizeTreeScroll ()
{
    // custom scroll
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// 충방전 조회
function searchChargy ()
{
    var $gridList = $ ( '#gridList' );
    var $codMonitoringInfoPeriod = $ ( '#cod_monitoring_info_period' );
    var $searchPeriod = $ ( '#search_period' );

    var tpl = getTemplate ( templates.noData );

    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        var selectDateType = $ ( '#select_date_type' ).val ();
        var className = null;

        if ( selectDateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectDateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectDateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        var fromDate = $ ( '#' + className + '_from_date' ).val ();
        var toDate = $ ( '#' + className + '_to_date' ).val ();
        var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
        var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

        if ( !homUtil.fromToDateValidate ( fromDate, toDate, selectDateType ) )
        {
            return;
        }

        setSearchParameter ( pureFromDate, pureToDate );
        setPeriodTitle ( $codMonitoringInfoPeriod, $searchPeriod, fromDate, toDate );
        selectChargyMonitoringInfo (toDate);
        getAvatyChartList ();

        if ( initFlag )
        {
            searchAvatyJqgrid ( $gridList, tpl );
        } else
        {
            reloadAvatyJqgrid ( $gridList );
        }
    } );
}

// 검색을 위한 파라미터 세팅(시작/종료, 설비아이디, 부모설비아이디, 설비그룹여부)
function setSearchParameter ( pureFromDate, pureToDate )
{
    // 조회 조건, 시작, 종료일자 세팅
    $ ( '#dateType' ).val ( $ ( '#select_date_type' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );

}

// 조회 조건에 해당하는 타이틀 세팅
function setPeriodTitle ( $codMonitoringInfoPeriod, $searchPeriod, fromDate, toDate )
{   
    $searchPeriod.text ( fromDate + ' ~ ' + toDate );
}

// 모니터링 > ESS 충방전 상단 COD - 종료일 정보 조회
function selectChargyMonitoringInfo (toDate)
{
    var params = {
        dateType : $ ( '#dateType' ).val (),
        toDate : $ ( '#toDate' ).val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/monitoring/ess/operation/selectOperationMonitoringInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $ ( '#acmsltChar' )
                        .text ( homUtil.addNumberComma ( json.data.acmsltAvaty, staticVariable.decimalPoint ) );
                $ ( '#cod' ).text ( " " + json.data.fromDate + " ~ " + toDate );

                // $ ( '#acmsltRdtnUnit' ).text ( homUtil.wrapWord ( json.data.acmsltRdtnUnit, '(', ')' ) );

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

// 충방전 차트 조회
function getAvatyChartList ()
{
    var $graph1 = $ ( '#graph1' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/ess/operation/selectOperationChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid.show ();

                    var dateType = $ ( '#dateType' ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;

                    if ( dateType === homConstants.dateTypeYYYYMMDD )
                    {
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === homConstants.dateTypeYYYYMM )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === homConstants.dateTypeYYYY )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    // 기본요금, 충전요금, 부하 이동, 부가가치세, 전력산업기반기금,합계
                    var baseArray = [];
                    var chargyArray = [];
                    var buhaArray = [];
                    var bugaArray = [];
                    var electArray = [];
                    var totalArray = [];

                    $.each ( json.data,
                            function ( index, item )
                            {
                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                baseArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.base, staticVariable.decimalPoint ) ] );
                                chargyArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.chargyrate, staticVariable.decimalPoint ) ] );
                                buhaArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.buha, staticVariable.decimalPoint ) ] );
                                bugaArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.buga, staticVariable.decimalPoint ) ] );
                                electArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.elect, staticVariable.decimalPoint ) ] );
                                totalArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.total, staticVariable.decimalPoint ) ] );
                            } );

                    // 최소값 판단을 통해 min 값 세팅
                    var avaMinArray = [];
                    avaMinArray.push ( _.min ( _.pluck ( baseArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( chargyArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( buhaArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( bugaArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( electArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( totalArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var avaYaxis = {
                        max : 0,
                        title : {
                            text : ''
                        }
                    };
                    var yieldTmYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_amount + homUtil.wrapWord ( i18nMessage.msg_assetWon, '(', ')' )
                        }
                    };

                    if ( _.min ( avaMinArray ) > 0 )
                    {
                        avaYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( baseArray, [ 1 ] ) ) > 0 )
                    {
                        yieldTmYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( chargyArray, [ 1 ] ) ) > 0 )
                    {
                        yieldTmYaxis.min = 0;
                    }
                    yAxisArray.push ( avaYaxis );
                    yAxisArray.push ( yieldTmYaxis );

                    $ ( '#graph1' ).highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type10 ),
                        chart : {
                            marginTop : 50,
                            zoomType : 'x',
                            panning : true,
                            panKey : 'shift'
                        },
                        title : {
                            text : '',
                            style : {
                                display : 'none',
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
                            type : 'datetime',
                            labels : {
                                style : {
                                    color : '#3c3c3c'
                                },
                                formatter : function ()
                                {
                                    var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                                    return dateXAxis;
                                }
                            }
                        },
                        yAxis : yAxisArray,
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                        plotOptions : {
                            column : {
                                pointPadding : 0,
                                borderWidth : 0
                            },
                            line : {
                                marker : {
                                    enabled : false
                                }
                            }
                        },
                        series : [ {
                            type : 'column',
                            yAxis : 1,
                            name : i18nMessage.msg_baserate + i18nMessage.msg_sale,
                            data : baseArray
                        }, {
                            type : 'column',
                            yAxis : 1,
                            name : i18nMessage.msg_chargerate + i18nMessage.msg_sale,
                            data : chargyArray
                        }, {
                            type : 'column',
                            yAxis : 1, // 하이차트 우측 설정
                            name : i18nMessage.msg_loadmove,
                            data : buhaArray
                        }, {
                            type : 'column',
                            yAxis : 1,// 하이차트 우측 설정
                            name : i18nMessage.msg_vat,
                            data : bugaArray
                        }, {
                            type : 'column',
                            yAxis : 1, // 하이차트 우측 설정
                            name : i18nMessage.msg_powerfund,
                            data : electArray
                        } ]
                    } );
                } else
                {
                    $btnExcel.hide ();
                    $btnAllJqgrid.hide ();

                    $graph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>' );
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

// 가동률 jqgrid 조회(초기 세팅 및 조회)
function searchAvatyJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    var noDataId = 'avaty_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/monitoring/ess/operation/selectOperationGridList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 175,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate
                },
                colNames : [
                        dateTypeText,
                        i18nMessage.msg_baserate + ' ' + i18nMessage.msg_sale
                                + homUtil.wrapWord ( i18nMessage.msg_assetWon, '(', ')' ),
                        i18nMessage.msg_chargerate + ' ' + i18nMessage.msg_sale
                                + homUtil.wrapWord ( i18nMessage.msg_assetWon, '(', ')' ),
                        i18nMessage.msg_loadmove + homUtil.wrapWord ( i18nMessage.msg_assetWon, '(', ')' ),
                        i18nMessage.msg_vat + homUtil.wrapWord ( i18nMessage.msg_assetWon, '(', ')' ),
                        i18nMessage.msg_powerfund + homUtil.wrapWord ( i18nMessage.msg_assetWon, '(', ')' ),
                        i18nMessage.msg_assetSum + homUtil.wrapWord ( i18nMessage.msg_assetWon, '(', ')' ) ],
                colModel : [ {
                    name : 'stdrDate',
                    align : 'center',
                    width : '226',
                    fixed : true,
                    sortable : false
                }, {
                    name : 'base', // 기본요금할인
                    align : 'right',
                    width : '219',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'chargyrate', // 충전요금할인
                    align : 'right',
                    width : '219',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'buha', // 부하 이동
                    align : 'right',
                    width : '219',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'buga', // 부가가치세
                    align : 'right',
                    width : '218',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'elect', // 전력기반기금
                    align : 'right',
                    width : '219',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'total', // 합계
                    align : 'right',
                    width : '217',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, staticVariable.decimalPoint );
                    }
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
                    $ ( '#totalRowCount' ).text ( resultText );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        updateJqgridAvatyHeader ( $gridList );
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

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더명 변경
function updateJqgridAvatyHeader ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );

    var avaUnitNm = rowData.avaUnitNm;
    var yieldTmUnitNm = rowData.yieldTmUnitNm;

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더 명 변경
    $gridList.jqGrid ( 'setLabel', 'stdrDate', dateTypeText );
    // $ ( '#gridList_stdrDate' ).next ( 'th' ).html ( i18nMessage.msg_avaty + homUtil.wrapWord ( avaUnitNm, '(', ')' )
    // );
    // $ ( '#jqgh_gridList_yieldTm' ).html ( i18nMessage.msg_driveTime + homUtil.wrapWord ( yieldTmUnitNm, '(', ')' ) );
}

// 가동률 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadAvatyJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate
        }
    } ).trigger ( 'reloadGrid' );
}

// jqgrid reload
function reloadJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();
    var fromStdrYM = $ ( '#hidFromStdrYM' ).val ();
    var toStdrYM = $ ( '#hidToStdrYM' ).val ();
    var beforeYearFromDate = $ ( '#hidBeforeYearFromDate' ).val ();
    var beforeYearToDate = $ ( '#hidBeforeYearToDate' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            fromStdrYM : fromStdrYM,
            toStdrYM : toStdrYM,
            beforeYearFromDate : beforeYearFromDate,
            beforeYearToDate : beforeYearToDate
        }
    } ).trigger ( 'reloadGrid' );
}

// 충방전 엑셀 다운로드
function downloadExcel ()
{
    $ ( '#btn_excel' ).on (
            'click',
            function ()
            {
                var optionsStr = JSON.stringify ( $ ( '#graph1' ).highcharts ().userOptions );
                var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );
                var eqmtNm = '';
                setSearchedParamaeter ();

                $.ajax ( {
                    type : 'POST',
                    data : dataString,
                    url : staticVariable.exportUrl,
                    success : function ( data )
                    {
                        var $excelUrl = $ ( '<input />', {
                            type : 'hidden',
                            id : 'excelUrl',
                            name : 'url',
                            value : staticVariable.exportUrl + data
                        } );

                        var $eqmtNm = $ ( '<input />', {
                            type : 'hidden',
                            id : 'eqmtNm',
                            name : 'eqmtNm',
                            value : eqmtNm
                        } );

                        var menuName = '';
                        $ ( '.lnb' ).find ( 'span' ).each ( function ()
                        {
                            menuName += ($ ( this ).text () + '_');
                        } );

                        menuName += $ ( '.lnb' ).find ( 'strong' ).text ();

                        var $menuName = $ ( '<input />', {
                            type : 'hidden',
                            id : 'menuName',
                            name : 'menuName',
                            value : menuName
                        } );

                        $ ( 'form' ).prepend ( $excelUrl, $eqmtNm, $menuName ).prop ( 'action',
                                contextPath + '/hom/excel/monitoring/ess/operation/download.do' ).submit ();

                        $excelUrl.remove ();
                        $eqmtNm.remove ();
                        $menuName.remove ();
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

            } );
}

// 페이지 로드 완료 시 처리
function initPage ()
{
    avatyMntr = {
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };

    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    initDatetimepicker ();
    customizeForm ();
    initViewAllPopup ();

    searchChargy ();
    downloadExcel ();
    initPage ();

} );