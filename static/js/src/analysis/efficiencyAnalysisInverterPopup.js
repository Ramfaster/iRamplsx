// 조회 조건에 해당하는 타이틀 세팅
function setInverterPopupTitle ()
{
    var dateType = $ ( '#dateType' ).val ();
    var className = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
    }

    var fromDate = $ ( '#' + className + '_from_date' ).val ();
    var toDate = $ ( '#' + className + '_to_date' ).val ();

    $ ( '#search_inverter_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

// 인버터 효율 jqgrid popup 조회(초기 세팅 및 조회)
function searchInverterJqgridPopup ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var inverterEqmtId = $ ( '#inverterEqmtId' ).val ();

    var noDataId = 'inverter_popup_jqgrid_nodata';

    var tpl = getTemplate ( templates.noData );
    var $inverterGridListPop = $ ( '#inverterGridListPop' );

    $inverterGridListPop
            .jqGrid ( {
                url : contextPath + '/hom/analysis/effectiveness/selectInverterGridList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 630,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    inverterEqmtId : inverterEqmtId
                },
                colNames : [ i18nMessage.msg_division,
                        i18nMessage.msg_averageEfficiency + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                        'eqmtId' ],
                colModel : [ {
                    name : 'eqmtNm',
                    align : 'left',
                    width : '260',
                    fixed : true,
                    sortable : false
                }, {
                    name : 'efficiencyAvg',
                    align : 'right',
                    width : '960',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'eqmtId',
                    hidden : true
                } ],
                sortname : 'rank',
                sortorder : 'asc',
                rownumbers : true,
                rowwidth : 25,
                multiselect : false,
                multiboxonly : false,
                page : 1,
                rowNum : staticVariable.gridRow99999,
                scroll : true,
                viewrecords : true,
                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '#' + noDataId );

                    // 조회결과
                    var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
                    $ ( '#totalInverterPopupRowCount' ).text ( resultText );

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
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $inverterGridListPop.parent ().append ( html );
    }

    $inverterGridListPop.closest ( '.popup_cont' ).find ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

$ ( function ()
{
    setInverterPopupTitle ();
    searchInverterJqgridPopup ();
} );