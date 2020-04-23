// 삭제 체크
function checkBtnLinks ()
{
    var $btnDelete = $ ( '#btn_delete' );
    var $btnList = $ ( '#btn_list' );

    var menuIdArray = [];
    var menuRelateCountArray = [];

    if ( typeof $btnDelete !== 'undefined' )
    {
        $btnDelete.on ( 'click', function ()
        {
            var $that = $ ( this );
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
                        if ( childNodes[j].id !== '' )
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

            // if ( childFlag && relateFlag )
            // {
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
            return false;
        } );
    }

    if ( typeof $btnList !== 'undefined' )
    {
        $btnList.on ( 'click', function ()
        {
            location.href = $ ( this ).attr ( 'href' ) + '&itemId=' + paramParntsItemId + '' + '&searchKey='
                    + paramSearchKey + '&searchKeyword=' + paramSearchKeyword;
            return false;
        } );
    }
    // location.href = $ ( this ).attr ( 'href' ) + '&spcId=' + paramSpcId + '&parntsItemId=' + paramItemId;
}

// 해당 리스트 페이지로 이동
function moveListPage ( treeNode )
{
    if ( !treeNode.chkDisabled )
    {
        location.href = contextPath + '/hom/asset/plantCostItem/list.do?itemId=' + treeNode.id;
    }
}

function reloadJqgrid ( treeNode )
{
    // dummy
}
function customizeJqgrid ()
{
    // dummy
}

$ ( function ()
{
    checkBtnLinks ();
    customizeTree ();
    showAllAssetCopyPopup ();
    // if ( typeof $ ( "#all_asset_copy_popup" ) !== 'undefined' )
    // {
    // $ ( "#all_asset_copy_popup" ).on ( 'click', showAllAssetCopyPopup );
    // }

} );