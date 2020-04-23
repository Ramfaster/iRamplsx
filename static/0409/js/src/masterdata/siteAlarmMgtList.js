// form element customize
function customizeForm ()
{
	// 설비 구분
	var $dateType1 = $ ( '#sel_type0' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
    } );


	var $dateType1 = $ ( '#sel_type1' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
    } );

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
    /*
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
	*/
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

// jqgrid start

function dataInitialize() {
        var data = [];
        var length = 30;
        var temp = null;

        for(var i=0 ; i<length ; i++) {
            temp = {
                'no': (i+1),
                'time01': 'PV001#IVT0001_ALM_MMT',
				'time02': 'ACB close',
                'time21': 'PV 활용',
                'time03': '접속반',
				'name': '<i class="icon_fault02"></i> <span class="t_red">Fault</span><!--<span class="t_orange">Warning</span> <span class="t_yellow">Error</span> <span class="t_green">Notice</span>-->',
                'grade': '운영자 원인 확인',
                'alm01': '태양전지 과전압',
				'alm02': '관리자, 실무자',
                'alm03': '실무자'
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
			height : 580,
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

			colNames : [ "No", "태그명", "알람명","정보 유형", "설비 구문", "등급", "조치가이드", "알람 설명", "메일 전송 대상자", "SMS 전송 대상자"],

			colModel : [ {
				name : 'no',
				index : 'No.',
				align : 'center',
				width: '50'
			}, {
				name : 'time01',
				index : '태그명',
				align : 'left',
				width: '230'
			}, {
				name : 'time02',
				index : '알람명',
				align : 'center',
				width: '230'
			 }, {
				name : 'time21',
				index : '정보 유형',
				align : 'center',
				width: '110'
			 }, {
				name : 'time03',
				index : '설비 구문',
				align : 'center',
				width: '110'
			 }, {
				name : 'name',
				index : '등급',
				align : 'center',
				width: '110'
			 }, {
				name : 'grade',
				index : '조치가이드',
				align : 'left',
				width: '230'
			 }, {
				name : 'alm01',
				index : '알람 설명',
				align : 'left',
				width: '210'
			}, {
				name : 'alm02',
				index : '메일 전송 대상자',
				align : 'center',
				width: '150'
			}, {
				name : 'alm03',
				index : 'SMS 전송 대상자',
				align : 'center',
				width: '144'
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
    initDatetimepicker ();
	customizeJqgrid ();
} );