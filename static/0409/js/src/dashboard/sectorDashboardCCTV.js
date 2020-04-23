// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.lft_con' ).mCustomScrollbar ( { 
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