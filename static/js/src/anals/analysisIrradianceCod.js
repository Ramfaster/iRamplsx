var analysisIrradiance = null;

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
        todayBtn : true
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
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

// 일사량 차트 조회
function searchRdtnStatsChart ()
{
    var $graph2 = $ ( '#graph2' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );
    var $unitBox = $ ( '#unit_box' );
    var $unit = $ ( '#unit' );
    var $codGridTagUnit = $ ( '#cod_grid_tagUnit' );
    var $codGridTagUnitWrap = $codGridTagUnit.closest ( '.grid_noti' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/radiation/selectRadiationCodStatsChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            unit : $unit.val ()
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#graph2' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid.show ();
                    $unitBox.show ();
                    $codGridTagUnitWrap.show ();

                    var rdtnUnitNm = json.data[0].rdtnUnitNm;
                    var tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;

                    if ( rdtnUnitNm !== null && rdtnUnitNm !== '' )
                    {
                        $codGridTagUnit.html ( rdtnUnitNm );

                        var cod = json.data[0].cod;
                        var toDay = json.data[0].toDay;
                        setPeriodTitle ( cod, toDay );
                    }

                    var rdtnCodArray = [];
                    $.each ( json.data, function ( index, item )
                    {
                        var monthRdtnArray = [];

                        monthRdtnArray.push ( item.janData );
                        monthRdtnArray.push ( item.febData );
                        monthRdtnArray.push ( item.marData );
                        monthRdtnArray.push ( item.aprData );
                        monthRdtnArray.push ( item.mayData );
                        monthRdtnArray.push ( item.junData );
                        monthRdtnArray.push ( item.julData );
                        monthRdtnArray.push ( item.augData );
                        monthRdtnArray.push ( item.sepData );
                        monthRdtnArray.push ( item.otbData );
                        monthRdtnArray.push ( item.novData );
                        monthRdtnArray.push ( item.dcbData );

                        rdtnCodArray.push ( monthRdtnArray );
                    } );

                    var rdtnCodMinArray = [];
                    $.each ( rdtnCodArray, function ( index, item )
                    {
                        rdtnCodMinArray.push ( _.min ( item ) );
                    } );

                    var rdtnYaxis = {
                        title : {
                            text : i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( rdtnCodMinArray ) > 0 )
                    {
                        rdtnYaxis.min = 0;
                    }

                    var seriesArray = [];
                    var lastIndex = json.data.length - 1;
                    $.each ( json.data, function ( index, item )
                    {
                        var type = 'line';
                        if ( lastIndex === index )
                        {
                            type = 'column';
                        }

                        var series = {
                            type : type,
                            yAxis : 0,
                            name : item.stdrYear,
                            data : rdtnCodArray[index]
                        };

                        if ( lastIndex === index )
                        {
                            seriesArray.splice ( 0, 0, series );
                        } else
                        {
                            seriesArray.push ( series );
                        }
                    } );

                    $graph2.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                        chart : {
                            marginTop : 50
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
                            categories : [ i18nMessage.msg_shortJanuary, i18nMessage.msg_shortFebuary,
                                    i18nMessage.msg_shortMarch, i18nMessage.msg_shortApril, i18nMessage.msg_shortMay,
                                    i18nMessage.msg_shortJune, i18nMessage.msg_shortJuly, i18nMessage.msg_shortAugust,
                                    i18nMessage.msg_shortSeptember, i18nMessage.msg_shortOctober,
                                    i18nMessage.msg_shortNovember, i18nMessage.msg_shortDecember ],
                            labels : {
                                style : {
                                    color : '#3c3c3c'
                                }
                            }
                        },
                        yAxis : rdtnYaxis,
                        tooltip : homUtil.generateLabelTooltip ( staticVariable.decimalPoint ),
                        plotOptions : {
                            line : {
                                pointPadding : 0,
                                borderWidth : 0,
                                lineWidth : 1,
                                marker : {
                                    enabled : false
                                }
                            },
                            column : {
                                pointPadding : 0.4
                            }
                        },
                        series : seriesArray
                    } );
                } else
                {
                    $btnExcel.hide ();
                    $btnAllJqgrid.hide ();
                    $unitBox.hide ();
                    $codGridTagUnitWrap.hide ();

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

function searchRdtnStats ()
{
    var $gridList = $ ( '#gridList2' );
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

            // 일사량 COD 차트 조회
            searchRdtnStatsChart ();

            // 일사량 COD Grid 조회
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
}

// 일사량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnJqgrid ( $gridList )
{
    var unit = $ ( '#unit' ).val ();

    $gridList.setGridParam ( {
        postData : {
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 일사량 jqgrid 조회(초기 세팅 및 조회)
function searchRdtnJqgrid ( $gridList, tpl )
{
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'radiation_jqgrid_nodata';

    $gridList.jqGrid ( {
        url : contextPath + '/hom/analysis/radiation/selectRadiationCodStatsGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            unit : unit
        },
        colNames : [ i18nMessage.msg_division, i18nMessage.msg_january, i18nMessage.msg_febuary, i18nMessage.msg_march,
                i18nMessage.msg_april, i18nMessage.msg_may, i18nMessage.msg_june, i18nMessage.msg_july,
                i18nMessage.msg_august, i18nMessage.msg_september, i18nMessage.msg_october, i18nMessage.msg_november,
                i18nMessage.msg_december, i18nMessage.msg_yearAverage ],
        colModel : [ {
            name : 'stdrYear',
            align : 'center',
            width : '75',
            fixed : true,
            sortable : false
        }, {
            name : 'janData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'febData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'marData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'aprData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'mayData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'junData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'julData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'augData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'sepData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'otbData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'novData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'dcbData',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'subTotal',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        } ],
        sortname : 'stdrDate',
        sortorder : 'asc',
        rownumbers : true,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        rowTotal : -1,
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

                var ids = $gridList.jqGrid ( "getDataIDs" );
                var lastRowCl = ids[ids.length - 1];
                var lastRowData = $gridList.getRowData ( lastRowCl );

                for ( var i = 0, length = ids.length - 1; i < length; i++ )
                {
                    var cl = ids[i];
                    var rowData = $gridList.getRowData ( cl );

                    // gap setting(1월 ~ 12월, 년평균)
                    rowData.janData = jqgridValueAbsGapFormatter ( lastRowData.janData, rowData.janData,
                            staticVariable.decimalPoint );
                    rowData.febData = jqgridValueAbsGapFormatter ( lastRowData.febData, rowData.febData,
                            staticVariable.decimalPoint );
                    rowData.marData = jqgridValueAbsGapFormatter ( lastRowData.marData, rowData.marData,
                            staticVariable.decimalPoint );
                    rowData.aprData = jqgridValueAbsGapFormatter ( lastRowData.aprData, rowData.aprData,
                            staticVariable.decimalPoint );
                    rowData.mayData = jqgridValueAbsGapFormatter ( lastRowData.mayData, rowData.mayData,
                            staticVariable.decimalPoint );
                    rowData.junData = jqgridValueAbsGapFormatter ( lastRowData.junData, rowData.junData,
                            staticVariable.decimalPoint );
                    rowData.julData = jqgridValueAbsGapFormatter ( lastRowData.julData, rowData.julData,
                            staticVariable.decimalPoint );
                    rowData.augData = jqgridValueAbsGapFormatter ( lastRowData.augData, rowData.augData,
                            staticVariable.decimalPoint );
                    rowData.sepData = jqgridValueAbsGapFormatter ( lastRowData.sepData, rowData.sepData,
                            staticVariable.decimalPoint );
                    rowData.otbData = jqgridValueAbsGapFormatter ( lastRowData.otbData, rowData.otbData,
                            staticVariable.decimalPoint );
                    rowData.novData = jqgridValueAbsGapFormatter ( lastRowData.otbData, rowData.novData,
                            staticVariable.decimalPoint );
                    rowData.dcbData = jqgridValueAbsGapFormatter ( lastRowData.dcbData, rowData.dcbData,
                            staticVariable.decimalPoint );
                    rowData.subTotal = jqgridValueAbsGapFormatter ( lastRowData.subTotal, rowData.subTotal,
                            staticVariable.decimalPoint );

                    $gridList.jqGrid ( 'setRowData', cl, rowData );
                }

                // 월평균 및 년평균의 평균 셋팅
                lastRowData.janData = numberFloorComma ( lastRowData.janData, staticVariable.decimalPoint );
                lastRowData.febData = numberFloorComma ( lastRowData.febData, staticVariable.decimalPoint );
                lastRowData.marData = numberFloorComma ( lastRowData.marData, staticVariable.decimalPoint );
                lastRowData.aprData = numberFloorComma ( lastRowData.aprData, staticVariable.decimalPoint );
                lastRowData.mayData = numberFloorComma ( lastRowData.mayData, staticVariable.decimalPoint );
                lastRowData.junData = numberFloorComma ( lastRowData.junData, staticVariable.decimalPoint );
                lastRowData.julData = numberFloorComma ( lastRowData.julData, staticVariable.decimalPoint );
                lastRowData.augData = numberFloorComma ( lastRowData.augData, staticVariable.decimalPoint );
                lastRowData.sepData = numberFloorComma ( lastRowData.sepData, staticVariable.decimalPoint );
                lastRowData.otbData = numberFloorComma ( lastRowData.otbData, staticVariable.decimalPoint );
                lastRowData.novData = numberFloorComma ( lastRowData.novData, staticVariable.decimalPoint );
                lastRowData.dcbData = numberFloorComma ( lastRowData.dcbData, staticVariable.decimalPoint );
                lastRowData.subTotal = numberFloorComma ( lastRowData.subTotal, staticVariable.decimalPoint );
                $gridList.jqGrid ( 'setRowData', lastRowCl, lastRowData );
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

/**
 * 엑셀 다운로드
 */
function downloadExcel ()
{
    var $btnExcel = $ ( '#btnExcel' );

    $btnExcel.click ( function ()
    {
        var $graph2 = $ ( '#graph2' );
        var optionsStr = JSON.stringify ( $graph2.highcharts ().userOptions );
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
                        contextPath + '/hom/excel/anals/codradiation/download.do' ).submit ();

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

function initViewAllPopup ()
{
    $ ( '#btn_all_jqgrid' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
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

        $btnSubmit.trigger ( 'click' );
    } );
}

// 조회 조건에 해당하는 타이틀 세팅
function setPeriodTitle ( fromDate, toDate )
{
    var startDtMsg = i18nMessage.msg_commercialOperationStart;
    var endDtMsg = i18nMessage.msg_mntrToday;
    $ ( '#search_period' ).text ( fromDate + ' ~ ' + toDate );
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
    searchRdtnStats ();
    initPage ();
    downloadExcel ();
} );