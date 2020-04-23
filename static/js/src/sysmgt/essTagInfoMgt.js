var isEditing = false;
var gEssTagBatchList = {};

// form element customize
function customizeForm ()
{
    // 설비 구분
    var $dateType1 = $ ( '#sel_type0, #sel_type1,.customize_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $dateType2 = $ ( '.customize_select2' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
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

// jqGrid customize
function customizeJqgrid ()
{
    // jqGrid
    jqGridBasic ();

    // scroll
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function jqGridBasic ()
{
    var tpl = getTemplate ( templates.noData );

    var colNames = null;
    var colModel = null;

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ "PV_ID", i18nMessage.msg_siteName, "EQMT_ID", i18nMessage.msg_facilitiesName, i18nMessage.msg_tag,
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
            width : 140,
            align : 'left'
        }, {
            name : 'tagId',
            align : 'left',
            width : 280
        }, {
            name : 'tagNm',
            hidden : true,
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
            name : 'tagUnitVal', // tagUnitNm
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
        colNames = [ "PV_ID", i18nMessage.msg_siteName, "EQMT_ID", i18nMessage.msg_facilitiesName, i18nMessage.msg_tag,
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
            width : 140,
            align : 'left'
        }, {
            name : 'tagId',
            align : 'left',
            width : 280            
        }, {
            name : 'tagNm',
            hidden : true,
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
            name : 'tagUnitVal', // tagUnitNm -> 
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
            width : 120,
            formatter : ''
        }, {
            name : 'tagDesc',
            index : '',
            align : 'left',
            width : 330
        } ];
    }

    setSearchCondition ();

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/ess/getEssTagInfoList.ajax',
                mtype : "POST",
                datatype : "json",
                postData : {
                    pvId : searchCondition.pvId,
                    eqmtGrpCd : searchCondition.eqmtGrpCd,
                    eqmtId : searchCondition.eqmtId,
                    searchKey : searchCondition.searchKey,
                    searchKeyword : searchCondition.searchKeyword
                },
                height : 575,
                autowidth : true,
                shrinkToFit : false,
                colNames : colNames,
                colModel : colModel,
                sortname : 'pvNm,eqmtNm,eqmtId,tagId',
                sortorder : 'desc',
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                // rowwidth: 25,
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
                loadError : function ( xhr, st, err )
                {
                    console.log ( ">>>>> loadError " );
                    console.log ( xhr, st, err );
                },
                // row 선택시
                onSelectRow : function ( rowId, status )
                {
                    if ( ! isEditing ) // 편집중이 아니면
                    {
                        var $gridList = $ ( '#gridList' );
                        var rowData = $gridList.getRowData ( rowId );

                        var tagId = encodeURIComponent ( rowData.tagId )
                        var encodedSearchKeyword = encodeURIComponent ( searchCondition.searchKeyword );

                        setSearchCondition ();
                        
                        location.href = contextPath + '/hom/sysmgt/ess/view.do?tagId=' + tagId + '&selPvId='
                                + searchCondition.pvId + '&selEqmtGrp=' + searchCondition.eqmtGrpCd + '&selEqmt=' + searchCondition.eqmtId 
                                + '&searchKey=' + searchCondition.searchKey + '&searchValue=' + encodeURIComponent ( encodedSearchKeyword );
                    }
                    
                },
                gridComplete : function ()
                {
                    if ( isEditing )
                    {
                        changeEditMode ();
                    }
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
}



//jqGrid 검색
function searchJqgrid ()
{
     var $btn_search = $ ( '#btn_search' );
     var $gridList = $ ( '#gridList' );
     var $searchValue = $ ( '#searchValue' );

     $btn_search.click ( function ()
     {
         reloadJqgrid ( $gridList );
     } );
    
     $searchValue.keypress ( function ( event )
     {
         if ( event.keyCode === 13 )
         {
             reloadJqgrid ( $gridList );
         }
     } );
}

//jqGrid reload
function reloadJqgrid ( $gridList )
{
    setSearchCondition ();

    $gridList.setGridParam ( {
        postData : {
            pvId : searchCondition.pvId,
            eqmtGrpCd : searchCondition.eqmtGrpCd,
            // adiEqmtId : searchCondition.adiEqmtId,
            eqmtId : searchCondition.eqmtId,
            searchKey : searchCondition.searchKey,
            searchKeyword : searchCondition.searchKeyword
         }
    } ).trigger ( 'reloadGrid' );
    
}

//jqGrid end




// 일괄 수정 View
function editJqGridView ()
{
    var $btn_edit = $ ( '#btn_edit' ); // 편집
    var $btn_cancel = $ ( '#btn_cancel' ); // 취소

    $btn_edit.click ( function ()
    {
        isEditing = true;
        changeEditMode ();
        $ ( "#div_regMode" ).css ( "display", "none" );
        $ ( "#div_editMode" ).css ( "display", "block" );

    } );

    $btn_cancel.click ( function ()
    {       
        isEditing = false;
        $ ( "#div_regMode" ).css ( "display", "block" );
        $ ( "#div_editMode" ).css ( "display", "none" );
        
        var $gridList = $ ( '#gridList' ); // jqGrid
        reloadJqgrid ( $gridList );
        
//        changeEditMode ();

    } );
}

// 일괄 수정 실행
function editBatchData ()
{
    var $gridList = $ ( '#gridList' );
    var $btnBatchSave = $( '#btn_save' );
    
    $btnBatchSave.on ( 'click',  function ()
    {
        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertSaveConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                if ( gEssTagBatchList != null || gEssTagBatchList.length > 0 )
                {               
                    console.log (gEssTagBatchList); 

                    $.ajax ( {
                        url : contextPath + '/hom/sysmgt/ess/updateEssTagBatchData.ajax',
                        type : 'POST',
                        dataType : 'json',
                        data : {
                            jsonData : JSON.stringify ( gEssTagBatchList ) 
                        },
                        success : function ( json )
                        {
                            if ( json.status === staticVariable.jsonStatusSuccess )
                            {
                                var $btnCancel = $ ( '#btn_cancel' );
                                $btnCancel.trigger ( 'click' ); // reload
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
                else
                {
                    alert('배열이 비었다');                    
                }
            }
        } );
        
    } ); // close click
}


// 일괄 수정 View 변경
function changeEditMode ()
{

    var $gridList = $ ( '#gridList' );
    var ids = $gridList.jqGrid ( "getDataIDs" );
    var colModels = $gridList.jqGrid ( 'getGridParam' ).colModel;
    var rowData = $gridList.jqGrid ( 'getRowData' );

    var ids = $gridList.jqGrid ( "getDataIDs" );
    for ( var i = 0, length = ids.length; i <= length; i++ )
    {
        var cl = ids[i]; // (<tr> ID : jqg50)
        var rowData = $gridList.getRowData ( cl );

        if ( isEditing )
        {
            if ( $ ( "#scrinExprsAt_" + cl ).length > 0 )
            {
                continue;
            }

            var scrinSelectStr = "<select id=\"scrinExprsAt_" + cl + "\" class=\"select_s changeInRows\">";
            if ( rowData.scrinExprsAt === i18nMessage.msg_use )
            {
                scrinSelectStr += "<option value='Y' selected=\"selected\">" + i18nMessage.msg_use + "</option>";
                scrinSelectStr += "<option value='N'>" + i18nMessage.msg_unuse + "</option></select>";
            } else
            {
                scrinSelectStr += "<option value='Y'>" + i18nMessage.msg_use + "</option>";
                scrinSelectStr += "<option value='N' selected=\"selected\">" + i18nMessage.msg_unuse + "</option></select>";
            }

            var eqmtSelectStr = "<select id=\"eqmtValExprsAt_" + cl + "\" class=\"select_s changeInRows\">";
            if ( rowData.eqmtValExprsAt === i18nMessage.msg_use )
            {
                eqmtSelectStr += "<option value='Y' selected=\"selected\">" + i18nMessage.msg_use + "</option>";
                eqmtSelectStr += "<option value='N'>" + i18nMessage.msg_unuse + "</option></select>";
            } else
            {
                eqmtSelectStr += "<option value='Y'>" + i18nMessage.msg_use + "</option>";
                eqmtSelectStr += "<option value='N' selected=\"selected\">" + i18nMessage.msg_unuse + "</option></select>";
            }

            var tagDescStr = "<input id=\"tagDesc_" + cl + "\" type=\"text\" class=\"ds_fm_ipt changeInRows rowsInput\" value=\""
                    + rowData.tagDesc + "\" />";

            $gridList.jqGrid ( 'setCell', cl, "scrinExprsAt", scrinSelectStr );
            $gridList.jqGrid ( 'setCell', cl, "eqmtValExprsAt", eqmtSelectStr );
            $gridList.jqGrid ( 'setCell', cl, "tagDesc", tagDescStr );
            
        } else
        {
            $gridList.jqGrid ( 'setCell', cl, "scrinExprsAt", $ ( "#scrinExprsAt_" + cl + " option:selected" ).val () );
            $gridList.jqGrid ( 'setCell', cl, "eqmtValExprsAt", $ ( "#eqmtValExprsAt_" + cl + " option:selected" )
                    .val () );

            if ( $ ( "#tagDesc_" + cl ).val () !== "" )
            {
                $gridList.jqGrid ( 'setCell', cl, "tagDesc", $ ( "#tagDesc_" + cl ).val () );
            } else
            {
                $ ( "#tagDesc_" + cl ).remove ();
                $gridList.jqGrid ( 'setCell', cl, "tagDesc", "" );
            }

        }
    }

    if ( isEditing ) {
        setChangedRowsData ();
    }
    
    $ ( '.select_s' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

    // colModel.fomatter = function ( cellValue, option, rowObject ) {
    // var selectStr = "<select class=\"select_s\">";
    // if ( cellValue === i18nMessage.msg_use )
    // {
    // selectStr += "<option selected=\"selected\">" + i18nMessage.msg_use + "</option>";
    // selectStr += "<option>" + i18nMessage.msg_unuse + "</option>";
    // } else
    // {
    // selectStr += "<option>" + i18nMessage.msg_unuse + "</option>";
    // selectStr += "<option selected=\"selected\">" + i18nMessage.msg_unuse + "</option>";
    // }
    // selectStr += "</select>";
    // return selectStr;
    // };
    //            
    // colModel.unformat = function ( cellValue, option, rowObject ) {
    // return cellValue;
    // };

    // colModel.formatter = function( cellValue, option, rowObject ) {
    // return "<input type=\"text\" class=\"ds_fm_ipt\" value=\"" + cellValue + "\" />";
    // };
    //            
    // colModel.unformat = function( cellValue, option, rowObject ) {
    // return cellValue;
    // };

}

// 일괄 수정 row 데이터 변경 시 grid에 저장
function setChangedRowsData ()
{
    var $changeInRows = $('.changeInRows');
    var $gridList = $('#gridList');
    
    $changeInRows.on ('change paste keyup', function() {
        var rowId = this.parentElement.parentElement.id;
        var trObj = $gridList.getGridRowById( rowId );
        var tagIdStr = trObj.children[5].textContent;
                
        var essTagInfo = {
                scrinExprsAt : $('#scrinExprsAt_' + rowId + ' :selected').val(),
                eqmtValExprsAt : $('#eqmtValExprsAt_' + rowId + ' :selected').val(),
                tagDesc : $('#tagDesc_' + rowId).val()
        }

        gEssTagBatchList[tagIdStr] = essTagInfo;

     });

}


// 사이트 선택 시 설비그룹 정보 가져오기
function getEqmtGrpInfoList ( isKorean )
{
    var $selPvId = $ ( '#pvId' );
    var $selEqmtGrp = $ ( '#eqmtGrp' );

    var tpl = getTemplate ( templates.essGrpEqmtSelect );

    $selPvId.on ( 'change', function ()
    {
        getEqmtGrpInfoListAjax ( isKorean, tpl, $selPvId, $selEqmtGrp );
    } );
}

function getEqmtGrpInfoListAjax ( isKorean, tpl, $selPvId, $selEqmtGrp )
{
    var params = {
        pvId : $selPvId.val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/ess/getEqmtGrpInfoList.ajax',
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
}

// 설비 그룹 선택 시 설비 정보 가져오기
function getEqmtInfoList ( isKorean )
{
    var $selPvId = $ ( '#pvId' );
    var $selEqmtGrp = $ ( '#eqmtGrp' );
    var $selEqmt = $ ( '#eqmt' );

    var tpl = getTemplate ( templates.essEqmtSelect );

    $selEqmtGrp.on ( 'change', function ()
    {
        getEqmtInfoListAjax ( isKorean, tpl, $selEqmtGrp, $selPvId, $selEqmt );
    } );
    
    $selEqmtGrp.trigger ('change');
}


function getEqmtInfoListAjax ( isKorean, tpl, $selEqmtGrp, $selPvId, $selEqmt )
{

    var params = {
        pvId : $selPvId.val (),
        eqmtGrpCd : $selEqmtGrp.val ()
    };

    if ( params.eqmtGrpCd !== '' )
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
                            eqmtList : json.data
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
        var html = '<option value="">' + i18nMessage.msg_equipment + '</option>';
        $selEqmt.empty ().html ( html ).trigger ( 'change' );
    }
}


// 일괄등록 및 수정 팝업 오픈
function openBathRegPopup ()
{
    var $btnPopup = $ ( '#btn_tagBatchReg' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                customizePopupForm ();
                setParameter ( $btnPopup, 'insert' );
            }
        }
    } );
    
    var $btnPopup = $ ( '#btn_tagBatchEdit' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                customizePopupForm ();
                setParameter ( $btnPopup, 'update' );
            }
        }
    } );

}

// 엑셀 다운로드
function clickBtnExcel ()
{
    var $btnExcel = $ ( '.btn_excel' );

    $btnExcel.on ( 'click', function ()
    {
        setSearchCondition ();
        
        // var adiEqmtId = $selAdiEqmt.val ();

        var menuName = '';
         $ ( '.lnb' ).find ( 'span' ).each ( function ()
         {
         menuName += ($ ( this ).text () + '_');
         } );
         menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());
        
        var params = {
            pvId : searchCondition.pvId,
            eqmtGrpCd : searchCondition.eqmtGrpCd,
            eqmtId : searchCondition.eqmtId,
            eqmtGrpNm : encodeURIComponent ( searchCondition.eqmtGrpNm ),
            eqmtNm : searchCondition.eqmtNm,
            searchKey : searchCondition.searchKey,
            searchKeyword : encodeURIComponent ( searchCondition.searchKeyword ),
            menuName : encodeURIComponent ( menuName )
            // adiEqmtId : searchCondition.adiEqmtId
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

        return false;

    } );

}


// 검색조건 저장
function setSearchCondition()
{
    /*
    searchCondition = {
        pvId : paramSelPvId,
        eqmtGrpCd : paramSelEqmtGrp,
        // adiEqmtId : paramSelAdiEqmt,
        eqmtId : paramSelEqmt,
        searchKey : paramSearchKey,
        searchKeyword : paramSearchValue,
        eqmtGrpNm : $ ( '#eqmtGrp :selected' ).text ().trim (),
        // eqmtNm : $ ( '#eqmt :selected' ).text ().trim ()
    };
    
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
    */ 
    
    var $selPvId = $ ( '#pvId' );
    var $selEqmtGrp = $ ( '#eqmtGrp' );
    var $selEqmt = $ ( '#eqmt' );
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );
    // var $selAdiEqmt = $ ( '#sel_adi_eqmt' );
  
    // var paramAdiEqmtId = $selAdiEqmt.val ();    
    
    searchCondition = {
        pvId : $ ( ':selected', $selPvId ).val (),
        eqmtGrpCd : $ ( ':selected', $selEqmtGrp ).val (),
        eqmtId : $ ( ':selected', $selEqmt ).val (),
        searchKey : $ ( ":selected", $searchKey ).val (),
        searchKeyword : $searchValue.val (),
        eqmtGrpNm : $ ( '#eqmtGrp :selected' ).text ().trim (),
        eqmtNm : $ ( '#eqmt :selected' ).text ().trim ()
        // , adiEqmtId : visible ? adiEqmtId : (adiEqmtId === 'all' ? '' : adiEqmtId),
    };
}


$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    $ ( "#div_editMode" ).css ( "display", "none" );

    
    setSearchCondition (); // 검색조건 저장
    
    customizeForm ();
    customizeJqgrid (); // jqGrid에 Data 출력
    openBathRegPopup ();// 엑셀등록및수정 팝업

    clickBtnExcel (); // 엑셀 다운로드
    editJqGridView (); // 일괄수정 View
    editBatchData (); // 일괄수정 데이터 저장
    searchJqgrid (); // 검색
    getEqmtGrpInfoList ( isKorean ); // 사이트 선택 시 설비그룹 가져오기
    getEqmtInfoList ( isKorean ); // 설비그룹 선택 시 설비정보 가져오기

    
} );