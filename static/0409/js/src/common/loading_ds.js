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

function animeLoading(){
	$('.ment').each(function(){
	  $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
	});

	anime.timeline({loop: true})
	  .add({
	    targets: '.ment .letter',
	    translateX: [40,0],
	    translateZ: 0,
	    opacity: [0,1],
	    easing: "easeOutExpo",
	    duration: 1200,
	    delay: function(el, i) {
	      return 500 + 30 * i;
	    }
	  }).add({
	    targets: '.ment .letter',
	    translateX: [0,-30],
	    opacity: [1,0],
	    easing: "easeInExpo",
	    duration: 1100,
	    delay: function(el, i) {
	      return 100 + 30 * i;
	    }
	  });
	}



$ ( function ()
{
	showPopup();
	customizeScroll();
	animeLoading();
} );