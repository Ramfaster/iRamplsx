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
		//	'no': (i+1),
			'program_name_kr': '메뉴연관정보관리',
			'program_url': '/system/auth/MenuRelateList.jsp',
			'prod_type': '-',
			'exp': '사업 설명'
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

		multiselect : true, // multi-select checkboxes appear
		multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
		// time

		page: 1,
		scroll: true, // set the scroll property to 1 to enable paging with scrollbar - virtual loading of records
		emptyrecords: 'Scroll to bottom to retrieve new page', // the message will be displayed at the bottom

		//pager: '#samplePager',

		colNames : [ /*"No.",*/ "프로그램 한글명", "프로그램 URL", "사업 구분", "설명"],

		colModel : [ {
		//	name : 'no',
		//	index : 'No.',
		//	align : 'center',
		//	width: '80'
	//	}, {
			name : 'program_name_kr',
			index : '프로그램 한글명',
			align : 'left',
			width: '305'
		}, {
			name : 'program_url',
			index : '프로그램 URL',
			align : 'left',
			width: '405'
		 }, {
			name : 'prod_type',
			index : '사업 구분',
			align : 'center',
			width: '200'
		 }, {
			name : 'exp',
			index : '설명',
			align : 'left',
			width: '659'
		 }],

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