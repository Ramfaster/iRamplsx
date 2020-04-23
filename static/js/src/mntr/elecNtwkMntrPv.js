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
        url : contextPath + '/hom/operation/summary/getWTSData.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var num = 0;
                // TODO for문은 기상반 dump 데이터를 위해 생성
                for ( var i = 0; i < 3; i++ )
                {
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
 * 특고 변전소 조회
 */
function selectTemp01 ()
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
                if ( elecNtwkMntr.tpl.temp01 !== null )
                {
                    var template = _.template ( elecNtwkMntr.tpl.temp01 );
                    var vcbs = [];
                    var dupVcbs = [];

                    $.each ( json.data, function ( index, item )
                    {
                        vcbs.push ( item.eqmtId );
                    } );

                    dupVcbs = _.uniq ( vcbs );

                    var html = template ( {
                        vcbTrInfo : json.data,
                        trnInfos : json.data,
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
 * 특고 개폐소 조회
 */
function selectTemp02 ()
{
    var $vcbTrList = $ ( '#vcbTrList02' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/network/selectVcbAndTrList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( elecNtwkMntr.tpl.temp02 !== null )
                {
                    var template = _.template ( elecNtwkMntr.tpl.temp02 );
                    var vcbs = [];
                    var dupVcbs = [];

                    $.each ( json.data, function ( index, item )
                    {
                        vcbs.push ( item.eqmtId );
                    } );

                    dupVcbs = _.uniq ( vcbs );

                    var html = template ( {
                        vcbTrInfo : json.data,
                        trnInfos : json.data,
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
function selectTemp03 ()
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
                if ( elecNtwkMntr.tpl.temp03 !== null )
                {
                    var template = _.template ( elecNtwkMntr.tpl.temp03 );

                    var jbDriveStts = [];
                    $acbIvtList.html ( '' );
                    $ ( json.data ).each ( function ( index, item )
                    {
                        var jbDriveStts = _.sortBy ( item.jbDriveStts ).reverse ();

                        var html = template ( {
                            acbInfo : this,
                            lang : lang,
                            locale : locale,
                            jbDriveStts : jbDriveStts[0],
                            eqmtNm : index + 1
                        } );

                        $acbIvtList.append ( html );
                        movePage ();

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

function initElecNtwkMntr ()
{
    // 기상반 목록 조회
    selectWtsList ();
    // 특고 변전소 조회
    selectTemp01 ();
    // 특고 개폐소 조회
    selectTemp02 ();
    // SS 변전소
    selectTemp03 ();
}

/**
 * SS 변전소 클릭 시
 */
function movePage ()
{
    $ ( '.data02_cont_wrap' ).on ( 'click', function ()
    {
        var str = $ ( this ).data ( 'id' );
        location.href = contextPath + '/hom/monitoring/network/monitoring.do?key=' + str;
    } );
}

$ ( function ()
{
    elecNtwkMntr = {
        tpl : {
            // acbInfo : getTemplate ( templates.acbInfo ),
            // vcbTrInfo : getTemplate ( templates.vcbTrInfo ),
            wtsInfo : getTemplate ( templates.weatherStationDiv ), // 기상반
            temp01 : getTemplate ( templates.temp01 ), // 특고 변전소
            temp02 : getTemplate ( templates.temp02 ), // 특고 개폐소
            temp03 : getTemplate ( templates.temp03 )
        // SS 변전소
        // 변전소
        }
    }

    customizeScroll ();
    initElecNtwkMntr ();
    movePage ();

} );