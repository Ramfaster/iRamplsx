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
                text: '량(kWh)'
            }
		},{
           min: 0,
            opposite: true,
            title: {
            text: '효율(%)'
            }
		}],
		plotOptions: {
            column: {
                pointPadding: 0.1,
                borderWidth: 0
            },
            line : {
                marker : {
                    enabled : false
                }
            }
        },
        series: [{
			type: 'column',
			yAxis: 0,
			color: '#7b819b',
			name: 'SOH 목표',
			data: [280, 310, 380, 320, 410, 500, 580, 580, 505, 500, 420, 380, 340, 350]
		},{
			type: 'column',
			yAxis: 0,
			color: '#a6a6a6',
			name: 'SOH전년 실적',
			data: [260, 360, 360, 390, 380, 480, 530, 530, 470, 405, 400, 360, 320, 320]
		},{
			type: 'column',
			yAxis: 0,
			color: '#ff702a',
			name: 'SOH실적',
			data: [310, 310, 380, 460, 445, 580, 650, 630, 500, 480, 420, 360, 380, 380]
		 }]
    });
}

// jqgrid start
//헤더 병합
function addGroupHeader() {
    var groupHeaderName = 'User';
    $("#gridList").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders:[
			{startColumnName: 'goal', numberOfColumns: 3, titleText: 'SOH (%)'},
			{startColumnName: 'goal2', numberOfColumns: 2, titleText: 'GAP (%)'}
        ]
    });
}

function dataInitialize() {
    var data = [];
    var length = 15;
    var temp = null;

    for(var i=0 ; i<length ; i++) {
        temp = {
			'no': (i+1),
			'date': '2016-02-1'+(i+1),
			'goal': '99.5',
            'last': '99.5',
            'perf': '99.5',
			'goal2': '(<i class="icon_down"></i>)5.0',
			'last2': '(<i class="icon_up"></i>)2.0',
			'gap' : '2.5'
		};

        data.push(temp);
    }

    return data;
}

function addDataToJqGrid(data) {
    var $gridList = $('#gridList');
    for(var i=0, length=data.length ; i<length ; i++) {
        $gridList.jqGrid('addRowData', i+1, data[i]);
    }
}

function jqGridBasic() {
    $('#gridList').jqGrid({
        //url : 'http://localhost:8080/HOMS/sample/json.do',
        datatype: 'locale',
        loadonce : true,
        height : 179,
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

        colNames : [ "No", "일", "목표", "전년", "실적", "목표", "전년"],

		colModel : [ {
			name : 'no',
			index : 'No',
			align : 'center',
			width: '45'
		}, {
			name : 'date',
			index : '일',
			align : 'center',
			width: '226'
		}, {
			name : 'goal',
			index : '목표',
			align : 'right',
			width: '264'
		 }, {
            name : 'last',
            index : '전년',
            align : 'right',
            width: '263'
         }, {
            name : 'last',
            index : '실적',
            align : 'right',
            width: '264'
         }, {
			name : 'goal2',
			index : '목표',
			align : 'right',
			width: '263'
		 }, {
			name : 'last2',
			index : '전년',
			align : 'right',
			width: '264'
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
	addGroupHeader();
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