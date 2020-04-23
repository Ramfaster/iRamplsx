// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.data_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

/**
 * 기상반 목록 조회
 */
function selectWtsList ()
{
    var $wtsList = $ ( '#wtsList' );
    $.ajax ( {
        // url : contextPath + '/hom/monitoring/network/selectWtsList.ajax',
        url : contextPath + '/hom/operation/summary/getWTSData.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // if ( elecNtwkMntr.tpl.wtsInfo !== null )
                // {
                // var template = _.template ( elecNtwkMntr.tpl.wtsInfo );
                // var count = 1;
                //
                // if ( json.data.length > 0 )
                // {
                // $wtsList.html ( '' );
                // $ ( json.data ).each ( function ()
                // {
                // var html = template ( {
                // wtsNumber : count,
                // wtsInfo : this,
                // lang : lang,
                // locale : locale
                // } );
                // $wtsList.append ( html );
                // count++;
                // } );
                // } else
                // {
                // var html = template ( {
                // wtsNumber : 0
                // } );
                //
                // $wtsList.html ( html );
                // }
                // }
                var num = 0;
                $.each ( json.data, function ( i, wtsTagInfo )
                {
                    if ( elecNtwkMntr.tpl.wtsInfo !== null )
                    {
                        var template = _.template ( elecNtwkMntr.tpl.wtsInfo );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            eqmtNm : i,
                            wtsTagInfoVoList : wtsTagInfo
                        } );

                        if ( num == 0 )
                        {
                            $wtsList.empty ().html ( html )
                        } else
                        {
                            $wtsList.append ( html )
                        }

                    }
                    num++;
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

/**
 * VCB와 TR 목록 조회
 */
function selectVcbAndTrList ()
{
    var $vcbTrList = $ ( '#vcbTrList' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/network/selectVcbAndTrList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( elecNtwkMntr.tpl.vcbTrInfo !== null )
                {
                    var template = _.template ( elecNtwkMntr.tpl.vcbTrInfo );
                    var vcbs = [];
                    var dupVcbs = [];

                    $.each ( json.data.vcbAndTrList, function ( index, item )
                    {
                        vcbs.push ( item.eqmtId );
                    } );

                    dupVcbs = _.uniq ( vcbs );

                    var tempVcbTrnInfo = [];
                    var curVcb;
                    var temp;
                    _.each ( json.data.vcbAndTrList, function ( val, index )
                    {
                        if ( index == 0 )
                        {
                            temp = val.eqmtId;
                            tempVcbTrnInfo.push ( val );
                        }

                        curVcb = val.eqmtId;

                        if ( index > 0 && (temp != curVcb) )
                        {
                            temp = curVcb;
                            tempVcbTrnInfo.push ( val );
                        }
                    } );

                    var html = template ( {
                        vcbTrInfo : tempVcbTrnInfo,
                        trnInfos : json.data.vcbAndTrList,
                        originalVcbAndTrList : json.data.originalVcbAndTrList,                        
                        vcbCount : dupVcbs.length,
                        lang : lang,
                        locale : locale
                    } );

                    $vcbTrList.html ( html );
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
 * ACB, 인버터, 접속반 목록을 조회
 */
function selectAcbAndIvtList ()
{
    var $acbIvtList = $ ( '#acbIvtList' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/network/selectAcbAndIvtList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( elecNtwkMntr.tpl.acbInfo !== null )
                {
                    var template = _.template ( elecNtwkMntr.tpl.acbInfo );

                    var jbDriveStts = [];
                    
//                    var originalAcbAndIvtList = json.data.originalAcbAndIvtList;
                    
                    $acbIvtList.html ( '' );
                    $ ( json.data.acbAndIvtList ).each ( function ( index, item )
//                    $ ( json.data ).each ( function ( index, item )                            
                    {
                        var jbDriveStts = _.sortBy ( item.jbDriveStts ).reverse ();

                        var html = template ( {
                            acbInfo : this,
                            originalAcbAndIvt : json.data.originalAcbAndIvtList[index],                                 
                            lang : lang,
                            locale : locale,
                            jbDriveStts : jbDriveStts[0]
                        } );

                        $acbIvtList.append ( html );
                    } );
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

function selectDataGatewayStatus ()
{
    $.ajax ( {
        url : contextPath + '/hom/monitoring/network/selectDataGatewayStatus.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var color = homConstants.dataGateWayRed;
                if ( homConstants.aliveY == json.data )
                {
                    color = homConstants.dataGateWayGreen;
                }
                $ ( '.operation .selected' ).html ( '<i class="icon_' + color + '"></i>' );
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

function initElecNtwkMntr ()
{
    selectWtsList ();
    selectVcbAndTrList ();
    selectAcbAndIvtList ();
    selectDataGatewayStatus ();

    // 인터벌에 의한 함수 호출(4분 주기)
    elecNtwkMntr.interval.elecNtwkMntrInterval = setInterval ( function ()
    {
        selectWtsList ();
        selectVcbAndTrList ();
        selectAcbAndIvtList ();
        selectDataGatewayStatus ();
    }, elecNtwkMntr.interval.TIME );
}

$ ( function ()
{

    elecNtwkMntr = {
        tpl : {
            acbInfo : getTemplate ( templates.acbInfo ),
            vcbTrInfo : getTemplate ( templates.vcbTrInfo ),
            // wtsInfo : getTemplate ( templates.wtsInfo ),
            wtsInfo : getTemplate ( templates.weatherStationDiv )
        },
        interval : {
            TIME : 1000 * 4 * 60,
            elecNtwkMntrInterval : null
        }
    }

    customizeScroll ();
    initElecNtwkMntr ();

} );