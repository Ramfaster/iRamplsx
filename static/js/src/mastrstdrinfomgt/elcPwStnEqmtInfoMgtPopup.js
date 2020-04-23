// 파라미터 세팅
function setParameter ( param )
{
    var $btnPopup = param;

    closePopup ( $btnPopup );
    uploadExcel ( $btnPopup );
}

// form element customize
function customizePopupForm ()
{
    $ ( '#file' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25,
        enableInitButton : true,
        initButtonBackgroundImage : contextPath + '/css/lib/customizeForm/img/img_close_btn01.png'
    } );
}

// 팝업 닫기
function closePopup ( $btnPopup )
{
    $ ( '.btn_popup_close' ).on ( 'click', function ()
    {
        $btnPopup.magnificPopup ( 'close' );
    } );
}

// 엑셀 업로드
function uploadExcel ( $btnPopup )
{
    var tpl = getTemplate ( templates.popupError );
    var $popFileWrap = $ ( '.pop_file_wrap' );
    var maxFileSize = 10 * 1024 * 1024;

    $ ( '.btn_popup_register' ).on ( 'click', function ()
    {
        $ ( '.pop_noti_wrap' ).remove ();

        $ ( '#excelForm' ).ajaxForm ( {
            beforeSubmit : function ( data, form, option )
            {
                var file = null;
                $.each ( data, function ( i )
                {
                    if ( data[i].type === 'file' && data[i].value !== '' )
                    {
                        file = data[i].value;
                        return false;
                    }
                } );

                // 파일 선택 여부 및 확장자 체크
                if ( file !== null )
                {
                    // 파일 사이즈
                    if ( maxFileSize < file.size )
                    {
                        if ( tpl !== null )
                        {
                            var template = _.template ( tpl );
                            var html = template ( {
                                msg_registerFail : i18nMessage.msg_registerFail,
                                msg_cause : i18nMessage.msg_cause,
                                message : i18nMessage.msg_validFileInputSizeDown,
                            } );

                            $ ( html ).insertAfter ( $popFileWrap );

                            return false;
                        }
                    }

                    // 포함되는 확장자가 없는 경우
                    if ( !homUtil.checkFileExtension ( file.name, homUtil.fileExtensionFormat.excel ) )
                    {
                        if ( tpl !== null )
                        {
                            var template = _.template ( tpl );
                            var html = template ( {
                                msg_registerFail : i18nMessage.msg_registerFail,
                                msg_cause : i18nMessage.msg_cause,
                                message : homUtil.fileExtensionFormat.excel + i18nMessage.msg_validFileInputExtension
                            } );

                            $ ( html ).insertAfter ( $popFileWrap );

                            return false;
                        }
                    }

                    return true;
                } else
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            msg_registerFail : i18nMessage.msg_registerFail,
                            msg_cause : i18nMessage.msg_cause,
                            message : i18nMessage.msg_alertExcelNoData
                        } );

                        $ ( html ).insertAfter ( $popFileWrap );

                        return false;
                    }
                }
            },
            success : function ( json, status )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    // TODO 엑셀 업로드 완료 시 팝업 창 닫고 해당 페이지 갱신
                    $btnPopup.magnificPopup ( 'close' );

                    location.href = contextPath + '/hom/masterdata/equipment/list.do';

                } else if ( json.status === staticVariable.jsonStatusError )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            msg_registerFail : i18nMessage.msg_registerFail,
                            msg_cause : i18nMessage.msg_cause,
                            message : json.message
                        } );

                        $ ( html ).insertAfter ( $popFileWrap );
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
        } );
    } );
}

$ ( function ()
{
    customizePopupForm ();
} );