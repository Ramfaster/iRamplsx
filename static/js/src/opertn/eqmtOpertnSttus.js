// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
}

// scroll customize
function customizeScroll ()
{
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.tbl_list_wrap, .tbl_list_wrap02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// 라디오 버튼클릭
function searchRadio ()
{
    var $radio = $ ( 'input[name=radio1]' );
    var $preTagId = $ ( '#preTagId' );
    $radio.on ( 'click', function ()
    {
        var tagId = $ ( this ).val ();

        $preTagId.val ( tagId );

        // 차트조회
        searchHighcharts ( tagId );
    } );

    var $msrinsTr = $ ( '#msrins tr' );
    $msrinsTr.on ( 'click', function ()
    {
        var $inputRadio = $ ( this ).find ( 'input' );
        var tagId = $inputRadio.val ();

        $inputRadio.prop ( 'checked', true ).trigger ( 'change' );
        $preTagId.val ( tagId );
        searchHighcharts ( tagId );
    } );

    customizeForm ();

}

// 차트조회
function searchHighcharts ( radioVal )
{

    var params = {
        tagId : radioVal
    };

    var yAxisName;
    var xAxisName;

    $.ajax ( {
        url : contextPath + '/hom/operation/equipment/selectTagUnitInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        async : false,
        success : function ( json )
        {

            var data = json.data;

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( data != null )
                {

                    var cdVal = json.data.cdVal;
                    if ( !cdVal )
                    {
                        cdVal = '-';
                    }

                    if ( lang === locale.korea || lang === locale.korean )
                    {
                        xAxisName = data.tagKorNm;

                        if ( data.cdKorNm )
                        {
                            yAxisName = data.cdKorNm + '(' + cdVal + ')';
                        } else
                        {
                            yAxisName = '- (' + cdVal + ')';
                        }
                    } else
                    {
                        xAxisName = data.tagEngNm;
                        if ( data.cdEngNm )
                        {
                            yAxisName = data.cdEngNm + '(' + cdVal + ')';
                        } else
                        {
                            yAxisName = '- (' + cdVal + ')';
                        }
                    }

                }

            } else
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
    } )

    $.ajax ( {
        url : contextPath + '/hom/operation/equipment/selectRltmList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {

            if ( json.status === staticVariable.jsonStatusSuccess )
            {

                var length = json.data.length;

                if ( length > 0 )
                {
                    $ ( '.graph_wrap03' ).remove ();
                    $ ( '#f_left' ).append ( "<div class='graph_wrap03' id='graph01'></div>" );

                    var data = json.data;

                    if ( data != null )
                    {

                        var chartData = [];
                        var numbers = [];

                        $.each ( data, function ( itemNo, item )
                        {
                            chartData.push ( [
                                    homUtil.convertDateStringToLong ( homUtil
                                            .convertDateStringToPureFormat ( item.occrrncDt ) ),
                                    homUtil.mathFloor ( item.tagVal, staticVariable.decimalPoint ) ] );

                            numbers.push ( parseFloat ( item.tagVal ) );
                        } );

                        var yAxis = {
                            title : {
                                text : yAxisName
                            }
                        };

                        var minNumber = _.min ( numbers );
                        if ( minNumber >= 0 )
                        {
                            yAxis.min = 0;
                        }

                        // 그래프
                        $ ( '#graph01' ).highcharts (
                                {
                                    colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                                    chart : {
                                        marginTop : 30,
                                        height : 445,
                                        zoomType : 'x',
                                        panning : true,
                                        panKey : 'shift'
                                    },
                                    title : {
                                        text : '',
                                        style : {
                                            display : 'none',
                                        }
                                    },
                                    subtitle : {
                                        text : '',
                                        style : {
                                            display : 'none'
                                        }
                                    },
                                    exporting : {
                                        enabled : false
                                    },
                                    credits : {
                                        enabled : false
                                    },
                                    xAxis : {
                                        type : 'datetime',
                                        labels : {
                                            style : {
                                                color : '#3c3c3c'
                                            },
                                            formatter : function ()
                                            {
                                                var date = homUtil.convertDateLongToString ( this.value,
                                                        homUtil.dateFormat.convertHHMM );

                                                return date;
                                            }
                                        },
                                        tickInterval : 60 * 60 * 1000
                                    },
                                    yAxis : yAxis,
                                    tooltip : homUtil.generateTooltip ( homUtil.dateFormat.convertYYYYMMDDHHMM,
                                            staticVariable.decimalPoint ),
                                    plotOptions : {
                                        column : {
                                            pointPadding : 0,
                                            borderWidth : 0
                                        },
                                        line : {
                                            marker : {
                                                enabled : false
                                            }
                                        }
                                    },
                                    series : [ {
                                        type : 'line',
                                        yAxis : 0,
                                        // color : '#ed6c44',
                                        name : xAxisName,
                                        data : chartData
                                    } ]
                                } );

                    }
                } else
                {

                    var html = "<div class='graph_wrap03'><div class='bg_nodata'><i class='icon_nodata'></i>"
                            + i18nMessage.msg_sentenceGridNoData + "</div></div>";

                    $ ( '.graph_wrap03' ).remove ();
                    $ ( '#f_left' ).append ( html );

                }
            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }

        },// success
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

// 상태조회
function getStatus ()
{

    var params = {
        eqmtId : $ ( '#eqmtId' ).val (),
        parntsEqmtId : $ ( '#parntsEqmtId' ).val ()
    };

    $
            .ajax ( {
                url : contextPath + '/hom/operation/equipment/selectStatusList.ajax',
                type : 'POST',
                dataType : 'json',
                data : params,
                success : function ( json )
                {

                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {

                        var data = json.data;

                        if ( data != null && data.length > 0 )
                        {
                            // 전체 데이터 수.
                            var dataLength = data.length;

                            // TR 수.
                            var trLength = parseInt ( dataLength / 3, 10 );

                            // 나머지가 있을 경우 TR 개수 1 증가.
                            if ( dataLength % 3 > 0 )
                            {
                                trLength = trLength + 1;
                            }

                            var appendHtml = "";

                            for ( index = 1; index <= trLength * 3; index++ )
                            {

                                if ( index % 3 == 1 )
                                {
                                    appendHtml = appendHtml + "<tr>"
                                }

                                if ( index <= dataLength )
                                {
                                    var item = json.data[index - 1];

                                    var tagNm = "";
                                    if ( lang === locale.korea || lang === locale.korean )
                                    {
                                        tagNm = item.tagKorNm;
                                    } else
                                    {
                                        tagNm = item.tagEngNm;
                                    }

                                    appendHtml = appendHtml + "<td><i class= " + item.tagColor + "></i>" + tagNm
                                            + "  </td>"
                                } else
                                {
                                    appendHtml = appendHtml + "<td></td>";
                                }

                                if ( index % 3 == 0 )
                                {
                                    appendHtml = appendHtml + "</tr>"
                                }

                            }

                            $ ( '#t_Status' ).empty ();
                            $ ( '#t_Status' ).append ( appendHtml );

                        } else
                        {
                            $ ( '#t_Status' ).empty ();
                            $ ( '#t_Status' ).append (
                                    "<tr><td colspan='3' align='center'>" + i18nMessage.msg_sentenceGridNoData
                                            + "</td></tr>" );
                        }

                    } else
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : json.message,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                    }

                },// success
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

// 계측조회
function getMsrins ()
{
    var params = {
        eqmtId : $ ( '#eqmtId' ).val (),
        parntsEqmtId : $ ( '#parntsEqmtId' ).val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/operation/equipment/selectMsrinsList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var data = json.data;
                var $msrins = $ ( '#msrins' );
                var $preTagId = $ ( '#preTagId' );
                // 이전 선택한 태그 아이디.
                var radioVal = $ ( 'input[name=radio1]:checked' ).val ();

                $msrins.empty ();

                if ( data != null && json.data.length >= 1 )
                {
                    var preTagId = $preTagId.val ();
                    var checked = false;
                    $.each ( data, function ( itemNo, item )
                    {
                        var checkFlag = false;
                        var tagNm = null;
                        if ( lang === locale.korea || lang === locale.korean )
                        {
                            tagNm = item.tagKorNm;
                        } else
                        {
                            tagNm = item.tagEngNm;
                        }

                        if ( typeof radioVal == 'undefined' )
                        {
                            checkFlag = true;
                            radioVal = item.tagId;
                            searchHighcharts ( item.tagId );
                            $preTagId.val ( item.tagId );
                        } else if ( preTagId == item.tagId )
                        {
                            checkFlag = true;
                        }

                        var html = '<tr><th><input type="radio" id="radio' + (itemNo + 1)
                                + '" class="image_type" name="radio1" value="' + item.tagId + '"';
                        if ( checkFlag )
                        {
                            html += ' checked = "checked"';
                        }
                        html += ' /><label for="radio' + (itemNo + 1) + '" /></th><th>' + tagNm
                                + '</th><td class="tright">' + item.tagValue + '</td></tr>';
                        $msrins.append ( html );
                    } );

                    searchRadio ();
                } else
                {
                    $msrins.html ( "<tr><td colspan='3'>" + i18nMessage.msg_sentenceGridNoData + "</td></tr>" );

                    var html = "<div class='graph_wrap03'><div class='bg_nodata'><i class='icon_nodata'></i>"
                            + i18nMessage.msg_sentenceGridNoData + "</div></div>";

                    $ ( '.graph_wrap03' ).remove ();
                    $ ( '#f_left' ).append ( html );
                }
            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
        },// success
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

/**
 * 트리 초기화
 */
function initTree ( data )
{
    // 트리메뉴
    var setting = {
        view : {
            selectedMulti : false
        },
        edit : {},
        check : {
            enable : true,
            chkStyle : 'radio',
            radioType : 'all'
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        callback : {

            onCheck : function ( e, treeId, treeNode )
            {

                // 선택 된 설비아이디
                if ( treeNode.checked == true )
                {
                    searchSelectedEqmtInfo ( treeNode );
                }

            },
            beforeClick : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var selectedNodes = zTree.getSelectedNodes ();
                if ( selectedNodes.length > 0 && selectedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    if ( treeNode.chkDisabled )
                    {
                        return false;
                    } else
                    {
                        zTree.checkNode ( treeNode, true, true );
                        searchSelectedEqmtInfo ( treeNode );
                    }
                }
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
    var treeObj = $.fn.zTree.getZTreeObj ( "treeList" );
    var nodes = treeObj.transformToArray ( treeObj.getNodes () );

    // 첫 노드를 찾는다.
    $.each ( nodes, function ( i, node )
    {
        if ( node.isParent == false )
        {
            node.checked = true;
            treeObj.refresh ();

            searchSelectedEqmtInfo ( node );

            return false;
        }
    } );

    // check disabled 처리
    setNoChildTreeNodeChkDisabled ( treeObj, nodes, true );
}


/**
 * 트리 초기화
 */
function initTree2 ( data )
{
    // 트리메뉴
    var setting = {
        view : {
            selectedMulti : false
        },
        edit : {},
        check : {
            enable : true,
            chkStyle : 'radio',
            radioType : 'all'
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        callback : {

            onCheck : function ( e, treeId, treeNode )
            {

                // 선택 된 설비아이디
                if ( treeNode.checked == true )
                {
                    searchSelectedEqmtInfo ( treeNode );
                }

            },
            beforeClick : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
                var selectedNodes = zTree.getSelectedNodes ();
                if ( selectedNodes.length > 0 && selectedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    if ( treeNode.chkDisabled )
                    {
                        return false;
                    } else
                    {
                        zTree.checkNode ( treeNode, true, true );
                        searchSelectedEqmtInfo ( treeNode );
                    }
                }
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList2' ), setting, data );
    var treeObj = $.fn.zTree.getZTreeObj ( "treeList2" );
    var nodes = treeObj.transformToArray ( treeObj.getNodes () );

    //TODO : 아래 경우는 ESS 만 있는 사이트인 경우만 처리. 
    // 첫 노드를 찾는다.
//    $.each ( nodes, function ( i, node )
//    {
//        if ( node.isParent == false )
//        {
//            node.checked = true;
//            treeObj.refresh ();
//
//            searchSelectedEqmtInfo ( node );
//
//            return false;
//        }
//    } );

    // check disabled 처리
    setNoChildTreeNodeChkDisabled ( treeObj, nodes, true );
}

// 자식이 있는 트리 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        if ( nodes[i].level < 2 )
        {
            var children = nodes[i].children;
            if ( (typeof children !== 'undefined' && children.length > 0) || nodes[i].pId == null )
            {
                zTree.setChkDisabled ( nodes[i], disabled );
            }
        }
    }
}

// 트리에서 선택된 설비의 정보
function searchSelectedEqmtInfo ( treeNode )
{
    $ ( '#eqmtId' ).val ( treeNode.id );

    var parentNode = treeNode.getParentNode ();
    if ( parentNode )
    {
        $ ( '#parntsEqmtId' ).val ( parentNode.id );
    }

    // 타이틀
    $ ( '#s_eqmtId1' ).text ( treeNode.name + " " + i18nMessage.msg_observationPoint );
    $ ( '#s_eqmtId2' ).text ( treeNode.name );

    // 계측 항목
    $ ( '#preTagId' ).val ( "" );
    $ ( '#msrins' ).empty ();

    // 계측 항목 조회.
    getMsrins ();

    // 상태 조회
    getStatus ();
}

/**
 * 발전소 설비 목록
 */
function getEqmtList ()
{
    var deferred = $.Deferred ();

    var params = {
        treeType : staticVariable.treeTypeEqmtStatus
    };

    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                initTree ( json.data );

                deferred.resolve ();
            } else
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

    return deferred.promise ();
}


/**
 * 발전소 설비 목록
 */
function getEqmtList2 ()
{
    var deferred = $.Deferred ();

    var params = {
//            eqmtId : paramEqmtId,
            treeType : staticVariable.treeTypeEssEqmtInfo,
            chkDisabled : false
        };
    
    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                initTree2 ( json.data );

                deferred.resolve ();
            } else
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

    return deferred.promise ();
}


/**
 * 차트 그리기.
 */
function getChart ()
{

    var tagId = $ ( 'input[name=radio1]:checked' ).val ();
    // 차트조회
    searchHighcharts ( tagId );

}

// 갱신 HOM_WebService.Properties : realtime.interval.operation.eqmt.val
function valReLoad ()
{
    var $valTime = $ ( '#valTime' );
    setInterval ( function ()
    {
        getMsrins ();
    }, $valTime.val () );
}
// 갱신 HOM_WebService.Properties : realtime.interval.operation.eqmt.alarm
function almReLoad ()
{
    var $almTime = $ ( '#almTime' );
    getStatus ();
    setInterval ( function ()
    {
        getStatus ();
    }, $almTime.val () );
}

// 갱신 HOM_WebService.Properties : realtime.interval.operation.eqmt.chart
function chartReLoad ()
{
    var $chartTime = $ ( '#chartTime' );
    getChart ();
    setInterval ( function ()
    {
        getChart ();
    }, $chartTime.val () );
}

//jqgird customize
function customizeJqgrid ()
{
    var promise = jqGridBasic ();
    promise.done ( function ()
    {
        $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
        getEqmtTreeList ();
        getEqmtTreeList2 ();
        
        valReLoad ();
        almReLoad ();
        chartReLoad ();
        
    } );
}


$ ( function ()
{
//	customizeJqgrid();
	
    customizeScroll ();
    
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();

    var promise = getEqmtList ();
    promise.done ( function ()
    {
        valReLoad ();
        almReLoad ();
        chartReLoad ();
        
        getEqmtList2 ();
    } );
    
} );
