// radio button customize
function customizeFormRadio ()
{
    $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
}

// form element customize
function customizeForm ()
{
    // 사용자 정보
    var $selType = $ ( '.customize_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $customizeSelect2 = $ ( '.customize_select2' ).select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var initFlag = true;
    $customizeSelect2.on ( 'select2:open', function ( e )
    {
        if ( initFlag )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            initFlag = false;
        }
    } );
}

// scroll customize
function customizeScroll ()
{
    if ( $ ( '.frm_item_list' ).size () !== 0 )
    {
        setCustomizeScroll ();
    }
}

function setCustomizeScroll ()
{
    $ ( '.frm_list_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
    console.log ( 'here' );
}

// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
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
}

// 국가별 발전소 정보 가져오기
function getNationPvInfo ()
{
    var $nation = $ ( '#nation' );
    var $pvId = $ ( '#pvId' );
    var tpl = getTemplate ( templates.pvStdrInfoSelect );

    $nation.change ( function ( event )
    {
        var params = {
            nationId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/user/selectPvStdrInfoList.ajax',
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
                            lang : lang,
                            locale : locale,
                            msg_selection : i18nMessage.msg_selection,
                            pvStdrInfoList : json.data
                        } );

                        $pvId.empty ().html ( html ).trigger ( 'change' );
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

// 발전소 권한 추가
function addPvInfo ()
{
    var $btnPvAdd = $ ( '#btn_pv_add' );
    var $pvChoiceBox = $ ( '.pv_choice_box' );
    var $nation = $ ( '#nation' );
    var $pvId = $ ( '#pvId' );
    var liTpl = getTemplate ( templates.pvInfoLi );
    var wrapTpl = getTemplate ( templates.pvStdrInfoWrap );

    $btnPvAdd.click ( function ()
    {
        var $selectedNation = $ ( ':selected', $nation );
        var $selectedPvId = $ ( ':selected', $pvId );

        if ( $selectedNation.val () !== '' && $selectedPvId.val () !== '' )
        {
            var $frmListWrap = $ ( '.frm_list_wrap' );
            var $frmItemList = null;
            var $frmItemListLi = null;
            var listNumber = 1;
            var addFlag = false;
            var checkFlag = false;

            // 발전소 권한 항목 보여지는 markup이 없을 경우 생성
            if ( $frmListWrap.size () === 0 )
            {
                if ( wrapTpl !== null )
                {
                    var template = _.template ( wrapTpl );
                    var html = template ( {
                        message : i18nMessage.msg_alertNoSelectedStandardElectricPowerStation
                    } );

                    $pvChoiceBox.append ( html );

                    checkFlag = true;
                    setCustomizeScroll ();
                }
            }

            $frmItemList = $ ( '.frm_item_list' );
            $frmItemListLi = $ ( 'li', $frmItemList );

            if ( $frmItemListLi.size () !== 0 )
            {
                listNumber = parseInt ( $frmItemListLi.last ().data ( 'list-number' ), 10 ) + 1;
            }

            _.each ( $frmItemListLi, function ( li )
            {
                if ( $ ( li ).data ( 'nation-id' ) === $selectedNation.val ()
                        && $ ( li ).data ( 'pv-id' ) === $selectedPvId.val () )
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
                    message : i18nMessage.msg_alertAlreadyAddElectricPowerStation,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                if ( liTpl !== null )
                {
                    var template = _.template ( liTpl );
                    var html = template ( {
                        listNumber : listNumber,
                        checkFlag : checkFlag,
                        nationId : $selectedNation.val (),
                        nationIdText : $selectedNation.text (),
                        pvId : $selectedPvId.val (),
                        pvIdText : $selectedPvId.text ()
                    } );

                    $frmItemList.append ( html );

                    customizeFormRadio ();
                }
            }
            $ ( '#pvIds-error, #stdrPvAt-error' ).remove ();
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertNoSelectedElectricPowerStation,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// 발전소 권한 삭제
function deletePvInfo ()
{
    $ ( document ).on ( 'click', '.btn_pv_delete', function ()
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

                var $frmItemList = $ ( '.frm_item_list' );
                var $frmItemListLi = $ ( 'li', $frmItemList );

                if ( $frmItemListLi.size () === 0 )
                {
                    $ ( '.frm_list_wrap' ).remove ();
                } else
                {
                    var checkCount = 0;
                    $ ( '.pv_select' ).each ( function ()
                    {
                        if ( $ ( this ).prop ( 'checked' ) )
                        {
                            checkCount++;
                        }
                    } );

                    // 기준 발전소가 체크된 항목이 없을 경우 맨 처음 항목으로 강제 선택
                    if ( checkCount === 0 )
                    {
                        $ ( '.pv_select' ).eq ( 0 ).prop ( 'checked', true ).trigger ( 'change' );
                    }
                }
            }
        } );
    } );
}

// 아이디 중복 체크
function checkDuplicationId ()
{
    var tpl = getTemplate ( contextPath + '/template/common/labelError.html' );

    $ ( '#acntId' ).blur ( function ()
    {
        var that = $ ( this );
        var $idCheck = $ ( '.id_check' );
        var $duplicationFlag = $ ( '#duplication_flag' );

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/user/selectDuplicationId.ajax',
            type : 'POST',
            data : {
                acntId : that.val ()
            },
            dataType : 'json',
            success : function ( json )
            {
                var $td = $ ( '#acntId' ).closest ( 'td' );

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
                            id : 'acntId',
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

// 사용자 정보 초기화(등록 화면)
function userInitialization ()
{
    if ( !existAcntId )
    {
        $ ( '#btn_reset' ).click ( function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
            } );

            $ ( '#pvId' ).each ( function ()
            {
                if ( $ ( this ).val () !== '' )
                {
                    $ ( this ).remove ();
                }
            } );

            $ ( '.customize_select' ).trigger ( 'change' );
            $ ( '.customize_select2' ).trigger ( 'change.select2' );
            $ ( '#nation' ).trigger ( 'change' );
            $ ( '.id_check' ).addClass ( 'dnone' );
            $ ( '#duplication_flag' ).val ( homConstants.checkN );
            $ ( '#usgAt1' ).prop ( 'checked', true ).trigger ( 'change' );
            $ ( '.frm_list_wrap' ).remove ();
            $ ( 'label.error' ).remove ();
            $ ( '.frm_type' ).removeClass ( 'error' );
        } );
    }
}

// 사용자 정보 유효성 체크
function userValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    var pwdRules = null;
    var pwdCheckRules = null;
    var pwdMessages = null;
    var pwdCheckMessages = null;

    if ( existAcntId )
    {
        pwdRules = {
            passwordValid : true
        };
        pwdCheckRules = {
            equalTo : '#pwd'
        };

        pwdMessages = {
            passwordValid : makeValidateMessage ( i18nMessage.msg_validPasswordPasswd )
        };
        pwdCheckMessages = {
            equalTo : makeValidateMessage ( i18nMessage.msg_validPasswdConfirmDifferent )
        };
    } else
    {
        pwdRules = {
            required : {
                depends : function ()
                {
                    $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                    return true;
                }
            },
            passwordValid : true
        };
        pwdCheckRules = {
            required : {
                depends : function ()
                {
                    $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                    return true;
                }
            },
            equalTo : '#pwd'
        };

        pwdMessages = {
            required : makeValidateMessage ( i18nMessage.msg_validRequiredPasswd ),
            passwordValid : makeValidateMessage ( i18nMessage.msg_validPasswordPasswd )
        };
        pwdCheckMessages = {
            required : makeValidateMessage ( i18nMessage.msg_validRequiredPasswdConfirm ),
            equalTo : makeValidateMessage ( i18nMessage.msg_validPasswdConfirmDifferent )
        };
    }

    $ ( '#userForm' ).validate ( {
        rules : {
            acntId : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 6,
                minlength : 6
            },
            acntKorName : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            acntEngName : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            pwd : pwdRules,
            pwdCheck : pwdCheckRules,
            acntGradCd : {
                selectRequired : true
            },
            nationId : {
                selectRequired : true
            },
            endDt : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                date : true
            },
            cttpc : {
                phoneValid : true
            },
            email : {
                emailValid : true
            },
            authGrpId : {
                selectRequired : true
            }
        },
        messages : {
            acntId : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredAcntId ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxWdLengthAcntId ),
                minlength : makeValidateMessage ( i18nMessage.msg_validMaxWdLengthAcntId )
            },
            acntKorName : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredKoreanName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeKoreanName )
            },
            acntEngName : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredEnglishName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeEnglishName )
            },
            pwd : pwdMessages,
            pwdCheck : pwdCheckMessages,
            acntGradCd : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredUserGrade )
            },
            nationId : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredNation )
            },
            endDt : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredDateExpiration ),
                date : makeValidateMessage ( i18nMessage.msg_validDateInvalidDateExpiration )
            },
            cttpc : {
                phoneValid : makeValidateMessage ( i18nMessage.msg_validPhone )
            },
            email : {
                emailValid : makeValidateMessage ( i18nMessage.msg_validEmail )
            },
            authGrpId : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredAuthorityGroup )
            }
        },
        submitHandler : function ( form )
        {
            // 발전소 - required : true
            if ( $ ( '.pvIds' ).size () === 0 )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        id : 'pvIds',
                        message : i18nMessage.msg_validSelectRequiredElectricPowerStation,
                        isLeft : true
                    } );

                    $ ( '.pv_choice_box' ).closest ( 'td' ).append ( html );
                }

                return;
            }

            // 중복 체크 여부
            if ( !existAcntId && $ ( '#duplication_flag' ).val () !== 'Y' )
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

            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : !existAcntId ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
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

$ ( function ()
{
    customizeFormRadio ();
    customizeForm ();
    customizeScroll ();
    initDatetimepicker ();
    getNationPvInfo ();
    addPvInfo ();
    deletePvInfo ();
    checkDuplicationId ();
    userInitialization ();
    userValidate ();
} );