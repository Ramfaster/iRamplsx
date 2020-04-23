/*
select, checkbox, radio, file customize module v.1.0

(c) 2016 silver0r

dependency: jQuery, modernizr(option), jquery-ellipsis
License: MIT

customizeCheckbox, customizeRadio used modernizr
customizeFile used jquery-ellipsis

-- brower support--------------------------------------
customizeFile support - IE6~11, FF, Chrome, Opera
customizeCheckbox support - IE6~11, FF, Chrome, Opera
customizeRadio support - IE6~11, FF, Chrome, Opera
customizeSelect support - IE8~11, FF, Chrome, Opera
-------------------------------------------------------
-- note -----------------------------------------------
checkbox, radio 긴 버튼 으로 사용하고자 할 때는
display:block, width:-1, labelMarginRight:0 옵션 필요
-------------------------------------------------------

*/
(function (factory) {
    'use strict';
    // AMD
    if(typeof define === 'function' && define.amd) {
        define(['jquery', 'jquery.ellipsis.min', 'modernizr-latest'], factory);
    }
    // CommonJS
    else if(typeof exports === 'object') {
        module.exports = factory(require('jquery'), require('jquery.ellipsis.min'), require('modernizr-latest'));
    }
    // Browser globals
    else {
        factory(jQuery);
    }
}(function ($) {
    'use strict';
    var pluginInfo = {
            name    : 'jquery.customize.form',
            version : '1.0'
    };
    
    // Checkbox, Radio Parent Class
    function ChoiceBox() {
        this._pluginInfo = pluginInfo;
    }
    
    // initialize
    ChoiceBox.prototype.init = function() {
        var that = this;    
        var $labelObject = null;
        var $object = null;

        this._draw();

        return this.$element.each(function(index) {
            $object = $(this);
            $labelObject = $object.next('label');

            that._initStatus($object, $labelObject);
            that._event($object, $labelObject);
        });
    };

    // draw structure
    ChoiceBox.prototype._draw = function() {
        var labelObjectCSS = null;
        
        if(this.options.type === 'text') {
            labelObjectCSS = {
                    width               : this.options.width + 'px',
                    height              : this.options.height + 'px',
                    lineHeight          : this.options.height + 'px',
                    borderWidth         : '1px',
                    borderStyle         : 'solid',
                    borderColor         : this.options.borderColor,
                    borderRadius        : this.options.borderRadius + 'px',
                    marginRight         : this.options.labelMarginRight + 'px',
                    backgroundColor     : this.options.backgroundColor,
                    color               : this.options.color,
                    display             : 'inline-block',
                    '*display'          : 'inline',
                    '*zoom'             : '1',
                    verticalAlign       : 'middle',
                    textAlign           : 'center',
                    zIndex              : 100,
                    cursor              : 'pointer'
            };
        }
        // image type
        else {
            labelObjectCSS = {
                    height              : this.options.height + 'px',
                    lineHeight          : this.options.height + 'px',
                    marginRight         : this.options.labelMarginRight + 'px',
                    paddingLeft         : (this.options.width + this.options.labelPaddingLeft) + 'px',
                    backgroundRepeat    : 'no-repeat',
                    backgroundPosition  : '0 0',
                    backgroundColor     : this.options.backgroundColor,
                    display             : 'inline-block',
                    '*display'          : 'inline',
                    '*zoom'             : '1',
                    verticalAlign       : 'middle',
                    zIndex              : 100,
                    cursor              : 'pointer'
            };
            
            if((typeof Modernizr !== 'undefined') && Modernizr.backgroundsize) {
                labelObjectCSS.backgroundImage = 'url("' + this.options.backgroundImage2x + '")';
                labelObjectCSS.backgroundSize = this.options.backgroundSize;
            }
            else {
                labelObjectCSS.backgroundImage = 'url("' + this.options.backgroundImage + '")';
            }
        }
        
        // inline-block IE7 hack properties remove
        if(this.options.display === 'block') {
        	labelObjectCSS.display = this.options.display;
        	
        	delete labelObjectCSS['*display'];
        	delete labelObjectCSS['*zoom'];
        }
        
        // if width equals -1, width properties remove
        var parseWidth = parseInt(this.options.width);
        if($.isNumeric(parseWidth) && parseWidth === -1) {
        	delete labelObjectCSS.width;
        }

        this.$element.next('label').css(labelObjectCSS);
        
        // safari browser 1px spalling bug fix
        var bugfix = 1;
        this.$element.css({
            marginLeft  : bugfix + 'px',
            marginRight : -(this.options.width + bugfix) + 'px',
            width       : this.options.width + 'px',
            height      : this.options.height + 'px',
            zIndex      : 0
        });
    };
    
    // initialize change element status
    ChoiceBox.prototype._initStatus = function($object, $labelObject) {
        var status = null;
        
        if($object.prop('disabled') && $object.prop('checked')) {
            status = 'on_disabled';
        }
        else if($object.prop('disabled') && !$object.prop('checked')) {
            status = 'off_disabled';
        }
        else if($object.prop('checked')) {
            status = 'on';
        }
        
        if(status !== null) {
            this._changeStatus($labelObject, status);
        }
    };
    
    // change element status
    ChoiceBox.prototype._changeStatus = function($labelObject, status) {
        var labelObjectCSS = null;
        
        if(this.options.type === 'text') {
            var borderColor = null;
            var backgroundColor = null;
            var color = null;
            
            switch(status) {
                case 'off':
                    borderColor = this.options.borderColor;
                    backgroundColor = this.options.backgroundColor;
                    color = this.options.color;
                    
                    break;
                case 'off_hover':
                    borderColor = this.options.borderColor;
                    backgroundColor = this.options.selectedBackgroundColor;
                    color = this.options.selectedColor;
                    
                    break;
                case 'on':
                    borderColor = this.options.selectedBorderColor;
                    backgroundColor = this.options.selectedBackgroundColor;
                    color = this.options.selectedColor;
                    
                    break;
                case 'on_hover':
                    borderColor = this.options.selectedBorderColor;
                    backgroundColor = this.options.selectedBackgroundColor;
                    color = this.options.selectedColor;
                    
                    break;
                case 'off_disabled':
                    borderColor = this.options.disableBorderColor;
                    backgroundColor = this.options.disableBackgroundColor;
                    color = this.options.disableColor;
                    
                    break;
                case 'on_disabled':
                    borderColor = this.options.disableBorderColor;
                    backgroundColor = this.options.disableBackgroundColor;
                    color = this.options.disableColor;
                    
                    break;
            }
            
            labelObjectCSS = {
                    borderColor         : borderColor,
                    backgroundColor     : backgroundColor,
                    color               : color
            };
        }
        // image type
        else {
            var position = null;
            var yCoordinate = this.options.width + 10;
            
            switch(status) {
                case 'off'          : position = '0 0'; break;
                case 'off_hover'    : position = '0 -' + yCoordinate + 'px'; break;
                case 'on'           : position = '0 -' + yCoordinate * 2 + 'px'; break;
                case 'on_hover'     : position = '0 -' + yCoordinate * 3 + 'px'; break;
                case 'off_disabled' : position = '0 -' + yCoordinate * 4 + 'px'; break;
                case 'on_disabled'  : position = '0 -' + yCoordinate * 5 + 'px'; break;
            }
            
            labelObjectCSS = {
                    backgroundPosition: position
            };
        }
        
        $labelObject.css(labelObjectCSS);
    };
    
    // check element status
    ChoiceBox.prototype._checkStatus = function($object, $labelObject) {
        if(!$object.prop('disabled')) {
            var status = 'off';
            
            if($object.is(':checked')) {
                status = 'on';
            }
            
            this._changeStatus($labelObject, status);
        }
    };

    // check element status hover
    ChoiceBox.prototype._checkStatusWithHover = function($object, $labelObject) {
        if(!$object.prop('disabled')) {
            var status = 'off_hover';
            
            if($object.is(':checked')) {
                status = 'on_hover';
            }
            
            this._changeStatus($labelObject, status);
        }
    };
    
    // Checkbox Class
    function Checkbox($element, options) {
        this.defaults = {
                width                   : 15,                               // checkbox image width
                height                  : 15,                               // checkbox image heigh
                labelMarginRight        : 10,                               // checkbox margin right
                labelPaddingLeft        : 10,                               // padding left between label and checkbox
                backgroundColor         : '#fff',                           // background color
                backgroundImage         : '../css/img/img_checkbox.png',    // background image source
                backgroundImage2x       : '../css/img/img_checkbox@2x.png', // background image source @2x
                type                    : 'image',                          // checkbox type : image, text
                color                   : '#000',                           // text type checkbox text color
                selectedColor           : '#fff',                           // text type checkbox selected text color
                disableColor            : '#838383',                        // text type checkbox disable text color
                selectedBackgroundColor : '#000',                           // text type checkbox selected background
                                                                            // color
                disableBackgroundColor  : '#f4f4f4',                        // text type checkbox disable background
                                                                            // color
                borderColor             : '#000',                           // text type checkbox border color
                selectedBorderColor     : '#000',                           // text type checkbox selected border color
                disableBorderColor      : '#adb2b5',                        // text type checkbox disable border color
                borderRadius            : 5                                 // text type checkbox border radius
        };
        
        this.$element = $element;
        this.options = $.extend({}, this.defaults, options);
        
        return this.init();
    }
    
    Checkbox.prototype = new ChoiceBox();
    
    // check element change trigger
    Checkbox.prototype._changeTrigger = function($object, $labelObject) {
        var status = null;
        
        if(!$object.prop('disabled')) {
            if($object.is(':checked')) {
                status = 'on';
            }
            else {
                status = 'off';
            }
        }
        else {
            if($object.is(':checked')) {
                status = 'on_disabled';
            }
            else {
                status = 'off_disabled';
            }
        }
        
        this._changeStatus($labelObject, status);
    };
    
    // Checkbox event
    Checkbox.prototype._event = function($object, $labelObject) {
        var that = this;

        $labelObject.on('click mouseover', function() {
        	that._checkStatusWithHover($object, $labelObject);
        }).on('mouseleave', function() {
        	that._checkStatus($object, $labelObject);
        });
        
        $object.on('click focus', function() {
        	that._checkStatusWithHover($object, $labelObject);
        }).on('blur', function() {
        	that._checkStatus($object, $labelObject);
        }).on('change', function() {
        	that._changeTrigger($object, $labelObject);
        });
    };
    
    // Radio Class
    function Radio($element, options) {
        this.defaults = {
                width                   : 16,                               // radio image width
                height                  : 16,                               // radio image height
                labelMarginRight        : 10,                               // radio margin right
                labelPaddingLeft        : 10,                               // padding left between label and radio
                backgroundColor         : '#fff',                           // background color
                backgroundImage         : '../css/img/img_checkbox.png',    // background image source
                backgroundImage2x       : '../css/img/img_checkbox@2x.png', // background image source @2x
                type                    : 'image',                          // checkbox type : image, text
                color                   : '#000',                           // text type radio text color
                selectedColor           : '#fff',                           // text type radio selected text color
                disableColor            : '#838383',                        // text type radio disable text color
                selectedBackgroundColor : '#000',                           // text type radio selected background color
                disableBackgroundColor  : '#f4f4f4',                        // text type radio disable background color
                borderColor             : '#000',                           // text type radio border color
                selectedBorderColor     : '#000',                           // text type radio selected border color
                disableBorderColor      : '#adb2b5',                        // text type radio disable border color
                borderRadius            : 5                                 // text type radio border radius
        };
        
        this.$element = $element;
        this.options = $.extend({}, this.defaults, options);
        
        return this.init();
    }
    
    Radio.prototype = new ChoiceBox();
    
    // check element status when radio click
    Radio.prototype._checkStatusWithClick = function($object, $labelObject, objectName) {
        var that = this;
        
        if(!$object.prop('disabled')) {
            var status = null;
            
            $('input[name="' + objectName + '"]').each(function(index) {
                if(!$(this).prop('disabled')) {
                    status = 'off';
                }
                else {
                    status = 'off_disabled';
                }
                
                that._changeStatus($('label[for=' + $(this).attr('id') + ']'), status);
            });
            
            status = 'off_hover';
            
            if($object.is(':checked')) {
                status = 'on_hover';
            }
            
            this._changeStatus($labelObject, status);
        }
    };
    
    // radio element change trigger
    Radio.prototype._changeTrigger = function($object, $labelObject, objectName) {
        var that = this;
        var status = null;
        
        $('input[name="' + objectName + '"]').each(function(index) {
            if(!$(this).prop('disabled') && $(this).is(':checked')) {
                status = 'on';
            }
            else if(!$(this).prop('disabled') && !$(this).is(':checked')) {
                status = 'off';
            }
            else {
                status = 'off_disabled';
            }
            
            that._changeStatus($('label[for=' + $(this).attr('id') + ']'), status);
        });
        
        if(!$object.prop('disabled')) {
            if($object.is(':checked')) {
                this._changeStatus($labelObject, 'on');
            }
        }
        else {
            if($object.is(':checked')) {
                this._changeStatus($labelObject, 'on_disabled');
            }
        }
    };
    
    // Radio event
    Radio.prototype._event = function($object, $labelObject) {
        var that = this;
        var objectName = $object.attr('name');
        
        $labelObject.on('click', function() {
        	that._checkStatusWithClick($object, $labelObject, objectName);
        }).on('mouseover', function() {
        	that._checkStatusWithHover($object, $labelObject);
        }).on('mouseleave', function() {
        	that._checkStatus($object, $labelObject);
        });
        
        $object.on('click', function() {
        	that._checkStatusWithClick($object, $labelObject, objectName);
        }).on('focus', function() {
        	that._checkStatusWithHover($object, $labelObject);
        }).on('blur', function() {
        	that._checkStatus($object, $labelObject);
        }).on('change', function() {
        	that._changeTrigger($object, $labelObject, objectName);
        });        
    };
    
    // File Class
    function File($element, options) {
        this._pluginInfo = pluginInfo;
        
        this.defaults = {
            buttonType                  : 'text',                               // button type: text, image, bg_sprite
            buttonText                  : '파일열기',                              // button type = 'text', set button Text
            buttonBackgroundImage       : '../css/img/img_find_btn01.jpg',      // button image source
            buttonSpriteClass           : 'btn_file01',                         // button sprite class(bg_sprite only)
            buttonWidth                 : 70,                                   // button width
            buttonSpacing               : 10,                                   // button left margin
            buttonBackgroundColor       : '#707070',                            // button type = 'text', set button background color
            buttonTextColor             : '#fff',                               // button type = 'text', set button text color
            textWidth                   : 190,                                  // chosen file name box size
            textPaddingVertical         : 0,                                    // file name box top and bottom padding
            textPaddingHorizontal       : 5,                                    // file name box left and right padding
            textBorder                  : '1px #c8c8c8 solid',                  // file name box border
            verticalSpacing             : 10,                                   // each file wrap element spacing
            ellipsisPosition            : 'middle',                             // text ellipsis: middle, tail
            height                      : 30,                                   // element common height
            enableInitButton            : false,                                // Init button enable(default: false)
            initButtonBackgroundImage   : '../css/img/img_close_btn01.png'      // Init button background image
        };
        
        this._$oldElement = $element;
        this.options = $.extend({}, this.defaults, options);
        
        return this.init();
    }
    
    // File initialize
    File.prototype.init = function() {
        this._replaceHTML();
        this._draw();
        this._event();
        
        return this.$element;
    };
    
    // remove <input type="file" /> and make new structure
    File.prototype._replaceHTML = function() {
        var html = '<div class="file_wrap"><div class="file_text"><div class="ellipsis"></div></div><div class="btn_customize_file">';
        
        if(this.options.buttonType === 'text' || this.options.buttonType === 'bg_sprite') {
            html += '<span class="text">' + this.options.buttonText + '</span>';
        }
        
        html += '<input type="file" class="customizeFile" name="' + this._$oldElement.attr('name') + '" id="' + this._$oldElement.attr('id') + '" /></div></div>';
        
        var $wrapElement = this._$oldElement.before(html).prev();
        $wrapElement.next().remove();
        
        if(this.options.enableInitButton) {
            $wrapElement.children('.file_text').append('<a class="btn_file_init" href="javascript:;" title="file clear"><img src="' + this.options.initButtonBackgroundImage + '" alt="close" /></a>');
        }
        
        this._$wrapElement = $wrapElement;
    };
    
    // draw new structure
    File.prototype._draw = function() {
        var $element = this._$wrapElement.css({
            width               : (this.options.textWidth + this.options.buttonWidth + this.options.buttonSpacing + (this.options.textPaddingHorizontal * 2)) + 'px',
            height              : this.options.height + 'px',
            lineHeight          : this.options.height + 'px',
            marginBottom        : this.options.verticalSpacing + 'px'
        }).children('div').css({
            height              : this.options.height + 'px',
            lineHeight          : this.options.height + 'px'
        }).closest('.file_wrap').children('.file_text').css({
            float               : 'left',
            width               : (this.options.textWidth - 2) + 'px',
            height              : (this.options.height - 2) + 'px',
            padding             : this.options.textPaddingVertical + ' ' + this.options.textPaddingHorizontal + 'px',
            border              : this.options.textBorder,
            position            : 'relative'
        }).children('.ellipsis').css({
            wordBreak           : 'break-all'   // installation_status1211234567890.xml 같은 파일명의 버그 막기 위해 사용
        }).closest('.file_wrap').children('.btn_customize_file').css({
            float               : 'left',
            width               : this.options.buttonWidth + 'px',
            height              : this.options.height + 'px',
            marginLeft          : this.options.buttonSpacing + 'px',
            display             : 'inline',
            position            : 'relative',
            overflow            : 'hidden'
        }).find('input[type="file"]').css({
            position            : 'absolute',
            top                 : 0,
            left                : '-90px',
            zIndex              : 100,
            width               : (this.options.buttonWidth + 90) + 'px',
            height              : this.options.height + 'px',
            opacity             : 0,
            filter              : 'alpha(opacity=0)',
            '-ms-filter'        : '“alpha(opacity=0)”',
            '-moz-opacity'      : 0,
            '-khtml-opacity'    : 0,
            zoom                : 1,
            cursor              : 'pointer',
            border              : '0'
        });
        
        var $elementParent = $element.parent();
        
        if(this.options.buttonType === 'text') {
            $elementParent.css({
                background      : this.options.buttonBackgroundColor,
                color           : this.options.buttonTextColor
            }).find('.text').css({
                position        : 'absolute',
                top             : 0,
                left            : 0,
                zIndex          : 100,
                display         : 'inline-block',
                width           : this.options.buttonWidth + 'px',
                textAlign       : 'center'
            });
        }
        else if(this.options.buttonType === 'bg_sprite') {
            $elementParent.css({
                color           : this.options.buttonTextColor
            }).find('.text').css({
                position        : 'absolute',
                top             : 0,
                left            : 0,
                zIndex          : 100,
                display         : 'inline-block',
                width           : this.options.buttonWidth + 'px',
                textAlign       : 'center'
            }).addClass(this.options.buttonSpriteClass);
        }
        else if(this.options.buttonType === 'image') {
            $elementParent.css({
                background      : 'url("' + this.options.buttonBackgroundImage + '") no-repeat'
            });
        }
        
        if(this.options.enableInitButton) {
            var $fileText = $element.closest('.file_wrap').children('.file_text');
            
            $fileText.css({
                width             : (this.options.textWidth - 17) + 'px',
                padding           : this.options.textPaddingVertical + ' 20px ' + this.options.textPaddingVertical + ' ' + this.options.textPaddingHorizontal + 'px'
            }).children('.btn_file_init').css({
                position          : 'absolute',
                top               : '0',
                right             : '5px',
                display           : 'none'
            }).children('img').css({
                verticalAlign       : 'middle'
            });
        }
        
        this.$element = $element;
    };
    
    // File event
    File.prototype._event = function() {
        var that = this;
        
        this.$element.change(function() {
            var $fileText = $(this).closest('.file_wrap').children('.file_text');
            
            $fileText.children('.ellipsis').text($(this).val()).attr('title', $(this).val()).ellipsis({
                position: that.options.ellipsisPosition
            });
            
            if(that.options.enableInitButton) {
                var $btnFileInit = $fileText.children('.btn_file_init');
                
                if($(this).val() === null || $(this).val() === '') {
                    $btnFileInit.hide();
                }
                else {
                    $btnFileInit.show();
                }
            }
        });
        
        if(this.options.enableInitButton) {
            this.$element.closest('.file_wrap').children('.file_text')
                    .children('.btn_file_init').on('click', function() {
                $(this).closest('.file_text').children('.ellipsis').text('');

                // input type file clear
                var $file = $(this).closest('.file_wrap').children('.btn_customize_file')
                        .children('.customizeFile');
                $file.val('');
//                $file.val('').replaceWith( $file.clone(true) );
                
                $(this).hide();
            });
        }
    };
    
    // Select Class
    function Select(element, options) {
        this._pluginInfo = pluginInfo;
        
        this.defaults = {
                width                   : 90,
                paddingHorizontal       : 15,
                height                  : 30,
                fontSize                : 12,
                color                   : '#a0a0a0',
                disableColor            : '#d0d0d1',
                hoverColor              : '#fc5d2a',
                initClass               : 'custom-form-select01',
                focusClass              : 'custom-form-focused01',
                disableClass            : 'custom-form-disabled01'
        };
        
        this.$element = element;
        this.options = $.extend({}, this.defaults, options);
        
        return this.init();
    }
    

    // Select initialize
    Select.prototype.init = function() {
        var that = this;

        this._draw();
        
        return this.$element.each(function(index) {
            var $object = $(this);
            var $coverElement = $object.prev('.custom_select');
            
            that._changeStatus($object, $coverElement);
            that._event($object, $coverElement);
        });
    };
    
    // draw structure
    Select.prototype._draw = function() {
        var $coverElements = $('<span></span>').css({
            color               : this.options.color,
            width               : this.options.width + 'px',
            padding             : '0 ' + this.options.paddingHorizontal + 'px',
            height              : this.options.height + 'px',
            lineHeight          : this.options.height + 'px',
            fontSize            : this.options.fontSize + 'px',
            overflow            : 'hidden', 
            position            : 'absolute'
        }).addClass('custom_select');
        
        this.$element.css({
            width               : this.options.width + (this.options.paddingHorizontal * 2) + 'px',
            height              : this.options.height + 'px',
            lineHeight          : (this.options.height - 4) + 'px',     // instead of line-height(safari browser don't
                                                                        // work height)
            position            : 'relative',
            opacity             : 0,
            filter              : 'alpha(opacity=0)',
            '-ms-filter'        : 'alpha(opacity=0)',
            '-moz-opacity'      : 0,
            '-khtml-opacity'    : 0,
            zIndex              : 100
        }).before($coverElements);
    };
    
    // change select status
    Select.prototype._changeStatus = function($object, $coverElement) {
        var coverClass = this.options.initClass;
        var coverColor = this.options.color;
        
        if($object.prop('disabled')) {
            coverClass = this.options.disableClass;
            coverColor = this.options.disableColor;
        }
        
        $coverElement.removeClass(this.options.initClass).removeClass(this.options.focusClass)
        .removeClass(this.options.disableClass)
        .addClass(coverClass).text($object.find(':selected').html()).css({
            color: coverColor
        });
    };
    
    // Select event
    Select.prototype._event = function($object, $coverElement) {
        var that = this;
        
        $(document).bind('changeSelectValue', function(event, $object, $coverElement) {
            var optionName = $object.find('option:selected').html();
            $coverElement.html(optionName);
        });
        
        $object.on('click keyup', function () {
        	$(document).trigger('changeSelectValue', [$object, $coverElement]);        	
        }).on('focus', function() {
        	var color = that.options.hoverColor;
            if($object.prop('disabled')) {                
                color = that.options.disableColor;
            }
            
        	$coverElement.addClass(that.options.focusClass).css({
                color : color
            });
            
            $(document).trigger('changeSelectValue', [$object, $coverElement]);
        }).on('blur', function() {
        	var color = that.options.color;
            if($object.prop('disabled')) {                
                color = that.options.disableColor;
            }
            
        	$coverElement.removeClass(that.options.focusClass).css({
                color : color
            });
        }).on('change', function() {
        	that._changeStatus($object, $coverElement);
        	$(document).trigger('changeSelectValue', [$object, $coverElement]);
            
            $object.trigger('blur');
        });        
    };
    
    $.fn.customizeCheckbox = function(options) {
        return new Checkbox($(this), options);
    };
    
    $.fn.customizeRadio = function(options) {
        return new Radio($(this), options);
    };
    
    $.fn.customizeFile = function(options) {
        return new File($(this), options);
    };
    
    $.fn.customizeSelect = function(options) {
        return new Select($(this), options);
    };
}));