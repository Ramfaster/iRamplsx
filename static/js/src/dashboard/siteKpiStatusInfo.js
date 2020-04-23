var siteKpiDashboard = null;
function dsKPITabAct(){
  $(".tab_content").hide().first().show();
  $(".tab.kpi li:first").addClass("on");

  $(".tab.kpi a").on('click', function (e) {
    e.preventDefault();
    if($(this).attr('href')=='#totalKPI')
    {    	
    	initSearchValue();
    	siteKpiDashboard.sel.tab = '#totalKPI';    	
    	$ ( '#pvEssSiteList tr').remove();
    	$ ( '#essSiteList  tr').remove();
    	$ ( '#pvSiteList tr').remove();
    	getTotalKpiInfo ();
    }else if($(this).attr('href')=='#pvessSite')
    {
    	initSearchValue();
    	siteKpiDashboard.sel.tab = '#pvessSite';
    	
    	$ ( '#totalKpiList ul li' ).remove();
    	$ ( '#essSiteList  tr').remove();
    	$ ( '#pvSiteList tr').remove();
    	getPvEssKpiInfo ();
    }else if($(this).attr('href')=='#essSite')
    {
    	initSearchValue();
    	siteKpiDashboard.sel.tab = '#essSite';
    	
    	$ ( '#totalKpiList ul li' ).remove();
    	$ ( '#pvEssSiteList tr').remove();
    	$ ( '#pvSiteList tr').remove();
    	getEssKpiInfo ();
    }else if($(this).attr('href')=='#pvSite')
    {
    	initSearchValue();
    	siteKpiDashboard.sel.tab = '#pvSite';
    	
    	$ ( '#totalKpiList ul li' ).remove();
    	$ ( '#pvEssSiteList tr').remove();
    	$ ( '#essSiteList  tr').remove();
    	getPvKpiInfo ();
    }
    $(this).closest('li').addClass("on").siblings().removeClass("on");
    $($(this).attr('href')).show().siblings('.tab_content').hide();
  });
}

function initSearchValue()
{
	$ ( '#totalSiteschValue' ).val('');
	$ ( '#pvEssSiteschValue' ).val('');
	$ ( '#essSiteschValue' ).val('');
	$ ( '#pvSiteschValue' ).val('');
}
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


function selectCstAdd(id){

	var optTit = $("#"+id).find('.select_cst .opt_tit');
	var selOpt = $("#"+id).find('.select_cst .opt_box input:checked + label');
	var optLine = $("#"+id).find('.opt_box input');

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
	$('.total_kpi_lst .lst_bd').perfectScrollbar();
	$('.pv_ess_lst .intbl_scrl').perfectScrollbar();
	$('.sel_con > .area > .box').perfectScrollbar();
}

function dsGridLayout(){
	var winHeight = $(window).outerHeight();
    var headerHeight = $('.header').outerHeight();

    var headerGap = 50;
    var contTabHeight =  39;
    var utilLineHeight = 61;
    var listHeadHeight = 40;
    var tabContHdHeight = headerGap + contTabHeight + utilLineHeight + listHeadHeight;
    var footerHeight = $('.footer').outerHeight() + 21;
    var contMinHeight = winHeight - headerHeight - footerHeight - tabContHdHeight - 29;
    var pvEssLstMinHeight = winHeight - headerHeight - footerHeight - tabContHdHeight - 59;

    $('.total_kpi_lst .lst_bd').height(contMinHeight);
    $('.pv_ess_lst .intbl_scrl').css('max-height', pvEssLstMinHeight + 'px');
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
		siteKpiDashboard.sel.bizType = bizType;
		
		getTotalKpiInfo ();
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
		siteKpiDashboard.sel.bizType = bizType;
		
		getTotalKpiInfo ();
	});
	
	$('#btnSearchPvEss').click(function(){
	
		getPvEssKpiInfo ();
	});
	
	$('#btnSearchEss').click(function(){
		  	
		getEssKpiInfo ();
	});
	
	$('#btnSearchPv').click(function(){
		
		getPvKpiInfo ();
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
		siteKpiDashboard.selSite.nation = selNationIds;
		
    	if(siteKpiDashboard.sel.tab == '#totalKPI'){
    		
    		getTotalKpiInfo ();
    		
    	} else if(siteKpiDashboard.sel.tab == '#pvessSite'){
    		
    		getPvEssKpiInfo ();
    		
    	}  else if(siteKpiDashboard.sel.tab == '#essSite'){
    		
    		getEssKpiInfo ();
    		
    	}  else if(siteKpiDashboard.sel.tab == '#pvSite'){
    		
    		getPvKpiInfo ();
    		
    	}  
    });	
    
    $("#btnDetailApy").click(function(){ 
    	
    	var sortColumns = "";
    	var sortMethods = "";
    	var fromValues = "";
    	var toValues = "";
    	var colId = "input[name=selDtl01]:checked";
		var methodId = "input[name=selDtl02]:checked"; 
		
		sortColumns = $(colId).val();
		sortMethods = $(methodId).val();
		
		if($("#inputDetailFrom").val() == "")
		{
			fromValues = "CHECK_VALUE";
		}else{
			fromValues = $("#inputDetailFrom").val();
		}
		if($("#inputDetailTo").val() == "")
		{
			toValues = "CHECK_VALUE";
		}else{
			toValues = $("#inputDetailTo").val();
		}    
		
		
    	for(var i=0; i < siteKpiDashboard.detail.idx; i++)
    	{
    		colId = "input[name=selDtl01"+i+"]:checked";
    		methodId = "input[name=selDtl04"+i+"]:checked"; 
    		if($("#inputDtl0501"+i).val() != undefined)
    		{		
	    		if(sortColumns == "")
	    		{
	    			sortColumns = $(colId).val();
	    			sortMethods = $(methodId).val();
	    			if($("#inputDtl0501"+i).val() == "")
	    			{
	    				fromValues = "CHECK_VALUE";
	    			}else{
	    				fromValues = $("#inputDtl0501"+i).val();
	    			}
	    			if($("#inputDtl0601"+i).val() == "")
	    			{
	    				toValues = "CHECK_VALUE";
	    			}else{
	    				toValues = $("#inputDtl0601"+i).val();
	    			}    			
	    		}else
	    		{
	    			sortColumns = sortColumns+","+$(colId).val();
	    			sortMethods = sortMethods+","+$(methodId).val();
	    			if($("#inputDtl0501"+i).val() == "")
	    			{
	    				fromValues = fromValues+","+"CHECK_VALUE";
	    			}else{
	    				fromValues = fromValues+","+$("#inputDtl0501"+i).val();
	    			}
	    			if($("#inputDtl0601"+i).val() == "")
	    			{
	    				toValues = toValues+","+"CHECK_VALUE";
	    			}else{
	    				toValues = toValues+","+$("#inputDtl0601"+i).val();
	    			}    
	    		}   
    		}
    	}
    	siteKpiDashboard.detail.sortColumns = sortColumns;
    	siteKpiDashboard.detail.sortMethods = sortMethods;
    	siteKpiDashboard.detail.fromValues = fromValues;
    	siteKpiDashboard.detail.toValues = toValues;
		
    	getTotalKpiInfo ();
    });	
    
    $("#btnDetailCancel").click(function(){ 
    	
    	for(var i=0; i < siteKpiDashboard.detail.idx; i++)
    	{    		
    		var detailOpt = $("#detatilCondition"+i).find('.line_ctr');
    		 $ ( detailOpt ).closest ( 'div' ).parent('li').remove ();
    		
    	}
    	siteKpiDashboard.detail.sortColumns = "";
    	siteKpiDashboard.detail.sortMethods = "";
    	siteKpiDashboard.detail.fromValues = "";
    	siteKpiDashboard.detail.toValues = "";
    	siteKpiDashboard.detail.idx = 0;
    });	
	
}

//엑셀 다운로드
function clickBtnExcel ()
{
    var $btnPvEssExcel = $ ( '#btn_excel_pvess' );
    var $btnEssExcel = $ ( '#btn_excel_ess' );
    var $btnPvExcel = $ ( '#btn_excel_pv' );
    var $btnExcelTotal = $ ( '#btn_excel_total' );
    
   
	
	$btnPvEssExcel.on ( 'click', function ()
    {
		var $searchKey = $("input[name=schTypeSel02]:checked");
		var $searchValue = $ ( '#pvEssSiteschValue' );
        //
        var params = {
        		nationId : siteKpiDashboard.selSite.nation,
            	searchKey : $searchKey .val (),
                searchKeyword : $searchValue.val ()
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    } );
	
	$btnEssExcel.on ( 'click', function ()
    {
		var $searchKey = $("input[name=schTypeSel03]:checked");
		var $searchValue = $ ( '#essSiteschValue' );
        //
        var params = {
        		nationId : siteKpiDashboard.selSite.nation,
            	searchKey : $searchKey .val (),
                searchKeyword : $searchValue.val ()
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    } );
	
	$btnPvExcel.on ( 'click', function ()
    {
		var $searchKey = $("input[name=schTypeSel04]:checked");
		var $searchValue = $ ( '#pvSiteschValue' );
        //
        var params = {
        		nationId : siteKpiDashboard.selSite.nation,
            	searchKey : $searchKey .val (),
                searchKeyword : $searchValue.val ()
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    } );

	$btnExcelTotal.on ( 'click', function (){
		var $searchKey = $("input[name=schTypeSel01]:checked");
		var $searchValue = $ ( '#totalSiteschValue' );
		
		var params = {
        		nationId : siteKpiDashboard.selSite.nation,
            	searchKey : $searchKey .val (),
                searchKeyword : $searchValue.val ()
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    });
	 
//    $btnExcelTotal.on ( 'click', function (){
//    	 document.frm.action = contextPath+"/excel.jsf";
//    	 document.frm.excel_data.value = document.getElementById("mainBody").outerHTML;
//    	 document.frm.submit();
//    });
}


function initDetailSearch()
{
	var tpl = getTemplate ( templates.siteKpidetailSchList );
	
	$("#btnAddDetailCondition").click(function(){ 
		
		if($("#divDetail > li").length >= 8)
		{
			 $.customizeDialog ( {
                 template : templates.dialog,
                 message : i18nMessage.msg_alertCanNotAdd,
                 checkText : i18nMessage.msg_ok,
                 cancelText : i18nMessage.msg_cancel,
                 type : staticVariable.dialogTypeInfo
             } );
			
		}else
		{
			if ( tpl !== null )
	        {
	            var template = _.template ( tpl );
	            var html = template ( {
	                column : $("input[name=selDtl01]:checked").val(),
	                sort : $("input[name=selDtl02]:checked").val(),
	                from : $("#inputDetailFrom").val(),
	                to : $("#inputDetailTo").val(),
	                id : "detatilCondition"+siteKpiDashboard.detail.idx,
	                idx : siteKpiDashboard.detail.idx
	            } );
	            $("#divDetail").append ( html );
	            selectCstAdd("detatilCondition"+siteKpiDashboard.detail.idx);
	            deleteDetailCondition ("detatilCondition"+siteKpiDashboard.detail.idx);
	            siteKpiDashboard.detail.idx++
	        }
		}
		
    });
}


//상세 검색 행 제거
function deleteDetailCondition (id)
{
	var detailOpt = $("#"+id).find('.line_ctr');
	detailOpt.click(function(){
		 $ ( this ).closest ( 'div' ).parent('li').remove ();
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

function getTotalKpiInfo ()
{
	var tpl = getTemplate ( templates.siteKpiTotalList );
	
	var $searchKey = $("input[name=schTypeSel01]:checked");
	var $searchValue = $ ( '#totalSiteschValue' );
	    
	
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/siteKpiStatusInfo/selectTotalKpiInfo.ajax',
        type : 'POST',
        data : {
        	nationId : siteKpiDashboard.selSite.nation,
        	bizType : siteKpiDashboard.sel.bizType,
        	searchKey : $searchKey .val (),
            searchKeyword : $searchValue.val (),
            sortColumns : siteKpiDashboard.detail.sortColumns,
    		sortMethods : siteKpiDashboard.detail.sortMethods,
    		fromValues : siteKpiDashboard.detail.fromValues,
    		toValues : siteKpiDashboard.detail.toValues
        },        
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	 if ( tpl !== null )
                 {
                     var template = _.template ( tpl );
                     var html = template ( {
                    	 siteKpiInfoList : json.data
                     } );
                   //기존 정보 삭제
                 	$ ( '#totalKpiList ul li' ).remove();

                     $ ( '#totalKpiList ul' ).append ( html );
                     
                     $('.lst_bd').scrollTop(0);
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

function getPvEssKpiInfo ()
{
	var tpl = getTemplate ( templates.siteKpiPvEssList );
	
	var $searchKey = $("input[name=schTypeSel02]:checked");
	var $searchValue = $ ( '#pvEssSiteschValue' );
	
	
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/siteKpiStatusInfo/selectPvEssKpiInfo.ajax',
        type : 'POST',
        data : {
        	nationId : siteKpiDashboard.selSite.nation,
        	searchKey : $searchKey .val (),
            searchKeyword : $searchValue.val ()
        },        
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	 if ( tpl !== null )
                 {
                     var template = _.template ( tpl );
                     var html = template ( {
                    	 siteKpiInfoList : json.data
                     } );

                   //기존 정보 삭제
                 	$ ( '#pvEssSiteList tr' ).remove();
                 	
                     $ ( '#pvEssSiteList' ).append ( html );
                     
                     $('.lst_bd').scrollTop(0);
                     
                     //장비 알람 상태 set
                     setAlarmStatus();
                     
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

function getEssKpiInfo ()
{
	var tpl = getTemplate ( templates.siteKpiEssList );
	
	var $searchKey = $("input[name=schTypeSel03]:checked");
	var $searchValue = $ ( '#essSiteschValue' );
	
	
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/siteKpiStatusInfo/selectEssKpiInfo.ajax',
        type : 'POST',
        data : {
        	nationId : siteKpiDashboard.selSite.nation,
        	searchKey : $searchKey .val (),
            searchKeyword : $searchValue.val ()
        },        
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	 if ( tpl !== null )
                 {
                     var template = _.template ( tpl );
                     var html = template ( {
                    	 siteKpiInfoList : json.data
                     } );

                   //기존 정보 삭제
                 	$ ( '#essSiteList tr' ).remove();
                 	
                     $ ( '#essSiteList' ).append ( html );
                     
                     $('.lst_bd').scrollTop(0);
                     
                     //장비 알람 상태 set
                     setAlarmStatus();
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

function getPvKpiInfo ()
{
	var tpl = getTemplate ( templates.siteKpiPvList );
	
	var $searchKey = $("input[name=schTypeSel04]:checked");
	var $searchValue = $ ( '#pvSiteschValue' );
	
	
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/siteKpiStatusInfo/selectPvKpiInfo.ajax',
        type : 'POST',
        data : {
        	nationId : siteKpiDashboard.selSite.nation,
        	searchKey : $searchKey .val (),
            searchKeyword : $searchValue.val ()
        },        
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	 if ( tpl !== null )
                 {
                     var template = _.template ( tpl );
                     var html = template ( {
                    	 siteKpiInfoList : json.data
                     } );

                   //기존 정보 삭제
                 	$ ( '#pvSiteList tr').remove();
                 	
                     $ ( '#pvSiteList' ).append ( html );
                     
                     $('.lst_bd').scrollTop(0);
                 }
            	 
                 //장비 알람 상태 set
                 setAlarmStatus();
            	 
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
function reload()
{
	if(siteKpiDashboard.sel.tab == '#totalKPI'){
		
		getTotalKpiInfo ();
		
	} else if(siteKpiDashboard.sel.tab == '#pvessSite'){
		
		getPvEssKpiInfo ();
		
	}  else if(siteKpiDashboard.sel.tab == '#essSite'){
		
		getEssKpiInfo ();
		
	}  else if(siteKpiDashboard.sel.tab == '#pvSite'){
		
		getPvKpiInfo ();
		
	}  
}

// Dashboard 화면 초기화
function siteKpi ()
{
	setInterval ( "reload()", siteKpiDashboard.interval.TIME );

}

//event listener 설정
function setEventListener ()
{
    var $btn_totalSiteschValue = $ ( '#totalSiteschValue' );
    var $btn_pvEssSiteschValue = $ ( '#pvEssSiteschValue' );
    var $btn_essSiteschValue = $ ( '#essSiteschValue' );
    var $btn_pvSiteschValue = $ ( '#pvSiteschValue' );
  
    $btn_totalSiteschValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
        	 getTotalKpiInfo ();
        }
    } );
    
    $btn_pvEssSiteschValue.keypress ( function ( event )
    	    {
    	        if ( event.keyCode === 13 )
    	        {
    	        	getPvEssKpiInfo ();
    	        }
    	    } );
    
    $btn_essSiteschValue.keypress ( function ( event )
    	    {
    	        if ( event.keyCode === 13 )
    	        {
    	        	getEssKpiInfo ();
    	        }
    	    } );
    
    $btn_pvSiteschValue.keypress ( function ( event )
    	    {
    	        if ( event.keyCode === 13 )
    	        {
    	        	getPvKpiInfo ();
    	        }
    	    } );

}

//알람상태 : 서버에 있는 알람상태 가져오는 부분이 시간이 많이 걸려서 화면로딩 후 ajax로 발전소별로 상태정보를 가져 옴. 
function setAlarmStatus ()
{
    //webapp/template/dashboard/sectorList.html 에 있는   아래 속성이 있는 span list를 가져 온 후 상태정보 업데이트.
    //<span class="dvc_status normal" alarm_status pv_id="{{=itemInfo.pvId}}" biz_ty="{{=itemInfo.bizTy}}"></span>
    var $alarm_status_list = $ ( '*[alarm_status]' );
    
    $.each ( $alarm_status_list, function ( index, item )
    {
        getAlarmStatus($(this).attr('pv_id'),$(this).attr('biz_ty'), $(this));    
    } );
    
}


function getAlarmStatus (pvId, bizTy, $span)
{
    
    $.ajax ( {
        url : contextPath + '/hom/dashboard/sector/getAlarmStatus.ajax',
        type : 'POST',
        data : {
            pvId : pvId,
            bizTy : bizTy
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alarmLevel = json.data;
                
                if(alarmLevel === 'ALVL01') {
                    $span.attr('class','dvc_status normal');
                    $span.text(i18nMessage.msg_mntrNormal);                    
                } else if(alarmLevel === 'ALVL02') {
                    $span.attr('class','dvc_status warnng');   
                    $span.text(i18nMessage.msg_mntrEqmtWarning);                    
                } else if(alarmLevel === 'ALVL03') {
                    $span.attr('class','dvc_status broken');
                    $span.text(i18nMessage.msg_mntrFault);                    
                } else if(alarmLevel === 'ALVL04') {
                    $span.attr('class','dvc_status neterr'); 
                    $span.text(i18nMessage.msg_mntrNetErr);                    
                } else  {
                    $span.attr('class','dvc_status normal'); 
                    $span.text(i18nMessage.msg_mntrNormal);                    
                }

            } else if ( json.status === staticVariable.jsonStatusError )
            {
                //loop 를 돌면서 span tag 단위로 처리되므로 에러 발생할 경우 에러 메시지를 화면에 alert 처리하지 않고 상태정보만 '' 로 처리.
                $span.attr('class','dvc_status normal');
                $span.text('');                    

            }
        },
        error : function ( xhr, textStatus, error )
        {
            //loop 를 돌면서 span tag 단위로 처리되므로 에러 발생할 경우 에러 메시지를 화면에 alert 처리하지 않고 상태정보만 '' 로 처리.
            $span.attr('class','dvc_status normal');
            $span.text('');                    
        }
    } );
    
}


$(function ()
{
	siteKpiDashboard = {
	        interval : {
	            TIME : (1000 * 60),
	            siteKpiInterval : null
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
	            tab : '#totalKPI',
	            bizType : "BSN01,BSN02,BSN03,BSN04"
	        },
	        detail : {
	            idx : 0,
	            sortColumns : "",
				sortMethods : "",
				fromValues : "",
				toValues : ""
	        }
	    };
	initSearchBox ();
	dsKPITabAct();
	selectCst();
	customizeScroll ();
	dsGridLayout();
	clickBizTypeCheckBox ();
	getCntintPvInfo();
	getTotalKpiInfo ();
	deleteDetailCondition ();
	initDetailSearch();
	clickBtnExcel ();
	siteKpi ();
	setEventListener ();
});