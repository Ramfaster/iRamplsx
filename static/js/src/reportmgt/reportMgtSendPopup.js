function customizeMailPopupScroll ()
{
    // custom scroll
    $ ( '.mail_template' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// jqgird customize
function customizeJqgridMailPopup ()
{
    var tpl = getTemplate ( templates.noData );

    var colNames = null;
    var colModel = null;
    var $totalRowCount = $ ( "#totalRowCount" );
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );

    var noDataId = 'mailTemplate_jqgrid_nodata';

    // jqgrid
    $ ( '#gridListPopup' ).jqGrid (
            {
                url : contextPath + '/hom/reportmgt/selectMailTmplatList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 333,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ 'mailTmplatSeq', 'nationId', '', i18nMessage.msg_nation, i18nMessage.msg_templateName,
                        'hiddenSbjt', 'hiddenConts' ],
                colModel : [
                        {
                            name : 'mailTmplatSeq',
                            hidden : true
                        },
                        {
                            name : 'nationId',
                            hidden : true
                        },
                        {
                            name : 'radio',
                            align : 'center',
                            width : '43',
                            sortable : false,
                            formatter : function ( cellValue, option )
                            {
                                return '<input type="radio" id="jqgrid_mail_tmplat' + option.rowId
                                        + '" class="jqgrid_mail_template_radio" name="mailTmplatSeqs" data-row-id="'
                                        + option.rowId + '" />';
                            }
                        }, {
                            name : 'nationNm',
                            align : 'left',
                            width : '146'
                        }, {
                            name : 'mailTmplatNm',
                            align : 'left',
                            width : '200'
                        }, {
                            name : 'sbjt',
                            hidden : true
                        }, {
                            name : 'conts',
                            hidden : true
                        } ],
                sortname : 'mailTmplatNm',
                sortorder : 'asc',
                multiselect : false,
                multiboxonly : false,
                rownumbers : false,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                loadComplete : function ( data )
                {
                    var $gridListPopup = $ ( '#gridListPopup' );
                    var $radios = $ ( '.ui-jqgrid-btable .jqgrid_mail_template_radio' );
                    var $gqNodata = $ ( '#' + noDataId );

                    // 조회결과
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $totalRowCount.html ( resultText );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var ids = $gridListPopup.jqGrid ( 'getDataIDs' );
                        var selectCount = 0;
                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridListPopup.getRowData ( cl );

                            // radio 처리
                            $radios.eq ( i ).attr ( 'value', rowData.mailTmplatSeq );

                            if ( $radios.prop ( 'checked' ) )
                            {
                                selectCount++;
                            }
                        }

                        // 첫 페이지이고 이전에 선택한 항목이 없을 경우 맨 처음 항목 선택 처리
                        if ( data.page === 1 && selectCount === 0 )
                        {
                            $ ( '.jqgrid_mail_template_radio' ).eq ( 0 ).prop ( 'checked', true ).trigger ( 'change' );
                        }
                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    $ ( '#jqgrid_mail_tmplat' + rowId ).prop ( 'checked', true ).trigger ( 'change' );
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridListPopup' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 메일 템플릿 jqgrid reload
function reloadJqgridMailPopup ( $gridListPopup, $searchValue )
{
    $gridListPopup.setGridParam ( {
        postData : {
            searchKey : 'all',
            searchKeyword : $searchValue.val ()
        }
    } ).trigger ( 'reloadGrid' );
}

// 메일 템플릿 검색
function searchMailTemplate ()
{
    var $searchValue = $ ( '#mail_template_keyword' );
    var $gridListPopup = $ ( '#gridListPopup' );

    $ ( '#btn_search_template' ).on ( 'click', function ()
    {
        reloadJqgridMailPopup ( $gridListPopup, $searchValue );
    } );

    $searchValue.on ( 'keypress', function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadJqgridMailPopup ( $gridListPopup, $searchValue );
        }
    } );
}

// 메일 템플릿 선택
function choiceMailTemplate ()
{
    var mailTmplatContsTpl = getTemplate ( templates.mailTmplatConts );
    var $mailTemplate = $ ( '.mail_template' );

    $ ( document ).on ( 'change', '.jqgrid_mail_template_radio', function ()
    {
        if ( $ ( this ).prop ( 'checked' ) )
        {
            var rowId = $ ( this ).data ( 'row-id' );
            var rowData = $ ( '#gridListPopup' ).getRowData ( rowId );

            $ ( '.preview_tit' ).text ( rowData.sbjt );

            if ( mailTmplatContsTpl !== null )
            {
                var template = _.template ( mailTmplatContsTpl );
                var html = template ( {
                    contextPath : contextPath,
                    marginAuto : false,
                    conts : rowData.conts
                } );

                $ ( '.preview_cont' ).html ( html );
            }
        }
    } );
}

// 메일 전송
function sendMailTemplate ()
{
    $ ( '#btn_send_template' )
            .on (
                    'click',
                    function ()
                    {
                        // 유효성 체크
                        // 발신자 메일주소 공백 체크
                        var $fromEmail = $ ( '#from_email' );
                        var $toEmail = $ ( '#to_email' );
                        var $mailTemplateRadio = $ ( '.jqgrid_mail_template_radio:checked' );
                        var emailRegEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

                        var fromEmail = $fromEmail.val ();
                        var toEmail = $toEmail.val ();

                        if ( $.trim ( fromEmail ) === '' )
                        {
                            alert ( i18nMessage.msg_sentenceReportSenderEmailAddress );

                            return;
                        }

                        if ( !emailRegEx.test ( fromEmail + '@hanwha.com' ) )
                        {
                            alert ( i18nMessage.msg_sentenceReportValidSenderEmailAddress );

                            return;
                        }

                        // 수신자 메일주소 공백 체크
                        if ( $.trim ( $toEmail.val () ) === '' )
                        {
                            alert ( i18nMessage.msg_sentenceReportRecipientEmailAddress );

                            return;
                        }

                        var toEmails = $toEmail.val ().split ( ',' );
                        var toEmailFlag = true;

                        for ( var i = 0, length = toEmails.length; i < length; i++ )
                        {
                            if ( !emailRegEx.test ( toEmails[i] ) )
                            {
                                toEmailFlag = false;
                                break;
                            }
                        }

                        // 수신자 메일주소 , 구분 후 항목 비어있는지 체크
                        if ( !toEmailFlag )
                        {
                            alert ( i18nMessage.msg_sentenceReportValidRecipientEmailAddress );

                            return;
                        }

                        if ( $mailTemplateRadio.size () === 0 )
                        {
                            alert ( i18nMessage.msg_sentenceReportSelectTemplateEmail );

                            return;
                        }

                        var params = {
                            fromEmail : fromEmail,
                            toEmail : $toEmail.val (),
                            mailTmplatSeq : $mailTemplateRadio.val ()
                        };

                        // 리포트 메일전송 관련 정보 추가
                        params = $.extend ( {}, params, reportSendInfo );

                        $.ajax ( {
                            url : contextPath + '/hom/reportmgt/sendMail.ajax',
                            type : 'POST',
                            data : params,
                            dataType : 'json',
                            async : false,
                            success : function ( json )
                            {
                                if ( json.status === staticVariable.jsonStatusSuccess )
                                {
                                    // 다 끈낫을 경우 처리
                                    $ ( '#btn_close_template' ).trigger ( 'click' );

                                    $.customizeDialog ( {
                                        template : templates.dialog,
                                        message : i18nMessage.msg_sentenceEmailSend,
                                        checkText : i18nMessage.msg_ok,
                                        cancelText : i18nMessage.msg_cancel,
                                        type : staticVariable.dialogTypeInfo
                                    } );

                                } else if ( json.status === staticVariable.jsonStatusError )
                                {
                                    alert ( json.message );
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
                    } );
}

$ ( function ()
{
    customizeMailPopupScroll ();

    $.when ( customizeJqgridMailPopup () ).done ( function ()
    {
        searchMailTemplate ();
        choiceMailTemplate ();
        sendMailTemplate ();
    } );
} )