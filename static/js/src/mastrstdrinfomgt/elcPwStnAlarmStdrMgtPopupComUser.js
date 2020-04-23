// form element customize
function customizePopForm ()
{
    // 설비 구분
    var $dateType1 = $ ( '#searchCorprId' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

// jqgird customize
function customizePopJqgrid ()
{
    // 데이터 없음 템플릿
    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;
    var strSort = null;
    var chkInit = true;
    colNames = [ "corprId", 'nationId', "chargerId", i18nMessage.msg_corporateName, i18nMessage.msg_corporateCharger,
            i18nMessage.msg_nation, i18nMessage.msg_email, i18nMessage.msg_phoneNumber ];

    if ( lang === locale.korea || lang === locale.korean )
    {
        colModel = [ {
            name : 'corprId',
            hidden : true
        }, {
            name : 'nationId',
            hidden : true
        }, {
            name : 'chargerId',
            hidden : true,
            key : true
        }, {
            name : 'corprKorNm',
            align : 'center',
            width : '250'
        }, {
            name : 'chargerNm',
            align : 'center',
            width : '250'
        }, {
            name : 'nationNm',
            align : 'center',
            width : '250'
        }, {
            name : 'chargerEmail',
            align : 'center',
            width : '240'
        }, {
            name : 'chargerCp',
            align : 'center',
            width : '240'
        } ];
    } else
    {
        colModel = [ {
            name : 'corprId',
            hidden : true
        }, {
            name : 'nationId',
            hidden : true
        }, {
            name : 'chargerId',
            hidden : true,
            key : true
        }, {
            name : 'corprEngNm',
            align : 'center',
            width : '250'
        }, {
            name : 'chargerNm',
            align : 'center',
            width : '250'
        }, {
            name : 'nationNm',
            align : 'center',
            width : '250'
        }, {
            name : 'chargerEmail',
            align : 'center',
            width : '240'
        }, {
            name : 'chargerCp',
            align : 'center',
            width : '240'
        } ];
    }
    $ ( '#gridListPop' )
            .jqGrid (
                    {
                        url : contextPath + '/hom/masterdata/alarm/selectAlarmCorprReceiveChargerList.ajax',
                        cache : false,
                        mtype : 'POST',
                        datatype : 'json',
                        height : 360,
                        autowidth : true,
                        shrinkToFit : false,
                        sortname : 'chargerNm',
                        sortorder : 'asc',
                        multiselect : true,
                        multiboxonly : false,
                        rownumbers : false,
                        rowwidth : 25,
                        page : 1,
                        rowNum : staticVariable.gridRow30,
                        scroll : true,
                        viewrecords : true,
                        emptyrecords : 'Scroll to bottom to retrieve new page', // the message will be displayed at the
                        // bottom
                        colNames : colNames,
                        colModel : colModel,

                        loadComplete : function ( data )
                        {
                            console.log ( data );
                            var $gqNodata = $ ( '.gq_nodata' );
                            var $gridList = $ ( '#gridListPop' );

                            if ( data.records === 0 )
                            {
                                $gqNodata.show ();
                            } else
                            {
                                $gqNodata.hide ();
                                var $gridList = $ ( '#gridListPop' );
                                setSelectedUser ( $gridList );
                                if ( chkInit )
                                {
                                    chkInit = false;
                                }
                            }
                            // $gridList.jqGrid ( 'hideCol', [ 'cb' ] );
                        },

                        // Row 선택시
                        onSelectRow : function ( rowId, e )
                        {
                            var $gridList = $ ( '#gridListPop' );
                            var rowData = $gridList.getRowData ( rowId );
                            var chargerId = rowData.chargerId;// 담당자ID
                            var chargerNm = rowData.chargerNm;// 담당자 이름
                            var nationId = rowData.nationId;// 국가아이디
                            var vHtml = "";
                            var $userlist = $ ( ".pop_list_wrap" );
                            var chk = $ ( "input:checkbox[id='jqg_gridListPop_" + rowId + "']" ).is ( ":checked" );
                            if ( chk )
                            {
                                var idx = chargerList.indexOf ( rowId );
                                // 선택 목록에 없는 경우 화면 및 목록에 추가
                                if ( idx < 0 )
                                {
                                    vHtml = vHtml
                                            + "<span data-nm='"
                                            + chargerNm
                                            + "' data-id='"
                                            + chargerId
                                            + "' data-nation-id='"
                                            + nationId
                                            + "'>"
                                            + chargerNm
                                            + "<a href='javascript:;' class='btn_del'><i class='icon_del'></i></a></span>";
                                    $userlist.append ( vHtml );
                                    console.log ( chargerList );

                                    chargerList.push ( chargerId );
                                }
                                // 목록에는 있지만 화면에 없는 경우 젤 처음 로드하는 경우 화면에만 추가
                                else if ( chkInit )
                                {

                                    vHtml = vHtml
                                            + "<span data-nm='"
                                            + chargerNm
                                            + "' data-id='"
                                            + chargerId
                                            + "' data-nation-id='"
                                            + nationId
                                            + "'>"
                                            + chargerNm
                                            + "<a href='javascript:;' class='btn_del'><i class='icon_del'></i></a></span>";
                                    $userlist.append ( vHtml );
                                }

                            } else
                            {
                                var idx = chargerList.indexOf ( rowId );
                                chargerList.splice ( idx, 1 );
                                $userlist.find ( "span[data-id='" + chargerId + "']" ).remove ();
                            }
                            deleteSelectUser ();
                            // $ ( "#viewFrm" ).submit ();
                        },
                        onSelectAll : function ( aRowids, status )
                        {
                            if ( status )
                            {
                                for ( var i = 0; i < aRowids.length; i++ )
                                {
                                    var chkInclude = chargerList.indexOf ( aRowids[i] );
                                    if ( chkInclude < 0 )
                                    {
                                        var $gridList = $ ( '#gridListPop' );
                                        var rowData = $gridList.getRowData ( aRowids[i] );
                                        var chargerId = rowData.chargerId;// 담당자ID
                                        var chargerNm = rowData.chargerNm;// 담당자 이름
                                        var nationId = rowData.nationId;// 국가 아이디
                                        var vHtml = "";
                                        var $userlist = $ ( ".pop_list_wrap" );
                                        var chk = $ ( "input:checkbox[id='jqg_gridListPop_" + aRowids[i] + "']" ).is (
                                                ":checked" );
                                        if ( chk )
                                        {
                                            var idx = chargerList.indexOf ( aRowids[i] );
                                            // 선택 목록에 없는 경우 화면 및 목록에 추가
                                            if ( idx < 0 )
                                            {
                                                vHtml = vHtml
                                                        + "<span data-nm='"
                                                        + chargerNm
                                                        + "' data-id='"
                                                        + chargerId
                                                        + "' data-nation-id='"
                                                        + nationId
                                                        + "'>"
                                                        + chargerNm
                                                        + "<a href='javascript:;' class='btn_del'><i class='icon_del'></i></a></span>";
                                                $userlist.append ( vHtml );
                                                console.log ( chargerList );

                                                chargerList.push ( chargerId );
                                            }
                                            // 목록에는 있지만 화면에 없는 경우 젤 처음 로드하는 경우 화면에만 추가
                                            else if ( chkInit )
                                            {

                                                vHtml = vHtml
                                                        + "<span data-nm='"
                                                        + chargerNm
                                                        + "' data-id='"
                                                        + chargerId
                                                        + "' data-nation-id='"
                                                        + nationId
                                                        + "'>"
                                                        + chargerNm
                                                        + "<a href='javascript:;' class='btn_del'><i class='icon_del'></i></a></span>";
                                                $userlist.append ( vHtml );
                                            }

                                        } else
                                        {
                                            var idx = chargerList.indexOf ( aRowids[i] );
                                            chargerList.splice ( idx, 1 );
                                            $userlist.find ( "span[data-id='" + chargerId + "']" ).remove ();
                                        }
                                    }
                                }

                            } else
                            {
                                var $gridList = $ ( '#gridListPop' );
                                var $userlist = $ ( ".pop_list_wrap" );
                                for ( var i = 0; i < aRowids.length; i++ )
                                {
                                    var chkInclude = chargerList.indexOf ( aRowids[i] );
                                    var rowData = $gridList.getRowData ( aRowids[i] );
                                    var chargerId = rowData.chargerId;// 담당자ID
                                    if ( chkInclude > -1 )
                                    {
                                        var idx = chargerList.indexOf ( aRowids[i] );
                                        chargerList.splice ( idx, 1 );
                                        $userlist.find ( "span[data-id='" + chargerId + "']" ).remove ();
                                    }
                                }
                            }
                            deleteSelectUser ();

                        }
                    /* 화면 하단에 총 데이터 갯수와 현재 페이지의 데이터가 몇번째 데이터인지 화면에 노출 */
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

function selectChargerComUser ()
{
    var $btnReg = $ ( "#btn_regPopupComUser" );
    var $mailInboundUserNationArray = $ ( '#mailInboundUserNationArray' );
    $btnReg.click ( function ()
    {
        var $selChkbox = $ ( ".cbox" );
        var chkCount = $ ( ".cbox:checked" ).length;// 체크박스 선택된 카운트
        if ( chkCount > 0 )
        {
            var arrChargerId = new Array ();
            var arrNationId = new Array ();
            var userCnt = 0;
            var firstUserNm = "";
            $ ( ".pop_list_wrap" ).find ( "span" ).each ( function ( index )
            {
                var $that = $ ( this );
                userCnt++;
                arrChargerId.push ( $that.attr ( "data-id" ) );
                arrNationId.push ( $that.attr ( 'data-nation-id' ) );
                if ( index == 0 )
                {
                    firstUserNm = $that.attr ( "data-nm" );
                }
            } );
            if ( type == "M" )
            {
                // TODO 메세지 처리
                if ( userCnt > 1 )
                {
                    $ ( "#mailInboundCorprUser" )
                            .val (
                                    firstUserNm
                                            + homUtil.replaceParam ( ' ' + i18nMessage.msg_sentencePersonCount,
                                                    (userCnt - 1) ) );
                } else
                {
                    $ ( "#mailInboundCorprUser" ).val ( firstUserNm );
                }

                $ ( "#mailInboundCorprUserArray" ).val ( arrChargerId );

                // 국가 아이디
                var resultNationId = arrNationId;
                if ( $mailInboundUserNationArray.val () !== '' )
                {
                    var originNationArray = $mailInboundUserNationArray.val ().split ( ',' );
                    resultNationId = _.union ( arrNationId, originNationArray );
                }

                $mailInboundUserNationArray.val ( resultNationId.toString () );

                $ ( "#mailInboundCorprUserPopup" ).attr (
                        "href",
                        contextPath + "/hom/masterdata/alarm/elcPwStnAlarmStdrMgtPopupComUser.do?type=M&operIdArray="
                                + chargerList.toString () );

            } else
            {
                if ( userCnt > 1 )
                {
                    $ ( "#smsInboundCorprUser" )
                            .val (
                                    firstUserNm
                                            + homUtil.replaceParam ( ' ' + i18nMessage.msg_sentencePersonCount,
                                                    (userCnt - 1) ) );
                } else
                {
                    $ ( "#smsInboundCorprUser" ).val ( firstUserNm );
                }

                $ ( "#smsInboundCorprUserArray" ).val ( arrChargerId );

                $ ( "#smsInboundCorprUserPopup" ).attr (
                        "href",
                        contextPath + "/hom/masterdata/alarm/elcPwStnAlarmStdrMgtPopupComUser.do?type=S&operIdArray="
                                + chargerList.toString () );
            }

            $ ( "#btn_closePopup" ).click ();
        } else
        {
            alert ( i18nMessage.msg_noSelectedCharger );
            return;
        }

    } );
}
// jqgrid 검색
function searchPopJqgrid ()
{
    var $btn_search = $ ( '#btn_search' );
    var $gridList = $ ( '#gridListPop' );
    var $selBox = $ ( '#searchCorprId' );
    var $searchChargerNm = $ ( '#searchChargerNm' );

    $selBox.change ( function ()
    {
        reloadPopJqgrid ( $gridList, $searchChargerNm, $selBox );

    } );

    $btn_search.click ( function ()
    {
        reloadPopJqgrid ( $gridList, $searchChargerNm, $selBox );
    } );

    $searchChargerNm.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadPopJqgrid ( $gridList, $searchChargerNm, $selBox );
        }
    } );
}
// jqgrid reload
function reloadPopJqgrid ( $gridList, $searchChargerNm, $selBox )
{
    $gridList.setGridParam ( {
        postData : {
            searchChargerNm : $searchChargerNm.val (),
            searchCorprId : $ ( ":selected", $selBox ).val ()
        }
    } ).trigger ( 'reloadGrid' );
}

// 선택한 담당자 삭제 버튼 클릭
function deleteSelectUser ()
{
    var $btnDel = $ ( ".btn_del" );
    var $gridList = $ ( '#gridListPop' );

    $btnDel.unbind ( 'click' );

    $btnDel.click ( function ()
    {
        // pop_list_wrap
        var delid = $ ( this ).parent ().attr ( "data-id" );

        // 그리드 선택해제
        $gridList.setSelection ( delid, false );

        // 선택된 사용자 담고 있는 변수에서 삭제
        var idx = chargerList.indexOf ( delid );
        chargerList.splice ( idx, 1 );

        // 선택한 수신자 목로화면에서 제거
        $ ( ".pop_list_wrap" ).find ( "span[data-id='" + delid + "']" ).remove ();
        // parent.remove ( parent );
    } );
}

// 기존 선택된 사용자 선택하기
function setSelectedUser ( $gridList )
{
    for ( var j = 0; j < chargerList.length; j++ )
    {
        $gridList.setSelection ( chargerList[j], true );
    }

}

var type;
$ ( function ()
{
    type = $ ( "#type" ).val ();
    customizePopForm ();
    customizePopJqgrid ();
    // reloadPopJqgrid ();
    searchPopJqgrid ();
    selectChargerComUser ();// 담당자 선택후 등록
    deleteSelectUser ();
} );