var cntrctMgt = null;
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

    $ ( '.organ_tree' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// set sigma edge style
function setEdgyStyle ()
{
    sigma.utils.pkg ( 'sigma.canvas.edges' );
    sigma.canvas.edges.t = function ( edge, source, target, context, settings )
    {
        var color = edge.color, prefix = settings ( 'prefix' ) || '', edgeColor = settings ( 'edgeColor' ), defaultNodeColor = settings ( 'defaultNodeColor' ), defaultEdgeColor = settings ( 'defaultEdgeColor' );

        if ( !color )
        {
            switch ( edgeColor )
            {
                case 'source':
                    color = source.color || defaultNodeColor;
                    break;
                case 'target':
                    color = target.color || defaultNodeColor;
                    break;
                default:
                    color = defaultEdgeColor;
                    break;
            }
        }

        context.strokeStyle = color;
        context.lineWidth = edge[prefix + 'size'] || 1;
        context.beginPath ();
        context.moveTo ( source[prefix + 'x'], source[prefix + 'y'] );
        context
                .lineTo ( source[prefix + 'x'] + (target[prefix + 'x'] - source[prefix + 'x']) / 2,
                        source[prefix + 'y'] );
        context
                .lineTo ( source[prefix + 'x'] + (target[prefix + 'x'] - source[prefix + 'x']) / 2,
                        target[prefix + 'y'] );
        context.lineTo ( target[prefix + 'x'], target[prefix + 'y'] );
        context.stroke ();
    };
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

                var checkedNode = null;
                if ( paramPvId !== '' )
                {
                    $.each ( nodes, function ( i, node )
                    {
                        if ( node.id === paramPvId )
                        {
                            node.checked = true;
                            zTree.refresh ();
                            checkedNode = node;

                            return false;
                        }
                    } );
                } else
                {
                    // check노드가 없을 경우 check 설정
                    $.each ( nodes, function ( i, node )
                    {
                        if ( !node.isParent )
                        {
                            node.checked = true;
                            zTree.refresh ();
                            checkedNode = node;

                            return false;
                        }
                    } );
                }

                if ( checkedNode !== null )
                {
                    // initJqgrid
                    customizeJqgrid ( checkedNode.id );

                    // init Topology
                    initTopology ( checkedNode.id );
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
    var $contractSigmaContainer = $ ( '#contract_sigma_container' );

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

                        reloadJqgrid ( treeNode.id );

                        // reload topology
                        if ( cntrctMgt.sigmaObj !== null )
                        {
                            cntrctMgt.sigmaObj.graph.clear ();
                            $contractSigmaContainer.empty ();
                            cntrctMgt.sigmaObj = null;
                            initTopology ( treeNode.id );
                        }
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

                    reloadJqgrid ( treeNode.id );

                    // reload topology
                    if ( cntrctMgt.sigmaObj !== null )
                    {
                        cntrctMgt.sigmaObj.graph.clear ();
                        $contractSigmaContainer.empty ();
                        cntrctMgt.sigmaObj = null;
                        initTopology ( treeNode.id );
                    }
                }
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
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

// / jqgrid start
function setColModel ()
{
    var colModel = [ {
        name : 'pvId',
        hidden : true
    }, {
        name : 'cnsgnCorprId',
        hidden : true
    }, {
        name : 'cntrctTyCd',
        hidden : true
    }, {
        name : 'cntrctBeginDt',
        hidden : true
    }, {
        name : 'cntrctTrmnatDt',
        hidden : true
    }, {
        name : 'cntrctTyCdNm',
        index : '',
        align : 'center',
        width : '300',
    }, {
        name : 'cnsgnCorprNm',
        index : '',
        align : 'center',
        width : '300'
    }, {
        name : 'trustCorprNm',
        index : '',
        align : 'center',
        width : '300',

    }, {
        name : 'cntrctPeriodDt',
        index : '',
        align : 'center',
        width : '316'
    } ];

    return colModel;
}

function jqGridBasic ( pvId )
{
    var colModel = setColModel ();

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/servicemgt/contract/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    pvId : pvId
                },
                height : 316,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ '', '', '', '', '', i18nMessage.msg_contractType, i18nMessage.msg_consignor,
                        i18nMessage.msg_trustee, i18nMessage.msg_contractTerm ],
                colModel : colModel,
                sortname : 'cntrctTyCdNm',
                sortorder : 'asc',
                multiselect : true,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '.gq_nodata' );
                    var $gridList = $ ( '#gridList' );
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();
                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var ids = $gridList.jqGrid ( "getDataIDs" );
                        // 계약기간 정의
                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridList.getRowData ( cl );

                            var cntrctPeriodDt = '';
                            if ( rowData.cntrctBeginDt !== null )
                            {
                                cntrctPeriodDt += rowData.cntrctBeginDt + ' ~ ';
                            }
                            if ( rowData.cntrctTrmnatDt !== null )
                            {
                                cntrctPeriodDt += rowData.cntrctTrmnatDt;
                            }

                            rowData.cntrctPeriodDt = cntrctPeriodDt;
                            $gridList.jqGrid ( 'setRowData', cl, rowData );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                name : 'cntrctInfo',
                                value : rowData.cntrctTyCd + ',' + rowData.cnsgnCorprId
                            } ).data ( 'menu-relate-count', rowData.menuRelateCount ).addClass ( 'cntrctInfos' );
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

                    location.href = contextPath + '/hom/servicemgt/contract/view.do?pvId=' + rowData.pvId
                            + '&cnsgnCorprId=' + rowData.cnsgnCorprId + '&cntrctTyCd=' + rowData.cntrctTyCd;
                }
            } );
}

// jqgird customize
function customizeJqgrid ( pvId )
{
    // jqgrid
    jqGridBasic ( pvId );
    if ( cntrctMgt.templates.noData !== null )
    {
        var template = _.template ( cntrctMgt.templates.noData );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid reload
function reloadJqgrid ( pvId )
{
    $ ( '#gridList' ).setGridParam ( {
        postData : {
            pvId : pvId,
        }
    } ).trigger ( 'reloadGrid' );
}

// jqgrid end

function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );
}

// 등록 버튼 눌렀을시에 현재 트리에서 선택한 발전소를 붙여서 보내야함
function setRegBtn ()
{
    var $btnReg = $ ( '#btn_reg' );
    $btnReg.on ( 'click', function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
        var checkedNodes = zTree.getCheckedNodes ( true );

        if ( checkedNodes.length > 0 )
        {
            var href = $ ( this ).attr ( 'href' );

            location.href = href + '&pvId=' + checkedNodes[0].id
        }

        return false;
    } );
}

// topology
function initTopology ( pvId )
{
    cntrctMgt.renderCount++;

    var data = getNodeAndEdge ( pvId );

    // 시그마 초기화
    var sigmaObj = new sigma ( {
        graph : data,
        renderer : {
            container : document.getElementById ( 'contract_sigma_container' ),
            type : 'canvas'
        },
        settings : {
            minNodeSize : 10,
            maxNodeSize : 30,
            mouseWheelEnabled : false,
            doubleClickEnabled : false,
            enableCamera : false,
            sideMargin : 6,
            labelHoverShadowColor : 'transparent',
            defaultLabelSize : 12,
            labelHoverBGColor : 'node',
            drawLabels : false
        }
    } );

    CustomShapes.init ( sigmaObj );
    sigmaObj.refresh ();

    // text 정의
    setNodeText ( sigmaObj );
    setNodeSubText ( sigmaObj );

    // sigma Object 전역변수에 할당 ( 리로드 할때 필요)
    cntrctMgt.sigmaObj = sigmaObj;
}

// node 자리에 html markup을 올린다
function setNodeText ( sigmaObj )
{
    var $contractSigmaContainer = $ ( '#contract_sigma_container' );
    var position = $contractSigmaContainer.position ();

    if ( cntrctMgt.templates.topologySpan !== null )
    {
        _.each ( sigmaObj.graph.nodes (), function ( node )
        {
            var left = node['renderer' + cntrctMgt.renderCount + ':x'] - 20;
            var top = node['renderer' + cntrctMgt.renderCount + ':y'] - 20;

            var classNm = cntrctMgt.classNm.branch;
            if ( node.isRoot )
            {
                classNm = cntrctMgt.classNm.root;
            }

            var template = _.template ( cntrctMgt.templates.topologySpan );
            var html = template ( {
                classNm : classNm,
                top : top,
                left : left,
                content : node.label
            } );

            $contractSigmaContainer.append ( html );
        } );
    } else
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_sentenceNotLoadedTemplate,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    }
}

// node 왼쪽 자리에 html markup을 올린다
function setNodeSubText ( sigmaObj )
{
    var $contractSigmaContainer = $ ( '#contract_sigma_container' );
    var position = $contractSigmaContainer.position ();

    if ( cntrctMgt.templates.topologySpan !== null )
    {
        _.each ( sigmaObj.graph.nodes (), function ( node )
        {
            if ( !node.isRoot )
            {
                var left = node['renderer' + cntrctMgt.renderCount + ':x'] - 170;
                var top = node['renderer' + cntrctMgt.renderCount + ':y'] - 20;

                var template = _.template ( cntrctMgt.templates.topologySpan );
                var html = template ( {
                    classNm : cntrctMgt.classNm.conType,
                    top : top,
                    left : left,
                    content : node.text
                } );

                var $html = $ ( html );
                $html.appendTo ( $contractSigmaContainer );

                // 2줄 이상 될 경우 높이 조정
                var lineHeight = parseInt ( $html.css ( 'line-height' ).replace ( 'px', '' ) );
                var top = 0;

                if ( !$.isNumeric ( lineHeight ) )
                {
                    lineHeight = 0;
                }

                if ( $html.height () > lineHeight )
                {
                    var outerHeight = $ ( '.con_type' ).eq ( 3 ).outerHeight ( true );

                    if ( $.isNumeric ( outerHeight ) && outerHeight > 0 )
                    {
                        outerHeight = outerHeight / 2;
                    } else
                    {
                        outerHeight = 0;
                    }

                    top = node['renderer' + cntrctMgt.renderCount + ':y'] - outerHeight;

                    $html.css ( 'top', top );
                }
            }
        } );
    } else
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_sentenceNotLoadedTemplate,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    }
}

// 노드와 엣지 데이터를 가져온다.
function getNodeAndEdge ( pvId )
{
    var data = {
        nodes : [],
        edges : []
    };

    var topologyData = setDepthOfTopologyData ( getTopologyData ( pvId ) );
    var nodeLocation = createNodeData ( topologyData );
    var nodeEdge = createEdgeData ( topologyData );

    var maxY = 0;
    $.each ( nodeLocation, function ( i, loc )
    {
        data.nodes.push ( {
            id : loc.id,
            label : loc.label,
            type : 'equilateral',
            data : loc.label,
            isRoot : loc.isRoot,
            text : loc.text,
            x : loc.x,
            y : loc.y,
            size : 20,
            color : 'transparent'
        } );

        if ( loc.y > maxY )
        {
            maxY = loc.y;
        }
    } );

    // 높이 조절
    var $contractSigmaContainer = $ ( '#contract_sigma_container' );
    if ( cntrctMgt.sigmaContainerDefaultHeight < maxY * cntrctMgt.interval.height )
    {
        $contractSigmaContainer.css ( 'height', (maxY * cntrctMgt.interval.height) + 'px' );
    } else
    {
        $contractSigmaContainer.css ( 'height', cntrctMgt.sigmaContainerDefaultHeight + 'px' );
    }

    $.each ( nodeEdge, function ( i, edge )
    {
        data.edges.push ( {
            id : 'e' + i,
            source : edge.source,
            target : edge.target,
            size : 10,
            type : 't',
            color : '#ccc'
        } );
    } );

    return data;
}

// node 데이터를 생성한다.
function createNodeData ( topologyData )
{
    var nodeLocation = null;
    if ( topologyData !== null && topologyData.length > 0 )
    {
        nodeLocation = [];
        var xInterval = cntrctMgt.interval.x;
        var yInterval = cntrctMgt.interval.y;

        // depth를 기준으로 그룹
        var groupDataArray = _.toArray ( _.groupBy ( topologyData, 'depth' ) );
        var map = new Map ();
        var totalCount = 0; // 2 depth의 위치를 계산하기 위함
        for ( var i = groupDataArray.length - 1, end = 0; i >= end; i-- )
        {
            var groupData = groupDataArray[i];
            var isRoot = false;
            $.each ( groupData, function ( index, data )
            {
                var x = 0;
                var y = 0;

                if ( data.depth === 3 )
                {
                    x = xInterval * 2;
                    y = yInterval * index;

                    var mapData = map.get ( data.cnsgnCorprId );
                    if ( typeof mapData === 'undefined' || mapData === null )
                    {
                        map.put ( data.cnsgnCorprId, 1 );
                    } else
                    {
                        map.put ( data.cnsgnCorprId, mapData + 1 );
                    }
                } else if ( data.depth === 2 )
                {
                    x = xInterval;
                    if ( index !== 0 )
                    {
                        y = yInterval * totalCount;
                    }

                    var mapData = map.get ( data.trustCorprId );
                    if ( typeof mapData === 'undefined' || mapData === null )
                    {
                        totalCount += 1;
                    } else
                    {
                        totalCount += parseInt ( map.get ( data.trustCorprId ) );
                    }
                } else if ( data.depth === 1 )
                {
                    isRoot = true;
                }

                nodeLocation.push ( {
                    id : data.trustCorprId,
                    label : data.trustCorprNm,
                    isRoot : isRoot,
                    text : data.cntrctTyCdNm,
                    x : x,
                    y : y
                } );
            } );
        }
    }

    return nodeLocation;
}

// edge를 생성한다.
function createEdgeData ( topologyData )
{
    var edges = null;
    if ( topologyData !== null && topologyData.length > 0 )
    {
        edges = [];
        _.each ( topologyData, function ( data )
        {
            if ( data.cnsgnCorprId !== '' )
            {
                edges.push ( {
                    source : data.cnsgnCorprId,
                    target : data.trustCorprId
                } );
            }
        } );
    }

    return edges;
}

// 토폴로지 관련 데이터의 depth를 셋팅
// 3depth 기준..
function setDepthOfTopologyData ( topologyData )
{
    if ( topologyData != null )
    {
        var depth = null;
        var rootData = _.find ( topologyData, function ( data )
        {
            return data.depth == 1;
        } );
        _.each ( topologyData, function ( originData )
        {
            if ( originData.cnsgnCorprId !== '' )
            {
                // depth 지정
                if ( rootData.trustCorprId === originData.cnsgnCorprId )
                {
                    originData.depth = 2;
                } else
                {
                    originData.depth = 3;
                }

                var cntrctTyCd = '';
                var cnsgnCntrctTyCd = '';
                if ( originData.cntrctTyCd !== null )
                {
                    cntrctTyCd = originData.cntrctTyCd;
                }
                if ( originData.cnsgnCntrctTyCd !== null )
                {
                    cnsgnCntrctTyCd = originData.cnsgnCntrctTyCd;
                }

                // depth에 따른 아이디 지정
                if ( originData.depth === 2 )
                {
                    originData.trustCorprId = cntrctTyCd + originData.trustCorprId + 2;
                } else
                {
                    originData.cnsgnCorprId = cnsgnCntrctTyCd + originData.cnsgnCorprId + 2;
                    originData.trustCorprId = cntrctTyCd + originData.trustCorprId + 3;
                }
            }
        } );
    }

    return getSortedTopologyData ( topologyData );
}

// depth기준 1차 정렬 후 2depth 기준으로 3depth만 다시 정렬
function getSortedTopologyData ( topologyData )
{
    topologyData = _.sortBy ( topologyData, 'depth' );
    // order 정의
    var startCount = 0;
    _.each ( topologyData, function ( data, i )
    {
        data.order = i;
        if ( data.depth === 2 )
        {
            startCount = i;
        }
    } );

    _.each ( topologyData, function ( data )
    {
        if ( data.depth == 2 )
        {
            // 2depth 기준으로 3depth 데이터 추출
            var threeDepthData = _.filter ( topologyData, function ( tempData )
            {
                return tempData.cnsgnCorprId === data.trustCorprId;
            } );

            // 3depth 순서정의
            _.each ( threeDepthData, function ( three )
            {
                three.order = ++startCount;
            } );
        }
    } );

    return _.sortBy ( topologyData, 'order' );
}

// 토폴로지 관련 데이터를 가져온다.
function getTopologyData ( pvId )
{
    var topologyData = null;
    $.ajax ( {
        url : contextPath + '/hom/servicemgt/contract/getTopologyData.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            pvId : pvId
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                topologyData = json.data;
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

    return topologyData;
}

// 탭 전환시 pvId 유지...
function setTabBtn ()
{
    var $cntrctMgtAcmsltBtn = $ ( '#cntrct_mgt_acmslt_btn' );
    $cntrctMgtAcmsltBtn.on ( 'click', function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
        var checkedNodes = zTree.getCheckedNodes ( true );

        if ( checkedNodes.length > 0 )
        {
            var href = $ ( this ).attr ( 'href' );

            location.href = href + '?pvId=' + checkedNodes[0].id;

            return false;
        }
    } );
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
    var $btnEdit = $ ( '#btn_edit' );
    var $btnCancel = $ ( '#btn_cancel' );
    var $btnGroupEdit = $ ( '#btn_group_edit' );
    var $btnGroupDelete = $ ( '#btn_group_delete' );

    $btnEdit.on ( 'click', function ()
    {
        var $gridList = $ ( '#gridList' );
        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

        $btnGroupEdit.addClass ( 'dnone' );
        $btnGroupDelete.removeClass ( 'dnone' );

        enableJqgridCheckbox ( $gridList, $checkboxs );
        $gridList.jqGrid ( 'sortableRows', true );
    } );

    $btnCancel.on ( 'click', function ()
    {
        var $gridList = $ ( '#gridList' );
        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

        $btnGroupEdit.removeClass ( 'dnone' );
        $btnGroupDelete.addClass ( 'dnone' );

        disableJqgridCheckbox ( $gridList, $checkboxs );
        $gridList.jqGrid ( 'sortableRows', false );
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

// 삭제 체크
function checkBtnDelete ()
{
    $ ( '#btn_delete' ).on (
            'click',
            function ()
            {
                var $that = $ ( this );
                var cntrctTyCdArr = [];
                var cnsgnCorprIdArr = [];

                $ ( '.cntrctInfos' ).each ( function ()
                {
                    if ( $ ( this ).prop ( 'checked' ) )
                    {
                        var cntrctInfo = $ ( this ).val ().split ( ',' );
                        cntrctTyCdArr.push ( cntrctInfo[0] );
                        cnsgnCorprIdArr.push ( cntrctInfo[1] );
                    }
                } );

                if ( cntrctTyCdArr.length === 0 || cnsgnCorprIdArr.length === 0 )
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
                    var $gridList = $ ( '#gridList' );
                    var ids = $gridList.jqGrid ( 'getDataIDs' );
                    var deletePvId = null;
                    for ( var i = 0, length = ids.length; i <= length; i++ )
                    {
                        var rowData = $gridList.getRowData ( ids[i] );

                        deletePvId = rowData.pvId;

                        break;
                    }

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
                                    location.href = $that.attr ( 'href' ) + '?pvId=' + deletePvId + '&cntrctTyCdArr='
                                            + cntrctTyCdArr.toString () + '&cnsgnCorprIdArr=' + cnsgnCorprIdArr;
                                }
                            } );
                }

                return false;
            } );
}

$ ( function ()
{
    cntrctMgt = {
        // 토폴로지 노드에 붙는 span의 class
        classNm : {
            root : 'root',
            branch : 'branch',
            conType : 'con_type'
        },
        // 템플릿 정의
        templates : {
            noData : getTemplate ( templates.noData ),
            topologySpan : getTemplate ( templates.topologySpan )
        },
        // 토폴로지 render 횟수
        renderCount : 0,
        sigmaObj : null,
        // sigma container의 기본 height
        sigmaContainerDefaultHeight : parseFloat ( $ ( '#contract_sigma_container' ).css ( 'height' ).replace ( 'px',
                '' ) ),
        // 토폴로지 노드의 interval 좌표, sigma container의 좌표당 interval 높이
        interval : {
            x : 70,
            y : 20,
            height : 12
        }
    };

    setEdgyStyle ();
    customizeTree ();
    customizeScroll ();
    showPopup ();
    setRegBtn ();
    setTabBtn ();

    switchButtonGroup ();
    checkMessage ();
    checkBtnDelete ();
} );