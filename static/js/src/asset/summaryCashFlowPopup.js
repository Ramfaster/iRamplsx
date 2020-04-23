var selectPlantCashFlowMgtList = [];
var chkcell = {
    cellId : undefined,
    chkval : undefined
}; // cell rowspan 중복 체크
var chkcell2 = {
    cellId : undefined,
    chkval : undefined
}; // cell rowspan 중복 체크

// jqgrid start
// 헤더 병합
function addGroupHeader ()
{
    var groupHeaderName = 'User';
    $ ( "#popupGridList" ).jqGrid ( 'setGroupHeaders', {
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

    varCashFlowToDate = $ ( '#popupcachflowdate01' ).val ();

    $ ( '#popupGridList' ).jqGrid (
            {
                url : contextPath + '/hom/asset/plantCashFlow/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 550,
                autowidth : true,
                shrinkToFit : false,
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                postData : {
                    rd : $ ( 'input:radio[name="rd"]:checked' ).val (),
                    fromDate : varCashFlowToDate,
                    pvId : $ ( ':selected', $ ( '#pvId' ) ).val (),
                    paramIsView : true
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
                    cellattr : function ( rowid, val, rowObject, cm, rdata ) /** 내용없으면 셀병합 */
                    {
                        var result = "";

                        if ( val == '&#160;' ) // null이면
                        {
                            result = 'style="display:none"';
                        }
                        return result;
                    },
                    width : 90
                }, {
                    name : 'stdrYear',
                    align : 'center',
                    hidden : true
                }, {
                    name : 'acmsltSeq',
                    align : 'center',
                    hidden : true
                }, {
                    name : 'itemId',
                    align : 'center',
                    hidden : true
                }, {
                    name : 'pvId',
                    align : 'center',
                    hidden : true
                }, {
                    name : 'unit',
                    align : 'center',
                    sortable : false,
                    width : 80
                }, {
                    name : 'janPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'janAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'febPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'febAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'marPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'marAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'aprPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'aprAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'mayPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'mayAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'junPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'junAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'julyPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'julyAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'augPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'augAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'sepPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'sepAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'octPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'octAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'novPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'novAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'decPlan',
                    align : 'right',
                    sortable : false,
                    width : 80
                }, {
                    name : 'decAcmslt',
                    align : 'right',
                    sortable : false,
                    width : 80
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
                    var $gridList = $ ( '#popupGridList' );
                    var $gqNodata = $ ( '.gq_nodata' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                        $ ( '#btn_excel_cashflow_popup' ).addClass ( 'dnone' );
                    } else
                    {
                        $ ( '#btn_excel_cashflow_popup' ).removeClass ( 'dnone' );
                        $gqNodata.hide ();

                        // var $jqgheaderTh = $ ( '.jqg-second-row-header th' );
                        // var colModelArray = [ 'parnts1Name', 'parnts2Name', 'parnts3Name' ];
                        // customizeJqgridHeader ( $gridList, $jqgheaderTh, 2, colModelArray, 2 );

                        var $gridList = $ ( '#popupGridList' );
                        var $jqgheaderTh = $ ( '.jqg-second-row-header th' );
                        var colModelArray = [ 'parnts1Name', 'parnts2Name', 'parnts3Name' ];
                        customizeJqgridHeader ( $gridList, $jqgheaderTh, 1, colModelArray, 2 );

                    }
                    $ ( "#load_gridList" ).hide ();

                },

                // Row 선택시
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#popupGridList' );
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
                    var $gridList = $ ( '#popupGridList' );
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
                    var $gridList = $ ( '#popupGridList' );
                    var ids = $gridList.jqGrid ( 'getDataIDs' );
                    var rowDatas = $gridList.jqGrid ( 'getRowData' );
                    var custumVal = 0;
                    for ( var i = 0, size = ids.length; i < size; i++ )
                    {
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].janPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "janPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].janAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "janAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].febPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "febPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].febAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "febAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].marPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "marPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].marAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "marAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].aprPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "aprPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].aprAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "aprAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].mayPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "mayPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].mayAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "mayAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].junPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "junPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].junAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "junAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].julyPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "julyPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].julyAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "julyAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].augPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "augPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].augAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "augAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].sepPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "sepPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].sepAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "sepAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].octPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "octPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].octAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "octAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].novPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "novPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].novAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "novAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].decPlan, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "decPlan", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].decAcmslt, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "decAcmslt", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].totalPlanSum, 1 );
                        $gridList.jqGrid ( 'setCell', ids[i], "totalPlanSum", custumVal );
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].totalResultSum, 1 );
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

                    $ ( "#load_gridList" ).hide ();

                },

            } );

    addGroupHeader ();

    // var $gridList = $ ( '#popupGridList' );
    // var $jqgheaderTh = $ ( '.jqg-second-row-header th' );
    // var colModelArray = [ 'parnts1Name', 'parnts2Name', 'parnts3Name' ];
    // customizeJqgridHeader ( $gridList, $jqgheaderTh, 2, colModelArray, 2 );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#popupGridList' ).parent ().append ( html );
    }
    $ ( '#popupGridList' ).parent ().parent ().perfectScrollbar ();
}

// 엑셀 다운로드
function excelCashflowDownload ()
{
    if ( typeof $ ( "#btn_excel_cashflow_popup" ) !== 'undefined' )
    {
        // var btnCashflowPopup = $ ( "#btn_excel_cashflow_popup" ).magnificPopup ( {
        // type : 'ajax',
        // alignTop : false,
        // overflowY : 'scroll',
        // closeOnContentClick : false,
        // closeOnBgClick : false
        // } );
    }

    $ ( "#btn_excel_cashflow_popup" ).on (
            'click',
            function ()
            {
                var menuName = '';
                $ ( '.lnb' ).find ( 'span' ).each ( function ()
                {
                    menuName += ($ ( this ).text () + '_');
                } );

                menuName += $ ( '.lnb' ).find ( 'strong' ).text ();
                // alert ( menuName );

                var pvName = encodeURIComponent ( $ ( ':selected', $ ( '#pvId' ) ).text () );
                var spcName = encodeURIComponent ( $ ( ':selected', $ ( '#spcId' ) ).text () );
                var nationName = encodeURIComponent ( $ ( ':selected', $ ( '#nationId' ) ).text () );

                location.href = $ ( this ).attr ( 'href' ) + '?fromDate=' + varCashFlowToDate + '&rd='
                        + $ ( 'input:radio[name="rd"]:checked' ).val () + '&pvId='
                        + $ ( ':selected', $ ( '#pvId' ) ).val () + '&spcName=' + encodeURIComponent ( spcName )
                        + '&pvName=' + encodeURIComponent ( pvName ) + '&nationName='
                        + encodeURIComponent ( nationName );

                return false;
            } );

}

function fnCheckBtnLinks ()
{
    var $rptMbySectn = $ ( ":selected", $ ( "#rptMbySectn" ) ).val ();

    if ( 'RDT02' == $rptMbySectn )
    {
        $ ( "#popupDivCashFlowTitle" ).text (
                $ ( ':selected', $ ( '#spcId' ) ).text () + ' ' + $ ( "#popupDivCashFlowTitle" ).text () );
    } else
    {
        $ ( "#popupDivCashFlowTitle" ).text (
                $ ( ':selected', $ ( '#pvId' ) ).text () + ' ' + $ ( "#popupDivCashFlowTitle" ).text () );
    }
    fnCashflowDateSet ();
    excelCashflowDownload ();

    $ ( "#popupcashflowbtn_search" ).on ( 'click', function ()
    {

        var radioYear = $ ( 'input:radio[name="rd"]:checked' ).val ();
        varCashFlowToDate = $ ( '#popupcachflowdate01' ).val ();
        var $gridList = $ ( '#popupGridList' );

        hideCol ( $gridList, radioYear );

        $gridList.setGridParam ( {
            postData : {
                rd : radioYear,
                fromDate : varCashFlowToDate,
                pvId : $ ( ':selected', $ ( '#pvId' ) ).val (),
                paramIsView : true
            }
        } ).trigger ( 'reloadGrid' );

        $ ( '#popupGridList' ).parent ().parent ().perfectScrollbar ();

    } );

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

function fnCashflowDateSet ()
{
    // var dateType = $ ( '#rptCycleCd' ).val ();
    var className = null;

    var selectedType = $ ( ":selected", $ ( '#rptCycleCd' ) ).val ();
    if ( selectedType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( selectedType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
    } else if ( selectedType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
    }

    varCashFlowFromDate = $ ( '#' + className + '_from_date' ).val ();
    varCashFlowToDate = $ ( '#' + className + '_to_date' ).val ();

    var $yyyy = $ ( '.yyyy' );

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

    $ ( '#popupcachflowdate01' ).val ( varCashFlowToDate.substr ( 0, 4 ) );

    // $ ( "#popupDivSearchDate" ).text (
    // $ ( "#popupDivSearchDate" ).text () + ' ' + $ ( '#' + className + '_from_date' ).val () + ' ~ '
    // + $ ( '#' + className + '_to_date' ).val () );

}

var varCashFlowToDate = '';
var varCashFlowFromDate = '';

$ ( function ()
{
    fnCheckBtnLinks ();

    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    customizeJqgrid ();

} );