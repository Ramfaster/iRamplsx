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
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// treemenu customize
function customizeTree ()
{
    var setting = {
        view : {
            showIcon : false
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
        callback : {

            beforeClick : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var selectedNodes = zTree.getSelectedNodes ();
                if ( selectedNodes.length > 0 && selectedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    if ( treeNode.chkDisabled )
                    {
                        return false;
                    } else
                    {
                        zTree.checkNode ( treeNode, true, true );

                        showTreeLocation ( zTree, treeNode );
                    }
                }
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 && checkedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    zTree.selectNode ( treeNode );

                    showTreeLocation ( zTree, treeNode );
                }
            }
        }
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/cmmncd/selectCmmnCdTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            clCd : paramClCd,
            cdId : paramCdId,
            enableRoot : true,
            chkDisabled : true
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // console.log ( json.data );

                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                // chkDisabled가 true 되어 있는 상태에서는 node정보를 가져올 수 없으므로 false, true 처리
                setAllTreeNodeChkDisabled ( zTree, nodes, false );

                addTreeNode ( zTree );
                var checkedNodes = zTree.getCheckedNodes ( true );
                setAllTreeNodeChkDisabled ( zTree, nodes, true );

                if ( checkedNodes.length > 0 )
                {

                    var temp = checkedNodes[0];
                    for ( var i = 1; i < checkedNodes.length; i++ )
                    {
                        if ( temp.level < checkedNodes[i].level )
                        {
                            temp = checkedNodes[i];
                        }

                    }
                    zTree.selectNode ( temp );
                    showTreeLocation ( zTree, temp );
                    setAllTreeNodeChkDisabled ( zTree, nodes, true );
                } else if ( checkedNodes.length === 0 )
                {
                    var node = zTree.getNodeByParam ( 'id', paramClCd );

                    zTree.selectNode ( node );
                    zTree.checkNode ( node, true, true );
                    showTreeLocation ( zTree, node );
                }
                customizeScroll ();
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

// 트리 location 표시
function showTreeLocation ( zTree, treeNode )
{
    var separateChar = '<i class="icon_gt"></i>';
    var nodeName = getHierarchyTreeNodeName ( zTree, treeNode, separateChar );
    $ ( '#tree_location' ).html ( nodeName !== null ? nodeName + separateChar + treeNode.name : treeNode.name );

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

// 모든 트리 노드 enable/disable 처리
function setAllTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        zTree.setChkDisabled ( nodes[i], disabled );
    }
}
// 분류코드 중복 체크
function checkDuplicateClCd ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#clCd' ).blur ( function ()
    {
        var that = $ ( this );
        var $idCheck = $ ( '.id_check' );
        var $duplicationFlag = $ ( '#duplication_flag' );

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/cmmncd/duplicateCmmnClCd.ajax',
            type : 'POST',
            data : {
                clCd : that.val ()
            },
            dataType : 'json',
            success : function ( json )
            {
                var $td = that.closest ( 'td' );

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
                            id : 'clCd',
                            message : json.message,
                            isLeft : false
                        } );

                        $td.append ( html );
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

// 공통분류코드 정보 유효성 체크
function cmmnClCdValidate ()
{
    $.validator.addMethod ( "range", function ( value, element )
    {
        var clWd = $ ( '#clWdGnrlz' ).val ();
        var clNum = $ ( '#clNumGnrlz' ).val ();
        var sum = parseInt ( clWd, 10 ) + parseInt ( clNum, 10 );

        if ( isNaN ( sum ) )
        {
            sum = parseInt ( 0, 10 );
        }

        return this.optional ( element ) || sum < 11;

    }, makeValidateMessage ( i18nMessage.msg_validSumLengthCmmnClCd ) );

    $ ( '#cmmnClCdMgtForm' ).validate (
            {
                // onsubmit : false,
                rules : {
                    clCdKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    clCdEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    clWdGnrlz : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        number : true,
                        // range : [ 1, 6 ]
                        range : true

                    },
                    clNumGnrlz : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        number : true,
                        // range : [ 1, 4 ]
                        range : true
                    },
                    clCdDesc : {
                        maxlength : 300
                    }
                },
                messages : {
                    clCdKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCmmnClCdKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCmmnClCdKoreanName )
                    },
                    clCdEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCmmnClCdEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCmmnClCdEnglishName )
                    },
                    clWdGnrlz : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCmmnClCdclwdGnrlz ),
                        number : makeValidateMessage ( i18nMessage.msg_validNumberCmmnClCdclwdGnrlz )
                    },
                    clNumGnrlz : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCmmnClCdclnumGnrlz ),
                        number : makeValidateMessage ( i18nMessage.msg_validNumberCmmnClCdclnumGnrlz )
                    },
                    clCdDesc : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDescription )
                    }
                },
                submitHandler : function ( form )
                {
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

// 공통코드 정보 유효성 체크
function cmmnCdValidate ()
{
    $.validator.addMethod ( "cdwdlength", function ( value, element )
    {
        var cdId = $.trim ( value );
        var cdString = cdId.replace ( /[^a-zA-Z]+/g, '' );
        return this.optional ( element ) || cdString.length === parseInt ( parmClWdGnrlz, 10 );
    }, makeValidateMessage ( cdWdmessage ) );

    $.validator.addMethod ( "cdwdenglish", function ( value, element )
    {
        var cdId = $.trim ( value );
        var cdString = cdId.substring ( 0, parseInt ( parmClWdGnrlz, 10 ) );

        if ( parmClWdGnrlz == 0 )
        {
            result = 0;
        } else
        {
            if ( /^[a-z]+$/i.test ( cdString ) )
            {
                result = 0;
            } else
            {
                result = 1;
            }
        }

        return this.optional ( element ) || result == 0;

    }, makeValidateMessage ( cdWdEngmessage ) );

    $.validator.addMethod ( "cdnumcheck", function ( value, element )
    {
        var cdId = $.trim ( value );
        var cdString = cdId.replace ( /[^a-zA-Z]+/g, '' );
        var cdNumber = cdId.replace ( cdString, '' );
        cdId = cdId.substring ( cdId.length - parseInt ( parmClNumGnrlz, 10 ), cdId.length );
        return this.optional ( element ) || cdId === valiCdName;
    }, makeValidateMessage ( cdNummessage ) );

    $.validator.addMethod ( "cdnumzero", function ( value, element )
    {
        var cdId = $.trim ( value );
        var cdString = cdId.replace ( /[^a-zA-Z]+/g, '' );
        var cdNumber = cdId.replace ( cdString, '' );
        var result = null;

        if ( parmClNumGnrlz == 0 )
        {
            if ( cdNumber == '' )
            {
                result = 0;
            } else
            {
                result = 1;
            }
        } else
        {
            result = 0;
        }

        return this.optional ( element ) || result == 0;
    }, makeValidateMessage ( i18nMessage.msg_validAlpahOnly ) );

    $.validator.addMethod ( "cdengzero", function ( value, element )
    {
        var cdId = $.trim ( value );
        var cdString = cdId.replace ( /[^a-zA-Z]+/g, '' );
        var cdNumber = cdId.replace ( cdString, '' );
        var result = null;

        if ( parmClWdGnrlz == 0 )
        {
            if ( cdString == '' )
            {
                result = 0;
            } else
            {
                result = 1;
            }
        } else
        {
            result = 0;
        }

        return this.optional ( element ) || result == 0;
    }, makeValidateMessage ( i18nMessage.msg_validCodeNumOnly ) );

    $ ( '#cmmnCdMgtForm' ).validate (
            {

                // onsubmit : false,
                rules : {
                    cdId : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                                return true;
                            }
                        },
                        maxlength : 10,
                        cdnumzero : true,
                        cdengzero : true,
                        cdwdenglish : true,
                        cdwdlength : true,
                        cdnumcheck : true
                    },
                    cdKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    cdEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    cdVal : {
                        maxlength : 20
                    },
                    cdItem1 : {
                        maxlength : 20
                    },
                    cdItem2 : {
                        maxlength : 20
                    },
                    cdItem3 : {
                        maxlength : 20
                    },
                    cdDesc : {
                        maxlength : 300
                    }
                },
                messages : {
                    cdId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCode ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCode )
                    // ,
                    // cdwdlength : makeValidateMessage ( cdWdmessage ),
                    // cdnumlength : makeValidateMessage ( cdNummessage )
                    },
                    cdKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCmmnCdKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCmmnCdKoreanName )
                    },
                    cdEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCmmnCdEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCmmnCdEnglishName )
                    },
                    cdVal : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCmmnCdVal )
                    },
                    cdItem1 : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCmmnCdItem1 )
                    },
                    cdItem2 : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCmmnCdItem2 )
                    },
                    cdItem3 : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCmmnCdItem3 )
                    },
                    cdDesc : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDescription )
                    }
                },
                submitHandler : function ( form )
                {
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
                    // }
                }
            } );
}

// 신규 등록 시 새 항목 노드 추가
function addTreeNode ( zTree )
{
    if ( (paramCdId === null || paramCdId === '') && paramParntsCdId !== null )
    {
        var parentNode = zTree.getNodeByParam ( 'id', paramClCd );

        if ( parentNode !== null )
        {
            var checkedNodes = zTree.getCheckedNodes ( true );
            if ( checkedNodes.length > 0 )
            {
                zTree.checkNode ( checkedNodes[0], false, false );
            }

            zTree.addNodes ( parentNode, {
                name : i18nMessage.msg_itemNew,
                checked : true
            } );
        }
    }
}

// 공통코드 정보 초기화(등록 화면)
function cmmnCdInitialization ()
{
    $ ( '#btn_reset' ).click ( function ()
    {
        $ ( 'form' ).each ( function ()
        {
            this.reset ();
            $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
        } );

        $ ( 'label.error' ).remove ();
        $ ( '.frm_type' ).removeClass ( 'error' );
        $ ( '.customize_radio' ).trigger ( 'change' );
    } );

}

$ ( function ()
{
    customizeTree ();
    customizeForm ();

    // checkDuplicateClCd ();
    cmmnClCdValidate ();
    cmmnCdValidate ();
    cmmnCdInitialization ();
} );