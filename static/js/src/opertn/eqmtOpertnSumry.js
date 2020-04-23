var subPagePvIds = [];

// set sigma edge style
function setEdgyStyle ()
{
    sigma.utils.pkg ( 'sigma.canvas.edges' );
    sigma.canvas.edges.t = function ( edge, source, target, context, settings )
    {
        var color = edge.color, prefix = settings ( 'prefix' ) || '', edgeColor = settings ( 'edgeColor' ), defaultNodeColor = settings ( 'defaultNodeColor' ), defaultEdgeColor = settings ( 'defaultEdgeColor' );

        if ( !color )
        {
            switch ( edgeColor )
            {
                case 'source':
                    color = source.color || defaultNodeColor;
                    break;
                case 'target':
                    color = target.color || defaultNodeColor;
                    break;
                default:
                    color = defaultEdgeColor;
                    break;
            }
        }

        context.strokeStyle = color;
        context.lineWidth = edge[prefix + 'size'] || 1;
        context.beginPath ();
        context.moveTo ( source[prefix + 'x'], source[prefix + 'y'] );
        context
                .lineTo ( source[prefix + 'x'] + (target[prefix + 'x'] - source[prefix + 'x']) / 2,
                        source[prefix + 'y'] );
        context
                .lineTo ( source[prefix + 'x'] + (target[prefix + 'x'] - source[prefix + 'x']) / 2,
                        target[prefix + 'y'] );
        context.lineTo ( target[prefix + 'x'], target[prefix + 'y'] );
        context.stroke ();
    };
}

function generateEdge ( nodeEdgeData, g )
{
    var length = nodeEdgeData.length;
    for ( i = 0; i < length; i++ )
    {
        g.edges.push ( {
            id : 'e' + i, // edge ID
            source : nodeEdgeData[i].source, // edge 출발 node ID
            target : nodeEdgeData[i].target, // edge 타겟 node ID
            size : 10, // edge size
            type : 't',
            color : '#8f8f92' // edge 색
        } );
    }
    return g;
}

function getTagValueDiv ( nodeValDataArray )
{
    var dataTbl = '';
    $.each ( nodeValDataArray, function ( tagId, tagValue )
    {
        if ( tagId != 'paramtrAlarm' )
        {
            dataTbl += '<div class="column"><div class="cell" id="' + tagId + '">' + tagValue + '</div></div>';
        }
    } );

    return dataTbl;
}

function getAlarmSpan ( index, nodeValData, nodeLocationData, selecteAlarm, nodeId, paramtrAlarm )
{
    var dataTbl = null;

    if ( index === 0 )
    {
        dataTbl = '<strong class=' + selecteAlarm + '> Grid </strong>';
    } else
    {
        dataTbl = '<strong class="';
        if ( Object.keys ( nodeValData ).length > 1 )
        {
            dataTbl += selecteAlarm + '">';
            dataTbl += '<i id="' + nodeId + 'Alarm" class=' + paramtrAlarm + '></i>';
        } else
        {
            dataTbl += 't_gy">';
        }

        if ( pvId === 'AA002'
                && (nodeLocationData.lable === 'VCB#3' || nodeLocationData.lable === 'VCB#6' || nodeLocationData.lable === 'VCB#7') )
        {
            dataTbl += '<a id="' + nodeId + '" class="label_tag" href="javascript:;" >' + nodeLocationData.lable
                    + '</a></strong>';
        } else if ( (subPagePvIds.indexOf ( pvId ) > -1) && (nodeLocationData.hasChild === 'N') )
        {
            dataTbl += '<a id="' + nodeId + '" class="label_tag" href="javascript:;" >' + nodeLocationData.lable
                    + '</a></strong>';
        } else
        {
            dataTbl += nodeLocationData.lable + '</strong>';
        }
    }

    return dataTbl;
}

// 설비정보
function xyLCLoad ( data )
{

    // topology

    var mapdata = null;
    mapdata = data;

    var draggableFlag = null;
    var dragListener = null;
    var shapableFlag = null;
    var cameraFlag = false;
    var updateFlag = false;
    var updateIntervalFlag = false;
    var intervalId = null;
    var showAllTablesFlag = false;

    // 좌표
    var nodeLocationData = mapdata.listXyLc;
    // id , 이름 , 이미지
    var nodeLocationData1 = mapdata.listXyLcName;
    // 관계
    var nodeEdgeData = mapdata.listXyEdge;
    // 설비 값
    var nodeValData = mapdata.listXyVal;

    var ups = mapdata.upsMap;
    var fir = mapdata.firMap;

    var $upsAlarm = $ ( "#upsAlarm" );
    var $fireAlarm = $ ( "#fireAlarm" );

    $.each ( nodeValData, function ( i, node )
    {
        $ ( '#node' + i ).empty ();
    } );

    if ( ups.ups == homConstants.checkY )
    {
        $upsAlarm.show ();
        $upsAlarm.html ( '<i id="' + ups.upsEqmtId + 'Alarm" class=' + ups.upsAlarm + '></i>' + i18nMessage.msg_ups );

    } else
    {
        $upsAlarm.hide ();
    }

    if ( fir.fir == homConstants.checkY )
    {
        $fireAlarm.show ();
        $fireAlarm.html ( '<i id="' + fir.firEqmtId + 'Alarm" class=' + fir.firAlarm + '></i>' + i18nMessage.msg_fire );
    } else
    {
        $fireAlarm.hide ();
    }

    var i, s, g = {
        nodes : [],
        edges : []
    };
    var urls = [ contextPath + '/img/common/icon_op01.png', contextPath + '/img/common/icon_op02.png',
            contextPath + '/img/common/icon_op03.png', contextPath + '/img/common/icon_op04.png',
            contextPath + '/img/common/icon_op05.png', contextPath + '/img/common/icon_op06.png' ];
    var colors = [ '#617db4', '#668f3c', '#c6583e', '#b956af' ];
    var count = 0;

    // Generate a random graph:
    var countEnter = 0;// 접속반 카운트
    for ( i = 0, size = nodeLocationData.size (); i < size; i++ )
    {
        if ( typeof nodeLocationData1[i] !== 'undefined' )
        {
            var id = nodeLocationData1[i].id;
            var labelText = '';
            var imgUrlPosition = 0;

            imgUrlPosition = nodeLocationData1[i].imgUrlPosition;
            labelText = nodeLocationData1[i].lable;
            if ( nodeLocationData.containsKey ( id ) )
            {
                g.nodes.push ( {
                    id : id, // node ID
                    // label : labelText, // node Label
                    type : 'equilateral',
                    data : 'test_data' + i,
                    image : {
                        url : urls[imgUrlPosition], // image url
                        scale : 1,
                        clip : 1,
                        w : 50,
                        h : 50
                    },
                    x : nodeLocationData.get ( id ).x, // node x 좌표
                    y : nodeLocationData.get ( id ).y, // node y 좌표

                    size : 20, // node 크기
                    color : 'transparent'
                } );
            }
        }
    } // for

    g = generateEdge ( nodeEdgeData, g );

    $ ( '#sigma_container' ).css ( "height", data.height );

    // sigma 생성
    s = new sigma ( {
        graph : g, // node와 edge를 정의한 graph
        renderer : {
            container : document.getElementById ( 'sigma_container' ),
            type : 'canvas'
        },
        settings : {
            minNodeSize : 10,
            maxNodeSize : 30,
            mouseWheelEnabled : cameraFlag,
            doubleClickEnabled : false,
            enableCamera : false
        }
    } );

    CustomShapes.init ( s );
    s.refresh ();

    $.each ( s.graph.nodes (), function ( i, node )
    {
        var $sigmaContainer = $ ( '#sigma_container' );
        var left = node['renderer1:x'];
        var top = node['renderer1:y'];
        var width = null;
        var hasDataTbl = false;
        var paramtrAlarm = nodeValData[i].paramtrAlarm;

        var leftPx = -25;
        var topPx = 25;

        var selecteAlarm = "selected";
        var idSub = node['id'].substring ( 0, 3 );
        if ( i == 0 )
        {
            hasDataTbl = true;
        } else if ( idSub == "VCB" )
        {
            hasDataTbl = true;
            leftPx = -50;
        } else if ( idSub == "TRN" )
        {
            hasDataTbl = true;
            leftPx = -40;
        } else if ( idSub == "ACB" )
        {
            hasDataTbl = true;
            leftPx = -50;
        } else if ( idSub == "IVT" )
        {
            hasDataTbl = true;
            leftPx = -50;
            width = 'width:133px';
        } else if ( idSub == "JUN" )
        {
            hasDataTbl = true;
            leftPx = 25;
            topPx = -20;
            width = 'width:125px;';
        }

        if ( hasDataTbl )
        {
            var dataTbl = getAlarmSpan ( i, nodeValData[i], nodeLocationData1[i], selecteAlarm, node['id'],
                    paramtrAlarm );
            if ( i != 0 )
            {
                dataTbl += '<div class="data_tbl">'
                dataTbl += getTagValueDiv ( nodeValData[i] );
                dataTbl += '</div>';
            }

            $sigmaContainer.append ( '<div class="data_tbl_wrap" id="node' + i + '" style="top:' + (top + topPx)
                    + 'px;left:' + (left + leftPx) + 'px;position:absolute;' + (width != null ? width : '')
                    + '"></div>' );
            $ ( '#node' + i ).append ( dataTbl );
        }
    } );

}

// x y 위치
function setXyLC ()
{
    $.ajax ( {
        url : contextPath + '/hom/operation/summary/setXyLC.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var $sigmaContainer = $ ( '#sigma_container' );
                var data = json.data;

                if ( subPagePvIds.indexOf ( pvId ) > -1 )
                {
                    setVCBInfo ( data.eqmtParntsEqmtIdMap, data.listXyLcName );
                }

                var hasJunFlag = hasJun ( data.listXyLcName );
                data.listXyEdge = setEdge ( data.eqmtParntsEqmtIdMap );
                data.listXyLc = setLocation ( data.listXyLcName, hasJunFlag );
                data.height = data.listXyLc.get ( 'height' );

                var marginTxt = getMarginTxt ( hasJunFlag, data );
                if ( marginTxt !== null )
                {
                    $sigmaContainer.css ( 'margin', marginTxt );
                }

                xyLCLoad ( json.data );
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
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
    } );
}

// margin text 반환
// TODO 계산하는것으로 변경 필요..
function getMarginTxt ( hasJunFlag, data )
{
    var marginTxt = null;

    // 데이터를 다보여주기위해 임의 지정
    if ( pvId === 'AE006' )
    {
        marginTxt = '-231px 100px -35px 165px';
    } else if ( pvId === 'AE002' || pvId === 'AE003' )
    {
        marginTxt = '-230px 100px -6px 165px';
    } else if ( pvId === 'AI022' )
    {
        marginTxt = '20px 0px 220px 165px';
    } else if ( pvId === 'AI021' )
    {
        marginTxt = '30px 100px 230px 165px';
    } else if ( !hasJunFlag )
    {
        var ivtCount = data.listXyLc.get ( 'ivtCount' );
        marginTxt = '30px 100px 225px 165px';
        if ( ivtCount == 3 )
        {
            marginTxt = '-110px 100px 135px 165px';
        } else if ( ivtCount == 2 )
        {
            marginTxt = '-250px 100px -10px 165px';
        } else if ( ivtCount == 1 )
        {
            marginTxt = '-400px 100px 0px 165px';
        }
    } else
    {
        var junCount = data.listXyLc.get ( 'junCount' );

        if ( junCount == 12 )
        {
            marginTxt = '-40px 160px -20px 165px';
        } else if ( junCount == 10 )
        {
            marginTxt = '-40px 140px -20px 165px';
        } else if ( junCount == 9 || junCount == 8 )
        {
            marginTxt = '-100px 150px -100px 165px';
        } else if ( junCount == 6 )
        {
            marginTxt = '-170px 170px -140px 165px';
        } else if ( junCount == 5 )
        {
            marginTxt = '-185px 150px -175px 165px';
        }
    }

    return marginTxt;
}

// jun 존재 여부
function hasJun ( nodeNameData )
{
    var flag = false;

    $.each ( nodeNameData, function ( i, node )
    {
        if ( node.id.substring ( 0, 3 ) === 'JUN' )
        {
            flag = true;

            return false;
        }
    } );

    return flag;
}

// vcb#2,vcb#3 존재 여부
function hasVcbMoreThanOne ( nodeNameData )
{
    var count = 0;
    $.each ( nodeNameData, function ( i, node )
    {
        if ( node.id.substring ( 0, 3 ) === 'VCB' )
        {
            count++;
        }
    } );

    if ( count > 1 )
    {
        return true;
    } else
    {
        return false;
    }
}

// location 임의 셋팅
function setLocation ( nodeNameData, hasJunFlag )
{
    var nodeLocationDataMap = new Map ();
    var xIntvl = 140;
    var yIntvl = 80;
    var vcbCount = 0;
    var trnCount = 0;
    var acbCount = 0;
    var ivtCount = 0;
    var junCount = 0;
    var countOfJun = 2; // jun 갯수

    if ( pvId === 'AE006' )
    {
        yIntvl = 90;
        $.each ( nodeNameData, function ( i, node )
        {
            var x = 0;
            var y = 0;
            switch ( node.id.substring ( 0, 3 ) )
            {
                case 'WHM':
                    break;
                case 'VCB':
                    // VCB1
                    if ( vcbCount === 0 )
                    {
                        x = xIntvl;
                    }
                    // VCB2,3,4
                    else if ( node.id === 'VCB0002' )
                    {
                        x = xIntvl * 2;
                    } else if ( node.id === 'VCB0003' )
                    {
                        x = xIntvl * 3;
                    } else if ( node.id === 'VCB0004' )
                    {
                        x = xIntvl * 2;
                        y = yIntvl * countOfJun * 2;
                    }
                    vcbCount++;
                    break;
                case 'TRN':
                    x = xIntvl * 4;
                    y = yIntvl * trnCount * countOfJun * 2;
                    trnCount++;
                    break;
                case 'ACB':
                    x = xIntvl * 5;
                    y = yIntvl * acbCount * countOfJun;
                    acbCount++;
                    break;
                case 'IVT':
                    x = xIntvl * 6;
                    y = yIntvl * ivtCount * countOfJun;
                    ivtCount++;
                    break;
            }

            nodeLocationDataMap.put ( node.id, {
                x : x,
                y : y
            } );
        } );
    } else if ( pvId === 'AE002' || pvId === 'AE003' )
    {
        $.each ( nodeNameData, function ( i, node )
        {
            var x = 0;
            var y = 0;
            switch ( node.id.substring ( 0, 3 ) )
            {
                case 'WHM':
                    break;
                case 'VCB':
                    // VCB1
                    if ( vcbCount === 0 )
                    {
                        x = xIntvl;
                    }
                    // VCB2,3,4
                    else
                    {
                        x = xIntvl * 2;
                        y = yIntvl * (vcbCount - 1) * countOfJun;
                    }
                    vcbCount++;
                    break;
                case 'TRN':
                    x = xIntvl * 3;
                    y = yIntvl * trnCount * countOfJun;
                    trnCount++;
                    break;
                case 'ACB':
                    x = xIntvl * 4;
                    y = yIntvl * acbCount * countOfJun;
                    acbCount++;
                    break;
                case 'IVT':
                    x = xIntvl * 5;
                    y = yIntvl * ivtCount * countOfJun;
                    ivtCount++;
                    break;
                case 'JUN':
                    x = xIntvl * 6;
                    y = yIntvl * junCount;
                    junCount++;
            }

            nodeLocationDataMap.put ( node.id, {
                x : x,
                y : y
            } );
        } );
    } else if ( pvId === 'AI022' || pvId === 'AI021' )
    {
        $.each ( nodeNameData, function ( i, node )
        {
            var x = 0;
            var y = 0;
            switch ( node.id.substring ( 0, 3 ) )
            {
                case 'WHM':
                    break;
                case 'VCB':
                    x = xIntvl;
                    vcbCount++;
                    break;
                case 'TRN':
                    x = xIntvl * 2;
                    y = yIntvl * trnCount * countOfJun * (pvId === 'AI022' ? 18 : 16);
                    trnCount++;
                    break;
                case 'ACB':
                    x = xIntvl * 3;
                    var inverter = 6;
                    var plus = 0;
                    if ( pvId === 'AI021' && acbCount > 1 )
                    {
                        inverter = 5;
                        plus = 1;
                    }

                    y = yIntvl * acbCount * countOfJun * inverter + yIntvl * countOfJun * plus;
                    acbCount++;
                    break;
                case 'IVT':
                    x = xIntvl * 4;
                    y = yIntvl * ivtCount * countOfJun;
                    ivtCount++;
                    break;
                case 'JUN':
                    junCount++;
            }

            nodeLocationDataMap.put ( node.id, {
                x : x,
                y : y
            } );
        } );
    } else if ( pvId === 'AE001' || pvId === 'AI025' || pvId === 'AI026' )
    {
        $.each ( nodeNameData, function ( i, node )
        {
            var x = 0;
            var y = 0;
            switch ( node.id.substring ( 0, 3 ) )
            {
                case 'VCB':
                    x = xIntvl;
                    vcbCount++;
                    break;
                case 'TRN':
                    x = xIntvl * 2.5;
                    y = yIntvl * trnCount * countOfJun * 3;
                    trnCount++;
                    break;
                case 'ACB':
                    x = xIntvl * 4.5;
                    var inverter = 1;
                    if ( pvId === 'AI025' || pvId === 'AI026' )
                    {
                        inverter = 2;
                    }
                    y = yIntvl * acbCount * countOfJun * 1.5 * inverter;
                    acbCount++;
                    break;
                case 'IVT':
                    x = xIntvl * 6;
                    y = yIntvl * ivtCount * countOfJun * 1.5;
                    ivtCount++;
                    break;
            }

            nodeLocationDataMap.put ( node.id, {
                x : x,
                y : y
            } );
        } );
    } else if ( subPagePvIds.indexOf ( pvId ) > -1 )
    {
        if ( pvId === 'AA002' )
        {
            // 새만금 햇빛누리 하드코딩
            $.each ( nodeNameData, function ( i, node )
            {
                var x = 0;
                var y = 0;
                switch ( node.id.substring ( 0, 3 ) )
                {
                    case 'WHM':
                        nodeLocationDataMap.put ( node.id, {
                            x : x,
                            y : y
                        } );
                        break;
                    case 'VCB':
                        // VCB1
                        if ( vcbCount === 0 )
                        {
                            x = xIntvl;
                        } else if ( node.id === 'VCB0002' )
                        {
                            x = xIntvl * 2;
                        } else if ( node.id === 'VCB0003' )
                        {
                            x = xIntvl * 3.5;
                        } else if ( node.id === 'VCB0004' )
                        {
                            x = xIntvl * 3.5;
                            y = yIntvl * countOfJun * 1.5;
                        } else if ( node.id === 'VCB0005' )
                        {
                            x = xIntvl * 3.5;
                            y = yIntvl * countOfJun * 3;
                        } else if ( node.id === 'VCB0006' )
                        {
                            x = xIntvl * 4.5;
                            y = yIntvl * countOfJun * 1.5;
                        } else if ( node.id === 'VCB0007' )
                        {
                            x = xIntvl * 4.5;
                            y = yIntvl * countOfJun * 3;
                        }

                        vcbCount++;
                        nodeLocationDataMap.put ( node.id, {
                            x : x,
                            y : y
                        } );
                        break;
                }
            } );
        } else
        {
            // 영월 에너지 제 1,2,3 공구
            var tempLevel = 0;
            var cnt = 1;

            $.each ( nodeNameData, function ( i, node )
            {
                var x = 0;
                var y = 0;
                const
                LAST_VCB_MAX_CNT = 2;
                const
                MAX_VCB_LEVEL = 4;
                var interval = LAST_VCB_MAX_CNT;
                switch ( node.id.substring ( 0, 3 ) )
                {
                    case 'WHM':
                        nodeLocationDataMap.put ( node.id, {
                            x : x,
                            y : y
                        } );
                        break;
                    case 'VCB':

                        if ( typeof node.level !== 'undefined' && typeof node.order !== 'undefined' )
                        {
                            var l = node.level;

                            x = xIntvl * (l + 1);

                            if ( node.level == MAX_VCB_LEVEL )
                            {
                                if ( pvId === 'AE024' )
                                {
                                    node.order += 2;
                                }
                                interval = interval / LAST_VCB_MAX_CNT;
                            }

                            if ( node.order > 0 )
                            {
                                y = yIntvl * interval * node.order * 2;
                            }
                        }
                        nodeLocationDataMap.put ( node.id, {
                            x : x,
                            y : y
                        } );
                        break;
                }
            } );
        }
    } else
    {
        if ( hasJunFlag )
        {
            var tmpIvtCount = 0;
            var tmpJunCount = 0;
            $.each ( nodeNameData, function ( i, node )
            {
                switch ( node.id.substring ( 0, 3 ) )
                {
                    case 'IVT':
                        tmpIvtCount++;
                        break;
                    case 'JUN':
                        tmpJunCount++;
                        break;
                    default:
                }
            } );
            countOfJun = tmpJunCount / tmpIvtCount;
        }

        var hasVcb23 = hasVcbMoreThanOne ( nodeNameData );
        $.each ( nodeNameData, function ( i, node )
        {
            var x = 0;
            var y = 0;
            switch ( node.id.substring ( 0, 3 ) )
            {
                case 'WHM':
                    break;
                case 'VCB':
                    // VCB1
                    if ( vcbCount === 0 )
                    {
                        x = xIntvl;
                    }
                    // VCB2,3
                    else
                    {
                        x = xIntvl * 2;
                        y = yIntvl * (vcbCount - 1) * countOfJun * 2;
                    }
                    vcbCount++;
                    break;
                case 'TRN':
                    if ( hasVcb23 )
                    {
                        x = xIntvl * 3;
                    } else
                    {
                        x = xIntvl * 2;
                    }
                    y = yIntvl * trnCount * countOfJun * 2;
                    trnCount++;
                    break;
                case 'ACB':
                    if ( hasVcb23 )
                    {
                        x = xIntvl * 4;
                    } else
                    {
                        x = xIntvl * 3;
                    }
                    y = yIntvl * acbCount * countOfJun;
                    acbCount++;
                    break;
                case 'IVT':
                    if ( hasVcb23 )
                    {
                        x = xIntvl * 5;
                    } else
                    {
                        x = xIntvl * 4;
                    }
                    y = yIntvl * ivtCount * countOfJun;
                    ivtCount++;
                    break;
                case 'JUN':
                    if ( hasVcb23 )
                    {
                        x = xIntvl * 6;
                    } else
                    {
                        x = xIntvl * 5;
                    }
                    y = yIntvl * junCount;
                    junCount++;
            }

            nodeLocationDataMap.put ( node.id, {
                x : x,
                y : y
            } );
        } );
    }

    if ( pvId == 'AI022' )
    {
        nodeLocationDataMap.put ( 'height', ((ivtCount - 1) * yIntvl) + 7700 );
    } else if ( pvId == 'AI021' )
    {
        nodeLocationDataMap.put ( 'height', ((ivtCount - 1) * yIntvl) + 6000 );
    } else if ( pvId == 'AE001' || pvId == 'AA004' )
    {
        nodeLocationDataMap.put ( 'height', ((ivtCount - 1) * yIntvl) + 2000 );
    } else if ( pvId == 'AA003' )
    {
        nodeLocationDataMap.put ( 'height', ((ivtCount - 1) * yIntvl) + 3500 );
    } else if ( pvId == 'AE024' || pvId == 'AM020' || pvId == 'AM022' )
    {
        nodeLocationDataMap.put ( 'height', ((ivtCount - 1) * yIntvl) + 1500 );
    } else if ( !hasJunFlag )
    {
        nodeLocationDataMap.put ( 'height', ((ivtCount - 1) * yIntvl) + 1000 );
    } else
    {
        nodeLocationDataMap.put ( 'height', ((junCount - 1) * yIntvl) + 850 );
    }

    nodeLocationDataMap.put ( 'ivtCount', ivtCount );
    nodeLocationDataMap.put ( 'junCount', junCount );

    return nodeLocationDataMap;
}

// 임의의 Edge 설정
function setEdge ( nodeValData )
{
    var nodeEdgeData = [];
    $.each ( nodeValData, function ( tagId, tagValue )
    {
        if ( tagId !== null && tagId !== '' && tagId !== 'paramtrAlarm' )
        {
            nodeEdgeData.push ( {
                source : tagValue,
                target : tagId.toString ()
            } );
        }
    } );

    return nodeEdgeData;
}

// 계측 값 및 알람 값 요청
function getTagValue ()
{
    $.ajax ( {
        url : contextPath + '/hom/operation/summary/getTagValue.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $.each ( json.data, function ( tagId, tagValue )
                {
                    if ( tagId == "eqmtAlarmMap" )
                    {
                        $.each ( tagValue, function ( eqmtId, alarmValue )
                        {
                            $ ( "#" + eqmtId + "Alarm" ).removeClass ();
                            $ ( "#" + eqmtId + "Alarm" ).addClass ( alarmValue );

                        } );
                    } else
                    {
                        $ ( "#" + tagId ).html ( tagValue );
                    }

                } );
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
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
    } );
}
// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.ops_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// 갱신 HOM_WebService.Properties : eqmt.init.time
function XyReLoad ()
{
    var t = setTimeout ( function ()
    {
        XyReLoad ()
    }, $ ( '#eqmtTime' ).val () ); /* 갱신(refresh)5000 */
    setXyLC ();

}

function getWTSData ()
{
    var $wtsWrap = $ ( ".weather_station_wrap" );

    var tpl = getTemplate ( templates.weatherStationDiv );
    $.ajax ( {
        url : contextPath + '/hom/operation/summary/getWTSData.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var num = 0;
                $.each ( json.data, function ( i, wtsTagInfo )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            eqmtNm : i,
                            wtsTagInfoVoList : wtsTagInfo
                        } );

                        if ( num == 0 )
                        {
                            $wtsWrap.empty ().html ( html )
                        } else
                        {
                            $wtsWrap.append ( html )
                        }

                    }
                    num++;
                } );
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
}

/**
 * sub 페이지로 이동
 */
function setMoveSubPageEvent ()
{
    $ ( document ).on ( 'click', '.label_tag', function ()
    {
        var url = contextPath + '/hom/operation/summary/summrySubPage.do?eqmtId=';
        var id = $ ( this ).attr ( 'id' );

        location.href = url + id;
    } );
}

/**
 * 화면에 VCB만을 표현하기 위한 정보 셋팅
 */
function setVCBInfo ( eqmtParntsEqmtIdMap, listXyLcName )
{
    /** <eqmtId, <key,value>> */
    var levelMap = new Map ();

    /** 자식 설비가 있는지 확인 */
    var valueHasChildMap = [];

    var tempLevel = 0;
    var tempParntsId = '';
    var order = 0;

    _.map ( eqmtParntsEqmtIdMap, function ( parntsEqmtId, eqmtId )
    {
        // VCB0001
        if ( parntsEqmtId.indexOf ( 'WHM' ) > -1 )
        {

            /** <level,값>,<level 중 order ,값 > */
            var tempMap = new Map ();

            tempMap.put ( 'level', 0 );
            tempMap.put ( 'order', 0 );

            levelMap.put ( eqmtId, tempMap );
        } else
        {
            if ( levelMap.containsKey ( parntsEqmtId ) )
            {
                var parntLevel = levelMap.get ( parntsEqmtId ).get ( 'level' );

                var level = (parntLevel + 1);

                if ( tempLevel == level )
                {
                    order += 1;
                } else
                {
                    order = 0;
                }

                /** <level,값>,<level 중 order ,값 > */
                var tempMap = new Map ();
                tempMap.put ( 'level', level );
                tempMap.put ( 'order', order );

                levelMap.put ( eqmtId, tempMap );

                tempLevel = level;
            }
        }

        valueHasChildMap.push ( parntsEqmtId );
    } );

    valueHasChildMap = _.uniq ( valueHasChildMap );

    _.each ( listXyLcName, function ( value, index )
    {

        value.hasChild = 'N';

        if ( valueHasChildMap.indexOf ( value.id ) > -1 )
        {
            value.hasChild = 'Y';
        }

        if ( value.id.indexOf ( 'VCB' ) > -1 )
        {
            value.level = levelMap.get ( value.id ).get ( 'level' );
            value.order = levelMap.get ( value.id ).get ( 'order' );
        }
    } );
}

$ ( function ()
{
    customizeScroll ();
    setEdgyStyle ();

    setXyLC ();
    getWTSData ();

    var t = setInterval ( function ()
    {
        getTagValue ();
        getWTSData ();
    }, $ ( '#eqmtTime' ).val () ); /* 갱신(refresh)5000 */

    // 설비 개수가 많아 VCB를제외한 나머지 설비는 sub 페이지로 이동해서 표시
    var pvIds = $ ( '#separateSumryPvIds' ).val ();
    subPagePvIds = pvIds.split ( ',' );

    if ( subPagePvIds.indexOf ( pvId ) > -1 )
    {
        setMoveSubPageEvent ();
    }
} );