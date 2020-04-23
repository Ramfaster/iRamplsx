function customizeScroll ()
{
    // custom scroll
    $ ( '.file_list_box' ).mCustomScrollbar ( {
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
} )