// 발전소 정보 (ex : 'PV001' , '강북아리수정수장 태양광발전소')
var pvMap;
// 설비 정보
var eqmtMap;

// Key 초기 값 (ex : 'PV001' -> 처음으로 조회되는 발전소의 Key를 초기 값으로 함)
// 발전소 선택 최초 조회시(selectDataGatewayPVList) 첫 번째 발전소의 pvId를 저장 함
// 발전소를 선택 하면 선택된 발전소로 값 변경
var pvKey;

// 국가 콤보 박스
function customizeForm ()
{
    var $dateType = $ ( '#country_type' ).customizeSelect ( {
        width : 262,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select08',
        focusClass : 'custom-form-focused08',
        disableClass : 'custom-form-disabled08'
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
    $ ( '.scrolled' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );

    $ ( '.scrolled_dg' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// 발전소 목록 영역 활성화 이미지 class 처리
function changeClamp ()
{
    $ ( '.stw06 .scrolled ul > li > a' ).hover ( function ()
    {
        $ ( this ).children ( '.icon_clamp_nm' ).removeClass ().addClass ( "icon_clamp_hv" );
    }, function ()
    {
        $ ( this ).children ( '.icon_clamp_hv' ).removeClass ().addClass ( "icon_clamp_nm" );
    } )
}

// 발전소 목록 조회 ajax
function selectDataGatewayPVList ( nationId, mode )
{
    var param = {
        nationId : nationId
    }
    $.ajax ( {
        url : contextPath + '/hom/sysmgt/datagateway/selectDataGatewayPVList.ajax',
        type : 'POST',
        dataType : 'json',
        data : param,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var $pvList = $ ( '#pvList' );

                if ( typeof mode !== 'undefined' && mode === 'refresh' )
                {
                    $pvList.mCustomScrollbar ( 'destroy' );
                }

                // 발전소 목록 HTML Parsing 및 생성
                var rstHtml = createPVListHtml ( json.data );

                // 발전소 목록 영역에 HTML Append
                $pvList.html ( rstHtml );

                // pvKey는 초기 발전소 ID로 사용 됨. - 설비 정보 목록 초기화
                // pvKey == undefined 일 경우 페이지 첫 로딩.
                // mode == refresh일 경우 국가 콤보 변경 Case.
                if ( !pvKey || mode === 'refresh' )
                {
                    // 발전소 목록 중 첫 번째 발전소 id 할당
                    pvKey = $ ( "#pvList > ul > li > a" ).attr ( "id" );

                    // 발전소 목록의 scroll을 최상단으로 이동
                    // $ ( "#mCSB_1_container" ).css ( "top", "0px" );
                    // $ ( "#mCSB_1_dragger_vertical" ).css ( "top", "0px" );
                }

                // 발전소 트리 custom scroll
                $pvList.mCustomScrollbar ( {
                    scrollButtons : {
                        enable : true
                    },
                    theme : 'inset-2',
                    scrollbarPosition : 'inside',
                    scrollInertia : 300
                } );

                // GATEWAY 목록 조회 ajax
                selectDataGateWayList ( pvKey );

                // 설비목록조회 ajax
                selectDataGatewayEqmtList ( pvKey );

                // 설비 목록 스크롤바
                customizeScroll ();

                // 이벤트 적용
                eventTriggerSetting ();

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

// GATEWAY 목록 조회 ajax
function selectDataGateWayList ( pvId )
{
    // 초기 설비 타이틀 Update
    updatePvTitleHtml ( pvId );

    var params = {
        pvId : pvId
    };

    var $gateWayList = $ ( '#gateWayList' );

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/datagateway/selectDataGateWayList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // HEIS GateWay가 여러대인 것과 아닌것을 확인하기 위해 null 처리 안함
                var template = _.template ( dataGateWay.tpl.gateWayInfo );

                var html = template ( {
                    gateWayList : json.data
                } );

                $gateWayList.html ( html );

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

// 국가별 카운트 정보 Map 생성
// (ex. nationCntMap : [{'JP' : 10}, {'KR' : 34}] )
function selectNationCntMap ( data )
{
    var nationCntMap = new Map ();
    var nationCnt = 0;
    var nation;
    $.each ( data, function ( idx, item )
    {
        // * init
        if ( !nation )
        {
            nation = item.nationId;
            nationCnt = 0;
        }

        // * put case 1 : 국가 정보가 바뀔 경우
        if ( nation != item.nationId )
        {
            nationCntMap.put ( nation, nationCnt );
            nation = item.nationId;
            nationCnt = 0;
        }
        nationCnt++;

        // * put case 2 : 배열의 최종 Index
        if ( data.length == (idx + 1) )
        {
            nationCntMap.put ( nation, nationCnt );
        }
    } );

    return nationCntMap;
}

// 발전소 목록 HTML Parsing 및 생성
function createPVListHtml ( data )
{
    // 발전소 선택 목록 HTML Format
    // 발전소 상태 아이콘 Class - icon_lamp_red : Falt, icon_lamp_orange : 없음, icon_lamp_green : 정상 , icon_lamp_disabled : 미연계
    var titleFormat = "<h4><i class=\"icon_blt04\"></i>{0}</h4>";

    var wrapFormat = "<ul>{0}</ul>";

    var contentsFormat = //
    "<li>" + // pvId : 발전소ID
    "<a href=\"javascript:;\" name=\"PV\" id=\"{0}\">" + //
    "<i class=\"{1}\"></i>" + // 발전소 상태 아이콘 Class
    "{2}" + // 발전소 명
    "<i class=\"{3}\"></i>" + // icon_clamp_nm : 활성, icon_clamp_da : 비활성
    "</a>" + //
    "</li>";

    // 국가별 카운트 정보 Map 생성
    var nationCntMap = selectNationCntMap ( data );

    // HTML 결과물
    var contentsHtml = ""; // 내용 : 설비명 표시
    var rstHtml = ""; // 최종 결과물 : 타이틀 + 내용 조합
    var index = 0;
    $.each ( data, function ( idx, item )
    {
        // i18n : 설비명, 국가명
        var pvNm = getI18nItemNm ( item, 'pv' );
        var nationNm = getI18nItemNm ( item, 'nation' );

        // 발전소 정보 - Map에 assign
        // SubTitle 변경 용도
        pvMap.put ( item.pvId, pvNm );

        // 타이틀 영역(국가 정보) HTML
        // * 첫 번째 Index일 경우 Title 생성
        if ( index == 0 )
        {
            rstHtml += cf_stringFormat ( titleFormat, nationNm );
        }

        // * 국가별 설비 목록 영역 HTML
        // - itemStatus() 메서드는 val 값에 따라 다음의 class 속성들 중 하나를 반환한다
        // ("icon_lamp_green", "icon_lamp_red", "icon_lamp_orange", "icon_lamp_disabled")
        // - classStatus() 메서드는 val 값에 따라 다음의 class 속성들 중 하나를 반환한다
        // ("icon_clamp_nm", "icon_clamp_da")
        contentsHtml += cf_stringFormat ( contentsFormat, item.pvId, itemStatus ( 3 ), pvNm, classStatus ( 1 ) );

        // * 각 국가별 카운트 정보를 비교하여 index 초기화 및 국가별 설비 목록 Html Wrapping
        if ( index == nationCntMap.get ( item.nationId ) - 1 )
        {
            index = 0;
            rstHtml += cf_stringFormat ( wrapFormat, contentsHtml );
            contentsHtml = "";
        } else
        {
            index++;
        }
    } );

    return rstHtml;
}

// 설비 목록 조회 ajax
function selectDataGatewayEqmtList ( pvId )
{
    // 초기 설비 타이틀 Update
    updatePvTitleHtml ( pvId );

    var params = {
        pvId : pvId
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/datagateway/selectDataGatewayEqmtList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var trFmt = "<tr>{0}</tr>";
                var tdFmt = "<td id=\"{0}\"><i class=\"{1}\"></i>{2}</td>";

                var contentHtml = "";
                var rstHtml = "";

                $.each ( json.data, function ( idx, item )
                {

                    var eqmtNm = getI18nItemNm ( item, 'eqmt' );

                    // td 조립
                    // ex : <td id='PV001'><i class='icon_lamp_green'></i>''</td>
                    // - itemStatus() 메서드는 val 값에 따라 다음의 class 속성들 중 하나를 반환한다
                    // ("icon_lamp_green", "icon_lamp_red", "icon_lamp_orange", "icon_lamp_disabled")
                    contentHtml += cf_stringFormat ( tdFmt, item.eqmtId, itemStatus ( item.pvStatus ), eqmtNm );

                    // 설비 정보 적재 (태그ID, 설비명)
                    // 설비 상태 Update 용도
                    eqmtMap.put ( item.tagId, item.eqmtId );

                    // 설비 목록은 1개의 tr 하위에 3개의 td로 구성 되어야 한다
                    if ( (idx + 1) % 3 == 0 )
                    {
                        // tr 씌우기
                        rstHtml += cf_stringFormat ( trFmt, contentHtml );
                        contentHtml = "";
                    }

                    // 3, 6, 9 형태로 3개의 td가 tr에 감싸지는 형태이지만
                    // 2, 5, 8과 같이 td가 3개가 되지 않을 경우 빈 td를 만들어 준다.
                    // ex : 2
                    // <td id='PV001'><i class='icon_lamp_green'></i>''</td>
                    // <td id='PV001'><i class='icon_lamp_green'></i>''</td>
                    // <td></td>
                    if ( (idx + 1) % 3 != 0 && json.data.length - 1 == idx )
                    {
                        // 2에서 index의 나머지 값을 빼면 빈 td로 채워야 할 갯수가 나옴
                        var idxCount = 2 - idx % 3;
                        for ( var i = 0; i < idxCount; i++ )
                        {
                            contentHtml += cf_stringFormat ( tdFmt, '', '', '' );
                        }
                        rstHtml += cf_stringFormat ( trFmt, contentHtml );
                        contentHtml = "";
                    }
                } );

                $ ( "#eqmtLst > tbody" ).empty ().append ( rstHtml );
                rstHtml = "";

                selectRealtimeStatus ();
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

// 발전소 설비 상태 정보 조회 ajax
function selectDataGatewayEqmtCommunicationStatus ( pvId )
{
    var param = {
        pvId : pvId
    }
    $.ajax ( {
        url : contextPath + '/hom/sysmgt/datagateway/selectDataGatewayEqmtCommunicationStatus.ajax',
        type : 'POST',
        dataType : 'json',
        data : param,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // Etos Key 조합 (ex : PV001#WHM0000_ETS0001_E_001_HBEAT)
                var etosKey = pvKey + homConstants.etosHbeatTagId;

                $.each ( json.data, function ( key, val )
                {
                    var multiGW = "N";

                    if ( JSON.stringify ( json ).indexOf ( "HGW" ) >= 0
                            || JSON.stringify ( json ).indexOf ( "ETS" ) >= 0 )
                    {
                        multiGW = "Y";
                    }

                    // IDC, 발전소, ETOS는 단 건으로, 위치 정보는 하드코딩 임
                    // - itemStatus() 메서드는 val 값에 따라 다음의 class 속성들 중 하나를 반환한다
                    // ("icon_lamp_green", "icon_lamp_red", "icon_lamp_orange", "icon_lamp_disabled")
                    /*
                     * if ( key == "InterSysLink" ) { // Data Gateway IDC $ ( "#dtGwLst > tbody > tr:eq(0) > td > i"
                     * ).attr ( "class", itemStatus ( val ) ); } else if ( key == pvKey ) { // Data Gateway 발전소 $ (
                     * "#dtGwLst > tbody > tr:eq(1) > td > i" ).attr ( "class", itemStatus ( val ) ); } else if ( key ==
                     * etosKey ) { // ETOS $ ( "#eqmtLst > thead > tr > th > i" ).attr ( "class", itemStatus ( val ) ); }
                     */
                    /*
                     * HEIS GateWay n개 표시 전 원래 소스 if ( key == "InterSysLink" ) { // Data Gateway IDC $ ( "#dtGwLst >
                     * tbody > tr:eq(0) > td > i" ).attr ( "class", itemStatus ( val ) ); } else if ( key == pvKey ) { //
                     * Data Gateway 발전소 $ ( "#eqmtLst > thead > tr > th > i" ).attr ( "class", itemStatus ( val ) ); }
                     * else { // 그 외 설비 정보 var eqmtId = eqmtMap.get ( key ); if ( eqmtId ) { $ ( "#" + eqmtId + " > i"
                     * ).attr ( "class", itemStatus ( val ) ); } }
                     */

                    /** 상태 정보 조회 */
                    if ( key == staticVariable.systemIdISL )
                    {
                        // 1. Data Gateway IDC 상태 정보
                        $ ( "#dtGwLst > tbody > tr:eq(0) > td > i" ).attr ( "class", itemStatus ( val ) );
                    } else if ( key.indexOf ( 'HGW' ) >= 0 || key.indexOf ( 'ETS' ) >= 0 )
                    {
                        // 2. Data Gateway 발전소 상태 정보(HIES GATEWAY,ETOS)
                        $ ( "#" + key.substring ( 14, 21 ) ).attr ( "class", itemStatus ( val ) );
                    } else if ( key == pvKey && multiGW == "N" )
                    {
                        // 3. Data Gateway 발전소 상태 정보
                        $ ( "#gateWayList .gateWay > span > i" ).attr ( "class", itemStatus ( val ) );
                    } else
                    {
                        // 4. 그 외 설비 정보
                        var eqmtId = eqmtMap.get ( key );
                        if ( eqmtId )
                        {
                            $ ( "#" + eqmtId + " > i" ).attr ( "class", itemStatus ( val ) );
                        }
                    }
                } );

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

// 발전소 별 상태 조회 ajax
function selectDataGatewayCommunicationStatus ( pvIdLists )
{
    var params = {
        pvIdLists : pvIdLists
    }
    $.ajax ( {
        url : contextPath + '/hom/sysmgt/datagateway/selectDataGatewayCommunicationStatus.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $.each ( json.data, function ( key, val )
                {
                    // * 발전소 목록의 상태 Update 첫 번째 class는 서버 상태 정보, 두 번째 class는 '>' 표시 이미지 상태 정보

                    // - itemStatus() 메서드는 val 값에 따라 다음의 class 속성들 중 하나를 반환한다
                    // ("icon_lamp_green", "icon_lamp_red", "icon_lamp_orange", "icon_lamp_disabled")
                    $ ( "#" + key + " > i:eq(0)" ).attr ( "class", itemStatus ( val ) );

                    // - classStatus() 메서드는 val 값에 따라 다음의 class 속성들 중 하나를 반환한다
                    // ("icon_clamp_nm", "icon_clamp_da")
                    $ ( "#" + key + " > i:eq(1)" ).attr ( "class", classStatus ( val ) );
                } );

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

// 실시간 발전소 별 상태 조회
function selectRealtimeStatus ()
{
    var pvIdLists;
    // 발전소 목록은 Scroll 영역 때문에 id="mCSB_1" 이하 HTML을 순회 해야 함.
    $ ( "#pvList > div > div > ul > li > a" ).each ( function ( i )
    {
        // PV001, PV002, PV003... 형태로 Parsing
        if ( pvIdLists )
        {
            pvIdLists += "," + $ ( this ).attr ( "id" );
        } else
        {
            pvIdLists = "";
            pvIdLists = $ ( this ).attr ( "id" );
        }
    } );

    // 발전소 상태 조회
    selectDataGatewayCommunicationStatus ( pvIdLists );

    // 설비 상태 조회
    selectDataGatewayEqmtCommunicationStatus ( pvKey );

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

// 발전소 상태에 따른 이미지 분기 처리 (html Class)
function classStatus ( status )
{
    var arrClassStatus = [ "icon_clamp_nm", "icon_clamp_da" ];
    var idx = 1;

    // 미연계 상태가 아닐 경우
    if ( status && status != -1 )
    {
        idx = status;
    }

    // 상태 정보가 undefined, null, "", -1일 경우 - 비활성 아이콘 반환
    if ( !status || status == -1 )
    {
        return arrClassStatus[idx];
    } else if ( status == 0 || status == 1 ) // 상태 정보가 정상이거나 Falt일 경우
    {
        return arrClassStatus[idx];
    }
}

// 설비 상태 체크 아이콘(html class)
function itemStatus ( status )
{
    var arrIconStatus = [ "icon_lamp_green", "icon_lamp_red", "icon_lamp_orange", "icon_lamp_disabled" ];

    // green : 정상(0), red : Falt(1), disabled : 미 연계(-1)
    var idx = 3;

    if ( typeof status !== 'undefined' && status != -1 )
    {
        idx = status;
    }

    if ( typeof status === 'undefined' || status == -1 )
    {
        return arrIconStatus[idx];
    } else if ( status == 0 || status == 1 )
    {
        return arrIconStatus[idx];
    }
}

// 컨텐츠 영역 - 발전소 설비 HTML 서브 타이틀 변경
function updatePvTitleHtml ( key )
{
    var mapKey = pvKey;

    if ( key )
    {
        mapKey = key;
    }

    // ex : <i class='icon_config'></i>
    var titType03iHtml = $ ( ".tit_type03_i" ).html ().replace ( $ ( ".tit_type03_i" ).text (), '' );
    // 기존 Html Tag를 가져온 후 서브타이틀 Text를 추가하여 HTML Update
    $ ( ".tit_type03_i" ).empty ().append (
            titType03iHtml + " " + pvMap.get ( mapKey ) + " " + i18nMessage.msg_facilities );
}

// UI Event 정의
function eventTriggerSetting ()
{
    // 발전소 선택 (국가별 발전소 목록) - 발전소 Click Event
    // $ ( "*[id^=PV]" ).unbind ( "click" ).bind ( 'click', function ()
    $ ( "*[name^=PV]" ).unbind ( "click" ).bind ( 'click', function ()
    {
        pvKey = $ ( this ).attr ( "id" );
        selectDataGateWayList ( pvKey );
        selectDataGatewayEqmtList ( pvKey );
    } );

    // 발전소 선택 - 국가 콤보 박스 Event
    $ ( '#country_type' ).unbind ( "change" ).bind ( 'change', function ()
    {
        var nationId = $ ( '#country_type option:selected' ).val ();
        if ( nationId )
        {
            // 발전소 목록 조회
            selectDataGatewayPVList ( nationId, 'refresh' );
        }
    } );
}

$ ( function ()
{
    dataGateWay = {
        tpl : {
            gateWayInfo : getTemplate ( templates.dataGateWay )
        }
    }

    pvMap = new Map ();
    eqmtMap = new Map ();

    customizeForm ();
    changeClamp ();

    // 발전소 목록 조회 ajax
    // 발전소 목록 조회 완료 후 설비 목록 조회 ajax 실행
    selectDataGatewayPVList ();

    // 10초 간격으로 상태 조회
    setInterval ( function ()
    {
        // 실시간 발전소 별 상태 조회
        selectRealtimeStatus ();
    }, 10000 );
} );