// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
}

// scroll customize
function customizeScroll ()
{
    if ( $ ( '.frm_item_list' ).size () !== 0 )
    {
        $ ( '.frm_list_wrap' ).mCustomScrollbar ( {
            scrollButtons : {
                enable : true
            },
            theme : 'inset-2',
            scrollbarPosition : 'inside',
            scrollInertia : 300
        } );
    }
}

// 수식 체크
function checkForml ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#forml' ).blur ( function ()
    {
        var that = $ ( this );
        var $idCheck = $ ( '.id_check' );

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/scale/selectFormlCheck.ajax',
            type : 'POST',
            data : {
                forml : that.val ()
            },
            dataType : 'json',
            success : function ( json )
            {
                var $td = $ ( '#forml' ).closest ( 'td' );
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    $td.find ( 'label' ).remove ();
                } else if ( json.status === staticVariable.jsonStatusError )
                {
                    $td.find ( 'label' ).remove ();

                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            id : 'forml',
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

// 스케일 정보 초기화(등록 화면)
function scaleInitialization ()
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
        } );
    }
}

// 사용자 정보 유효성 체크
function scaleValidate ()
{
    $ ( '#scaleForm' ).validate (
            {
                rules : {
                    formlNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 10
                    },
                    forml : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    formlDesc : {
                        maxlength : 300
                    }
                },
                messages : {
                    formlNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredFormulaName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeFormlName )
                    },
                    forml : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredFormula ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeForml )
                    },
                    formlDesc : {
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
    customizeScroll ();
    checkForml ();
    scaleInitialization ();
    scaleValidate ();
} );