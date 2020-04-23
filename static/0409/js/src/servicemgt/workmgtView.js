//작업선택
function selWorkOrder(){
	$('#sel_work_order').change(function(){
        $('.sel_work_order_box').hide();
        $('#' + $(this).val()).show();
    });
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.frm_con02' ).mCustomScrollbar ( {
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
	selWorkOrder();
} );