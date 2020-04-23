function initDatetimepicker ()
{
    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : 'ko',
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        setDate: new Date()
    } );

    $('.btn_date_next').on("click", function () {
        var date = $('.yyyymmdd').datetimepicker('getDate');
        date.setTime(date.getTime() + (1000*60*60*24))
        $('.yyyymmdd').datetimepicker("setDate", date);
    });

    $('.btn_date_prev').on("click", function () {
        var date = $('.yyyymmdd').datetimepicker('getDate');
        date.setTime(date.getTime() - (1000*60*60*24))
        $('.yyyymmdd').datetimepicker("setDate", date);
    });
}

function customizeScroll ()
{
  $('.eng_dtl_box').perfectScrollbar();
}

function dsGridLayout(){
  var winHeight = $(window).outerHeight();
    var headerGap = 415;
    var repLstMinHeight = winHeight - headerGap;

    $('.eng_dtl_box').height(repLstMinHeight);
}

function moreToggle(){

  $('.btn_sts_tt').click(function(){
    if($(this).hasClass('on')){
      $('.btn_sts_tt').removeClass('on');
    } else {
      $('.btn_sts_tt').removeClass('on');

      $(this).addClass('on');
    }
  });

  $(document).mouseup(function(e){
    var container = $('.sts_tt_box');
    if(container.has(e.target).length === 0){
      $('.btn_sts_tt').removeClass('on');
    }
  });
}

function showPopup() {
    $('.btn_popup').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}

$(window).resize(function() {
    dsGridLayout();
});

$ ( function ()
{
    customizeScroll();
    initDatetimepicker ();
    moreToggle();
    showPopup();
    dsGridLayout();
} );