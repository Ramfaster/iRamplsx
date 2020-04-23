/**
 * 키츠키 발전소 (아이디 미발번)
 */
var specificPvInfo = null;

// set sigma edge style - 세로방향
function setEdgyStylePv ()
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
                .lineTo ( source[prefix + 'x'], source[prefix + 'y'] + (target[prefix + 'y'] - source[prefix + 'y'])
                        / 2 );
        context
                .lineTo ( target[prefix + 'x'], source[prefix + 'y'] + (target[prefix + 'y'] - source[prefix + 'y'])
                        / 2 );
        context.lineTo ( target[prefix + 'x'], target[prefix + 'y'] );
        context.stroke ();
    };
}

// topology 초기화
function pvInitTopology ()
{
    var data = getPvNodeAndEdge ();

    // 시그마 초기화
    var sigmaObj = new sigma ( {
        graph : data,
        renderer : {
            container : document.getElementById ( 'sigma_container_pv' ),
            type : 'canvas'
        },
        settings : {
            minNodeSize : 10,
            maxNodeSize : 30,
            mouseWheelEnabled : false,
            doubleClickEnabled : false,
            enableCamera : false,
            sideMargin : 6,
            labelHoverShadowColor : 'transparent',
            defaultLabelSize : 0,
            defaultLabelColor : 'transparent',
            labelHoverBGColor : 'node',
            drawLabels : false
        }
    } );

    CustomShapes.init ( sigmaObj );
    sigmaObj.refresh ();

    // text 정의
    setPvNodeText ( sigmaObj );
}

// Node와 edge 반환
function getPvNodeAndEdge ()
{
    var data = {
        nodes : [],
        edges : null
    };

    // topology data 생성
    var topologyData = getPvTopologyData ();
    // 노드 삽입
    $.each ( topologyData, function ( i, loc )
    {
        var node = {
            id : loc.id,
            label : (typeof loc.label != 'undefined') ? loc.label : loc.id,
            type : 'equilateral',
            data : loc.id,
            x : loc.x,
            y : loc.y,
            size : 20,
            color : 'transparent'
        };

        // 안보이는 노드ZZ
        if ( loc.id.indexOf ( 'INVSB' ) == -1 )
        {
            node.image = {
                url : specificPvInfo.url[loc.urlIndex], // image url
                scale : 1,
                clip : 1,
                w : 50,
                h : 50
            };
        }

        // 이미지를 작게 해야하는 노드
        if ( loc.id.indexOf ( 'SWTCH' ) >= 0 && loc.id.indexOf ( 'HGHSWTCH' ) == -1 )
        {
            // console.log ( node );
            node.size = 10;
        }

        data.nodes.push ( node );
    } );

    // edge 생성
    data.edges = getPvEdgeData ( topologyData );

    // TODO 높이 조절
    $ ( '#sigma_container_pv' ).css ( 'height', specificPvInfo.height + 'px' );

    return data;
}

// topologyData 생성
function getPvTopologyData ()
{
    var xInterval = specificPvInfo.interval.x;
    var yInterval = specificPvInfo.interval.y;

    // TODO 프로퍼티로 빼기
    var topologyData = [ {
        id : 'root',
        sourceId : 'root',
        label : '특고 연계 변전소',
        x : xInterval * 2,
        y : 0,
    }, {
        id : 'INVSB3',
        sourceId : 'root',
        x : xInterval * 2,
        y : yInterval * 0.7,
    }, {
        id : 'VD',
        sourceId : 'INVSB3',
        x : xInterval * 2.2,
        y : yInterval * 0.7,
        urlIndex : 14
    }, {
        id : 'INVSB4',
        sourceId : 'root',
        x : xInterval * 2,
        y : yInterval * 0.8,
    }, {
        id : 'GDR1',
        sourceId : 'INVSB4',
        x : xInterval * 1,
        y : yInterval * 1.5,
        urlIndex : 10
    }, {
        id : 'INVSB5',
        sourceId : 'root',
        x : xInterval * 2,
        y : yInterval * 2,
    }, {
        id : 'GDR2',
        sourceId : 'INVSB5',
        x : xInterval * 3,
        y : yInterval * 2,
        urlIndex : 0
    }, {
        id : 'VCBP1',
        sourceId : 'root',
        x : xInterval * 2,
        y : yInterval * 3,
        urlIndex : 8
    }, {
        id : 'VCBF1',
        sourceId : 'VCBP1',
        x : xInterval * 0.8,
        y : yInterval * 5,
        urlIndex : 8
    }, {
        id : 'SS1',
        sourceId : 'VCBF1',
        label : 'SS-1 변전소',
        x : xInterval * 0.8,
        y : yInterval * 7,
    }, {
        id : 'VCBF2',
        sourceId : 'VCBP1',
        x : xInterval * 1.6,
        y : yInterval * 5,
        urlIndex : 8
    }, {
        id : 'SS2',
        sourceId : 'VCBF2',
        label : 'SS-2 변전소',
        x : xInterval * 1.6,
        y : yInterval * 7,
    }, {
        id : 'VCBF3',
        sourceId : 'VCBP1',
        x : xInterval * 2.4,
        y : yInterval * 5,
        urlIndex : 8
    }, {
        id : 'SS3',
        sourceId : 'VCBF3',
        label : 'SS-3 변전소',
        x : xInterval * 2.4,
        y : yInterval * 7,
    }, {
        id : 'VCBF4',
        sourceId : 'VCBP1',
        x : xInterval * 3.2,
        y : yInterval * 5,
        urlIndex : 8
    }, {
        id : 'SS4',
        sourceId : 'VCBF4',
        label : 'SS-4 변전소',
        x : xInterval * 3.2,
        y : yInterval * 7,
    }, {
        id : 'LBS',
        sourceId : 'VCBP1',
        x : xInterval * 4.3,
        y : yInterval * 5,
        urlIndex : 9
    }, {
        id : 'TR',
        sourceId : 'LBS',
        x : xInterval * 4.3,
        y : yInterval * 5.5,
        urlIndex : 11
    }, {
        id : 'INVSB1',
        sourceId : 'TR',
        x : xInterval * 4,
        y : yInterval * 6,
    }, {
        id : 'SWTCH01',
        sourceId : 'INVSB1',
        x : xInterval * 3.4,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'SWTCH02',
        sourceId : 'INVSB1',
        x : xInterval * 3.6,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'SWTCH03',
        sourceId : 'INVSB1',
        x : xInterval * 3.8,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'SWTCH04',
        sourceId : 'INVSB1',
        x : xInterval * 4,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'SWTCH05',
        sourceId : 'INVSB1',
        x : xInterval * 4.2,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'INVSB2',
        sourceId : 'TR',
        x : xInterval * 4.6,
        y : yInterval * 6,
    }, {
        id : 'SWTCH06',
        sourceId : 'INVSB2',
        x : xInterval * 4.4,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'SWTCH07',
        sourceId : 'INVSB2',
        x : xInterval * 4.6,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'SWTCH08',
        sourceId : 'INVSB2',
        x : xInterval * 4.8,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'SWTCH09',
        sourceId : 'INVSB2',
        x : xInterval * 5,
        y : yInterval * 6.5,
        urlIndex : 17
    }, {
        id : 'SWTCH10',
        sourceId : 'INVSB2',
        x : xInterval * 5.2,
        y : yInterval * 6.5,
        urlIndex : 17
    } ];

    return topologyData;
}

// edge data 생성
function getPvEdgeData ( topologyData )
{
    var edges = null;
    if ( topologyData !== null && topologyData.length > 0 )
    {
        edges = [];
        _.each ( topologyData, function ( data, i )
        {
            if ( data.id !== 'root' )
            {
                edges.push ( {
                    id : 'e' + i,
                    source : data.sourceId,
                    target : data.id,
                    size : 10,
                    type : 't',
                    color : '#ccc'
                } );
            }
        } );
    }

    return edges;
}

/**
 * node text 정의
 * 
 * @param sigmaObj
 */
function setPvNodeText ( sigmaObj )
{
    var $sigmaContainer = $ ( '#sigma_container_pv' );
    var position = $sigmaContainer.position ();

    _.each ( sigmaObj.graph.nodes (), function ( node )
    {

        if ( node.data.indexOf ( 'root' ) > -1 || node.data.indexOf ( 'SS' ) > -1 )
        {
            var top = node['renderer1:y'];
            var left = left = node['renderer1:x'] - 57;

            $sigmaContainer.append ( '<a class="text_box" data-id="' + node.id
                    + '" href="javascript:;" style="position:absolute; top:' + top + 'px;left:' + left + 'px;">'
                    + node.label + '</a>' );
        }

        if ( node.data.indexOf ( 'ES' ) > -1 || node.data.indexOf ( 'DS' ) > -1 || node.data.indexOf ( 'TR' ) > -1
                || node.data.indexOf ( 'VCB' ) > -1 || node.data.indexOf ( 'LBS' ) > -1 )
        {
            var top = node['renderer1:y'] - 10;
            var left = node['renderer1:x'] + 20;

            $sigmaContainer.append ( '<strong class="selected" data-id="' + node.id
                    + '" href="javascript:;" style="position:absolute; top:' + top + 'px;left:' + left + 'px;">'
                    + node.id + '</strong>' );
        }

    } );
}

/**
 * a 태그 클릭 시 이동 좌표
 */
function movePage ()
{
    $ ( '.text_box' ).on ( 'click', function ()
    {
        var key = $ ( this ).data ( 'id' );

        if ( key == 'root' ) // 메인 화면
        {
            location.href = contextPath + '/hom/operation/summary/summary.do';
        } else
        {
            location.href = contextPath + '/hom/operation/summary/summarySs.do?key=' + key;
        }
    } );
}

/**
 * 기상반 정보 조회
 */
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

                        console.log ( 'wtsTagInfo', wtsTagInfo );
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

$ ( function ()
{
    getWTSData ();
    var t = setInterval ( function ()
    {
        getWTSData ();
    }, $ ( '#eqmtTime' ).val () ); /* 갱신(refresh)5000 */

    // TODO 키츠키 발전소 아이디일 경우
    if ( pvId === '' )
    {
        specificPvInfo = {
            // 템플릿 정의
            templates : {
                noData : getTemplate ( templates.noData )
            },
            height : 680, // 스크롤이 안생기는 최대값
            // 토폴로지 노드의 interval 좌표, sigma container의 좌표당 interval 높이
            interval : {
                x : 70,
                y : 20,
                height : 12
            },
            url : [ contextPath + '/img/common/icon_op07.png', contextPath + '/img/common/icon_op08.png',
                    contextPath + '/img/common/icon_op09.png', contextPath + '/img/common/icon_op10.png',
                    contextPath + '/img/common/icon_op11.png', contextPath + '/img/common/icon_op12.png',
                    contextPath + '/img/common/icon_op13.png', contextPath + '/img/common/icon_op14.png',
                    contextPath + '/img/common/icon_op15.png', contextPath + '/img/common/icon_op16.png',
                    contextPath + '/img/common/icon_op17.png', contextPath + '/img/common/icon_op18.png',
                    contextPath + '/img/common/icon_op19.png', contextPath + '/img/common/icon_op20.png',
                    contextPath + '/img/common/icon_op21.png', contextPath + '/img/common/icon_op22.png',
                    contextPath + '/img/common/icon_op23.png', contextPath + '/img/common/icon_op24.png',
                    contextPath + '/img/common/icon_op25.png' ]
        };

        setEdgyStylePv ();
        pvInitTopology ();
        movePage ();
    }
} );