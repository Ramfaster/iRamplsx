// form element customize
function customizeForm ()
{

    // $ ( '#file1' ).customizeFile ( {
    // buttonType : 'bg_sprite',
    // buttonText : i18nMessage.msg_find,
    // buttonSpriteClass : 'btn_type05',
    // buttonTextColor : '#4c4743',
    // buttonWidth : 50,
    // textWidth : 280,
    // height : 25
    // } );

    $ ( '#file1' ).customizeFile ( {
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

function initDatetimepicker ()
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

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#date_type' );
    $dateType.change ( function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === 'day' )
        {
            className = 'yyyymmdd';
        } else if ( selectedType === 'month' )
        {
            className = 'yyyymm';
        } else if ( selectedType === 'year' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
}

function fnBatchRegCheck ()
{

    $ ( "#btn_sampledata" ).on (
            'click',
            function ()
            {
                var spcName = encodeURIComponent ( $ ( ':selected', $ ( '#spcId' ) ).text () );
                var nationName = encodeURIComponent ( $ ( ':selected', $ ( '#nationId' ) ).text () );
                location.href = $ ( "#btn_excel_popup" ).attr ( 'href' ) + '?isSampleDataExcelYn=Y&fromDate='
                        + $ ( '#batchdate01' ).val () + '&nationId=' + $ ( ':selected', $ ( '#nationId' ) ).val ()
                        + '&rd=' + $ ( 'input:radio[name="rd"]:checked' ).val () + '&spcId='
                        + $ ( ':selected', $ ( '#spcId' ) ).val () + '&spcName=' + encodeURIComponent ( spcName )
                        + '&nationName=' + encodeURIComponent ( nationName );
                return false;
            } );

    uploadExcel ();
}

// 엑셀 업로드
function uploadExcel ()
{

    // $ ( "#btn_batch_add" ).on ( 'click', function ()
    $ ( ".btn_popup_register" ).on (
            'click',
            function ()
            {
                var tpl = getTemplate ( templates.popupError );
                var $popFileWrap = $ ( '.pop_file_wrap' );
                var maxFileSize = 10 * 1024 * 1024;

                // $ ( '.pop_noti_wrap' ).remove ();

                $ ( "#batchStdrYear" ).val ( $ ( "#batchdate01" ).val () );

                $ ( '#batchExcelForm' ).ajaxForm (
                        {
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
                                                message : homUtil.fileExtensionFormat.excel
                                                        + i18nMessage.msg_validDataRequiredAttachedFileKind
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
                                return true;
                            },
                            success : function ( json, status )
                            {
                                if ( json.status === staticVariable.jsonStatusSuccess )
                                {
                                    $ ( "#date01" ).val ( $ ( "#batchdate01" ).val () );
                                    $ ( "#btn_search" ).trigger ( 'click' );
                                    $.magnificPopup.close ();

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

                                // reloadJqgrid ( $gridList, $date01, $date02 );

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
    customizeForm ();
    initDatetimepicker ();
    // alert ( $ ( "#date01" ).val () );

    $ ( "#batchdate01" ).val ( $ ( "#date01" ).val () );
    $ ( "#batchSpcId" ).val ( $ ( ':selected', $ ( '#spcId' ) ).val () );
    $ ( "#batchSpcName" ).text (
            $ ( "#batchSpcName" ).text () + ' ( ' + $ ( ':selected', $ ( '#spcId' ) ).text () + ' )' );

    fnBatchRegCheck ();

} );