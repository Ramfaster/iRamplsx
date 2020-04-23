var pvTreeCheckListMap; // 발전소 Tree 목록 정보 Map
var dateReminderInfoMap; // 미리알림 정보 Map
var updateFlag = false;
var popupUrl = contextPath + '/hom/servicemgt/operation/operationMgtPopup.do';
var viewUrl = contextPath + '/hom/servicemgt/operation/operationMgtView.do';
// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + 'css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + 'css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $selType1 = $ ( '#sel_type0' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $selType2 = $ (
            '#sel_type, #sel2_type, #sel3_type, #sel4_type, #sel5_type, #sel6_type, #sel7_type, #sel8_type, #sel9_type' )
            .customizeSelect ( {
                width : 110,
                paddingHorizontal : 15,
                height : 30,
                color : '#3c3c3c',
                initClass : 'custom-form-select06',
                focusClass : 'custom-form-focused06',
                disableClass : 'custom-form-disabled06'
            } );

    var $selType3 = $ ( '#sel_type_file, #sel_type_file1, #sel_type_file2, #sel_type_file3, #sel_type_file4' )
            .customizeSelect ( {
                width : 80,
                paddingHorizontal : 15,
                height : 25,
                color : '#3c3c3c',
                initClass : 'custom-form-select07'
            } );

    $ ( '#file1, #file7' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : '찾기',
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25
    } );

    $ ( '#file2, #file3, #file4, #file5, #file6' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : '찾기',
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 230,
        height : 25
    } );

    // 통화단위 선택
    var $select1 = $ ( '.select1' );
    $select1.select2 ();

    var flag = true;

    // select event
    $select1.on ( 'select2:open', function ( e )
    {
        if ( flag )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            flag = false;
        }
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
        todayBtn : true
    } );

    $ ( '.yyyymm' ).datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmddhh' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:00',
        startView : 2,
        minView : 1,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
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
        todayBtn : true
    } );

}

// scroll customize
function customizeScroll ()
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

    $ ( '.frm_con01 .frm_cont_wrap, .tbl_add_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// treemenu customize
function customizeTree ()
{

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectOperationPlanTreeListInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            treeType : 'NP'
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $.each ( json.data, function ( idx, item )
                {
                    // 체크 된 발전소 목록을 전역 변수에 저장 (초기 셋팅)
                    if ( item.pId && item.checked === true )
                    {
                        var checkedId = pvTreeCheckListMap.get ( item.id );
                        if ( checkedId == 'checked' )
                        {
                            pvTreeCheckListMap.remove ( item.id );
                        } else
                        {
                            pvTreeCheckListMap.put ( item.id, 'checked' );
                        }
                    }
                } );
                initTree ( json.data );

                // FullCalendar 스케줄러 달력 호출
                calendar ();
            }
        }
    } );
}

// Full Calendar
function calendar ()
{
    var calcLocale = getLocaleInfo ();
    var today = homUtil.getToday ( homUtil.dateFormat.convertYYYYMMDD );

    var $calendar = $ ( '#calendar' );

    $calendar.fullCalendar ( {
        displayEventTime : false,
        defaultView : 'agendaWeek',
        defaultDate : today,
        selectable : true,
        selectHelper : true,
        weekMode : 'variable',
        contentHeight : 684,
        locale : calcLocale,
        editable : true,
        droppable : true,
        forceEventDuration : true,
        eventStartEditable : true,
        eventDurationEditable : true,
        eventLimit : true,
        header : {
            left : '',
            center : 'prev, title, next, today',
            right : 'month,agendaWeek'
        },
        events : function ( start, end, timezone, callback )
        {
            var params = {
                opertPlanBeginDt : moment ( this.view.start ).format ( "YYYY-MM-DD" ),
                opertPlanTrmnatDt : moment ( this.view.end ).format ( "YYYY-MM-DD" ),
                pvList : getPvStrParseList ()
            };

            // // 운영관리 - 월 단위 및 주단위 작업 계획 목록 조회
            $.ajax ( {
                url : contextPath + '/hom/servicemgt/operation/selectOperationPlanList.ajax',
                type : 'POST',
                data : params,
                dateType : 'json',
                success : function ( json )
                {
                    var events = [];
                    if ( json.data )
                    {
                        // 달력 스케줄에 작업 계획 목록을 조회 한다.
                        $.map ( json.data, function ( result )
                        {
                            // 발전소 명
                            var pvNm;
                            // 업무 구분 명 (점검, 보수, 정전, 사고)
                            var aplctnSectnNm;

                            if ( lang == locale.korea || lang == locale.korean )
                            {
                                pvNm = result.pvKorNm;
                                aplctnSectnNm = result.aplctnSectnKorNm;
                            } else
                            {
                                pvNm = result.pvEngNm;
                                aplctnSectnNm = result.aplctnSectnEngNm;
                            }

                            var title = "[" + aplctnSectnNm + "]" + pvNm;

                            var color;

                            /* TODO : 업무구분 코드 변경 및 추가시 색상정보 Code 수정 필요 함 */
                            // '#559521' : 녹색 (점검 : WCHK01)
                            // '#F6B60A' : 노랑 (보수 : WCHK09)
                            // '#FF8400' : 주황 (정전 : WCHK12)
                            // '#F2291F' : 빨강 (사고 : WCHK13)
                            switch ( result.aplctnSectnCd )
                            {
                                case 'WCHK01':
                                    color = '#559521';
                                    break;
                                case 'WCHK09':
                                    color = '#F6B60A';
                                    break;
                                case 'WCHK12':
                                    color = '#FF8400';
                                    break;
                                case 'WCHK13':
                                    color = '#F2291F';
                                    break;
                                default:
                                    color = '#3A87AD';
                            }

                            var element = new Object ();
                            element.id = result.opertPlanSeq;
                            element.title = title;
                            element.start = result.opertPlanBeginDt;
                            element.contents = result.opertPlanConts;
                            element.color = color;

                            if ( result.opertPlanTrmnatDt )
                            {
                                element.end = result.opertPlanTrmnatDt;
                            }

                            events.push ( element );
                        } );

                        callback ( events );

                        // - 보증기간 만료 목록 조회 -
                        // 1. 보증기간 만료 정보 조회 selecteGmtGrntExprList ()
                        // 2. 계약기간 만료 목록 조회 selectContractDateExpirationList ()
                        // 3. 보유수량 부족 목록 조회 selectHoldingQuantityLackList ()
                        // 4. 미리알림 조회 대상 발전소 목록 조회 selectDateReminderPVList () 순서로 실행 됨.
                        // 각 단계별 조회 성공시 순차적으로 연속 조회 한다(ajax) 단계별 성공 결과물은 dateReminderInfoMap 맵에 저장하며,
                        // 4. 미리알림 조회 대상 발전소 목록 조회 성공시 일괄 Parsing 한다.
                        selecteGmtGrntExprList ();
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
        },
        // 이미 등록된 작업 계획 일정을 클릭 할 때 발생하는 Event
        // 작업 계획 상세 Layer Popup을 호출 한다.
        eventClick : function ( event, element )
        {
            var id = event.id;

            var params = '?' + encodeURI ( 'opertPlanSeq=' + id );
            $ ( '.btn_view_hidden' ).prop ( 'href', viewUrl + params );
            $ ( '.btn_view_hidden' ).trigger ( 'click' );
        },
        // 특정 일을 클릭하거나 Drag하여 여러 일정을 선택할 경우 발생 하는 Event
        // 선택된 범위 만큼 작업 계획 일정을 등록 한다.
        select : function ( start, end, jsEvent, view )
        {
            console.log ( "select start : " + start );
            console.log ( "select end :  " + end );

            var opertPlanBeginDt;
            var opertPlanTrmnatDt;

            // 주 단위(agendaWeek) 모드 : 경우, 시, 분은 동일하게 셋팅
            // 월 단위(month) 모드 : 시작일로 부터 종료일은 1시간 이후로 셋팅
            if ( view.name == 'agendaWeek' )
            {

                // 주 단위 화면(agendaWeek)일 경우 선택영역의 시작 ~ 종료의 년월일 시분을 입력
                opertPlanBeginDt = moment ( start ).format ( "YYYY-MM-DD HH:mm" );
                opertPlanTrmnatDt = moment ( end ).format ( "YYYY-MM-DD HH:mm" );

            } else
            {

                // 월 단위 화면일(month) 경우 선택영역의 시작 ~ 종료의 년월일 + 현재 시분을 입력
                var addMinute = 10;

                opertPlanBeginDt = getDateTimeConvertTodayAddMinute ( start, addMinute );

                // 시작일시와 종료일시(-1일)가 같으면 1시간 더함.
                if ( moment ( start ).format ( "YYYY-MM-DD" ) == moment ( end ).add ( -1, 'day' )
                        .format ( "YYYY-MM-DD" ) )
                {
                    addMinute += 60;
                }

                opertPlanTrmnatDt = getDateTimeConvertTodayAddDaysMinute ( end, -1, addMinute );
            }

            // 발전소 Tree 목록 중 첫 번째 체크 항목 조회
            var selectPvId = getFirstPvIdInZTree ();

            // 시작일, 종료일 Parameter 셋팅
            var params = '?'
                    + encodeURI ( 'opertPlanBeginDt=' + opertPlanBeginDt + '&opertPlanTrmnatDt=' + opertPlanTrmnatDt
                            + '&selectPvId=' + selectPvId );

            // 등록 LayerPopup 호출
            $ ( '.btn_popup_hidden' ).prop ( 'href', popupUrl + params );
            $ ( '.btn_popup_hidden' ).trigger ( 'click' );

        },
        // 일정을 Resize 하면 발생하는 Event
        // Ex : Week 영역의 시간별 편집
        eventResize : function ( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view )
        {
            convertUpdatePlanDate ( event );
        },
        // 일정을 Drag & Drop 했을때 발생하는 Event
        // Drop이 완료되면, 변경된 작업 계획 일정으로 Update
        eventDrop : function ( event, delta )
        {
            convertUpdatePlanDate ( event );
        },
        eventAfterRender : function ( event, $element, view )
        {
            if ( view.type === 'agendaWeek' )
            {
                var $fcEventContainer = $element.closest ( '.fc-event-container' );
                var overlapping = isOverlappingAndCount ( $calendar, event );

                if ( overlapping.flag && overlapping.count > 0 )
                {
                    var width = $fcEventContainer.width () / (overlapping.count + 1);
                    $element.css ( {
                        'margin-right' : '0px',
                        'width' : width + 'px'
                    } );
                }
            }
        }
    } );
}

// event overlapping 여부 반환 및 overlapping 개수 반환(flag : (true : 오버렙, false : 오버렙 아님), count : 오버렛 개수)
function isOverlappingAndCount ( $calendar, event )
{
    var flag = false;
    var count = 0;
    var eventArray = $calendar.fullCalendar ( 'clientEvents' );
    var pureEventStartDate = homUtil.convertDateStringToPureFormat ( event.start._i );
    var pureEventEndDate = homUtil.convertDateStringToPureFormat ( event.end._i );

    $.each ( eventArray, function ( index, evt )
    {
        if ( evt.id !== event.id )
        {
            var pureEvtStartDate = homUtil.convertDateStringToPureFormat ( evt.start._i );
            var pureEvtEndDate = homUtil.convertDateStringToPureFormat ( evt.end._i );

            if ( !(pureEvtStartDate >= pureEventEndDate || pureEvtEndDate <= pureEventStartDate) )
            {
                flag = true;
                count++;
            }
        }
    } );

    return {
        flag : flag,
        count : count
    };
}

// 날짜정보의 날짜, 분 데이터를 현재 날짜, 분 기준에서 수정
function getDateTimeConvertTodayAddDaysMinute ( paramDate, addDays, addMinute )
{
    return getDateTimeConvertTodayHHmm ( paramDate, addDays, 0, addMinute );
}

// 날짜정보의 분 데이터를 현재 분 기준에서 수정
function getDateTimeConvertTodayAddMinute ( paramDate, addMinute )
{
    return getDateTimeConvertTodayHHmm ( paramDate, 0, 0, addMinute );
}

// 날짜정보의 시, 분 데이터를 현재 시, 분 기준에서 수정
function getDateTimeConvertTodayHHmm ( paramDate, addDays, addHours, addMinute )
{
    // 시, 분은 발전소(date) 시간 기준으로 추출
    var hours = moment ( date ).hours () + addHours;
    // 분은 5분 간격으로 올림 처리
    var minute = getMinuteCeil ( moment ( date ).minutes () ) + addMinute;

    // 날짜(date) YYYYMMDD까지는 date에서 추출, 그 외 정보는(시, 분) 현재 시간으로부터 추출
    return moment ( paramDate ).add ( addDays, 'day' ).hours ( hours ).minute ( minute ).format ( "YYYY-MM-DD HH:mm" );
}

// 분 올림 처리(ex : 1분 -> 5분, 5분 -> 5분)
function getMinuteCeil ( minute )
{
    return (Math.ceil ( minute / 5 ) * 5) % 60;
}

// 운영일정관리 일정 변경
function convertUpdatePlanDate ( event )
{
    var opertPlanSeq = event.id;

    var opertPlanBeginDt = moment ( event.start ).format ( 'YYYY-MM-DD HH:mm' );
    var opertPlanTrmnatDt;
    if ( event.end )
    {
        opertPlanTrmnatDt = moment ( event.end ).format ( 'YYYY-MM-DD HH:mm' );
    }
    /*
     * else { // 시작일과 종료일이 같으면 FullCalendar에서는 종료일을 null로 반환한다. // DB에는 종료일을 시작일로 저장. opertPlanTrmnatDt = moment (
     * event.start ).format ( 'YYYY-MM-DD HH:mm' ); }
     */

    // 운영일정관리 일정 변경 (일정 마우스 Drag & Drop)
    updateOperationPlanDate ( opertPlanSeq, opertPlanBeginDt, opertPlanTrmnatDt );
}

// 운영일정관리 일정 변경 (일정 마우스 Drag & Drop)
function updateOperationPlanDate ( opertPlanSeq, opertPlanBeginDt, opertPlanTrmnatDt )
{
    var params = {
        opertPlanSeq : opertPlanSeq,
        opertPlanBeginDt : opertPlanBeginDt,
        opertPlanTrmnatDt : opertPlanTrmnatDt
    };

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/updateOperationPlanDateInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $ ( '#calendar' ).fullCalendar ( 'refetchEvents' );
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

// 미리알림 조회대상 발전소 목록 조회
function selectDateReminderPVList ()
{
    var param = {
        pvList : getPvStrParseList ()
    };

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectDateReminderPVList.ajax',
        type : 'POST',
        data : param,
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var level1UlHtmlFormat = '<ul>{0}</ul>';
                var level2LiDlHtmlFormat = '<li><dl id="{0}">{1}</dl></li>';

                var noData = i18nMessage.msg_noUpcomingNotifications;
                var noDataHtml = '<li><div class="nodata"><i class="icon_nodata"></i>' + noData + '</div></li>';

                var resultHtml = "";
                var dlResultHtml = "";
                $.each ( json.data, function ( idx, item )
                {
                    var pvId = item.pvId;
                    var pvNm = getI18nItemNm ( item, 'pv' );
                    var pvHtml = '<dt><i class="icon_blt05"></i>' + pvNm + '</dt>';

                    var gmtGrntExprHtml = '';
                    var contractDateExpirationHtml = '';
                    var holdingQuantityLackHtml = '';

                    // 보증기간 만료 목록
                    var gmtGrntExprJson = dateReminderInfoMap.get ( 'gmtGrntExpr' + pvId );
                    // 계약기간 만료 목록
                    var contractDateExpirationJson = dateReminderInfoMap.get ( 'contractDateExpiration' + pvId );
                    // 보유수량 부족 목록
                    var holdingQuantityLackJson = dateReminderInfoMap.get ( 'holdingQuantityLack' + pvId );

                    // 보증기간 만료 목록 parsing
                    $.each ( gmtGrntExprJson, function ( idx1, item1 )
                    {
                        if ( pvId === item1.pvId )
                        {
                            var msg = i18nMessage.msg_guaranteeDateExpiration;
                            gmtGrntExprHtml += '<dd><strong>' + msg + ' : </strong><span>'
                                    + getI18nItemNm ( item1, 'eqmt' ) + ' (' + item1.frstBuff + ') ' + item1.scndBuff
                                    + '</span></dd>';
                        }
                    } );

                    // 계약기간 만료 목록 parsing
                    $.each ( contractDateExpirationJson, function ( idx2, item2 )
                    {
                        if ( pvId === item2.pvId )
                        {
                            var msg = i18nMessage.msg_contractDateExpiration;
                            contractDateExpirationHtml += '<dd><strong>' + msg + ' : </strong><span>'
                                    + item2.cntrctTyCdNm + ' (' + item2.frstBuff + ') </span></dd>';
                        }
                    } );

                    // 보유수량 부족 목록 parsing
                    $.each ( holdingQuantityLackJson, function ( idx3, item3 )
                    {
                        if ( pvId === item3.pvId )
                        {
                            var upIconHtml = '<i class="icon_up"></i>';
                            var downIconHtml = '<i class="icon_down"></i>';
                            var statusCount = item3.presentQty;
                            if ( !statusCount )
                            {
                                statusCount = 0;
                            }

                            var upDownIconHtml = upIconHtml;
                            if ( statusCount > 0 )
                            {
                                upDownIconHtml = upIconHtml;
                            } else
                            {
                                upDownIconHtml = downIconHtml;

                                // 음수를 양수로 변경
                                statusCount = Math.abs ( statusCount );
                                var msg = i18nMessage.msg_holdingQuantityLack;
                                holdingQuantityLackHtml += '<dd><strong>' + msg + ' : </strong><span>'
                                        + item3.preparprdItemCdNm + ' ( ' + upDownIconHtml + ' ' + statusCount
                                        + ' )</span></dd>';
                            }

                        }
                    } );

                    // 발전소 정보 + 보증기간 정보 + 계약기간 정보 + 보유 수량 정보 HTML
                    var ddSumHtml = pvHtml + gmtGrntExprHtml + contractDateExpirationHtml + holdingQuantityLackHtml;

                    /* ddSumHtml 결과물 예시 */
                    // <dt><i class="icon_blt05"></i>강북 아리수 정수장</dt>
                    // <dd><strong>보증기간 만료 :</strong><span>ACB (7 일전)</span></dd>
                    // <dd><strong>계약기간 만료 :</strong><span>관리운영 위탁 (3 일전) </span></dd>
                    // <dd><strong>보유수량 부족 :</strong><span>퓨즈 (2 <i class="icon_up"></i> )</span></dd>
                    // li, dl Tag로 Wrapping 처리 : <li><dl> "ddSumHtml 내용" </dl></li>
                    dlResultHtml += cf_stringFormat ( level2LiDlHtmlFormat, pvId, ddSumHtml );
                } );

                // ul Tag로 Wrapping 처리 : <ul> "dlResultHtml 내용" </ul>
                // 결과적으로 다음과 같이 처리 됨 : <ul><li><dl> "ddSumHtml 내용" </dl></li></ul>
                resultHtml += cf_stringFormat ( level1UlHtmlFormat, dlResultHtml );
                dlResultHtml = "";

                if ( json.data.length == 0 )
                {
                    // 발전소 목록이 없을 경우 noData 처리
                    $ ( '.cal_alarm_box' ).empty ().append ( noDataHtml );
                } else
                {
                    // 데이터가 존재할 경우
                    $ ( '.cal_alarm_box' ).empty ().append ( resultHtml );
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

// 보유수량 부족 목록 조회
function selectHoldingQuantityLackList ()
{
    var param = {
        pvList : getPvStrParseList ()
    };

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectHoldingQuantityLackList.ajax',
        type : 'POST',
        data : param,
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    var pvId = json.data[0].pvId;
                    dateReminderInfoMap.put ( 'holdingQuantityLack' + pvId, json.data );
                }

                // 미리알림 조회대상 발전소 목록 조회
                selectDateReminderPVList ();
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

// 계약기간 만료 목록 조회
function selectContractDateExpirationList ()
{
    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectContractDateExpirationList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    var pvId = json.data[0].pvId;
                    dateReminderInfoMap.put ( 'contractDateExpiration' + pvId, json.data );
                }

                // 보유수량 부족 목록 조회
                selectHoldingQuantityLackList ();
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

// 보증기간 만료 목록 조회
function selecteGmtGrntExprList ()
{
    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selecteGmtGrntExprList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {
                    var pvId = json.data[0].pvId;
                    dateReminderInfoMap.put ( 'gmtGrntExpr' + pvId, json.data );
                }

                // 계약기간 만료 목록 조회
                selectContractDateExpirationList ();
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

// Locale 정보 조회
function getLocaleInfo ()
{
    if ( lang == locale.korea || lang == locale.korean )
    {
        return locale.korean;
    } else
    {
        return locale.english;
    }
}

// magnific Layer Popup Open
function showPopup ()
{
    $ ( '.btn_popup_hidden' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );

    $ ( '.btn_view_hidden' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );

    $ ( '.btn_popup' ).click ( function ()
    {
        // 등록 URL을 가져옴

        // 발전소 Tree 목록 중 첫 번째 체크 항목 조회
        var selectPvId = getFirstPvIdInZTree ();

        if ( selectPvId )
        {
            // 시작일, 종료일 Parameter 셋팅
            var params = '?' + encodeURI ( 'selectPvId=' + selectPvId );

            // 등록 LayerPopup 호출
            $ ( '.btn_popup_hidden' ).prop ( 'href', popupUrl + params );
            $ ( '.btn_popup_hidden' ).trigger ( 'click' );
        }
    } );

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

// 트리 메뉴 설정 정보
function initTree ( data )
{
    // 트리메뉴
    var setting = {
        view : {
            selectedMulti : false
        },
        check : {
            enable : true,
            chkStyle : 'checkbox',
            radioType : 'all',
            chkDisabled : true
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        view : {
            showIcon : false
        },
        callback : {
            onCheck : function beforeOnCheck ( event, treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( treeId );
                var checkedNodes = zTree.getCheckedNodes ();
                checkedNodes = getZTreeCheckValidInfo ( checkedNodes, treeNode );

                zTree.checkAllNodes ( false );
                for ( var i = 0; i < checkedNodes.length; i++ )
                {
                    zTree.checkNode ( checkedNodes[i], true, true );
                }
                zTreeCheckEvent ( checkedNodes );
            },
            onClick : function beforeClick ( event, treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( treeId );
                var checkedNodes = zTree.getCheckedNodes ();
                var selectedNodes = zTree.getSelectedNodes ();

                zTreeClickEvent ( checkedNodes, selectedNodes, zTree );
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
}

// Parent, Child에 따른 국가 코드 반환
function getNationCd ( nodes )
{
    if ( nodes.pId )
    {
        return nodes.pId;
    } else
    {
        return nodes.id;
    }
}

// zTree 체크박스 유효성 체크
// - 최종 선택한 발전소의 국가가 기존 체크된 발전소의 국가와 다르다면,
// 기존 타 국가의 발전소는 무두 체크 해제
function getZTreeCheckValidInfo ( checkedNodes, treeNode )
{
    var nationId;

    if ( treeNode )
    {
        nationId = treeNode.pId;
    }

    var nodeList = [];
    if ( checkedNodes )
    {
        $.each ( checkedNodes, function ( idx, item )
        {
            if ( item.pId && treeNode.pId )
            {
                if ( item.pId == treeNode.pId && item.checked == true )
                {
                    nodeList.push ( item );
                }
            } else if ( !treeNode.pId )
            {
                if ( (item.id == treeNode.id || item.pId == treeNode.id) && item.checked == true )
                {
                    nodeList.push ( item );
                }
            }
        } );
    }

    if ( nodeList )
    {
        return nodeList;
    } else
    {
        return checkedNodes;
    }
}

// 발전소 목록 중 첫 번째 선택 항목 조회
function getFirstPvIdInZTree ()
{
    var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
    var checkedNodes = zTree.getCheckedNodes ();

    if ( checkedNodes && checkedNodes.length > 1 )
    {
        var checkedId;
        for ( var i = 0; i < checkedNodes.length; i++ )
        {
            if ( checkedNodes[i].pId != null && checkedNodes[i].checked == true )
            {
                checkedId = checkedNodes[i].id;
                break;
            }
        }
        if ( checkedId )
        {
            return checkedId;
        } else
        {
            return '';
        }
    }
}

// zTree 체크 박스 체크 이벤트
function zTreeCheckEvent ( checkedNodes )
{
    pvTreeCheckListMap.clear ();
    if ( checkedNodes && checkedNodes.length > 0 )
    {
        // 체크된 발전소를 전역 변수에 저장
        $.each ( checkedNodes, function ( idx, item )
        {
            if ( item.pId && item.checked === true )
            {
                pvTreeCheckListMap.put ( item.id, 'checked' );
            }
        } );
    }
    // 체크된 발전소를 FullCalendar에 적용하기 위해 Refresh
    $ ( '#calendar' ).fullCalendar ( 'refetchEvents' );
}

// zTree Text 클릭 이벤트
function zTreeClickEvent ( checkedNodes, selectedNodes, zTree )
{
    // 첫 체크시
    if ( checkedNodes.length == 0 )
    {
        // 부모 (국가) 체크시
        if ( selectedNodes[0].children )
        {
            for ( var i = 0; i < selectedNodes[0].children.length; i++ )
            {
                pvTreeCheckListMap.put ( selectedNodes[0].children[i].id, 'checked' );
            }
            // 자식 (발전소) 체크시
        } else
        {
            pvTreeCheckListMap.put ( selectedNodes[0].id, 'checked' );
        }
        zTree.checkNode ( selectedNodes[0], 'checked', true );
    }

    // Tree의 체크 대상 목록 Loop
    for ( var i = 0; i < checkedNodes.length; i++ )
    {
        var checkedNationCd = getNationCd ( checkedNodes[i] ); // Check 대상 국가코드

        // 동일 부모(국가) 내 자식 (발전소)가 체크 되어 있는 상태에서 형제 선택 시
        if ( !checkedNodes[i].pId && checkedNodes[i].id == selectedNodes[0].pId )
        {
            var pvMap = pvTreeCheckListMap.get ( selectedNodes[0].id );
            if ( pvMap )
            {
                pvTreeCheckListMap.remove ( selectedNodes[0].id );
                if ( pvTreeCheckListMap.size () == 0 )
                {
                    zTree.checkAllNodes ( false );
                } else
                {
                    zTree.checkNode ( selectedNodes[0], 'checked', false );
                }
            } else
            {
                pvTreeCheckListMap.put ( selectedNodes[0].id, 'checked' );
                zTree.checkNode ( selectedNodes[0], 'checked', true );
            }
            break;

            // 부모 (국가) 선택 시 타 국가의 자식(타 국가의 발전소) 선택 시
        } else if ( !checkedNodes[i].pId && selectedNodes[0].pId && checkedNodes[i].id != selectedNodes[0].pId )
        {
            pvTreeCheckListMap.clear ();
            zTree.checkAllNodes ( false );

            pvTreeCheckListMap.put ( selectedNodes[0].id, 'checked' );
            zTree.checkNode ( selectedNodes[0], 'checked', true );
            break;

            // 1 Depth 체크 시
        } else if ( !checkedNodes[i].pId && !selectedNodes[0].pId )
        {
            // 우선 모두 비움
            pvTreeCheckListMap.clear ();
            zTree.checkAllNodes ( false );

            // 1 Depth가 선택되어 있지만 타 국가 1 Depth를 선택 시
            // 타 국가 1 Depth 해제 후 선택한 1 Depth 체크 처리
            if ( checkedNodes[i].id != selectedNodes[0].id )
            {
                for ( var i = 0; i < selectedNodes[0].children.length; i++ )
                {
                    pvTreeCheckListMap.put ( selectedNodes[0].children[i].id, 'checked' );
                }
                zTree.checkNode ( selectedNodes[0], 'checked', true );
            }
            break;
        }
    }

    // 체크된 발전소를 FullCalendar에 적용하기 위해 Refresh
    $ ( '#calendar' ).fullCalendar ( 'refetchEvents' );
}

function getPvStrParseList ()
{
    var pvKeys = pvTreeCheckListMap.keys ();
    var result;
    for ( var i = 0; i < pvKeys.length; i++ )
    {
        if ( result )
        {
            result += ', ' + pvKeys[i];
        } else
        {
            result = pvKeys[i];
        }
    }
    return result;
}

$ ( function ()
{
    dateReminderInfoMap = new Map ();
    pvTreeCheckListMap = new Map ();
    customizeForm ();
    initDatetimepicker ();
    customizeTree ();
    customizeScroll ();
    showPopup ();
} );