// form element customize
function download_toggle ()
{
    $ ( '.down_item' ).click ( function ()
    {
        $ ( this ).parents ( 'tr' ).next ( '.download_box' ).toggle ();
    } )

    $ ( '.btn_close' ).click ( function ()
    {
        $ ( this ).parents ( 'tr.download_box' ).hide ();
    } )
}

function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $dateType = $ ( '#spcId,.sel_type' ).customizeSelect ( {
        width : 370,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select09',
        focusClass : 'custom-form-focused09',
        disableClass : 'custom-form-disabled09'
    } );

    var $dateType2 = $ ( '#crncyCdVal,#fnncAgenyCd,.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $dateType = $ ( '#sel_type1' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $searchType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
    } );

    $ ( '#tblInsertData01 .files' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25
    } );
    $ ( '#divNewRepay .files' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25
    } );

    $ ( '.sel_type_file' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

    $ ( "#lonTotAmt" ).on ( 'change', function ()
    {
        if ( $ ( this ).val () !== '' )
        {
            $ ( this ).val ( homUtil.mathFloorComma ( $ ( this ).val (), staticVariable.decimalPoint ) );
        }
    } );
    if ( staticVariable.methodUpdate == paramMethod )
    {
        // TODO 포커스 처리....
        $ ( "#newRepyAmount" ).on (
                'blur',
                function ()
                {
                    var $that = $ ( this );
                    if ( $that.val () !== '' )
                    {
                        var newRepyAmount = parseFloat ( $that.val () );

                        var totalRepyAmount = 0;
                        $ ( '.trDetlLonRepyInfo' ).find ( '.repyAmount' ).each ( function ()
                        {
                            totalRepyAmount += parseFloat ( homUtil.removeNumberComma ( $ ( this ).text () ) );
                        } );

                        // 입력받은 상환 금액과 상환금액들의 합이 총 대출 상환액 보다 클 경우
                        if ( newRepyAmount + totalRepyAmount > parseFloat ( homUtil.removeNumberComma ( $ (
                                '#lonTotAmt' ).val () ) ) )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_alertAssetOverRepayFund,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo,
                                focusTargetAfterClose : $that
                            } )
                        } else
                        {
                            // 값 설정...
                            $that.val ( homUtil.mathFloorComma ( newRepyAmount, staticVariable.decimalPoint ) );
                        }
                    }
                } ).on ( 'focus', function ()
        {
            var $that = $ ( this );
            if ( $that.val () !== '' && $that.val () !== '-' )
            {
                var data = homUtil.removeNumberComma ( $that.val () );

                if ( $.isNumeric ( data ) )
                {
                    $that.val ( data );
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertOnlyNumber,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        } );

        $ ( "#newOdrSeq" ).on ( 'change', function ()
        {
            var $that = $ ( this );
            if ( $that.val () !== '' )
            {
                $that.val ( homUtil.mathFloorComma ( $that.val (), 0 ) );
            }
        } );

        var $divNewRepay = $ ( "#divNewRepay" );
        var $btnNewLonCls = $ ( "#btnNewLonCls" );
        var $btnNewLonAdd = $ ( "#btnNewLonAdd" );
        var $newRepyDt = $ ( "#newRepyDt" );
        var $newRepyAmount = $ ( "#newRepyAmount" );

        $divNewRepay.hide ();
        $btnNewLonCls.hide ();
        $btnNewLonAdd.on ( 'click', function ()
        {
            $divNewRepay.show ();
            $btnNewLonCls.show ();
            $btnNewLonAdd.hide ();
        } );
        $btnNewLonCls.on ( 'click', function ()
        {
            $divNewRepay.hide ();
            $btnNewLonCls.hide ();
            $btnNewLonAdd.show ();
            $newRepyDt.val ( '' );
            $newRepyAmount.val ( '' );
        } );
    }
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

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.frm_con02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// 법인별 운용사 가져오기
function loadBundle ()
{

    var xxSpcId = $ ( ':selected', $ ( '#spcId' ) ).val ();
    var params = {
        spcId : xxSpcId
    };
    spcId = xxSpcId;
    if ( xxSpcId != "" )
    {
        var $lrgeBundle = $ ( "#lrgeBundle" );
        $.ajax ( {
            url : contextPath + '/hom/asset/companyRepayFund/selectBundle.ajax',
            type : 'GET',
            data : params,
            dataType : 'json',
            async : false,
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( json.data != null )
                    {
                        $lrgeBundle.val ( json.data.lrgeBundle );
                    } else
                    {
                        $lrgeBundle.val ( '' );
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
}

// 법인별 통화단위 정보 가져오기
function getSpcUnitInfo ()
{
    var $spcId = $ ( '#spcId' );
    var $crncyUnit = $ ( '#crncyUnit' );
    var tpl = getTemplate ( templates.spcUnit );

    $spcId.on ( 'change', function ( event )
    {
        loadBundle ();

        spcId = $ ( ':selected', $ ( this ) ).val ();

        var params = {
            spcId : spcId
        };

        if ( spcId != "" )
        {
            $.ajax ( {
                url : contextPath + '/hom/asset/companyRepayFund/selectSpcUnitList.ajax',
                type : 'POST',
                data : params,
                dataType : 'json',
                async : false,
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        if ( tpl !== null )
                        {
                            var template = _.template ( tpl );
                            var html = template ( {
                                lang : lang,
                                locale : locale,
                                msg_selection : i18nMessage.msg_selection,
                                spcUnitList : json.data
                            } );

                            $crncyUnit.empty ().html ( html ).trigger ( 'change' );

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
                    getSpcExistItemCheck ();
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
    } );
}

function getSpcExistItemCheck ()
{
    if ( staticVariable.methodInsert == paramMethod )
    {
        var xxSpcId = $ ( ':selected', $ ( '#spcId' ) ).val ();
        var params = {
            spcId : xxSpcId,
            rows : 99999,
            page : 1,
            sidx : 'spcNm',
            sord : 'asc'
        };

        if ( xxSpcId != "" )
        {
            $.ajax ( {
                url : contextPath + '/hom/asset/companyRepayFund/list.ajax',
                type : 'POST',
                data : params,
                dataType : 'json',
                async : false,
                success : function ( json )
                {
                    if ( json.rows != null )
                    {
                        existItemCnt = Object.keys ( json.rows ).length;
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

    }
}

// 사용자 정보 초기화(등록 화면)
function fundInitialization ()
{
    if ( !existSpcId )
    {
        $ ( '#btn_reset' ).click ( function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
            } );

            $ ( '#spcId' ).each ( function ()
            {
                if ( $ ( this ).val () !== '' )
                {
                    $ ( this ).remove ();
                }
            } );

            $ ( '.delete_file' ).closest ( 'li' ).remove ();
            $ ( '.sel_type' ).trigger ( 'change' );
            $ ( '.customize_select_m' ).trigger ( 'change' );
            $ ( '.frm_type' ).removeClass ( 'error' );
            $ ( "[id$=error]" ).remove ();

        } );
    }
}

// Form submit
function submitInitialization ()
{
    // $ ( '#btn_submit' ).click ( function ()
    // {
    // $ ( '#spcId' ).removeAttr ( 'disabled' );
    // fundValidate ();
    // // $ ( 'form' ).submit ();
    // } );
}

// 유효성 체크
function fundValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#userForm' ).validate ( {
        rules : {
            lonKorNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            lonEngNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            lonEnggDt : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                date : true
            },
            frstDrtDt : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                date : true
            },
            lonTotAmt : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                number : true
            },
            newRepyAmount : {
                number : true
            },
            spcId : {
                selectRequired : true
            }
        },
        messages : {
            lonKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validAssetLoanKo ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeAssetLoanKo )
            },
            lonEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validAssetLoanEn ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeAssetLoanEn )
            },
            lonEnggDt : {
                required : makeValidateMessage ( i18nMessage.msg_validDataRequiredAssetLoanRepay )
            },
            frstDrtDt : {
                required : makeValidateMessage ( i18nMessage.msg_validDataRequiredAssetLoanWithdraw )
            },
            newRepyAmount : {
                number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
            },
            lonTotAmt : {
                required : makeValidateMessage ( i18nMessage.msg_validAssetLoanSum ),
                number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
            },
            spcId : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredAssetSpcName )
            }
        },
        submitHandler : function ( form )
        {
            if ( existItemCnt > 0 )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertDataExists,
                    checkText : i18nMessage.msg_ok,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {

                // 문서 파일 타입, file 선택여부
                var $addFileList = $ ( '.add_file_list' );
                var $addFileListLi = $ ( 'li', $addFileList );
                var fileFlag = false;
                _.each ( $addFileListLi, function ( li )
                {
                    var $li = $ ( li );
                    var $selTypeFile = $li.find ( '.sel_type_file' );
                    var $customizeFile = $li.find ( '.customizeFile' );

                    if ( $selTypeFile.val () === '' && $customizeFile.val () !== '' )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_validDataRequiredAttachedFileKind,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );

                        fileFlag = true;
                        return true;
                    } else if ( $selTypeFile.val () !== '' && $customizeFile.val () === '' )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_validDataRequiredAttachedFile,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );

                        fileFlag = true;
                        return true;
                    }
                } );

                if ( fileFlag )
                {
                    return;
                }

                // if($("newRepyDt")){}
                $.when ( $.customizeDialog ( {
                    template : templates.dialog,
                    message : !existSpcId ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeConfirm
                } ) ).then ( function ( confirm )
                {
                    if ( confirm )
                    {
                        $ ( "#spcId" ).attr ( 'disabled', false );
                        form.submit ();
                    }
                } );
            }
        }
    } );
}

// 첨부파일 input 추가
function addFileInput ()
{
    var fileCount = 5;
    var liTpl = getTemplate ( templates.inputFileLi );
    var $addFile = $ ( '#tblInsertData01 #add_file' );
    var disableFlag = false;
    var $selTypeFile = $ ( '#tblInsertData01 .sel_type_file' );

    if ( !disableFlag )
    {
        $addFile.click ( function ()
        {
            var liCount = $ ( '#tblInsertData01 .add_file_list li' ).size ();
            var $addFileList = $ ( '#tblInsertData01 .add_file_list' );
            var $fileList = $ ( '#tblInsertData01 .file_list li' );

            if ( liCount < fileCount - $fileList.size () )
            {
                liCount++;
                if ( liCount == fileCount - $fileList.size () )
                {
                    disableFlag = true;
                    $addFile.addClass ( 'dis' );
                }

                var template = _.template ( liTpl );
                var html = template ( {
                    fileNo : liCount,
                    selTypeHtml : $selTypeFile.html ()
                } );

                $addFileList.append ( html );

                customizeForm ();
                customizeScroll ();

                deleteFileInput ();
                checkFileSize ();

                if ( staticVariable.methodUpdate == paramMethod )
                {
                    $ ( "#divNewRepay" ).show ();
                    $ ( "#btnNewLonCls" ).show ();
                }

            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validFileInputNumberDown,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }

        } );
    }
}
function addFileInput2 ()
{
    var fileCount = 5;
    var liTpl = getTemplate ( templates.companyRepayFundInputFileLi );
    var $addFile = $ ( '#divNewRepay #add_file_new' );
    var disableFlag = false;
    var $selTypeFile = $ ( '#divNewRepay .sel_type_file' );

    if ( !disableFlag )
    {
        $addFile.click ( function ()
        {
            var liCount = $ ( '#divNewRepay .add_file_list li' ).size ();
            var $addFileList = $ ( '#divNewRepay .add_file_list' );
            var $fileList = $ ( '#divNewRepay .file_list li' );

            if ( liCount < fileCount - $fileList.size () )
            {
                liCount++;
                if ( liCount == fileCount - $fileList.size () )
                {
                    disableFlag = true;
                    $addFile.addClass ( 'dis' );
                }

                var template = _.template ( liTpl );
                var html = template ( {
                    fileNo : liCount,
                    selTypeHtml : $selTypeFile.html ()
                } );

                $addFileList.append ( html );

                customizeForm ();
                customizeScroll ();

                deleteFileInput2 ();
                checkFileSize ();

                if ( staticVariable.methodUpdate == paramMethod )
                {
                    $ ( "#divNewRepay" ).show ();
                    $ ( "#btnNewLonCls" ).show ();
                }

            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validFileInputNumberDown,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }

        } );
    }
}

// 첨부파일 input 삭제
function deleteFileInput ()
{
    var $deleteFile = $ ( '#tblInsertData01 .delete_file' );
    $deleteFile.unbind ( 'click' );
    $deleteFile.click ( function ()
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
                that.closest ( 'li' ).remove ();

                var $addFile = $ ( '#add_file' );
                $addFile.removeClass ( 'dis' );
            }
        } );
    } );

}
function deleteFileInput2 ()
{
    var $deleteFile = $ ( '#divNewRepay .delete_file' );
    $deleteFile.unbind ( 'click' );
    $deleteFile.click ( function ()
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
                that.closest ( 'li' ).remove ();

                var $addFile = $ ( '#divNewRepay #add_file_new' );
                $addFile.removeClass ( 'dis' );
            }
        } );
    } );

}

// 파일 제거
function deleteFile ()
{
    var tpl = getTemplate ( templates.labelError );
    var $btnFileDelete = $ ( '.btn_file_delete' );

    // $btnFileDelete.unbind ( 'click' );
    $btnFileDelete.click ( function ()
    {
        var $that = $ ( this );

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
                var $li = $that.closest ( 'li' );
                $.ajax ( {
                    url : $that.attr ( 'href' ),
                    type : 'GET',
                    dataType : 'json',
                    async : false,
                    success : function ( json )
                    {
                        var $li = $that.closest ( 'li' );
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {
                            $li.remove ();
                            $li.find ( 'label' ).remove ();
                        } else if ( json.status === staticVariable.jsonStatusError )
                        {
                            $li.find ( 'label' ).remove ();

                            if ( tpl !== null )
                            {
                                var template = _.template ( tpl );
                                var html = template ( {
                                    id : 'file_delete',
                                    message : json.message,
                                    isLeft : false
                                } );
                                $li.append ( html );
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
            }
        } );

        return false;
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
        if ( !homUtil.checkFileExtension ( that.files[0].name, homUtil.fileExtensionFormat.general ) )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : homUtil.fileExtensionFormat.general + i18nMessage.msg_validDataRequiredAttachedFileKind,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        return flag;
    } );
}

// 대출 상환 내역 삭제
function fnDeleteLonRepyOdrInfo ( seq, idx )
{
    var $that = $ ( this );

    $.when ( $.customizeDialog ( {
        template : templates.dialog,
        message : i18nMessage.msg_alertDeleteConfirm,
        checkText : i18nMessage.msg_ok,
        cancelText : i18nMessage.msg_cancel,
        type : staticVariable.dialogTypeConfirm
    } ) ).then (
            function ( confirm )
            {
                if ( confirm )
                {

                    var xxSpcId = $ ( ':selected', $ ( '#spcId' ) ).val ();
                    var params = {
                        spcId : xxSpcId,
                        odrSeq : seq
                    };
                    if ( xxSpcId != "" )
                    {
                        $.ajax ( {
                            url : contextPath + '/hom/asset/companyRepayFund/deleteLonRepyOdrInfo.ajax',
                            type : 'GET',
                            data : params,
                            dataType : 'json',
                            async : true,
                            success : function ( json )
                            {
                                if ( json.status === staticVariable.jsonStatusSuccess )
                                {
                                    // 총 대출 상환 비율 및 총 대출 상환액 갱신..
                                    var total = 0;
                                    $ ( '.repyAmount' ).each ( function ( index, amount )
                                    {
                                        var $amount = $ ( amount );
                                        var data = homUtil.removeNumberComma ( $amount.text () );
                                        if ( $.isNumeric ( data ) )
                                        {
                                            total += parseFloat ( data );
                                        }
                                    } );
                                    var totalLoan = homUtil.removeNumberComma ( $ ( '#lonTotAmt' ).val () );
                                    if ( $.isNumeric ( totalLoan ) )
                                    {
                                        totalLoan = parseFloat ( totalLoan );
                                        $ ( '#modtotalRate' ).val (
                                                homUtil.mathFloorComma ( total / totalLoan * 100,
                                                        staticVariable.decimalPoint ) );
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

                    var $modTotalRepay = $ ( "#modTotalRepay" );
                    // modTotalRepay
                    var xxTotalRepay = parseFloat ( $modTotalRepay.val ().replace ( /,/gi, '' ) );
                    // alert ( xxTotalRepay );
                    xxTotalRepay = xxTotalRepay
                            - parseFloat ( $ ( "#trDetlLonRepyInfo" + idx ).children ( 'td' ).eq ( 2 ).text ().replace (
                                    /,/gi, '' ) );
                    // alert ( xxTotalRepay );
                    $modTotalRepay.val ( homUtil.mathFloorComma ( xxTotalRepay, staticVariable.decimalPoint ) );

                    $ ( "#trDetlLonRepyInfo" + idx ).remove ();
                    var xxidx = 1;
                    $ ( ".trDetlLonRepyInfo" ).each ( function ()
                    {
                        // var rows = $ ( ".tdGubunPvIdNm02:contains('" + $ ( this ).text () + "')" );
                        $ ( this ).children ( 'td' ).eq ( 0 ).text ( xxidx )
                        xxidx++;

                    } );
                    $ ( "#newOdrSeq" ).val ( parseInt ( $ ( "#newOdrSeq" ).val () - 1 ) );
                }
            } );
}

$ ( function ()
{
    customizeForm ();
    fundValidate ();
    customizeScroll ();
    // customizeJqgrid ();
    download_toggle ();
    initDatetimepicker ();
    fundInitialization ();
    submitInitialization ();
    getSpcUnitInfo ();

    addFileInput ();
    deleteFileInput ();
    addFileInput2 ();
    deleteFileInput2 ();

    deleteFile ();

    if ( staticVariable.methodUpdate == paramMethod )
    {
        $ ( "#lonTotAmt" ).trigger ( 'change' );
    }
} );