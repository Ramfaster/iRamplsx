// form element customize
function customizeForm ()
{
	var $selType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
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

	$ ( '.frm_con01 .frm_cont_wrap, .tbl_add_wrap' ).mCustomScrollbar ( {
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
            enable: true,
			chkStyle: 'checkbox',
            radioType: 'all'
        },
        data: {
            simpleData: {
                enable: true
            }
        }
    };

    var zNodes =[
        { id:1, pId:0, name:'수배전반', open:true},
        { id:11, pId:1, name:'VCB #1', open:false},
        { id:111, pId:11, name:'VCB01'},
        { id:112, pId:11, name:'VCB02'},
        { id:12, pId:1, name:'VCB #2', open:false},
        { id:121, pId:12, name:'VCB01'},
        { id:122, pId:12, name:'VCB02'},		
		{ id:2, pId:0, name:'인버터', open:true},		
		{ id:21, pId:2, name:'IVT #1', open:true},
        { id:211, pId:21, name:'접속반 #1', open:true},
        { id:212, pId:211, name:'모듈 #1'},
		{ id:213, pId:211, name:'모듈 #2'},
		{ id:214, pId:211, name:'모듈 #3'},
		{ id:215, pId:211, name:'모듈 #4'},
		{ id:216, pId:211, name:'모듈 #5'},
		{ id:217, pId:211, name:'모듈 #6'},
		{ id:218, pId:211, name:'모듈 #6_1'},
		{ id:22, pId:2, name:'IVT #2', open:true},
		{ id:221, pId:22, name:'접속반 #1'},
		{ id:222, pId:22, name:'접속반 #2'},
		{ id:223, pId:22, name:'접속반 #3'},
		{ id:224, pId:22, name:'접속반 #4'},
		{ id:225, pId:22, name:'접속반 #5'},
		{ id:226, pId:22, name:'접속반 #6'},
		{ id:227, pId:22, name:'접속반 #7'},  
		{ id:23, pId:2, name:'IVT #3', open:true},
        { id:231, pId:23, name:'접속반 #1', open:true},
		{ id:232, pId:23, name:'접속반 #2'},
		{ id:233, pId:23, name:'접속반 #3'},
		{ id:234, pId:23, name:'접속반 #4'},
		{ id:235, pId:23, name:'접속반 #5'},
		{ id:236, pId:23, name:'접속반 #6'},
		{ id:237, pId:23, name:'접속반 #7'},
		{ id:238, pId:23, name:'접속반 #8'},
		{ id:239, pId:23, name:'접속반 #9'},
		{ id:240, pId:23, name:'접속반 #10'},
		{ id:241, pId:23, name:'접속반 #11'},
		{ id:242, pId:23, name:'접속반 #12'},
		{ id:243, pId:23, name:'접속반 #13'},
		{ id:244, pId:23, name:'접속반 #14접속반 #14접속반 #14접속반 #14접속반 #14'},
		{ id:3, pId:0, name:'UPS'}
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
            'name_pw': '강북아리수 정수센터',
            'work_type': '점검',
            'work_rotation': '일간',
            'date_plan': '2016-02-12 06:50',
            'date_result': '2016-02-12 06:50',
            'reg_result': '<a href="javascript:;" class="btn_jqgrid">미등록</a>'
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
        height: '622',
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
        
        colNames : [ "NO.", "발전소명", "업무구분", "업무주기", "계획등록일", "결과등록일", "결과등록"],

        colModel : [ {      
            name : 'no',
            index : 'NO',
            align : 'center',
            width: '41'
        }, {
            name : 'name_pw',
            index : '발전소명',
            align : 'center',
            width: '360'
        }, {
            name : 'work_type',
            index : '업무구분',
            align : 'center',
            width: '132'
        }, {
            name : 'work_rotation',
            index : '업무주기',
            align : 'center',
            width: '132'
        }, {
            name : 'date_plan',
            index : '계획등록일',
            align : 'center',
            width: '212'            
        }, {
            name : 'date_result',
            index : '결과등록일',
            align : 'center',
            width: '212'
        }, {
            name : 'reg_result',
            index : '결과등록',
            align : 'center',
            width: '160'                
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

function showPopup() {
    $('.btn_popup').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}


$ ( function ()
{
    customizeForm ();  
	initDatetimepicker ();
    customizeTree ();
	customizeScroll ();
    showPopup();
    customizeJqgrid ();
} );