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

function fnCallBackHighchart ()
{
    customizeForm ();
    customizeScroll ();

    rptDataReloadSetTabs ();

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

function csHandling ()
{

    $ ( "#tabCurrentPower" ).on (
            'click',
            function ()
            {
                rptDataReloadGetTabs ();
                $ ( "#tabCurrentPower" ).parent ().removeClass ( 'on' );
                $ ( "#tabIncomeExpend" ).parent ().removeClass ( 'on' );
                $ ( "#tabLoan" ).parent ().removeClass ( 'on' );
                if ( typeof $ ( "#tabFinance" ) !== 'undefined' )
                {
                    $ ( "#tabFinance" ).parent ().removeClass ( 'on' );
                }
                $ ( "#tabCurrentPower" ).parent ().addClass ( 'on' );

                $ ( "#reportCurrentPower" ).removeClass ( 'on' );
                $ ( "#reportIncomeExpend" ).removeClass ( 'on' );
                $ ( "#reportLoan" ).removeClass ( 'on' );
                if ( typeof $ ( "#reportFinance" ) !== 'undefined' )
                {
                    $ ( "#reportFinance" ).removeClass ( 'on' );
                }
                $ ( "#reportCurrentPower" ).addClass ( 'on' );

                fnRptAmPlantCurrentPowerLoad ( $ ( "#reportCurrentPower" ), fnCallBackHighchart,
                        $ ( "#rptSeq" ).val (), $ ( "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" )
                                .val (), $ ( "#rptCycleCd" ).val (), $ ( "#stdrYm" ).val () );

            } );
    $ ( "#tabIncomeExpend" ).on (
            'click',
            function ()
            {
                rptDataReloadGetTabs ();

                $ ( "#tabCurrentPower" ).parent ().removeClass ( 'on' );
                $ ( "#tabIncomeExpend" ).parent ().removeClass ( 'on' );
                $ ( "#tabLoan" ).parent ().removeClass ( 'on' );
                if ( typeof $ ( "#tabFinance" ) !== 'undefined' )
                {
                    $ ( "#tabFinance" ).parent ().removeClass ( 'on' );
                }
                $ ( "#tabIncomeExpend" ).parent ().addClass ( 'on' );

                $ ( "#reportCurrentPower" ).removeClass ( 'on' );
                $ ( "#reportIncomeExpend" ).removeClass ( 'on' );
                $ ( "#reportLoan" ).removeClass ( 'on' );
                $ ( "#reportFinance" ).removeClass ( 'on' );
                $ ( "#reportIncomeExpend" ).addClass ( 'on' );
                fnRptAmPlantInExLoad ( $ ( "#reportIncomeExpend" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                        "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ ( "#rptCycleCd" )
                        .val (), $ ( "#stdrYm" ).val () );

            } );
    $ ( "#tabLoan" ).on (
            'click',
            function ()
            {
                rptDataReloadGetTabs ();

                $ ( "#tabCurrentPower" ).parent ().removeClass ( 'on' );
                $ ( "#tabIncomeExpend" ).parent ().removeClass ( 'on' );
                $ ( "#tabLoan" ).parent ().removeClass ( 'on' );
                if ( typeof $ ( "#tabFinance" ) !== 'undefined' )
                {
                    $ ( "#tabFinance" ).parent ().removeClass ( 'on' );
                }
                $ ( "#tabLoan" ).parent ().addClass ( 'on' );

                $ ( "#reportCurrentPower" ).removeClass ( 'on' );
                $ ( "#reportIncomeExpend" ).removeClass ( 'on' );
                $ ( "#reportLoan" ).removeClass ( 'on' );
                $ ( "#reportFinance" ).removeClass ( 'on' );
                $ ( "#reportLoan" ).addClass ( 'on' );
                fnRptAmPlantLoanLoad ( $ ( "#reportLoan" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                        "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ ( "#rptCycleCd" )
                        .val (), $ ( "#stdrYm" ).val () );

            } );
    if ( typeof $ ( "#tabFinance" ) !== 'undefined' )
    {
        $ ( "#tabFinance" ).on (
                'click',
                function ()
                {
                    rptDataReloadGetTabs ();

                    $ ( "#tabCurrentPower" ).parent ().removeClass ( 'on' );
                    $ ( "#tabIncomeExpend" ).parent ().removeClass ( 'on' );
                    $ ( "#tabLoan" ).parent ().removeClass ( 'on' );
                    $ ( "#tabFinance" ).parent ().removeClass ( 'on' );
                    $ ( "#tabFinance" ).parent ().addClass ( 'on' );

                    $ ( "#reportCurrentPower" ).removeClass ( 'on' );
                    $ ( "#reportIncomeExpend" ).removeClass ( 'on' );
                    $ ( "#reportLoan" ).removeClass ( 'on' );
                    $ ( "#reportFinance" ).removeClass ( 'on' );
                    $ ( "#reportFinance" ).addClass ( 'on' );
                    fnRptAmPlantFinanceLoad ( $ ( "#reportFinance" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                            "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ (
                            "#rptCycleCd" ).val (), $ ( "#stdrYm" ).val () );
                } );
    }
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

function fnAllExecuteRptData ()
{
    if ( typeof $ ( "#tabFinance" ) !== 'undefined' )
    {
        $ ( "#tabFinance" ).trigger ( 'click' );
    }
    $ ( "#tabLoan" ).trigger ( 'click' );
    $ ( "#tabIncomeExpend" ).trigger ( 'click' );
    $ ( "#tabCurrentPower" ).trigger ( 'click' );
}

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
        $ ( '#gnrlzOpinion' ).val ( '' );

        $ ( '.frm_type' ).removeClass ( 'error' );
        $ ( "[id$=error]" ).remove ();

    } );
}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    initDatetimepicker ();
    btnChecks ();
    Initialization ();

    csHandling ();

    fnAllExecuteRptData ();
    // $ ( '#tabCurrentPower' ).trigger ( "click" );

    if ( staticVariable.methodInsert == paramMethod )
    {
        // ajax all execute
    }
} );