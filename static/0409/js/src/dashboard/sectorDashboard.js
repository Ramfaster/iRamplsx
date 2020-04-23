// form element customize
function customizeForm ()
{
   var $imageType = $('.image_type').customizeRadio({
	    backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
		width: 13,							
		height	: 13
	});

    var $dateType1 = $ ( '.customize_select_m'  ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
    });

   var $dateType = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    });
}	

// scroll customize
function customizeScroll ()
{
	$('.intbl_scrl').perfectScrollbar();
}

// slider customize
function rssFeedSlide ()
{
	var $rssFeedSlider = $('.bxslider').bxSlider({
        speed: 500,
        pause: 6000,
        touchEnabled: false,
        auto: true,
        autoControls: false,
        pager: true,
        infiniteLoop: true,
        controls: false,
        autoHover: true,
        maxSlides: 4
	});
	
	$('.btn_next').on('click', function() {
	    $rssFeedSlider.goToPrevSlide();
	});
	
	$('.btn_prev').on('click', function() {
	    $rssFeedSlider.goToNextSlide();
	});
	
	$('#btn_play_control').on('click', function() {
	    if($(this).hasClass('btn_stop')) {
	        $(this).removeClass('btn_stop').addClass('btn_play');
	        $rssFeedSlider.stopAuto();
	    }
	    else {
	        $(this).removeClass('btn_play').addClass('btn_stop');
	        $rssFeedSlider.startAuto();
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

$ ( function ()
{
	customizeForm ();
	customizeScroll ();
	rssFeedSlide ();
	showPopup();
} );