// init datetimepicker
function initDatetimepicker ()
{
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

    $ ( '.yyyymmdd' ).datetimepicker ( 'setEndDate', homUtil.getIntervalDate ( date, 'DA', -1 ) );
}

function initParams ()
{
    // 기본 날짜유형을 "일" 로 설정
    $ ( '#searchDt' ).val ( homUtil.getIntervalDate ( date, 'DA', -1 ) );
}

/*
 * 조회 날짜 포맷 체크
 */
function validateDateFormat ()
{
    var result = false;
    var validformat = /^\d{4}\-\d{2}\-\d{2}$/;
    var searchDate = $ ( '#searchDt' ).val ()

    // 날짜 비교
    if ( !validformat.test ( searchDate ) )
    {
        result = true;
    }
    return result;
}

/*
 * 조회 날짜에 대한 유효성을 검사한다.
 */
function validateDate ()
{
    var result = false;

    var searchDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#searchDt' ).val ().replace ( /-/g, '' ),
            homUtil.dateFormat.formatYYYYMMDD ) );
    var toDay = new Date ( homUtil.convertDateStringToFormat ( homUtil.getIntervalDate ( date, 'DA', -1 ).replace (
            /-/g, '' ), homUtil.dateFormat.formatYYYYMMDD ) );

    // 날짜 비교
    if ( searchDate.getTime () > toDay.getTime () )
    {
        result = true;
    }
    return result;
}

function search ()
{
    // 조회 버튼 클릭 시
    $ ( "#btnSearch" ).click ( function ()
    {
        if ( validateDateFormat () )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validDateFormat,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            return false;
        }

        if ( validateDate () )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertNoSearchDate,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            return false;
        }

        var jspPath = $ ( "#jspPath" ).val ();
        var searchDate = $ ( "#searchDt" ).val ().replace ( /-/g, "" );
        $ ( "#searchDate" ).val ( searchDate );

        $ ( "#frm" ).attr ( "target", "ozBox" );
        $ ( "#frm" ).attr ( "action", ozConfig.ozViewerUrl + jspPath );
        // console.log('suburl='+ozConfig.ozViewerUrl + jspPath);
        $ ( "#frm" ).submit ();

    } );
}

$ ( function ()
{
    initDatetimepicker ();
    initParams ();
    search ();

    $ ( '#btnSearch' ).trigger ( 'click' );
} );