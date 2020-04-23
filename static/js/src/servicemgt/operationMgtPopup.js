// 라디오버튼 액션
function radioAction ()
{
    $ ( 'p.sel_rt_date input' ).on ( 'click', function ()
    {
        $ ( '.rd_sel_wrap > li' ).hide ();
        var radioIdx = $ ( this ).attr ( 'id' );
        $ ( '.rd_sel_wrap > li.sel_' + radioIdx ).show ();
    } );

    $ ( '.radio_box > input' ).on ( 'click', function ()
    {
        $ ( '.radio_box' ).removeClass ( 'on' );
        $ ( this ).parent ( '.radio_box' ).addClass ( 'on' );
    } );
}

// form element customize
function customizeForm ()
{
    var $dateType1 = $ ( '.customize_select_s' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        disableColor : '#d0d0d1',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );

    var $dateType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $dateType2 = $ ( '.customize_select_l' ).customizeSelect ( {
        width : 262,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select08',
        focusClass : 'custom-form-focused08',
        disableClass : 'custom-form-disabled08'
    } );

    var $dateType3 = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $imageType = $ ( '.image_type2' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
}

function initSelectBox()
{	
	var $aplctnSectnCd = $ ( '#aplctnSectnCd' );
	var $pvId = $ ( '#pvId' );
	
	$ ( '#itemGubun' ).change ( function ()
	{
	
		var params = {	
				pvId : $pvId.val(),
                aplctnSectnCd : $aplctnSectnCd.val(),
                itemId : $ ( this ).val ()
	    };
	    getEqmtInfoList ( params );

    } );   	
}
function initDatetimepicker ()
{
    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $yyyymmddhhmi = $ ( '.yyyymmddhhmi' );

    // 기간유형 datetimepicker 설정
    $ ( $yyyymmdd ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( $yyyymmddhhmi ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:ii',
        startView : 2,
        minView : 0,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        minuteStep : 2,
        todayHighlight : true,
        todayBtn : true
    } );

    var $yyyymmddhhFromDate = $ ( '#yyyymmddhh_from_date' );
    var $yyyymmddhhToDate = $ ( '#yyyymmddhh_to_date' );
    var $startDatetimePicker = $ ( '#startDatetimePicker' );
    var $endDatetimePicker = $ ( '#endDatetimePicker' );

    var $yyyymmddDate = $ ( '#yyyymmdd_date' );

    var localFromTodate = homUtil.getLocalFromToDate ( date, homConstants.dateTypeYYYYMMDDHH, 1, 1 );
    var localDate = homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD );

    if ( !$yyyymmddhhFromDate.val () )
    {
        $yyyymmddhhFromDate.val ( getDateTimeConvertTodayAddMinute ( date, 10 ) );
    }
    if ( !$yyyymmddhhToDate.val () )
    {
        $yyyymmddhhToDate.val ( getDateTimeConvertTodayAddMinute ( date, 70 ) );
    }
    if ( !$yyyymmddDate.val () )
    {
        $yyyymmddDate.val ( localDate );
    }

    homUtil.setStartEndDatetimepicker ( $startDatetimePicker, $endDatetimePicker, $yyyymmddhhFromDate,
            $yyyymmddhhToDate );

    $yyyymmddhhmi.datetimepicker ().on (
            'changeDate',
            function ( event )
            {
                homUtil.setStartEndDatetimepicker ( $startDatetimePicker, $endDatetimePicker, $yyyymmddhhFromDate,
                        $yyyymmddhhToDate );
            } );
}

// 업무 형태 코드 조회 ( 업무구분 선택 뒤 조회 )
function selectAplctnStleCd ( aplctnSectnCd )
{
    var param = {
        parntsCdId : aplctnSectnCd
    };

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectAplctnStleCd.ajax',
        type : 'POST',
        dataType : 'json',
        data : param,
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var dutyFormSelectHtml = createDutyFormSelectHtml ( json.data );
                $ ( '#aplctnStleCd' ).html ( dutyFormSelectHtml );
                $ ( '#aplctnStleCd' ).trigger ( 'change' );
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

// 업무형태 ComboBox Html 생성
function createDutyFormSelectHtml ( data )
{
    var htmlResult = "";
    var optionFormat = '<option value="{0}">{1}</option>';

    $.each ( data, function ( idx, item )
    {
        htmlResult += cf_stringFormat ( optionFormat, item.cdId, getI18nItemNm ( item, 'cd' ) );
    } );

    return htmlResult;
}

// i18n 아이템 명 parsing
function getI18nItemNm ( item, key )
{

    if ( lang == locale.korea || lang == locale.korean )
    {
        var korKey = cf_stringFormat ( "{0}KorNm", key );
        return item[korKey];
    } else
    {
        var engKey = cf_stringFormat ( "{0}EngNm", key );
        return item[engKey];
    }
}

// 각종 이벤트 Binding 및 초기 작업
function initialization ()
{
    // 운영관리 > 알람관리 - 상세 - Work Order로 부터 등록시
    var occrrncId = $ ( "#occrrncId" ).val ();
    if ( occrrncId )
    {
        // 대상설비 콤보 박스 활성화 처리
        $ ( '#assertTargetCd' ).prop ( 'disabled', false ).trigger ( 'change' );
        var selectInitTextFormat = '<option value="">' + i18nMessage.msg_selection + '</option>';
        $ ( '#aplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger ( 'change' );
    }

    // 업무 구분 Select Box Event
    $ ( '#aplctnSectnCd' ).change ( function ()
    {
        var aplctnSectnCd = $ ( this ).val ();
        var selectInitTextFormat = '<option value="">' + i18nMessage.msg_selection + '</option>';
        switch ( aplctnSectnCd )
        {
            case 'WCHK01': // 점검
                selectAplctnStleCd ( aplctnSectnCd );
                // 업무 형태 콤보 박스 활성화
                $ ( '#aplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );
                // 대상 설비 콤보 박스 비활성화
                $ ( '#itemGubun' ).prop ( 'disabled', true ).trigger ( 'change' );
                $ ( '#assertTargetCd' ).prop ( 'disabled', true ).trigger ( 'change' );
                break;
            case 'WCHK09': // 보수
                selectAplctnStleCd ( aplctnSectnCd );
                // 업무 형태 콤보 박스 활성화
                $ ( '#aplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );
                
                getItemGubunList();
                // 대상 설비 콤보 박스 활성화
                $ ( '#itemGubun' ).prop ( 'disabled', false ).trigger ( 'change' );
                $ ( '#assertTargetCd' ).prop ( 'disabled', false ).trigger ( 'change' );
                
                break;
            case 'WCHK12': // 정전
                // 업무 형태 콤보 박스 비활성화, 선택 text로 초기화
                $ ( '#aplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger ( 'change' );
                // 대상 설비 콤보 박스 비활성화
                $ ( '#itemGubun' ).prop ( 'disabled', true ).trigger ( 'change' );
                $ ( '#assertTargetCd' ).prop ( 'disabled', true ).trigger ( 'change' );
                break;
            case 'WCHK13': // 사고
                // 업무 형태 콤보 박스 비활성화
                $ ( '#aplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger ( 'change' );
                
                getItemGubunList();
                // 대상 설비 콤보 박스 활성화
                $ ( '#itemGubun' ).prop ( 'disabled', false ).trigger ( 'change' );
                $ ( '#assertTargetCd' ).prop ( 'disabled', false ).trigger ( 'change' );
                break;
        }
    } );

    // 초기화 버튼 click Event
    $ ( '#popupClear' ).click ( function ()
    {
        // 발전소 명 초기화
        $ ( '.customize_select_l option:eq(0)' ).prop ( 'selected', true ).trigger ( 'change' );

        // 반복 주기 초기화
        $ ( 'input[name=reptitCycleCd]:eq(0)' ).prop ( 'checked', true ).trigger ( 'change' );
        $ ( '.sel_rd2' ).hide ();
        $ ( '.sel_rd3' ).hide ();
        $ ( '.sel_rd4' ).hide ();

        // 업무구분 초기화
        $ ( '#aplctnSectnCd option:eq(0)' ).prop ( 'selected', true ).trigger ( 'change' );

        // 업무 형태 초기화
        $ ( '#aplctnStleCd option:eq(0)' ).prop ( 'selected', true ).trigger ( 'change' );

        // 대상설비 초기화
        $ ( '#assertTargetCd option:eq(0)' ).prop ( 'selected', true ).trigger ( 'change' );

        // 미리알림 초기화
        $ ( '#bfrhdNtcnCd option:eq(0)' ).prop ( 'selected', true ).trigger ( 'change' );

        // 내용 초기화
        $ ( "#opertPlanConts" ).val ( "" );

        // 업무구분 활성화
        $ ( '#aplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );
        // 대상설비 비활성화
        $ ( '#assertTargetCd' ).prop ( 'disabled', true ).trigger ( 'change' );
    } );

    $opertPlanSeq = $ ( "#opertPlanSeq" );
    var $assertTargetCd = $ ( '#assertTargetCd' );
    var $aplctnSectnCd = $ ( '#aplctnSectnCd' );
    // 등록 버튼 click Event
    $ ( '#popupRegister' ).click (
            function ()
            {
                if ( ($aplctnSectnCd.val () === 'WCHK09' || $aplctnSectnCd.val () === 'WCHK13')
                        && $assertTargetCd.val () === '' )
                {
                    alert ( i18nMessage.msg_alertEqmtNoExist );
                    return;
                }

                var reNewMode;
                if ( $opertPlanSeq.val () )
                {
                    // 작업 계획 번호가 존재하면 Update
                    reNewMode = staticVariable.methodUpdate;
                } else
                {
                    // 작업 계획 번호가 없을 경우 Insert
                    reNewMode = staticVariable.methodInsert;
                }

                // 유효성 체크
                if ( operationPlanInfoValidate ( reNewMode ) == false )
                {
                    return false;
                }

                insertOrUpdateOperationPlanInfo ( reNewMode );
            } );

    // 업무 형태 콤보 박스 초기 생성
    var aplctnSectnCd = $ ( '#aplctnSectnCd option:selected' ).val ();
    // 업무 형태 코드 조회
    selectAplctnStleCd ( aplctnSectnCd );

    // 상세 조회일 경우 (작업 계획 번호가 존재하면)
    if ( $opertPlanSeq.val () )
    {
        selectOperationPlanInfo ( $opertPlanSeq.val () );

        /*
         * 반복주기, 업무구분, 업무형태, 대상설비 disabled 상태로 변경
         */
        // 반복주기
        $ ( 'input:radio[name=reptitCycleCd]' ).prop ( 'disabled', true ).trigger ( 'change' );
        $ ( 'input:checkbox[name=dayOfWeekCd]' ).prop ( 'disabled', true ).trigger ( 'change' );
        $ ( 'input:radio[name=monthOfSelectRd]' ).prop ( 'disabled', true ).trigger ( 'change' );
        $ ( '#weekOfMonthCd' ).prop ( 'disabled', true ).trigger ( 'change' );
        $ ( 'input:radio[name=dayOfWeekRd]' ).prop ( 'disabled', true ).trigger ( 'change' );
        $ ( '#monthOfPeriodSpecified' ).prop ( 'disabled', true ).trigger ( 'change' );
        $ ( '#yyyymmdd_date' ).prop ( 'disabled', true ).trigger ( 'change' );

        // 업무구분
        // $ ( '#aplctnSectnCd' ).prop ( 'disabled', true ).trigger ( 'change' );

        // 업무형태
        // $ ( '#aplctnStleCd' ).prop ( 'disabled', true ).trigger ( 'change' );

        // 대상설비
        // $ ( '#assertTargetCd' ).prop ( 'disabled', true ).trigger ( 'change' );

        // 초기화 버튼 숨김
        $ ( '#popupClear' ).hide ();
    }

    // 매월 - 순서지정 Radio Button 선택
    setMonthOrderSelect ();
    $ ( 'input[name=monthOfSelectRd]' ).click ( function ()
    {
        var $monthOfSelectRdBtn = $ ( 'input[name=monthOfSelectRd]:checked' );

        if ( $monthOfSelectRdBtn.prop ( 'id' ) === 'monthOrderSelect' )
        {
            // 매월 - 순서지정
            setMonthOrderSelect ();
        } else
        {
            // 매월 - 기간지정
            setMonthPeriodSelect ();
        }

    } );

    $ ( 'input[name=reptitCycleCd]' ).click ( function ()
    {
        var dateTimeFormat = 'YYYY-MM-DD HH:mm';

        var fromDate = moment ();
        var toDate = moment ();

        // 분 단위를 반올림 하여 셋팅 한다.
        var fromMinute = getMinuteCeil ( fromDate.get ( 'minute' ) );
        var toMinute = getMinuteCeil ( toDate.get ( 'minute' ) );

        fromDate.set ( 'minute', fromMinute );
        toDate.set ( 'minute', toMinute );

        var id = $ ( this ).val ();
        switch ( id )
        {
            // 반복 없음
            case 'WRT01':
                // 시작일 : 10분 후로 셋팅
                fromDate.add ( 10, 'minute' );
                // 종료일 : 1시간 10분 후로 셋팅
                toDate.add ( 70, 'minute' );
                break;
            // 매일
            case 'WRT02':
                // 시작일 : 10분 후로 셋팅
                fromDate.add ( 10, 'minute' );
                // 종료일 : 8일 1시간 10분 뒤로 셋팅
                toDate.add ( 70, 'minute' );
                toDate.add ( 8, 'days' );
                break;
            // 매주
            case 'WRT03':
                // 시작일 : 10분 후로 셋팅
                fromDate.add ( 10, 'minute' );
                // 종료일 : 3주 1시간 10분 뒤로 셋팅
                toDate.add ( 70, 'minute' );
                toDate.add ( 3, 'weeks' );
                break;
            // 매월
            case 'WRT04':
                // 시작일 : 10분 후로 셋팅
                fromDate.add ( 10, 'minute' );
                // 종료일 : 3개월 1시간 10분 뒤로 셋팅
                toDate.add ( 70, 'minute' );
                toDate.add ( 3, 'months' );
                break;
            case 'WRT05':
                // 시작일 : 10분 후로 셋팅
                fromDate.add ( 10, 'minute' );
                // 종료일 : 3년 1시간 10분 후로 셋팅
                toDate.add ( 70, 'minute' );
                toDate.add ( 3, 'years' );
                break;
        }
        $ ( '#yyyymmddhh_from_date' ).val ( fromDate.format ( dateTimeFormat ) );
        $ ( '#yyyymmddhh_to_date' ).val ( toDate.format ( dateTimeFormat ) );
    } );

}

// 매월 - 순서지정 Radio Button 선택 시
function setMonthOrderSelect ()
{

    var $weekOfMonthCd = $ ( '#weekOfMonthCd' );
    var $dayOfWeekRd = $ ( 'input[name=dayOfWeekRd]' );
    var $monthOfPeriodSpecified = $ ( '#monthOfPeriodSpecified' );

    $weekOfMonthCd.prop ( 'disabled', false ).trigger ( 'change' );
    $dayOfWeekRd.prop ( 'disabled', false ).trigger ( 'change' );
    $monthOfPeriodSpecified.prop ( 'disabled', true ).trigger ( 'change' );
}

// 매월 - 기간지정 Radio Button 선택 시
function setMonthPeriodSelect ()
{
    var $weekOfMonthCd = $ ( '#weekOfMonthCd' );
    var $dayOfWeekRd = $ ( 'input[name=dayOfWeekRd]' );
    var $monthOfPeriodSpecified = $ ( '#monthOfPeriodSpecified' );

    $weekOfMonthCd.prop ( 'disabled', true ).trigger ( 'change' );
    $dayOfWeekRd.prop ( 'disabled', true ).trigger ( 'change' );
    $monthOfPeriodSpecified.prop ( 'disabled', false ).trigger ( 'change' );
}

// 운영 일정 관리(작업 계획 정보) 상세 조회
function selectOperationPlanInfo ( opertPlanSeq )
{
    var param = {
        opertPlanSeq : opertPlanSeq
    };

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectOperationPlanInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : param,
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 발전소 명 선택
                $ ( '#pvId' ).val ( json.data.pvId ).trigger ( 'change' );

                // 반복 주기 Radio Button 선택
                $ ( "input[name=reptitCycleCd]" ).each ( function ( index )
                {
                    var id = '#reptitCycle' + $ ( this ).val ();
                    if ( $ ( this ).val () == json.data.reptitCycleCd )
                    {
                        $ ( id ).prop ( 'checked', true ).trigger ( 'change' );
                    } else
                    {
                        $ ( id ).prop ( 'checked', false ).trigger ( 'change' );
                    }
                } );

                // 계획일시 셋팅
                var opertPlanBeginDt = json.data.opertPlanBeginDt;
                var opertPlanTrmnatDt = json.data.opertPlanTrmnatDt;
                var endDate;

                if ( opertPlanTrmnatDt )
                {
                    endDate = opertPlanTrmnatDt;
                } else
                {
                    endDate = opertPlanBeginDt;
                }

                $ ( '#yyyymmddhh_from_date' ).val ( opertPlanBeginDt );
                $ ( '#yyyymmddhh_to_date' ).val ( endDate );

                // 업무구분 코드 선택
                $ ( '#aplctnSectnCd' ).val ( json.data.aplctnSectnCd ).trigger ( 'change' );

                // 업무 형태 코드 선택
                if ( json.data.aplctnStleCd )
                {
                    $ ( '#aplctnStleCd' ).val ( json.data.aplctnStleCd ).trigger ( 'change' );
                }

                // 미리알림 코드 선택
                $ ( '#bfrhdNtcnCd' ).val ( json.data.bfrhdNtcnCd ).trigger ( 'change' );

                // 대상설비
                $ ( '#assertTargetCd' ).val ( json.data.itemId ).trigger ( 'change' );

                // 내용
                $ ( '#opertPlanConts' ).val ( json.data.opertPlanConts );

                // 현재 업무 구분 및 발전소 정보로 타이틀 변경
                var aplctnSectnTxt = $ ( '#aplctnSectnCd option:selected' ).text ();
                var pvText = $ ( '#pvId option:selected' ).text ();
                $ ( '.frm_tit' ).html ( '[' + aplctnSectnTxt + ']' + pvText );
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

// 운영일정관리(작업 계획 정보) 등록 처리
function insertOrUpdateOperationPlanInfo ( reNewMode )
{
    // 등록 : insertOperationPlanInfo.ajax
    // 수정 : updateOperationPlanInfo.ajax
    var url = '/hom/servicemgt/operation/' + reNewMode + 'OperationPlanInfo.ajax';

    $ ( '#fromDate' ).val ( $ ( '#yyyymmddhh_from_date' ).val () );
    $ ( '#toDate' ).val ( $ ( '#yyyymmddhh_to_date' ).val () );

    var params = $ ( 'form' ).serialize ();
    var $btnPopup = $ ( '.btn_popup' );

    var tpl = getTemplate ( templates.labelError );

    $.ajax ( {
        url : contextPath + url,
        type : 'POST',
        dataType : 'json',
        data : params,
        async : false,
        success : function ( json )
        {
            $ ( '#reptitCycleCd-error' ).empty ();
            $ ( '#reptitCycleCd-error' ).hide ();
            $ ( '#opertPlanConts-error' ).empty ();
            $ ( '#opertPlanConts-error' ).hide ();

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alertMsg;

                if ( reNewMode == staticVariable.methodUpdate )
                {
                    alertMsg = i18nMessage.msg_alertUpdate;
                } else
                {
                    alertMsg = i18nMessage.msg_alertCreate;
                }

                alert ( alertMsg );
                $btnPopup.magnificPopup ( 'close' );
                $ ( '#calendar' ).fullCalendar ( 'refetchEvents' );
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        id : 'reptitCycleCd',
                        message : json.message,
                        isLeft : false
                    } );

                    $ ( '#' + json.errorCode ).html ( html );
                    $ ( '#' + json.errorCode ).show ();
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

// 운영일정관리(작업 계획 정보) 유효성 체크
function operationPlanInfoValidate ( reNewMode )
{
    var reptitCycleCdVal = $ ( 'input[name=reptitCycleCd]:checked' ).val ();
    var $opertPlanConts = $ ( '#opertPlanConts' );

    var dateTimeFormat = 'YYYY-MM-DD HH:mm';

    var today = moment ();
    var todayStr = today.format ( dateTimeFormat );

    var fromDateStr = $ ( '#yyyymmddhh_from_date' ).val ();
    var toDateStr = $ ( '#yyyymmddhh_to_date' ).val ();

    var fromDate = moment ( fromDateStr, dateTimeFormat );
    var toDate = moment ( toDateStr, dateTimeFormat );

    // 분단위로 비교(현재시간보다 fromDate가 과거일 경우 마이너스(-) 표기
    var diffVal = fromDate.diff ( today, 'minute' );

    // 매주, 매월, 매년 반복 등록시 시작, 종료 시분이 동일하면 안됨.
    // 따라서 fromDate를 기준으로 시분만 validFromDate, validFromDate 에 셋팅하여 시작일시와 종료일시의 시분을 체크
    var validFromDate = moment ( fromDate ).set ( 'hour', moment ( fromDate ).get ( 'hour' ) );
    moment ( validFromDate ).set ( 'minute', moment ( fromDate ).get ( 'minute' ) );

    var validToDate = moment ( fromDate ).set ( 'hour', moment ( toDate ).get ( 'hour' ) );
    moment ( validToDate ).set ( 'minute', moment ( toDate ).get ( 'minute' ) );

    if ( reNewMode == staticVariable.methodInsert )
    {
        // 반복없음이 아닐 경우, 과거 일정 등록 불가.
        if ( reptitCycleCdVal !== 'WRT01' && diffVal < 1 )
        {
            alert ( i18nMessage.msg_validRepetitionNotPast );
            return false;
        }

        switch ( reptitCycleCdVal )
        {
            // 반복 없음
            case 'WRT01':
                // 시작 날짜와 종료 날짜가 같을 수 없음.
                diffVal = fromDate.diff ( toDate, 'minute' );

                if ( diffVal == 0 )
                {
                    alert ( i18nMessage.msg_validFromDateNotEqToDate );
                    return false;
                }
                break;

            // 매일 everyday
            case 'WRT02':
                // 시작일과 현재일시는 최소 2일 이상 간격이 있어야 함.
                var diffDays = 2; // 2일
                diffVal = toDate.diff ( fromDate, 'days' );
                if ( diffVal < diffDays )
                {
                    alert ( i18nMessage.msg_validDailyRepetition2Days );
                    return false;
                }

                // 시작 시분과 종료 시분이 같을 수 없음.
                diffVal = validFromDate.diff ( validToDate, 'minute' );
                if ( diffVal == 0 )
                {
                    alert ( i18nMessage.msg_validRepetitionNotEqMinute );
                    return false;
                }
                break;
            // 매주 every week
            case 'WRT03':
                // 시작일과 현재일시는 최소 2주 이상 간격이 있어야 함.
                var diffWeeks = 2; // 2주
                diffVal = toDate.diff ( fromDate, 'weeks' );
                if ( diffVal < diffWeeks )
                {
                    alert ( i18nMessage.msg_validWeeklyRepetition2Weeks );
                    return false;
                }

                // 매주 선택시 1개 이상의 요일 선택은 필수 조건 임.
                var dayOfWeekCheckedList = $ ( 'input[name=dayOfWeekCd]:checked' ).val ();
                if ( !dayOfWeekCheckedList )
                {
                    alert ( i18nMessage.msg_validWeeklyAtLeastOneDay );
                    return false;
                }

                // 시작 시분과 종료 시분이 같을 수 없음.
                diffVal = validFromDate.diff ( validToDate, 'minute' );
                if ( diffVal == 0 )
                {
                    alert ( i18nMessage.msg_validRepetitionNotEqMinute );
                    return false;
                }
                break;
            // 매월 Monthly
            case 'WRT04':
                // 시작일과 현재일시는 최소 2개월 이상 간격이 있어야 함.
                diffVal = toDate.diff ( fromDate, 'months' );
                var diffMonths = 2; // 2주
                if ( diffVal < diffMonths )
                {
                    alert ( i18nMessage.msg_validMonthlyRepetition2Months );
                    return false;
                }

                // 시작 시분과 종료 시분이 같을 수 없음.
                diffVal = validFromDate.diff ( validToDate, 'minute' );
                if ( diffVal == 0 )
                {
                    alert ( i18nMessage.msg_validFromDateNotEqToDate );
                    return false;
                }

                // 시작 시분과 종료 시분이 같을 수 없음.
                diffVal = validFromDate.diff ( validToDate, 'minute' );
                if ( diffVal == 0 )
                {
                    alert ( i18nMessage.msg_validRepetitionNotEqMinute );
                    return false;
                }
                break;
            // 매년 every year
            case 'WRT05':
                // 시작일과 현재일시는 최소 2년 이상 간격이 있어야 함.
                diffVal = toDate.diff ( fromDate, 'years' );
                var diffYears = 2; // 2주
                if ( diffVal < diffYears )
                {
                    alert ( i18nMessage.msg_validYearRepetition2Years );
                    return false;
                }

                // 시작 시분과 종료 시분이 같을 수 없음.
                diffVal = validFromDate.diff ( validToDate, 'minute' );
                if ( diffVal == 0 )
                {
                    alert ( i18nMessage.msg_validRepetitionNotEqMinute );
                    return false;
                }
                break;
        }
    } else
    {
        // 시작 날짜와 종료 날짜가 같을 수 없음.
        diffVal = fromDate.diff ( toDate, 'minute' );

        if ( diffVal == 0 )
        {
            alert ( i18nMessage.msg_validFromDateNotEqToDate );
            return false;
        }
    }

    var bfrhdNtcnCd = $ ( '#bfrhdNtcnCd option:selected' ).val ();

    diffVal = fromDate.diff ( today, 'hours' );

    switch ( bfrhdNtcnCd )
    {
        // 하루 12시간 전
        case 'PRE01':
            var diffHours = 12;
            if ( diffVal <= diffHours )
            {
                alert ( i18nMessage.msg_validReminder12HoursADay );
                return false;
            }
            break;
        // 하루 13시간 전
        case 'PRE02':
            var diffHours = 13;
            if ( diffVal <= diffHours )
            {
                alert ( i18nMessage.msg_validReminder13HoursADay );
                return false;
            }
            break;

    }

    var opertPlanContsLength = getTextLength ( $opertPlanConts.val () );

    // 내용 300자 이상 입력 시
    if ( opertPlanContsLength > 300 )
    {
        alert ( i18nMessage.msg_validMaxsizeContent );
        return false;
    }

    return true;
}

// 한글 1글자를 2 Size(2Byte)로 인식하여 문자 길이 구하기
function getTextLength ( str )
{
    var len = 0;
    for ( var i = 0; i < str.length; i++ )
    {
        if ( escape ( str.charAt ( i ) ).length == 6 )
        {
            len++;
        }
        len++;
    }
    return len;
}

/*
 * getDateTimeConvert.... () , getMinuteCeil() 함수들은 operationMgt.js에도 구현되어 있지만. alarmMgtView.jsp에서도 사용되기 때문에 재 구현 함.
 */
// 날짜정보의 날짜, 분 데이터를 현재 날짜, 분 기준에서 수정
function getDateTimeConvertTodayAddDaysMinute ( date, addDays, addMinute )
{
    return getDateTimeConvertTodayHHmm ( date, addDays, 0, addMinute );
}

// 날짜정보의 분 데이터를 현재 분 기준에서 수정
function getDateTimeConvertTodayAddMinute ( date, addMinute )
{
    return getDateTimeConvertTodayHHmm ( date, 0, 0, addMinute );
}

// 날짜정보의 시, 분 데이터를 현재 시, 분 기준에서 수정
function getDateTimeConvertTodayHHmm ( date, addDays, addHours, addMinute )
{
    // 시, 분은 현재 시간 기준으로 추출
    var hours = moment ().hours () + addHours;
    // 분은 5분 간격으로 올림 처리
    var minute = getMinuteCeil ( moment ().minutes () ) + addMinute;

    // 날짜(date) YYYYMMDD까지는 date에서 추출, 그 외 정보는(시, 분) 현재 시간으로부터 추출
    return moment ( date ).add ( addDays, 'day' ).hours ( hours ).minute ( minute ).format ( "YYYY-MM-DD HH:mm" );
}

// 분 올림 처리(ex : 1분 -> 5분, 5분 -> 5분)
function getMinuteCeil ( minute )
{
    return (Math.ceil ( minute / 5 ) * 5) % 60;
}

function setPvId ()
{
    var $assertTargetCd = $ ( '#itemGubun' );
    var $aplctnSectnCd = $ ( '#aplctnSectnCd' );
    var tpl = getTemplate ( templates.assertTargetOption );
    var isKorean = false;
    if ( lang === locale.korea || lang === locale.korean )
    {
        isKorean = true;
    }

    $ ( '#pvId' ).on ( 'change', function ()
    {
        var selectedPvId = $ ( this ).val ();

        $.ajax ( {
            url : contextPath + '/hom/servicemgt/operation/selectTargetFacilityList.ajax',
            type : 'POST',
            dataType : 'json',
            data : {
                pvId : selectedPvId,
                aplctnSectnCd : $aplctnSectnCd.val(),
                itemId : ''
            },
            async : false,
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    var data = json.data;
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            message : i18nMessage.msg_selection,
                            isKorean : isKorean,
                            targetFacilityList : data
                        } );

                        $assertTargetCd.empty ().html ( html ).trigger ( 'change' );
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
    } );
}

function getEqmtInfoList (param)
{
    var $assertTargetCd = $ ( '#assertTargetCd' );
    var tpl = getTemplate ( templates.assertTargetOption );
    var isKorean = false;
    if ( lang === locale.korea || lang === locale.korean )
    {
        isKorean = true;
    }

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectTargetFacilityList.ajax',
        type : 'POST',
        dataType : 'json',
        data : param,
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var data = json.data;
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_selection,
                        isKorean : isKorean,
                        targetFacilityList : data
                    } );

                    $assertTargetCd.empty ().html ( html ).trigger ( 'change' );
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

function getItemGubunList ()
{
    var $itemGubun = $ ( '#itemGubun' );
    var $aplctnSectnCd = $ ( '#aplctnSectnCd' );
    var $pvId = $ ( '#pvId' );
    var tpl = getTemplate ( templates.assertTargetOption );
    var isKorean = false;
    if ( lang === locale.korea || lang === locale.korean )
    {
        isKorean = true;
    }

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectTargetFacilityList.ajax',
        type : 'POST',
        dataType : 'json',
        data :  {
            pvId : $pvId.val(),
            aplctnSectnCd : $aplctnSectnCd.val(),
            itemId : ''
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var data = json.data;
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_selection,
                        isKorean : isKorean,
                        targetFacilityList : data
                    } );

                    $itemGubun.empty ().html ( html ).trigger ( 'change' );
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

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    radioAction ();
    initialization ();
    setPvId ();
    initSelectBox();
} );