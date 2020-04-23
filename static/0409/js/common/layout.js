$(function() {
    initGNB();
    toggleMenu();
	toggleLang();
    toggleEps();  	
	toggledbLang();
	toggledbSlide();
    tabAction();
});

// 메뉴 toggle
function toggleMenu() {
    var $menuBtn = $('.btn_gnb');
    var $mGnb = $('.btn_gnb, .gnb');

    $menuBtn.click(function() {
        $mGnb.toggleClass('on'); 
		$menuBtn.toggleClass('selected'); 
     });     
}

// GNB 높이 세팅
function setGNBSize(gnbChildWidth, $gnb, $gnbChild, headerOuterHeight, footerOuterHeight, headerContWidth) {
    $gnbChild.css({
        width: gnbChildWidth + ($(document).width() - headerContWidth) / 2,
        height: $(document).height() - headerOuterHeight - footerOuterHeight
    });
    
    $gnb.css({
        left: (($(document).width() - headerContWidth) / 2) * -1
    }).find('.dimmed').css({
        paddingRight: $(document).width() - headerContWidth
    });
}

// GNB 높이 세팅 관련
function initGNB() {
    var $gnb = $('#header .gnb');
    var $gnbChild = $('#header .gnb > .menu');
    var gnbChildWidth = $gnbChild.width();
    var headerOuterHeight = $('#header').outerHeight();
    var footerOuterHeight = $('#footer').outerHeight();
    var headerContWidth = $('#header .header_cont').width();

    setGNBSize(gnbChildWidth, $gnb, $gnbChild, headerOuterHeight, footerOuterHeight, headerContWidth);
    
    $(window).resize(function() {
        setGNBSize(gnbChildWidth, $gnb, $gnbChild, headerOuterHeight, footerOuterHeight, headerContWidth);
    });
}

// 언어선택 toggle
function toggleLang() {
    var $LangBtn = $('.lang_list > a');
    var $LangLi = $('.lang_list');
    
    $LangBtn.hover(function() {
       $LangLi.addClass('on');        
    });
    $LangLi.mouseleave(function() {  
        $LangLi.removeClass('on');
    });
}

// 발전소 목록 toggle
function toggleEps() {
    var $epsBtn = $('.eps_list > a');
    var $epsLi = $('.eps_list');
    
    $epsBtn.hover(function() {
        $epsLi.addClass('on');        
    });
    $epsLi.mouseleave(function() {  
        $epsLi.removeClass('on');
    });
}

// dashboard 언어선택 toggle
function toggledbLang() {
    var $dbLangBtn = $('.dblang_list > a');
	var $dbLangIcon = $('.dblang_list > a i');
    var $dbLangLi = $('.dblang_list');
    
    $dbLangBtn.click(function() {
       $dbLangLi.toggleClass('on');
	   $dbLangIcon.toggleClass('icon_up03');
    });
}

// dashboard 슬라이드 toggle
function toggledbSlide() {
    var $dbSlideBtn = $('.slide_wrap > a');
	var $dbSlide = $('.slide_cont_wrap');
    
    $dbSlideBtn.click(function() {
       $dbSlideBtn.toggleClass('btn_slide_open');
	   $dbSlide.toggle();
    });
}

// 탭 액션
function tabAction(){
    var tabLI = $('.tab_cont_box > .tab > li');

    tabLI.on('click', 'a', function (e) {
        var target = $(e.currentTarget);
        var li = target.parent();
        var idx = target.parent().index();
        var content = target.closest('ul').siblings('.tab_body').children('li');
        
        e.preventDefault();
        
        if (li.hasClass('disabled')) return;
        
        li.siblings().andSelf().removeClass('on');
        li.addClass('on');
        content.hide().eq(idx).show();
    });
}