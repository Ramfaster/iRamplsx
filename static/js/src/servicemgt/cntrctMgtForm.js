// form element customize
function customizeForm ()
{
    var $searchType2 = $ ( '.customize_select_s' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );
}

function fileCustomizeForm ()
{
    var $selType3 = $ ( '.sel_type_file' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

    $ ( '.files' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 230,
        height : 25
    } );
}
// init datetimepicker
function initDatetimepicker ()
{
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
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.frm_con01 .frm_cont_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// treemenu customize
function customizeTree ()
{
    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            treeType : staticVariable.treeTypeNationPv
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                initTree ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNodes = zTree.getCheckedNodes ( true );
                // check 처리 및 위 상단 헤더 부분 처리
                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                }

                setNoChildTreeNodeChkDisabled ( zTree, nodes, true );

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

function initTree ( data )
{
    // 트리메뉴
    var setting = {
        view : {
            // addHoverDom : addHoverDom,
            // removeHoverDom : removeHoverDom,
            selectedMulti : false
        },
        check : {
            enable : true,
            chkStyle : 'radio',
            radioType : 'all',
            chkDisabled : true
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        view : {
            showIcon : false
        },
        callback : {
            beforeClick : function beforeClick ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                zTree.checkNode ( treeNode, true, true );

                moveListPage ( treeNode );
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                zTree.selectNode ( treeNode );

                moveListPage ( treeNode );
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );

    var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
    var nodes = zTree.transformToArray ( zTree.getNodes () );

    var checkedNodes = zTree.getCheckedNodes ( true );

    $.each ( nodes, function ( i, node )
    {
        if ( node.id === paramPvId )
        {
            node.checked = true;
            zTree.refresh ();

            return false;
        }
    } );
}

// 해당 리스트 페이지로 이동
function moveListPage ( treeNode )
{
    if ( !treeNode.isParent )
    {
        location.href = contextPath + '/hom/servicemgt/contract/list.do?pvId=' + treeNode.id;
    }
}

// 제일 상위 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        if ( nodes[i].pId == null || typeof nodes[i].pId === 'undefined' )
        {
            zTree.setChkDisabled ( nodes[i], true );
        }
    }
}

function showTreeLocation ( zTree, treeNode )
{
    var separateChar = '<i class="icon_gt"></i>';
    var nodeName = getHierarchyTreeNodeName ( zTree, treeNode, separateChar );
    var ctrctCdNm = separateChar;
    if ( paramCntrctTyCdNm !== null && paramCntrctTyCdNm !== '' )
    {
        ctrctCdNm += paramCntrctTyCdNm;
    } else
    {
        ctrctCdNm += i18nMessage.msg_newRegister;
    }

    if ( nodeName !== null )
    {
        nodeName += separateChar + treeNode.name + ctrctCdNm;
    } else
    {
        nodeName = treeNode.name + ctrctCdNm;
    }
    $ ( '#tree_location' ).html ( nodeName );
}

// 트리 계층 노드 이름 조회
function getHierarchyTreeNodeName ( zTree, treeNode, separateChar )
{
    var node = zTree.getNodeByParam ( 'id', treeNode.pId );

    if ( node !== null && node.pId !== null )
    {
        return getHierarchyTreeNodeName ( zTree, node, separateChar ) + separateChar + node.name;
    } else if ( node !== null && node.pId === null )
    {
        return node.name;
    } else
    {
        return null;
    }
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
    $deleteFile.on ( 'click', function ()
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

// 계약 관리 유효성 체크
function cntrctValidate ()
{
    $ ( '#cntrctMgtForm' ).validate (
            {
                rules : {
                    cntrctTyCd : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    cnsgnTyCd : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    cnsgnCorprId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    trustCorprId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        }
                    },
                    cntrctBeginDt : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        date : true
                    },
                    cntrctTrmnatDt : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        date : true
                    }
                },
                messages : {
                    cntrctTyCd : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredContractType )
                    },
                    cnsgnTyCd : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredConsignorType )
                    },
                    cnsgnCorprId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredConsignor )
                    },
                    trustCorprId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTrustee )
                    },
                    cntrctBeginDt : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredContractBeginDate ),
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidContractBeginDate )
                    },
                    cntrctTrmnatDt : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredContractTerminationDate ),
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidContractTerminationDate ),
                    }
                },
                submitHandler : function ( form )
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

                    // 계약 기간 유효성 체크
                    var cntrctBeginDt = $ ( '#cntrctBeginDt' ).val ();
                    var cntrctTrmnatDt = $ ( '#cntrctTrmnatDt' ).val ();
                    if ( !homUtil.fromToDateValidate ( cntrctBeginDt, cntrctTrmnatDt, homConstants.dateTypeYYYYMMDD ) )
                    {
                        return;
                    }

                    // 계약유형과 위탁 업체 아이디가 같은것이 있는지 확인
                    // 등록일시 하나도 없어야한다.
                    var duplFlag = null;
                    var cntrctTyCd = $ ( '#cntrctTyCd' ).val ();
                    var cnsgnCorprId = $ ( '#cnsgnCorprId' ).val ();
                    var trustCorprId = $ ( '#trustCorprId' ).val ();
                    if ( method === staticVariable.methodInsert )
                    {
                        duplFlag = checkDuplicateCntrctMgt ( cntrctTyCd, cnsgnCorprId, trustCorprId );
                    }
                    // 수정일시 계약 유형과 수탁자 아이디가 변경 되었는지 체크한후 변경 되었다면 중복되는것이 잇는지 체크해야한다.
                    else
                    {
                        var $cntrctTyCdHidden = $ ( '#cntrctTyCdHidden' );
                        var $cnsgnCorprIdHidden = $ ( '#cnsgnCorprIdHidden' );
                        var $trustCorprIdHidden = $ ( '#trustCorprIdHidden' );
                        if ( $cntrctTyCdHidden.val () !== cntrctTyCd || $cnsgnCorprIdHidden.val () !== cnsgnCorprId
                                || $trustCorprIdHidden.val () !== trustCorprId )
                        {
                            duplFlag = checkDuplicateCntrctMgt ( cntrctTyCd, cnsgnCorprId, trustCorprId );
                        }
                    }

                    if ( duplFlag )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertDuplicateData,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                        return;
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

// 계약 관리 초기화(등록 화면)
function cntrctMgtInitialization ()
{
    if ( method === staticVariable.methodInsert )
    {
        $ ( '#btn_reset' ).on ( 'click', function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' ).trigger ( 'change' );
            } );
            $ ( 'label.error' ).remove ();
        } );
    }
}

// 위탁자 유형에 따라 위탁자를 가져옴
function getCnsgnCorpr ()
{
    var $cnsgnTyCd = $ ( '#cnsgnTyCd' );
    var $cnsgnCorprId = $ ( '#cnsgnCorprId' );
    var tpl = getTemplate ( templates.cnsgnCorprOption );
    $cnsgnTyCd.on ( 'change', function ()
    {
        var params = {
            pvId : paramPvId,
            cnsgnTyCd : $ ( ':selected', $ ( this ) ).val ()
        };
        $.ajax ( {
            url : contextPath + '/hom/servicemgt/contract/selectCnsgnCorprList.ajax',
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
                            data : json.data
                        } );

                        $cnsgnCorprId.empty ().html ( html ).trigger ( 'change' );
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

// 중복 되는 것이 있는지 없는지 체크
function checkDuplicateCntrctMgt ( cntrctTyCd, cnsgnCorprId, trustCorprId )
{
    var flag = false;
    var params = {
        pvId : paramPvId,
        cntrctTyCd : cntrctTyCd,
        cnsgnCorprId : cnsgnCorprId,
        trustCorprId : trustCorprId
    };

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/contract/checkDuplicateCntrctMgt.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                flag = json.data;

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

    return flag;
}

$ ( function ()
{
    customizeForm ();
    fileCustomizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    customizeTree ();
    checkFileSize ();
    addFileInput ();
    deleteFileInput ();
    cntrctValidate ();
    cntrctMgtInitialization ();
    getCnsgnCorpr ();
    deleteFile ();
} );