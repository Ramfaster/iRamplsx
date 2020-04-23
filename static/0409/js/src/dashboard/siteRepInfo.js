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
	$('.rep_lst').perfectScrollbar();
	$('.eve_log ul').perfectScrollbar();
}

function dsGridLayout(){
	var winHeight = $(window).outerHeight();
    var headerGap = 440;
    var repLstMinHeight = winHeight - headerGap;

    $('.rep_lst').height(repLstMinHeight);
}

function repBoxAct(){
	var repBtn = $('.rep_lst > ul > li > a');
	var repCont = repBtn.parent('li');
	var repBox = $('.rep_lst');
	var repClsBtn = $('.rep_box .btn_cls');

	repBtn.click(function(){

		var repBtnPos = $(this).parent('li').position().top;

		if($(this).hasClass('on')){
			repBtn.removeClass('on');
			repBox.animate({scrollTop : repBtnPos}, 200);
		} else {
			repBtn.removeClass('on');
			$(this).addClass('on');
			repBox.animate({scrollTop : repBtnPos}, 200);
		}

		// console.log(repBtnPos);

	});

	repClsBtn.click(function(){
		repBtn.removeClass('on');
	});

	$(document).mouseup(function(e){
		if(repCont.has(e.target).length === 0){
			repBtn.removeClass('on');
		}
	});
}

function counterAct(){

	var counterAllNum = $(".cnt_box_all").text()
	var counterNormal = $(".cnt_box_normal").text()
	var counterBroken = $(".cnt_box_broken").text()
	var counterWarnng = $(".cnt_box_warnng").text()
	var counterNeterr = $(".cnt_box_neterr").text()

	var counterAll = new FlipClock($('.cnt_box_all'), counterAllNum, {
		clockFace: 'Counter',
		minimumDigits: 5
	});

	var counterNormal = new FlipClock($('.cnt_box_normal'), counterNormal, {
		clockFace: 'Counter',
		minimumDigits: 5
	});

	var counterBroken = new FlipClock($('.cnt_box_broken'), counterBroken, {
		clockFace: 'Counter',
		minimumDigits: 5
	});

	var counterWarnng = new FlipClock($('.cnt_box_warnng'), counterWarnng, {
		clockFace: 'Counter',
		minimumDigits: 5
	});

	var counterNeterr = new FlipClock($('.cnt_box_neterr'), counterNeterr, {
		clockFace: 'Counter',
		minimumDigits: 5
	});
}

$(window).resize(function() {
    dsGridLayout();
});


$(function ()
{
	selectCst();
	customizeScroll ();
	dsGridLayout();
	counterAct();
	repBoxAct();
});