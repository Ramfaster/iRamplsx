
// more btn action
function moreAction(){

    var moreBox = $('.more_detail_box');
    var btnMore = $('.btn_more');
    var kpi_inf_dtl = $('.kpi_inf_dtl .cng');
    var kpi_inf_dtl_arw = $('.kpi_inf_dtl .arw');

    btnMore.on('click', function(e){
        var target = $(e.currentTarget);
        var theMoreBox = $(this).next('.more_detail_box');

        theMoreBox.toggleClass('on');

        if(theMoreBox.hasClass('on')){

            function moreBoxFix(){
                var moreBoxHeight = theMoreBox.outerHeight();
                alert(moreBoxHeight);
                var moreBoxPos = moreBoxHeight / 2;
                theMoreBox.css('margin-top','-'+ moreBoxPos + 'px');
            }

            theMoreBox.show();

        } else {
            theMoreBox.hide();
        }

        e.preventDefault();
    });
  
    $('.more_detail_box .btn_close').click(function(){
        $(this).parents('.more_detail_box').removeClass('on');
        $(this).parents('.more_detail_box').hide();
    })
}



// form element customize
function customizeForm ()
{
    // 미조치알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : 'f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        width : 58,
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        selectedColor : '#009944',
        selectedBorderColor : '#009944'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
        selectedColor : '#ffb230',
        selectedBorderColor : '#ffb230'
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
        selectedColor : '#f47321',
        selectedBorderColor : '#f47321'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );

    $ ( '#notice' ).customizeCheckbox ( checkOption1 );
    $ ( '#error' ).customizeCheckbox ( checkOption2 );
    $ ( '#warning' ).customizeCheckbox ( checkOption3 );
    $ ( '#fault' ).customizeCheckbox ( checkOption4 );

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );

    var $imageType = $('.image_type').customizeRadio({
    	backgroundImage:  contextPath +'/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x:  contextPath +'/css/lib/customizeForm/img/img_radio@2x.png',
        width: 13,
        height  : 13
    });
}

/*function customizeForm ()
{
    // 조회기간
    var $selectDateType = $ ( '#select_date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
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
}*/



// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.al_list_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );

    /*$ ( '.scr_smr' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );*/
}



function showPopup() {
    $('.btn_popup').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}

function vTicker() {
	$('.alm_details').vTicker('init', {speed: 1500,
    pause: 3000,
    showItems: 1
	});
}

function getPvEssChartList ( type )
{
    var $graph01 = $ ( '#graph01' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/ess/ess/selectPvEssChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            type : type
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#graph01' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid.show ();

                    var dateType = getStringDataType ( type );
                    var dateFormat = null;
                    var tooltipDateFormat = null;
                    
                    if ( type == 1 )
                    {
                        dateFormat = homUtil.dateFormat.convertHHMM;
                        tooltipDateFormat = homUtil.dateFormat.convertHHMM;
                    } else if ( type == 2 )
                    {
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertMMDD;
                    } else if ( type == 3 )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( type == 4 )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    var soc_text = getStringDataTypeText ( type );

                    // 충전량, 방전량, 목표 효율, 실적 효율, gap
                    var chargyArray = [];
                    var dischargyArray = [];
                    var socArray = [];

                    $.each ( json.data,
                            function ( index, item )
                            {
                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                chargyArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.chargy, 1 ) ] );
                                dischargyArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.dischargy, 1 ) ] );                             
                                socArray.push ( [ targetDate,
                                        homUtil.mathRoundChart ( item.soc, 1 ) ] );
                            } );

                    // 최소값 판단을 통해 min 값 세팅
                    var avaMinArray = [];
                    avaMinArray.push ( _.min ( _.pluck ( chargyArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( dischargyArray, [ 1 ] ) ) );
                    avaMinArray.push ( _.min ( _.pluck ( socArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var avaYaxis = {                       
                        title : {
                            text : i18nMessage.msg_word_electric_energy + i18nMessage.msg_kwh
                        }
                    };
                    var yieldTmYaxis = {
                        max : 100,
                        min : 0,
                        opposite : true,
                        title : {
                            text : soc_text + homUtil.wrapWord ( '%', '(', ')' )
                        }
                    };

                    if ( _.min ( avaMinArray ) > 0 )
                    {
                        avaYaxis.min = 0;
                    }                   
                    
                    yAxisArray.push ( avaYaxis );
                    yAxisArray.push ( yieldTmYaxis );

                    $ ( '#graph01' ).highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type1 ),
                        chart : {
                            marginTop : 20,
                            height : 313,
                            zoomType : 'x',
                            panning : true,
                            panKey : 'shift',
                            style: {
                                fontFamily: 'Nanum Gothic'
                            }  
                        },
                        title : {
                            text : '',
                            style : {
                                display : 'none',
                            }
                        },
                        subtitle : {
                            text : '',
                            style : {
                                display : 'none'
                            }
                        },
                        exporting : {
                            enabled : false
                        },
                        credits : {
                            enabled : false
                        },
                        xAxis : {
                            type : 'datetime',
                            labels : {
                                style : {
                                    color : '#3c3c3c'
                                },
                                formatter : function ()
                                {
                                    var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                                    return dateXAxis;
                                }
                            }
                        },
                        yAxis : yAxisArray,
                        tooltip : homUtil.generateTooltip ( tooltipDateFormat, 1 ),
                        plotOptions : {
                            column : {
                                pointPadding : 0,
                                borderWidth : 0
                            },
                            line : {
                                marker : {
                                    enabled : false
                                }
                            }
                        },
                        series : [ {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_chargy,
                            data : chargyArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_dischargy,
                            data : dischargyArray
                        },{
                            type : 'line',
                            yAxis : 1,// 하이차트 우측 설정
                            name : soc_text,
                            data : socArray
                        } ]
                    } );
                } else
                {
                    $btnExcel.hide ();
                    $btnAllJqgrid.hide ();

                    $graph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>' );
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

function chageRadio ()
{
    document.getElementById ( "radio1" ).get
}

$ ( '#search_option input' ).change ( function ()
		{
		    var type = $ ( '#search_option input[name="epaSel"]:checked' ).val ();
		    getPvEssChartList ( type );
		} );

function getStringDataType ( type )
{
    var value;
    var intType = Number ( type );
    switch ( intType )
    {
        case 1:
            value = "H";
            break;
        case 2:
            value = "D";
            break;
        case 3:
            value = "M";
            break;
        case 4:
            value = "Y";
            break;
        default:
            value = "D";
            break;
    }

    return value;
}
// PV ESS 충방전 조회
function searchPvEss ()
{
    var $gridList = $ ( '#gridList' );
    var $codMonitoringInfoPeriod = $ ( '#cod_monitoring_info_period' );
    var $searchPeriod = $ ( '#search_period' );
    var tpl = getTemplate ( templates.noData );
    {
    	getPvEssChartList ( 1 );
    }
}

function getStringDataTypeText ( type )
{
    var value;
    var intType = Number ( type );
    switch ( intType )
    {
        case 1:
            value = i18nMessage.msg_soc;
            break;
        case 2:
            value = i18nMessage.msg_soh;
            break;
        case 3:
            value = i18nMessage.msg_soh;
            break;
        case 4:
            value = i18nMessage.msg_soh;
            break;
        default:
            value = i18nMessage.msg_soh;
            break;
    }

    return value;
}

function createUpAndDownArrow ( stdrValue, ptValue )
{
    var upAndDownArrowInfo = getUpAndDownArrowInfo ( monitoringSummary.pvAcmsltRateList, ptValue );

    if ( $.isNumeric ( ptValue ) )
    {
        ptValue -= 100;
    }

    var html = '(<em ';
    if ( upAndDownArrowInfo.color !== '' )
    {
        html += 'style="color:' + upAndDownArrowInfo.color + ';"';
    }
    html += '><i>' + upAndDownArrowInfo.symbol + '</i>'
            + homUtil.mathAbsFloorComma ( ptValue, 1 ) + '%</em>)';
    html = homUtil.mathRoundComma ( stdrValue, 1 ) + html;

    return html;
}
// KPI 정보 조회
function getTotalKpiInfo ()
{
    // //hom/dashboard/siteKpiStatusInfo/siteKpiStatusInfo.do
    
    
    $.ajax ( {
        url : contextPath + '/hom/monitoring/ess/ess/selectPvEssKpi.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	 if ( json.data !== null )
                 {
            		 
            		 var avaty = homUtil.mathRoundComma (json.data.essGoalAvaty,1) 
            		 			+"<span class='per' style='color:"+ json.data.essAcmsltAvatyHexCd+"'>"
            		 			+"(<span class='arw'>"+json.data.essAcmsltAvatyUnicode+"</span>"
            		           +homUtil.mathRoundComma (json.data.essAcmsltAvatyRate, 1)+"%)</span>";
                
	                 $ ( '#kpi_avaty' ).text(homUtil.mathRoundComma (json.data.essAcmsltAvaty, 1));
	                 $ ( '#kpi_avaty_cng').html(avaty);
	                 
	                 var eff = homUtil.mathRoundComma (json.data.essGoalEfcny,1) 
		 		 			+"<span class='per' style='color:"+ json.data.essAcmsltEfcnyHexCd+"'>"
		 		 			+"(<span class='arw'>"+json.data.essAcmsltEfcnyUnicode+"</span>"
		 		           +homUtil.mathRoundComma (json.data.essAcmsltEfcnyRate, 1)+"%)</span>";
	                 
	                 $ ( '#kpi_eff' ).text(homUtil.mathRoundComma (json.data.essAcmsltEfcny, 1));
	                 $ ( '#kpi_eff_cng').html(eff);
	                 
	                 var soh = homUtil.mathRoundComma (json.data.essGoalSoh,1) 
	 		 			+"<span class='per' style='color:"+ json.data.essAcmsltSohHexCd+"'>"
	 		 			+"(<span class='arw'>"+json.data.essAcmsltSohUnicode+"</span>"
	 		           +homUtil.mathRoundComma (json.data.essAcmsltSohRate, 1)+"%)</span>";
	                
	                 
	                 $ ( '#kpi_soh' ).text(homUtil.mathRoundComma (json.data.essAcmsltSoh, 1));
	                 $ ( '#kpi_soh_cng').html(soh);  
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

//더보기 버튼 설정
/*function setBtnMore ()
{
    var $moreBox = $ ( '.more_detail_box' );
    var $btnMore = $ ( '.btn_more' );
    $btnMore.unbind ( 'click' );
    $btnMore.on ( 'click', function ( e )
    {
        $moreBox.toggleClass ( 'on' );
        if ( $moreBox.hasClass ( 'on' ) )
        {
            var position = $moreBox.outerHeight ( true ) / 2;
            if ( $.isNumeric ( position ) )
            {
                position *= -1;
                $moreBox.css ( 'top', position );
            }

            $moreBox.show ();
        } else
        {
            $moreBox.css ( 'top', 0 );
            $moreBox.hide ();
        }
        // e.preventDefault ();
    } );
}*/

//Summary info에
function getPvEssTagCacheInfo ()
{
    // //hom/dashboard/siteKpiStatusInfo/siteKpiStatusInfo.do
    var tpl = getTemplate ( templates.siteKpiTotalList );

    var $searchKey = $ ( "input[name=schTypeSel01]:checked" );
    var $searchValue = $ ( '#totalSiteschValue' );
    $.ajax ( {
        url : contextPath + '/hom/monitoring/ess/ess/selectPvEssCacheList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	
            	var pvStdrInfoVO = json.data;
                var pcsTagCount = json.data.pcsTagCount;
                
                var pcsTagIdList = json.data.pcsTagIds;       
                
                var neterrIcon = "<i class='ico_neterr'>Network Error</i>";
                
                // BMS 통신 상태
                var bmsNetState = json.data.bmsNetStateList; 
                var chkbmsNetState = Number ( bmsNetState[0] );
                if(chkbmsNetState == 0){
                	$("#bmsInfo").removeClass("off");
                }else{
                	
                	$("#bmsInfo").addClass("off");
                }
                
                // PCS 통신 상태
                var pcsNetState = json.data.pcsNetStateList;
                var chkPcsNetState = Number ( pcsNetState[0] );
                if(chkPcsNetState == 0){
                	$("#pcsInfo1").removeClass("off");
                	$("#pcsInfo2").removeClass("off");
                }else{
                	
                	$("#pcsInfo1").addClass("off");
                	$("#pcsInfo2").addClass("off");
                }
                
                //수전전력값
                var gipVal = json.data.gipVal;
                
                //송전전력값
                var gopVal = json.data.gopVal;
                
                var actualLoad = gipVal - gopVal;
                
                if($("#essInfo1").hasClass("off")){
                	$ ( '#gipVal' ).html(neterrIcon+homUtil.mathRoundComma (gipVal, 1));
                	$ ( '#gopVal' ).html(neterrIcon+homUtil.mathRoundComma (gopVal, 1));
                	if(actualLoad < 0){
                    	$ ( '#actualLoad' ).html(neterrIcon+"0");
                    }else{
                    	$ ( '#actualLoad' ).html(neterrIcon+homUtil.mathRoundComma (actualLoad, 1));
                    }
                }else{
                	$ ( '#gipVal' ).text(homUtil.mathRoundComma (gipVal, 1));
                	$ ( '#gopVal' ).text(homUtil.mathRoundComma (gopVal, 1));
                	if(actualLoad < 0){
                    	$ ( '#actualLoad' ).text("0");
                    }else{
                    	$ ( '#actualLoad' ).text(homUtil.mathRoundComma (actualLoad, 1));
                    }
                }
                
                //충전전력
                var ecpVal = json.data.ecpVal;
               
                //방전전력
                var edpVal = json.data.edpVal;
               
                //유효전력
                var tvpVal = json.data.tvpVal;
               
                //제어전력
                var capVal = json.data.capVal;
                

                //PEBB온도
                var pebbVal = json.data.pebbVal;
                
                
                if(chkPcsNetState == 0){
                	$ ( '#ecpVal' ).text(homUtil.mathRoundComma (ecpVal, 1));
                	$ ( '#edpVal' ).text(homUtil.mathRoundComma (edpVal, 1));
                	$ ( '#tvpVal' ).text(homUtil.mathRoundComma (tvpVal, 1));
                	$ ( '#capVal' ).text(homUtil.mathRoundComma (capVal, 1));
                	$ ( '#pebbVal' ).text(homUtil.mathRoundComma (pebbVal, 1));
                }else{
                	
                	$ ( '#ecpVal' ).html(neterrIcon+homUtil.mathRoundComma (ecpVal, 1));
                	$ ( '#edpVal' ).html(neterrIcon+homUtil.mathRoundComma (edpVal, 1));
                	$ ( '#tvpVal' ).html(neterrIcon+homUtil.mathRoundComma (tvpVal, 1));
                	$ ( '#capVal' ).html(neterrIcon+homUtil.mathRoundComma (capVal, 1));
                	$ ( '#pebbVal' ).html(neterrIcon+homUtil.mathRoundComma (pebbVal, 1));
                }
                
                //유효전력 리스트
                var tvpValList = json.data.tvpValList;      
                
                $.each ( tvpValList, function ( index, item )
                {
                   $("#activePower_"+index).text(homUtil.mathRoundComma (item, 1)+"kW");
                } );
              
                //제어전력 리스트
                var capValList = json.data.capValList;       
                
                $.each ( capValList, function ( index, item ){
                           $("#controlPower_"+index).text(homUtil.mathRoundComma (item, 1)+"kW");
                } );
                
                //PEBB 리스트
                var pebbValList = json.data.pebbValList;      
                
                $.each ( pebbValList, function ( index, item ){
                    $("#pebbTemperature_"+index).text(homUtil.mathRoundComma (item, 1)+"℃");
                } );
                
              
                
                //SOC(%)
                var socVal = json.data.socVal;
                
                
                //SOC 리스트
                var socValList = json.data.socValList;                                              
                
                $.each ( socValList, function ( index, item ){
                    $("#soc_"+index).text(homUtil.mathRoundComma (item, 1)+"%");
                } );
                
                
                //SOH(%)
                var sohVal = json.data.sohVal;
               
                
                //SOH 리스트
                var sohValList = json.data.sohValList;          
                
                $.each ( sohValList, function ( index, item ){
                    $("#soh_"+index).text(homUtil.mathRoundComma (item, 1)+"%");
                } );

                //모듈최고온도
                var bmtmpMaxVal = json.data.bmtmpMaxVal;
                
                //모듈최고온도 리스트
                var bmtmpMaxValList = json.data.bmtmpMaxValList;        
                
                $.each ( bmtmpMaxValList, function ( index, item ){
                    $("#maxTemper_"+index).text(homUtil.mathRoundComma (item, 1)+"℃");
                } );
                
               //모듈최저온도
                var bmtmpMinVal = json.data.bmtmpMinVal;
                               
                //모듈최저온도 리스트
                var bmtmpMinValList = json.data.bmtmpMinValList;  
                
                $.each ( bmtmpMinValList, function ( index, item ){
                    $("#minTemper_"+index).text(homUtil.mathRoundComma (item, 1)+"℃");
                } );
                
                
                //오프라인랙
                var oflnercVal = json.data.oflnercVal;
                
                
                //오프라인랙 리스트
                var oflnercValList = json.data.oflnercValList;                                               
              
                
                $.each ( oflnercValList, function ( index, item ){
                	  $("#onlineRack_"+index).text(homUtil.mathRoundComma (item, 0)+"EA");
                } );
                
                if(chkbmsNetState == 0){
                	$ ( '#socVal' ).text(homUtil.mathRoundComma (socVal, 1));
                	$ ( '#sohVal' ).text(homUtil.mathRoundComma (sohVal, 1));
                	$ ( '#bmtmpMaxVal' ).text(homUtil.mathRoundComma (bmtmpMaxVal, 1));
                	$ ( '#bmtmpMinVal' ).text(homUtil.mathRoundComma (bmtmpMinVal, 1));
                	$ ( '#oflnercVal' ).text(homUtil.mathRoundComma (oflnercVal, 0));
                }else{
                	
                	$ ( '#socVal' ).html(neterrIcon+homUtil.mathRoundComma (socVal, 1));
                	$ ( '#sohVal' ).html(neterrIcon+homUtil.mathRoundComma (sohVal, 1));
                	$ ( '#bmtmpMaxVal' ).html(neterrIcon+homUtil.mathRoundComma (bmtmpMaxVal, 1));
                	$ ( '#bmtmpMinVal' ).html(neterrIcon+homUtil.mathRoundComma (bmtmpMinVal, 1));
                	$ ( '#oflnercVal' ).html(neterrIcon+homUtil.mathRoundComma (oflnercVal, 0));
                	 
                }
                
                /*
                 * pcs, bms 장비 상태 관련
                 * 정상 : pcsFaultState = 0 AND pcsWarnState = 0
                 * 고장 : pcsFaultState = 1
                 * 경고 : pcsFaultState = 0 AND pcsWarnState = 1
                 * 
                 */
                
                // pcs운전상태
                var pcsRunState = json.data.pcsRunState;
                getMainDriveStatus ( $ ( '#pcsOperationSttus' ), json.data.pmsRunState );
                
                $.each ( pcsRunState, function ( index, item ){
                	getDriveStatus ( $ ( '#pcsOperationSttus_'+index), item );
                } );
                
                // pcs장비상태
                var pcsFaultState = json.data.pcsFaultState;               
              
                
                // pcs장비상태
                var pcsWarnState = json.data.pcsWarnState;
//                getMachineStatusRep ( $ ( '#pcsAlarmSttus' ), pcsFaultState, pcsWarnState, pcsNetState );
                getMachineStatus ( $ ( '#pcsAlarmSttus' ), json.data.pmsFaultState, json.data.pmsWarnState, json.data.pmsNetState );
                
                $.each ( pcsFaultState, function ( index, item ){
                	getMachineStatus ( $ ( '#pcsAlarmSttus_'+index ), item, pcsWarnState[index], pcsNetState[index]  );
                } );
                
                // pcs충전상태
                var pcsChargeState = json.data.pcsChargeState;
                getChargyStatus ( $ ( '#pcsChargeSttus' ), json.data.pmsChargeState );
                
                $.each ( pcsChargeState, function ( index, item ){
                	getChargyStatus ( $ ( '#pcsChargeSttus_'+index ), item );
                } );
                
                // bms운전상태
                var bmsRunState = json.data.bmsRunState;
                getMainDriveStatus ( $ ( '#batOperationSttus' ),json.data.pmsRunState);
                
                $.each ( bmsRunState, function ( index, item ){
                	getDriveStatus ( $ ( '#batOperationSttus_'+index ), item );
                } );

               
                
                var bmsFaultState = json.data.bmsFaultState;

                // bms장비상태
                var bmsWarnState = json.data.bmsWarnState;
//                getMachineStatusRep ( $ ( '#batAlarmSttus' ), bmsFaultState, bmsWarnState, bmsNetState );
                getMachineStatus ( $ ( '#batAlarmSttus' ), json.data.pmsFaultState, json.data.pmsWarnState, json.data.pmsNetState );
                
                $.each ( bmsFaultState, function ( index, item ){
                	getMachineStatus ( $ ( '#batAlarmSttus_'+index ), item, bmsWarnState[index], bmsNetState[index] );
                } );
                
                // bms충전상태
                var bmsChargeState = json.data.bmsChargeState;
                getChargyStatus ( $ ( '#batChargeSttus' ), json.data.pmsChargeState);    
                
                $.each ( bmsChargeState, function ( index, item ){
                	 getChargyStatus ( $ ( '#batChargeSttus_'+index ), item );  
                } );
                
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
function getDriveStatus ( $getId, type )
{
    var value;
    var classNm;
    var intType = Number ( type );
    switch ( intType )
    {
        case 0:
            value = i18nMessage.msg_stop; // 정지
            classNm = "dvc_status stoppg";
            break;
        case 1:
            value = i18nMessage.msg_clear; // 초기화
            classNm = "dvc_status inital";
            break;
        case 2:
            value = i18nMessage.msg_operation; // 운전
            classNm = "dvc_status runnng";
            break;
        default:
            value = ''; // 대기
        	classNm = "dvc_status stoppg";
            break;
    }
    $getId.text ( value );
    $getId.attr('class', classNm);
}

function getMainDriveStatus ( $getId, type )
{
    var value;
    var classNm;
    var intType = Number ( type );
    switch ( intType )
    {
        case 1:
            value = i18nMessage.msg_stop; // 정지
            classNm = "dvc_status stoppg";
            break;
        case 2:
            value = i18nMessage.msg_partillyOperation; // 초기화
            classNm = "dvc_status runnng";
            break;
        case 3:
            value = i18nMessage.msg_operation; // 운전
            classNm = "dvc_status runnng";
            break;
        default:
            value = ''; // 대기
        	classNm = "dvc_status stoppg";
            break;
    }
    $getId.text ( value );
    $getId.attr('class', classNm);
}

function getMachineStatus ( $getId, type, pcsFaultState, netState )
{
    var value;
    var classNm;
    var intType = Number ( type );
    var intType1 = Number ( pcsFaultState );
    var intType2 = Number ( netState );
    if(intType2 == 1){
    	value = i18nMessage.msg_mntrNetErr; // 고장
        classNm = "dvc_status neterr";
    }else if ( intType == 1 && intType1 == 1 )
    {
        value = i18nMessage.msg_mntrFault; // 고장
        classNm = "dvc_status broken";
    } else if ( intType == 1 && intType1 == 0 )
    {
        value = i18nMessage.msg_mntrFault; // 고장
        classNm = "dvc_status broken";
    } else if ( intType == 0 && intType1 == 1 )
    {
        value = i18nMessage.msg_mntrEqmtWarning; // 경고
        classNm = "dvc_status warnng";
    } else
    {
        value = i18nMessage.msg_mntrNormalOperation; // 정상
        classNm = "dvc_status normal";
    }

    $getId.text ( value );
    $getId.attr('class', classNm);
}



function getMachineStatusRep ( $getId, pcsFaultState, pcsWarnState, netState )
{
    var value;
    var classNm;
    var chkVal = 0;
    var intType;
   
	for(var i=0; i < netState.length; i++){
		intType = Number ( netState[i] );
		
		if(intType == 1){
	    	value = i18nMessage.msg_mntrNetErr; // 통신장애
	        classNm = "dvc_status neterr";
	        chkVal = 1;
	        break;
	    } 
	}
    	
	if(chkVal != 1){
		for(var i=0; i < pcsFaultState.length; i++){
    		intType = Number ( pcsFaultState[i] );
    		
    		if(intType == 1){
    			value = i18nMessage.msg_mntrFault; // 고장
    	        classNm = "dvc_status broken";
    	        chkVal = 1;
    	        break;
    	    } 
    	}
    	
    	if(chkVal != 1){
    		for(var i=0; i < pcsWarnState.length; i++){
        		intType = Number ( pcsWarnState[i] );
        		
        		if(intType == 1){
        			value = i18nMessage.msg_mntrEqmtWarning; // 경고
        		    classNm = "dvc_status warnng";
        	        chkVal = 1;
        	        break;
        	    } 
        	}
    	}
    	
    	if(chkVal != 1){
    		value = i18nMessage.msg_mntrNormalOperation; // 정상
            classNm = "dvc_status normal";
    	}
    	
	}

    $getId.text ( value );
    $getId.attr('class', classNm);
}

function getChargyStatus ( $getId, type )
{
    var value;
    var classNm;
    var intType = Number ( type );
    switch ( intType )
    {
        case 1:
            value = i18nMessage.msg_char_Chargy; // 충전
            classNm = "dvc_status charge";
            break;
        case 2:
            value = i18nMessage.msg_Waiting; // 대기
            classNm = "dvc_status waitng";
            break;
        case 3:
            value = i18nMessage.msg_DisCharge; // 방전
            classNm = "dvc_status dischg";
            break;
        default:
            value = ''; // 대기
        	classNm = "dvc_status waitng";
            break;
    }
    $getId.text ( value );
    $getId.attr('class', classNm);
}


//알람 상태 
function getEssAlarmStatus (  )
{
	$.ajax ( {
        url : contextPath + '/hom/monitoring/ess/ess/selectEssAlarmStatus.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {                
                
                var essAlarm = json.data.ESS;
                
                $("#essAlarm").attr('class', 'dvc_status '+essAlarm);
                var alarmText = "";
                
                if(essAlarm == "normal") {
                	alarmText = i18nMessage.msg_mntrNormal;
                }else if(essAlarm == "warnng"){
                	alarmText = i18nMessage.msg_mntrEqmtWarning;
                }else if(essAlarm == "broken"){
                	alarmText = i18nMessage.msg_mntrFault;
                }else if(essAlarm == "neterr"){
                	alarmText = i18nMessage.msg_mntrNetErr;
                }
                
                $("#essAlarm").text(alarmText);
                

                if(essAlarm == "neterr"){
                	$("#essInfo1").addClass("off");
                	$("#pvInfo1").addClass("off");
                }else{
                	$("#essInfo1").removeClass("off");
                	$("#pvInfo1").removeClass("off");
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

function initInterval ()
{  

	getEssAlarmStatus ();
	getPvEssTagCacheInfo();
    setInterval ( function ()
    {        
    	getEssAlarmStatus ();
    	getPvEssTagCacheInfo();
    }, monitoringSummary.interval.threeSecondTime );
    
    
    
    getTotalKpiInfo ();
    
    setInterval ( function ()
    {
       
        getTotalKpiInfo ();

    }, monitoringSummary.interval.minuteTime );

//    setInterval ( function ()
//    {
//        // 상업운전 이후 KPI 정보 조회
//        getAfterCodKpiInfo ();
//        // 상업운전 이후 KPI 차트 목록
//        getAfterCodKpiInfoList ();
//    }, monitoringSummary.interval.sixHourTime );
   
}

$ ( function ()
{
    monitoringSummary = {
            interval : {
                minuteTime : 1000 * 60,
                threeSecondTime : 1000 * 10,
                sixHourTime : 1000 * 60 * 60 * 6
            },
            pvAcmsltRateList : getPvAcmsltRateInfo ()
        };

    customizeForm ();
    customizeScroll ();
    searchPvEss();
	showPopup();
	// vTicker();
    moreAction();
    initInterval ();
} );