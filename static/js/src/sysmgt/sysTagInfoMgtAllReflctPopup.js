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

    // // 검색 조건
    // var $searchKey = $ ( '#searchKey' ).customizeSelect ( {
    // width : 80,
    // paddingHorizontal : 15,
    // height : 30,
    // color : '#3c3c3c',
    // initClass : 'custom-form-select03',
    // focusClass : 'custom-form-focused03'
    // } );
}

// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    $ ( '.yyyy' ).datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymm' ).datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmddhh' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:00',
        startView : 2,
        minView : 1,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmddhhmi' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:ii',
        startView : 2,
        minView : 0,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        minuteStep : 2,
        todayHighlight : true,
        todayBtn : true,
        minuteStep : 15
    } );
}

// jqgrid start
function setColModel ()
{
    var colModel = [ {
        name : 'tagEngNm',
        index : '',
        align : 'center',
        width : '160'
    }, {
        name : 'tagId',
        index : '',
        align : 'center',
        width : '240'
    }, {
        name : 'eqmtNm',
        index : '',
        align : 'center',
        width : '110'
    }, {
        name : 'paramtrType',
        index : '',
        align : 'center',
        width : '120'
    }, {
        name : 'paramtrNm',
        index : '',
        align : 'center',
        width : '120'
    }, {
        name : 'cndfrmlaTyNm',
        index : '',
        align : 'center',
        width : '120'
    }, {
        name : 'reflctBeginDt',
        index : '',
        align : 'center',
        width : '160'
    }, {
        name : 'reflctTrmnatDt',
        index : '',
        align : 'center',
        width : '160'
    } ];

    if ( lang == locale.korea || lang == locale.korean )
    {
        colModel = [ {
            name : 'tagKorNm',
            index : '',
            align : 'center',
            width : '160'
        }, {
            name : 'tagId',
            index : '',
            align : 'center',
            width : '240'
        }, {
            name : 'eqmtNm',
            index : '',
            align : 'center',
            width : '110'
        }, {
            name : 'paramtrType',
            index : '',
            align : 'center',
            width : '120'
        }, {
            name : 'paramtrNm',
            index : '',
            align : 'center',
            width : '120'
        }, {
            name : 'cndfrmlaTyNm',
            index : '',
            align : 'center',
            width : '120'
        }, {
            name : 'reflctBeginDt',
            index : '',
            align : 'center',
            width : '160'
        }, {
            name : 'reflctTrmnatDt',
            index : '',
            align : 'center',
            width : '160'
        } ];
    }

    return colModel;
}

// jqgrid start
function jqGridBasic ()
{
    var colModel = setColModel ();

    var sortname = 'tagEngNm';
    if ( lang == locale.korea || lang == locale.korean )
    {
        sortname = 'tagKorNm';
    }

    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/systag/sysTagAllReflctList.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    pvId : $ ( '#sel_pv_id_pop' ).val (),
                    fromDate : homUtil.convertDateStringToPureFormat ( $ ( '#fromDate' ).val () ),
                    toDate : homUtil.convertDateStringToPureFormat ( $ ( '#toDate' ).val () ),
                },
                height : 592,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ i18nMessage.msg_systemTagName, i18nMessage.msg_systemTagId, i18nMessage.msg_eqmtName,
                        i18nMessage.msg_parameterType, i18nMessage.msg_parameterName, i18nMessage.msg_cndfrm,
                        i18nMessage.msg_reflectionBeginDate, i18nMessage.msg_reflectionTerminateDate ],
                colModel : colModel,
                sortname : sortname,
                sortorder : 'asc',
                multiselect : true,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                loadComplete : function ( data )
                {
                    var $gridList = $ ( '#gridListPop' );
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
                    var $gqNodata = $ ( '.gq_nodata' );

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

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                'name' : 'reflctBeginDt',
                                'value' : rowData.reflctBeginDt,
                                'data-tag-id' : rowData.tagId
                            } ).addClass ( 'reflctBeginDt' );
                        }
                    }

                    if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                    {
                        enableJqgridCheckbox ( $gridList, $checkboxs )
                    } else
                    {
                        disableJqgridCheckbox ( $gridList, $checkboxs )
                    }
                }
            } );
}

// jqgrid 검색
function searchJqgrid ()
{
    var $btn_search = $ ( '#btn_search_pop' );
    var $gridList = $ ( '#gridListPop' );

    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );

    var $selPvId = $ ( '#sel_pv_id_pop' );
    var $selEqmt = $ ( '#sel_eqmt_pop' );

    $btn_search.click ( function ()
    {
        reloadJqgrid ( $gridList, $selPvId, $selEqmt, $fromDate, $toDate );
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $selPvId, $selEqmt, $fromDate, $toDate )
{
    var pvId = $ ( ":selected", $selPvId ).val ();
    var eqmtId = $ ( ":selected", $selEqmt ).val ();
    $gridList.setGridParam ( {
        postData : {
            pvId : pvId === 'all' ? '' : pvId,
            eqmtId : eqmtId === 'all' ? '' : eqmtId,
            fromDate : homUtil.convertDateStringToPureFormat ( $fromDate.val () ),
            toDate : homUtil.convertDateStringToPureFormat ( $toDate.val () )
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

        $ ( '#gridListPop' ).parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}
// jqgrid end

// 삭제 체크
function checkDelete ()
{
    var $btnDelete = $ ( '#btn_delete' );

    $btnDelete.click ( function ()
    {
        var tagIdArray = [];
        var reflctBeginDtArray = [];
        var $that = $ ( this );

        $ ( '.reflctBeginDt' ).each ( function ()
        {
            if ( $ ( this ).prop ( 'checked' ) )
            {
                var $that = $ ( this );
                tagIdArray.push ( encodeURIComponent ( $that.data ( 'tag-id' ) ) );
                reflctBeginDtArray.push ( encodeURIComponent ( $that.val () ) );
            }
        } );

        if ( reflctBeginDtArray.length === 0 )
        {
            alert ( i18nMessage.msg_alertNoSelectedDeleteItem );
        } else
        {
            if ( confirm ( i18nMessage.msg_alertDeleteConfirm ) == true )
            {
                location.href = $that.attr ( 'href' ) + '?tagId=' + tagIdArray.toString () + '&reflctBeginDt='
                        + reflctBeginDtArray.toString ();
            }
        }

        return false;
    } );
}

// 버튼 그룹 switch
function switchButtonGroup ()
{
    var $btnEdit01 = $ ( '#btn_edit01' );
    var $btnCancel01 = $ ( '#btn_cancel01' );
    var $btnGroupEdit = $ ( '#btn_group_edit' );
    var $btnGroupDelete = $ ( '#btn_group_delete' );

    var $gridList = $ ( '#gridListPop' );
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

// 발전소를 선택 했을때 설비 그룹 정보를 가져옴
function getEqmtGrpInfoListPop ( isKorean )
{
    var $selPvId = $ ( '#sel_pv_id_pop' );
    var $selEqmtGrp = $ ( '#sel_eqmt_grp_pop' );
    var tpl = getTemplate ( templates.grpEqmtSelect );

    $selPvId.on ( 'change', function ()
    {
        var params = {
            pvId : $ ( ':selected', $ ( this ) ).val ()
        };

        if ( params.pvId !== 'all' )
        {
            $.ajax ( {
                url : contextPath + '/hom/sysmgt/systag/selectEqmtGrpInfoList.ajax',
                type : 'POST',
                data : params,
                dataType : 'json',
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
    } );
}

// 설비 그룹을 선택했을때 설비 정보를 가져와서 select에 뿌림
function getEqmtInfoListPop ( isKorean )
{
    var $selPvId = $ ( '#sel_pv_id_pop' );
    var $selEqmtGrp = $ ( '#sel_eqmt_grp_pop' );
    var $selEqmt = $ ( '#sel_eqmt_pop' );
    var tpl = getTemplate ( templates.eqmtSelect );

    $selEqmtGrp.on ( 'change', function ()
    {
        var params = {
            pvId : $ ( ':selected', $selPvId ).val (),
            eqmtGrpCd : $ ( ':selected', $ ( this ) ).val ()
        };

        if ( params.eqmtGrpCd !== 'all' )
        {
            $.ajax ( {
                url : contextPath + '/hom/sysmgt/systag/selectEqmtInfoList.ajax',
                type : 'POST',
                data : params,
                dataType : 'json',
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
    } );
}

$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    customizeForm ();
    initDatetimepicker ();
    getEqmtGrpInfoListPop ( isKorean );
    getEqmtInfoListPop ( isKorean );
    customizeJqgrid ();
    switchButtonGroup ();
    checkDelete ();
    searchJqgrid ();
} );