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
                        $.jgrid.gridUnload ( '#gridList' );

                        if ( treeNode.level == 0 )
                        {
                            // 분류코드 그리드 일 경우
                            customizeClCdJqgrid ();
                        } else
                        {
                            cmmnCdMgt.cmmnClCd = treeNode.cmmnClCd;
                            cmmnCdMgt.cmmnCdId = treeNode.id;
                            cmmnCdMgt.parntsCdId = treeNode.pId;
                            cmmnCdMgt.treeLevel = treeNode.level;

                            // 공통코드 자식의 그리드 일 경우
                            customizeCdJqgrid ( treeNode );
                        }
                    }

                    $ ( '.tree_wrap' ).mCustomScrollbar ( 'update' );
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
                    $.jgrid.gridUnload ( '#gridList' );

                    if ( treeNode.level == 0 )
                    {
                        // 분류코드 그리드 일 경우
                        customizeClCdJqgrid ();

                    } else
                    {
                        cmmnCdMgt.cmmnClCd = treeNode.cmmnClCd;
                        cmmnCdMgt.cmmnCdId = treeNode.id;
                        cmmnCdMgt.parntsCdId = treeNode.pId;
                        cmmnCdMgt.treeLevel = treeNode.level;

                        // 공통코드 자식의 그리드 일 경우
                        customizeCdJqgrid ();
                    }

                    $ ( '.tree_wrap' ).mCustomScrollbar ( 'update' );
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
            chkDisabled : false
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );

                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                } else if ( checkedNodes.length === 0 )
                {
                    var node = zTree.getNodeByParam ( 'id', paramClCd );

                    zTree.selectNode ( node );
                    zTree.checkNode ( node, true, true );
                    showTreeLocation ( zTree, node );
                }

                customizeScroll ();

                if ( paramClCd === '' )
                {
                    customizeClCdJqgrid ();
                } else
                {

                    customizeCdJqgrid ();
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
// 최상위 계층(root)일 경우 그리드 조회_분류코드 조회
function customizeClCdJqgrid ()
{
    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ i18nMessage.msg_cmmnClCdId, i18nMessage.msg_cmmnClCdKoreanName, i18nMessage.msg_useAvailability,
                i18nMessage.msg_description ];
        colModel = [ {
            name : 'clCd',
            width : 300,
            align : 'left'
        }, {
            name : 'clCdKorNm',
            width : 300,
            align : 'left'
        }, {
            name : 'usgAt',
            width : 130,
            align : 'left',
            fixed : true
        }, {
            name : 'clDesc',
            width : 494,
            align : 'left',
            fixed : true
        } ];
    } else
    {
        colNames = [ i18nMessage.msg_cmmnClCdId, i18nMessage.msg_cmmnClCdEnglishName, i18nMessage.msg_useAvailability,
                i18nMessage.msg_description ];
        colModel = [ {
            name : 'clCd',
            width : 300,
            align : 'left'
        }, {
            name : 'clCdEngNm',
            width : 300,
            align : 'left'
        }, {
            name : 'usgAt',
            width : 130,
            align : 'left',
            fixed : true
        }, {
            name : 'clDesc',
            width : 494,
            align : 'left',
            fixed : true
        } ];
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid ( {
        url : contextPath + '/hom/sysmgt/cmmncd/selectClCdGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 642,
        autowidth : true,
        shrinkToFit : false,
        colNames : colNames,
        colModel : colModel,
        sortname : 'clCd',
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

                var ids = $gridList.jqGrid ( "getDataIDs" );
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
                        name : 'clCd',
                        value : rowData.clCd
                    } ).addClass ( 'clCds' );
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
            var $gridList = $ ( '#gridList' );
            var rowData = $gridList.getRowData ( rowId );

            location.href = contextPath + '/hom/sysmgt/cmmncd/clCdView.do?clCd=' + rowData.clCd;
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
    var postData = null;

    $ ( "#gridList" ).trigger ( 'reloadGrid' );
}

// jqgird customize
// 최상위 계층아닐 경우 그리드 조회_공통코드 조회
function customizeCdJqgrid ()
{
    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ i18nMessage.msg_code, i18nMessage.msg_cmmnClCdId, "부모 코드", i18nMessage.msg_cmmnCdKoreanName,
                i18nMessage.msg_useAvailability, i18nMessage.msg_description ];
        colModel = [ {
            name : 'cdId',
            width : 300,
            align : 'left'
        }, {
            name : 'clCd',
            hidden : true
        }, {
            name : 'parntsCdId',
            hidden : true
        }, {
            name : 'cdKorNm',
            width : 300,
            align : 'left'
        }, {
            name : 'usgAt',
            width : 130,
            align : 'left',
            fixed : true
        }, {
            name : 'cdDesc',
            width : 494,
            align : 'left',
            fixed : true
        } ];
    } else
    {
        colNames = [ i18nMessage.msg_code, i18nMessage.msg_cmmnClCdId, "부모 코드", i18nMessage.msg_cmmnCdEnglishName,
                i18nMessage.msg_useAvailability, i18nMessage.msg_description ];
        colModel = [ {
            name : 'cdId',
            width : 300,
            align : 'left'
        }, {
            name : 'clCd',
            hidden : true
        }, {
            name : 'parntsCdId',
            hidden : true
        }, {
            name : 'cdEngNm',
            width : 300,
            align : 'left'
        }, {
            name : 'usgAt',
            width : 130,
            align : 'left',
            fixed : true
        }, {
            name : 'cdDesc',
            width : 494,
            align : 'left',
            fixed : true
        } ];
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/cmmncd/selectCdGridList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 642,
                autowidth : true,
                shrinkToFit : false,
                datatype : 'json',
                postData : {
                    clCd : cmmnCdMgt.cmmnClCd,
                    cdId : cmmnCdMgt.cmmnCdId,
                    parntsCdId : cmmnCdMgt.parntsCdId,
                    treeLevel : cmmnCdMgt.treeLevel
                },
                height : 642,
                colNames : colNames,
                colModel : colModel,
                sortname : 'cdId',
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

                        var ids = $gridList.jqGrid ( "getDataIDs" );
                        for ( var i = 0, length = ids.length; i < length; i++ )
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
                                name : 'cdId',
                                value : rowData.cdId
                            } ).addClass ( 'cdIds' );
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
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );
                    location.href = contextPath + '/hom/sysmgt/cmmncd/cdView.do?clCd=' + rowData.clCd + '&cdId='
                            + rowData.cdId + '&parntsCdId=' + rowData.parntsCdId + '&treeLevel='
                            + (parseInt ( cmmnCdMgt.treeLevel, 10 ) + 1);

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

// jqgrid 편집 enable 처리
function enableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'hideCol', [ 'rn' ] );
    $gridList.jqGrid ( 'showCol', [ 'cb' ] );

    // onSelectRow event 해제
    $gridList.jqGrid ( "setGridParam", {
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
    $gridList.jqGrid ( "setGridParam", {
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

    var $gridList = $ ( '#gridList' );
    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

    $btnEdit01.click ( function ()
    {
        $btnGroupEdit.addClass ( 'dnone' );
        $btnGroupDelete.removeClass ( 'dnone' );
        enableJqgridCheckbox ( $gridList, $checkboxs );

    } );

    $btnCancel01.click ( function ()
    {
        $btnGroupEdit.removeClass ( 'dnone' );
        $btnGroupDelete.addClass ( 'dnone' );

        disableJqgridCheckbox ( $gridList, $checkboxs );
    } );
}

// 등록 체크
function checkAdd ()
{
    var $btnAdd = $ ( '#btn_add' );

    $btnAdd.click ( function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
        var treeNode = zTree.getCheckedNodes ( true );
        var href = $btnAdd.attr ( 'href' );

        if ( treeNode[0].level === 0 )
        {
            href += '&clCd=' + treeNode[0].id + '&treeLevel=' + treeNode[0].level;
        } else
        {
            if ( treeNode[0].level === 1 )
            {
                href += '&parntsCdId=' + treeNode[0].pId + '&treeLevel=' + (treeNode[0].level + 1) + '&clCd='
                        + treeNode[0].id;
            } else
            {
                href += '&parntsCdId=' + treeNode[0].id + '&treeLevel=' + (treeNode[0].level + 1) + '&clCd='
                        + treeNode[0].cmmnClCd;
            }
        }

        location.href = href;

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

    cmmnCdMgt = {
        cmmnClCd : paramClCd,
        cmmnCdId : paramCdId,
        parntsCdId : paramParntsCdId,
        treeLevel : paramTreeLevel
    };

    customizeTree ();
    checkAdd ();
    switchButtonGroup ();
    checkMessage ();
} );