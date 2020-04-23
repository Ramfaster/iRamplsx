// form element customize
function customizeForm ()
{
	var $imageType = $('.image_type1').customizeRadio({
	    backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
		width: 13,
		height	: 13
	});

	var $selType = $ ( '#sel_type, #sel_type1' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
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
                '01-30',
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
				'02-10'
            ],
            crosshair: true
        },
        yAxis: [{
            min: 0,
            opposite : true,
            title: {
                text: '금액(원)'
            }
        }],
		plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0,
				stacking: 'normal'
            }
        },
        series: [{
			type: 'column',
			yAxis: 0,
			color: '#6c738f',
			name: '기본요금할인',
			data: [28, 31, 38, 32, 41, 50, 58, 58, 55, 50, 42, 38]
		},{
			type: 'column',
			yAxis: 0,
			color: '#3893cd',
			name: '충전요금할인',
			data: [26, 36, 36, 39, 38, 48, 53, 53, 47, 45, 40, 36]
		},{
			type: 'column',
			yAxis: 0,
			color: '#ff743d',
			name: '부하이동',
			data: [29, 29, 34, 45, 44, 58, 65, 63, 53, 48, 48, 48]
		},{
			type: 'column',
			yAxis: 0,
			color: '#ababab',
			name: '부가가치세',
			data: [29, 29, 34, 45, 44, 58, 65, 63, 53, 48, 48, 48]
		},{
			type: 'column',
			yAxis: 0,
			color: '#4ac4c5',
			name: '전력산업기반기금',
			data: [29, 29, 34, 45, 44, 58, 65, 63, 53, 48, 48, 48]
		}]
    });
}

// jqgrid start
function dataInitialize() {
   var data = [];
    var length = 15;
    var temp = null;

    for(var i=0 ; i<length ; i++) {
        temp = {
			'no': (i+1),
			'an2': '2016-02-12',
			'an3': '300',
			'an4': '400',
			'an5': '500',
			'an6': '600',
			'an7': '700',
			'an8': '800'
		};

        data.push(temp);
    }

    return data;
}

function addDataToJqGrid(data) {
    var $gridList2 = $('#gridList');
    for(var i=0, length=data.length ; i<length ; i++) {
        $gridList2.jqGrid('addRowData', i+1, data[i]);
    }
}

function jqGridBasic() {
	$('#gridList').jqGrid({
        //url : 'http://localhost:8080/HOMS/sample/json.do',
        datatype: 'locale',
        loadonce : true,
        height : 204,
        autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
        shrinkToFit : false, // 컬럼너비 자동 지정
        // :default:false

        rowNum : 10,
        //rowList : [ 10, 20 ],

        //mtype : "POST",
        // mtype : "GET",
        //postData : { /* 그리드 리스트 호출시 파라미터 값 전달 */
        //},

        //caption : 'jqGrid Sample Table', //title

        sortname : "No", // 처음 정렬될 컬럼
        sortorder : "asc", // 정렬방법 (asc/desc)

        //styleUI : 'Bootstrap',
        //datatype : "json",

        multiselect : false, // multi-select checkboxes appear
        multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
        // time

        page: 1,
        scroll: true, // set the scroll property to 1 to enable paging with scrollbar - virtual loading of records
        emptyrecords: 'Scroll to bottom to retrieve new page', // the message will be displayed at the bottom

        //pager: '#samplePager',

        colNames : [ "NO.", "일", "기본요금 할인(원)", "충전요금 할인(원)", "부하 이동(원)", "부가가치세(원)", "전력산업기반기금(원)", "합계(원)"],

		colModel : [ {
			name : 'no',
			index : '순번',
			align : 'center',
			width: '47'
		}, {
			name : 'an2',
			index : '',
			align : 'center',
			width: '226'
		}, {
			name : 'an3',
			index : '',
			align : 'right',
			width: '219'
		 }, {
			name : 'an4',
			index : '',
			align : 'right',
			width: '219'
		 }, {
			name : 'an5',
			index : '',
			align : 'right',
			width: '219'
		 }, {
			name : 'an6',
			index : '',
			align : 'right',
			width: '218'
		 }, {
			name : 'an7',
			index : '',
			align : 'right',
			width: '219'
		 }, {
			name : 'an8',
			index : '',
			align : 'right',
			width: '217'
		 } ],

		loadError : function ( xhr, st, err )
		{
			// alert("err-->" + err);
			console.log ( ">>>>> loadError " );
			console.log ( err );
		},

		loadComplete : function ( xhr, data )
		{
			console.log ( ">>>>> loadComplete " );

		},

		beforeSelectRow : function ( rowid, e )
		{
			console.log('>>>>> beforeSelectRow');
			return true;
		},

		// Row 선택시
		onSelectRow : function ( rowId, status )
		{
			console.log('>>>>> onSelectRow');
		},

		onSelectAll : function ( aRowids, status )
		{
			console.log ( ">>>>> onSelectAll" );

		},

		// paging 부분의 버튼 액션 처리 first, prev, next, last, records ex) if(action == 'next')
		onPaging : function ( action )
		{
			console.log('>>>>> onPaging');
		},

		gridComplete : function ()
		{
			console.log ( ">>>>> gridComplete " );
		},

		loadBeforeSend : function ()
		{
			console.log('loadBeforeSend');
		},
		viewrecords : false /* 화면 하단에 총 데이터 갯수와 현재 페이지의 데이터가 몇번째 데이터인지 화면에 노출 */
	});
}

// jqgird customize
function customizeJqgrid ()
{
	//jqgrid
    var data = dataInitialize();
    jqGridBasic();
    addDataToJqGrid(data);

    $('div.ui-jqgrid-bdiv').perfectScrollbar();
}
//jqgrid end

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

$ ( function ()
{
	customizeForm ();
    initHighcharts ();
	customizeJqgrid ();
	initDatetimepicker();
} );