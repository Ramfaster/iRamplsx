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
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
		axis: 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
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

// jqgrid start

function dataInitialize() {
        var data = [];
        var length = 30;
        var temp = null;

        for(var i=0 ; i<length ; i++) {
            temp = {
                'no': (i+1),
                'time01': 'YYYY-MM-DD  hh:mms',
				'time02': 'YYYY-MM-DD  hh:mm',
                'time03': 'YYYY-MM-DD  hh:mm',
                'time04': 'YYYY-MM-DD  hh:mm',
				'name': 'LV2-2 KPAM',
                'grade': '<i class="icon_fault02"></i> <span class="t_red">Fault</span><!--<span class="t_orange">Warning</span> <span class="t_yellow">Error</span> <span class="t_green">Notice</span>-->',
                'alm01': 'Alarm Equpment',
				'alm02': '설비에 문제가 발생하여 가동을 멈추었습니다.',
                'alm03': '<a href="javascript:;" class="btn_cfrm link"><i class="icon_check"></i>확인</a><!--<a href="javascript:;" class="btn_cfrm link selected"><i class="icon_check"></i>확인</a>-->',
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
			height : 632,
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

			colNames : [ "No", "발생시간", "확인시간", "해제시간", "종료시간", "설비명", "등급", "알람 유형", "알람 설명", "알람확인"],

			colModel : [ {
				name : 'no',
				index : 'No.',
				align : 'center',
				width: '40'
			}, {
				name : 'time01',
				index : '발생시간',
				align : 'center',
				width: '135'
			}, {
				name : 'time02',
				index : '확인시간',
				align : 'center',
				width: '135'
			 }, {
                name : 'time03',
                index : '해제시간',
                align : 'center',
                width: '135'
             }, {
                name : 'time04',
                index : '종료시간',
                align : 'center',
                width: '135'
             }, {
				name : 'name',
				index : '설비명',
				align : 'center',
				width: '120'
			 }, {
				name : 'grade',
				index : '등급',
				align : 'center',
				width: '70'
			 }, {
				name : 'alm01',
				index : '알람 유형',
				align : 'center',
				width: '115'
			}, {
				name : 'alm02',
				index : '알람 설명',
				align : 'center',
				width: '269'
			}, {
				name : 'alm03',
				index : '알람확인',
				align : 'center',
				width: '80'
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
    customizeScroll ();
    customizeTree ();
	customizeJqgrid ();
} );