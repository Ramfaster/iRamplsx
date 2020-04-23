// 트리에서 선택한 발전소 아이디 목록
var arrayId = "";

// 알람 상세 내용 조회.
function view ()
{

    var params = {
        tagId : $ ( '#tagId' ).val (),
        occrrncId : $ ( '#occrrncId' ).val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/operation/alarm/ess/view.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {

            // if ( data != null )
            if ( json.status === staticVariable.jsonStatusSuccess )
            {

                // 발생시간
                $ ( '#td_occrrncDt' ).text ( json.data.occrrncDt );

                $ ( '#span_occrrncDt' ).text ( "발생시간 : " + json.data.occrrncDt );

                // 확인시간
                $ ( '#td_confmDt' ).text ( json.data.confmDt );

                // 해제시간
                $ ( '#td_releaseDt' ).val ( json.data.releaseDt );

                // 종료시간
                if ( json.data.trmnatDt )
                {
                    $ ( '#trmnatDt' ).val ( json.data.trmnatDt );
                    $ ( '#trmnatDt_txt' ).text ( json.data.trmnatDt );
                }

                // 발생설비
                $ ( '#td_eqmtKorNm' ).text ( json.data.eqmtKorNm );

                $ ( '#span_eqmtId' ).empty ();
                // rowCount

                $ ( '#span_eqmtId' ).text ( $ ( '#rowCount' ).val () + ". " );

                $ ( '#span_eqmtId' ).append ( " <span>" + json.data.cdKorNm + "</span> " + json.data.eqmtKorNm + "" );

                // 알람구분
                $ ( '#td_alarmGrpKorNm' ).text ( json.data.alarmGrpKorNm );

                // 알람 등급
                $ ( '#td_cdKorNm' ).text ( json.data.cdKorNm );

                // 고장원인
                $ ( '#defectConts' ).val ( json.data.defectConts );

                // 조치자
                $ ( '#manerNm' ).val ( json.data.manerNm );

                // 미연계 사유
                $ ( '#opertUncntcRsn' ).val ( json.data.opertUncntcRsn );

                $ ( '#tagId' ).val ( json.data.tagId );

                // 미연계 사유 disable 등급이 fault일경우
                if ( json.data.alarmGradCd != "ALVL03" )
                {
                    $ ( '#opertUncntcRsn' ).attr ( "disabled", "disabled" );

                    // $('#modify').removeAttr("disabled");
                }

                // ALG01 설비 알람아닐경우
                if ( json.data.alarmGrpCd != "ALG01" )
                {
                    // 해체시간을 있을경우 알람종료

                    if ( $ ( '#td_releaseDt' ).val () != "" )
                    {

                        $ ( '#f_right_span' ).empty ();
                        $ ( '#f_right_span' ).addClass ( "f_right btn_chk02" );
                        $ ( '#f_right_span' ).append ( "<i class='icon_check06'></i>해제 완료" );

                    } else
                    {
                        $ ( '#f_right_span' ).empty ();
                        $ ( '#f_right_span' ).addClass ( "f_right" );
                        $ ( '#f_right_span' ).append (
                                "<a href='javascript:;' class='btn_chk'><i class='icon_check05'></i>알람 해제</a>" );
                    }
                }

                // 해체 알람처리상태 활성화 /비활성화
                if ( json.data.occrrncDt != null )
                {
                    $ ( '#pv_step_2' ).addClass ( "on" );
                }

                // 해체 알람처리상태 활성화 /비활성화
                if ( json.data.releaseDt != null )
                {
                    $ ( '#pv_step_3' ).addClass ( "on" );
                }

                // 종료 알람처리상태 활성화 /비활성화
                if ( json.data.trmnatDt != null )
                {
                    $ ( '#pv_step_4' ).addClass ( "on" );

                    // 종료일자 있을경우 활성화
                    $ ( '#td_form_id' ).hide ();
                    $ ( '#td_form_write' ).show ();

                }

                // 조치 가이드 조회
                selectAlarmManagGdeCdList ();

                // 알람 설명
                if ( json.data.alarmDesc != null )
                {
                    $ ( '#td_alarmDesc' ).text ( json.data.alarmDesc );
                }

                // 차트
                var searchTagId = $ ( '#warning_type option:selected' ).val ();
                searchHighcharts ( searchTagId, json.data.date, json.data.trmnatDt );
                // $ ( "#warning_type option:eq(1)" ).prop ( "selected", "selected" ).trigger ( 'change' );

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
        tagId : $ ( '#searchTagId' ).val (),
    };

    $
            .ajax ( {
                url : contextPath + '/hom/operation/alarm/ess/selectAlarmManagGdeCdList.ajax',
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

                    console.log ( rowdata );

                    $ ( '#ta_alarm_ManagtGdeCd' ).empty ();
                    $ ( '#ta_alarm_ManagtGdeCd' ).append ( rowdata );
                    $ ( '#defectType' ).customizeSelect ( {
                        width : 90,
                        paddingHorizontal : 15,
                        height : 30,
                        color : '#3c3c3c',
                        initClass : 'custom-form-select04',
                        focusClass : 'custom-form-focused04'
                    } );

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

// 목록 이벤트
function alarmList ()
{

    $ ( '#btn_alarmList' ).click (
            function ()
            {

                var preSearchDateType = $ ( '#preSearchDateType' ).val ();
                var preSearchFromDate = $ ( '#preSearchFromDate' ).val ();
                var preSearchToDate = $ ( '#preSearchToDate' ).val ();
                var preNotice = $ ( '#preNotice' ).val ();
                var preWarning = $ ( '#preWarning' ).val ();
                var preFault = $ ( '#preFault' ).val ();
                var preDisconnect = $ ( '#preDisconnect' ).val ();
                var preSystem = $ ( '#preSystem' ).val ();
                var preEquipment = $ ( '#preEquipment' ).val ();
                var preSearchType = $ ( '#preSearchType' ).val ();
                var preSearchValue = $ ( '#preSearchValue' ).val ();
                var preSearchEqmtId = $ ( '#preSearchEqmtId' ).val ();

                location.href = contextPath + '/hom/operation/alarm/ess/list.do?searchDateType=' + preSearchDateType
                        + '&searchFromDate=' + preSearchFromDate + '&searchToDate=' + preSearchToDate + '&eqmtId='
                        + preSearchEqmtId + '&notice=' + preNotice + '&warning=' + preWarning + '&fault=' + preFault
                        + '&disconnect=' + preDisconnect + '&system=' + preSystem + '&equipment=' + preEquipment
                        + '&searchType=' + preSearchType + '&searchValue='
                        + encodeURI ( encodeURIComponent ( preSearchValue ) );

            } )
}

// 저장.
function save ()
{

    var $btn_save = $ ( '#btn_save' );

    $btn_save.click ( function ()
    {

        /** 해제 / 종료 일자 체크. * */
        var trmnatDt = $ ( "#trmnatDt" ).val ();
        var releaseDt = $ ( '#td_releaseDt' ).text ();

        /** 해제 일자 없는데 종료를 처리할려는 경우. Notice는 제외* */
        var alarmGradCd = $ ( '#searchAlarmGradCd' ).val ()

        if ( alarmGradCd != 'ALVL01' )
        {
            if ( !releaseDt && trmnatDt )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertAlarmNotReleaseDtNotTerminated,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

                return false;
            }
        }

        if ( validate () == true )
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertSaveConfirm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {

                if ( confirm )
                {
                    var params = {
                        tagId : $ ( '#tagId' ).val (),
                        occrrncId : $ ( '#occrrncId' ).val (),
                        releaseDt : $ ( '#td_releaseDt' ).text (),
                        trmnatDt : $ ( '#trmnatDt' ).val (),
                        confmDt : $ ( '#td_confmDt' ).text (),
                        defectTyCd : $ ( '#defectType' ).val (),
                        defectConts : $ ( '#defectConts' ).val (),
                        manerNm : $ ( '#manerNm' ).val (),
                        alarmGradCd : $ ( '#searchAlarmGradCd' ).val (),
                        alarmTrnmatRsn : $ ( '#alarmTrnmatRsn' ).val (),
                        opertUncntcRsn : $ ( '#opertUncntcRsn' ).val ()
                    };

                    $.ajax ( {
                        url : contextPath + '/hom/operation/alarm/ess/save.ajax',
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

                                    $.customizeDialog ( {
                                        template : templates.dialog,
                                        message : i18nMessage.msg_alertSave,
                                        checkText : i18nMessage.msg_ok,
                                        cancelText : i18nMessage.msg_cancel,
                                        type : staticVariable.dialogTypeInfo
                                    } );
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

                    $ ( 'label.error' ).remove ();

                }
            } );
        }

    } );

}

// WorkOder 처리.
function workorder ()
{

    var $btn_workorder = $ ( '#btn_workorder' );

    $btn_workorder.click ( function ()
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertWorkOderReady,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    } )
}

// 종료일자 show
function trmnatDtShow ()
{

    $ ( '#icon_modify_id' ).click ( function ()
    {
        $ ( '#td_form_id' ).show ();

        $ ( '#td_form_write' ).hide ();

    } );

}

// 차트 초기화.
function renderHighcharts ( fromDate, toDate )
{

    var $warning_type = $ ( '#warning_type' );

    $warning_type.change ( function ( event )
    {

        var searchTagId = $ ( ':selected', $ ( this ) ).val ();

        if ( searchTagId != "default" )
        {
            searchHighcharts ( searchTagId, fromDate, toDate );
        }
    } );

    var searchTagId = $ ( '#warning_type option:selected' ).val ();
    if ( searchTagId != "default" )
    {
        searchHighcharts ( searchTagId, fromDate, toDate );
    }

}

// 차트 조회.
function searchHighcharts ( tagId, fromDate, toDate )
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
        url : contextPath + '/hom/operation/alarm/ess/selectTagUnitInfo.ajax',
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

    $.ajax ( {
        url : contextPath + '/hom/operation/alarm/ess/selectTagValList.ajax',
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

                    $ ( '.graph_area' ).remove ();
                    $ ( '.bg_nodata_wrap' ).remove ();
                    $ ( '.pv_con01' ).append ( "<div class='graph_area' id='graph01'></div>" );

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
                    $ ( '#graph01' ).highcharts (
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
                    var html = "<div class='bg_nodata_wrap'><div class='bg_nodata'><i class='icon_nodata'></i>"
                            + i18nMessage.msg_sentenceGridNoData + "</div></div>";

                    $ ( '.graph_area' ).remove ();
                    $ ( '.bg_nodata_wrap' ).remove ();
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

// form element customize
function customizeForm ()
{
    // 검색 조건
    var $dateType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );

    // 알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : 'f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#009944',
        selectedBorderColor : '#009944'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#ffb230',
        selectedBorderColor : '#ffb230'
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#6c7176',
        selectedBorderColor : '#6c7176'
    } );
    var checkOption5 = $.extend ( {}, defaultOption, {
        width : 118,
        selectedColor : '#c3a279',
        selectedBorderColor : '#c3a279'
    } );

    $ ( '#notice' ).customizeCheckbox ( checkOption1 );
    $ ( '#warning' ).customizeCheckbox ( checkOption2 );
    $ ( '#fault' ).customizeCheckbox ( checkOption3 );
    $ ( '#disconnect' ).customizeCheckbox ( checkOption4 );
    $ ( '#system, #equipment' ).customizeCheckbox ( checkOption5 );

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );

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
        width : 90,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select04',
        focusClass : 'custom-form-focused04'
    } );

}

// init datetimepicker
function initDatetimepicker ()
{
    var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#start_yyyy' );
    var $endYYYY = $ ( '#end_yyyy' );
    var $yyyyFromDate = $ ( '#txtFromDateY' );
    var $yyyyToDate = $ ( '#txtToDateY' );

    var $yyyymm = $ ( '.yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#txtFromDateYM' );
    var $yyyymmToDate = $ ( '#txtToDateYM' );

    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#txtFromDateYMD' );
    var $yyyymmddToDate = $ ( '#txtToDateYMD' );

    var $yyyymmddhhmi = $ ( '.yyyymmddhhmi' );

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmddhhmi.datetimepicker ( {
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

    $yyyy.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYY, $endYYYY, $yyyyFromDate, $yyyyToDate );
    } );

    $yyyymm.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMM, $endYYYYMM, $yyyymmFromDate, $yyyymmToDate );
    } );

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );

    // 조회기간
    var className = null;
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#date_type' );
    var $hidFromDate = $ ( "#hidFromDate" );
    var $hidToDate = $ ( "#hidToDate" );
    $dateType.on ( 'change', function ( event )
    {
        var selectedDateType = $ ( this ).val ();
        $ ( "#hidDateType" ).val ( selectedDateType );
        var className = null;
        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedDateType, false, false );

        if ( selectedDateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;

            $yyyymmddFromDate.val ( localFromTodate.fromDate );
            $yyyymmddToDate.val ( localFromTodate.toDate );
        } else if ( selectedDateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;

            $yyyymmFromDate.val ( localFromTodate.fromDate );
            $yyyymmToDate.val ( localFromTodate.toDate );
        } else if ( selectedDateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;

            $yyyyFromDate.val ( localFromTodate.fromDate );
            $yyyyToDate.val ( localFromTodate.toDate );
        }

        $date.addClass ( 'dnone' );

        var $dateBox = $ ( '.' + className );
        $dateBox.removeClass ( 'dnone' ).trigger ( 'changeDate' );
    } );

    $dateType.trigger ( 'change' );
}

// scroll customize
function customizeScroll ()
{

    // custom scroll
    $ ( '.tree_wrap, .pv_con02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
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

/**
 * 발전소 설비 목록
 */
function getEqmtList ()
{
    var params = {
        treeType : staticVariable.treeTypeAlarm
    };

    $.ajax ( {
        url : contextPath + '/hom/common/selectEssEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                initTree ( json.data );
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
 * 트리 초기화
 */
function initTree ( data )
{

    // 트리메뉴
    var setting = {
        view : {
            showIcon : false
        },
        check : {
            enable : true
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        callback : {
            onCheck : function ( e, treeId, treeNode )
            {
                makeSelectedEqmtData ();
            },
            beforeClick : function ( treeId, treeNode )
            {

                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var selectedNodes = zTree.getCheckedNodes ();

                var selected = true;
                $.each ( selectedNodes, function ( i, node )
                {
                    if ( node.id === treeNode.id )
                    {
                        selected = false;
                        return false;
                    }
                } );

                zTree.checkNode ( treeNode, selected, true );

                makeSelectedEqmtData ();
            }
        }

    };

    // 앞에서 선택한 트리 노드의 설비 아이디.
    arrayId = $ ( '#searchEqmtId' ).val ();
    var selectedEqmtIdArray = arrayId.split ( ',' );

    $.each ( data, function ( i, node )
    {
        node.checked = false;
        return;
    } );

    for ( var index in selectedEqmtIdArray )
    {
        $.each ( data, function ( i, node )
        {
            // 앞에서 선택하지 않은 노드는 FALSE로 셋팅
            if ( selectedEqmtIdArray[index] == node.id )
            {
                node.checked = true;
                return;
            }
        } );
    }

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );

}

// 조회해야할 설비 데이터 생성
function makeSelectedEqmtData ()
{

    // 체크 된 설비아이디
    arrayId = "";

    var treeObj = $.fn.zTree.getZTreeObj ( "treeList" );
    var nodes = treeObj.getCheckedNodes ( true );

    $.each ( nodes, function ( i, node )
    {
        arrayId += node.id + ",";
    } );
}

// 알람 조회 처리.
function searchAlarm ()
{
    $ ( '#btn_search' ).on (
            'click',
            function ()
            {
                var href = contextPath + '/hom/operation/alarm/ess/list.do';
                var fromDate = null;
                var toDate = null;

                // 조회에 필요한 설비 아이디 목록
                if ( arrayId == "" )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertEquipmentNoSelected,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );

                    return false;
                }

                // 조회기간, 검색 시작 날짜, 검색 마지막 날짜.
                var dateType = $ ( '#date_type' ).val ();

                if ( dateType === homConstants.dateTypeYYYYMMDD )
                {
                    fromDate = $ ( '#txtFromDateYMD' ).val ();
                    toDate = $ ( '#txtToDateYMD' ).val ();
                } else if ( dateType === homConstants.dateTypeYYYYMM )
                {
                    fromDate = $ ( '#txtFromDateYM' ).val ();
                    toDate = $ ( '#txtToDateYM' ).val ();
                } else if ( dateType === homConstants.dateTypeYYYY )
                {
                    fromDate = $ ( '#txtFromDateY' ).val ();
                    toDate = $ ( '#txtToDateY' ).val ();
                }

                var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
                var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

                if ( !homUtil.fromToDateValidate ( fromDate, toDate, dateType ) )
                {
                    return;
                }

                // 선택할 설비 아이디 목록 (,) 로 구분되서 들어옴.
                $ ( "#hidFromDate" ).val ( pureFromDate );
                $ ( "#hidToDate" ).val ( pureToDate );
                $ ( "#hidDateType" ).val ( dateType );

                location.href = href + '?eqmtId=' + Base64.URLEncode ( arrayId ) + '&searchDateType=' + dateType
                        + '&searchFromDate=' + pureFromDate + '&searchToDate=' + pureToDate;
            } );
}

// 유효성 체크.
function validate ()
{

    var isSuccess = true;

    $ ( 'label.error' ).remove ();

    // 등급이 fault일 경우 저장시 미연계 사유 입력해야 함
    if ( $ ( '#searchAlarmGradCd' ).val () == "ALVL03" )
    {

        if ( $ ( "#opertUncntcRsn" ).val () == "" )
        {

            var tpl = getTemplate ( templates.labelError );
            if ( tpl !== null )
            {
                var template = _.template ( tpl );
                var html = template ( {
                    id : 'opertUncntcRsn',
                    message : i18nMessage.msg_alertWorkOrderNotLinkCauseInput,
                    isLeft : true
                } );

                $ ( "#opertUncntcRsn" ).closest ( 'div' ).append ( html );
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
            i18nMessage.msg_validMaxsizeWorkOrderNotLinkCause );

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

// magnific Layer Popup Open
function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
    } );
}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    getEqmtList ();
    alarmList ();
    save ();
    showPopup ();
    // workorder ();
    trmnatDtShow ();
    searchAlarm ();
    renderHighcharts ();
} );