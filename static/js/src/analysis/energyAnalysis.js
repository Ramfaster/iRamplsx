var energyAnalysis = null;

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
    var $additionalSearchBox = $ ( '#additional_search_box' );
    var $eqmtGrpCd = $ ( '#eqmt_grp_cd' );
    var $unit = $ ( '#unit' );
    $eqmtGrpCd.on ( 'change', function ( event, keepFlag )
    {
        if ( $ ( this ).val () === '' )
        {
            $ ( '#unit_plant_box' ).find ( '.unit_select' ).removeClass ( 'on' ).eq ( 0 ).addClass ( 'on' );
        } else
        {
            $ ( '#unit_equipment_box' ).find ( '.unit_select' ).removeClass ( 'on' ).eq ( 0 ).addClass ( 'on' );
        }

        if ( !keepFlag )
        {
            $unit.val ( '' );
        }
    } );

    $ ( '.search_period_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } ).on ( 'change', function ( event, keepFlag )
    {
        if ( $ ( this ).val () === staticVariable.searchPeriodTypePeriod )
        {
            $ ( '#unit_plant_box' ).find ( '.unit_select' ).removeClass ( 'on' ).eq ( 0 ).addClass ( 'on' );
            $eqmtGrpCd.find ( 'option:first' ).prop ( 'selected', true ).trigger ( 'change' );

            $additionalSearchBox.show ();
        } else if ( $ ( this ).val () === staticVariable.searchPeriodTypeCod )
        {
            $ ( '#unit_cod_box' ).find ( '.unit_select' ).removeClass ( 'on' ).eq ( 0 ).addClass ( 'on' );

            $additionalSearchBox.hide ();
        }

        if ( !keepFlag )
        {
            $unit.val ( '' );
        }
    } );

    // 설비, 소속 접속반
    $ ( '#eqmt_grp_cd, #junctionbox_eqmt_id' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
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

        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedDateType, false, false );
        var $dateBox = $ ( '.' + className );

        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate )
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    $selectDateType.trigger ( 'change' );
}

// 분석 발전량 조회
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
                var searchPeriodType = $ ( 'input[name="search_period_type"]:checked' ).val ();
                var eqmtGrpCd = null;
                var junctionboxEqmtId = null;

                if ( searchPeriodType === staticVariable.searchPeriodTypePeriod )
                {
                    eqmtGrpCd = $ ( '#eqmt_grp_cd' ).val ();

                    if ( eqmtGrpCd === staticVariable.eqmtGrpCdEqgr08 )
                    {
                        junctionboxEqmtId = $ ( '#junctionbox_eqmt_id' ).val ();
                    } else
                    {
                        junctionboxEqmtId = '';
                    }
                } else if ( searchPeriodType === staticVariable.searchPeriodTypeCod )
                {
                    // TODO COD 부터 발전소 localtime 세팅 필요
                    // pureFromDate, pureToDate
                }

                if ( searchPeriodType === staticVariable.searchPeriodTypePeriod
                        && !homUtil.fromToDateValidate ( fromDate, toDate, selectDateType ) )
                {
                    return;
                }

                setSearchParameter ( pureFromDate, pureToDate, searchPeriodType, eqmtGrpCd, junctionboxEqmtId );
                setPeriodTitle ( fromDate, toDate, searchPeriodType, eqmtGrpCd );

                var $plantBox = $ ( '#plant_box' );
                var $equipmentBox = $ ( '#equipment_box' );
                var $codBox = $ ( '#cod_box' );

                // 기간 조회 및 전체 발전소
                if ( searchPeriodType === staticVariable.searchPeriodTypePeriod && eqmtGrpCd === '' )
                {
                    $plantBox.show ();
                    $equipmentBox.hide ();
                    $codBox.hide ();

                    searchEnergyPlant ( energyAnalysis.initFlag.plant );

                    if ( energyAnalysis.initFlag.plant )
                    {
                        energyAnalysis.initFlag.plant = false;
                    }
                }
                // 기간 조회 및 설비
                if ( searchPeriodType === staticVariable.searchPeriodTypePeriod && eqmtGrpCd !== '' )
                {
                    $plantBox.hide ();
                    $equipmentBox.show ();
                    $codBox.hide ();

                    searchEnergyEquipment ( energyAnalysis.initFlag.equipment );

                    if ( energyAnalysis.initFlag.equipment )
                    {
                        energyAnalysis.initFlag.equipment = false;
                    }
                }
                // cod 기준 조회
                else if ( searchPeriodType === staticVariable.searchPeriodTypeCod )
                {
                    $plantBox.hide ();
                    $equipmentBox.hide ();
                    $codBox.show ();

                    searchEnergyCod ( energyAnalysis.initFlag.cod );

                    if ( energyAnalysis.initFlag.cod )
                    {
                        energyAnalysis.initFlag.cod = false;
                    }
                }
            } );
}

// 검색을 위한 파라미터 세팅(시작/종료, 조회 기준, 설비, 소속 접속반)
function setSearchParameter ( pureFromDate, pureToDate, searchPeriodType, eqmtGrpCd, junctionboxEqmtId )
{
    // 조회 조건, 시작, 종료일자 세팅
    $ ( '#dateType' ).val ( $ ( '#select_date_type' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );

    // 조회 기준
    $ ( '#searchPeriodType' ).val ( searchPeriodType );

    // 설비
    $ ( '#eqmtGrpCd' ).val ( eqmtGrpCd );

    // 소속 접속반
    $ ( '#junctionboxEqmtId' ).val ( junctionboxEqmtId );
}

// 조회 조건에 해당하는 타이틀 세팅
function setPeriodTitle ( fromDate, toDate, searchPeriodType, eqmtGrpCd )
{
    var $searchPeriod = null;

    // 기간 조회 및 전체 발전소
    if ( searchPeriodType === staticVariable.searchPeriodTypePeriod && eqmtGrpCd === '' )
    {
        $searchPeriod = $ ( '#search_plant_period' );
    }
    // 기간 조회 및 설비
    if ( searchPeriodType === staticVariable.searchPeriodTypePeriod && eqmtGrpCd !== '' )
    {
        $searchPeriod = $ ( '#search_equipment_period' );
    }
    // cod 기준 조회
    else if ( searchPeriodType === staticVariable.searchPeriodTypeCod )
    {
        $searchPeriod = $ ( '#search_cod_period' );

        fromDate = $ ( '#cod' ).val ();
        toDate = homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD );

    }

    $searchPeriod.text ( fromDate + ' ~ ' + toDate );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(조회 기준, 조회 기간, 시작, 종료, 설비, 소속 접속반 등)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParamaeter ()
{
    var dateType = $ ( '#dateType' ).val ();
    var searchPeriodType = $ ( '#searchPeriodType' ).val ();
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var junctionboxEqmtId = $ ( '#junctionboxEqmtId' ).val ();
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

    $ ( 'input[name="search_period_type"][value="' + searchPeriodType + '"]' ).prop ( 'checked', true ).trigger (
            'change', true );
    $ ( '#eqmt_grp_cd' ).val ( eqmtGrpCd ).trigger ( 'change', true );
    $ ( '#junctionbox_eqmt_id' ).val ( junctionboxEqmtId ).trigger ( 'change' );
}

// 설비 그룹 선택시 jun select를 보여줄지 판정
function checkJunSelect ()
{
    var $eqmtGrpCd = $ ( '#eqmt_grp_cd' );
    var $junctionboxChoiceBox = $ ( '#junctionbox_choice_box' );
    $eqmtGrpCd.on ( 'change', function ()
    {
        var eqmtGrpCd = $ ( this ).val ();
        if ( eqmtGrpCd === staticVariable.eqmtGrpCdEqgr08 )
        {
            $junctionboxChoiceBox.show ().find ( '#junctionbox_eqmt_id option' ).eq ( 0 ).prop ( 'selected', true )
                    .closest ( '#junctionbox_eqmt_id' ).trigger ( 'change' );
        } else
        {
            $junctionboxChoiceBox.hide ();
        }
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
    energyAnalysis = {
        pvAcmsltRateList : getPvAcmsltRateInfo (),
        initFlag : {
            plant : true,
            equipment : true,
            cod : true
        }
    };

    $ ( '#btnSubmit' ).trigger ( 'click' );
}

$ ( function ()
{
    initDatetimepicker ();
    customizeForm ();
    checkJunSelect ();
    initUnit ();

    $.when ( true ).done ( function ()
    {
        searchEnergy ();
        initPage ();
    } );
} );