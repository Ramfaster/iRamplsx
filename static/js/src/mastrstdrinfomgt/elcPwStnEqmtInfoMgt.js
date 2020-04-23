var selectedTree;
// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
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

function setColModel ()
{
    var colModel = [
            {
                name : 'pvId',
                width : 30,
                align : 'center',
                hidden : true
            },
            {
                name : 'eqmtId',
                width : 30,
                align : 'center',
                hidden : true
            },
            {
                name : 'adiEqmtId',
                width : 30,
                align : 'center',
                hidden : true
            },
            {
                name : 'mdlEqmtId',
                width : 30,
                align : 'center',
                hidden : true
            },
            {
                name : 'eqmtGrpCd',
                width : 30,
                align : 'center',
                hidden : true
            },
            {
                name : 'eqmtEngNm',
                width : 300,
                align : 'center',
                fixed : true
            },
            {
                name : 'modlCdNm',
                width : 305,
                align : 'center',
                fixed : true
            },
            {
                name : 'eqmtCpcty',
                width : 205,
                align : 'center',
                fixed : true,
                formatter : function ( cellvalue, options, rowObject )
                {
                    return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                }
            },
            {
                name : 'purchsDt',
                width : 205,
                align : 'center',
                fixed : true
            },
            {
                name : 'eqmtChange',
                width : 205,
                align : 'center',
                fixed : true,
                formatter : function ( cellValue, options, rowObject )
                {
                    var params = {
                        pvId : rowObject.pvId,
                        preparprdClCd : 'SPT01',
                        preparprdItemCd : rowObject.eqmtGrpCd,
                        eqmtId : rowObject.eqmtId,
                        adiEqmtId : rowObject.adiEqmtId,
                        mdlEqmtId : rowObject.mdlEqmtId
                    };

                    return '<a href="' + contextPath + '/hom/servicemgt/spare/sparePartsChngePopup.do?'
                            + $.param ( params ) + '" class="btn_intbl link"><i class="icon_change"></i>'
                            + i18nMessage.msg_equipmentChange + '</a>';
                }
            } ];

    if ( lang == locale.korea || lang == locale.korean )
    {
        colModel = [
                {
                    name : 'pvId',
                    width : 30,
                    align : 'center',
                    hidden : true
                },
                {
                    name : 'eqmtId',
                    width : 30,
                    align : 'center',
                    hidden : true
                },
                {
                    name : 'adiEqmtId',
                    width : 30,
                    align : 'center',
                    hidden : true
                },
                {
                    name : 'mdlEqmtId',
                    width : 30,
                    align : 'center',
                    hidden : true
                },
                {
                    name : 'eqmtGrpCd',
                    width : 30,
                    align : 'center',
                    hidden : true
                },
                {
                    name : 'eqmtKorNm',
                    width : 300,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'modlCdNm',
                    width : 305,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'eqmtCpcty',
                    width : 205,
                    align : 'center',
                    fixed : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'purchsDt',
                    width : 205,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'eqmtChange',
                    width : 205,
                    align : 'center',
                    fixed : true,
                    formatter : function ( cellValue, options, rowObject )
                    {
                        var params = {
                            pvId : rowObject.pvId,
                            preparprdClCd : staticVariable.preparprdClCdEqmt,
                            preparprdItemCd : rowObject.eqmtGrpCd,
                            eqmtId : rowObject.eqmtId,
                            adiEqmtId : rowObject.adiEqmtId,
                            mdlEqmtId : rowObject.mdlEqmtId
                        };

                        return '<a href="' + contextPath + '/hom/servicemgt/spare/sparePartsChngePopup.do?'
                                + $.param ( params ) + '" class="btn_intbl link"><i class="icon_change"></i>'
                                + i18nMessage.msg_equipmentChange + '</a>';
                    }
                } ];
    }

    return colModel;
}

function jqGridBasic ()
{
    var deferred = $.Deferred ();
    var tpl = getTemplate ( templates.noData );

    var colModel = setColModel ();
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/masterdata/equipment/selectEqmtList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 639,
                autowidth : true,
                shrinkToFit : false,
                async : false,
                postData : {
                    eqmtId : paramEqmtId,
                    eqmtGrpCd : paramEqmtGrpCd
                },
                colNames : [ i18nMessage.msg_electricPowerStation,
                        i18nMessage.msg_facilities + ' ' + i18nMessage.msg_id, '', '', '',
                        i18nMessage.msg_facilitiesName, i18nMessage.msg_modelName, i18nMessage.msg_setupCapacity,
                        i18nMessage.msg_purchaseDate, i18nMessage.msg_eqmtChange ],
                colModel : colModel,
                sortname : 'eqmtId',
                sortorder : 'asc',
                multiselect : true,
                multiboxonly : false,
                rownumbers : true, // show row numbers
                // rownumWidth : 25, // the width of the row numbers columns
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                viewrecords : false,
                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '.gq_nodata' );
                    var $gridList = $ ( '#gridList' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();

                        // 수정 및 상세 화면에서 목록 이동시 체크 박스 비활성화 처리
                        var $checkboxs = $ ( '.ui-th-column .cbox' );
                        disableJqgridCheckbox ( $gridList, $checkboxs );

                        $gridList.jqGrid ( 'setLabel', 'eqmtCpcty', i18nMessage.msg_setupCapacity );
                    } else
                    {
                        $gqNodata.hide ();

                        // 단위 설정
                        $gridList.jqGrid ( 'setLabel', 'eqmtCpcty', i18nMessage.msg_setupCapacity + '('
                                + data.rows[0].eqmtCpctyUnit + ')' );

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

                        var ids = $gridList.jqGrid ( 'getDataIDs' );
                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridList.getRowData ( cl );

                            // checkbox 처리(설비아이디(eqmtId)를 value값으로 설정)
                            $checkboxs.eq ( i ).attr ( {
                                name : 'eqmtId',
                                value : rowData.eqmtId
                            } ).addClass ( 'eqmtIds' );
                        }

                        if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                        {
                            enableJqgridCheckbox ( $gridList, $checkboxs );
                        } else
                        {
                            disableJqgridCheckbox ( $gridList, $checkboxs );
                        }
                    }

                    showPopup ();
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );

                    var href = null;

                    // 모듈 정보
                    if ( rowData.mdlEqmtId !== '' )
                    {
                        href = contextPath + '/hom/masterdata/equipment/mdlView.do?eqmtId=' + rowData.eqmtId
                                + '&adiEqmtId=' + rowData.adiEqmtId + '&mdlEqmtId=' + rowData.mdlEqmtId;
                    }
                    // 부가 설비 정보
                    else if ( rowData.adiEqmtId !== '' )
                    {
                        href = contextPath + '/hom/masterdata/equipment/adiView.do?eqmtId=' + rowData.eqmtId
                                + '&adiEqmtId=' + rowData.adiEqmtId + '&eqmtGrpCd=' + rowData.eqmtGrpCd;
                    }
                    // 설비 정보
                    else
                    {
                        href = contextPath + '/hom/masterdata/equipment/view.do?eqmtId=' + rowData.eqmtId
                                + '&eqmtGrpCd=' + rowData.eqmtGrpCd;
                    }

                    // 설비 상세정보 화면으로 이동
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

    deferred.resolve ();
    return deferred.promise ();
}

// jqgird customize
function customizeJqgrid ()
{
    var promise = jqGridBasic ();
    promise.done ( function ()
    {
        $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
        getEqmtTreeList ();
        getEqmtTreeList2 ();
    } );
}

/**
 * 트리 초기화
 */
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
            	selectedTree = "PV";
            	
            	var zTree1 = $.fn.zTree.getZTreeObj ( "treeList2" );
            	if(zTree1 != null){
            		
            		var nodes = zTree1.getSelectedNodes();
            		if (nodes.length>0) { 
            			zTree1.cancelSelectedNode(nodes[0]);
            		}
            	}
            	
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

                        setTreeAndJqgrid ( zTree, treeNode );
                    }
                }
            },
            beforeCheck : function ( treeId, treeNode )
            {
            	selectedTree = "PV";
            	var zTree1 = $.fn.zTree.getZTreeObj ( "treeList2" );
            	if(zTree1 != null){
            		
            		var nodes = zTree1.getSelectedNodes();
            		if (nodes.length>0) { 
            			zTree1.cancelSelectedNode(nodes[0]);
            		}
            	}
            		
            	
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var checkedNodes = zTree.getCheckedNodes ( true );

                if ( checkedNodes.length > 0 && checkedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    zTree.selectNode ( treeNode );

                    showTreeLocation ( zTree, treeNode );

                    setTreeAndJqgrid ( zTree, treeNode );
                }
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
}

/**
 * 트리 초기화
 */
function initTree2 ( data )
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
            	selectedTree = "ESS";
            	
            	var zTree1 = $.fn.zTree.getZTreeObj ( "treeList" );
            	if(zTree1 != null){
            		
            		var nodes = zTree1.getSelectedNodes();
            		if (nodes.length>0) { 
            			zTree1.cancelSelectedNode(nodes[0]);
            		}
            	}
            	
                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
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

                        setTreeAndJqgrid ( zTree, treeNode );
                    }
                }
            },
            beforeCheck : function ( treeId, treeNode )
            {
            	selectedTree = "ESS";
            	var zTree1 = $.fn.zTree.getZTreeObj ( "treeList" );
            	if(zTree1 != null){
            		
            		var nodes = zTree1.getSelectedNodes();
            		if (nodes.length>0) { 
            			zTree1.cancelSelectedNode(nodes[0]);
            		}
            	}
            	
                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
                var checkedNodes = zTree.getCheckedNodes ( true );

                if ( checkedNodes.length > 0 && checkedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    zTree.selectNode ( treeNode );

                    showTreeLocation ( zTree, treeNode );

                    setTreeAndJqgrid ( zTree, treeNode );
                }
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList2' ), setting, data );
}

function setTreeAndJqgrid ( zTree, treeNode )
{
    var eqmtId = treeNode.id.substring ( treeNode.id.indexOf ( "|" ) + 1, treeNode.id.length );

    // 인버터(IVT), 접속반(JUN), 스트링(STR)일 경우 일괄등록 버튼 활성화
    if ( (eqmtId.indexOf ( "IVT" ) > -1 && eqmtId.substring ( 3, eqmtId.length ) !== '0000')
            || (eqmtId.indexOf ( "JUN" ) > -1 && eqmtId.substring ( 3, eqmtId.length ) !== '0000') )
    {
        $ ( '.btn_type02' ).show ();

        var loc = contextPath + '/hom/masterdata/equipment/eqmtBatchRegPopup.do?eqmtId=' + treeNode.id
                + '&parntsEqmtId=' + treeNode.pId;
        $ ( '.btn_popup' ).prop ( 'href', loc );
    } else if ( eqmtId.indexOf ( "STR" ) > -1 && eqmtId.substring ( 3, eqmtId.length ) !== '0000' )
    {
        $ ( '.btn_type02' ).show ();

        var loc = contextPath + '/hom/masterdata/equipment/eqmtBatchRegPopup.do?eqmtId=' + eqmtId + '&parntsEqmtId='
                + treeNode.pId;
        $ ( '.btn_popup' ).prop ( 'href', loc );
    } else
    {
        $ ( '.btn_type02' ).hide ();
    }

    // 발전소 설비 목록
    if ( (treeNode.eqmtGrpCd !== "EQGR01") && (treeNode.eqmtGrpCd !== null) )
    {
        if ( treeNode.id.indexOf ( "STR" ) > -1 )
        {
            var eqmtId = treeNode.pId;
            if ( treeNode.pId.split ( '|' ).length > 1 )
            {
                eqmtId = treeNode.id;
            }

            searchJqgrid ( treeNode.eqmtGrpCd, eqmtId, treeNode.mdlPid );
        } else
        {
            searchJqgrid ( treeNode.eqmtGrpCd, treeNode.id, "" );
        }
    }
}

var newCount = 1;
function addHoverDom ( treeId, treeNode )
{
    var sObj = $ ( "#" + treeNode.tId + "_span" );
    if ( treeNode.editNameFlag || $ ( "#addBtn_" + treeNode.tId ).length > 0 )
    {
        return;
    }

    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after ( addStr );
    var $copyBtn = $ ( "#addBtn_" + treeNode.tId );
    if ( $copyBtn )
    {
        $copyBtn.on ( "click", function ()
        {
            var zTree = $.fn.zTree.getZTreeObj ( "treeList" );

            // 설비복사
            copyEqmt ();

            return false;
        } );
    }
}

function removeHoverDom ( treeId, treeNode )
{
    $ ( "#addBtn_" + treeNode.tId ).unbind ().remove ();
}

function pasteHoverDom ( treeId, treeNode )
{
    var sObj = $ ( "#" + treeNode.tId + "_span" );
    if ( treeNode.editNameFlag || $ ( "#addBtn_" + treeNode.tId ).length > 0 )
    {
        return;
    }

    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='paste node' onfocus='this.blur();'></span>";
    sObj.after ( addStr );
    var btn = $ ( "#addBtn_" + treeNode.tId );
    if ( btn )
    {
        btn.bind ( "click", function ()
        {
            var zTree = $.fn.zTree.getZTreeObj ( "treeList" );

            // 설비 붙이기
            pasteEqmt ();

            return false;
        } );
    }
}

/**
 * 발전소 설비 트리 목록
 */
function getEqmtTreeList ()
{
    var params = {
        eqmtId : paramEqmtId,
        treeType : staticVariable.treeTypeEqmtInfo
    };

    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            eqmtId : paramEqmtId,
            chkDisabled : false
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var pNode = null;
                var flag = false;
                if ( paramEqmtId !== '' )
                {
                    if ( paramEqmtId.substring ( 3, 7 ) !== '0000' )
                    {
                        var node = null;
                        if ( paramMdlEqmtId !== '' )
                        {
                            node = _.find ( json.data, function ( node )
                            {
                                return node.id === paramMdlEqmtId && node.pId === paramEqmtId;
                            } );
                        } else
                        {
                            node = _.find ( json.data, function ( node )
                            {
                                return node.id === paramEqmtId;
                            } );
                        }

                        if ( typeof node !== 'undefined' )
                        {
                            var pid = node.pId;
                            pNode = _.find ( json.data, function ( node )
                            {
                                return node.id === pid;
                            } );

                            if ( typeof pNode !== 'undefined' )
                            {
                                pNode.checked = true;
                                selectedTree = "PV";
                            }
                        }
                    } else
                    {
                        pNode = _.find ( json.data, function ( node )
                        {
                            return node.id === paramEqmtId;
                        } );

                        if ( typeof pNode !== 'undefined' )
                        {
                            pNode.checked = true;
                            selectedTree = "PV";
                        }
                    }
                } else
                {
                    flag = true;
                }

                initTree ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNodes = zTree.getCheckedNodes ( true );

                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );

                    if ( flag )
                    {
                        pNode = checkedNodes[0];
                    }
                }

                setNoChildTreeNodeChkDisabled ( zTree, nodes, true );

                if ( pNode !== null && typeof pNode !== 'undefined' )
                {
                    setTreeAndJqgrid ( zTree, pNode );
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


/**
 * 발전소 설비 트리 목록
 */
function getEqmtTreeList2 ()
{
    var params = {
        eqmtId : paramEqmtId,
        treeType : staticVariable.treeTypeEssEqmtInfo,
        chkDisabled : false
    };

    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var pNode = null;
                var flag = false;
                if ( paramEqmtId !== '' )
                {
                    if ( paramEqmtId.substring ( 3, 7 ) !== '0000' )
                    {
                        var node = null;
                        if ( paramMdlEqmtId !== '' )
                        {
                            node = _.find ( json.data, function ( node )
                            {
                                return node.id === paramMdlEqmtId && node.pId === paramEqmtId;
                            } );
                        } else
                        {
                            node = _.find ( json.data, function ( node )
                            {
                                return node.id === paramEqmtId;
                            } );
                        }

                        if ( typeof node !== 'undefined' )
                        {
                            var pid = node.pId;
                            pNode = _.find ( json.data, function ( node )
                            {
                                return node.id === pid;
                            } );

                            if ( typeof pNode !== 'undefined' )
                            {
                                pNode.checked = true;
                                selectedTree = "ESS";
                            }
                        }
                    } else
                    {
                        pNode = _.find ( json.data, function ( node )
                        {
                            return node.id === paramEqmtId;
                        } );

                        if ( typeof pNode !== 'undefined' )
                        {
                            pNode.checked = true;
                            selectedTree = "ESS";
                        }
                    }
                } else
                {
                    flag = true;
                }

                initTree2 ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNodes = zTree.getCheckedNodes ( true );

                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );

                    if ( flag )
                    {
                        pNode = checkedNodes[0];
                    }
                }

                setNoChildTreeNodeChkDisabledForEss ( zTree, nodes, true );

                if ( pNode !== null && typeof pNode !== 'undefined' )
                {
                    setTreeAndJqgrid ( zTree, pNode );
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

// 자식이 없는 트리 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        var children = nodes[i].children;
        if ( nodes[i].id.indexOf ( 'STR' ) < 0
                && nodes[i].id.indexOf ( 'TRR' ) < 0
                && (((typeof children === 'undefined' || children.length == 0) && nodes[i].pId !== staticVariable.eqmtTreeRoot) 
                		|| nodes[i].id === staticVariable.eqmtTreeRoot ) )
        {
            zTree.setChkDisabled ( nodes[i], true );
        }
    }
}

//자식이 없는 트리 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabledForEss ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        var children = nodes[i].children;
        if ( nodes[i].id.indexOf ( 'STR' ) < 0
                && nodes[i].id.indexOf ( 'TRR' ) < 0
                && (((typeof children === 'undefined' || children.length == 0) && nodes[i].pId !== staticVariable.eqmtTreeRoot) 
                		|| nodes[i].id === staticVariable.eqmtTreeRoot)
                && nodes[i].level !=1 )
        {
            zTree.setChkDisabled ( nodes[i], true );
        }
    }
}

// jqgrid 검색
function searchJqgrid ( eqmtGrpCd, eqmtId, paramAdiEqmtId )
{
    var $grid = $ ( '#gridList' );

    if ( paramAdiEqmtId !== '' )
    {
        $grid.setGridParam ( {
            postData : {
                parntsEqmtId : paramAdiEqmtId,
                eqmtGrpCd : eqmtGrpCd,
                eqmtId : eqmtId
            }
        } ).trigger ( 'reloadGrid' );
    } else
    {
        reloadJqgrid ( $grid, eqmtGrpCd, eqmtId );
    }
}

// jqgrid reload
function reloadJqgrid ( $grid, eqmtGrpCd, eqmtId )
{
    $grid.setGridParam ( {
        postData : {
            eqmtGrpCd : eqmtGrpCd,
            eqmtId : eqmtId
        }
    } ).trigger ( 'reloadGrid' );
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

/**
 * 등록 폼 화면 이동
 */
function viewRegForm ()
{
    var $regBtn = $ ( '.btn_type01' );
    $regBtn.click ( function ()
    {
    	if(selectedTree != null){
    		
    		
    		var treeObj = null;
    		
    		if(selectedTree == "PV"){
    			treeObj = $.fn.zTree.getZTreeObj ( "treeList" );
    		}else if(selectedTree = "ESS"){
    			treeObj = $.fn.zTree.getZTreeObj ( "treeList2" );
    		}
    			
    		
    		var eqmtId = "";
    		var eqmtGrpCd = "";
    		var parntsEqmtId = "";
    		if ( treeObj != null )
    		{
    			var nodes = treeObj.getSelectedNodes ();
    			
    			if ( nodes.length > 0 )
    			{
    				eqmtId = nodes[0].id;
    				eqmtGrpCd = nodes[0].eqmtGrpCd;
    				parntsEqmtId = nodes[0].pId;
    			}
    		}
    		
    		var type = getEqmtType ( eqmtId, eqmtGrpCd );
    		// 모듈 정보
    		var href = contextPath + '/hom/masterdata/equipment';
    		if ( type === staticVariable.eqmtTypeModule )
    		{
    			href += '/mdlForm.do?method=insert&treeParntsEqmtId=' + parntsEqmtId + '&eqmtId=' + eqmtId.split ( '|' )[1]
    			+ '&adiEqmtId=' + parntsEqmtId;
    		}
    		// 부가 설비 정보
    		else if ( type === staticVariable.eqmtTypeAdi )
    		{
    			href += '/adiForm.do?method=insert&eqmtId=' + eqmtId + '&eqmtGrpCd=' + eqmtGrpCd;
    		}
    		// 설비 정보
    		else
    		{
    			href += '/form.do?method=insert&eqmtId=' + eqmtId + '&eqmtGrpCd=' + eqmtGrpCd + '&treeParntsEqmtId='
    			+ parntsEqmtId;
    		}
    		
    		location.href = href;
    	}
    		
    } );
}

// 설비 타입을 가져온다
function getEqmtType ( eqmtId, eqmtGrpCd )
{
    var type = null;

    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/selectEqmtType.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            eqmtId : eqmtId,
            eqmtGrpCd : eqmtGrpCd
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                type = json.data;
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

    return type;
}

/**
 * 설비 복사
 */
function copyEqmt ()
{
    $.when ( $.customizeDialog ( {
        template : templates.dialog,
        message : i18nMessage.msg_alertEquipmentCopyConfirm,
        checkText : i18nMessage.msg_ok,
        cancelText : i18nMessage.msg_cancel,
        type : staticVariable.dialogTypeConfirm
    } ) ).then ( function ( confirm )
    {
        if ( confirm )
        {
        	if(selectedTree != null){
        		
        		
        		var treeObj = null;
        		
        		if(selectedTree == "PV"){
        			treeObj = $.fn.zTree.getZTreeObj ( "treeList" );
        		}else if(selectedTree = "ESS"){
        			treeObj = $.fn.zTree.getZTreeObj ( "treeList2" );
        		}
            
            var nodes = treeObj.getSelectedNodes ();

            var isGrp = "";
            if ( nodes.length > 0 )
            {
                var eqmtId = nodes[0].id;
                var parntsEqmtId = nodes[0].pId;
                var eqmtGrpCd = nodes[0].eqmtGrpCd;
                var isEqmtGrp = "";

                // 선택한 노드가 그룹인지 여부 설정
                if ( typeof nodes[0].children !== 'undefined' )
                {
                    isEqmtGrp = 'Y';
                } else
                {
                    isEqmtGrp = 'N';
                }

                $ ( '#eqmtId' ).val ( eqmtId );
                $ ( '#parntsEqmtId' ).val ( parntsEqmtId );
                $ ( '#eqmtGrpCd' ).val ( eqmtGrpCd );
                $ ( '#isEqmtGrp' ).val ( isEqmtGrp );
            }
        	}
        } else
        {
            return false;
        }
    } );
}// end copyEqmt

/**
 * 설비 붙여넣기
 */
function pasteEqmt ()
{
    var treeObj = $.fn.zTree.getZTreeObj ( "treeList" );
    var nodes = treeObj.getSelectedNodes ();

    console.log ( "targetEqmtGrpCd: " + nodes[0].eqmtGrpCd );

    if ( nodes.length > 0 )
    {
        $ ( '#targetEqmtGrpCd' ).val ( nodes[0].eqmtGrpCd );
    }

    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/copyEqmt.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( "form" ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                console.log ( json.data );

                // 트리 재 조회
                getEqmtTreeList ();
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
}// end copyEqmt

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

/**
 * 일괄등록 팝업 오픈
 */
function openBathRegPop ()
{
    var $btnPopup = $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                setParameter ( $btnPopup );
            }
        }
    } );
}

var curSrcNode, curType;
function setCurSrcNode ( treeNode )
{
    var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
    if ( curSrcNode )
    {
        delete curSrcNode.isCur;
        var tmpNode = curSrcNode;
        curSrcNode = null;
        fontCss ( tmpNode );
    }
    curSrcNode = treeNode;
    if ( !treeNode )
    {
        return;
    }
    curSrcNode.isCur = true;
    zTree.cancelSelectedNode ();
    fontCss ( curSrcNode );
}

/**
 * 설비 교체
 */
function showPopup ()
{
    var $btnIntbl = $ ( '.btn_intbl' );

    $btnIntbl.show ();

    $btnIntbl.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );

}

$ ( function ()
{
	if(selectedbizTy == 'BSN01' || selectedbizTy == 'BSN03')
	{
		selectedTree = 'PV';
	}else
	{
		selectedTree = 'ESS';
	}
    customizeForm ();
    customizeJqgrid ();
    customizeScroll ();
    switchButtonGroup ();
    openBathRegPop ();
    viewRegForm ();
} );