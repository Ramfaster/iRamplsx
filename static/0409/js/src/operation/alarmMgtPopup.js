// form element customize
function customizeForm ()
{
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

// scroll customize
function customizeScroll ()
{    
	// custom scroll
    $ ( '.pv_con02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true			
        },
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
	initDatetimepicker ();
	customizeScroll ();
	customizeForm ();
	initHighcharts ();
} );