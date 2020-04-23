// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.op_cont' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// 생성된 연산자 수정 삭제 버튼
function editBtn ()
{
    $ ( '.op_edit' ).hover ( function ()
    {
        $ ( '.opt_btn_set' ).addClass ( 'inblock' );
    } );
    $ ( '.operator_set' ).mouseleave ( function ()
    {
        $ ( '.opt_btn_set' ).removeClass ( 'inblock' );
    } );
    $ ( '.btn_opt' ).unbind ( 'click' );
    $ ( '.btn_opt' ).click ( function ()
    {
        var that = $ ( this );
        var $formInputVal = that.closest ( 'div' ).find ( 'input.formlInputVals' );
        var cndfrmla = $ ( "#txtaCndfrmla" ).val ();
        if ( cndfrmla !== '' )
        {
            $ ( "#txtaCndfrmla" ).val ( cndfrmla + " " + $formInputVal.val () )
        } else
        {
            $ ( "#txtaCndfrmla" ).val ( $formInputVal.val () )
        }

    } );
}

// 연산자 추가
function addFormlDetlInfo ()
{
    var $btnChargerAdd = $ ( '#btnItemAdd' );
    var $btnRegister = $ ( '#btnAllRegister' );

    $btnChargerAdd.click ( function ()
    {
        validateFormlDetlInfo ();
    } );

    if ( editYN === '0' )
    {
        $btnChargerAdd.unbind ( 'click' );

    }
}

function validateFormlDetlInfo ()
{
    var $txtFormlDetlSeq = $ ( '#txtFormlDetlSeq' );
    var $txtFormlInputVal = $ ( '#txtFormlInputVal' );
    var $txtFormlItemKorNm = $ ( '#txtFormlItemKorNm' );
    var $txtFormlItemEngNm = $ ( '#txtFormlItemEngNm' );
    var $listNumber = $ ( '#itemNumber' );
    var divTpl = getTemplate ( templates.formlDetlInfoDiv );

    if ( $txtFormlInputVal.val () !== '' && $txtFormlItemKorNm.val () !== '' && $txtFormlItemEngNm.val () !== '' )
    {
        if ( $txtFormlInputVal.val ().length > 200 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validMaxsizeFormlInputVal,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            $txtFormlInputVal.addClass ( 'error' );
            return;
        } else if ( $txtFormlItemKorNm.val ().length > 50 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validMaxsizeFormlItemKorNm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            $txtFormlItemKorNm.addClass ( 'error' );
            return;
        } else if ( $txtFormlItemEngNm.val ().length > 50 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validMaxsizeFormlItemEngNm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            $txtFormlItemEngNm.addClass ( 'error' );
            return;
        }
        var $divListWrap = $ ( '.operator_wrap' );
        var $frmItemList = null;
        var listNumber = 1;
        var addFlag = false;
        var checkFlag = false;

        $frmItemList = $ ( 'div.operator_set', $divListWrap );

        if ( $frmItemList.size () !== 0 )
        {
            listNumber = parseInt ( $frmItemList.last ().data ( 'list-number' ), 10 ) + 1;
        } else
        {
            $frmItemInit = $ ( "#mCSB_1_container" );
            if ( divTpl !== null )
            {
                var template = _.template ( divTpl );
                var html = template ( {
                    listNumber : 0,
                    formlDetlSeq : $txtFormlDetlSeq.val (),
                    formlInputVal : $txtFormlInputVal.val (),
                    formlItemKorNm : $txtFormlItemKorNm.val (),
                    formlItemEngNm : $txtFormlItemEngNm.val (),
                    formlInputUpdates : "I"
                } );

                $frmItemInit.html ( html );
                editBtn ();
                resetItemForm ();
                return;
            }
        }
        if ( $listNumber.val () == -1 )
        {
            _.each ( $frmItemList, function ( li )
            {
                if ( $ ( li ).data ( 'input-value' ) == $txtFormlInputVal.val () )
                {
                    addFlag = true;
                    return true;
                }
            } );

            // 이미 등록되어 있는 경우 처리
            if ( addFlag )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_fromInputValExist,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                if ( divTpl !== null )
                {
                    var template = _.template ( divTpl );
                    var html = template ( {
                        listNumber : listNumber,
                        formlDetlSeq : $txtFormlDetlSeq.val (),
                        formlInputVal : $txtFormlInputVal.val (),
                        formlItemKorNm : $txtFormlItemKorNm.val (),
                        formlItemEngNm : $txtFormlItemEngNm.val (),
                        formlInputUpdates : "I"
                    } );

                    $frmItemList.parent ().append ( html );
                    editBtn ();
                    resetItemForm ();
                }
            }
        } else
        {

            if ( divTpl !== null )
            {
                var $locationLi = null;

                _.each ( $frmItemList, function ( li )
                {
                    if ( $ ( li ).data ( 'input-value' ) == $txtFormlInputVal.val () )
                    {
                        $locationLi = $ ( li );

                        return;
                    }
                } );
                if ( $locationLi != null )
                {
                    var $inputUpdateFlag = $locationLi.find ( 'input.formlInputUpdates' );
                    var updateFlag = "";
                    if ( $inputUpdateFlag.val () == 'N' || $inputUpdateFlag.val () == 'U' )
                    {
                        updateFlag = "U";
                    } else
                    {
                        updateFlag = "I";
                    }

                    var template = _.template ( divTpl );
                    var html = template ( {
                        listNumber : $listNumber.val (),
                        formlDetlSeq : $txtFormlDetlSeq.val (),
                        formlInputVal : $txtFormlInputVal.val (),
                        formlItemKorNm : $txtFormlItemKorNm.val (),
                        formlItemEngNm : $txtFormlItemEngNm.val (),
                        formlInputUpdates : updateFlag
                    } );

                    $locationLi.after ( html );
                    editBtn ();
                    $locationLi.remove ();

                    // 폼 초기화
                    resetItemForm ();

                }

                //
                // $locationLi.append ( html );
            }
        }

        $ ( '#formlDetlSeqs-error, #formlInputVals-error, #formlItemKorNms-error, #formlItemEngNms-error' ).remove ();
    } else
    {
        if ( $txtFormlInputVal.val () == '' )
        {

            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validRequiredFormlInputVal,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            $txtFormlInputVal.addClass ( 'error' );
        } else if ( $txtFormlItemKorNm.val () == '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validRequiredFormlItemKorNm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            $txtFormlItemKorNm.addClass ( 'error' );
        } else if ( $txtFormlItemEngNm.val () == '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validRequiredFormlItemEngNm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            $txtFormlItemEngNm.addClass ( 'error' );
        }
    }

}

// 연산자 수정
function updateFormlDetlInfo ()
{
    $ ( document ).on ( 'click', '.btn_write', function ()
    {
        var itemInfo = null; // 초기화
        itemInfo = $ ( this ).data ();

        var formlDetlSeq = itemInfo.itemSeq;
        var formlInputVal = itemInfo.itemVal;
        var formlItemKorNm = itemInfo.itemKname;
        var formlItemEngNm = itemInfo.itemEname;
        var formlItemNum = itemInfo.itemNumber;

        $ ( '#txtFormlInputVal' ).attr ( 'readonly', 'true' );

        $ ( '#txtFormlDetlSeq' ).val ( formlDetlSeq );
        $ ( '#txtFormlInputVal' ).val ( formlInputVal );
        $ ( '#txtFormlItemKorNm' ).val ( formlItemKorNm );
        $ ( '#txtFormlItemEngNm' ).val ( formlItemEngNm );
        $ ( '#itemNumber' ).val ( formlItemNum );

        $ ( '#spnItemAdd' ).text ( i18nMessage.msg_update );
    } );
}

// 연산자 삭제
function deleteFormlDetlInfo ()
{
    $ ( document ).on ( 'click', '.del_item', function ()
    {
        var that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                var $inputUpdateFlag = that.closest ( 'div' ).find ( 'input.formlInputUpdates' );
                // console.log ( $inputUpdateFlag );
                if ( $inputUpdateFlag.val () == 'N' || $inputUpdateFlag.val () == 'U' )
                {
                    $inputUpdateFlag.val ( "D" );
                    that.closest ( 'div.operator_set' ).hide ();

                } else if ( $inputUpdateFlag.val () == 'I' )
                {
                    that.closest ( 'div.operator_set' ).remove ();
                }
            }
        } );
    } );
}

// 연산자 입력 폼 초기화
function resetItemBtn ()
{
    $ ( '#btnItemReset' ).click ( function ()
    {
        resetItemForm ();
    } );
}

// 폼 초기화
function resetItemForm ()
{
    // 폼 초기화
    $ ( '#txtFormlDetlSeq' ).val ( -1 );
    $ ( '#txtFormlInputVal' ).val ( "" );
    $ ( '#txtFormlItemKorNm' ).val ( "" );
    $ ( '#txtFormlItemEngNm' ).val ( "" );
    $ ( '#itemNumber' ).val ( -1 );
    $ ( '#txtFormlInputVal' ).removeAttr ( 'readonly' );

    $ ( '#txtFormlInputVal' ).removeClass ( 'error' );
    $ ( '#txtFormlItemKorNm' ).removeClass ( 'error' );
    $ ( '#txtFormlItemEngNm' ).removeClass ( 'error' );

    $ ( '#spnItemAdd' ).text ( i18nMessage.msg_add );
}

// 수식 마스터 정보 초기화(등록 화면)
function formlMastrInfoInitialization ()
{
    if ( !existFormlMastrSeq )
    {
        $ ( '#btn_reset' ).click ( function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
            } );

            $ ( 'div.operator_set' ).each ( function ()
            {
                this.remove ();
            } );

            resetItemForm ();

            $ ( '.customize_select' ).trigger ( 'change' );
            $ ( '.tbl_add_wrap' ).find ( 'div.operator_set' ).remove ();
            $ ( 'label.error' ).remove ();
            $ ( '.frm_type' ).removeClass ( 'error' );
        } );
    }
}

// 연산자 버튼
function operatorBtn ()
{
    var $btnOperator = $ ( '.btn_operator' );
    var $txtaCndfrmla = $ ( '#txtaCndfrmla' );
    var $operatorBackspace = $ ( '#operatorBackspace' );
    var $operatorAddConstant = $ ( '#operatorAddConstant' );
    var $operatorClear = $ ( '#operatorClear' );

    $btnOperator.on ( 'click', function ()
    {

        var operator = $ ( this ).data ( 'operator' );
        var originCndfrmla = $txtaCndfrmla.val ();
        $txtaCndfrmla.val ( originCndfrmla + ' ' + operator );

    } );

    $operatorBackspace.on ( 'click', function ()
    {
        var cndfrmla = $ ( "#txtaCndfrmla" ).val ();
        if ( cndfrmla !== '' )
        {
            $ ( "#txtaCndfrmla" ).val ( cndfrmla.substring ( 0, cndfrmla.lastIndexOf ( " " ) ) );
        }
    } );

    $operatorAddConstant.on ( 'click', function ()
    {
        var $formInputVal = $ ( "#txtConstantVale" );
        var cndfrmla = $ ( "#txtaCndfrmla" ).val ();
        if ( cndfrmla !== '' )
        {
            $ ( "#txtaCndfrmla" ).val ( cndfrmla + " " + $formInputVal.val () )
        } else
        {
            $ ( "#txtaCndfrmla" ).val ( $formInputVal.val () )
        }

    } );

    $operatorClear.on ( 'click', function ()
    {
        $ ( "#txtaCndfrmla" ).val ( '' );

    } );

    if ( editYN === '0' )
    {
        $btnOperator.unbind ( 'click' );
        $operatorBackspace.unbind ( 'click' );
        $operatorAddConstant.unbind ( 'click' );
        $operatorClear.unbind ( 'click' );
    }
}

// 수식 마스터 정보 유효성 체크
function formlMastrValidate ()
{
    $.validator.addMethod ( "duplicate", function ( value, element )
    {
        var value = $.trim ( value );
        var result = false;

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/calculation/duplicateFormlId.ajax',
            type : 'POST',
            data : {
                formlId : value
            },
            dataType : 'json',
            async : false,
            success : function ( json )
            {
                result = (json.status === staticVariable.jsonStatusSuccess) ? true : false;

                if ( method == staticVariable.methodUpdate )
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

        return this.optional ( element ) || result === true;

    }, makeValidateMessage ( i18nMessage.msg_alertDuplicateItemFormlId ) );

    var tpl = getTemplate ( templates.labelError );

    $ ( '#formlForm' ).validate (
            {
                rules : {
                    formlId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50,
                        duplicate : true
                    },
                    formlKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    formlEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    formlDesc : {
                        maxlength : 300
                    },
                    formlRefer : {
                        maxlength : 300
                    },
                    cndfrmla : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                                return true;
                            }
                        }
                    }

                },
                messages : {
                    formlId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredFormlId ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeFormlId )
                    },
                    formlKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredFormlKorNm ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeFormlKorNm )
                    },
                    formlEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredFormlEngNm ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeFormlEngNm )
                    },
                    formlDesc : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDetlDesc )
                    },
                    formlRefer : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeReferForml )
                    },
                    cndfrmla : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCndfrm )
                    }

                },
                submitHandler : function ( form )
                {
                    var $frmItemList = null;
                    var $divListWrap = $ ( '.operator_wrap' );

                    $frmItemList = $ ( 'div.operator_set', $divListWrap );

                    if ( $frmItemList.size () === 0 )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_validOperatorCreate,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                    } else
                    {
                        $.when (
                                $.customizeDialog ( {
                                    template : templates.dialog,
                                    message : !existFormlMastrSeq ? i18nMessage.msg_alertCreateConfirm
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

// 분류코드 중복 체크
function checkDuplicateFormlId ()
{

    var that = $ ( this );

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/calculation/duplicateFormlId.ajax',
        type : 'POST',
        data : {
            formlId : that.val ()
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {

            } else if ( json.status === staticVariable.jsonStatusError )
            {

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

$ ( function ()
{
    editBtn ();
    customizeForm ();
    customizeScroll ();
    addFormlDetlInfo ();
    updateFormlDetlInfo ();
    deleteFormlDetlInfo ();
    resetItemBtn ();
    operatorBtn ();
    formlMastrInfoInitialization ();
    formlMastrValidate ();
} );