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

    var $imageType1 = $ ( '.image_type1' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
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

    var $selType = $ ( '#eqmtId' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

function customizeCheckbox ()
{
    var $checkboxType = $ ( '.image_type1' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
}

// 해당 selector의 select customize
function customizeSelect ( $select )
{
    $select.customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

/**
 * 날짜 유형 customize / / /
 */
function customizeDateType ()
{
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
}

// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    $ ( '.yyyy' ).datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : date
    } );

    $ ( '.yyyymm' ).datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : date
    } );

    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : date
    } );

    $ ( '.yyyymmddhh' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:00',
        startView : 2,
        minView : 1,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : date
    } );

    $ ( '.yyyymmddhhmi' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:ii',
        startView : 2,
        minView : 0,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        minuteStep : 2,
        todayHighlight : true,
        todayBtn : true,
        endDate : date
    } );

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#dateType' );
    $dateType.change ( function ( event )
    {
        var className = '';

        if ( this.value === 'D' )
        {
            className = 'yyyymmdd';
        } else if ( this.value === 'M' )
        {
            className = 'yyyymm';
        } else if ( this.value === 'Y' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
}

function validateDate ( type )
{
    var result = false;
    var validformatYmd = /^\d{4}\-\d{2}\-\d{2}$/;
    var validformatYm = /^\d{4}\-\d{2}$/;
    var validformatY = /^\d{4}$/;
    var dateType = $ ( '#dateType' ).val ();

    var searchDate;
    var formatter;

    if ( dateType === "D" ) // 일
    {
        formatter = homUtil.dateFormat.convertYYYYMMDD;
        if ( type === 'from' )
        {
            searchDate = $ ( '#date01' ).val ();
        } else
        {
            searchDate = $ ( '#date04' ).val ();
        }
        result = !validformatYmd.test ( searchDate );
    } else if ( dateType === "M" ) // 월
    {
        formatter = homUtil.dateFormat.convertYYYYMM;
        if ( type === 'from' )
        {
            searchDate = $ ( '#date02' ).val ();
        } else
        {
            searchDate = $ ( '#date05' ).val ();
        }
        result = !validformatYm.test ( searchDate );

    } else if ( dateType === "Y" ) // 년
    {
        formatter = homUtil.dateFormat.convertYYYY;
        if ( type === 'from' )
        {
            searchDate = $ ( '#date03' ).val ();
        } else
        {
            searchDate = $ ( '#date06' ).val ();
        }
        result = !validformatY.test ( searchDate );
    }

    if ( !result )
    {
        result = parseInt ( searchDate.replace ( /-/g, '' ) ) > parseInt ( homUtil
                .getParamFormatDate ( date, formatter ).replace ( /-/g, '' ) );
    }

    return result;
}

// jqgrid start
// 헤더 병합
function addGroupHeader ()
{
    var groupHeaderName = 'User';
    $ ( "#gridList" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalEnergy',
            numberOfColumns : 4,
            // titleText : i18nMessage.msg_energy + '(MWh)'
            titleText : i18nMessage.msg_energy
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 3,
            titleText : 'GAP(%)'
        } ]
    } );
}

function jqGridBasic ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();
    // var fromStdrYM = $ ( '#hidFromStdrYM' ).val ();
    // var toStdrYM = $ ( '#hidToStdrYM' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var goalFromStdrYM = $ ( '#hidFromStdrYM' ).val ();
    var goalToStdrYM = $ ( '#hidToStdrYM' ).val ();
    var beforeYearFromDate = $ ( '#hidBeforeYearFromDate' ).val ();
    var beforeYearToDate = $ ( '#hidBeforeYearToDate' ).val ();
    var unit = $ ( '#hidUnit' ).val ();

    // console.log ( "jqGridBasic begin" );
    // console.log ( "goalFromStdrYM " + goalFromStdrYM );
    // console.log ( "goalToStdrYM " + goalToStdrYM );
    // console.log ( $ ( '#gridList' ) );

    var tpl = getTemplate ( templates.noData );

    $ ( '#gridList' )
            .jqGrid (
                    {
                        url : contextPath + '/hom/analysis/energy/selectEnergyGridList.ajax',
                        mtype : 'POST',
                        datatype : 'json',
                        height : 179,
                        autowidth : true,
                        shrinkToFit : false,
                        postData : {
                            dateType : dateType,
                            fromDate : fromDate,
                            toDate : toDate,
                            eqmtId : eqmtId,
                            isEqmtGrp : isEqmtGrp,
                            goalFromStdrYM : goalFromStdrYM,
                            goalToStdrYM : goalToStdrYM,
                            beforeYearFromDate : beforeYearFromDate,
                            beforeYearToDate : beforeYearToDate,
                            unit : unit
                        },
                        rowNum : 10,
                        sortname : "stdrDate",
                        sortorder : "asc",
                        rownumbers : true,
                        rowwidth : 25,
                        page : 1,
                        scroll : true,
                        viewrecords : true,
                        emptyrecords : i18nMessage.msg_sentenceGridNoData,
                        colNames : [ i18nMessage.msg_date, i18nMessage.msg_goal, i18nMessage.msg_beforeYear,
                                i18nMessage.msg_expected, i18nMessage.msg_acmslt, i18nMessage.msg_goal,
                                i18nMessage.msg_beforeYear, i18nMessage.msg_expected, "energyUnitNm" ],
                        colModel : [
                                {
                                    name : 'stdrDate',
                                    align : 'center',
                                    width : '140'
                                },
                                {
                                    name : 'goalEnergy',
                                    align : 'right',
                                    width : '150',
                                    formatter : function ( cellvalue, options, rowObject )
                                    {
                                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                                    }
                                },
                                {
                                    name : 'beforeYearEnergy',
                                    align : 'right',
                                    width : '150',
                                    formatter : function ( cellvalue, options, rowObject )
                                    {
                                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                                    }
                                },
                                {
                                    name : 'expectedEnergy',
                                    align : 'right',
                                    width : '150',
                                    formatter : function ( cellvalue, options, rowObject )
                                    {
                                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                                    }
                                },
                                {
                                    name : 'acmsltEnergy',
                                    align : 'right',
                                    width : '150',
                                    formatter : function ( cellvalue, options, rowObject )
                                    {
                                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                                    }
                                },
                                {
                                    name : 'goalGap',
                                    align : 'right',
                                    width : '150',
                                    formatter : function ( cellvalue, options, rowObject )
                                    {
                                        return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject,
                                                staticVariable.decimalPoint );
                                    }
                                },
                                {
                                    name : 'beforeYearGap',
                                    align : 'right',
                                    width : '150',
                                    formatter : function ( cellvalue, options, rowObject )
                                    {
                                        return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject,
                                                staticVariable.decimalPoint );
                                    }
                                },
                                {
                                    name : 'expectedGap',
                                    align : 'right',
                                    width : '150',
                                    formatter : function ( cellvalue, options, rowObject )
                                    {
                                        return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject,
                                                staticVariable.decimalPoint );
                                    }
                                }, {
                                    name : 'energyUnitNm',
                                    align : 'center',
                                    width : '150',
                                    hidden : true
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
                                    + data.records + i18nMessage.msg_count;
                            $ ( "#totalRowCount" ).text ( resultText );

                            var $gridList = $ ( '#gridList' );
                            var ids = $gridList.jqGrid ( "getDataIDs" );
                            var cl = ids[0];
                            var rowData = $gridList.getRowData ( cl );

                            // console.log ( rowData );

                            var energyUnitNm = rowData.energyUnitNm;

                            if ( typeof energyUnitNm === 'undefined' )
                            {
                                energyUnitNm = getHeaderUnit ();
                            }

                            // 발전량
                            $ ( '#gridList_stdrDate' ).next ( 'th' ).html (
                                    i18nMessage.msg_energy + '(' + energyUnitNm + ')' );
                        }
                    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }
}

function getFormattedCellValue ( cellValue )
{
    var prefix = '';
    if ( cellValue > 0 )
    {
        prefix = '(<i class="icon_up"></i>)';
    } else if ( cellValue < 0 )
    {
        prefix = '(<i class="icon_down"></i>)';
    } else
    {
        prefix = '(<i>-</i>)';
    }
    return prefix + homUtil.mathAbsFloorComma ( cellValue, staticVariable.decimalPoint );
}

// jqgird customize
function customizeJqgrid ()
{
    var $gridBox = $ ( '#gbox_gridList' );
    $gridBox.remove ();
    $ ( 'table[id=gridList]' ).remove ();
    $ ( '<table/>' ).attr ( 'id', 'gridList' ).appendTo ( '.grid_tbl_wrap' );

    // jqgrid
    jqGridBasic ();
    addGroupHeader ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}
// jqgrid end

/**
 * datepicker의 변경에 따른 날짜를 설정한다. / / /
 */
function setDatepickerDate ()
{
    $ ( '.date' ).change ( function ()
    {
        var dateType = $ ( "#dateType" ).val ();
        var fromDate = "";
        var toDate = "";
        if ( dateType === "D" ) // 일
        {
            fromDate = $ ( '#date01' ).val ().replace ( /-/g, '' );
            toDate = $ ( '#date04' ).val ().replace ( /-/g, '' );

            $ ( '#hidFromStdrYM' ).val ( fromDate.substring ( 0, 6 ) );
            $ ( '#hidToStdrYM' ).val ( toDate.substring ( 0, 6 ) );
        } else if ( dateType === "M" ) // 월
        {
            fromDate = $ ( '#date02' ).val ().replace ( /-/g, '' );
            toDate = $ ( '#date05' ).val ().replace ( /-/g, '' );

            $ ( '#hidFromStdrYM' ).val ( fromDate );
            $ ( '#hidToStdrYM' ).val ( toDate );
        } else if ( dateType === "Y" ) // 년
        {
            fromDate = $ ( '#date03' ).val ().replace ( /-/g, '' );
            toDate = $ ( '#date06' ).val ().replace ( /-/g, '' );

            $ ( '#hidFromStdrYM' ).val ( fromDate );
            $ ( '#hidToStdrYM' ).val ( toDate );
        }

        $ ( "#hidFromDate" ).val ( fromDate );
        $ ( "#hidToDate" ).val ( toDate );
    } );
}

/**
 * 날짜유형에 따라 검색 기간을 설정한다. / / /
 */
function initParams ()
{
    // 기본 날짜유형을 "일" 로 설정
    $ ( '#date01' ).val ( homUtil.getIntervalDate ( date, 'DA', -7 ) );
    $ ( '#date04' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );

    var fromDateYMD = $ ( '#date01' ).val ();
    var toDateYMD = $ ( '#date04' ).val ();

    $ ( '#hidFromDate' ).val ( fromDateYMD.replace ( /-/g, '' ) );
    $ ( '#hidToDate' ).val ( toDateYMD.replace ( /-/g, '' ) );

    // 월별 목표 기준 시작/종료 년월
    $ ( '#hidFromStdrYM' ).val ( fromDateYMD.replace ( /-/g, '' ).substring ( 0, 6 ) );
    $ ( '#hidToStdrYM' ).val ( toDateYMD.replace ( /-/g, '' ).substring ( 0, 6 ) );

    // console.log ( $ ( '#hidFromStdrYM' ).val () );
    // console.log ( $ ( '#hidToStdrYM' ).val () );

    // 전년 시작/종료 기간
    var beforeFromYMD = (parseInt ( fromDateYMD.replace ( /-/g, '' ).substring ( 0, 4 ), 10 ) - 1)
            + fromDateYMD.replace ( /-/g, '' ).substring ( 4 ); // 2015MMDD
    var beforeToYMD = (parseInt ( toDateYMD.replace ( /-/g, '' ).substring ( 0, 4 ), 10 ) - 1)
            + toDateYMD.replace ( /-/g, '' ).substring ( 4 ); // 2015MMDD

    $ ( '#hidBeforeYearFromDate' ).val ( beforeFromYMD );
    $ ( '#hidBeforeYearToDate' ).val ( beforeToYMD );

    setPeriodTitle ( fromDateYMD, toDateYMD );

    // 날짜 유형 기본 일로 설정
    $ ( "#dateType option:eq(0)" ).prop ( "selected", "selected" );
    customizeDateType ();

    $ ( "#dateType" ).change ( function ()
    {
        var fromDateYMD = "";
        var toDateYMD = "";
        if ( $ ( this ).val () === "D" ) // 일
        {
            $ ( '#date01' ).val ( homUtil.getIntervalDate ( date, 'DA', -7 ) );
            $ ( '#date04' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );

            fromDateYMD = $ ( '#date01' ).val ().replace ( /-/g, '' );
            toDateYMD = $ ( '#date04' ).val ().replace ( /-/g, '' );

            // 월별 목표 기준 시작/종료 년월
            $ ( '#hidFromStdrYM' ).val ( fromDateYMD.substring ( 0, 6 ) );
            $ ( '#hidToStdrYM' ).val ( toDateYMD.substring ( 0, 6 ) );

            // 전년 시작/종료 일
            var beforeFromYMD = (parseInt ( fromDateYMD.substring ( 0, 4 ), 10 ) - 1) + fromDateYMD.substring ( 4 ); // 2015MMDD
            var beforeToYMD = (parseInt ( toDateYMD.substring ( 0, 4 ), 10 ) - 1) + toDateYMD.substring ( 4 ); // 2015MMDD

            $ ( '#hidBeforeYearFromDate' ).val ( beforeFromYMD );
            $ ( '#hidBeforeYearToDate' ).val ( beforeToYMD );
        } else if ( $ ( this ).val () === "M" ) // 월
        {
            $ ( '#date02' ).val ( homUtil.getIntervalDate ( date, 'MO', -12 ) );
            $ ( '#date05' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMM ) );

            fromDateYMD = $ ( '#date02' ).val ().replace ( /-/g, '' );
            toDateYMD = $ ( '#date05' ).val ().replace ( /-/g, '' );

            // 월별 목표 기준 시작/종료 년월
            $ ( '#hidFromStdrYM' ).val ( fromDateYMD );
            $ ( '#hidToStdrYM' ).val ( toDateYMD );

            // 전년 시작/종료 일
            var beforeFromYMD = (parseInt ( fromDateYMD.substring ( 0, 4 ), 10 ) - 1) + fromDateYMD.substring ( 4 ); // 2015MMDD
            var beforeToYMD = (parseInt ( toDateYMD.substring ( 0, 4 ), 10 ) - 1) + toDateYMD.substring ( 4 ); // 2015MMDD

            $ ( '#hidBeforeYearFromDate' ).val ( beforeFromYMD );
            $ ( '#hidBeforeYearToDate' ).val ( beforeToYMD );
        } else
        // 년
        {
            $ ( '#date03' ).val ( homUtil.getIntervalDate ( date, 'YE', -6 ) );
            $ ( '#date06' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYY ) );

            fromDateYMD = $ ( '#date03' ).val ().replace ( /-/g, '' );
            toDateYMD = $ ( '#date06' ).val ().replace ( /-/g, '' );

            // 월별 목표 기준 시작/종료 년월
            $ ( '#hidFromStdrYM' ).val ( fromDateYMD );
            $ ( '#hidToStdrYM' ).val ( toDateYMD );

            // 전년 시작/종료 일
            var beforeFromYMD = (parseInt ( fromDateYMD.substring ( 0 ), 10 ) - 1); // 2015MMDD
            var beforeToYMD = (parseInt ( toDateYMD.substring ( 0 ), 10 ) - 1); // 2015MMDD

            $ ( '#hidBeforeYearFromDate' ).val ( beforeFromYMD );
            $ ( '#hidBeforeYearToDate' ).val ( beforeToYMD );
        }

        $ ( '#hidFromDate' ).val ( fromDateYMD );
        $ ( '#hidToDate' ).val ( toDateYMD );
    } );

    // 접속반 목록 및 설비별 순위 비활성화
    // $ ( '#jbTitle' ).addClass ( 'dnone' );
    // $ ( '#jbList' ).addClass ( 'dnone' );
    // $ ( '#eqmtAtRanking' ).addClass ( 'dnone' );

    $ ( '#jbTitle' ).hide ();
    $ ( '#jbList' ).hide ();
    $ ( '#eqmtAtRanking' ).hide ();
}

/**
 * 기간 타이틀을 설정한다.
 * 
 * @param fromDate
 *            조회 시작
 * @param toDate
 *            조회 종료 / / /
 */
function setPeriodTitle ( fromDate, toDate )
{
    fromDate = homUtil.convertDateStringToPureFormat ( fromDate );
    toDate = homUtil.convertDateStringToPureFormat ( toDate );

    if ( fromDate.length === 4 )
    {
        // 발전량 현황 타이틀
        $ ( '.period' ).text ( fromDate + "~" + toDate );

    } else if ( fromDate.length === 6 )
    {
        // 발전량 현황 타이틀
        $ ( '.period' ).text (
                homUtil.convertDateStringToFormat ( fromDate, 'yyyyMM' ) + "~"
                        + homUtil.convertDateStringToFormat ( toDate, 'yyyyMM' ) );
    } else if ( fromDate.length === 8 )
    {
        // 발전량 현황 타이틀
        $ ( '.period' ).text (
                homUtil.convertDateStringToFormat ( fromDate, 'yyyyMMdd' ) + "~"
                        + homUtil.convertDateStringToFormat ( toDate, 'yyyyMMdd' ) );
    }
}

/*
 * 검색 조건에 대한 유효성을 검사한다.
 */
function validateCondition ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = null;
    var toDate = null;
    var result = false;

    if ( dateType === "D" ) // 일
    {
        fromDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#date01' ).val ().replace ( /-/g, '' ),
                homUtil.dateFormat.formatYYYYMMDD ) );
        toDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#date04' ).val ().replace ( /-/g, '' ),
                homUtil.dateFormat.formatYYYYMMDD ) );
    } else if ( dateType === "M" ) // 월
    {
        fromDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#date02' ).val ().replace ( /-/g, '' ),
                homUtil.dateFormat.formatYYYYMM ) );
        toDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#date05' ).val ().replace ( /-/g, '' ),
                homUtil.dateFormat.formatYYYYMM ) );
    } else if ( dateType === "Y" ) // 년
    {
        fromDate = $ ( '#date03' ).val ();
        toDate = $ ( '#date06' ).val ();
    }

    // 날짜 비교
    if ( dateType === "D" || dateType === "M" )
    {
        if ( fromDate.getTime () > toDate.getTime () )
        {
            result = true;
        }
    } else
    // 년
    {
        var diff = parseInt ( fromDate, 10 ) - parseInt ( toDate, 10 );
        if ( diff > 0 )
        {
            result = true;
        }
    }
    return result;
}

/*
 * 발전량 차트 목록 조회
 */
function getEnergyChartList ()
{
    // console.log ( "getEnergyChartList begin" );

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEnergyChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    $ ( '#graph1' ).show ();
                    $ ( '#graph1NoData' ).hide ();

                    var dateType = $ ( "#dateType" ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;
                    var txtFromDate = null;
                    var txtToDate = null;
                    var date1 = null;
                    var date2 = null;

                    if ( dateType === 'D' )
                    {
                        txtFromDate = $ ( '#date01' ).val ().replace ( /-/g, '' );
                        txtToDate = $ ( '#date04' ).val ().replace ( /-/g, '' );

                        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ),
                                10 ) - 1, txtFromDate.substring ( 6, 8 ) );
                        date2 = new Date ( txtToDate.substring ( 0, 4 ),
                                parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, txtToDate.substring ( 6, 8 ) );
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === 'M' )
                    {
                        txtFromDate = $ ( '#date02' ).val ().replace ( /-/g, '' );
                        txtToDate = $ ( '#date05' ).val ().replace ( /-/g, '' );

                        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ),
                                10 ) - 1, 1 );
                        date2 = new Date ( txtToDate.substring ( 0, 4 ),
                                parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, 1 );
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === 'Y' )
                    {
                        txtFromDate = $ ( '#date03' ).val ();
                        txtToDate = $ ( '#date06' ).val ();

                        date1 = new Date ( txtFromDate, 0, 1 );
                        date2 = new Date ( txtToDate, 0, 1 );
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    var goalEnergys = []; // 목표 발전량
                    var beforeyearEnergys = []; // 전년 발전량
                    var expectedEnergys = []; // 예상 발전량
                    var acmsltEnergys = []; // 실적 발전량

                    $.each ( json.data, function ( index, item )
                    {
                        var itemStdrDate = item.stdrDate.toString ().replace ( /-/g, '' );
                        var stdrDate = null;

                        if ( dateType === 'D' )
                        {
                            stdrDate = new Date ( itemStdrDate.substring ( 0, 4 ), itemStdrDate.substring ( 4, 6 ) - 1,
                                    itemStdrDate.substring ( 6, 8 ) );
                        }
                        if ( dateType === 'M' )
                        {
                            stdrDate = new Date ( itemStdrDate.substring ( 0, 4 ), itemStdrDate.substring ( 4, 6 ) - 1,
                                    1 );
                        }
                        if ( dateType === 'Y' )
                        {
                            stdrDate = new Date ( itemStdrDate.substring ( 0, 4 ), 0, 1 );
                        }

                        stdrDate = stdrDate.getTime ();

                        goalEnergys.push ( [ stdrDate,
                                homUtil.mathFloor ( item.goalEnergy, staticVariable.decimalPoint ) ] );
                        beforeyearEnergys.push ( [ stdrDate,
                                homUtil.mathFloor ( item.beforeyearEnergy, staticVariable.decimalPoint ) ] );
                        expectedEnergys.push ( [ stdrDate,
                                homUtil.mathFloor ( item.expectedEnergy, staticVariable.decimalPoint ) ] );
                        acmsltEnergys.push ( [ stdrDate,
                                homUtil.mathFloor ( item.acmsltEnergy, staticVariable.decimalPoint ) ] );
                    } );

                    homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

                    $ ( '#graph1' ).highcharts ( {
                        chart : {
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
                            },
                            min : date1.getTime (),
                            max : date2.getTime ()
                        },
                        yAxis : {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_energy + '(' + json.data[0].energyUnitNm + ')'
                            }
                        },
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                        plotOptions : {
                            column : {
                                pointPadding : 0.1,
                                borderWidth : 0
                            }
                        },
                        series : [ {
                            type : 'column',
                            yAxis : 0,
                            color : '#8585a8',
                            name : i18nMessage.msg_targetEnergy,
                            data : goalEnergys
                        }, {
                            type : 'column',
                            yAxis : 0,
                            color : '#a9aeb6',
                            name : i18nMessage.msg_lastYearEnergy,
                            data : beforeyearEnergys
                        }, {
                            type : 'column',
                            yAxis : 0,
                            color : '#e0dcd8',
                            name : i18nMessage.msg_expectedEnergy,
                            data : expectedEnergys
                        }, {
                            type : 'column',
                            yAxis : 0,
                            color : '#ff881e',
                            name : i18nMessage.msg_actualEnergy,
                            data : acmsltEnergys
                        } ]
                    } );
                } else
                {
                    $ ( '#graph1' ).hide ();
                    $ ( '#graph1NoData' ).show ();
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
 * 발전량 조회 / / /
 */
function searchEnergy ()
{
    $ ( '#btnSubmit' ).on ( 'click', function ()
    {
        // 시작 날짜 포맷 체크
        if ( validateDate ( "from" ) )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validFromDateFormat,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            return false;
        }

        // 종료 날짜 포맷 체크
        if ( validateDate ( "to" ) )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validToDateFormat,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            return false;
        }

        if ( validateCondition () )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_dateCanNotStartDateTheFutureEndDate,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            return false;
        }

        var isChecked = $ ( '#chkEqmtRanking' ).is ( ":checked" );
        var eqmtGrpCd = $ ( '#eqmtId' ).val ();

        // 템플릿 로드
        getContentTemplate ( eqmtGrpCd );

        initUnit ();

        setPeriodTitle ( $ ( '#hidFromDate' ).val (), $ ( '#hidToDate' ).val () );

        if ( eqmtGrpCd === "" ) // 발전소 전체
        {
            $ ( '#jbTitle' ).hide ();
            $ ( '#eqmtAtRanking' ).hide ();
            $ ( '#jbList' ).hide ();
            $ ( '#chkEqmtRanking' ).prop ( 'checked', false );

            removeCustomSelect ( $ ( '#jbList' ) );

            getEnergyChartList ();
            customizeJqgrid ();
            // searchEnergy ();
            showPopup ();
            downloadExcel ();
        } else
        {
            // 설비별 순위 조회 체크한 경우
            if ( isChecked )
            {
                // 발전량 차이 타이틀 활성화
                $ ( '.grid_noti' ).removeClass ( 'dnone' );

                getEnergyStatsChartListAtRanking ();
                customizeJqgridAtRanking ();
                showPopup ();
                downloadExcel ();

                // reloadJqgrid ( $ ( '#gridList' ) );
            } else
            {
                if ( eqmtGrpCd === "STR" )
                {
                    // 스트링
                    var $jbList = $ ( '#jbList' );
                    getEqmtCpctyListAtStr ( $jbList.val () );
                    getEnergyStatsChartListAtStr ( $jbList.val () );
                } else
                {
                    // VCB, ACB, IVT, JUN
                    getEqmtCpctyRatioListAt ( eqmtGrpCd );
                    getEnergyStatsChartListAt ( eqmtGrpCd );
                    // customizeJqgridAt ();
                }
                customizeJqgridAt ();
                showPopup ();
                downloadExcelAt ();
            }
        }
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();
    var eqmtGrpCd = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var goalFromStdrYM = $ ( '#hidFromStdrYM' ).val ();
    var goalToStdrYM = $ ( '#hidToStdrYM' ).val ();
    var beforeYearFromDate = $ ( '#hidBeforeYearFromDate' ).val ();
    var beforeYearToDate = $ ( '#hidBeforeYearToDate' ).val ();
    var unit = $ ( '#hidUnit' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtGrpCd,
            isEqmtGrp : isEqmtGrp,
            goalFromStdrYM : goalFromStdrYM,
            goalToStdrYM : goalToStdrYM,
            beforeYearFromDate : beforeYearFromDate,
            beforeYearToDate : beforeYearToDate,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

/**
 * 팝업을 보여준다. / / /
 */
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
 * 엑셀 다운로드 / / /
 */
function downloadExcel ()
{

    $ ( '#btnExcel' ).click (
            function ()
            {
                var $graph = $ ( '#graph1' );

                var chart = $graph.highcharts ();

                if ( _.isEmpty ( chart.userOptions.xAxis.categories ) )
                {
                    chart.userOptions.xAxis.categories = chart.xAxis[0].categories;
                }

                // chart.userOptions.yAxis[0].setExtremes ( chart.yAxis[0].min, chart.yAxis[0].max );

                var optionsStr = JSON.stringify ( chart.userOptions );
                var exportUrl = 'http://export.highcharts.com/';
                // var dataString = encodeURI ( 'async=true&type=png&width=' + $graph.width () + '&options=' +
                // optionsStr );
                var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

                var url = "";
                var isChecked = $ ( '#chkEqmtRanking' ).is ( ":checked" );
                if ( isChecked )
                {
                    url = contextPath + '/hom/excel/anals/dvlpateqmtranking/download.do';
                } else
                {
                    url = contextPath + '/hom/excel/anals/dvlp/download.do';
                }

                $.ajax ( {
                    type : 'POST',
                    data : dataString,
                    url : exportUrl,
                    success : function ( data )
                    {
                        $ ( 'form' ).prop ( 'action', url );
                        $ ( 'form' ).prepend (
                                '<input type="hidden" name="url" value="' + exportUrl + data
                                        + '" /><input type="hidden" name="eqmtNm" value="'
                                        + $ ( '#eqmtId option:selected' ).text () + '" />' );

                        $ ( 'form' ).submit ();

                        $ ( 'input[name=url]' ).remove ();
                        $ ( 'input[name=eqmtNm]' ).remove ();
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

/**
 * 접속반 목록 조회 / / /
 */
function getJbList ()
{
    $ ( '#eqmtId' ).change (
            function ()
            {
                var eqmtGrpCd = $ ( this ).val ();

                // 기간조회 발전량 템플릿 로드
                // getContentTemplate ( eqmtGrpCd );

                // initUnit ();

                // 발전소 전체
                if ( eqmtGrpCd === "" )
                {
                    $ ( '#jbTitle' ).hide ();
                    $ ( '#eqmtAtRanking' ).hide ();
                    $ ( '#jbList' ).hide ();
                    $ ( '#chkEqmtRanking' ).prop ( 'checked', false );

                    removeCustomSelect ( $ ( '#jbList' ) );

                    // getEnergyChartList ();
                    // customizeJqgrid ();
                    // searchEnergy ();
                    // showPopup ();
                    // downloadExcel ();
                } else
                {
                    $ ( '#jbTitle' ).hide ();
                    $ ( '#eqmtAtRanking' ).show (); // 설비별 순위 조회 체크박스 활성화

                    var $chkEqmtAtRanking = $ ( '#chkEqmtRanking' );
                    var isChecked = $chkEqmtAtRanking.is ( ":checked" );

                    if ( eqmtGrpCd === "STR" ) // 스트링 일 경우
                    {
                        var $jbList = $ ( '#jbList' );
                        $ ( '#jbTitle' ).show ();
                        $jbList.show ();

                        $.ajax ( {
                            url : contextPath + '/hom/analysis/energy/selectJbList.ajax',
                            type : 'POST',
                            dataType : 'json',
                            success : function ( json )
                            {
                                if ( json.status === staticVariable.jsonStatusSuccess )
                                {
                                    if ( json.data.length > 0 )
                                    {
                                        var jbListOptionTpl = getTemplate ( contextPath
                                                + '/template/anals/prElcPwStnAnals/jbListOption.html' );

                                        if ( jbListOptionTpl !== null )
                                        {
                                            $jbList.html ( "" );

                                            var template = _.template ( jbListOptionTpl );
                                            var html = template ( {
                                                jbList : json.data
                                            } );

                                            $jbList.append ( html );

                                            customizeSelect ( $jbList );
                                        }
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

                        // console.log ( isChecked );

                        if ( isChecked ) // 설비별 순위 조회
                        {
                            // 설비별 순위 조회 템플릿 로드
                            // getContentTemplate ( eqmtGrpCd );

                            // 발전량 차이 타이틀 활성화
                            // $ ( '.grid_noti' ).removeClass ( 'dnone' );

                            // getEnergyStatsChartListAtRanking ();
                            // customizeJqgridAtRanking ();
                        } else
                        {
                            // eqmtGrpCd = $ ( "#jbList option:selected" ).val ();
                            // if ( typeof eqmtGrpCd === 'undefined' || eqmtGrpCd === null )
                            // {
                            // eqmtGrpCd = "JUN0001";
                            // }

                            // console.log ( "eqmtGrpCd " + eqmtGrpCd );

                            // getEqmtCpctyListAtStr ( eqmtGrpCd ); // 설치용량 및 비율
                            // getEnergyStatsChartListAtStr ( eqmtGrpCd ); // 발전량 통계

                            // customizeJqgridAt (); // 발전량 그리드
                            // getEnergyStatsListAt ();
                        }
                    } else
                    {
                        // VCB, ACB, IVT, JUN...
                        removeCustomSelect ( $ ( '#jbList' ) );
                        $ ( '#jbList' ).hide ();

                        // console.log ( "isChecked " + isChecked );

                        if ( isChecked ) // 설비별 순위 조회
                        {
                            // 설비별 순위 조회 템플릿 로드
                            // getContentTemplate ( eqmtGrpCd );

                            // 발전량 차이 타이틀 활성화
                            // $ ( '.grid_noti' ).removeClass ( 'dnone' );

                            // getEnergyStatsChartListAtRanking ();
                            // customizeJqgridAtRanking ();
                        } else
                        {
                            // getEqmtCpctyRatioListAt ( eqmtGrpCd );
                            // getEnergyStatsChartListAt ( eqmtGrpCd );

                            // customizeJqgridAt (); // 발전량 그리드
                            // getEnergyStatsListAt ();
                        }
                    }

                    // showPopup ();
                    // downloadExcelAt ();
                }
            } );
}

/**
 * 단위 항목 목록을 가져온다. / / /
 */
function getUnitItemList ()
{
    var unitItemList = null;

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectUnitItemList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // console.log ( json.data );

                if ( json.data !== null )
                {
                    unitItemList = json.data;

                    // console.log ( unitItemList );
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

    return unitItemList;
}

/**
 * 설비 그룹 별 컨텐츠 템플릿을 가져온다. / / /
 */
function getContentTemplate ( eqmtGrpCd )
{
    // 발전량 템플릿
    var dvlpAnalsTpl = null;
    var isEqmtRanking = "N"; // 설비 별 우선 순위 조회 체크 여부

    // 발전소 전체
    if ( eqmtGrpCd === "" )
    {
        eqmtGrpCd = "period";

        dvlpAnalsTpl = getTemplate ( contextPath + '/template/anals/prElcPwStnAnals/dvlpAnalsDefaultContents.html' );
    } else
    {
        // 설비별 우선순위 체크
        var isChecked = $ ( '#chkEqmtRanking' ).is ( ":checked" );
        if ( isChecked )
        {
            isEqmtRanking = "Y";
            dvlpAnalsTpl = getTemplate ( contextPath + '/template/anals/prElcPwStnAnals/dvlpAnalsDefaultContents.html' );
            $ ( '.grid_noti' ).removeClass ( 'dnone' );
        } else
        {
            isEqmtRanking = "N";
            dvlpAnalsTpl = getTemplate ( contextPath + '/template/anals/prElcPwStnAnals/dvlpAnalsContents.html' );
        }
    }

    if ( dvlpAnalsTpl !== null )
    {
        $ ( '#contents' ).html ( "" );

        var template = _.template ( dvlpAnalsTpl );

        // 차트 기간 타이틀
        var dateType = $ ( '#dateType' ).val ();
        var period = "";
        if ( dateType === "D" )
        {
            period = $ ( '#date01' ).val () + "~" + $ ( '#date04' ).val ();
        } else if ( dateType === "M" )
        {
            period = $ ( '#date02' ).val () + "~" + $ ( '#date05' ).val ();
        } else
        {
            period = $ ( '#date03' ).val () + "~" + $ ( '#date06' ).val ();
        }

        // 단위변환 항목
        // var unitItemList = getUnitItemList ();
        // console.log ( unitItemList );

        var html = template ( {
            period : period,
            popType : eqmtGrpCd.toLowerCase (),
            contextPath : contextPath,
            isEqmtRanking : isEqmtRanking
        } );

        $ ( '#contents' ).html ( html );
    }
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 발전량 통계-스트링 별
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 스트링 별 발전량 그리드 헤더 병합 / / /
 */
function addGroupHeaderAt ()
{
    var groupHeaderName = 'User';
    $ ( "#gridList2" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'energySum',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy + '(MWh)'
        } ]
    } );
}

/**
 * 설비 그룹 별 발전량 jqGrid 초기화 / / /
 */
function jqGridBasicAt ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();
    var eqmtId = $ ( '#jbList' ).val ();
    var eqmtGrpCd = $ ( '#eqmtId' ).val ();
    var unit = $ ( '#hidUnit' ).val ();

    var tpl = getTemplate ( templates.noData );

    var url = "";
    if ( eqmtGrpCd === "STR" )
    {
        url = contextPath + '/hom/analysis/energy/selectEnergyStatsGridListAtStr.ajax';
    } else
    {
        eqmtId = eqmtGrpCd;
        url = contextPath + '/hom/analysis/energy/selectEnergyStatsGridListAt.ajax';
    }

    $ ( '#gridList2' ).jqGrid (
            {
                url : url,
                mtype : 'POST',
                datatype : 'json',
                height : 650,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    isEqmtGrp : eqmtGrpCd,
                    jbEqmtId : eqmtId,
                    unit : unit
                },
                rowNum : staticVariable.gridRow30,
                sortname : "No",
                sortorder : "asc",
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                page : 1,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_sum,
                        i18nMessage.msg_acmslt, i18nMessage.msg_ratio + i18nMessage.msg_unitPercent, "energyUnitNm" ],
                colModel : [ {
                    name : 'stdrDate',
                    index : '',
                    align : 'center',
                    width : '80'
                }, {
                    name : 'eqmtNm',
                    index : '',
                    align : 'left',
                    width : '80'
                }, {
                    name : 'energySum',
                    index : '',
                    align : 'right',
                    width : '80',
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'acmsltEnergy',
                    index : '',
                    align : 'right',
                    width : '80',
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyRatio',
                    index : '',
                    align : 'right',
                    width : '65',
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyUnitNm',
                    index : '',
                    align : 'center',
                    width : '65',
                    hidden : true
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
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " " + data.records
                            + i18nMessage.msg_count;
                    $ ( "#totalRowCount" ).text ( resultText );

                    var $gridList = $ ( '#gridList2' );
                    var ids = $gridList.jqGrid ( "getDataIDs" );
                    var cl = ids[0];
                    var rowData = $gridList.getRowData ( cl );

                    console.log ( rowData );

                    var energyUnitNm = rowData.energyUnitNm;
                    if ( typeof energyUnitNm === 'undefined' )
                    {
                        energyUnitNm = getHeaderUnit ();
                    }

                    // 발전량
                    $ ( '#gridList2_eqmtNm' ).next ( 'th' ).html ( i18nMessage.msg_energy + '(' + energyUnitNm + ')' );
                },
                gridComplete : function ()
                {
                    // console.log ( ">>>>> gridComplete " );

                    // 그리드 셀 병합
                    $ ( this ).rowspan ( 1, 1 );
                    $ ( this ).rowspan ( 3, 3 );
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList2' ).parent ().append ( html );
    }
}

/**
 * 스트링 별 발전량 customizeJqgrid / / /
 */
function customizeJqgridAt ()
{
    var $gridBox = $ ( '#gbox_gridList2' );
    $gridBox.remove ();
    $ ( '<table/>' ).attr ( 'id', 'gridList2' ).appendTo ( '.grid_tbl_wrap' );

    jqGridBasicAt ();
    addGroupHeaderAt ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

/**
 * 스트링 별 설치용량 및 설치용량 비율 조회 / / /
 */
function getEqmtCpctyListAtStr ( eqmtId )
{
    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEqmtCpctyListAtStr.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            eqmtId : eqmtId
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    $ ( '#graph3' ).show ();
                    $ ( '#graph3NoData' ).hide ();

                    var colors = [ '#fabd17', '#7ab800', '#910000', '#00b2ff', '#492970', '#f28f43', '#a6c96a',
                            '#005b82', '#30c386', '#e37222', '#c9b519', '#be00ac', '#0c4746', '#8f8f92', '#bebebd' ];

                    var colorMaxIndex = 14;
                    var colorIndex = 0;
                    var series = [];

                    $.each ( json.data, function ( index, item )
                    {
                        colorIndex = index;
                        if ( index === colorMaxIndex )
                        {
                            colorIndex = 0;
                        }

                        series.push ( {
                            type : 'bar',
                            yAxis : 0,
                            // color : colors[colorIndex],
                            name : item.eqmtKorNm,
                            data : [ parseInt ( item.eqmtCpcty, 10 ) ]
                        } );
                    } );

                    homUtil.clearHighcharts ( [ $ ( '#graph3' ).highcharts () ] );

                    // 그래프1
                    $ ( '#graph3' ).highcharts ( {
                        colors : homUtil.getHighchartsColors (),
                        chart : {
                            marginTop : 50,
                            marginLeft : 115
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
                            categories : [ i18nMessage.msg_string + " " + i18nMessage.msg_facilityCapacity ],
                            crosshair : true,
                            labels : {
                                align : 'left',
                                x : -110
                            }
                        },
                        yAxis : [ {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_ratio + "(%)",
                                marginLeft : 50,
                                y : 5
                            }
                        } ],
                        legend : {
                            enabled : false
                        },
                        plotOptions : {
                            bar : {
                                pointPadding : 0,
                                borderWidth : 0,
                                pointWidth : 15,
                                stacking : 'percent'
                            }
                        },
                        series : series
                    } );

                } else
                {
                    $ ( '#graph3' ).hide ();
                    $ ( '#graph3NoData' ).show ();
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
 * 스트링 별 발전량 통계 차트 목록 조회 / / /
 */
function getEnergyStatsChartListAtStr ( eqmtId )
{
    $ ( '#isEqmtGrp' ).val ( $ ( '#eqmtId' ).val () );
    $ ( '#jbEqmtId' ).val ( eqmtId );

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEnergyStatsChartListAtStr.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            $ ( '#isEqmtGrp' ).val ( '' );
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    $ ( '#graph4' ).show ();
                    $ ( '#graph4NoData' ).hide ();

                    var dateType = $ ( "#dateType" ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;
                    var txtFromDate = null;
                    var txtToDate = null;
                    var date1 = null;
                    var date2 = null;

                    if ( dateType === 'D' )
                    {
                        txtFromDate = $ ( '#date01' ).val ().replace ( /-/g, '' );
                        txtToDate = $ ( '#date04' ).val ().replace ( /-/g, '' );

                        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ),
                                10 ) - 1, txtFromDate.substring ( 6, 8 ) );
                        date2 = new Date ( txtToDate.substring ( 0, 4 ),
                                parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, txtToDate.substring ( 6, 8 ) );
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === 'M' )
                    {
                        txtFromDate = $ ( '#date02' ).val ().replace ( /-/g, '' );
                        txtToDate = $ ( '#date05' ).val ().replace ( /-/g, '' );

                        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ),
                                10 ) - 1, 1 );
                        date2 = new Date ( txtToDate.substring ( 0, 4 ),
                                parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, 1 );
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === 'Y' )
                    {
                        txtFromDate = $ ( '#date03' ).val ();
                        txtToDate = $ ( '#date06' ).val ();

                        date1 = new Date ( txtFromDate, 0, 1 );
                        date2 = new Date ( txtToDate, 0, 1 );
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    var eqmtNms = [];
                    var eqmtIds = [];

                    $.each ( json.data, function ( index, item )
                    {
                        eqmtIds.push ( item.eqmtId );
                        eqmtNms.push ( item.eqmtNm );
                    } );

                    // 중복 값 제거
                    var uniqEqmtIds = _.uniq ( eqmtIds );
                    var uniqEqmtNms = _.uniq ( eqmtNms );

                    // 설비 정보 생성
                    var uniqEqmtInfos = {
                        eqmtIds : uniqEqmtIds,
                        eqmtNms : uniqEqmtNms
                    };

                    var series = [];
                    for ( var i = 0; i < uniqEqmtInfos.eqmtIds.length; i++ )
                    {
                        var chartData = [];
                        chartData.push ( createChartData ( uniqEqmtInfos.eqmtIds[i], json.data ) );

                        series.push ( {
                            type : 'column',
                            yAxis : 0,
                            name : uniqEqmtInfos.eqmtNms[i],
                            data : chartData[0]
                        } );
                    }

                    homUtil.clearHighcharts ( [ $ ( '#graph4' ).highcharts () ] );

                    $ ( '#graph4' ).highcharts ( {
                        colors : homUtil.getHighchartsColors (),
                        chart : {
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
                            },
                            min : date1.getTime (),
                            max : date2.getTime ()
                        },
                        yAxis : [ {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_energy + "(" + json.data[0].energyUnitNm + ")"
                            }
                        } ],
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                        plotOptions : {
                            column : {
                                pointPadding : 0,
                                borderWidth : 0,
                                stacking : 'normal'
                            }
                        },
                        series : series
                    } );
                } else
                {
                    $ ( '#graph4' ).hide ();
                    $ ( '#graph4NoData' ).show ();
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
 * 스트링 별 차트 및 그리드 조회 / / /
 */
// function getEnergyStatsListAt ()
// {
// var eqmtId = "";
// var eqmtGrpCd = $ ( '#eqmtId' ).val ();
//
// $ ( '#jbList' ).change ( function ()
// {
// if ( eqmtGrpCd === "STR" )
// {
// eqmtId = $ ( this ).val ();
//
// getEqmtCpctyListAtStr ( eqmtId );
// getEnergyStatsChartListAtStr ( eqmtId );
// } else
// {
// eqmtId = eqmtGrpCd;
//
// getEqmtCpctyRatioListAt ( eqmtId );
// getEnergyStatsChartListAt ( eqmtId );
// }
//
// reloadJqgrid ( $ ( '#gridList2' ) );
// } );
// }
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 설비 그룹 별 설치 용량 및 용량 비율 조회 / / /
 */
function getEqmtCpctyRatioListAt ( eqmtGrpCd )
{
    // 차트 카테고리
    $ ( '#jbEqmtId' ).val ( eqmtGrpCd );

    var categoriesStr = getCategoriesByEqmtGrpCd ( eqmtGrpCd );

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEqmtCpctyListAt.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    $ ( '#graph3' ).show ();
                    $ ( '#graph3NoData' ).hide ();

                    homUtil.clearHighcharts ( [ $ ( '#graph3' ).highcharts () ] );

                    var colors = [ '#fabd17', '#7ab800', '#910000', '#00b2ff', '#492970', '#f28f43', '#a6c96a',
                            '#005b82', '#30c386', '#e37222', '#c9b519', '#be00ac', '#0c4746', '#8f8f92', '#bebebd' ];

                    var colorMaxIndex = 14;
                    var colorIndex = 0;
                    var series = [];
                    $.each ( json.data, function ( index, item )
                    {
                        colorIndex = index;
                        if ( index === colorMaxIndex )
                        {
                            colorIndex = 0;
                        }

                        series.push ( {
                            type : 'bar',
                            yAxis : 0,
                            // color : colors[colorIndex],
                            name : item.eqmtKorNm,
                            data : [ parseInt ( item.eqmtCpcty, 10 ) ]
                        } );
                    } );

                    // 그래프1
                    $ ( '#graph3' ).highcharts ( {
                        colors : homUtil.getHighchartsColors (),
                        chart : {
                            marginTop : 50,
                            marginLeft : 115
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
                            // categories : [ '접속반 설치 용량' ],
                            categories : [ categoriesStr ],
                            crosshair : true,
                            labels : {
                                align : 'left',
                                x : -110
                            }
                        },
                        yAxis : [ {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_ratio + " %",
                                // align : 'middle',
                                marginLeft : 50,
                                y : 5
                            }
                        } ],
                        legend : {
                            enabled : false
                        },
                        plotOptions : {
                            bar : {
                                pointPadding : 0,
                                borderWidth : 0,
                                pointWidth : 15,
                                stacking : 'percent'
                            }
                        },
                        series : series
                    } );

                    // / getEnergyStatsChartListAt ();
                    // / customizeJqgridAt ();
                    // showPopup ();
                    // downloadExcelAt ();

                } else
                {
                    $ ( '#graph3' ).hide ();
                    $ ( '#graph3NoData' ).show ();
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
 * 설비 그룹 별 발전량 통계 차트 목록 조회 / / /
 */
function getEnergyStatsChartListAt ()
{
    $ ( '#jbEqmtId' ).val ( $ ( '#eqmtId' ).val () );

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEnergyStatsChartListAt.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    $ ( '#graph4' ).show ();
                    $ ( '#graph4NoData' ).hide ();

                    var dateType = $ ( "#dateType" ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;
                    var txtFromDate = null;
                    var txtToDate = null;
                    var date1 = null;
                    var date2 = null;

                    if ( dateType === 'D' )
                    {
                        txtFromDate = $ ( '#date01' ).val ().replace ( /-/g, '' );
                        txtToDate = $ ( '#date04' ).val ().replace ( /-/g, '' );

                        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ),
                                10 ) - 1, txtFromDate.substring ( 6, 8 ) );
                        date2 = new Date ( txtToDate.substring ( 0, 4 ),
                                parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, txtToDate.substring ( 6, 8 ) );
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === 'M' )
                    {
                        txtFromDate = $ ( '#date02' ).val ().replace ( /-/g, '' );
                        txtToDate = $ ( '#date05' ).val ().replace ( /-/g, '' );

                        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ),
                                10 ) - 1, 1 );
                        date2 = new Date ( txtToDate.substring ( 0, 4 ),
                                parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, 1 );
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === 'Y' )
                    {
                        txtFromDate = $ ( '#date03' ).val ();
                        txtToDate = $ ( '#date06' ).val ();

                        date1 = new Date ( txtFromDate, 0, 1 );
                        date2 = new Date ( txtToDate, 0, 1 );
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    var eqmtNms = [];
                    var eqmtIds = [];
                    $.each ( json.data, function ( index, item )
                    {
                        eqmtIds.push ( item.eqmtId );
                        eqmtNms.push ( item.eqmtNm );
                    } );

                    // 중복 값 제거
                    var uniqEqmtIds = _.uniq ( eqmtIds );
                    var uniqEqmtNms = _.uniq ( eqmtNms );

                    // 설비 정보 생성
                    var uniqEqmtInfos = {
                        eqmtIds : uniqEqmtIds,
                        eqmtNms : uniqEqmtNms
                    };

                    var series = [];
                    for ( var i = 0; i < uniqEqmtInfos.eqmtIds.length; i++ )
                    {
                        var chartData = [];
                        chartData.push ( createChartData ( uniqEqmtInfos.eqmtIds[i], json.data ) );

                        series.push ( {
                            type : 'column',
                            yAxis : 0,
                            name : uniqEqmtInfos.eqmtNms[i],
                            data : chartData[0]
                        } );
                    }

                    homUtil.clearHighcharts ( [ $ ( '#graph4' ).highcharts () ] );

                    $ ( '#graph4' ).highcharts ( {
                        colors : homUtil.getHighchartsColors (),
                        chart : {
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
                            },
                            min : date1.getTime (),
                            max : date2.getTime ()
                        },
                        yAxis : [ {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_energy + "(" + json.data[0].energyUnitNm + ")"
                            }
                        } ],
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                        plotOptions : {
                            column : {
                                pointPadding : 0,
                                borderWidth : 0,
                                stacking : 'normal'
                            }
                        },
                        series : series
                    } );
                } else
                {
                    $ ( '#graph4' ).hide ();
                    $ ( '#graph4NoData' ).show ();
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
 * 통계 일자 별 설비 별 차트 데이터를 생성한다. / / /
 */
function createChartData ( eqmtId, acmsltEnergyData )
{
    var data = [];
    var dateType = $ ( "#dateType" ).val ();

    $.each ( acmsltEnergyData, function ( index, item )
    {
        if ( eqmtId === item.eqmtId )
        {
            var itemStdrDate = item.stdrDate.toString ().replace ( /-/g, '' );
            var stdrDate = null;
            if ( dateType === 'D' )
            {
                stdrDate = new Date ( itemStdrDate.substring ( 0, 4 ), itemStdrDate.substring ( 4, 6 ) - 1,
                        itemStdrDate.substring ( 6, 8 ) );
            }
            if ( dateType === 'M' )
            {
                stdrDate = new Date ( itemStdrDate.substring ( 0, 4 ), itemStdrDate.substring ( 4, 6 ) - 1, 1 );
            }
            if ( dateType === 'Y' )
            {
                stdrDate = new Date ( itemStdrDate.substring ( 0, 4 ), 0, 1 );
            }

            stdrDate = stdrDate.getTime ();

            data.push ( [ stdrDate, homUtil.mathFloor ( item.acmsltEnergy, staticVariable.decimalPoint ) ] );
        }
    } );

    return data;
}

/**
 * 접속반 별 엑셀 다운로드 / / /
 */
function downloadExcelAt ()
{
    $ ( '#btnExcel2' )
            .click (
                    function ()
                    {
                        var $graph3 = $ ( '#graph3' ); // 설비 설치 / 용량 비율 차트
                        var $graph4 = $ ( '#graph4' ); // 발전량 통계 차트
                        var exportUrl = 'http://export.highcharts.com/';

                        var optionsStr1 = JSON.stringify ( $graph3.highcharts ().userOptions );
                        var optionsStr2 = JSON.stringify ( $graph4.highcharts ().userOptions );

                        var dataStrs = [];
                        dataStrs.push ( encodeURI ( 'async=true&type=png&width=' + $graph3.width () + '&options='
                                + optionsStr1 ) );
                        dataStrs.push ( encodeURI ( 'async=true&type=png&width=' + $graph4.width () + '&options='
                                + optionsStr2 ) );

                        var url = "";
                        var eqmtId = $ ( '#eqmtId' ).val ();
                        if ( eqmtId === "STR" )
                        {
                            url = contextPath + '/hom/excel/anals/dvlpatstr/download.do';
                            $ ( '#isEqmtGrp' ).val ( $ ( '#eqmtId' ).val () );
                        } else
                        {
                            url = contextPath + '/hom/excel/anals/dvlpatjun/download.do';
                        }

                        var imgUrls = [];
                        for ( var i = 0; i < dataStrs.length; i++ )
                        {
                            $.ajax ( {
                                type : 'POST',
                                data : dataStrs[i],
                                url : exportUrl,
                                async : false,
                                success : function ( data )
                                {
                                    imgUrls.push ( exportUrl + data );
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

                        if ( imgUrls.length > 0 )
                        {
                            $ ( '#jbEqmtId' ).val ( $ ( '#jbList' ).val () );

                            $ ( 'form' ).prop ( 'action', url );
                            $ ( 'form' ).prepend (
                                    '<input type="hidden" name="url" value="' + imgUrls
                                            + '" /><input type="hidden" name="eqmtNm" value="'
                                            + $ ( '#eqmtId option:selected' ).text () + '" />' );

                            $ ( 'form' ).submit ();

                            $ ( 'input[name=url]' ).remove ();
                            $ ( 'input[name=eqmtNm]' ).remove ();
                            $ ( '#isEqmtGrp' ).val ( '' );
                        }
                    } );
}

/**
 * 커스텀 셀렉트 삭제
 * 
 * @param 셀렉트
 *            객체 / / /
 */
function removeCustomSelect ( $selector )
{
    var $prevSelector = $selector.prev ();
    if ( $prevSelector.is ( 'span' ) && !$prevSelector.hasClass ( 'label' ) )
    {
        $prevSelector.remove ();
    }
}

/**
 * 설비 그룹 별 차트 카테고리를 가져온다.
 * 
 * @param eqmtGrpCd
 *            설비 그룹 코드 / / /
 */
function getCategoriesByEqmtGrpCd ( eqmtGrpCd )
{
    var str = "";
    if ( eqmtGrpCd === "VCB" ) // VCB
    {
        str = i18nMessage.msg_vcb + " " + i18nMessage.msg_facilityCapacity

    } else if ( eqmtGrpCd === "ACB" ) // ACB
    {
        str = i18nMessage.msg_acb + " " + i18nMessage.msg_facilityCapacity
    } else if ( eqmtGrpCd === "IVT" ) // 인버터
    {
        str = i18nMessage.msg_inverter + " " + i18nMessage.msg_facilityCapacity
    } else if ( eqmtGrpCd === "JUN" ) // 접속반
    {
        str = i18nMessage.msg_junctionbox + " " + i18nMessage.msg_facilityCapacity
    } else if ( eqmtGrpCd === "STR" ) // 스트링
    {
        str = i18nMessage.msg_string + " " + i18nMessage.msg_facilityCapacity
    }
    return str;
}

/**
 * 조회 기준에 의한 화면을 보여준다. / / /
 */
function showPageByRetrieveType ()
{
    $ ( 'input[name=retrieveType]' ).change ( function ()
    {
        var retrieveType = $ ( this ).val ();

        // 기간 조회
        if ( retrieveType === "period" )
        {
            location.href = contextPath + '/hom/analysis/energy/list.do?pageType=period';
        } else
        // COD 기준 조회
        {
            location.href = contextPath + '/hom/analysis/energy/list.do?pageType=cod';
        }
    } );
}

/**
 * 설비 순위 별 발전량 통계 차트 조회 / / /
 */
function getEnergyStatsChartListAtRanking ()
{
    $ ( '#jbEqmtId' ).val ( $ ( '#eqmtId' ).val () );

    // console.log ( $ ( '#eqmtId' ).val () );

    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectEnergyStatsChartListAtRanking.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    $ ( '#graph1' ).show ();
                    $ ( '#graph1NoData' ).hide ();

                    var dateType = $ ( "#dateType" ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;
                    var txtFromDate = null;
                    var txtToDate = null;
                    var date1 = null;
                    var date2 = null;

                    if ( dateType === 'D' )
                    {
                        txtFromDate = $ ( '#date01' ).val ().replace ( /-/g, '' );
                        txtToDate = $ ( '#date04' ).val ().replace ( /-/g, '' );

                        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ),
                                10 ) - 1, txtFromDate.substring ( 6, 8 ) );
                        date2 = new Date ( txtToDate.substring ( 0, 4 ),
                                parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, txtToDate.substring ( 6, 8 ) );
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === 'M' )
                    {
                        txtFromDate = $ ( '#date02' ).val ().replace ( /-/g, '' );
                        txtToDate = $ ( '#date05' ).val ().replace ( /-/g, '' );

                        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ),
                                10 ) - 1, 1 );
                        date2 = new Date ( txtToDate.substring ( 0, 4 ),
                                parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, 1 );
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === 'Y' )
                    {
                        txtFromDate = $ ( '#date03' ).val ();
                        txtToDate = $ ( '#date06' ).val ();

                        date1 = new Date ( txtFromDate, 0, 1 );
                        date2 = new Date ( txtToDate, 0, 1 );
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    var eqmtNms = [];
                    var eqmtIds = [];
                    $.each ( json.data, function ( index, item )
                    {
                        eqmtIds.push ( item.eqmtId );
                        eqmtNms.push ( item.eqmtNm );
                    } );

                    // 중복 값 제거
                    var uniqEqmtIds = _.uniq ( eqmtIds );
                    var uniqEqmtNms = _.uniq ( eqmtNms );

                    // 설비 정보 생성
                    var uniqEqmtInfos = {
                        eqmtIds : uniqEqmtIds,
                        eqmtNms : uniqEqmtNms
                    };

                    var chartData = [];
                    var series = [];
                    for ( var i = 0; i < uniqEqmtInfos.eqmtIds.length; i++ )
                    {
                        chartData = [];
                        chartData.push ( createChartData ( uniqEqmtInfos.eqmtIds[i], json.data ) );

                        series.push ( {
                            type : 'line',
                            yAxis : 0,
                            name : uniqEqmtInfos.eqmtNms[i],
                            data : chartData[0]
                        } );
                    }

                    homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

                    // 그래프
                    $ ( '#graph1' ).highcharts ( {
                        colors : homUtil.getHighchartsColors (),
                        chart : {
                            marginTop : 50
                        },
                        legend : {
                            align : 'right',
                            verticalAlign : 'top',
                            layout : 'vertical',
                            x : 0,
                            y : 15
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
                            },
                            min : date1.getTime (),
                            max : date2.getTime ()
                        },
                        yAxis : [ {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_energy + '(' + $ ( '#hidUnit' ).val () + ')'
                            }
                        } ],
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                        plotOptions : {
                            line : {
                                pointPadding : 0,
                                borderWidth : 0,
                                lineWidth : 1,
                                marker : {
                                    enabled : false
                                }
                            }
                        },
                        series : series
                    } );
                } else
                {
                    $ ( '#graph1' ).hide ();
                    $ ( '#graph1NoData' ).show ();
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
 * 설비 순위 별 발전량 통계 그리드 초기화 / / /
 */
function jqGridBasicAtRanking ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();
    var eqmtId = $ ( '#jbList' ).val ();
    var eqmtGrpCd = $ ( '#eqmtId' ).val ();
    var unit = $ ( '#hidUnit' ).val ();

    console.log ( unit );

    var tpl = getTemplate ( templates.noData );

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/analysis/energy/selectEnergyStatsGridListAtRanking.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 204,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    eqmtId : eqmtGrpCd,
                    unit : unit
                },
                rowNum : staticVariable.gridRow30,
                sortname : "eqmtRanking",
                sortorder : "asc",
                multiselect : false,
                multiboxonly : false,
                page : 1,
                scroll : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_rank, i18nMessage.msg_division, i18nMessage.msg_facilityCapacity,
                        i18nMessage.msg_facilityCapacity + " " + i18nMessage.msg_ratio + i18nMessage.msg_unitPercent,
                        i18nMessage.msg_energy,
                        i18nMessage.msg_energy + " " + i18nMessage.msg_ratio + i18nMessage.msg_unitPercent,
                        i18nMessage.msg_energy + " " + i18nMessage.msg_contrast + i18nMessage.msg_unitPercent,
                        "energyUnitNm" ],
                colModel : [
                        {
                            name : 'eqmtRanking',
                            index : '',
                            align : 'center',
                            width : '65'
                        },
                        {
                            name : 'eqmtNm',
                            index : '',
                            align : 'left',
                            width : '198'
                        },
                        {
                            name : 'eqmtCpcty',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'cpctyRatio',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'acmsltEnergy',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'energyRatio',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'energyDiff',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject,
                                        staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'energyUnitNm',
                            index : '',
                            align : 'center',
                            width : '198',
                            hidden : true
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
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " " + data.records
                            + i18nMessage.msg_count;
                    $ ( "#totalRowCount" ).text ( resultText );

                    var $gridList = $ ( '#gridList' );
                    var ids = $gridList.jqGrid ( "getDataIDs" );
                    var cl = ids[0];
                    var rowData = $gridList.getRowData ( cl );

                    console.log ( rowData );

                    var energyUnitNm = rowData.energyUnitNm;
                    if ( typeof energyUnitNm === 'undefined' )
                    {
                        energyUnitNm = getHeaderUnit ();
                    }

                    // 헤더 명 변경
                    $gridList.jqGrid ( 'setLabel', "acmsltEnergy", i18nMessage.msg_energy + '(' + energyUnitNm + ')' );
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }
}

// jqgird customize
function customizeJqgridAtRanking ()
{
    var $gridBox = $ ( '#gbox_gridList' );
    $gridBox.remove ();
    $ ( '<table/>' ).attr ( 'id', 'gridList' ).appendTo ( '.grid_tbl_wrap' );

    // jqgrid
    jqGridBasicAtRanking ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}
// jqgrid end

// 단위 변경 버튼 클릭
function initUnit ()
{
    var isChecked = $ ( '#chkEqmtRanking' ).is ( ":checked" );

    // 기본 단위 클릭
    $ ( ".DEFAULTunit" ).click ( function ()
    {
        var $unitSelect = $ ( '.unit_select' );
        $unitSelect.removeClass ( 'on' );

        $ ( ".DEFAULTunit" ).addClass ( 'on' );
        valueUnit = 'Default';

        $ ( '#hidUnit' ).val ( valueUnit );

        if ( isChecked )
        {
            getEnergyStatsChartListAtRanking ();
            reloadJqgrid ( $ ( '#gridList' ) );
        } else
        {
            // 데이터 조회
            $ ( '#btnSubmit' ).trigger ( 'click' );
        }
    } );

    // KW 단위 클릭
    $ ( ".Kunit" ).click ( function ()
    {
        var $unitSelect = $ ( '.unit_select' );
        $unitSelect.removeClass ( 'on' );
        $ ( ".Kunit" ).addClass ( 'on' );
        valueUnit = 'K';

        $ ( '#hidUnit' ).val ( valueUnit );

        if ( isChecked )
        {
            getEnergyStatsChartListAtRanking ();
            reloadJqgrid ( $ ( '#gridList' ) );
        } else
        {
            // 데이터 조회
            $ ( '#btnSubmit' ).trigger ( 'click' );
        }
    } );

    // MW 단위 클릭
    $ ( ".Munit" ).click ( function ()
    {
        var $unitSelect = $ ( '.unit_select' );
        $unitSelect.removeClass ( 'on' );
        $ ( ".Munit" ).addClass ( 'on' );
        valueUnit = 'M';

        $ ( '#hidUnit' ).val ( valueUnit );

        if ( isChecked )
        {
            getEnergyStatsChartListAtRanking ();
            reloadJqgrid ( $ ( '#gridList' ) );
        } else
        {
            // 데이터 조회
            $ ( '#btnSubmit' ).trigger ( 'click' );
        }
    } );

    // GW 단위 클릭
    $ ( ".Gunit" ).click ( function ()
    {
        var $unitSelect = $ ( '.unit_select' );
        $unitSelect.removeClass ( 'on' );
        $ ( ".Gunit" ).addClass ( 'on' );
        valueUnit = 'G';

        $ ( '#hidUnit' ).val ( valueUnit );

        if ( isChecked )
        {
            getEnergyStatsChartListAtRanking ();
            reloadJqgrid ( $ ( '#gridList' ) );
        } else
        {
            // 데이터 조회
            $ ( '#btnSubmit' ).trigger ( 'click' );
        }
    } );

    setUnit ();
}

function setUnit ()
{
    var currentUnit = $ ( '#hidUnit' ).val ();
    var unitClassMap = {
        Default : '.DEFAULTunit',
        K : '.Kunit',
        M : '.Munit',
        G : '.Gunit'
    };
    var $unitSelect = $ ( '.unit_select' );
    $unitSelect.removeClass ( 'on' );
    $ ( unitClassMap[_.isEmpty ( currentUnit ) ? 'Default' : currentUnit] ).addClass ( 'on' );
}

function getHeaderUnit ()
{
    var targetUnit = $ ( '.unit_select.on' ).text ();
    var unitMap = {
        kW : 'kWh',
        MW : 'MWh',
        GW : 'GWh'
    };

    return _.isEmpty ( unitMap[targetUnit] ) ? 'kWh' : unitMap[targetUnit];
}

function gridFormatter ( cellValue, options, rowObject )
{
    return homUtil.mathFloorComma ( cellValue, staticVariable.decimalPoint );
}

$ ( function ()
{
    customizeForm ();
    setDatepickerDate ();
    initDatetimepicker ();
    initParams ();
    showPageByRetrieveType ();
    // getContentTemplate ( "" );
    // initUnit ();
    // getEnergyChartList ();
    // customizeJqgrid ();
    searchEnergy ();
    getJbList ();
    // showPopup ();
    // downloadExcel ();
    $ ( '#btnSubmit' ).trigger ( 'click' );
} );