function customizeInsuPopScroll ()
{
    // $ ( "#popupDivInsuranceTitle" ).text (
    // $ ( ':selected', $ ( '#pvId' ) ).text () + ' ' + $ ( "#popupDivInsuranceTitle" ).text () );

    // custom scroll
    $ ( '.popup_right_scrd' ).mCustomScrollbar ( {
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
    customizeInsuPopScroll ();
} );