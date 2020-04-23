// jqgrid start
// 헤더 병합
function addGroupHeaderPopup ()
{
    var groupHeaderName = 'User';
    $ ( "#gridListPop" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'sumEnergy',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy + '(kWh)'
        } ]
    } );
}

function jqGridBasicPopup ()
{
    var tpl = getTemplate ( templates.noData );

    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/advancedanalysis/energy/selectIvtEnergyGridList.ajax',
                mtype : 'POST',
                postData : {
                    dateType : serarhDateType,
                    fromDate : searchFromDate,
                    toDate : searchToDate,
                    unit : valueUnit
                },
                datatype : 'json',
                loadonce : false,
                height : 650,
                autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
                shrinkToFit : false, // 컬럼너비 자동 지정
                rownumbers : true,
                rowNum : 30,

                sortname : "stdrDate", // 처음 정렬될 컬럼
                sortorder : "desc", // 정렬방법 (asc/desc)
                multiselect : false, // multi-select checkboxes appear
                multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
                // time

                page : 1,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_sum,
                        i18nMessage.msg_acmslt, i18nMessage.msg_ratio + "(%)" ],

                colModel : [ {
                    name : 'stdrDate',
                    index : '',
                    align : 'center',
                    width : '240',
                // cellattr : jsFormatterCell
                }, {
                    name : 'corprNm',
                    index : '',
                    align : 'left',
                    width : '250',
                    sortable : false
                }, {
                    name : 'sumEnergy',
                    index : '',
                    align : 'right',
                    width : '250',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                // cellattr : jsFormatterCellSum
                }, {
                    name : 'energy',
                    index : '',
                    align : 'right',
                    width : '250',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'ratioEnergy',
                    index : '',
                    align : 'right',
                    width : '250',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                } ],

                loadComplete : function ( data )
                {
                    console.log ( ">>>>> loadComplete " );
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

                },

                gridComplete : function ()
                {
                    console.log ( ">>>>> gridComplete " );
                    $ ( this ).rowspan ( 1, 3 );
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

// jqgird customize
function customizeJqgridPopup ()
{
    // jqgrid
    jqGridBasicPopup ();
    addGroupHeaderPopup ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

$ ( function ()
{
    customizeJqgridPopup ();
} );