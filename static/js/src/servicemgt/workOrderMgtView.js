//작업선택
function selWorkOrder ()
{
    $ ( '#sel_work_order' ).change ( function ()
    {
        $ ( '.sel_work_order_box' ).hide ();
        $ ( '#' + $ ( this ).val () ).show ();
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.frm_con02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

//탭 액션
function customTabAction(){
    var tabLI = $('.tab_cont_box > .tab > li');

    tabLI.on('click', 'a', function (e) {
        var target = $(e.currentTarget);
        var li = target.parent();
        var idx = target.parent().index();
        var content = target.closest('ul').siblings('.tab_body').children('li');
        
        e.preventDefault();
        
        if (li.hasClass('disabled')) return;
        
        li.siblings().andSelf().removeClass('on');
        li.addClass('on');
        content.hide().eq(idx).show();
        
        // 점검항목 - 설비 병합
        $ ( '#tbl_chck' ).rowspan ( 0 );

        // 점검항목 - Component 병합
        $ ( '#tbl_chck' ).rowspan ( 1 );
        
        // 점검항목 - 설비 병합
        $ ( '#tbl_chckEss' ).rowspan ( 0 );

        // 점검항목 - Component 병합
        $ ( '#tbl_chckEss' ).rowspan ( 1 );
    });
}

function setEvent ()
{

    $ ( '#btn_list' ).click (
            function ()
            {
                var searchPvIdList = $ ( "#searchPvIdList" ).val ();
                var searchFromDate = $ ( "#searchFromDate" ).val ();
                var searchToDate = $ ( "#searchToDate" ).val ();
                var searchAplctnSectnCd = $ ( "#searchAplctnSectnCd" ).val ();
                var searchAplctnStleCd = $ ( "#searchAplctnStleCd" ).val ();

                var searchKeyWord = 'searchPvIdList=' + searchPvIdList + '&searchFromDate=' + searchFromDate
                        + '&searchToDate=' + searchToDate + '&searchAplctnSectnCd=' + searchAplctnSectnCd
                        + '&searchAplctnStleCd=' + searchAplctnStleCd;

                location.href = contextPath + '/hom/servicemgt/workorder/list.do?' + searchKeyWord;
            } );

    $ ( '#btn_update' ).click (
            function ()
            {
                var searchFromDate = $ ( "#searchFromDate" ).val ();
                var searchToDate = $ ( "#searchToDate" ).val ();
                var searchAplctnSectnCd = $ ( "#searchAplctnSectnCd" ).val ();
                var searchAplctnStleCd = $ ( "#searchAplctnStleCd" ).val ();

                var searchKeyWord = '&searchFromDate=' + searchFromDate + '&searchToDate=' + searchToDate
                        + '&searchAplctnSectnCd=' + searchAplctnSectnCd + '&searchAplctnStleCd=' + searchAplctnStleCd;

                location.href = contextPath + "/hom/servicemgt/workorder/form.do?method=update&opertPlanSeq="
                        + opertPlanSeq + "&pvId=" + pvId 
                        + "&aplctnSectnCd=" + aplctnSectnCd + searchKeyWord;
            } );
}

$.fn.rowspan = function ( colIdx, isStats )
{
    return this.each ( function ()
    {
        var that;
        $ ( 'tr', this ).each (
                function ( row )
                {
                    $ ( 'td:eq(' + colIdx + ')', this ).filter ( ':visible' ).each (
                            function ( col )
                            {

                                if ( $ ( this ).html () == $ ( that ).html ()
                                        && (!isStats || isStats
                                                && $ ( this ).prev ().html () == $ ( that ).prev ().html ()) )
                                {
                                    rowspan = $ ( that ).attr ( "rowspan" ) || 1;
                                    rowspan = Number ( rowspan ) + 1;

                                    $ ( that ).attr ( "rowspan", rowspan );

                                    // do your action for the colspan cell here
                                    $ ( this ).hide ();

                                    // $(this).remove();
                                    // do your action for the old cell here

                                } else
                                {
                                    that = this;
                                }

                                // set the that if not already set
                                that = (that == null) ? this : that;
                            } );
                } );
    } );
};

$ ( function ()
{    
    customizeScroll ();
    selWorkOrder ();
    setEvent ();
    customTabAction();
} );
