// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.right_cont02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// init highcharts
function renderHighcharts ( series, unit1, unit2, unit3 )
{
    
    //TODO : 순시성능비 데이터 임시 제거
    series.splice(-1,1)
    
    var $graph1 = $ ( '#graph1' );
    homUtil.clearHighcharts ( [ $graph1.highcharts () ] );

    var date1 = new Date ( date.getFullYear (), date.getMonth (), date.getDate () );
    var date2 = new Date ( date.getFullYear (), date.getMonth (), date.getDate () + 1 );
    
    console.log('series[0].type--> '+series[0].type);
    
    //series 가 일사강도부터 시작하는 발전소의 경우 util.js 에 정의된  colorSet12 사용.    
    //type === 'column' 이면 일사강도임.나머진 line.
    
    // 그래프
    var chartOption = {
        colors : (series[0].type === 'column')?homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type12 ):homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
        chart : {
            marginTop : 50,
            zoomType : 'x',
            panning : true,
            panKey : 'shift'
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
                    var dateXAxis = homUtil.convertDateLongToString ( this.value, homUtil.dateFormat.convertHHMM );

                    return dateXAxis;
                }
            },
            min : date1.getTime (),
            max : date2.getTime ()
        },
        yAxis : [ {
            min : 0,
            title : {
                text : unit1
            }
        }, {
            min : 0,
            opposite : true,
            title : {
                text : unit2
            }
        }
        //TODO : 순시성능비 임시 제거      
        /*
        , {
            min : 0,
            opposite : true,
            title : {
                text : unit3
            }
          }
        */   
        ],
        tooltip : homUtil.generateTooltip ( homUtil.dateFormat.convertYYYYMMDDHHMM, staticVariable.decimalPoint ),
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
        series : series
    };

    $graph1.highcharts ( chartOption );

}

// 그래프 데이터 조회
function searchData ( unit )
{
    var $graph1 = $ ( '#graph1' );
    var $bgNodata = $ ( '.bg_nodata' );
    var $graphToday = $ ( "#graphToday" );

    var today = homUtil.convertDateLongToString ( date.getTime (), homUtil.dateFormat.convertYYYYMMDD );
    var params = {
        fromDate : today,
        toDate : homUtil.getIntervalDate ( date, 'DA', +1 ),
        unit : unit
    };

    $.ajax ( {
        url : contextPath + '/hom/realtime/realtime/getGraphData.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $graphToday.html ( today );
                if ( json.data.length > 0 )
                {
                    $graph1.show ();
                    $bgNodata.hide ();

                    var series = [];
                    var unit1 = null;
                    var unit2 = null;
                    var unit3 = null;
                    $.each ( json.data, function ( i, item )
                    {
                        var data = [];
                        $.each ( item.eqmtTrendValues, function ( j, value )
                        {
                            var targetDate = homUtil.convertDateStringToLong ( value.occrrncDt );
                            data
                                    .push ( [ targetDate,
                                            homUtil.mathFloor ( value.tagVal, staticVariable.decimalPoint ) ] );
                        } );

                        var seriesParam = null;
                        if ( item.paramtrNm === staticVariable.paramtrNmTap )
                        {
                            seriesParam = {
                                type : 'line',
                                yAxis : 0,
                                name : item.xAxisName,
                                data : data,
                                zIndex : 2
                            };
                            if ( unit1 === null )
                            {
                                unit1 = i18nMessage.msg_power + '(' + item.tagUnitVal + ')';
                            }
                        } else if ( item.paramtrNm === staticVariable.paramtrNmIpr )
                        {
                            seriesParam = {
                                type : 'line',
                                dashStyle : 'shortdot',
                                yAxis : 2,
                                name : item.xAxisName,
                                data : data,
                                zIndex : 2
                            };
                            if ( unit3 === null )
                            {
                                unit3 = i18nMessage.msg_instantaneousPerformanceRatio + '(' + item.tagUnitVal + ')';
                            }
                        } else
                        {
                            seriesParam = {
                                type : 'column',
                                yAxis : 1,
                                name : item.xAxisName,
                                data : data,
                                zIndex : 1
                            };
                            if ( unit2 === null )
                            {
                                unit2 = i18nMessage.msg_inPlaneRdtn + '(' + item.tagUnitVal + ')';
                            }
                        }
                        series.push ( seriesParam );
                    } );

                    renderHighcharts ( series, unit1, unit2, unit3 );
                } else
                {
                    $graph1.hide ();
                    $bgNodata.show ();
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

/**
 * 평균발전시간 = 종합현황테이블에서 조회 COD이후 주기 누적발전량 = 종합현황테이블에서 COD 이후 전일까지 조회 + 델타테이블 오늘날짜 델타 값 합 금일발전량 = 델타테이블 오늘날짜 DELTA_DATA_VAL
 * 합 발전출력 = 델타테일블 최근 DATA_VAL CO2 저감량 = 누적발전량* co2계숙/1000,000
 */
function getStatsData ()
{
    var $totalEnergyText = $ ( "#totalEnergyText" );
    var $totalEnergy = $ ( "#totalEnergy" );
    var $todayEnergy = $ ( "#todayEnergy" );
    var $currentPower = $ ( "#currentPower" );
    var $todayEnergyUnit = $ ( "#todayEnergyUnit" );
    var $currentPowerUnit = $ ( "#currentPowerUnit" );
    var $co2Reduction = $ ( "#co2Reduction" );
    $.ajax ( {
        url : contextPath + '/hom/realtime/realtime/getStatsData.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var cod = homUtil.convertDateStringToFormat ( homUtil.convertDateStringToPureFormat ( json.data.cod ),
                        homUtil.dateFormat.formatYYMMDD );
                var today = homUtil.convertDateLongToString ( date.getTime (), homUtil.dateFormat.convertYYMMDD );

                $totalEnergyText.html ( i18nMessage.msg_cumulativePowerGeneration + '(' + json.data.totalEnergyUnit
                        + ') <span>(' + cod + "~" + today + ')</span>' );

                $totalEnergy.text ( homUtil.mathFloorComma ( json.data.totalEnergy, staticVariable.decimalPoint ) );
                $todayEnergy.text ( homUtil.mathFloorComma ( json.data.todayEnergy, staticVariable.decimalPoint ) );
                $currentPower.text ( homUtil.mathFloorComma ( json.data.power, staticVariable.decimalPoint ) );

                $todayEnergyUnit.text ( i18nMessage.msg_todayEnergy + '(' + json.data.todayEnergyUnit + ')' );
                $currentPowerUnit.text ( i18nMessage.msg_power + '(' + json.data.powerUnit + ')' );
                $co2Reduction.text ( homUtil.mathFloorComma ( json.data.co2Reduction, staticVariable.decimalPoint ) );
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

function getWTSData ()
{
    var $wtsWrap = $ ( ".weather_station_wrap" );
    var $rtmRtCont = $ ( '.rtm_rt_cont' );
    var tpl = getTemplate ( templates.weatherStationDiv );
    $.ajax ( {
        url : contextPath + '/hom/realtime/realtime/getWTSData.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var num = 0;
                $.each ( json.data, function ( i, wtsTagInfo )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            homUtil : homUtil,
                            eqmtNm : i,
                            wtsTagInfoVoList : wtsTagInfo
                        } );

                        if ( num == 0 )
                        {
                            $wtsWrap.empty ().html ( html )
                        } else
                        {
                            $wtsWrap.append ( html )
                        }

                    }
                    num++;
                } );

                if ( num === 0 )
                {
                    $rtmRtCont.addClass ( 'f_right' );
                } else
                {
                    $rtmRtCont.removeClass ( 'f_right' );
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

// 단위 변경 버튼 클릭
function initUnit ()
{
    var $unitSelect = $ ( '.unit_select' );

    $unitSelect.on ( 'click', function ()
    {
        var valueUnit = $ ( this ).data ( 'unit' );

        $unitSelect.removeClass ( 'on' );
        $ ( this ).addClass ( 'on' );
        searchData ( valueUnit );
    } );
}

// 발전소 알람 상태 정의
function setAlarm ( $pvAlive )
{
    $.ajax ( {
        url : contextPath + '/hom/realtime/realtime/getPvAlarmStatus.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var powerstationInfo = json.data;
                var alarmIcon = 'green';
                if ( powerstationInfo.alarmLevel === 'ALVL01' )
                {
                    alarmIcon = 'green';
                } else if ( powerstationInfo.alarmLevel === 'ALVL02' )
                {
                    alarmIcon = 'yellow';
                } else if ( powerstationInfo.alarmLevel === 'ALVL03' )
                {
                    alarmIcon = 'red';
                } else if ( powerstationInfo.alarmLevel === 'ALVL04' )
                {
                    alarmIcon = 'gray';
                }

                /*
                 * var html = "<span class='selected'><i class='icon_" + alarmIcon + "'></i>" +
                 * powerstationInfo.alarmName + "</span>";
                 */

                console.log ( powerstationInfo.pvCommSttusIconCd );

                var html = '<span  class="selected">' + i18nMessage.msg_summaryEquipment + ' <i class=icon_'
                        + alarmIcon + '></i>' + '</span><span  class="selected">'
                        + i18nMessage.msg_summaryCommunication + ' <i class=' + powerstationInfo.pvCommSttusIconCd
                        + '></i></span>';

                $pvAlive.html ( html );
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

// 발전소 정보를 받아옴
function getPvInfo ( $avgPwPrdctTime, $locationList, $capacity, $capaList, $informationList )
{
    $.ajax ( {
        url : contextPath + '/hom/realtime/realtime/getPvInfo.ajax',
        type : 'POST',
        cache : false,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var data = json.data;
                var pvStdrInfoVO = data.pvStdrInfoVO;
                var ivtEqmtInfoList = data.ivtEqmtInfoList;
                var mdlEqmtInfoList = data.ptvltcmdlCorprInfoList;
                var epcCorprInfoVO = data.epcCorprInfoVO;
                var omCorprInfoVO = data.omCorprInfoVO;
                var capactyUnit = data.eqmtCpctyUnit;

                // 평균발전시간
                $avgPwPrdctTime.text ( pvStdrInfoVO.avgPwPrdtTime );
                $avgPwPrdctTime.parent ().find ( '.unit01' ).text ( '(' + pvStdrInfoVO.avgPwPrdtTimeUnit + ')' );
                // 위치 정보
                $locationList.find ( '.detlAddr' ).text ( pvStdrInfoVO.detlAddr );

                // 설치 용량
                $capacity.text ( homUtil.mathFloorComma ( pvStdrInfoVO.fcltyCpcty, staticVariable.decimalPoint ) );
                $capacity.find ( '.unit02' ).text ( capactyUnit );

                var pvSetupCpcty = 0;

                $.each ( ivtEqmtInfoList, function ( index, item )
                {
                    pvSetupCpcty += item.setupCpcty;
                } );

                // 인버터
                var $capaListIvt = $capaList.find ( '#capa_list_ivt' );
                if ( ivtEqmtInfoList !== null && ivtEqmtInfoList.length > 0 )
                {
                    var corprNm = ivtEqmtInfoList[0].corprNm;
                    if ( corprNm == null || corprNm == '' )
                    {
                        corprNm = '-';
                    }

                    $capaListIvt.find ( '.maker' ).text ( '(' + i18nMessage.msg_mnfctur + ' : ' + corprNm + ')' );
                    $capaListIvt.find ( '.supply' ).text (
                            homUtil.mathFloorComma ( pvSetupCpcty, staticVariable.decimalPoint )
                                    + ivtEqmtInfoList[0].setupCpctyUnit + ' (' + ivtEqmtInfoList.length + 'EA)' );
                } else
                {
                    $capaListIvt.find ( '.supply' ).text ( '0kW (0EA)' );
                }

                // 모듈
                var $capaListMdl = $capaList.find ( '#capa_list_mdl' );
                if ( mdlEqmtInfoList !== null && mdlEqmtInfoList.length > 0 )
                {
                    var entrpsNm = mdlEqmtInfoList[0].mdlMnfcturEntrpsNm;
                    if ( entrpsNm == null || entrpsNm == '' )
                    {
                        entrpsNm = '-';
                    }
                    $capaListMdl.find ( '.maker' ).text ( '(' + i18nMessage.msg_mnfctur + ' : ' + entrpsNm + ')' );
                    $capaListMdl.find ( '.supply' ).text (
                            homUtil.mathFloorComma ( mdlEqmtInfoList[0].eqmtCpcty, staticVariable.decimalPoint )
                                    + mdlEqmtInfoList[0].eqmtCpctyUnit );
                } else
                {
                    $capaListMdl.find ( '.supply' ).text ( '0Wp' );
                }

                // 협력 업체
                var spcNmText = pvStdrInfoVO.spcNm;
                if ( spcNmText == null )
                {
                    spcNmText = '';
                }
                $informationList.find ( '#spcNm' ).text ( spcNmText );
                if ( epcCorprInfoVO !== null )
                {
                    var epcCorprNm = epcCorprInfoVO.corprEngNm;
                    if ( lang == locale.korea || lang == locale.korean )
                    {
                        epcCorprNm = epcCorprInfoVO.corprKorNm;
                    }
                    $informationList.find ( '#epcCorprInfo' ).text ( epcCorprNm );
                }

                if ( omCorprInfoVO !== null )
                {
                    var omCorprNm = omCorprInfoVO.corprEngNm;
                    if ( lang == locale.korea || lang == locale.korean )
                    {
                        omCorprNm = omCorprInfoVO.corprKorNm;
                    }
                    $informationList.find ( '#omCorprInfo' ).text ( omCorprNm );
                }
                $informationList.find ( '#cod' ).text ( pvStdrInfoVO.cod );

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

// 현재 선택된 단위를 가져온다.
function getUnitValue ()
{
    var unit = null;
    var $unitSelect = $ ( '.unit_select' );
    $unitSelect.each ( function ( index, data )
    {
        var $data = $ ( data );
        if ( $data.hasClass ( 'on' ) )
        {
            unit = $data.data ( 'unit' );
            return false;
        }
    } );

    return unit;
}

// 3초 interval 함수 - 발전소 알람 상태
function threeSecondsInerval ()
{
    // var $pvAlive = $ ( '#pvAlive' );
    // setAlarm ( $pvAlive );
    getPvAlarmStatus ();
    setInterval ( function ()
    {
        // setAlarm ( $pvAlive );
        getPvAlarmStatus ();
    }, 1000 * 3 );
}

// 4분 interval 함수
function fourMinutesInterval ()
{
    var valueUnit = getUnitValue ();

    getWTSData ();
    searchData ( valueUnit );
    getStatsData ();
    setInterval ( function ()
    {
        getWTSData ();
        getStatsData ();
        searchData ( valueUnit );
    }, 1000 * 60 * 4 );
}

// 6시간 interval 함수 - 발전소 정보
function sixHoursInterval ()
{
    var $avgPwPrdctTime = $ ( '#avgPwPrdctTime' );
    var $locationList = $ ( '.location_list' );
    var $capacity = $ ( '.capacity .kilowatts' );
    var $capaList = $ ( '.capa_list' );
    var $informationList = $ ( '.information_list' );
    // getPvInfo ( $avgPwPrdctTime, $locationList, $capacity, $capaList, $informationList );
    setInterval ( function ()
    {
        getPvInfo ( $avgPwPrdctTime, $locationList, $capacity, $capaList, $informationList );
    }, 1000 * 60 );
    // }, 1000 * 60 * 60 * 6 );
}

// 더보기 버튼 설정
function setBtnMore ()
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

    var $btnClose = $ ( '.more_detail_box .btn_close' );
    $btnClose.unbind ( 'click' );
    $btnClose.on ( 'click', function ()
    {
        $moreBox.removeClass ( 'on' );
        $moreBox.hide ();
    } );
}

// 알람 상태
function getPvAlarmStatus ()
{
    $.ajax ( {
        url : contextPath + '/hom/common/selectAlarmStatus.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alarmstatus = json.data;
                $ ( "#pvAlarm" ).attr ( 'class', 'dvc_status ' + alarmstatus );
                var alarmText = "";

                if ( alarmstatus == "normal" )
                {
                    alarmText = i18nMessage.msg_mntrNormal;
                } else if ( alarmstatus == "warnng" )
                {
                    alarmText = i18nMessage.msg_mntrEqmtWarning;
                } else if ( alarmstatus == "broken" )
                {
                    alarmText = i18nMessage.msg_mntrFault;
                } else if ( alarmstatus == "neterr" )
                {
                    alarmText = i18nMessage.msg_mntrNetErr;
                }

                $ ( "#pvAlarm" ).text ( alarmText );
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

$ ( function ()
{
    // customizeScroll ();
    initUnit ();
    setBtnMore ();

    threeSecondsInerval ();
    fourMinutesInterval ();
    sixHoursInterval ();
} );