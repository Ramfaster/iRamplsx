var globalDashboard = null;

// scroll customize
function customizeScroll ( $selector )
{
    $selector.mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 250
    } );
}

// 구글지도 초기화
function initMap ()
{
    // console.log ( google.maps.MapTypeControlStyle );
    // console.log ( google.maps.ControlPosition );
    // console.log ( google.maps.MapTypeId );

    globalDashboard.map = new google.maps.Map ( document.getElementById ( 'map' ), {
        zoom : globalDashboard.ZOOM.MIN_ZOOM_LEVEL,
        center : {
            lat : globalDashboard.continent.LAT,
            lng : globalDashboard.continent.LNG
        },
        disableDefaultUI : true,
        mapTypeControl : true,
        mapTypeControlOptions : {
            style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position : google.maps.ControlPosition.BOTTOM_LEFT,
            mapTypeIds : [ google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID ]
        }
    } );

    google.maps.event.addDomListener ( window, 'load', function ()
    {
        initCustomizeZoom ();
        setCustomizeZoomBar ();

        constituteContinent ();
        // constituteContinentSlide ();

        google.maps.event.addListener ( globalDashboard.map, 'center_changed', function ()
        {
            checkBounds ();
        } );

        globalDashboard.interval.markerInterval = setInterval ( function ()
        {
            updateContinentNation ( globalDashboard.TYPE.CONTINENT );
        }, globalDashboard.interval.TIME );

        // globalDashboard.interval.slideInterval = setInterval ( function ()
        // {
        // updateContinentSlide ();
        // }, globalDashboard.interval.TIME );
    } );

}

// map bound 체크(남극/북극 넘지 못하도록 처리)
function checkBounds ()
{
    var latNorth = globalDashboard.map.getBounds ().getNorthEast ().lat ();
    var latSouth = globalDashboard.map.getBounds ().getSouthWest ().lat ();
    var newLat = null;

    if ( latNorth < globalDashboard.continent.NORTH && latSouth > globalDashboard.continent.SOUTH )
    {
        return;
    } else
    {
        if ( latNorth > globalDashboard.continent.NORTH && latSouth < globalDashboard.continent.SOUTH )
        {
            return;
        } else
        {
            if ( latNorth > globalDashboard.continent.NORTH )
            {
                newLat = globalDashboard.map.getCenter ().lat () - (latNorth - globalDashboard.continent.NORTH);
            }
            if ( latSouth < globalDashboard.continent.SOUTH )
            {
                newLat = globalDashboard.map.getCenter ().lat () - (latSouth + globalDashboard.continent.NORTH);
            }
        }
    }

    if ( newLat )
    {
        var newCenter = new google.maps.LatLng ( newLat, globalDashboard.map.getCenter ().lng () );
        globalDashboard.map.setCenter ( newCenter );
    }
}

// 화면 사이즈 초기화
function initScreenSize ()
{
    setScreenSize ( true );

    $ ( window ).resize ( function ()
    {
        setScreenSize ( false );
    } );
}

// 화면 사이즈 세팅
function setScreenSize ( flag )
{
    var height = $ ( window ).height () - $ ( '#db_footer' ).outerHeight ( true );
    $ ( '#wrap' ).css ( {
        height : height
    } );

    setContinentSlideSize ();
    setPowerstationSlideSize ( flag );
}

// 대륙별/국가별 슬라이드 size 및 스크롤 처리
function setContinentSlideSize ()
{
    var $continentSlide = $ ( '#continent_slide' );
    var $slideContWrap = $continentSlide.find ( '.slide_cont_wrap' );
    var height = $ ( window ).height () - $ ( '#db_footer' ).outerHeight ( true );

    $continentSlide.css ( {
        height : height
    } );

    $slideContWrap.css ( {
        height : height
    } );

    $ ( '#btn_continent_slide' ).on ( 'click', function ()
    {
        if ( $ ( this ).hasClass ( 'btn_slide_open' ) )
        {
            $continentSlide.animate ( {
                'margin-right' : '0px'
            }, 400 );
            $ ( this ).removeClass ( 'btn_slide_open' ).addClass ( 'btn_slide_close' );
        } else
        {
            $continentSlide.animate ( {
                'margin-right' : '-512px'
            }, 400 );
            $ ( this ).removeClass ( 'btn_slide_close' ).addClass ( 'btn_slide_open' );
        }
    } );
}

// 국가별 발전소 목록 관련 size 및 스크롤 처리
function setPowerstationSlideSize ( flag )
{
    var $powerstationSlide = $ ( '#powerstation_slide' );

    // hidden 된 element는 정확한 outerHeight를 가져올 수 없음
    if ( flag )
    {
        $powerstationSlide.show ();
    }

    var height = $ ( window ).height () - $ ( '#db_footer' ).outerHeight ( true );

    $powerstationSlide.css ( {
        height : height
    } );

    $powerstationSlide.find ( '.side_wrap' ).css ( {
        height : height - $powerstationSlide.find ( '.side_info' ).outerHeight ( true )
    } );

    if ( flag )
    {
        $powerstationSlide.hide ();
    }
}

// 커스텀 zoom 세팅
function initCustomizeZoom ()
{
    var $zoomBox = $ ( '#zoom_box' ).show ();

    $zoomBox.find ( '.zoomout_btn' ).on ( 'click', function ()
    {
        globalDashboard.map.setZoom ( globalDashboard.map.getZoom () - 1 );
    } );
    $zoomBox.find ( '.zoomin_btn' ).on ( 'click', function ()
    {
        globalDashboard.map.setZoom ( globalDashboard.map.getZoom () + 1 );
    } );

    globalDashboard.map.addListener ( 'zoom_changed', function ()
    {
        globalDashboard.map.setOptions ( {
            scrollwheel : false
        } );

        var promise = setZoomChanged ();
        promise.done ( function ()
        {
            globalDashboard.map.setOptions ( {
                scrollwheel : true
            } );
        } );
    } );
}

// 줌이 변경될때 처리
function setZoomChanged ()
{
    var deferred = $.Deferred ();

    var zoom = globalDashboard.map.getZoom ();

    if ( zoom >= globalDashboard.ZOOM.MIN_ZOOM_LEVEL && zoom <= globalDashboard.ZOOM.MAX_ZOOM_LEVEL )
    {
        setCustomizeZoomBar ( globalDashboard.ZOOM.MIN_ZOOM_LEVEL, globalDashboard.ZOOM.MAX_ZOOM_LEVEL );
    } else if ( zoom < globalDashboard.ZOOM.MIN_ZOOM_LEVEL )
    {
        zoom = globalDashboard.ZOOM.MIN_ZOOM_LEVEL;

        globalDashboard.map.setZoom ( globalDashboard.ZOOM.MIN_ZOOM_LEVEL );
    } else if ( zoom > globalDashboard.ZOOM.MAX_ZOOM_LEVEL )
    {
        zoom = globalDashboard.ZOOM.MAX_ZOOM_LEVEL;

        globalDashboard.map.setZoom ( globalDashboard.ZOOM.MAX_ZOOM_LEVEL );
    }

    // 국가 -> 대륙으로 요청 시 대륙 화면 구성
    if ( zoom < globalDashboard.ZOOM.NATION_ZOOM_LEVEL && globalDashboard.status !== globalDashboard.TYPE.CONTINENT )
    {
        var clearPromise = null;
        if ( globalDashboard.status === globalDashboard.TYPE.NATION )
        {
            clearPromise = clearContinentNation ( globalDashboard.TYPE.NATION, true );
        } else if ( globalDashboard.status === globalDashboard.TYPE.POWERSTATION )
        {
            clearPromise = clearPowerstation ();
        }

        clearPromise.done ( function ()
        {
            setTimeout ( function ()
            {
                var constituteContinentPromise = constituteContinent ();
                constituteContinentPromise.done ( function ()
                {
                    // constituteContinentSlide ();

                    globalDashboard.interval.markerInterval = setInterval ( function ()
                    {
                        updateContinentNation ( globalDashboard.TYPE.CONTINENT );
                    }, globalDashboard.interval.TIME );

                    // globalDashboard.interval.slideInterval = setInterval ( function ()
                    // {
                    // updateContinentSlide ();
                    // }, globalDashboard.interval.TIME );
                    deferred.resolve ();
                } );
            }, 100 );
        } );
    }
    // 대륙 -> 국가 또는 발전소 -> 국가로 요청 시 국가 화면 구성
    else if ( zoom >= globalDashboard.ZOOM.NATION_ZOOM_LEVEL && zoom < globalDashboard.ZOOM.POWERSTATION_ZOOM_LEVEL
            && globalDashboard.status !== globalDashboard.TYPE.NATION )
    {
        var clearPromise = null;
        if ( globalDashboard.status === globalDashboard.TYPE.CONTINENT )
        {
            clearPromise = clearContinentNation ( globalDashboard.TYPE.CONTINENT, true );
        } else if ( globalDashboard.status === globalDashboard.TYPE.POWERSTATION )
        {
            clearPromise = clearPowerstation ();
        }

        clearPromise.done ( function ()
        {
            setTimeout ( function ()
            {
                var constituteNationPromise = constituteNation ();
                constituteNationPromise.done ( function ()
                {
                    // constituteContinentSlide ();

                    globalDashboard.interval.markerInterval = setInterval ( function ()
                    {
                        updateContinentNation ( globalDashboard.TYPE.NATION );
                    }, globalDashboard.interval.TIME );

                    // if ( globalDashboard.interval.slideInterval === null )
                    // {
                    // globalDashboard.interval.slideInterval = setInterval ( function ()
                    // {
                    // updateContinentSlide ();
                    // }, globalDashboard.interval.TIME );
                    // }
                    deferred.resolve ();
                } );
            }, 100 );
        } );
    }
    // 국가 -> 발전소로 요청 시 발전소 화면 구성
    else if ( zoom >= globalDashboard.ZOOM.POWERSTATION_ZOOM_LEVEL
            && globalDashboard.status !== globalDashboard.TYPE.POWERSTATION )
    {
        var clearPromise = clearContinentNation ( globalDashboard.status, false );

        clearPromise.done ( function ()
        {
            setTimeout ( function ()
            {
                globalDashboard.nationId = null;
                globalDashboard.pvId = null;

                var constitutePowerstationPromise = constitutePowerstation ();

                constitutePowerstationPromise.done ( function ()
                {
                    globalDashboard.interval.markerInterval = setInterval ( function ()
                    {
                        updatePowerstation ();
                    }, globalDashboard.interval.TIME );
                    deferred.resolve ();
                } );
            }, 100 );
        } );
    } else
    {
        deferred.resolve ();
    }

    return deferred.promise ();
}
// 줌바 설정
function setCustomizeZoomBar ()
{
    var zoom = globalDashboard.map.getZoom ();

    if ( zoom >= globalDashboard.ZOOM.MIN_ZOOM_LEVEL )
    {
        zoom = zoom - globalDashboard.ZOOM.MIN_ZOOM_LEVEL;
    } else
    {
        zoom = 0;
    }

    $ ( '.zoom_bar' ).height (
            (zoom / (globalDashboard.ZOOM.MAX_ZOOM_LEVEL - globalDashboard.ZOOM.MIN_ZOOM_LEVEL) * 100) + '%' );
}

// 범례 세팅
function setLegend ( type )
{
    if ( globalDashboard.tpl.mapLegend !== null )
    {
        var param = {};

        if ( type === globalDashboard.TYPE.CONTINENT )
        {
            param.range1 = globalDashboard.continent.CAPACITY_LEGEND.RANGE1;
            param.range2 = globalDashboard.continent.CAPACITY_LEGEND.RANGE2;
        } else if ( type === globalDashboard.TYPE.NATION )
        {
            param.range1 = globalDashboard.nation.CAPACITY_LEGEND.RANGE1;
            param.range2 = globalDashboard.nation.CAPACITY_LEGEND.RANGE2;
        } else if ( type === globalDashboard.TYPE.POWERSTATION )
        {
            param.range1 = globalDashboard.powerstation.CAPACITY_LEGEND.RANGE1;
            param.range2 = globalDashboard.powerstation.CAPACITY_LEGEND.RANGE2;
        }

        var template = _.template ( globalDashboard.tpl.mapLegend );
        var html = template ( param );

        $ ( '#legend_box' ).remove ();
        $ ( html ).insertAfter ( $ ( '#zoom_box' ) ).show ();
    }
}

// 대륙 화면 구성
function constituteContinent ()
{
    var deferred = $.Deferred ();

    console.log ( '대륙 화면 구성 요청' );

    var type = globalDashboard.TYPE.CONTINENT;

    setLegend ( type );

    var continentArray = null;

    $.ajax ( {
        url : contextPath + '/hom/dashboard/global/selectContinentMarkerList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                continentArray = json.data;
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

    var errorFlag = false;

    $.each ( continentArray, function ( index, continent )
    {
        var marker = createContinentNationMarker ( type, continent );

        if ( marker === null )
        {
            errorFlag = true;

            globalDashboard.markers.clear ();

            return false;
        } else
        {
            globalDashboard.markers.put ( continent.id, marker );

            var mapData = globalDashboard.mapDatas.get ( continent.id );

            marker.addListener ( 'mouseover', function ( e )
            {
                if ( typeof mapData !== 'undefined' && mapData !== null )
                {
                    mapData.setMap ( globalDashboard.map );
                }
            } );

            marker.addListener ( 'mouseout', function ( e )
            {
                if ( typeof mapData !== 'undefined' && mapData !== null )
                {
                    mapData.setMap ( null );
                }

                globalDashboard.map.data.setStyle ( {} );
            } );

            marker.addListener ( 'click', function ( e )
            {
                var movePosition = marker.getPosition ();
                if ( marker.moveLat !== null && marker.moveLat !== '' && marker.moveLng !== null
                        && marker.moveLng !== '' )
                {
                    movePosition = new google.maps.LatLng ( marker.moveLat, marker.moveLng );
                }

                globalDashboard.map.panTo ( movePosition );
                globalDashboard.map.setZoom ( globalDashboard.ZOOM.NATION_ZOOM_LEVEL );
            } );
        }
    } );

    if ( errorFlag )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertServerError,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );

        return;
    }

    globalDashboard.status = type;

    deferred.resolve ();
    return deferred.promise ();
}

// 대륙 화면 갱신
function updateContinentNation ( type )
{
    console.log ( '대륙/국가 marker polling' );

    var itemArray = null;
    var url = null;

    if ( type === globalDashboard.TYPE.CONTINENT )
    {
        url = 'selectContinentMarkerList.ajax';
    } else if ( type === globalDashboard.TYPE.NATION )
    {
        url = 'selectNationMarkerList.ajax';
    }

    $.ajax ( {
        url : contextPath + '/hom/dashboard/global/' + url,
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                itemArray = json.data;
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

    var markerArray = globalDashboard.markers.values ();
    var markerIdArray = [];
    var itemIdArray = _.pluck ( itemArray, 'id' );

    $.each ( markerArray, function ( index, marker )
    {
        markerIdArray.push ( marker.id );
    } );

    var deleteIdArray = _.compact ( _.difference ( markerIdArray, itemIdArray ) );

    // 마커 갱신
    $.each ( itemArray, function ( index, item )
    {
        var marker = globalDashboard.markers.get ( item.id );
        var markerWithLabelInfo = getContinentNationMarkerWithLabelInfo ( type, item,
                globalDashboard.tpl.mapMarkerLabel );

        marker.setIcon ( contextPath + '/img/common/' + 'icon_pin_' + markerWithLabelInfo.markerType + '_'
                + markerWithLabelInfo.markerSize + '.png' );
        marker.set ( 'labelContent', markerWithLabelInfo.html );
        marker.set ( 'position', new google.maps.LatLng ( item.lat, item.lng ) );
    } );

    // 사라진 마커 제거
    $.each ( deleteIdArray, function ( index, deleteId )
    {
        deleteMarker ( deleteId );
    } );
}

// 대륙별/국가별 슬라이드 화면 구성
function constituteContinentSlide ()
{
    var $continentSlide = $ ( '#continent_slide' );
    if ( $continentSlide.css ( 'display' ) === 'none' )
    {
        var $slideContWrap = $continentSlide.find ( '.slide_cont_wrap' );

        // TODO 추후 slide animate 추가 필요
        $continentSlide.show ();

        // if ( globalDashboard.tpl.strategyNationInfo !== null && globalDashboard.tpl.continentInfo !== null )
        // {
        // updateContinentSlide ( $slideContWrap );
        // } else
        // {
        // $.customizeDialog ( {
        // template : templates.dialog,
        // message : i18nMessage.msg_alertServerError,
        // checkText : i18nMessage.msg_ok,
        // cancelText : i18nMessage.msg_cancel,
        // type : staticVariable.dialogTypeInfo
        // } );
        // }
    }
}

// 대륙별/국가별 슬라이드 화면 갱신
function updateContinentSlide ( $slideContWrap )
{
    console.log ( '대륙별/국가별 슬라이드 polling' );

    if ( typeof $slideContWrap === 'undefined' || $slideContWrap === null )
    {
        $slideContWrap = $ ( '#continent_slide .slide_cont_wrap' );
    }

    $slideContWrap.mCustomScrollbar ( 'destroy' );
    $slideContWrap.empty ();

    constituteStrategyNationInfo ( $slideContWrap, globalDashboard.tpl.strategyNationInfo );
    constituteContinentInfo ( $slideContWrap, globalDashboard.tpl.continentInfo );

    $slideContWrap.mCustomScrollbar ( 'update' );
}

// 대륙별/국가별 슬라이드 화면 해제
function clearContinentSlide ()
{
    console.log ( '대륙별/국가별 슬라이드 polling 해제' );

    var $continentSlide = $ ( '#continent_slide' );
    var $slideContWrap = $continentSlide.find ( '.slide_cont_wrap' );

    console.log ( '대륙별/국가별 슬라이드 interval 해제' );
    clearInterval ( globalDashboard.interval.slideInterval );
    globalDashboard.interval.slideInterval = null;

    $slideContWrap.mCustomScrollbar ( 'destroy' );
    $continentSlide.hide ();
}

// 전략 관리 국가
function constituteStrategyNationInfo ( $slideContWrap, tpl )
{
    homUtil.clearHighcharts ( [ $ ( '#dbgraph1' ).highcharts () ] );

    var strategyNationInfoArray = null;

    $.ajax ( {
        url : contextPath + '/hom/dashboard/global/selectStrategyNationInfoList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                strategyNationInfoArray = json.data;
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

    if ( strategyNationInfoArray !== null && strategyNationInfoArray.length > 0 )
    {
        var template = _.template ( tpl );
        var html = template ( {
            i18nMessage : i18nMessage,
            homUtil : homUtil,
            strategyNationInfoArray : strategyNationInfoArray
        } );

        $slideContWrap.append ( html );

        var categories = _.pluck ( strategyNationInfoArray, 'nationName' );
        var fcltyCpctyArray = _.pluck ( strategyNationInfoArray, 'fcltyCpcty' );
        var planCapacityArray = _.pluck ( strategyNationInfoArray, 'planCapacity' );
        var buildCapacityArray = _.pluck ( strategyNationInfoArray, 'buildCapacity' );
        var operationCapacityArray = _.pluck ( strategyNationInfoArray, 'operationCapacity' );
        var workCapacityArray = _.pluck ( strategyNationInfoArray, 'workCapacity' );

        var series = [ {
            type : 'line',
            color : '#ffffff',
            name : i18nMessage.msg_goal,
            zIndex : 1,
            data : fcltyCpctyArray
        }, {
            type : 'bar',
            color : '#b9bcc0',
            name : i18nMessage.msg_statusDevelopment,
            data : planCapacityArray
        }, {
            type : 'bar',
            color : '#f4f4f4',
            name : i18nMessage.msg_statusEpc,
            data : buildCapacityArray
        }, {
            type : 'bar',
            color : '#92bef8',
            name : i18nMessage.msg_statusFullManagement,
            data : operationCapacityArray
        }, {
            type : 'bar',
            color : '#3182f0',
            name : i18nMessage.msg_statusFullOnm,
            data : workCapacityArray
        } ];

        $ ( '#dbgraph1' ).highcharts ( {
            chart : {
                marginTop : 30,
                marginBottom : 90,
                spacingBottom : 20,
                height : 260,
                backgroundColor : 'transparent'
            },
            credits : {
                enabled : false
            },
            title : {
                style : {
                    display : 'none'
                }
            },
            exporting : {
                enabled : false
            },
            xAxis : {
                categories : categories,
                tickPixelInterval : 100,
                labels : {
                    style : {
                        color : '#fff'
                    }
                }
            },
            yAxis : {
                min : 0,
                lineColor : '#fff',
                lineWidth : 1,
                tickPixelInterval : 100,
                title : {
                    text : i18nMessage.msg_capacity + ' (' + strategyNationInfoArray[0].dcUnitNm + ')',
                    x : 0,
                    y : 0,
                    style : {
                        color : '#fff'
                    }
                },
                labels : {
                    style : {
                        color : '#fff'
                    },
                    formatter : function ()
                    {
                        return Highcharts.numberFormat ( this.value, 0 );
                    }
                },
            },
            legend : {
                layout : 'horizontal',
                verticalAlign : 'bottom',
                symbolWidth : 10,
                reversed : 'ture',
                floating : true,
                y : 10,
                itemStyle : {
                    color : '#fff',
                    fontWeight : 'normal'
                },
                itemHoverStyle : {
                    color : '#92defe'
                },
                itemHiddenStyle : {
                    color : '#d0d0d1'
                }
            },
            plotOptions : {
                bar : {
                    pointPadding : 0,
                    borderWidth : 0,
                    stacking : 'normal'
                },
                line : {
                    dataLabels : {
                        align : 'right',
                        x : 60,
                        y : 12,
                        enabled : true,
                        color : '#fff',
                        style : {
                            fontWeight : 'normal',
                            textShadow : '0'
                        }
                    },
                    marker : {
                        enabled : true
                    }
                }
            },
            series : series
        } );
    }
}

// 대륙별 발전소 정보 화면 구성
function constituteContinentInfo ( $slideContWrap, tpl )
{
    homUtil.clearHighcharts ( [ $ ( '#dbgraph2' ).highcharts () ] );

    var continentInfoArray = null;

    $.ajax ( {
        url : contextPath + '/hom/dashboard/global/selectContinentInfoList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                continentInfoArray = json.data;
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

    var template = _.template ( tpl );
    var html = template ( {
        i18nMessage : i18nMessage,
        homUtil : homUtil,
        continentInfoArray : continentInfoArray
    } );

    $slideContWrap.append ( html );

    if ( continentInfoArray !== null && continentInfoArray.length > 0 )
    {
        var continentNameArray = _.pluck ( continentInfoArray, 'name' );
        var goalGeneqtyArray = _.pluck ( continentInfoArray, 'goalGeneqty' );
        var cumulativeQuantityArray = _.pluck ( continentInfoArray, 'cumulativeQuantity' );

        $ ( '#dbgraph2' ).highcharts ( {
            chart : {
                marginTop : 30,
                height : 270,
                backgroundColor : 'transparent'
            },
            credits : {
                enabled : false
            },
            title : {
                style : {
                    display : 'none'
                }
            },
            exporting : {
                enabled : false
            },
            xAxis : {
                categories : continentNameArray,
                labels : {
                    style : {
                        color : '#fff'
                    }
                }
            },
            yAxis : {
                min : 0,
                lineColor : '#fff',
                lineWidth : 1,
                tickPixelInterval : 100,
                title : {
                    text : i18nMessage.msg_energy + '(' + continentInfoArray[0].geneqtyUnitNm + ')',
                    x : 0,
                    y : 0,
                    style : {
                        color : '#fff'
                    }
                },
                labels : {
                    style : {
                        color : '#fff'
                    },
                    formatter : function ()
                    {
                        return Highcharts.numberFormat ( this.value, 0 );
                    }
                }
            },
            legend : {
                layout : 'horizontal',
                verticalAlign : 'bottom',
                symbolWidth : 10,
                reversed : 'ture',
                floating : true,
                y : 20,
                itemStyle : {
                    color : '#fff',
                    fontWeight : 'normal'
                },
                itemHoverStyle : {
                    color : '#92defe'
                },
                itemHiddenStyle : {
                    color : '#d0d0d1'
                }
            },
            plotOptions : {
                bar : {
                    pointPadding : 0,
                    borderWidth : 0
                // dataLabels : {
                // align : 'right',
                // x : 50,
                // y : 0,
                // enabled : true,
                // color : '#fff',
                // style : {
                // fontWeight : 'normal',
                // textShadow : '0'
                // }
                // }
                }
            },
            series : [ {
                type : 'bar',
                color : '#3182f0',
                name : i18nMessage.msg_acmslt,
                data : cumulativeQuantityArray
            }, {
                type : 'bar',
                color : '#e8e8e8',
                name : i18nMessage.msg_goal,
                data : goalGeneqtyArray
            } ]
        } );
    }

}

// 국가 화면 구성
function constituteNation ()
{
    var deferred = $.Deferred ();

    console.log ( '국가 화면 구성 요청' );

    var type = globalDashboard.TYPE.NATION;

    setLegend ( type );

    var nationArray = null;

    $.ajax ( {
        url : contextPath + '/hom/dashboard/global/selectNationMarkerList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                nationArray = json.data;
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

    var errorFlag = false;

    $.each ( nationArray, function ( index, nation )
    {
        var marker = createContinentNationMarker ( type, nation );
        marker.id = nation.id;

        if ( marker === null )
        {
            errorFlag = true;

            globalDashboard.markers.clear ();

            return false;
        } else
        {
            globalDashboard.markers.put ( nation.id, marker );

            marker.addListener ( 'click', function ( e )
            {
                globalDashboard.map.panTo ( marker.getPosition () );
                globalDashboard.map.setZoom ( globalDashboard.ZOOM.POWERSTATION_ZOOM_LEVEL );

                setTimeout ( function ()
                {
                    constitutePowerstationSlide ( marker.id );

                    if ( globalDashboard.interval.slideInterval === null )
                    {
                        globalDashboard.interval.slideInterval = setInterval ( function ()
                        {
                            constitutePowerstationSlide ( marker.id );
                        }, globalDashboard.interval.TIME );
                    }
                }, 100 );
            } );
        }
    } );

    if ( errorFlag )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertServerError,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );

        return;
    }

    globalDashboard.status = type;

    deferred.resolve ();
    return deferred.promise ();
}

// 국가별 발전소 목록 슬라이드 화면 구성
function constitutePowerstationSlide ( nationId )
{
    var $powerstationSlide = $ ( '#powerstation_slide' );
    var $sideWrap = $powerstationSlide.find ( '.side_wrap' );

    if ( $powerstationSlide.css ( 'display' ) === 'none' )
    {
        // TODO 추후 slide animate 추가 필요
        $powerstationSlide.show ();
    }

    if ( globalDashboard.nationId !== nationId )
    {
        if ( globalDashboard.tpl.powerstationDiv !== null )
        {
            var powerstationInfoArray = null;

            $.ajax ( {
                url : contextPath + '/hom/dashboard/global/selectPowerstationInfoList.ajax',
                type : 'POST',
                data : {
                    nationId : nationId
                },
                dataType : 'json',
                async : false,
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        powerstationInfoArray = json.data;
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

            $sideWrap.mCustomScrollbar ( 'destroy' );
            $sideWrap.empty ();

            var template = _.template ( globalDashboard.tpl.powerstationDiv );
            var html = template ( {
                i18nMessage : i18nMessage,
                homUtil : homUtil,
                powerstationInfoArray : powerstationInfoArray
            } );

            $sideWrap.append ( html );

            $ ( '.btn_powerstation_target' ).on (
                    'click',
                    function ()
                    {
                        var $sideContWrap = $ ( this ).find ( '.side_cont_wrap' );

                        if ( !$sideContWrap.hasClass ( 'on' ) )
                        {
                            $ ( '.side_cont_wrap' ).removeClass ( 'on' ).removeClass ( 'selected' );
                            $sideContWrap.addClass ( 'on' ).addClass ( 'selected' );

                            var marker = globalDashboard.markers.get ( $ ( this ).find ( '.side_cont_wrap' ).data (
                                    'pv-id' ) );
                            selectPowerstationMarker ( marker );

                            globalDashboard.map.panTo ( marker.getPosition () );

                            globalDashboard.pvId = marker.id;

                            return false;
                        } else if ( $sideContWrap.hasClass ( 'on' ) && $sideContWrap.hasClass ( 'inactive' ) )
                        {
                            return false;
                        }
                    } );

            customizeScroll ( $sideWrap );
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

    if ( globalDashboard.pvId )
    {
        var $selectedDiv = $ ( '#powerstation_slide .side_cont_wrap[data-pv-id="' + globalDashboard.pvId + '"]' );

        $ ( '#powerstation_slide .side_cont_wrap' ).removeClass ( 'on' ).removeClass ( 'selected' );
        $selectedDiv.addClass ( 'on' ).addClass ( 'selected' );

        var selectedMarker = globalDashboard.markers.get ( globalDashboard.pvId );
        selectPowerstationMarker ( selectedMarker );

        $sideWrap.mCustomScrollbar ( 'scrollTo', $selectedDiv );
    }
}

// 국가별 발전소 목록 슬라이드 화면 구성
function clearPowerstationSlide ()
{
    var $powerstationSlide = $ ( '#powerstation_slide' );
    var $sideWrap = $powerstationSlide.find ( '.side_wrap' )

    clearInterval ( globalDashboard.interval.slideInterval );
    globalDashboard.interval.slideInterval = null;

    $sideWrap.mCustomScrollbar ( 'destroy' );
    $powerstationSlide.hide ();

    $ ( '.btn_powerstation_target' ).off ( 'click' );
}

// 발전소 화면 구성
function constitutePowerstation ()
{
    var deferred = $.Deferred ();

    console.log ( '발전소 화면 구성 요청' );

    var type = globalDashboard.TYPE.POWERSTATION;

    setLegend ( type );

    var powerstationArray = null;

    $.ajax ( {
        url : contextPath + '/hom/dashboard/global/selectPowerstationMarkerList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                powerstationArray = json.data;
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

    var errorFlag = false;

    $.each ( powerstationArray, function ( index, powerstation )
    {
        var marker = createPowerstationMarker ( type, powerstation );

        if ( marker === null )
        {
            errorFlag = true;

            globalDashboard.markers.clear ();

            return false;
        } else
        {
            globalDashboard.markers.put ( powerstation.id, marker );

            marker.addListener ( 'click', function ( e )
            {
                selectPowerstationMarker ( marker );

                setTimeout ( function ()
                {
                    globalDashboard.pvId = marker.id;
                    constitutePowerstationSlide ( marker.nationId );
                    globalDashboard.nationId = marker.nationId;

                    if ( globalDashboard.interval.slideInterval !== null )
                    {
                        clearInterval ( globalDashboard.interval.slideInterval );
                    }

                    globalDashboard.interval.slideInterval = setInterval ( function ()
                    {
                        constitutePowerstationSlide ( marker.nationId );
                    }, globalDashboard.interval.TIME );

                }, 100 );
            } );

            if ( globalDashboard.pvId === powerstation.id )
            {
                selectPowerstationMarker ( marker );
            }
        }
    } );

    if ( errorFlag )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertServerError,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );

        return;
    }

    globalDashboard.status = type;

    deferred.resolve ();
    return deferred.promise ();
}

// 발전소 화면 갱신
function updatePowerstation ()
{
    console.log ( '발전소 marker polling' );

    var powerstationArray = null;

    $.ajax ( {
        url : contextPath + '/hom/dashboard/global/selectPowerstationMarkerList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                powerstationArray = json.data;
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

    var markerArray = globalDashboard.markers.values ();
    var markerIdArray = [];
    var powerstationIdArray = _.pluck ( powerstationArray, 'id' );

    $.each ( markerArray, function ( index, marker )
    {
        markerIdArray.push ( marker.id );
    } );

    var deleteIdArray = _.compact ( _.difference ( markerIdArray, powerstationIdArray ) );

    // 마커 갱신
    $.each ( powerstationArray, function ( index, powerstation )
    {
        var marker = globalDashboard.markers.get ( powerstation.id );
        var markerType = getPowerstationMarkerType ( powerstation.serviceSttus, powerstation.alarmLevel );
        var markerSize = getMarkerSize ( globalDashboard.TYPE.POWERSTATION, powerstation.fcltyCpcty );
        var markerIcon = contextPath + '/img/common/' + 'icon_pin_' + markerType + '_' + markerSize;

        if ( globalDashboard.pvId === powerstation.id )
        {
            markerIcon = markerIcon + '_on';
        }

        markerIcon = markerIcon + '.png';

        marker.setIcon ( markerIcon );
        marker.set ( 'position', new google.maps.LatLng ( powerstation.lat, powerstation.lng ) );
    } );

    // 사라진 마커 제거
    $.each ( deleteIdArray, function ( index, deleteId )
    {
        deleteMarker ( deleteId );
    } );
}

// 발전소 마커 선택
function selectPowerstationMarker ( marker )
{
    var markerArray = globalDashboard.markers.values ();

    $.each ( markerArray, function ( index, tempMarker )
    {
        tempMarker.setIcon ( tempMarker.getIcon ().replace ( '_on.', '.' ) );
    });

    marker.setIcon ( marker.getIcon ().replace ( '.', '_on.' ) );
}

// 대륙/국가 화면 해제
function clearContinentNation ( type, keepSlide )
{
    var deferred = $.Deferred ();

    if ( type === globalDashboard.TYPE.CONTINENT )
    {
        deleteMapDatas ();
    }

    console.log ( '대륙/국가 marker interval 해제' );
    clearInterval ( globalDashboard.interval.markerInterval );
    globalDashboard.interval.markerInterval = null;

    deleteMarkers ();

    // if ( !keepSlide )
    // {
    // clearContinentSlide ();
    // }

    deferred.resolve ();
    return deferred.promise ();
}

// 발전소 화면 해제
function clearPowerstation ()
{
    var deferred = $.Deferred ();

    console.log ( '발전소 marker interval 해제' );
    clearInterval ( globalDashboard.interval.markerInterval );
    globalDashboard.interval.markerInterval = null;

    deleteMarkers ();
    deleteMapDatas ();

    clearPowerstationSlide ();

    deferred.resolve ();
    return deferred.promise ();
}

// 대륙/국가 마커 세부 정보 가져오기
function getContinentNationMarkerWithLabelInfo ( type, markerInfo, tpl )
{
    var totalCapacity = markerInfo.workCapacity + markerInfo.planCapacity + markerInfo.buildCapacity
            + markerInfo.operationCapacity
    var markerSize = getMarkerSize ( type, totalCapacity );
    var markerType = getContinentNationMarkerType ( markerInfo );

    var template = _.template ( globalDashboard.tpl.mapMarkerLabel );
    var html = template ( {
        contextPath : contextPath,
        i18nMessage : i18nMessage,
        homUtil : homUtil,
        markerInfo : markerInfo,
        markerType : markerType
    } );

    return {
        markerSize : markerSize,
        markerType : markerType,
        html : html
    };
}

// 대륙/국가 마커 생성
function createContinentNationMarker ( type, markerInfo )
{
    var marker = null;

    if ( globalDashboard.tpl.mapMarkerLabel !== null )
    {
        var markerWithLabelInfo = getContinentNationMarkerWithLabelInfo ( type, markerInfo,
                globalDashboard.tpl.mapMarkerLabel );

        marker = new MarkerWithLabel ( {
            position : new google.maps.LatLng ( markerInfo.lat, markerInfo.lng ),
            map : globalDashboard.map,
            icon : contextPath + '/img/common/' + 'icon_pin_' + markerWithLabelInfo.markerType + '_'
                    + markerWithLabelInfo.markerSize + '.png',
            title : markerInfo.title,
            labelContent : markerWithLabelInfo.html,
            labelAnchor : null,
            labelClass : 'marker_wrap',
            labelInBackground : false,
            draggable : false,
            raiseOnDrag : false,
            optimized : true,
            moveLat : markerInfo.moveLat,
            moveLng : markerInfo.moveLng
        } );
    }

    return marker;
}

// 발전소 마커 생성
function createPowerstationMarker ( type, markerInfo )
{
    var markerType = getPowerstationMarkerType ( markerInfo.serviceSttus, markerInfo.alarmLevel );
    var markerSize = getMarkerSize ( type, markerInfo.fcltyCpcty );
    var markerZIndex = getMakerZIndex ( markerInfo.serviceSttus );
    var marker = new google.maps.Marker ( {
        position : new google.maps.LatLng ( markerInfo.lat, markerInfo.lng ),
        map : globalDashboard.map,
        icon : contextPath + '/img/common/' + 'icon_pin_' + markerType + '_' + markerSize + '.png',
        zIndex : markerZIndex
    } );

    marker.id = markerInfo.id;
    marker.nationId = markerInfo.nationId;

    return marker;
}

// 마커 사이즈 구하기
function getMarkerSize ( type, totalCapacity )
{
    var markerSize = null;
    var range1 = null;
    var range2 = null;

    if ( type === globalDashboard.TYPE.CONTINENT )
    {
        range1 = globalDashboard.continent.CAPACITY_LEGEND.RANGE1;
        range2 = globalDashboard.continent.CAPACITY_LEGEND.RANGE2;
    } else if ( type === globalDashboard.TYPE.NATION )
    {
        range1 = globalDashboard.nation.CAPACITY_LEGEND.RANGE1;
        range2 = globalDashboard.nation.CAPACITY_LEGEND.RANGE2;
    } else if ( type === globalDashboard.TYPE.POWERSTATION )
    {
        range1 = globalDashboard.powerstation.CAPACITY_LEGEND.RANGE1;
        range2 = globalDashboard.powerstation.CAPACITY_LEGEND.RANGE2;
    }

    if ( totalCapacity > range2 )
    {
        markerSize = globalDashboard.MARKER_SIZE.LARGE;
    } else if ( totalCapacity <= range2 && totalCapacity > range1 )
    {
        markerSize = globalDashboard.MARKER_SIZE.MEDIUM;
    } else if ( totalCapacity <= range1 )
    {
        markerSize = globalDashboard.MARKER_SIZE.SMALL;
    }

    return markerSize;
}

// 대륙/국가 마커 타입 구하기
function getContinentNationMarkerType ( markerInfo )
{
    var markerType = null;

    if ( markerInfo.workCount > 0 )
    {
        if ( markerInfo.alarmLevel === 'ALVL04' )
        {
            markerType = 'gray';
        } else if ( markerInfo.alarmLevel === 'ALVL03' )
        {
            markerType = 'red';
        } else if ( markerInfo.alarmLevel === 'ALVL02' )
        {
            markerType = 'yellow';
        } else if ( markerInfo.alarmLevel === 'ALVL01' || markerInfo.alarmLevel === '' )
        {
            markerType = 'green';
        }
    } else
    {
        markerType = 'gray';
    }

    return markerType;
}

// 발전소 마커 타입 구하기
function getPowerstationMarkerType ( serviceSttus, alarmLevel )
{
    // 발전소 상태
    // SS01 - 계획
    // SS02 - 구축
    // SS03 - 가동
    // SS04 - 운영
    // SS05 - 중지
    var markerType = null;

    if ( serviceSttus === 'SS04' )
    {

        if ( alarmLevel === 'ALVL04' )
        {
            markerType = 'gray';
        } else if ( alarmLevel === 'ALVL03' )
        {
            markerType = 'red';
        } else if ( alarmLevel === 'ALVL02' )
        {
            markerType = 'yellow';
        } else if ( alarmLevel === 'ALVL01' || alarmLevel === '' )
        {
            markerType = 'green';
        }
    } else
    {
        markerType = serviceSttus.toLowerCase ();
    }

    return markerType;
}

// 발전소 상태에 따른 z-index 구하기
function getMakerZIndex ( serviceSttus )
{
    var zindex = 100;
    var multiple = 0;

    if ( serviceSttus === 'SS04' )
    {
        multiple = 4;
    } else if ( serviceSttus === 'SS03' )
    {
        multiple = 3;
    } else if ( serviceSttus === 'SS02' )
    {
        multiple = 2;
    } else if ( serviceSttus === 'SS01' )
    {
        multiple = 1;
    }

    return zindex * multiple;
}

// map data 생성
function createMapData ( type )
{
    var mapData = new google.maps.Data ();
    mapData.loadGeoJson ( contextPath + '/js/src/dashboard/' + type + '.geojson' );

    var fillColor = null;
    var strokeColor = null;

    if ( type === globalDashboard.continent.TYPE.ASIA )
    {
        fillColor = globalDashboard.continent.geojson.asia.FILL_COLOR;
        strokeColor = globalDashboard.continent.geojson.asia.STROKE_COLOR;
    } else if ( type === globalDashboard.continent.TYPE.AMERICA )
    {
        fillColor = globalDashboard.continent.geojson.america.FILL_COLOR;
        strokeColor = globalDashboard.continent.geojson.america.STROKE_COLOR;
    } else if ( type === globalDashboard.continent.TYPE.EUROPE )
    {
        fillColor = globalDashboard.continent.geojson.europe.FILL_COLOR;
        strokeColor = globalDashboard.continent.geojson.europe.STROKE_COLOR;
    } else if ( type === globalDashboard.continent.TYPE.AFRICA )
    {
        fillColor = globalDashboard.continent.geojson.africa.FILL_COLOR;
        strokeColor = globalDashboard.continent.geojson.africa.STROKE_COLOR;
    } else if ( type === globalDashboard.continent.TYPE.OCEANIA )
    {
        fillColor = globalDashboard.continent.geojson.oceania.FILL_COLOR;
        strokeColor = globalDashboard.continent.geojson.oceania.STROKE_COLOR;
    } else if ( type === globalDashboard.continent.TYPE.ANTARCTICA )
    {
        fillColor = globalDashboard.continent.geojson.antarctica.FILL_COLOR;
        strokeColor = globalDashboard.continent.geojson.antarctica.STROKE_COLOR;
    }

    mapData.setStyle ( function ( feature )
    {
        return {
            fillColor : fillColor,
            strokeColor : strokeColor,
            strokeWeight : 0.5
        };
    } );

    return mapData;
}

// 6대륙 map data 생성
function createContinentMapData ()
{
    globalDashboard.mapDatas.put ( globalDashboard.continent.TYPE.ASIA,
            createMapData ( globalDashboard.continent.TYPE.ASIA ) );
    globalDashboard.mapDatas.put ( globalDashboard.continent.TYPE.AMERICA,
            createMapData ( globalDashboard.continent.TYPE.AMERICA ) );
    globalDashboard.mapDatas.put ( globalDashboard.continent.TYPE.EUROPE,
            createMapData ( globalDashboard.continent.TYPE.EUROPE ) );
    globalDashboard.mapDatas.put ( globalDashboard.continent.TYPE.AFRICA,
            createMapData ( globalDashboard.continent.TYPE.AFRICA ) );
    globalDashboard.mapDatas.put ( globalDashboard.continent.TYPE.OCEANIA,
            createMapData ( globalDashboard.continent.TYPE.OCEANIA ) );
    globalDashboard.mapDatas.put ( globalDashboard.continent.TYPE.ANTARCTICA,
            createMapData ( globalDashboard.continent.TYPE.ANTARCTICA ) );
}

// 마커 전체 삭제
function deleteMarkers ()
{
    var markerArray = globalDashboard.markers.values ();

    $.each ( markerArray, function ( index, marker )
    {
        google.maps.event.clearInstanceListeners ( marker );

        marker.setMap ( null );
    } );

    globalDashboard.markers.clear ();
}

// 특정 마커 삭제
function deleteMarker ( id )
{
    var marker = globalDashboard.markers.get ( id );

    if ( typeof marker !== 'undefined' && marker !== null )
    {
        google.maps.event.clearInstanceListeners ( marker );

        marker.setMap ( null );

        globalDashboard.markers.remove ( id );
    }
}

// map data 삭제
function deleteMapDatas ()
{
    var mapDataArray = globalDashboard.mapDatas.values ();

    $.each ( mapDataArray, function ( index, mapData )
    {
        mapData.setMap ( null );
    } );
}

$ ( function ()
{
    globalDashboard = {
        map : null,
        markers : new Map (),
        mapDatas : new Map (),
        status : null,
        nationId : null,
        pvId : null,
        interval : {
            TIME : 1000 * 30,
            markerInterval : null,
            slideInterval : null
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
        MARKER_SIZE : {
            LARGE : 'l',
            MEDIUM : 'm',
            SMALL : 's'
        },
        tpl : {
            mapLegend : getTemplate ( templates.mapLegend ),
            mapMarkerLabel : getTemplate ( templates.mapMarkerLabel ),
            strategyNationInfo : getTemplate ( templates.strategyNationInfo ),
            continentInfo : getTemplate ( templates.continentInfo ),
            powerstationDiv : getTemplate ( templates.powerstationDiv )
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
            },
        },
        nation : {
            CAPACITY_LEGEND : {
                RANGE1 : 25000,
                RANGE2 : 50000
            }
        },
        powerstation : {
            CAPACITY_LEGEND : {
                RANGE1 : 10000,
                RANGE2 : 50000
            }
        }
    };

    createContinentMapData ();
    initScreenSize ();
    initMap ();
} );

$ ( window ).load ( function ()
{
    customizeScroll ( $ ( '.slide_cont_wrap' ) );
} );