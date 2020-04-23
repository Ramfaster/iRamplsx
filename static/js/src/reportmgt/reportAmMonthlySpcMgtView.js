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

function btnChecks ()
{
    var vbtnDelete = $ ( '#btn_delete' );

    if ( typeof vbtnDelete !== 'undefined' )
    {
        vbtnDelete.on ( 'click', function ()
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
                    location.href = $that.attr ( 'href' );
                }
            } );

            return false;
        } );
    }
}

function fnCallBackHighchart ()
{
    customizeForm ();
    customizeScroll ();
}

function csHandling ()
{
    $ ( "#tabCurrentPower" ).on (
            'click',
            function ()
            {
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

                fnRptAmSpcCurrentPowerLoad ( $ ( "#reportCurrentPower" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (),
                        $ ( "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ (
                                "#rptCycleCd" ).val (), $ ( "#stdrYm" ).val () );

            } );
    $ ( "#tabIncomeExpend" ).on (
            'click',
            function ()
            {
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
                fnRptAmSpcInExLoad ( $ ( "#reportIncomeExpend" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                        "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ ( "#rptCycleCd" )
                        .val (), $ ( "#stdrYm" ).val () );

            } );
    $ ( "#tabLoan" ).on (
            'click',
            function ()
            {

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
                fnRptAmSpcLoanLoad ( $ ( "#reportLoan" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                        "#rptMbySectn" ).val (), $ ( "#spcId" ).val (), $ ( "#rptTyCd" ).val (), $ ( "#rptCycleCd" )
                        .val (), $ ( "#stdrYm" ).val () );

            } );

    $ ( "#tabFinance" ).on (
            'click',
            function ()
            {
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
                fnRptAmSpcFinanceLoad ( $ ( "#reportFinance" ), fnCallBackHighchart, $ ( "#rptSeq" ).val (), $ (
                        "#rptMbySectn" ).val (), $ ( "#rptMbyId" ).val (), $ ( "#rptTyCd" ).val (), $ ( "#rptCycleCd" )
                        .val (), $ ( "#stdrYm" ).val () );
            } );

}

function fnAllExecuteRptData ()
{
    $ ( "#tabFinance" ).trigger ( 'click' );
    $ ( "#tabLoan" ).trigger ( 'click' );
    $ ( "#tabIncomeExpend" ).trigger ( 'click' );
    $ ( "#tabCurrentPower" ).trigger ( 'click' );
}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    initDatetimepicker ();

    btnChecks ();

    csHandling ();

    fnAllExecuteRptData ();
    // $ ( '#tabCurrentPower' ).trigger ( "click" );

} );