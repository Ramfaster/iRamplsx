/**
 * 트리 초기화
 */
function initTree ( data )
{
    // 트리메뉴
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
                zTree.checkNode ( treeNode, true, true );

                moveListPage ( treeNode );
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                zTree.selectNode ( treeNode );

                moveListPage ( treeNode );
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
}

/**
 * 발전소 설비 목록
 */
function getEqmtTreeList ()
{
    var eqmtId = $ ( "input[name=eqmtId]" ).val ();
    var adiEqmtId = $ ( "input[name=adiEqmtId]" ).val ();
    var mdlEqmtId = $ ( "input[name=mdlEqmtId]" ).val ();

    var ajaxParamEqmtId = mdlEqmtId;
    if ( typeof ajaxParamEqmtId === 'undefined' || ajaxParamEqmtId === '' )
    {
        ajaxParamEqmtId = adiEqmtId;
    }

    var params = {
        eqmtId : ajaxParamEqmtId,
        chkDisabled : false,
        treeType : staticVariable.treeTypeEqmtInfo
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
                var id = eqmtId + '|' + adiEqmtId;
                var node = null;
                if ( typeof mdlEqmtId !== 'undefined' )
                {
                    node = _.find ( json.data, function ( node )
                    {
                        return node.id === mdlEqmtId && node.pId === id;
                    } );
                } else
                {
                    node = _.find ( json.data, function ( node )
                    {
                        return node.id === id;
                    } );
                }

                if ( node !== null && typeof node !== 'undefined' )
                {
                    node.checked = true;
                }

                initTree ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNodes = zTree.getCheckedNodes ( true );
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

// 해당 리스트 페이지로 이동
function moveListPage ( treeNode )
{
    var children = treeNode.children;
    var param = null;
    if ( ((typeof children !== 'undefined' && children.length != 0) || treeNode.pId === staticVariable.eqmtTreeRoot)
            && treeNode.id !== staticVariable.eqmtTreeRoot )
    {
        location.href = contextPath + '/hom/masterdata/equipment/list.do?eqmtId=' + treeNode.id + '&eqmtGrpCd='
                + treeNode.eqmtGrpCd;
    }
}

// 자식이 없는 트리 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        var children = nodes[i].children;
        if ( nodes[i].id.indexOf ( 'STR' ) < 0
                && nodes[i].id.indexOf ( 'TRR' ) < 0
                && (((typeof children === 'undefined' || children.length == 0) && nodes[i].pId !== staticVariable.eqmtTreeRoot) || nodes[i].id === staticVariable.eqmtTreeRoot) )
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
// tree end

function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $select1 = $ ( '.select1' );

    $select1.select2 ( {
        language : language,
        enableMousewheel : false
    } );

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

function customizeSelectForm ()
{
    $ ( '.customize_select, .grnt_type, .bfrhd_ntcn_type' ).customizeSelect ( {
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
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.frm_con01, .frm_cont_wrap, .tbl_add_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
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

// 설비 기본 정보 유효성 체크
function validateRegForm ()
{
    var tpl = getTemplate ( templates.labelError );
    var $mdlEqmtStdrInfoMgtForm = $ ( '#mdlEqmtStdrInfoMgtForm' );
    $mdlEqmtStdrInfoMgtForm.validate ( {
        rules : {
            eqmtNm : {
                required : true,
                maxlength : 50
            },
            ptvltcmdlTyNo : {
                required : true,
                number : true
            },
            sn : {
                maxlength : 50
            },
            unitCpcty : {
                number : true
            },
            setupCpcty : {
                number : true
            }
        },
        messages : {
            eqmtNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredEqmtName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeEqmtName )
            },
            ptvltcmdlTyNo : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredModuleTypeNumber ),
                number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
            },
            sn : {
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSerialNumber )
            },
            unitCpcty : {
                number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
            },
            setupCpcty : {
                number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
            }
        },
        submitHandler : function ( form )
        {
            var $grntType = $ ( '.grnt_type' );
            var grntFlag = false;
            if ( $grntType.size () > 1 )
            {
                $grntType.each ( function ( index, type )
                {
                    if ( $ ( type ).val () === '' )
                    {
                        grntFlag = true;
                        return true;
                    }
                } );
            }

            if ( grntFlag )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validDataRequiredGuaranteeType,
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

// 리스트 href 셋팅
function setListHref ()
{
    var eqmtId = $ ( "input[name=eqmtId]" ).val ();
    var adiEqmtId = $ ( "input[name=adiEqmtId]" ).val ();
    var mdlEqmtId = $ ( "input[name=mdlEqmtId]" ).val ();

    var $btnList = $ ( '.btn_list' );
    var href = $btnList.attr ( 'href' ) + '?eqmtId=' + eqmtId + '|' + adiEqmtId + '&mdlEqmtId=' + mdlEqmtId;
    $btnList.attr ( 'href', href );
}

// 보증 기간 추가
function addGrntPd ()
{
    var tpl = getTemplate ( templates.grntPdDiv );

    var $addGrntPd = $ ( '#addGrntPd' );
    var $grntType = $ ( '.grnt_type' );
    var $tdGrntList = $ ( '#tdGrntList' );
    var $bfrhdNtcnType = $ ( '.bfrhd_ntcn_type' );

    var maxCount = 5;

    $addGrntPd.click ( function ()
    {
        var grntPdCount = $ ( '.sel_date_set' ).length;

        if ( grntPdCount < maxCount )
        {
            grntPdCount++;

            var template = _.template ( tpl );
            var html = template ( {
                i18nMessage : i18nMessage,
                grntPdNo : grntPdCount,
                grntTypeHtml : $grntType.html (),
                bfrhdNtcnTypeHtml : $bfrhdNtcnType.html ()
            } );

            $tdGrntList.append ( html );
            var grntPd = _.find ( $tdGrntList.find ( '.sel_date_set' ), function ( div )
            {
                return $ ( div ).data ( 'div-grnt-no' ) == grntPdCount;
            } );
            $ ( grntPd ).find ( '.grnt_type' ).val ( '' ).trigger ( 'change' );

            $ ( '.grnt_type, .bfrhd_ntcn_type' ).customizeSelect ( {
                width : 110,
                paddingHorizontal : 15,
                height : 30,
                color : '#3c3c3c',
                initClass : 'custom-form-select06',
                focusClass : 'custom-form-focused06',
                disableClass : 'custom-form-disabled06'
            } );

            customizeSelectForm ();
            initDatetimepicker ();
            checkGrntType ();
            deleteGrntPd ();
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validGrntPdInputNumberDown,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// 보증 기간 삭제
function deleteGrntPd ()
{
    var $removeGrntPd = $ ( '.removeGrntPd' );
    $removeGrntPd.unbind ( 'click' );
    $ ( '.removeGrntPd' ).on ( 'click', function ()
    {
        var $grntPd = $ ( this );

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
                $grntPd.closest ( '.sel_date_set' ).remove ();
            }
        } );
    } );
}

// 보증 기간 중복 체크
function checkGrntType ()
{
    var $grntTypes = $ ( '.grnt_type' );
    $grntTypes.on ( 'change', function ()
    {
        var $currGrntType = $ ( this );
        if ( $currGrntType.val () !== '' )
        {
            $grntTypes.each ( function ( index, type )
            {
                var $type = $ ( this );
                if ( $type.val () !== '' && $currGrntType.data ( 'grnt-no' ) !== $type.data ( 'grnt-no' )
                        && $type.val () === $currGrntType.val () )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertEquipmentGuaranteeCategorizationCodeDuplication,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );

                    $currGrntType.val ( '' ).trigger ( 'change' );

                    return false;
                }
            } );
        }
    } );
}

$ ( function ()
{
    customizeForm ();
    customizeSelectForm ();
    customizeScroll ();
    initDatetimepicker ();
    getEqmtTreeList ();
    validateRegForm ();
    setListHref ();
    addGrntPd ();
    deleteGrntPd ();
} );