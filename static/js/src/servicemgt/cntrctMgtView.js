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
    if ( nodeName !== null )
    {
        nodeName += separateChar + treeNode.name + separateChar + paramCntrctTyCdNm;
    } else
    {
        nodeName = treeNode.name + separateChar + paramCntrctTyCdNm;
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

// 삭제 체크
function checkBtnLinks ()
{
    var $btnDelete = $ ( '#btn_delete' );

    if ( typeof $btnDelete !== 'undefined' )
    {
        var $that = $ ( this );
        $btnDelete.on ( 'click', function ()
        {
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
                    location.href = $that.attr ( 'href' );
                }
            } );

            return false;
        } );
    }
}

$ ( function ()
{
    customizeTree ();
    customizeScroll ();
} );