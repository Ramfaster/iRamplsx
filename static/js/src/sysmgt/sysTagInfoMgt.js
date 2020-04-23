var searchCondition = null;

// form element customize
function customizeForm ()
{
    // 설비 구분
    var $selType = $ ( '.sel_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    // 검색 조건
    var $searchKey = $ ( '#searchKey' ).customizeSelect ( {
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
        name : 'pvNm',
        index : '',
        align : 'left',
        width : '175'
    }, {
        name : 'eqmtNm',
        index : '',
        align : 'left',
        width : '100'
    }, {
        name : 'tagId',
        index : '',
        align : 'left',
        width : '260'
    }, {
        name : 'tagEngNm',
        index : '',
        align : 'left',
        width : '155'
    }, {
        name : 'cndfrmlaTyNm',
        index : '',
        align : 'center',
        width : '120'
    }, {
        name : 'paramtrTypeNm',
        index : '',
        align : 'center',
        width : '115'
    }, {
        name : 'paramtrNm',
        index : '',
        align : 'left',
        width : '110'
    }, {
        name : 'reflctBeginDt',
        index : '',
        align : 'center',
        width : '150'
    }, {
        name : 'reflctTrmnatDt',
        index : '',
        align : 'center',
        width : '150'
    }, {
        name : 'tagStdrInfoHistCount',
        index : '',
        align : 'center',
        width : '95',
        sortable : false
    }, {
        name : 'tagReflctCount',
        index : '',
        align : 'center',
        width : '95',
        sortable : false
    } ];

    if ( lang == locale.korea || lang == locale.korean )
    {
        colModel = [ {
            name : 'pvNm',
            index : '',
            align : 'left',
            width : '175'
        }, {
            name : 'eqmtNm',
            index : '',
            align : 'left',
            width : '100'
        }, {
            name : 'tagId',
            index : '',
            align : 'left',
            width : '260'
        }, {
            name : 'tagKorNm',
            index : '',
            align : 'left',
            width : '155'
        }, {
            name : 'cndfrmlaTyNm',
            index : '',
            align : 'center',
            width : '120'
        }, {
            name : 'paramtrTypeNm',
            index : '',
            align : 'center',
            width : '115'
        }, {
            name : 'paramtrNm',
            index : '',
            align : 'left',
            width : '110'
        }, {
            name : 'reflctBeginDt',
            index : '',
            align : 'center',
            width : '150'
        }, {
            name : 'reflctTrmnatDt',
            index : '',
            align : 'center',
            width : '150'
        }, {
            name : 'tagStdrInfoHistCount',
            index : '',
            align : 'center',
            width : '95',
            sortable : false
        }, {
            name : 'tagReflctCount',
            index : '',
            align : 'center',
            width : '95',
            sortable : false
        } ];
    }

    return colModel;
}
// jqgrid start
function jqGridBasic ()
{
    var colModel = setColModel ();
    var tpl = getTemplate ( templates.tagHistBtn );
    var tagReflctBtnTpl = getTemplate ( templates.tagReflctBtn );

    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );
    var $selPvId = $ ( '#sel_pv_id' );
    var $selEqmt = $ ( '#sel_eqmt' );
    var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
    var $selEqmtGrp = $ ( '#sel_eqmt_grp' );

    var paramPvId = $ ( ":selected", $selPvId ).val ();
    var paramEqmtGrpCd = $ ( ":selected", $selEqmtGrp ).val ();
    var paramAdiEqmtId = $ ( ":selected", $selAdiEqmt ).val ();
    var paramEqmtId = $ ( ":selected", $selEqmt ).val ();

    if ( !$selAdiEqmt.is ( ':visible' ) )
    {
        paramAdiEqmtId = 'all';
    }

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/systag/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    pvId : $ ( '#sel_pv_id' ).val (),
                    pvId : paramPvId === 'all' ? '' : paramPvId,
                    eqmtGrpCd : paramEqmtGrpCd === 'all' ? '' : paramEqmtGrpCd,
                    adiEqmtId : paramAdiEqmtId === 'all' ? '' : paramAdiEqmtId,
                    eqmtId : paramEqmtId === 'all' ? '' : paramEqmtId,
                    searchKey : $ ( ":selected", $searchKey ).val (),
                    searchKeyword : $searchValue.val ()
                },
                height : 600,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ i18nMessage.msg_electricPowerStation, i18nMessage.msg_eqmtName,
                        i18nMessage.msg_systemTagId, i18nMessage.msg_systemTagName, i18nMessage.msg_cndfrm,
                        i18nMessage.msg_parameterType, i18nMessage.msg_parameterName,
                        i18nMessage.msg_reflectionBeginDate, i18nMessage.msg_reflectionTerminateDate,
                        i18nMessage.msg_updateHistory, i18nMessage.msg_reflectExpected ],
                colModel : colModel,
                sortname : 'pvNm',
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

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();
                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        if ( tpl !== null && tagReflctBtnTpl != null )
                        {
                            var $gridList = $ ( '#gridList' );
                            var ids = $gridList.jqGrid ( "getDataIDs" );
                            for ( var i = 0, length = ids.length; i <= length; i++ )
                            {
                                var cl = ids[i];
                                var rowData = $gridList.getRowData ( cl );

                                if ( rowData.tagStdrInfoHistCount !== null
                                        && $.isNumeric ( rowData.tagStdrInfoHistCount ) )
                                {

                                    // 이력 버튼 생성
                                    if ( rowData.tagStdrInfoHistCount > 0 )
                                    {
                                        var template = _.template ( tpl );
                                        var html = template ( {
                                            contextPath : contextPath,
                                            btnText : i18nMessage.msg_history,
                                            tagId : encodeURIComponent ( rowData.tagId )
                                        } );

                                        rowData.tagStdrInfoHistCount = html;
                                    } else
                                    {
                                        rowData.tagStdrInfoHistCount = '';
                                    }
                                }

                                if ( (rowData.tagReflctCount !== null && $.isNumeric ( rowData.tagReflctCount )) )
                                {
                                    // 반영 예정 버튼 생성
                                    if ( rowData.tagReflctCount > 0 )
                                    {
                                        var template = _.template ( tagReflctBtnTpl );
                                        var html = template ( {
                                            contextPath : contextPath,
                                            btnText : i18nMessage.msg_reflect,
                                            tagId : encodeURIComponent ( rowData.tagId )
                                        } );

                                        rowData.tagReflctCount = html;
                                    } else
                                    {
                                        rowData.tagReflctCount = '';
                                    }
                                }

                                $gridList.jqGrid ( 'setRowData', cl, rowData );
                            }
                        }

                        showPopup ();
                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );

                    location.href = contextPath + '/hom/sysmgt/systag/view.do?tagId='
                            + encodeURIComponent ( rowData.tagId ) + '&selPvId=' + searchCondition.pvId
                            + '&selEqmtGrp=' + searchCondition.eqmtGrpCd + '&selAdiEqmt=' + searchCondition.adiEqmtId
                            + '&selEqmt=' + searchCondition.eqmtId + '&searchKey=' + searchCondition.searchKey
                            + '&searchValue=' + encodeURIComponent ( searchCondition.searchKeyword );
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

    var $selPvId = $ ( '#sel_pv_id' );
    var $selEqmt = $ ( '#sel_eqmt' );
    var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
    var $selEqmtGrp = $ ( '#sel_eqmt_grp' );

    $btn_search.click ( function ()
    {
        reloadJqgrid ( $gridList, $selPvId, $selEqmt, $searchKey, $searchValue, $selAdiEqmt, $selEqmtGrp );
    } );

    $searchValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadJqgrid ( $gridList, $selPvId, $selEqmt, $searchKey, $searchValue, $selAdiEqmt, $selEqmtGrp );
        }
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $selPvId, $selEqmt, $searchKey, $searchValue, $selAdiEqmt, $selEqmtGrp )
{
    var pvId = $ ( ":selected", $selPvId ).val ();
    var eqmtGrpCd = $ ( ":selected", $selEqmtGrp ).val ();
    var adiEqmtId = $ ( ":selected", $selAdiEqmt ).val ();
    var eqmtId = $ ( ":selected", $selEqmt ).val ();

    var visible = $ ( '#sel_adi_eqmt' ).is ( ':visible' );

    if ( !visible )
    {
        adiEqmtId = 'all';
    }

    searchCondition = {
        pvId : pvId === 'all' ? '' : pvId,
        eqmtGrpCd : eqmtGrpCd === 'all' ? '' : eqmtGrpCd,
        adiEqmtId : adiEqmtId === 'all' ? '' : adiEqmtId,
        eqmtId : eqmtId === 'all' ? '' : eqmtId,
        searchKey : $ ( ":selected", $searchKey ).val (),
        searchKeyword : $searchValue.val ()
    };

    $gridList.setGridParam ( {
        postData : {
            pvId : pvId === 'all' ? '' : pvId,
            eqmtGrpCd : eqmtGrpCd === 'all' ? '' : eqmtGrpCd,
            adiEqmtId : adiEqmtId === 'all' ? '' : adiEqmtId,
            eqmtId : eqmtId === 'all' ? '' : eqmtId,
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

// 발전소를 선택 했을때 설비 그룹 정보를 가져옴
function getEqmtGrpInfoList ( isKorean )
{
    var $selPvId = $ ( '#sel_pv_id' );
    var $selEqmtGrp = $ ( '#sel_eqmt_grp' );
    var $btnPopup = $ ( '#all_reflct_popup' );
    var tpl = getTemplate ( templates.grpEqmtSelect );

    $selPvId.on ( 'change', function ()
    {
        // var pvId = $ ( ':selected', $ ( this ) ).val ();
        getEqmtGrpInfoListAjax ( isKorean, tpl, $selPvId, $selEqmtGrp, $btnPopup );
    } );
}

// TODO
function getEqmtGrpInfoListAjax ( isKorean, tpl, $selPvId, $selEqmtGrp, $btnPopup )
{
    var params = {
        pvId : $selPvId.val () === 'all' ? '' : $selPvId.val ()
    };

    if ( params.pvId !== 'all' )
    {
        // 반영 예정 정보 href 갱신
        var href = $btnPopup.attr ( 'href' ).split ( '?' );
        $btnPopup.attr ( 'href', href[0] + '?pvId=' + $selPvId.val () );

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/systag/selectEqmtGrpInfoList.ajax',
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
                            message : i18nMessage.msg_eqmtGroup,
                            isKorean : isKorean,
                            eqmtList : json.data
                        } );

                        $selEqmtGrp.empty ().html ( html ).trigger ( 'change' );
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
    } else
    {
        // 반영 예정 정보 href 갱신
        var href = $btnPopup.attr ( 'href' ).split ( '?' );
        $btnPopup.attr ( 'href', href[0] );
    }
}

// 설비 그룹을 선택했을때 설비 정보를 가져와서 select에 뿌림
function getEqmtInfoList ( isKorean )
{
    var $selPvId = $ ( '#sel_pv_id' );
    var $selEqmtGrp = $ ( '#sel_eqmt_grp' );
    var $selEqmt = $ ( '#sel_eqmt' );
    var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
    var tpl = getTemplate ( templates.eqmtSelect );

    $selEqmtGrp.on ( 'change', function ()
    {
        getEqmtInfoListAjax ( isKorean, tpl, $selAdiEqmt, $selEqmtGrp, $selPvId, $selEqmt );
    } );

}

// 스택 또는 스트링을 선택했을때 부가 설비 정보(해당 인버터 혹은 접속반 정보)를 가져와서 select에 뿌림
function getAdiEqmtInfoList ( isKorean, $selEqmtGrpVal )
{
    var $selPvId = $ ( '#sel_pv_id' );
    var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
    var tpl = getTemplate ( templates.eqmtSelect );

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/systag/selectAdiEqmtInfoList.ajax',
        type : 'POST',
        data : {
            pvId : $ ( ':selected', $selPvId ).val (),
            eqmtGrpCd : $selEqmtGrpVal
        },
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
                        message : i18nMessage.msg_equipment,
                        isKorean : isKorean,
                        eqmtInfoList : json.data
                    } );
                    $selAdiEqmt.empty ().html ( html ).trigger ( 'change' );
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

// TODO
function getEqmtInfoListAjax ( isKorean, tpl, $selAdiEqmt, $selEqmtGrp, $selPvId, $selEqmt )
{
    $selAdiEqmt.hide ();
    if ( $selEqmtGrp.val () === 'EQGR06' || $selEqmtGrp.val () === 'EQGR08' )
    {
        getAdiEqmtInfoList ( isKorean, $selEqmtGrp.val () );
        $selAdiEqmt.show ();
    }

    var pvId = $selPvId.val ();

    var params = {
        pvId : pvId === 'all' ? '' : pvId,
        eqmtGrpCd : $selEqmtGrp.val ()
    };

    if ( params.eqmtGrpCd !== 'all' )
    {
        $.ajax ( {
            url : contextPath + '/hom/sysmgt/systag/selectEqmtInfoList.ajax',
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
                            message : i18nMessage.msg_equipment,
                            isKorean : isKorean,
                            eqmtInfoList : json.data
                        } );
                        $selEqmt.empty ().html ( html ).trigger ( 'change' );
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
    } else
    {
        var html = '<option value="all">' + i18nMessage.msg_equipment + '</option>';
        $selEqmt.empty ().html ( html ).trigger ( 'change' );

    }
}

// 스택 또는 스트링을 선택했을때 부가 설비 정보를 가져와서 select에 뿌림
function getAdiDetailEqmtInfoList ( isKorean )
{
    var $selPvId = $ ( '#sel_pv_id' );
    var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
    var $selEqmt = $ ( '#sel_eqmt' );
    var tpl = getTemplate ( templates.eqmtSelect );

    $selAdiEqmt.on ( 'change', function ()
    {
        var params = {
            pvId : $ ( ':selected', $selPvId ).val (),
            eqmtId : $ ( ':selected', $selAdiEqmt ).val ()
        }

        getAdiDetailEqmtInfoListAjax ( isKorean, tpl, params, $selEqmt );
    } );
}

// TODO
function getAdiDetailEqmtInfoListAjax ( isKorean, tpl, params, $selEqmt )
{
    $.ajax ( {
        url : contextPath + '/hom/sysmgt/systag/selectAdiDetailEqmtInfoList.ajax',
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
                        message : i18nMessage.msg_equipment,
                        isKorean : isKorean,
                        eqmtInfoList : json.data
                    } );
                    $selEqmt.empty ().html ( html ).trigger ( 'change' );
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

// 엑셀 다운로드
function clickBtnExcel ()
{

    var $btnExcel = $ ( '.btn_excel' );
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );
    var $selPvId = $ ( '#sel_pv_id' );
    var $selEqmt = $ ( '#sel_eqmt' );
    var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
    var $selEqmtGrp = $ ( '#sel_eqmt_grp' );

    $btnExcel.on ( 'click', function ()
    {
        var pvId = $ ( ":selected", $selPvId ).val ();
        var eqmtGrpCd = $ ( ":selected", $selEqmtGrp ).val ();
        var eqmtId = $ ( ":selected", $selEqmt ).val ();
        var adiEqmtId = $ ( ":selected", $selAdiEqmt ).val ();

        var menuName = '';
        $ ( '.lnb' ).find ( 'span' ).each ( function ()
        {
            menuName += ($ ( this ).text () + '_');
        } );

        menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

        var params = {
            pvId : searchCondition.pvId === 'all' ? '' : searchCondition.pvId,
            eqmtGrpCd : searchCondition.eqmtGrpCd === 'all' ? '' : searchCondition.eqmtGrpCd,
            adiEqmtId : searchCondition.adiEqmtId === 'all' ? '' : searchCondition.adiEqmtId,
            eqmtId : searchCondition.eqmtId === 'all' ? '' : searchCondition.eqmtId,
            searchKey : searchCondition.searchKey,
            searchKeyword : searchCondition.searchKeyword,
            menuName : encodeURIComponent ( menuName )
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

        return false;
    } );
}

// 이력 팝업창
function showPopup ()
{
    var $btnPopup = $ ( '.btn_popup' );
    $btnPopup.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );
}

// 반영 예정 정보
function showAllReflctPopup ()
{
    var $btnPopup = $ ( '#all_reflct_popup' );
    var $selPvId = $ ( '#sel_pv_id' );
    var href = $btnPopup.attr ( 'href' ).split ( '?' );
    if ( $selPvId.val () !== 'all' )
    {
        $btnPopup.attr ( 'href', href + '?pvId=' + $selPvId.val () );
    } else
    {
        $btnPopup.attr ( 'href', href );
    }

    $btnPopup.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
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
        location.href = $btnReg.attr ( 'href' ) + '&selPvId=' + searchCondition.pvId + '&selEqmtGrp='
                + searchCondition.eqmtGrpCd + '&selAdiEqmt=' + searchCondition.adiEqmtId + '&selEqmt='
                + searchCondition.eqmtId + '&searchKey=' + searchCondition.searchKey + '&searchValue='
                + encodeURIComponent ( searchCondition.searchKeyword );

        return false;
    } );
}

// 조회조건 초기화
function initSelVal ( isKorean )
{
    var deferred = $.Deferred ();

    if ( paramSelEqmtGrp !== '' )
    {
        var $selPvId = $ ( '#sel_pv_id' );
        var $selEqmtGrp = $ ( '#sel_eqmt_grp' );
        var $btnPopup = $ ( '#all_reflct_popup' );
        var $selEqmt = $ ( '#sel_eqmt' );
        var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
        var grpEqmtSelectTpl = getTemplate ( templates.grpEqmtSelect );
        var eqmtSelectTpl = getTemplate ( templates.eqmtSelect );

        getEqmtGrpInfoListAjax ( isKorean, grpEqmtSelectTpl, $selPvId, $selEqmtGrp, $btnPopup );
        $selEqmtGrp.val ( paramSelEqmtGrp ).trigger ( 'change' );

        getEqmtInfoListAjax ( isKorean, eqmtSelectTpl, $selAdiEqmt, $selEqmtGrp, $selPvId, $selEqmt );
        if ( $selAdiEqmt.is ( ':visible' ) )
        {
            $selAdiEqmt.val ( paramSelAdiEqmt ).trigger ( 'change' );
            var params = {
                pvId : $selPvId.val (),
                eqmtId : paramSelAdiEqmt
            }
            getAdiDetailEqmtInfoListAjax ( isKorean, eqmtSelectTpl, params, $selEqmt );
        }

        $ ( '#sel_eqmt' ).val ( paramSelEqmt ).trigger ( 'change' );
    }

    deferred.resolve ();
    return deferred.promise ();
}

$ ( function ()
{
    searchCondition = {
        pvId : paramSelPvId,
        eqmtGrpCd : paramSelEqmtGrp,
        adiEqmtId : paramSelAdiEqmt,
        eqmtId : paramSelEqmt,
        searchKey : paramSearchKey,
        searchKeyword : paramSearchValue,
    };

    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    customizeForm ();
    var promise = initSelVal ( isKorean );
    promise.done ( function ()
    {
        customizeJqgrid ();
        searchJqgrid ();
        getEqmtGrpInfoList ( isKorean );
        getAdiDetailEqmtInfoList ( isKorean );
        getEqmtInfoList ( isKorean );
        clickBtnExcel ();
        checkMessage ();
        showAllReflctPopup ();
        clickRegBtn ();
    } );
} );