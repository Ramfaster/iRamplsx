function customScrollbar ()
{
    $ ( '.preview_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

$ ( function ()
{
    customScrollbar ();
} );