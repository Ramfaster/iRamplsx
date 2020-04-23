// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.tbl_list_wrap' ).mCustomScrollbar ( {
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
    customizeScroll ();
} );