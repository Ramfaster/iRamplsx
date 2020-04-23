// jqgrid start
//헤더 병합
function addGroupHeader ()
{
    var groupHeaderName = 'User';
    $ ( "#gridList" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'arrayGeneqty',
            numberOfColumns : 3,
            titleText : 'Array'
        }, {
            startColumnName : 'inverterGeneqty',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_inverterEn
        }, {
            startColumnName : 'vcbGeneqty',
            numberOfColumns : 3,
            titleText : 'Grid'
        } ]
    } );
}

function addDataToJqGrid ( data )
{
    var $gridList = $ ( '#gridList' );
    for ( var i = 0, length = data.length; i < length; i++ )
    {
        $gridList.jqGrid ( 'addRowData', i + 1, data[i] );
    }
}

function jqGridBasic ()
{
    var tpl = getTemplate ( templates.noData );

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/realtime/energyflow/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 320,
                autowidth : true,
                shrinkToFit : false,
                sortname : 'statsYear',
                sortorder : 'desc',
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : 10,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_yearDo, i18nMessage.msg_rdtn + "(Wh/m&sup2;/y)",
                        i18nMessage.msg_energy + "(kWh)", "PR(%)", i18nMessage.msg_obtainLoss + "(%)",
                        i18nMessage.msg_energy + "(kWh)", "PR(%)", i18nMessage.msg_convertLoss + "(%)",
                        i18nMessage.msg_energy + "(kWh)", "PR(%)", i18nMessage.msg_acLoss + "(%)" ],

                colModel : [ {
                    name : 'statsYear',
                    align : 'center',
                    width : 110
                }, {
                    name : 'rdtn',
                    align : 'right',
                    width : 150,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'arrayGeneqty',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'arrayPr',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'arrayLoss',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'inverterGeneqty',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'inverterPr',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'inverterLoss',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'vcbGeneqty',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'vcbPr',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'vcbLoss',
                    align : 'right',
                    width : 140,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                } ],
                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '.gq_nodata' );

                    // 조회결과 타이틀
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $ ( "#resultCnt" ).text ( resultText );
                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
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

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgird customize
function customizeJqgrid ()
{
    // jqgrid
    jqGridBasic ();
    addGroupHeader ();
}
// jqgrid end

/**
 * 성능비는 TB_ACMSLT_ITEM_STATS(실적 항목 통계) 테이블에 있는 데이터와 TB_TMCL_STATS(시간 통계) 테이블에서 오늘 데이터 Sum한 데이터의 합으로 구해진다. 4분간격으로 Refresh
 */
function getPrInfo ()
{
    $
            .ajax ( {
                url : contextPath + '/hom/realtime/energyflow/selectPrInfo.ajax',
                type : 'POST',
                dataType : 'json',
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        $ ( "#totalPrVal" ).html (
                                homUtil.mathFloorComma ( json.data.vcbPr, staticVariable.decimalPoint ) + "%" );
                        $ ( "#arrayPrVal" ).html (
                                homUtil.mathFloorComma ( json.data.arrayPr, staticVariable.decimalPoint ) + "%" );
                        $ ( "#arrayPrLossVal" ).html (
                                homUtil.mathFloorComma ( json.data.arrayLoss, staticVariable.decimalPoint ) );
                        $ ( "#ivtPrVal" ).html (
                                homUtil.mathFloorComma ( json.data.inverterPr, staticVariable.decimalPoint ) + "%" );
                        $ ( "#ivtPrLossVal" ).html (
                                homUtil.mathFloorComma ( json.data.inverterLoss, staticVariable.decimalPoint ) );
                        $ ( "#vcbPrVal" ).html (
                                homUtil.mathFloorComma ( json.data.vcbPr, staticVariable.decimalPoint ) + "%" );
                        $ ( "#vcbPrLossVal" ).html (
                                homUtil.mathFloorComma ( json.data.vcbLoss, staticVariable.decimalPoint ) );
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

/**
 * 팝업을 보여준다.
 */
function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );
}

$ ( function ()
{
    customizeJqgrid ();
    showPopup ();
    getPrInfo ();

    // 인터벌에 의한 함수 호출(4분 주기)
    setInterval ( function ()
    {
        getPrInfo () ();
        getStatsData ( valueUnit );
        customizeJqgrid ();
    }, 1000 * 60 * 4 );
} );