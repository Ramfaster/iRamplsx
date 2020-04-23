// form element customize
function download_toggle() {
	$('.down_item').click(function(){
		$(this).parents('tr').next('.download_box').toggle();
	})

	$('.btn_close').click(function(){
		$(this).parents('tr.download_box').hide();
	})
}


function customizeForm ()
{
    var $imageType = $('.image_type').customizeRadio({
	    backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
		width: 13,
		height	: 13
	});

	var $dateType = $ ( '.sel_type' ).customizeSelect ( {
        width : 370,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select09',
		focusClass : 'custom-form-focused09',
		disableClass : 'custom-form-disabled09'
    } );

    var $dateType2 = $ ( '.customize_select_m'  ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    });

    var $dateType3 = $ ( '.customize_select_s').customizeSelect ( {
        width : 55,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select10',
        focusClass : 'custom-form-focused10',
        disableClass : 'custom-form-disabled10'
    });

    var $dateType = $ ( '#sel_type1' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
    } );

	var $searchType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select03',
		focusClass : 'custom-form-focused03',
		disableClass : 'custom-form-disabled03'
    } );

    $('#file1, #file7').customizeFile({
            buttonType: 'bg_sprite',
            buttonText: '찾기',
            buttonSpriteClass: 'btn_type05',
            buttonTextColor: '#4c4743',
            buttonWidth: 50,
            textWidth: 280,
            height: 25
    });

    $('#file2, #file3, #file4, #file5, #file6').customizeFile({
            buttonType: 'bg_sprite',
            buttonText: '찾기',
            buttonSpriteClass: 'btn_type05',
            buttonTextColor: '#4c4743',
            buttonWidth: 50,
            textWidth: 230,
            height: 25
    });
}

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
    $ ( '.form_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// jqgrid start

function dataInitialize() {
	var data = [];
	var length = 30;
	var temp = null;

	for(var i=0 ; i<length ; i++) {
		temp = {
			'tag1': '일사량 변환',
			'tag2': '((2000-0)/',
			'tag3': '기상반 일사량 센서 변환'
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
		height: '',
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
		scroll: false, // set the scroll property to 1 to enable paging with scrollbar - virtual loading of records
		emptyrecords: 'Scroll to bottom to retrieve new page', // the message will be displayed at the bottom

		//pager: '#samplePager',

		colNames : [ "수식명", "수식", "설명"],

		colModel : [ {
			name : 'tag1',
			index : '',
			align : 'center',
			width: '200'
		}, {
			name : 'tag2',
			index : '',
			align : 'center',
			width: '250'
		 }, {
			name : 'tag3',
			index : '',
			align : 'center',
			width: '254'
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

	// $('div.ui-jqgrid-bdiv').perfectScrollbar();
}
//jqgrid end

$ ( function ()
{
    customizeForm ();
	customizeScroll ();
	customizeJqgrid ();
	download_toggle();
	initDatetimepicker();
} );