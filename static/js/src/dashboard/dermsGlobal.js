var dermsDashboardInfo = null;
var psTimer = null;
var ntTimer = null;
var cnTimer = null;

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
        sel : {
            bizType : "BSN01,BSN02,BSN03,BSN04"
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
	

	$("input[type=checkbox]").on("click",function () {

		var str = '';
		
		$("#pvEssDiv").hide();
		$("#essDiv").hide();
		$("#pvDiv").hide();
		
		var bizType ="";
		$("input[type=checkbox]:checked").each(function() {
			str += $(this).val();
			
			if ( $(this).val() == '1' )
			{
				$("#pvDiv").show();
				
				if(bizType == ""){
					bizType = 'BSN01';
				}else{
					bizType = bizType+","+'BSN01';
				}	
			}
			else if ( $(this).val() == '2' )
			{
				$("#essDiv").show();
				if(bizType == ""){
					bizType = 'BSN02';
				}else{
					bizType = bizType+","+'BSN02';
				}	
			}	
			else if ( $(this).val() == '3' )
			{
				$("#pvEssDiv").show();
				if(bizType == ""){
					bizType = 'BSN03';
				}else{
					bizType = bizType+","+'BSN03';
				}	
			}
		});
		
		dermsDashboardInfo.sel.bizType = bizType;
		
		var markerArray = dermsDashboardInfo.pvMarkers;
		
	    $.each ( markerArray, function ( index, tempMarker )
	    {
	        if ( str.indexOf( tempMarker.bizTy ) != -1 )
	        {
	        	tempMarker.set("visible", true );
	        }
	        else
	        {
	        	tempMarker.set("visible", false );
	        }	
	    });
	});

    getAcntInfo();
    getDashboardInfo();
    getReprsntCntintInfo('CT01');
    initMap ();
    initViewAllPopup ();
    stsListLayout();
    //getPvInfoFromGlobe3d ();
    
	$("#moveGlobe").hide();
	$("#pvTypeInfo").hide();
	$("#ntnDtlInfo").hide();
	$("#zoom_box").hide();
	$("#pjtSttus").hide();
});

// 발전소 펼침메뉴 사이즈 조절 (2D 지도 왼쪽)
$(window).resize(function() {
    stsListLayout();
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

//발전소 펼침메뉴 사이즈 조절 (2D 지도 왼쪽)
function stsListLayout()
{
	var winHeight = $(window).outerHeight();
    var gapHeight = 246;
    var stsListHeight = winHeight - gapHeight;

    $('.sts_lst').css('max-height', stsListHeight + 'px');
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
    
    $ ( '#btn_country_jqgrid' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
       
    } );
}

// 3D 지구본 이동 처리
function moveGlobe3D ()
{
	$("#moveGlobe").hide();
	$("#pvTypeInfo").hide();
	$("#ntnDtlInfo").hide();
	$("#zoom_box").hide();
	$("#pjtSttus").hide();
	
	$ ( '#pvlist' ).removeClass("ds_map_clr");
	$ ( '#langlist' ).removeClass("ds_map_clr");
	$ ( '#utilArea' ).removeClass("ds_map_clr");
	$ ( '#logo' ).removeClass("mapbg");
	
	$("#globeArea").show();
	globe3d.SendMessage ("Demo", "ReturnFromWeb");
	
	$("#totInfo").show();
	$("#repCntintInfo").show();
	$("#cntintArea").show();
	$("#globePlay").show();
	$("#nationPvDtlArea").show();
	$("#globeMapType").show();
	
	pvDtlInfoClose ();
	
	var markerInfos = dermsDashboardInfo.nationMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
    
	var markerInfos = dermsDashboardInfo.pvMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
    
	var markerInfos = dermsDashboardInfo.cntintMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
    
    dermsDashboardInfo.pvMarkers.length = 0;
    dermsDashboardInfo.nationMarkers.length = 0;
    dermsDashboardInfo.cntintMarkers.length = 0;
}

// 2D 구글맵 이동 처리
function moveGoogleMap ( nationId ) 
{
	$("#globeArea").hide( 500, 'swing');
	$("#totInfo").hide();
	$("#repCntintInfo").hide();
	$("#cntintArea").hide();
	$("#globePlay").hide();
	$("#nationPvDtlArea").hide();
	$("#globeMapType").hide();
	$("#pjtSttus").hide();

	$("#moveGlobe").show();
	$("#pvTypeInfo").show();
	$("#ntnDtlInfo").show();
	$("#zoom_box").show();
	
	dermsDashboardInfo.map.setMapTypeId('hybrid');
	
	$ ( '#utilArea' ).addClass("ds_map_clr");
	$ ( '#logo' ).addClass("mapbg");
	
	$("input[type=checkbox]").prop("checked",true);

	globe3d.SendMessage ("Demo", "StartFadeOut");
	
	var markerInfos = dermsDashboardInfo.cntintMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
    
	var markerInfos = dermsDashboardInfo.nationMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
    
	var markerInfos = dermsDashboardInfo.pvMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
            
	getNationSttusInfo( nationId ); 
}

function CompleteFadeIn ()
{
	//moveGoogleMap ();
}

// 구글맵 초기화
function initMap ()
{
	dermsDashboardInfo.map = new google.maps.Map ( document.getElementById ( 'map' ), {
        zoom : dermsDashboardInfo.ZOOM.POWERSTATION_ZOOM_LEVEL,
        center : {
            lat : dermsDashboardInfo.continent.LAT,
            lng : dermsDashboardInfo.continent.LNG
        },
        disableDefaultUI : true,
        mapTypeControl : true,
        mapTypeControlOptions : {
            style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position : google.maps.ControlPosition.RIGHT_BOTTOM,
            mapTypeIds : [ google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID ]
        }
    } );
	dermsDashboardInfo.map.setOptions ( {
        minZoom : dermsDashboardInfo.ZOOM.MIN_ZOOM_LEVEL
//       ,maxZoom : dermsDashboardInfo.ZOOM.MAX_ZOOM_LEVEL
    } );
	
    google.maps.event.addDomListener ( window, 'load', function ()
    {
    	initZoom ();
    	setCustomizeZoomBar ();
        
        google.maps.event.addListener ( dermsDashboardInfo.map, 'center_changed', function ()
        {
            checkBounds ();
        } );

    } );
}


// Zoom Bar 초기화
function initZoom ()
{
    var $zoomBox = $ ( '#zoom_box' ) ;

    $zoomBox.find ( '.zoomout_btn' ).on ( 'click', function ()
    {
    	dermsDashboardInfo.map.setZoom ( dermsDashboardInfo.map.getZoom () - 1 );
    } );
    $zoomBox.find ( '.zoomin_btn' ).on ( 'click', function ()
    {
    	dermsDashboardInfo.map.setZoom ( dermsDashboardInfo.map.getZoom () + 1 );
    } );

    dermsDashboardInfo.map.addListener ( 'zoom_changed', function ()
    {
    	pvDtlInfoClose ();
    	
    	dermsDashboardInfo.map.setOptions ( {
            scrollwheel : false
        } );
    	
    	var promise = setZoomChanged ();
        promise.done ( function ()
        {
        	dermsDashboardInfo.map.setOptions ( {
                scrollwheel : true
            } );
        } );
    });
    
    dermsDashboardInfo.map.addListener ( 'dragstart', function ()
    {
    	pvDtlInfoClose ();
    });
    
    dermsDashboardInfo.map.addListener ( 'maptypeid_changed', function ()
    {
    	if ( dermsDashboardInfo.map.getMapTypeId() == 'hybrid' )
    	{
    		$ ( '#pvlist' ).removeClass("ds_map_clr");
    		$ ( '#langlist' ).removeClass("ds_map_clr");
    	}
    	else if ( dermsDashboardInfo.map.getMapTypeId() == 'roadmap' )
    	{
    		$ ( '#pvlist' ).addClass("ds_map_clr");
    		$ ( '#langlist' ).addClass("ds_map_clr");
    	}	
    });
}

function clearTimer ()
{
	clearInterval ( cnTimer );
	clearInterval ( ntTimer );
	clearInterval ( psTimer );

}

// Zoom 변경시 이벤트 처리
function setZoomChanged ()
{
    var deferred = $.Deferred ();

    var zoom = dermsDashboardInfo.map.getZoom ();
	
	if ( zoom >= dermsDashboardInfo.ZOOM.MIN_ZOOM_LEVEL && zoom <= dermsDashboardInfo.ZOOM.MAX_ZOOM_LEVEL )
    {
		setCustomizeZoomBar();
    } else if ( zoom < dermsDashboardInfo.ZOOM.MIN_ZOOM_LEVEL )
    {
        zoom = dermsDashboardInfo.ZOOM.MIN_ZOOM_LEVEL;
        dermsDashboardInfo.map.setZoom ( dermsDashboardInfo.ZOOM.MIN_ZOOM_LEVEL );
    } else if ( zoom > dermsDashboardInfo.ZOOM.MAX_ZOOM_LEVEL )
    {
        zoom = dermsDashboardInfo.ZOOM.MAX_ZOOM_LEVEL;
        dermsDashboardInfo.map.setZoom ( dermsDashboardInfo.ZOOM.MAX_ZOOM_LEVEL );
    }
	
    // 대륙 Zoom 처리
    if ( zoom < dermsDashboardInfo.ZOOM.NATION_ZOOM_LEVEL && dermsDashboardInfo.sttus != dermsDashboardInfo.TYPE.CONTINENT )
    {
    	console.log ( '대륙 정보 조회 = '+ zoom );
    	dermsDashboardInfo.sttus = dermsDashboardInfo.TYPE.CONTINENT;
    	$("#pvTypeInfo").hide();
    	$("#ntnDtlInfo").hide();
    	$("#pjtSttus").show();
    	
		var markerInfos = dermsDashboardInfo.nationMarkers;
        $.each ( markerInfos, function ( index, marker )
        {
        	google.maps.event.clearInstanceListeners ( marker );
        	marker.setMap ( null );
        });
        
    	var markerInfos = dermsDashboardInfo.pvMarkers;
        $.each ( markerInfos, function ( index, marker )
        {
        	google.maps.event.clearInstanceListeners ( marker );
        	marker.setMap ( null );
        });
        
        dermsDashboardInfo.pvMarkers.length = 0;
        dermsDashboardInfo.nationMarkers.length = 0;
        
        // 대륙 발전정보 조회
        getCntintMarkerDtlInfo ();
        deferred.resolve ();
    	
        clearTimer ();
        
    	cnTimer = setInterval ( function () 
		{
    		var markerInfos = dermsDashboardInfo.nationMarkers;
            $.each ( markerInfos, function ( index, marker )
            {
            	google.maps.event.clearInstanceListeners ( marker );
            	marker.setMap ( null );
            });
            
        	var markerInfos = dermsDashboardInfo.pvMarkers;
            $.each ( markerInfos, function ( index, marker )
            {
            	google.maps.event.clearInstanceListeners ( marker );
            	marker.setMap ( null );
            });
            
            dermsDashboardInfo.pvMarkers.length = 0;
            dermsDashboardInfo.nationMarkers.length = 0;
            
            // 대륙 발전정보 조회
            getCntintMarkerDtlInfo ();
            deferred.resolve ();
    		
    	}, dermsDashboardInfo.interval.TIME );
    }
    // 국가 Zoom 처리
    else if ( zoom >= dermsDashboardInfo.ZOOM.NATION_ZOOM_LEVEL && zoom < dermsDashboardInfo.ZOOM.POWERSTATION_ZOOM_LEVEL
    		   && dermsDashboardInfo.sttus != dermsDashboardInfo.TYPE.NATION)
    {
    	console.log ( '국가 정보 조회 = '+ zoom );
    	dermsDashboardInfo.sttus = dermsDashboardInfo.TYPE.NATION;
    	$("#pvTypeInfo").hide();
    	$("#ntnDtlInfo").hide();
    	$("#pjtSttus").show();
    	
    	var markerInfos = dermsDashboardInfo.pvMarkers;
        $.each ( markerInfos, function ( index, marker )
        {
        	google.maps.event.clearInstanceListeners ( marker );
        	marker.setMap ( null );
        });
        
    	var markerInfos = dermsDashboardInfo.cntintMarkers;
        $.each ( markerInfos, function ( index, marker )
        {
        	google.maps.event.clearInstanceListeners ( marker );
        	marker.setMap ( null );
        });
        
        dermsDashboardInfo.pvMarkers.length = 0;
        dermsDashboardInfo.cntintMarkers.length = 0;
        
    	// 국가 발전정보 조회
        getNationMarkerDtlInfo ();
        deferred.resolve ();
        
        clearTimer ();
    	
    	ntTimer = setInterval ( function () 
		{
    		var markerInfos = dermsDashboardInfo.pvMarkers;
            $.each ( markerInfos, function ( index, marker )
            {
            	google.maps.event.clearInstanceListeners ( marker );
            	marker.setMap ( null );
            });
            
        	var markerInfos = dermsDashboardInfo.cntintMarkers;
            $.each ( markerInfos, function ( index, marker )
            {
            	google.maps.event.clearInstanceListeners ( marker );
            	marker.setMap ( null );
            });
            
            dermsDashboardInfo.pvMarkers.length = 0;
            dermsDashboardInfo.cntintMarkers.length = 0;
            
        	// 국가 발전정보 조회
            getNationMarkerDtlInfo ();
            deferred.resolve ();
    		
    	}, dermsDashboardInfo.interval.TIME );
    	
    }
    // 발전소 Zoom 처리
    else if ( zoom >= dermsDashboardInfo.ZOOM.POWERSTATION_ZOOM_LEVEL && dermsDashboardInfo.sttus != dermsDashboardInfo.TYPE.POWERSTATION)
    {
    	console.log ( '발전소 정보 조회 = '+ zoom );
    	dermsDashboardInfo.sttus = dermsDashboardInfo.TYPE.POWERSTATION;
    	
		$("#pvEssDiv").show();
		$("#essDiv").show();
		$("#pvDiv").show();
    	$("#pvTypeInfo").show();
    	$("#ntnDtlInfo").show();
    	$("#pjtSttus").hide();
    	
    	$("input[type=checkbox]").prop("checked",true);
    	
    	var markerInfos = dermsDashboardInfo.cntintMarkers;
        $.each ( markerInfos, function ( index, marker )
        {
        	google.maps.event.clearInstanceListeners ( marker );
        	marker.setMap ( null );
        });
        
    	var markerInfos = dermsDashboardInfo.nationMarkers;
        $.each ( markerInfos, function ( index, marker )
        {
        	google.maps.event.clearInstanceListeners ( marker );
        	marker.setMap ( null );
        });
        dermsDashboardInfo.nationMarkers.length = 0;
        dermsDashboardInfo.cntintMarkers.length = 0;
        
        // 발전소 발전정보 조회
//        var pvMarkerPromise = getPvMarkerDtlInfo( dermsDashboardInfo.nationId );
//        
//        pvMarkerPromise.done ( function  ()
//        {
//        	deferred.resolve ();
//        });
    	
        clearTimer ();
    	
    	psTimer = setInterval ( function () 
		{
        	var markerInfos = dermsDashboardInfo.cntintMarkers;
            $.each ( markerInfos, function ( index, marker )
            {
            	google.maps.event.clearInstanceListeners ( marker );
            	marker.setMap ( null );
            });
            
        	var markerInfos = dermsDashboardInfo.nationMarkers;
            $.each ( markerInfos, function ( index, marker )
            {
            	google.maps.event.clearInstanceListeners ( marker );
            	marker.setMap ( null );
            });
            dermsDashboardInfo.nationMarkers.length = 0;
            dermsDashboardInfo.cntintMarkers.length = 0;
            
            // 발전소 발전정보 조회
            var pvMarkerPromise = getPvMarkerDtlInfo( dermsDashboardInfo.nationId );
            
            pvMarkerPromise.done ( function  ()
            {
            	var str = '';
            	
        		$("input[type=checkbox]:checked").each(function() {

        			str += $(this).val();
        			
        		});
        		
        		var markerArray = dermsDashboardInfo.pvMarkers;
        		
        	    $.each ( markerArray, function ( index, tempMarker )
        	    {
        	        if ( str.indexOf( tempMarker.bizTy ) != -1 )
        	        {
        	        	tempMarker.set("visible", true );
        	        }
        	        else
        	        {
        	        	tempMarker.set("visible", false );
        	        }	
        	    });
        	    
            	deferred.resolve ();
            });
    		
    	}, dermsDashboardInfo.interval.TIME );

    } else
    {
        deferred.resolve ();
    }

    return deferred.promise ();
}

// Zoom Bar Level 처리
function setCustomizeZoomBar ()
{
	var zoom = dermsDashboardInfo.map.getZoom ();
	
	if ( zoom >= dermsDashboardInfo.ZOOM.MIN_ZOOM_LEVEL )
	{
		zoom = zoom - dermsDashboardInfo.ZOOM.MIN_ZOOM_LEVEL;
	} else 
	{
        zoom = 0;
    }
    $ ( '.zoom_bar' ).height ( (zoom / (dermsDashboardInfo.ZOOM.MAX_ZOOM_LEVEL - dermsDashboardInfo.ZOOM.MIN_ZOOM_LEVEL) * 100) + '%' );
}

// 남극-북극 경계 처리
function checkBounds ()
{
    var latNorth = dermsDashboardInfo.map.getBounds ().getNorthEast ().lat ();
    var latSouth = dermsDashboardInfo.map.getBounds ().getSouthWest ().lat ();
    var newLat = null;

    if ( latNorth < dermsDashboardInfo.continent.NORTH && latSouth > dermsDashboardInfo.continent.SOUTH )
    {
        return;
    } else
    {
        if ( latNorth > dermsDashboardInfo.continent.NORTH && latSouth < dermsDashboardInfo.continent.SOUTH )
        {
            return;
        } else
        {
            if ( latNorth > dermsDashboardInfo.continent.NORTH )
            {
                newLat = dermsDashboardInfo.map.getCenter ().lat () - (latNorth - dermsDashboardInfo.continent.NORTH);
            }
            if ( latSouth < dermsDashboardInfo.continent.SOUTH )
            {
                newLat = dermsDashboardInfo.map.getCenter ().lat () - (latSouth + dermsDashboardInfo.continent.NORTH);
            }
        }
    }

    if ( newLat )
    {
        var newCenter = new google.maps.LatLng ( newLat, dermsDashboardInfo.map.getCenter ().lng () );
        dermsDashboardInfo.map.setCenter ( newCenter );
    }
}

// 구글맵 국가 Marker 정보 조회
function getNationMarkerDtlInfo( )
{
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getNationDtlInfo.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {	
            	//console.log( json.data.nationDtlInfos ); 
            	initNationMarker ( json.data.nationDtlInfos );
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

//구글맵 대륙 Marker 정보 조회
function getCntintMarkerDtlInfo( )
{
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getCntintMarkerDtlInfo.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	//console.log ( json.data.cntintDtlInfos );
            	initCntintMarker ( json.data.cntintDtlInfos );
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

//구글맵 발전소 Marker 정보 조회
function getPvMarkerDtlInfo ( nationId )
{
	var deferred = $.Deferred ();
	
	var $ntnSttusPv = $ ( '#ntnSttusPv' );
	var $ntnSttusEss = $ ( '#ntnSttusEss' );
	var $ntnSttusPvEss = $ ( '#ntnSttusPvEss' );
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getNationSttusInfo.ajax',
        type : 'POST',
        data : {
        	nationId : nationId
        },  
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	var resultData = json.data.nationPvSttusInfos;
            	
            	var ntnNm = (lang === locale.korea || lang === locale.korean) ? json.data.nationKorNm : json.data.nationEngNm;
            	$ ( '#ntnNm' ).empty().html( ntnNm );
            	
            	for ( var key in resultData )
            	{
            		var nation ;
            		var nationSttusList = [] ;
            		
            		bizTy = key;
            		nationSttusList = resultData[key];
            		
                	if ( dermsDashboardInfo.tpl.nationSttusArea != null )
                    {
                        var template = _.template ( dermsDashboardInfo.tpl.nationSttusArea );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            bizTy : bizTy,
                            nationSttusList : nationSttusList
                        } );
                        
                        if ( bizTy == 'PV') {
                        	$ntnSttusPv.empty().html ( html );
                        } else if ( bizTy == 'ESS') {
                        	$ntnSttusEss.empty().html ( html );
                        } else if ( bizTy == 'PV+ESS') {
                        	$ntnSttusPvEss.empty().html ( html );
                        }	
                    }
            	}
            	
                var pvMarkerPromise = initPvMarker ( json.data.pvMarkerInfos );
                
                pvMarkerPromise.done ( function  ()
                {
                	deferred.resolve ();
                });
                
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
	
    return deferred.promise ();
}

//구글맵 발전소 Marker 정보 조회 ( 3D-> 2D 이동시)
function getNationSttusInfo( nationId )
{
	var $ntnSttusPv = $ ( '#ntnSttusPv' );
	var $ntnSttusEss = $ ( '#ntnSttusEss' );
	var $ntnSttusPvEss = $ ( '#ntnSttusPvEss' );
	
	dermsDashboardInfo.nationId = nationId;
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getNationSttusInfo.ajax',
        type : 'POST',
        data : {
        	nationId : nationId
        },  
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	var resultData = json.data.nationPvSttusInfos;
            	
            	var ntnNm = (lang === locale.korea || lang === locale.korean) ? json.data.nationKorNm : json.data.nationEngNm;
            	$ ( '#ntnNm' ).empty().html( ntnNm );
            	
            	for ( var key in resultData )
            	{
            		var nation ;
            		var nationSttusList = [] ;
            		
            		bizTy = key;
            		nationSttusList = resultData[key];
            		
                	if ( dermsDashboardInfo.tpl.nationSttusArea != null )
                    {
                        var template = _.template ( dermsDashboardInfo.tpl.nationSttusArea );
                        var html = template ( {
                            lang : lang,
                            homUtil : homUtil,
                            locale : locale,
                            bizTy : bizTy,
                            nationSttusList : nationSttusList
                        } );
                        
                        if ( bizTy == 'PV') {
                        	$ntnSttusPv.empty().html ( html );
                        } else if ( bizTy == 'ESS') {
                        	$ntnSttusEss.empty().html ( html );
                        } else if ( bizTy == 'PV+ESS') {
                        	$ntnSttusPvEss.empty().html ( html );
                        }	
                    }
            	}
            	
            	var position = new google.maps.LatLng(json.data.la, json.data.lo);
            	dermsDashboardInfo.map.panTo ( position );
            	dermsDashboardInfo.map.setZoom ( dermsDashboardInfo.ZOOM.POWERSTATION_ZOOM_LEVEL );
            	initPvMarker ( json.data.pvMarkerInfos );
            	dermsDashboardInfo.sttus = dermsDashboardInfo.TYPE.POWERSTATION ;
            	
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

// 발전소 Marker 정보 초기화
function initPvMarker ( pvMarkerInfoArray )
{
	var deferred = $.Deferred ();
	
	var pvMarkerInfos = [];
	
	var markerInfos = dermsDashboardInfo.pvMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
	
    dermsDashboardInfo.pvMarkers.length = 0;
    
	$.each ( pvMarkerInfoArray, function ( index, pvMarkerInfo )
	{
		var marker = createPvMarker ( pvMarkerInfo ) ;
		
		pvMarkerInfos.push ( marker );
		
		marker.addListener ( 'click', function ( e )
        {
			var markerArray = dermsDashboardInfo.pvMarkers;
			
		    $.each ( markerArray, function ( index, tempMarker )
    	    {
    	        tempMarker.setIcon ( tempMarker.getIcon ().replace ( '_on.', '.' ) );
    	    });
			
			marker.setIcon ( marker.getIcon().replace( '.','_on.') );
			
        	var position = new google.maps.LatLng(marker.la, marker.lo);
        	dermsDashboardInfo.map.panTo ( position );
        	
			getPvDtlInfo ( marker.id );
        });
	});
	dermsDashboardInfo.pvMarkers = pvMarkerInfos;
	
    deferred.resolve ();
    return deferred.promise ();
}

// 발전소 Marker 정보 생성
function createPvMarker ( pvMarkerInfo )
{
	var pvType = null;
	var bizTy = null;
	var pvSttus = null;
	var zindex = null;
	
	if ( pvMarkerInfo.bizTy == 'BSN01' ) 
	{
		pvType = 'pv';
		bizTy = '1';
	} else if ( pvMarkerInfo.bizTy == 'BSN02' ) 
	{
		pvType = 'es';
		bizTy = '2';
	} else 
	{
		pvType = 'pe';
		bizTy = '3';
	}

	if ( pvMarkerInfo.pvSttus == 'ALVL01'  )
	{
		pvSttus = 'green';
		zindex = 100;
	} else if ( pvMarkerInfo.pvSttus == 'ALVL02' )
	{
		pvSttus = 'yel';
		zindex = 200;
	} else if ( pvMarkerInfo.pvSttus == 'ALVL03' )
	{
		pvSttus = 'red';
		zindex = 300;
	} else if ( pvMarkerInfo.pvSttus == 'ALVL04' )
	{
		pvSttus = 'gry';
		zindex = 400;
	} else 
	{
		pvSttus = 'green';
		zindex = 100;
	}
	
    var marker = new google.maps.Marker ({
        position : new google.maps.LatLng ( pvMarkerInfo.la, pvMarkerInfo.lo ),
        map : dermsDashboardInfo.map,
        icon : contextPath+'/img/common/poi_'+ pvType +'_'+pvSttus+'.png',
        zIndex : zindex
    });
    marker.id = pvMarkerInfo.pvId;
    marker.la = pvMarkerInfo.la;
    marker.lo = pvMarkerInfo.lo
    marker.bizTy = bizTy;
    
    return marker;
}

// 국가 Marker 정보 초기화
function initNationMarker ( nationMarkerInfoArray )
{
	var nationMarkerInfos = [];
	
	var markerInfos = dermsDashboardInfo.nationMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
	
    dermsDashboardInfo.nationMarkers.length = 0;
    
	$.each ( nationMarkerInfoArray, function ( index, nationMarkerInfo )
	{
		var marker = createNationMarker ( nationMarkerInfo ) ;
		nationMarkerInfos.push ( marker );
		
		marker.addListener ( 'click', function ( e )
        {
			dermsDashboardInfo.nationId = marker.id;
			
			var position = new google.maps.LatLng(marker.la, marker.lo);
        	dermsDashboardInfo.map.panTo ( position );
        	dermsDashboardInfo.map.setZoom ( dermsDashboardInfo.ZOOM.POWERSTATION_ZOOM_LEVEL );
        });
		
	});
	dermsDashboardInfo.nationMarkers = nationMarkerInfos;
}

// 국가 Marker 정보 생성
function createNationMarker ( nationMarkerInfo )
{
	var sttus = null;
	var color = null;
	if ( nationMarkerInfo.status == 'ALVL01'  )
	{
		sttus = 'green';
		color = 'normal';
	} else if ( nationMarkerInfo.status == 'ALVL02' )
	{
		sttus = 'yel';
		color = 'warnng';
	} else if ( nationMarkerInfo.status == 'ALVL03' )
	{
		sttus = 'red';
		color = 'broken';
	} else if ( nationMarkerInfo.status == 'ALVL04' )
	{
		sttus = 'gry';
		color = 'neterr';
	} else 
	{
		sttus = 'green';
		color = 'normal';
	}
	
	var nationNm = (lang === locale.korea || lang === locale.korean) ? nationMarkerInfo.nationKorNm : nationMarkerInfo.nationEngNm;
    var template = _.template ( dermsDashboardInfo.tpl.markerLabel );
    var html = template ( {
        contextPath : contextPath,
        i18nMessage : i18nMessage,
        homUtil : homUtil,
        unit : i18nMessage.msg_pvNum,
        contextPath : contextPath,
        dashSttus : 'nation',
        color : color,
        title : nationNm,
        nationMarkerInfo : nationMarkerInfo
    });
    
    var marker = new MarkerWithLabel ({
        position : new google.maps.LatLng ( nationMarkerInfo.la, nationMarkerInfo.lo ),
        map : dermsDashboardInfo.map,
        icon : contextPath+'/img/common/poi_pe_'+sttus+'.png',
        labelContent : html,
        labelAnchor : new google.maps.Point(0, 43),
        labelInBackground : false,
        draggable : false,
        raiseOnDrag : false,
        optimized : true
    });
    
    marker.id = nationMarkerInfo.nationId;
    marker.la = nationMarkerInfo.la;
    marker.lo = nationMarkerInfo.lo
    
    return marker;
}

// 대륙 Marker 정보 초기화
function initCntintMarker ( cntintMarkerInfoArray )
{
	var cntintMarkerInfos = [];
	
	var markerInfos = dermsDashboardInfo.cntintMarkers;
    $.each ( markerInfos, function ( index, marker )
    {
    	google.maps.event.clearInstanceListeners ( marker );
    	marker.setMap ( null );
    });
    
    dermsDashboardInfo.cntintMarkers.length = 0;
    
	$.each ( cntintMarkerInfoArray, function ( index, cntintMarkerInfo )
	{
		var marker = createCntintMarker ( cntintMarkerInfo ) ;
		cntintMarkerInfos.push ( marker );
		
		marker.addListener ( 'click', function ( e )
        {
        	var position = new google.maps.LatLng(marker.moveLa, marker.moveLo);
        	dermsDashboardInfo.map.panTo ( position );
        	dermsDashboardInfo.map.setZoom ( dermsDashboardInfo.ZOOM.NATION_ZOOM_LEVEL );
        });
		
	});
	dermsDashboardInfo.cntintMarkers = cntintMarkerInfos;
}

// 대륙 Marker 정보 생성
function createCntintMarker ( cntintMarkerInfo )
{
	var sttus = null;
	var color = null;
	if ( cntintMarkerInfo.status == 'ALVL01'  )
	{
		sttus = 'green';
		color = 'normal';
	} else if ( cntintMarkerInfo.status == 'ALVL02' )
	{
		sttus = 'yel';
		color = 'warnng';
	} else if ( cntintMarkerInfo.status == 'ALVL03' )
	{
		sttus = 'red';
		color = 'broken';
	} else if ( cntintMarkerInfo.status == 'ALVL04' )
	{
		sttus = 'gry';
		color = 'neterr';
	} else 
	{
		sttus = 'green'
	}
	
	var cntintNm = (lang === locale.korea || lang === locale.korean) ? cntintMarkerInfo.cntintKorNm : cntintMarkerInfo.cntintEngNm;
    
    var template = _.template ( dermsDashboardInfo.tpl.markerLabel );
    var html = template ( {
        contextPath : contextPath,
        i18nMessage : i18nMessage,
        homUtil : homUtil,
        unit : i18nMessage.msg_pvNum,
        contextPath : contextPath,
        dashSttus : 'cntint',
        color: color,
        title : cntintNm,
        nationMarkerInfo : cntintMarkerInfo
    });
    
    var marker = new MarkerWithLabel ({
        position : new google.maps.LatLng ( cntintMarkerInfo.la, cntintMarkerInfo.lo ),
        map : dermsDashboardInfo.map,
        icon : contextPath+'/img/common/poi_pe_'+sttus+'.png',
        labelContent : html,
        labelAnchor : new google.maps.Point(0, 43),
        labelInBackground : false,
        draggable : false,
        raiseOnDrag : false,
        optimized : true
    });
    
    marker.id = cntintMarkerInfo.cntintCd;
    marker.la = cntintMarkerInfo.la;
    marker.lo = cntintMarkerInfo.lo;
    marker.moveLa = cntintMarkerInfo.moveLa;
    marker.moveLo = cntintMarkerInfo.moveLo;
    
    return marker;
}

// 발전소 줌 레벨 -> 국가 줌 레벨로 이동시 컨텐츠 변경
function pvDtlInfoClose ()
{
	$ ( '#pvDtlInfoArea' ).empty();
}

// 발전소 Marker 클릭시 팝업 조회
function getPvDtlInfo( pvId )
{
	var $pvDtlInfoArea = $ ( '#pvDtlInfoArea' );
	var contentType = '';
	var pvType = '';
	var pvTypeNm = '';
	var totalSttus = '';
	var pvSttus = '';
	var pvSttusNm = '';
	var essSttus = '';
	var essSttusNm = '';
	var pvDtlSttus = '';
	var pvDtlSttusNm = '';
	var pvEssSttus = '';
	var pvEssSttusNm = '';
	var serviceSttus = '';
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getPvDtlInfo.ajax',
        type : 'POST',
        data : {
        	pvId : pvId
        },  
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
        		if ( dermsDashboardInfo.tpl.pvDtlInfoArea != null )
        		{
        			serviceSttus = json.data.serviceSttus;
        			//console.log (json.data);
        			if ( json.data.bizTy == 'BSN01' ) {
        				pvType = 'pv';
        				pvTypeNm = 'PV';
        				contentType = 'single ';
        			} else if ( json.data.bizTy == 'BSN02' ) {
        				pvType = 'ess';
        				pvTypeNm = 'ESS';
        				contentType = 'single ';
        			} else {
        				pvType = 'pvess';
        				pvTypeNm = 'PV+ESS';
        			}
        			
        			// 발전소 상위 상태
        			if (  json.data.totalSttus == 'ALVL01' )
        			{
        				totalSttus = 'normal';
        			} else if ( json.data.totalSttus == 'ALVL02' )
        			{
        				totalSttus = 'warnng';
        			}else if ( json.data.totalSttus == 'ALVL03' )
        			{
        				totalSttus = 'broken';
        			} else if ( json.data.totalSttus == 'ALVL04' )
        			{
        				totalSttus = 'neterr';
        			} else 
        			{
        				totalSttus = 'normal';
        			}
        			
        			// PV 장비 상태
        			if (  json.data.pvSttus == 'ALVL01' )
        			{
        				pvSttus = 'normal';
        				pvSttusNm = i18nMessage.msg_mntrNormal ;
        			} else if ( json.data.pvSttus == 'ALVL02' )
        			{
        				pvSttus = 'warnng';
        				pvSttusNm = i18nMessage.msg_mntrEqmtWarning;
        			}else if ( json.data.pvSttus == 'ALVL03' )
        			{
        				pvSttus = 'broken';
        				pvSttusNm = i18nMessage.msg_mntrFault;
        			} else if ( json.data.pvSttus == 'ALVL04' )
        			{
        				pvSttus = 'neterr';
        				pvSttusNm = i18nMessage.msg_mntrNetErr;
        			} else 
        			{
        				pvSttus = 'normal';
        				pvSttusNm = i18nMessage.msg_mntrNormal ;
        			}
        			
        			// ESS 장비상태
        			if (  json.data.essSttus == 'ALVL01' )
        			{
        				essSttus = 'normal';
        				essSttusNm = i18nMessage.msg_mntrNormal ;
        			} else if ( json.data.essSttus == 'ALVL02' )
        			{
        				essSttus = 'warnng';
        				essSttusNm = i18nMessage.msg_mntrEqmtWarning;
        			}else if ( json.data.essSttus == 'ALVL03' )
        			{
        				essSttus = 'broken';
        				essSttusNm = i18nMessage.msg_mntrFault;
        			} else if ( json.data.essSttus == 'ALVL04' )
        			{
        				essSttus = 'neterr';
        				essSttusNm = i18nMessage.msg_mntrNetErr;
        			} else 
        			{
        				essSttus = 'normal';
        				essSttusNm = i18nMessage.msg_mntrNormal ;
        			}
        			
        			// pv 운전상태
        			if ( json.data.genePw > 0 )
        			{
        				pvDtlSttus = 'elegan';
        				pvDtlSttusNm = i18nMessage.msg_PowerRun;
        			}
        			else
        			{
        				pvDtlSttus = 'waitng';
        				pvDtlSttusNm = i18nMessage.msg_Waiting;
        			}
        			
        			// ess 운전상태
        			if ( json.data.essDtlSttus == '1' )
        			{
        				pvEssSttus = 'charge';
        				pvEssSttusNm = i18nMessage.msg_Charge;
        			}
        			else if ( json.data.essDtlSttus == '2' )
        			{
        				pvEssSttus = 'waitng';
        				pvEssSttusNm = i18nMessage.msg_Waiting;
        			}
        			else if ( json.data.essDtlSttus == '3' )
        			{
        				pvEssSttus = 'dischg';
        				pvEssSttusNm = i18nMessage.msg_DisCharge;
        			}
        			else
        			{
        				pvEssSttus = 'waitng';
        				pvEssSttusNm = '';
        			}	
        			
                    var template = _.template ( dermsDashboardInfo.tpl.pvDtlInfoArea );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        homUtil : homUtil,
                        i18nMessage : i18nMessage,
                        pvType : pvType,
                        contentType : contentType,
                        pvTypeNm : pvTypeNm,
                        totalSttus : totalSttus,
                        pvSttus : pvSttus,
                        pvSttusNm : pvSttusNm,
                        essSttus : essSttus,
                        essSttusNm : essSttusNm,
                    	pvDtlSttus : pvDtlSttus,
                    	pvDtlSttusNm : pvDtlSttusNm,
                    	pvEssSttus : pvEssSttus,
                    	pvEssSttusNm : pvEssSttusNm,
                    	serviceSttus : serviceSttus,
                    	msg1 : i18nMessage.msg_alertNetworkErr,
                    	msg2 : i18nMessage.msg_alertRequestAdministrator,
                        unit1 : '℃',
                        unit2 : 'Wh/㎡/d',
                        pvDtlInfo : json.data
                    });
                    
                    $pvDtlInfoArea.empty().html ( html )
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

// 3D 지구본 : 대표대륙 정보 조회 및 대표 대륙 별 국가 정보 조회
function getReprsntCntintInfo( cntint )
{
	var $nationPvDtlArea = $ ( '#nationPvDtlArea' );
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getReprsntCntintInfo.ajax',
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
            	
            	var reprsntContinent = (lang === locale.korea || lang === locale.korean) ? json.data.intgCntintInfo.cntintKorNm : json.data.intgCntintInfo.cntintEngNm;
            	
            	$ ( '#reprsntCntint' ).empty().html ( reprsntContinent );
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
            		
            		var continent = (lang === locale.korea || lang === locale.korean) ? nationPvDtlList[0].cntintKorNm : nationPvDtlList[0].cntintEngNm;
            		
            		if ( dermsDashboardInfo.tpl.nationPvDtlArea != null )
            		{
                        var template = _.template ( dermsDashboardInfo.tpl.nationPvDtlArea );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            homUtil : homUtil,
                            continent : continent,
                            nationPvDtlList : nationPvDtlList,
                            unit : i18nMessage.msg_pvNum
                        } );
                        $nationPvDtlArea.append ( html )
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
        url : contextPath + '/hom/dashboard/dermsGlbal/getDashboardInfo.ajax',
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
            		var pvInfo = [] ;
            		
            		cntint = key; 
            		var nationPvList = resultData[key];
            		
            		var continent = (lang === locale.korea || lang === locale.korean) ? nationPvList[0].cntintKorNm : nationPvList[0].cntintEngNm;
            		
                	if ( dermsDashboardInfo.tpl.nationPvArea !== null )
                    {
                        var template = _.template ( dermsDashboardInfo.tpl.nationPvArea );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            continent : continent,
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
        url : contextPath + '/hom/dashboard/dermsGlbal/getAcntInfo.ajax',
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


function clickNationSttus ( pvId, la, lo )
{
	var position = new google.maps.LatLng(la, lo);
	dermsDashboardInfo.map.panTo ( position );
	dermsDashboardInfo.map.setZoom ( 8 );
	
	getPvDtlInfo ( pvId );
}

// 3D 지구본 로딩바 처리
function loadingfinish ( )
{
	$ ( '#loadingBar' ).hide( 500, 'swing');
	
	globe3d.SendMessage ("Demo", "LinkState", "linkon" );
}

// 3D 지구본 : 국가 발전소 정보 조회 
function getPvInfoFromGlobe3d ( )
{
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/getGlobe3dPvInfo.ajax',
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
