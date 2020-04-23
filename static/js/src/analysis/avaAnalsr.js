var avaAnalsr = null;

// form element customize
function customizeForm ()
{
    $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    // 조회기간
    $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    $ ( '#eqmt_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
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
    var $dateType = $ ( '#date_type' );
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

// 조회 버튼 선택
function clickBtnSubmit ()
{
    var $btnSubmit = $ ( '#btnSubmit' );
    var $rightCont03 = $ ( '.right_cont03' );
    var $avaAnlsrPlant = $ ( '#avaAnlsr_plant' );
    var $avaAnlsrEquip = $ ( '#avaAnlsr_equip' );
    var $avaAnlsrCod = $ ( '#avaAnlsr_cod' );
    var $avaAnlsrPlantDate = $ ( '#avaAnlsr_plant_date' );
    var $avaAnlsrEquipDate = $ ( '#avaAnlsr_equip_date' );
    var $aavaAnlsrCodDate = $ ( '#avaAnlsr_cod_date' );
    var $btnExcelAvaAnlsrPlant = $ ( '#btn_excel_avaAnlsr_plant' );
    var cod = $ ( '#cod' ).val ();

    $btnSubmit.on ( 'click', function ()
    {
        var searchTypeVal = $ ( '.search_type:checked' ).val ();
        var selectedDateType = $ ( '#date_type' ).val ();
        var className = findDateClassNm ( selectedDateType );

        var fromDate = $ ( '#' + className + '_from_date' ).val ();
        var toDate = $ ( '#' + className + '_to_date' ).val ();
        var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
        var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

        if ( !homUtil.fromToDateValidate ( fromDate, toDate, selectedDateType ) )
        {
            return;
        }
        var eqmtGrpCd = '';
        var eqmtGrpCdNm = '';
        if ( searchTypeVal === 'period' )
        {
            var $eqmtSelect = $ ( '#eqmt_select' );
            eqmtGrpCd = $eqmtSelect.val ();
            eqmtGrpCdNm = $ ( ':selected', $eqmtSelect ).text ();
        }
        setSearchParameter ( searchTypeVal, selectedDateType, pureFromDate, pureToDate, eqmtGrpCd );

        $rightCont03.addClass ( 'dnone' );

        // 기간 조회
        if ( searchTypeVal === 'period' )
        {
            // 발전소 전체
            if ( eqmtGrpCd === '' )
            {
                $avaAnlsrPlant.removeClass ( 'dnone' );
                if ( avaAnalsr.initFlag.avaAnalsrPlant )
                {
                    plantJqGrid ();
                    avaAnalsr.initFlag.avaAnalsrPlant = false;

                } else
                {
                    reloadPlantJqgrid ();
                }
                // 성능비 chart 조회
                initPlantHighcharts ();

                setAnalsrDate ( false, $avaAnlsrPlantDate, fromDate, toDate, null );

                if ( avaAnalsr.count.plant > 0 )
                {
                    $btnExcelAvaAnlsrPlant.show ();
                } else
                {
                    $btnExcelAvaAnlsrPlant.hide ();
                }
                // 카운트 초기화
                avaAnalsr.count.plant = 0;
            }
            // 설비
            else
            {
                $avaAnlsrEquip.removeClass ( 'dnone' );
                if ( avaAnalsr.initFlag.avaAnalsrEquip )
                {
                    customizeEquipJqGrid ();
                    avaAnalsr.initFlag.avaAnalsrEquip = false;
                } else
                {
                    reloadEquipJqGrid ();
                }
                // chart 조회
                initEquipHighcharts ()

                setAnalsrDate ( true, $avaAnlsrEquipDate, fromDate, toDate, null );
            }
        }
        // COD
        else
        {
            $avaAnlsrCod.removeClass ( 'dnone' );
            if ( avaAnalsr.initFlag.avaAnalsrCod )
            {
                // jqgrid 조회
                customizeCodJqGrid ();
                avaAnalsr.initFlag.avaAnalsrCod = false;

            } else
            {
                reloadCodJqGrid ();
            }

            // COD chart 조회
            initCodHighcharts ();

            setAnalsrDate ( false, $aavaAnlsrCodDate, cod, homUtil.getParamFormatDate ( date,
                    homUtil.dateFormat.convertYYYYMMDD ), null );
        }
    } );

    $btnSubmit.trigger ( 'click' );
}

function setAnalsrDate ( isEquip, $dateSpan, fromDate, toDate, eqmtGrpCdNm )
{
    if ( isEquip && eqmtGrpCdNm !== null )
    {
        $dateSpan.text ( fromDate + ' ~ ' + toDate + ' ' + eqmtGrpCdNm );
    } else
    {
        $dateSpan.text ( fromDate + ' ~ ' + toDate );
    }
}

function findDateClassNm ( selectedDateType )
{
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

    return className;
}

// 검색 파라미터 셋팅
function setSearchParameter ( searchTypeVal, selectedDateType, pureFromDate, pureToDate, eqmtGrpCd )
{
    $ ( '#searchType' ).val ( searchTypeVal );
    $ ( '#dateType' ).val ( selectedDateType );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );
    $ ( '#eqmtGrpCd' ).val ( eqmtGrpCd );
}

// 조회 유형을 cod로 선택했을 경우
function checkCod ()
{
    var $searchType = $ ( '.search_type' );
    var $eqmtSelect = $ ( '.eqmt_select' );
    var $dateWrap = $ ( '.date_wrap' );
    var $calendarWrap = $ ( '.calendar_wrap' );

    $searchType.on ( 'change', function ()
    {
        var $dateType = $ ( '#date_type' );
        var searchTypeVal = $ ( this ).val ();
        if ( searchTypeVal === 'cod' )
        {
            $eqmtSelect.addClass ( 'dnone' );

            $dateWrap.addClass ( 'dnone' );
            $calendarWrap.addClass ( 'dnone' );
        } else
        {
            $eqmtSelect.removeClass ( 'dnone' ).find ( 'select' ).val ( '' ).trigger ( 'change' );
            $dateWrap.removeClass ( 'dnone' );
            $calendarWrap.removeClass ( 'dnone' );
        }
    } );
}

// 엑셀버튼 분석 > 전체
function avaAnalsrPlantExcelBtn ()
{
    var $btnExcelAvaAnlsrPlant = $ ( '#btn_excel_avaAnlsr_plant' );
    var $dateType = $ ( '#dateType' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );

    $btnExcelAvaAnlsrPlant.on ( 'click', function ()
    {
        setSearchedParamaeter ();

        var $graph1 = $ ( '#avaAnlsr_plant_graph' );
        var graphChart1 = $graph1.highcharts ();
        var dataString1 = encodeURI ( 'async=true&type=png&width=600&options='
                + JSON.stringify ( graphChart1.userOptions ) );
        var imgUrl1 = getHighchartsImg ( dataString1 );

        if ( imgUrl1 !== null )
        {
            var $excelUrl = $ ( '<input />', {
                type : 'hidden',
                id : 'form_excelUrl',
                name : 'url',
                value : avaAnalsr.exportUrl + imgUrl1
            } );

            var $dateTypeForm = $ ( '<input />', {
                type : 'hidden',
                id : 'form_dateType',
                name : 'excelDateType',
                value : $dateType.val ()
            } );

            var $fromDateForm = $ ( '<input />', {
                type : 'hidden',
                id : 'form_fromDate',
                name : 'excelFromDate',
                value : $fromDate.val ()
            } );

            var $toDateForm = $ ( '<input />', {
                type : 'hidden',
                id : 'form_toDate',
                name : 'excelToDate',
                value : $toDate.val ()
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

            $ ( 'form' ).prepend ( $excelUrl, $dateTypeForm, $fromDateForm, $toDateForm, $menuName ).prop ( 'action',
                    avaAnalsr.excelHref.plant ).submit ();

            $excelUrl.remove ();
            $dateTypeForm.remove ();
            $fromDateForm.remove ();
            $toDateForm.remove ();
            $menuName.remove ();
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
    } );
}

// 엑셀 버튼 분석 > 설비 선택
function avaAnalsrEquiExcelBtn ()
{
    var $btnExcelAvaAnlsrEquip = $ ( '#btn_excel_avaAnlsr_equip' );
    var $dateType = $ ( '#dateType' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );
    var $eqmtGrpCd = $ ( '#eqmtGrpCd' );

    $btnExcelAvaAnlsrEquip.on ( 'click', function ()
    {
        setSearchedParamaeter ();

        var $graph1 = $ ( '#avaAnlsr_equip_graph' );
        var graphChart1 = $graph1.highcharts ();
        var dataString1 = encodeURI ( 'async=true&type=png&width=600&options='
                + JSON.stringify ( graphChart1.userOptions ) );
        var imgUrl1 = getHighchartsImg ( dataString1 );

        if ( imgUrl1 !== null )
        {
            var $excelUrl = $ ( '<input />', {
                type : 'hidden',
                id : 'form_excelUrl',
                name : 'url',
                value : avaAnalsr.exportUrl + imgUrl1
            } );

            var $dateTypeForm = $ ( '<input />', {
                type : 'hidden',
                id : 'form_dateType',
                name : 'excelDateType',
                value : $dateType.val ()
            } );

            var $fromDateForm = $ ( '<input />', {
                type : 'hidden',
                id : 'form_fromDate',
                name : 'excelFromDate',
                value : $fromDate.val ()
            } );

            var $toDateForm = $ ( '<input />', {
                type : 'hidden',
                id : 'form_toDate',
                name : 'excelToDate',
                value : $toDate.val ()
            } );

            var $eqmtGrpCdForm = $ ( '<input />', {
                type : 'hidden',
                id : 'form_eqmtGrpCd',
                name : 'excelEqmtGrpCd',
                value : $eqmtGrpCd.val ()
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

            $ ( 'form' ).prepend ( $excelUrl, $dateTypeForm, $fromDateForm, $toDateForm, $eqmtGrpCdForm, $menuName )
                    .prop ( 'action', avaAnalsr.excelHref.equip ).submit ();

            $excelUrl.remove ();
            $dateTypeForm.remove ();
            $fromDateForm.remove ();
            $toDateForm.remove ();
            $eqmtGrpCdForm.remove ();
            $menuName.remove ();
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
    } );
}

// 엑셀 버튼 분석 > COD
function avaAnalsrCodExcelBtn ()
{
    var $btnExcelAvaAnlsrCod = $ ( '#btn_excel_avaAnlsr_cod' );

    $btnExcelAvaAnlsrCod.on ( 'click', function ()
    {
        setSearchedParamaeter ();

        var graphChart1 = $ ( '#avaAnlsr_cod_graph' ).highcharts ();
        var dataString1 = encodeURI ( 'async=true&type=png&width=600&options='
                + JSON.stringify ( graphChart1.userOptions ) );
        var imgUrl1 = getHighchartsImg ( dataString1 );

        if ( imgUrl1 !== null )
        {
            var $excelUrl = $ ( '<input />', {
                type : 'hidden',
                id : 'form_excelUrl',
                name : 'url',
                value : avaAnalsr.exportUrl + imgUrl1
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

            $ ( 'form' ).prepend ( $excelUrl, $menuName ).prop ( 'action', avaAnalsr.excelHref.cod ).submit ();

            $excelUrl.remove ();
            $menuName.remove ();
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
    } );
}

function getHighchartsImg ( dataString )
{
    var imgUrl = null;
    $.ajax ( {
        url : avaAnalsr.exportUrl,
        type : 'POST',
        data : dataString,
        async : false,
        success : function ( data )
        {
            imgUrl = data;
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
    return imgUrl;
}

function initPopup ()
{
    $ ( '.btn_popup_analsr' ).magnificPopup ( {
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
 * 사용자가 조회 후 조건(조회 기준, 조회 기간, 시작, 종료, 설비, 소속 접속반 등)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParamaeter ()
{
    var searchType = $ ( '#searchType' ).val ();
    var dateType = $ ( '#dateType' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
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

    $ ( '#date_type' ).val ( dateType ).trigger ( 'change' );
    $ ( '#' + className + '_from_date' ).val ( fromDate );
    $ ( '#' + className + '_to_date' ).val ( toDate );

    $ ( 'input[name="searchType"][value="' + searchType + '"]' ).prop ( 'checked', true ).trigger ( 'change', true );
    $ ( '#eqmt_select' ).val ( eqmtGrpCd ).trigger ( 'change', true );
}

$ ( function ()
{
    avaAnalsr = {
        templates : {
            noData : getTemplate ( templates.noData )
        },
        initFlag : {
            // 기간조회>발전소 전체
            avaAnalsrPlant : true,

            // 기간조회>설비선택
            avaAnalsrEquip : true,

            // cod 기준 조회
            avaAnalsrCod : true
        },
        count : {
            plant : 0
        },
        exportUrl : staticVariable.exportUrl,
        excelHref : {
            plant : contextPath + '/hom/excel/analysis/ava/download.do',
            equip : contextPath + '/hom/excel/analysis/ava/equipDownload.do',
            cod : contextPath + '/hom/excel/analysis/ava/codDownload.do'
        },
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };

    customizeForm ();
    initDatetimepicker ();
    clickBtnSubmit ();
    checkCod ();
    avaAnalsrPlantExcelBtn ();
    avaAnalsrEquiExcelBtn ();
    avaAnalsrCodExcelBtn ();
    initPopup ();
} );