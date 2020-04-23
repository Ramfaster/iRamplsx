// form element customize
function customizeForm ()
{
    $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    // 프로그램, 메뉴 아이콘
    var $selType = $ ( '.customize_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

// 메뉴 아이콘 변경
function changeMenuIcon ()
{
    var $menuIcon = $ ( '#menuIcon' );
    if ( $menuIcon.size () > 0 )
    {
        var $menuIconTarget = $ ( '#menu_icon_target' );

        $menuIcon.on ( 'change', function ()
        {
            var menuIconClass = $ ( this ).find ( 'option:selected' ).data ( 'menu-icon-class' );

            if ( typeof menuIconClass !== 'undefined' && menuIconClass !== null && menuIconClass !== '' )
            {
                $ ( '#menuIcon-error' ).html ( '' ).hide ();
            }

            $menuIconTarget.removeClass ().addClass ( menuIconClass );
        } );
    }
}

// 프로그램 번호 변경 시 대시보드 표출 toggle
function changeProgrmSeq ()
{
    var $dashboardFlagBox = $ ( '#dashboard_flag_box' );

    $ ( '#progrmSeq' ).on ( 'change', function ()
    {
        // 프로그램 없음일 때 대시보드 표출 안보이게 하고 대시보드 표출 미사용 체크
        if ( $ ( this ).val () === '1' )
        {
            $dashboardFlagBox.hide ().find ( '#dashboardFlag2' ).prop ( 'checked', true ).trigger ( 'change' );
        } else
        {
            $dashboardFlagBox.show ();
        }
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
        }
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/menu/selectMenuInfoTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            menuId : paramMenuId,
            enableRoot : true,
            chkDisabled : true
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                // chkDisabled가 true 되어 있는 상태에서는 node정보를 가져올 수 없으므로 false, true 처리
                setAllTreeNodeChkDisabled ( zTree, nodes, false );

                addTreeNode ( zTree );

                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                }

                nodes = zTree.transformToArray ( zTree.getNodes () );
                setAllTreeNodeChkDisabled ( zTree, nodes, true );

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

// 신규 등록 시 새 항목 노드 추가
function addTreeNode ( zTree )
{
    if ( (paramMenuId === null || paramMenuId === '') && paramParntsMenuId !== null )
    {
        var parentNode = zTree.getNodeByParam ( 'id', paramParntsMenuId );

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

// 모든 트리 노드 enable/disable 처리
function setAllTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        zTree.setChkDisabled ( nodes[i], disabled );
    }
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
    var node = null;
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

// 메뉴 정보 초기화(등록 화면)
function menuInitialization ()
{
    if ( !existMenuId )
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
}

// 메뉴 정보 유효성 체크
function menuValidate ()
{
    var tpl = getTemplate ( templates.labelError );
    var $parntsMenuId = $ ( '#parntsMenuId' );

    $ ( '#menuForm' ).validate ( {
        rules : {
            menuKorNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            menuEngNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            progrmSeq : {
                selectRequired : true
            },
            menuIcon : {
                selectRequired : true
            },
            menuDesc : {
                maxlength : 300
            }
        },
        messages : {
            menuKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredMenuKoreanName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeMenuKoreanName )
            },
            menuEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredMenuEnglishName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeMenuEnglishName )
            },
            progrmSeq : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredProgram )
            },
            menuIcon : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredMenuIcon )
            },
            menuDesc : {
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDescription )
            }
        },
        submitHandler : function ( form )
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : !existMenuId ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
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
    changeMenuIcon ();
    changeProgrmSeq ();
    customizeTree ();
    menuInitialization ();
    menuValidate ();
} );