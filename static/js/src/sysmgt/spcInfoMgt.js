// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png'
    } );

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

function setColModel ()
{
    var colModel = [ {
        name : 'spcId',
    }, {
        name : 'spcEngNm',
        index : '',
        align : 'left',
        width : '400'
    }, {
        name : 'nationNm',
        index : '',
        align : 'left',
        width : '400'
    }, {
        name : 'areaNm',
        index : '',
        align : 'left',
        width : '400'
    }, {
        name : 'fondDt',
        index : '',
        align : 'center',
        width : '210'
    }, {
        name : 'usgAt',
        index : '',
        align : 'center',
        width : '150'
    } ];

    if ( lang == locale.korea || lang == locale.korean )
    {
        colModel = [ {
            name : 'spcId',
        }, {
            name : 'spcKorNm',
            index : '',
            align : 'left',
            width : '400'
        }, {
            name : 'nationNm',
            index : '',
            align : 'left',
            width : '400'
        }, {
            name : 'areaNm',
            index : '',
            align : 'left',
            width : '400'
        }, {
            name : 'fondDt',
            index : '',
            align : 'center',
            width : '210'
        }, {
            name : 'usgAt',
            index : '',
            align : 'center',
            width : '150'
        } ];
    }

    return colModel;
}
// jqgrid start
function jqGridBasic ()
{
    var colModel = setColModel ();
    var $totalRowCount = $ ( "#totalRowCount" );
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/spc/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    searchKey : $ ( ':selected', $searchKey ).val (),
                    searchKeyword : $searchValue.val ()
                },
                height : 642,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ "spcId", i18nMessage.msg_spcName, i18nMessage.msg_nation, i18nMessage.msg_area,
                        i18nMessage.msg_foundationDate, i18nMessage.msg_useAvailability ],
                colModel : colModel,
                sortname : 'spcId',
                sortorder : 'asc',
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

                    // 조회결과 타이틀
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $totalRowCount.html ( resultText );

                    // scaleSeq는 보여주지않음
                    var $gridList = $ ( '#gridList' );
                    $gridList.jqGrid ( 'hideCol', [ 'spcId' ] );

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

                            // 사용/미사용 alias
                            if ( rowData.usgAt !== null && rowData.usgAt === 'Y' )
                            {
                                rowData.usgAt = i18nMessage.msg_use;
                            } else if ( rowData.usgAt !== null && rowData.usgAt === 'N' )
                            {
                                rowData.usgAt = i18nMessage.msg_unuse;
                            }

                            $gridList.jqGrid ( 'setRowData', cl, rowData );
                        }
                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );
                    var $searchKey = $ ( '#searchKey' );
                    var $searchValue = $ ( '#searchValue' );

                    location.href = contextPath + '/hom/sysmgt/spc/view.do?spcId=' + rowData.spcId + '&searchKey='
                            + searchCondition.searchKey + '&searchValue='
                            + encodeURIComponent ( searchCondition.searchKeyword );
                }
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

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    // jqgrid
    jqGridBasic ();
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
// jqgrid end

// 엑셀 다운로드
function clickBtnExcel ()
{
    var $btnExcel = $ ( '.btn_excel' );
    $btnExcel.on ( 'click', function ()
    {
        var $searchKey = $ ( '#searchKey' );
        var $searchValue = $ ( '#searchValue' );

        var menuName = '';
        $ ( '.lnb' ).find ( 'span' ).each ( function ()
        {
            menuName += ($ ( this ).text () + '_');
        } );

        menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

        var params = {
            searchKey : searchCondition.searchKey,
            searchKeyword : encodeURIComponent ( searchCondition.searchKeyword ),
            menuName : encodeURIComponent ( menuName )
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

        return false;
    } );
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

// 세션 만료 체크
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
    searchCondition = {
        searchKey : paramSearchKey,
        searchKeyword : paramSearchValue
    };

    customizeForm ();
    customizeJqgrid ();
    clickRegBtn ();
    searchJqgrid ();
    checkMessage ();
    clickBtnExcel ();
} );