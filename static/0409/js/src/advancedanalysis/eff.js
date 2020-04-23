// form element customize
function customizeForm ()
{
	 var $imageType = $('.image_type').customizeRadio({
	    backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
		width: 13,
		height	: 13
	});

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select01',
		focusClass : 'custom-form-focused01',
		disableClass : 'custom-form-disabled01'
    } );

	var $selType = $ ( '#sel_type' ).customizeSelect ( {
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

// init highcharts
function initHighcharts ()
{
    $('#graph1').highcharts({
         chart: {
            marginTop: 20,
            marginLeft: 115,
            marginBottom: 30,
            marginRight: 30
        },
        title: {
            text: '',
            style: {
                display: 'none',
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
            categories: [ '하이웨이 솔라1','새빛 둥둥섬2','한빛 고등학교3','한화 에너지4','서남 아리수 3','하이웨이 솔라6','새빛 둥둥섬2','한빛 고등학교8','한화 에너지9','서남 아리수 1'],
            crosshair: true,
            labels: {
                align:'right',
                x: -20
            },
        },
        yAxis: [{
            min: 0,
            title: {
                text: '',
                align: 'left',
                marginLeft: 50,
                y: -20
            }
        }],
        legend: {
                 enabled: false,
             },
        plotOptions: {
            bar: {
                pointPadding: 0,
                borderWidth: 0,
                pointWidth: 10,
            }
        },
        series: [{
            type: 'bar',
            yAxis: 0,
            color: '#ff8226',
            name: '가동률',
            data: [95,90,80,85,80,70,68,65,64,60]
        }]
    });

    $('#graph2').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
			legend: {
				align: 'right',
				verticalAlign: 'middle',
				layout: 'vertical',
				x: 0,
				y: 0
			},
			 credits: {
			  enabled: false
				},
            title: {
                text: '',
				style: {
                display: 'none'
			   }
            },
            plotOptions: {
                pie: {
                	size: '80%',
                	borderWidth: 0,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            colors:[
				  '#fde7be', '#fd5d2a'
			],
            series: [{
                colorByPoint: true,
                data: [{
                    name: '유지보수',
                    y: 70
                }, {
                    name: '장애',
                    y: 30
                }]
            }]
    });
}

// jqgrid start
//헤더 병합
function addGroupHeader() {
    var groupHeaderName = 'User';

    $("#gridList").jqGrid('setGroupHeaders', {
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

        colNames : [ "순위", "사이트명", "지역", "목표", "실적", "충전량", "방전량"],

		colModel : [ {
            name : 'no',
            index : '순위',
            align : 'center',
            width: '82'
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
            index : '충전량',
            align : 'right',
            width: '262'
         }, {
            name : 'mtn_tm',
            index : '방전량',
            align : 'right',
            width: '262'
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

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.irradiation_scrd' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    // custom scroll
    $('.tree_wrap').mCustomScrollbar({
        scrollButtons: {
            enable:true
        },
        axis: 'yx',
        theme: 'inset-2',
        scrollbarPosition: 'outside',
        scrollInertia: 300
    });
}

// treemenu customize
function customizeTree()
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
    initHighcharts ();
	customizeJqgrid ();
	customizeScroll ();
    customizeTree ();
    showPopup();
} );