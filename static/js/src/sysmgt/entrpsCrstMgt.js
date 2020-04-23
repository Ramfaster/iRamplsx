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
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );

    colNames = [ i18nMessage.msg_corprId, "Sectn_CD", i18nMessage.msg_corprSectn, i18nMessage.msg_corprName,
            i18nMessage.msg_corprEnglishName ];
    colModel = [ {
        name : 'corprId',
        width : 250,
        align : 'left'
    }, {
        name : 'sectnCd',
        hidden : true
    }, {
        name : 'sectnNm',
        width : 260,
        align : 'left'
    }, {
        name : 'corprKorNm',
        width : 350,
        align : 'left'
    }, {
        name : 'corprEngNm',
        width : 320,
        align : 'left'
    } ];

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/entrps/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    searchKey : $ ( ':selected', $searchKey ).val (),
                    searchKeyword : $searchValue.val ()
                },
                height : 642,
                autowidth : true,
                shrinkToFit : true,
                colNames : colNames,
                colModel : colModel,
                sortname : 'corprId',
                sortorder : 'asc',
                multiselect : false,
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
                    var $gqNodata = $ ( '.gq_nodata' );

                    // 조회결과 타이틀
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $ ( "#totalRowCount" ).html ( resultText );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );
                    var $searchKey = $ ( '#searchKey' );
                    var $searchValue = $ ( '#searchValue' );

                    location.href = contextPath + '/hom/sysmgt/entrps/view.do?corprId=' + rowData.corprId
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

// jqgrid end

$ ( function ()
{
    searchCondition = {
        searchKey : paramSearchKey,
        searchKeyword : paramSearchValue
    };

    customizeForm ();
    customizeJqgrid ();
    searchJqgrid ();
    clickRegBtn ();
} );