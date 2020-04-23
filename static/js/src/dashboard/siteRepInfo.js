var siteRepDashboard = null;
function selectCst(){

	var optTit = $('.select_cst .opt_tit');
	var selOpt = $('.select_cst .opt_box input:checked + label');
	var optLine = $('.opt_box input');

	optTit.text('');

	optTit.each(function(){
		var optTitTxt = $(this).next('.opt_box').find('input:checked').next('label').text();;
		$(this).text(optTitTxt);
	})

	optTit.click(function(){
		if($(this).hasClass('on')){
			optTit.removeClass('on');
			optTit.next('.opt_box').removeClass('on');
		} else {
			optTit.removeClass('on');
			optTit.next('.opt_box').removeClass('on');

			$(this).toggleClass('on');
			$(this).next('.opt_box').toggleClass('on');
		}
	});

	optLine.change(function(){
		var titTxt = $(this).next('label').text();
		var thisOptTit = $(this).parent('.opt_box').prev('.opt_tit');
		thisOptTit.text('');
		thisOptTit.text(titTxt);
		$(this).parent().removeClass('on');
		$(this).parent().prev('.opt_tit').removeClass('on');
	});

	optLine.click(function(){
		var titTxt = $(this).next('label').text();
		var thisOptTit = $(this).parent('.opt_box').prev('.opt_tit');
		thisOptTit.text('');
		thisOptTit.text(titTxt);
		$(this).parent().removeClass('on');
		$(this).parent().prev('.opt_tit').removeClass('on');
	});


	$(document).mouseup(function(e){
		var container = $('.select_cst');
		if(container.has(e.target).length === 0){
			optTit.removeClass('on');
			optTit.next('.opt_box').removeClass('on');
		}
	});
}

function customizeScroll ()
{
	$('.rep_lst').perfectScrollbar();
}

function dsGridLayout(){
	var winHeight = $(window).outerHeight();
	var headerGap = 440;
    var repLstMinHeight = winHeight - headerGap;

    $('.rep_lst').height(repLstMinHeight);
}

function repBoxAct(){
	var repBtn = $('.rep_lst > ul > li > a');
	var repCont = repBtn.parent('li');
	var repBox = $('.rep_lst');
	var repClsBtn = $('.rep_box .btn_cls');

	repBtn.click(function(){

		clearInterval(siteRepDashboard.interval.siteRepInterval);
		getSiteRepInfoPopup($(this).attr("value"));
		var repBtnPos = $(this).parent('li').position().top;

		if($(this).hasClass('on')){
			repBtn.removeClass('on');
			repBox.animate({scrollTop : repBtnPos}, 200);
		} else {
			repBtn.removeClass('on');
			$(this).addClass('on');
			repBox.animate({scrollTop : repBtnPos}, 200);
		}
		// console.log(repBtnPos);

	});

	repClsBtn.click(function(){		
		if(repBtn.hasClass('on')){
			repBtn.removeClass('on');
			siteRep ();
		}
	});

	$(document).mouseup(function(e){
		if(repCont.has(e.target).length === 0){
			if(repBtn.hasClass('on')){
				repBtn.removeClass('on');
				siteRep ();
			}
		}
	});
}

function counterAct(){
	var counterAllNum = $(".cnt_box_all").text()
	var counterNormal = $(".cnt_box_normal").text()
	var counterBroken = $(".cnt_box_broken").text()
	var counterWarnng = $(".cnt_box_warnng").text()
	var counterNeterr = $(".cnt_box_neterr").text()

	siteRepDashboard.clock.counterAll = new FlipClock($('.cnt_box_all'), counterAllNum, {
		clockFace: 'Counter',
		minimumDigits: 5
	});

	siteRepDashboard.clock.counterNormal = new FlipClock($('.cnt_box_normal'), counterNormal, {
		clockFace: 'Counter',
		minimumDigits: 5
	});

	siteRepDashboard.clock.counterBroken = new FlipClock($('.cnt_box_broken'), counterBroken, {
		clockFace: 'Counter',
		minimumDigits: 5
	});

	siteRepDashboard.clock.counterWarnng = new FlipClock($('.cnt_box_warnng'), counterWarnng, {
		clockFace: 'Counter',
		minimumDigits: 5
	});

	siteRepDashboard.clock.counterNeterr = new FlipClock($('.cnt_box_neterr'), counterNeterr, {
		clockFace: 'Counter',
		minimumDigits: 5
	});
}

$(window).resize(function() {
    dsGridLayout();
});

function clickBizTypeCheckBox ()
{
	$('input[name=filterDvc]').click(function(){
		var bizType ="";
		$("input[name=filterDvc]:checked").each(function() {

			if(bizType == ""){
				bizType = $(this).val();
			}else{
				bizType = bizType+","+$(this).val();
			}	
		});
		siteRepDashboard.sel.bizType = bizType;
		getSiteRepInfo ();
		getSiteRepInfoForHead ();
		
	});
}

function initSearchBox ()
{
	$('#btnSearchTotal').click(function(){
		var bizType ="";
		$("input[name=filterDvc]:checked").each(function() {

			if(bizType == ""){
				bizType = $(this).val();
			}else{
				bizType = bizType+","+$(this).val();
			}	
		});
		siteRepDashboard.sel.bizType = bizType;
		
		getSiteRepInfo ();
		getSiteRepInfoForHead ();
	});	
	
	$("#allOn").click(function(){ 
    	$("#areaInfo input[type=checkbox]").prop("checked",true);
    });
    
    $("#allOff").click(function(){ 
    	$("#areaInfo input[type=checkbox]").prop("checked",false);
    });
    
    $("#btn_apyNation").click(function(){ 
    	
    	var selNationIds = "";
		$("#areaInfo input[type=checkbox]:checked").each(function() {

			if(selNationIds == ""){
				selNationIds = $(this).val();
			}else{
				selNationIds = selNationIds+","+$(this).val();
			}	
		});
		siteRepDashboard.selSite.nation = selNationIds;
		
		getSiteRepInfo ();
		getSiteRepInfoForHead ();  
    });	
	
}

function getCntintPvInfo ()
{
	var $areaInfo = $ ( '#areaInfo' );
		
	var tpl = getTemplate ( templates.pvCntintInfo );
	
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/pvResourceCrst/getCntintPvInfo.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	//console.log ( json.data );
            	
            	var resultData = json.data;
            	$areaInfo.empty ();
            	
            	for ( var key in resultData )
            	{
            		var cntint ;
            		var pvInfo = [] ;
            		
            		cntint = key; 
            		pvInfoList = resultData[key];
            		
            		if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            continent : pvInfoList[0].cntintKorNm,
                            pvList : pvInfoList,
                            unit : '개소'
                        } );
                        $areaInfo.append ( html )
                    }
                	
            	}
            	$("#areaInfo input[type=checkbox]").prop("checked",true);
            	
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
    });
}


function getSiteRepInfoForHead ()
{
	
	
	var $searchKey = $("input[name=schTypeSel01]:checked");
	var $searchValue = $ ( '#totalSiteschValue' );	

	$.ajax ( {
        url : contextPath + '/hom/dashboard/siteRepInfo/selectSiteRepInfoForHead.ajax',
        type : 'POST',
        data : {
        	nationId : siteRepDashboard.selSite.nation,
        	bizType : siteRepDashboard.sel.bizType,
        	searchKey : $searchKey .val (),
            searchKeyword : $searchValue.val ()
        },        
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	var resultData = json.data;
            	
            	if(resultData == null|| resultData == '')
            	{
            		siteRepDashboard.clock.counterAll.setTime(0);
            		siteRepDashboard.clock.counterNormal.setTime(0);
            		siteRepDashboard.clock.counterBroken.setTime(0);
            		siteRepDashboard.clock.counterWarnng.setTime(0);
            		siteRepDashboard.clock.counterNeterr.setTime(0);
            	}else{
            		siteRepDashboard.clock.counterAll.setTime(resultData.totalCnt);
            		siteRepDashboard.clock.counterNormal.setTime(resultData.normalCnt);
            		siteRepDashboard.clock.counterBroken.setTime(resultData.faultCnt);
            		siteRepDashboard.clock.counterWarnng.setTime(resultData.warningCnt);
            		siteRepDashboard.clock.counterNeterr.setTime(resultData.netErrCnt);
            		
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


function getSiteRepInfo ()
{
	
	
	var $searchKey = $("input[name=schTypeSel01]:checked");
	var $searchValue = $ ( '#totalSiteschValue' );
	var tplPvEss = getTemplate ( templates.siteRepLi );

	
	    
	
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/siteRepInfo/selectSiteRepInfo.ajax',
        type : 'POST',
        data : {
        	nationId : siteRepDashboard.selSite.nation,
        	bizType : siteRepDashboard.sel.bizType,
        	searchKey : $searchKey .val (),
            searchKeyword : $searchValue.val ()
        },        
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	
            	
            	//기존 정보 삭제
            	$ ( '#repList ul li' ).remove();
            	var siteRepInfoList = json.data;
            	var template;
            	 
            	template = _.template ( tplPvEss );   		
        		var html = template ( {
        			siteRepInfoList : siteRepInfoList
                 } );      
            	
            	$ ( '#repList ul' ).append ( html );
            	repBoxAct();
            	$('.rep_lst').scrollTop(0);
            	
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

function getSiteRepInfoPopup (pvId)
{
    var tplPvEss = getTemplate ( templates.siteRepPvEssPopup ); 
    
    var selectedRep = $("#rep_"+pvId).parent('li');
    
    $.ajax ( {
        url : contextPath + '/hom/dashboard/siteRepInfo/selectSiteRepInfoPopup.ajax',
        type : 'POST',
        data : {
            pvId : pvId
        },        
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {               
                var template = _.template ( tplPvEss );         
                var html = template ( {
                    itemInfo : json.data.siteRepInfoList,
                    alarmInfo : json.data.alarmInfo,
                 } );      
                selectedRep.append ( html );
                
                var repClsBtn = $('.rep_box .btn_cls');
                
                var repBtn = $('.rep_lst > ul > li > a');
                
                repClsBtn.click(function(){     
                    if(repBtn.hasClass('on')){
                        repBtn.removeClass('on');
                        siteRep ();
                    }
                });
                
                $('.eve_log ul').perfectScrollbar();
                
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                console.log(json.message);
               
            }
        },
        error : function ( xhr, textStatus, error )
        {
            // abort error not show(user request cancel or aborted)
            console.log(textStatus);
        }
    } );
}


function reloadInfo()
{
	getSiteRepInfo ();
	getSiteRepInfoForHead ();
}
//Dashboard 화면 초기화
function siteRep ()
{
	siteRepDashboard.interval.siteRepInterval = setInterval ( "reloadInfo()", siteRepDashboard.interval.TIME );

}

//event listener 설정
function setEventListener ()
{
    var $btn_totalSiteschValue = $ ( '#totalSiteschValue' );    

    var $searchKey = $ ( '#search_type' );
    var $searchValue = $ ( '#searchValue' );
   
    $btn_totalSiteschValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
        	getSiteRepInfo ();
    		getSiteRepInfoForHead ();
        }
    } );
    

}

$(function ()
{
	siteRepDashboard = {
	        interval : {
	            TIME : (1000  * 10),
	            siteRepInterval : null
	        },
	        tpl : {
	        	dashboardNoData : getTemplate ( templates.dashboardNoData )
	        },
	        loadFlag : {
	            siteKpi : true
	        },
	        unit : {
	            rdtnUniNm : null
	        },
	        selSite : {
	            nation : "ALL"	           
	        },
	        sel : {
	            bizType : "BSN01,BSN02,BSN03,BSN04"
	        },
	        clock : {
	        	counterAll : null,
	        	counterNormal : null,
	        	counterBroken : null,
	        	counterWarnng : null,
	        	counterNeterr : null
	        }
	    };
	selectCst();
	customizeScroll ();
	dsGridLayout();
	counterAct();
	repBoxAct();
	getCntintPvInfo ();
	initSearchBox ();
	clickBizTypeCheckBox ();
	getSiteRepInfo ();
	getSiteRepInfoForHead ();
	siteRep ();
	setEventListener ();
});