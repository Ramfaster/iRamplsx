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
                rptDataReloadGetTabs ();

                $ ( "#tabsRptList01" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList02" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList03" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList01" ).parent ().addClass ( 'on' );
                $ ( "#lisRptList02" ).removeClass ( 'on' );
                $ ( "#lisRptList03" ).removeClass ( 'on' );
                $ ( "#lisRptList01" ).addClass ( 'on' );
                if ( paramRunOmRptAjax01 == false )
                {
                    $ ( "#lisRptList01" ).removeClass ( 'on' );
                    $ ( "#lisRptList02" ).removeClass ( 'on' );
                    $ ( "#lisRptList03" ).removeClass ( 'on' );
                    $ ( "#lisRptList01" ).addClass ( 'on' );
                    paramRunOmRptAjax01 = true;
                    fnRptOmMonthlySpcInit ( $ ( "#lisRptList01" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                            "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ (
                            "#rptCycleCd" ).val (), $ ( "#stdrYm" ).val () );
                }
            } );
    $ ( "#tabsRptList02" ).on (
            'click',
            function ()
            {
                rptDataReloadGetTabs ();

                $ ( "#tabsRptList01" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList02" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList03" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList02" ).parent ().addClass ( 'on' );
                $ ( "#lisRptList01" ).removeClass ( 'on' );
                $ ( "#lisRptList03" ).removeClass ( 'on' );
                $ ( "#lisRptList02" ).addClass ( 'on' );
                if ( paramRunOmRptAjax02 == false )
                {
                    $ ( "#lisRptList01" ).removeClass ( 'on' );
                    $ ( "#lisRptList02" ).removeClass ( 'on' );
                    $ ( "#lisRptList03" ).removeClass ( 'on' );
                    $ ( "#lisRptList02" ).addClass ( 'on' );
                    paramRunOmRptAjax02 = true;
                    fnRptOmMonthlySpcWarnLoad ( $ ( "#lisRptList02" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                            "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ (
                            "#rptCycleCd" ).val (), $ ( "#stdrYm" ).val () );
                }
            } );
    $ ( "#tabsRptList03" ).on (
            'click',
            function ()
            {
                rptDataReloadGetTabs ();

                $ ( "#tabsRptList01" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList02" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList03" ).parent ().removeClass ( 'on' );
                $ ( "#tabsRptList03" ).parent ().addClass ( 'on' );
                $ ( "#lisRptList01" ).removeClass ( 'on' );
                $ ( "#lisRptList02" ).removeClass ( 'on' );
                $ ( "#lisRptList03" ).addClass ( 'on' );
                if ( paramRunOmRptAjax03 == false )
                {
                    $ ( "#lisRptList01" ).removeClass ( 'on' );
                    $ ( "#lisRptList02" ).removeClass ( 'on' );
                    $ ( "#lisRptList03" ).removeClass ( 'on' );
                    $ ( "#lisRptList03" ).addClass ( 'on' );
                    paramRunOmRptAjax03 = true;
                    fnRptOmMonthlySpcTotalLoad ( $ ( "#lisRptList03" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                            "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ (
                            "#rptCycleCd" ).val (), $ ( "#stdrYm" ).val () );
                }

            } );
}

function fnAllExecuteRptData ()
{
    $ ( "#tabsRptList03" ).trigger ( 'click' );
    $ ( "#tabsRptList02" ).trigger ( 'click' );
    $ ( "#tabsRptList01" ).trigger ( 'click' );
}

function rptDataReloadSetTabs ()
{
    if ( typeof $ ( "#rm1" ) !== 'undefined' )
    {
        if ( varReloadrm1 != undefined )
        {
            $ ( "#rm1" ).val ( varReloadrm1 );
        }
    }
    if ( typeof $ ( "#rm2" ) !== 'undefined' )
    {
        if ( varReloadrm2 != undefined )
        {
            $ ( "#rm2" ).val ( varReloadrm2 );
        }
    }
    if ( typeof $ ( "#rm3" ) !== 'undefined' )
    {
        if ( varReloadrm3 != undefined )
        {
            $ ( "#rm3" ).val ( varReloadrm3 );
        }
    }
    if ( typeof $ ( "#rm4" ) !== 'undefined' )
    {
        if ( varReloadrm4 != undefined )
        {
            $ ( "#rm4" ).val ( varReloadrm4 );
        }
    }
    if ( typeof $ ( "#rm5" ) !== 'undefined' )
    {
        if ( varReloadrm5 != undefined )
        {
            $ ( "#rm5" ).val ( varReloadrm5 );
        }
    }
    if ( typeof $ ( "#rm6" ) !== 'undefined' )
    {
        if ( varReloadrm6 != undefined )
        {
            $ ( "#rm6" ).val ( varReloadrm6 );
        }
    }
    if ( typeof $ ( "#rm7" ) !== 'undefined' )
    {
        if ( varReloadrm7 != undefined )
        {
            $ ( "#rm7" ).val ( varReloadrm7 );
        }
    }
    if ( typeof $ ( "#referConts1" ) !== 'undefined' )
    {
        if ( varReloadreferConts1 != undefined )
        {
            $ ( "#referConts1" ).val ( varReloadreferConts1 );
        }
    }
    if ( typeof $ ( "#referConts2" ) !== 'undefined' )
    {
        if ( varReloadreferConts2 != undefined )
        {
            $ ( "#referConts2" ).val ( varReloadreferConts2 );
        }
    }
    if ( typeof $ ( "#referConts3" ) !== 'undefined' )
    {
        if ( varReloadreferConts3 != undefined )
        {
            $ ( "#referConts3" ).val ( varReloadreferConts3 );
        }
    }
    if ( typeof $ ( "referConts4" ) !== 'undefined' )
    {
        if ( varReloadreferConts4 != undefined )
        {
            $ ( "#referConts4" ).val ( varReloadreferConts4 );
        }
    }
}

function rptDataReloadGetTabs ()
{
    if ( typeof $ ( "#rm1" ) !== 'undefined' )
    {
        varReloadrm1 = $ ( "#rm1" ).val ();
    }
    if ( typeof $ ( "#rm2" ) !== 'undefined' )
    {
        varReloadrm2 = $ ( "#rm2" ).val ();
    }

    if ( typeof $ ( "#rm3" ) !== 'undefined' )
    {
        varReloadrm3 = $ ( "#rm3" ).val ();
    }
    if ( typeof $ ( "#rm4" ) !== 'undefined' )
    {
        varReloadrm4 = $ ( "#rm4" ).val ();
    }
    if ( typeof $ ( "#rm5" ) !== 'undefined' )
    {
        varReloadrm5 = $ ( "#rm5" ).val ();
    }
    if ( typeof $ ( "#rm6" ) !== 'undefined' )
    {
        varReloadrm6 = $ ( "#rm6" ).val ();
    }
    if ( typeof $ ( "#rm7" ) !== 'undefined' )
    {
        varReloadrm7 = $ ( "#rm7" ).val ();
    }
    if ( typeof $ ( "#referConts1" ) !== 'undefined' )
    {
        varReloadreferConts1 = $ ( "#referConts1" ).val ();
    }
    if ( typeof $ ( "#referConts2" ) !== 'undefined' )
    {
        varReloadreferConts2 = $ ( "#referConts2" ).val ();
    }
    if ( typeof $ ( "#referConts3" ) !== 'undefined' )
    {
        varReloadreferConts3 = $ ( "#referConts3" ).val ();
    }
    if ( typeof $ ( "#referConts4" ) !== 'undefined' )
    {
        varReloadreferConts4 = $ ( "#referConts4" ).val ();
    }

}

function fnCallBackHighchart ()
{
    customizeScroll ();
    rptDataReloadSetTabs ();
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

    fnAllExecuteRptData ();

    // $ ( "#tabsRptList03" ).trigger ( 'click' );
    // $ ( "#tabsRptList02" ).trigger ( 'click' );
    // $ ( "#tabsRptList01" ).trigger ( 'click' );

    if ( staticVariable.methodInsert == paramMethod )
    {
        // ajax all execute
        // $ ( "#tabsRptList02" ).trigger ( 'click' );
        // $ ( "#tabsRptList03" ).trigger ( 'click' );
    }
} );