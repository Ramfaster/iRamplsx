var chartImgInfoMap;

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type1' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    // 조회기간
    var $selectDateType = $ ( '#select_date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    var $selType = $ ( '#sel_alarm_type, #sel_eqmt_type, #sel_alarm_grade_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
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

// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
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

    var $yyyymmddhh = $ ( '.yyyymmddhh' );
    var $startYYYYMMDDHH = $ ( '#start_yyyymmddhh' );
    var $endYYYYMMDDHH = $ ( '#end_yyyymmddhh' );
    var $yyyymmddhhFromDate = $ ( '#yyyymmddhh_from_date' );
    var $yyyymmddhhToDate = $ ( '#yyyymmddhh_to_date' );

    var $yyyymmddhhmi = $ ( '.yyyymmddhhmi' );
    var $startYYYYMMDDHHMI = $ ( '#start_yyyymmddhhmi' );
    var $endYYYYMMDDHHMI = $ ( '#end_yyyymmddhhmi' );
    var $yyyymmddhhmiFromDate = $ ( '#yyyymmddhhmi_from_date' );
    var $yyyymmddhhmiToDate = $ ( '#yyyymmddhhmi_to_date' );

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
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
        pickerPosition : "bottom-right",
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
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        initialDate : date,
        endDate : date
    } );

    $yyyymmddhh.datetimepicker ( {
        format : 'yyyy-mm-dd hh:00',
        startView : 2,
        minView : 1,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        initialDate : date,
        endDate : date
    } );

    $yyyymmddhhmi.datetimepicker ( {
        format : 'yyyy-mm-dd hh:ii',
        startView : 2,
        minView : 0,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        minuteStep : 2,
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

    $yyyymmddhh.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDDHH, $endYYYYMMDDHH, $yyyymmddhhFromDate, $yyyymmddhhToDate );
    } );

    $yyyymmddhhmi.datetimepicker ().on (
            'changeDate',
            function ( event )
            {
                homUtil.setStartEndDatetimepicker ( $startYYYYMMDDHHMI, $endYYYYMMDDHHMI, $yyyymmddhhmiFromDate,
                        $yyyymmddhhmiToDate );
            } );
}

function initViewAllPopup ()
{

    var $btnAllJqgrid1 = $ ( '#btn_all_jqgrid1' );
    var $btnAllJqgrid2 = $ ( '#btn_all_jqgrid2' );

    $btnAllJqgrid1.magnificPopup ( {
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

    $btnAllJqgrid2.magnificPopup ( {
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

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(조회 조건, 시작, 종료 등)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
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

// 차트 및 그리드 카운트 초기화
function initData ()
{
    var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' 0' + i18nMessage.msg_count;
    $ ( '#totalRowCount1' ).text ( resultText );
    $ ( '#totalRowCount2' ).text ( resultText );
    resultText = '0' + i18nMessage.msg_count;
    $ ( '#eqmtTotalOccurCount' ).html ( '0' );
    $ ( '#faultAlarmCount' ).html ( resultText );
    $ ( '#gradeTotalOccurCount' ).html ( resultText );
    $ ( '#disconnectCount' ).html ( '0' );
    $ ( '#disconnectRatio' ).html ( '0' );
    $ ( '#faultOccurCount' ).html ( '0' );
    $ ( '#faultOccurRatio' ).html ( '0' );
    $ ( '#warningCount' ).html ( '0' );
    $ ( '#warningRatio' ).html ( '0' );
    $ ( '#noticeCount' ).html ( '0' );
    $ ( '#noticeRatio' ).html ( '0' );
}

// 알람 조회
function searchAlarm ()
{
    var $searchPeriod = $ ( '#search_period' );

    // Grid 및 Chart의 수치 초기화
    initData ();

    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        var retrieveTypeValue = $ ( ':radio[name=retrieveType]:checked' ).val ();
        var sel_alarm_type = $ ( '#sel_alarm_type option:selected' ).val ();

        $ ( '#alarmGrpCd' ).val ( sel_alarm_type );

        if ( retrieveTypeValue == staticVariable.pagetypeCod )
        {
            var url = contextPath + '/hom/analysis/alarmstats/list.do';
            var param = '?pageType=' + staticVariable.pagetypeCod;

            location.href = url + param;
        } else
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

            // 알람 차트 조회
            searchEqmtChart ();

            // 알람 등급 별 발생 건수 차트 조회
            searchGradChart ();

            // 파라미터 별 발생 건수 차트 조회
            searchParamChart ( initFlag );

            var $gridList1 = $ ( '#gridList1' );
            var tpl = getTemplate ( templates.noData );

            // 알람 Grid 조회
            if ( initFlag )
            {
                searchEqmtJqgrid ( $gridList1, tpl );
            } else
            {
                reloadJqgrid ( $gridList1 );
            }

        }
    } );

    // 설비구분 Combobox Change Event
    var $eqmtGrpCd = $ ( '#sel_eqmt_type' );
    $eqmtGrpCd.on ( 'change', function ()
    {
        $ ( '#eqmtGrpCd' ).val ( $ ( this ).val () );
        searchGradChart ();
    } );

    // 알람등급 Combobox Change Event
    var $alarmGradCd = $ ( '#sel_alarm_grade_type' );
    $alarmGradCd.on ( 'change', function ()
    {
        $ ( '#alarmGradCd' ).val ( $ ( this ).val () );

        setParameterAlarmTitle ();

        searchParamChart ();

    } );
}

// Parameter 셋팅
function setSearchParameter ( pureFromDate, pureToDate )
{
    // 조회 조건, 시작, 종료일자 세팅
    $ ( '#dateType' ).val ( $ ( '#select_date_type' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );

    setPeriodTitle ();
}

// 조회 조건에 해당하는 타이틀 세팅
function setPeriodTitle ()
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

    $ ( '#search_period' ).text ( fromDate + ' ~ ' + toDate );
}

// 설비 별 알람 발생 건/비율 차트 조회
function searchEqmtChart ()
{
    var $right_cont03 = $ ( '.right_cont03' );
    var $graph1 = $ ( '#graph1' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid1' );

    $
            .ajax ( {
                url : contextPath + '/hom/analysis/alarmstats/selectEqmtAlarmCountRatioList.ajax',
                type : 'POST',
                dataType : 'json',
                data : $ ( 'form' ).serialize (),
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        // 기존 차트 삭제
                        homUtil.clearHighcharts ( [ $graph1.highcharts () ] );
                        $right_cont03.show ();
                        if ( json.data.length > 0 )
                        {
                            var seriesArray = [];
                            var totalCount = 0;
                            $.each ( json.data, function ( index, item )
                            {
                                var alarmGradNm = getI18nItemNm ( item, 'eqmt' );

                                var alarmGradSeris = {
                                    name : alarmGradNm,
                                    y : homUtil.mathFloor ( item.alarmCount, staticVariable.decimalPoint )
                                };
                                seriesArray.push ( alarmGradSeris );
                                totalCount += item.alarmCount;
                            } );

                            $ ( '#eqmtTotalOccurCount' ).html (
                                    homUtil.addNumberComma ( totalCount ) + i18nMessage.msg_count );

                            $graph1.highcharts ( {
                                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                                chart : {
                                    plotBackgroundColor : null,
                                    plotBorderWidth : null,
                                    plotShadow : false,
                                    type : 'pie',
                                    height : 220
                                },
                                legend : {
                                    align : 'right',
                                    verticalAlign : 'middle',
                                    layout : 'vertical',
                                    x : 0,
                                    y : 0,
                                    itemWidth : 100
                                },
                                credits : {
                                    enabled : false
                                },
                                title : {
                                    text : '',
                                    style : {
                                        display : 'none'
                                    }
                                },
                                plotOptions : {
                                    pie : {
                                        center : [ "34%", "50%" ],
                                        shadow : false,
                                        size : '100%',
                                        innerSize : '40%',
                                        dataLabels : {
                                            enabled : false
                                        },
                                        showInLegend : true
                                    }
                                },
                                series : [ {
                                    name : i18nMessage.msg_num,
                                    colorByPoint : true,
                                    data : seriesArray
                                } ]
                            } );
                        } else
                        {
                            $ ( '#eqmtTotalOccurCount' ).empty ();
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

// 알람 등급 별 알람 건수 차트 조회
function searchGradChart ()
{
    var $graph2 = $ ( '#graph2' );
    var $btnExcel = $ ( '#btn_excel' );
    $
            .ajax ( {
                url : contextPath + '/hom/analysis/alarmstats/selectGradAlarmCountRatioList.ajax',
                type : 'POST',
                dataType : 'json',
                data : $ ( 'form' ).serialize (),
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        // 기존 차트 삭제
                        homUtil.clearHighcharts ( [ $graph2.highcharts () ] );

                        if ( json.data.length > 0 )
                        {
                            var seriesArray = [];
                            var totalCount = 0;
                            var disconnectCnt = 0;
                            var faultCnt = 0;
                            var warningCnt = 0;
                            var noticeCnt = 0;
                            $.each ( json.data, function ( index, item )
                            {
                                var eqmtNm = getI18nItemNm ( item, 'alarmGrad' );

                                var grade = item.alarmGradKorNm.toLowerCase ();
                                var seriesColor;
                                switch ( grade )
                                {
                                    case 'disconnect':
                                        seriesColor = '#6c7176';
                                        disconnectCnt = item.alarmCount;
                                        break;
                                    case 'fault':
                                        seriesColor = '#c03014';
                                        faultCnt = item.alarmCount;
                                        break;
                                    case 'warning':
                                        seriesColor = '#fc5d2a';
                                        warningCnt = item.alarmCount;
                                        break;
                                    case 'notice':
                                        seriesColor = '#1ea869';
                                        noticeCnt = item.alarmCount;
                                        break;
                                }

                                var eqmtAlarmSeris = {
                                    name : eqmtNm,
                                    color : seriesColor,
                                    y : homUtil.mathFloor ( item.alarmCount, staticVariable.decimalPoint )
                                };
                                seriesArray.push ( eqmtAlarmSeris );
                                totalCount += item.alarmCount;
                            } );

                            $ ( '#disconnectCount' ).html ( disconnectCnt );
                            $ ( '#disconnectRatio' )
                                    .html ( homUtil.mathFloor ( (disconnectCnt / totalCount * 100), 1 ) );

                            $ ( '#faultOccurCount' ).html ( faultCnt );
                            $ ( '#faultOccurRatio' ).html ( homUtil.mathFloor ( (faultCnt / totalCount * 100), 1 ) );

                            $ ( '#warningCount' ).html ( warningCnt );
                            $ ( '#warningRatio' ).html ( homUtil.mathFloor ( (warningCnt / totalCount * 100), 1 ) );

                            $ ( '#noticeCount' ).html ( noticeCnt );
                            $ ( '#noticeRatio' ).html ( homUtil.mathFloor ( (noticeCnt / totalCount * 100), 1 ) );

                            $ ( '#gradeTotalOccurCount' ).html (
                                    homUtil.addNumberComma ( totalCount ) + i18nMessage.msg_count );

                            $graph2.highcharts ( {
                                chart : {
                                    plotBackgroundColor : null,
                                    plotBorderWidth : null,
                                    plotShadow : false,
                                    type : 'pie',
                                    height : 239
                                },
                                legend : {
                                    align : 'right',
                                    verticalAlign : 'middle',
                                    layout : 'vertical',
                                    x : 0,
                                    y : 0,
                                    itemWidth : 100
                                },
                                credits : {
                                    enabled : false
                                },
                                title : {
                                    text : '',
                                    style : {
                                        display : 'none'
                                    }
                                },
                                plotOptions : {
                                    pie : {
                                        center : [ "50%", "50%" ],
                                        shadow : false,
                                        size : '100%',
                                        innerSize : '40%',
                                        dataLabels : {
                                            enabled : false
                                        },
                                        showInLegend : true
                                    }
                                },
                                series : [ {
                                    name : i18nMessage.msg_num,
                                    colorByPoint : true,
                                    data : seriesArray
                                } ]
                            } );
                        } else
                        {
                            var count = 0;
                            var ratioCnt = 0.0;

                            $ ( '#disconnectCount' ).html ( count );
                            $ ( '#disconnectRatio' ).html ( ratioCnt );

                            $ ( '#faultOccurCount' ).html ( count );
                            $ ( '#faultOccurRatio' ).html ( ratioCnt );

                            $ ( '#warningCount' ).html ( count );
                            $ ( '#warningRatio' ).html ( ratioCnt );

                            $ ( '#noticeCount' ).html ( count );
                            $ ( '#noticeRatio' ).html ( ratioCnt );

                            $ ( '#gradeTotalOccurCount' ).html ( count + i18nMessage.msg_count );

                            $graph2.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

function setParameterAlarmTitle ()
{
    var $alarmGradCd = $ ( '#sel_alarm_grade_type' );
    var classNm = '<i class="icon_blt02"></i>';
    var name = $ ( "#sel_alarm_grade_type option:selected" ).text ().trim ();
    $ ( '#prametrAlarmCnt' ).html ( classNm + name + ' ' + i18nMessage.msg_alarm );
}

// 파라미터 별 알람/건 비율 차트 조회
function searchParamChart ( initFlag )
{
    setParameterAlarmTitle ();

    var $gridList2 = $ ( '#gridList2' );
    var tpl = getTemplate ( templates.noData );

    // 알람 Grid 조회
    if ( initFlag )
    {
        searchParamJqgrid ( $gridList2, tpl );
    } else
    {
        reloadJqgrid ( $gridList2 );
    }

    var $graph3 = $ ( '#graph3' );
    var $btnExcel = $ ( '#btn_excel' );
    $.ajax ( {
        url : contextPath + '/hom/analysis/alarmstats/selectParameterAlarmCountRatioList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $graph3.highcharts () ] );

                if ( json.data.length > 0 )
                {
                    var seriesArray = [];
                    var totalCount = 0;
                    $.each ( json.data, function ( index, item )
                    {
                        var alarmNm = getI18nItemNm ( item, 'alarm' );

                        var alarmSeris = {
                            name : alarmNm,
                            y : homUtil.mathFloor ( item.alarmCount, staticVariable.decimalPoint )
                        };
                        seriesArray.push ( alarmSeris );
                        totalCount += item.alarmCount;
                    } );

                    $ ( '#alarmCnt' ).html ( homUtil.addNumberComma ( totalCount ) + i18nMessage.msg_count );

                    $graph3.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                        chart : {
                            plotBackgroundColor : null,
                            plotBorderWidth : null,
                            plotShadow : false,
                            type : 'pie',
                            height : 226
                        },
                        legend : {
                            align : 'right',
                            verticalAlign : 'middle',
                            layout : 'vertical',
                            x : 0,
                            y : 0,
                            itemWidth : 100
                        },
                        credits : {
                            enabled : false
                        },
                        title : {
                            text : '',
                            style : {
                                display : 'none'
                            }
                        },
                        plotOptions : {
                            pie : {
                                center : [ "34%", "50%" ],
                                shadow : false,
                                size : '100%',
                                innerSize : '40%',
                                dataLabels : {
                                    enabled : false
                                },
                                showInLegend : true
                            }
                        },
                        series : [ {
                            name : i18nMessage.msg_num,
                            colorByPoint : true,
                            data : seriesArray
                        } ]
                    } );
                } else
                {
                    $ ( '#faultAlarmCount' ).html ( '0' + i18nMessage.msg_count );

                    $graph3.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>' );
                    $ ( '#prametrAlarmCnt' ).empty ();
                    $ ( '#alarmCnt' ).empty ();
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

// 설비 별 알람 발생 건/비율 그리드 조회
function searchEqmtJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGradCd = $ ( '#alarmGradCd' ).val ();
    var alarmGrpCd = $ ( '#alarmGrpCd' ).val ();

    var noDataId = 'alarmsEqmt_jqgrid_nodata';

    $gridList.jqGrid ( {
        url : contextPath + '/hom/analysis/alarmstats/selectEqmtAlarmCountRatioGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 361,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            alarmGradCd : alarmGradCd,
            alarmGrpCd : alarmGrpCd
        },
        colNames : [ 'eqmtKorNm', 'eqmtEngNm', i18nMessage.msg_division, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
        colModel : [ {
            name : 'eqmtKorNm',
            align : 'center',
            hidden : true
        }, {
            name : 'eqmtEngNm',
            align : 'center',
            hidden : true
        }, {
            name : 'division',
            align : 'left',
            width : '141',
            fixed : true,
            sortable : false
        }, {
            name : 'alarmCount',
            align : 'right',
            width : '128',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return addNumberComma ( cellvalue );
            }
        }, {
            name : 'alarmRatio',
            align : 'right',
            width : '128',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        } ],
        sortname : 'division',
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
            $ ( '#totalRowCount1' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }

            updateJqgridEqmtHeader ( $gridList );
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

// 그리드 데이터 Update
function updateJqgridHeader ( $gridList, keyNm )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var divisionKeyNm = keyNm;

    if ( lang == locale.korea || lang == locale.korean )
    {
        divisionKeyNm = divisionKeyNm + 'KorNm';
    } else
    {
        divisionKeyNm = divisionKeyNm + 'EngNm';
    }

    var alarmTotalCnt = 0;
    for ( var i = 0; i < ids.length; i++ )
    {
        var alarmCount = parseInt ( $gridList.getCell ( ids[i], 'alarmCount' ) );
        if ( alarmCount )
        {
            alarmTotalCnt += alarmCount;
        }
    }

    var no = 1;
    for ( var i = 0; i < ids.length; i++ )
    {
        var division = $gridList.getCell ( ids[i], divisionKeyNm );
        var alarmCount = parseInt ( $gridList.getCell ( ids[i], 'alarmCount' ) );

        if ( !alarmCount )
        {
            alarmCount = 0;
        }

        var ratio = alarmCount / alarmTotalCnt * 100;
        $gridList.jqGrid ( 'setCell', ids[i], 'division', division );
        $gridList.jqGrid ( 'setCell', ids[i], 'alarmRatio', ratio );
    }
}

// 설비 별 알람 발생 건/비율 그리드 데이터 Update
function updateJqgridEqmtHeader ( $gridList )
{
    updateJqgridHeader ( $gridList, 'eqmt' );
}

// 그리드 조회 (초기 세팅 이후 데이터 갱신 조회)
function reloadJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGradCd = $ ( '#alarmGradCd' ).val ();
    var alarmGrpCd = $ ( '#alarmGrpCd' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            alarmGradCd : alarmGradCd,
            alarmGrpCd : alarmGrpCd
        }
    } ).trigger ( 'reloadGrid' );
}

// 파라미터 별 알람/건 비율 그리드 조회
function searchParamJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGradCd = $ ( '#alarmGradCd' ).val ();
    var alarmGrpCd = $ ( '#alarmGrpCd' ).val ();

    var noDataId = 'alarmsParam_jqgrid_nodata';

    $gridList.jqGrid ( {
        url : contextPath + '/hom/analysis/alarmstats/selectParameterAlarmCountRatioGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 361,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtGrpCd : eqmtGrpCd,
            alarmGradCd : alarmGradCd,
            alarmGrpCd : alarmGrpCd
        },
        colNames : [ 'alarmKorNm', 'alarmEngNm', i18nMessage.msg_division, i18nMessage.msg_cnt, i18nMessage.msg_rate ],
        colModel : [ {
            name : 'alarmKorNm',
            align : 'center',
            hidden : true
        }, {
            name : 'alarmEngNm',
            align : 'center',
            hidden : true
        }, {
            name : 'division',
            align : 'left',
            width : '100',
            fixed : true,
            sortable : false
        }, {
            name : 'alarmCount',
            align : 'right',
            width : '60',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return addNumberComma ( cellvalue );
            }
        }, {
            name : 'alarmRatio',
            align : 'right',
            width : '60',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        } ],
        sortname : 'division',
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
            $ ( '#totalRowCount2' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }

            updateJqgridParamHeader ( $gridList );
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

// 파라미터 별 알람 발생 건/비율 그리드 데이터 Update
function updateJqgridParamHeader ( $gridList )
{
    updateJqgridHeader ( $gridList, 'alarm' );
}

// i18n 아이템 명 parsing
function getI18nItemNm ( item, key )
{
    // Ex : pvKorNm, nationKorNm, eqmtKorNm
    var korKey = cf_stringFormat ( "{0}KorNm", key );
    var engKey = cf_stringFormat ( "{0}EngNm", key );

    if ( lang == locale.korea || lang == locale.korean )
    {
        return item[korKey];
    } else
    {
        return item[engKey];
    }
}

function downloadExcel ()
{
    var $btnExcel = $ ( '#btnExcel' );

    $btnExcel.click ( function ()
    {
        for ( var i = 1; i <= 3; i++ )
        {
            var $graph = $ ( '#graph' + i );
            var optionsStr = JSON.stringify ( $graph.highcharts ().userOptions );
            var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );
            var id = 'excelUrl' + i;
            var name = 'url' + i;

            highChartImgRetrieve ( dataString, id, name );
        }

    } );
}

function highChartImgRetrieve ( dataString, urlId, urlName )
{
    $.ajax ( {
        type : 'POST',
        data : dataString,
        url : staticVariable.exportUrl,
        success : function ( data )
        {
            var $pageType = $ ( '<input />', {
                type : 'hidden',
                id : 'pageType',
                name : 'pageType',
                value : $ ( '#pageType' ).val ()
            } );

            var $excelUrl = $ ( '<input />', {
                type : 'hidden',
                id : urlId,
                name : urlName,
                value : staticVariable.exportUrl + data
            } );
            chartImgInfoMap.put ( urlId, $excelUrl );

            if ( chartImgInfoMap.size () == 3 )
            {
                var $excelUrl1 = chartImgInfoMap.get ( 'excelUrl1' );
                var $excelUrl2 = chartImgInfoMap.get ( 'excelUrl2' );
                var $excelUrl3 = chartImgInfoMap.get ( 'excelUrl3' );

                console.log ( '*** highChart URL ' );
                console.log ( $excelUrl1 );
                console.log ( $excelUrl2 );
                console.log ( $excelUrl3 );
                if ( $excelUrl1 && $excelUrl2 && $excelUrl3 )
                {
                    var menuName = '';
                    $ ( '.lnb' ).find ( 'span' ).each ( function ()
                    {
                        menuName += ($ ( this ).text () + '_');
                    } );

                    menuName += ($ ( '.lnb' ).find ( 'strong' ).text () + '_' + $ ( '.tree_tab_wrap' ).find (
                            '.selected' ).text ());

                    var $menuName = $ ( '<input />', {
                        type : 'hidden',
                        id : 'menuName',
                        name : 'menuName',
                        value : menuName
                    } );

                    $ ( 'form' ).prepend ( $excelUrl1, $excelUrl2, $excelUrl3, $pageType, $menuName ).prop ( 'action',
                            contextPath + '/hom/excel/analysis/alarmstats/download.do' ).submit ();

                    $excelUrl1.remove ();
                    $excelUrl2.remove ();
                    $excelUrl3.remove ();
                    $pageType.remove ();
                    $menuName.remove ();

                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_highchartDownloadError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
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

// 페이지 로드 완료 시 처리
function initPage ()
{
    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    // highChart 이미지 URL 정보
    chartImgInfoMap = new Map ();

    customizeForm ();
    initDatetimepicker ();
    initViewAllPopup ();
    searchAlarm ();
    initPage ();
    downloadExcel ();
} );