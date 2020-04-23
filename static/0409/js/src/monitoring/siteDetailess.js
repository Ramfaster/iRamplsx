
// more btn action
function moreAction(){

    var moreBox = $('.more_detail_box');
    var btnMore = $('.btn_more');

    btnMore.on('click', function(e){
        var target = $(e.currentTarget);
        var theMoreBox = $(this).next('.more_detail_box');

        theMoreBox.toggleClass('on');

        if(theMoreBox.hasClass('on')){

            function moreBoxFix(){
                var moreBoxHeight = theMoreBox.outerHeight();
                alert(moreBoxHeight);
                var moreBoxPos = moreBoxHeight / 2;
                theMoreBox.css('margin-top','-'+ moreBoxPos + 'px');
            }

            theMoreBox.show();

        } else {
            theMoreBox.hide();
        }

        e.preventDefault();
    });


    $('.more_detail_box .btn_close').click(function(){
        $(this).parents('.more_detail_box').removeClass('on');
        $(this).parents('.more_detail_box').hide();
    })

    // $(document).mouseup(function(e){
    //     var container = $('.more_box');
    //     if(container.has(e.target).length === 0){
    //         moreBox.removeClass('on');
    //         moreBox.hide();
    //     }
    // });
}



// form element customize
function customizeForm ()
{
    // 미조치알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : 'f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        width : 58,
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        selectedColor : '#009944',
        selectedBorderColor : '#009944'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
        selectedColor : '#ffb230',
        selectedBorderColor : '#ffb230'
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
        selectedColor : '#f47321',
        selectedBorderColor : '#f47321'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );

    $ ( '#notice' ).customizeCheckbox ( checkOption1 );
    $ ( '#error' ).customizeCheckbox ( checkOption2 );
    $ ( '#warning' ).customizeCheckbox ( checkOption3 );
    $ ( '#fault' ).customizeCheckbox ( checkOption4 );

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );

    var $imageType = $('.image_type').customizeRadio({
        backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
        width: 13,
        height  : 13
    });
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.al_list_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );

    $ ( '.scr_smr' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// init highcharts
function initHighcharts ()
{
    // 그래프1
    $ ( '#graph01' ).highcharts ( {
        chart : {
            height : 313,
            marginTop : 20
        },

        legend : {
            itemStyle : {
                color : '#3c3c3c',
                fontWeight : 'normal'
            }
        },

        title : {
            text : '',
            style : {
                display : 'none'
            }
        },

        subtitle : {
            text : '',
            style : {
                display : 'none'
            }
        },
        exporting : {
            enabled : false
        },
        credits : {
            enabled : false
        },
        xAxis : {
            categories : [ '01-30', '01-31', '02-01', '02-02', '02-03', '02-04', '02-05', '02-06', '02-07' ],
            crosshair : true
        },
        yAxis : [ {
            min : 0,
            title : {
                text : '충./ 방전량(kWh)'
            }
        },  {
            min : 0,
            opposite : true,
            title : {
                text : 'SOC (%)'
            }
        } ],
        plotOptions : {
            column : {
                pointPadding : 0,
                borderWidth : 0
            },
            line : {
                marker : {
                    enabled : false
                }
            }
        },
        series : [ {
            type : 'column',
            yAxis : 0,
            color : '#ff781e',
            name : '충전량',
            data : [ 400, 450, 500, 475, 425, 400, 430, 460, 490 ]
        }, {
            type : 'column',
            yAxis : 0,
            color : '#a9aeb6',
            name : '방전량',
            data : [ 390, 440, 490, 465, 415, 390, 420, 450, 480 ]

        }, {
            type : 'line',
            yAxis : 0,
            color : '#4bc5c3',
            name : 'SOC',
            data : [ 40, 45, 50, 47, 42, 40, 43, 46, 49 ]

        } ]
    } );

}

function showPopup() {
    $('.btn_popup').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}

function vTicker() {
	$('.alm_details').vTicker('init', {speed: 1500,
    pause: 3000,
    showItems: 1
	});
}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    initHighcharts ();
	showPopup();
	// vTicker();
    moreAction();
} );