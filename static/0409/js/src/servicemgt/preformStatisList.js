// form element customize
function customizeForm ()
{
	var $selType1 = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select01',
		focusClass : 'custom-form-focused01',
		disableClass : 'custom-form-disabled01'
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
			chkStyle: 'radio',
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
                display: 'none'
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
                '02-10',
                '02-11',
                '02-12',
                '02-13',
                '02-14'
            ],
            crosshair: true
        },
        yAxis: [{
            min: 0,
            title: {
                text: '실적(건수)'
            }
        }],
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            type: 'column',
            yAxis: 0,
            color: '#d0d0d0',
            name: '강북 아리수 계획',
            data: [15, 30, 60, 50, 15, 30, 20, 40, 35, 50, 35, 30, 25, 25, 30, 20]
        },{
            type: 'column',
            yAxis: 0,
            color: '#ed6c44',
            name: '강북 아리수 실적',
            data: [15, 30, 60, 50, 15, 30, 20, 40, 35, 50, 35, 30, 25, 25, 30, 20]
        }]
    });
}

/// jqgrid start
//헤더 병합
function addGroupHeader() {
    var groupHeaderName = 'User';
    $("#gridList").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders:[
            {startColumnName: 'plan', numberOfColumns: 2, titleText: '누계'}
        ]
    });

    $("#gridList2").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders:[
            {startColumnName: 'req_check', numberOfColumns: 2, titleText: '점검'},
            {startColumnName: 'req_fix', numberOfColumns: 2, titleText: '보수'},
            {startColumnName: 'req_blackout', numberOfColumns: 2, titleText: '정전'},
            {startColumnName: 'req_accident', numberOfColumns: 2, titleText: '사고'},
            {startColumnName: 'req_cumulatively', numberOfColumns: 2, titleText: '누계'}
        ]
    });
}

function dataInitialize() {
    var data = [];
    var length = 30;
    var temp = null;

    for(var i=0 ; i<length ; i++) {
        temp = {
            'date': '2016-02-1'+(i+1),
            'name_pp': '강북아리수정수장'+(i+1),
            'plan': '10'+(i+1),
            'performance': '10'+(i+1)
        };

        data.push(temp);
    }

    return data;
}

function dataInitialize2() {
    var data = [];
    var length = 30;
    var temp = null;

    for(var i=0 ; i<length ; i++) {
        temp = {
            'date': '2016-02-1'+(i+1),
            'name_pp': '강북아리수정수장'+(i+1),
            'req_check': '10'+(i+1),
            'performance_check': '10'+(i+1),
            'req_fix': '10'+(i+1),
            'performance_fix': '10'+(i+1),
            'req_blackout': '10'+(i+1),
            'performance_blackout': '10'+(i+1),
            'req_accident': '10'+(i+1),
            'performance_accident': '10'+(i+1),
            'req_cumulatively': '10'+(i+1),
            'performance_cumulatively': '10'+(i+1)
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

function addDataToJqGrid2(data) {
    var $gridList = $('#gridList2');
    for(var i=0, length=data.length ; i<length ; i++) {
        $gridList.jqGrid('addRowData', i+1, data[i]);
    }
}

function jqGridBasic() {

    $('#gridList').jqGrid({
        //url : 'http://localhost:8080/HOMS/sample/json.do',
        datatype: 'local',
        loadonce : true,
        height : 261,
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

      colNames : [ "날짜", "사이트명", "계획", "실적"],

        colModel : [ {
            name : 'date',
            index : '날짜',
            align : 'center',
            width: '250',
        //  cellattr: arrtSetting
        }, {
            name : 'name_pp',
            index : '사이트명',
            align : 'center',
            width: '514'
         }, {
            name : 'plan',
            index : '계획',
            align : 'center',
            width: '250',
        //  cellattr: arrtSetting
         }, {
            name : 'performance',
            index : '실적',
            align : 'center',
            width: '250'
         }],
    //  beforeSelectRow: function () {
    //                return false;
    //            },
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

    $('#gridList2').jqGrid({
        //url : 'http://localhost:8080/HOMS/sample/json.do',
        datatype: 'local',
        loadonce : true,
        height : 261,
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

      colNames : [ "날짜", "사이트명", "요청", "실적", "요청", "실적", "요청", "실적", "요청", "실적", "요청", "실적"],

        colModel : [ {
            name : 'date',
            index : '날짜',
            align : 'center',
            width: '110',
        //  cellattr: arrtSetting
        }, {
            name : 'name_pp',
            index : '사이트 명',
            align : 'left',
            width: '184'
         }, {
            name : 'req_check',
            index : '요청',
            align : 'right',
            width: '93',
        //  cellattr: arrtSetting
         }, {
            name : 'performance_check',
            index : '실적',
            align : 'right',
            width: '93'
         }, {
            name : 'req_fix',
            index : '요청',
            align : 'right',
            width: '93',
        //  cellattr: arrtSetting
         }, {
            name : 'performance_fix',
            index : '실적',
            align : 'right',
            width: '93'
         }, {
            name : 'req_blackout',
            index : '요청',
            align : 'right',
            width: '93',
        //  cellattr: arrtSetting
         }, {
            name : 'performance_blackout',
            index : '실적',
            align : 'right',
            width: '93'
         }, {
            name : 'req_accident',
            index : '요청',
            align : 'right',
            width: '93',
        //  cellattr: arrtSetting
         }, {
            name : 'performance_accident',
            index : '실적',
            align : 'right',
            width: '93'
         }, {
            name : 'req_cumulatively',
            index : '요청',
            align : 'right',
            width: '93',
        //  cellattr: arrtSetting
         }, {
            name : 'performance_cumulatively',
            index : '실적',
            align : 'right',
            width: '93'
         }],
    //  beforeSelectRow: function () {
    //                return false;
    //            },
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
    jqGridBasic();
    addGroupHeader();
    var data = dataInitialize();
    var data2 = dataInitialize2();
    addDataToJqGrid(data);
    addDataToJqGrid2(data2);

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
    initHighcharts();
    customizeForm ();
	initDatetimepicker ();
    customizeTree ();
	customizeScroll ();
    showPopup();
    customizeJqgrid ();
} );