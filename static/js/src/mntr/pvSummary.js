// form element customize
function customizeForm ()
{
    // 미조치알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : 'f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        width : 58,
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        selectedColor : '#009944',
        selectedBorderColor : '#009944'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
        selectedColor : '#ffb230',
        selectedBorderColor : '#ffb230'
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
        selectedColor : '#6c7176',
        selectedBorderColor : '#6c7176'
    } );

    // 조회기간
    $ ( '#dateType' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );
}

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

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#dateType' );
    $dateType.on ( 'change', function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectedType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        $date.addClass ( 'dnone' );

        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedType, false, false );
        var $dateBox = $ ( '.' + className );
        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate );
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    $dateType.trigger ( 'change' );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.al_list_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

/**
 * KPI 정보 조회
 */
function searchKpi ()
{
    $ ( '#btnSubmit' ).on ( 'click', function ()
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
        var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
        var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

        if ( !homUtil.fromToDateValidate ( fromDate, toDate, dateType ) )
        {
            return;
        }

        setSearchParameter ( pureFromDate, pureToDate );

        getKpiInfoByPeriod ();
        getKpiChartList ();
    } );
}

// 검색을 위한 파라미터 세팅(시작/종료, 조회조건)
function setSearchParameter ( pureFromDate, pureToDate )
{
    $ ( '#hidFromDate' ).val ( pureFromDate );
    $ ( '#hidToDate' ).val ( pureToDate );
    $ ( '#hidDateType' ).val ( $ ( '#dateType' ).val () );
}

/**
 * 기간별 KPI 정보
 */
function getKpiInfoByPeriod ()
{
    var dateType = $ ( '#hidDateType' ).val ();
    $
            .ajax ( {
                url : contextPath + '/hom/monitoring/summary/selectKpiInfo.ajax',
                type : 'POST',
                dataType : 'json',
                data : $ ( "form" ).serialize (),
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        var data = json.data;
                        if ( data !== null )
                        {
                            // 발전량
                            $ ( '#emGeneQty' ).text (
                                    homUtil.mathFloorComma ( data.geneQty, staticVariable.decimalPoint ) );
                            $ ( '#geneQtyUnit' ).text ( data.geneQtyUnit );
                            $ ( '#spGoalGeneQty' )
                                    .html ( createUpAndDownArrow ( data.goalGeneQty, data.goalGeneQtyPt ) );
                            $ ( '#spBeforeYearGeneQty' ).html (
                                    createUpAndDownArrow ( data.beforeYearGeneQty, data.beforeYearGeneQtyPt ) );
                            $ ( '#spCo2Reduction' ).html (
                                    homUtil.mathFloorComma ( data.co2Reduction, staticVariable.decimalPoint )
                                            + '<em>ton</em>' );

                            // 일사량
                            $ ( '#emRdtn' ).text ( homUtil.mathFloorComma ( data.rdtn, staticVariable.decimalPoint ) );
                            $ ( '#rdtnUnit' ).text ( data.rdtnUnit + "/" + dateType.toLowerCase () );
                            $ ( '#spGoalRdtn' ).html ( createUpAndDownArrow ( data.goalRdtn, data.goalRdtnPt ) );
                            $ ( '#spBeforeYearRdtn' ).html (
                                    createUpAndDownArrow ( data.beforeYearRdtn, data.beforeYearRdtnPt ) );

                            // 성능비
                            $ ( '#emPr' ).text ( homUtil.mathFloorComma ( data.pr, staticVariable.decimalPoint ) );
                            $ ( '#spGoalPr' ).html ( createUpAndDownArrow ( data.goalPr, data.goalPrPt ) );
                            $ ( '#spBeforeYearPr' ).html (
                                    createUpAndDownArrow ( data.beforeYearPr, data.beforeYearPrPt ) );

                            // 가동률
                            $ ( '#emAvaty' ).text ( homUtil.mathFloorComma ( data.avaty, staticVariable.decimalPoint ) );
                            $ ( '#spGoalAvaty' ).html ( createUpAndDownArrow ( data.goalAvaty, data.goalAvatyPt ) );
                            $ ( '#spBeforeYearAvaty' ).html (
                                    createUpAndDownArrow ( data.beforeYearAvaty, json.data.beforeYearAvatyPt ) );
                        } else
                        {
                            // 발전량
                            $ ( '#emGeneQty' ).text ( '0.0' );
                            $ ( '#spGoalGeneQty' ).html ( createUpAndDownArrow ( 0, 0 ) );
                            $ ( '#spBeforeYearGeneQty' ).html ( createUpAndDownArrow ( 0, 0 ) );
                            $ ( '#spCo2Reduction' ).html ( '0<em>ton</em>' );

                            // 일사량
                            $ ( '#emRdtn' ).text ( '0.0' );
                            $ ( '#spGoalRdtn' ).html ( createUpAndDownArrow ( 0, 0 ) );
                            $ ( '#spBeforeYearRdtn' ).html ( createUpAndDownArrow ( 0, 0 ) );

                            // 성능비
                            $ ( '#emPr' ).text ( '0.0' );
                            $ ( '#spGoalPr' ).html ( createUpAndDownArrow ( 0, 0 ) );
                            $ ( '#spBeforeYearPr' ).html ( createUpAndDownArrow ( 0, 0 ) );

                            // 가동률
                            $ ( '#emAvaty' ).text ( '0.0' );
                            $ ( '#spGoalAvaty' ).html ( createUpAndDownArrow ( 0, 0 ) );
                            $ ( '#spBeforeYearAvaty' ).html ( createUpAndDownArrow ( 0, 0 ) );
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

/**
 * 해당 기준 값에 대한 퍼센트 표시
 * 
 * @param stdrValue(목표값)
 * @param ptValue(100이상)
 * @returns {String}
 */
function createUpAndDownArrow ( stdrValue, ptValue )
{
    var upAndDownArrowInfo = getUpAndDownArrowInfo ( monitoringSummary.pvAcmsltRateList, ptValue );

    if ( $.isNumeric ( ptValue ) )
    {
        ptValue -= 100;
    }

    var html = '(<em ';
    if ( upAndDownArrowInfo.color !== '' )
    {
        html += 'style="color:' + upAndDownArrowInfo.color + ';"';
    }
    html += '><i>' + upAndDownArrowInfo.symbol + '</i>'
            + homUtil.mathAbsFloorComma ( ptValue, staticVariable.decimalPoint ) + '%</em>)';
    html = homUtil.mathFloorComma ( stdrValue, staticVariable.decimalPoint ) + html;

    return html;
}

/**
 * 기간별 KPI 차트 정보 목록 조회
 */
function getKpiChartList ()
{
    var $graph01 = $ ( '#graph01' );

    $
            .ajax ( {
                url : contextPath + '/hom/monitoring/summary/selectKpiInfoList.ajax',
                type : 'POST',
                dataType : 'json',
                data : $ ( "form" ).serialize (),
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        homUtil.clearHighcharts ( [ $ ( '#graph01' ).highcharts () ] );

                        if ( json.data.length > 0 )
                        {
                            var dateType = $ ( "#hidDateType" ).val ();
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

                            // 목표 발전량, 전년도 발전량, 발전량 실적, 성능비, 가동률, 일사량
                            var goalGeneQtyArray = [];
                            var beforeYearGeneQtyArray = [];
                            var geneQtyAcmsltArray = [];
                            var prArray = [];
                            var avatyArray = [];
                            var rdtnArray = [];

                            // 발전량, 일사량, 성능비, 가동률 단위
                            var geneQtyUnitNm = json.data[0].geneQtyUnit;
                            var rdtnUnitNm = json.data[0].rdtnUnit;
                            var percentUnitNm = '-';
                            if ( json.data[0].prUnit === json.data[0].avatUnit )
                            {
                                percentUnitNm = json.data[0].avatUnit
                            }

                            if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
                            {
                                rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
                            }

                            $
                                    .each (
                                            json.data,
                                            function ( index, item )
                                            {
                                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                                goalGeneQtyArray.push ( [
                                                        targetDate,
                                                        homUtil.mathFloor ( item.goalGeneQty,
                                                                staticVariable.decimalPoint ) ] );
                                                beforeYearGeneQtyArray.push ( [
                                                        targetDate,
                                                        homUtil.mathFloor ( item.beforeYearGeneQty,
                                                                staticVariable.decimalPoint ) ] );
                                                geneQtyAcmsltArray.push ( [
                                                        targetDate,
                                                        homUtil.mathFloor ( item.geneQtyAcmslt,
                                                                staticVariable.decimalPoint ) ] );
                                                prArray.push ( [ targetDate,
                                                        homUtil.mathFloor ( item.pr, staticVariable.decimalPoint ) ] );
                                                avatyArray
                                                        .push ( [
                                                                targetDate,
                                                                homUtil.mathFloor ( item.avaty,
                                                                        staticVariable.decimalPoint ) ] );
                                                rdtnArray.push ( [ targetDate,
                                                        homUtil.mathFloor ( item.rdtn, staticVariable.decimalPoint ) ] );
                                            } );

                            $graph01.highcharts ( {
                                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type1 ),
                                chart : {
                                    height : 325,
                                    marginTop : 20,
                                    zoomType : 'x',
                                    panning : true,
                                    panKey : 'shift'
                                },
                                legend : {
                                    itemStyle : {
                                        color : '#3c3c3c',
                                        fontWeight : 'normal'
                                    }
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
                                yAxis : [
                                        {
                                            min : 0,
                                            title : {
                                                text : i18nMessage.msg_energy
                                                        + homUtil.wrapWord ( geneQtyUnitNm, '(', ')' )
                                            }
                                        },
                                        {
                                            min : 0,
                                            // 한화에너지 요청으로 200 limit 처리했지만 데이터의 문제가 있을 경우 그래프에 표시되지 않으므로 해당 부분을 주석처리함
                                            // max : 200,
                                            opposite : true,
                                            title : {
                                                text : i18nMessage.msg_pr + ',' + i18nMessage.msg_ava
                                                        + homUtil.wrapWord ( percentUnitNm, '(', ')' )
                                            }
                                        }, {
                                            min : 0,
                                            opposite : true,
                                            title : {
                                                text : i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' )
                                            }
                                        } ],
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
                                    name : i18nMessage.msg_goalPowerGen,
                                    data : goalGeneQtyArray
                                }, {
                                    type : 'column',
                                    yAxis : 0,
                                    name : i18nMessage.msg_lastYearPowerGen,
                                    data : beforeYearGeneQtyArray

                                }, {
                                    type : 'column',
                                    yAxis : 0,
                                    name : i18nMessage.msg_energyAcmslt,
                                    data : geneQtyAcmsltArray

                                }, {
                                    type : 'line',
                                    yAxis : 1,
                                    name : i18nMessage.msg_pr,
                                    data : prArray

                                }, {
                                    type : 'line',
                                    yAxis : 1,
                                    name : i18nMessage.msg_ava,
                                    data : avatyArray

                                }, {
                                    type : 'line',
                                    dashStyle : 'shortdot',
                                    yAxis : 2,
                                    name : i18nMessage.msg_rdtn,
                                    data : rdtnArray
                                } ]
                            } );
                        } else
                        {
                            $graph01.append ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

/**
 * 상업운전 이후 KPI 차트 목록
 */
function getAfterCodKpiInfoList ()
{
    var $graph02 = $ ( '#graph02' );
    $
            .ajax ( {
                url : contextPath + '/hom/monitoring/summary/selectAfterCodKpiInfoList.ajax',
                type : 'POST',
                dataType : 'json',
                data : {
                    unit : $ ( '#hidUnit2' ).val ()
                },
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        homUtil.clearHighcharts ( [ $ ( '#graph02' ).highcharts () ] );

                        if ( json.data.length > 0 )
                        {
                            // 목표 발전량, 발전량 실적, 목표 성능비, 성능비, 목표 가동률, 가동률
                            var goalGeneQtyArray = [];
                            var geneQtyAcmsltArray = [];
                            var goalPrArray = [];
                            var prArray = [];
                            var goalAvatyArray = [];
                            var avatyArray = [];

                            var geneQtyUnitNm = json.data[0].geneQtyUnit;
                            var prUnitNm = json.data[0].prUnit;
                            var avatUnit = json.data[0].avatUnit;
                            var percentUnitNm = '-';
                            if ( json.data[0].prUnit === json.data[0].avatUnit )
                            {
                                percentUnitNm = json.data[0].prUnit;
                            }

                            // 상업운전 시작 년도
                            var startYear = parseInt ( json.data[0].cod, 10 );

                            $
                                    .each ( json.data,
                                            function ( index, item )
                                            {
                                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                                goalGeneQtyArray.push ( [
                                                        targetDate,
                                                        homUtil.mathFloor ( item.goalGeneQty,
                                                                staticVariable.decimalPoint ) ] );
                                                geneQtyAcmsltArray.push ( [
                                                        targetDate,
                                                        homUtil.mathFloor ( item.geneQtyAcmslt,
                                                                staticVariable.decimalPoint ) ] );
                                                goalPrArray
                                                        .push ( [
                                                                targetDate,
                                                                homUtil.mathFloor ( item.goalPr,
                                                                        staticVariable.decimalPoint ) ] );
                                                prArray.push ( [ targetDate,
                                                        homUtil.mathFloor ( item.pr, staticVariable.decimalPoint ) ] );
                                                goalAvatyArray.push ( [
                                                        targetDate,
                                                        homUtil
                                                                .mathFloor ( item.goalAvaty,
                                                                        staticVariable.decimalPoint ) ] );
                                                avatyArray
                                                        .push ( [
                                                                targetDate,
                                                                homUtil.mathFloor ( item.avaty,
                                                                        staticVariable.decimalPoint ) ] );
                                            } );

                            // 상업운전 이후 KPI 그래프
                            $graph02.highcharts ( {
                                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type1 ),
                                chart : {
                                    height : 235,
                                    marginTop : 40,
                                    marginBottom : 45,
                                    zoomType : 'x',
                                    panning : true,
                                    panKey : 'shift'
                                },
                                legend : {
                                    padding : -15,
                                    itemStyle : {
                                        color : '#3c3c3c',
                                        fontWeight : 'normal'
                                    }
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
                                    type : 'datetime',
                                    labels : {
                                        style : {
                                            color : '#3c3c3c'
                                        },
                                        formatter : function ()
                                        {
                                            var dateXAxis = homUtil.convertDateLongToString ( this.value,
                                                    homUtil.dateFormat.convertYYYYMM );
                                            return dateXAxis;
                                        }
                                    }
                                },
                                yAxis : [
                                        {
                                            min : 0,
                                            title : {
                                                text : i18nMessage.msg_energy
                                                        + homUtil.wrapWord ( geneQtyUnitNm, '(', ')' )
                                            }
                                        },
                                        {
                                            min : 0,
                                            // 한화에너지 요청으로 200 limit 처리했지만 데이터의 문제가 있을 경우 그래프에 표시되지 않으므로 해당 부분을 주석처리함
                                            // max : 200,
                                            opposite : true,
                                            title : {
                                                text : i18nMessage.msg_pr + ',' + i18nMessage.msg_ava
                                                        + homUtil.wrapWord ( percentUnitNm, '(', ')' )
                                            }
                                        } ],
                                tooltip : homUtil.generateTooltip ( homUtil.dateFormat.convertYYYYMM,
                                        staticVariable.decimalPoint ),
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
                                    name : i18nMessage.msg_goalPowerGen,
                                    data : goalGeneQtyArray
                                }, {
                                    type : 'column',
                                    yAxis : 0,
                                    name : i18nMessage.msg_energyAcmslt,
                                    data : geneQtyAcmsltArray

                                }, {
                                    type : 'line',
                                    yAxis : 1,
                                    name : i18nMessage.msg_goal + " " + i18nMessage.msg_pr,
                                    data : goalPrArray

                                }, {
                                    type : 'line',
                                    yAxis : 1,
                                    name : i18nMessage.msg_pr,
                                    data : prArray

                                }, {
                                    type : 'line',
                                    yAxis : 1,
                                    name : i18nMessage.msg_goal + " " + i18nMessage.msg_ava,
                                    data : goalAvatyArray

                                }, {
                                    type : 'line',
                                    yAxis : 1,
                                    name : i18nMessage.msg_ava,
                                    data : avatyArray
                                } ]
                            } );
                        } else
                        {
                            $graph02.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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

function pvAlarm ()
{
    var pvAlarmInfo = null;
    var $pvAlarm = $ ( '#pvAlarm' );
    $.ajax ( {
        url : contextPath + '/hom/monitoring/summary/selectPvAlarm.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                pvAlarmInfo = json.data;
                if ( pvAlarmInfo != null )
                {
                    /*
                     * var html = '<span class="selected"><i class=' + pvAlarmInfo.opSttusIconCd + '></i>' +
                     * pvAlarmInfo.opSttus + '</span>';
                     */
                    var html = '<span  class="selected">' + i18nMessage.msg_summaryEquipment + ' <i class='
                            + pvAlarmInfo.opSttusIconCd + '></i>' + '</span><span  class="selected">'
                            + i18nMessage.msg_summaryCommunication + ' <i class=' + pvAlarmInfo.pvCommSttusIconCd
                            + '></i></span>';

                    $pvAlarm.html ( html );
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

function getAlarmInfo ()
{
    var alarmInfo = null;
    var $alarmFault = $ ( '#alarm_fault' );
    var $alarmStatus = $ ( '#alarm_status' )
    $
            .ajax ( {
                url : contextPath + '/hom/monitoring/summary/selectAlarmInfo.ajax',
                type : 'POST',
                dataType : 'json',
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        alarmInfo = json.data;
                        if ( alarmInfo != null )
                        {
                            // 고장 알람
                            $alarmFault.find ( 'em' ).text (
                                    homUtil.mathFloorComma ( alarmInfo.faultManagtRatio, staticVariable.decimalPoint )
                                            + '% ' + i18nMessage.msg_mntrAction );
                            $alarmFault.find ( 'span' ).text (
                                    homUtil.mathFloorComma ( alarmInfo.managtCnt, 0 ) + '/'
                                            + homUtil.mathFloorComma ( alarmInfo.faultAlarmTotCnt, 0 )
                                            + i18nMessage.msg_count );
                            // 알람현황
                            $alarmStatus.find ( 'em' ).text (
                                    homUtil.mathFloorComma ( alarmInfo.managtRatio, staticVariable.decimalPoint )
                                            + '% ' + i18nMessage.msg_mntrAction );
                            $alarmStatus.find ( 'span' ).text (
                                    homUtil.mathFloorComma ( alarmInfo.alarmTotManagtCnt, 0 ) + '/'
                                            + homUtil.mathFloorComma ( alarmInfo.alarmTotCnt, 0 )
                                            + i18nMessage.msg_count );
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

function initAlarmList ()
{
    getAlarmList ();

    var $inputCheckBox = $ ( '.f_chk input' );
    $inputCheckBox.on ( 'click', function ()
    {
        getAlarmList ();
    } );

}

// 알람 목록
function getAlarmList ()
{
    var alarmGradCds = [];
    $ ( '.f_chk input' ).each ( function ()
    {
        var $that = $ ( this );
        if ( $that.prop ( 'checked' ) )
        {
            var alarmGradCd = $that.val ();
            alarmGradCds.push ( alarmGradCd );
        }
    } );

    var tpl = getTemplate ( templates.noData );
    var alarmLiTpl = getTemplate ( templates.alarmLi );

    var $alList = $ ( '.al_list' );
    var $gqNodata = $ ( '.gq_nodata' );
    $alList.empty ();

    if ( alarmGradCds != null && alarmGradCds != '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/monitoring/summary/selectAlarmList.ajax',
            cache : false,
            type : 'GET',
            dataType : 'json',
            data : {
                alarmGradCds : alarmGradCds.toString ()
            },
            success : function ( data )
            {
                if ( data != null && data.length > 0 )
                {
                    var html = '';
                    if ( alarmLiTpl != null )
                    {
                        var template = _.template ( alarmLiTpl );
                        var html = template ( {
                            i18nMessage : i18nMessage,
                            contextPath : contextPath,
                            data : data
                        } );
                        $alList.append ( html );

                        $alList.find ( '.btn_popup' ).magnificPopup ( {
                            type : 'ajax',
                            alignTop : false,
                            overflowY : 'scroll',
                            closeOnContentClick : false,
                            callbacks : {
                                ajaxContentAdded : function ()
                                {
                                    setParameter ( $alList.find ( '.btn_popup' ) );
                                }
                            }
                        } );

                        var $alarm_count = $ ( '#alarm_count' );

                        $alarm_count.find ( 'span' ).text (
                                i18nMessage.msg_unreleased + " " + i18nMessage.msg_alarm + "(" + data.length
                                        + i18nMessage.msg_count + ")" );
                    }
                } else
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_sentenceGridNoData
                    } );

                    $alList.append ( html );

                    $gqNodata.show ();
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
    } else
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $alList.append ( html );

        $gqNodata.show ();
    }
}

function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );
}

/**
 * 상업운전 이후 KPI 정보 조회
 */
function getAfterCodKpiInfo ()
{
    $.ajax ( {
        url : contextPath + '/hom/monitoring/summary/selectAfterCodKpiInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            unit : $ ( '#hidUnit2' ).val ()
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data !== null )
                {
                    // 발전량
                    $ ( '#codGeneQty' )
                            .text ( homUtil.mathFloorComma ( json.data.geneQty, staticVariable.decimalPoint ) );
                    $ ( '#codGeneQtyUnit' ).text ( json.data.geneQtyUnit );

                    $ ( '#codCo2Reduction' ).html (
                            homUtil.mathFloorComma ( json.data.co2Reduction, staticVariable.decimalPoint )
                                    + '<em>ton</em>' );
                    $ ( '#codGoalGeneQty' )
                            .html (
                                    createUpAndDownArrow ( json.data.goalGeneQty,
                                            parseFloat ( json.data.goalGeneQtyPt ) + 100 ) );

                    // 일사량
                    $ ( '#codRdtn' ).text ( homUtil.mathFloorComma ( json.data.rdtn, staticVariable.decimalPoint ) );
                    $ ( '#codRdtnUnit' ).text ( json.data.rdtnUnit + "/cod" );
                    $ ( '#codGoalRdtn' ).html (
                            createUpAndDownArrow ( json.data.goalRdtn, parseFloat ( json.data.goalRdtnPt ) + 100 ) );

                    // 성능비
                    $ ( '#codPr' ).text ( homUtil.mathFloorComma ( json.data.pr, staticVariable.decimalPoint ) );
                    $ ( '#codGoalPr' ).html (
                            createUpAndDownArrow ( json.data.goalPr, parseFloat ( json.data.goalPrPt ) + 100 ) );

                    // 가동률
                    $ ( '#codAvaty' ).text ( homUtil.mathFloorComma ( json.data.avaty, staticVariable.decimalPoint ) );
                    $ ( '#codGoalAvaty' ).html (
                            createUpAndDownArrow ( json.data.goalAvaty, parseFloat ( json.data.goalAvatyPt ) + 100 ) );
                } else
                {
                    // 발전량
                    $ ( '#codGeneQty' ).text ( '0.0' );
                    $ ( '#codGeneQtyUnit' ).text ( "kWh" );
                    $ ( '#codCo2Reduction' ).html ( '0<em>ton</em>' );
                    $ ( '#codGoalGeneQty' ).html ( createUpAndDownArrow ( 0, 0 ) );

                    // 일사량
                    $ ( '#codRdtn' ).text ( '0.0' );
                    $ ( '#codRdtnUnit' ).text ( "Wh/㎡/cod" );
                    $ ( '#codGoalRdtn' ).html ( createUpAndDownArrow ( 0, 0 ) );

                    // 성능비
                    $ ( '#codPr' ).text ( '0.0' );
                    $ ( '#codGoalPr' ).html ( createUpAndDownArrow ( 0, 0 ) );

                    // 가동률
                    $ ( '#codAvaty' ).text ( '0.0' );
                    $ ( '#codGoalAvaty' ).html ( createUpAndDownArrow ( 0, 0 ) );
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

// 발전소 정보 조회
function getPvInfo ()
{
    var $avgPwPrdctTime = $ ( '#pvAvgGeneTime' );
    var $locationList = $ ( '.location_list' );
    var $capacity = $ ( '.capacity .kilowatts' );
    var $capaList = $ ( '.capa_list' );
    var $informationList = $ ( '.information_list' );
    var pvInfo = null;
    $.ajax ( {
        url : contextPath + '/hom/realtime/realtime/getPvInfo.ajax',
        type : 'POST',
        cache : false,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                pvInfo = json.data;
                if ( pvInfo != null )
                {
                    var data = json.data;
                    var pvStdrInfoVO = data.pvStdrInfoVO;
                    var ivtEqmtInfoList = data.ivtEqmtInfoList;
                    var mdlEqmtInfoList = data.ptvltcmdlCorprInfoList;
                    var epcCorprInfoVO = data.epcCorprInfoVO;
                    var omCorprInfoVO = data.omCorprInfoVO;
                    var capactyUnit = data.eqmtCpctyUnit;

                    // 평균발전시간
                    $avgPwPrdctTime.text ( pvStdrInfoVO.avgPwPrdtTime );
                    $avgPwPrdctTime.parent ().find ( '.unit01' ).text ( '(' + pvStdrInfoVO.avgPwPrdtTimeUnit + ')' );
                    // 위치 정보
                    $locationList.find ( '#pvAddr' ).text ( pvStdrInfoVO.detlAddr );

                    // 설치 용량
                    $capacity.text ( homUtil.mathFloorComma ( pvStdrInfoVO.fcltyCpcty, staticVariable.decimalPoint ) );
                    $capacity.find ( '.unit02' ).text ( capactyUnit );

                    var pvSetupCpcty = 0;

                    $.each ( ivtEqmtInfoList, function ( index, item )
                    {
                        pvSetupCpcty += item.setupCpcty;
                    } );

                    // 인버터
                    var $capaListIvt = $capaList.find ( '#capa_list_ivt' );
                    if ( ivtEqmtInfoList !== null && ivtEqmtInfoList.length > 0 )
                    {
                        var corprNm = ivtEqmtInfoList[0].corprNm;
                        if ( corprNm == null || corprNm == '' )
                        {
                            corprNm = '-';
                        }

                        $capaListIvt.find ( '.maker' ).text ( '(' + i18nMessage.msg_mnfctur + ' : ' + corprNm + ')' );
                        $capaListIvt.find ( '.supply' ).text (
                                homUtil.mathFloorComma ( pvSetupCpcty, staticVariable.decimalPoint )
                                        + ivtEqmtInfoList[0].setupCpctyUnit + ' (' + ivtEqmtInfoList.length + 'EA)' );
                    } else
                    {
                        $capaListIvt.find ( '.supply' ).text ( '0kW (0EA)' );
                    }

                    // 모듈
                    var $capaListMdl = $capaList.find ( '#capa_list_mdl' );
                    if ( mdlEqmtInfoList !== null && mdlEqmtInfoList.length > 0 )
                    {
                        var entrpsNm = mdlEqmtInfoList[0].mdlMnfcturEntrpsNm;
                        if ( entrpsNm == null || entrpsNm == '' )
                        {
                            entrpsNm = '-';
                        }
                        $capaListMdl.find ( '.maker' ).text ( '(' + i18nMessage.msg_mnfctur + ' : ' + entrpsNm + ')' );
                        $capaListMdl.find ( '.supply' ).text (
                                homUtil.mathFloorComma ( mdlEqmtInfoList[0].eqmtCpcty, staticVariable.decimalPoint )
                                        + mdlEqmtInfoList[0].eqmtCpctyUnit );
                    } else
                    {
                        $capaListMdl.find ( '.supply' ).text ( '0Wp' );
                    }

                    // 협력 업체
                    var spcNmText = pvStdrInfoVO.spcNm;
                    if ( spcNmText == null )
                    {
                        spcNmText = '';
                    }
                    $informationList.find ( '#spcNm' ).text ( spcNmText );
                    if ( epcCorprInfoVO !== null )
                    {
                        var epcCorprNm = epcCorprInfoVO.corprEngNm;
                        if ( lang == locale.korea || lang == locale.korean )
                        {
                            epcCorprNm = epcCorprInfoVO.corprKorNm;
                        }
                        $informationList.find ( '#epcCorprInfo' ).text ( epcCorprNm );
                    }

                    if ( omCorprInfoVO !== null )
                    {
                        var omCorprNm = omCorprInfoVO.corprEngNm;
                        if ( lang == locale.korea || lang == locale.korean )
                        {
                            omCorprNm = omCorprInfoVO.corprKorNm;
                        }
                        $informationList.find ( '#omCorprInfo' ).text ( omCorprNm );
                    }
                    $informationList.find ( '#cod' ).text ( pvStdrInfoVO.cod );
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

// 단위 변경 버튼 클릭
function initUnit ()
{
    // 기간별 성능지수
    var $unitSelect = $ ( '.unit_select' );
    var $hidUnit = $ ( '#hidUnit' );
    var $btnSubmit = $ ( '#btnSubmit' );
    $unitSelect.on ( 'click', function ()
    {
        var valueUnit = $ ( this ).data ( 'unit' );

        $unitSelect.removeClass ( 'on' );
        $ ( this ).addClass ( 'on' );

        $hidUnit.val ( valueUnit );

        setSearchedParameter ();

        $btnSubmit.trigger ( 'click' );
    } );

    // COD 성능지수
    var $hidUnit2 = $ ( '#hidUnit2' );
    var $unitSelectCod = $ ( '.unit_select_cod' );
    $unitSelectCod.on ( 'click', function ()
    {
        var valueUnit = $ ( this ).data ( 'unit' );

        $unitSelectCod.removeClass ( 'on' );
        $ ( this ).addClass ( 'on' );

        $hidUnit2.val ( valueUnit );

        // 데이터 조회
        getAfterCodKpiInfo ();
        getAfterCodKpiInfoList ();
    } );
}

// 알람 상태
function getPvAlarmStatus ()
{
    $.ajax ( {
        url : contextPath + '/hom/common/selectAlarmStatus.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alarmstatus = json.data;
                $ ( "#pvAlarm" ).attr ( 'class', 'dvc_status ' + alarmstatus );
                var alarmText = "";

                if ( alarmstatus == "normal" )
                {
                    alarmText = i18nMessage.msg_mntrNormal;
                } else if ( alarmstatus == "warnng" )
                {
                    alarmText = i18nMessage.msg_mntrEqmtWarning;
                } else if ( alarmstatus == "broken" )
                {
                    alarmText = i18nMessage.msg_mntrFault;
                } else if ( alarmstatus == "neterr" )
                {
                    alarmText = i18nMessage.msg_mntrNetErr;
                }

                $ ( "#pvAlarm" ).text ( alarmText );
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

function initInterval ()
{
    getAfterCodKpiInfo ();
    getAfterCodKpiInfoList ();

    setInterval ( function ()
    {
        // 발전소 정보
        getPvInfo ();

    }, monitoringSummary.interval.minuteTime );

    setInterval ( function ()
    {
        // 상업운전 이후 KPI 정보 조회
        getAfterCodKpiInfo ();
        // 상업운전 이후 KPI 차트 목록
        getAfterCodKpiInfoList ();
    }, monitoringSummary.interval.sixHourTime );

    // pvAlarm ();
    // getAlarmInfo ();
    setInterval ( function ()
    {
        // 발전소 알람 정보
        // pvAlarm ();
        // 알람 정보
        // getAlarmInfo ();

        // 발전소 알람 상태
        getPvAlarmStatus ();
    }, monitoringSummary.interval.threeSecondTime );
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

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 성능지수(기간별) 사용자가 조회 후 조건(조회 조건, 시작, 종료 등)을 바꾼 후 조회버튼을 누르지 않고 단위변환 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParameter ()
{
    var dateType = $ ( '#hidDateType' ).val ();
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

    var fromDate = homUtil.convertDateStringToFormat ( $ ( '#hidFromDate' ).val (), dateFormat );
    var toDate = homUtil.convertDateStringToFormat ( $ ( '#hidToDate' ).val (), dateFormat );

    $ ( '#dateType' ).val ( dateType ).trigger ( 'change' );
    $ ( '#' + className + '_from_date' ).val ( fromDate );
    $ ( '#' + className + '_to_date' ).val ( toDate );
}

// 페이지 로드 완료 시 처리
function initPage ()
{
    initInterval ();
    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    monitoringSummary = {
        interval : {
            minuteTime : 1000 * 60,
            threeSecondTime : 1000 * 3,
            sixHourTime : 1000 * 60 * 60 * 6
        },
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };

    customizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    setBtnMore ();
    initUnit ();
    searchKpi ();
    initAlarmList ();
    showPopup ();
    initPage ();
} );
