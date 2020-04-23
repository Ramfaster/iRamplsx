function customizeScroll ()
{
    // custom scroll
    $ ( '.popup_tbl_box' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

function downloadExcel ()
{
    $ ( '#btn_excel_popup' ).click (
            function ()
            {
                var spcId = $ ( '#spcId' ).val ();
                var pvId = $ ( '#pvId' ).val ();
                var insrncEntrpsCd = $ ( '#insrncEntrpsCd' ).val ();
                var menuName = '';
                $ ( '.lnb' ).find ( 'span' ).each ( function ()
                {
                    menuName += ($ ( this ).text () + '_');
                } );

                menuName += $ ( '.lnb' ).find ( 'strong' ).text ();
                // sevenBuff

                var href = contextPath + '/hom/excel/asset/plantInsurance/histDownload.do?spcId=' + spcId + '&pvId='
                        + pvId + '&insrncEntrpsCd=' + insrncEntrpsCd + '&sevenBuff=' + encodeURIComponent ( menuName );

                location.href = href;

            } );
}

$ ( function ()
{
    customizeScroll ();
    downloadExcel ();
} );