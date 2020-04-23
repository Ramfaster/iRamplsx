var plantMap = null;

// center 지정
function setCenter ( lat, lng )
{
    plantMap.center.LAT = lat;
    plantMap.center.LNG = lng;
}

// 위치 검색
function locationSearch ()
{
    var isInit = false;
    var $btnSrch = $ ( '.btn_srch' );
    var $srchText = $ ( '#srch_text' );
    var googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + staticVariable.googleMapGeocodingApiKey;

    $btnSrch.click ( function ()
    {
        getLatLng ( isInit, googleUrl, $srchText );
    } );
    $srchText.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            getLatLng ( isInit, googleUrl, $srchText );
        }
    } );
}

// 마커지정
function setMarker ( address )
{
    // 마커 지우기
    if ( plantMap.marker !== null )
    {
        plantMap.marker.setMap ( null );
    }

    var title = '';
    if ( typeof address !== 'undefined' || address !== null )
    {
        title = address
    }

    plantMap.marker = new google.maps.Marker ( {
        position : new google.maps.LatLng ( plantMap.center.LAT, plantMap.center.LNG ),
        map : plantMap.map,
        title : title,
        icon : contextPath + '/img/common/icon_pin.png',
        draggable : true
    } );
}

function getLatLng ( isInit, googleUrl, $srchText )
{
    if ( $srchText.val () !== '' )
    {
        var $searchErrorWrap = $ ( '#search_error_wrap' );
        $.ajax ( {
            url : googleUrl + '&address=' + encodeURI ( $srchText.val () ),
            type : "POST",
            success : function ( json )
            {
                if ( json.status === 'OK' )
                {
                    var location = json.results[0].geometry.location;
                    var address = json.results[0].formatted_address;

                    setCenter ( location.lat, location.lng );
                    if ( map !== null )
                    {
                        plantMap.map.setCenter ( {
                            lat : plantMap.center.LAT,
                            lng : plantMap.center.LNG
                        } );

                        setMarker ( address );
                    }
                    if ( isInit )
                    {
                        seLatLng ();
                    }
                } else
                {
                    if ( plantMap.tpl.errorTpl !== null )
                    {
                        var template = _.template ( plantMap.tpl.errorTpl );
                        var html = template ( {
                            errorId : 'search_error',
                            errorMessage : i18nMessage.msg_alertNoSearchLocationExist
                        } );

                        $searchErrorWrap.empty ().html ( html );
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
                        if ( plantMap.tpl.errorTpl !== null )
                        {
                            var template = _.template ( plantMap.tpl.errorTpl );
                            var html = template ( {
                                errorId : 'search_error',
                                errorMessage : i18nMessage.msg_unknownError
                            } );

                            $searchErrorWrap.empty ().html ( html );
                        }
                    }
                }
            }
        } );
    }
}

// 마커로 지정된 위치 지정 버튼 클릭
function setLocationOfMarker ()
{
    var $btnLoc = $ ( '#btn_loc' );
    $btnLoc.click ( function ()
    {
        if ( plantMap.marker !== null )
        {
            seLatLng ();
        }
    } );
}

// 위도,경도 input에 값을 넣는다.
function seLatLng ()
{
    var $lat = $ ( '#lat' );
    var $lng = $ ( '#lng' );
    var location = plantMap.marker.position;

    setCenter ( location.lat (), location.lng () );
    plantMap.map.setCenter ( {
        lat : plantMap.center.LAT,
        lng : plantMap.center.LNG
    } );
    $lat.val ( location.lat () );
    $lng.val ( location.lng () );
}

// 구글지도 초기화
function initMap ()
{
    plantMap.map = new google.maps.Map ( document.getElementById ( 'map' ), {
        zoom : plantMap.ZOOM.DEFAULT_ZOOM_LEVEL,
        center : {
            lat : plantMap.center.LAT,
            lng : plantMap.center.LNG
        },
        disableDefaultUI : true,
        mapTypeControl : true,
        mapTypeControlOptions : {
            style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position : google.maps.ControlPosition.BOTTOM_LEFT,
            mapTypeIds : [ google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE ]
        }
    } );

    // TODO 구글맵이 다 로드되었을 경우.. 처리
    initCustomizeCenterBtn ();
    initCustomizeZoom ();
    setCustomizeZoomBar ();
    initAddrInfo ();

    google.maps.event.addListener ( plantMap.map, 'center_changed', function ()
    {
        checkBounds ();
    } );

}

// map bound 체크(남극/북극 넘지 못하도록 처리)
function checkBounds ()
{
    var latNorth = plantMap.map.getBounds ().getNorthEast ().lat ();
    var latSouth = plantMap.map.getBounds ().getSouthWest ().lat ();
    var newLat = null;

    /* in both side -> it's ok */
    if ( latNorth < 85 && latSouth > -85 )
    {
        return;
    } else
    {
        if ( latNorth > 85 && latSouth < -85 )
        {
            return;
        } else
        {

            if ( latNorth > 85 )
            {
                newLat = globalDashboard.map.getCenter ().lat () - (latNorth - 85); /* too north, centering */
            }
            if ( latSouth < -85 )
            {
                newLat = globalDashboard.map.getCenter ().lat () - (latSouth + 85); /* too south, centering */
            }
        }

    }

    if ( newLat )
    {
        var newCenter = new google.maps.LatLng ( newLat, plantMap.map.getCenter ().lng () );
        plantMap.map.setCenter ( newCenter );
    }
}

// 커스텀 센터 버튼 세팅
function initCustomizeCenterBtn ()
{
    var $centerBox = $ ( '#center_box' );
    $centerBox.show ();
    $centerBox.css ( {
        bottom : '289px',
        left : '26px'
    } );

    $centerBox.find ( '#move_btn' ).on ( 'click', function ()
    {
        console.log ( 'click' );
        plantMap.map.setCenter ( {
            lat : plantMap.center.LAT,
            lng : plantMap.center.LNG
        } );
    } );
}

// 커스텀 zoom 세팅
function initCustomizeZoom ()
{
    var $zoomBox = $ ( '#zoom_box' );
    $zoomBox.show ();
    $zoomBox.css ( {
        bottom : '230px',
        right : '30px'
    } );

    $ ( '.zoomout_btn', $zoomBox ).on ( 'click', function ()
    {
        var zoom = plantMap.map.getZoom () - 1;
        if ( zoom >= plantMap.ZOOM.MIN_ZOOM_LEVEL )
        {
            plantMap.map.setZoom ( zoom );
            setCustomizeZoomBar ();
        }
    } );

    $ ( '.zoomin_btn', $zoomBox ).on ( 'click', function ()
    {
        var zoom = plantMap.map.getZoom () + 1;
        if ( zoom <= plantMap.ZOOM.MAX_ZOOM_LEVEL )
        {
            plantMap.map.setZoom ( zoom );
            setCustomizeZoomBar ();
        }
    } );

    plantMap.map.addListener ( 'zoom_changed', function ()
    {
        var zoom = plantMap.map.getZoom ();
        if ( zoom < plantMap.ZOOM.MIN_ZOOM_LEVEL )
        {
            plantMap.map.setZoom ( plantMap.ZOOM.MIN_ZOOM_LEVEL );
            setCustomizeZoomBar ();
        } else if ( zoom > plantMap.ZOOM.MAX_ZOOM_LEVEL )
        {
            plantMap.map.setZoom ( plantMap.ZOOM.MAX_ZOOM_LEVEL );
            setCustomizeZoomBar ();
        }
    } );
}

// 줌바 설정
function setCustomizeZoomBar ()
{
    var zoom = plantMap.map.getZoom ();

    if ( zoom >= plantMap.ZOOM.MIN_ZOOM_LEVEL )
    {
        zoom = zoom - plantMap.ZOOM.MIN_ZOOM_LEVEL;
    } else
    {
        zoom = 0;
    }

    $ ( '.zoom_bar' ).height ( (zoom / (plantMap.ZOOM.MAX_ZOOM_LEVEL - plantMap.ZOOM.MIN_ZOOM_LEVEL) * 100) + '%' );
}

// 위치검색과 위도/경도가 셋팅 되어있다면 그것을 기준으로 마커를 셋팅한다.
function initAddrInfo ()
{
    var $detlAddr = $ ( '#detlAddr' );
    var $addrLat = $ ( '#addr_lat' );
    var $addrLng = $ ( '#addr_lng' );
    var $lat = $ ( '#lat' );
    var $lng = $ ( '#lng' );
    var $srchText = $ ( '#srch_text' );

    if ( $detlAddr.val () !== '' && $addrLat.val () !== '' && $addrLng.val () !== '' )
    {
        $ ( '#srch_text' ).val ( $detlAddr.val () );
        $ ( '#lat' ).val ( $addrLat.val () );
        $ ( '#lng' ).val ( $addrLng.val () );

        setCenter ( parseFloat ( $lat.val () ), parseFloat ( $lng.val () ) );
        plantMap.marker = new google.maps.Marker ( {
            position : new google.maps.LatLng ( $lat.val (), $lng.val () ),
            map : plantMap.map,
            title : $srchText.val (),
            icon : contextPath + '/img/common/icon_pin.png',
            draggable : true
        } );

        plantMap.map.setCenter ( {
            lat : plantMap.center.LAT,
            lng : plantMap.center.LNG
        } );
    } else
    {
        setMarker ();
    }
}

$ ( function ()
{
    plantMap = {
        map : null,
        marker : null,
        center : {
            LAT : 37.567195,
            LNG : 126.987041
        },
        ZOOM : {
            DEFAULT_ZOOM_LEVEL : 12,
            MIN_ZOOM_LEVEL : 9,
            MAX_ZOOM_LEVEL : 19
        },
        tpl : {
            errorTpl : getTemplate ( templates.elcPwStnInfoMgtPopupError )
        }
    };

    initMap ();
    locationSearch ();
    setLocationOfMarker ();
} );