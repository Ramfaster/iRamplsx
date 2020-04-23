// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $dateType = $ ( '#sel_type, #sel_type1, #sel_type14' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $dateType = $ ( '.customize_select' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    /*
     * var $dateType = $ ( '#alarmProcBeginTimeHH, #alarmProcBeginTimeMM, #alarmProcTrmnatTimeHH,
     * #alarmProcTrmnatTimeMM, #mailSndngBeginTimeHH, #mailSndngBeginTimeMM, #mailSndngTrmnatTimeHH,
     * #mailSndngTrmnatTimeMM, #smsSndngBeginTimeHH, #smsSndngBeginTimeMM, #smsSndngTrmnatTimeHH, #smsSndngTrmnatTimeMM' )
     * .customizeSelect ( { width : 60, paddingHorizontal : 15, height : 30, color : '#3c3c3c', initClass :
     * 'custom-form-select01', focusClass : 'custom-form-focused01', disableClass : 'custom-form-disabled01' } );
     */
    /*
     * $ ( ".disabled" ).css ( "background-color", "#e5e5e5" ); $ ( ".disabled" ).attr ( "readonly", "readonly" );
     */

    var $customizeSelect2 = $ ( '.customize_select2' ).select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var initFlag = true;
    $customizeSelect2.on ( 'select2:open', function ( e )
    {
        if ( initFlag )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            initFlag = false;
        }
    } );
}

/**
 * 입력된 항목 초기화
 */
function resetRegForm ()
{
    $ ( '#btn_reset' ).click ( function ()
    {
        $ ( '#alarmForm' ).each ( function ( index )
        {
            this.reset ();
        } );

        $ ( 'label.error' ).remove ();
        $ ( '.frm_type' ).removeClass ( 'error' );
    } );
}

// 조치가이드 삭제
function actionGuideDelete ()
{
    var $btnDel = $ ( ".del_item" );
    $btnDel.unbind ( 'click' );

    $btnDel.click ( function ()
    {
        var actionIdArray = new Array ();
        var strVal = $ ( this ).parent ().attr ( "data-id" );

        $ ( ".frm_item_list" ).find ( "span" ).each ( function ( index )
        {
            actionIdArray.push ( $ ( this ).attr ( "data-id" ) );

        } );

        var idx = actionIdArray.indexOf ( strVal );
        actionIdArray.splice ( idx, 1 );
        $ ( "#alarmManagtGdeCdArray" ).val ( actionIdArray );
        $ ( this ).parent ().remove ();

        checkActionGuideSize ();
    } );
}

// 조치가이드 추가
function actionGuideAdd ()
{
    var actionGuideTr = getTemplate ( templates.actionGuideTr );

    $ ( ".add_item" ).click (
            function ()
            {
                var $select = $ ( '#alarmManagtGdeCd' );
                var strText = $ ( ":selected", $select ).text ();
                var strVal = $ ( ":selected", $select ).val ();
                var checkFlag = false;

                var $actionGuideTblFrm = $ ( '#action_guide_tbl_frm' );
                if ( $actionGuideTblFrm.find ( 'tr' ).size () === 0 && actionGuideTr !== null )
                {
                    var template = _.template ( actionGuideTr );
                    var html = template ( {
                        message : i18nMessage.msg_actionGuide
                    } );

                    $actionGuideTblFrm.append ( html );
                    checkFlag = true;
                }

                var actionIdArray = new Array ();

                $ ( ".frm_item_list" ).find ( "span" ).each ( function ( index )
                {
                    actionIdArray.push ( $ ( this ).attr ( "data-id" ) );

                } );

                if ( actionIdArray.length < 5 )
                {
                    var idx = actionIdArray.indexOf ( strVal );
                    if ( idx < 0 )
                    {
                        var nHtml = "";
                        var nHtml = nHtml + "<li><span data-id='" + strVal + "'>" + strText
                                + "</span><a href='javascript:;' class='del_item link' data-alarmgdecd='" + strVal
                                + "'><i class='icon_delete'></i></a></li>";
                        $ ( ".frm_item_list" ).append ( nHtml );
                        actionIdArray.push ( strVal );
                        $ ( "#alarmManagtGdeCdArray" ).val ( actionIdArray );
                        actionGuideDelete ();
                    } else
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertDataExists,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );

                        if ( checkFlag )
                        {
                            checkActionGuideSize ();
                        }
                    }
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_validGuideInputNumberDownFive,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }

            } );
}

function checkActionGuideSize ()
{
    var $actionGuideTblFrmUl = $ ( '#action_guide_tbl_frm tr td ul' );
    var $actionGuideLi = $ ( 'li', $actionGuideTblFrmUl );

    if ( $actionGuideLi.size () === 0 )
    {
        $ ( '#action_guide_tbl_frm tr' ).remove ();
    }
}

function showMailTmplatPopup ()
{
    var $btn_popup = $ ( '.btn_mailtemplatepopup' );
    var $tagId = $ ( '#tagId' );
    if ( $tagId.val () !== '' )
    {
        $btn_popup.attr ( 'href', $btn_popup.attr ( 'href' ) + '?tagId=' + encodeURIComponent ( $tagId.val () ) );
    }

    $btn_popup.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                $ ( '#btn_closePopup' ).click ( function ()
                {
                    $btn_popup.magnificPopup ( 'close' );
                } );
            }
        }
    } );
}

function showPopup ()
{
    var $btnPopup2 = $ ( '.btn_corprpop' );
    $btnPopup2.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false, // 내용 클릭시 닫지 않음
        closeOnBgClick : false, // 백그라운드 클릭시 닫지 않음
        callbacks : {
            ajaxContentAdded : function ()
            {
                // Ajax content is loaded and appended to DOM
                $ ( '#btn_closePopup' ).click ( function ()
                {
                    $btnPopup2.magnificPopup ( 'close' );
                } );
            }
        }
    } );

    var $btnPopup3 = $ ( '.btn_syspop' );
    $btnPopup3.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false, // 내용 클릭시 닫지 않음
        closeOnBgClick : false, // 백그라운드 클릭시 닫지 않음
        callbacks : {
            ajaxContentAdded : function ()
            {
                // Ajax content is loaded and appended to DOM
                $ ( '#btn_closePopup' ).click ( function ()
                {
                    $btnPopup3.magnificPopup ( 'close' );
                } );
            }
        }
    } );

    var $btn_tagpop = $ ( '#btn_tagpop' );
    $btn_tagpop.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                $ ( '#btn_closePopup' ).click ( function ()
                {
                    $btn_tagpop.magnificPopup ( 'close' );
                } );
            }
        }
    } );
}

// 이벤트 셋팅
function setEvent ()
{
    /*
     * var $sysPop = $ ( ".syspop" ); var $corprPop = $ ( ".corprpop" );
     * 
     * $sysPop.on ( "click", function () { $ ( ".btn_syspop" ).click (); } ); $corprPop.on ( "click", function () { $ (
     * ".btn_corprpop" ).click (); } );
     */
    var $alarmKnd = $ ( "#sel_type" );

    // if ( $alarmKnd.val () == "ALK01" || $alarmKnd.val () == "ALK02" )
    // {
    // $ ( "#addInfoFrm" ).hide ();
    // $ ( "#addInfoFrmTitle" ).hide ();
    // $ ( "#mailSndngAtN" ).trigger ( 'click' );
    // $ ( "#smsSndngAtN" ).trigger ( 'click' );
    // } else
    // {
    $ ( "#addInfoFrm" ).show ();
    $ ( "#addInfoFrmTitle" ).show ();
    // }

    $alarmKnd.change ( function ( event )
    {
        if ( $ ( '#tagId' ).val () !== '' )
        {
            var selAlarmKndCd = $ ( this ).val ();

            if ( selAlarmKndCd == "ALK03" ) // 알람리뉴얼:설비대표알람-AS-IS 기준동일
            {
                $ ( "#sel_type1" ).val ( "ALVL03" ).trigger ( 'change' );
                $ ( "#sel_type1 option" ).not ( ":selected" ).attr ( "disabled", "disabled" );
            } else
            {
                $ ( "#sel_type1" ).val ( "ALVL01" ).trigger ( 'change' );
                $ ( "#sel_type1 option" ).removeAttr ( 'disabled' );
            }

            // if ( selAlarmKndCd == "ALK01" || selAlarmKndCd == "ALK02" )
            // {
            // $ ( "#addInfoFrm" ).hide ();
            // $ ( "#addInfoFrmTitle" ).hide ();
            // $ ( "#mailSndngAtN" ).trigger ( 'click' );
            // $ ( "#smsSndngAtN" ).trigger ( 'click' );
            // } else
            // {
            $ ( "#addInfoFrm" ).show ();
            $ ( "#addInfoFrmTitle" ).show ();
            // }
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validDataRequiredAlarmTag,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// 알람정보 벨리데이트
function alarmValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#alarmForm' ).validate (
            {
                rules : {
                    tagId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    alarmKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    alarmEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    alarmDesc : {
                        maxlength : 300
                    },
                    alarmDescOccrrnc : {
                        maxlength : 300
                    },
                    alarmDescRelease : {
                        maxlength : 300
                    },
                    alarmManagtGdeInfo : {
                        maxlength : 300
                    }
                },
                messages : {
                    tagId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagKoreanName )
                    },
                    alarmKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagKoreanName )
                    },
                    alarmEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagEnglishName )
                    },
                    alarmDesc : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagEnglishName )
                    }
                },
                submitHandler : function ( form )
                {
                    var flag = true;
                    // 설비대표 알람이면 이미 등록된 대표 알람 있는지 체크
                    if ( $ ( "#sel_type" ).val () == "ALK03" && $ ( "#sel_type1" ).val () == "ALVL03" )
                    {
                        if ( chkEqmtFaultAlarm () == false )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validOnlyOneRegisterEqmtStdrAlarm,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );
                            flag = false;
                        }
                    }

                    if ( flag )
                    {
                        // 알람 발생시간 셋팅
                        $ ( "#alarmProcBeginTime" ).val (
                                $ ( "#alarmProcBeginTimeHH" ).val () + ":" + $ ( "#alarmProcBeginTimeMM" ).val () );
                        $ ( "#alarmProcTrmnatTime" ).val (
                                $ ( "#alarmProcTrmnatTimeHH" ).val () + ":" + $ ( "#alarmProcTrmnatTimeMM" ).val () );

                        // 메일발송시간 셋팅
                        $ ( "#mailSndngBeginTime" ).val (
                                $ ( "#mailSndngBeginTimeHH" ).val () + ":" + $ ( "#mailSndngBeginTimeMM" ).val () );
                        $ ( "#mailSndngTrmnatTime" ).val (
                                $ ( "#mailSndngTrmnatTimeHH" ).val () + ":" + $ ( "#mailSndngTrmnatTimeMM" ).val () );

                        // sms발송시간 셋팅
                        $ ( "#smsSndngBeginTime" ).val (
                                $ ( "#smsSndngBeginTimeHH" ).val () + ":" + $ ( "#smsSndngBeginTimeMM" ).val () );
                        $ ( "#smsSndngTrmnatTime" ).val (
                                $ ( "#smsSndngTrmnatTimeHH" ).val () + ":" + $ ( "#smsSndngTrmnatTimeMM" ).val () );

                        // 조치가이드 값 셋팅
                        var alarmGdeCdArray = new Array ();
                        $ ( ".frm_item_list" ).find ( "span" ).each ( function ()
                        {
                            alarmGdeCdArray.push ( $ ( this ).attr ( "data-id" ) );
                        } );
                        $ ( "#alarmManagtGdeCdArray" ).val ( alarmGdeCdArray );
                        var data = $ ( "#alarmForm" ).serialize ();

                        // 알람 발생시간 및 메일, SMS 발송시간 유효성 체크
                        if ( homUtil.compareDates ( "2016-01-01 " + $ ( "#alarmProcBeginTime" ).val (), "2016-01-01 "
                                + $ ( "#alarmProcTrmnatTime" ).val (), "yyyy-MM-dd HH:mm" ) > 0
                                || homUtil.compareDates ( "2016-01-01 " + $ ( "#mailSndngBeginTime" ).val (),
                                        "2016-01-01 " + $ ( "#mailSndngTrmnatTime" ).val (), "yyyy-MM-dd HH:mm" ) > 0
                                || homUtil.compareDates ( "2016-01-01 " + $ ( "#smsSndngBeginTime" ).val (),
                                        "2016-01-01 " + $ ( "#smsSndngTrmnatTime" ).val (), "yyyy-MM-dd HH:mm" ) > 0 )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_dateCanNotStartDateTheFutureEndDate,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );
                            flag = false;
                        }
                    }

                    // if ( flag )
                    // 선택한 메일 수신 사용자의 국가와 메일 템플릿의 국가가 매칭되지 않은경우 저장하지 않음. -> 2018-11-22 로직 사용안함. 문경석 차장
                    if ( false )// 사용안함
                    {
                        var $mailInboundUserNationArray = $ ( '#mailInboundUserNationArray' );
                        var $mailTmplatNationArray = $ ( '#mailTmplatNationArray' );
                        var userNationArray = [];
                        var tmplatNationArray = [];
                        if ( $mailInboundUserNationArray.val () !== '' )
                        {
                            userNationArray = $mailInboundUserNationArray.val ().split ( ',' );
                        }
                        if ( $mailTmplatNationArray.val () !== '' )
                        {
                            tmplatNationArray = $mailTmplatNationArray.val ().split ( ',' );
                        }

                        var diffUserNationArray = _.difference ( userNationArray, tmplatNationArray );
                        var diffMailNationArray = _.difference ( tmplatNationArray, userNationArray );
                        if ( diffUserNationArray.length > 0 )
                        {
                            flag = false;
                            $.when ( $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_alertMailUserDiffNation,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeConfirm
                            } ) ).then ( function ( confirm )
                            {
                                if ( confirm )
                                {
                                    form.submit ();
                                }
                            } );
                        } else if ( diffMailNationArray.length > 0 )
                        {
                            flag = false;
                            $.when ( $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_alertMailUserDiffNation,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeConfirm
                            } ) ).then ( function ( confirm )
                            {
                                if ( confirm )
                                {
                                    form.submit ();
                                }
                            } );
                        }
                    }

                    if ( flag )
                    {
                        $.when (
                                $.customizeDialog ( {
                                    template : templates.dialog,
                                    message : !existTagId ? i18nMessage.msg_alertCreateConfirm
                                            : i18nMessage.msg_alertUpdateConfirm,
                                    checkText : i18nMessage.msg_ok,
                                    cancelText : i18nMessage.msg_cancel,
                                    type : staticVariable.dialogTypeConfirm
                                } ) ).then ( function ( confirm )
                        {
                            if ( confirm )
                            {
                                form.submit ();
                            }
                        } );
                    }
                }
            } );

}

// 설비대표알람 등록여부 체크
function chkEqmtFaultAlarm ()
{
    var result = false;

    $.ajax ( {
        url : contextPath + '/hom/masterdata/alarm/checkEqmtAlarm.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            tagId : $ ( "#tagId" ).val (),
            eqmtId : $ ( "#eqmtId" ).val ()
        },
        async : false,
        success : function ( json )
        {
            if ( json.data == 0 )
            {
                result = true;
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

    return result;
}
$ ( function ()
{
    customizeForm ();
    showMailTmplatPopup ();
    showPopup ();
    resetRegForm ();
    actionGuideDelete ();
    actionGuideAdd ();
    setEvent ();
    alarmValidate ();
} );