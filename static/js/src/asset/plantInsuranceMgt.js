// form element customize
function customizeForm ()
{
    // 조회 조건
    var $dateType1 = $ ( '#nationId, #spcId, #pvId,.customize_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    // 검색 조건
    var $dateType = $ ( '#searchKey' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
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
    // 기간유형 datetimepicker 설정
    $ ( '.yyyy' ).datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#date_type' );
    $dateType.change ( function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === 'day' )
        {
            className = 'yyyymmdd';
        } else if ( selectedType === 'month' )
        {
            className = 'yyyymm';
        } else if ( selectedType === 'year' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
}

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    var paramNationId = $ ( ':selected', $ ( "#nationId" ) ).val ();
    var paramSpcId = $ ( ':selected', $ ( "#spcId" ) ).val ();
    var paramPvId = $ ( ':selected', $ ( "#pvId" ) ).val ();
    var paramSearchKey = $ ( ":selected", $ ( "#searchKey" ) ).val ();
    var paramsearchKeyword = $ ( '#searchKeyword' ).val ();
    var colNames = null;
    var colModel = null;
    var $totalRowCount = $ ( "#totalRowCount" );

    colNames = [ i18nMessage.msg_assetSpcName2, i18nMessage.msg_pvName,
            i18nMessage.msg_capacity + '' + i18nMessage.msg_unitKwp, i18nMessage.msg_InsurerName,
            i18nMessage.msg_InsurerFirstTime, i18nMessage.msg_InsurerRecentUpdate,
            i18nMessage.msg_InsurerExpirationDate, i18nMessage.msg_description, 'hiddenSpcId', 'hiddenPvId',
            'hiddenInsrncEntrpsCd' ];
    colModel = [ {
        name : 'spcIdNm',
        width : 240,
        align : 'left',
        fixed : true
    }, {
        name : 'pvIdNm',
        width : 240,
        align : 'left',
        fixed : true
    }, {
        name : 'fcltyCpcty',
        width : 165,
        align : 'right',
        fixed : true,
        formatter : customFormat
    }, {
        name : 'insrncEntrpsCdNm',
        width : 165,
        align : 'left',
        fixed : true
    }, {
        name : 'frstSbscrbDt',
        width : 165,
        align : 'center',
        fixed : true
    }, {
        name : 'recentRenewDt',
        width : 165,
        align : 'center',
        fixed : true
    }, {
        name : 'endPrearngeDt',
        width : 165,
        align : 'center',
        fixed : true
    }, {
        name : 'crstDesc',
        width : 253,
        align : 'center',
        fixed : true
    }, {
        name : 'spcId',
        width : 0,
        align : 'center',
        fixed : true,
        hidden : true
    }, {
        name : 'pvId',
        width : 0,
        align : 'center',
        fixed : true,
        hidden : true
    }, {
        name : 'insrncEntrpsCd',
        width : 0,
        align : 'center',
        fixed : true,
        hidden : true
    } ];

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/asset/plantInsurance/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 575,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    nationId : paramNationId,
                    pvId : paramPvId,
                    spcId : paramSpcId,
                    searchKey : paramSearchKey == 'all' ? '' : paramSearchKey,
                    searchKeyword : encodeURIComponent ( paramsearchKeyword )

                },
                colNames : colNames,
                colModel : colModel,
                sortname : 'spcIdNm',
                sortorder : 'asc',
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow99999,
                scroll : true,
                viewrecords : true,
                loadComplete : function ( data )
                {
                    var $gridList = $ ( '#gridList' );
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
                    var $gqNodata = $ ( '.gq_nodata' );

                    // 조회결과
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $totalRowCount.html ( resultText );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                        $ ( '#btn_excel_popup' ).addClass ( 'dnone' );
                    } else
                    {
                        $ ( '#btn_excel_popup' ).removeClass ( 'dnone' );
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        // var ids = $gridList.jqGrid ( 'getDataIDs' );
                        // for ( var i = 0, length = ids.length; i <= length; i++ )
                        // {
                        // var cl = ids[i];
                        // var rowData = $gridList.getRowData ( cl );
                        //
                        // // 사용/미사용 alias
                        // if ( rowData.usgAt !== null && rowData.usgAt === 'Y' )
                        // {
                        // rowData.usgAt = i18nMessage.msg_use;
                        // } else if ( rowData.usgAt !== null && rowData.usgAt === 'N' )
                        // {
                        // rowData.usgAt = i18nMessage.msg_unuse;
                        // }
                        //
                        // $gridList.jqGrid ( 'setRowData', cl, rowData );
                        //
                        // // checkbox 처리
                        // $checkboxs.eq ( i ).attr ( {
                        // name : 'itemId',
                        // value : rowData.itemId
                        // } ).data ( 'menu-relate-count', rowData.menuRelateCount ).addClass ( 'itemIds' );
                        // }

                    }

                    // if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                    // {
                    // enableJqgridCheckbox ( $gridList, $checkboxs )
                    // } else
                    // {
                    // disableJqgridCheckbox ( $gridList, $checkboxs )
                    // }

                    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();

                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );
                    location.href = contextPath + '/hom/asset/plantInsurance/view.do?insrncEntrpsCd='
                            + rowData.insrncEntrpsCd + '&pvId=' + rowData.pvId + '&spcId=' + rowData.spcId
                            + '&nationId=' + $ ( ':selected', $ ( "#nationId" ) ).val () + '&paramVarNationId='
                            + $ ( ':selected', $ ( "#nationId" ) ).val () + '&paramVarSpcId='
                            + $ ( ':selected', $ ( "#spcId" ) ).val () + '&paramVarPvId='
                            + $ ( ':selected', $ ( "#pvId" ) ).val () + '&searchKeyword='
                            + encodeURIComponent ( $ ( '#searchKeyword' ).val () ) + '&searchKey='
                            + $ ( ':selected', $ ( "#searchKey" ) ).val ();
                }
            } );

    if ( tpl != null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid reload
function reloadJqgrid ( $gridList )
{
    var varnationId = $ ( ':selected', $ ( "#nationId" ) ).val ();
    var varspcId = $ ( ':selected', $ ( "#spcId" ) ).val ();
    var varpvId = $ ( ':selected', $ ( "#pvId" ) ).val ();
    var varsearchKey = $ ( ":selected", $ ( "#searchKey" ) ).val ();

    if ( varnationId == 'all' )
    {
        varnationId = '';
    }
    if ( varspcId == 'all' )
    {
        varspcId = '';
    }
    if ( varpvId == 'all' )
    {
        varpvId = '';
    }
    if ( varsearchKey == 'all' )
    {
        varsearchKey = '';
    }

    postData = {
        nationId : varnationId,
        spcId : varspcId,
        pvId : varpvId,
        searchKey : varsearchKey,
        searchKeyword : encodeURIComponent ( $ ( '#searchKeyword' ).val () )
    };

    $ ( '#gridList' ).setGridParam ( {
        postData : postData
    } ).trigger ( 'reloadGrid' );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();

}
// jqgrid end

function checkBtns ()
{
    var vbtnAdd = $ ( '#btn_add' );
    var $searchKeyword = $ ( '#searchKeyword' );
    var $gridList = $ ( '#gridList' );

    vbtnAdd.on ( 'click', function ()
    {
        location.href = $ ( this ).attr ( 'href' ) + '&nationId=' + $ ( ':selected', '#nationId' ).val () + '&spcId='
                + $ ( ':selected', '#spcId' ).val () + '&pvId=' + $ ( ':selected', '#pvId' ).val ()
                + '&paramVarNationId=' + $ ( ':selected', $ ( "#nationId" ) ).val () + '&paramVarSpcId='
                + $ ( ':selected', $ ( "#spcId" ) ).val () + '&paramVarPvId=' + $ ( ':selected', $ ( "#pvId" ) ).val ()
                + '&searchKey=' + $ ( ":selected", "#searchKey" ).val () + '&searchKeyword='
                + encodeURIComponent ( $ ( '#searchKeyword' ).val () );

        return false;
    } );

    $ ( '#btn_search' ).on ( 'click', function ()
    {

        reloadJqgrid ( $gridList );

        return false;
    } );

    $searchKeyword.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadJqgrid ( $gridList );
        }
    } );

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

                location.href = $ ( this ).attr ( 'href' ) + '?nationId=' + $ ( ':selected', '#nationId' ).val ()
                        + '&spcId=' + $ ( ':selected', '#spcId' ).val () + '&pvId=' + $ ( ':selected', '#pvId' ).val ()
                        + '&sevenBuff=' + encodeURIComponent ( menuName );
                return false;
            } );
}

// 국가별 법인 정보 가져오기
function getNationSpcInfo ()
{
    var $nation = $ ( '#nationId' );
    var $spcId = $ ( '#spcId' );
    var tpl = getTemplate ( templates.paramSpcInfoSelect );

    $nation.on ( 'change', function ( event )
    {
        var params = {
            nationId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/asset/companyRepayFund/selectMainSpcInfoList.ajax',
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
                            paramSpcId : paramSpcId,
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
    var tpl = getTemplate ( templates.paramPvInfoSelect );

    $spcId.on ( 'change', function ( event )
    {

        var params = {
            nationId : $ ( ':selected', $ ( '#nationId' ) ).val (),
            spcId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/asset/plantInsurance/selectMainPvInfoList.ajax',
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
                            paramPvId : paramPvId,
                            pvInfoList : json.data
                        } );

                        $pvId.empty ().html ( html ).trigger ( 'change' );

                        if ( paramFirstLoad == false )
                        {
                            customizeJqgrid ();
                            paramFirstLoad = true
                        }

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

function customFormat ( cellValue, options, rowdata, action )
{
    // return homUtil.addNumberComma ( cellValue );
    return homUtil.mathFloorComma ( cellValue, staticVariable.decimalPoint );
    // var digit = staticVariable.decimalPoint;
}

function showPopup ()
{
    // $ ( '.btn_popup' ).magnificPopup ( {
    // type : 'ajax',
    // alignTop : false,
    // overflowY : 'scroll'
    // } );
}

function initSearchParam ()
{
    if ( '' != paramNationId )
    {
        $ ( '#nationId' ).val ( paramNationId ).trigger ( 'change' );
    } else
    {
        $ ( '#nationId' ).val ( acntNationId ).trigger ( 'change' );
    }
    if ( '' != paramSpcId )
    {
        $ ( '#spcId' ).val ( paramSpcId ).trigger ( 'change' );
    }
    if ( '' != paramPvId )
    {
        $ ( '#pvId' ).val ( paramPvId ).trigger ( 'change' );
    }
}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    showPopup ();
    checkBtns ();
    getNationSpcInfo ();
    getNationSpcPvInfo ();
    // customizeJqgrid ();
    // $ ( '#nationId' ).trigger ( "change" );

    initSearchParam ();

} );