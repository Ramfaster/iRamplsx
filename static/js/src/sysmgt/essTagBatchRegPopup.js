
//파라미터 세팅
function setParameter ( param, method )
{
    var $btnPopup = param;

    closePopup ( $btnPopup ); // 팝업 닫기
    uploadExcel ( $btnPopup, method ); // 엑셀 일괄등록 및 수정    
    changeSelectedSite(); // 사이트 선택

}

//form element customize
function customizePopupForm ()
{
    $('#file').parent().css('position', 'unset');
    
    // 사이트리스트
    var $dateType1 = $ ( '#sel_type1' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

   $('#file').customizeFile ({  
        buttonType: 'bg_sprite',
        buttonText: i18nMessage.msg_find,
        buttonSpriteClass: 'btn_type05',
        buttonTextColor: '#4c4743',
        buttonWidth: 50,
        textWidth: 280,
        height: 25
    });

}

//팝업 닫기
function closePopup ( $btnPopup )
{
    $ ( '.btn_popup_close' ).on ( 'click', function ()
    {
        $btnPopup.magnificPopup ( 'close' );
    } );
}

// 엑셀 일괄등록 및 수정
function uploadExcel ( $btnPopup, method )
{
    $( '#method' ).val( method );    
    
    // 엑셀 일괄등록 or 수정
    $ ( '.pop_btn' ).on ( 'click', function ()
    {
        submitExcelForm ( $btnPopup );         
    } );
  
}

function submitExcelForm( $btnPopup )
{
    var tpl = getTemplate ( templates.essPopupError );
    var $popFileWrap = $ ( '.pop_file_wrap' );
    var maxFileSize = 10 * 1024 * 1024;

    var $gridList = $ ( '#gridList' );
    
    $ ( '.error' ).remove ();

    $ ( '#excelForm' ).ajaxForm ( {
        beforeSubmit : function ( data, form, option )
        {
            // 사이트를 선택하지 않은 경우
            var selectedSite = $('#sel_type1 :selected').val();
            if ( selectedSite === '' ) 
            {
                var template = _.template ( tpl );
                var html = template ( {
                    msg_fail : i18nMessage.msg_fail,
                    msg_cause : i18nMessage.msg_cause,
                    message : i18nMessage.msg_selectSite,
                } );

                $ ( html ).insertAfter ( $popFileWrap );

                return false;
            }
            
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
                            msg_fail : i18nMessage.msg_fail,
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
                            msg_fail : i18nMessage.msg_fail,
                            msg_cause : i18nMessage.msg_cause,
                            message : homUtil.fileExtensionFormat.excel + i18nMessage.msg_validFileInputExtension
                        } );

                        $ ( html ).insertAfter ( $popFileWrap );

                        return false;
                    }
                }
                
                return true;
            } else // file null
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        msg_fail : i18nMessage.msg_fail,
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
                $btnPopup.magnificPopup ( 'close' );

            } else if ( json.status === staticVariable.jsonStatusError )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        msg_fail : i18nMessage.msg_fail,
                        msg_cause : i18nMessage.msg_cause,
                        message : json.message
                    } );

                    $ ( html ).insertAfter ( $popFileWrap );
                }
            }

            reloadJqgrid ( $gridList );

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


// 사이트 선택
function changeSelectedSite()
{
    var $selPvId = $('#sel_type1');
    var selectedSite = $('#sel_type1 :selected').val();
    
    $selPvId.change ( function() {
        var selectedSite = $('#sel_type1 :selected').val();
    });

}

$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

} );