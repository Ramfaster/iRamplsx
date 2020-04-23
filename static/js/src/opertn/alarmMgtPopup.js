// 파라미터 세팅
function setParameter ( param )
{
    var $btnPopup = param;

    closePopup ( $btnPopup );
}

function closePopup ( $btnPopup )
{
    $ ( '#btn_cfrm_p' ).click ( function ()
    {
        $btnPopup.magnificPopup ( 'close' );
    } );
}

// 종료일자 show
function alarmPopupTrmnatDtShow ()
{

    $ ( '#icon_modify_id_p' ).on ( 'click', function ()
    {
        $ ( '#td_form_id_p' ).show ();
        $ ( '#td_form_write_p' ).hide ();
    } );
}

// 알람해체
function updateReleaseDt ()
{

    $ ( '#f_right_span' ).click ( function ()
    {
        var params = {
            tagId : $ ( '#searchTagId' ).val (),
            occrrncDt : $ ( '#searchOccrrncDt' ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/operation/alarm/updateReleaseDt.ajax',
            type : 'POST',
            dataType : 'json',
            data : params,
            success : function ( data )
            {
                // 재조회
                view ();

            },// success
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
    } );
}

// 저장.
function save ()
{

    $ ( '#btn_save_p' ).click ( function ()
    {

        /** 해제 / 종료 일자 체크. * */
        var trmnatDt = $ ( "#trmnatDt" ).val ();
        var releaseDt = $ ( '#releaseDt' ).text ();

        /** 해제 일자 없는데 종료를 처리할려는 경우. Notice는 제외* */
        var alarmGradCd = $ ( '#alarmGradCd' ).val ()
        if ( alarmGradCd != 'ALVL01' )
        {
            if ( !releaseDt && trmnatDt )
            {
                confirm ( i18nMessage.msg_alertAlarmNotReleaseDtNotTerminated );

                return false;
            }
        }

        if ( validate () == true )
        {

            if ( confirm ( i18nMessage.msg_alertSaveConfirm ) == true )
            {
                var params = {
                    tagId : $ ( '#tagId' ).val (),
                    occrrncId : $ ( '#occrrncId' ).val (),
                    releaseDt : $ ( '#releaseDt' ).text (),
                    trmnatDt : $ ( '#trmnatDt' ).val (),
                    confmDt : $ ( '#td_confmDt' ).text (),
                    defectTyCd : $ ( '#defectType' ).val (),
                    defectConts : $ ( '#defectConts' ).val (),
                    manerNm : $ ( '#manerNm' ).val (),
                    alarmGradCd : $ ( '#alarmGradCd' ).val (),
                    alarmTrnmatRsn : $ ( '#alarmTrnmatRsn' ).val (),
                    opertUncntcRsn : $ ( '#opertUncntcRsn_p' ).val ()
                };

                $.ajax ( {
                    url : contextPath + '/hom/operation/alarm/save.ajax',
                    type : 'POST',
                    dataType : 'json',
                    data : params,
                    async : false,
                    success : function ( json )
                    {
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {

                            if ( json.status === staticVariable.jsonStatusSuccess )
                            {
                                view ();
                            }

                        } else
                        {
                            confirm ( json.message )
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
                                confirm ( i18nMessage.msg_alertServerError );
                            }
                        }
                    }
                } );

                $ ( 'label.error' ).remove ();

            }
        }

    } );

}

// 유효성 체크.
function validate ()
{

    var isSuccess = true;

    $ ( 'label.error' ).remove ();

    // 등급이 fault일 경우 저장시 미연계 사유 입력해야 함
    if ( $ ( '#alarmGradCd' ).val () == "ALVL03" )
    {

        if ( $ ( "#opertUncntcRsn_p" ).val () == "" )
        {

            var tpl = getTemplate ( templates.labelError );
            if ( tpl !== null )
            {
                var template = _.template ( tpl );
                var html = template ( {
                    id : 'opertUncntcRsn_p',
                    message : i18nMessage.msg_alertWorkOrderNotLinkCauseInput,
                    isLeft : true
                } );

                $ ( "#opertUncntcRsn_p" ).closest ( 'div' ).append ( html );
            }

            isSuccess = false;

        }

    }

    // 알람 고장원인,알람 조치자,알람 종료 사유,워크 오더 미연계 사유 글자수 체크
    var defectContsError = validateField ( $ ( '#defectConts' ), $ ( '#cause_box' ), 300,
            i18nMessage.msg_validMaxsizeAlarmFaultCause );
    var manerNmError = validateField ( $ ( '#manerNm' ), $ ( '#alarmcause_box' ), 20,
            i18nMessage.msg_validMaxsizeAlarmHuman );
    var alarmTrnmatRsnError = validateField ( $ ( '#alarmTrnmatRsn' ), $ ( '#alarmcause_box' ), 300,
            i18nMessage.msg_validMaxsizeAlarmEndCause );
    var opertUncntcRsnError = validateField ( $ ( '#opertUncntcRsn' ), $ ( '#workorder_box' ), 300,
            i18nMessage.msg_validMaxsizeAlarmHuman );

    if ( defectContsError == false || manerNmError == false || alarmTrnmatRsnError == false
            || opertUncntcRsnError == false )
    {
        isSuccess = false;
    }

    /** 발생/종료 일자 체크. * */
    var trmnatDt = $ ( "#trmnatDt" ).val ();
    if ( $ ( "#td_occrrncDt" ).text () > trmnatDt )
    {
        if ( trmnatDt != '' )
        {
            var tpl = getTemplate ( templates.labelError );
            if ( tpl !== null )
            {
                var template = _.template ( tpl );
                var html = template ( {
                    id : 'trmnatDt',
                    message : i18nMessage.msg_alarmTrmnatDtPreCccrrncDt,
                    isLeft : true
                } );

                $ ( "#trmnatDt" ).closest ( 'td' ).append ( html );
            }

            isSuccess = false;
        }

    }

    return isSuccess;

}

function validateField ( $object, $parentBox, checkLength, message )
{

    var text = $object.val ();

    if ( text )
    {
        var length = text.length;
        if ( length > checkLength )
        {

            var tpl = getTemplate ( templates.labelError );
            if ( tpl !== null )
            {
                var template = _.template ( tpl );
                var html = template ( {
                    id : $object.attr ( 'id' ),
                    message : message,
                    isLeft : true
                } );

                console.log ( html );

                $parentBox.append ( html );
            }

            return false;
        }
    }

    return true;
}

// 팝업정보 조회
function view ()
{

    var params = {
        tagId : $ ( '#tagId' ).val (),
        occrrncId : $ ( '#occrrncId' ).val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/operation/alarm/view.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {

            // if ( data != null )
            if ( json.status === staticVariable.jsonStatusSuccess )
            {

                // 확인시간
                $ ( '#td_confmDt' ).text ( json.data.confmDt );

                // 종료시간
                if ( json.data.trmnatDt )
                {
                    $ ( '#trmnatDt' ).val ( json.data.trmnatDt );
                    $ ( '#trmnatDt_txt' ).text ( json.data.trmnatDt );
                }
                // 고장타입
                $ ( '#defectType' ).val ( json.data.defectTyCd );

                // 고장원인
                $ ( '#defectConts' ).val ( json.data.defectConts );

                // 조치자
                $ ( '#manerNm' ).val ( json.data.manerNm );

                // 미연계 사유
                $ ( '#opertUncntcRsn_p' ).val ( json.data.opertUncntcRsn );

                $ ( '#tagId' ).val ( json.data.tagId );

                // 해체 알람처리상태 활성화 /비활성화
                if ( json.data.occrrncDt )
                {
                    $ ( '#pv_step_2' ).addClass ( "on" );
                }

                // 해체 알람처리상태 활성화 /비활성화
                if ( json.data.releaseDt )
                {
                    $ ( '#pv_step_3' ).addClass ( "on" );
                }

                // 종료 알람처리상태 활성화 /비활성화
                if ( json.data.trmnatDt )
                {
                    $ ( '#pv_step_4' ).addClass ( "on" );

                    $ ( '#td_form_id_p' ).hide ();
                    $ ( '#td_form_write_p' ).show ();

                }

                // 차트
                var searchTagId = $ ( '#warning_type option:selected' ).val ();
                alarmPopupSearchHighcharts ( searchTagId, json.data.date, json.data.trmnatDt );

            }// if
            else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }

        },// success
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

// 조치 가이드
function selectAlarmManagGdeCdList ()
{

    var params = {
        tagId : $ ( '#tagId' ).val (),
    };

    $
            .ajax ( {
                url : contextPath + '/hom/operation/alarm/selectAlarmManagGdeCdList.ajax',
                type : 'POST',
                dataType : 'json',
                data : params,
                async : false,
                success : function ( json )
                {
                    var rowdata = "<tr><th>" + i18nMessage.msg_alarmDescription
                            + "</th><td id ='td_alarmDesc'></td></tr>";

                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {

                        if ( json.data.length < 1 )
                        {
                            rowdata += "<tr><th rowspan='5'>" + i18nMessage.msg_actionGuide
                                    + "</th><td height='12'></td></tr>";
                        }

                        $.each ( json.data, function ( itemNo, item )
                        {

                            if ( itemNo == 0 )
                            {
                                rowdata += "<tr><th rowspan='5'>" + i18nMessage.msg_actionGuide
                                        + "</th><td height='12'>" + item.alarmManagtGdeCdKorNm + " </td></tr>";
                            } else
                            {
                                rowdata += "<tr><td height='12'> " + item.alarmManagtGdeCdKorNm + " </td></tr>";
                            }

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

                    $ ( '#ta_alarm_ManagtGdeCd' ).empty ();

                    $ ( '#ta_alarm_ManagtGdeCd' ).append ( rowdata );

                },// success
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

// WorkOder 처리.
function alarmPopupWorkorder ()
{

    $ ( '#btn_workorder_p' ).click ( function ()
    {
        confirm ( i18nMessage.msg_alertWorkOderReady );
    } )

}

// form element customize
function alarmPopupCustomizeForm ()
{
    // 알람 상세
    var $dateType = $ ( '#warning_type' ).customizeSelect ( {
        width : 130,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select02',
        focusClass : 'custom-form-focused02'
    } );

    // 고장 원인
    var $dateType = $ ( '#defectType' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );
}

// init datetimepicker
function alarmPopupInitDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    $ ( '.yyyy' ).datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymm' ).datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmddhh' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:00',
        startView : 2,
        minView : 1,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmddhhmi' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:ii',
        startView : 2,
        minView : 0,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        minuteStep : 2,
        todayHighlight : true,
        todayBtn : true
    } );

}

// init highcharts
function alarmPopupRenderHighcharts ()
{

    var $warning_type = $ ( '#warning_type' );

    $warning_type.change ( function ( event )
    {

        var tagId = $ ( ':selected', $ ( this ) ).val ();
        if ( tagId != "default" )
        {
            alarmPopupSearchHighcharts ( tagId );
        }

    } );

    var searchTagId = $ ( '#warning_type option:selected' ).val ();
    if ( searchTagId != "default" )
    {
        alarmPopupSearchHighcharts ( searchTagId );
    }

}

// 차트 조회.
function alarmPopupSearchHighcharts ( tagId )
{
    var occrrncDt = $ ( '#td_occrrncDt' ).text ();

    var year = parseInt ( occrrncDt.substring ( 0, 4 ), 10 );
    var month = parseInt ( occrrncDt.substring ( 5, 7 ), 10 ) - 1;
    var day = parseInt ( occrrncDt.substring ( 8, 10 ), 10 );
    var hours = parseInt ( occrrncDt.substring ( 11, 13 ), 10 );
    var minutes = parseInt ( occrrncDt.substring ( 14, 16 ), 10 );
    var converttOccrrncDt = new Date ( year, month, day, hours, minutes );

    var preDt = homUtil.getIntervalDate ( new Date ( converttOccrrncDt ), 'HO', -6 );

    var params = {
        tagId : tagId,
        fromDate : preDt,
        toDate : occrrncDt
    };

    var yAxisName;
    var xAxisName;

    $.ajax ( {
        url : contextPath + '/hom/operation/alarm/selectTagUnitInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        async : false,
        success : function ( json )
        {

            var data = json.data;

            var cdVal = data.cdVal;
            if ( !cdVal )
            {
                cdVal = '-';
            }

            if ( lang === locale.korea || lang === locale.korean )
            {
                xAxisName = data.tagKorNm;

                if ( data.cdKorNm )
                {
                    yAxisName = data.cdKorNm + '(' + cdVal + ')';
                } else
                {
                    yAxisName = '- (' + cdVal + ')';
                }
            } else
            {
                xAxisName = data.tagEngNm;
                if ( data.cdEngNm )
                {
                    yAxisName = data.cdEngNm + '(' + cdVal + ')';
                } else
                {
                    yAxisName = '- (' + cdVal + ')';
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
    } )

    $
            .ajax ( {
                url : contextPath + '/hom/operation/alarm/selectTagValList.ajax',
                type : 'POST',
                dataType : 'json',
                data : params,
                async : false,
                success : function ( json )
                {

                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {

                        var length = json.data.length;

                        if ( length > 0 )
                        {
                            $ ( '#graph01_p' ).remove ();
                            $ ( '#bg_nodata_wrap_p' ).remove ();
                            $ ( '.pv_con01' ).append ( "<div class='graph_area' id='graph01_p'></div>" );

                            var data = [];
                            var numbers = [];

                            $.each ( json.data, function ( itemNo, item )
                            {

                                data.push ( [
                                        homUtil.convertDateStringToLong ( homUtil
                                                .convertDateStringToPureFormat ( item.occrrncDt ) ),
                                        homUtil.mathFloor ( item.tagVal, staticVariable.decimalPoint ) ] );

                                numbers.push ( parseFloat ( item.tagVal ) );
                            } );

                            var yAxis = {
                                title : {
                                    text : yAxisName
                                }
                            };

                            var minNumber = _.min ( numbers );
                            if ( minNumber >= 0 )
                            {
                                yAxis.min = 0;
                            }

                            // 그래프
                            $ ( '#graph01_p' ).highcharts (
                                    {
                                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                                        chart : {
                                            marginTop : 30,
                                            height : 390
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
                                                    var formatterDate = homUtil.convertDateLongToString ( this.value,
                                                            homUtil.dateFormat.convertHHMM );

                                                    return formatterDate;
                                                }
                                            },
                                            tickInterval : 40 * 60 * 1000
                                        },
                                        yAxis : yAxis,
                                        tooltip : homUtil.generateTooltip ( homUtil.dateFormat.convertYYYYMMDDHHMM,
                                                staticVariable.decimalPoint ),
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
                                            type : 'line',
                                            yAxis : 0,
                                            // color : '#ed6c44',
                                            name : xAxisName,
                                            data : data
                                        } ]
                                    } );
                        } else
                        {

                            var html = "<div class='bg_nodata_wrap' id='bg_nodata_wrap_p'><div class='bg_nodata'><i class='icon_nodata'></i>"
                                    + i18nMessage.msg_sentenceGridNoData + "</div></div>";

                            $ ( '#graph01_p' ).remove ();
                            $ ( '#bg_nodata_wrap_p' ).remove ();
                            $ ( '.pv_con01' ).append ( html );
                        }
                    } else
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : json.message,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                    }

                },// success
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

// scroll customize
function alarmPopupCustomizeScroll ()
{

    // custom scroll
    $ ( '.pv_con02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.tbl_list_wrap04' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

$ ( function ()
{
    alarmPopupInitDatetimepicker ();
    alarmPopupCustomizeForm ();
    alarmPopupCustomizeScroll ();

    save ();
    alarmPopupWorkorder ();
    updateReleaseDt ();
    alarmPopupTrmnatDtShow ();
    alarmPopupRenderHighcharts ();

} );