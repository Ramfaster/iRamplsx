// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
    $ ( '#file1' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_fileRegister,
        buttonSpriteClass : 'btn_file01',
        buttonTextColor : '#4c4743',
        buttonWidth : 90,
        textWidth : 280,
        height : 25
    } );

    // 검색 조건
    var $dateType = $ ( '.search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );
}

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );
    // var virtualIndex = paramItemId.indexOf ( '_VIRTUAL_' );
    // var itemId = virtualIndex !== -1 ? paramItemId.substring ( 0, virtualIndex ) : paramItemId;
    var itemId = paramItemId;
    // var menuType = virtualIndex !== -1 ? paramItemId.substring ( virtualIndex + '_VIRTUAL_'.length,
    // paramItemId.length )
    // : '';

    var spcId = paramSpcId;
    var colNames = null;
    var colModel = null;

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ i18nMessage.msg_code, i18nMessage.msg_assetKo, i18nMessage.msg_unit,
                i18nMessage.msg_useAvailability, i18nMessage.msg_assetTargetYn, 'hiddenSpcId', 'hiddenUnitTyCd',
                'hiddenParntsItemCd', 'itemOrdr' ];
        colModel = [ {
            name : 'itemId',
            width : 230,
            align : 'left'
        }, {
            name : 'itemKorNm',
            width : 333,
            align : 'left'
        }, {
            name : 'unitTyCdKorNm',
            width : 270,
            align : 'center'
        }, {
            name : 'usgAt',
            width : 200,
            align : 'center'
        }, {
            name : 'sumAt',
            width : 200,
            align : 'center'
        }, {
            name : 'spcId',
            width : 0,
            align : 'center',
            hidden : true
        }, {
            name : 'unitTyCd',
            width : 0,
            align : 'center',
            hidden : true
        }, {
            name : 'parntsItemCd',
            width : 0,
            align : 'center',
            hidden : true
        }, {
            name : 'itemOrdr',
            align : 'center',
            hidden : true
        } ];
    } else
    {
        colNames = [ i18nMessage.msg_code, i18nMessage.msg_assetEn, i18nMessage.msg_unit,
                i18nMessage.msg_useAvailability, i18nMessage.msg_assetTargetYn, 'hiddenSpcId', 'hiddenUnitTyCd',
                'hiddenParntsItemCd', 'itemOrdr' ];
        colModel = [ {
            name : 'itemId',
            width : 230,
            align : 'left'
        }, {
            name : 'itemEngNm',
            width : 333,
            align : 'left'
        }, {
            name : 'unitTyCdEngNm',
            width : 270,
            align : 'center'
        }, {
            name : 'usgAt',
            width : 200,
            align : 'center'
        }, {
            name : 'sumAt',
            width : 200,
            align : 'center'
        }, {
            name : 'spcId',
            width : 0,
            align : 'center',
            hidden : true
        }, {
            name : 'unitTyCd',
            width : 0,
            align : 'center',
            hidden : true
        }, {
            name : 'parntsItemCd',
            width : 0,
            align : 'center',
            hidden : true
        }, {
            name : 'itemOrdr',
            align : 'center',
            hidden : true
        } ];
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/asset/companyCostItem/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 642,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    itemId : itemId,
                    spcId : spcId
                },
                colNames : colNames,
                colModel : colModel,
                sortname : 'itemOrdr',
                sortorder : 'asc',
                multiselect : true,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow99999,
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

                            // 대상/대상아님 alias
                            if ( rowData.sumAt !== null && rowData.sumAt === 'Y' )
                            {
                                rowData.sumAt = i18nMessage.msg_assetTarget;
                            } else if ( rowData.sumAt !== null && rowData.sumAt === 'N' )
                            {
                                rowData.sumAt = i18nMessage.msg_assetUntarget;
                            }

                            $gridList.jqGrid ( 'setRowData', cl, rowData );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                name : 'itemId',
                                value : rowData.itemId
                            } ).data ( 'menu-relate-count', rowData.menuRelateCount ).addClass ( 'itemIds' );
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
                    location.href = contextPath + '/hom/asset/companyCostItem/view.do?itemId=' + rowData.spcId + ''
                            + rowData.itemId + '&parntsItemCd=' + rowData.parntsItemCd + '&spcId=' + rowData.spcId
                            + '&searchKey=' + $ ( ':selected', $ ( "#searchKey" ) ).val () + '&searchKeyword='
                            + $ ( "#searchKeyword" ).val ();
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
    // alert ( treeNode.pId + ' ' + treeNode.spcId );
    paramSpcId = treeNode.mdlPid;

    postData = {
        itemId : treeNode.id,
        spcId : treeNode.mdlPid
    };
    paramItemId = treeNode.id;

    // postData = {
    // itemId : 'nochild',
    // spcId : treeNode.mdlPid
    // };
    // paramItemId = 'nochild';
    // }
    // alert ( postData.itemId + ' ' + postData.spcId );
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
    } );
}

// 삭제 체크
function checkBtnDelete ()
{
    var $btnDelete = $ ( '#btn_delete' );

    $btnDelete.on ( 'click', function ()
    {
        var itemIdArray = [];
        var $that = $ ( this );

        $ ( '.itemIds' ).each ( function ()
        {
            if ( $ ( this ).prop ( 'checked' ) )
            {
                itemIdArray.push ( $ ( this ).val () );
            }
        } );

        if ( itemIdArray.length === 0 )
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

            for ( var i = 0, length = itemIdArray.length; i < length; i++ )
            {
                node = zTree.getNodeByParam ( 'id', itemIdArray[i] );

                var childNodes = $.fn.zTree.getZTreeObj ( 'treeList' ).getNodesByFilter ( function ()
                {
                    return true;
                }, false, node );

                var childLength = childNodes.length;
                // if ( childLength > 0 )
                // {
                // for ( var j = 0, childLength = childNodes.length; j < childLength; j++ )
                // {
                // if ( childNodes[j].id !== '' && childNodes[j].id.indexOf ( '_VIRTUAL_' ) === -1 )
                // {
                // childFlag = false;
                // break;
                // }
                // }
                // }
            }

            // for ( var i = 0, length = menuRelateCountArray.length; i < length; i++ )
            // {
            // if ( $.isNumeric ( menuRelateCountArray[i] ) )
            // {
            // var menuRelateCount = parseInt ( menuRelateCountArray[i], 10 );
            //
            // if ( menuRelateCount > 0 )
            // {
            // relateFlag = false;
            // break;
            // }
            // }
            // }

            // if ( childFlag && relateFlag )
            // {
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
                            location.href = $that.attr ( 'href' ) + '?itemId=' + itemIdArray.toString () + '&spcId='
                                    + paramSpcId + '&parntsItemCd=' + paramParntsItemCd;
                        }
                    } );
            // } else
            // {
            // $.customizeDialog ( {
            // template : templates.dialog,
            // message : i18nMessage.msg_validExistChildMenu,
            // checkText : i18nMessage.msg_ok,
            // cancelText : i18nMessage.msg_cancel,
            // type : staticVariable.dialogTypeInfo
            // } );
            // }
        }

        return false;
    } );
}

// 순서 갱신 체크
function checkUpdateOrder ()
{
    $ ( '#btn_update_order' ).on ( 'click', function ()
    {
        var $gridList = $ ( '#gridList' );
        var ids = $gridList.jqGrid ( 'getDataIDs' );
        var itemIdArray = [];
        var spcId = paramSpcId;
        itemIdArray.push ( spcId );

        for ( var i = 0, length = ids.length; i <= length; i++ )
        {
            var cl = ids[i];

            if ( !cl )
            {
                continue;
            }

            var rowData = $gridList.getRowData ( cl );
            itemIdArray.push ( rowData.itemId );
        }

        if ( itemIdArray.length === 0 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : '저장 가능한 항목이 없습니다.',
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : '순서를 저장하시겠습니까?',
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {
                if ( confirm )
                {
                    $.ajax ( {
                        url : contextPath + '/hom/asset/companyCostItem/updateItemOrder.ajax',
                        type : 'POST',
                        dataType : 'json',
                        data : {
                            itemIds : itemIdArray.toString ()
                        },
                        success : function ( json )
                        {
                            if ( json.status === staticVariable.jsonStatusSuccess )
                            {

                                customizeTree ();

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
function checkBtnAdd ()
{
    var $btnAdd = $ ( '#btn_add' );

    $btnAdd.on ( 'click', function ()
    {
        // var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
        // var checkedNodes = zTree.getCheckedNodes ( true );
        // if ( checkedNodes.length > 0 )
        // {
        location.href = $ ( this ).attr ( 'href' ) + '&spcId=' + paramSpcId + '&itemId=' + paramItemId
                + '&parntsItemCd=' + paramParntsItemCd + '&searchKey=' + $ ( ':selected', $ ( "#searchKey" ) ).val ()
                + '&searchKeyword=' + encodeURIComponent ( $ ( '#searchKeyword' ).val () );
        // }

        return false;
    } );
}

// 검색
function checkBtnSearch ()
{
    var $btnSearch = $ ( '#btn_search' );
    var $searchKeyword = $ ( '#searchKeyword' );

    $btnSearch.on ( 'click', function ()
    {
        postData = {
            itemId : paramItemId,
            spcId : paramSpcId,
            searchKey : $ ( ':selected', $ ( "#searchKey" ) ).val (),
            searchKeyword : $ ( "#searchKeyword" ).val ()
        };

        $ ( '#gridList' ).setGridParam ( {
            postData : postData
        } ).trigger ( 'reloadGrid' );

        return false;
    } );

    $searchKeyword.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            postData = {
                itemId : paramItemId,
                spcId : paramSpcId,
                searchKey : $ ( ':selected', $ ( "#searchKey" ) ).val (),
                searchKeyword : $ ( "#searchKeyword" ).val ()
            };

            $ ( '#gridList' ).setGridParam ( {
                postData : postData
            } ).trigger ( 'reloadGrid' );

            return false;
        }
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
    customizeForm ();
    customizeTree ();
    checkBtnDelete ();
    checkBtnAdd ();
    checkBtnSearch ();
    switchButtonGroup ();
    checkMessage ();
    showAllAssetCopyPopup ();
    checkUpdateOrder ();
    // if ( typeof $ ( "#all_asset_copy_popup" ) !== 'undefined' )
    // {
    // $ ( "#all_asset_copy_popup" ).on ( 'click', showAllAssetCopyPopup );
    // }
} );