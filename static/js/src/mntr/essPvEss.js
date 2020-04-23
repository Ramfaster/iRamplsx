var avatyMntr = null;

// init datetimepicker
function initDatetimepicker ()
{
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
        todayHighlight : true,
        todayBtn : true,
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
        todayHighlight : true,
        todayBtn : true,
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
        todayHighlight : true,
        todayBtn : true,
        initialDate : date,
        endDate : date
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

        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedDateType, false, false );
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

    // $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        // var selectDateType = $ ( '#select_date_type' ).val ();
        // var className = null;
        //
        // if ( selectDateType === homConstants.dateTypeYYYYMMDD )
        // {
        // className = staticVariable.formatYYYYMMDD;
        // } else if ( selectDateType === homConstants.dateTypeYYYYMM )
        // {
        // className = staticVariable.formatYYYYMM;
        // } else if ( selectDateType === homConstants.dateTypeYYYY )
        // {
        // className = staticVariable.formatYYYY;
        // }
        //
        // var fromDate = $ ( '#' + className + '_from_date' ).val ();
        // var toDate = $ ( '#' + className + '_to_date' ).val ();
        // var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
        // var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );
        //
        // if ( !homUtil.fromToDateValidate ( fromDate, toDate, selectDateType ) )
        // {
        // return;
        // }

        // setSearchParameter ( pureFromDate, pureToDate );
        // setPeriodTitle ( $codMonitoringInfoPeriod, $searchPeriod, fromDate, toDate );
        // selectChargyMonitoringInfo ();
        getAvatyChartList ( 1 );

        // if ( initFlag )
        // {
        // searchAvatyJqgrid ( $gridList, tpl );
        // } else
        // {
        // reloadAvatyJqgrid ( $gridList );
        // }
    }
    // );
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
    $codMonitoringInfoPeriod.text ( i18nMessage.msg_cod + ' ~ ' + i18nMessage.msg_end
            + homUtil.wrapWord ( toDate, '(', ')' ) );
    $searchPeriod.text ( fromDate + ' ~ ' + toDate );
}

// 모니터링 > ESS 충방전 상단 COD - 종료일 정보 조회
function selectChargyMonitoringInfo ()
{
    var params = {
        dateType : $ ( '#dateType' ).val (),
        toDate : $ ( '#toDate' ).val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/monitoring/ava/char/selectChargyMonitoringInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $ ( '#goalChar' ).text ( homUtil.mathFloorComma ( json.data.goalChar, staticVariable.decimalPoint ) );
                $ ( '#acmsltChar' )
                        .text ( homUtil.mathFloorComma ( json.data.acmsltChar, staticVariable.decimalPoint ) );
                $ ( '#cod' ).text ( " " + json.data.fromDate + " ~ " + json.data.toDate );

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
function getAvatyChartList ( type )
{
    var $graph01 = $ ( '#graph01' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/ess/pvess/selectPvEssChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            type : type
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#graph01' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid.show ();

                    var dateType = getStringDataType ( type );
                    var dateFormat = null;
                    var tooltipDateFormat = null;

                    if ( dateType === homConstants.dateTypeYYYYMMDDHH )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYYMMDDHH;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDDHH;
                    } else if ( dateType === homConstants.dateTypeYYYYMMDD )
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
                    var soc_text = getStringDataTypeText ( type );

                    // 충전량, 방전량, 목표 효율, 실적 효율, gap
                    var chargyArray = [];
                    var dischargyArray = [];
                    var powerArray = [];
                    var socArray = [];

                    $.each ( json.data,
                            function ( index, item )
                            {
                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                chargyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.chargy, staticVariable.decimalPoint ) ] );
                                dischargyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.dischargy, staticVariable.decimalPoint ) ] );
                                powerArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.generation, staticVariable.decimalPoint ) ] );
                                socArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.soc, staticVariable.decimalPoint ) ] );
                            } );

                    // 최소값 판단을 통해 min 값 세팅
                    var avaMinArray = [];
                    avaMinArray.push ( _.min ( _.pluck ( chargyArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( dischargyArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( powerArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( socArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var avaYaxis = {
                        max : 600,
                        title : {
                            text : i18nMessage.msg_charrate + i18nMessage.msg_kwh
                        }
                    };
                    var yieldTmYaxis = {
                        max : 0,
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_effctiveness + homUtil.wrapWord ( '%', '(', ')' )
                        }
                    };

                    if ( _.min ( avaMinArray ) > 0 )
                    {
                        avaYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( chargyArray, [ 1 ] ) ) > 0 )
                    {
                        yieldTmYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( dischargyArray, [ 1 ] ) ) > 0 )
                    {
                        yieldTmYaxis.min = 0;
                    }
                    yAxisArray.push ( avaYaxis );
                    yAxisArray.push ( yieldTmYaxis );

                    $ ( '#graph01' ).highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type9 ),
                        chart : {
                            marginTop : 20,
                            height : 313,
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
                            yAxis : 0,
                            name : i18nMessage.msg_chargy,
                            data : chargyArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_dischargy,
                            data : dischargyArray
                        }, {
                            type : 'column',
                            yAxis : 0, // 하이차트 우측 설정
                            name : i18nMessage.msg_energy,
                            data : powerArray
                        }, {
                            type : 'line',
                            yAxis : 0,// 하이차트 우측 설정
                            name : soc_text,
                            data : socArray
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
                                contextPath + '/hom/excel/monitoring/avaty/download.do' ).submit ();

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

function getTotalKpiInfo ()
{
    // //hom/dashboard/siteKpiStatusInfo/siteKpiStatusInfo.do
    var tpl = getTemplate ( templates.siteKpiTotalList );

    var $searchKey = $ ( "input[name=schTypeSel01]:checked" );
    var $searchValue = $ ( '#totalSiteschValue' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/ess/pvess/selectPvEssKpiList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var s = json.data[0].acmsltPr;
                var ss = json.data[0].acmsltAvaty;
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

/*
 * Summary info에
 */
function getPvEssTagCacheInfo ()
{
    // //hom/dashboard/siteKpiStatusInfo/siteKpiStatusInfo.do
    var tpl = getTemplate ( templates.siteKpiTotalList );

    var $searchKey = $ ( "input[name=schTypeSel01]:checked" );
    var $searchValue = $ ( '#totalSiteschValue' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/ess/pvess/selectPvEssCacheList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                console.log ( "TagCacheList json::", json );
                var pcsTagCount = json.data.pcsTagCount;
                console.log ( "PCS TagId Count pcsTagCount::", pcsTagCount );

                var pcsTagIdList = json.data.pcsTagIds;
                console.log ( "PCS TagId List pcsTagIdList::", pcsTagIdList );
                console.log ( "PCS TagId List count::", pcsTagIdList.length );

                // 수전전력값
                var gipVal = json.data.gipVal;
                console.log ( "수전전력값 gipVal::", gipVal );
                // 송전전력값
                var gopVal = json.data.gopVal;
                console.log ( "송전전력값 gopVal::", gopVal );
                // 발전출력값
                var pgpVal = json.data.pgpVal;
                console.log ( "발전출력값 pgpVal::", pgpVal );
                // 충전전력
                var ecpVal = json.data.ecpVal;
                console.log ( "충전전력값 ecpVal::", ecpVal );
                // 방전전력
                var edpVal = json.data.edpVal;
                console.log ( "방전전력 edpVal::", edpVal );
                // 유효전력
                var tvpVal = json.data.tvpVal;
                console.log ( "유효전력 tvpVal::", tvpVal );
                // 유효전력 리스트
                var tvpValList = json.data.tvpValList;
                console.log ( "유효전력 Lis tvpValListt::", tvpValList );
                console.log ( "유효전력 List count::", tvpValList.length );

                // 제어전력
                var capVal = json.data.capVal;
                console.log ( "제어전력::", capVal );
                // 제어전력 리스트
                var capValList = json.data.capValList;
                console.log ( "제어전력 List capVal::", capValList );
                console.log ( "제어전력 List count::", capValList.length );

                // PEBB온도
                var pebbVal = json.data.pebbVal;
                console.log ( "PEBB온도 pebbVal::", pebbVal );

                // PEBB 리스트
                var pebbValList = json.data.pebbValList;
                console.log ( "pebbVal List pebbValList::", pebbValList );
                console.log ( "pebbVal List count::", pebbValList.length );

                // SOC(%)
                var socVal = json.data.socVal;
                console.log ( "SOC(%) socVal::", socVal );

                // SOC 리스트
                var socValList = json.data.socValList;
                console.log ( "SOC List socValList::", socValList );
                console.log ( "SOC List count::", socValList.length );

                // SOH(%)
                var sohVal = json.data.sohVal;
                console.log ( "SOH(%) sohVal::", sohVal );

                // SOH 리스트
                var sohValList = json.data.sohValList;
                console.log ( "SOH List sohValList::", sohValList );
                console.log ( "SOH List count::", sohValList.length );

                // DC전압(V)
                // var gipVal = json.data.gipVal;
                // console.log("DC전압(V)::", gipVal);
                // DC전류(A)
                // var gipVal = json.data.gipVal;
                // console.log("DC전류(A)::", gipVal);
                // 모듈최고온도
                var bmtmpMaxVal = json.data.bmtmpMaxVal;
                console.log ( "모듈최고온도 bmtmpMaxVal::", bmtmpMaxVal );

                // 모듈최고온도 리스트
                var bmtmpMaxValList = json.data.bmtmpMaxValList;
                console.log ( "모듈최고온도 List bmtmpMaxValList::", bmtmpMaxValList );
                console.log ( "모듈최고온도 List count::", bmtmpMaxValList.length );

                // 오프라인랙
                var oflnercVal = json.data.oflnercVal;
                console.log ( "오프라인랙 oflnercVal::", oflnercVal );

                // 오프라인랙 리스트
                var oflnercValList = json.data.oflnercValList;
                console.log ( "오프라인랙 List oflnercValList::", oflnercValList );
                console.log ( "오프라인랙 List count::", oflnercValList.length );

                /*
                 * pcs, bms 장비 상태 관련 정상 : pcsFaultState = 0 AND pcsWarnState = 0 고장 : pcsFaultState = 1 경고 :
                 * pcsFaultState = 0 AND pcsWarnState = 1
                 * 
                 */

                // pcs운전상태
                var pcsRunState = json.data.pcsRunState;
                console.log ( "pcs운전상태 pcsRunState::", pcsRunState );
                console.log ( "pcs운전상태 count::", pcsRunState.length );
                getDriveStatus ( $ ( '#test1' ), pcsRunState[0] );
                // pcs장비상태
                var pcsFaultState = json.data.pcsFaultState;
                console.log ( "pcs장비상태 pcsFaultState::", pcsFaultState );
                console.log ( "pcs장비상태 count::", pcsFaultState.length );
                // pcs장비상태
                var pcsWarnState = json.data.pcsWarnState;
                console.log ( "pcs장비상태 pcsWarnState::", pcsWarnState );
                console.log ( "pcs장비상태 count::", pcsWarnState.length );
                getMachineStatus ( $ ( '#test2' ), pcsFaultState[0], pcsWarnState[0] );
                // pcs충전상태
                var pcsChargeState = json.data.pcsChargeState;
                console.log ( "pcs충전상태 pcsChargeState::", pcsChargeState );
                console.log ( "pcs충전상태 count::", pcsChargeState.length );
                getChargyStatus ( $ ( '#test3' ), pcsChargeState[0] );
                // bms운전상태
                var bmsRunState = json.data.bmsRunState;
                console.log ( "bms운전상태 bmsRunState::", bmsRunState );
                console.log ( "bms운전상태 count::", bmsRunState.length );

                // bms장비상태
                var bmsFaultState = json.data.bmsFaultState;
                console.log ( "bms장비상태 bmsFaultState::", bmsFaultState );
                console.log ( "bms장비상태 count::", bmsFaultState.length );

                // bms장비상태
                var bmsWarnState = json.data.bmsWarnState;
                console.log ( "bms장비상태 bmsWarnState::", bmsWarnState );
                console.log ( "bms장비상태 count::", bmsWarnState.length );

                // bms충전상태
                var bmsChargeState = json.data.bmsChargeState;
                console.log ( "bms충전상태 bmsChargeState::", bmsChargeState );
                console.log ( "bms충전상태 count::", bmsChargeState.length );

                // pcs 용량
                var pcsCpctyList = json.data.pcsCpcyList;
                var pcsCpctyTotal = json.data.pcsCpcyTotal;
                console.log ( "pcs용량 합계 pcsCpctyTotal::", pcsCpctyTotal );
                console.log ( "pcs용량 개수 count::", pcsCpctyList.length );

                // bms 용량
                var bmsCpctyList = json.data.batCpcyList;
                var bmsCpctyTotal = json.data.batCpcyTotal;
                console.log ( "pcs용량 합계 bmsCpctyTotal::", bmsCpctyTotal );
                console.log ( "pcs용량 개수 count::", bmsCpctyList.length );

                // PCS 용량 리스트
                var pcsKoreaNMList = json.data.pcsKoreaNmList;
                var pcsEnglishNMList = json.data.pcsEnglishNmList;
                console.log ( "pcsKoreaNMList ", pcsKoreaNMList );
                console.log ( "pcsEnglishNMList ", pcsEnglishNMList );

                // BAT 용량 리스트
                var bmsKoreaNMList = json.data.batKoreaNmList;
                var bmsEnglishNMList = json.data.batEnglishNmList;
                console.log ( "bmsKoreaNMList ", bmsKoreaNMList );
                console.log ( "bmsEnglishNMList ", bmsEnglishNMList );
                /*
                 * var pcsDetail = array(); for (var i=0; i<pcsTagCount; i++ ) { pcsDetail[i] }
                 */

                // var s = json.data[0].acmsltPr;
                // var ss = json.data[0].acmsltAvaty;
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

function chageRadio ()
{
    document.getElementById ( "radio1" ).get
}

$ ( '#search_option input' ).change ( function ()
{
    var type = $ ( '#search_option input[name="epaSel"]:checked' ).val ();
    getAvatyChartList ( type );
} );

// 페이지 로드 완료 시 처리
function initPage ()
{
    avatyMntr = {
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };

    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

// 더보기 버튼 설정
function setBtnMore ()
{
    var $moreBox = $ ( '.more_detail_box' );
    var $btnMore = $ ( '.btn_more' );
    $btnMore.unbind ( 'click' );
    $btnMore.on ( 'click', function ( e )
    {
        $moreBox.toggleClass ( 'on' );
        if ( $moreBox.hasClass ( 'on' ) )
        {
            var position = $moreBox.outerHeight ( true ) / 2;
            if ( $.isNumeric ( position ) )
            {
                position *= -1;
                $moreBox.css ( 'top', position );
            }

            $moreBox.show ();
        } else
        {
            $moreBox.css ( 'top', 0 );
            $moreBox.hide ();
        }
        // e.preventDefault ();
    } );

    var $btnClose = $ ( '.more_detail_box .btn_close' );
    $btnClose.unbind ( 'click' );
    $btnClose.on ( 'click', function ()
    {
        $moreBox.removeClass ( 'on' );
        $moreBox.hide ();
    } );
}

function getStringDataType ( type )
{
    var value;
    var intType = Number ( type );
    switch ( intType )
    {
        case 1:
            value = "H";
            break;
        case 2:
            value = "D";
            break;
        case 3:
            value = "M";
            break;
        case 4:
            value = "Y";
            break;
        default:
            value = "D";
            break;
    }

    return value;
}

function getStringDataTypeText ( type )
{
    var value;
    var intType = Number ( type );
    switch ( intType )
    {
        case 1:
            value = i18nMessage.msg_soc;
            break;
        case 2:
            value = i18nMessage.msg_soh;
            break;
        case 3:
            value = i18nMessage.msg_soh;
            break;
        case 4:
            value = i18nMessage.msg_soh;
            break;
        default:
            value = i18nMessage.msg_soh;
            break;
    }

    return value;
}

function getDriveStatus ( $getId, type )
{
    var value;
    var intType = Number ( type );
    switch ( intType )
    {
        case 0:
            value = '정지'; // 다국어 추가해야됨
            break;
        case 1:
            value = i18nMessage.msg_clear; // 초기화
            break;
        case 2:
            value = i18nMessage.msg_operation; // 운전
            break;
    }
    $getId.text ( value );
}

function getMachineStatus ( $getId, type, pcsFaultState )
{
    var value;
    var intType = Number ( type );
    var intType1 = Number ( pcsFaultState );
    if ( intType == 1 && intType1 == 1 )
    {
        value = i18nMessage.msg_mntrFault; // 고장
    } else if ( intType == 1 && intType1 == 0 )
    {
        value = i18nMessage.msg_mntrFault; // 고장
    } else if ( intType == 0 && intType1 == 1 )
    {
        value = i18nMessage.msg_mntrEqmtWarning; // 경고
    } else
    {
        value = i18nMessage.msg_mntrNormalOperation; // 정상
    }

    $getId.text ( value );
}

function getChargyStatus ( $getId, type )
{
    var value;
    var intType = Number ( type );
    switch ( intType )
    {
        case 1:
            value = i18nMessage.msg_char_Chargy; // 충전
            break;
        case 2:
            value = i18nMessage.msg_Waiting; // 대기
            break;
        case 3:
            value = i18nMessage.msg_DisCharge; // 방전
            break;
        default:
            value = ''; 
            break;
    }
    $getId.text ( value );
}

$ ( function ()
{
    initDatetimepicker ();
    customizeForm ();
    initViewAllPopup ();
    setBtnMore ();
    searchChargy ();
    // downloadExcel ();
    getTotalKpiInfo ();
    getPvEssTagCacheInfo ();
    initPage ();

} );