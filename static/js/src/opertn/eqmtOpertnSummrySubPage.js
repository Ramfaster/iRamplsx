/**
 * 설비의 개수가 많아 한 화면 안에 전부 표시할 수 없는 경우 VCB와 나머지 설비들을 표시하는 화면을 분리 -예) 새만금 햇빛누리 태양광 발전소(AA002), 영월에너지 제 1,2,3공구
 * 발전소(AE024,AA003,AA004)
 */
$ ( function ()
{
    eqmtOpertnSummrySubPageJS.initialize ();

    var t = setInterval ( function ()
    {
        eqmtOpertnSummrySubPageJS.getTagValue ();
        eqmtOpertnSummrySubPageJS.getWTSData ();
    }, $ ( '#eqmtTime' ).val () ); /* 갱신(refresh)5000 */

} );

var eqmtOpertnSummrySubPageJS = function ()
{
    return {
        initialize : function ()
        {
            eqmtOpertnSummrySubPageJS.customizeScroll ();
            eqmtOpertnSummrySubPageJS.setEdgeStyle ();
            eqmtOpertnSummrySubPageJS.setXyLC ();

            eqmtOpertnSummrySubPageJS.getWTSData ();
            eqmtOpertnSummrySubPageJS.setMainPageMoveEvent ();
        },
        /**
         * set customize Scroll
         */
        customizeScroll : function ()
        {
            $ ( '.ops_wrap' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );
        },
        /**
         * set sigma edge style
         */
        setEdgeStyle : function ()
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
                context.lineTo ( source[prefix + 'x'] + (target[prefix + 'x'] - source[prefix + 'x']) / 2,
                        source[prefix + 'y'] );
                context.lineTo ( source[prefix + 'x'] + (target[prefix + 'x'] - source[prefix + 'x']) / 2,
                        target[prefix + 'y'] );
                context.lineTo ( target[prefix + 'x'], target[prefix + 'y'] );
                context.stroke ();
            };
        },
        /**
         * set 설비 위치 설정
         */
        setXyLC : function ()
        {
            $.ajax ( {
                url : contextPath + '/hom/operation/summary/setXyLC.ajax',
                data : {
                    'eqmtId' : eqmtId
                },
                type : 'POST',
                dataType : 'json',
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        var $sigmaContainer = $ ( '#sigma_container' );
                        var data = json.data;
                        var emqtData = eqmtOpertnSummrySubPageJS.setEqmtData ( data );

                        data.listXyLcName = emqtData.listXyLcName;
                        data.listXyVal = emqtData.listXyVal;
                        data.eqmtParntsEqmtIdMap = emqtData.eqmtParntsEqmtIdMap;

                        var hasJunFlag = eqmtOpertnSummrySubPageJS.hasJun ( data.listXyLcName );
                        data.listXyEdge = eqmtOpertnSummrySubPageJS.setEdge ( data.eqmtParntsEqmtIdMap );
                        data.listXyLc = eqmtOpertnSummrySubPageJS.setLocation ( data.listXyLcName, hasJunFlag );
                        data.height = data.listXyLc.get ( 'height' );

                        eqmtOpertnSummrySubPageJS.xyLCLoad ( data );
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
        },
        /**
         * 설비 데이터 구성
         */
        setEqmtData : function ( orgData )
        {
            var listXyLcName = [];
            var listXyVal = [];
            var eqmtParntsEqmtIdMap = {};

            // 1.listXyLcName
            _.each ( orgData.listXyLcName, function ( d )
            {
                if ( d.id !== 'WHM0000' )
                {
                    listXyLcName.push ( d );
                }
            } );

            // 2. listXyVal
            listXyVal.push ( {} );
            _.each ( orgData.listXyVal, function ( datas )
            {
                for ( var item in datas )
                {
                    if ( item !== null && item !== '' && item !== 'paramtrAlarm'
                            && item.substring ( 8, 15 ).indexOf ( 'VCB' ) < 0 )
                    {
                        listXyVal.push ( datas );
                        return false;
                    }
                }
            } );

            // 3.eqmtParntsEqmtIdMap
            _.map ( orgData.eqmtParntsEqmtIdMap, function ( trgt, srce )
            {
                var keyname = srce;

                if ( srce !== 'WHM0000' )
                {
                    // eqmtParntsEqmtIdMap.put ( obj );

                    if ( srce.indexOf ( 'VCB' ) > -1 )
                    {
                        trgt = srce;
                    }

                    eqmtParntsEqmtIdMap[keyname] = trgt;
                }
            } );

            var data = {
                listXyLcName : listXyLcName,
                listXyVal : listXyVal,
                eqmtParntsEqmtIdMap : eqmtParntsEqmtIdMap
            };

            return data;
        },
        /**
         * 접속반 존재 여부
         */
        hasJun : function ( nodeNameData )
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
        },
        /**
         * set edge source - target 관계
         */
        setEdge : function ( nodeValData )
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
        },
        /**
         * 설비의 위치 설정
         */
        setLocation : function ( nodeNameData, hasJunFlag )
        {
            var nodeLocationDataMap = new Map ();
            var xIntvl = (pvId === 'AA002' ? 200 : 160);
            var yIntvl = 80;
            var vcbCount = 0;
            var trnCount = 0;
            var acbCount = 0;
            var ivtCount = 0;
            var junCount = 0;
            var countOfJun = 2; // jun 갯수

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
                        y = yIntvl * trnCount * countOfJun * 2;
                        trnCount++;
                        break;
                    case 'ACB':
                        x = xIntvl * 3;
                        y = yIntvl * acbCount * countOfJun;
                        acbCount++;
                        break;
                    case 'IVT':
                        x = xIntvl * 4;
                        y = yIntvl * ivtCount * countOfJun;
                        ivtCount++;
                        break;
                    case 'JUN':
                        x = xIntvl * 5;
                        y = yIntvl * junCount;
                        junCount++;
                }

                nodeLocationDataMap.put ( node.id, {
                    x : x,
                    y : y
                } );
            } );

            if ( (junCount / ivtCount) > 5 )
            {
                if ( acbCount > 1 )
                {
                    nodeLocationDataMap.put ( 'height', ((junCount - 1) * yIntvl) + 650 );
                } else
                {
                    nodeLocationDataMap.put ( 'height', ((junCount - 1) * yIntvl) + 350 );
                }
            } else
            {
                nodeLocationDataMap.put ( 'height', ((junCount - 1) * yIntvl) + 850 );
            }

            nodeLocationDataMap.put ( 'ivtCount', ivtCount );
            nodeLocationDataMap.put ( 'junCount', junCount );

            return nodeLocationDataMap;
        },
        /**
         * 설비 데이터 정보 load
         */
        xyLCLoad : function ( data )
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
                $upsAlarm.html ( '<i id="' + ups.upsEqmtId + 'Alarm" class=' + ups.upsAlarm + '></i>'
                        + i18nMessage.msg_ups );

            } else
            {
                $upsAlarm.hide ();
            }

            if ( fir.fir == homConstants.checkY )
            {
                $fireAlarm.show ();
                $fireAlarm.html ( '<i id="' + fir.firEqmtId + 'Alarm" class=' + fir.firAlarm + '></i>'
                        + i18nMessage.msg_fire );
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

            g = eqmtOpertnSummrySubPageJS.generateEdge ( nodeEdgeData, g );

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
                    var dataTbl = eqmtOpertnSummrySubPageJS.getAlarmSpan ( i, nodeValData[i], nodeLocationData1[i],
                            selecteAlarm, node['id'], paramtrAlarm );
                    if ( i != 0 )
                    {
                        dataTbl += '<div class="data_tbl">'
                        dataTbl += eqmtOpertnSummrySubPageJS.getTagValueDiv ( nodeValData[i] );
                        dataTbl += '</div>';
                    }

                    $sigmaContainer.append ( '<div class="data_tbl_wrap" id="node' + i + '" style="top:'
                            + (top + topPx) + 'px;left:' + (left + leftPx) + 'px;position:absolute;'
                            + (width != null ? width : '') + '"></div>' );
                    $ ( '#node' + i ).append ( dataTbl );
                }
            } );
        },
        /**
         * setting 된 edge 정보를 바탕으로 edge 생성
         */
        generateEdge : function ( nodeEdgeData, g )
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
        },
        /**
         * 상태 알람 및 label이 표시되는 span 생성
         */
        getAlarmSpan : function ( index, nodeValData, nodeLocationData, selecteAlarm, nodeId, paramtrAlarm )
        {

            var dataTbl = null;

            if ( index === 0 )
            {
                dataTbl = '<strong class="selected" > <a class="label_tag" href="javascript:;"> '
                        + nodeLocationData.lable + '</a></strong>';
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

                dataTbl += nodeLocationData.lable + '</strong>';
            }

            return dataTbl;
        },
        /**
         * 설비의 값이 표시되는 div 생성
         */
        getTagValueDiv : function ( nodeValDataArray )
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
        },
        /**
         * 기상반 데이터 조회
         */
        getWTSData : function ()
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
        },
        /**
         * 계측 값 및 알람 값 요청
         */
        getTagValue : function ()
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
        },
        /**
         * 메인 페이지로 이동
         */
        setMainPageMoveEvent : function ()
        {
            $ ( document ).on ( 'click', '.label_tag', function ()
            {
                location.href = contextPath + '/hom/operation/summary/summary.do';
            } );
        }
    };
} ();