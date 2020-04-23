var pvSearchList;
var searchCnt = 0;

// form element customize
function customizeForm ()
{
    var $selType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    var $yyyymmdd = $ ( '.yyyymmdd' );
    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );
    var $startDatetimePicker = $ ( '#startDatetimePicker' );
    var $endDatetimePicker = $ ( '#endDatetimePicker' );

    var localFromTodate = homUtil.getLocalFromToDate ( date, homConstants.dateTypeYYYYMMDD, false, false );
    $yyyymmddFromDate.val ( localFromTodate.fromDate );
    $yyyymmddToDate.val ( localFromTodate.toDate );

    homUtil.setStartEndDatetimepicker ( $startDatetimePicker, $endDatetimePicker, $yyyymmddFromDate, $yyyymmddToDate );

    $yyyymmdd.datetimepicker ().on (
            'changeDate',
            function ( event )
            {
                homUtil.setStartEndDatetimepicker ( $startDatetimePicker, $endDatetimePicker, $yyyymmddFromDate,
                        $yyyymmddToDate );
            } );

}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.frm_con01 .frm_cont_wrap, .tbl_add_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

/**
 * 트리 초기화
 */
function initTree ( data )
{
    // 트리메뉴
    var setting = {
        view : {
            selectedMulti : false
        },
        check : {
            enable : true,
            chkStyle : 'checkbox',
            radioType : 'all',
            chkDisabled : true
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        view : {
            showIcon : false
        },
        callback : {
            onCheck : function beforeOnCheck ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( treeNode );
                var checkedNodes = zTree.getCheckedNodes ();
                pvSearchList = undefined;
                // 체크된 발전소를 전역 변수에 저장
                $.each ( checkedNodes, function ( idx, item )
                {
                    if ( item.pId && item.checked === true )
                    {
                        if ( pvSearchList )
                        {
                            pvSearchList += "," + item.id;
                        } else
                        {
                            pvSearchList = item.id;
                        }
                    }
                } );

                // reloadGrid
                if ( typeof pvSearchList !== 'undefined' || pvSearchList === '' )
                {
                    $ ( '#btnSubmit' ).trigger ( "click" );
                } else
                {
                    $ ( "#gridList" ).jqGrid ( "clearGridData", true );
                }
            },
            onClick : function beforeClick ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var selectedNodes = zTree.getSelectedNodes ();
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
}

// treemenu customize
function customizeTree ()
{
    var searchPvIdList = $ ( "input[name=searchPvIdList]" ).val ()

    var searchPvIdArr = searchPvIdList.split ( "," );

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/selectOperationPlanTreeListInfo.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        data : {
            treeType : 'NP'
        },
        success : function ( json )
        {

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $.each ( json.data, function ( idx, item )
                {
                    // var node = _.find ( searchPvIdArr, function ( node )
                    // {
                    // return node === item.id;
                    // } );

                    // if ( node !== null && typeof node !== 'undefined' )
                    // {
                    // item.checked = true;
                    // }

                    // 체크 된 발전소 목록을 전역 변수에 저장 (초기 셋팅)
                    if ( item.pId && item.checked === true )
                    {
                        if ( pvSearchList )
                        {
                            pvSearchList += "," + item.id;
                            // pvSearchList.push ( item.id );
                        } else
                        {
                            pvSearchList = item.id;
                        }
                    }

                } );

                initTree ( json.data );
            }
        }
    } );
}

// jqgrid start

// jqgird
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    var korean = true;
    var english = false;
    if ( lang === locale.korea || lang === locale.korean )
    {
        korean = false;
        english = true;
    }

    var $fromDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );
    var $aplctnSectnCd = $ ( '#searchAplctnSectnCd' );
    var $aplctnStleCd = $ ( '#searchAplctnStleCd' );

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/servicemgt/workorder/selectWorkOrderList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 622,
                autowidth : true,
                shrinkToFit : false,
                async : false,
                sortname : 'opertPlanBeginDt',
                sortorder : 'desc',
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                postData : {
                    pvSearchList : pvSearchList,
                    fromDate : $fromDate.val (),
                    toDate : $toDate.val (),
                    aplctnSectnCd : $aplctnSectnCd.val (),
                    aplctnStleCd : $aplctnStleCd.val ()
                },
                colNames : [ i18nMessage.msg_number, i18nMessage.msg_pvName, i18nMessage.msg_pvName,
                        i18nMessage.msg_pvName, i18nMessage.msg_dutySection, i18nMessage.msg_dutySection,
                        i18nMessage.msg_dutySection, i18nMessage.msg_dutyForm, i18nMessage.msg_dutyForm,
                        i18nMessage.msg_dutyForm, i18nMessage.msg_planDate, '계획종료일', i18nMessage.msg_registrationDate,
                        i18nMessage.msg_operationResults ],

                colModel : [
                        {
                            name : 'opertPlanSeq',
                            index : 'opertPlanSeq',
                            align : 'center',
                            width : '150',
                            hidden : true
                        },
                        {
                            name : 'pvId',
                            index : 'pvId',
                            align : 'center',
                            width : '50',
                            hidden : true
                        },
                        {
                            name : 'pvKorNm',
                            index : 'pvKorNm',
                            align : 'center',
                            width : '360',
                            hidden : korean
                        },
                        {
                            name : 'pvEngNm',
                            index : 'pvEngNm',
                            align : 'center',
                            width : '360',
                            hidden : english
                        },
                        {
                            name : 'aplctnSectnCd',
                            index : 'aplctnSectnCd',
                            align : 'center',
                            width : '132',
                            hidden : true
                        },
                        {
                            name : 'aplctnSectnKorNm',
                            index : 'aplctnSectnKorNm',
                            align : 'center',
                            width : '132',
                            hidden : korean
                        },
                        {
                            name : 'aplctnSectnEngNm',
                            index : 'aplctnSectnEngNm',
                            align : 'center',
                            width : '132',
                            hidden : english
                        },
                        {
                            name : 'aplctnStleCd',
                            index : 'aplctnStleCd',
                            align : 'center',
                            width : '132',
                            hidden : true

                        },
                        {
                            name : 'aplctnStleKorNm',
                            index : 'aplctnStleKorNm',
                            align : 'center',
                            width : '132',
                            hidden : korean
                        },
                        {
                            name : 'aplctnStleEngNm',
                            index : 'aplctnStleEngNm',
                            align : 'center',
                            width : '132',
                            hidden : english
                        },
                        {
                            name : 'opertPlanBeginDt',
                            index : 'opertPlanBeginDt',
                            align : 'center',
                            width : '212'
                        },
                        {
                            name : 'opertPlanTrmnatDt',
                            index : 'opertPlanTrmnatDt',
                            align : 'center',
                            width : '212',
                            hidden : true
                        },
                        {
                            name : 'regDt',
                            index : 'regDt',
                            align : 'center',
                            width : '212',
                        },
                        {
                            name : 'retprtYn',
                            index : 'retprtYn',
                            align : 'center',
                            width : '160',
                            // sortable : false,
                            formatter : function ( cellValue, options, rowObject )
                            {
                                if ( rowObject.retprtYn == 'Y' )
                                {
                                    return '<a href="javascript:onSelectViewRegForm(\'read\' , \'' + rowObject.pvId
                                            + '\' , \'' + rowObject.opertPlanSeq + '\' , \'' + rowObject.aplctnSectnCd
                                            + '\' , \'' + rowObject.aplctnSectnCd + '\' );"class="btn_jqgrid link">'
                                            + i18nMessage.msg_register + '</a>';

                                } else
                                {
                                    return '<a href="javascript:onSelectViewRegForm(\'insert\' , \'' + rowObject.pvId
                                            + '\' , \'' + rowObject.opertPlanSeq + '\' , \'' + rowObject.aplctnSectnCd
                                            + '\' , \'' + rowObject.aplctnStleCd + '\');"class="btn_jqgrid link">'
                                            + i18nMessage.msg_unregister + '</a>';
                                }
                            }
                        } ],
                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '.gq_nodata' );
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );

                    var href = null;

                    // 결과등록 여부
                    if ( rowData.retprtYn !== '' )
                    {

                    }
                },
                onCellSelect : function ( rowId, icol, status )
                {

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

// 작업결과 조회
function searchWorkOrder ()
{
    var $gridList = $ ( '#gridList' );

    var $fromDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );
    var $aplctnSectnCd = $ ( '#searchAplctnSectnCd' );
    var $aplctnStleCd = $ ( '#searchAplctnStleCd' );

    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        searchCnt += 1;

        if ( !homUtil.fromToDateValidate ( $fromDate.val (), $toDate.val (), 'D' ) )
        {
            return;
        }

        if ( initFlag )
        {
            customizeJqgrid ();
        } else
        {
            reloadJqgrid ( $gridList, $fromDate, $toDate, $aplctnSectnCd, $aplctnStleCd );
        }

    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $fromDate, $toDate, $aplctnSectnCd, $aplctnStleCd )
{
    $gridList.setGridParam ( {
        postData : {
            pvSearchList : pvSearchList,
            fromDate : $fromDate.val (),
            toDate : $toDate.val (),
            aplctnSectnCd : $aplctnSectnCd.val (),
            aplctnStleCd : $aplctnStleCd.val ()
        }
    } ).trigger ( 'reloadGrid' );
}

// jqgrid end

function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );
}

function setEvent ()
{
    // 업무 구분 Select Box Event
    $ ( '#searchAplctnSectnCd' ).change (
            function ()
            {
                var aplctnSectnCd = $ ( this ).val ();
                var selectInitTextFormat = '<option value="all">' + i18nMessage.msg_all + '</option>';

                switch ( aplctnSectnCd )
                {
                    case 'all': // 점검
                        $ ( '#searchAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', false ).trigger (
                                'change' );
                        break;
                    case 'WCHK01': // 점검
                        selectAplctnStleCd ( aplctnSectnCd );
                        // 업무 형태 콤보 박스 활성화
                        $ ( '#searchAplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );
                        break;
                    case 'WCHK09': // 보수
                        selectAplctnStleCd ( aplctnSectnCd );
                        // 업무 형태 콤보 박스 활성화
                        $ ( '#searchAplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );
                        break;
                    case 'WCHK12': // 정전
                        // 업무 형태 콤보 박스 비활성화
                        $ ( '#searchAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger (
                                'change' );
                        break;
                    case 'WCHK13': // 사고
                        // 업무 형태 콤보 박스 비활성화
                        $ ( '#searchAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger (
                                'change' );
                        break;
                }
            } );
}

// 업무 형태 코드 조회
function selectAplctnStleCd ( aplctnSectnCd )
{
    var deferred = $.Deferred ();
    var $cmmnCdList = $ ( '#searchAplctnStleCd' );

    var selectInitTextFormat = '<option value="all">' + i18nMessage.msg_all + '</option>';

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectChildCmmnCdList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            parntsCdId : aplctnSectnCd
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var datas = json.data;

                if ( datas !== null && datas.length > 0 )
                {
                    $cmmnCdList.empty ();

                    $cmmnCdList.append ( selectInitTextFormat );

                    _.each ( datas, function ( item )
                    {
                        if ( lang == locale.korea || lang == locale.korean )
                        {
                            $cmmnCdList.append ( '<option value="' + item.cdId + '">' + item.cdKorNm + '</option>' );
                        } else
                        {
                            $cmmnCdList.append ( '<option value="' + item.cdId + '">' + item.cdEngNm + '</option>' );
                        }
                    } );
                    $cmmnCdList.trigger ( 'change' );
                    deferred.resolve ();
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

    return deferred.promise ();

}

/**
 * 등록 폼 화면 이동
 */
function viewRegForm ()
{
    // var $regBtn = $ ( '.btn_type01' );

    // $regBtn.click ( function ()
    // {
    // var treeObj = $.fn.zTree.getZTreeObj ( "treeList" );

    // var href = contextPath + '/hom/servicemgt/workorder/';

    // href += 'form.do?method=insert&';

    // location.href = href;
    // } );
}

/**
 * 등록 폼, 뷰 화면 이동
 * 
 * @param action
 * @param opertPlanMastrId
 */
function onSelectViewRegForm ( method, pvId, opertPlanSeq, aplctnSectnCd, aplctnStleCd )
{
    var searchFromDate = $ ( "#yyyymmdd_from_date" ).val ();
    var searchToDate = $ ( "#yyyymmdd_to_date" ).val ();
    var searchAplctnSectnCd = $ ( "#searchAplctnSectnCd" ).val ();
    var searchAplctnStleCd = $ ( "#searchAplctnStleCd" ).val ();

    var searchKeyWord;

    if ( searchCnt <= 1 )
    {
        searchKeyWord = "";
    } else
    {
        searchKeyWord = '&searchFromDate=' + searchFromDate + '&searchToDate=' + searchToDate + '&searchAplctnSectnCd='
                + searchAplctnSectnCd + '&searchAplctnStleCd=' + searchAplctnStleCd + '&searchPvIdList=' + pvSearchList;
    }

    var href = contextPath + '/hom/servicemgt/workorder/';

    if ( method == 'insert' )
    {
        href += 'form.do?method=insert&pvId=' + pvId + '&opertPlanSeq=' + opertPlanSeq + '&aplctnSectnCd='
                + aplctnSectnCd + '&aplctnStleCd=' + aplctnStleCd + searchKeyWord;
    } else
    {
        href += 'view.do?pvId=' + pvId + '&opertPlanSeq=' + opertPlanSeq + '&aplctnSectnCd=' + aplctnSectnCd
                + '&aplctnStleCd=' + aplctnStleCd + searchKeyWord;
    }
    location.href = href;
}

// 페이지 로드 완료 시 처리
function initPage ()
{
    var searchPvIdList = $ ( '#searchPvIdList' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var aplctnSectnCd = $ ( '#aplctnSectnCd' ).val ();
    var aplctnStleCd = $ ( '#aplctnStleCd' ).val ();

    if ( fromDate != "" && toDate != "" )
    {
        $ ( '#yyyymmdd_from_date' ).val ( fromDate );
        $ ( '#yyyymmdd_to_date' ).val ( toDate );

        if ( aplctnSectnCd == "" && aplctnStleCd == "" )
        {
            $ ( '#searchAplctnSectnCd' ).val ( "all" ).trigger ( "change" );
            $ ( '#searchAplctnStleCd' ).val ( "all" ).trigger ( "change" );
        } else
        {
            $ ( '#searchAplctnSectnCd' ).val ( aplctnSectnCd ).trigger ( "change" );
            $ ( '#searchAplctnStleCd' ).val ( aplctnStleCd ).trigger ( "change" );
        }
    }

    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    initDatetimepicker ();
    customizeForm ();
    customizeScroll ();
    showPopup ();
    setEvent ();

    viewRegForm ();

    $.when ( customizeTree () ).done ( function ()
    {
        searchWorkOrder ();
        initPage ();
    } );
} );