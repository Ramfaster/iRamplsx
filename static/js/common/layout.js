$ ( function ()
{
    initGNB ();
    toggleMenu ();
    choiceMenu ();
    toggleEps ();
    toggleLang ();
    toggleDashboardLang ();
    
    autocompletePvList ();
    
} );

//발전소 리스트 자동완성
function autocompletePvList ()
{
    
    var pvList = [];
  
    $ ( ".pv_list_dummy" ).each ( function ()
    {
        $this = $(this);
        pvList.push ( {
            "value" : $this.attr( 'pvId' ),
            "label" : $this.attr( 'pvNm' ),
        } );
    } );
    
    //발전소 리스트 자동완성
    $( "#pv_search" ).autocomplete({
        minLength: 0,
        source: pvList,
        focus: function( event, ui ) {
            return false;
        }
    })
    .autocomplete( "instance" )._renderMenu = function( ul, items ) {
  
        $( "#pv_menu" ).empty();
        var li = "";
        
        $.each( items, function( index, item ) {
            li += "<li><a href='/hom/common/choicePv.do?pvId="+item.value+"'><i class='icon_arrow'></i>"+item.label+"</a></li>";
        });
        
        $( "#pv_menu" ).append(li);
    };
  

}
// 메뉴 toggle
function toggleMenu ()
{
    var $menuBtn = $ ( '.btn_gnb' );
    var $gnb = $ ( '.btn_gnb, .gnb' );

    $menuBtn.click ( function ()
    {
        resizeGNBSize ();

        $gnb.toggleClass ( 'on' );
        $menuBtn.toggleClass ( 'selected' );
    } );

    $gnb.find ( '.dimmed' ).on ( 'click', function ()
    {
        $gnb.removeClass ( 'on' );
        $menuBtn.removeClass ( 'selected' );
    } );
}

// 메뉴 선택
function choiceMenu ()
{
    var $gnbMenu = $ ( '#gnb_menu' );
    var $depth01Target = $gnbMenu.find ( '.depth01' ).find ( '.depth01_target' );
    var $depth02Target = $gnbMenu.find ( '.depth02_target' );

    // 1단계 메뉴 클릭
    $depth01Target.on ( 'click', function ()
    {
        var $allDepth01Li = $gnbMenu.find ( '.depth01' ).find ( 'li' );
        var $allDepth02Li = $gnbMenu.find ( '.depth02' ).find ( 'li' );
        var $parentItem = $ ( this ).closest ( 'li' );
        var $depthWrap = $parentItem.find ( '.depth_wrap' );

        // 2/3단계 선택된 메뉴 해제 및 전체 메뉴 닫기
        $allDepth02Li.each ( function ()
        {
            $ ( this ).removeClass ( 'on' ).find ( '.depth03' ).hide ().find ( 'li' ).removeClass ( 'on' );
        } );

        // 1단계 하위 메뉴 닫기
        $allDepth01Li.each ( function ()
        {
            if ( $parentItem.index () !== $ ( this ).index () )
            {
                $ ( this ).removeClass ( 'selected' ).find ( '.depth_wrap' ).hide ();
            }
        } );

        if ( !$parentItem.hasClass ( 'selected' ) )
        {
            if ( $depthWrap.css ( 'display' ) === 'none' )
            {
                $parentItem.addClass ( 'selected' );
                $depthWrap.show ();
            } else
            {
                $parentItem.removeClass ( 'selected' );
                $depthWrap.hide ();
            }
        }
    } );

    // 2단계 메뉴 클릭 시 3단계 메뉴 접기/펼치기
    $depth02Target.on ( 'click', function ()
    {
        var $allDepth02Li = $gnbMenu.find ( '.depth02' ).find ( 'li' );
        var $parentItem = $ ( this ).closest ( 'li' );
        var $depth03 = $parentItem.find ( '.depth03' );

        // 선택된 메뉴 해제 및 전체 메뉴 닫기
        $allDepth02Li.each ( function ()
        {
            if ( $parentItem.index () !== $ ( this ).index () )
            {
                $ ( this ).removeClass ( 'on' ).find ( '.depth03' ).hide ().find ( 'li' ).removeClass ( 'on' );
            }
        } );

        if ( $depth03.css ( 'display' ) === 'none' )
        {
            $parentItem.addClass ( 'on' );
            $depth03.show ();
        } else
        {
            $parentItem.removeClass ( 'on' );
            $depth03.hide ();
        }
    } );
}

// GNB Size 재세팅
function resizeGNBSize ()
{
    var $gnb = $ ( '#header .gnb' );
    var $gnbChild = $ ( '#header .gnb > .menu' );
    var headerOuterHeight = $ ( '#header' ).outerHeight ();
    var footerOuterHeight = $ ( '#footer' ).outerHeight ();
    var headerContWidth = $ ( '#header .header_cont' ).width ();

    $gnbChild.css ( {
        height : $ ( document ).height () - headerOuterHeight - footerOuterHeight
    } );

    $gnb.css ( {
        left : (($ ( document ).width () - headerContWidth) / 2) * -1
    } ).find ( '.dimmed' ).css ( {
        paddingRight : $ ( document ).width () - headerContWidth
    } );
}

// GNB 높이 세팅
function setGNBSize ( gnbChildWidth, $gnb, $gnbChild, headerOuterHeight, footerOuterHeight, headerContWidth )
{
    $gnbChild.css ( {
        width : gnbChildWidth + ($ ( document ).width () - headerContWidth) / 2,
        height : $ ( document ).height () - headerOuterHeight - footerOuterHeight
    } );

    $gnb.css ( {
        left : (($ ( document ).width () - headerContWidth) / 2) * -1
    } ).find ( '.dimmed' ).css ( {
        paddingRight : $ ( document ).width () - headerContWidth
    } );
}

// GNB 높이 세팅 관련
function initGNB ()
{
    var $gnb = $ ( '#header .gnb' );
    var $gnbChild = $ ( '#header .gnb > .menu' );
    var gnbChildWidth = $gnbChild.width ();
    var headerOuterHeight = $ ( '#header' ).outerHeight ();
    var footerOuterHeight = $ ( '#footer' ).outerHeight ();
    var headerContWidth = $ ( '#header .header_cont' ).width ();

    setGNBSize ( gnbChildWidth, $gnb, $gnbChild, headerOuterHeight, footerOuterHeight, headerContWidth );

    $ ( window ).resize ( function ()
    {
        setGNBSize ( gnbChildWidth, $gnb, $gnbChild, headerOuterHeight, footerOuterHeight, headerContWidth );
    } );
}

// 발전소 목록 toggle
function toggleEps ()
{
    var $epsBtn = $ ( '.eps_list > a' );
    var $epsLi = $ ( '.eps_list' );

    $epsBtn.hover ( function ()
    {
        $epsLi.addClass ( 'on' );
    } );
    $epsLi.mouseleave ( function ()
    {
        $epsLi.removeClass ( 'on' );
    } );
}


// 언어선택 toggle
function toggleLang ()
{
    var $langBtn = $ ( '.lang_list > a' );
    var $langList = $ ( '.lang_list' );

    $langBtn.on ( 'mouseenter', function ()
    {
        $langList.addClass ( 'on' );
    } );

    $langList.on ( 'mouseleave', function ()
    {
        $langList.removeClass ( 'on' );
    } );
}

// dashboard 언어선택 toggle
function toggleDashboardLang ()
{
    var $dbLangBtn = $ ( '.dblang_list > a' );
    var $dbLangIcon = $ ( '.dblang_list > a i' );
    var $dbLangLi = $ ( '.dblang_list' );

    $dbLangBtn.click ( function ()
    {
        $dbLangLi.toggleClass ( 'on' );
        $dbLangIcon.toggleClass ( 'icon_up03' );
    } );
}

//탭 액션
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

