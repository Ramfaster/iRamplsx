// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );

    // 검색 조건
    var $dateType = $ ( '#search_type' ).customizeSelect ( {
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

    var noDataTpl = getTemplate ( templates.noData );
    var retryBtnTpl = getTemplate ( templates.retryBtn );
    var failTpl = getTemplate ( templates.fail );
    var $searchKey = $ ( '#search_type' );
    var $searchValue = $ ( '#searchValue' );

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/scheduler/list.ajax',
                datatype : 'json',
                height : '642',
                autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
                shrinkToFit : false, // 컬럼너비 자동 지정
                // :default:false

                rowNum : 30,
                // rowList : [ 10, 20 ],

                mtype : "POST",
                // mtype : "GET",
                postData : {
                    page : 1,
                    rows : 30,
                    sidx : 1,
                    sord : 1,
                    searchKey : $ ( ':selected', $searchKey ).val (),
                    searchKeyword : $searchValue.val ()
                },

                // caption : 'jqGrid Sample Table', //title

                sortname : "succesAt", // 처음 정렬될 컬럼
                sortorder : "asc", // 정렬방법 (asc/desc)
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

                colNames : [ "schdulMgtSeq", i18nMessage.msg_jobName, i18nMessage.msg_executeCycle,
                        i18nMessage.msg_jobClass, i18nMessage.msg_description, i18nMessage.msg_executeDate,
                        i18nMessage.msg_terminateDate, i18nMessage.msg_successYn, i18nMessage.msg_failReason,
                        i18nMessage.msg_retry, i18nMessage.msg_useAvailability, i18nMessage.msg_registrationDate ],

                colModel : [ {
                    name : 'schdulMgtSeq'
                }, {
                    name : 'schdulNm',
                    index : '',
                    align : 'left',
                    width : '140'
                }, {
                    name : 'cronExpr',
                    index : '',
                    align : 'left',
                    width : '110'
                }, {
                    name : 'classNm',
                    index : '',
                    align : 'left',
                    width : '280'
                }, {
                    name : 'schdulDesc',
                    index : '',
                    align : 'left',
                    width : '200'
                }, {
                    name : 'executDt',
                    index : '',
                    align : 'center',
                    width : '140'
                }, {
                    name : 'trmnatDt',
                    index : '',
                    align : 'center',
                    width : '140'
                }, {
                    name : 'succesAt',
                    index : '',
                    align : 'center',
                    width : '90'
                }, {
                    name : 'msg',
                    index : '',
                    align : 'left',
                    width : '200'
                }, {
                    name : 'retry',
                    index : '',
                    align : 'center',
                    width : '80',
                    hidden : true
                }, {
                    name : 'usgAt',
                    index : '',
                    align : 'center',
                    width : '80'
                }, {
                    name : 'regDt',
                    index : '',
                    align : 'center',
                    width : '150'
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
                    $gridList.jqGrid ( 'hideCol', [ 'schdulMgtSeq' ] );
                    // hide column ======================== end

                    // 조회건수 설정
                    $ ( "#totalCount" ).html (
                            i18nMessage.msg_searchCount + " " + homUtil.addNumberComma ( data.records )
                                    + i18nMessage.msg_count );

                    if ( data.records === 0 )
                    {
                        $ ( "#totalCount" ).html ( i18nMessage.msg_searchCount + " 0" + i18nMessage.msg_count );
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
                            var rowUsgAt = rowData.usgAt;
                            var rowSuccesAt = rowData.succesAt;

                            // 사용/미사용 alias
                            if ( rowData.usgAt !== null && rowData.usgAt === 'Y' )
                            {
                                rowData.usgAt = i18nMessage.msg_use;
                            } else if ( rowData.usgAt !== null && rowData.usgAt === 'N' )
                            {
                                rowData.usgAt = i18nMessage.msg_unuse;
                            }

                            // 성공/실패
                            if ( rowData.succesAt !== null && rowData.succesAt === 'Y' )
                            {
                                rowData.succesAt = i18nMessage.msg_success;
                            } else if ( rowData.succesAt !== null && rowData.succesAt === 'N' )
                            {
                                if ( failTpl != null )
                                {
                                    var template = _.template ( failTpl );
                                    var html = template ( {
                                        message : i18nMessage.msg_fail
                                    } );
                                    rowData.succesAt = html;
                                }
                            }

                            // 재실행 버튼 추가
                            if ( rowUsgAt == 'Y' && rowSuccesAt == 'N' )
                            {
                                if ( retryBtnTpl != null )
                                {
                                    var template = _.template ( retryBtnTpl );
                                    var html = template ( {
                                        id : rowData.schdulMgtSeq,
                                        retry : i18nMessage.msg_retry
                                    } );
                                    rowData.retry = html;
                                }
                            }

                            $gridList.jqGrid ( 'setRowData', cl, rowData );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                name : 'schdulMgtSeq',
                                value : rowData.schdulMgtSeq
                            } ).addClass ( 'schdulMgtSeq' );

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

                    location.href = contextPath + '/hom/sysmgt/scheduler/view.do?schdulMgtSeq=' + rowData.schdulMgtSeq
                            + '&searchKey=' + searchCondition.searchKey + '&searchValue='
                            + encodeURIComponent ( searchCondition.searchKeyword );

                },

                beforeSelectRow : function ( rowid, e )
                {
                    console.log ( '>>>>> beforeSelectRow' );
                    return true;
                },

                onSelectAll : function ( aRowids, status )
                {
                    console.log ( ">>>>> onSelectAll" );

                },

                // paging 부분의 버튼 액션 처리 first, prev, next, last, records ex) if(action == 'next')
                onPaging : function ( action )
                {
                    console.log ( '>>>>> onPaging' );
                },

                gridComplete : function ()
                {
                    console.log ( ">>>>> gridComplete " );
                },

                loadBeforeSend : function ()
                {
                    console.log ( 'loadBeforeSend' );
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
// jqgrid end

// event listener 설정
function setEventListener ()
{
    var $btn_search = $ ( '#btn_search' );
    var $gridList = $ ( '#gridList' );

    var $searchKey = $ ( '#search_type' );
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

/**
 * 재실행 이벤트 설정
 */
function setRetryBtnEventListener ()
{
    $ ( document ).on ( 'click', '.btn_intbl', function ()
    {
        var $schdulMgtSeq = $ ( this ).data ( 'id' );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_retryYn,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                console.log ( $schdulMgtSeq );
                retrySchedule ( $schdulMgtSeq );
            }
        } );
    } );
}

function retrySchedule ( $schdulMgtSeq )
{
    $.ajax ( {
        url : contextPath + '/hom/sysmgt/scheduler/retry.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        data : {
            schdulMgtSeq : $schdulMgtSeq,
            testData : 1
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertRetrySuccess,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

                // Grid reload
                // var $gridList = $ ( '#gridList' );
                // var $searchKey = $ ( '#search_type' );
                // var $searchValue = $ ( '#searchValue' );
                // reloadJqgrid ( $gridList, $searchKey, $searchValue );

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

$ ( function ()
{
    searchCondition = {
        searchKey : paramSearchKey,
        searchKeyword : paramSearchValue
    };

    customizeForm ();
    customizeJqgrid ();
    setEventListener ();
    setRetryBtnEventListener ();
    clickRegBtn ();
} );
