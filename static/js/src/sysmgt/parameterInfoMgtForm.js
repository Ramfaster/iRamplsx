// form element customize
function customizeForm ()
{
    $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
}

// 파라미터 아이디 중복 체크
function checkDuplicateParamtrId ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#paramtrId' ).blur ( function ()
    {
        var that = $ ( this );
        var $idCheck = $ ( '.id_check' );
        var $duplicationFlag = $ ( '#duplication_flag' );

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/parameter/selectDuplicateParamtrId.ajax',
            type : 'POST',
            data : {
                paramtrId : that.val ()
            },
            dataType : 'json',
            success : function ( json )
            {
                var $td = that.closest ( 'td' );

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
                            id : 'paramtrId',
                            message : json.message,
                            isLeft : false
                        } );

                        $td.append ( html );
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

// 파라미터 정보 초기화(등록 화면)
function parameterInitialization ()
{
    if ( method === staticVariable.methodInsert )
    {
        $ ( '#btn_reset' ).click ( function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
            } );

            $ ( 'label.error' ).remove ();
            $ ( '.frm_type' ).removeClass ( 'error' );
        } );
    }
}

// 파라미터 정보 유효성 체크
function parameterValidate ()
{
    $ ( '#parameterForm' ).validate (
            {
                rules : {
                    paramtrId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        regex : /^[a-zA-Z0-9_]{1,30}$/
                    },
                    paramtrKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    paramtrEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    paramtrDesc : {
                        maxlength : 300
                    }
                },
                messages : {
                    paramtrId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredParameterId ),
                        regex : makeValidateMessage ( i18nMessage.msg_validParameterId )
                    },
                    paramtrKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredParameterKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeParameterKoreanName )
                    },
                    paramtrEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredParameterEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeParameterEnglishName )
                    },
                    paramtrDesc : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDescription )
                    }
                },
                submitHandler : function ( form )
                {
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

$ ( function ()
{
    customizeForm ();
    checkDuplicateParamtrId ();
    parameterInitialization ();
    parameterValidate ();
} );