// error contents 사이즈 지정 초기화
function initErrorSize ()
{
    var $errorWrap = $ ( '.error_wrap' );

    setErrorSize ( $errorWrap );
    $ ( window ).resize ( function ()
    {
        setErrorSize ( $errorWrap );
    } );
}

// error contents 사이즈 세팅
function setErrorSize ( $errorWrap )
{
    $errorWrap.css ( {
        'padding-top' : ($ ( window ).height () - $errorWrap.height ()) / 2
    } );
}

// history back 체크
function checkHistory ()
{
    if ( document.referrer )
    {
        $ ( '#btn_back01' ).css ( {
            display : 'inline-block'
        } ).on ( 'click', function ()
        {
            history.back ();
        } );
    }
}

$ ( function ()
{
    initErrorSize ();
    checkHistory ();
} );