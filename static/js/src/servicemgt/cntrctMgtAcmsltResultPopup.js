function customizeForm ()
{
    var $dateType = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );
}

function customizeScroll ()
{
    // custom scroll
    $ ( '.popup_tbl_box_add' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// init datetimepicker
function initDatetimepicker ()
{
    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );

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

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );

    var localFromTodate = homUtil.getLocalFromToDate ( date, homConstants.dateTypeYYYYMMDD, false, false );
    $yyyymmddFromDate.val ( localFromTodate.fromDate );
    $yyyymmddToDate.val ( localFromTodate.toDate );
}

// jqgrid start
function setColModel ()
{
    var colModel = [ {
        name : 'opertPlanSeq',
        hidden : true
    }, {
        name : 'aplctnSectnCdNm',
        index : '',
        align : 'center',
        width : '140'
    }, {
        name : 'aplctnStleCdNm',
        index : '',
        align : 'center',
        width : '140'
    }, {
        name : 'chckmanNm',
        index : '',
        align : 'center',
        width : '140'
    }, {
        name : 'corprNm',
        index : '',
        align : 'center',
        width : '140'
    }, {
        name : 'regDt',
        index : '',
        align : 'center',
        width : '155'
    } ];

    return colModel;
}

function jqGridBasic ( fromDate, toDate )
{
    var colModel = setColModel ();

    $ ( '#gridList2' ).jqGrid (
            {
                url : contextPath + '/hom/servicemgt/contract/listResult.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    pvId : paramPvId,
                    fromDate : fromDate,
                    toDate : toDate
                },
                height : 448,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ '', i18nMessage.msg_taskDivision, i18nMessage.msg_workType, i18nMessage.msg_inspector,
                        i18nMessage.msg_corporateName, i18nMessage.msg_registDate ],
                colModel : colModel,
                sortname : 'aplctnSectnCdNm',
                sortorder : 'asc',
                rownumbers : false,
                rowwidth : 25,
                page : 1,
                multiselect : true,
                multiboxonly : false,
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

                        var $gridList = $ ( '#gridList2' );
                        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

                        var ids = $gridList.jqGrid ( "getDataIDs" );
                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridList.getRowData ( cl );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                name : 'opertPlanSeq',
                                value : rowData.opertPlanSeq
                            } ).addClass ( 'opertPlanSeq' );
                        }

                        setCheckOpertPlanSeqs ();
                        setCheckedOpertPlanSeqsToInput ();
                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList2' );
                    var rowData = $gridList.getRowData ( rowId );
                    var $popupSeqs = $ ( '#popupOpertPlanSeqs' );

                    var seqArray = null;
                    if ( $popupSeqs !== null && $popupSeqs.val () !== '' )
                    {
                        seqArray = $popupSeqs.val ().split ( ',' );
                    }

                    if ( status )
                    {
                        if ( seqArray !== null && seqArray.length > 0 )
                        {
                            var array = [ rowData.opertPlanSeq ];
                            $popupSeqs.val ( _.union ( seqArray, array ).toString () );
                        } else
                        {
                            $popupSeqs.val ( rowData.opertPlanSeq );
                        }
                    } else
                    {
                        var array = [ rowData.opertPlanSeq ];
                        $popupSeqs.val ( _.difference ( seqArray, array ).toString () );
                    }
                },
                onSelectAll : function ( aRowids, status )
                {
                    var $opertPlanSeq = $ ( '.opertPlanSeq' );
                    var $popupSeqs = $ ( '#popupOpertPlanSeqs' );
                    var seqArray = null;

                    if ( $popupSeqs !== null && $popupSeqs.val () !== '' )
                    {
                        seqArray = $popupSeqs.val ().split ( ',' );
                    }

                    var currentRptSeqArray = [];
                    $opertPlanSeq.each ( function ()
                    {
                        currentRptSeqArray.push ( $ ( this ).val () );
                    } );

                    if ( status )
                    {
                        if ( currentRptSeqArray.length > 0 )
                        {
                            if ( seqArray !== null && seqArray.length > 0 )
                            {
                                $popupSeqs.val ( _.union ( seqArray, currentRptSeqArray ).toString () );
                            } else
                            {
                                $popupSeqs.val ( currentRptSeqArray.toString () );
                            }
                        }
                    } else
                    {
                        if ( currentRptSeqArray.length > 0 )
                        {
                            if ( seqArray !== null && seqArray.length > 0 )
                            {
                                $popupSeqs.val ( _.difference ( seqArray, currentRptSeqArray ).toString () );
                            } else
                            {
                                $popupSeqs.val ( '' );
                            }
                        }
                    }
                }
            } );
}

// jqgird customize
function customizeJqgrid ()
{
    // jqgrid
    var tpl = getTemplate ( templates.noData );
    var $formDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );

    jqGridBasic ( $formDate.val (), $toDate.val () );
    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList2' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 검색
function searchJqgrid ()
{
    var $btnSearchPopup = $ ( '#btn_search_popup' );
    var $gridList = $ ( '#gridList2' );

    var $aplctnSectnCd = $ ( '#aplctnSectnCd' );
    var $aplctnStleCd = $ ( '#aplctnStleCd' );
    var $fromDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );

    $btnSearchPopup.click ( function ()
    {
        reloadJqgrid ( $gridList, $aplctnSectnCd, $aplctnStleCd, $fromDate, $toDate );
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $aplctnSectnCd, $aplctnStleCd, $fromDate, $toDate )
{
    var searchCondition = {
        pvId : paramPvId,
        aplctnSectnCd : $ ( ':selected', $aplctnSectnCd ).val (),
        aplctnStleCd : $ ( ':selected', $aplctnStleCd ).val (),
        fromDate : $fromDate.val (),
        toDate : $toDate.val ()
    };

    $gridList.setGridParam ( {
        postData : {
            pvId : searchCondition.pvId,
            aplctnSectnCd : searchCondition.aplctnSectnCd,
            aplctnStleCd : searchCondition.aplctnStleCd,
            fromDate : searchCondition.fromDate,
            toDate : searchCondition.toDate
        }
    } ).trigger ( 'reloadGrid' );
}
// jqgrid end

// 보고서 번호 초기화
function initOpertPlanSeqs ()
{
    $ ( '#popupOpertPlanSeqs' ).val ( $ ( '#opertPlanSeqs' ).val () );
}

// 등록한 작업계획 번호에 체크 처리를 한다.
function setCheckOpertPlanSeqs ()
{
    var $opertPlanSeq = $ ( '.opertPlanSeq' );
    var $popupSeqs = $ ( '#popupOpertPlanSeqs' );
    var seqArray = null;

    if ( $popupSeqs.val () !== '' )
    {
        seqArray = $popupSeqs.val ().split ( ',' );
    }

    if ( seqArray !== null && seqArray.length > 0 )
    {
        $opertPlanSeq.each ( function ()
        {
            var $that = $ ( this );
            _.each ( seqArray, function ( seq )
            {
                if ( $that.val () == seq )
                {
                    $that.prop ( 'checked', true );
                    return false;
                }
            } );
        } );
    }
}

// check 시 seq 처리(input hidden에 값 셋팅)
function setCheckedOpertPlanSeqsToInput ()
{
    // TODO event bind test 필요
    // $(document).on('click', '.opertPlanSeq', function() {
    // })

    var $opertPlanSeq = $ ( '.opertPlanSeq' );
    var $popupSeqs = $ ( '#popupOpertPlanSeqs' );
    var seqArray = null;

    $opertPlanSeq.on ( 'change', function ()
    {
        if ( $popupSeqs !== null && $popupSeqs.val () !== '' )
        {
            seqArray = $popupSeqs.val ().split ( ',' );
        }

        var $that = $ ( this );
        if ( $that.prop ( 'checked' ) )
        {
            if ( seqArray !== null && seqArray.length > 0 )
            {
                var array = [ $that.val () ];
                $popupSeqs.val ( _.union ( seqArray, array ).toString () );
            } else
            {
                $popupPtSeqs.val ( $that.val () );
            }
        } else if ( $popupSeqs !== null )
        {
            if ( seqArray !== null && seqArray.length > 0 )
            {
                var array = [ $that.val () ];
                $popupSeqs.val ( _.difference ( seqArray, array ).toString () );
            }
        }
    } );
}

// 업무 구분 선택시 업무 형태 정보 리스트를 가져옴
function getAplctnStleCd ()
{
    var $aplctnSectnCd = $ ( '#aplctnSectnCd' );
    var $aplctnStleCd = $ ( '#aplctnStleCd' );
    var tpl = getTemplate ( templates.aplctnSectnOption );
    $aplctnSectnCd.on ( 'change', function ()
    {
        var params = {
            aplctnSectnCd : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/servicemgt/contract/selectAplctnStleCdList.ajax',
            type : 'POST',
            dataType : 'json',
            data : params,
            async : false,
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            message : i18nMessage.msg_selection,
                            data : json.data
                        } );
                        $aplctnStleCd.html ( html ).trigger ( 'change' );
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

$ ( function ()
{
    initOpertPlanSeqs ();
    customizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    customizeJqgrid ();
    searchJqgrid ();
    getAplctnStleCd ();
} )