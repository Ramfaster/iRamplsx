// 메시지 발송 정보 설정(숨기기 보이기)
/*
function setMsgSetting ()
{
    var $alarmKnd = $ ( "#alarmKind" );

    if ( $alarmKnd.val () == "ALK01" || $alarmKnd.val () == "ALK02" )
    {
        // 설비상태 알람, 설비상태 그룹알람
        $ ( "#addInfoFrmTitle" ).hide ();
        $ ( "#addInfoFrm" ).hide ();
    } else
    {
        $ ( "#addInfoFrmTitle" ).show ();
        $ ( "#addInfoFrm" ).show ();
    }
}
*/
function setMsgSetting ()
{
    // 알람리뉴얼
    var $alarmKnd = $ ( "#alarmKind" );
    
    $ ( "#addInfoFrmTitle" ).show ();
    $ ( "#addInfoFrm" ).show ();
}

$ ( function ()
{

    setMsgSetting ();
} );