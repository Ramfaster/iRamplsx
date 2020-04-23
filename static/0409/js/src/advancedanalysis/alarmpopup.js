function customizeForm ()
{
    var $dateType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

function customizeScroll ()
{
    // custom scroll
    $ ( '.popup_tbl_box_add' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// jqgrid start
//헤더 병합
function addGroupHeader() {
    var groupHeaderName = 'User';

    $("#gridList3").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders:[
            {startColumnName: 'all_amt', numberOfColumns: 2, titleText: '총합'},
            {startColumnName: 'brk_amt', numberOfColumns: 2, titleText: '고장'},
            {startColumnName: 'wng_amt', numberOfColumns: 2, titleText: '경고'},
        ]
    });
}

function dataInitialize() {
    var data = [];
    var length = 15;
    var temp = null;

    for(var i=0 ; i<length ; i++) {
        temp = {
            'type': 'PCS',
            'all_amt': '23.0',
            'all_rto': '23.0',
            'brk_amt': '23.0',
            'brk_rto': '23.0',
            'wng_amt': '23.0',
            'wng_rto': '23.0'
        };

        data.push(temp);
    }

    return data;
}

function addDataToJqGrid(data) {
    var $gridList = $('#gridList3');
    for(var i=0, length=data.length ; i<length ; i++) {
        $gridList.jqGrid('addRowData', i+1, data[i]);
    }
}

function jqGridBasic() {
    $('#gridList3').jqGrid({
        //url : 'http://localhost:8080/HOMS/sample/json.do',
        datatype: 'locale',
        loadonce : true,
        height : 236,
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

        colNames : [ "설비구분", "개수", "비율(%)", "개수", "비율(%)", "개수", "비율(%)"],

        colModel : [ {
            name : 'type',
            index : '설비구분',
            align : 'center',
            width: '291'
        }, {
            name : 'all_amt',
            index : '개수',
            align : 'right',
            width: '158'
        }, {
            name : 'all_rto',
            index : '비율(%)',
            align : 'right',
            width: '158'
         }, {
            name : 'brk_amt',
            index : '개수',
            align : 'right',
            width: '158'
        }, {
            name : 'brk_rto',
            index : '비율(%)',
            align : 'right',
            width: '158'
         }, {
            name : 'wng_amt',
            index : '개수',
            align : 'right',
            width: '158'
        }, {
            name : 'wng_rto',
            index : '비율(%)',
            align : 'right',
            width: '158'
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
    addGroupHeader();
    addDataToJqGrid(data);

    $('div.ui-jqgrid-bdiv').perfectScrollbar();
}
//jqgrid end


$ ( function ()
{
    customizeForm();
	customizeScroll ();
    customizeJqgrid ();
} )