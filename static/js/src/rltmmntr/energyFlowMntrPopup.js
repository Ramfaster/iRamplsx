// jqgrid start
//헤더 병합
function addGroupHeader ()
{
    var groupHeaderName = 'User';
    $ ( "#gridListPop" ).jqGrid ( 'setGroupHeaders', {
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

function jqGridBasic ()
{
    var tpl = getTemplate ( templates.noData );

    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/realtime/energyflow/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 630,
                autowidth : true,
                shrinkToFit : false,
                sortname : 'statsYear',
                sortorder : 'desc',
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
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
                    width : 70
                }, {
                    name : 'rdtn',
                    align : 'right',
                    width : 125,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'arrayGeneqty',
                    align : 'right',
                    width : 110,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'arrayPr',
                    align : 'right',
                    width : 110,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'arrayLoss',
                    align : 'right',
                    width : 110,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'inverterGeneqty',
                    align : 'right',
                    width : 110,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'inverterPr',
                    align : 'right',
                    width : 110,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'inverterLoss',
                    align : 'right',
                    width : 110,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'vcbGeneqty',
                    align : 'right',
                    width : 110,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'vcbPr',
                    align : 'right',
                    width : 110,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'vcbLoss',
                    align : 'right',
                    width : 110,
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

                    $ ( "#totalRowCount" ).text ( resultText );
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

        $ ( '#gridListPop' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}
// jqgrid end

// jqgird customize
function customizeJqgrid ()
{
    // jqgrid
    jqGridBasic ();
    addGroupHeader ();
}

$ ( function ()
{
    customizeJqgrid ();
} );