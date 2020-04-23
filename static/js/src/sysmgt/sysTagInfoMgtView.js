//수정 버튼 클릭시
function clickUpdate ()
{
    var $btnUpdate = $ ( '#btn_update' );
    $btnUpdate.on ( 'click', function ()
    {
        location.href = $ ( this ).attr ( 'href' ) + '&tagId=' + encodeURIComponent ( tagId );

        return false;
    } );
}

$ ( function ()
{
    clickUpdate ();
} );