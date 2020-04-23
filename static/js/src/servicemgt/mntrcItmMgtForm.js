var mntrcItmMgt = null;

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $imageType = $ ( '.image_type2' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );

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

    $ ( '.frm_con01 .frm_cont_wrap, .tbl_add_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

/**
 * 트리 초기화
 */
function getItmList ()
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

    if ( parmUriPath === staticVariable.aplctnSectnCdInspectionUri )
    {
        mntrcItmMgt.aplctnSectnCd = staticVariable.aplctnSectnCdInspection
    } else if ( parmUriPath === staticVariable.aplctnSectnCdRepairUri )
    {
        mntrcItmMgt.aplctnSectnCd = staticVariable.aplctnSectnCdRepair
    } else
    {
        mntrcItmMgt.aplctnSectnCd = staticVariable.aplctnSectnCdIncident
    }

    var params = {
        treeType : staticVariable.treeTypeStandartItem,
        eqmtId : mntrcItmMgt.itemId,
        pvId : mntrcItmMgt.pvId,
        aplctnSectnCd : mntrcItmMgt.aplctnSectnCd
    };

    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                // chkDisabled가 true 되어 있는 상태에서는 node정보를 가져올 수 없으므로 false, true 처리
                setAllTreeNodeChkDisabled ( zTree, nodes, false );

                addTreeNode ( zTree )

                var checkedNodes = zTree.getCheckedNodes ( true );

                setAllTreeNodeChkDisabled ( zTree, nodes, true );

                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                    setAllTreeNodeChkDisabled ( zTree, nodes, true );

                }
                mntrcItmValidate ( checkedNodes );
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

// 기준 항목관리 정보 유효성 체크
function mntrcItmValidate ( checkedNodes )
{
    if ( paramTreeLevel != 4 || checkedNodes[0].level !== 5 )
    {
        rules = {
            itemKorNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                        return true;
                    }
                },
                maxlength : 50
            },

            itemEngNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                        return true;
                    }
                },
                maxlength : 50
            },
            chckConts : {
                maxlength : 300
            }
        }, messages = {
            itemKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredAssetKo ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxSizeAssetKo )
            },
            itemEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredAssetEn ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxSizeAssetEn )
            },
            chckConts : {
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxSizeInspectionContents )
            }
        }
    } else
    {
        rules = {
            itemKorNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                        return true;
                    }
                },
                maxlength : 50
            },
            itemEngNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                        return true;
                    }
                },
                maxlength : 50
            },
            chckTyCd : {
                selectRequired : true
            },
            chckConts : {
                maxlength : 300
            }
        }, messages = {
            itemKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredAssetKo ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxSizeAssetKo )
            },
            itemEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredAssetEn ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxSizeAssetEn )
            },
            chckTyCd : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredInspectionType )
            },
            chckConts : {
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxSizeInspectionContents )
            }
        }
    }

    $ ( '#mntrcItmForm' ).validate (
            {
                rules : rules,
                messages : messages,
                submitHandler : function ( form )
                {
                    if ( paramTreeLevel == 4 || checkedNodes[0].level === 5
                            || parmUriPath === staticVariable.aplctnSectnCdRepairUri )
                    {
                        var $aplctnCheck = $ ( '.aplctnCheck' );

                        var checkVal = 0;
                        $aplctnCheck.each ( function ()
                        {
                            if ( $ ( this ).prop ( 'checked' ) )
                            {
                                checkVal += parseInt ( $ ( this ).val (), 10 );
                            }
                            $ ( '.aplctnStleVal' ).val ( checkVal );
                        } );
                        if ( checkVal === 0 )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validSelectRequiredDutyForm,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            return false;
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

// 신규 등록 시 새 항목 노드 추가
function addTreeNode ( zTree )
{
    if ( (paramItemId === null || paramItemId === '') )
    {
        var parentNode = null;

        if ( paramTreeLevel == 1 )
        {
            parentNode = zTree.getNodeByParam ( 'id', paramPvId );
        } else
        {
            parentNode = zTree.getNodeByParam ( 'id', paramPitemId );
        }

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

function btnClick ()
{
    var $btnList = $ ( '#btnList' );

    $btnList.on ( 'click', function ()
    {
        var params = {
            pvId : paramPvId,
            itemId : paramPitemId
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    } );

}

// 기준 항목 초기화(등록 화면)
function mntrcItemInitialization ()
{
    $ ( '#btnReset' ).click ( function ()
    {
        $ ( 'form' ).each ( function ()
        {
            this.reset ();
            $ ( this ).find ( 'input[type=text], textarea, select,input[type=checkbox]' ).val ( '' );

        } );

        $ ( 'label.error' ).remove ();
        $ ( '.frm_type' ).removeClass ( 'error' );
        $ ( '.customize_radio' ).trigger ( 'change' );
        $ ( '#chckTyCd, #aplctnStleVal' ).trigger ( 'change' );
    } );

}

$ ( function ()
{
    mntrcItmMgt = {
        pvId : paramPvId,
        itemId : paramItemId,
        aplctnSectnCd : null
    };
    customizeForm ();
    // initDatetimepicker ();
    // customizeTree ();
    customizeScroll ();
    getItmList ();
    // mntrcItmValidate ();
    btnClick ();
    mntrcItemInitialization ();
} );