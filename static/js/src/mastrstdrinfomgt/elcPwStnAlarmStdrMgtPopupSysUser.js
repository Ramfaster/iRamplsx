// form element customize
function customizePopForm ()
{
    // 설비 구분
    var $dateType1 = $ ( '#searchAcntGradCd' ).customizeSelect ( {
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
    colNames = [ 'acntId', 'nationId', i18nMessage.msg_grade, i18nMessage.msg_corporateCharger, i18nMessage.msg_nation,
            i18nMessage.msg_email, i18nMessage.msg_phoneNumber ];

    if ( lang === locale.korea || lang === locale.korean )
    {
        strSort = "acntKorName";
        colModel = [ {
            name : 'acntId',
            hidden : true,
            key : true
        }, {
            name : 'nationId',
            hidden : true
        }, {
            name : 'acntGradKorNm',
            align : 'center',
            width : '250'
        }, {
            name : 'acntKorName',
            align : 'center',
            width : '250'
        }, {
            name : 'nationName',
            align : 'center',
            width : '250'
        }, {
            name : 'email',
            align : 'center',
            width : '240'
        }, {
            name : 'cttpc',
            align : 'center',
            width : '240'
        } ];
    } else
    {
        strSort = "acntEngName";
        colModel = [ {
            name : 'acntId',
            hidden : true,
            key : true
        }, {
            name : 'nationId',
            hidden : true
        }, {
            name : 'acntGradEngNm',
            align : 'center',
            width : '250'
        }, {
            name : 'acntEngName',
            align : 'center',
            width : '250'
        }, {
            name : 'nationName',
            align : 'center',
            width : '250'
        }, {
            name : 'email',
            align : 'center',
            width : '240'
        }, {
            name : 'cttpc',
            align : 'center',
            width : '240'
        } ];
    }
    $ ( '#gridListPop' )
            .jqGrid (
                    {
                        url : contextPath + '/hom/masterdata/alarm/selectAlarmCorprReceiveSystemUserList.ajax',
                        cache : false,
                        mtype : 'POST',
                        datatype : 'json',
                        height : 360,
                        autowidth : true,
                        shrinkToFit : false,
                        sortname : strSort,
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
                            // console.log ( data );
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
                            var userId = rowData.acntId;// 담당자ID
                            var nationId = rowData.nationId;
                            var userNm = ""
                            if ( lang === locale.korea || lang === locale.korean )
                            {
                                userNm = rowData.acntKorName;// 담당자 이름
                            } else
                            {
                                userNm = rowData.acntEngName;// 담당자 이름
                            }
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
                                            + userNm
                                            + "' data-id='"
                                            + userId
                                            + "' data-nation-id='"
                                            + nationId
                                            + "'>"
                                            + userNm
                                            + "<a href='javascript:;' class='btn_del'><i class='icon_del'></i></a></span>";
                                    $userlist.append ( vHtml );
                                    console.log ( chargerList );

                                    chargerList.push ( userId );
                                }
                                // 목록에는 있지만 화면에 없는 경우 젤 처음 로드하는 경우 화면에만 추가
                                else if ( chkInit )
                                {

                                    vHtml = vHtml
                                            + "<span data-nm='"
                                            + userNm
                                            + "' data-id='"
                                            + userId
                                            + "' data-nation-id='"
                                            + nationId
                                            + "'>"
                                            + userNm
                                            + "<a href='javascript:;' class='btn_del'><i class='icon_del'></i></a></span>";
                                    $userlist.append ( vHtml );
                                }
                            } else
                            {
                                var idx = chargerList.indexOf ( rowId );
                                chargerList.splice ( idx, 1 );
                                $userlist.find ( "span[data-id='" + userId + "']" ).remove ();
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

                                        // rowDataObj
                                        var $gridList = $ ( '#gridListPop' );
                                        var rowData = $gridList.getRowData ( aRowids[i] );
                                        var userId = rowData.acntId;// 담당자ID
                                        var nationId = rowData.nationId;
                                        var userNm = ""
                                        if ( lang === locale.korea || lang === locale.korean )
                                        {
                                            userNm = rowData.acntKorName;// 담당자 이름
                                        } else
                                        {
                                            userNm = rowData.acntEngName;// 담당자 이름
                                        }
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
                                                        + userNm
                                                        + "' data-id='"
                                                        + userId
                                                        + "' data-nation-id='"
                                                        + nationId
                                                        + "'>"
                                                        + userNm
                                                        + "<a href='javascript:;' class='btn_del'><i class='icon_del'></i></a></span>";
                                                $userlist.append ( vHtml );
                                                console.log ( chargerList );

                                                chargerList.push ( userId );
                                            }
                                            // 목록에는 있지만 화면에 없는 경우 젤 처음 로드하는 경우 화면에만 추가
                                            else if ( chkInit )
                                            {

                                                vHtml = vHtml
                                                        + "<span data-nm='"
                                                        + userNm
                                                        + "' data-id='"
                                                        + userId
                                                        + "' data-nation-id='"
                                                        + nationId
                                                        + "'>"
                                                        + userNm
                                                        + "<a href='javascript:;' class='btn_del'><i class='icon_del'></i></a></span>";
                                                $userlist.append ( vHtml );
                                            }
                                        } else
                                        {
                                            var idx = chargerList.indexOf ( aRowids[i] );
                                            chargerList.splice ( idx, 1 );
                                            $userlist.find ( "span[data-id='" + userId + "']" ).remove ();
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
                                    var userId = rowData.acntId;// 담당자ID
                                    if ( chkInclude > -1 )
                                    {
                                        var idx = chargerList.indexOf ( aRowids[i] );
                                        chargerList.splice ( idx, 1 );
                                        $userlist.find ( "span[data-id='" + userId + "']" ).remove ();
                                    }
                                }
                            }
                            deleteSelectUser ();

                        },
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

function selectCharger ()
{
    var $btnReg = $ ( "#btn_regPopup" );
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

            console.log ( arrNationId.toString () );

            if ( type == "M" )
            {
                if ( userCnt > 1 )
                {
                    $ ( "#mailInboundSystemUser" )
                            .val (
                                    firstUserNm
                                            + homUtil.replaceParam ( ' ' + i18nMessage.msg_sentencePersonCount,
                                                    (userCnt - 1) ) );
                } else
                {
                    $ ( "#mailInboundSystemUser" ).val ( firstUserNm );
                }

                $ ( "#mailInboundSystemUserArray" ).val ( arrChargerId );

                // 국가 아이디
                var resultNationId = arrNationId;
                if ( $mailInboundUserNationArray.val () !== '' )
                {
                    var originNationArray = $mailInboundUserNationArray.val ().split ( ',' );
                    resultNationId = _.union ( arrNationId, originNationArray );
                }

                $mailInboundUserNationArray.val ( resultNationId.toString () );

                $ ( "#mailInboundSystemUserPopup" ).attr (
                        "href",
                        contextPath + "/hom/masterdata/alarm/elcPwStnAlarmStdrMgtPopupSysUser.do?type=M&operIdArray="
                                + chargerList.toString () );
            } else
            {
                if ( userCnt > 1 )
                {
                    $ ( "#smsInboundSystemUser" )
                            .val (
                                    firstUserNm
                                            + homUtil.replaceParam ( ' ' + i18nMessage.msg_sentencePersonCount,
                                                    (userCnt - 1) ) );
                } else
                {
                    $ ( "#smsInboundSystemUser" ).val ( firstUserNm );
                }

                $ ( "#smsInboundSystemUserArray" ).val ( arrChargerId );

                $ ( "#smsInboundSystemUserPopup" ).attr (
                        "href",
                        contextPath + "/hom/masterdata/alarm/elcPwStnAlarmStdrMgtPopupSysUser.do?type=S&operIdArray="
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
    var $selBox = $ ( '#searchAcntGradCd' );
    var $searchValue = $ ( '#searchValue' );

    $selBox.change ( function ()
    {
        reloadPopJqgrid ( $gridList, $searchValue, $selBox );

    } );

    $btn_search.click ( function ()
    {
        reloadPopJqgrid ( $gridList, $searchValue, $selBox );
    } );

    $searchValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadPopJqgrid ( $gridList, $searchValue, $selBox );
        }
    } );
}
// jqgrid reload
function reloadPopJqgrid ( $gridList, $searchValue, $selBox )
{
    $gridList.setGridParam ( {
        postData : {
            searchValue : $searchValue.val (),
            searchAcntGradCd : $ ( ":selected", $selBox ).val ()
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
    } );
}
var type;

// 기존 선택된 사용자 선택하기
function setSelectedUser ( $gridList )
{
    for ( var j = 0; j < chargerList.length; j++ )
    {
        $gridList.setSelection ( chargerList[j], true );
    }

}

$ ( function ()
{
    type = $ ( "#type" ).val ();
    customizePopForm ();
    customizePopJqgrid ();
    // reloadPopJqgrid ();
    searchPopJqgrid ();
    selectCharger ();// 담당자 선택후 등록
    deleteSelectUser ();
} );