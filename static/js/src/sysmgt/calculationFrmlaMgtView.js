// jqgrid start  
function jqGridBasic ()
{

    var tpl = getTemplate ( templates.noData );

    var colNames = null;
    var colModel = null;

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ "FormlDetlSeq", i18nMessage.msg_formlInputVal, i18nMessage.msg_formlItemName ];
        colModel = [ {
            name : 'formlDetlSeq',
            hidden : true
        }, {
            name : 'formlInputVal',
            align : 'center'
        }, {
            name : 'formlItemKorNm',
            align : 'center'
        } ];
    } else
    {
        colNames = [ "FormlDetlSeq", i18nMessage.msg_formlInputVal, i18nMessage.msg_formlItemName ];
        colModel = [ {
            name : 'formlDetlSeq',
            hidden : true
        }, {
            name : 'formlInputVal',
            align : 'center'
        }, {
            name : 'formlItemEngNm',
            align : 'center'
        } ];
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid ( {
        url : contextPath + '/hom/sysmgt/calculation/selectDetlInfolist.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            formlMastrSeq : formlMastrSeq
        },
        height : '452',
        autowidth : true,
        shrinkToFit : true,
        colNames : colNames,
        colModel : colModel,
        sortname : 'formlDetlSeq',
        sortorder : 'asc',
        multiselect : false,
        multiboxonly : false,
        rownumbers : true,
        rowwidth : 25,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gridList = $ ( '#gridList' );
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
// jqgrid end

$ ( function ()
{
    jqGridBasic ();
} );