/*
customize dialog
dependency - jquery, magnific-popup, underscore
 */
(function ( factory )
{
    'use strict';

    if ( typeof contextPath === 'undefined' )
    {
        window.contextPath = '';
    }

    // AMD
    if ( typeof define === 'function' && define.amd )
    {
        define ( [ 'jquery', 'underscore' ], factory );
    }
    // CommonJS
    else if ( typeof exports === 'object' )
    {
        module.exports = factory ( require ( 'jquery' ), require ( '_' ) );
    }
    // Browser globals
    else
    {
        factory ( jQuery, _ );
    }
} ( function ( $, _ )
{
    'use strict';

    var type = {
        info : 'info',
        confirm : 'confirm'
    };

    function CustomizeDialog ( options )
    {
        this.defaults = {
            template : '/template/common/dialog.html',
            message : '',
            type : 'info',
            checkText : '확인',
            checkButtonId : 'btn_dialog_check01',
            cancelText : '취소',
            cancelButtonId : 'btn_dialog_cancel01',
            focusTargetAfterClose : null
        };

        this.options = $.extend ( {}, this.defaults, options );
        this.type = type;

        var deferred = $.Deferred ();

        this.init ( deferred );

        return deferred.promise ();
    }
    ;

    // CustomizeDialog init
    CustomizeDialog.prototype.init = function ( deferred )
    {
        var that = this;

        // 기존 띄어진 팝업 닫기
        $.magnificPopup.close ();
        $.get ( this.options.template ).done ( function ( template )
        {
            that._magnificPopup ( deferred, template );
        } ).fail ( function ()
        {
            alert ( that.options.message );
        } );
    };

    // magnificPopup 생성
    CustomizeDialog.prototype._magnificPopup = function ( deferred, template )
    {
        var that = this;

        var templateFunction = _.template ( template );
        var html = templateFunction ( {
            type : this.type,
            options : this.options
        } );

        var focusTargetAfterClose = that.options.focusTargetAfterClose;
        $.magnificPopup.open ( {
            alignTop : false,
            modal : true,
            items : {
                src : html,
                type : 'inline'
            },
            autoFocusLast : focusTargetAfterClose === null ? true : false,
            callbacks : {
                open : function ()
                {
                    that._event ( deferred );
                },
                afterClose : function ()
                {
                    if ( focusTargetAfterClose !== null )
                    {
                        focusTargetAfterClose.focus ();
                    }
                }
            }
        } );
    };

    // CustomizeDialog event
    CustomizeDialog.prototype._event = function ( deferred )
    {
        if ( this.options.type === this.type.confirm )
        {
            var $btnCancel = $ ( '#' + this.options.cancelButtonId );
            var $btnCheck = $ ( '#' + this.options.checkButtonId );

            $btnCheck.unbind ( 'click' );
            $btnCancel.unbind ( 'click' );

            $btnCheck.click ( function ()
            {
                deferred.resolve ( true );
                $.magnificPopup.close ();
            } );

            $btnCancel.click ( function ()
            {
                deferred.resolve ( false );
                $.magnificPopup.close ();
            } );
        } else
        {
            var $btnCheck = $ ( '#' + this.options.checkButtonId );

            $btnCheck.unbind ( 'click' );

            $btnCheck.click ( function ()
            {
                deferred.resolve ( true );
                $.magnificPopup.close ();
            } );
        }
    };

    $.customizeDialog = function ( options )
    {
        return new CustomizeDialog ( options );
    };

} ));