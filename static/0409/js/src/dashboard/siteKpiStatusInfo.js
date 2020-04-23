
function dsKPITabAct(){
  $(".tab_content").hide().first().show();
  $(".tab.kpi li:first").addClass("on");

  $(".tab.kpi a").on('click', function (e) {
    e.preventDefault();
    $(this).closest('li').addClass("on").siblings().removeClass("on");
    $($(this).attr('href')).show().siblings('.tab_content').hide();
  });
}

function selectCst(){

	var optTit = $('.select_cst .opt_tit');
	var selOpt = $('.select_cst .opt_box input:checked + label');
	var optLine = $('.opt_box input');

	optTit.text('');

	optTit.each(function(){
		var optTitTxt = $(this).next('.opt_box').find('input:checked').next('label').text();;
		$(this).text(optTitTxt);
	})

	optTit.click(function(){
		if($(this).hasClass('on')){
			optTit.removeClass('on');
			optTit.next('.opt_box').removeClass('on');
		} else {
			optTit.removeClass('on');
			optTit.next('.opt_box').removeClass('on');

			$(this).toggleClass('on');
			$(this).next('.opt_box').toggleClass('on');
		}
	});

	optLine.change(function(){
		var titTxt = $(this).next('label').text();
		var thisOptTit = $(this).parent('.opt_box').prev('.opt_tit');
		thisOptTit.text('');
		thisOptTit.text(titTxt);
		$(this).parent().removeClass('on');
		$(this).parent().prev('.opt_tit').removeClass('on');
	});

	optLine.click(function(){
		var titTxt = $(this).next('label').text();
		var thisOptTit = $(this).parent('.opt_box').prev('.opt_tit');
		thisOptTit.text('');
		thisOptTit.text(titTxt);
		$(this).parent().removeClass('on');
		$(this).parent().prev('.opt_tit').removeClass('on');
	});


	$(document).mouseup(function(e){
		var container = $('.select_cst');
		if(container.has(e.target).length === 0){
			optTit.removeClass('on');
			optTit.next('.opt_box').removeClass('on');
		}
	});
}

function customizeScroll ()
{
	$('.total_kpi_lst .lst_bd').perfectScrollbar();
	$('.pv_ess_lst .intbl_scrl').perfectScrollbar();
	$('.sel_con > .area > .box').perfectScrollbar();
}

function dsGridLayout(){
	var winHeight = $(window).outerHeight();
    var headerHeight = $('.header').outerHeight();

    var headerGap = 50;
    var contTabHeight =  39;
    var utilLineHeight = 61;
    var listHeadHeight = 40;
    var tabContHdHeight = headerGap + contTabHeight + utilLineHeight + listHeadHeight;
    var footerHeight = $('.footer').outerHeight() + 21;
    var contMinHeight = winHeight - headerHeight - footerHeight - tabContHdHeight - 29;
    var pvEssLstMinHeight = winHeight - headerHeight - footerHeight - tabContHdHeight - 59;

    $('.total_kpi_lst .lst_bd').height(contMinHeight);
    $('.pv_ess_lst .intbl_scrl').css('max-height', pvEssLstMinHeight + 'px');
}


$(window).resize(function() {
    dsGridLayout();
});

$(function ()
{
	dsKPITabAct();
	selectCst();
	customizeScroll ();
	dsGridLayout();
});