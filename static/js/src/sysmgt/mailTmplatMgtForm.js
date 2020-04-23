// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $selType = $ ( '.sel_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    $ ( '#file' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25
    } );

    var $nationId = $ ( '.customize_select2' );
    $nationId.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag1 = true;

    // select event
    $nationId.on ( 'select2:open', function ( e )
    {
        if ( flag1 )
        {
            mCustomScrollbar ();

            flag1 = false;
        }
    } );

    // 항목 별 파라미터 설정
    var $select1 = $ ( '.js-basic-multiple' );
    $select1.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag = true;

    // select event
    $select1.on ( 'select2:open', function ( e )
    {
        $ ( '.select2-dropdown' ).addClass ( 'mutiple' );
        if ( flag )
        {
            mCustomScrollbar ();

            flag = false;
        }
    } );
}

function mCustomScrollbar ()
{
    $ ( '.select2-results' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.frm_cont_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

function showPopup ()
{
    var tpl = getTemplate ( templates.mailTmplatConts );
    var html = '';
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                var $sbjt = $ ( '#sbjt' );
                var $conts = $ ( '#conts' );
                var $atchFileComposition = $ ( '#atchFileComposition' );

                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    html = template ( {
                        contextPath : contextPath,
                        marginAuto : true,
                        conts : $conts.val ().replace ( /\n/g, '<br />' )
                    } );
                }

                $ ( '.preview_tit' ).text ( $sbjt.val () );
                $ ( '.preview_cont' ).html ( html );
                $ ( '.preview_bottom span' ).text ( $atchFileComposition.val () );
            }
        }
    } );
}

// 메일 템플릿 정보 초기화(등록 화면)
function mailTmplatInitialization ()
{
    if ( method === staticVariable.methodInsert )
    {
        $ ( '#btn_reset' ).click ( function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
            } );

            $ ( '.js-basic-multiple, #nationId' ).trigger ( 'change.select2' );
            $ ( 'label.error' ).remove ();
        } );
    }
}

// 파라미터 추가
function addParameter ()
{
    var $parameterType = $ ( '#paramtr_type' );
    var $btnParamtrAdd = $ ( '#btn_paramtr_add' );
    $btnParamtrAdd.click ( function ()
    {
        var $selectedParameterType = $ ( ':selected', $parameterType );
        var $paramtrs = $ ( '#paramtrs' );
        var $sbjt = $ ( '#sbjt' );
        var $conts = $ ( '#conts' );
        // var $atchFileComposition = $ ( '#atchFileComposition' );

        if ( $paramtrs.val () == '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validDataRequiredParameter,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            return;
        }

        var currentStr = '';
        _.each ( $paramtrs.val (), function ( param )
        {
            currentStr += '#' + param + '#';
        } );

        switch ( $selectedParameterType.val () )
        {
            case 'all':
                $sbjt.val ( $sbjt.val () + currentStr );
                $conts.val ( $conts.val () + currentStr );
                // $atchFileComposition.val ( $atchFileComposition.val () + currentStr );
                break;
            case 'sbjt':
                $sbjt.val ( $sbjt.val () + currentStr );
                break;
            case 'conts':
                $conts.val ( $conts.val () + currentStr );
                break;
            // case 'atchFileComposition':
            // $atchFileComposition.val ( $atchFileComposition.val () + currentStr );
            // break;
        }

        // input hidden 에 parameter ID 값 갱신
        var $paramtrIds = $ ( '#paramtrIds' );
        var paramtrIdsValue = _.union ( $paramtrIds.val ().split ( ',' ), $paramtrs.val () );
        $paramtrIds.val ( paramtrIdsValue );
    } );
}

// 파라미터 초기화
function resetParameter ()
{
    var $btnParamtrReset = $ ( '#btn_paramtr_reset' );
    $btnParamtrReset.click ( function ()
    {
        var $select2SelectionChoice = $ ( '.select2-selection__choice' );
        var $paramtrs = $ ( '#paramtrs' );

        $select2SelectionChoice.remove ();
        $paramtrs.val ( '' );
    } );
}

// 첨부파일 처리 하기
function checkFileSize ()
{
    var maxFileSize = 10 * 1024 * 1024;
    var flag = true;

    $ ( '.customizeFile' ).on ( 'change propertychange', function ()
    {
        var that = this;
        if ( maxFileSize < that.files[0].size )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validFileInputSizeDown,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        // 포함되는 확장자가 없는 경우
        if ( !homUtil.checkFileExtension ( that.files[0].name, homUtil.fileExtensionFormat.image ) )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : homUtil.fileExtensionFormat.image + i18nMessage.msg_validFileInputExtension,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        return flag;
    } );
}

// 메일템플릿 정보 유효성 체크
function mailTmplatValidate ()
{
    $ ( '#mailTmplatMgtForm' ).validate (
            {
                rules : {
                    mailTmplatNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    nationId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    mailTmplatDesc : {
                        maxlength : 300
                    },
                    sbjt : {
                        maxlength : 300
                    },
                    atchFileComposition : {
                        maxlength : 200
                    },
                },
                messages : {
                    mailTmplatNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredMailTemplateName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeMailTemplateName )
                    },
                    nationId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredNation )
                    },
                    mailTmplatDesc : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTemplateDescription )
                    },
                    sbjt : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSubject )
                    },
                    atchFileComposition : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeAttachedFilePatternComposition )
                    }
                },
                submitHandler : function ( form )
                {
                    var $sbjt = $ ( '#sbjt' );
                    var $conts = $ ( '#conts' );
                    var $paramtrIds = $ ( '#paramtrIds' );

                    // #과 #사이의 값을 받아와서 셋팅안된것을 셋팅해준다.
                    if ( $sbjt.val ().length > 0 || $conts.val ().length > 0 )
                    {
                        var sbjtArray = $sbjt.val ().match ( /\#([^#]*)\#/g );
                        var contsArray = $conts.val ().match ( /\#([^#]*)\#/g );
                        var matchArray = _.union ( sbjtArray, contsArray );
                        _.each ( matchArray, function ( item, index )
                        {
                            matchArray[index] = item.replace ( /#/g, '' );
                        } );

                        $paramtrIds.val ( matchArray.toString () );
                    }

                    $.when (
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : method === staticVariable.methodInsert ? i18nMessage.msg_alertCreateConfirm
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

            } );
}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    showPopup ();
    mailTmplatInitialization ();
    addParameter ();
    resetParameter ();
    checkFileSize ();
    mailTmplatValidate ();
} );