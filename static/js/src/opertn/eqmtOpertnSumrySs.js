/**
 * 키츠키 발전소 SS 변전소 (아이디 미발번)
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
function pvInitTopology ( key )
{
    console.log ( 'ssData', ssData );

    var data = getPvNodeAndEdge ( key );

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
function getPvNodeAndEdge ( key )
{
    var data = {
        nodes : [],
        edges : null
    };

    // topology data 생성
    var topologyData = getPvTopologyData ( key );

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

        // 안보이는 노드
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
function getPvTopologyData ( key )
{
    var topologyData = null;

    if ( key === 'SS1' || key === 'SUBSTATN1' )
    {
        topologyData = ssData.ss1;
    } else if ( key === 'SS2' || key === 'SUBSTATN2' )
    {
        topologyData = ssData.ss2;
    } else if ( key === 'SS3' || key === 'SUBSTATN3' )
    {
        topologyData = ssData.ss3;
    } else if ( key === 'SS4' || key === 'SUBSTATN4' )
    {
        topologyData = ssData.ss4;
    }

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
        } else if ( node.data.indexOf ( 'INCL' ) > -1 || node.data.indexOf ( 'PCS' ) > -1 )
        {
            var top = node['renderer1:y'];
            var left = left = node['renderer1:x'] - 50;

            $sigmaContainer.append ( '<a class="sub_box" data-id="' + node.id
                    + '" href="javascript:;" style="position:absolute; top:' + top + 'px;left:' + left
                    + 'px;color:green;">' + node.label + '</a>' );
        }

        if ( node.data.indexOf ( 'ES' ) > -1 || node.data.indexOf ( 'DS' ) > -1 || node.data.indexOf ( 'TR' ) > -1
                || node.data.indexOf ( 'VCB' ) > -1 || node.data.indexOf ( 'LBS' ) > -1 )
        {
            var top = node['renderer1:y'] - 10;
            var left = node['renderer1:x'] + 20;

            if ( node.data.indexOf ( 'VCBL' ) > -1 )
            {
                left = node['renderer1:x'] - 70;

            }
            if ( node.data.indexOf ( 'VCBF141' ) > -1 )
            {
                top = node['renderer1:y'] - 15;
            }

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
        var str = $ ( this ).data ( 'id' );

        if ( str == 'root' )
        {
            location.href = contextPath + '/hom/operation/summary/summary.do';
        } else if ( str == 'root2' )
        {
            location.href = contextPath + '/hom/operation/summary/summarySub.do';
        } else
        {
            location.href = contextPath + '/hom/operation/summary/summarySs.do?key=' + str;
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
            url : [ contextPath + '/img/common/icon_op07.png', contextPath + '/img/common/icon_op08.png',
                    contextPath + '/img/common/icon_op09.png', contextPath + '/img/common/icon_op10.png',
                    contextPath + '/img/common/icon_op11.png', contextPath + '/img/common/icon_op12.png',
                    contextPath + '/img/common/icon_op13.png', contextPath + '/img/common/icon_op14.png',
                    contextPath + '/img/common/icon_op15.png', contextPath + '/img/common/icon_op16.png',
                    contextPath + '/img/common/icon_op17.png', contextPath + '/img/common/icon_op18.png',
                    contextPath + '/img/common/icon_op19.png', contextPath + '/img/common/icon_op20.png',
                    contextPath + '/img/common/icon_op21.png', contextPath + '/img/common/icon_op22.png',
                    contextPath + '/img/common/icon_op23.png', contextPath + '/img/common/icon_op24.png',
                    contextPath + '/img/common/icon_op25.png', contextPath + '/img/common/icon_op26.png' ]
        };

        setEdgyStylePv ();
        pvInitTopology ( key );
        movePage ();
    }
} );