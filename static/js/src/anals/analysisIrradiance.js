var analysisIrradiance = null;

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
    var $selectDateType = $ ( '#select_date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
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
}

// 일사량 조회
function searchRdtn ()
{
    var $gridList = $ ( '#gridList' );
    var $searchPeriod = $ ( '#search_period' );
    var $pageType = $ ( '#pageType' );

    var tpl = getTemplate ( templates.noData );
    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        var retrieveTypeValue = $ ( ':radio[name=retrieveType]:checked' ).val ();

        if ( $pageType.val () != retrieveTypeValue )
        {
            var url = contextPath + '/hom/analysis/radiation/list.do';
            var param = '?pageType=' + retrieveTypeValue;
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

            // 일사량 차트 조회
            searchRdtnChart ();

            // 일사량 Grid 조회
            if ( initFlag )
            {
                searchRdtnJqgrid ( $gridList, tpl );
            } else
            {
                reloadRdtnJqgrid ( $gridList );
            }
        }
    } );

    // 조회 기준 Click Event
    $ ( 'input[name=retrieveType]' ).on ( 'click', function ()
    {
        $ ( '#dateType' ).val ( $ ( this ).val () );
        if ( $ ( this ).val () == staticVariable.pagetypePeriod )
        {
            $ ( '.search_tcont' ).show ().trigger ( 'change' );
        } else
        {
            $ ( '.search_tcont' ).hide ().trigger ( 'change' );
        }
    } );
}

function setSearchParameter ( pureFromDate, pureToDate )
{

    // 조회 조건, 시작, 종료일자 세팅
    $ ( '#dateType' ).val ( $ ( '#select_date_type' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );

    setPeriodTitle ();
}

// 일사량 차트 조회
function searchRdtnChart ()
{
    var $graph1 = $ ( '#graph1' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );
    var $unitBox = $ ( '#unit_box' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/radiation/selectRadiationChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
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
                    $unitBox.show ();

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

                    // 목표 발전량, 전년 발전량, 예상 발전량, 실적 발전량, 평균발전시간, 일사량, 온도
                    var goalRdtnArray = [];
                    var beforeYearRdtnArray = [];
                    var acmsltRdtnArray = [];

                    // 발전량, 평균발전시간, 일사량, 온도 단위
                    var rdtnUnitNm = json.data[0].rdtnUnitNm;

                    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
                    {
                        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
                    }

                    $.each ( json.data, function ( index, item )
                    {
                        var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                        goalRdtnArray.push ( [ targetDate,
                                homUtil.mathFloor ( item.goalRdtn, staticVariable.decimalPoint ) ] );
                        beforeYearRdtnArray.push ( [ targetDate,
                                homUtil.mathFloor ( item.beforeYearRdtn, staticVariable.decimalPoint ) ] );
                        acmsltRdtnArray.push ( [ targetDate,
                                homUtil.mathFloor ( item.acmsltRdtn, staticVariable.decimalPoint ) ] );
                    } );

                    // 최소값 판단을 통해 min 값 세팅
                    var rdtnMinArray = [];
                    rdtnMinArray.push ( _.min ( _.pluck ( goalRdtnArray, [ 1 ] ) ) );
                    rdtnMinArray.push ( _.min ( _.pluck ( beforeYearRdtnArray, [ 1 ] ) ) );
                    rdtnMinArray.push ( _.min ( _.pluck ( acmsltRdtnArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var rdtnYaxis = {
                        title : {
                            text : i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( _.pluck ( rdtnMinArray, [ 1 ] ) ) > 0 )
                    {
                        rdtnYaxis.min = 0;
                    }
                    yAxisArray.push ( rdtnYaxis );
                    $graph1.highcharts ( {
                        colors : homUtil.getHighchartsColors (),
                        chart : {
                            marginTop : 50,
                            zoomType : 'x',
                            panning : true,
                            panKey : 'shift'
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

                                    dateXAxis = dateXAxis.replace ( / /g, '<br />' );

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
                            name : i18nMessage.msg_targetRadiation,
                            data : goalRdtnArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_lastYearRadiation,
                            data : beforeYearRdtnArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_actualRadiation,
                            data : acmsltRdtnArray
                        } ]
                    } );
                } else
                {
                    $btnExcel.hide ();
                    $btnAllJqgrid.hide ();
                    $unitBox.hide ();

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

// 일사량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 일사량 jqgrid 조회(초기 세팅 및 조회)
function searchRdtnJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var rdtnUnitNm;
    var noDataId = 'radiation_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/analysis/radiation/selectRadiationGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 173,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit
        },
        colNames : [ dateTypeText, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt,
                i18nMessage.msg_goal, i18nMessage.msg_beforeYear, 'rdtnUnitNm' ],
        colModel : [
                {
                    name : 'stdrDate',
                    align : 'center',
                    width : '140',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalRdtn',
                    align : 'right',
                    width : '215',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearRdtn',
                    align : 'right',
                    width : '215',
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
                    width : '215',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'goalGap',
                    align : 'right',
                    width : '215',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject,
                                analysisIrradiance.pvAcmsltRateList, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearGap',
                    align : 'right',
                    width : '215',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject,
                                analysisIrradiance.pvAcmsltRateList, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
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
            }

            var dateType = $ ( '#dateType' ).val ();
            var ids = $gridList.jqGrid ( 'getDataIDs' );
            var cl = ids[0];
            var rowData = $gridList.getRowData ( cl );
            rdtnUnitNm = rowData.rdtnUnitNm;

            var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
            var dateTypeText = i18nMessage.msg_date;
            if ( $selectedDateType.size () > 0 )
            {
                dateTypeText = $.trim ( $selectedDateType.text () );
            }

            if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
            {
                rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
                rdtnUnitNm = i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' );
            }

            $ ( '#gridList_stdrDate' ).next ( 'th' ).html ( rdtnUnitNm );
            $gridList.jqGrid ( 'setLabel', 'stdrDate', dateTypeText );
        }
    } );

    mergeJqgridRadiationHeader ( $gridList, rdtnUnitNm );

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

// 헤더 병합
function mergeJqgridRadiationHeader ( $gridList, rdtnUnitNm )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalRdtn',
            numberOfColumns : 3,
            titleText : rdtnUnitNm
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_gap + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

// 단위 변경 버튼 클릭
function initUnit ()
{
    var $unitSelect = $ ( '.unit_select' );
    var $unit = $ ( '#unit' );
    var $btnSubmit = $ ( '#btnSubmit' );

    $ ( '.unit_select' ).on ( 'click', function ()
    {
        var valueUnit = $ ( this ).data ( 'unit' );

        $unitSelect.removeClass ( 'on' );
        $ ( this ).addClass ( 'on' );

        $unit.val ( valueUnit );

        setSearchedParamaeter ();

        $btnSubmit.trigger ( 'click' );
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

/**
 * 엑셀 다운로드
 */
function downloadExcel ()
{
    var $btnExcel = $ ( '#btnExcel' );

    $btnExcel.click ( function ()
    {
        var $graph1 = $ ( '#graph1' );
        var optionsStr = JSON.stringify ( $graph1.highcharts ().userOptions );
        var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

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

                var menuName = '';
                $ ( '.lnb' ).find ( 'span' ).each ( function ()
                {
                    menuName += ($ ( this ).text () + '_');
                } );

                menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

                var $menuName = $ ( '<input />', {
                    type : 'hidden',
                    id : 'menuName',
                    name : 'menuName',
                    value : menuName
                } );

                $ ( 'form' ).prepend ( $excelUrl, $menuName ).prop ( 'action',
                        contextPath + '/hom/excel/anals/radiation/download.do' ).submit ();

                $excelUrl.remove ();
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
    analysisIrradiance = {
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };

    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    initUnit ();
    initViewAllPopup ();
    searchRdtn ();
    initPage ();
    downloadExcel ();
} );