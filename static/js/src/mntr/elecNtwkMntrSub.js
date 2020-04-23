// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.data_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

/**
 * 특고 변전소
 */
function selectTemp01 ()
{
    var $wtsList = $ ( '#wtsList' );

    if ( elecNtwkMntr.tpl.temp04 !== null )
    {
        var template = _.template ( elecNtwkMntr.tpl.temp04 );

        $wtsList.empty ().html ( template );
        movePage ();
    }

}

/**
 * SS 변전소
 */
function selectTemp02 ()
{
    var $wtsList = $ ( '#wtsList' );

    for ( var i = 1; i < 5; i++ )
    {
        if ( elecNtwkMntr.tpl.temp05 !== null )
        {
            var template = _.template ( elecNtwkMntr.tpl.temp05 );
            var html = template ( {
                eqmtNm : i,
                key : key
            } );
            $wtsList.append ( html );
            movePage ();
        }
    }
}

/**
 * 인클로저
 */
function selectTemp03 ()
{
    var $acbIvtList = $ ( '#acbIvtList' );
    var num = 6;
    if ( key.indexOf ( 'SS2' ) > -1 )
    {
        num = 2;
    } else if ( key.indexOf ( 'SS3' ) > -1 )
    {
        num = 4;
    } else if ( key.indexOf ( 'SS4' ) > -1 )
    {
        num = 5;
    }
    for ( var i = 1; i <= num; i++ )
    {
        if ( elecNtwkMntr.tpl.temp06 !== null )
        {
            var template = _.template ( elecNtwkMntr.tpl.temp06 );
            var html = template ( {
                eqmtNm : i
            } );

            $acbIvtList.append ( html );
        }
    }

}

function initElecNtwkMntr ()
{
    // 특고 변전소 조회
    selectTemp01 ();
    // SS 변전소
    selectTemp02 ( key );
    // 인클로저
    selectTemp03 ( key );
}

/**
 * 특고 변전소 & SS 변전소 클릭 시
 */
function movePage ()
{
    $ ( '.weather_station_list' ).on ( 'click', function ()
    {
        var str = $ ( this ).data ( 'id' );

        console.log ( 'str', str );

        if ( typeof str === undefined || str == '' || str == null )
        {
            location.href = contextPath + '/hom/monitoring/network/monitoring.do';
        } else
        {
            location.href = contextPath + '/hom/monitoring/network/monitoring.do?key=' + str;
        }
    } );
}

$ ( function ()
{
    elecNtwkMntr = {
        tpl : {
            temp04 : getTemplate ( templates.temp04 ), // 특고 변전소
            temp05 : getTemplate ( templates.temp05 ), // SS 변전소
            temp06 : getTemplate ( templates.temp06 )
        // 인클로저
        }
    }

    customizeScroll ();
    initElecNtwkMntr ( key );
    movePage ();

} );