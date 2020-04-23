// form element customize
function customizeForm ()
{
    
    var $imageTypeChk = $('.image_type_chk').customizeCheckbox({
        backgroundImage: contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x: contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width: 13,
        height  : 13
    });
}

// 프로그램 정보 초기화(등록 화면)
function programInitialization ()
{
    if ( !existProgrmSeq )
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

// 프로그램 정보 유효성 체크
function programValidate ()
{
    $ ( '#programForm' ).validate ( {
        rules : {
            progrmKorNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            progrmEngNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            progrmUrl : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 100
            },
            progrmDesc : {
                maxlength : 300
            }
        },
        messages : {
            progrmKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredProgramKoreanName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeProgramKoreanName )
            },
            progrmEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredProgramEnglishName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeProgramEnglishName )
            },
            progrmUrl : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredProgramUrl ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeProgramUrl )
            },
            progrmDesc : {
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDescription )
            }
        },
        submitHandler : function ( form )
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : !existProgrmSeq ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {   
            	var bsnsVal = 0;
            	$("input[type=checkbox]:checked").each(function() {

            		bsnsVal += parseInt($(this).val());
        		});            	
            	
            	
            	$("#bsnsRngVal").val(bsnsVal);
            	
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
    programInitialization ();
    programValidate ();
} );