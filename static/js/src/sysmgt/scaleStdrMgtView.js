// 삭제 체크
function checkDelete ()
{
    var $btnDelete = $ ( '#btn_delete' );

    $btnDelete.click ( function ()
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

$ ( function ()
{
    checkDelete ();
} );