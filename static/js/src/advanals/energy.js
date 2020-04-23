var energyAdvancedAnalysis = null;

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
        endDate : '+0y'
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
        endDate : '+0m'
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
        endDate : '+0d'
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
    var $unit = $ ( '#unit' );

    $ ( '#search_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } ).on ( 'change', function ( event, keepFlag )
    {
        if ( $ ( this ).val () === 'TYPE01' )
        {
            $ ( '#unit_plant_box' ).find ( '.unit_select' ).removeClass ( 'on' ).eq ( 0 ).addClass ( 'on' );
        } else if ( $ ( this ).val () === 'TYPE02' )
        {
            $ ( '#unit_inverter_box' ).find ( '.unit_select' ).removeClass ( 'on' ).eq ( 0 ).addClass ( 'on' );
        }

        if ( !keepFlag )
        {
            $unit.val ( '' );
        }
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

        var nowDate = new Date ();
        var localFromTodate = homUtil.getLocalFromToDate ( nowDate, selectedDateType, false, false );
        var $dateBox = $ ( '.' + className );

        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate )
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    $selectDateType.trigger ( 'change' );
}

// 고급 분석 발전량 조회
function searchEnergy ()
{
    $ ( '#btnSubmit' ).on (
            'click',
            function ( event )
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
                var searchType = $ ( '#search_type' ).val ();

                // 발전소
                if ( searchType === 'TYPE01' )
                {
                }
                // 인버터
                else if ( searchType === 'TYPE02' )
                {
                    // TODO COD 부터 발전소 localtime 세팅 필요
                    // pureFromDate, pureToDate
                }

                if ( searchType === staticVariable.searchPeriodTypePeriod
                        && !homUtil.fromToDateValidate ( fromDate, toDate, selectDateType ) )
                {
                    return;
                }

                setSearchParameter ( pureFromDate, pureToDate, searchType );
                setPeriodTitle ( fromDate, toDate, searchType );

                var $plantBox = $ ( '#plant_box' );
                var $inverterBox = $ ( '#inverter_box' );

                // 발전소
                if ( searchType === 'TYPE01' )
                {
                    $plantBox.show ();
                    $inverterBox.hide ();

                    searchEnergyPlant ( energyAdvancedAnalysis.initFlag.plant );

                    if ( energyAdvancedAnalysis.initFlag.plant )
                    {
                        energyAdvancedAnalysis.initFlag.plant = false;
                    }
                }
                // 인버터
                else if ( searchType === 'TYPE02' )
                {
                    $plantBox.hide ();
                    $inverterBox.show ();

                    searchEnergyInverter ( energyAdvancedAnalysis.initFlag.inverter );

                    if ( energyAdvancedAnalysis.initFlag.inverter )
                    {
                        energyAdvancedAnalysis.initFlag.inverter = false;
                    }
                }
            } );
}

// 검색을 위한 파라미터 세팅(시작/종료, 조회 기준)
function setSearchParameter ( pureFromDate, pureToDate, searchType )
{
    // 조회 조건, 시작, 종료일자 세팅
    $ ( '#dateType' ).val ( $ ( '#select_date_type' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );

    // 조회 기준
    $ ( '#searchType' ).val ( searchType );
}

// 조회 조건에 해당하는 타이틀 세팅
function setPeriodTitle ( fromDate, toDate, searchType )
{
    var $searchPeriod = null;

    // 발전소
    if ( searchType === 'TYPE01' )
    {
        $searchPeriod = $ ( '#search_plant_period' );
    }
    // 인버터
    else if ( searchType === 'TYPE02' )
    {
        $searchPeriod = $ ( '#search_inverter_period' );
    }

    $searchPeriod.text ( fromDate + ' ~ ' + toDate );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(조회 기준, 조회 기간, 시작, 종료)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParamaeter ()
{
    var dateType = $ ( '#dateType' ).val ();
    var searchType = $ ( '#searchType' ).val ();
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
    $ ( '#search_type' ).val ( searchType ).trigger ( 'change', true );
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

        setSearchedParamaeter ();

        $unit.val ( valueUnit );

        $unitSelect.removeClass ( 'on' );
        $ ( this ).addClass ( 'on' );

        $btnSubmit.trigger ( 'click' );
    } );
}

// 페이지 로드 완료 시 처리
function initPage ()
{
    energyAdvancedAnalysis = {
        initFlag : {
            plant : true,
            inverter : true
        }
    };

    $ ( '#btnSubmit' ).trigger ( 'click' );
}

$ ( function ()
{
    initDatetimepicker ();
    customizeForm ();
    initUnit ();

    $.when ( true ).done ( function ()
    {
        searchEnergy ();
        initPage ();
    } );
} );