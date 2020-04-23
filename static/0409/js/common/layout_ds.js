$(function() {
    // initDSlayout();
    toggleLangAct();
    toggleSelTitAct();
    addConAct();
    utilToggle();
    addConSelToggle();
    schDtlToggle();
    dsContryAccAct();
    alertCls();
    winClsAct();
});

function contHeightSet(){
    var winHeight = $(window).outerHeight();
    var headerHeight = $('.header').outerHeight();
    var footerHeight = $('.footer').outerHeight();
    var contMinHeight = winHeight - headerHeight - footerHeight

    $('.derms_ds .cont').height(contMinHeight);
}

function initDSlayout(){
    contHeightSet();

    $(window).resize(function() {
        contHeightSet();
    });
}

function toggleLangAct(){
    var $LangBtn = $('.ds_lang_list > a');
    var $LangLi = $('.ds_lang_list');

    $LangBtn.click(function() {
       $LangBtn.toggleClass('on');
    });

    $(document).mouseup(function(e){
        if($LangLi.has(e.target).length === 0){
            $LangBtn.removeClass('on');
        }
    });
}

function toggleSelTitAct(){
    var $LangBtn = $('.sel_tit_list > a');
    var $LangLi = $('.sel_tit_list');

    $LangBtn.click(function() {
       $LangBtn.toggleClass('on');
    });
}

function addConAct(){
    var $addBtn = $('.btn_sel_con');
    var $addCon = $('.add_con');
    var $addBtnClose = $('.btn_sel_con_cls');
    var $setOptLang = $('.set_opt .ds_lang_list');

    $addBtn.click(function() {
       $addCon.addClass('on');
       $setOptLang.addClass('on');
    });
    $addBtnClose.click(function() {
       $addCon.removeClass('on');
       $setOptLang.removeClass('on');
    });
}

function utilToggle(){
    var $playTglBtn = $('.tgl_ply');

    $playTglBtn.click(function() {
       $(this).toggleClass('on');
    });

    var $mapTypBtn = $('.util_area > ul > li > a');

    $mapTypBtn.click(function(){
        $mapTypBtn.removeClass('on');
        $(this).addClass('on');
    })

}

function addConSelToggle(){
    var $addConSelBtn = $('.add_con .btn_all_box a');

    $addConSelBtn.click(function(){
        $addConSelBtn.toggleClass('on');
    })
}

function schDtlToggle(){
    var $schDtlBtn = $('.sch_dtl > a');
    var $schDtlCloseBtn = $('.sbm_box > .btn_ccr');

    $schDtlBtn.click(function(){
        $(this).next('.box').toggleClass('on');
    });
    $schDtlCloseBtn.click(function(){
        $(this).parents('.box').removeClass('on');
    });
}

function dsContryAccAct(){
    var $acdBtn = $('.sts_lst > ul > li > a');

    $acdBtn.click(function(){
        $(this).toggleClass('on');
        $(this).next('ul').slideToggle(100);
    });
}


function alertCls(){
    var $alertClsBtn = $('.alert_box .btn_alm_cls');

    $alertClsBtn.click(function(){
        $(this).parents('.alert_box').hide();
    });
}

function winClsAct(){
    var $winClsBtn = $('.btn_win_cls');
    var $winClsCfmBox = $('.close_box');
    var $winClsCclBtn = $('.close_box .btn_cls');
    var $winClsClsBtn = $('.close_box .btn_box .cancel');
    var $winClsDonBtn = $('.close_box .btn_box .done');
    var $winClsDonBtn2 = $('.browser_info_box .btn_box .done');

    $winClsBtn.click(function(){
        $winClsCfmBox.show();
    });
    $winClsCclBtn.click(function(){
        $winClsCfmBox.hide();
    });
    $winClsClsBtn.click(function(){
        $winClsCfmBox.hide();
    });



    $winClsDonBtn.click(function(){
        window.close(); // 일반적인 현재 창 닫기
        window.open('about:blank','_self').self.close();  // IE에서 묻지 않고 창 닫기
    })

    $winClsDonBtn2.click(function(){
        window.close(); // 일반적인 현재 창 닫기
        window.open('about:blank','_self').self.close();  // IE에서 묻지 않고 창 닫기
    })
}


