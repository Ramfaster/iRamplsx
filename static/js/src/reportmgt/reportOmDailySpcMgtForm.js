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

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#date_type' );
    $dateType.change ( function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === 'day' )
        {
            className = 'yyyymmdd';
        } else if ( selectedType === 'month' )
        {
            className = 'yyyymm';
        } else if ( selectedType === 'year' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.tab_cont' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

function initHighcharts ()
{
    $ ( "#tabsRptList01" ).on (
            'click',
            function ()
            {
                if ( paramRunOmRptAjax01 == false )
                {
                    paramRunOmRptAjax01 = true;
                    fnRptOmDailyPlantInit ( $ ( "#lisRptList01" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                            "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ (
                            "#rptCycleCd" ).val (), $ ( "#stdrYm" ).val () );
                }

            } );
}

function fnCallBackHighchart ()
{
    customizeScroll ();
}

// 초기화(등록 화면)
function Initialization ()
{
    var confmerNm = $ ( '#confmerNm' ).val ();
    var wrterNm = $ ( '#wrterNm' ).val ();
    var rptDt = $ ( '#rptDt' ).val ();

    $ ( '#btn_reset' ).click ( function ()
    {
        $ ( '#confmerNm' ).val ( confmerNm );
        $ ( '#wrterNm' ).val ( wrterNm );
        $ ( '#rptDt' ).val ( rptDt );

        $ ( '.frm_type' ).removeClass ( 'error' );
        $ ( "[id$=error]" ).remove ();

    } );
}

function btnChecks ()
{
    $ ( '#userForm' ).validate ( {
        rules : {
            rptDt : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                        return true;
                    }
                }
            },
            wrterNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                        return true;
                    }
                }
            },
            confmerNm : {
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
            rptDt : {
                required : makeValidateMessage ( i18nMessage.msg_sentenceReportReportingDateMandatory )
            },
            wrterNm : {
                required : makeValidateMessage ( i18nMessage.msg_sentenceReportTheAuthorMandatory )
            },
            confmerNm : {
                required : makeValidateMessage ( i18nMessage.msg_sentenceReportApprovedMandatory )
            }
        },
        submitHandler : function ( form )
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : !existItemId ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
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
    initDatetimepicker ();
    initHighcharts ();
    Initialization ();

    btnChecks ();
    $ ( "#tabsRptList01" ).trigger ( 'click' );
    if ( staticVariable.methodInsert == paramMethod )
    {
        // ajax all execute
    }

} );