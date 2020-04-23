function stsListLayout(){
	var winHeight = $(window).outerHeight();
    var gapHeight = 246;
    var stsListHeight = winHeight - gapHeight;

    $('.sts_lst').css('max-height', stsListHeight + 'px');
}

function showPopup() {
    $('.btn_prj_popup a').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}

function customizeScroll ()
{
	$('.sel_con > .area > .box').perfectScrollbar();
	$('.sts_box_ctr .sts_lst').perfectScrollbar();
}


$(window).resize(function() {
    stsListLayout();
});

$ ( function ()
{
	showPopup();
	customizeScroll();
	stsListLayout();
} );