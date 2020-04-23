var pvSearchList;
var searchCnt = 0;
var chartImgInfoMap;
// form element customize
function customizeForm ()
{
	 var $imageType = $('.image_type').customizeRadio({
	    backgroundImage: contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
		width: 13,
		height	: 13
	});

    // 조회기간
    var $selectDateType = $ ( '#select_date_type' ).customizeSelect ( {
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

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    $selectDateType.on ( 'change', function ()
    {
        var selectedDateType = $ ( this ).val ();
        var className = null;

        if ( selectedDateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedDateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectedDateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        $date.addClass ( 'dnone' );

        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedDateType, false, false );
        var $dateBox = $ ( '.' + className );

        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate )
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    $selectDateType.trigger ( 'change' );
    
    $("#alarmGrad").val("ALL");
    
    $selType.on ( 'change', function ( event, initFlag ){
        var alarmGrad = $ ( this ).val ();
       
        $("#alarmGrad").val(alarmGrad);
        if ( !initFlag )
        {
        	searchAlarmRankChartByManufacturer ();
        }
    	        
    } );
    

}


//가동률 조회
function searchEfcny ()
{
 var $gridList = $ ( '#gridList' );
 var $searchPeriod = $ ( '#search_period' );
 var $pageType = $ ( '#pageType' );
 
 $ ( '#sortColumn' ).val ( 'totalCnt' );
 $ ( '#sortMethod' ).val ( 'desc' );
 
 var tpl = getTemplate ( templates.noData );
 $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
 {   
	 var selectDateType = $ ( '#select_date_type' ).val ();
     var className = null;

     if ( selectDateType === homConstants.dateTypeYYYYMMDD )
     {
         className = staticVariable.formatYYYYMMDD;
     } else if ( selectDateType === homConstants.dateTypeYYYYMM )
     {
         className = staticVariable.formatYYYYMM;
     } else if ( selectDateType === homConstants.dateTypeYYYY )
     {
         className = staticVariable.formatYYYY;
     }

     var fromDate = $ ( '#' + className + '_from_date' ).val ();
     var toDate = $ ( '#' + className + '_to_date' ).val ();
     var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
     var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );
        

     if ( !homUtil.fromToDateValidate ( fromDate, toDate, selectDateType ) )
     {
         return;
     }
     setSearchParameter ( pureFromDate, pureToDate );
     
     // 일사량 Grid 조회
     if ( initFlag )
     { 
    	 $("#current").val(0);
    	 $("#rowCount").val(10);
    		
    	 jqGridBasic();

    	 addGroupHeader();
    	 
    	 jqGridBasicByManufacturer();
     } else
     {
    	 reloadJqgrid ( $gridList );         
     }

     searchAlarmRankChart ();
     
 } );
}

//제조사별 조회
function searchAlarmByManufacturer (eqmtGrpCd)
{
	var $gridList = $ ( '#gridList2' );
	
	 $ ( '#eqmtGrpCd' ).val ( eqmtGrpCd );
	 
	 var $selType = $ ( '#sel_type' );
     
     $selType.find ( 'option:first' ).prop ( 'selected', true );
     
     $selType.trigger ( 'change', true  );
    
     
	reloadJqgridByManufacturer ( $gridList, eqmtGrpCd )
	
	searchAlarmRankChartByManufacturer ();
}

// init datetimepicker
function initDatetimepicker ()
{
	var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#start_yyyy' );
    var $endYYYY = $ ( '#end_yyyy' );
    var $yyyyFromDate = $ ( '#yyyy_from_date' );
    var $yyyyToDate = $ ( '#yyyy_to_date' );

    var $yyyymm = $ ( '.yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );
    var $yyyymmToDate = $ ( '#yyyymm_to_date' );

    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : '+0y'
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : '+0m'
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : '+0d'
    } );

    $yyyy.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYY, $endYYYY, $yyyyFromDate, $yyyyToDate );
    } );

    $yyyymm.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMM, $endYYYYMM, $yyyymmFromDate, $yyyymmToDate );
    } );

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );

}

// init highcharts
function searchAlarmRankChart ()
{
	$("#avatyTopConditionTitle").empty();
	var top = "Top"
	if($("#sortMethod").val() =="desc"){
		top = "Bottom";
	}		
	
	$("#avatyTopConditionTitle").html("<i class='icon_blt05'></i>"+i18nMessage.msg_alarmByEquipment+" "+top+ " 1 ~ 10");
	
	var $graph1 = $ ( '#graph1' );
	$.ajax ( {
        url : contextPath + '/hom/advancedanalysis/ess/alarm/selectAdvanAlsAlarmChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $graph1.highcharts () ] );

                if ( json.data.length > 0 )
                {
                    // Chart 데이터
                    var seriesArray = [];
                    var categoriesArray = [];

                    $.each ( json.data, function ( index, item )
                    {                                        

                        var efcnySeris = {
                            name : item.eqmtGrpCdNm,
                            y : homUtil.mathRoundChart ( item.totalPct, 1 )
                        };
                        seriesArray.push ( efcnySeris );
                        categoriesArray.push(item.eqmtGrpCdNm);
                    } );

                    $graph1.highcharts ( {                    			
                    	colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),        
            			chart : {
                        	marginTop: 20,
                            marginLeft: 115,
                            marginBottom: 30,
                            marginRight: 30
                        },
                        legend : {
                        	 enabled: false,
                        },
                        credits : {
                            enabled : false
                        },                               
                        title : {
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
                        plotOptions : {
                        	 bar: {
                                 pointPadding: 0,
                                 borderWidth: 0,
                                 pointWidth: 30,
                                 
                             }
                        },
                        xAxis: {
                            categories: categoriesArray,
                            crosshair: true,
                            labels: {
                                align:'right',
                                x: -20
                            },
                        },
                        yAxis: [{
                            max: 100,
                            title: {
                                text: '',
                                align: 'left',
                                marginLeft: 50,
                                y: -20
                            }
                        }],
                        series : [ {
                        	type: 'bar',
                        	colorByPoint: true,
                            yAxis: 0,
                        	name : i18nMessage.msg_alarm,                                    
                            data : seriesArray
                        } ]
                    } );
                } else
                {
                    var noDataMsg = '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>';
                    $graph1.html ( noDataMsg );
                }
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
        },
        error : function ( xhr, textStatus, error )
        {
            // abort error not show(user request cancel or aborted)
            if ( !(xhr.status === 0 || xhr.readyState === 0) )
            {
                if ( xhr.status === homConstants.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else if ( xhr.status === homConstants.statusNoPermission )
                {
                    location.href = contextPath + '/page/forbidden.do';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        }
    } );
   
}

//init highcharts
function searchAlarmRankChartByManufacturer ()
{	
	var $graph1 = $ ( '#graph2' );
	$.ajax ( {
        url : contextPath + '/hom/advancedanalysis/ess/alarm/selectAdvanAlsAlarmChartListByManufacturer.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $graph1.highcharts () ] );

                if ( json.data.length > 0 )
                {
                    // Chart 데이터
                    var seriesArray = [];
                    var categoriesArray = [];

                    $.each ( json.data, function ( index, item )
                    {                                        

                        var efcnySeris = {
                            name : item.corprNm,
                            y : homUtil.mathRoundChart ( item.totalCnt, 0 )
                        };
                        seriesArray.push ( efcnySeris );
                        categoriesArray.push(item.eqmtGrpCdNm);
                    } );

                    $graph1.highcharts ( {      
                    	colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ), 
                    	chart : {
                        	plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        legend : {
                        	align: 'right',
            				verticalAlign: 'middle',
            				layout: 'vertical',
            				x: 0,
            				y: 0
                        },
                        credits : {
                            enabled : false
                        },                               
                        title : {
                        	text: '',
                            style: {
                                display: 'none',
                            }
                        },                                
                        plotOptions : {
                            pie : {
                                size : '80%',
                                borderWidth : 0,
                                allowPointSelect : true,
                                cursor : 'pointer',                                        
                                dataLabels : {
                                    enabled : false
                                },
                                showInLegend : true
                            }                               
                        },
                        
                        series : [ {
                        	colorByPoint: true, 
                        	name : i18nMessage.msg_alarm, 
                            data : seriesArray
                        } ]
                    } );
                } else
                {
                    var noDataMsg = '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>';
                    $graph1.html ( noDataMsg );
                }
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
        },
        error : function ( xhr, textStatus, error )
        {
            // abort error not show(user request cancel or aborted)
            if ( !(xhr.status === 0 || xhr.readyState === 0) )
            {
                if ( xhr.status === homConstants.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else if ( xhr.status === homConstants.statusNoPermission )
                {
                    location.href = contextPath + '/page/forbidden.do';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        }
    } );
   
}

// jqgrid start
//헤더 병합
function addGroupHeader() {
    var groupHeaderName = 'User';

    $("#gridList").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders:[
			{startColumnName: 'totalCnt', numberOfColumns: 2, titleText: i18nMessage.msg_totalSummary},
			{startColumnName: 'faultCnt', numberOfColumns: 2, titleText: i18nMessage.msg_mntrFault},
			{startColumnName: 'warningCnt', numberOfColumns: 2, titleText: i18nMessage.msg_mntrEqmtWarning}
        ]
    });
}


function jqGridBasic() {
	var $gridList = $ ( '#gridList' );
	var tpl = getTemplate ( templates.noData );   

    var noDataId = 'jqgrid_nodata';
   
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/ess/alarm/selectAdvanAlsAlarmGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 236,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            selectedPvIds : pvSearchList
        },
        colNames : [ "설비그룹", i18nMessage.msg_eqmtSection, i18nMessage.msg_num, i18nMessage.msg_ratio+ '(%)',
                     i18nMessage.msg_num, i18nMessage.msg_ratio+ '(%)',
                     i18nMessage.msg_num, i18nMessage.msg_ratio+ '(%)'],
        colModel : [
                {
                    name : 'eqmtGrpCd',
                    align : 'center',
                    width : '82',
                    fixed : true,
                    hidden : true,
                    sortable : true
                },
                {
                    name : 'eqmtGrpCdNm',
                    align : 'center',
                    width : '101',
                    fixed : true,
                    sortable : true
                },
                {
                    name : 'totalCnt',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 0 );
                    }
                },
                {
                    name : 'totalPct',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 1 );
                    }
                },
                {
                    name : 'faultCnt',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 0 );
                    }
                },
                {
                    name : 'faultPct',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 1 );
                    }
                },
                {
                    name : 'warningCnt',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 0 );
                    }
                },
                {
                    name : 'warningPct',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 1);
                    }
                }],
                sortname : 'totalCnt',
                sortorder : 'desc',
        rownumbers : false,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
        	var $gqNodata =  $ ( '#jqgrid_nodata' );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalRowCount1' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();         
                searchAlarmByManufacturer ('');
            } else
            {
                $gqNodata.hide ();                

//                if(data.rows[0].eqmtGrpCd =="TOTAL"){
//                	searchAlarmByManufacturer (data.rows[0].eqmtGrpCd);
//                }else{
//                	searchAlarmByManufacturer (data.rows[1].eqmtGrpCd);
//                }
                
                searchAlarmByManufacturer (data.rows[0].eqmtGrpCd);
               
                
                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }
        },
        onSelectRow : function ( rowId, status )
        {
        	var rowData = $gridList.getRowData ( rowId );
        	
        	searchAlarmByManufacturer (rowData.eqmtGrpCd);           
        },
        onSortCol: function (index, columnIndex, sortOrder) {
        	$ ( '#sortColumn' ).val ( index );
        	 $ ( '#sortMethod' ).val ( sortOrder );
        	 searchAlarmRankChart ();
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();    
}

function reloadJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();  
    var selectedPvIds;
    if(typeof pvSearchList == "undefined"){
    	selectedPvIds = "";
    }else{
    	selectedPvIds = pvSearchList;
    }

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            selectedPvIds : selectedPvIds
        }
    } ).trigger ( 'reloadGrid' );
}


function jqGridBasicByManufacturer() {
	var $gridList = $ ( '#gridList2' );
	var tpl = getTemplate ( templates.noData );   

    var noDataId = 'manufacturer_jqgrid_nodata';
   
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/ess/alarm/selectAdvanAlsAlarmGridListByManufacturer.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 261,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            selectedPvIds : pvSearchList
        },
        colNames : [ "제조사아이디", i18nMessage.msg_manufacturer, i18nMessage.msg_mntrFaultNum, i18nMessage.msg_mntrEqmtWarningNum,
                     i18nMessage.msg_countSummary],
        colModel : [
                {
                    name : 'corprId',
                    align : 'center',
                    width : '82',
                    fixed : true,
                    hidden : true,
                    sortable : true
                },
                {
                    name : 'corprNm',
                    align : 'left',
                    width : '101',
                    fixed : true,
                    sortable : true
                },
                {
                    name : 'faultCnt',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 0 );
                    }
                },
                {
                    name : 'warningCnt',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 0 );
                    }
                },
                {
                    name : 'totalCnt',
                    align : 'right',
                    width : '108',
                    fixed : true,
                    sortable : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberRoundComma ( cellvalue, 0 );
                    }
                }],
                sortname : 'totalCnt',
                sortorder : 'desc',
        rownumbers : false,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
        	var $gqNodata =  $ ( '#manufacturer_jqgrid_nodata' );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalRowCount2' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();                
            } else
            {
                $gqNodata.hide ();                

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();    
}

function reloadJqgridByManufacturer ( $gridList, eqmtGrpCd )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();  
    var selectedPvIds;
    if(typeof pvSearchList == "undefined"){
    	selectedPvIds = "";
    }else{
    	selectedPvIds = pvSearchList;
    }

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            selectedPvIds : selectedPvIds,
            eqmtGrpCd : eqmtGrpCd
        }
    } ).trigger ( 'reloadGrid' );
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


/**
 * 트리 초기화
 */
function initTree ( data )
{
    // 트리메뉴
    var setting = {
        check : {
            enable : true,
            chkStyle : 'checkbox',
            radioType : 'all'
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        view : {
            showIcon : false
        },
        callback : {
            onCheck : function beforeOnCheck ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( treeNode );
                var checkedNodes = zTree.getCheckedNodes ();
                pvSearchList = undefined;
                // 체크된 발전소를 전역 변수에 저장
                $.each ( checkedNodes, function ( idx, item )
                {
                    if ( item.pId && item.checked === true )
                    {
                        if ( pvSearchList )
                        {
                            pvSearchList += "," + item.id;
                        } else
                        {
                            pvSearchList = item.id;
                        }
                    }
                } );
               
            },
            onClick : function beforeClick ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var selectedNodes = zTree.getSelectedNodes ();
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
}

// treemenu customize
function customizeTree ()
{
    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/ess/avaty/selectSiteTreeListInfo.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        data : {
            treeType : 'NP',
            bizTy : 'BSN01,BSN02,BSN03,BSN04'
        },
        success : function ( json )
        {

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $.each ( json.data, function ( idx, item )
                {
                    // 체크 된 발전소 목록을 전역 변수에 저장 (초기 셋팅)
                    if ( item.pId && item.checked === true )
                    {
                        if ( pvSearchList )
                        {
                            pvSearchList += "," + item.id;
                            // pvSearchList.push ( item.id );
                        } else
                        {
                            pvSearchList = item.id;
                        }
                    }

                } );

                initTree ( json.data );
            }
        }
    } );
}

//Parameter 셋팅
function setSearchParameter ( pureFromDate, pureToDate )
{
    // 조회 조건, 시작, 종료일자 세팅
    $ ( '#dateType' ).val ( $ ( '#select_date_type' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );
    $ ( '#selectedPvIds' ).val ( pvSearchList );
    $("#eqmtGrpCd").val("ALL");

    setPeriodTitle ();
}

//조회 조건에 해당하는 타이틀 세팅
function setPeriodTitle ()
{
    var dateType = $ ( '#dateType' ).val ();
    var className = null;
    var dateFormat = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
        dateFormat = homUtil.dateFormat.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
        dateFormat = homUtil.dateFormat.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
        dateFormat = homUtil.dateFormat.formatYYYY;
    }

    var fromDate = homUtil.convertDateStringToFormat ( $ ( '#fromDate' ).val (), dateFormat );
    var toDate = homUtil.convertDateStringToFormat ( $ ( '#toDate' ).val (), dateFormat );

    $ ( '#search_period' ).text ( fromDate + ' ~ ' + toDate );
}

function highChartImgRetrieve ( dataString, urlId, urlName )
{
    $.ajax ( {
        type : 'POST',
        data : dataString,
        url : staticVariable.exportUrl,
        success : function ( data )
        {
            var $excelUrl = $ ( '<input />', {
                type : 'hidden',
                id : urlId,
                name : urlName,
                value : staticVariable.exportUrl + data
            } );
            chartImgInfoMap.put ( urlId, $excelUrl );

            if ( chartImgInfoMap.size () == 1 )
            {
                var $excelUrl1 = chartImgInfoMap.get ( 'excelUrl1' );

                if ( $excelUrl1 )
                {
                    $ ( 'form' ).prepend ( $excelUrl1 ).prop ( 'action',
                            contextPath + '/hom/excel/advancedanalysis/ess/alarm/download.do' ).submit ();
                    $excelUrl1.remove ();
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_highchartDownloadError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        },
        error : function ( xhr, textStatus, error )
        {
            // abort error not show(user request cancel or aborted)
            if ( !(xhr.status === 0 || xhr.readyState === 0) )
            {
                if ( xhr.status === homConstants.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else if ( xhr.status === homConstants.statusNoPermission )
                {
                    location.href = contextPath + '/page/forbidden.do';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        }
    } );
}

/**
 * 엑셀 다운로드
 */
function downloadExcel ()
{
    var $btnExcel = $ ( '#btnExcel' );

    $btnExcel.click ( function ()
    {
    	var $graph = $ ( '#graph1' );
        var optionsStr = JSON.stringify ( $graph.highcharts ().userOptions );
        var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );
        var id = 'excelUrl1';
        var name = 'url1';

        highChartImgRetrieve ( dataString, id, name );

    } );
}

//그리드 전체보기 팝업 호출
function initViewAllPopup ()
{

    var $btnAllJqgrid1 = $ ( '#btn_all_jqgrid1' );
  

    $btnAllJqgrid1.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            beforeOpen : function ()
            {
               
            }
        }
    } );
    
    var $btnAllJqgrid2 = $ ( '#btn_all_jqgrid2' );
    

    $btnAllJqgrid2.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            beforeOpen : function ()
            {
               
            }
        }
    } );
}

//페이지 로드 완료 시 처리
function initPage ()
{

    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
	// highChart 이미지 URL 정보
    chartImgInfoMap = new Map ();
    
	customizeForm ();
	initDatetimepicker ();	
	customizeScroll ();
    customizeTree ();
    searchEfcny();
    initPage();
    initViewAllPopup ();
    downloadExcel ();
} );