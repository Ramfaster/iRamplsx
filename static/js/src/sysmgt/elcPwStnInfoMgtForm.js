// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
    
    var $imageTypeChk = $('.image_type_chk').customizeCheckbox({
        backgroundImage: contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x: contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width: 13,
        height  : 13
    });

    var $dateType1 = $ ( '.sel_type, .sel_type_f' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $nationId = $ ( '#nationId' );
    setNationIdSelect2 ( $nationId );

    setAreaIdSelect2 ();

    
    var $spcId = $ ( '#spcId' ); // 주주 SPC
    $spcId.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag2 = true;

    // select event
    $spcId.on ( 'select2:open', function ( e )
    {
        if ( flag3 )
        {
            mCustomScrollbar ();

            flag2 = false;
        }
    } );
    
    
    var $timeZn = $ ( '#timeZnCd' ); // 지역 Time Zone
    $timeZn.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag3 = true;

    // select event
    $timeZn.on ( 'select2:open', function ( e )
    {
        if ( flag3 )
        {
            mCustomScrollbar ();

            flag3 = false;
        }
    } );

    var $crncyUnit = $ ( '#crncyUnit' );
    $crncyUnit.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag4 = true;

    // select event
    $crncyUnit.on ( 'select2:open', function ( e )
    {
        if ( flag4 )
        {
            mCustomScrollbar ();

            flag4 = false;
        }
    } );

    var $chargerNationId = $ ( '#charger_nation_id' );
    $chargerNationId.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag5 = true;

    // select event
    $chargerNationId.on ( 'select2:open', function ( e )
    {
        if ( flag5 )
        {
            mCustomScrollbar ();

            flag5 = false;
        }
    } );
}

function setAreaIdSelect2 ()
{
    var $areaId = $ ( '#areaId' );
    $areaId.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag2 = true;

    // select event
    $areaId.on ( 'select2:open', function ( e )
    {
        if ( flag2 )
        {
            mCustomScrollbar ();

            flag2 = false;
        }
    } );
}

function setNationIdSelect2 ( $nationId )
{
    $nationId.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag1 = true;

    // select event
    $nationId.on ( 'select2:open', function ( e )
    {
        if ( flag1 )
        {
            mCustomScrollbar ();

            flag1 = false;
        }
    } );
}

// select 용 mCustomScrollbar
function mCustomScrollbar ()
{
    $ ( '.select2-results' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// 파일 커스터마이즈 폼
function fileCustomizeForm ()
{
    // custom form
    $ ( '.files' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_sentenceFileSearch,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25,
        enableInitButton : true,
        initButtonBackgroundImage : contextPath + '/css/lib/customizeForm/img/img_close_btn01.png'
    } );

    $ ( '.sel_type_file' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
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

// custom scroll
function customizeScroll ()
{
    $ ( '.form_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// 구글 팝업창
function showPopup ()
{
    var $btnPopup = $ ( '.btn_popup' );
    var errorTpl = getTemplate ( templates.elcPwStnInfoMgtPopupError );
    $btnPopup.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                // 취소 버튼 클릭시
                $ ( '#btn_close' ).on ( 'click', function ()
                {
                    $btnPopup.magnificPopup ( 'close' );
                } );

                // 등록 버튼 클릭시
                $ ( '#btn_register' ).on (
                        'click',
                        function ()
                        {
                            var $lat = $ ( '#lat' );
                            var $lng = $ ( '#lng' );
                            var googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key='
                                    + staticVariable.googleMapGeocodingApiKey;
                            var $registerErrorWrap = $ ( '#register_error_wrap' );
                            if ( $lat.val () !== '' && $lng.val () !== '' )
                            {

                                $.ajax ( {
                                    url : googleUrl + '&latlng=' + $lat.val () + ',' + $lng.val (),
                                    type : "POST",
                                    success : function ( json )
                                    {
                                        if ( json.status === 'OK' )
                                        {
                                            $registerErrorWrap.empty ();
                                            var address = json.results[0].formatted_address;

                                            $ ( '.addrs' ).val ( address );
                                            $ ( '#addr_lat' ).val ( $lat.val () );
                                            $ ( '#addr_lng' ).val ( $lng.val () );
                                            var $addrLatText = $ ( '#addr_lat_text' );
                                            $addrLatText.text ( homUtil.mathFloorComma ( $lat.val (),
                                                    staticVariable.decimalPoint ) );
                                            $addrLatText.next ( '.mglr5' ).text ( '/' );
                                            $ ( '#addr_lng_text' )
                                                    .text (
                                                            homUtil.mathFloorComma ( $lng.val (),
                                                                    staticVariable.decimalPoint ) );

                                            $btnPopup.magnificPopup ( 'close' );
                                        } else
                                        {
                                            if ( errorTpl !== null )
                                            {
                                                var template = _.template ( errorTpl );
                                                var html = template ( {
                                                    errorId : 'register_error',
                                                    errorMessage : i18nMessage.msg_addressSearchError
                                                } );

                                                $registerErrorWrap.empty ().html ( html );
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
                                                if ( errorTpl !== null )
                                                {
                                                    var template = _.template ( errorTpl );
                                                    var html = template ( {
                                                        errorId : 'register_error',
                                                        errorMessage : i18nMessage.msg_unknownError
                                                    } );

                                                    $registerErrorWrap.empty ().html ( html );
                                                }
                                            }
                                        }
                                    }
                                } );
                            } else
                            {
                                if ( errorTpl !== null )
                                {
                                    var template = _.template ( errorTpl );
                                    var html = template ( {
                                        errorId : 'register_error',
                                        errorMessage : i18nMessage.msg_noLatlng
                                    } );

                                    $registerErrorWrap.empty ().html ( html );
                                }
                            }
                        } );
            },
            afterClose : function ()
            {
                $ ( '#btn_close' ).off ( 'click' );
                $ ( '#btn_register' ).off ( 'click' );
            }
        }
    } );
}

// 대륙별 국가 정보 가져오기
function getNationInfo ()
{
    var $cntint = $ ( '#cntintCd' );
    var $nation = $ ( '#nationId' );
    var tpl = getTemplate ( templates.nationInfoSelect );

    $cntint.change ( function ( event )
    {
        var $selectedCntint = $ ( ':selected', $ ( this ) );
        if ( $selectedCntint.val () !== '' )
        {
            getNationInfoMethod ( tpl, $nation, $selectedCntint.val () );
        }
    } );
}

// 협력 업체 국가 정보 가져오기
function getCorprNationInfo ()
{
    var $cntint = $ ( '#charger_cntint_cd' );
    var $nation = $ ( '#charger_nation_id' );
    var $corprCharger = $ ( '#corpr_charger' );
    var tpl = getTemplate ( templates.nationInfoSelect );

    $cntint.change ( function ( event )
    {
        var $selectedCntint = $ ( ':selected', $ ( this ) );
        if ( $selectedCntint.val () !== '' )
        {
            getNationInfoMethod ( tpl, $nation, $selectedCntint.val (), $cntint.is ( ':disabled' ), $corprCharger );
        }
    } );
}

// 대륙별 국가 정보 가져오기 공통 메소드
function getNationInfoMethod ( tpl, $nation, cntintCd, isDisabled, $corprCharger )
{
    var params = {
        cntintCd : cntintCd
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/elcpwstn/selectNationInfoList.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_selection,
                        nationInfoList : json.data
                    } );

                    $nation.empty ().html ( html ).trigger ( 'change' );
                    setNationIdSelect2 ( $nation );

                    if ( isDisabled !== undefined && isDisabled )
                    {
                        // 국가 선택 처리...
                        var $select = $ ( ':selected', $corprCharger );
                        var nationId = $select.data ( 'charger-nation-id' );
                        $nation.attr ( 'disabled', 'disabled' ).val ( nationId ).trigger ( 'change' );
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
}
// 국가별 지역정보 가져오기
function getAreaInfo ( isKorean )
{
    var $nation = $ ( '#nationId' );
    var $area = $ ( '#areaId' );
    var tpl = getTemplate ( templates.areaInfoSelect );

    $nation.change ( function ( event )
    {
        var selectedValue = $ ( ':selected', $ ( this ) ).val ();

        if ( selectedValue !== '' )
        {
            var params = {
                nationId : selectedValue
            };

            $.ajax ( {
                url : contextPath + '/hom/sysmgt/elcpwstn/selectAreaInfoList.ajax',
                type : 'POST',
                data : params,
                dataType : 'json',
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        if ( tpl !== null )
                        {
                            var template = _.template ( tpl );
                            var html = template ( {
                                message : i18nMessage.msg_selection,
                                isKorean : isKorean,
                                areaInfoList : json.data
                            } );

                            $area.empty ().html ( html ).trigger ( 'change' );

                            setAreaIdSelect2 ();
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
    } );
}

// REC 가중치 추가
function addRecInfo ()
{
    var $instlType = $ ( '#instl_type' );
    var $cpcty = $ ( '#cpcty' );
    var $wghtval = $ ( '#wghtval' );
    var $btnRecAdd = $ ( '#btn_rec_add' );

    var recTblFrmTpl = getTemplate ( templates.recInfoTr );
    var liTpl = getTemplate ( templates.recInfoLi );

    $btnRecAdd.click ( function ()
    {
        var $selectedInstlType = $ ( ':selected', $instlType );

        var checkFlag = false;
        var addFlag = false;

        // 설치 타입을 선택하지 않은경우
        if ( $selectedInstlType.val () === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_noSelectedInstallType,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );

            return;
        } else
        {
            var $recTblFrm = $ ( '#rec_tbl_frm' );
            var $recTblFrmTr = $ ( 'tr', '#rec_tbl_frm' );

            // 설치 타입 이미 있는지 확인
            _.each ( $recTblFrmTr, function ( tr )
            {
                if ( $ ( tr ).data ( 'instl-type' ) === $selectedInstlType.val () )
                {
                    checkFlag = true;
                    return true;
                }
            } );

            if ( !checkFlag && recTblFrmTpl !== null )
            {
                var template = _.template ( recTblFrmTpl );
                var html = template ( {
                    message : $selectedInstlType.text (),
                    instlType : $instlType.val (),
                    weight : i18nMessage.msg_weight,
                    capacity : i18nMessage.msg_capacity
                } );

                $recTblFrm.append ( html );
            }

            // rec_list에 li 추가
            var $recList = $ ( '#instl_type_' + $instlType.val () + ' ul' );
            var $recListLi = $ ( 'li', $recList );
            if ( $recListLi.size () > 0 )
            {

            }

            // 이미 등록되어 있는 경우 판별
            _.each ( $recListLi, function ( li )
            {
                if ( parseFloat ( $ ( li ).data ( 'cpcty' ) ) === parseFloat ( $cpcty.val () )
                        && parseFloat ( $ ( li ).data ( 'wghtval' ) ) === parseFloat ( $wghtval.val () ) )
                {
                    addFlag = true;
                    return true;
                }
            } );

            // 이미 등록되어 있는 경우 처리
            if ( addFlag )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_duplicateData,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                // 숫자만 넣었는지 판별
                if ( $cpcty.val () !== '' && !$.isNumeric ( $cpcty.val () ) )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertOnlyNumber,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else if ( $wghtval.val () !== '' && !$.isNumeric ( $wghtval.val () ) )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertOnlyNumber,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else if ( liTpl !== null )
                {
                    var template = _.template ( liTpl );
                    var html = template ( {
                        homUtil : homUtil,
                        recInfoSeq : 0,
                        instlTypeCd : $instlType.val (),
                        cpcty : $cpcty.val (),
                        wghtval : $wghtval.val ()
                    } );

                    $recList.append ( html );

                    deleteRecInfo ();
                }
            }
        }
    } );
}

// rec 정보 삭제
function deleteRecInfo ()
{
    var $btnRecDelete = $ ( '.btn_rec_delete' );

    $btnRecDelete.unbind ( 'click' );
    $btnRecDelete.click ( function ()
    {
        var that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                var $recList = that.closest ( 'ul' );
                that.closest ( 'li' ).remove ();

                var $recListLi = $ ( 'li', $recList );

                if ( $recListLi.size () === 0 )
                {
                    $recList.closest ( 'tr' ).remove ();
                }
            }
        } );
    } );
};

// 지분관계 종류 선택
function initGetQotaInfo ()
{
    var $qotaRadio = $ ( '.qota_radio' );
    getEntrpsInfo ();
    $qotaRadio.change ( function ( event )
    {
        getEntrpsInfo ( this );
    } );
}

// 협력 업체 정보 가져오기
function getEntrpsInfo ( qotaRadio )
{

    var $qotaRadio = $ ( '.qota_radio:checked' );
    var $entrpsId = $ ( '#entrps_id' );
    var tpl = getTemplate ( templates.corprInfoSelect );

    var params = {
        sectnCd : $qotaRadio.val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/elcpwstn/selectCorprInfoList.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_selection,
                        corprInfoList : json.data
                    } );

                    $entrpsId.empty ().html ( html ).trigger ( 'change' );
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

// 지분 관계 추가
function addQotaInfo ()
{
    var $btnQotaAdd = $ ( '#btn_qota_add' );
    var $entrpsId = $ ( '#entrps_id' ); // 업체 아이디
    var $role = $ ( '#qota_role' );
    var $qotaRt = $ ( '#qota_rt' ); // 지분율
    var $qotaAm = $ ( '#qota_am' ); // 지분액

    var $qotaRelateList = $ ( '#qota_relate_list' ); // 지분관계사 리스트

    var qotaTblFrmTpl = getTemplate ( templates.qotaInfoTr );
    var liTpl = getTemplate ( templates.elcPwStnInfoMgtQotaInfoLi );

    $btnQotaAdd.click ( function ()
    {
        var $selectedEnterpsId = $ ( ':selected', $entrpsId );
        var checkFlag = false;
        var addFlag = false;

        // 지분 관계사 선택을 한 경우
        if ( $selectedEnterpsId.val () !== '' )
        {
            var $qotaTblFrm = $ ( '#qota_tbl_frm' );

            // 지분관계 항목 보여지는 markup이 없을 경우 생성
            if ( $qotaTblFrm.find ( 'tr' ).size () === 0 )
            {
                if ( qotaTblFrmTpl !== null )
                {
                    var template = _.template ( qotaTblFrmTpl );
                    var html = template ( {
                        message : i18nMessage.msg_qotaEntrpsSelect
                    } );

                    $qotaTblFrm.append ( html );
                    checkFlag = true;

                    // qotaCustomizeScroll ();
                }
            }

            // qota_relate_list에 li 추가
            $qotaRelateList = $ ( '#qota_relate_list' );
            $qotaRelateListLi = $ ( 'li', $qotaRelateList );
            if ( $qotaRelateListLi.size () !== 0 )
            {

            }

            // 이미 등록되어 있는 경우 판별
            _.each ( $qotaRelateListLi, function ( li )
            {
                if ( $ ( li ).data ( 'entrps-id' ) === $selectedEnterpsId.val () )
                {
                    addFlag = true;
                    return true;
                }
            } );

            // 이미 등록되어 있는 경우 처리
            if ( addFlag )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertQotaEntrpsExist,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                // 숫자만 넣었는지 판별
                if ( ($qotaRt.val () !== '' && !$.isNumeric ( $qotaRt.val () ))
                        || ($qotaAm.val () !== '' && !$.isNumeric ( $qotaAm.val () )) )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_validTwoItemNumberQotaRateAmount,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );

                    if ( $qotaRelateListLi.size () === 0 )
                    {
                        $ ( '#qota_tbl_frm tr' ).remove ();
                    }
                } else if ( liTpl !== null )
                {
                    var template = _.template ( liTpl );
                    var html = template ( {
                        homUtil : homUtil,
                        entrpsTy : $ ( '.qota_radio:checked' ).val (),
                        entrpsId : $selectedEnterpsId.val (),
                        corprKorNm : $selectedEnterpsId.text (),
                        role : $role.val (),
                        qotaRt : $qotaRt.val () === '' ? 0 : $qotaRt.val (),
                        qotaAm : $qotaAm.val () === '' ? 0 : $qotaAm.val ()
                    } );

                    $qotaRelateList.append ( html );

                    deleteQotaInfo ();
                }
            }
        }
        // 지분 관계사 선택을 안한 경우
        else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertQotaEntrpsSelect,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// 지분관계 삭제
function deleteQotaInfo ()
{
    var $btnQotaDelete = $ ( '.btn_qota_delete' );

    $btnQotaDelete.unbind ( 'click' );
    $btnQotaDelete.click ( function ()
    {
        var that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                that.closest ( 'li' ).remove ();

                var $qotaRelateList = $ ( '#qota_relate_list' );
                var $qotaRelateListLi = $ ( 'li', $qotaRelateList );

                if ( $qotaRelateListLi.size () === 0 )
                {
                    $ ( '#qota_tbl_frm tr' ).remove ();
                }
            }
        } );
    } );
}

// 협력 업체 정보 가져오기
function getCorprInfo ()
{
    var $sectnCd = $ ( '#sectnCd' );
    var $corprId = $ ( '#corpr_id' );
    var tpl = getTemplate ( templates.corprInfoSelect );

    $sectnCd.change ( function ( event )
    {
        var params = {
            sectnCd : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/elcpwstn/selectCorprInfoList.ajax',
            type : 'POST',
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            message : i18nMessage.msg_selection,
                            corprInfoList : json.data
                        } );

                        $corprId.empty ().html ( html ).trigger ( 'change' );
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
    } );
}

// 담당자 정보 가져오기
function getCorprChargerInfo ()
{
    var $corprId = $ ( '#corpr_id' );
    var $corprCharger = $ ( '#corpr_charger' );
    var tpl = getTemplate ( templates.corprChargerSelect );

    $corprId.change ( function ( event )
    {
        var params = {
            corprId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/elcpwstn/selectCorprChargerList.ajax',
            type : 'POST',
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            message : i18nMessage.msg_selection,
                            createMessage : i18nMessage.msg_newCreate,
                            corprChargerList : json.data
                        } );

                        $corprCharger.empty ().html ( html ).trigger ( 'change' );

                        checkCreateCorprCharger ();
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
    } );
}

// 담당자 선택 체크
function checkCreateCorprCharger ()
{
    var $corprCharger = $ ( '#corpr_charger' );
    var $chargerNm = $ ( '#charger_nm' );
    var $chargerEmail = $ ( '#charger_email' );
    var $chargerCp = $ ( '#charger_cp' );
    var $chargerCntintCd = $ ( '#charger_cntint_cd' );
    var $chargerNationId = $ ( '#charger_nation_id' );

    $corprCharger.on ( 'change', function ()
    {
        var $select = $ ( ':selected', $ ( this ) );
        if ( $select.val () !== '' )
        {
            // 신규생성 선택시
            if ( $select.val () === 'create' )
            {
                $chargerNm.prop ( 'disabled', false ).val ( '' );
                $chargerEmail.prop ( 'disabled', false ).val ( '' );
                $chargerCp.prop ( 'disabled', false ).val ( '' );
                $chargerCntintCd.prop ( 'disabled', false ).val ( '' ).trigger ( 'change' );
                $chargerNationId.prop ( 'disabled', false ).val ( '' ).trigger ( 'change' );
                // $chargerNm.removeAttr ( 'disabled' ).val ( '' );
                // $chargerEmail.removeAttr ( 'disabled' ).val ( '' );
                // $chargerCp.removeAttr ( 'disabled' ).val ( '' );
                // $chargerCntintCd.removeAttr ( 'disabled' ).val ( '' ).trigger ( 'change' );
                // $chargerNationId.removeAttr ( 'disabled' ).val ( '' ).trigger ( 'change' );
            }
            // 그 외 선택시
            else
            {
                var name = $select.data ( 'charger-nm' );
                var email = $select.data ( 'charger-email' );
                var cp = $select.data ( 'charger-cp' );
                var cntintCd = $select.data ( 'charger-cntint-cd' );

                $chargerNm.prop ( 'disabled', true ).val ( name );
                $chargerEmail.prop ( 'disabled', true ).val ( email );
                $chargerCp.prop ( 'disabled', true ).val ( cp );
                $chargerCntintCd.prop ( 'disabled', true ).val ( cntintCd ).trigger ( 'change' );
                // $chargerNm.attr ( 'disabled', 'disabled' ).val ( name );
                // $chargerEmail.attr ( 'disabled', 'disabled' ).val ( email );
                // $chargerCp.attr ( 'disabled', 'disabled' ).val ( cp );
                // $chargerCntintCd.attr ( 'disabled', 'disabled' ).val ( cntintCd ).trigger ( 'change' );
            }
        }
    } );
}

// 업체 정보 추가
function addCorprInfo ()
{
    var $btnCorprAdd = $ ( '#btn_corpr_add' );
    var $sectnCd = $ ( '#sectnCd' );
    var $corprId = $ ( '#corpr_id' );
    var $corprCharger = $ ( '#corpr_charger' );
    var $chargerNm = $ ( '#charger_nm' );
    var $chargerEmail = $ ( '#charger_email' );
    var $chargerCp = $ ( '#charger_cp' );
    var $chargerNationId = $ ( '#charger_nation_id' );

    var $corprList = $ ( '#corpr_list' );

    var corprTblFrmTpl = getTemplate ( templates.corprInfoTr );
    var liTpl = getTemplate ( templates.corprInfoLi );

    $btnCorprAdd.click ( function ()
    {
        var $selectedSectnCd = $ ( ':selected', $sectnCd );
        var $selectedCorprId = $ ( ':selected', $corprId );
        var $selectedCorprCharger = $ ( ':selected', $corprCharger );
        var $selectedChargerNationId = $ ( ':selected', $chargerNationId );

        var checkFlag = false;
        var addFlag = false;

        if ( $selectedChargerNationId.val () === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validDataRequiredNation,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
        // 업체구분/업체명을 선택 한 경우
        else if ( $selectedSectnCd.val () !== '' && $selectedCorprId.val () !== '' )
        {
            var $corprTblFrm = $ ( '#corpr_tbl_frm' );
            var $corprTblFrmTr = $ ( 'tr', $corprTblFrm );

            // 업체 구분코드와 업체 아이디로 해당 tr이 있는지 확인한다.
            _.each ( $corprTblFrmTr, function ( tr )
            {
                if ( $ ( tr ).data ( 'corpr-id' ) === $selectedCorprId.val ()
                        && $ ( tr ).data ( 'sectn-cd' ) === $selectedSectnCd.val () )
                {
                    checkFlag = true;
                    return true;
                }
            } );

            // 템플릿 추가
            if ( !checkFlag && corprTblFrmTpl !== null )
            {
                var template = _.template ( corprTblFrmTpl );
                var html = template ( {
                    sectnCd : $selectedSectnCd.val (),
                    sectnNm : $selectedSectnCd.text (),
                    corprId : $selectedCorprId.val (),
                    corprNm : $selectedCorprId.text ()
                } );

                $corprTblFrm.append ( html );
            }

            // corpr_list에 li 추가
            $corprList = $ ( '#' + $selectedSectnCd.val () + '_' + $selectedCorprId.val () + ' ul' );
            $corprListLi = $ ( 'li', $corprList );
            if ( $corprListLi.size () !== 0 )
            {

            }

            // 신규등록이 아닌경우
            if ( $selectedCorprCharger.val () !== 'create' )
            {
                // 이미 등록되어 있는 경우 판별
                _.each ( $corprListLi, function ( li )
                {
                    if ( $ ( li ).data ( 'charger-id' ) === $selectedCorprCharger.val () )
                    {
                        addFlag = true;
                        return true;
                    }
                } );
            }

            // 이미 등록되어 있는 경우 처리
            if ( addFlag )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_chargerExists,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                var templateFlag = true;

                var chargerId = $selectedCorprCharger.val ();
                // 담당자 신규생성인 경우
                if ( chargerId === 'create' )
                {
                    // 신규담당자 길이 체크, email 체크, cp 체크
                    if ( $chargerNm.val () === '' )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_noSelectedNewCharger,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                        templateFlag = false;
                    }
                    chargerId = null;
                }

                if ( templateFlag && liTpl !== null )
                {
                    var template = _.template ( liTpl );
                    var html = template ( {
                        homUtil : homUtil,
                        chargerId : chargerId,
                        corprId : $selectedCorprId.val (),
                        sectnCd : $selectedSectnCd.val (),
                        chargerNm : $chargerNm.val (),
                        chargerEmail : $chargerEmail.val (),
                        chargerCp : $chargerCp.val (),
                        chargerNationId : $selectedChargerNationId.val (),
                        chargerNationNm : $selectedChargerNationId.text ()
                    } );

                    $corprList.append ( html );

                    deleteCorprInfo ();
                }
            }
        }
        // 업체구분/업체명을 선택 안한 경우
        else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_noSelectedCoporateSectionName,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// 업체 정보 삭제
function deleteCorprInfo ()
{
    var $btnCorprDelete = $ ( '.btn_corpr_delete' );

    $btnCorprDelete.unbind ( 'click' );
    $btnCorprDelete.click ( function ()
    {
        var that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                var $corprList = that.closest ( 'ul' );
                that.closest ( 'li' ).remove ();

                var $corprListLi = $ ( 'li', $corprList );

                if ( $corprListLi.size () === 0 )
                {
                    $corprList.closest ( 'tr' ).remove ();
                }
            }
        } );
    } );
}

// 발전소 정보 유효성 체크
function pvStdrInfoValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#pvStdrInfoMgtForm' ).validate (
            {
                errorPlacement : function ( error, element )
                {
                    var id = element.attr ( 'id' );
                    if ( id == 'pvId' || id === 'serviceSttus' || id === 'spcId' || id === 'timeZnCd' || id === 'cod'
                            || id === 'inspctPsexamDay' || id === 'instlTpgrphCd' || id === 'strctTypeCd'
                            || id === 'drcAngle' || id === 'inclAngle' || id === 'fcltyCpcty' || id === 'bvnt'
                            || id === 'paaUntpc' || id === 'crncyUnit' )
                    {
                        error.addClass ( 'mgl0' );
                    }
                    error.insertAfter ( element );
                },
                rules : {
                    serviceSttus : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    pvId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 5,
                        minlength : 5
                    },
                    pvKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    pvEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    cntintCd : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    nationId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    areaId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    detlAddr : {
                        maxlength : 100
                    },
                    la : {
                        maxlength : 30,
                        number : true
                    },
                    lo : {
                        maxlength : 30,
                        number : true
                    },
                    co2CnvrCffcnt : {
                        number : true
                    },
                    cod : {
                        date : true
                    },
                    inspctPsexamDay : {
                        date : true
                    },
                    fcltyCpcty : {
                        number : true
                    },
                    drcAngle : {
                        maxlength : 10
                    },
                    inclAngle : {
                        number : true,
                        maxlength : 10
                    },
                    paaUntpc : {
                        maxlength : 10,
                        number : true
                    },
                    bvnt : {
                        date : true
                    },
                    geneqtyExecRate : {
                    	number : true
                    },
                    edeExecRate : {
                    	number : true
                    },
                    bizTy : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                },
                messages : {
                    serviceSttus : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredPvServiceStatus )
                    },
                    pvId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredPvId ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxWdLengthPvId ),
                        minlength : makeValidateMessage ( i18nMessage.msg_validMaxWdLengthPvId )
                    },
                    pvKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredPvKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizePvKoreanName )
                    },
                    pvEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredPvEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizePvEnglishName )
                    },
                    cntintCd : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredContinent )
                    },
                    nationId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredNation )
                    },
                    areaId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredArea )
                    },
                    detlAddr : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeAddress )
                    },
                    la : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeLatitude ),
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    lo : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeLongitude ),
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    co2CnvrCffcnt : {
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    cod : {
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidCommercialOperationDrive )
                    },
                    inspctPsexamDay : {
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidInspectPassExamDay )
                    },
                    fcltyCpcty : {
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    drcAngle : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDirectionAngle )
                    },
                    inclAngle : {
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeInclinedAngle )
                    },
                    paaUntpc : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizePaaUnitPrice ),
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    bvnt : {
                        date : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    geneqtyExecRate : {
                    	number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    edeExecRate : {
                    	number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    bizTy : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredbsnRng )
                    },
                },
                submitHandler : function ( form )
                {
                    // 중복 체크 여부
                    if ( method === staticVariable.methodInsert && $ ( '#duplication_flag' ).val () !== 'Y' )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertIdDuplicate,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );

                        return;
                    }

                    // paa 단가를 입력하였다면 통화단위선택은 필수이다.
                    var $paaUntpc = $ ( '#paaUntpc' );
                    var $crncyUnit = $ ( '#crncyUnit' );

                    if ( $paaUntpc.val () !== '' && $crncyUnit.val () === '' )
                    {
                        if ( tpl !== null )
                        {
                            var template = _.template ( tpl );
                            var html = template ( {
                                id : 'crncyUnit_error_label',
                                message : i18nMessage.msg_validDataRequiredCurrencyUnit,
                                isLeft : true
                            } );

                            $paaUntpc.closest ( 'td' ).find ( 'label' ).remove ();
                            $paaUntpc.closest ( 'td' ).append ( html );
                        }

                        return;
                    } else if ( $paaUntpc.val () === '' && $crncyUnit.val () !== '' )
                    {
                        if ( tpl !== null )
                        {
                            var template = _.template ( tpl );
                            var html = template ( {
                                id : 'paaUntpc_error_label',
                                message : i18nMessage.msg_validDataRequiredPaaUnitPrice,
                                isLeft : true
                            } );

                            $paaUntpc.closest ( 'td' ).find ( 'label' ).remove ();
                            $paaUntpc.closest ( 'td' ).append ( html );
                        }

                        return;
                    } else
                    {
                        $paaUntpc.closest ( 'td' ).find ( 'label' ).remove ();
                    }

                    // 문서 파일 타입, file 선택여부
                    var $addFileList = $ ( '.add_file_list' );
                    var $addFileListLi = $ ( 'li', $addFileList );
                    var fileFlag = false;
                    _.each ( $addFileListLi, function ( li )
                    {
                        var $li = $ ( li );
                        var $selTypeFile = $li.find ( '.sel_type_file' );
                        var $customizeFile = $li.find ( '.customizeFile' );

                        if ( $selTypeFile.val () === '' && $customizeFile.val () !== '' )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validDataRequiredAttachedFileKind,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            fileFlag = true;
                            return true;
                        } else if ( $selTypeFile.val () !== '' && $customizeFile.val () === '' )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validDataRequiredAttachedFile,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            fileFlag = true;
                            return true;
                        }
                    } );

                    if ( fileFlag )
                    {
                        return;
                    }

                    $.when (
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : method === staticVariable.methodInsert ? i18nMessage.msg_alertCreateConfirm
                                        : i18nMessage.msg_alertUpdateConfirm,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeConfirm
                            } ) ).then ( function ( confirm )
                    {
                        if ( confirm )
                        {
                            form.submit ();
                        }
                    } );
                }

            } );
}

// 첨부파일 처리 하기
function checkFileSize ()
{
    var maxFileSize = 10 * 1024 * 1024;
    var flag = true;

    $ ( '.customizeFile' ).on ( 'change propertychange', function ()
    {
        var that = this;
        if ( maxFileSize < that.files[0].size )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validFileInputSizeDown,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        // 포함되는 확장자가 없는 경우
        if ( !homUtil.checkFileExtension ( that.files[0].name, homUtil.fileExtensionFormat.general ) )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : homUtil.fileExtensionFormat.general + i18nMessage.msg_validFileInputExtension,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        // if ( !flag )
        // {
        // var $fileText = $ ( that ).parent ().siblings ( '.file_text' ).children ();
        // $fileText.attr ( 'title', '' );
        // $fileText.text ( '' );
        // // TODO input reset 하기..
        // $ ( that ).val ( '' );
        // }

        return flag;
    } );
}

// 첨부파일 input 추가
function addFileInput ()
{
    var fileCount = 10;
    var liTpl = getTemplate ( templates.inputFileLi );
    var $addFile = $ ( '#add_file' );
    var disableFlag = false;
    var $selTypeFile = $ ( '.sel_type_file' );

    if ( !disableFlag )
    {
        $addFile.click ( function ()
        {
            var liCount = $ ( '.add_file_list li' ).size ();
            var $addFileList = $ ( '.add_file_list' );
            var $fileList = $ ( '.file_list li' );

            if ( liCount < fileCount - $fileList.size () )
            {
                liCount++;
                if ( liCount == fileCount - $fileList.size () )
                {
                    disableFlag = true;
                    $addFile.addClass ( 'dis' );
                }

                var template = _.template ( liTpl );
                var html = template ( {
                    fileNo : liCount,
                    selTypeHtml : $selTypeFile.html ()
                } );

                $addFileList.append ( html );

                fileCustomizeForm ();

                deleteFileInput ();
                checkFileSize ();
            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validFileInputNumberDown,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }

        } );
    }
}

// 첨부파일 input 삭제
function deleteFileInput ()
{
    var $deleteFile = $ ( '.delete_file' );
    $deleteFile.unbind ( 'click' );
    $deleteFile.click ( function ()
    {
        var that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                that.closest ( 'li' ).remove ();

                var $addFile = $ ( '#add_file' );
                $addFile.removeClass ( 'dis' );
            }
        } );
    } );

}

// 메인 이미지 삭제 부분 하기
function deleteMainImage ()
{
    var tpl = getTemplate ( templates.labelError );
    var $btnMainImageDelete = $ ( '.btn_main_image_delete' );
    var $addImg = $ ( '.add_img' );

    $btnMainImageDelete.on ( 'click', function ()
    {
        var $that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                $.ajax ( {
                    url : $that.attr ( 'href' ),
                    type : 'GET',
                    dataType : 'json',
                    success : function ( json )
                    {
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {
                            $addImg.empty ();
                        } else if ( json.status === staticVariable.jsonStatusError )
                        {
                            $addImg.parent ().find ( 'label' ).remove ();

                            if ( tpl !== null )
                            {
                                var template = _.template ( tpl );
                                var html = template ( {
                                    id : 'file_delete',
                                    message : json.message,
                                    isLeft : false
                                } );
                                $addImg.parent ().append ( html );
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
        } );

        return false;
    } );
}

// 파일 제거
function deleteFile ()
{
    var tpl = getTemplate ( templates.labelError );
    var $btnFileDelete = $ ( '.btn_file_delete' );

    // $btnFileDelete.unbind ( 'click' );
    $btnFileDelete.click ( function ()
    {
        var $that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                var $li = $that.closest ( 'li' );
                $.ajax ( {
                    url : $that.attr ( 'href' ),
                    type : 'GET',
                    dataType : 'json',
                    success : function ( json )
                    {
                        var $li = $that.closest ( 'li' );
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {
                            $li.remove ();
                            $li.find ( 'label' ).remove ();
                        } else if ( json.status === staticVariable.jsonStatusError )
                        {
                            $li.find ( 'label' ).remove ();

                            if ( tpl !== null )
                            {
                                var template = _.template ( tpl );
                                var html = template ( {
                                    id : 'file_delete',
                                    message : json.message,
                                    isLeft : false
                                } );
                                $li.append ( html );
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
        } );

        return false;
    } );
}

// 발전량 목표 대비 실적 상 비율 범위 설정 추가
function setPvAcmsltRateInfo ()
{
    var tpl = getTemplate ( templates.colorpkLi );
    var tplTr = getTemplate ( templates.colorpkTr );

    var $minRate = $ ( '.min_rate' );
    var $maxRate = $ ( '.max_rate' );
    var $cpBoth = $ ( '#cpBoth' );
    var $colorpk = $ ( '.colorpk' );
    var $colorpkTbl = $ ( '.colorpk_tbl' );

    var $addAcmsltRateBtn = $ ( '#add_acmslt_rate_btn' );
    $addAcmsltRateBtn.on ( 'click', function ()
    {
        // 최소 비율이 입력 안됬을 경우
        if ( $minRate.val () === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validRequiredRate,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            if ( !$.isNumeric ( $minRate.val () ) || ($maxRate.val () !== '' && !$.isNumeric ( $maxRate.val () )) )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validNumberRate,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else if ( parseInt ( $minRate.val (), 10 ) < 0
                    || ($maxRate.val () !== '' && parseInt ( $maxRate.val (), 10 ) < 0) )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertAcmsltRateUpperThanZero,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else if ( $maxRate.val () !== '' && parseInt ( $minRate.val (), 10 ) > parseInt ( $maxRate.val (), 10 ) )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertAcmsltRateMinUpperThanMax,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else if ( $cpBoth.val () === '' )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validRequiredCustomColor,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                var colorpkLi = $ ( 'li', $colorpkTbl );
                if ( colorpkLi.size () === 0 )
                {
                    if ( tplTr !== null )
                    {
                        var template = _.template ( tplTr );
                        var html = template ( {
                            rateRange : i18nMessage.msg_rateRange
                        } );

                        $colorpkTbl.append ( html );
                        $colorpk = $ ( '.colorpk' );
                    }
                } else
                {
                    var flag = false;
                    var emptyFlag = false;
                    var hexCdFlag = false;
                    _.each ( colorpkLi, function ( li )
                    {
                        var minRateVal = parseFloat ( $ ( li ).find ( '.minRates' ).val () );
                        var maxRateVal = $ ( li ).find ( '.maxRates' ).val ();
                        if ( maxRateVal === '' )
                        {
                            maxRateVal = parseFloat ( maxRateVal );
                        }

                        var hexCdVal = $ ( li ).find ( '.hexCds' ).val ();

                        var inputMinRateVal = null;
                        var inputMaxRateVal = null;
                        if ( $minRate.val () !== '' )
                        {
                            inputMinRateVal = parseFloat ( $minRate.val () );
                        }
                        if ( $maxRate.val () !== '' )
                        {
                            inputMaxRateVal = parseFloat ( $maxRate.val () );
                        }

                        if ( maxRateVal === '' && $maxRate.val () === '' )
                        {
                            emptyFlag = true;
                            return false;
                        } else
                        {
                            if ( $cpBoth.val () === hexCdVal )
                            {
                                hexCdFlag = true;
                                return false;
                            } else if ( maxRateVal === '' && inputMaxRateVal === '' )
                            {
                                flag = true;
                                return false;
                            } else if ( maxRateVal === '' && minRateVal < inputMaxRateVal )
                            {
                                flag = true;
                                return false;
                            } else if ( $maxRate.val () === '' && inputMinRateVal < maxRateVal )
                            {
                                flag = true;
                                return false;
                            } else if ( (minRateVal > inputMinRateVal && minRateVal < inputMaxRateVal)
                                    || (maxRateVal > inputMinRateVal && maxRateVal < inputMaxRateVal) )
                            {
                                flag = true;
                                return false;
                            } else if ( minRateVal === inputMinRateVal || maxRateVal === inputMaxRateVal )
                            {
                                flag = true;
                                return false;
                            }
                        }
                    } );
                }

                if ( emptyFlag )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertDuplicateItemRate,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else if ( flag )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertDuplicateItemRate,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else if ( hexCdFlag )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertDuplicateItemCustomColor,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else if ( tpl !== null )
                {
                    var maxRateValue = '';
                    if ( $maxRate.val () !== '' )
                    {
                        maxRateValue = parseInt ( $maxRate.val (), 10 );
                    }

                    // TODO 순서대로 삽입되게 바꾸기
                    var beforeFlag = false;
                    var $li = null;
                    _.each ( colorpkLi, function ( li )
                    {
                        $li = $ ( li );
                        var minRateVal = parseFloat ( $li.find ( '.minRates' ).val () );
                        var maxRateVal = $li.find ( '.maxRates' ).val ();
                        if ( maxRateVal === '' )
                        {
                            maxRateVal = parseFloat ( maxRateVal );
                        }

                        if ( maxRateValue !== '' && minRateVal >= maxRateValue )
                        {
                            beforeFlag = true;
                            return false;
                        }
                    } );

                    var template = _.template ( tpl );
                    var html = template ( {
                        moreThan : i18nMessage.msg_moreThan,
                        under : i18nMessage.msg_under,
                        minRate : parseInt ( $minRate.val (), 10 ),
                        maxRate : maxRateValue,
                        hexCd : $cpBoth.val ()
                    } );

                    if ( $li !== null && beforeFlag )
                    {
                        $li.before ( html );
                    } else
                    {
                        $colorpk.append ( html );
                    }

                    deletePvAcmsltRateInfo ();

                }
            }
        }

    } );
}

// 발전량 목표 대비 실적 상 비율 범위 설정 제거
function deletePvAcmsltRateInfo ()
{
    var $delAcmsltRateBtn = $ ( '.del_acmslt_rate_btn' );
    $delAcmsltRateBtn.on ( 'click', function ()
    {
        var that = $ ( this );
        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                var $colorpkList = that.closest ( 'ul' );
                that.closest ( 'li' ).remove ();

                var $colorpkListLi = $ ( 'li', $colorpkList );

                if ( $colorpkListLi.size () === 0 )
                {
                    $colorpkList.closest ( 'tr' ).remove ();
                }
            }
        } );
    } );
}

function colorPicker ()
{
    $ ( '#cpBoth' ).colorpicker ();
}

// 시스템 태그 정보 초기화(등록 화면)
function elcPwStnInitialization ()
{
    if ( method === staticVariable.methodInsert )
    {
        $ ( '#btn_reset' ).click (
                function ()
                {
                    $ ( 'form' ).each ( function ()
                    {
                        this.reset ();
                        $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
                    } );

                    $ ( '.customize_radio, .sel_type' ).trigger ( 'change' );
                    $ ( '.select1, #nationId, #timeZnCd, #crncyUnit, #charger_nation_id, #areaId' ).trigger (
                            'change.select2' );

                    $ ( 'label.error' ).remove ();
                    $ ( '#duplication_flag' ).val ( homConstants.checkN );
                } );
    }
}

// 발전소 아이디 중복 체크
function checkDuplicationId ()
{
    var tpl = getTemplate ( contextPath + '/template/common/labelError.html' );

    $ ( '#pvId' ).blur ( function ()
    {
        var that = $ ( this );
        var $idCheck = $ ( '.id_check' );
        var $duplicationFlag = $ ( '#duplication_flag' );

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/elcpwstn/selectDuplicationId.ajax',
            type : 'POST',
            data : {
                pvId : that.val ()
            },
            dataType : 'json',
            success : function ( json )
            {
                var $td = $ ( '#pvId' ).closest ( 'td' );

                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    $td.find ( 'label' ).remove ();
                    $idCheck.removeClass ( 'dnone' );
                    $duplicationFlag.val ( homConstants.checkY );

                } else if ( json.status === staticVariable.jsonStatusError )
                {
                    $td.find ( 'label' ).remove ();
                    $idCheck.addClass ( 'dnone' );
                    $duplicationFlag.val ( homConstants.checkN );

                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            id : 'pvId',
                            message : json.message,
                            isLeft : false
                        } );

                        $td.append ( html );
                    }
                }
            },
            error : function ( xhr, textStatus, error )
            {
                if ( xhr.status === staticVariable.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : 'info'
                    } );
                }
            }
        } );
    } );
}

$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    customizeForm ();
    fileCustomizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    showPopup ();
    getNationInfo ();
    getAreaInfo ( isKorean );
    addRecInfo ();
    deleteRecInfo ();
    initGetQotaInfo ();
    addQotaInfo ();
    deleteQotaInfo ();
    getCorprInfo ();
    getCorprChargerInfo ();
    checkCreateCorprCharger ();
    addCorprInfo ();
    deleteCorprInfo ();
    pvStdrInfoValidate ();
    checkFileSize ();
    addFileInput ();
    deleteFileInput ();
    deleteFile ();
    deleteMainImage ();
    setPvAcmsltRateInfo ();
    deletePvAcmsltRateInfo ();
    colorPicker ();
    getCorprNationInfo ();
    elcPwStnInitialization ();
    checkDuplicationId ();
} );