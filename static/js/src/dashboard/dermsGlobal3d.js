var dermsDashboardInfo = null;
var globe3d = null;

//UnityLoader.instantiate("globeArea", contextPath+"/globe3d/build/ESSGlobe.json", {onProgress: UnityProgress});

$ ( function ()
{
	var browser = browserCheck();
	
	if ( browser == 'chrome' || browser == 'edge' || browser == 'firefox')
	{
		$("#loadingBar").show();
		globe3d = UnityLoader.instantiate("globeArea", contextPath+"/globe3d/build/ESSGlobe.json", {onProgress: UnityProgress});
	}
	else
	{
		$("#browserInfo").show();
	}	
	
    dermsDashboardInfo = {
        map : null,
        sttus : null,
        nationId : null,
        pvMarkers : [],
        nationMarkers : [],
        cntintMarkers : [],
        tpl : {
        	cntintArea : getTemplate ( templates.cntintInfo ),
        	nationPvArea : getTemplate ( templates.nationPvCount ),
        	nationPvDtlArea : getTemplate ( templates.nationPvDtl ),
        	nationSttusArea : getTemplate ( templates.nationSttus ),
        	pvDtlInfoArea : getTemplate ( templates.pvDtlInfo ),
        	markerLabel : getTemplate ( templates.markerLabel )
        },
        interval : {
            TIME : 1000 * 10,
        },
        ZOOM : {
            MIN_ZOOM_LEVEL : 3,
            MAX_ZOOM_LEVEL : 13,
            CONTINENT_ZOOM_LEVEL : 3,
            NATION_ZOOM_LEVEL : 6,
            POWERSTATION_ZOOM_LEVEL : 7
        },
        TYPE : {
            CONTINENT : 'continent',
            NATION : 'nation',
            POWERSTATION : 'powerstation'
        },        
	    continent : {
	        LAT : 27.663999,
	        LNG : 145,
	        NORTH : 85,
	        SOUTH : -85,
	        CAPACITY_LEGEND : {
	            RANGE1 : 50000,
	            RANGE2 : 100000
	        },
	        TYPE : {
	            ASIA : 'CT01',
	            AMERICA : 'CT02',
	            EUROPE : 'CT03',
	            AFRICA : 'CT04',
	            OCEANIA : 'CT05',
	            ANTARCTICA : 'CT06'
	        },
	        geojson : {
	            asia : {
	                FILL_COLOR : '#ffb230',
	                STROKE_COLOR : '#eb8e14'
	            },
	            america : {
	                FILL_COLOR : '#ff6022',
	                STROKE_COLOR : '#ca3a0d'
	            },
	            europe : {
	                FILL_COLOR : '#4979f4',
	                STROKE_COLOR : '#415aa0',
	            },
	            africa : {
	                FILL_COLOR : '#767676',
	                STROKE_COLOR : '#626262',
	            },
	            oceania : {
	                FILL_COLOR : '#60b193',
	                STROKE_COLOR : '#259f73',
	            },
	            antarctica : {
	                FILL_COLOR : '#c8fdff',
	                STROKE_COLOR : '#70bde0'
	            }
	        }
	    }    
    };
    
	$('.sel_con > .area > .box').perfectScrollbar();
	$('.sts_box_ctr .sts_lst').perfectScrollbar();
	$('.sts_sel').perfectScrollbar();

    getAcntInfo();
    getDashboardInfo();
    getReprsntCntintInfo('CT01');
    initViewAllPopup ();
    
});

// 브라우져 체크
function browserCheck ()
{
	var agent = navigator.userAgent.toLowerCase();
    var name = navigator.appName;
    var browser = null;

	// MS 계열 브라우저를 구분하기 위함.
	if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) 
	{
	    browser = 'ie';
	    
	    if(name === 'Microsoft Internet Explorer') 
	    { 
	    	// IE old version (IE 10 or Lower)
	        agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
	        browser += parseInt(agent[1]);
	    } else 
	    { 
	    	// IE 11+
	        if(agent.indexOf('trident') > -1) 
	        { 
	        	// IE 11 
	            browser += 11;
	        } else if(agent.indexOf('edge/') > -1) 
	        { 
	        	// Edge
	            browser = 'edge';
	        }
	    }
	} else if(agent.indexOf('safari') > -1) 
	{ 
		// Chrome or Safari
	    if(agent.indexOf('opr') > -1) 
	    { 
	    	// Opera
	        browser = 'opera';
	    } else if(agent.indexOf('chrome') > -1)
	    { 
	    	// Chrome
	        browser = 'chrome';
	    } else 
	    { 
	    	// Safari
	        browser = 'safari';
	    }
	} else if(agent.indexOf('firefox') > -1) 
	{ 
		// Firefox
	    browser = 'firefox';
	}
	
	return browser;
}


//그리드 전체보기 팝업 호출
function initViewAllPopup ()
{
    $ ( '#btn_all_jqgrid' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
       
    } );
    
}


// 2D 구글맵 이동 처리
function moveGoogleMap ( nationId ) 
{
	 
}

function CompleteFadeIn ()
{
	//moveGoogleMap ();
}

// 3D 지구본 : 대표대륙 정보 조회 및 대표 대륙 별 국가 정보 조회
function getReprsntCntintInfo( cntint )
{
	var $nationPvDtlArea = $ ( '#nationPvDtlArea' );
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getReprsntCntintInfoOnly3D.ajax',
        type : 'POST',
        data : {
        	cntint : cntint
        },  
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	$nationPvDtlArea.empty ();
            	
            	$ ( '#reprsntCntint' ).empty().html ( homUtil.addNumberComma(json.data.intgCntintInfo.cntintKorNm ) );
            	$ ( '#reprsntCntintCnt' ).empty().html ( homUtil.addNumberComma(json.data.intgCntintInfo.pvCnt ) );
            	$ ( '#pvEssType' ).empty().html ( homUtil.addNumberComma(json.data.intgCntintInfo.pvEssTypeCnt ) );
            	$ ( '#pvType' ).empty().html ( homUtil.addNumberComma(json.data.intgCntintInfo.pvTypeCnt ) );
            	$ ( '#essType' ).empty().html ( homUtil.addNumberComma(json.data.intgCntintInfo.essTypeCnt ) );
            	$ ( '#pcs' ).empty().html ( homUtil.addNumberComma(json.data.intgCntintInfo.pcs ) );
            	$ ( '#bat' ).empty().html ( homUtil.addNumberComma(json.data.intgCntintInfo.bat ) );
            	$ ( '#pv' ).empty().html ( homUtil.addNumberComma(json.data.intgCntintInfo.pv ) );
            	
            	var resultData = json.data.nationPvDtlInfos
            	
            	for ( var key in resultData )
            	{
            		var cntint ;
            		var nationPvDtlList = [] ;
            		
            		cntint = key; 
            		nationPvDtlList = resultData[key];
            		
            		if ( dermsDashboardInfo.tpl.nationPvDtlArea != null )
            		{
                        var template = _.template ( dermsDashboardInfo.tpl.nationPvDtlArea );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            homUtil : homUtil,
                            continent : nationPvDtlList[0].cntintKorNm,
                            nationPvDtlList : nationPvDtlList,
                            unit : i18nMessage.msg_pvNum
                        } );
                        $nationPvDtlArea.html ( html )
            		}	
            	}	
            	
            	
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                });
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

// 3D 지구본 : 통합운영현황 조회
function getDashboardInfo()
{
	var $cntintArea = $ ( '#cntintArea' );
	var $nationPvArea = $ ( '#nationPvArea' );
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getDashboardInfoOnly3D.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	//console.log (json.data);
            	$nationPvArea.empty ();
            	
            	if ( dermsDashboardInfo.tpl.cntintArea !== null )
                {
                    var template = _.template ( dermsDashboardInfo.tpl.cntintArea );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        cntintInfoList : json.data.cntintInfos
                    } );
                    $cntintArea.empty ().html ( html )
                }
            	
            	var resultData = json.data.nationPvCntInfos;
            	
            	for ( var key in resultData )
            	{
            		var cntint ;
            		var nationPvList = [] ;
            		
            		cntint = key; 
            		nationPvList = resultData[key];
            		
                	if ( dermsDashboardInfo.tpl.nationPvArea !== null )
                    {
                        var template = _.template ( dermsDashboardInfo.tpl.nationPvArea );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            continent : nationPvList[0].cntintKorNm,
                            nationPvList : nationPvList,
                            unit : i18nMessage.msg_pvNum
                        } );
                        $nationPvArea.append ( html )
                    }
            	}
            	$ ( '#totalCntintCnt' ).empty().html ( homUtil.addNumberComma(json.data.totalPvDtlInfo.pvCnt) );
            	$ ( '#totalPvEssType' ).empty().html ( homUtil.addNumberComma(json.data.totalPvDtlInfo.pvEssTypeCnt ) );
            	$ ( '#totalPvType' ).empty().html ( homUtil.addNumberComma(json.data.totalPvDtlInfo.pvTypeCnt ) );
            	$ ( '#totalEssType' ).empty().html ( homUtil.addNumberComma(json.data.totalPvDtlInfo.essTypeCnt ) );
            	$ ( '#totalPcs' ).empty().html ( homUtil.addNumberComma(json.data.totalPvDtlInfo.pcs ) );
            	$ ( '#totalBat' ).empty().html ( homUtil.addNumberComma(json.data.totalPvDtlInfo.bat ) );
            	$ ( '#totalPv' ).empty().html ( homUtil.addNumberComma(json.data.totalPvDtlInfo.pv ) );
            	
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                });
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

// 접속 계정 정보 및 승인 발전소 갯수 조회
function getAcntInfo()
{
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getAcntInfoOnly3D.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	//console.log (json.data);
            	var acntNm = (lang === locale.korea || lang === locale.korean) ? json.data.acntKorNm : json.data.acntEngNm;
            	$ ( '#acntNm' ).empty ().html ( acntNm + ' (<span class="num">'+json.data.acntId+'</span>)');
            	$ ( '#totalPvCnt' ).empty ().html ( json.data.totalPvCnt );
            	
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                });
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

function clickNationInfo ( nationId )
{
	alert ( nationId );
}

// 3D 지구본 : 하단 대륙 탭 클릭 처리
function clickCntintInfo ( cntintCd )
{
	if ( cntintCd == 'CT01')
	{
		$ ( '#globePlay' ).addClass ("on");
		globe3d.SendMessage ("Demo", "AsiaChange");
		getReprsntCntintInfo('CT01');
	} else if ( cntintCd == 'CT02')
	{
		$ ( '#globePlay' ).addClass ("on");
		globe3d.SendMessage ("Demo", "AmericaChange");
		getReprsntCntintInfo('CT02');
	} else if ( cntintCd == 'CT03')
	{
		$ ( '#globePlay' ).addClass ("on");
		globe3d.SendMessage ("Demo", "EuropeChange");
		getReprsntCntintInfo('CT03');
	} else if ( cntintCd == 'CT04')
	{
		$ ( '#globePlay' ).addClass ("on");
		globe3d.SendMessage ("Demo", "AfricaChange");
		getReprsntCntintInfo('CT04');
	} else if ( cntintCd == 'CT05')
	{
		$ ( '#globePlay' ).addClass ("on");
		globe3d.SendMessage ("Demo", "AustliaChange");
		getReprsntCntintInfo('CT05');
	}
}

//3D 지구본 : 지구본 회전 클릭 이벤트 처리
function clickGlobeRotate ( )
{
	globe3d.SendMessage ("Demo", "GlobePlayPause");
}

//3D 지구본 : 맵 스타일 클릭 이벤트 처리
function clickMapStyle ( style )
{
	globe3d.SendMessage ("Demo", "GlobeStyle", style);
}

// 3D 지구본 로딩바 처리
function loadingfinish ( )
{
	$ ( '#loadingBar' ).hide( 500, 'swing');
	
	globe3d.SendMessage ("Demo", "LinkState", "linkoff" );
}

// 3D 지구본 : 국가 발전소 정보 조회 
function getPvInfoFromGlobe3d ( )
{
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getGlobe3dPvInfoOnly3D.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	globe3d.SendMessage ("Demo", "GetPOIData", JSON.stringify(json) );
            	
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                });
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
