function showPopup() {
    $('.btn_popup').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}

function customizeScroll ()
{
	$('.sel_con > .area > .box').perfectScrollbar();
	$('.sts_sel').perfectScrollbar();
}


$ ( function ()
{
	showPopup();
	customizeScroll();
} );