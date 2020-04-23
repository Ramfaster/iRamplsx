// form element customize
function customizeForm ()
{
	// 설비 구분
	var $dateType1 = $ ( '#sel_type0, #sel_type1,.customize_select'  ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $dateType2 = $ ( '.customize_select2').customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
    } );

    var $selType3 = $ ( '.select_s' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

    var $selType3 = $ ( '.select_m' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select13'
    } );

	// 검색 조건
    var $dateType = $ ( '#searchKey' ).customizeSelect ( {
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
			'num': (i+1),
			'name_pp': '서남 아리수 D 태양광 발전 시스템',
            'name_dvc':'VCB#1',
            'tag':'PV001#VCB0001_VAL_FORML_PR',
            'tag_name':'VCB#1 기간 발전량',
            'tag_type':'SQL 결합',
            'tag_unit':'VAL',
            'sms_realtime':'<select class="select_m"><option>발송</option><option>미발송</option></select>',
            'screen_show':'<select class="select_s"><option>사용</option><option>미사용</option></select>',
            'rep_val_appoint':'<select class="select_s"><option>사용</option><option>미사용</option></select>',
            'tag_exp':'<input type="text" class="ds_fm_ipt" value="설명..">'
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
        height : 575,
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

        colNames : [ "", "사이트 명", "설비명", "태그", "태그 명", "태그 유형", "태그 단위", "실시간 SMS 발송 알람", "화면 표출 여부", "대표 값 지정 여부", "태그 설명"],

		colModel : [ {
            name : 'num',
            index : '순서',
            align : 'center',
            width: '30'
        }, {
            name : 'name_pp',
            index : '사이트 명',
            align : 'left',
            width: '260'
        },{
            name : 'name_dvc',
            index : '설비명',
            align : 'center',
            width: '100'
        },{
            name : 'tag',
            index : '태그',
            align : 'left',
            width: '250'
        },{
            name : 'tag_name',
            index : '태그 명',
            align : 'left',
            width: '150'
        },{
            name : 'tag_type',
            index : '태그 유형',
            align : 'center',
            width: '110'
        },{
            name : 'tag_unit',
            index : '태그 단위',
            align : 'center',
            width: '110'
        },{
            name : 'sms_realtime',
            index : '실시간 SMS 발송 알람',
            align : 'left',
            width: '150'
        },{
            name : 'screen_show',
            index : '화면 표출 여부',
            align : 'left',
            width: '120'
        },{
            name : 'rep_val_appoint',
            index : '대표 값 지정 여부',
            align : 'left',
            width: '120'
        },{
            name : 'tag_exp',
            index : '태그 설명',
            align : 'left',
            width: '169'
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

function showPopup() {
    $('.btn_popup').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}

$ ( function ()
{
	customizeJqgrid ();
    customizeForm ();
} );