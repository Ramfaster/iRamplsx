/**
 * js Name      : common.js
 * Description  : 공통 유틸 함수들 
 * 
 * Modification Information
 *
 *  수정일           수정자               수정내용
 * -----------      -----------         ---------------------
 * 
 * @author CHA
 * @since 2014.04.03
 * @version 1.0
 **/

/***********************************************************************************************************************
 * 전역변수 선언 영억
 **********************************************************************************************************************/

// 선택한 발전소의 local date
var date = null;

$ ( function ()
{
    // TODO 실제 운영 시 주석 풀기
    // disableRefresh ();
    initUnderscore ();
    initValidate ();
    initHighcharts ();
    initAlarmStatus ();
    initFireStatus ();
    initHeaderDateTime ();
    initHeaderWeatherInfo ();
    initRss ();
    disableBackspace ();
} );

// f5 막기
function disableRefresh ()
{
    $ ( document ).keydown ( function ( event )
    {
        if ( event.which === 116 )
        {
            if ( typeof event == "object" )
            {
                event.keyCode = 0;
            }

            return false;
        } else if ( event.which === 82 && event.ctrlKey )
        {
            return false;
        }
    } );
}

// backspace 막기
function disableBackspace ()
{
    $ ( document ).keydown (
            function ( event )
            {
                if ( event.which === 8 )
                {
                    var d = event.srcElement || event.target;
                    if ( (d.tagName.toUpperCase () === 'INPUT' && (d.type.toUpperCase () === 'TEXT'
                            || d.type.toUpperCase () === 'PASSWORD' || d.type.toUpperCase () === 'FILE'
                            || d.type.toUpperCase () === 'SEARCH' || d.type.toUpperCase () === 'EMAIL'
                            || d.type.toUpperCase () === 'NUMBER' || d.type.toUpperCase () === 'DATE' || d.type
                            .toUpperCase () === 'HIDDEN'))
                            || d.tagName.toUpperCase () === 'TEXTAREA' )
                    {
                        return true;
                    } else
                    {
                        return false;
                    }
                }
            } );
}

// underscore 설정
function initUnderscore ()
{
    if ( typeof _ !== 'undefined' )
    {
        _.templateSettings = {
            interpolate : /\{\{=([^-][\S\s]+?)\}\}/g,
            evaluate : /\{\{([^-=][\S\s]+?)\}\}/g,
            escape : /\{\{-([^=][\S\s]+?)\}\}/g
        };
    }
}

// jquery-validate 초기화
function initValidate ()
{
    if ( typeof $.validator !== 'undefined' )
    {
        $.validator.setDefaults ( {
            onkeyup : false,
            onclick : false,
            onfocusout : false
        } );

        $.validator.addMethod ( 'selectRequired', function ( value )
        {
            return (value !== '');
        }, '해당 항목은 필수 선택항목입니다.' );

        $.validator.addMethod ( 'phoneValid', function ( value, element )
        {

            return this.optional ( element )
                    || /^(\+([0-9]{1,3})-?([0-9]{0,3})|([0-9]{2,3}))-?([0-9]{3,4})-?([0-9]{4})$/.test ( value );
        }, '해당 항목은 필수 선택항목입니다.' );

        $.validator
                .addMethod (
                        'emailValid',
                        function ( value, element )
                        {
                            return this.optional ( element )
                                    || /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
                                            .test ( value );
                        }, '이메일 형식이 잘못되었습니다.' );

        $.validator.addMethod ( 'passwordValid', function ( value, element )
        {
            return this.optional ( element ) || /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,8}$/.test ( value );
        }, '비밀번호는 6~8자, 영문/숫자/특수문자의 조합으로 입력해주세요.' );

        $.validator.addMethod ( 'regex', function ( value, element, regex )
        {
            var regExp = new RegExp ( regex );
            return regExp.test ( value );
        }, '형식에 맞춰 입력해주세요.' );
    }
}

// highcharts 설정
function initHighcharts ()
{
    if ( typeof Highcharts !== 'undefined' )
    {
        Highcharts.setOptions ( {
            lang : {
                decimalPoint : '.',
                thousandsSep : ','
            },
            global : {
                useUTC : false
            }
        } );
    }
}

// 상단 알람 상태 설정
function initAlarmStatus ()
{

	getAlarmStatus ( );
	showAlarmListTicker ( );
	
    setInterval ( function ()
    {
    	getAlarmStatus ( );
    	showAlarmListTicker ( );
    }, 1000 * 3 );
}


//알람 ticker 보이기
function showAlarmListTicker (  )
{
 
     var pvAlarmBannerList = null;

     $.ajax ( {
         url : contextPath + '/hom/common/selectAlarmList.ajax',
         type : 'POST',
         dataType : 'json',
         async : false,
         success : function ( json )
         {
             if ( json.status === staticVariable.jsonStatusSuccess )
             {
                 pvAlarmBannerList = json.data;
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

     if ( pvAlarmBannerList === null || pvAlarmBannerList.length === 0 )
     {
    	 var alarmCount = 0;
    	 var $mark = $ ( '#btn_alarm_count' ).find ( '.mark' );

         if ( !$.isNumeric ( alarmCount ) )
         {
             alarmCount = 0;
         }   

         var alarmCountView = alarmCount;
         if ( alarmCount > staticVariable.limitAlarmCount )
         {
             alarmCountView = staticVariable.limitAlarmCount + '<sup>+</sup>';
         }
         
         $mark.html ( alarmCountView ).data ( 'alarm-count', alarmCount );
     } else
     {
    	 var alarmCount = pvAlarmBannerList.length;
    	
    	 var $mark = $ ( '#btn_alarm_count' ).find ( '.mark' );

         if ( !$.isNumeric ( alarmCount ) )
         {
             alarmCount = 0;
         } 
         
         var alarmCountView = alarmCount;
         if ( alarmCount > staticVariable.limitAlarmCount )
         {
             alarmCountView = staticVariable.limitAlarmCount + '<sup>+</sup>';
         }

         $mark.html ( alarmCountView ).data ( 'alarm-count', alarmCount );
     }

}

// 알람 상태 
function getAlarmStatus (  )
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
                $("#headerAlarmStatus").attr('class', 'alarm_dvc '+alarmstatus);
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

//상단 알람 상태 설정
function initFireStatus ()
{

    setInterval ( function ()
    {
    	getFireStatus ( );
    }, 1000 * 3 );
}

// 알람 상태 
function getFireStatus (  )
{
	$.ajax ( {
        url : contextPath + '/hom/common/selectFireStatus.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alarmstatus = json.data;
                $(".alarm_fire").attr('class', 'alarm_fire '+alarmstatus);
                if(alarmstatus == "on")
                {
                	$("#fireAlertBox").css('display', '');
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


// 상단 header 시간 세팅
function initHeaderDateTime ()
{
    var $datetimeBox = $ ( '#datetime_box' );

    if ( typeof presentTime !== 'undefined' )
    {
        var year = parseInt ( presentTime.substring ( 0, 4 ), 10 );
        var month = parseInt ( presentTime.substring ( 4, 6 ), 10 ) - 1;
        var day = parseInt ( presentTime.substring ( 6, 8 ), 10 );
        var hours = parseInt ( presentTime.substring ( 8, 10 ), 10 );
        var minutes = parseInt ( presentTime.substring ( 10, 12 ), 10 );
        var seconds = parseInt ( presentTime.substring ( 12, 14 ), 10 );

        date = new Date ( year, month, day, hours, minutes, seconds );

        showHeaderDateTime ( $datetimeBox );

        setInterval ( function ()
        {
            date.setSeconds ( date.getSeconds () + 1 );
            showHeaderDateTime ( $datetimeBox );
        }, 1000 );
    }
}

// 상단 header 시간 보이기
function showHeaderDateTime ( $datetimeBox )
{
    if ( $datetimeBox.size () !== 0 )
    {
        var year = date.getFullYear ();
        var month = date.getMonth () + 1;
        var day = date.getDate ();
        var hours = date.getHours ();
        var minutes = date.getMinutes ();
        var seconds = date.getSeconds ();

        $datetimeBox.html ( year + '-' + cf_lpadToZero ( month, 2 ) + '-' + cf_lpadToZero ( day, 2 ) + ' '
                + cf_lpadToZero ( hours, 2 ) + ':' + cf_lpadToZero ( minutes, 2 ) + ':' + cf_lpadToZero ( seconds, 2 ) );
    }
}

// 상단 header 날씨 정보 세팅
function initHeaderWeatherInfo ()
{
    var tpl = getTemplate ( templates.weatherInfo );

    showHeaderWeatherInfo ( tpl );

    setInterval ( function ()
    {
        showHeaderWeatherInfo ( tpl );
    }, 1000 * 60 * 60 * 24 );
}

// 상단 header 날씨 정보 보이기
function showHeaderWeatherInfo ( tpl )
{
    var $weatherBox = $ ( '#weather_box' );

    if ( $weatherBox.size () !== 0 )
    {
        $.ajax ( {
            url : contextPath + '/hom/common/selectWethrInfo.ajax',
            type : 'POST',
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            homUtil : homUtil,
                            weatherInfo : json.data
                        } );

                        $weatherBox.html ( html );
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
}

// 하단 footer RSS 세팅
function initRss ()
{
    var $rssList = $ ( '#rss_list' );
    var tpl = getTemplate ( templates.rssLi );

    if ( $rssList.size () !== 0 )
    {
        showRss ( $rssList, tpl );
        // setInterval ( function ()
        // {
        // showRss ( $rssList, tpl );
        // }, 1000 * 30 );
    }
}

// 하단 footer RSS 보이기
function showRss ( $rssList, tpl )
{
    $.ajax ( {
        url : contextPath + '/common/selectRssList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        rssList : json.data
                    } );

                    var length = json.data.length;

                    if ( length > 0 )
                    {
                        $ ( '#rss_control' ).show ();
                        $rssList.html ( html );

                        var $rssFeedSlider = $rssList.bxSlider ( {
                            minSlides : 4,
                            maxSlides : length,
                            moveSlides : 1,
                            speed : 500,
                            pause : 6000,
                            auto : true,
                            autoControls : false,
                            autoHover : true,
                            controls : false,
                            touchEnabled : false,
                            pager : false
                        } );

                        $ ( '.btn_next' ).on ( 'click', function ()
                        {
                            $rssFeedSlider.goToPrevSlide ();
                        } );

                        $ ( '.btn_prev' ).on ( 'click', function ()
                        {
                            $rssFeedSlider.goToNextSlide ();
                        } );

                        $ ( '#btn_play_control' ).on ( 'click', function ()
                        {
                            if ( $ ( this ).hasClass ( 'btn_stop' ) )
                            {
                                $ ( this ).removeClass ( 'btn_stop' ).addClass ( 'btn_play' );
                                $rssFeedSlider.stopAuto ();
                            } else
                            {
                                $ ( this ).removeClass ( 'btn_play' ).addClass ( 'btn_stop' );
                                $rssFeedSlider.startAuto ();
                            }
                        } );
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

// template resource 가져오기
function getTemplate ( url )
{
    var tpl = null;

    $.ajax ( {
        url : url,
        type : 'get',
        async : false,
        success : function ( template )
        {
            tpl = template;
        },
        error : function ( xhr, textStatus, error )
        {
            console.log ( 'template loading is failed, url : ' + url );
            location.href = contextPath + '/login.do?session=true';
        }
    } );

    return tpl;
}

// 유효성 체크 메시지 생성
function makeValidateMessage ( message )
{
    return '<i>*</i>' + message;
}

// 값 버림 처리 - homUtil.mathFloor 기능 동일
function numberFloor ( value, digit )
{
    var returnValue = null;
    var parseValue = parseFloat ( value );
    var flag = false;

    // digit 값이 유효하지 않을 경우 소수점 1자리 표현으로 default 처리
    if ( !$.isNumeric ( digit ) )
    {
        digit = 1;
    }

    if ( $.isNumeric ( parseValue ) )
    {
        if ( parseValue < 0 )
        {
            flag = true;
        }

        parseValue = Math.abs ( parseValue );

        var divisor = Math.pow ( 10, digit );
        returnValue = Math.floor ( parseValue * divisor ) / divisor;

        if ( flag )
        {
            returnValue = -returnValue;
        }
    }

    return returnValue;
}

// 숫자 콤마 처리
function addNumberComma ( value )
{
    if ( !$.isNumeric ( value ) )
    {
        return value;
    }

    var regEx = /(^[+-]?\d+)(\d{3})/;
    var returnValue = value.toString ();

    while ( regEx.test ( returnValue ) )
    {
        returnValue = returnValue.replace ( regEx, '$1' + ',' + '$2' );
    }

    return returnValue;
}


//값 버림 + 숫자 콤마 처리 - homUtil.mathRoundComma 기능 동일
function numberRoundComma ( value, digit )
{
 var regEx = /(^[+-]?\d+)(\d{3})/;

 var returnValue = null;
 // digit 값이 유효하지 않을 경우 소수점 1자리 표현으로 default 처리
 if ( $.isNumeric ( value ) )
 {
     var divisor = Math.pow ( 10, digit );
     returnValue = Math.round ( value * divisor ) / divisor;
 }

 if ( $.isNumeric ( returnValue ) )
 {
     returnValue = returnValue.toFixed ( digit );
     while ( regEx.test ( returnValue ) )
     {
         returnValue = returnValue.replace ( regEx, '$1' + ',' + '$2' );
     }
 } else
 {
     returnValue = '-';
 }

 return returnValue;
}

// 값 버림 + 숫자 콤마 처리 - homUtil.mathFloorComma 기능 동일
function numberFloorComma ( value, digit )
{
    var regEx = /(^[+-]?\d+)(\d{3})/;

    // digit 값이 유효하지 않을 경우 소수점 1자리 표현으로 default 처리
    if ( !$.isNumeric ( digit ) )
    {
        digit = 1;
    }

    var returnValue = numberFloor ( value, digit );

    if ( $.isNumeric ( returnValue ) )
    {
        returnValue = returnValue.toFixed ( digit );
        while ( regEx.test ( returnValue ) )
        {
            returnValue = returnValue.replace ( regEx, '$1' + ',' + '$2' );
        }
    } else
    {
        returnValue = '-';
    }

    return returnValue;
}

// 값 버림 + 절대값 처리 - homUtil.mathAbsFloor 기능 동일
function numberAbsFloor ( value, digit )
{
    var returnValue = numberFloor ( value, digit );

    if ( $.isNumeric ( returnValue ) )
    {
        returnValue = Math.abs ( returnValue );
    }

    return returnValue;
}

// 값 버림 + 절대값 + 숫자 콤마 처리 - homUtil.mathAbsFloorComma 기능 동일
function numberAbsFloorComma ( value, digit )
{
    var regEx = /(^[+-]?\d+)(\d{3})/;

    // digit 값이 유효하지 않을 경우 소수점 1자리 표현으로 default 처리
    if ( !$.isNumeric ( digit ) )
    {
        digit = 1;
    }

    var returnValue = numberAbsFloor ( value, digit );

    if ( $.isNumeric ( returnValue ) )
    {
        returnValue = returnValue.toFixed ( digit );
        while ( regEx.test ( returnValue ) )
        {
            returnValue = returnValue.replace ( regEx, '$1' + ',' + '$2' );
        }
    } else
    {
        returnValue = '-';
    }

    return returnValue;
}

// jqgrid abs gap formatter with 발전소 실적 비율 정보
function jqgridAbsGapFormatter ( cellvalue, options, rowObject, pvAcmsltRateList, digit )
{
    var parsedCellValue = parseFloat ( cellvalue );
    var formattedCellValue = '';
    var styleColor = '';

    // cellvalue 가 양수, 0, 음수이므로 100을 더해서 넘겨줌
    // 발전소 실적 비율 정보는 0 부터 무한대의 range를 가지고 있음
    var rateValue = null;
    if ( $.isNumeric ( cellvalue ) )
    {
        rateValue = parsedCellValue + 100;
    }

    var upAndDownArrowInfo = getUpAndDownArrowInfo ( pvAcmsltRateList, rateValue );

    if ( typeof upAndDownArrowInfo !== 'undefined' && upAndDownArrowInfo !== null && upAndDownArrowInfo.color != null )
    {
        styleColor = 'style="color:' + upAndDownArrowInfo.color + ';"';
    }

    if ( $.isNumeric ( cellvalue ) )
    {
        if ( parsedCellValue > 0 || parsedCellValue < 0 )
        {
            formattedCellValue = '( <i class="updown_symbol" ' + styleColor + '>' + upAndDownArrowInfo.symbol
                    + '</i> ) ' + numberAbsFloorComma ( cellvalue, digit );
        } else
        {
            formattedCellValue = '<i>( ' + upAndDownArrowInfo.symbol + ' ) ' + numberFloorComma ( 0, digit ) + '</i>';
        }
    } else
    {
        formattedCellValue = '<i>( ' + upAndDownArrowInfo.symbol + ' ) ' + numberFloorComma ( 0, digit ) + '</i>';
    }

    return formattedCellValue;
}

// jqgrid number abs gap formatter
// ( ▲ ) 0.7, ( ▼ ) 0.5
function jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject, digit )
{
    var parsedCellValue = parseFloat ( cellvalue );
    var formattedCellValue = '';

    if ( $.isNumeric ( cellvalue ) )
    {
        if ( parsedCellValue > 0 )
        {
            formattedCellValue = '( <i class="icon_up"></i> ) ' + numberAbsFloorComma ( cellvalue, digit );
        } else if ( parsedCellValue < 0 )
        {
            formattedCellValue = '( <i class="icon_down"></i> ) ' + numberAbsFloorComma ( cellvalue, digit );
        } else
        {
            formattedCellValue = '<i>( - ) ' + numberFloorComma ( 0, digit ) + '</i>';
        }
    } else
    {
        formattedCellValue = '<i>( - ) ' + numberFloorComma ( 0, digit ) + '</i>';
    }

    return formattedCellValue;
}

// jqgrid의 헤더값 갱신 및 위치 조정
function jqgridHeaderLabelUpdate ( $selector, text )
{
    $selector.html ( text );

    // 3px은 jqgrid 랜더링 시 상단에 붙지 않는 문제가 있어 이를 해결하기 위함임 - silver0r
    var top = ($selector.parent ().outerHeight ( true ) - $selector.outerHeight ( true )) / 2;
    if ( $.isNumeric ( top ) )
    {
        $selector.css ( 'top', top - 3 );
    }
}

// jqgrid percent data abs gap formatter
function jqgridPercentAbsGapFormatter ( avg, data, pvAcmsltRateList, digit )
{
    var cellValue = calculatePercentGap ( avg, data );
    var formattedCellValue = numberFloorComma ( data, staticVariable.decimalPoint ) + '<br />';
    var styleColor = '';

    var rateValue = null;
    if ( $.isNumeric ( cellValue ) )
    {
        rateValue = cellValue + 100;
    }

    var upAndDownArrowInfo = getUpAndDownArrowInfo ( pvAcmsltRateList, rateValue );
    if ( typeof upAndDownArrowInfo !== 'undefined' && upAndDownArrowInfo !== null && upAndDownArrowInfo.color != null )
    {
        styleColor = 'style="color:' + upAndDownArrowInfo.color + ';"';
    }

    if ( $.isNumeric ( cellValue ) )
    {
        if ( cellValue > 0 || cellValue < 0 )
        {
            formattedCellValue += '( <i class="updown_symbol" ' + styleColor + '>' + upAndDownArrowInfo.symbol
                    + '</i> ' + numberAbsFloorComma ( cellValue, digit ) + ')';
        } else
        {
            formattedCellValue += '<i>( ' + upAndDownArrowInfo.symbol + ' ' + numberFloorComma ( 0, digit ) + ')</i>';
        }
    } else
    {
        formattedCellValue += '<i>( ' + upAndDownArrowInfo.symbol + ')</i>';
    }

    return formattedCellValue;
}

// jqgrid value data abs gap formatter
function jqgridValueAbsGapFormatter ( avg, data, digit )
{
    var cellValue = calculatePercentGap ( avg, data );
    var formattedCellValue = numberFloorComma ( data, staticVariable.decimalPoint ) + '<br />';
    var styleColor = '';

    if ( $.isNumeric ( cellValue ) )
    {
        if ( cellValue > 0 )
        {
            formattedCellValue += '( <i class="icon_up"></i> ) ' + numberAbsFloorComma ( cellValue, digit );
        } else if ( cellValue < 0 )
        {
            formattedCellValue += '( <i class="icon_down"></i> ) ' + numberAbsFloorComma ( cellValue, digit );
        } else
        {
            formattedCellValue += '<i>( - ) ' + numberFloorComma ( 0, digit ) + '</i>';
        }
    } else
    {
        formattedCellValue += '<i>( - ) ' + numberFloorComma ( 0, digit ) + '</i>';
    }

    return formattedCellValue;
}

// 퍼센트 gap 계산(성능비 - 평균)
function calculatePercentGap ( avg, data )
{
    var value = null;

    if ( $.isNumeric ( avg ) && $.isNumeric ( data ) )
    {
        value = data - avg;
    }

    return value;
}

// 발전소 실적 비율을 가져옴
function getPvAcmsltRateInfo ()
{
    var pvAcmsltRateList = null;
    $.ajax ( {
        url : contextPath + '/hom/common/selectPvAcmsltRateInfoList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                pvAcmsltRateList = json.data;
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

    return pvAcmsltRateList;
}

// 발전소 실적 비율 정보를 토대로 해당하는 값의 컬러와 symbol 정보 리턴
function getUpAndDownArrowInfo ( pvAcmsltRateList, value )
{
    var upAndDownArrowInfo = {
        color : null,
        symbol : '-'
    };

    if ( $.isNumeric ( value ) )
    {
        value = parseFloat ( value );
        // 비율에 해당하는 색상 선택
        if ( value !== 100 && typeof pvAcmsltRateList !== 'undefined' && pvAcmsltRateList !== null
                && pvAcmsltRateList.length > 0 )
        {
            $.each ( pvAcmsltRateList, function ( i, pvAcmsltRate )
            {
                if ( parseFloat ( pvAcmsltRate.minRate ) <= value )
                {
                    if ( pvAcmsltRate.maxRate == null || pvAcmsltRate.maxRate == '' )
                    {
                        upAndDownArrowInfo.color = pvAcmsltRate.hexCd;

                        return false;
                    } else if ( parseFloat ( pvAcmsltRate.maxRate ) > value )
                    {
                        upAndDownArrowInfo.color = pvAcmsltRate.hexCd;

                        return false;
                    }
                }
            } );
        }

        // 비율에 해당하는 symbol 선택
        if ( value === 100 )
        {
            upAndDownArrowInfo.symbol = '-';
        } else if ( value > 100 )
        {
            upAndDownArrowInfo.symbol = '▲';
        } else
        {
            upAndDownArrowInfo.symbol = '▼';
        }
    }

    return upAndDownArrowInfo;
}

/**
 * <pre>
 * 그룹헤더의rowspan을늘리고하위
 * 헤더를숨긴다.
 * </pre>
 * 
 * @param $gridList
 * @param $jqgheaderTh
 * @param groupHeaderTargetIndex
 * @param paramColModelArray
 * @param rowspan
 */
function customizeJqgridHeader ( $gridList, $jqgheaderTh, groupHeaderTargetIndex, paramColModelArray, rowspan )
{
    var defaultCss = {
        'border-bottom' : '0 none'
    };

    if ( rowspan > 1 )
    {
        // 구분 그룹헤더의 rowspan을 추가하고 html을 삽입한다.
        var $groupHeader = $jqgheaderTh.eq ( groupHeaderTargetIndex );
        var html = '<div class="ui-th-div" style="top:12.5px;">' + $groupHeader.text () + '</div>';
        $groupHeader.attr ( 'rowspan', rowspan ).css ( defaultCss ).html ( html );
    } else
    {
        $jqgheaderTh.each ( function ( index, th )
        {
            var $th = $ ( th );
            if ( index == groupHeaderTargetIndex )
            {
                var html = '<div class="ui-th-div" style="top:0px;">' + $th.text () + '</div>';
                var css = {
                    'border-bottom' : '0 none',
                    'padding-top' : '2px'
                };
                $th.attr ( 'rowspan', rowspan ).css ( css ).html ( html );
            } else
            {
                $th.find ( 'span' ).css ( 'height', '0px' );
                $th.find ( 'div' ).css ( 'top', '0px' );
                $th.attr ( 'rowspan', rowspan ).css ( defaultCss );
            }
        } );
    }

    // 그룹 header의 구분 밑의 헤더들을 숨김다.
    var colModel = $gridList[0].p.colModel;
    var ths = $gridList[0].grid.headers;
    $.each ( colModel, function ( i, model )
    {
        $.each ( paramColModelArray, function ( j, param )
        {
            if ( model.name === param )
            {
                $ ( ths[i].el ).hide ();
                return false;
            }
        } );
    } );
}

// highcharts 이미지 path를 가져옴
function getHighchartsImagePath ( dataString )
{
    var imgUrl = null;
    $.ajax ( {
        url : staticVariable.exportUrl,
        type : 'POST',
        data : dataString,
        async : false,
        success : function ( data )
        {
            imgUrl = data;
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
    return imgUrl;
}

/*
 * 마지막 row의 붙어있는 셀들(가로)을 병합 처리
 * 
 * mergeStartIndex : 병합 시작 인덱스
 * 
 * length : 병합 갯수
 */
function colspanLastRow ( $gridList, mergeStartIndex, length )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var lastRowCl = ids[ids.length - 1];
    var $tds = $ ( '#' + lastRowCl ).find ( 'td' );

    for ( var i = mergeStartIndex + 1, size = mergeStartIndex + length; i < size; i++ )
    {
        $tds.eq ( i ).hide ();
    }

    $tds.eq ( mergeStartIndex ).attr ( 'colspan', length );
}

/*
 * 
 * 같은 값이 있는 열을 병합함
 * 
 * 사용법 : $('#테이블 ID').rowspan(0, 1); 첫번째 인자 병합할 기준 값을 가진 셀 두번째 인자 기준 값에 따라 같이 병합될 셀
 * 
 */
$.fn.rowspan = function ( colIdx, colIdxN, isStats )
{
    return this.each ( function ()
    {
        var that;
        var grid = this;
        $ ( 'tr', this ).each (
                function ( row )
                {
                    $ ( 'td:eq(' + colIdx + ')', this ).filter ( ':visible' ).each (
                            function ( col )
                            {

                                if ( $ ( this ).html () == $ ( that ).html ()
                                        && (!isStats || isStats
                                                && $ ( this ).prev ().html () == $ ( that ).prev ().html ()) )
                                {
                                    var neighborThat = $ ( that );
                                    var neighborThis = $ ( this );
                                    for ( var i = colIdx; i < colIdxN; i++ )
                                    {
                                        neighborThat = neighborThat.next ();
                                        neighborThis = neighborThis.next ();
                                    }

                                    rowspan = $ ( that ).attr ( 'rowspan' ) || 1;
                                    rowspan = Number ( rowspan ) + 1;

                                    $ ( that ).attr ( 'rowspan', rowspan );
                                    neighborThat.attr ( 'rowspan', rowspan );

                                    // do your action for the colspan cell here
                                    $ ( this ).hide ();

                                    neighborThis.hide ();
                                    // $(this).remove();
                                    // do your action for the old cell here

                                } else
                                {
                                    that = this;
                                }

                                // set the that if not already set
                                that = (that == null) ? this : that;
                            } );
                } );
    } );
};

// Ajax 선언변수
var xmlhttp;
if ( window.XMLHttpRequest )
{
    xmlhttp = new XMLHttpRequest ();
}

/**
 * <pre>
 * 기본윈도우오픈
 * </pre>
 * 
 * @param url
 * @param width
 * @param height
 * @param windowName
 */
function cf_windowOpen ( url, width, height, windowName )
{
    var top = (window.screen.height - height) / 2;
    var left = (window.screen.width - width) / 2;

    var position = 'width=' + width + 'px ,height=' + height + 'px ,top=' + top + ',left=' + left;
    var winset = 'resizable=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,directories=no,status=no,' + position;

    window.open ( url, windowName, winset );

}

/**
 * <pre>
 * 기본윈도우오픈modal
 * </pre>
 * 
 * @param url
 * @param width
 * @param height
 */
function cf_modalWindowOpen ( url, width, height )
{
    var position = "";
    var winset = "";

    position = 'dialogWidth:' + width + 'px;' + 'dialogHeight:' + height + 'px;';
    winset = 'resizable:yes;center:yes;help:no;status:no;scroll:no;toolbar=no;' + position;
    window.showModalDialog ( url, self, winset );
}

/**
 * <pre>
 * 문자 입력를 받아 &quot;/&quot;, &quot;:&quot; , &quot; &quot; 삭제 후 리턴 처리
 * 날짜형식문자(예:2013/01/01 11:11:11) ] Return : 날짜형식문자 (예:20130101111111)
 * </pre>
 * 
 * @param paramStr
 * @returns {String}
 */
function cf_delDateDelimStr ( paramStr )
{
    var varLength = paramStr.length;

    varReturnStr = "";

    for ( var inx = 0; inx < varLength; inx++ )
    {
        if ( paramStr.substring ( inx, inx + 1 ) != "/" )
        {
            if ( paramStr.substring ( inx, inx + 1 ) != " " )
            {
                if ( paramStr.substring ( inx, inx + 1 ) != ":" )
                {
                    varReturnStr = varReturnStr + paramStr.substring ( inx, inx + 1 );
                }
            }
        }
    }

    return varReturnStr;
}

/**
 * <pre>
 * 현재날짜얻기
 * 20140514
 * </pre>
 * 
 * @returns {String}
 */
function cf_getDate ()
{
    var date = new Date ();

    var dateStr = cf_lpadToZero ( date.getFullYear (), 4 ) + cf_lpadToZero ( date.getMonth () + 1, 2 )
            + cf_lpadToZero ( date.getDate (), 2 );

    return dateStr;
}

/**
 * <pre>
 * 현재시간 얻기
 * 24 시간제(2014/04/03 11:11:11)
 * </pre>
 * 
 * @returns {String}
 */
function cf_getTimeStamp ()
{
    var d = new Date ();

    var dateStr = cf_lpadToZero ( d.getFullYear (), 4 ) + '/' + cf_lpadToZero ( d.getMonth () + 1, 2 ) + '/'
            + cf_lpadToZero ( d.getDate (), 2 ) + ' ' + cf_lpadToZero ( d.getHours (), 2 ) + ':'
            + cf_lpadToZero ( d.getMinutes (), 2 ) + ':' + cf_lpadToZero ( d.getSeconds (), 2 );

    return dateStr;
}

/**
 * <pre>
 * LPAD
 * </pre>
 * 
 * @param paramStr
 * @param digits
 * @returns {String}
 */
function cf_lpadToZero ( paramStr, digits )
{
    var zero = "";
    paramStr = paramStr.toString ();

    if ( paramStr.length < digits )
    {
        for ( var i = 0; i < digits - paramStr.length; i++ )
        {
            zero += "0";
        }
    }

    return zero + paramStr;
}

/**
 * <pre>
 * 스트링을날짜포맷으로
 * </pre>
 * 
 * @param paramStr
 * @param len
 * @returns
 */
function cf_strToDateFormat ( paramStr, len )
{
    if ( paramStr == null || paramStr == "" || paramStr == " " || paramStr == "-" )
    {
        return "";

    } else
    {

        if ( len == 8 )
        {
            return paramStr.substring ( 0, 4 ) + "/" + paramStr.substring ( 4, 6 ) + "/" + paramStr.substring ( 6, 8 );

        } else if ( len == 12 )
        {
            return paramStr.substring ( 0, 4 ) + "/" + paramStr.substring ( 4, 6 ) + "/" + paramStr.substring ( 6, 8 )
                    + " " + paramStr.substring ( 8, 10 ) + ":" + paramStr.substring ( 10, 12 );

        } else if ( len == 14 )
        {
            return paramStr.substring ( 0, 4 ) + "/" + paramStr.substring ( 4, 6 ) + "/" + paramStr.substring ( 6, 8 )
                    + " " + paramStr.substring ( 8, 10 ) + ":" + paramStr.substring ( 10, 12 ) + ":"
                    + paramStr.substring ( 12, 14 );

        } else if ( len == 17 )
        {
            return paramStr.substring ( 0, 4 ) + "/" + paramStr.substring ( 4, 6 ) + "/" + paramStr.substring ( 6, 8 )
                    + " " + paramStr.substring ( 8, 10 ) + ":" + paramStr.substring ( 10, 12 ) + ":"
                    + paramStr.substring ( 12, 14 ) + "." + paramStr.substring ( 14, 17 );

        } else
        {
            return paramStr;
        }
    }
}

/**
 * <pre>
 * 메모리캐쉬리로드
 * </pre>
 * 
 * @param cacheName
 */
function cf_cacheReload ( cacheName )
{
    $.post ( cttPath + "/cacheReload.do" + langParam, {
        "cacheName" : cacheName
    } );
}

/**
 * <pre>
 * URI
 * 인코딩 - 한글깨짐방지
 * </pre>
 * 
 * @param str
 * @returns
 */
function cf_encodeURI ( str )
{
    return encodeURI ( encodeURIComponent ( str ) );
}

/**
 * <pre>
 * 
 * </pre>
 * 
 * @param str
 * @returns
 */
function cf_isAlphaNumber ( str )
{
    var regEx = /^[A-Za-z0-9]+/;

    return regEx.test ( str );
}

/**
 * <pre>
 * 입력값을 정규식을 활용하여 체크
 * condition - 정규식 패턴 0 = 첫글자
 * 영문, 영문, 숫자, _ 사용가능 1 = 영문만 사용가능 2 = 숫자만 사용가능 3 = 한글만 사용가능 4 = 영문, 숫자 사용가능 5 =
 * 영문, 숫자, 한글 사용가능 6 = 한글, 숫자 사용가능 7 = 한글, 영문 사용가능 8 = 한글을 포함하는지 여부
 * </pre>
 * 
 * @param str
 * @param condition
 * @returns
 */
function cf_checkValidation ( str, condition )
{
    var pattern = "";

    switch ( condition )
    {
        case (0):
            pattern = /^[a-zA-Z]{1}[a-zA-Z0-9_]+$/;
            break;
        case (1):
            pattern = /^[a-zA-Z]+$/;
            break;
        case (2):
            pattern = /^[0-9]+$/;
            break;
        case (3):
            pattern = /^[가-힣]+$/;
            break;
        case (4):
            pattern = /^[a-zA-Z0-9]+$/;
            break;
        case (5):
            pattern = /^[가-힣a-zA-Z0-9]+$/;
            break;
        case (6):
            pattern = /^[가-힣0-9]+$/;
            break;
        case (7):
            pattern = /^[가-힣a-zA-Z]+$/;
            break;
        case (8):
            pattern = /[가-힣]/;
        case (9):
            pattern = /^[0-9.]+$/;
    }

    return pattern.test ( str );
}

/**
 * <pre>
 * 문자열의 끝 문자가 * 이면 삭제 후 리턴
 * </pre>
 * 
 * @param str
 * @returns
 */
function cf_cutAsterisk ( str )
{
    var temp = str.substr ( str.length - 1 );

    if ( temp == "*" )
    {
        return str.substr ( 0, str.length - 1 );
    } else
    {
        return str;
    }
}

/**
 * <pre>
 * 맨앞문자가'0' 일경우 제거 후 리턴
 * </pre>
 * 
 * @param str
 * @returns
 */
function cf_cutFrontZero ( str )
{
    if ( str.length > 1 )
    {
        if ( str.substr ( 0, 1 ) == "0" )
        {
            return str.substr ( 1, str.length );
        }
    }

    return str;
}

/**
 * <pre>
 * 날짜사이일수가betweenDay보다크면true
 * </pre>
 * 
 * @param fromDateStr
 * @param toDateStr
 * @param dateFormat
 * @param betweenDay
 * @returns {Boolean}
 */
function cf_dateInterval ( fromDateStr, toDateStr, dateFormat, betweenDay )
{
    var fromDateArr = fromDateStr.split ( "/" );
    var toDateArr = toDateStr.split ( "/" );

    var fromDate = "";
    var toDate = "";

    if ( dateFormat == "YYYY/MM/DD" )
    {
        fromDate = new Date ( fromDateArr[0], Number ( fromDateArr[1] ) - 1, fromDateArr[2] );
        toDate = new Date ( toDateArr[0], Number ( toDateArr[1] ) - 1, toDateArr[2] );

    } else if ( dateFormat == "MM/DD/YYYY" )
    {
        fromDate = new Date ( fromDateArr[2], Number ( fromDateArr[0] ) - 1, fromDateArr[1] );
        toDate = new Date ( toDateArr[2], Number ( toDateArr[0] ) - 1, toDateArr[1] );

    } else if ( dateFormat == "DD/MM/YYYY" )
    {
        fromDate = new Date ( fromDateArr[2], Number ( fromDateArr[1] ) - 1, fromDateArr[0] );
        toDate = new Date ( toDateArr[2], Number ( toDateArr[1] ) - 1, toDateArr[0] );
    }

    var temp = ((toDate.getTime () - fromDate.getTime ()) / 1000 / 60 / 60 / 24) + 1;

    if ( temp > betweenDay )
    {
        return true;
    } else
    {
        return false;
    }
}

/**
 * <pre>
 *  입력값을 정규식을 활용하여 입력 유효성 체크
 *  패턴 0 = 첫글자 영문, 영문, 숫자, _ 사용가능 1 = 영문만 사용가능 2 = 숫자만 사용가능 3 = 한글만 사용가능 4 = 영문, 숫자 사용가능
 * 5 = 영문, 숫자, 한글 사용가능 6 = 한글, 숫자 사용가능 7 = 한글, 영문 사용가능 8 = 한글을 포함하는지 여부 9 = 숫자 및
 * 소수점만 사용가능
 *  &lt;input type=&quot;text&quot; onkeyup=&quot;cf_commonOnlyInputValidate(this, 2);&quot; /&gt;
 * </pre>
 * 
 * @param obj
 *            this
 * @param condition
 *            condition
 */
function cf_commonOnlyInputValidate ( obj, condition )
{
    var pattern = "";
    var val = obj.value;
    switch ( condition )
    {
        case (0):
            pattern = /[^a-zA-Z]{1}[^a-zA-Z0-9_]+$/;
            break;
        case (1):
            pattern = /[^a-zA-Z]+$/;
            break;
        case (2):
            pattern = /[^0-9]+$/;
            break;
        case (3):
            pattern = /[^가-힣]+$/;
            break;
        case (4):
            pattern = /[^a-zA-Z0-9]+$/;
            break;
        case (5):
            pattern = /[^가-힣a-zA-Z0-9]+$/;
            break;
        case (6):
            pattern = /[^가-힣0-9]+$/;
            break;
        case (7):
            pattern = /[^가-힣a-zA-Z]+$/;
            break;
        case (8):
            pattern = /[^가-힣]/;
        case (9):
            pattern = /[^0-9|^.]+$/;
    }
    obj.value = val.replace ( pattern, "" );
}

/**
 * <pre>
 * 시간포맷입력 유효성 체크 
 * 시간 포맷으로 컨버팅 된 시간 문자열 반환
 * 
 * &lt;input type=&quot;text&quot; onkeyup=&quot;cf_timeValidate(this);&quot; /&gt;
 * </pre>
 * 
 * @param obj
 *            this
 */
function cf_timeOnlyInputValidate ( obj )
{
    var pattern = /[^(0-9)|:]/gi;
    var patternOnlyNum = /[^(0-9)]/gi;
    var val = obj.value;

    obj.value = val.replace ( pattern, "" );
    var tmpTime = val.replace ( patternOnlyNum, "" );
    if ( tmpTime.length == 2 )
    {
        if ( tmpTime > 23 )
        {
            obj.value = "";
            tmpTime = "";
        }
    } else if ( tmpTime.length == 4 )
    {
        if ( tmpTime.substring ( 2, 4 ) > 59 )
        {
            obj.value = cf_stringFormat ( "{0}:", tmpTime.substring ( 0, 2 ) );
            tmpTime = obj.value.replace ( patternOnlyNum, "" );
        }
    } else if ( tmpTime.length == 6 )
    {
        if ( tmpTime.substring ( 4, 6 ) > 59 )
        {
            obj.value = cf_stringFormat ( "{0}:{1}:", tmpTime.substring ( 0, 2 ), tmpTime.substring ( 2, 4 ) );
            tmpTime = obj.value.replace ( patternOnlyNum, "" );
        }
    }
    if ( tmpTime.length > 5 )
    {
        obj.value = cf_stringFormat ( "{0}:{1}:{2}", tmpTime.substring ( 0, 2 ), tmpTime.substring ( 2, 4 ), tmpTime
                .substring ( 4, 6 ) );
    }
}

/**
 * <pre>
 * 문자열 인수와 조합 하기 java의 String.format과 동일 
 * var value = cf_stringFormat('{0}, {1}, {2} ...{...}', 'DATA1', 'DATA2',
 * 'DATA3');
 * </pre>
 * 
 * @returns 조립된 문자열 반환 Comment :
 */
function cf_stringFormat ()
{
    var expression = arguments[0];
    for ( var i = 1; i < arguments.length; i++ )
    {
        var prttern = '{' + (i - 1) + '}';
        expression = expression.replace ( prttern, arguments[i] );
    }
    return expression;
}

/***********************************************************************************************************************
 * String Util Area
 **********************************************************************************************************************/
String.prototype.replaceAll = function ( searchStr, replaceStr )
{
    var temp = this;

    while ( temp.indexOf ( searchStr ) != -1 )
    {
        temp = temp.replace ( searchStr, replaceStr );
    }

    return temp;
};

// 공백문자 제거
String.prototype.trim = function ()
{
    return this.replace ( /(^\s*)|(\s*$)/gi, "" );
};

// 숫자만 추출
String.prototype.only_number = function ()
{
    return this.replace ( /[^0-9]/gi, '' );
};

// 금액 컴마 추가
String.prototype.commaFormat = function ()
{
    if ( this == 0 )
    {
        return 0;
    }
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');
    while ( reg.test ( n ) )
    {
        n = n.replace ( reg, '$1' + ',' + '$2' );
    }
    return n;
};

// Date Format 정의
Date.prototype.format = function ( f )
{
    if ( !this.valueOf () )
    {
        return " ";
    }

    var weekName = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
    var d = this;
    return f.replace ( /(yyyy|yy|MM|dd|E|hh|mm|ss|SS|a\/p)/gi, function ( $1 )
    {
        switch ( $1 )
        {
            case "yyyy":
                return d.getFullYear ();
            case "yy":
                return (d.getFullYear () % 1000).zf ( 2 );
            case "MM":
                return (d.getMonth () + 1).zf ( 2 );
            case "dd":
                return d.getDate ().zf ( 2 );
            case "E":
                return weekName[d.getDay ()];
            case "HH":
                return d.getHours ().zf ( 2 );
            case "hh":
                return ((h = d.getHours () % 12) ? h : 12).zf ( 2 );
            case "mm":
                return d.getMinutes ().zf ( 2 );
            case "ss":
                return d.getSeconds ().zf ( 2 );
            case "SS":
                return d.getMilliseconds ().zf ( 3 );
            case "a/p":
                return d.getHours () < 12 ? "오전" : "오후";
            default:
                return $1;
        }
    } );
};

String.prototype.string = function ( len )
{
    var s = '', i = 0;
    while ( i++ < len )
    {
        s += this;
    }
    return s;
};
String.prototype.zf = function ( len )
{
    return "0".string ( len - this.length ) + this;
};
Number.prototype.zf = function ( len )
{
    return this.toString ().zf ( len );
};

/***********************************************************************************************************************
 * Base64 Encode, Decode Area
 **********************************************************************************************************************/

/**
 * Base64 encode, decode
 */
var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function ( input )
    {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode ( input );

        while ( i < input.length )
        {

            chr1 = input.charCodeAt ( i++ );
            chr2 = input.charCodeAt ( i++ );
            chr3 = input.charCodeAt ( i++ );

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if ( isNaN ( chr2 ) )
            {
                enc3 = enc4 = 64;
            } else if ( isNaN ( chr3 ) )
            {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt ( enc1 ) + this._keyStr.charAt ( enc2 ) + this._keyStr.charAt ( enc3 )
                    + this._keyStr.charAt ( enc4 );

        }

        return output;
    },

    // public method for decoding
    decode : function ( input )
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace ( /[^A-Za-z0-9\+\/\=]/g, "" );

        while ( i < input.length )
        {

            enc1 = this._keyStr.indexOf ( input.charAt ( i++ ) );
            enc2 = this._keyStr.indexOf ( input.charAt ( i++ ) );
            enc3 = this._keyStr.indexOf ( input.charAt ( i++ ) );
            enc4 = this._keyStr.indexOf ( input.charAt ( i++ ) );

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode ( chr1 );

            if ( enc3 != 64 )
            {
                output = output + String.fromCharCode ( chr2 );
            }
            if ( enc4 != 64 )
            {
                output = output + String.fromCharCode ( chr3 );
            }

        }

        output = Base64._utf8_decode ( output );

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function ( string )
    {
        string = string.replace ( /\r\n/g, "\n" );
        var utftext = "";

        for ( var n = 0; n < string.length; n++ )
        {

            var c = string.charCodeAt ( n );

            if ( c < 128 )
            {
                utftext += String.fromCharCode ( c );
            } else if ( (c > 127) && (c < 2048) )
            {
                utftext += String.fromCharCode ( (c >> 6) | 192 );
                utftext += String.fromCharCode ( (c & 63) | 128 );
            } else
            {
                utftext += String.fromCharCode ( (c >> 12) | 224 );
                utftext += String.fromCharCode ( ((c >> 6) & 63) | 128 );
                utftext += String.fromCharCode ( (c & 63) | 128 );
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function ( utftext )
    {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length )
        {

            c = utftext.charCodeAt ( i );

            if ( c < 128 )
            {
                string += String.fromCharCode ( c );
                i++;
            } else if ( (c > 191) && (c < 224) )
            {
                c2 = utftext.charCodeAt ( i + 1 );
                string += String.fromCharCode ( ((c & 31) << 6) | (c2 & 63) );
                i += 2;
            } else
            {
                c2 = utftext.charCodeAt ( i + 1 );
                c3 = utftext.charCodeAt ( i + 2 );
                string += String.fromCharCode ( ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63) );
                i += 3;
            }

        }

        return string;
    },

    URLEncode : function ( string )
    {
        return escape ( this._utf8_encode ( string ) );
    },

    // public method for url decoding
    URLDecode : function ( string )
    {
        return this._utf8_decode ( unescape ( string ) );
    }
};

/***********************************************************************************************************************
 * <pre>
 * Bootstrap Dialog Custom 
 * Type 
 *  - BootstrapDialog.TYPE_DEFAULT
 *  - BootstrapDialog.TYPE_INFO
 *  - BootstrapDialog.TYPE_PRIMARY
 *  - BootstrapDialog.TYPE_SUCCESS
 *  - BootstrapDialog.TYPE_WARNING
 *  - BootstrapDialog.TYPE_DANGER
 * </pre>
 **********************************************************************************************************************/
/**
 * <pre>
 * InfoAlert
 * </pre>
 * 
 * @param msg
 */
function cf_alertInfo ( msg )
{
    BootstrapDialog.alert ( {
        type : BootstrapDialog.TYPE_INFO, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        title : 'Information',
        message : msg,
        draggable : true, // <-- Default value is false
        buttonLabel : 'Confirm'
    } );
}

/**
 * <pre>
 * InfoAlert
 * 
 * </pre>
 * 
 * @param msg
 * @param callback
 */
function cf_alertInfo ( msg, callback )
{
    BootstrapDialog.alert ( {
        type : BootstrapDialog.TYPE_INFO, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        title : 'Information',
        message : msg,
        draggable : true, // <-- Default value is false
        buttonLabel : 'Confirm',
        callback : callback
    } );
}

/**
 * <pre>
 * WarningAlert
 * </pre>
 * 
 * @param msg
 */
function cf_alertWarning ( msg )
{
    BootstrapDialog.alert ( {
        type : BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        title : 'Warning',
        message : msg,
        draggable : true, // <-- Default value is false
        buttonLabel : 'Confirm'
    } );
}

/**
 * <pre>
 * WarningAlert
 * </pre>
 * 
 * @param msg
 */
function cf_alertWarning ( msg, callback )
{
    BootstrapDialog.alert ( {
        type : BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        title : 'Warning',
        message : msg,
        draggable : true, // <-- Default value is false
        buttonLabel : 'Confirm',
        callback : callback
    } );
}

/**
 * <pre>
 * DangerAlert
 * </pre>
 * 
 * @param msg
 */
function cf_alertDanger ( msg )
{
    BootstrapDialog.alert ( {
        type : BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        title : 'ERROR',
        message : msg,
        draggable : true, // <-- Default value is false
        buttonLabel : 'Confirm'
    } );
}

/**
 * <pre>
 * DangerAlert
 * </pre>
 * 
 * @param msg
 */
function cf_alertDanger ( msg, callback )
{
    BootstrapDialog.alert ( {
        type : BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        title : 'ERROR',
        message : msg,
        draggable : true, // <-- Default value is false
        buttonLabel : 'Confirm',
        callback : callback
    } );
}

/**
 * <pre>
 * DangerAlert
 * </pre>
 * 
 * @param msg
 */
function cf_alertDangerCustom ( msg, callback )
{
    var idx = $ ( "div.modal-body" ).length;

    if ( idx >= 1 )
    {

        var modalBody = $ ( "div.modal-body" )[idx - 1];

        if ( msg == $ ( modalBody ).find ( "div.bootstrap-dialog-message" ).text () )
        {
            return;
        }
    }

    BootstrapDialog.alert ( {
        type : BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        title : 'ERROR',
        message : msg,
        draggable : true, // <-- Default value is false
        buttonLabel : 'Confirm',
        callback : callback
    } );
}

// modal bootstrap-dialog type-info fade size-normal in

/**
 * <pre>
 * 빈 Row 추가
 *  - 그리드의 사이즈를 고정시키기 위함
 * </pre>
 * 
 * @param gridId
 */
function cf_addSpaceRow ( gridId )
{
    /** page row count */
    var pageRowCount = $ ( "#" + gridId ).bootgrid ( "getRowCount" );
    // console.log ( "pageRowCount : " + pageRowCount );

    /** 그리드에 보여지는 Column 개수 */
    var colObj = $ ( "#" + gridId ).bootgrid ( "getColumnSettings" );
    var columnCount = 0;
    for ( var i = 0; i < colObj.length; i++ )
    {
        if ( colObj[i].visible )
        {
            columnCount++;
        }
    }
    // console.log ( "getCurrentPage : " + $ ( "#" + gridId ).bootgrid ( "getCurrentPage" ) );
    // console.log ( "columnCount : " + columnCount );

    /** 그리드에 보여지는 Row 개수 */
    var currentRowObj = $ ( "#" + gridId ).bootgrid ( "getCurrentRows" );
    var currentRowCount = currentRowObj.length;
    // console.log ( "currentRowCount : " + currentRowCount );

    /** 추가할 Row 개수 */
    var addRowCount = pageRowCount - currentRowCount;
    // console.log ( "addRowCount : " + addRowCount );

    var html = "";

    if ( currentRowCount > 0 )
    {
        if ( addRowCount > 0 )
        {
            html = "<tr style='background-color:white!important;'><td colspan='" + (columnCount + 1)
                    + "' style='padding:0px;'>";
            html += "<table>";

            for ( var i = 0; i < addRowCount; i++ )
            {
                html += "<tr height='28px' style='padding:0px;'><td>&nbsp;</td></tr>";
            }

            html += "</table></td></tr>";

        } else
        {
            html = "<tr style='background-color:white!important;'><td height='1px' colspan='" + (columnCount + 1)
                    + "' style='padding:0px;'>";
            html += "<table>";

            html += "<tr style='padding:0px;'><td></td></tr>";

            html += "</table></td></tr>";
        }

    } else
    {
        html = "<tr style='background-color:white!important;'><td colspan='" + (columnCount + 1)
                + "' style='padding:0px;'>";
        html += "<table>";

        for ( var i = 0; i < addRowCount - 1; i++ )
        {
            html += "<tr height='28px' style='padding:0px;'><td>&nbsp;</td></tr>";
        }

        html += "</table></td></tr>";

    }

    $ ( "#" + gridId + " > tbody" ).append ( html );

}

/**
 * <pre>
 * 빈 Row 추가
 *  - 그리드의 사이즈를 고정시키기 위함
 * </pre>
 * 
 * @param gridId
 */
function cf_addSpaceRowNoCheckbox ( gridId )
{
    /** page row count */
    var pageRowCount = $ ( "#" + gridId ).bootgrid ( "getRowCount" );
    // console.log ( "pageRowCount : " + pageRowCount );

    /** 그리드에 보여지는 Column 개수 */
    var colObj = $ ( "#" + gridId ).bootgrid ( "getColumnSettings" );
    var columnCount = 0;
    for ( var i = 0; i < colObj.length; i++ )
    {
        if ( colObj[i].visible )
        {
            columnCount++;
        }
    }

    columnCount = columnCount - 1;// 체크박스 컬럼 제외
    // console.log ( "getCurrentPage : " + $ ( "#" + gridId ).bootgrid ( "getCurrentPage" ) );
    // console.log ( "columnCount : " + columnCount );

    /** 그리드에 보여지는 Row 개수 */
    var currentRowObj = $ ( "#" + gridId ).bootgrid ( "getCurrentRows" );
    var currentRowCount = currentRowObj.length;
    // console.log ( "currentRowCount : " + currentRowCount );

    /** 추가할 Row 개수 */
    var addRowCount = pageRowCount - currentRowCount;
    // console.log ( "addRowCount : " + addRowCount );

    var html = "";

    if ( currentRowCount > 0 )
    {
        if ( addRowCount > 0 )
        {
            html = "<tr style='background-color:white!important;'><td colspan='" + (columnCount + 1)
                    + "' style='padding:0px;'>";
            html += "<table>";

            for ( var i = 0; i < addRowCount; i++ )
            {
                html += "<tr height='28px' style='padding:0px;'><td>&nbsp;</td></tr>";
            }

            html += "</table></td></tr>";

        } else
        {
            html = "<tr style='background-color:white!important;'><td height='1px' colspan='" + (columnCount + 1)
                    + "' style='padding:0px;'>";
            html += "<table>";

            html += "<tr style='padding:0px;'><td></td></tr>";

            html += "</table></td></tr>";
        }

    } else
    {
        html = "<tr style='background-color:white!important;'><td colspan='" + (columnCount + 1)
                + "' style='padding:0px;'>";
        html += "<table>";

        for ( var i = 0; i < addRowCount - 1; i++ )
        {
            html += "<tr height='28px' style='padding:0px;'><td>&nbsp;</td></tr>";
        }

        html += "</table></td></tr>";

    }

    $ ( "#" + gridId + " > tbody" ).append ( html );

}

/**
 * <pre>
 * 그리드의ColumnVisible선택창에서선택되어있는항목만보여주기
 * </pre>
 * 
 * @param gridId
 */
function cf_hideUncheckedColumn ( gridId )
{
    var $gridHeader = $ ( "#" + gridId + "-header" );
    // console.log ( $gridHeader.attr ( "class" ) );

    var $divActions = $gridHeader.find ( "div#divActions" );
    // console.log ( $divActions.attr ( "class" ) );

    // "[id='cancel']")
    // var $div = $ ( "[id='divActions'" ).children ().eq ( 1 );
    var $div = $divActions.children ().eq ( 1 );

    var $ul = $div.children ().eq ( 1 );

    $ul.children ().each ( function ()
    {
        var $label = $ ( this ).children ().eq ( 0 );
        var $input = $label.children ().eq ( 0 );

        if ( $input.attr ( "checked" ) != "checked" )
        {
            // console.log ( $input.attr ( "name" ) );
            $ ( this ).hide ();
        }
    } );

}
/**
 * <pre>
 * validation
 * 
 * </pre>
 */
function cf_validate ( forname )
{
    /** Validator */
    $ ( forname ).bootstrapValidator ( {
        live : 'enabled',
        message : 'This value is not valid',
        feedbackIcons : {
            valid : 'glyphicon glyphicon-ok',
            invalid : 'glyphicon glyphicon-remove',
            validating : 'glyphicon glyphicon-refresh'
        },
        fields : {
            // 숫자만 가능 : [ 0 ~ 9 ] 주의 : 띄어쓰기 불가능
            onlynumber : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[0-9]+$/,
                    message : 'The module Id can only number'
                }
            },
            // 영문 대문자, 소문자, 숫자, _를 표현합니다.
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[a-zA-Z0-9_]+$/,
                    message : 'The module Id can only consist of alphabetical, number and underscore'
                }
            },
            // 숫자,알파벳만 가능
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[a-zA-Z0-9]+$/,
                    message : 'The module Id can only consist of alphabetical and number'
                }
            },
            // 영문 소문자와 숫자를 표현합니다.
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[a-z0-9]+$/,
                    message : 'The module Id can only consist of alphabetical and number'
                }
            },
            // 영문 대문자와 숫자를 표현합니다.
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[A-Z0-9]+$/,
                    message : 'The module Id can only consist of alphabetical and number'
                }
            },
            // 한글과 영문만 가능
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[가-힣a-zA-Z]+$/,
                    message : 'The module Id can only consist of alphabetical and hangul'
                }
            },
            // 한글만 가능 : [ 가나다라 ... ] 주의 : ㄱㄴㄷ... 형식으로는 입력 불가능 , 띄어쓰기 불가능
            onlyhangul : {
                validators : {
                    notEmpty : {
                        message : 'The module Id is required and cannot be empty'
                    },
                    stringLength : {
                        max : 30,
                        message : 'The module Id must be less than 30 characters long'
                    },
                    regexp : {
                        regexp : /^[가-힣]+$/,
                        message : 'The module Id can only hangul'
                    }
                }
            },
            // 한글,띄어쓰기만 가능 : [ 가나다라 ... ] 주의 : ㄱㄴㄷ... 형식으로는 입력 불가능 , 띄어쓰기 가능
            hangul : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[가-힣\s]+$/,
                    message : 'The module Id can only consist of hangul and word spacing'
                }
            },
            // 영문만 가능
            onlyeng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[a-zA-Z]+$/,
                    message : 'The module Id can only consist of alphabetical'
                }
            },
            // 영문,띄어쓰기만 가능
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[a-zA-Z\s]+$/,
                    message : 'The module Id can only consist of alphabetical and word spacing'
                }
            },
            // 전화번호 형태 : 전화번호 형태 000-0000-0000 만 받는다.
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/,
                    message : 'The module Id can only consist of telephone number'
                }
            },
            // 이메일 형식만 가능
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                    message : 'The module Id can only email'
                }
            },
            // 도메인 형태, http:// https:// 포함안해도 되고 해도 되고
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/,
                    message : 'The module Id can only domain'
                }
            },
            // 도메인 형태, http:// https:// 꼭 포함
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/,
                    message : 'The module Id can only domain'
                }
            },
            // 도메인 형태, http:// https:// 포함하면 안됨
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^[^((http(s?))\:\/\/)]([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/,
                    message : 'The module Id can only domain'
                }
            },
            // 주민번호, -까지 포함된 문자열로 검색
            eng : {
                validators : {
                    notEmpty : {
                        message : 'The module Name is required and cannot be empty'
                    }

                },
                regexp : {
                    regexp : /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4][0-9]{6}$/,
                    message : 'The module Id can only ID num'
                }
            }

        }
    } );

}

function cf_ISOFormat ( pDate )
{
    var agent = navigator.userAgent.toLowerCase ();

    if ( (navigator.appName == 'Netscape' && navigator.userAgent.search ( 'Trident' ) != -1)
            || (agent.indexOf ( "msie" ) != -1) )
    {
        return new Date ( pDate.substring ( 0, 4 ), pDate.substring ( 5, 7 ) - 1, pDate.substring ( 8, 10 ), pDate
                .substring ( 11, 13 ), pDate.substring ( 14, 16 ) );
    } else
    {
        return new Date ( pDate );
    }

}

/**
 * <pre>
 * 배열내에서타겟으로지정된수의가장가까운
 * 수를리턴.
 * </pre>
 * 
 * @param near
 */
function cf_near ( data, target, min )
{
    // var target = currentRange[0]; // 27과 가장 가까운 값
    var near = 0;
    var abs = 0;
    // var min = currentRange[1]; // 해당 범위에서 가장 큰 값

    for ( var i = 0; i < data.length; i++ )
    {
        abs = ((data[i] - target) < 0) ? -((data[i]) - target) : (data[i] - target);
        if ( abs < min )
        {
            min = abs;
            near = data[i];
        }
    }
    return near; // 근사값
}

/**
 * <pre>
 * n1, n2 사이의 난수를 발생
 * </pre>
 * 
 * @param near
 */
function cf_randomRange ( n1, n2 )
{
    return Math.floor ( (Math.random () * (n2 - n1 + 1)) + n1 );
}

/***********************************************************************************************************************
 * Content : 그리드에 메시지 출력 Paramter : gridID : 그리드 아이디 msg : 출력할 메시지 Return : Comment :
 **********************************************************************************************************************/
function cf_showGridMsg ( gridID, msg )
{
    jqGridID = "#" + gridID;
    $ ( jqGridID + "emptyMsg" ).remove ();

    if ( $ ( jqGridID ).getGridParam ( "records" ) == 0 )
    {
        $ ( jqGridID ).parent ().append (
                "<div id='" + gridID + "emptyMsg' style='text-align:center;'>" + "<font size='2'>" + msg
                        + "</font></div>" );
    }

}

/***********************************************************************************************************************
 * Content : 그리드에 메시지 출력 Paramter : gridID : 그리드 아이디 msg : 출력할 메시지 Return : Comment :
 **********************************************************************************************************************/
function cf_showGridMsgSetting ( gridID, msg )
{
    jqGridID = "#" + gridID;
    $ ( jqGridID + "emptyMsg" ).remove ();

    if ( $ ( jqGridID ).getGridParam ( "records" ) == 0 )
    {
        $ ( jqGridID ).parent ().append (
                "<div id='" + gridID + "emptyMsg' style='text-align:center;'>" + "<font size='2'>" + msg
                        + "</font></div>" );
    }

}

/**
 * <pre>
 * 정수부와소수부자리수체크
 * </pre>
 * 
 * @param value
 * @param intLength
 * @param fractLength
 * @returns {Boolean}
 */
function cf_chkIntFractionLength ( value, intLength, fractLength )
{
    var valueArr = value.split ( "." );

    if ( valueArr[0].length > intLength )
    {
        return false;

    } else if ( valueArr.length > 1 && valueArr[1].length > fractLength )
    {
        return false;

    } else
    {
        return true;
    }
}

/**
 * <pre>
 * 정수부와소수부자리수체크
 * </pre>
 * 
 * @param value
 * @param intLength
 * @param fractLength
 * @returns {Boolean}
 */
function openWin ( url )
{
    /*
     * window.open ( url, '_blank', 'status=no, height=' + window.screen.height + ', width=' + window.screen.width + ',
     * left=0, top=0, fullscreen=yes' );
     */

    window.open ( url, '_blank', 'fullscreen=yes, status=no, height=' + window.screen.height + ', width='
            + window.screen.width + 'left=0, top=0' );

}