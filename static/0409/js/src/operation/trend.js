// form element customize
function customizeForm ()
{
    // 조회기간
    var $dateType = $ ( '#sel_type, #sel_type1, #sel_type02' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select06',
		focusClass : 'custom-form-focused06',
		disableClass : 'custom-form-disabled06'
    } );

    var $dateType = $ ( '.select4' ).customizeSelect ( {
        width : 210,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select12',
        focusClass : 'custom-form-focused12',
        disableClass : 'custom-form-disabled12'
    } );

	//설비 요소 선택
	var $select1 = $('.select3, .select11');
	$select1.select2({
		enableMousewheel: false
	});

	var selectFlag1 = true;
	var selectFlag2 = true;

	//select event
    $('.select3').on('select2:open', function(e){
        if(selectFlag1) {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            selectFlag1 = false;
        }
    });

    $('.select11').on('select2:open', function(e){
        if(selectFlag2) {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            selectFlag2 = false;
        }
    });
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
    $ ( '.add_sel_list' ).mCustomScrollbar ( {
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
    //그래프
    $('#graph1').highcharts({
		 chart: {
            marginTop: 50
        },
        title: {
            text: '',
            style: {
                display: 'none',
            }
        },
        subtitle: {
            text: '',
            style: {
                display: 'none'
            }
        },
        exporting: { enabled: false },
        credits: {
					  enabled: false
				},
        xAxis: {
            categories: [
                '01-20',
                '01-31',
				'02-01',
				'02-02',
				'02-03',
				'02-04',
				'02-05',
				'02-06',
				'02-07',
				'02-08',
				'02-09',
				'02-10',
				'02-11',
				'02-12'
            ],
            crosshair: true
        },
        yAxis: [{
            min: 0,
            title: {
                text: '전압(V)'
            }
        },{
            min: 0,
            opposite: true,
            title: {
                text: '발전량(kWh)'
            }
		},{
            min: 0,
            opposite: true,
            title: {
                text: '전류(A)'
            }
        }],
		plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            },
			line: {
				marker: {
					enabled: false
				}
			}
        },
        series: [{
            type: 'line',
            yAxis: 0,
            color: '#4c4743',
            name: 'ACB 전압',
            data: [60, 65, 61, 60, 61, 51, 58, 50, 55, 61, 65, 69, 65, 60]
		 }, {
			 type: 'line',
            yAxis: 1,
            color: '#ed6c44',
            name: 'ACB 발전량',
            data: [20, 25, 27, 35, 41, 41, 58, 40, 55, 51, 50, 45, 40, 30]
		 }, {
            type: 'line',
            dashStyle: 'shortdot',
            yAxis: 2,
            color: '#4bc5c3',
            name: 'ACB 전압',
            data: [30, 35, 37, 30, 50, 60, 68, 60, 50, 45, 43, 35, 30, 20]
        }]
    });
	//그래프2
	$('#graph2').highcharts({
		 chart: {
            marginTop: 50
        },
        title: {
            text: '',
            style: {
                display: 'none',
            }
        },
        subtitle: {
            text: '',
            style: {
                display: 'none'
            }
        },
        exporting: { enabled: false },
        credits: {
					  enabled: false
				},
        xAxis: {
            categories: [
                '01-20',
                '01-31',
				'02-01',
				'02-02',
				'02-03',
				'02-04',
				'02-05',
				'02-06',
				'02-07',
				'02-08',
				'02-09',
				'02-10',
				'02-11',
				'02-12'
            ],
            crosshair: true
        },
        yAxis: [{
            min: 0,
            title: {
                text: '전압(V)'
            }
        }],
		plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            },
			line: {
				marker: {
					enabled: false
				}
			}
        },
        series: [{
            type: 'line',
            yAxis: 0,
            color: '#4c4743',
            name: 'ACB 전압',
            data: [60, 65, 61, 60, 61, 51, 58, 50, 55, 61, 65, 69, 65, 60]
		 }, {
            type: 'line',
            dashStyle: 'shortdot',
            yAxis: 0,
            color: '#4bc5c3',
            name: 'Inverter 전압',
            data: [30, 35, 37, 30, 50, 60, 68, 60, 50, 45, 43, 35, 30, 20]
        }]
    });
}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    initHighcharts ();
} );