// form element customize
function customizeForm ()
{
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
}

// jqgrid start

//add input Box
function initializeInputBoxes( $gridList ) {
	var ids = $gridList.jqGrid('getDataIDs');
	var rowDatas = $gridList.jqGrid('getRowData');
	var noEditBox = null;
	for(var i = 0, size = ids.length; i < size ; i++) {
		noEditBox = '<input id="'+ids[i]+'" type="text" value="'+rowDatas[i].no+'"/>';
		$gridList.jqGrid('setCell', ids[i], 'name', noEditBox);
	}
}

function dataInitialize() {
        var data = [];
        var length = 30;
        var temp = null;

        for(var i=0 ; i<length ; i++) {
            temp = {
                'year': '2015',
                'month': '01',
                'pv_goal_pg': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
				'pv_ratio_pfmc': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
                'pv_ratio_act': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
				'pv_sales': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
                'solar_power_standard': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
                'solar_power_goal': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
				'time_power_gain': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
                'eff_ratio_down': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
				'ess_ratio_act': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
				'ess_ratio_pfmc': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
				'ess_soh': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
				'ess_ot_amonut': '<input id="" type="text" value="" class="ds_fl_ipt al_rt" />',
				'btn_modi': '<a href="javascript:;" class="btn_copy link"><i class="icon_copy"></i>Copy</a><a href="javascript:;" class="btn_paste link"><i class="icon_paste"></i>Paste</a><a href="javascript:;" class="btn_cancel link"><i class="icon_cancel"></i>cancel</a>'
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

			multiselect : true, // multi-select checkboxes appear
			multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
			// time

			page: 1,
			scroll: true, // set the scroll property to 1 to enable paging with scrollbar - virtual loading of records
			emptyrecords: 'Scroll to bottom to retrieve new page', // the message will be displayed at the bottom
			rownumbers : false,

			//pager: '#samplePager',

			colNames : [ "년도", "월", "PV목표 발전량(kW)", "PV성능비(%)", "PV가동률(%)", "PV매출(￦)", "기준 일사강도(kW/m²)", "목표 일사량(kW/m²/m)", "발전시간(Wh/Wp)", "효율 감소율(%)","ESS가동률(%)","ESS효율","ESS SOH(%)","ESS 방전량(Wh)", "편집"],

			colModel : [{
				name : 'year',
				index : '',
				align : 'center',
				width: '41'
			}, {
				name : 'month',
				index : '',
				align : 'center',
				width: '41'
			 }, {
				name : 'pv_goal_pg',
				index : '',
				align : 'right',
				width: '139'
			 }, {
				name : 'pv_ratio_pfmc',
				index : '',
				align : 'right',
				width: '94'
			 }, {
				name : 'pv_ratio_act',
				index : '',
				align : 'right',
				width: '94'
			 }, {
				name : 'pv_sales',
				index : '',
				align : 'right',
				width: '90'
			}, {
				name : 'solar_power_standard',
				index : '',
				align : 'right',
				width : '150'
			}, {
				name : 'solar_power_goal',
				index : '',
				align : 'right',
				width : '150'
			}, {
				name : 'time_power_gain',
				index : '',
				align : 'right',
				width : '120'
			}, {
				name : 'eff_ratio_down',
				index : '',
				align : 'right',
				width : '100'
			}, {
				name : 'ess_ratio_act',
				index : '',
				align : 'right',
				width : '90'
			}, {
				name : 'ess_ratio_pfmc',
				index : '',
				align : 'right',
				width : '80'
			}, {
				name : 'ess_soh',
				index : '',
				align : 'right',
				width : '85'
			}, {
				name : 'ess_ot_amonut',
				index : '',
				align : 'right',
				width : '110'
			}, {
				name : 'btn_modi',
				index : '',
				align : 'center',
				width : '130'
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
    customizeForm ();
    initDatetimepicker ();
	customizeJqgrid ();
	showPopup();
} );