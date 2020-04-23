// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.mscrd' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 250
    } );
}

function showAllInsuranceHistoryPopup ()
{

    if ( typeof $ ( "#btn_insu_hist_popup" ) !== 'undefined' )
    {
        var btnPopup = $ ( "#btn_insu_hist_popup" ).magnificPopup ( {
            type : 'ajax',
            alignTop : false,
            overflowY : 'scroll',
            closeOnContentClick : false,
            closeOnBgClick : false
        } );
    }
}

$ ( function ()
{
    customizeScroll ();
    showAllInsuranceHistoryPopup ();

} );