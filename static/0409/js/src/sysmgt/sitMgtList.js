// form element customize
function customizeForm ()
{
   var $imageType = $('.image_type').customizeCheckbox({
		backgroundImage: '../../css/lib/customizeForm/img/img_checkbox.png',
		backgroundImage2x: '../../css/lib/customizeForm/img/img_checkbox@2x.png',
		width: 13,
		height	: 13
	});

	// 검색 조건
    var $dateType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select03',
		focusClass : 'custom-form-focused03'
    } );
}

// jqgrid start

function dataInitialize() {
	var data = [];
	var length = 30;
	var temp = null;

	for(var i=0 ; i<length ; i++) {
		temp = {
			'no': (i+1),
			'elc1': '',
			'elc2': '',
			'elc3': '',
			'elc4': '',
			'elc5': '',
			'elc6': '',
			'elc7': '',
			'elc8': '',
			'elc9': '',
			'elc10': ''
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
		height: '642',
		autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
		shrinkToFit : false, // 컬럼너비 자동 지정
		// :default:false

		rowNum : 30,
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

		colNames : [ "No.", "국가", "특수목적 법인", "서비스 상태", "발전소 명", "설치 용량(kWp)", "사업구분", "한화에너지직영 여부", "발전매출감산비율", "방전량 감산 비율", "상업 개시일"],

		colModel : [ {
			name : 'no',
			index : '',
			align : 'center',
			width: '40'
		}, {
			name : 'elc1',
			index : '',
			align : 'left',
			width: '120'
		}, {
			name : 'elc2',
			index : '',
			align : 'left',
			width: '199'
		 }, {
			name : 'elc3',
			index : '',
			align : 'center',
			width: '80'
		 }, {
			name : 'elc4',
			index : '',
			align : 'center',
			width: '200'
		 }, {
			name : 'elc5',
			index : '',
			align : 'center',
			width: '180'
		}, {
			name : 'elc6',
			index : '',
			align : 'center',
			width: '150'
		} , {
			name : 'elc7',
			index : '',
			align : 'center',
			width: '150'
		} , {
			name : 'elc8',
			index : '',
			align : 'center',
			width: '150'
		} , {
			name : 'elc9',
			index : '',
			align : 'center',
			width: '150'
		} , {
			name : 'elc10',
			index : '',
			align : 'center',
			width: '150'
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

$ ( function ()
{
    customizeForm ();
	customizeJqgrid ();
} );