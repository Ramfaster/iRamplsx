var searchCondition = null;

// form element customize
function customizeForm ()
{
    // 설비 구분
    var $dateType1 = $ ( '#nationId, #spcId,.customize_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
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

// jqgird customize
function customizeJqgrid ()
{

    var tpl = getTemplate ( templates.noData );

    var colNames = null;
    var colModel = null;
    var $totalRowCount = $ ( "#totalRowCount" );

    paramNationId = $ ( ":selected", $ ( '#nationId' ) ).val ();
    paramSpcId = $ ( ":selected", $ ( '#spcId' ) ).val ();
    paramSearchKey = $ ( ":selected", $ ( "#searchKey" ) ).val ();
    paramsearchKeyword = $ ( '#searchKeyword' ).val ();

    // if ( $ ( '#spcId' ).is ( ':visible' ) )
    // {
    // paramSpcId = 'all';
    // }

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ i18nMessage.msg_spcName, i18nMessage.msg_assetLoanName, i18nMessage.msg_assetLoanSum,
                i18nMessage.msg_assetLoanRepay, i18nMessage.msg_assetLoanWithdraw, i18nMessage.msg_largeBundle,
                i18nMessage.msg_assetProxyFin, i18nMessage.msg_description, 'hiddenSpcId' ];
        colModel = [ {
            name : 'spcNm',
            width : 250,
            align : 'center',
            fixed : true
        }, {
            name : 'lonKorNm',
            width : 250,
            align : 'center',
            fixed : true
        }, {
            name : 'lonTotAmt',
            width : 165,
            align : 'right',
            fixed : true,
            formatter : customFormat
        }, {
            name : 'lonEnggDt',
            width : 165,
            align : 'center',
            fixed : true
        }, {
            name : 'frstDrtDt',
            width : 165,
            align : 'center',
            fixed : true
        }, {
            name : 'lrgeBundle',
            width : 165,
            align : 'center',
            fixed : true
        }, {
            name : 'sectnNm',
            width : 165,
            align : 'center',
            fixed : true
        }, {
            name : 'repyDesc',
            width : 233,
            align : 'center',
            fixed : true
        }, {
            name : 'spcId',
            width : 0,
            align : 'center',
            fixed : true,
            hidden : true
        } ];
    } else
    {
        colNames = [ i18nMessage.msg_spcName, i18nMessage.msg_assetLoanName, i18nMessage.msg_assetLoanSum,
                i18nMessage.msg_assetLoanRepay, i18nMessage.msg_assetLoanWithdraw, i18nMessage.msg_largeBundle,
                i18nMessage.msg_assetProxyFin, i18nMessage.msg_description, 'hiddenSpcId' ];
        colModel = [ {
            name : 'spcNm',
            width : 250,
            align : 'center',
            fixed : true
        }, {
            name : 'lonEngNm',
            width : 250,
            align : 'center',
            fixed : true
        }, {
            name : 'lonTotAmt',
            width : 165,
            align : 'right',
            fixed : true,
            formatter : customFormat
        }, {
            name : 'lonEnggDt',
            width : 165,
            align : 'center',
            fixed : true
        }, {
            name : 'frstDrtDt',
            width : 165,
            align : 'center',
            fixed : true
        }, {
            name : 'lrgeBundle',
            width : 165,
            align : 'center',
            fixed : true
        }, {
            name : 'sectnNm',
            width : 165,
            align : 'center',
            fixed : true
        }, {
            name : 'repyDesc',
            width : 233,
            align : 'center',
            fixed : true
        }, {
            name : 'spcId',
            width : 0,
            align : 'center',
            fixed : true,
            hidden : true
        } ];
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/asset/companyRepayFund/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 575,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    nationId : paramNationId == 'all' ? '' : paramNationId,
                    spcId : paramSpcId == 'all' ? '' : paramSpcId,
                    searchKey : paramSearchKey == 'all' ? '' : paramSearchKey,
                    searchKeyword : encodeURIComponent ( paramsearchKeyword )
                },
                colNames : colNames,
                colModel : colModel,
                sortname : 'spcNm',
                sortorder : 'asc',
                multiselect : false,
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
                    var $gqNodata = $ ( '.gq_nodata' );

                    // 조회결과
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $totalRowCount.html ( resultText );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                        $ ( '#btn_excel_popup' ).addClass ( 'dnone' );
                    } else
                    {
                        $ ( '#btn_excel_popup' ).removeClass ( 'dnone' );
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var ids = $gridList.jqGrid ( 'getDataIDs' );
                    }

                    $ ( "#load_gridList" ).hide ();
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );

                    location.href = contextPath + '/hom/asset/companyRepayFund/view.do?spcId=' + rowData.spcId
                            + '&nationId=' + paramNationId + '&searchKey=' + paramSearchKey + '&searchKeyword='
                            + encodeURIComponent ( paramsearchKeyword ) + '&paramSpcId=' + rowData.spcId
                            + '&paramNationId=' + paramNationId;
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
    var $searchKeyword = $ ( '#searchKeyword' );

    $btn_search.on ( 'click', function ()
    {
        reloadJqgrid ( $gridList );
    } );

    $searchKeyword.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadJqgrid ( $gridList );
        }
    } );
}

function checkBtns ()
{
    var vbtnAdd = $ ( '#btn_reg' );
    var $searchKeyword = $ ( '#searchKeyword' );

    vbtnAdd.on ( 'click', function ()
    {
        location.href = $ ( this ).attr ( 'href' ) + '&paramNationId=' + $ ( ':selected', '#nationId' ).val ()
                + '&paramSpcId=' + $ ( ':selected', '#spcId' ).val () + '&searchKey='
                + $ ( ":selected", "#searchKey" ).val () + '&searchKeyword='
                + encodeURIComponent ( $ ( '#searchKeyword' ).val () );

        return false;
    } );
}

function downloadExcel ()
{

    $ ( '#btn_excel_popup' ).click (
            function ()
            {
                var spcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
                var menuName = '';
                $ ( '.lnb' ).find ( 'span' ).each ( function ()
                {
                    menuName += ($ ( this ).text () + '_');
                } );

                menuName += $ ( '.lnb' ).find ( 'strong' ).text ();
                // sevenBuff
                var href = contextPath + '/hom/excel/asset/companyRepayFund/download.do?spcId=' + spcId + '&sevenBuff='
                        + encodeURIComponent ( menuName );

                location.href = href;

            } );
}

// jqgrid reload
function reloadJqgrid ( $gridList )
{

    paramNationId = $ ( ":selected", $ ( "#nationId" ) ).val ();
    paramSpcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
    paramSearchKey = $ ( ":selected", $ ( "#searchKey" ) ).val ();
    paramsearchKeyword = $ ( '#searchKeyword' ).val ();

    $gridList.setGridParam ( {
        postData : {
            nationId : paramNationId === 'all' ? '' : paramNationId,
            spcId : paramSpcId === 'all' ? '' : paramSpcId,
            searchKey : paramSearchKey === 'all' ? '' : paramSearchKey,
            searchKeyword : encodeURIComponent ( $ ( '#searchKeyword' ).val () )
        }
    } ).trigger ( 'reloadGrid' );
}

// 국가별 발전소 정보 가져오기
function getNationPvInfo ()
{
    var $nationId = $ ( '#nationId' );
    var $spcId = $ ( '#spcId' );
    var tpl = getTemplate ( templates.paramSpcInfoSelect );

    $nationId.on ( 'change', function ( event )
    {
        var params = {
            nationId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/asset/companyRepayFund/selectMainSpcInfoList.ajax',
            type : 'POST',
            data : params,
            dataType : 'json',
            async : false,
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            msg_selection : i18nMessage.msg_selection,
                            paramSpcId : paramSpcId,
                            spcInfoList : json.data
                        } );

                        $spcId.empty ().html ( html ).trigger ( 'change' );

                        if ( paramFirstLoad == false )
                        {
                            customizeJqgrid ();
                            paramFirstLoad = true
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
    } );
}

function customFormat ( cellValue, options, rowdata, action )
{
    // return homUtil.addNumberComma ( cellValue );
    return homUtil.mathFloorComma ( cellValue, staticVariable.decimalPoint );
}

function initSearchParam ()
{
    if ( '' != paramNationId )
    {
        $ ( '#nationId' ).val ( paramNationId ).trigger ( 'change' );
    } else
    {
        $ ( '#nationId' ).val ( acntNationId ).trigger ( 'change' );
    }
    if ( '' != paramSpcId )
    {
        $ ( '#spcId' ).val ( paramSpcId ).trigger ( 'change' );
    }

}

$ ( function ()
{
    customizeForm ();
    checkBtns ();
    getNationPvInfo ();
    // customizeJqgrid ();
    searchJqgrid ();
    downloadExcel ();

    initSearchParam ();

} );