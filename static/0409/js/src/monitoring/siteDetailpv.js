// more btn action
function moreAction(){

    var moreBox = $('.more_detail_box');
    var btnMore = $('.btn_more');

    btnMore.on('click', function(e){
        var target = $(e.currentTarget);

        moreBox.toggleClass('on');

        if(moreBox.hasClass('on')){

            function moreBoxFix(){
                var moreBoxHeight = moreBox.outerHeight();
                alert(moreBoxHeight);
                var moreBoxPos = moreBoxHeight / 2;
                moreBox.css('margin-top','-'+ moreBoxPos + 'px');
            }

            moreBox.show();

        } else {
            moreBox.hide();
        }

        e.preventDefault();
    });



    // $('.btn_more').click(function(){
    //     moreBox.toggle();
    //
    // })

    $('.more_detail_box .btn_close').click(function(){
        moreBox.removeClass('on');
        moreBox.hide();
    })
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

    // $ ( '#notice' ).customizeCheckbox ( checkOption1 );
    // $ ( '#error' ).customizeCheckbox ( checkOption2 );
    // $ ( '#warning' ).customizeCheckbox ( checkOption3 );
    // $ ( '#fault' ).customizeCheckbox ( checkOption4 );

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );
}

// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    $ ( '.yyyy' ).datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : 'ko',
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymm' ).datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : 'ko',
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : 'ko',
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#date_type' );
    $dateType.change ( function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === 'day' )
        {
            className = 'yyyymmdd';
        } else if ( selectedType === 'month' )
        {
            className = 'yyyymm';
        } else if ( selectedType === 'year' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
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
            height : 325,
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
                text : '발전량(kWh)'
            }
        }, {
            min : 0,
            opposite : true,
            title : {
                text : '가동률, 성능비(%)'
            }
        }, {
            min : 0,
            opposite : true,
            title : {
                text : '일사량(kWh/m²/d)'
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
            color : '#a9aeb6',
            name : '목표 발전량',
            data : [ 400, 450, 500, 475, 425, 400, 430, 460, 490 ]
        }, {
            type : 'column',
            yAxis : 0,
            color : '#e0dcd8',
            name : '전년도 발전량',
            data : [ 390, 440, 490, 465, 415, 390, 420, 450, 480 ]

        }, {
            type : 'column',
            yAxis : 0,
            color : '#ff881e',
            name : '실적 발전량',
            data : [ 400, 450, 500, 475, 425, 400, 430, 460, 490 ]

        }, {
            type : 'line',
            yAxis : 0,
            color : '#4bc5c3',
            name : '성능비',
            data : [ 40, 45, 50, 47, 42, 40, 43, 46, 49 ]

        }, {
            type : 'line',
            yAxis : 0,
            color : '#215da6',
            name : '가동률',
            data : [ 45, 50, 55, 52, 47, 45, 48, 51, 54 ]

        }, {
            type : 'line',
            dashStyle : 'shortdot',
            yAxis : 0,
            color : '#ffb230',
            name : '일사량',
            data : [ 375, 425, 475, 450, 400, 375, 405, 435, 465 ]

        } ]
    } );

    // 그래프2
    $ ( '#graph02' ).highcharts ( {
        chart : {
            height : 235,
            marginTop : 40,
            marginBottom : 45
        },

        legend : {
            padding : -15,
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
            categories : [ '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020' ],
            crosshair : true
        },
        yAxis : [ {
            min : 0,
            title : {
                text : '발전량(kWh)'
            }
        }, {
            min : 0,
            opposite : true,
            title : {
                text : '가동률, 성능비/(%)'
            }
        } ],
        plotOptions : {
            line : {
                marker : {
                    enabled : false
                }
            },
			area : {
                marker : {
                    enabled : false
                }
            }
        },
        series : [ {
			type : 'line',
			dashStyle: 'shortdot',
            yAxis : 0,
            color : '#b6b6b6',
            name : '목표 발전량',
            data : [ 10, 280, 480, 680, 800, 850, 900, 910, 920, 920 ]
        }, {
            type : 'line',
            yAxis : 0,
            color : '#ff881e',
            name : '실적 발전량',
            data : [ 5, 300, 500, 700, 850 ]
        }, {
			type : 'line',
			dashStyle: 'shortdot',
            yAxis : 0,
            color : '#7789a7',
            name : '목표 성능비',
            data : [ 100, 310, 610, 770, 870, 920, 950, 970, 980, 980 ]
        }, {
            type : 'line',
            yAxis : 0,
            color : '#215da6',
            name : '성능비',
            data : [ 910, 880, 870, 860, 850 ]
        }, {
            type : 'line',
            yAxis : 0,
            color : '#a7bcaa',
            name : '목표가동률',
            data : [ 970, 890, 770, 790, 790, 800, 810, 820, 830, 870 ]
        }, {
			type : 'line',
            yAxis : 0,
            color : '#4bc5c3',
            name : '가동률',
            data : [ 950, 930, 900, 870, 850 ]
        }, {
            type : 'area',
            yAxis : 0,
            color : '#fdece9',
            name : '손익분기점',
            data : [ 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000 ]
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
    initDatetimepicker ();
    customizeScroll ();
    initHighcharts ();
	showPopup();
	// vTicker();
    moreAction();
} );