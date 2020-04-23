// form element customize
function customizeForm ()
{
    $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
}

// treemenu customize
function customizeTree ()
{
    var tpl = getTemplate ( templates.menuAuthorityTableTr );
    var $menuAuthorityTable = $ ( '#menu_authority_table' );

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
                    zTree.checkNode ( treeNode, true, true );
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
                }
            }
        }
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/menu/selectMenuInfoTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            enableRoot : false,
            chkDisabled : true
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                for ( var i = 0, length = nodes.length; i < length; i++ )
                {
                    if ( nodes[i].level === 0 )
                    {
                        zTree.setChkDisabled ( nodes[i], false );
                    }

                    if ( i === 0 && nodes[i].children && !existAuthGrpId )
                    {
                        zTree.selectNode ( nodes[i] );
                        zTree.checkNode ( nodes[i], true, true );
                    }
                }

                if ( !existAuthGrpId && !existCopyAuthGrpId )
                {
                    var checkedNodes = zTree.getCheckedNodes ( true );
                    if ( checkedNodes.length > 0 )
                    {
                        renderMenuAuthority ( checkedNodes[0], tpl, $ ( 'tbody', $menuAuthorityTable ) );

                        // 등록 초기화면이 보여질 때 CRUD 전체 체크 처리
                        $ ( '#crud_c_all' ).prop ( 'checked', false ).trigger ( 'click' );
                        $ ( '#crud_r_all' ).prop ( 'checked', false ).trigger ( 'click' );
                        $ ( '#crud_u_all' ).prop ( 'checked', false ).trigger ( 'click' );
                        $ ( '#crud_d_all' ).prop ( 'checked', false ).trigger ( 'click' );
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

    $ ( '.frm_intbl_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// 메뉴 권한설정
function renderMenuAuthority ( treeNode, tpl, $target )
{
    var menuArray = getChildrenNode ( treeNode, [] );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            menuArray : menuArray,
            crudAuth : {
                crudAuthCreate : staticVariable.crudAuthCreate,
                crudAuthRead : staticVariable.crudAuthRead,
                crudAuthUpdate : staticVariable.crudAuthUpdate,
                crudAuthDelete : staticVariable.crudAuthDelete
            }
        } );

        $target.html ( html );

        customizeForm ();
    }
}

// 해당 메뉴 적용
function menuApply ()
{
    var tpl = getTemplate ( templates.menuAuthorityTableTr );
    var $menuAuthorityTable = $ ( '#menu_authority_table' );

    $ ( '#btn_menu_apply' ).on ( 'click', function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
        var checkedNodes = zTree.getCheckedNodes ( true );

        if ( checkedNodes.length === 0 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validRequiredSelectMenu,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            if ( checkedNodes[0].children )
            {
                $.when ( $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertMenuConfigInitializeConfirm,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeConfirm
                } ) ).then ( function ( confirm )
                {
                    if ( confirm )
                    {
                        renderMenuAuthority ( checkedNodes[0], tpl, $ ( 'tbody', $menuAuthorityTable ) );

                        $ ( '#crud_c_all' ).prop ( 'checked', false ).trigger ( 'click' );
                        $ ( '#crud_r_all' ).prop ( 'checked', false ).trigger ( 'click' );
                        $ ( '#crud_u_all' ).prop ( 'checked', false ).trigger ( 'click' );
                        $ ( '#crud_d_all' ).prop ( 'checked', false ).trigger ( 'click' );
                    }
                } );
            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validConfigExistChildMenu,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
        }
    } );
}

// 체크박스 토글
function checkboxToggle ( $this, $checkboxs )
{
    var flag = null;

    if ( $this.prop ( 'checked' ) )
    {
        flag = true;
    } else
    {
        flag = false;
    }

    $checkboxs.prop ( 'checked', flag ).trigger ( 'change' );
}

// 상단 권한 체크박스 토글
function authorityCheckboxToggle ()
{
    $ ( '#crud_r_all' ).on ( 'click', function ()
    {
        checkboxToggle ( $ ( this ), $ ( '.crud_r:enabled' ) );
    } );

    $ ( '#crud_c_all' ).on ( 'click', function ()
    {
        checkboxToggle ( $ ( this ), $ ( '.crud_c:enabled' ) );
    } );

    $ ( '#crud_u_all' ).on ( 'click', function ()
    {
        checkboxToggle ( $ ( this ), $ ( '.crud_u:enabled' ) );
    } );

    $ ( '#crud_d_all' ).on ( 'click', function ()
    {
        checkboxToggle ( $ ( this ), $ ( '.crud_d:enabled' ) );
    } );
}

// crud 체크박스 이벤트 바인드
function crudCheckboxBind ()
{
    crudCheckboxToggle ( '.crud_c:enabled', '#crud_c_all' );
    crudCheckboxToggle ( '.crud_r:enabled', '#crud_r_all' );
    crudCheckboxToggle ( '.crud_u:enabled', '#crud_u_all' );
    crudCheckboxToggle ( '.crud_d:enabled', '#crud_d_all' );
}

// crud 체크박스 토글
function crudCheckboxToggle ( selector, groupSelector )
{
    $ ( document ).on ( 'click', selector, function ()
    {
        var trueCount = 0;
        var falseCount = 0;
        var totalCount = 0;

        $ ( selector ).each ( function ()
        {
            if ( $ ( this ).prop ( 'checked' ) )
            {
                trueCount++;
            } else
            {
                falseCount++;
            }

            totalCount++;
        } );

        var flag = null;

        if ( totalCount === trueCount )
        {
            flag = true;
        } else
        {
            flag = false;
        }

        $ ( groupSelector ).prop ( 'checked', flag ).trigger ( 'change' );
    } );
}

// 자식 노드 검색
function getChildrenNode ( treeNode, menuArray )
{
    if ( treeNode.children )
    {
        var children = treeNode.children;
        for ( var i = 0, length = children.length; i < length; i++ )
        {
            menuArray.push ( {
                name : children[i].name,
                menuId : children[i].id,
                progrmUrl : children[i].progrmUrl
            } );

            menuArray = getChildrenNode ( children[i], menuArray );
        }
    }

    return menuArray;
}

// 권한그룹 정보 초기화(등록 화면)
function authorityInitialization ()
{
    if ( !existAuthGrpId )
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
        } );
    }
}

// 권한그룹 정보 유효성 체크
function authorityValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#authorityForm' ).validate (
            {
                rules : {
                    authGrpKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    authGrpEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 50
                    },
                    authGrpDesc : {
                        maxlength : 300
                    }
                },
                messages : {
                    authGrpKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredAuthorityGroupKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeAuthorityGroupKoreanName )
                    },
                    authGrpEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredAuthorityGroupEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeAuthorityGroupEnglishName )
                    },
                    authGrpDesc : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDescription )
                    }
                },
                submitHandler : function ( form )
                {
                    var $menuId = $ ( '.menuId' );
                    var $parent = null;
                    var $crudR = null;
                    var $crudC = null;
                    var $crudU = null;
                    var $crudD = null;

                    // 메뉴별 상세권한 설정 - required : true
                    if ( $menuId.size () === 0 )
                    {
                        if ( tpl !== null )
                        {
                            var template = _.template ( tpl );
                            var html = template ( {
                                id : 'crudAuth',
                                message : i18nMessage.msg_validCrudRequired,
                                isLeft : true
                            } );

                            $ ( '.frm_incon02' ).append ( html );
                        }

                        return;
                    }

                    var message = null;
                    var flag = true;

                    $menuId
                            .each ( function ()
                            {
                                var crudAuth = 0;

                                $parent = $ ( this ).closest ( 'tr' );
                                $crudR = $parent.find ( '.crud_r' );
                                $crudC = $parent.find ( '.crud_c' );
                                $crudU = $parent.find ( '.crud_u' );
                                $crudD = $parent.find ( '.crud_d' );

                                if ( $crudR.prop ( 'checked' ) )
                                {
                                    crudAuth += parseInt ( $crudR.val (), 10 );
                                }
                                if ( $crudC.prop ( 'checked' ) )
                                {
                                    crudAuth += parseInt ( $crudC.val (), 10 );
                                }
                                if ( $crudU.prop ( 'checked' ) )
                                {
                                    crudAuth += parseInt ( $crudU.val (), 10 );
                                }
                                if ( $crudD.prop ( 'checked' ) )
                                {
                                    crudAuth += parseInt ( $crudD.val (), 10 );
                                }

                                // 권한설정 체크 안함(disabled 이 아닌 경우만 체크)
                                if ( !$crudR.prop ( 'disabled' ) && !$crudC.prop ( 'disabled' )
                                        && !$crudU.prop ( 'disabled' ) && !$crudD.prop ( 'disabled' )
                                        && !$crudR.prop ( 'checked' ) && !$crudC.prop ( 'checked' )
                                        && !$crudU.prop ( 'checked' ) && !$crudD.prop ( 'checked' ) )
                                {
                                    message = i18nMessage.msg_validCrudRequired;
                                    flag = false;

                                    return false;
                                }
                                // 잘못된 권한 설정
                                else if ( !$crudR.prop ( 'checked' )
                                        && ($crudC.prop ( 'checked' ) || $crudU.prop ( 'checked' ) || $crudD
                                                .prop ( 'checked' )) )
                                {
                                    message = i18nMessage.msg_validCrudReadRequired;
                                    flag = false;

                                    return false;
                                }

                                $parent.find ( '.crudAuth' ).val ( crudAuth );
                            } );

                    if ( !flag )
                    {
                        if ( tpl !== null )
                        {
                            var template = _.template ( tpl );
                            var html = template ( {
                                id : 'crudAuth',
                                message : message,
                                isLeft : true
                            } );

                            $ ( '.frm_incon02' ).append ( html );
                        }

                        return;
                    }

                    $.when (
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : !existAuthGrpId ? i18nMessage.msg_alertCreateConfirm
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

$ ( function ()
{
    customizeForm ();
    customizeTree ();
    customizeScroll ();
    menuApply ();
    authorityCheckboxToggle ();
    crudCheckboxBind ();
    authorityInitialization ();
    authorityValidate ();
} );