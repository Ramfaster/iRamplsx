// form element customize
function customizeForm ()
{
    // 설비 구분
    var $dateType1 = $ ( '#sel_type0, #sel_type1, .customize_select' ).customizeSelect ( {
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

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ "PV_ID", i18nMessage.msg_pvName, "EQMT_ID", i18nMessage.msg_facilitiesName, "TAG_ID",
                i18nMessage.msg_tag, i18nMessage.msg_tagName, i18nMessage.msg_tagType, i18nMessage.msg_tagUnit,
                i18nMessage.msg_scrinExprsAt, i18nMessage.msg_eqmtValExprsAtGrid, i18nMessage.msg_tagDesc ];
        colModel = [ {
            name : 'pvId',
            hidden : true
        }, {
            name : 'pvNm',
            width : 230,
            align : 'left'
        }, {
            name : 'eqmtId',
            hidden : true
        }, {
            name : 'eqmtNm',
            width : 200,
            align : 'left'
        }, {
            name : 'tagId',
            hidden : true,
        }, {
            name : 'tagNm',
            align : 'left',
            width : 200
        }, {
            name : 'tagKorNm',
            index : '',
            align : 'left',
            width : 140
        }, {
            name : 'tagTyNm',
            index : '',
            align : 'left',
            width : 100
        }, {
            name : 'tagUnitNm',
            index : '',
            align : 'left',
            width : 100
        }, {
            name : 'scrinExprsAt',
            index : '',
            align : 'center',
            width : 120
        }, {
            name : 'eqmtValExprsAt',
            index : '',
            align : 'center',
            width : 120
        }, {
            name : 'tagDesc',
            index : '',
            align : 'left',
            width : 330
        } ];
    } else
    {
        colNames = [ "PV_ID", i18nMessage.msg_pvName, "EQMT_ID", i18nMessage.msg_facilitiesName, "TAG_ID",
                i18nMessage.msg_tag, i18nMessage.msg_tagName, i18nMessage.msg_tagType, i18nMessage.msg_tagUnit,
                i18nMessage.msg_scrinExprsAt, i18nMessage.msg_eqmtValExprsAtGrid, i18nMessage.msg_tagDesc ];
        colModel = [ {
            name : 'pvId',
            hidden : true
        }, {
            name : 'pvNm',
            width : 230,
            align : 'left'
        }, {
            name : 'eqmtId',
            hidden : true
        }, {
            name : 'eqmtNm',
            width : 200,
            align : 'left'
        }, {
            name : 'tagId',
            hidden : true,
        }, {
            name : 'tagNm',
            align : 'left',
            width : 200
        }, {
            name : 'tagEngNm',
            index : '',
            align : 'left',
            width : 140
        }, {
            name : 'tagTyNm',
            index : '',
            align : 'left',
            width : 100
        }, {
            name : 'tagUnitNm',
            index : '',
            align : 'left',
            width : 100
        }, {
            name : 'scrinExprsAt',
            index : '',
            align : 'center',
            width : 120
        }, {
            name : 'eqmtValExprsAt',
            index : '',
            align : 'center',
            width : 120
        }, {
            name : 'tagDesc',
            index : '',
            align : 'left',
            width : 330
        } ];
    }

    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );
    var $selPvId = $ ( '#sel_pv_id' );
    var $selEqmt = $ ( '#sel_eqmt' );
    var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
    var $selEqmtGrp = $ ( '#sel_eqmt_grp' );

    var paramPvId = $selPvId.val ();
    var paramEqmtGrpCd = $selEqmtGrp.val ();
    var paramAdiEqmtId = $selAdiEqmt.val ();
    var paramEqmtId = $selEqmt.val ();

    if ( !$selAdiEqmt.is ( ':visible' ) )
    {
        paramAdiEqmtId = 'all';
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/tag/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
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
                colNames : colNames,
                colModel : colModel,
                sortname : 'tagNm',
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
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
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

                            // 화면 표출 여부 사용/미사용 alias
                            if ( rowData.scrinExprsAt !== null && rowData.scrinExprsAt === 'Y' )
                            {
                                rowData.scrinExprsAt = i18nMessage.msg_use;
                            } else if ( rowData.scrinExprsAt !== null && rowData.scrinExprsAt === 'N' )
                            {
                                rowData.scrinExprsAt = i18nMessage.msg_unuse;
                            }

                            // 대표 값 지정 여부 사용/미사용 alias
                            if ( rowData.eqmtValExprsAt !== null && rowData.eqmtValExprsAt === 'Y' )
                            {
                                rowData.eqmtValExprsAt = i18nMessage.msg_use;
                            } else if ( rowData.eqmtValExprsAt !== null && rowData.eqmtValExprsAt === 'N' )
                            {
                                rowData.eqmtValExprsAt = i18nMessage.msg_unuse;
                            }

                            $gridList.jqGrid ( 'setRowData', cl, rowData );
                        }

                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );

                    var tagId = encodeURIComponent ( rowData.tagId )

                    location.href = contextPath + '/hom/sysmgt/tag/view.do?tagId=' + tagId + '&selPvId='
                            + searchCondition.pvId + '&selEqmtGrp=' + searchCondition.eqmtGrpCd + '&selAdiEqmt='
                            + searchCondition.adiEqmtId + '&selEqmt=' + searchCondition.eqmtId + '&searchKey='
                            + searchCondition.searchKey + '&searchValue='
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
    var pvId = $ ( ':selected', $selPvId ).val ();
    var eqmtGrpCd = $ ( ':selected', $selEqmtGrp ).val ();
    var adiEqmtId = $ ( ':selected', $selAdiEqmt ).val ();
    var eqmtId = $ ( ':selected', $selEqmt ).val ();

    var visible = $ ( '#sel_adi_eqmt' ).is ( ':visible' );

    if ( !visible )
    {
        adiEqmtId = 'all';
    } else
    {
        var temp = adiEqmtId;
        adiEqmtId = eqmtId;
        eqmtId = temp;
    }

    // visible 상태이면 adiEqmtId는 all 인 경우 그대로 전송
    // visible 상태가 아니면 adiEqmtId는 '' 상태로 전송
    searchCondition = {
        pvId : pvId === 'all' ? '' : pvId,
        eqmtGrpCd : eqmtGrpCd === 'all' ? '' : eqmtGrpCd,
        adiEqmtId : visible ? adiEqmtId : (adiEqmtId === 'all' ? '' : adiEqmtId),
        eqmtId : eqmtId === 'all' ? '' : eqmtId,
        searchKey : $ ( ":selected", $searchKey ).val (),
        searchKeyword : $searchValue.val (),
        eqmtGrpNm : $ ( '#sel_eqmt_grp :selected' ).text ().trim (),
        eqmtNm : $ ( '#sel_eqmt :selected' ).text ().trim ()
    };

    $gridList.setGridParam ( {
        postData : {
            pvId : searchCondition.pvId,
            eqmtGrpCd : searchCondition.eqmtGrpCd,
            adiEqmtId : searchCondition.adiEqmtId,
            eqmtId : searchCondition.eqmtId,
            searchKey : searchCondition.searchKey,
            searchKeyword : searchCondition.searchKeyword
        }
    } ).trigger ( 'reloadGrid' );
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

function getEqmtGrpInfoListAjax ( isKorean, tpl, $selPvId, $selEqmtGrp, $btnPopup )
{
    var params = {
        pvId : $selPvId.val () === 'all' ? '' : $selPvId.val ()
    };

    if ( params.pvId !== 'all' )
    {

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
        var pvId = $selPvId.val ();
        var eqmtGrpCd = $selEqmtGrp.val ();
        var eqmtId = $selEqmt.val ();
        var adiEqmtId = $selAdiEqmt.val ();

        var menuName = '';
        $ ( '.lnb' ).find ( 'span' ).each ( function ()
        {
            menuName += ($ ( this ).text () + '_');
        } );

        menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

        var params = {
            pvId : searchCondition.pvId,
            eqmtGrpCd : searchCondition.eqmtGrpCd === 'all' ? '' : searchCondition.eqmtGrpCd,
            eqmtGrpNm : searchCondition.eqmtGrpNm,
            adiEqmtId : searchCondition.adiEqmtId,
            eqmtId : searchCondition.eqmtId,
            eqmtNm : searchCondition.eqmtNm,
            searchKey : searchCondition.searchKey,
            searchKeyword : encodeURIComponent ( searchCondition.searchKeyword ),
            menuName : encodeURIComponent ( menuName )
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

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
        eqmtGrpNm : $ ( '#sel_eqmt_grp :selected' ).text ().trim (),
        eqmtNm : $ ( '#sel_eqmt :selected' ).text ().trim ()
    };

    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    var promise = initSelVal ( isKorean );
    promise.done ( function ()
    {
        customizeForm ();
        customizeJqgrid ();
        // getEqmtGrpCdList ();
        // getEqmtStdrInfo ();
        searchJqgrid ();
        checkMessage ();
        clickBtnExcel ();
        getEqmtGrpInfoList ( isKorean );
        getEqmtInfoList ( isKorean );
        getAdiDetailEqmtInfoList ( isKorean );

    } );

} );