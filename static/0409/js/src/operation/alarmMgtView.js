// form element customize
function customizeForm ()
{
	// 검색 조건
    var $dateType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select03',
		focusClass : 'custom-form-focused03'
    } );

    // 알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : 'f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        width : 58,
		selectedColor : '#009944',
        selectedBorderColor : '#009944'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
		width : 58,
        selectedColor : '#ffb230',
        selectedBorderColor : '#ffb230'
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
		width : 58,
        selectedColor : '#f47321',
        selectedBorderColor : '#f47321'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
		width : 58,
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );
	 var checkOption5 = $.extend ( {}, defaultOption, {
		width : 118,
        selectedColor : '#c3a279',
        selectedBorderColor : '#c3a279'
    } );

    $ ( '#notice' ).customizeCheckbox ( checkOption1 );
    $ ( '#error' ).customizeCheckbox ( checkOption2 );
    $ ( '#warning' ).customizeCheckbox ( checkOption3 );
    $ ( '#fault' ).customizeCheckbox ( checkOption4 );
	$ ( '#system, #equipment' ).customizeCheckbox ( checkOption5 );

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );

	// 알람 상세
    var $dateType = $ ( '#warning_type' ).customizeSelect ( {
        width : 130,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select02',
		focusClass : 'custom-form-focused02'
    } );

	// 고장 원인
    var $dateType = $ ( '#warning02_type' ).customizeSelect ( {
        width : 90,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select04',
		focusClass : 'custom-form-focused04'
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

	$('.yyyymmddhh').datetimepicker({
		format: 'yyyy-mm-dd hh:00',
		startView: 2,
		minView: 1,
		language: 'ko',
		pickerPosition: "bottom-right",
		autoclose: true,
		todayHighlight: true,
		todayBtn: true
	} );

	$('.yyyymmddhhmi').datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		startView: 2,
		minView: 0,
		language: 'ko',
		pickerPosition: "bottom-right",
		autoclose: true,
		minuteStep: 2,
		todayHighlight: true,
		todayBtn: true
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
    $ ( '.tree_wrap, .pv_con02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
		axis: 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

	 $ ( '.tbl_list_wrap04' ).mCustomScrollbar ( {
		scrollButtons : {
			enable : true
		},
		theme : 'inset-2',
		scrollbarPosition : 'inside',
		scrollInertia : 300
	} );
}

// treemenu customize
function customizeTree ()
{
    //트리메뉴
	var setting = {
        view: {
            showIcon: false
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        }
    };

    var zNodes =[
        { id:1, pId:0, name:'VCB', open:true},
        { id:11, pId:1, name:'ACB', open:false},
        { id:111, pId:11, name:'ACB01'},
        { id:112, pId:11, name:'ACB02'},
        { id:12, pId:1, name:'Inverter', open:true},
        { id:121, pId:12, name:'Inverter01'},
        { id:122, pId:12, name:'Inverter02'},
		{ id:123, pId:12, name:'Inverter03'},
		{ id:124, pId:12, name:'Inverter04'},
		{ id:125, pId:12, name:'Inverter05'},
		{ id:126, pId:12, name:'Inverter06'},
		{ id:127, pId:12, name:'Inverter07'},
		{ id:128, pId:12, name:'Inverter08'},
		{ id:129, pId:12, name:'Inverter09'},
		{ id:130, pId:12, name:'Inverter10'},
		{ id:131, pId:12, name:'Inverter11'},
		{ id:132, pId:12, name:'Inverter12'},
		{ id:133, pId:12, name:'Inverter13'},
		{ id:134, pId:12, name:'Inverter14'},
		{ id:135, pId:12, name:'Inverter15'},
		{ id:136, pId:12, name:'Inverter16'},
		{ id:137, pId:12, name:'Inverter17'},
		{ id:138, pId:12, name:'Inverter18'},
		{ id:139, pId:12, name:'Inverter19'},

        { id:13, pId:1, name:'Junction Box', open:true},
        { id:131, pId:13, name:'Junction Box01'},
        { id:132, pId:13, name:'Junction Box02'},
		{ id:133, pId:13, name:'Junction Box03 Junction Box03 Junction Box03'},
		{ id:14, pId:1, name:'Module', open:false},
        { id:141, pId:14, name:'Module01'},
        { id:142, pId:14, name:'Module02'}
    ];

    $.fn.zTree.init($('#treeList'), setting, zNodes);
}

// init highcharts
function initHighcharts ()
{
    //그래프
    $('#graph01').highcharts({
		 chart: {
            marginTop: 30,
			height : 390
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
                '09:00',
                '10:00',
				'11:00',
				'12:00',
				'13:00',
				'14:00',
				'15:00',
				'16:00'
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
            color: '#ed6c44',
            name: '전압',
            data: [300, 420, 400, 460, 390, 410, 380, 320]
        }]
    });
}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    customizeTree ();
	initHighcharts ();
} );