// jqgrid start

function setColModel ()
{
    var colModel = [ {
        name : 'tagEngNm',
        index : '',
        align : 'center',
        width : '115'
    }, {
        name : 'tagId',
        index : '',
        align : 'center',
        width : '220'
    }, {
        name : 'paramtrType',
        index : '',
        align : 'center',
        width : '115'
    }, {
        name : 'paramtrNm',
        index : '',
        align : 'center',
        width : '110'
    }, {
        name : 'cndfrmlaTyNm',
        index : '',
        align : 'center',
        width : '115'
    }, {
        name : 'reflctBeginDt',
        index : '',
        align : 'center',
        width : '155'
    }, {
        name : 'reflctTrmnatDt',
        index : '',
        align : 'center',
        width : '155'
    }, {
        name : 'regrId',
        index : '',
        align : 'center',
        width : '105'
    }, {
        name : 'regDt',
        index : '',
        align : 'center',
        width : '105'
    } ];

    if ( lang == locale.korea || lang == locale.korean )
    {
        colModel = [ {
            name : 'tagKorNm',
            index : '',
            align : 'center',
            width : '115'
        }, {
            name : 'tagId',
            index : '',
            align : 'center',
            width : '220'
        }, {
            name : 'paramtrType',
            index : '',
            align : 'center',
            width : '115'
        }, {
            name : 'paramtrNm',
            index : '',
            align : 'center',
            width : '110'
        }, {
            name : 'cndfrmlaTyNm',
            index : '',
            align : 'center',
            width : '115'
        }, {
            name : 'reflctBeginDt',
            index : '',
            align : 'center',
            width : '155'
        }, {
            name : 'reflctTrmnatDt',
            index : '',
            align : 'center',
            width : '155'
        }, {
            name : 'regrId',
            index : '',
            align : 'center',
            width : '105'
        }, {
            name : 'regDt',
            index : '',
            align : 'center',
            width : '105'
        } ];
    }

    return colModel;
}

// jqgrid start
function jqGridBasic ()
{
    var colModel = setColModel ();

    var sortname = 'tagEngNm';
    if ( lang == locale.korea || lang == locale.korean )
    {
        sortname = 'tagKorNm';
    }

    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/systag/sysTagHistlist.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    tagId : tagId
                },
                height : 642,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ i18nMessage.msg_systemTagName, i18nMessage.msg_systemTagId, i18nMessage.msg_parameterType,
                        i18nMessage.msg_parameterName, i18nMessage.msg_cndfrm, i18nMessage.msg_reflectionBeginDate,
                        i18nMessage.msg_reflectionTerminateDate, i18nMessage.msg_amender, i18nMessage.msg_updateDate ],
                colModel : colModel,
                sortname : sortname,
                sortorder : 'asc',
                rownumbers : true,
                rowwidth : 25,
                page : 1,
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
                    }
                }
            } );
}

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    // jqgrid
    jqGridBasic ();
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

$ ( function ()
{
    customizeJqgrid ();
} );