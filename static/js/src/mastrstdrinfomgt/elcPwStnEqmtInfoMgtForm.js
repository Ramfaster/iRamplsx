var parntsItemMgtSeq = -1; // 부모 항목 관리 번호
var $parntsItem = null; // 부모 항목
var itemInfo = null; // 수정시 해당 항목 정보

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $dateType1 = $ ( '.customize_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $dateType2 = $ (
            '#selectBsnsRng, #attrbCd, #cmmnClCdList, .grnt_type, #eqmtItemCdList, #eqmtGrpCd, #parntsEqmtId, #corprId, #cmmnCdList, #eqmtStdrAt, .bfrhd_ntcn_type' )
            .customizeSelect ( {
                width : 110,
                paddingHorizontal : 15,
                height : 30,
                color : '#3c3c3c',
                initClass : 'custom-form-select06',
                focusClass : 'custom-form-focused06',
                disableClass : 'custom-form-disabled06'
            } );

    var $selType3 = $ ( '.sel_type_file' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

    $ ( '#imgFile' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25,
        enableInitButton : true,
        initButtonBackgroundImage : contextPath + '/css/lib/customizeForm/img/img_close_btn01.png'
    } );

    // 통화단위 선택
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

    if ( $ ( '#eqmtGrpCd' ).val ().indexOf ( "EQGR" ) > -1 )
    {
        $ ( '#selectBsnsRng' ).val ( 'CDK-COM-021' );
    } else
    {
        $ ( '#selectBsnsRng' ).val ( 'CDK-COM-092' );
    }

    $ ( '#selectBsnsRng' ).trigger ( 'change' );

    $ ( '#selectBsnsRng' ).change ( function ()
    {
        var searchEqmtGrpCd = $ ( '#selectBsnsRng' ).val ();
        getEqmtGrpCd ( searchEqmtGrpCd );
        getParntsEqmtList ( searchEqmtGrpCd );

    } );

    $ ( '#toDay' ).text ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDDHHMM ) );
}

/**
 * 설비 그룹 목록 조회
 */
function getEqmtGrpCd ( searchEqmtGrpCd )
{

    var params = {
        searchEqmtGrpCd : searchEqmtGrpCd,
    };

    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/getEqmtGrpCd.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var option = "";
                $.each ( json.data, function ( index, item )
                {
                    if ( lang === locale.korea || lang === locale.korean )
                    {
                        option += "<option value='" + item.cdId + "'>" + item.cdKorNm + "</option>";
                    } else
                    {
                        option += "<option value='" + item.cdId + "'>" + item.cdEngNm + "</option>";
                    }
                } );

                $ ( '#eqmtGrpCd' ).empty ().html ( option );

                $ ( '#eqmtGrpCd' ).trigger ( 'change' );

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
 * 설비 그룹 목록 조회
 */
function getParntsEqmtList ( searchEqmtGrpCd )
{

    var params = {
        searchEqmtGrpCd : searchEqmtGrpCd,
    };

    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/getParntsEqmtList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var option = "";
                $.each ( json.data, function ( index, item )
                {
                    if ( lang === locale.korea || lang === locale.korean )
                    {
                        option += "<option value='" + item.eqmtId + "'>" + item.eqmtKorNm + "</option>";
                    } else
                    {
                        option += "<option value='" + item.eqmtId + "'>" + item.eqmtEngNm + "</option>";
                    }
                } );

                $ ( '#parntsEqmtId' ).empty ().html ( option );

                $ ( '#parntsEqmtId' ).trigger ( 'change' );

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
 * 셀렉트 박스 customize
 */
function customizeSelect ()
{
    var $dateType1 = $ ( '#attrbCd, #cmmnClCdList, #cmmnCdList, .grnt_type, #eqmtItemCdList' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );
}

function fileCustomizeForm ()
{
    // custom form
    $ ( '.files' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 230,
        height : 25,
        enableInitButton : true,
        initButtonBackgroundImage : contextPath + '/css/lib/customizeForm/img/img_close_btn01.png'
    } );

    $ ( '.sel_type_file' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );
}

function fileCustomizeScroll ()
{
    // custom scroll
    $ ( '.scroll_wrap' ).mCustomScrollbar ( {
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

    $ ( '#eqmt_cont_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );

    $ ( '.tbl_add_wrap' ).mCustomScrollbar ( {
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
function initTree ( data )
{
    // 트리메뉴
    var setting = {
        view : {
            selectedMulti : false,
            showIcon : false,
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
            beforeClick : function beforeClick ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                zTree.checkNode ( treeNode, true, true );

                moveListPage ( treeNode );
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                zTree.checkNode ( treeNode, true, true );

                moveListPage ( treeNode );
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
            selectedMulti : false,
            showIcon : false,
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
            beforeClick : function beforeClick ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
                zTree.checkNode ( treeNode, true, true );

                moveListPage ( treeNode );
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
                zTree.checkNode ( treeNode, true, true );

                moveListPage ( treeNode );
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList2' ), setting, data );
}

/**
 * 설비 트리 목록
 */
function getEqmtTreeList ()
{
    var eqmtId = $ ( "input[name=eqmtId]" ).val ();
    var params = {
        eqmtId : eqmtId,
        chkDisabled : true,
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
                var node = _.find ( json.data, function ( node )
                {
                    return node.id === eqmtId;
                } );

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

/**
 * 설비 트리 목록
 */
function getEqmtTreeList2 ()
{
    var eqmtId = $ ( "input[name=eqmtId]" ).val ();
    var params = {
        eqmtId : eqmtId,
        chkDisabled : true,
        treeType : staticVariable.treeTypeEssEqmtInfo
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
                var node = _.find ( json.data, function ( node )
                {
                    return node.id === eqmtId;
                } );

                if ( node !== null && typeof node !== 'undefined' )
                {
                    node.checked = true;
                }

                initTree2 ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
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

// 신규 등록 시 새 항목 노드 추가
function addTreeNode ( zTree )
{
    var eqmtId = $ ( "input[name=eqmtId]" ).val ();
    if ( (eqmtId === null || eqmtId === '') && eqmtId !== null )
    {
        var parentNode = zTree.getNodeByParam ( 'id', eqmtId );

        if ( parentNode !== null )
        {
            var checkedNodes = zTree.getCheckedNodes ( true );
            if ( checkedNodes.length > 0 )
            {
                zTree.checkNode ( checkedNodes[0], false, false );
            }

            zTree.addNodes ( parentNode, {
                name : '새 항목',
                checked : true,
                chkDisabled : true
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

// 설비 그룹이 인버터/접속반/CCTV/판넬구성/모니터링시스템/현장사무실 인지 여부
function isSubEqmtGrpCd ( eqmtGrpCd )
{
    var flag = false;

    if ( (eqmtGrpCd === "EQGR05") || (eqmtGrpCd === "EQGR07") || (eqmtGrpCd === "EQGR16") || (eqmtGrpCd === "EQGR12")
            || (eqmtGrpCd === "EQGR18") || (eqmtGrpCd === "EQGR19") || (eqmtGrpCd === "ESGR11") )
    {
        flag = true;
    }

    return flag;
}

/**
 * 설비 종류에 따른 입력 폼 초기화
 */
function initEqmtRegForm ()
{
    var eqmtGrpCd = $ ( 'input[name=paramEqmtGrpCd]' ).val ();
    var $itemNmWrap = $ ( '#itemNmWrap' );
    var $eqmtItemCdListWrap = $ ( '#eqmtItemCdListWrap' );
    var tpl = getTemplate ( templates.attrbCdOption );

    // 설비 그룹에 대한 항목 속성 코드
    if ( isSubEqmtGrpCd ( eqmtGrpCd ) )
    {
        $eqmtItemCdListWrap.removeClass ( 'dnone' );
        $itemNmWrap.addClass ( 'dnone' );

        createEqmtItemCdList ( eqmtGrpCd );
        createAttrbCdList ( tpl, true );
    } else
    {
        $eqmtItemCdListWrap.addClass ( 'dnone' );
        $itemNmWrap.removeClass ( 'dnone' );

        createAttrbCdList ( tpl, false );
    }
}

// 설비 기본 정보 유효성 체크
function validateRegForm ()
{
    var tpl = getTemplate ( templates.labelError );
    $ ( '#eqmtStdrInfoMgtForm' ).validate (
            {
                rules : {
                    eqmtKorNm : {
                        required : true,
                        maxlength : 50
                    },
                    eqmtEngNm : {
                        required : true,
                        maxlength : 50
                    },
                    eqmtGrpCd : {
                        required : true
                    },
                    parntsEqmtId : {
                        required : true
                    },
                    eqmtCpcty : {
                        number : true
                    },
                    purchsDt : {
                        date : true
                    },
                    mnfcturDt : {
                        date : true
                    },
                    purchsPce : {
                        maxlength : 10,
                        number : true
                    }
                },
                messages : {
                    eqmtKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredEqmtKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeEqmtKoreanName )
                    },
                    eqmtEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredEqmtEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeEqmtEnglishName )
                    },
                    eqmtGrpCd : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredEqmtGrpCd )
                    },
                    parntsEqmtId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredParentEqmtId )
                    },
                    eqmtCpcty : {
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    },
                    purchsDt : {
                        date : makeValidateMessage ( i18nMessage.msg_validDatePurchsDt )
                    },
                    mnfcturDt : {
                        date : makeValidateMessage ( i18nMessage.msg_validDateMnfcturDt )
                    },
                    purchsPce : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredPurchsPce ),
                        number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
                    }
                },
                submitHandler : function ( form )
                {
                    // 문서 파일 타입, file 선택여부
                    var $addFileList = $ ( '.add_file_list' );
                    var $addFileListLi = $ ( 'li', $addFileList );
                    var fileFlag = false;
                    _.each ( $addFileListLi, function ( li )
                    {
                        var $li = $ ( li );
                        var $selTypeFile = $li.find ( '.sel_type_file' );
                        var $customizeFile = $li.find ( '.customizeFile' );

                        if ( $selTypeFile.val () === '' && $customizeFile.val () !== '' )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validDataRequiredAttachedFileKind,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            fileFlag = true;
                            return true;
                        } else if ( $selTypeFile.val () !== '' && $customizeFile.val () === '' )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validDataRequiredAttachedFile,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            fileFlag = true;
                            return true;
                        }
                    } );

                    if ( fileFlag )
                    {
                        return;
                    }

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

/**
 * 공통코드 목록 조회
 */
function getCmmnCdList ()
{
    var $cmmnClCdList = $ ( '#cmmnClCdList' );

    $cmmnClCdList.on ( 'change', function ()
    {
        var clCd = $ ( this ).val ();

        if ( $ ( this ).val () !== "" )
        {
            selectCmmnCdListAjax ( clCd );
        }
    } );
}

// ajax
function selectCmmnCdListAjax ( clCd )
{
    var deferred = $.Deferred ();
    var $cmmnCdList = $ ( '#cmmnCdList' );

    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/selectCmmnCdList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            clCd : clCd
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var datas = json.data;
                if ( datas !== null && datas.length > 0 )
                {
                    $cmmnCdList.empty ();
                    $cmmnCdList.append ( '<option value="">' + i18nMessage.msg_selection + '</option>' );
                    _.each ( datas, function ( item )
                    {
                        if ( lang == locale.korea || lang == locale.korean )
                        {
                            $cmmnCdList.append ( '<option value="' + item.cdId + '">' + item.cdKorNm + '</option>' );
                        } else
                        {
                            $cmmnCdList.append ( '<option value="' + item.cdId + '">' + item.cdEngNm + '</option>' );
                        }
                    } );
                    $cmmnCdList.trigger ( 'change' );
                    deferred.resolve ();
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

    return deferred.promise ();
}

/**
 * 입력된 항목 초기화
 */
function resetRegForm ()
{
    $ ( '#btnReset' ).on ( 'click', function ()
    {
        $ ( 'form' ).each ( function ()
        {
            this.reset ();
            $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
        } );

        $ ( "#eqmtGrpCd option:eq(0)" ).prop ( "selected", "selected" );
        $ ( "#parntsEqmtId option:eq(0)" ).prop ( "selected", "selected" );
        $ ( "#crncyUnit option:eq(0)" ).prop ( "selected", "selected" );
        $ ( '.grnt_type' ).find ( 'option:eq(0)' ).prop ( "selected", "selected" );
        $ ( '.sel_type_file' ).find ( 'option:eq(0)' ).prop ( "selected", "selected" );

        $ ( '#eqmtGrpCd' ).trigger ( 'change' );
        $ ( '#parntsEqmtId' ).trigger ( 'change' );
        $ ( '#crncyUnit' ).trigger ( 'change' );
        $ ( '.grnt_type' ).trigger ( 'change' );
        $ ( '.sel_type_file' ).trigger ( 'change' );
        $ ( '.select1' ).trigger ( 'change.select2' );

        $ ( 'label.error' ).remove ();
        $ ( '.frm_type' ).removeClass ( 'error' );
    } );
}

/**
 * 보증 기간 추가
 */
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

            fileCustomizeScroll ();
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

/**
 * 보증 기간 삭제
 */
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

/**
 * 해당 설비에 대한 항목 유형 코드 목록을 가져온다.
 * 
 * @param eqmtGrpCd
 *            설비그룹 코드
 */
function createEqmtItemCdList ( paramEqmtGrpCd )
{
    var tpl = getTemplate ( templates.eqmtItemCdListOption );
    var eqmtGrpCd = paramEqmtGrpCd;

    if ( eqmtGrpCd === null || eqmtGrpCd === '' )
    {
        eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    }

    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/selectEqmtItemCdList.ajax',
        type : 'GET',
        dataType : 'json',
        data : {
            eqmtGrpCd : eqmtGrpCd
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( json.data.length > 0 )
                {

                    if ( tpl !== null )
                    {
                        var $eqmtItemCdList = $ ( '#eqmtItemCdList' );
                        $eqmtItemCdList.empty ();
                        var template = _.template ( tpl );
                        var html = template ( {
                            eqmtItemCdList : json.data,
                            lang : lang,
                            locale : locale
                        } );

                        $eqmtItemCdList.append ( html );
                        $eqmtItemCdList.val ( '' ).trigger ( 'change' );
                    }
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

// 속성 코드
function createAttrbCdList ( tpl, isSubEqmtGrpCd )
{
    var $attrbCd = $ ( '#attrbCd' );
    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/selectAttrbCdList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var data = json.data;
                if ( tpl !== null && data.length > 0 )
                {
                    $attrbCd.empty ();
                    var template = _.template ( tpl );
                    var html = template ( {
                        isSubEqmtGrpCd : isSubEqmtGrpCd,
                        attrbCdList : data,
                        lang : lang,
                        locale : locale
                    } );

                    $attrbCd.append ( html );
                    $attrbCd.val ( '' ).trigger ( 'change' );
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
 * 설비 그룹에 의한 설비별 항목 코드 목록을 가져온다.
 */
function getEqmtItemCdList ()
{
    var $itemNmWrap = $ ( '#itemNmWrap' );
    var $eqmtItemCdListWrap = $ ( '#eqmtItemCdListWrap' );
    var tpl = getTemplate ( templates.attrbCdOption );

    $ ( '#eqmtGrpCd' ).change ( function ()
    {
        var eqmtGrpCd = $ ( this ).val ();

        if ( isSubEqmtGrpCd ( eqmtGrpCd ) )
        {
            $itemNmWrap.addClass ( 'dnone' );
            $eqmtItemCdListWrap.removeClass ( 'dnone' );

            createEqmtItemCdList ( eqmtGrpCd );
            createAttrbCdList ( tpl, true );

        } else
        {
            $itemNmWrap.removeClass ( 'dnone' );
            $eqmtItemCdListWrap.addClass ( 'dnone' );

        }
    } );
}

/**
 * 커스텀 셀렉트 삭제
 * 
 * @param 셀렉트
 *            객체
 */
function removeCustomSelect ( $selector )
{
    var $prevSelector = $selector.prev ();
    if ( $prevSelector.is ( 'span' ) )
    {
        $prevSelector.remove ();
    }
}

/**
 * 보증 타입 중복 체크
 */
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
                        // '설비 보증 유형을 중복으로 입력하실
                        // 수 없습니다.',
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

// 첨부파일 처리 하기
function checkFileSize ()
{
    var maxFileSize = 10 * 1024 * 1024;
    var flag = true;

    $ ( '.customizeFile' ).on ( 'change propertychange', function ()
    {
        var that = this;
        if ( maxFileSize < that.files[0].size )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validFileInputSizeDown,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        // 포함되는 확장자가 없는 경우
        if ( !homUtil.checkFileExtension ( that.files[0].name, homUtil.fileExtensionFormat.general ) )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : homUtil.fileExtensionFormat.general + i18nMessage.msg_validFileInputExtension,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        return flag;
    } );
}

// 첨부파일 input 추가
function addFileInput ()
{
    var fileCount = 10;
    var liTpl = getTemplate ( templates.inputFileLi );
    var $addFile = $ ( '#add_file' );
    var disableFlag = false;
    var $selTypeFile = $ ( '.sel_type_file' );

    if ( !disableFlag )
    {
        $addFile.click ( function ()
        {
            var liCount = $ ( '.add_file_list li' ).size ();
            var $addFileList = $ ( '.add_file_list' );
            var $fileList = $ ( '.file_list li' );

            if ( liCount < fileCount - $fileList.size () )
            {
                liCount++;
                if ( liCount == fileCount - $fileList.size () )
                {
                    disableFlag = true;
                    $addFile.addClass ( 'dis' );
                }

                var template = _.template ( liTpl );
                var html = template ( {
                    fileNo : liCount,
                    selTypeHtml : $selTypeFile.html ()
                } );

                $addFileList.append ( html );

                fileCustomizeForm ();

                deleteFileInput ();
                checkFileSize ();
            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validFileInputNumberDown,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }

        } );
    }
}

// 첨부파일 input 삭제
function deleteFileInput ()
{
    var $deleteFile = $ ( '.delete_file' );
    $deleteFile.unbind ( 'click' );
    $deleteFile.click ( function ()
    {
        var that = $ ( this );

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
                that.closest ( 'li' ).remove ();

                var $addFile = $ ( '#add_file' );
                $addFile.removeClass ( 'dis' );
            }
        } );
    } );

}

// 메인 이미지 삭제 부분 하기
function deleteMainImage ()
{
    var tpl = getTemplate ( templates.labelError );
    var $btnMainImageDelete = $ ( '.btn_main_image_delete' );
    var $addImg = $ ( '.add_img' );

    $btnMainImageDelete.on ( 'click', function ()
    {
        var $that = $ ( this );

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
                $.ajax ( {
                    url : $that.attr ( 'href' ),
                    type : 'GET',
                    dataType : 'json',
                    success : function ( json )
                    {
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {
                            $addImg.empty ();
                        } else if ( json.status === staticVariable.jsonStatusError )
                        {
                            $addImg.parent ().find ( 'label' ).remove ();

                            if ( tpl !== null )
                            {
                                var template = _.template ( tpl );
                                var html = template ( {
                                    id : 'file_delete',
                                    message : json.message,
                                    isLeft : false
                                } );
                                $addImg.parent ().append ( html );
                            }
                        }
                    },
                    error : function ( xhr, textStatus, error )
                    {
                        // abort error
                        // not show(user
                        // request
                        // cancel or
                        // aborted)
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

        return false;
    } );
}

// 파일 제거
function deleteFile ()
{
    var tpl = getTemplate ( templates.labelError );
    var $btnFileDelete = $ ( '.btn_file_delete' );

    // $btnFileDelete.unbind ( 'click' );
    $btnFileDelete.click ( function ()
    {
        var $that = $ ( this );

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
                var $li = $that.closest ( 'li' );
                $.ajax ( {
                    url : $that.attr ( 'href' ),
                    type : 'GET',
                    dataType : 'json',
                    success : function ( json )
                    {
                        var $li = $that.closest ( 'li' );
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {
                            $li.remove ();
                            $li.find ( 'label' ).remove ();
                        } else if ( json.status === staticVariable.jsonStatusError )
                        {
                            $li.find ( 'label' ).remove ();

                            if ( tpl !== null )
                            {
                                var template = _.template ( tpl );
                                var html = template ( {
                                    id : 'file_delete',
                                    message : json.message,
                                    isLeft : false
                                } );
                                $li.append ( html );
                            }
                        }
                    },
                    error : function ( xhr, textStatus, error )
                    {
                        // abort error not
                        // show(user request
                        // cancel or aborted)
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

        return false;
    } );
}

// 항목 관련
/**
 * 속성 변경에 따른 입력 항목 변경
 */
function changeInputItemByAttrb ()
{
    // 속성 선택 시
    var $attrbCd = $ ( '#attrbCd' );

    var $codeItem = $ ( '#codeItem' );
    var $textItem = $ ( '#textItem' );
    var $subItemText = $ ( '#subItemText' );
    var $fileItem = $ ( '#fileItem' );
    var $itemFile = $ ( '#itemFile' );
    $attrbCd.change ( function ()
    {
        var attrbCd = $ ( this ).val ();

        if ( attrbCd === '' )
        {
            $codeItem.addClass ( 'dnone' );
            $textItem.addClass ( 'dnone' );
            $subItemText.addClass ( 'dnone' );
            $fileItem.addClass ( 'dnone' );
        } else
        {
            if ( attrbCd === 'IT01' ) // 코드
            {
                $codeItem.removeClass ( 'dnone' );
                $textItem.addClass ( 'dnone' );
                $subItemText.addClass ( 'dnone' );
                $fileItem.addClass ( 'dnone' );
            } else if ( attrbCd === 'IT02' ) // 텍스트
            {
                $textItem.removeClass ( 'dnone' );
                $textItem.find ( '#itemText' ).val ( '' );
                $codeItem.addClass ( 'dnone' );
                $subItemText.addClass ( 'dnone' );
                $fileItem.addClass ( 'dnone' );
            } else if ( attrbCd === 'IT03' ) // 버튼
            {
                $subItemText.removeClass ( 'dnone' );
                $codeItem.addClass ( 'dnone' );
                $textItem.addClass ( 'dnone' );
                $fileItem.addClass ( 'dnone' );
            }

            // 파일은 처리 하지 않음
            // else
            // {
            // $itemFile.customizeFile ( {
            // buttonType : 'bg_sprite',
            // buttonText : i18nMessage.msg_fileRegister,
            // buttonSpriteClass : 'btn_file01',
            // buttonTextColor : '#4c4743',
            // buttonWidth : 90,
            // textWidth : 280,
            // height : 25,
            // enableInitButton : true,
            // initButtonBackgroundImage : contextPath +
            // '/css/lib/customizeForm/img/img_close_btn01.png'
            // } );
            //
            // $fileItem.removeClass ( 'dnone' );
            //
            // $codeItem.addClass ( 'dnone' );
            // $subItemText.addClass ( 'dnone' );
            // $textItem.addClass ( 'dnone' );
            // }
        } // end if else
    } );
}

// 항목 관리 번호 자동채번
function selectItemMgtSeq ()
{
    var itemMgtSeq = null;
    var itemMgtSeqStr = null;
    var $tbAddItemTr = $ ( '#tbAddItem tr' );
    if ( $tbAddItemTr.length > 0 )
    {
        var itemMgtSeqs = [];
        _.each ( $tbAddItemTr, function ( tr )
        {
            itemMgtSeqs.push ( $ ( tr ).find ( '.itemMgtSeq' ).val () );
        } );
        itemMgtSeqStr = itemMgtSeqs.toString ();
    }

    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/selectItemMgtSeq.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            itemMgtSeqs : itemMgtSeqStr
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                itemMgtSeq = json.data.itemMgtSeq;
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

    return itemMgtSeq;
}

// 항목 그룹 번호 자동채번
function selectItemGrpSeq ()
{
    var itemGrpSeq = null;
    var itemGrpSeqStr = null;
    var $tbAddItemTr = $ ( '#tbAddItem tr' );
    if ( $tbAddItemTr.length > 0 )
    {
        var itemGrpSeqs = [];
        _.each ( $tbAddItemTr, function ( tr )
        {
            itemGrpSeqs.push ( $ ( tr ).find ( '.itemGrpSeq' ).val () );
        } );
        itemGrpSeqStr = _.uniq ( itemGrpSeqs ).toString ();
    }

    $.ajax ( {
        url : contextPath + '/hom/masterdata/equipment/selectItemGrpSeq.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            itemGrpSeqs : itemGrpSeqStr
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                itemGrpSeq = json.data.itemGrpSeq;
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

    return itemGrpSeq;
}

// 항목 추가
function addItem ()
{
    var $btnItemAdd = $ ( '#btnItemAdd' );
    var $itemNm = $ ( '#itemNm' );
    var $attrbCd = $ ( '#attrbCd' );
    var $itemText = $ ( '#itemText' );
    var $cmmnClCdList = $ ( '#cmmnClCdList' );
    var $cmmnCdList = $ ( '#cmmnCdList' );
    var $eqmtItemCdList = $ ( '#eqmtItemCdList' );

    var $isUpdateItem = $ ( '#isUpdateItem' );
    var $updateItemMgtSeq = $ ( '#updateItemMgtSeq' );

    var $tbAddItem = $ ( '#tbAddItem' );
    var itemTrTpl = getTemplate ( templates.itemTr );

    $btnItemAdd.on ( 'click', function ()
    {
        var $cdInfo = $ ( ':selected', $cmmnCdList );
        var hideItemNmFlag = $itemNm.parent ().hasClass ( 'dnone' );
        var $selectedEqmtItemCd = $ ( ':selected', $eqmtItemCdList );

        if ( !hideItemNmFlag && $itemNm.val () === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                // message : i18nMessage.msg_validAttribute,
                message : i18nMessage.msg_validRequiredItemName,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            $itemNm.focus ();
        } else if ( hideItemNmFlag && $eqmtItemCdList.val () === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validRequiredItemName,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else if ( $attrbCd.val () === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validAttribute,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else if ( $attrbCd.val () === 'IT02' && $itemText.val () === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validRequiredItemValue,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            $itemText.focus ();
        } else if ( $attrbCd.val () === 'IT01' && ($cmmnClCdList.val () === '' || $cdInfo.val () === '') )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validEquipmentCommnclcdId,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            var itemVal = '';
            var itemValTxt = '';
            var selectedCmmnClCdVal = '';
            var itemCd = '';
            var itemNm = '';

            if ( !hideItemNmFlag )
            {
                if ( $attrbCd.val () === 'IT01' )
                {
                    itemCd = $cdInfo.val ();
                    itemVal = $cdInfo.text ();
                    selectedCmmnClCdVal = $cmmnClCdList.val ();
                } else if ( $attrbCd.val () === 'IT02' )
                {
                    itemVal = $itemText.val ();
                }
                itemNm = $itemNm.val ();
            } else
            {
                if ( $attrbCd.val () === 'IT02' )
                {
                    itemVal = $itemText.val ();
                }
                itemNm = $selectedEqmtItemCd.text ();
                itemCd = $selectedEqmtItemCd.val ();
                selectedCmmnClCdVal = $selectedEqmtItemCd.data ( 'cl-cd' );
            }

            // 수정 처리
            if ( $isUpdateItem.val () == 'true' )
            {
                var param = {
                    itemNm : itemNm,
                    itemVal : itemVal,
                    attrbCd : $attrbCd.val (),
                    eqmtClCd : selectedCmmnClCdVal,
                    itemCd : itemCd,
                    isNewItem : false
                };

                updateSelectedItem ( $updateItemMgtSeq.val (), $tbAddItem.find ( 'tr' ), param );
            }
            // 추가 처리
            else if ( itemTrTpl !== null )
            {
                // 신규등록
                if ( $updateItemMgtSeq.val () === '' )
                {
                    // 루트 항목 추가 처리
                    var itemMgtSeqParam = selectItemMgtSeq ();
                    var itemGrpSeqParam = selectItemGrpSeq ();
                    var template = _.template ( itemTrTpl );
                    var params = {
                        itemChildCount : 1,
                        itemKorNm : itemNm,
                        itemMgtSeq : itemMgtSeqParam,
                        itemGrpSeq : itemGrpSeqParam,
                        attrbCd : $attrbCd.val (),
                        itemLvl : 1,
                        parntsItemMgtSeq : -1,
                        ordr : '0',
                        eqmtClCd : selectedCmmnClCdVal,
                        itemCd : itemCd,
                        itemVal : itemVal,
                        msg_subItem : i18nMessage.msg_subItem,
                        isNewItem : true
                    };
                    var html = template ( params );

                    $tbAddItem.find ( 'tbody' ).append ( html );
                }
                // 하위 항목 추가 처리
                else
                {
                    var param = {
                        itemNm : itemNm,
                        itemVal : itemVal,
                        attrbCd : $attrbCd.val (),
                        eqmtClCd : selectedCmmnClCdVal,
                        itemCd : itemCd,
                        isNewItem : true
                    };
                    addSubItem ( itemTrTpl, $updateItemMgtSeq.val (), $tbAddItem.find ( 'tr' ), param );
                }
            }

            setItemOrdr ();
            itemMoveUp ();
            itemMoveDown ();
            removeItem ();
            setSubItem ();
            setUpdateItem ();
            $ ( '#btnItemMgtInfoReset' ).click (); // reset call
        }
    } );
}

// 선택된 항목을 수정
function updateSelectedItem ( itemMgtSeq, $tbAddItemTr, param )
{
    var selectedTr = _.find ( $tbAddItemTr, function ( tr )
    {
        return $ ( tr ).find ( '.itemMgtSeq' ).val () === itemMgtSeq;
    } );

    if ( typeof selectedTr !== 'undefined' )
    {
        var $selectedTr = $ ( selectedTr );
        $selectedTr.find ( '.itemKorNm' ).val ( param.itemNm );
        $selectedTr.find ( '.attrbCd' ).val ( param.attrbCd );
        $selectedTr.find ( '.eqmtClCd' ).val ( param.eqmtClCd );
        $selectedTr.find ( '.itemCd' ).val ( param.itemCd );
        $selectedTr.find ( '.itemVal' ).val ( param.itemVal );

        $selectedTr.find ( '.tit' ).text ( param.itemNm );
        $selectedTr.find ( '.c_txt' ).text ( param.itemVal );
    }
}

// 하위 항목 추가
function addSubItem ( itemTrTpl, itemMgtSeq, $tbAddItemTr, param )
{
    var $currentTr = null;
    _.each ( $tbAddItemTr, function ( tr )
    {
        var $tr = $ ( tr );
        if ( $tr.find ( '.itemMgtSeq' ).val () === itemMgtSeq )
        {
            $currentTr = $tr;

            return false;
        }
    } );

    if ( $currentTr !== null )
    {
        var itemMgtSeqParam = selectItemMgtSeq ();
        var templateParam = {
            itemChildCount : 1,
            itemKorNm : param.itemNm,
            itemMgtSeq : itemMgtSeqParam,
            itemGrpSeq : $currentTr.find ( '.itemGrpSeq' ).val (),
            attrbCd : param.attrbCd,
            itemLvl : $currentTr.data ( 'item-lvl' ) + 1,
            parntsItemMgtSeq : $currentTr.find ( '.itemMgtSeq' ).val (),
            ordr : '0',
            eqmtClCd : param.eqmtClCd,
            itemCd : param.itemCd,
            itemVal : param.itemVal,
            msg_subItem : i18nMessage.msg_subItem,
            isNewItem : param.isNewItem
        };

        if ( $currentTr.data ( 'item-lvl' ) == 1 )
        {
            $currentTr.find ( 'th' ).attr ( 'rowspan', parseInt ( $currentTr.find ( 'th' ).attr ( 'rowspan' ) ) + 1 );
            var $lastTr = getLastTr ( $currentTr, $tbAddItemTr );

            var template = _.template ( itemTrTpl );
            var html = template ( templateParam );

            // template적용하여 $lastTr에 붙이기
            $lastTr.after ( html );
        } else
        {
            var topItem = _.find ( $tbAddItemTr, function ( tr )
            {
                // parntsItemMgt로 하위 item 필터링 하기
                return $currentTr.data ( 'item-grp-seq' ) === $ ( tr ).data ( 'item-grp-seq' )
                        && $ ( tr ).data ( 'item-lvl' ) == 1;
            } );
            var $topItem = $ ( topItem );
            $topItem.find ( 'th' ).attr ( 'rowspan', parseInt ( $topItem.find ( 'th' ).attr ( 'rowspan' ) ) + 1 );
            $currentTr.find ( 'th' ).attr ( 'rowspan', parseInt ( $currentTr.find ( 'th' ).attr ( 'rowspan' ) ) + 1 );

            var template = _.template ( itemTrTpl );
            var html = template ( templateParam );

            // template적용하여 $currentTr에 붙이기
            $currentTr.after ( html );
        }
    }
}

// TODO item 삭제
function removeItem ()
{
    var $delItem = $ ( '.del_item' );
    var $tbAddItemTr = $ ( '#tbAddItem tr' );

    $delItem.unbind ( 'click' );
    $delItem.on ( 'click', function ()
    {
        var $that = $ ( this ).closest ( 'tr' );
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
                        // 선택된 행의 하위 항목까지 가져옴
                        var tbAddItemTrFilteredArray = getSelectedItemAndChildren ( $that, $tbAddItemTr );
                        // 선택한 행의 레벨에따라 rowspan 조절하기...
                        // 레벨이 1인경우 그냥 지워버리기만 하면된다.
                        var itemLvl = $that.data ( 'item-lvl' );

                        if ( itemLvl == 2 || itemLvl == 3 )
                        {
                            var length = tbAddItemTrFilteredArray.length;
                            // 최상위 행 rowspan 조정
                            var topItem = _.find ( $tbAddItemTr, function ( tr )
                            {
                                // parntsItemMgt로
                                // 하위
                                // item
                                // 필터링
                                // 하기
                                return $that.data ( 'item-grp-seq' ) === $ ( tr ).data ( 'item-grp-seq' )
                                        && $ ( tr ).data ( 'item-lvl' ) == 1;
                            } );
                            var $topItem = $ ( topItem );
                            $topItem.find ( 'th' ).attr ( 'rowspan',
                                    parseInt ( $topItem.find ( 'th' ).attr ( 'rowspan' ) ) - length );

                            if ( itemLvl == 3 )
                            {
                                var parntsItemMgtSeq = $that.find ( '.parntsItemMgtSeq' ).val ();
                                var parntsTr = _.find ( $tbAddItemTr, function ( tr )
                                {
                                    // parntsItemMgt로
                                    // 하위
                                    // item
                                    // 필터링
                                    // 하기
                                    return parntsItemMgtSeq == $ ( tr ).data ( 'item-mgt-seq' );
                                } );

                                var $parntsTr = $ ( parntsTr );
                                $parntsTr.find ( 'th' ).attr ( 'rowspan',
                                        parseInt ( $parntsTr.find ( 'th' ).attr ( 'rowspan' ) ) - length );
                            }
                        }

                        // 하위 항목 삭제
                        _.each ( tbAddItemTrFilteredArray, function ( tr )
                        {
                            $ ( tr ).remove ();
                        } );
                    }
                } );
    } );
}

// item 초기화
function resetItem ()
{
    var $btnItemMgtInfoReset = $ ( '#btnItemMgtInfoReset' );
    var $itemNm = $ ( '#itemNm' );
    var $attrbCd = $ ( '#attrbCd' );
    var $spnItemAdd = $ ( '#spnItemAdd' );
    var $subItemTitle = $ ( '#subItemTitle' );
    var $isUpdateItem = $ ( '#isUpdateItem' );
    var $updateItemMgtSeq = $ ( '#updateItemMgtSeq' );
    var $cmmnClCdList = $ ( '#cmmnClCdList' );
    var $eqmtItemCdList = $ ( '#eqmtItemCdList' );

    $btnItemMgtInfoReset.unbind ( 'click' );
    $btnItemMgtInfoReset.on ( 'click', function ()
    {
        $eqmtItemCdList.val ( '' ).trigger ( 'change' );
        $itemNm.val ( '' );
        $cmmnClCdList.val ( '' ).trigger ( 'change' );
        $attrbCd.val ( '' ).trigger ( 'change' );
        $subItemTitle.text ( '' );
        $spnItemAdd.text ( i18nMessage.msg_add );
        $isUpdateItem.val ( 'false' );
        $updateItemMgtSeq.val ( '' );
    } );
}

// item 하위 항목 추가 셋팅
function setSubItem ()
{
    var $btnAdd = $ ( '.btn_add' );
    var $subItemTitle = $ ( '#subItemTitle' );
    var $updateItemMgtSeq = $ ( '#updateItemMgtSeq' );
    var $itemNm = $ ( '#itemNm' );
    var $attrbCd = $ ( '#attrbCd' );
    var $spnItemAdd = $ ( '#spnItemAdd' );
    var $eqmtItemCdList = $ ( '#eqmtItemCdList' );

    $btnAdd.unbind ( 'click' );
    $btnAdd.on ( 'click', function ()
    {
        var $that = $ ( this ).closest ( 'tr' );

        $eqmtItemCdList.val ( '' ).trigger ( 'change' );
        $itemNm.val ( '' );
        $attrbCd.val ( '' ).trigger ( 'change' );
        $updateItemMgtSeq.val ( $that.data ( 'item-mgt-seq' ) );
        $subItemTitle.text ( $that.find ( '.itemKorNm' ).val () + ' ' + i18nMessage.msg_subinfoAddInfoCreation );
        $spnItemAdd.text ( i18nMessage.msg_add );
    } );
}

// item 수정
function setUpdateItem ()
{
    var $btn_write = $ ( '.btn_write' );
    var $isUpdateItem = $ ( '#isUpdateItem' );
    var $updateItemMgtSeq = $ ( '#updateItemMgtSeq' );
    var $spnItemAdd = $ ( '#spnItemAdd' );
    var $itemNm = $ ( '#itemNm' );
    var $attrbCd = $ ( '#attrbCd' );
    var $cmmnClCdList = $ ( '#cmmnClCdList' );
    var $itemText = $ ( '#itemText' );
    var $eqmtGrpCd = $ ( '#eqmtGrpCd' );
    var $eqmtItemCdList = $ ( '#eqmtItemCdList' );

    $btn_write.unbind ( 'click' );
    $btn_write.on ( 'click', function ()
    {
        var $that = $ ( this ).closest ( 'tr' );
        var clCd = $that.find ( '.eqmtClCd' ).val ();
        var attrCdVal = $that.find ( '.attrbCd' ).val ();
        $attrbCd.val ( attrCdVal ).trigger ( 'change' );

        $updateItemMgtSeq.val ( $that.data ( 'item-mgt-seq' ) );
        $spnItemAdd.text ( i18nMessage.msg_update );
        $isUpdateItem.val ( 'true' );

        // 항목명 처리
        if ( isSubEqmtGrpCd ( $eqmtGrpCd.val () ) )
        {
            $eqmtItemCdList.val ( $that.find ( '.itemCd' ).val () ).trigger ( 'change' );
        } else
        {
            $itemNm.val ( $that.find ( '.itemKorNm' ).val () );
        }

        // select 처리
        if ( attrCdVal == 'IT01' )
        {
            $cmmnClCdList.unbind ( 'change' );
            $cmmnClCdList.val ( clCd ).trigger ( 'change' );
            var promise = selectCmmnCdListAjax ( clCd );
            promise.done ( function ()
            {
                $ ( '#cmmnCdList' ).val ( $that.find ( '.itemCd' ).val () ).trigger ( 'change' );
                getCmmnCdList ();
            } );
        }
        // input text 처리
        else if ( attrCdVal == 'IT02' )
        {

            $itemText.val ( $that.find ( '.itemVal' ).val () );
        }

    } );
}

// item 이동관련 start
// 선택 된 행의 자손까지 선택
function getSelectedItemAndChildren ( $that, $tbAddItemTr )
{
    var tbAddItemTrFilteredArray = [];
    if ( $that.data ( 'item-lvl' ) == 1 )
    {
        tbAddItemTrFilteredArray = _.filter ( $tbAddItemTr, function ( tr )
        {
            // parntsItemMgt로 하위 item 필터링 하기
            return $that.data ( 'item-grp-seq' ) === $ ( tr ).data ( 'item-grp-seq' );
        } );
    } else if ( $that.data ( 'item-lvl' ) == 2 )
    {
        tbAddItemTrFilteredArray = _.filter ( $tbAddItemTr, function ( tr )
        {
            var $tr = $ ( tr );
            // parntsItemMgt로 하위 item 필터링 하기
            return $that.data ( 'item-grp-seq' ) === $tr.data ( 'item-grp-seq' )
                    && ($that.data ( 'item-mgt-seq' ) === $tr.data ( 'parnts-item-mgt-seq' ) || $that
                            .data ( 'item-mgt-seq' ) === $tr.data ( 'item-mgt-seq' ));
        } );
    } else
    {
        tbAddItemTrFilteredArray = [];
        tbAddItemTrFilteredArray.push ( $that );
    }

    return tbAddItemTrFilteredArray;
}

// 선택 된 행의 같은 레벨 행 반환
function getItemsOfSelectedItem ( $that, $tbAddItemTr )
{
    var prevTrArray = null;
    if ( $that.data ( 'item-lvl' ) == 1 )
    {
        prevTrArray = _.filter ( $tbAddItemTr, function ( tr )
        {
            var $tr = $ ( tr );
            return $that.data ( 'item-lvl' ) === $tr.data ( 'item-lvl' )
                    && $that.data ( 'item-mgt-seq' ) !== $tr.data ( 'item-mgt-seq' );
        } );

    } else
    {
        prevTrArray = _.filter ( $tbAddItemTr, function ( tr )
        {
            var $tr = $ ( tr );
            return $that.data ( 'item-lvl' ) === $tr.data ( 'item-lvl' )
                    && $that.data ( 'item-mgt-seq' ) !== $tr.data ( 'item-mgt-seq' )
                    && $that.data ( 'item-grp-seq' ) === $tr.data ( 'item-grp-seq' );
        } );
    }

    return prevTrArray;
}

// 선별된 tr의 마지막 해당 그룹의 마지막 tr을 반환한다.
function getLastTr ( $afterTr, $tbAddItemTr )
{
    var $lastTr = null;

    if ( $afterTr !== null )
    {
        var itemGrpSeq = $afterTr.data ( 'item-grp-seq' );
        var maxOrdr = 0;
        _.each ( $tbAddItemTr, function ( tr )
        {
            var $tr = $ ( tr );
            var ordr = $tr.find ( '.ordr' ).val ();
            if ( itemGrpSeq === $tr.data ( 'item-grp-seq' ) && maxOrdr < ordr )
            {
                $lastTr = $tr;
                maxOrdr = ordr;
            }
        } );
    }

    return $lastTr;
}

// 항목 move up 처리
function itemMoveUp ()
{
    var $btnMoveUp = $ ( '.btn_move .up' );
    var $tbAddItemTr = $ ( '#tbAddItem tr' );

    $btnMoveUp.unbind ( 'click' );
    $btnMoveUp.on ( 'click', function ()
    {
        var $that = $ ( this ).closest ( 'tr' );
        var tbAddItemTrFilteredArray = getSelectedItemAndChildren ( $that, $tbAddItemTr ); // 선택 된 행의 하위항목까지 포함
        var prevTrArray = getItemsOfSelectedItem ( $that, $tbAddItemTr );// 같은
        // 레벨의
        // 로우들
        // 반환

        // 옮겨질 행이 있다면..
        if ( prevTrArray.length > 0 )
        {
            var $prevTr = null;
            // 옮긴후 ordr 갱신
            var thatOrdr = $that.find ( '.ordr' ).val ();
            var maxOrdr = 0;
            _.each ( prevTrArray, function ( tr )
            {
                var $tr = $ ( tr );
                var trOrdr = $tr.find ( '.ordr' ).val ();
                if ( maxOrdr < trOrdr && trOrdr < thatOrdr )
                {
                    $prevTr = $tr;
                    maxOrdr = trOrdr;
                }
            } );

            if ( $prevTr !== null )
            {
                _.each ( tbAddItemTrFilteredArray, function ( tr )
                {
                    $prevTr.before ( $ ( tr ).detach () );
                } );

                setItemOrdr ();
                itemMoveUp ();
            }
        }
    } );
}

// 항목 move down 처리
function itemMoveDown ()
{
    var $btnMoveDown = $ ( '.btn_move .down' );
    var $tbAddItemTr = $ ( '#tbAddItem tr' );

    $btnMoveDown.unbind ( 'click' );
    $btnMoveDown.on ( 'click', function ()
    {
        var $that = $ ( this ).closest ( 'tr' );
        var tbAddItemTrFilteredArray = getSelectedItemAndChildren ( $that, $tbAddItemTr ); // 선택 된 행의 하위항목까지 포함
        var afterTrArray = getItemsOfSelectedItem ( $that, $tbAddItemTr );// 같은
        // 레벨의
        // 로우들
        // 반환

        // 옮겨질 행이 있다면..
        if ( afterTrArray.length > 0 )
        {
            var $afterTr = null;
            // 옮긴후 ordr 갱신
            var thatOrdr = $that.find ( '.ordr' ).val ();
            var minOrdr = 9999;
            _.each ( afterTrArray, function ( tr )
            {
                var $tr = $ ( tr );
                var trOrdr = $tr.find ( '.ordr' ).val ();
                if ( minOrdr > trOrdr && trOrdr > thatOrdr )
                {
                    $afterTr = $tr;
                    minOrdr = trOrdr;
                }
            } );

            var $lastTr = getLastTr ( $afterTr, $tbAddItemTr );
            if ( $lastTr !== null )
            {
                for ( var i = tbAddItemTrFilteredArray.length - 1; i >= 0; i-- )
                {
                    $lastTr.after ( $ ( tbAddItemTrFilteredArray[i] ).detach () );
                }

                setItemOrdr ();
                itemMoveDown ();
            }
        }
    } );
}

// 순서 설정
function setItemOrdr ()
{
    var $tbAddItemTr = $ ( '#tbAddItem tr' );
    $tbAddItemTr.each ( function ( index )
    {
        var $that = $ ( this );
        $that.find ( '.ordr' ).val ( index + 1 );
    } );
}
// item 이동관련 end

// 대표설비 여부 처리
function setEqmtStdrAt ()
{
    var $eqmtStdrAt = $ ( '#eqmtStdrAt' );
    $eqmtStdrAt.on ( 'change', function ()
    {
        var eqmtStdrAt = $ ( this ).val ();
        if ( eqmtStdrAt !== '' )
        {
            $.ajax ( {
                url : contextPath + '/hom/masterdata/equipment/selectEqmtStdrAtCount.ajax',
                type : 'POST',
                dataType : 'json',
                data : {
                    eqmtId : paramEqmtId
                },
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        if ( json.data > 0 )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_alertEqmtStdrAtExist,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );
                            $eqmtStdrAt.val ( '' ).trigger ( 'change' )
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
                    // abort error not show(user request
                    // cancel or aborted)
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

$ ( function ()
{
    customizeForm ();
    fileCustomizeForm ();
    fileCustomizeScroll ();
    initDatetimepicker ();
    getEqmtTreeList ();
    getEqmtTreeList2 ();
    customizeScroll ();
    resetRegForm ();
    getEqmtItemCdList ();
    initEqmtRegForm ();

    // 파일 관련
    checkFileSize ();
    addFileInput ();
    deleteFileInput ();
    deleteFile ();
    deleteMainImage ();

    // 보증 기간 관련
    addGrntPd ();
    deleteGrntPd ();
    checkGrntType ();

    // 항목 관련
    changeInputItemByAttrb ();
    getCmmnCdList ();
    addItem ();
    resetItem ();
    setSubItem ();
    itemMoveUp ();
    itemMoveDown ();
    removeItem ();
    setUpdateItem ();

    setEqmtStdrAt ();
    validateRegForm ();
} );