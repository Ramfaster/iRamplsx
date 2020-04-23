// form element customize
function customizeForm ()
{
    // 검색 조건
    var $dateType = $ ( '#searchKey' ).customizeSelect ( {
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

    var colNames = null;
    var colModel = null;
    var $totalRowCount = $ ( "#totalRowCount" );
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ i18nMessage.msg_programNumber, i18nMessage.msg_programKoreanName, i18nMessage.msg_programUrl,
                i18nMessage.msg_description ];
        colModel = [ {
            name : 'progrmSeq',
            hidden : true
        }, {
            name : 'progrmKorNm',
            width : 300,
            align : 'left',
            fixed : true
        }, {
            name : 'progrmUrl',
            width : 400,
            align : 'left',
            fixed : true
        }, {
            name : 'progrmDesc',
            width : 870,
            align : 'left',
            fixed : true
        } ];
    } else
    {
        colNames = [ i18nMessage.msg_programNumber, i18nMessage.msg_programEnglishName, i18nMessage.msg_programUrl,
                i18nMessage.msg_description ];
        colModel = [ {
            name : 'progrmSeq',
            hidden : true
        }, {
            name : 'progrmEngNm',
            width : 300,
            align : 'left',
            fixed : true
        }, {
            name : 'progrmUrl',
            width : 400,
            align : 'left',
            fixed : true
        }, {
            name : 'progrmDesc',
            width : 870,
            align : 'left',
            fixed : true
        } ];
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/program/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    searchKey : $ ( ':selected', $searchKey ).val (),
                    searchKeyword : $searchValue.val ()
                },
                height : 642,
                autowidth : true,
                shrinkToFit : false,
                colNames : colNames,
                colModel : colModel,
                sortname : 'progrmSeq',
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

                    // 조회결과
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $totalRowCount.html ( resultText );

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

                            $gridList.jqGrid ( 'setRowData', cl, rowData );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                name : 'progrmSeq',
                                value : rowData.progrmSeq
                            } ).addClass ( 'progrmSeqs' );
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
                    var $searchKey = $ ( '#searchKey' );
                    var $searchValue = $ ( '#searchValue' );

                    location.href = contextPath + '/hom/sysmgt/program/view.do?progrmSeq=' + rowData.progrmSeq
                            + '&searchKey=' + searchCondition.searchKey + '&searchValue='
                            + encodeURIComponent ( searchCondition.searchKeyword );
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

// 삭제 체크
function checkDelete ()
{
    var $btnDelete = $ ( '#btn_delete' );

    $btnDelete.click ( function ()
    {
        var acntIdArray = [];
        var $that = $ ( this );

        $ ( '.progrmSeqs' ).each ( function ()
        {
            if ( $ ( this ).prop ( 'checked' ) )
            {
                acntIdArray.push ( $ ( this ).val () );
            }
        } );

        if ( acntIdArray.length === 0 )
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
                    location.href = $that.attr ( 'href' ) + '?progrmSeq=' + acntIdArray.toString ();
                }
            } );
        }

        return false;
    } );
}

// jqgrid 검색
function searchJqgrid ()
{
    var $btn_search = $ ( '#btn_search' );
    var $gridList = $ ( '#gridList' );

    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );

    $btn_search.click ( function ()
    {
        reloadJqgrid ( $gridList, $searchKey, $searchValue );
    } );

    $searchValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadJqgrid ( $gridList, $searchKey, $searchValue );
        }
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $searchKey, $searchValue )
{
    searchCondition = {
        searchKey : $ ( ":selected", $searchKey ).val (),
        searchKeyword : $searchValue.val ()
    };

    $gridList.setGridParam ( {
        postData : {
            searchKey : searchCondition.searchKey,
            searchKeyword : searchCondition.searchKeyword
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

// 등록버튼 클릭시 조건 맵핑
function clickRegBtn ()
{
    var $btnReg = $ ( '#btn_reg' );

    $btnReg.on ( 'click', function ()
    {
        location.href = $btnReg.attr ( 'href' ) + '&searchKey=' + searchCondition.searchKey + '&searchValue='
                + encodeURIComponent ( searchCondition.searchKeyword );

        return false;
    } );
}

$ ( function ()
{
    searchCondition = {
        searchKey : paramSearchKey,
        searchKeyword : paramSearchValue
    };

    customizeForm ();
    customizeJqgrid ();
    clickRegBtn ();
    checkDelete ();
    searchJqgrid ();
    switchButtonGroup ();
    checkMessage ();
} );