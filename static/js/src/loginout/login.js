// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_checkbox' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
}

// login slider customize
function loginSlide ()
{
    $ ( '#login_slide' ).bxSlider ( {
        moveSlides : 1,
        speed : 500,
        pause : 6000,
        auto : true,
        autoControls : true,
        autoHover : true,
        controls : false,
        touchEnabled : false,
        autoControlsCombine : true,
        pager : true
    } );
}

// 로그인 유효성 체크
function loginValidate ()
{
    // 참고 : http://noritersand.tistory.com/211
    $ ( '#loginForm' ).validate ( {
        rules : {
            acntId : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                }
            },
            pwd : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                }
            }
        },
        messages : {
            acntId : i18nMessage.msg_validRequiredId,
            pwd : i18nMessage.msg_validRequiredPasswd
        },
        submitHandler : function ( form )
        {
            $.ajax ( {
                url : contextPath + '/selectRSAKey.ajax',
                type : 'POST',
                dataType : 'json',
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        var rsaInfoMap = json.data;
                        if ( rsaInfoMap === null )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_alertServerError,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            return;
                        }

                        var rsa = new RSAKey ();
                        rsa.setPublic ( rsaInfoMap.publicKeyModulus, rsaInfoMap.publicKeyExponent );

                        $ ( '#ei' ).val ( rsa.encrypt ( $ ( '#acntId' ).val () ) );
                        $ ( '#pwd' ).val ( rsa.encrypt ( $ ( '#pwd' ).val () ) );

                        form.submit ();

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
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertServerError,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                    }
                }
            } );
        }
    } );
}

// 세션 만료 체크
function checkSessionExpired ()
{
    if ( session )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertUserSessionExpired,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    } else
    {
        $ ( '#acntId' ).focus ();
    }
}

$ ( function ()
{
    customizeForm ();
    loginSlide ();
    checkSessionExpired ();
    loginValidate ();
} );