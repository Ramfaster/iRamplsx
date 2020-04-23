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
function customizeTree ( initFlag )
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
                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
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
                        reloadJqgrid ( treeNode );
                    }
                }
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 && checkedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    zTree.selectNode ( treeNode );

                    showTreeLocation ( zTree, treeNode );
                    reloadJqgrid ( treeNode );
                }
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
            chkDisabled : false
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                } else if ( checkedNodes.length === 0 && paramMenuId.indexOf ( '_VIRTUAL_' ) !== -1 )
                {
                    var node = zTree.getNodeByParam ( 'id', paramMenuId );

                    zTree.selectNode ( node );
                    zTree.checkNode ( node, true, true );
                    showTreeLocation ( zTree, node );
                }

                setTreeNodeChkDisabled ( zTree, nodes );

                customizeScroll ();

                if ( initFlag )
                {
                    customizeJqgrid ();
                } else
                {
                    $ ( '#gridList' ).trigger ( 'reloadGrid' );
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

// 프로그램이 있는 트리 노드 및 level - 5 트리 노드 enable/disable 처리
function setTreeNodeChkDisabled ( zTree, nodes )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        if ( (nodes[i].progrmUrl !== 'javascript:;' && nodes[i].id.indexOf ( '_VIRTUAL_' ) === -1)
                || nodes[i].level === 5 )
        {
            zTree.setChkDisabled ( nodes[i], true );
        }
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

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );
    var virtualIndex = paramMenuId.indexOf ( '_VIRTUAL_' );
    var menuId = virtualIndex !== -1 ? paramMenuId.substring ( 0, virtualIndex ) : paramMenuId;
    var menuType = virtualIndex !== -1 ? paramMenuId.substring ( virtualIndex + '_VIRTUAL_'.length, paramMenuId.length )
            : '';

    var colNames = null;
    var colModel = null;

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ i18nMessage.msg_menuOrder, i18nMessage.msg_menuId, 'menuRelateCount',
                i18nMessage.msg_menuKoreanName, i18nMessage.msg_menuType, i18nMessage.msg_programKoreanName,
                i18nMessage.msg_useAvailability, i18nMessage.msg_newWindowOpen, i18nMessage.msg_description ];
        colModel = [ {
            name : 'menuOrdr',
            hidden : true
        }, {
            name : 'menuId',
            hidden : true
        }, {
            name : 'menuRelateCount',
            hidden : true
        }, {
            name : 'menuKorNm',
            width : 210,
            align : 'left',
            fixed : true
        }, {
            name : 'menuTypeNm',
            width : 150,
            align : 'center',
            fixed : true
        }, {
            name : 'progrmKorNm',
            width : 210,
            align : 'left',
            fixed : true
        }, {
            name : 'usgAt',
            width : 150,
            align : 'center',
            fixed : true
        }, {
            name : 'nwinCreatAt',
            width : 150,
            align : 'center',
            fixed : true
        }, {
            name : 'menuDesc',
            width : 350,
            align : 'left',
            fixed : true
        } ]; // 
    } else
    {
        colNames = [ i18nMessage.msg_menuOrder, i18nMessage.msg_menuId, 'menuRelateCount',
                i18nMessage.msg_menuEnglishName, i18nMessage.msg_menuType, i18nMessage.msg_programEnglishName,
                i18nMessage.msg_useAvailability, i18nMessage.msg_newWindowOpen, i18nMessage.msg_description ];
        colModel = [ {
            name : 'menuOrdr',
            hidden : true
        }, {
            name : 'menuId',
            hidden : true
        }, {
            name : 'menuRelateCount',
            hidden : true
        }, {
            name : 'menuEngNm',
            width : 210,
            align : 'left',
            fixed : true
        }, {
            name : 'menuTypeNm',
            width : 150,
            align : 'center',
            fixed : true
        }, {
            name : 'progrmEngNm',
            width : 210,
            align : 'left',
            fixed : true
        }, {
            name : 'usgAt',
            width : 150,
            align : 'center',
            fixed : true
        }, {
            name : 'nwinCreatAt',
            width : 150,
            align : 'center',
            fixed : true
        }, {
            name : 'menuDesc',
            width : 350,
            align : 'left',
            fixed : true
        } ];
    } // 

    // jqgrid
    $ ( '#gridList' ).jqGrid ( {
        url : contextPath + '/hom/sysmgt/menu/list.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 642,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            menuId : menuId,
            menuType : menuType
        },
        colNames : colNames,
        colModel : colModel,
        sortname : 'menuOrdr',
        sortorder : 'asc',
        multiselect : true,
        multiboxonly : false,
        rownumbers : true,
        rowwidth : 25,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gridList = $ ( '#gridList' );
            var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
            var $gqNodata = $ ( '.gq_nodata' );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var ids = $gridList.jqGrid ( 'getDataIDs' );
                for ( var i = 0, length = ids.length; i <= length; i++ )
                {
                    var cl = ids[i];
                    var rowData = $gridList.getRowData ( cl );

                    // 사용/미사용 alias
                    if ( rowData.usgAt !== null && rowData.usgAt === 'Y' )
                    {
                        rowData.usgAt = i18nMessage.msg_use;
                    } else if ( rowData.usgAt !== null && rowData.usgAt === 'N' )
                    {
                        rowData.usgAt = i18nMessage.msg_unuse;
                    }

                    $gridList.jqGrid ( 'setRowData', cl, rowData );

                    // checkbox 처리
                    $checkboxs.eq ( i ).attr ( {
                        name : 'menuId',
                        value : rowData.menuId
                    } ).data ( 'menu-relate-count', rowData.menuRelateCount ).addClass ( 'menuIds' );
                }

            }

            if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
            {
                enableJqgridCheckbox ( $gridList, $checkboxs )
            } else
            {
                disableJqgridCheckbox ( $gridList, $checkboxs )
            }
        },
        onSelectRow : function ( rowId, status )
        {
            var href = null;
            var $gridList = $ ( '#gridList' );
            var rowData = $gridList.getRowData ( rowId );
            var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
            var checkedNodes = zTree.getCheckedNodes ( true );

            href = contextPath + '/hom/sysmgt/menu/view.do?menuId=' + rowData.menuId;
            if ( checkedNodes.length > 0 )
            {
                href += '&parntsMenuId=' + checkedNodes[0].id;
            }

            location.href = href;
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid reload
function reloadJqgrid ( treeNode )
{
    var childCount = parseInt ( treeNode.childCount, 10 );
    var treeId = treeNode.id;
    var postData = null;

    if ( childCount > 0 && treeId.indexOf ( '_VIRTUAL_' ) !== -1 )
    {
        postData = {
            menuId : treeNode.pId,
            menuType : treeNode.menuType
        };
    } else if ( childCount > 0 && treeId.indexOf ( '_VIRTUAL_' ) === -1 )
    {
        postData = {
            menuId : treeNode.id,
            menuType : ''
        };
    } else
    {
        postData = {
            menuId : 'nochild',
            menuType : ''
        };
    }

    $ ( '#gridList' ).setGridParam ( {
        postData : postData
    } ).trigger ( 'reloadGrid' );
}

// jqgrid 편집 enable 처리
function enableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'hideCol', [ 'rn' ] );
    $gridList.jqGrid ( 'showCol', [ 'cb' ] );

    // onSelectRow event 해제
    $gridList.jqGrid ( 'setGridParam', {
        beforeSelectRow : function ( rowId, e )
        {
            return false;
        }
    } );
}

// jqgrid 편집 disable 처리
function disableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'showCol', [ 'rn' ] );
    $gridList.jqGrid ( 'hideCol', [ 'cb' ] );

    // onSelectRow event 적용
    $gridList.jqGrid ( 'setGridParam', {
        beforeSelectRow : function ( rowId, e )
        {
            return true;
        }
    } );
}

// 버튼 그룹 switch
function switchButtonGroup ()
{
    var $btnEdit01 = $ ( '#btn_edit01' );
    var $btnCancel01 = $ ( '#btn_cancel01' );
    var $btnGroupEdit = $ ( '#btn_group_edit' );
    var $btnGroupDelete = $ ( '#btn_group_delete' );

    $btnEdit01.on ( 'click', function ()
    {
        var $gridList = $ ( '#gridList' );
        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

        $btnGroupEdit.addClass ( 'dnone' );
        $btnGroupDelete.removeClass ( 'dnone' );

        enableJqgridCheckbox ( $gridList, $checkboxs );
        $gridList.jqGrid ( 'sortableRows', true );
    } );

    $btnCancel01.on ( 'click', function ()
    {
        var $gridList = $ ( '#gridList' );
        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

        $btnGroupEdit.removeClass ( 'dnone' );
        $btnGroupDelete.addClass ( 'dnone' );

        disableJqgridCheckbox ( $gridList, $checkboxs );
        $gridList.jqGrid ( 'sortableRows', false );

        $gridList.trigger ( 'reloadGrid' );
    } );
}

// 삭제 체크
function checkDelete ()
{
    var $btnDelete = $ ( '#btn_delete' );

    $btnDelete.on ( 'click', function ()
    {
        var menuIdArray = [];
        var menuRelateCountArray = [];
        var $that = $ ( this );

        $ ( '.menuIds' ).each ( function ()
        {
            if ( $ ( this ).prop ( 'checked' ) )
            {
                menuIdArray.push ( $ ( this ).val () );
                menuRelateCountArray.push ( $ ( this ).data ( 'menu-relate-count' ) );
            }
        } );

        if ( menuIdArray.length === 0 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertNoSelectedDeleteItem,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
            var node = null;
            var childFlag = true;
            var relateFlag = true;

            for ( var i = 0, length = menuIdArray.length; i < length; i++ )
            {
                node = zTree.getNodeByParam ( 'id', menuIdArray[i] );

                var childNodes = $.fn.zTree.getZTreeObj ( 'treeList' ).getNodesByFilter ( function ()
                {
                    return true;
                }, false, node );

                var childLength = childNodes.length;
                if ( childLength > 0 )
                {
                    for ( var j = 0, childLength = childNodes.length; j < childLength; j++ )
                    {
                        if ( childNodes[j].id !== '' && childNodes[j].id.indexOf ( '_VIRTUAL_' ) === -1 )
                        {
                            childFlag = false;
                            break;
                        }
                    }
                }
            }

            for ( var i = 0, length = menuRelateCountArray.length; i < length; i++ )
            {
                if ( $.isNumeric ( menuRelateCountArray[i] ) )
                {
                    var menuRelateCount = parseInt ( menuRelateCountArray[i], 10 );

                    if ( menuRelateCount > 0 )
                    {
                        relateFlag = false;
                        break;
                    }
                }
            }

            if ( childFlag && relateFlag )
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
                        var href = $that.attr ( 'href' ) + '?menuId=' + menuIdArray.toString ();

                        var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                        var checkedNodes = zTree.getCheckedNodes ( true );

                        if ( checkedNodes.length > 0 )
                        {
                            href += '&parntsMenuId=' + checkedNodes[0].id;
                        }

                        location.href = href;
                    }
                } );
            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validExistChildMenu,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
        }

        return false;
    } );
}

// 순서 갱신 체크
function checkUpdateMenuOrder ()
{
    $ ( '#btn_update_menu_order' ).on ( 'click', function ()
    {
        var $gridList = $ ( '#gridList' );
        var ids = $gridList.jqGrid ( 'getDataIDs' );
        var menuIdArray = [];

        for ( var i = 0, length = ids.length; i <= length; i++ )
        {
            var cl = ids[i];

            if ( !cl )
            {
                continue;
            }

            var rowData = $gridList.getRowData ( cl );
            menuIdArray.push ( rowData.menuId );
        }

        if ( menuIdArray.length === 0 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertNoSaveItem,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertSaveOrderConfirm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {
                if ( confirm )
                {
                    $.ajax ( {
                        url : contextPath + '/hom/sysmgt/menu/updateMenuOrder.ajax',
                        type : 'POST',
                        dataType : 'json',
                        data : {
                            menuIds : menuIdArray.toString ()
                        },
                        success : function ( json )
                        {
                            if ( json.status === staticVariable.jsonStatusSuccess )
                            {
                                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                                var checkedNodes = zTree.getCheckedNodes ( true );
                                paramMenuId = checkedNodes[0].id;

                                // ztree remove
                                $ ( '.tree_wrap' ).mCustomScrollbar ( 'destroy' );
                                $.fn.zTree.destroy ( 'treeList' );

                                // ztree init & jqgrid reload
                                customizeTree ( false );

                                $ ( '#btn_cancel01' ).click ();

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
            } );
        }

        return false;
    } );
}

// 등록 체크
function checkAdd ()
{
    var $btnAdd = $ ( '#btn_add' );

    $btnAdd.click ( function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
        var checkedNodes = zTree.getCheckedNodes ( true );
        if ( checkedNodes.length > 0 )
        {
            location.href = $ ( this ).attr ( 'href' ) + '&parntsMenuId=' + checkedNodes[0].id;
        }

        return false;
    } );
}

// 메시지 체크
function checkMessage ()
{
    if ( paramDelete )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDelete,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    }
}

$ ( function ()
{
    customizeTree ( true );
    checkDelete ();
    checkUpdateMenuOrder ();
    checkAdd ();
    switchButtonGroup ();
    checkMessage ();
} );