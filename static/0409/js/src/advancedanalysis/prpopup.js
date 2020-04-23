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

    $("#gridList2").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders:[
            {startColumnName: 'goal', numberOfColumns: 2, titleText: '가동률(%)'},
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
            'site_pp': '하이웨이 솔라1',
            'loc': '보은',
            'goal': '23.0',
            'pfms': '23.0',
            'all_mid_tm': '23.0',
            'mtn_tm': '23.0',
            'fail_tm': '23.0'
        };

        data.push(temp);
    }

    return data;
}

function addDataToJqGrid(data) {
    var $gridList = $('#gridList2');
    for(var i=0, length=data.length ; i<length ; i++) {
        $gridList.jqGrid('addRowData', i+1, data[i]);
    }
}

function jqGridBasic() {
    $('#gridList2').jqGrid({
        //url : 'http://localhost:8080/HOMS/sample/json.do',
        datatype: 'locale',
        loadonce : true,
        height : 312,
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

        colNames : [ "순위", "사이트명", "지역", "목표", "실적", "전체 중간 시간(h)", "유지보수 시간(h)", "장애발생 시간(h)"],

        colModel : [ {
            name : 'no',
            index : '순위',
            align : 'center',
            width: '72'
        }, {
            name : 'site_pp',
            index : '사이트명',
            align : 'left',
            width: '199'
        }, {
            name : 'loc',
            index : '지역',
            align : 'center',
            width: '98'
         }, {
            name : 'goal',
            index : '목표',
            align : 'right',
            width: '173'
         }, {
            name : 'pfms',
            index : '실적',
            align : 'right',
            width: '173'
         }, {
            name : 'all_mid_tm',
            index : '전체 중간 시간(h)',
            align : 'right',
            width: '173'
         }, {
            name : 'mtn_tm',
            index : '유지보수 시간(h)',
            align : 'right',
            width: '173'
         }, {
            name : 'fail_tm',
            index : '장애발생 시간(h)',
            align : 'right',
            width: '173'
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