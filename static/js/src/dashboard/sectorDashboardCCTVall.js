// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.lft_con' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// CCTV 모아 보기 초기화면
function cctvAllVLC ()
{
    // 버전을 가져오고 null일 경우 설치가 안됨
    var version = PluginDetect.getVersion ( "VLC" );

    // 프로그램 설치 필요
    if ( version === null )
    {
        $.fileDownload ( 'http://downloads.videolan.org/pub/videolan/vlc/2.2.2/win32/vlc-2.2.2-win32.exe' );
    }
    // 프로그램 설치 됨
    else
    {
        sectorCctv.vlcList = [];

        for ( var i = 0, size = paramCctvSize; i < size; i++ )
        {
            sectorCctv.vlcList.push ( document.getElementById ( 'vlc' + i ) );
            var cctvUrl = sectorCctv.vlcList[i].getAttribute ( "target" );
            sectorCctv.vlcList[i].playlist.add ( cctvUrl, "live", ":network-caching=150" );
            sectorCctv.vlcList[i].playlist.play ();
        }
    }
    return false;
};

// CCTV 개별 보기 팝업 화면
function clickCctvPopup ()
{
    $ ( '.btn_wp_type01' ).on ( 'click', function ()
    {
        // 기존 팝업(CCTV 모아보기 화면) 종료
        for ( var i = 0, size = paramCctvSize; i < size; i++ )
        {
            sectorCctv.vlcList[i].playlist.stop ();
            sectorCctv.vlcList[i].playlist.items.clear ();
        }
        sectorCctv.vlcList.splice ( 0, paramCctvSize );

        window.close ();

        var popUrl = contextPath + "/hom/dashboard/sector/cctvPopUp.do?pvId=" + paramPvId; // 팝업창에 출력될 페이지 URL
        var width = 1075, height = 640;
        var winHeight = document.body.clientHeight; // 현재창의 높이
        var winWidth = document.body.clientWidth; // 현재창의 너비
        var winX = window.screenX || window.screenLeft || 0;// 현재창의 x좌표
        var winY = window.screenY || window.screenTop || 0; // 현재창의 y좌표

        var popX = winX + (winWidth - width) / 2;
        var popY = winY + (winHeight - height) / 2;
        var popOption = 'width=' + width;
        popOption += 'px,height=' + height;
        popOption += 'px,left=' + popX;
        popOption += ',top=' + popY;

        window.open ( popUrl, '', popOption );

        return false;

    } );
};

$ ( function ()
{
    sectorCctv = {
        vlcList : null
    };

    customizeScroll ();
    cctvAllVLC ();
    clickCctvPopup ();
} );
