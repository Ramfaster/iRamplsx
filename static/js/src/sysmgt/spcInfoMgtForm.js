// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    // 사용자 정보
    var $selType = $ ( '.sel3_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    // SPC 지역선택
    var $nationId = $ ( '#nationId' );
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

    var $areaId = $ ( '#areaId' );
    $areaId.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag2 = true;

    // select event
    $areaId.on ( 'select2:open', function ( e )
    {
        if ( flag2 )
        {
            mCustomScrollbar ();

            flag2 = false;
        }
    } );

}

// select 용 mCustomScrollbar
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

function fileCustomizeForm ()
{
    // custom form
    // $ ( '.files' ).customizeFile ( {
    // buttonType : 'bg_sprite',
    // buttonText : i18nMessage.msg_find,
    // buttonSpriteClass : 'btn_file01',
    // buttonTextColor : '#4c4743',
    // buttonWidth : 50,
    // textWidth : 280,
    // height : 25,
    // enableInitButton : true,
    // initButtonBackgroundImage : contextPath + '/css/lib/customizeForm/img/img_close_btn01.png'
    // } );

    $ ( '.files' ).customizeFile ( {
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
}

function fileCustomizeScroll ()
{
    // custom scroll
    $ ( '.scroll_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// init datetimepicker
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

    $ ( '.yyyymmddhh' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:00',
        startView : 2,
        minView : 1,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmddhhmi' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:ii',
        startView : 2,
        minView : 0,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        minuteStep : 2,
        todayHighlight : true,
        todayBtn : true
    } );

}

// SPC 정보 초기화(등록 화면)
function spcInitialization ()
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

            $ ( '#nationId, #areaId' ).trigger ( 'change.select2' );
            $ ( 'label.error' ).remove ();
            $ ( '#duplication_flag' ).val ( homConstants.checkN );
        } );
    }
}

// 국가별 지역정보 가져오기
function getSpcAreaInfo ( isKorean )
{
    var $nation = $ ( '#nationId' );
    var $area = $ ( '#areaId' );
    var tpl = getTemplate ( templates.areaInfoSelect );

    $nation.change ( function ( event )
    {
        var params = {
            nationId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/elcpwstn/selectAreaInfoList.ajax',
            type : 'POST',
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            message : i18nMessage.msg_selection,
                            isKorean : isKorean,
                            areaInfoList : json.data
                        } );

                        $area.empty ().html ( html ).trigger ( 'change' );
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
    } );
}

// 지분관계사 선택시 초기화
function changeEntrpsId ()
{
    var $entrpsId = $ ( '#entrpsId' ); // 업체 아이디
    var $qotaRt = $ ( '#qotaRt' ); // 지분율
    var $qotaAm = $ ( '#qotaAm' ); // 지분액
    $entrpsId.on ( 'change', function ()
    {
        $qotaRt.val ( '' );
        $qotaAm.val ( '' );
    } );
}

// 지분 관계 추가
function addQotaInfo ()
{
    var $btnQotaAdd = $ ( '#btn_qota_add' );
    var $entrpsId = $ ( '#entrpsId' ); // 업체 아이디
    var $qotaRt = $ ( '#qotaRt' ); // 지분율
    var $qotaAm = $ ( '#qotaAm' ); // 지분액

    var $qotaRelateList = $ ( '#qota_relate_list' ); // 지분관계사 리스트

    var qotaTblFrmTpl = getTemplate ( templates.qotaInfoTr );
    var liTpl = getTemplate ( templates.qotaInfoLi );

    $btnQotaAdd.click ( function ()
    {
        var $selectedEnterpsId = $ ( ':selected', $entrpsId );
        var checkFlag = false;
        var addFlag = false;

        // 지분 관계사 선택을 한 경우
        if ( $selectedEnterpsId.val () !== '' )
        {
            var $qotaTblFrm = $ ( '#qota_tbl_frm' );

            // 지분관계 항목 보여지는 markup이 없을 경우 생성
            if ( $qotaTblFrm.find ( 'tr' ).size () === 0 )
            {
                if ( qotaTblFrmTpl !== null )
                {
                    var template = _.template ( qotaTblFrmTpl );
                    var html = template ( {
                        message : i18nMessage.msg_qotaEntrpsSelect
                    } );

                    $qotaTblFrm.append ( html );
                    checkFlag = true;

                    // qotaCustomizeScroll ();
                }
            }

            // qota_relate_list에 li 추가
            $qotaRelateList = $ ( '#qota_relate_list' );
            $qotaRelateListLi = $ ( 'li', $qotaRelateList );
            if ( $qotaRelateListLi.size () !== 0 )
            {

            }

            // 이미 등록되어 있는 경우 판별
            _.each ( $qotaRelateListLi, function ( li )
            {
                if ( $ ( li ).data ( 'entrps-id' ) === $selectedEnterpsId.val () )
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
                    message : i18nMessage.msg_alertQotaEntrpsExist,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                var isCorrect = true;

                // 숫자만 넣었는지 판별
                if ( $qotaRt.val () !== '' )
                {
                    if ( !$.isNumeric ( $qotaRt.val () ) )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertOnlyNumber,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                        checkQotaSize ();
                        isCorrect = false;
                    } else if ( parseFloat ( $qotaRt.val () ) > 10000000 )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_validNumberIntegerLengthQotaRate,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                        checkQotaSize ();
                        isCorrect = false;
                    }

                } else if ( $qotaAm.val () !== '' )
                {
                    if ( !$.isNumeric ( $qotaAm.val () ) )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertOnlyNumber,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                        checkQotaSize ();
                        isCorrect = false;
                    } else if ( $qotaAm.val ().length > 30 )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_validNumberIntegerLengthQotaAmount,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                        checkQotaSize ();
                        isCorrect = false;
                    }
                }

                if ( isCorrect && liTpl !== null )
                {
                    var template = _.template ( liTpl );
                    var html = template ( {
                        homUtil : homUtil,
                        entrpsId : $selectedEnterpsId.val (),
                        corprKorNm : $selectedEnterpsId.text (),
                        qotaRt : $qotaRt.val () === '' ? 0 : $qotaRt.val (),
                        qotaAm : $qotaAm.val () === '' ? 0 : $qotaAm.val ()
                    } );

                    $qotaRelateList.append ( html );

                    deleteQotaInfo ();
                }
            }
        }
        // 지분 관계사 선택을 안한 경우
        else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertQotaEntrpsSelect,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// 지분관계 삭제
function deleteQotaInfo ()
{
    var $btnQotaDelete = $ ( '.btn_qota_delete' );

    $btnQotaDelete.unbind ( 'click' );
    $btnQotaDelete.click ( function ()
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

                checkQotaSize ();
            }
        } );
    } );
}

function checkQotaSize ()
{
    var $qotaRelateList = $ ( '#qota_relate_list' );
    var $qotaRelateListLi = $ ( 'li', $qotaRelateList );

    if ( $qotaRelateListLi.size () === 0 )
    {
        $ ( '#qota_tbl_frm tr' ).remove ();
    }
}

// 사용자 정보 유효성 체크
function spcValidate ()
{
    $ ( '#spcInfoMgtForm' ).validate (
            {
                errorPlacement : function ( error, element )
                {
                    var id = element.attr ( 'id' );
                    if ( id === 'spcKorNm' || id === 'spcEngNm' || id === 'spcCeoNm' || id === 'fondDt'
                            || id === 'bizrNo' || id === 'jurirNoregno' || id === 'nationId' || id === 'areaId'
                            || id === 'detlAddr' || id === 'totCapl' || id === 'bnkbNm' || id === 'bnkbNo' )
                    {
                        error.addClass ( 'mgl0' );
                    }
                    error.insertAfter ( element );
                },
                rules : {
                    spcId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 6,
                        minlength : 6
                    },
                    spcKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    spcEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    spcCeoNm : {
                        maxlength : 50
                    },
                    fondDt : {
                        date : true
                    },
                    bizrNo : {
                        maxlength : 30
                    },
                    jurirNoregno : {
                        maxlength : 30
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
                    detlAddr : {
                        maxlength : 300
                    },
                    pblStockTotCnt : {
                        maxlength : 10,
                        number : true
                    },
                    totCapl : {
                        maxlength : 30,
                        number : true
                    },
                    lrgeBundle : {
                        maxlength : 30
                    },
                    bnkbNm : {
                        maxlength : 50
                    },
                    bnkbNo : {
                        maxlength : 30
                    }
                },
                messages : {
                    spcId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredSpcId ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxWdLengthSpcId ),
                        minlength : makeValidateMessage ( i18nMessage.msg_validMaxWdLengthSpcId )
                    },
                    spcKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredSpcKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSpcKoreanName )
                    },
                    spcEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredSpcEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSpcEnglishName )
                    },
                    spcCeoNm : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSpcCeoName )
                    },
                    fondDt : {
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidSpcFoundationDate )
                    },
                    bizrNo : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeBusinessRegistrationNumber )
                    },
                    jurirNoregno : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeJuridicalRegistrationNumber )
                    },
                    nationId : {
                        required : makeValidateMessage ( i18nMessage.msg_validDataRequiredNation )
                    },
                    detlAddr : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSpcAddress )
                    },
                    pblStockTotCnt : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizePblstockTotalCount ),
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    totCapl : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTotalCapital ),
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    lrgeBundle : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeLargeBundle )
                    },
                    bnkbNm : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeBankBookName )
                    },
                    bnkbNo : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeBankBookNumber )
                    }
                },
                submitHandler : function ( form )
                {
                    // 중복 체크 여부
                    if ( method === staticVariable.methodInsert && $ ( '#duplication_flag' ).val () !== 'Y' )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertIdDuplicate,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );

                        return;
                    }

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

                    var $pblStockTotCnt = $ ( '#pblStockTotCnt' );
                    if ( $pblStockTotCnt.val () !== '' && $.isNumeric ( $pblStockTotCnt.val () ) )
                    {
                        var pblStockTotCnt = $pblStockTotCnt.val ().toString ();
                        if ( pblStockTotCnt.indexOf ( '.' ) >= 0 )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validNumberOnlyIntegerPblstockTotalCount,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            return;
                        }
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
                message : homUtil.fileExtensionFormat.general + i18nMessage.msg_validFileInputExtension,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        return flag;
    } );
}

// 첨부파일 input 추가
function addFileInput ()
{
    var fileCount = 10;
    var liTpl = getTemplate ( templates.inputFileLi );
    var $addFile = $ ( '#add_file' );
    var disableFlag = false;
    var $selTypeFile = $ ( '.sel_type_file' );

    if ( !disableFlag )
    {
        $addFile.click ( function ()
        {
            var liCount = $ ( '.add_file_list li' ).size ();
            var $addFileList = $ ( '.add_file_list' );
            var $fileList = $ ( '.file_list li' );

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

                fileCustomizeForm ();
                fileCustomizeScroll ();

                deleteFileInput ();
                checkFileSize ();
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
    var $deleteFile = $ ( '.delete_file' );
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

// 아이디 중복 체크
function checkDuplicationId ()
{
    var tpl = getTemplate ( contextPath + '/template/common/labelError.html' );

    $ ( '#spcId' ).blur ( function ()
    {
        var that = $ ( this );
        var $idCheck = $ ( '.id_check' );
        var $duplicationFlag = $ ( '#duplication_flag' );

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/spc/selectDuplicationId.ajax',
            type : 'POST',
            data : {
                spcId : that.val ()
            },
            dataType : 'json',
            success : function ( json )
            {
                var $td = $ ( '#spcId' ).closest ( 'td' );

                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    $td.find ( 'label' ).remove ();
                    $idCheck.removeClass ( 'dnone' );
                    $duplicationFlag.val ( homConstants.checkY );

                } else if ( json.status === staticVariable.jsonStatusError )
                {
                    $td.find ( 'label' ).remove ();
                    $idCheck.addClass ( 'dnone' );
                    $duplicationFlag.val ( homConstants.checkN );

                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            id : 'spcId',
                            message : json.message,
                            isLeft : false
                        } );

                        $td.append ( html );
                    }
                }
            },
            error : function ( xhr, textStatus, error )
            {
                if ( xhr.status === staticVariable.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : 'info'
                    } );
                }
            }
        } );
    } );
}

//custom scroll
function customizeScroll ()
{
    $ ( '.form_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    customizeForm ();
    fileCustomizeForm ();
    fileCustomizeScroll ();
    initDatetimepicker ();
    checkFileSize ();
    spcInitialization ();
    getSpcAreaInfo ( isKorean );
    changeEntrpsId ();
    addQotaInfo ();
    deleteQotaInfo ();
    addFileInput ();
    deleteFileInput ();
    deleteFile ();
    checkDuplicationId ();
    spcValidate ();
    customizeScroll ();
} );