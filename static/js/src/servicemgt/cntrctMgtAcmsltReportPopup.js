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
        name : 'rptSeq',
        hidden : true
    }, {
        name : 'stdrDt',
        index : '',
        align : 'center',
        width : '140'
    }, {
        name : 'rptDt',
        index : '',
        align : 'center',
        width : '140'
    }, {
        name : 'wrterNm',
        index : '',
        align : 'center',
        width : '140'
    }, {
        name : 'confmerNm',
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

function jqGridBasic ( division, rptCycleCd, fromDate, toDate )
{
    var colModel = setColModel ();
    $ ( '#gridList2' ).jqGrid (
            {
                url : contextPath + '/hom/servicemgt/contract/listReport.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    rptMbyId : division,
                    cntrctAplctnCntcTyCd : cntrctAplctnCntcTyCd,
                    rptCycleCd : rptCycleCd,
                    fromDate : fromDate,
                    toDate : toDate
                },
                height : 448,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ '', i18nMessage.msg_standardDays, i18nMessage.msg_reportDays, i18nMessage.msg_writer,
                        i18nMessage.msg_approver, i18nMessage.msg_writeDays ],
                colModel : colModel,
                sortname : 'stdrDt',
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
                                name : 'rptSeq',
                                value : rowData.rptSeq
                            } ).addClass ( 'rptSeq' );
                        }

                        setCheckPtSeqs ();
                        setCheckedPtSeqsToInput ();
                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList2' );
                    var rowData = $gridList.getRowData ( rowId );
                    var $popupPtSeqs = getPopupPtSeqs ();
                    var seqArray = null;
                    if ( $popupPtSeqs !== null && $popupPtSeqs.val () !== '' )
                    {
                        seqArray = $popupPtSeqs.val ().split ( ',' );
                    }

                    if ( status )
                    {
                        if ( seqArray !== null && seqArray.length > 0 )
                        {
                            var array = [ rowData.rptSeq ];
                            $popupPtSeqs.val ( _.union ( seqArray, array ).toString () );
                        } else
                        {
                            $popupPtSeqs.val ( rowData.rptSeq );
                        }
                    } else
                    {
                        var array = [ rowData.rptSeq ];
                        $popupPtSeqs.val ( _.difference ( seqArray, array ).toString () );
                    }
                },
                onSelectAll : function ( aRowids, status )
                {
                    var $rptSeq = $ ( '.rptSeq' );
                    var seqArray = null;
                    var $popupPtSeqs = getPopupPtSeqs ();

                    if ( $popupPtSeqs !== null && $popupPtSeqs.val () !== '' )
                    {
                        seqArray = $popupPtSeqs.val ().split ( ',' );
                    }

                    var currentRptSeqArray = [];
                    $rptSeq.each ( function ()
                    {
                        currentRptSeqArray.push ( $ ( this ).val () );
                    } );

                    if ( status )
                    {
                        if ( currentRptSeqArray.length > 0 )
                        {
                            if ( seqArray !== null && seqArray.length > 0 )
                            {
                                $popupPtSeqs.val ( _.union ( seqArray, currentRptSeqArray ).toString () );
                            } else
                            {
                                $popupPtSeqs.val ( currentRptSeqArray.toString () );
                            }
                        }
                    } else
                    {
                        if ( currentRptSeqArray.length > 0 )
                        {
                            if ( seqArray !== null && seqArray.length > 0 )
                            {
                                $popupPtSeqs.val ( _.difference ( seqArray, currentRptSeqArray ).toString () );
                            } else
                            {
                                $popupPtSeqs.val ( '' );
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
    var $rptCycleCd = $ ( '#rptCycleCd' );
    var $formDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );
    var $division = $ ( '#division' );

    jqGridBasic ( $division.val (), $rptCycleCd.val (), $formDate.val (), $toDate.val () );
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

    var $division = $ ( '#division' );
    var $rptCycleCd = $ ( '#rptCycleCd' );
    var $fromDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );

    $btnSearchPopup.click ( function ()
    {
        reloadJqgrid ( $gridList, $division, $rptCycleCd, $fromDate, $toDate );
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $division, $rptCycleCd, $fromDate, $toDate )
{
    var searchCondition = {
        rptMbyId : $ ( ':selected', $division ).val (),
        cntrctAplctnCntcTyCd : cntrctAplctnCntcTyCd,
        rptCycleCd : $ ( ':selected', $rptCycleCd ).val (),
        fromDate : $fromDate.val (),
        toDate : $toDate.val ()
    };

    $gridList.setGridParam ( {
        postData : {
            rptMbyId : searchCondition.rptMbyId,
            cntrctAplctnCntcTyCd : searchCondition.cntrctAplctnCntcTyCd,
            rptCycleCd : searchCondition.rptCycleCd,
            fromDate : searchCondition.fromDate,
            toDate : searchCondition.toDate
        }
    } ).trigger ( 'reloadGrid' );
}
// jqgrid end

// 보고서 번호 초기화
function initPtSeqs ()
{
    $ ( '#popupAmPtSeqs' ).val ( $ ( '#amPtSeqs' ).val () );
    $ ( '#popupOmPtSeqs' ).val ( $ ( '#omPtSeqs' ).val () );
}

// 보고서 유형코드에 따라 해당 셀렉터를 반환한다.
function getPopupPtSeqs ()
{
    var $popupPtSeqs = null;
    if ( staticVariable.cntrctAplctnCntTypeAm === cntrctAplctnCntcTyCd )
    {
        $popupPtSeqs = $ ( '#popupAmPtSeqs' );
    } else if ( staticVariable.cntrctAplctnCntTypeOm === cntrctAplctnCntcTyCd )
    {
        $popupPtSeqs = $ ( '#popupOmPtSeqs' );
    }

    return $popupPtSeqs;
}
// 등록 한 report 번호에 체크 처리를 한다.
function setCheckPtSeqs ()
{
    var $rptSeq = $ ( '.rptSeq' );
    var seqArray = null;
    var $popupPtSeqs = getPopupPtSeqs ();

    if ( $popupPtSeqs.val () !== '' )
    {
        seqArray = $popupPtSeqs.val ().split ( ',' );
    }

    if ( seqArray !== null && seqArray.length > 0 )
    {
        $rptSeq.each ( function ()
        {
            var $that = $ ( this );
            _.each ( seqArray, function ( ptSeq )
            {
                if ( $that.val () == ptSeq )
                {
                    $that.prop ( 'checked', true );
                    return false;
                }
            } );
        } );
    }
}

// check 시 seq 처리(input hidden에 값 셋팅)
function setCheckedPtSeqsToInput ()
{
    var $rptSeq = $ ( '.rptSeq' );
    var seqArray = null;
    var $popupPtSeqs = getPopupPtSeqs ();

    $rptSeq.on ( 'change', function ()
    {
        if ( $popupPtSeqs !== null && $popupPtSeqs.val () !== '' )
        {
            seqArray = $popupPtSeqs.val ().split ( ',' );
        }

        var $that = $ ( this );
        if ( $that.prop ( 'checked' ) )
        {
            if ( $popupPtSeqs !== null )
            {
                if ( seqArray !== null && seqArray.length > 0 )
                {
                    var array = [ $that.val () ];
                    $popupPtSeqs.val ( _.union ( seqArray, array ).toString () );
                } else
                {
                    $popupPtSeqs.val ( $that.val () );
                }
            }
        } else if ( $popupPtSeqs !== null )
        {
            if ( seqArray !== null && seqArray.length > 0 )
            {
                var array = [ $that.val () ];
                $popupPtSeqs.val ( _.difference ( seqArray, array ).toString () );
            }
        }
    } );
}

$ ( function ()
{
    initPtSeqs ();
    customizeForm ();
    customizeScroll ();
    initDatetimepicker ();
    customizeJqgrid ();
    searchJqgrid ();
} )