// form element customize
function download_toggle ()
{
    $ ( '.down_item' ).click ( function ()
    {
        $ ( this ).parents ( 'tr' ).next ( '.download_box' ).toggle ();
    } )

    $ ( '.btn_close' ).click ( function ()
    {
        $ ( this ).parents ( 'tr.download_box' ).hide ();
    } )
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.scr' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// 삭제 체크
function checkBtnLinks ()
{
    var $btnDelete = $ ( '#btn_delete' );

    if ( typeof $btnDelete !== 'undefined' )
    {
        $btnDelete.on ( 'click', function ()
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
$ ( function ()
{
    customizeScroll ();
    download_toggle ();
    checkBtnLinks ();

} );