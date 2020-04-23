var selectPlantCashFlowMgtList = [];
var chkcell = {
    cellId : undefined,
    chkval : undefined
}; // cell rowspan 중복 체크
var chkcell2 = {
    cellId : undefined,
    chkval : undefined
}; // cell rowspan 중복 체크

// form element customize
function customizeForm ()
{

    var $dateType1 = $ ( '#nationId, #spcId, #pvId,.customize_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
}

function initDatetimepicker ()
{
    var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#startdatetimepicker' );
    var $yyyyFromDate = $ ( '#date01' );

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

}

// jqgrid start
// 헤더 병합
function addGroupHeader ()
{
    var groupHeaderName = 'User';
    $ ( "#gridList" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'parnts1Name',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_division
        }, {
            startColumnName : 'janPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_january
        }, {
            startColumnName : 'febPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_febuary
        }, {
            startColumnName : 'marPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_march
        }, {
            startColumnName : 'aprPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_april
        }, {
            startColumnName : 'mayPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_may
        }, {
            startColumnName : 'junPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_june
        }, {
            startColumnName : 'julyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_july
        }, {
            startColumnName : 'augPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_august
        }, {
            startColumnName : 'sepPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_september
        }, {
            startColumnName : 'octPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_october
        }, {
            startColumnName : 'novPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_november
        }, {
            startColumnName : 'decPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_december
        }, {
            startColumnName : 'totalPlanSum',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_assetSum
        } ]
    } );
}

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    var fromDate = $ ( '#date01' ).val ();

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/asset/plantCashFlow/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 575,
                autowidth : true,
                shrinkToFit : false,
                multiselect : true,
                multiboxonly : false,
                rownumbers : false,
                postData : {
                    rd : $ ( 'input:radio[name="rd"]:checked' ).val (),
                    fromDate : fromDate,
                    nationId : $ ( ':selected', $ ( '#nationId' ) ).val (),
                    spcId : $ ( ':selected', $ ( '#spcId' ) ).val (),
                    pvId : $ ( ':selected', $ ( '#pvId' ) ).val (),
                    paramIsView : paramIsView
                },
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow99999,
                scroll : true,
                viewrecords : true,
                async : false,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_division, i18nMessage.msg_division, i18nMessage.msg_division, "stdrYear",
                        "acmsltSeq", "itemId", "pvId", i18nMessage.msg_unit, i18nMessage.msg_plan,
                        i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan,
                        i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan,
                        i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan,
                        i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan,
                        i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan,
                        i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan,
                        i18nMessage.msg_acmslt ],

                colModel : [ {
                    name : 'parnts1Name',
                    align : 'center',
                    width : '90',
                    sortable : false,
                    cellattr : function ( rowid, val, rowObject, cm, rdata ) /** 내용같으면 셀병합 */
                    {
                        var result = "";
                        if ( chkcell.chkval != val )
                        { // check 값이랑 비교값이 다른 경우
                            var cellId = this.id + '_row_' + rowid + '-' + cm.name;
                            result = ' rowspan="1" id ="' + cellId + '" + name="cellRowspan"';
                            // alert ( result );
                            chkcell = {
                                cellId : cellId,
                                chkval : val
                            };
                        } else
                        {
                            result = 'style="display:none"  rowspanid="' + chkcell.cellId + '"'; // 같을 경우 display
                            // none 처리
                        }
                        return result;
                    }
                }, {
                    name : 'parnts2Name',
                    align : 'center',
                    width : 90,
                    sortable : false,
                    cellattr : function ( rowid, val, rowObject, cm, rdata ) /** 내용같으면 셀병합 */
                    {
                        var result = "";

                        if ( chkcell2.chkval != val )
                        { // check 값이랑 비교값이 다른 경우
                            var cellId = this.id + '_row_' + rowid + '-' + cm.name;
                            result = ' rowspan="1" id ="' + cellId + '" + name="cellRowspan"';
                            // alert ( result );
                            chkcell2 = {
                                cellId : cellId,
                                chkval : val
                            };
                        } else
                        {
                            result = 'style="display:none"  rowspanid="' + chkcell2.cellId + '"'; // 같을 경우 display
                            // none 처리
                        }
                        if ( rowObject.parnts3Name == null )
                        {
                            result = 'colspan=2, ' + result;
                        }
                        return result;
                    }
                }, {
                    name : 'parnts3Name',
                    align : 'center',
                    sortable : false,
                    width : 90,
                    cellattr : function ( rowid, val, rowObject, cm, rdata ) /** 내용없으면 셀병합 */
                    {
                        var result = "";

                        if ( val == '&#160;' ) // null이면
                        {
                            result = 'style="display:none"';

                        }
                        return result;
                    }
                }, {
                    name : 'stdrYear',
                    align : 'center',
                    sortable : false,
                    hidden : true
                }, {
                    name : 'acmsltSeq',
                    align : 'center',
                    sortable : false,
                    hidden : true
                }, {
                    name : 'itemId',
                    align : 'center',
                    sortable : false,
                    hidden : true
                }, {
                    name : 'pvId',
                    align : 'center',
                    sortable : false,
                    hidden : true
                }, {
                    name : 'unit',
                    align : 'center',
                    sortable : false,
                    width : 60
                }, {
                    name : 'janPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'janAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'febPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'febAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'marPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'marAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'aprPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'aprAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'mayPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'mayAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'junPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'junAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'julyPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'julyAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'augPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'augAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'sepPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'sepAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'octPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'octAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'novPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'novAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'decPlan',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'decAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 82
                }, {
                    name : 'totalPlanSum',
                    align : 'right',
                    sortable : false,
                    width : 100
                }, {
                    name : 'totalResultSum',
                    align : 'right',
                    sortable : false,
                    width : 100
                } ],

                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '.gq_nodata' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                        $ ( '#btn_excel_popup' ).addClass ( 'dnone' );
                    } else
                    {
                        $ ( '#btn_excel_popup' ).removeClass ( 'dnone' );
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var $gridList = $ ( '#gridList' );
                        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

                        var ids = $gridList.jqGrid ( "getDataIDs" );
                        var colModel = $ ( "#gridList" ).jqGrid ( 'getGridParam', 'colModel' );

                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridList.getRowData ( cl );

                            $gridList.jqGrid ( 'setRowData', cl, rowData );

                            $checkboxs.eq ( i ).attr ( {
                                name : 'itemId',
                                value : rowData.itemId
                            } ).addClass ( 'itemIds' );

                        }

                        if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                        {
                            enableJqgridCheckbox ( $gridList, $checkboxs );
                        } else
                        {
                            disableJqgridCheckbox ( $gridList, $checkboxs );
                        }
                        var $jqgheaderTh = $ ( '.jqg-second-row-header th' );
                        var colModelArray = [ 'parnts1Name', 'parnts2Name', 'parnts3Name' ];
                        customizeJqgridHeader ( $gridList, $jqgheaderTh, 1, colModelArray, 2 );

                        // var ids = $gridList.jqGrid ( 'getDataIDs' );
                        // var $lastId = $ ( "#" + ids[ids.length - 1] + " td" );
                        //
                        // $lastId.eq ( 2 ).css ( "display", "none" );
                        // $lastId.eq ( 3 ).css ( "display", "none" );
                        // $lastId.eq ( 4 ).attr ( 'colspan', 3 );

                    }
                    $ ( "#load_gridList" ).hide ();

                },

                // Row 선택시
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowDataObj = $gridList.getRowData ( rowId );
                    if ( status )
                    {
                        var pvPlanAcmsltVO = new Object ();
                        pvPlanAcmsltVO.stdrYm = rowDataObj.stdrYm;
                        selectPlantCashFlowMgtList.push ( rowDataObj );
                    } else
                    {
                        var idx = selectPlantCashFlowMgtList.indexOf ( rowId );
                        selectPlantCashFlowMgtList.splice ( idx, 1 );
                    }
                },

                onSelectAll : function ( aRowids, status )
                {
                    var $gridList = $ ( '#gridList' );
                    if ( status )
                    {
                        for ( var i = 0; i < aRowids.length; i++ )
                        {
                            var chkInclude = selectPlantCashFlowMgtList.indexOf ( aRowids[i] );
                            if ( chkInclude < 0 )
                            {
                                var rowDataObj = $gridList.jqGrid ( "getRowData", aRowids[i] ); // 선택한 Row의
                                // rowDataObj

                                var pvPlanAcmsltVO = new Object ();
                                pvPlanAcmsltVO.stdrYm = rowDataObj.stdrYm;

                                selectPlantCashFlowMgtList.push ( rowDataObj.acmsltSeq );
                            }
                        }

                    } else
                    {
                        for ( var i = 0; i < aRowids.length; i++ )
                        {
                            var chkInclude = selectPlantCashFlowMgtList.indexOf ( aRowids[i] );
                            if ( chkInclude > -1 )
                            {
                                var rowDataObj = $gridList.jqGrid ( "getRowData", aRowids[i] );

                                var idx = selectPlantCashFlowMgtList.indexOf ( rowDataObj.acmsltSeq );
                                selectPlantCashFlowMgtList.splice ( idx, 1 );
                            }
                        }
                    }
                },

                gridComplete : function ()
                {
                    var $gridList = $ ( '#gridList' );
                    var ids = $gridList.jqGrid ( 'getDataIDs' );
                    var rowDatas = $gridList.jqGrid ( 'getRowData' );
                    var custumVal = 0;
                    for ( var i = 0, size = ids.length; i < size; i++ )
                    {
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].janPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "janPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].janAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "janAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].febPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "febPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].febAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "febAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].marPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "marPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].marAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "marAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].aprPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "aprPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].aprAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "aprAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].mayPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "mayPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].mayAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "mayAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].junPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "junPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].junAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "junAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].julyPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "julyPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].julyAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "julyAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].augPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "augPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].augAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "augAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].sepPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "sepPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].sepAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "sepAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].octPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "octPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].octAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "octAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].novPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "novPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].novAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "novAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].decPlan, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "decPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].decAcmslt, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "decAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].totalPlanSum, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "totalPlanSum", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].totalResultSum, staticVariable.decimalPoint );
                        $gridList.jqGrid ( 'setCell', ids[i], "totalResultSum", custumVal );

                    }

                    /** 내용같으면 셀병합 */
                    var grid = this;
                    $ ( 'td[name="cellRowspan"]', grid ).each ( function ()
                    {
                        var spans = $ ( 'td[rowspanid="' + this.id + '"]', grid ).length + 1;
                        if ( spans > 1 )
                        {
                            $ ( this ).attr ( 'rowspan', spans );
                        }
                    } );

                },

            } );

    addGroupHeader ();

    var $gridList = $ ( '#gridList' );
    var $jqgheaderTh = $ ( '.jqg-second-row-header th' );
    var colModelArray = [ 'parnts1Name', 'parnts2Name', 'parnts3Name' ];
    customizeJqgridHeader ( $gridList, $jqgheaderTh, 1, colModelArray, 2 );

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
    var $btnSearch = $ ( '#btn_search' );
    var $gridList = $ ( '#gridList' );

    var $date01 = $ ( '#date01' );

    $btnSearch.on ( 'click', function ()
    {
        var radioYear = $ ( 'input:radio[name="rd"]:checked' ).val ();

        var $btnGroupEdit = $ ( '#btn_group_edit' );
        var $btnGroupDelete = $ ( '#btn_group_delete' );
        $btnGroupEdit.removeClass ( 'dnone' );
        $btnGroupDelete.addClass ( 'dnone' );

        var pureFromDate = homUtil.convertDateStringToPureFormat ( $date01.val () );

        setSearchParameter ( pureFromDate );

        hideCol ( $gridList, radioYear );

        reloadJqgrid ( $gridList );
    } );

}

// 검색 조회조건 셋팅
function setSearchParameter ( pureFromDate )
{
    $ ( '#search_date' ).val ( pureFromDate );
}

// jqgrid reload
function reloadJqgrid ( $gridList )
{

    chkcell = {
        cellId : undefined,
        chkval : undefined
    }; // cell rowspan 중복 체크
    chkcell2 = {
        cellId : undefined,
        chkval : undefined
    }; // cell rowspan 중복 체크

    $gridList.jqGrid ( "clearGridData" );
    $gridList.setGridParam ( {
        postData : {
            rd : $ ( 'input:radio[name="rd"]:checked' ).val (),
            fromDate : $ ( '#date01' ).val (),
            nationId : $ ( ":selected", '#nationId' ).val (),
            spcId : $ ( ":selected", '#spcId' ).val (),
            pvId : $ ( ":selected", '#pvId' ).val (),
            paramIsView : paramIsView
        }
    } ).trigger ( 'reloadGrid' );

    selectPlantCashFlowMgtList.length = 0;

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// add input Box
function initializeInputBoxes ( $gridList )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var rowDatas = $gridList.jqGrid ( 'getRowData' );
    var noEditBox = null;
    var custumVal = 0;
    for ( var i = 0, size = ids.length; i < size; i++ )
    {
        custumVal = homUtil.removeNumberComma ( rowDatas[i].janPlan );
        setInputMarkup ( $gridList, 'janPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].janAcmslt );
        setInputMarkup ( $gridList, 'janAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].febPlan );
        setInputMarkup ( $gridList, 'febPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].febAcmslt );
        setInputMarkup ( $gridList, 'febAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].marPlan );
        setInputMarkup ( $gridList, 'marPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].marAcmslt );
        setInputMarkup ( $gridList, 'marAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].aprPlan );
        setInputMarkup ( $gridList, 'aprPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].aprAcmslt );
        setInputMarkup ( $gridList, 'aprAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].mayPlan );
        setInputMarkup ( $gridList, 'mayPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].mayAcmslt );
        setInputMarkup ( $gridList, 'mayAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].junPlan );
        setInputMarkup ( $gridList, 'junPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].junAcmslt );
        setInputMarkup ( $gridList, 'junAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].julyPlan );
        setInputMarkup ( $gridList, 'julyPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].julyAcmslt );
        setInputMarkup ( $gridList, 'julyAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].augPlan );
        setInputMarkup ( $gridList, 'augPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].augAcmslt );
        setInputMarkup ( $gridList, 'augAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].sepPlan );
        setInputMarkup ( $gridList, 'sepPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].sepAcmslt );
        setInputMarkup ( $gridList, 'sepAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].octPlan );
        setInputMarkup ( $gridList, 'octPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].octAcmslt );
        setInputMarkup ( $gridList, 'octAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].novPlan );
        setInputMarkup ( $gridList, 'novPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].novAcmslt );
        setInputMarkup ( $gridList, 'novAcmslt', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].decPlan );
        setInputMarkup ( $gridList, 'decPlan', ids[i], custumVal );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].decAcmslt );
        setInputMarkup ( $gridList, 'decAcmslt', ids[i], custumVal );
    }
}

// remove input Box
function removeInputBoxes ( $gridList )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var rowDatas = $gridList.jqGrid ( 'getRowData' );
    var noEditBox = null;
    for ( var i = 0, size = ids.length; i < size; i++ )
    {
        if ( $ ( "#" + ids[i] + "_janPlan" ).val () != null )
        {
            noEditBox = $ ( "#" + ids[i] + "_janPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "janPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_janAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "janAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_febPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "febPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_febAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "febAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_marPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "marPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_marAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "marAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_aprPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "aprPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_aprAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "aprAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_mayPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "mayPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_mayAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "mayAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_junPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "junPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_junAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "junAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_julyPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "julyPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_julyAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "julyAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_augPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "augPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_augAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "augAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_sepPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "sepPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_sepAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "sepAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_octPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "octPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_octAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "octAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_novPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "novPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_novAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "novAcmslt", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_decPlan" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "decPlan", noEditBox );
            noEditBox = $ ( "#" + ids[i] + "_decAcmslt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "decAcmslt", noEditBox );

        }

    }

}

function hideCol ( $gridList, radioYear )
{
    if ( radioYear == 3 ) /* 하반기 */
    {
        $gridList.jqGrid ( 'hideCol', [ 'janPlan', 'janAcmslt', 'febPlan', 'febAcmslt', 'marPlan', 'marAcmslt',
                'aprPlan', 'aprAcmslt', 'mayPlan', 'mayAcmslt', 'junPlan', 'junAcmslt' ] );
        $gridList.jqGrid ( 'showCol', [ 'julyPlan', 'julyAcmslt', 'augPlan', 'augAcmslt', 'sepPlan', 'sepAcmslt',
                'octPlan', 'octAcmslt', 'novPlan', 'novAcmslt', 'decPlan', 'decAcmslt' ] );

    } else if ( radioYear == 2 ) /* 상반기 */
    {
        $gridList.jqGrid ( 'hideCol', [ 'julyPlan', 'julyAcmslt', 'augPlan', 'augAcmslt', 'sepPlan', 'sepAcmslt',
                'octPlan', 'octAcmslt', 'novPlan', 'novAcmslt', 'decPlan', 'decAcmslt' ] );
        $gridList.jqGrid ( 'showCol', [ 'janPlan', 'janAcmslt', 'febPlan', 'febAcmslt', 'marPlan', 'marAcmslt',
                'aprPlan', 'aprAcmslt', 'mayPlan', 'mayAcmslt', 'junPlan', 'junAcmslt' ] );
    } else
    {
        $gridList.jqGrid ( 'showCol', [ 'janPlan', 'janAcmslt', 'febPlan', 'febAcmslt', 'marPlan', 'marAcmslt',
                'aprPlan', 'aprAcmslt', 'mayPlan', 'mayAcmslt', 'junPlan', 'junAcmslt' ] );
        $gridList.jqGrid ( 'showCol', [ 'julyPlan', 'julyAcmslt', 'augPlan', 'augAcmslt', 'sepPlan', 'sepAcmslt',
                'octPlan', 'octAcmslt', 'novPlan', 'novAcmslt', 'decPlan', 'decAcmslt' ] );
    }
}

// jqgrid 편집 enable 처리
function enableJqgridCheckbox ( $gridList, $checkboxs )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );

    $gridList.jqGrid ( 'hideCol', [ 'rn' ] );
    $gridList.jqGrid ( 'showCol', [ 'cb' ] );

    // $ ( "#jqg_gridList_" + ids[ids.length - 1] ).attr ( "disabled", true );

    // onSelectRow event 해제
    $gridList.jqGrid ( "setGridParam", {
        beforeSelectRow : function ( rowId, e )
        {
            return false;
        }
    } );
    initializeInputBoxes ( $gridList );

    var $monthlyInput = $ ( '.monthly_input' );
    var $yearPeriod = $ ( '.year_period:checked' );

    var columnCount = 24;

    // 상반기, 하반기 선택 시 12 / 그 외에는 24 (년)
    if ( $yearPeriod.val () === 2 || $yearPeriod.val () === 3 )
    {
        columnCount = 12;
    }

    $monthlyInput.on ( 'keypress', function ( event )
    {
        var index = $monthlyInput.index ( $ ( this ) );

        if ( event.keyCode === 38 )
        {
            index -= columnCount;
        } else if ( event.keyCode === 40 )
        {
            index += columnCount;
        }

        if ( index >= 0 )
        {
            $monthlyInput.eq ( index ).focus ();
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
            return false;
        }
    } );

    $ ( '.monthly_input' ).off ( 'keypress' );

    removeInputBoxes ( $gridList );
}

// 버튼 그룹 switch
function switchButtonGroup ()
{
    var $btnEdit01 = $ ( '#btn_edit01' );
    var $btnCancel01 = $ ( '#btn_cancel01' );
    var $btnGroupEdit = $ ( '#btn_group_edit' );
    var $btnGroupDelete = $ ( '#btn_group_delete' );

    var $gridList = $ ( '#gridList' );
    // var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

    $btnEdit01.click ( function ()
    {
        $btnGroupEdit.addClass ( 'dnone' );
        $btnGroupDelete.removeClass ( 'dnone' );

        // enableJqgridCheckbox ( $gridList, $checkboxs );

        selectPlantCashFlowMgtList.length = 0;

        setSearchedParameter ();

        paramIsView = false;
        reloadJqgrid ( $gridList );
    } );

    $btnCancel01.click ( function ()
    {
        $btnGroupEdit.removeClass ( 'dnone' );
        $btnGroupDelete.addClass ( 'dnone' );

        setSearchedParameter ();

        paramIsView = true;
        reloadJqgrid ( $gridList );
    } );
    ;
}

/**
 * 일괄등록 팝업 오픈
 */
function openBathRegPop ()
{
    var $btnPopup = $ ( '.btn_type02' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );

}

// 엑셀 다운로드
function excelDownload ()
{
    $ ( "#btn_excel_popup" ).on (
            'click',
            function ()
            {
                var menuName = '';
                $ ( '.lnb' ).find ( 'span' ).each ( function ()
                {
                    menuName += ($ ( this ).text () + '_');
                } );

                menuName += $ ( '.lnb' ).find ( 'strong' ).text ();
                // sevenBuff

                var pvName = encodeURIComponent ( $ ( ':selected', $ ( '#pvId' ) ).text () );
                var spcName = encodeURIComponent ( $ ( ':selected', $ ( '#spcId' ) ).text () );
                var nationName = encodeURIComponent ( $ ( ':selected', $ ( '#nationId' ) ).text () );
                location.href = $ ( this ).attr ( 'href' ) + '?fromDate=' + $ ( '#date01' ).val () + '&nationId='
                        + $ ( ':selected', $ ( '#nationId' ) ).val () + '&rd='
                        + $ ( 'input:radio[name="rd"]:checked' ).val () + '&spcId='
                        + $ ( ':selected', $ ( '#spcId' ) ).val () + '&pvId=' + $ ( ':selected', $ ( '#pvId' ) ).val ()
                        + '&spcName=' + encodeURIComponent ( spcName ) + '&pvName=' + encodeURIComponent ( pvName )
                        + '&nationName=' + encodeURIComponent ( nationName ) + '&sevenBuff='
                        + encodeURIComponent ( menuName );
                return false;
            } );

    if ( typeof $ ( "#btn_new_copy_popup" ) !== 'undefined' )
    {
        var btnPopup = $ ( "#btn_new_copy_popup" );
        // btnPopup.attr('href','');
        btnPopup.magnificPopup ( {
            type : 'ajax',
            alignTop : false,
            overflowY : 'scroll',
            closeOnContentClick : false,
            closeOnBgClick : false
        } );
    }
}

/**
 * 저장 버튼 클릭
 */
function onSave ()
{
    var $gridList = $ ( '#gridList' );
    $ ( '#btn_save' ).click ( function ()
    {
        var rowDataObj = $gridList.jqGrid ( 'getRowData' );
        var ids = $gridList.jqGrid ( 'getDataIDs' );
        var pvPlanAcmsltVOList = [];
        var chkValidate = 0;
        for ( var i = 0, size = ids.length; i < size; i++ )
        {
            var pvPlanAcmsltVO = new Object ();
            pvPlanAcmsltVO.stdrYear = rowDataObj[i].stdrYear;
            pvPlanAcmsltVO.acmsltSeq = rowDataObj[i].acmsltSeq;
            pvPlanAcmsltVO.pvId = rowDataObj[i].pvId;
            pvPlanAcmsltVO.itemId = rowDataObj[i].itemId;

            pvPlanAcmsltVO.janPlan = $ ( "#" + ids[i] + "_janPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.janPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_janPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.janPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_janPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.janPlan ) )
            {
                $ ( "#" + ids[i] + "_janPlan" ).addClass ( 'error' );
                chkValidate++;
            }

            pvPlanAcmsltVO.janAcmslt = $ ( "#" + ids[i] + "_janAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.janAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_janAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.janAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_janAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.janAcmslt ) )
            {
                $ ( "#" + ids[i] + "_janAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.febPlan = $ ( "#" + ids[i] + "_febPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.febPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_febPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.febPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_febPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.febPlan ) )
            {
                $ ( "#" + ids[i] + "_febPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.febAcmslt = $ ( "#" + ids[i] + "_febAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.febAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_febAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.febAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_febAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.febAcmslt ) )
            {
                $ ( "#" + ids[i] + "_febAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.marPlan = $ ( "#" + ids[i] + "_marPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.marPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_marPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.marPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_marPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.marPlan ) )
            {
                $ ( "#" + ids[i] + "_marPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.marAcmslt = $ ( "#" + ids[i] + "_marAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.marAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_marAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.marAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_marAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.marAcmslt ) )
            {
                $ ( "#" + ids[i] + "_marAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.aprPlan = $ ( "#" + ids[i] + "_aprPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.aprPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_aprPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.aprPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_aprPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.aprPlan ) )
            {
                $ ( "#" + ids[i] + "_aprPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.aprAcmslt = $ ( "#" + ids[i] + "_aprAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.aprAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_aprAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.aprAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_aprAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.aprAcmslt ) )
            {
                $ ( "#" + ids[i] + "_aprAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.mayPlan = $ ( "#" + ids[i] + "_mayPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.mayPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_mayPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.mayPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_mayPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.mayPlan ) )
            {
                $ ( "#" + ids[i] + "_mayPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.mayAcmslt = $ ( "#" + ids[i] + "_mayAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.mayAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_mayAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.mayAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_mayAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.mayAcmslt ) )
            {
                $ ( "#" + ids[i] + "_mayAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.junPlan = $ ( "#" + ids[i] + "_junPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.junPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_junPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.junPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_junPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.junPlan ) )
            {
                $ ( "#" + ids[i] + "_junPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.junAcmslt = $ ( "#" + ids[i] + "_junAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.junAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_junAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.junAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_junAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.junAcmslt ) )
            {
                $ ( "#" + ids[i] + "_junAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.julyPlan = $ ( "#" + ids[i] + "_julyPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.julyPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_julyPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.julyPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_julyPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.julyPlan ) )
            {
                $ ( "#" + ids[i] + "_julyPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.julyAcmslt = $ ( "#" + ids[i] + "_julyAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.julyAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_julyAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.julyAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_julyAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.julyAcmslt ) )
            {
                $ ( "#" + ids[i] + "_julyAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.augPlan = $ ( "#" + ids[i] + "_augPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.augPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_augPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.augPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_augPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.augPlan ) )
            {
                $ ( "#" + ids[i] + "_augPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.augAcmslt = $ ( "#" + ids[i] + "_augAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.augAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_augAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.augAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_augAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.augAcmslt ) )
            {
                $ ( "#" + ids[i] + "_augAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.sepPlan = $ ( "#" + ids[i] + "_sepPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.sepPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_sepPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.sepPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_sepPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.sepPlan ) )
            {
                $ ( "#" + ids[i] + "_sepPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.sepAcmslt = $ ( "#" + ids[i] + "_sepAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.sepAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_sepAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.sepAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_sepAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.sepAcmslt ) )
            {
                $ ( "#" + ids[i] + "_sepAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.octPlan = $ ( "#" + ids[i] + "_octPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.octPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_octPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.octPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_octPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.octPlan ) )
            {
                $ ( "#" + ids[i] + "_octPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.octAcmslt = $ ( "#" + ids[i] + "_octAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.octAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_octAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.octAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_octAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.octAcmslt ) )
            {
                $ ( "#" + ids[i] + "_octAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.novPlan = $ ( "#" + ids[i] + "_novPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.novPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_novPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.novPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_novPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.novPlan ) )
            {
                $ ( "#" + ids[i] + "_novPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.novAcmslt = $ ( "#" + ids[i] + "_novAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.novAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_novAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.novAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_novAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.novAcmslt ) )
            {
                $ ( "#" + ids[i] + "_novAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.decPlan = $ ( "#" + ids[i] + "_decPlan" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.decPlan, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_decPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.decPlan, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_decPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.decPlan ) )
            {
                $ ( "#" + ids[i] + "_decPlan" ).addClass ( 'error' );
                chkValidate++;
            }
            pvPlanAcmsltVO.decAcmslt = $ ( "#" + ids[i] + "_decAcmslt" ).val ();
            if ( cf_checkValidation ( pvPlanAcmsltVO.decAcmslt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_decAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvPlanAcmsltVO.decAcmslt, 16, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_decAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvPlanAcmsltVO.decAcmslt ) )
            {
                $ ( "#" + ids[i] + "_decAcmslt" ).addClass ( 'error' );
                chkValidate++;
            }

            pvPlanAcmsltVOList.push ( pvPlanAcmsltVO );

        }
        var fromDate = $ ( '#date01' ).val ();

        if ( chkValidate == 0 )
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
                    $.ajax ( {
                        url : contextPath + '/hom/asset/plantCashFlow/savePvPlanAcmslt.ajax',
                        type : 'POST',
                        dataType : 'json',
                        async : false,
                        data : {
                            fromDate : fromDate,
                            "jsonData" : JSON.stringify ( pvPlanAcmsltVOList )
                        },
                        success : function ( json )
                        {
                            if ( json.status === staticVariable.jsonStatusSuccess )
                            {
                                var $btnCancel01 = $ ( '#btn_cancel01' );
                                $btnCancel01.trigger ( 'click' );
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
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_valueInvalidAll,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );

        }
    } );

}

// 국가별 법인 정보 가져오기
function getNationSpcInfo ()
{
    var $nation = $ ( '#nationId' );
    var $spcId = $ ( '#spcId' );
    var tpl = getTemplate ( templates.spcInfoSelect );

    $nation.on ( 'change', function ( event )
    {
        var params = {
            nationId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/asset/plantCashFlow/selectMainSpcInfoList.ajax',
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
                            spcInfoList : json.data
                        } );

                        $spcId.empty ().html ( html ).trigger ( 'change' );

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

// 국가법인별 발전소 정보 가져오기
function getNationSpcPvInfo ()
{
    var $nation = $ ( '#nationId' );
    var $spcId = $ ( '#spcId' );
    var $pvId = $ ( '#pvId' );
    var tpl = getTemplate ( templates.assetPvInfoSelect );

    $spcId.on ( 'change', function ( event )
    {

        var params = {
            nationId : $ ( ':selected', $ ( '#nationId' ) ).val (),
            spcId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/asset/plantCashFlow/selectMainPvInfoList.ajax',
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
                            pvInfoList : json.data
                        } );

                        $pvId.empty ().html ( html ).trigger ( 'change' );

                        if ( paramFirstLoad == false )
                        {
                            customizeJqgrid ();
                            paramFirstLoad = true
                        }

                        // var $gridList = $ ( '#gridList' );
                        // reloadJqgrid ( $gridList );

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

/**
 * 삭제 버튼 클릭 (그리드 값 초기화)
 */
function onDelete ()
{

    var $gridList = $ ( '#gridList' );

    $ ( '#btn_delete' ).click ( function ()
    {
        var deleteArray = [];
        var idArray = [];
        var rowDataObj = $gridList.jqGrid ( 'getRowData' );
        var ids = $gridList.jqGrid ( 'getDataIDs' );

        for ( var i = 0, size = ids.length; i < size; i++ )
        {
            if ( $ ( "#jqg_gridList_" + ids[i] ).is ( ":checked" ) )
            {
                var pvPlanAcmsltVO = new Object ();
                pvPlanAcmsltVO.stdrYear = rowDataObj[i].stdrYear;
                pvPlanAcmsltVO.acmsltSeq = rowDataObj[i].acmsltSeq;

                idArray.push ( ids[i] );
                deleteArray.push ( pvPlanAcmsltVO )
            }
        }

        if ( deleteArray.length === 0 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertNoSelectedDeleteItem,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            deleteInfo ( idArray );
        }

        return false;
    } );

}

function deleteInfo ( ids )
{
    var noEditBox = null;
    var $gridList = $ ( '#gridList' );
    var rd = $ ( 'input:radio[name="rd"]:checked' ).val ();

    for ( var i = 0, size = ids.length; i < size; i++ )
    {
        if ( rd != 3 )
        {
            setInputMarkup ( $gridList, 'janPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'janAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'febPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'febAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'marPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'marAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'aprPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'aprAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'mayPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'mayAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'junPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'junAcmslt', ids[i], 0 );
        }
        if ( rd != 2 )
        {
            setInputMarkup ( $gridList, 'julyPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'julyAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'augPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'augAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'sepPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'sepAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'octPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'octAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'novPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'novAcmslt', ids[i], 0 );
            setInputMarkup ( $gridList, 'decPlan', ids[i], 0 );
            setInputMarkup ( $gridList, 'decAcmslt', ids[i], 0 );
        }

    }

}

// input box markup을 반환
function setInputMarkup ( $gridList, classNm, cl, value )
{
    var inputStr = '<div class="full_input_box"><input class="' + classNm + ' al_right monthly_input" id="' + cl + '_'
            + classNm + '" type="text" value="' + value + '"/></div>';
    $gridList.jqGrid ( 'setCell', cl, classNm, inputStr );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(시작, 종료)을 바꾼 후 조회버튼을 누르지 않고 엑셀 다운로드, 편집 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParameter ()
{
    var searchDate = homUtil.convertDateStringToFormat ( $ ( '#search_date' ).val (), homUtil.dateFormat.formatYYYY );

    $ ( '#date01' ).val ( searchDate );
}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    getNationSpcPvInfo ();
    getNationSpcInfo ();
    // customizeJqgrid ();
    searchJqgrid ();
    switchButtonGroup ();
    excelDownload ();
    openBathRegPop ();
    onSave ();
    onDelete ();
    // $ ( '#nationId' ).trigger ( "change" );
    $ ( '#nationId' ).val ( acntNationId ).trigger ( 'change' );
} );