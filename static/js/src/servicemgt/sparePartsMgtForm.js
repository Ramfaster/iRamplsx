var sparePartsMgt = null;

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
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

    // 통화단위 선택
    var $select1 = $ ( '#sel_crncyUnit' );
    $select1.select2 ();

    var flag = true;

    // select event
    $select1.on ( 'select2:open', function ( e )
    {
        if ( flag )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            flag = false;
        }
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
function initTreeList ()
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

                    $ ( '.tree_wrap' ).mCustomScrollbar ( 'update' );
                }
            }
        }
    };

    var params = {
        treeType : staticVariable.treeTypeNationPv
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

                var checkedNodes = zTree.getCheckedNodes ( true );

                setAllTreeNodeChkDisabled ( zTree, nodes, true );

                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                    setAllTreeNodeChkDisabled ( zTree, nodes, true );
                } else if ( checkedNodes.length === 0 )
                {
                    // check노드가 없을 경우 check 설정
                    $.each ( nodes, function ( i, node )
                    {
                        if ( node.id == paramPvId )
                        {
                            node.checked = true;
                            sparePartsMgt.pvId = node.id;

                            zTree.refresh ();
                            checkedNode = node;

                            zTree.selectNode ( checkedNode );
                            showTreeLocation ( zTree, checkedNode );
                            setAllTreeNodeChkDisabled ( zTree, nodes, true );
                            return false;
                        }
                    } );

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
    var cdNm = separateChar;
    if ( paramPreparprdClCdNm !== null && paramPreparprdClCdNm !== '' && paramPreparprdItemCdNm !== null
            && paramPreparprdItemCdNm !== '' )
    {
        cdNm += paramPreparprdClCdNm + separateChar + paramPreparprdItemCdNm;
    } else
    {
        cdNm += i18nMessage.msg_newRegister;
    }

    if ( nodeName !== null )
    {
        nodeName += separateChar + treeNode.name + cdNm;
    } else
    {
        nodeName = treeNode.name + cdNm;
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

// 모든 트리 노드 enable/disable 처리
function setAllTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        zTree.setChkDisabled ( nodes[i], disabled );
    }
}

function sparePartsValidate ()
{
    $ ( '#sparePartsForm' ).validate (
            {
                rules : {
                    sn : {
                        maxlength : 50
                    },
                    mnfcturDt : {
                        date : true
                    },
                    purchsDt : {
                        date : true
                    },
                    eqmtCpcty : {
                        number : true
                    },
                    setupCpcty : {
                        number : true
                    },
                    purchsPce : {
                        number : true
                    }
                },
                messages : {
                    sn : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSerialNumber )
                    },
                    mnfcturDt : {
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidManufactureDate )
                    },
                    purchsDt : {
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidStockedDate )
                    },
                    eqmtCpcty : {
                        number : makeValidateMessage ( i18nMessage.msg_validNumberEmqtCapacity )
                    },
                    setupCpcty : {
                        number : makeValidateMessage ( i18nMessage.msg_validNumberSetupCapacity )
                    },
                    purchsPce : {
                        number : makeValidateMessage ( i18nMessage.msg_validNumberPurchaseAmount )
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

function btnClick ()
{
    var $btnList = $ ( '#btnList' );

    $btnList.on ( 'click', function ()
    {
        var params = {
            pvId : sparePartsMgt.pvId,
            preparprdClCd : paramPreparprdClCd,
            preparprdItemCd : paramPreparprdItemCd,
            searchPreparprdClCd : paramSearchPreparprdClCd,
            searchPreparprdItemCd : paramSearchPreparprdItemCd
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

        return false;
    } );
}

// 기준 항목 초기화(등록 화면)
function spareTypeInitialization ()
{
    $ ( '#btnReset' ).click (
            function ()
            {
                $ ( 'form' ).each (
                        function ()
                        {
                            this.reset ();
                            $ ( 'input[type=text]:enabled, textarea:enabled, select:enabled' )
                                    .not ( ':input[readonly]' ).val ( '' );

                        } );

                $ ( 'label.error' ).remove ();
                $ ( '.frm_type' ).removeClass ( 'error' );
                $ ( '.customize_radio' ).trigger ( 'change' );
                $ ( '#sel_preparprdClCd, #sel_preparprdItemCd, #sel_corprId, #sel_modlNm, #sel_crncyUnit' ).trigger (
                        'change' );
            } );

}
$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    sparePartsMgt = {
        pvId : paramPvId,
        preparprdClCd : paramPreparprdClCd,
        preparprdItemCd : paramPreparprdItemCd
    }
    initDatetimepicker ();
    customizeForm ();
    initTreeList ();
    customizeScroll ();
    sparePartsValidate ();
    btnClick ();
    spareTypeInitialization ();

} );