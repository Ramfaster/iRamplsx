// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.form_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

$ ( function ()
{
    customizeScroll ();
} );