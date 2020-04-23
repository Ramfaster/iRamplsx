// form element customize
function customizeForm ()
{
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.mail_template' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// jqgrid start
function setColModel ()
{
    var colModel = [ {
        name : 'mailTmplatSeq',
        index : 'mailTmplatSeq'
    }, {
        name : 'nationId',
        index : 'nationId'
    }, {
        name : 'nationNm',
        index : 'nationNm',
        align : 'center',
        width : '140'
    }, {
        name : 'mailTmplatNm',
        index : 'mailTmplatNm',
        align : 'left',
        width : '210'
    } ];

    return colModel;
}

function jqGridBasic ()
{
    var colModel = setColModel ();
    var mailTmplatContsTpl = getTemplate ( templates.mailTmplatConts );
    var selectedMailTmplatTpl = getTemplate ( templates.selectedMailTmplat );
    $ ( '#gridListPopMailTemp' ).jqGrid ( {
        url : contextPath + '/hom/masterdata/alarm/selectMailTmplatList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 332,
        autowidth : true,
        shrinkToFit : false,
        colNames : [ 'mailTmplatSeq', 'nationId', i18nMessage.msg_nation, i18nMessage.msg_templateName ],
        colModel : colModel,
        sortname : 'mailTmplatNm',
        sortorder : 'asc',
        multiselect : true,
        multiboxonly : false,
        rownumbers : false,
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

                var $gridList = $ ( '#gridListPopMailTemp' );
                $gridList.jqGrid ( 'hideCol', [ 'mailTmplatSeq', 'nationId' ] );
                initSelectedMailTmplat ();
            }
        },
        onSelectRow : function ( rowId, status )
        {
            var $gridList = $ ( '#gridListPopMailTemp' );
            var rowData = $gridList.getRowData ( rowId );
            getMailTemplate ( mailTmplatContsTpl, rowData.mailTmplatSeq );

            if ( status )
            {
                addSelectedMailTmplat ( selectedMailTmplatTpl, rowData );
            } else
            {
                removeSelectedMailTmplat ( rowData );
            }
        },
        onSelectAll : function ( rowIds, status )
        {
            var $gridList = $ ( '#gridListPopMailTemp' );
            _.each ( rowIds, function ( rowId )
            {
                var rowData = $gridList.getRowData ( rowId );
                if ( status )
                {
                    addSelectedMailTmplat ( selectedMailTmplatTpl, rowData );
                } else
                {
                    removeSelectedMailTmplat ( rowData );
                }
            } );
        }
    } );
}

// jqgrid 검색
function searchJqgrid ()
{
    var $searchValue = $ ( '#popMailTemp_search' );
    var $btn_search = $searchValue.find ( 'a' );
    var $gridList = $ ( '#gridListPopMailTemp' );

    $btn_search.click ( function ()
    {
        reloadJqgrid ( $gridList, $searchValue );
    } );

    $searchValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadJqgrid ( $gridList, $searchValue );
        }
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $searchValue )
{
    $gridList.setGridParam ( {
        postData : {
            searchKey : 'all',
            searchKeyword : $searchValue.val ()
        }
    } ).trigger ( 'reloadGrid' );
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

        $ ( '#gridListPopMailTemp' ).parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}
// jqgrid end

// set contents
function getMailTemplate ( mailTmplatContsTpl, mailTmplatSeq )
{
    if ( mailTmplatSeq !== '' && mailTmplatSeq !== null )
    {
        $.ajax ( {
            url : contextPath + '/hom/masterdata/alarm/getMailTemplate.ajax',
            type : 'post',
            data : {
                mailTmplatSeq : mailTmplatSeq
            },
            async : false,
            success : function ( json )
            {
                var data = json.data;
                $ ( '.preview_tit' ).text ( data.sbjt );

                if ( mailTmplatContsTpl !== null )
                {
                    var template = _.template ( mailTmplatContsTpl );
                    var html = template ( {
                        contextPath : contextPath,
                        marginAuto : false,
                        conts : data.conts
                    } );

                    $ ( '.preview_cont' ).html ( html );
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
}

// 선택한 메일템플릿 처리
function addSelectedMailTmplat ( selectedMailTmplatTpl, rowData )
{
    var flag = true;
    var mailTmplatSeq = rowData.mailTmplatSeq;
    $ ( '.selected_mail_tmplat' ).each ( function ()
    {
        var $that = $ ( this );
        if ( $that.data ( 'mail-tmplat-seq' ) == mailTmplatSeq )
        {
            flag = false;
            return false;
        }
    } );

    if ( selectedMailTmplatTpl !== null && flag )
    {
        var template = _.template ( selectedMailTmplatTpl );
        var html = template ( {
            mailTmplatSeq : rowData.mailTmplatSeq,
            mailTmplatNm : rowData.mailTmplatNm,
            nationId : rowData.nationId
        } );

        $ ( '.pop_selected_mail_tmplat_list' ).append ( html );

        setRemoveSelectedMailTmplat ();
    }
}

// 
function removeSelectedMailTmplat ( rowData )
{
    var mailTmplatSeq = rowData.mailTmplatSeq;
    $ ( '.selected_mail_tmplat' ).each ( function ()
    {
        var $that = $ ( this );
        if ( $that.data ( 'mail-tmplat-seq' ) == mailTmplatSeq )
        {
            $that.remove ();
        }
    } );
}

function setRemoveSelectedMailTmplat ()
{
    var $gridList = $ ( '#gridListPopMailTemp' );
    var $removeBtn = $ ( '.selected_mail_tmplat .btn_del' );
    $removeBtn.on ( 'click', function ()
    {
        var $that = $ ( this );
        var mailTmplatSeq = $that.closest ( 'span' ).data ( 'mail-tmplat-seq' );
        var selectedArray = $gridList.jqGrid ( 'getGridParam', 'selarrrow' );
        _.each ( selectedArray, function ( rowId )
        {
            var rowData = $gridList.getRowData ( rowId );
            if ( mailTmplatSeq == rowData.mailTmplatSeq )
            {
                $gridList.jqGrid ( 'setSelection', rowId );
            }
        } );
    } );
}

function initSelectedMailTmplat ()
{
    var $selectedMailTmplat = $ ( '.selected_mail_tmplat' );
    var mailTmplatSeqArray = $ ( '#mailTmplatSeqArray' ).val ().split ( ',' );
    if ( $selectedMailTmplat.size () > 0 || mailTmplatSeqArray.length > 0 )
    {
        // $selectedMailTmplat.parent ().empty ();
        if ( $selectedMailTmplat.size () > 0 )
        {
            $selectedMailTmplat.each ( function ()
            {
                var mailTmplatSeq = $ ( this ).data ( 'mail-tmplat-seq' );
                mailTmplatSeqArray.push ( mailTmplatSeq.toString () );
            } );
        }

        var uniqMailTmplatSeqArray = _.uniq ( mailTmplatSeqArray );
        var $gridList = $ ( '#gridListPopMailTemp' );
        var ids = $gridList.jqGrid ( "getDataIDs" );
        for ( var i = 0, length = ids.length; i <= length; i++ )
        {
            var cl = ids[i];
            var rowData = $gridList.getRowData ( cl );

            if ( uniqMailTmplatSeqArray.length > 0 )
            {
                _.each ( uniqMailTmplatSeqArray, function ( seq )
                {
                    if ( seq == rowData.mailTmplatSeq )
                    {
                        $gridList.jqGrid ( 'setSelection', cl );
                        return;
                    }
                } );
            }
        }
    }
}

// 등록...처리...
function registMailTemplate ()
{
    var $btnReg = $ ( "#btn_regPopupMailTmplat" );
    var $mailTmplatSeqArray = $ ( '#mailTmplatSeqArray' );
    var $mailTmplatNationArray = $ ( '#mailTmplatNationArray' );
    var $btnClosePopup = $ ( '#btn_closePopup' );
    var $mailTmplatNm = $ ( '#mailTmplatNm' );
    $btnReg.click ( function ()
    {
        var $selectedMailTmplat = $ ( '.selected_mail_tmplat' );
        var size = $selectedMailTmplat.size ();
        if ( size > 0 )
        {
            var mailTmplatSeqArray = [];
            var mailTmplatNationArray = [];
            var mailTmplatNmText = $selectedMailTmplat.first ().data ( 'mail-tmplat-name' );
            if ( size > 1 )
            {
                mailTmplatNmText += homUtil.replaceParam ( ' ' + i18nMessage.msg_sentencetemplatCount, (size - 1) );
            }
            $mailTmplatNm.val ( mailTmplatNmText );

            $selectedMailTmplat.each ( function ()
            {
                var $that = $ ( this );
                mailTmplatSeqArray.push ( $that.data ( 'mail-tmplat-seq' ) );
                mailTmplatNationArray.push ( $that.data ( 'nation-id' ) );
            } );

            $mailTmplatSeqArray.val ( mailTmplatSeqArray.toString () );
            $mailTmplatNationArray.val ( _.uniq ( mailTmplatNationArray ).toString () );
        } else
        {
            $mailTmplatSeqArray.val ( '' );
            $mailTmplatNationArray.val ( '' );
        }

        $btnClosePopup.click ();
    } );
}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    customizeJqgrid ();
    searchJqgrid ();
    registMailTemplate ();
} );