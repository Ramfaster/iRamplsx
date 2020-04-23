// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
}

function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );

    // 메일 템플릿
    var $btn_popup = $ ( '.btn_mailtemplatepopup' );
    $btn_popup.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                $ ( '#btn_closePopup' ).click ( function ()
                {
                    $btn_popup.magnificPopup ( 'close' );
                } );
            }
        }
    } );

    // 시스템 관리자
    var $btnPopup3 = $ ( '.btn_syspop' );
    $btnPopup3.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false, // 내용 클릭시 닫지 않음
        closeOnBgClick : false, // 백그라운드 클릭시 닫지 않음
        callbacks : {
            ajaxContentAdded : function ()
            {
                // Ajax content is loaded and appended to DOM
                $ ( '#btn_closePopup' ).click ( function ()
                {
                    $btnPopup3.magnificPopup ( 'close' );
                } );
            }
        }
    } );

}

// 스케줄러 관리 유효성 체크
function schedulerValidate ()
{
    $ ( '#schdulerForm' ).validate (
            {
                rules : {
                    usgAt : {
                        required : true
                    },
                    schdulKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    schdulEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    cronExpr : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 20
                    },
                    classNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 100
                    },
                    mailUsgAt : {
                        required : true
                    },
                    mailTmplatSeq : {
                        required : {
                            depends : function ()
                            {
                                if ( $ ( "[name=mailUsgAt]:checked" ).val () == homConstants.checkY )
                                {
                                    return true;
                                } else
                                {
                                    return false;
                                }

                            }
                        }
                    },
                    mailInboundSystemUserArray : {
                        required : {
                            depends : function ()
                            {
                                if ( $ ( "[name=mailUsgAt]:checked" ).val () == homConstants.checkY )
                                {
                                    return true;
                                } else
                                {
                                    return false;
                                }

                            }
                        }
                    },
                    schdulDesc : {
                        maxlength : 300
                    }
                },
                messages : {
                    usgAt : {
                        required : makeValidateMessage ( i18nMessage.msg_validDataRequiredUsgAt )
                    },
                    schdulEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredSchdulEngNm ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSchdulEngNm )
                    },
                    schdulKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredSchdulKorNm ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSchdulKorNm )
                    },
                    cronExpr : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCronExpr ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCronExpr )
                    },
                    classNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredClassNm ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeClassNm )
                    },
                    mailUsgAt : {
                        required : makeValidateMessage ( i18nMessage.msg_validDataRequiredMailUsgAt )
                    },
                    mailTmplatSeq : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredMailTmplatSeq )
                    },
                    mailInboundSystemUserArray : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredMailInboundSystemUserArray )
                    },
                    schdulDesc : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSchdulDesc )
                    }
                },
                submitHandler : function ( form )
                {
                    var resultState = true;
                    if ( $ ( "[name=mailUsgAt]:checked" ).val () == homConstants.checkY )
                    {
                        var labelErrorTpl = getTemplate ( templates.labelError );
                        if ( $ ( "#mailTmplatSeq" ).val () == null || $ ( "#mailTmplatSeq" ).val () == ""
                                || $ ( "#mailTmplatSeq" ).val () == 0 )
                        {
                            if ( labelErrorTpl !== null )
                            {
                                var template = _.template ( labelErrorTpl );
                                var html = template ( {
                                    id : 'mailTmplatSeq',
                                    message : i18nMessage.msg_validRequiredMailTmplatSeq,
                                    isLeft : true
                                } );

                                $ ( '#mailTmplatSeqTd' ).append ( html );
                            }
                            resultState = false;
                        }
                        if ( $ ( "#mailInboundSystemUserArray" ).val () == null
                                || $ ( "#mailInboundSystemUserArray" ).val () == "" )
                        {
                            if ( labelErrorTpl !== null )
                            {
                                var template = _.template ( labelErrorTpl );
                                var html = template ( {
                                    id : 'mailInboundSystemUserArray',
                                    message : i18nMessage.msg_validRequiredMailInboundSystemUserArray,
                                    isLeft : true
                                } );

                                $ ( '.td_form' ).append ( html );
                                resultState = false;
                            }
                        }
                    }
                    if ( !resultState )
                    {
                        return resultState
                    }
                    // 실행 주기의 유효성 체크는 java에서 체크한다.
                    form.submit ();
                }

            } );
}

// event listener 설정
function setEventListener ()
{
    var $btn_reset = $ ( '#btn_reset' );

    $btn_reset.click ( function ()
    {
        $ ( 'form' ).each ( function ()
        {
            this.reset ();
            $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
        } );

        $ ( "#mailTmplatSeq" ).val ( "" );
        $ ( "#mailInboundSystemUserArray" ).val ( "" );

        $ ( '#usgAt1' ).prop ( 'checked', true ).trigger ( 'change' );
        $ ( '#mailUsgAt1' ).prop ( 'checked', true ).trigger ( 'change' );

        $ ( 'label.error' ).remove ();
        $ ( '.frm_type' ).removeClass ( 'error' );

    } );

}
function elementSetReadonly ()
{
    if ( paramSchdulMgtSeq == null || paramSchdulMgtSeq == "" || paramSchdulMgtSeq == 0 )
    {
        $ ( "#cronExpr" ).removeAttr ( "readonly" );
        $ ( "#classNm" ).removeAttr ( "readonly" );
    }
}
$ ( function ()
{
    customizeForm ();
    showPopup ();
    schedulerValidate ();
    elementSetReadonly ();
    setEventListener ();
} );