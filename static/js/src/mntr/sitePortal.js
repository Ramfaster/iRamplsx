// 파라미터 세팅
function setParameter ( param )
{
    var $btnPopup = param;
    //
    // closePopup ( $btnPopup );
    // uploadExcel ( $btnPopup );
}

// more btn action
function moreAction ()
{

    var moreBox = $ ( '.more_detail_box' );
    var btnMore = $ ( '.btn_more' );

    btnMore.on ( 'click', function ( e )
    {
        var target = $ ( e.currentTarget );

        moreBox.toggleClass ( 'on' );

        if ( moreBox.hasClass ( 'on' ) )
        {

            function moreBoxFix ()
            {
                var moreBoxHeight = moreBox.outerHeight ();
                alert ( moreBoxHeight );
                var moreBoxPos = moreBoxHeight / 2;
                moreBox.css ( 'margin-top', '-' + moreBoxPos + 'px' );
            }

            moreBox.show ();

        } else
        {
            moreBox.hide ();
        }

        e.preventDefault ();
    } );

    // $('.btn_more').click(function(){
    // moreBox.toggle();
    //     
    // })

    $ ( '.more_detail_box .btn_close' ).click ( function ()
    {
        moreBox.removeClass ( 'on' );
        moreBox.hide ();
    } )
}

// form element customize
function customizeForm ()
{
    // 미조치알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : 'f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        width : 58,
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0,
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        selectedColor : '#7d7d7d',
        selectedBorderColor : '#7d7d7d'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
        selectedColor : '#7d7d7d',
        selectedBorderColor : '#7d7d7d'
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
        selectedColor : '#f47321',
        selectedBorderColor : '#f47321'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );

    $ ( '#disconnect' ).customizeCheckbox ( checkOption1 );
    $ ( '#error' ).customizeCheckbox ( checkOption2 );
    $ ( '#warning' ).customizeCheckbox ( checkOption3 );
    $ ( '#fault' ).customizeCheckbox ( checkOption4 );

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.al_list_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );

    $ ( '.scr_smr' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

function initAlarmList ()
{
    getAlarmList ();

    var $inputCheckBox = $ ( '.f_chk input' );
    $inputCheckBox.on ( 'click', function ()
    {
        getAlarmList ();
    } );

}

function initEventList ()
{
    getEventList ();

}

function getEqmtInfo ()
{
    $.ajax ( {
        url : contextPath + '/hom/monitoring/siteportal/selectTagValue.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var template = _.template ( getTemplate ( templates.eqmtInfo ) );
                var json_data = json.data;

                var html = template ( {
                    lang : lang,
                    locale : locale,
                    data : json.data
                } );

                $ ( '.alr_group' ).before ( html );

                $ ( '.data_wrap' ).find ( '.btn_popup' ).magnificPopup ( {
                    type : 'ajax',
                    alignTop : false,
                    overflowY : 'scroll',
                    closeOnContentClick : false,
                    callbacks : {
                        ajaxContentAdded : function ()
                        {
                            setParameter ( $ ( '.data_wrap' ).find ( '.btn_popup' ) );
                        }
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

// 운전 상태
// PCS(DC/DC)별 운전 상태 (0: 정지, 1: 초기화, 2: 운전)
// BMS별 운전 상태 (0: 정지, 1: 초기화, 2: 운전)
// DC/DC (0: 정지, 1: 초기화, 2: 운전 – Run/Init/Stop)
function getOpSttus ( data, tagId )
{
    var opSttus = '';

    if ( isValidateTagValue ( data, tagId ) )
    {
        switch ( data[tagId] )
        {
            case '0':
                opSttus = i18nMessage.msg_stop;
                break;
            case '1':
                opSttus = i18nMessage.msg_initialize;
                break;
            case '2':
                opSttus = i18nMessage.msg_run;
                break;
            default:
                opSttus = '';
                break;
        }
    }

    return opSttus;
}

// 운전 상태 css
function getOpSttusCss ( data, tagId )
{
    var opSttusCss = '';

    if ( isValidateTagValue ( data, tagId ) )
    {
        switch ( data[tagId] )
        {
            case '0':
                opSttusCss = 'stoppg';
                break;
            case '1':
                opSttusCss = 'inital';
                break;
            case '2':
                opSttusCss = 'running';
                break;
            default:
                opSttusCss = '';
                break;
        }
    }

    return opSttusCss;
}

// 장비상태 css
function getEqmtSttusCss ( data, eqmtId )
{
    var eqmtSttusCss = '';
    // 고장 상태
    if ( isValidateTagValue ( data, eqmtId + '_E_001_FAULT' ) && data[eqmtId + '_E_001_FAULT'] === '1' )
    {
        eqmtSttusCss = 'broken';
    }
    // 경고상태
    else if ( isValidateTagValue ( data, eqmtId + '_E_001_WARN' ) && data[eqmtId + '_E_001_WARN'] === '1' )
    {
        eqmtSttusCss = 'warnng';
    } else
    {
        eqmtSttusCss = 'normal';
    }
    return eqmtSttusCss;
}

// 장비상태
// AE023#PCS0001_E_001_FAULT 고장 상태 PCS Fault Status PCS(DC/DC)별 고장 상태 (0: 정상, 1: 고장)
// AE023#PCS0001_E_001_WARN 경고 상태 PCS Warning Status PCS(DC/DC)별 경고 상태 (0: 정상, 1: 경고)
function getEqmtSttus ( data, eqmtId )
{
    var eqmtSttus = '';
    // 고장 상태
    if ( isValidateTagValue ( data, eqmtId + '_E_001_FAULT' ) && data[eqmtId + '_E_001_FAULT'] === '1' )
    {
        eqmtSttus = i18nMessage.msg_mntrFault;
    }
    // 경고상태
    else if ( isValidateTagValue ( data, eqmtId + '_E_001_WARN' ) && data[eqmtId + '_E_001_WARN'] === '1' )
    {
        eqmtSttus = i18nMessage.msg_mntrEqmtWarning
    } else
    {
        eqmtSttus = i18nMessage.msg_mntrNormal;
    }

    return eqmtSttus;
}

// 출력상태 css
function getCndSttusCss ( data, tagId )
{
    var cndSttusCss = '';

    if ( isValidateTagValue ( data, tagId ) )
    {
        switch ( data[tagId] )
        {
            case '1':
                cndSttusCss = 'charge';
                break;
            case '2':
                cndSttusCss = 'waiting';
                break;
            case '3':
                cndSttusCss = 'dischg';
                break;
            default:
                cndSttusCss = '';
                break;
        }
    }
    return cndSttusCss;
}

// PCS(DC/DC)별 충방전 상태 (1: 충전, 2: 대기, 3: 방전)
function getCndSttus ( data, tagId )
{
    var cndSttus = '';

    if ( isValidateTagValue ( data, tagId ) )
    {
        switch ( data[tagId] )
        {
            case '1':
                cndSttus = i18nMessage.msg_char_Chargy;
                break;
            case '2':
                cndSttus = i18nMessage.msg_Waiting;
                break;
            case '3':
                cndSttus = i18nMessage.msg_DisCharge;
                break;
            default:
                cndSttus = '';
                break;
        }
    }

    return cndSttus;
}

// AC전력 >0 이면 발전상태
// AC전력 =<0 이면 대기상태
function getInvCndSttus ( data, tagId )
{
    var cndSttus = '';

    if ( isValidateTagValue ( data, tagId ) )
    {
        if ( Number ( data[tagId] ) > 0 )
        {
            cndSttus = i18nMessage.msg_PowerRun;
        } else
        {
            cndSttus = i18nMessage.msg_Waiting;
        }
    }

    return cndSttus;
}

function getInvCndSttusCss ( data, tagId )
{
    var cndSttusCss = '';

    if ( isValidateTagValue ( data, tagId ) )
    {

        if ( Number ( data[tagId] ) > 0 )
        {
            cndSttusCss = 'elegan';
        } else
        {
            cndSttusCss = 'waiting';
        }

    }

    return cndSttusCss;
}

// TR 온도알람
// 아래 둘중에 하나라도 on이면 on 표시
// AE023#VCB0002_TRN0001_E_001_LTAU
// AE023#VCB0002_TRN0001_E_001_LTAO
function getTrTempSttus ( data, eqmtId )
{
    var cndSttus = 'off';

    if ( !isValidateTagValue ( data, eqmtId + '_LTAU' ) && !isValidateTagValue ( data, eqmtId + '_LTAO' ) )
    {
        return ''
    }

    if ( isValidateTagValue ( data, eqmtId + '_LTAU' ) && data[eqmtId + '_LTAU'] === '1' )
    {
        return 'on'
    }

    if ( isValidateTagValue ( data, eqmtId + '_LTAO' ) && data[eqmtId + '_LTAO'] === '1' )
    {
        return 'on'
    }

    return cndSttus;
}

// Inv 운전/정지 상태
// - 아래 중에 하나라도 on 이면 운전상태
// AE023#TRN0001_IVT0001_E_001_IVFUSU01
// AE023#TRN0001_IVT0001_E_001_IVRU01
// AE023#TRN0001_IVT0001_E_001_IVFUSU02
// AE023#TRN0001_IVT0001_E_001_IVRU02
// - 아래 중 하나라도 off 이면 정지상태
// AE023#TRN0001_IVT0001_E_001_IVARU01
// AE023#TRN0001_IVT0001_E_001_IVSU01
// AE023#TRN0001_IVT0001_E_001_IVFSU01
// AE023#TRN0001_IVT0001_E_001_IVARU02
// AE023#TRN0001_IVT0001_E_001_IVSU02
// AE023#TRN0001_IVT0001_E_001_IVFSU02

function getInvOpSttus ( data, eqmtId )
{
    var cndSttus = i18nMessage.msg_stop;

    if ( isValidateTagValue ( data, eqmtId + '_IVFUSU01' ) && data[eqmtId + '_IVFUSU01'] === '1' )
    {
        return i18nMessage.msg_operation;
    }

    if ( isValidateTagValue ( data, eqmtId + '_IVRU01' ) && data[eqmtId + '_IVRU01'] === '1' )
    {
        return i18nMessage.msg_operation;
    }

    if ( isValidateTagValue ( data, eqmtId + '_IVFUSU02' ) && data[eqmtId + '_IVFUSU02'] === '1' )
    {
        return (language === 'ko') ? i18nMessage.msg_operation : 'Run';
    }

    if ( isValidateTagValue ( data, eqmtId + '_IVRU02' ) && data[eqmtId + '_IVRU02'] === '1' )
    {
        return i18nMessage.msg_operation;
    }

    return cndSttus;
}

// Inv 운전/정지 상태 css
function getInvOpSttusCss ( data, eqmtId )
{
    var cndSttus = 'stoppg';

    if ( isValidateTagValue ( data, eqmtId + '_IVFUSU01' ) && data[eqmtId + '_IVFUSU01'] === '1' )
    {
        return 'running';
    }

    if ( isValidateTagValue ( data, eqmtId + '_IVRU01' ) && data[eqmtId + '_IVRU01'] === '1' )
    {
        return 'running';
    }

    if ( isValidateTagValue ( data, eqmtId + '_IVFUSU02' ) && data[eqmtId + '_IVFUSU02'] === '1' )
    {
        return 'running';
    }

    if ( isValidateTagValue ( data, eqmtId + '_IVRU02' ) && data[eqmtId + '_IVRU02'] === '1' )
    {
        return 'running';
    }

    return cndSttus;
}

// 최고온도
// 두 태그 중 큰 값 표기
// AE023#TRN0001_IVT0001_E_001_HSTMPU01
// AE023#TRN0001_IVT0001_E_001_HSTMPU02
function getInvMaxTemp ( data, eqmtId )
{
    var cndSttus = '';

    if ( isValidateTagValue ( data, eqmtId + '_HSTMPU01' ) && isValidateTagValue ( data, eqmtId + '_HSTMPU02' ) )
    {
        return Number ( data[eqmtId + '_HSTMPU01'] ) > Number ( data[eqmtId + '_HSTMPU02'] ) ? tagValue ( data, eqmtId
                + '_HSTMPU01' ) : tagValue ( data, eqmtId + '_HSTMPU02' )
    }

    return cndSttus;
}

// 디지털태그 Value
function getDigtTagValue ( data, tagId, trueValue, falseValue )
{
    if ( !isValidateTagValue ( data, tagId ) )
    {
        return '';
    }

    return (data[tagId] === '1') ? trueValue : falseValue;
}

// 통신태그 상태(0: 비정상, 1: 정상)
function getNetSttus ( data, tagId )
{
    if ( !isValidateTagValue ( data, tagId ) )
    {
        return 'icon_green';
    }

    return (data[tagId] === '1') ? 'icon_green' : 'icon_red';
}

// Inv alarm 상태
function getInvAlarmSttus ( data, tagId )
{
    var opSttus = i18nMessage.msg_mntrNormal;

    if ( isValidateTagValue ( data, tagId ) )
    {
        switch ( data[tagId] )
        {
            case 'ALVL01':
                opSttus = i18nMessage.msg_mntrNormal;
                break;
            case 'ALVL02':
                opSttus = i18nMessage.msg_mntrEqmtWarning;
                break;
            case 'ALVL03':
                opSttus = i18nMessage.msg_mntrFault;
                break;
            case 'ALVL04':
                opSttus = i18nMessage.msg_mntrNetErr;
                break;
            default:
                opSttus = i18nMessage.msg_mntrNormal;
                break;
        }

    }

    return opSttus;
}

// Inv alarm 상태 css
function getInvAlarmSttusCss ( data, tagId )
{
    var opSttusCss = 'normal';

    if ( isValidateTagValue ( data, tagId ) )
    {
        switch ( data[tagId] )
        {
            case 'ALVL01':
                opSttusCss = 'normal';
                break;
            case 'ALVL02':
                opSttusCss = 'warnng';
                break;
            case 'ALVL03':
                opSttusCss = 'broken';
                break;
            case 'ALVL04':
                opSttusCss = 'neterr';
                break;
            default:
                opSttusCss = 'normal';
                break;

        }
    }

    return opSttusCss;
}

function isValidateTagValue ( data, tagId )
{

    return !_.isUndefined ( data[tagId] );
}

function tagValue ( data, tagId )
{
    var tagValue = '';

    if ( isValidateTagValue ( data, tagId ) )
    {
        tagValue = homUtil.mathFloorComma ( data[tagId], staticVariable.decimalPoint );
    }

    return tagValue;
}

// 알람 목록
function getAlarmList ()
{
    var alarmGradCds = [];
    $ ( '.f_chk input' ).each ( function ()
    {
        var $that = $ ( this );
        if ( $that.prop ( 'checked' ) )
        {
            var alarmGradCd = $that.val ();
            alarmGradCds.push ( alarmGradCd );
        }
    } );

    var tpl = getTemplate ( templates.noData );
    var alarmLiTpl = getTemplate ( templates.alarmLi );

    var $alList = $ ( '#alarm_list' );
    var $gqNodata = $ ( '.gq_nodata' );
    $alList.empty ();

    if ( alarmGradCds != null && alarmGradCds != '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/monitoring/summary/selectAlarmList.ajax',
            cache : false,
            type : 'GET',
            dataType : 'json',
            data : {
                alarmGradCds : alarmGradCds.toString ()
            },
            success : function ( data )
            {
                if ( data != null && data.length > 0 )
                {
                    var html = '';
                    if ( alarmLiTpl != null )
                    {
                        var template = _.template ( alarmLiTpl );
                        var html = template ( {
                            i18nMessage : i18nMessage,
                            contextPath : contextPath,
                            data : data
                        } );
                        $alList.append ( html );

                        $alList.find ( '.btn_popup' ).magnificPopup ( {
                            type : 'ajax',
                            alignTop : false,
                            overflowY : 'scroll',
                            closeOnContentClick : false,
                            callbacks : {
                                ajaxContentAdded : function ()
                                {
                                    setParameter ( $alList.find ( '.btn_popup' ) );
                                }
                            }
                        } );

                        var $alarm_count = $ ( '#alarm_count' );

                        $alarm_count.find ( 'span' ).text (
                                i18nMessage.msg_alarm + "(" + data.length + i18nMessage.msg_count + ")" );
                    }
                } else
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_sentenceGridNoData
                    } );

                    $alList.append ( html );

                    $gqNodata.show ();
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
    } else
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $alList.append ( html );

        $gqNodata.show ();
    }
}

// 이벤트 목록
function getEventList ()
{
    var alarmGradCds = [];

    var alarmGradCd = 'ALVL01';
    alarmGradCds.push ( alarmGradCd );

    var tpl = getTemplate ( templates.noData );
    var alarmLiTpl = getTemplate ( templates.eventLi );

    var $alList = $ ( '#event_list' );
    var $gqNodata = $ ( '.gq_nodata' );
    $alList.empty ();

    if ( alarmGradCds != null && alarmGradCds != '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/monitoring/summary/selectAlarmList.ajax',
            cache : false,
            type : 'GET',
            dataType : 'json',
            data : {
                alarmGradCds : alarmGradCds.toString ()
            },
            success : function ( data )
            {
                if ( data != null && data.length > 0 )
                {
                    var html = '';
                    if ( alarmLiTpl != null )
                    {
                        var template = _.template ( alarmLiTpl );
                        var html = template ( {
                            i18nMessage : i18nMessage,
                            contextPath : contextPath,
                            data : data
                        } );
                        $alList.append ( html );

                        $alList.find ( '.btn_popup' ).magnificPopup ( {
                            type : 'ajax',
                            alignTop : false,
                            overflowY : 'scroll',
                            closeOnContentClick : false,
                            callbacks : {
                                ajaxContentAdded : function ()
                                {
                                    setParameter ( $alList.find ( '.btn_popup' ) );
                                }
                            }
                        } );

                        var $alarm_count = $ ( '#event_count' );

                        $alarm_count.find ( 'span' ).text (
                                i18nMessage.msg_event + "(" + data.length + i18nMessage.msg_count + ")" );
                    }
                } else
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_sentenceGridNoData
                    } );

                    $alList.append ( html );

                    $gqNodata.show ();
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
    } else
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $alList.append ( html );

        $gqNodata.show ();
    }
}

// Show popup
function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );
}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    initAlarmList ();
    initEventList ();
    getEqmtInfo ();
    showPopup ();
    moreAction ();
} );