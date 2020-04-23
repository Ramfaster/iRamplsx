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

// jqgrid 편집 enable 처리
function enableJqgridEditbox ( $gridList, $checkboxs )
{
	$gridList.jqGrid ( 'hideCol', [ 'rn', 'alm04', 'alm05', 'alm06' ] );
	$gridList.jqGrid ( 'showCol', [ 'cb', 'alm07', 'noEditBox' ] );

	// onSelectRow event 해제
	$gridList.jqGrid ( "setGridParam", {
		beforeSelectRow : function ( rowId, e )
		{
			return false;
		}
	} );

	initializeInputBoxes($gridList);
}

// jqgrid 편집 disable 처리
function disableJqgridEditbox ( $gridList, $checkboxs )
{
	$gridList.jqGrid ( 'showCol', [ ] );
	$gridList.jqGrid ( 'hideCol', [ 'rn', 'cb', 'alm07', 'noEditBox' ] );

	// onSelectRow event 적용
	$gridList.jqGrid ( "setGridParam", {
		beforeSelectRow : function ( rowId, e )
		{
			return true;
		}
	} );
}

function dataInitialize() {
        var data = [];
        var length = 30;
        var temp = null;

        for(var i=0 ; i<length ; i++) {
            temp = {
                'no': (i+1),
                'year': '2015',
                'month': '01',
                'pv_goal_pg': '160,000,000',
				'pv_ratio_pfmc': '160,000,000',
                'pv_ratio_act': '89.0000',
				'pv_sales': '210,000,000',
                'solar_power_standard': '210,000,000',
                'solar_power_goal': '160,000,000',
				'time_power_gain': '15.0',
                'eff_ratio_down': '0.5',
				'ess_ratio_act': '15.0',
				'ess_ratio_pfmc': '15.0',
				'ess_soh': '15.0',
				'ess_ot_amonut': '160,000,000',
				'name_reg': '실무자',
				'name_modi': '실무자'
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
			rownumbers : true,

			//pager: '#samplePager',

			colNames : [ "NO","년도", "월", "PV목표 발전량(kW)", "PV성능비(%)", "PV가동률(%)", "PV매출(￦)", "기준 일사강도(kW/m²)", "목표 일사량(kW/m²/m)", "발전시간(Wh/Wp)", "효율 감소율(%)","ESS가동률(%)","ESS효율","ESS SOH(%)","ESS 방전량(Wh)", "등록자", "수정자"],

			colModel : [ {
				name : 'no',
				index : '',
				align : 'center',
				width: '39'
			}, {
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
				name : 'name_reg',
				index : '',
				align : 'center',
				width : '58'
			}, {
				name : 'name_modi',
				index : '',
				align : 'center',
				width : '58'
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

				var $gridList = $ ( '#gridList' );
				var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
				if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                {
                    enableJqgridEditbox ( $gridList, $checkboxs )
                } else
                {
                    disableJqgridEditbox ( $gridList, $checkboxs )
                }
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