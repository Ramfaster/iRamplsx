var sectorCctv = null;

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

// CCTV 개별 보기 초기화면
function cctvVLC ()
{
    var cctvUrl = paramDefaultCctv;

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
        var vlc = document.getElementById ( 'vlc' );
        vlc.playlist.add ( cctvUrl, "live", ":network-caching=150" );
        vlc.playlist.play ();
    }

    return false;
};

// CCTV 선택 시 해당 CCTV 개별 보기 화면
function clickCctvVLC ()
{
    $ ( '.cctv_lft_list li' ).on ( 'click', function ()
    {
        var cctvUrl = $ ( this ).find ( 'a' ).attr ( 'href' );

        $ ( '.cctv_lft_list li' ).removeClass ( 'selected' );
        $ ( this ).addClass ( 'selected' );

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
            var vlc = document.getElementById ( 'vlc' );
            vlc.setAttribute ( 'target', cctvUrl );
            vlc.playlist.stop ();
            vlc.playlist.items.clear ();
            vlc.playlist.add ( cctvUrl, "live", ":network-caching=150" );
            vlc.playlist.play ();
        }

        return false;
    } );
};

// CCTV 모아 보기 팝업 화면
function clickCctvAllPopup ()
{
    $ ( '.btn_wp_type01' ).on (
            'click',
            function ()
            {
                // 기존 팝업(CCTV 개별 화면) 종료
                var vlc = document.getElementById ( 'vlc' );
                vlc.playlist.stop ();
                vlc.playlist.items.clear ();

                window.close ();

                // var popUrl = $ ( this ).data ( "url" ); // 팝업창에 출력될 페이지 URL
                // console.log ( popUrl );

                // 팝업창에 출력될 페이지 URL
                var popUrl = contextPath + "/hom/dashboard/sector/cctvAllPopUp.do?pvId=" + paramPvId;
                // var popUrl = contextPath + "/hom/dashboard/sector/cctvAllPopUp.do"; // 팝업창에 출력될 페이지 URL
                var width = 1090, height = 750;
                var winHeight = document.body.clientHeight; // 현재창의 높이
                var winWidth = document.body.clientWidth; // 현재창의 너비
                var winX = window.screenX || window.screenLeft || 0;// 현재창의 x좌표
                var winY = window.screenY || window.screenTop || 0; // 현재창의 y좌표

                var popX = winX + (winWidth - width) / 2;
                var popY = winY + (winHeight - height) / 2;                
                var popOption = 'toolbar=no,menubar=no,scrollbars=yes,resizable=no,status=no,width=' + width
                        + 'px,height=' + height + 'px,left=' + popX + ',top=' + popY;

                window.open ( popUrl, '', popOption );
                return false;

            } );
};

$ ( function ()
{
    customizeScroll ();
    // cctvVLC ();
    clickCctvVLC ();
    clickCctvAllPopup ();
} );

$ ( window ).load ( function ()
{
    cctvVLC ();
} );