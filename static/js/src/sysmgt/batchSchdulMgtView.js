// form element customize
function customizeForm ()
{
}

// jqgird customize
function customizeJqgrid ()
{
    var noDataTpl = getTemplate ( templates.noData );
    var failTpl = getTemplate ( templates.fail );
    var errorDetailTpl = getTemplate ( templates.batchErrorDetail );

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/scheduler/histList.ajax',
                mtype : "POST",
                datatype : 'json',
                height : '454',
                autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
                shrinkToFit : false, // 컬럼너비 자동 지정
                // :default:false

                rowNum : staticVariable.gridRow30,
                // rowList : [ 10, 20 ],

                // mtype : "GET",
                postData : {
                    page : 1,
                    rows : 30,
                    sidx : 1,
                    sord : 1,
                    schdulMgtSeq : paramSchdulMgtSeq
                },

                // caption : 'jqGrid Sample Table', //title

                sortname : "cronDt", // 처음 정렬될 컬럼
                sortorder : "desc", // 정렬방법 (asc/desc)
                rownumbers : true,
                // styleUI : 'Bootstrap',

                multiselect : true, // multi-select checkboxes appear
                multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
                // time

                page : 1,
                scroll : true, // set the scroll property to 1 to enable paging with scrollbar - virtual loading of
                // records
                emptyrecords : i18nMessage.msg_sentenceGridNoData, // the message will be displayed at the bottom

                // pager: '#samplePager',

                colNames : [ "histSeq", "schdulMgtSeq", i18nMessage.msg_executeDate, i18nMessage.msg_terminateDate,
                        i18nMessage.msg_successYn, i18nMessage.msg_msg ],

                colModel : [ {
                    name : 'histSeq',
                    width : '70'
                }, {
                    name : 'schdulMgtSeq',
                    width : '70'
                }, {
                    name : 'cronDt',
                    index : '',
                    align : 'center',
                    width : '160'
                }, {
                    name : 'trmnatDt',
                    index : '',
                    align : 'center',
                    width : '160'
                }, {
                    name : 'complSttus',
                    index : '',
                    align : 'center',
                    width : '110'
                }, {
                    name : 'msg',
                    index : '',
                    align : 'left',
                    width : '265'
                } ],

                loadError : function ( xhr, st, err )
                {
                    // alert("err-->" + err);
                    console.log ( ">>>>> loadError " );
                    console.log ( err );
                },

                loadComplete : function ( data )
                {
                    var $gridList = $ ( '#gridList' );
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
                    var $gqNodata = $ ( '.gq_nodata' );

                    // hide column ======================== start
                    $gridList.jqGrid ( 'hideCol', [ 'histSeq' ] );
                    $gridList.jqGrid ( 'hideCol', [ 'schdulMgtSeq' ] );
                    // hide column ======================== end

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

                            // 성공/실패 alias
                            if ( rowData.complSttus != null && rowData.complSttus == 'Y' )
                            {
                                rowData.complSttus = i18nMessage.msg_success;

                            } else if ( rowData.complSttus != null && rowData.complSttus == 'N' )
                            {
                                if ( failTpl != null )
                                {
                                    /* 성공,실패 템플릿 */
                                    var template = _.template ( failTpl );
                                    var html = template ( {
                                        message : i18nMessage.msg_fail
                                    } );
                                    rowData.complSttus = html;

                                    /* 에러 메시지 템플릿 popupLink */
                                    var popupLink = contextPath
                                            + '/hom/sysmgt/scheduler/batchSchdulMgtViewPopup.do?histSeq='
                                            + rowData.histSeq;

                                    var errorTemplate = _.template ( errorDetailTpl );
                                    var errorHtml = errorTemplate ( {
                                        errorMessage : rowData.msg,
                                        popupLink : popupLink,
                                        detail : i18nMessage.msg_detail
                                    } );

                                    rowData.msg = errorHtml;

                                }
                            }
                            $gridList.jqGrid ( 'setRowData', cl, rowData );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                name : 'histSeq',
                                value : rowData.histSeq
                            } ).addClass ( 'histSeqs' );

                        }

                        showPopup ();
                    }

                },
                viewrecords : false
            /* 화면 하단에 총 데이터 갯수와 현재 페이지의 데이터가 몇번째 데이터인지 화면에 노출 */
            } );

    if ( noDataTpl !== null )
    {
        var template = _.template ( noDataTpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid end

// jqgrid reload
function reloadJqgrid ( $gridList, $searchKey, $searchValue )
{

    $gridList.setGridParam ( {
        postData : {
            searchKey : $ ( ":selected", $searchKey ).val (),
            searchKeyword : $searchValue.val ()
        }
    } ).trigger ( 'reloadGrid' );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.frm_cont_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );
}

/** 이력 관리 */
function btnHistoryMgt ()
{

    /** 체크 박스 처리. * */
    var $gridList = $ ( '#gridList' );
    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
    disableJqgridCheckbox ( $gridList, $checkboxs );

    // 이력 관리 클릭 이벤트
    $ ( '#btn_HistoryMgt' )
            .click (
                    function ()
                    {

                        /** 기존 HTML 제거 * */
                        $ ( '#btn_HistoryMgt' ).remove ();

                        /** 삭제 후 저장 추가 * */
                        var html = "<a href='javascript:;' id='btn_removeAndSave'class='btn_intbl org link'><i class='icon_bch02'></i>"
                                + i18nMessage.msg_batchMgtRemoveAndSave + "</a>";

                        $ ( '.btn_set' ).append ( html );

                        btnRemoveAndSave ();

                    } );

}

/** 삭제 저장. * */
function btnRemoveAndSave ()
{

    $ ( '#btn_removeAndSave' )
            .click (
                    function ()
                    {
                        /** 삭제 처리 * */
                        historyRemoveAndSave ();

                        /** 기존 HTML 제거 * */
                        $ ( '#btn_removeAndSave' ).remove ();

                        /** 삭제 후 저장 추가 * */
                        var html = "<a href='javascript:;' id='btn_HistoryMgt' class='btn_intbl link'><i class='icon_bch01'></i>"
                                + i18nMessage.msg_batchMgtHistoryMgt + "</a>";

                        $ ( '.btn_set' ).append ( html );

                        btnHistoryMgt ();

                    } );

    /** 체크 박스 처리. * */
    var $gridList = $ ( '#gridList' );
    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
    enableJqgridCheckbox ( $gridList, $checkboxs );
}

/** 삭제 처리. * */
function historyRemoveAndSave ()
{

    var histSeqArray = '';
    $ ( '.histSeqs' ).each ( function ()
    {
        if ( $ ( this ).prop ( 'checked' ) )
        {
            histSeqArray += $ ( this ).val () + ",";
        }
    } );

    // histSeqs

    if ( histSeqArray )
    {
        $.ajax ( {
            url : contextPath + '/hom/sysmgt/scheduler/batchSchdulHistoryRemove.ajax',
            type : 'POST',
            dataType : 'json',
            async : false,
            data : {
                histSeqStr : histSeqArray
            },
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    reloadJqgrid ();

                } else
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

// jqgrid reload
function reloadJqgrid ()
{

    $ ( '#gridList' ).setGridParam ( {
        postData : {
            schdulMgtSeq : paramSchdulMgtSeq
        }
    } ).trigger ( 'reloadGrid' );

}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    customizeJqgrid ();

    /** 이력 관리 클릭 이벤트* */
    btnHistoryMgt ();

} );
