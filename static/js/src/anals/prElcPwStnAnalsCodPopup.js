/**
 * COD기준 발전량 그리드 전체 목록 조회
 */
// jqgird customize
function jqGridBasicCodPop ()
{
    var tpl = getTemplate ( templates.noData );

    // jqgrid
    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/analysis/energy/selectCodEnergyGridList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 630,
                autowidth : true,
                shrinkToFit : false,
                sortname : 'No',
                sortorder : 'asc',
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,

                colNames : [ i18nMessage.msg_yearDo, "1" + i18nMessage.msg_month, "2" + i18nMessage.msg_month,
                        "3" + i18nMessage.msg_month, "4" + i18nMessage.msg_month, "5" + i18nMessage.msg_month,
                        "6" + i18nMessage.msg_month, "7" + i18nMessage.msg_month, "8" + i18nMessage.msg_month,
                        "9" + i18nMessage.msg_month, "10" + i18nMessage.msg_month, "11" + i18nMessage.msg_month,
                        "12" + i18nMessage.msg_month, i18nMessage.msg_subtotal ],

                colModel : [ {
                    name : 'stdrYear',
                    align : 'center',
                    width : '85'
                }, {
                    name : 'janData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'febData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'marData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'aprData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'mayData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'junData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'julData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'augData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'sepData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'otbData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'novData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'dcbData',
                    align : 'right',
                    width : '90'
                }, {
                    name : 'subTotal',
                    align : 'right',
                    width : '90',
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                } ],
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
                    }

                    // 조회결과 타이틀
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " " + data.records
                            + i18nMessage.msg_count;
                    $ ( "#totalRowCount" ).text ( resultText );
                },
                gridComplete : function ()
                {
                    var ids = $ ( '#gridListPop' ).jqGrid ( 'getDataIDs' );
                    var rows = $ ( '#gridListPop' ).jqGrid ( 'getRowData' );
                    var reverseRows = _.sortBy ( rows, 'stdrYear' ).reverse ();
                    var monthRangeKeys = _.keys ( reverseRows[0] ).slice ( 1, 13 );

                    for ( var i = 0; i < ids.length; i++ )
                    {
                        var id = ids[i];
                        var subtractionArray = [];
                        var customDataArray = [];
                        var rowValues1 = _.toArray ( reverseRows[i] ).slice ( 1, 13 ).map ( function ( item )
                        {
                            return homUtil.mathFloor ( item, staticVariable.decimalPoint );
                        } );
                        var customData;

                        if ( i < ids.length - 1 )
                        {
                            var rowValues2 = _.toArray ( reverseRows[i + 1] ).slice ( 1, 13 ).map ( function ( item )
                            {
                                return homUtil.mathFloor ( item, staticVariable.decimalPoint );
                            } );

                            for ( var j = 0; j < rowValues1.length; j++ )
                            {
                                var subtractionValue = rowValues1[j] - rowValues2[j];
                                subtractionArray.push ( subtractionValue );
                            }

                            for ( var k = 0; k < subtractionArray.length; k++ )
                            {
                                if ( subtractionArray[k] > 0 )
                                {
                                    customData = '<span class="t_org">(<i class="icon_up"></i> '
                                            + homUtil
                                                    .mathFloorComma ( subtractionArray[k], staticVariable.decimalPoint )
                                            + ')</span>'
                                            + homUtil.mathFloorComma ( rowValues1[k], staticVariable.decimalPoint );
                                } else if ( subtractionArray[k] < 0 )
                                {
                                    customData = '<span class="t_blue">(<i class="icon_down"></i> '
                                            + homUtil.mathAbsFloorComma ( subtractionArray[k],
                                                    staticVariable.decimalPoint ) + ')</span>'
                                            + homUtil.mathFloorComma ( rowValues1[k], staticVariable.decimalPoint );
                                } else
                                {
                                    customData = '(-)'
                                            + homUtil.mathFloorComma ( rowValues1[k], staticVariable.decimalPoint );
                                }
                                customDataArray.push ( customData );
                            }

                            $ ( '#gridListPop' )
                                    .jqGrid ( 'setRowData', id, _.object ( monthRangeKeys, customDataArray ) );
                        } else
                        {
                            for ( var y = 0; y < rowValues1.length; y++ )
                            {
                                customData = '(-)'
                                        + homUtil.mathFloorComma ( rowValues1[y], staticVariable.decimalPoint );
                                customDataArray.push ( customData );
                            }

                            $ ( '#gridListPop' )
                                    .jqGrid ( 'setRowData', id, _.object ( monthRangeKeys, customDataArray ) );
                        }
                    }
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridListPop' ).parent ().append ( html );
    }
}
// jqgrid end

function getFormattedCellValue ( cellValue )
{
    var prefix = '';
    if ( cellValue > 0 )
    {
        prefix = '(<i class="icon_up"></i>)';
    } else if ( cellValue < 0 )
    {
        prefix = '(<i class="icon_down"></i>)';
    } else
    {
        prefix = '(<i>-</i>)';
    }
    return prefix + homUtil.mathAbsFloorComma ( cellValue, staticVariable.decimalPoint );
}

// jqgird customize
function customizeJqgridCodPop ()
{
    // jqgrid
    jqGridBasicCodPop ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

$ ( function ()
{
    customizeJqgridCodPop ();
} );