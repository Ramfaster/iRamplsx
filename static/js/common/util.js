var homUtil = (function ( $ )
{
    'use strict';

    // date.js - http://www.mattkruse.com/javascript/date/
    var MONTH_NAMES = new Array ( 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec' );
    var DAY_NAMES = new Array ( 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun',
            'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' );

    function LZ ( x )
    {
        return (x < 0 || x > 9 ? '' : '0') + x;
    }

    function isDate ( val, format )
    {
        var date = getDateFromFormat ( val, format );
        if ( date === 0 )
        {
            return false;
        }
        return true;
    }

    function compareDates ( date1, dateformat1, date2, dateformat2 )
    {
        var d1 = getDateFromFormat ( date1, dateformat1 );
        var d2 = getDateFromFormat ( date2, dateformat2 );
        if ( d1 === 0 || d2 === 0 )
        {
            return -1;
        } else if ( d1 > d2 )
        {
            return 1;
        }
        return 0;
    }

    function formatDate ( date, format )
    {
        format = format + '';
        var result = '';
        var i_format = 0;
        var c = '';
        var token = '';
        var y = date.getYear () + '';
        var M = date.getMonth () + 1;
        var d = date.getDate ();
        var E = date.getDay ();
        var H = date.getHours ();
        var m = date.getMinutes ();
        var s = date.getSeconds ();
        var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
        var value = {};
        if ( y.length < 4 )
        {
            y = '' + (y - 0 + 1900);
        }
        value.y = '' + y;
        value.yyyy = y;
        value.yy = y.substring ( 2, 4 );
        value.M = M;
        value.MM = LZ ( M );
        value.MMM = MONTH_NAMES[M - 1];
        value.NNN = MONTH_NAMES[M + 11];
        value.d = d;
        value.dd = LZ ( d );
        value.E = DAY_NAMES[E + 7];
        value.EE = DAY_NAMES[E];
        value.H = H;
        value.HH = LZ ( H );
        if ( H === 0 )
        {
            value.h = 12;
        } else if ( H > 12 )
        {
            value.h = H - 12;
        } else
        {
            value.h = H;
        }
        value.hh = LZ ( value.h );
        if ( H > 11 )
        {
            value.K = H - 12;
        } else
        {
            value.K = H;
        }
        value.k = H + 1;
        value.KK = LZ ( value.K );
        value.kk = LZ ( value.k );
        if ( H > 11 )
        {
            value.a = 'PM';
        } else
        {
            value.a = 'AM';
        }
        value.m = m;
        value.mm = LZ ( m );
        value.s = s;
        value.ss = LZ ( s );
        while ( i_format < format.length )
        {
            c = format.charAt ( i_format );
            token = '';
            while ( (format.charAt ( i_format ) == c) && (i_format < format.length) )
            {
                token += format.charAt ( i_format++ );
            }
            if ( value[token] !== null && value[token] !== undefined )
            {
                result = result + value[token];
            } else
            {
                result = result + token;
            }
        }
        return result;
    }

    function _isInteger ( val )
    {
        var digits = '1234567890';
        for ( var i = 0; i < val.length; i++ )
        {
            if ( digits.indexOf ( val.charAt ( i ) ) == -1 )
            {
                return false;
            }
        }
        return true;
    }

    function _getInt ( str, i, minlength, maxlength )
    {
        for ( var x = maxlength; x >= minlength; x-- )
        {
            var token = str.substring ( i, i + x );
            if ( token.length < minlength )
            {
                return null;
            }
            if ( _isInteger ( token ) )
            {
                return token;
            }
        }
        return null;
    }

    function getDateFromFormat ( val, format )
    {
        val = val + '';
        format = format + '';
        var i_val = 0;
        var i_format = 0;
        var c = '';
        var token = '';
        var x, y;
        var now = new Date ();
        var year = now.getYear ();
        var month = now.getMonth () + 1;
        var date = 1;
        var hh = now.getHours ();
        var mm = now.getMinutes ();
        var ss = now.getSeconds ();
        var ampm = '';
        while ( i_format < format.length )
        {
            c = format.charAt ( i_format );
            token = '';
            while ( (format.charAt ( i_format ) == c) && (i_format < format.length) )
            {
                token += format.charAt ( i_format++ );
            }
            if ( token == 'yyyy' || token == 'yy' || token == 'y' )
            {
                if ( token == 'yyyy' )
                {
                    x = 4;
                    y = 4;
                }
                if ( token == 'yy' )
                {
                    x = 2;
                    y = 2;
                }
                if ( token == 'y' )
                {
                    x = 2;
                    y = 4;
                }
                year = _getInt ( val, i_val, x, y );
                if ( year === null )
                {
                    return 0;
                }
                i_val += year.length;
                if ( year.length == 2 )
                {
                    if ( year > 70 )
                    {
                        year = 1900 + (year - 0);
                    } else
                    {
                        year = 2000 + (year - 0);
                    }
                }
            } else if ( token == 'MMM' || token == 'NNN' )
            {
                month = 0;
                for ( var i = 0; i < MONTH_NAMES.length; i++ )
                {
                    var month_name = MONTH_NAMES[i];
                    if ( val.substring ( i_val, i_val + month_name.length ).toLowerCase () == month_name.toLowerCase () )
                    {
                        if ( token == 'MMM' || (token == 'NNN' && i > 11) )
                        {
                            month = i + 1;
                            if ( month > 12 )
                            {
                                month -= 12;
                            }
                            i_val += month_name.length;
                            break;
                        }
                    }
                }
                if ( (month < 1) || (month > 12) )
                {
                    return 0;
                }
            } else if ( token == 'EE' || token == 'E' )
            {
                for ( var j = 0; j < DAY_NAMES.length; j++ )
                {
                    var day_name = DAY_NAMES[j];
                    if ( val.substring ( i_val, i_val + day_name.length ).toLowerCase () == day_name.toLowerCase () )
                    {
                        i_val += day_name.length;
                        break;
                    }
                }
            } else if ( token == 'MM' || token == 'M' )
            {
                month = _getInt ( val, i_val, token.length, 2 );
                if ( month === null || (month < 1) || (month > 12) )
                {
                    return 0;
                }
                i_val += month.length;
            } else if ( token == 'dd' || token == 'd' )
            {
                date = _getInt ( val, i_val, token.length, 2 );
                if ( date === null || (date < 1) || (date > 31) )
                {
                    return 0;
                }
                i_val += date.length;
            } else if ( token == 'hh' || token == 'h' )
            {
                hh = _getInt ( val, i_val, token.length, 2 );
                if ( hh === null || (hh < 1) || (hh > 12) )
                {
                    return 0;
                }
                i_val += hh.length;
            } else if ( token == 'HH' || token == 'H' )
            {
                hh = _getInt ( val, i_val, token.length, 2 );
                if ( hh === null || (hh < 0) || (hh > 23) )
                {
                    return 0;
                }
                i_val += hh.length;
            } else if ( token == 'KK' || token == 'K' )
            {
                hh = _getInt ( val, i_val, token.length, 2 );
                if ( hh === null || (hh < 0) || (hh > 11) )
                {
                    return 0;
                }
                i_val += hh.length;
            } else if ( token == 'kk' || token == 'k' )
            {
                hh = _getInt ( val, i_val, token.length, 2 );
                if ( hh === null || (hh < 1) || (hh > 24) )
                {
                    return 0;
                }
                i_val += hh.length;
                hh--;
            } else if ( token == 'mm' || token == 'm' )
            {
                mm = _getInt ( val, i_val, token.length, 2 );
                if ( mm === null || (mm < 0) || (mm > 59) )
                {
                    return 0;
                }
                i_val += mm.length;
            } else if ( token == 'ss' || token == 's' )
            {
                ss = _getInt ( val, i_val, token.length, 2 );
                if ( ss === null || (ss < 0) || (ss > 59) )
                {
                    return 0;
                }
                i_val += ss.length;
            } else if ( token == 'a' )
            {
                if ( val.substring ( i_val, i_val + 2 ).toLowerCase () == 'am' )
                {
                    ampm = 'AM';
                } else if ( val.substring ( i_val, i_val + 2 ).toLowerCase () == 'pm' )
                {
                    ampm = 'PM';
                } else
                {
                    return 0;
                }
                i_val += 2;
            } else
            {
                if ( val.substring ( i_val, i_val + token.length ) != token )
                {
                    return 0;
                } else
                {
                    i_val += token.length;
                }
            }
        }
        if ( i_val != val.length )
        {
            return 0;
        }
        if ( month == 2 )
        {
            if ( ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) )
            {
                if ( date > 29 )
                {
                    return 0;
                }
            } else
            {
                if ( date > 28 )
                {
                    return 0;
                }
            }
        }
        if ( (month == 4) || (month == 6) || (month == 9) || (month == 11) )
        {
            if ( date > 30 )
            {
                return 0;
            }
        }
        if ( hh < 12 && ampm == 'PM' )
        {
            hh = hh - 0 + 12;
        } else if ( hh > 11 && ampm == 'AM' )
        {
            hh -= 12;
        }
        var newdate = new Date ( year, month - 1, date, hh, mm, ss );
        return newdate.getTime ();
    }

    function parseDate ( val )
    {
        var preferEuro = (arguments.length == 2) ? arguments[1] : false;
        var generalFormats = new Array ( 'y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d' );
        var monthFirst = new Array ( 'M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d' );
        var dateFirst = new Array ( 'd/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M' );
        var checkList = new Array ( generalFormats, preferEuro ? dateFirst : monthFirst, preferEuro ? monthFirst
                : dateFirst );
        var d = null;
        for ( var i = 0; i < checkList.length; i++ )
        {
            var l = checkList[i];
            for ( var j = 0; j < l.length; j++ )
            {
                d = getDateFromFormat ( val, l[j] );
                if ( d !== 0 )
                {
                    return new Date ( d );
                }
            }
        }
        return null;
    }
    // date.js - http://www.mattkruse.com/javascript/date/

    return {
        isDemo : true,
        isDebug : true,
        // 로그 출력
        log : function ( object )
        {
            if ( this.isDebug && console )
            {
                console.log ( object );
            }
        },
        // 로그 출력
        // ex) util.logParam('{}, {}, {}','A','B','C'); -> A, B, C
        logParam : function ()
        {
            var str = arguments[0];
            for ( var i = 1, length = arguments.length; i < length; i++ )
            {
                str = str.replace ( '{}', arguments[i] );
            }
            return str;
        },
        // 파라미터 변환
        // ex) util.replaceParam('{0}, {1}, {2}','A','B','C'); -> A, B, C
        replaceParam : function ()
        {
            var str = arguments[0];
            for ( var i = 1, length = arguments.length; i < length; i++ )
            {
                str = str.replace ( '{' + (i - 1) + '}', arguments[i] );
            }

            return str;
        },
        // 쿠키 가져오기
        // ex) util.getCookie('test');
        getCookie : function ( name )
        {
            name = name + '=';
            var cookie = document.cookie;
            var start = cookie.indexOf ( name );
            var value = '';

            if ( start != -1 )
            {
                start += name.length;
                var end = cookie.indexOf ( ';', start );
                if ( end == -1 )
                {
                    end = cookie.length;
                }

                value = cookie.substring ( start, end );
            }

            return unescape ( value );
        },
        // 쿠키 생성
        // ex) util.setCookie('test', 값, 날짜);
        setCookie : function ( name, value, day )
        {
            var expire = new Date ();
            expire.setDate ( expire.getDate () + day );
            var cookie = name + '=' + escape ( value ) + '; path=/ '; // 한글 깨짐을 막기위해 escape(value)를 합니다.

            if ( typeof day != 'undefined' )
            {
                cookie += ';expires=' + expire.toGMTString () + ';';
            }

            document.cookie = cookie;
        },
        // lpad function
        // ex) util.lpad('11',4,'0'); -> 0011
        lpad : function ( string, length, paddingString )
        {
            var result = string.toString ();
            var size = length - result.length;

            for ( var i = 0; i < size; i++ )
            {
                result = paddingString + result;
            }

            return result;
        },
        // rpad function
        // ex) util.rpad('11',4,'0'); -> 1100
        rpad : function ( string, length, paddingString )
        {
            var result = string.toString ();
            var size = length - result.length;

            for ( var i = 0; i < size; i++ )
            {
                result = result + paddingString;
            }

            return result;
        },
        // 일시정지
        // util.sleep('시간(초)');
        sleep : function ( second )
        {
            var now = new Date ();
            var stop = now.getDate () + second;
            while ( true )
            {
                now = new Date ();
                if ( now.getTime () > stop )
                {
                    break;
                }
            }
        },
        // date 관련 format 정의
        // util.dateFormat.formatYYYYMMDDHHMMSS
        dateFormat : {
            formatYYYYMMDDHHMMSS : 'yyyyMMddHHmmss',
            formatYYYYMMDDHHMM : 'yyyyMMddHHmm',
            formatYYYYMMDDHH : 'yyyyMMddHH',
            formatYYYYMMDD : 'yyyyMMdd',
            formatYYMMDD : 'yyMMdd',
            formatYYYYMM : 'yyyyMM',
            formatYYYY : 'yyyy',
            formatMMDD : 'MMdd',
            formatDotYYYYMMDDHHMMSS : 'yyyy.MM.dd HH:mm:ss',
            formatDotYYYYMMDDHHMM : 'yyyy.MM.dd HH:mm',
            formatDotYYYYMMDDHH : 'yyyy.MM.dd HH',
            formatDotYYYYMMDD : 'yyyy.MM.dd',
            formatDotYYMMDD : 'yy.MM.dd',
            formatDotYYYYMM : 'yyyy.MM',
            convertPureYYYYMMDDHHMMSS : 'yyyyMMddHHmmss',
            convertYYYYMMDDHHMMSS : 'yyyy-MM-dd HH:mm:ss',
            convertYYYYMMDDHHMM : 'yyyy-MM-dd HH:mm',
            convertYYYYMMDDHH : 'yyyy-MM-dd HH',
            convertYYYYMMDD : 'yyyy-MM-dd',
            convertYYMMDD : 'yy-MM-dd',
            convertYYYYMM : 'yyyy-MM',
            convertYYYY : 'yyyy',
            convertMMDD : 'MM-dd',
            convertMM : 'MM',
            convertDD : 'dd',
            convertHH : 'HH',
            convertHHMM : 'HH:mm',
            convertHHMMSS : 'HH:mm:ss',
            convertDotYYYYMMDDHHMMSS : 'yyyy.MM.dd HH:mm:ss',
            convertDotYYYYMMDDHHMM : 'yyyy.MM.dd HH:mm',
            convertDotYYYYMMDDHH : 'yyyy.MM.dd HH',
            convertDotYYYYMMDD : 'yyyy.MM.dd',
            convertDotYYMMDD : 'yy.MM.dd',
            convertDotYYYYMM : 'yyyy.MM',
            convertmm : 'mm'
        },
        // 문자 형식의 날짜를 long 타입으로 리턴
        // ex) util.convertDateStringToLong('20160524');
        convertDateStringToLong : function ( string )
        {
            var length = string.length;
            var year = null;
            var month = null;
            var dayOfMonth = null;
            var hours = null;
            var minutes = null;
            var seconds = null;
            var flag = false;

            if ( length === this.dateFormat.formatYYYYMMDDHHMMSS.length )
            {
                year = parseInt ( string.substring ( 0, 4 ) );
                month = parseInt ( string.substring ( 4, 6 ) ) - 1;
                dayOfMonth = parseInt ( string.substring ( 6, 8 ) );
                hours = parseInt ( string.substring ( 8, 10 ) );
                minutes = parseInt ( string.substring ( 10, 12 ) );
                seconds = parseInt ( string.substring ( 12, 14 ) );

                flag = true;
            } else if ( length === this.dateFormat.formatYYYYMMDDHHMM.length )
            {
                year = parseInt ( string.substring ( 0, 4 ) );
                month = parseInt ( string.substring ( 4, 6 ) ) - 1;
                dayOfMonth = parseInt ( string.substring ( 6, 8 ) );
                hours = parseInt ( string.substring ( 8, 10 ) );
                minutes = parseInt ( string.substring ( 10, 12 ) );
                seconds = 0;

                flag = true;
            } else if ( length === this.dateFormat.formatYYYYMMDDHH.length )
            {
                year = parseInt ( string.substring ( 0, 4 ) );
                month = parseInt ( string.substring ( 4, 6 ) ) - 1;
                dayOfMonth = parseInt ( string.substring ( 6, 8 ) );
                hours = parseInt ( string.substring ( 8, 10 ) );
                minutes = 0;
                seconds = 0;

                flag = true;
            } else if ( length == this.dateFormat.formatYYYYMMDD.length )
            {
                year = parseInt ( string.substring ( 0, 4 ) );
                month = parseInt ( string.substring ( 4, 6 ) ) - 1;
                dayOfMonth = parseInt ( string.substring ( 6, 8 ) );
                hours = 0;
                minutes = 0;
                seconds = 0;

                flag = true;
            } else if ( length == this.dateFormat.formatYYYYMM.length )
            {
                year = parseInt ( string.substring ( 0, 4 ) );
                month = parseInt ( string.substring ( 4, 6 ) ) - 1;
                dayOfMonth = 1;
                hours = 0;
                minutes = 0;
                seconds = 0;

                flag = true;
            } else if ( length == this.dateFormat.formatYYYY.length )
            {
                year = parseInt ( string.substring ( 0, 4 ) );
                month = 0;
                dayOfMonth = 1;
                hours = 0;
                minutes = 0;
                seconds = 0;

                flag = true;
            }

            var milliseconds = null;

            if ( flag )
            {
                var date = new Date ( year, month, dayOfMonth, hours, minutes, seconds );
                milliseconds = date.getTime ();
            }

            return milliseconds;
        },
        // long형식의 날짜를 string 타입으로 리턴
        // ex) util.convertDateLongToString(12345...12, util.dateFormat.convertYYYYMMDDHHMMSS);
        convertDateLongToString : function ( long, convert )
        {
            var date = new Date ( long );
            return formatDate ( date, convert );
        },
        // string형식의 날짜를 date 형식에 맞춘 format으로 리턴(yyyymmdd -> yyyy-mm-dd)
        // ex) util.convertDateStringToFormat('20160524', util.dateFormat.formatYYYYMMDD); -> 2016-05-24
        convertDateStringToFormat : function ( string, formatType )
        {
            var format = null;
            var convert = null;
            var date = null;
            var length = string.length;

            if ( formatType === this.dateFormat.formatYYYYMMDDHHMMSS
                    && length === this.dateFormat.formatYYYYMMDDHHMMSS.length )
            {
                format = this.dateFormat.formatYYYYMMDDHHMMSS;
                convert = this.dateFormat.convertYYYYMMDDHHMMSS;
            } else if ( formatType === this.dateFormat.formatYYYYMMDDHHMM
                    && length === this.dateFormat.formatYYYYMMDDHHMM.length )
            {
                format = this.dateFormat.formatYYYYMMDDHHMM;
                convert = this.dateFormat.convertYYYYMMDDHHMM;
            } else if ( formatType === this.dateFormat.formatYYYYMMDD
                    && length === this.dateFormat.formatYYYYMMDD.length )
            {
                format = this.dateFormat.formatYYYYMMDD;
                convert = this.dateFormat.convertYYYYMMDD;
            } else if ( formatType === this.dateFormat.formatYYYYMM && length === this.dateFormat.formatYYYYMM.length )
            {
                format = this.dateFormat.formatYYYYMM;
                convert = this.dateFormat.convertYYYYMM;
            }
            // mmdd 형식은 yyyymmdd로 변경 후 mmdd로 convert
            else if ( formatType === this.dateFormat.formatMMDD && length > this.dateFormat.formatMMDD.length )
            {
                format = this.dateFormat.formatYYYYMMDD;
                convert = this.dateFormat.convertMMDD;
            } else if ( formatType === this.dateFormat.formatDotYYYYMMDDHHMMSS
                    && length === this.dateFormat.formatYYYYMMDDHHMMSS.length )
            {
                format = this.dateFormat.formatYYYYMMDDHHMMSS;
                convert = this.dateFormat.convertDotYYYYMMDDHHMMSS;
            } else if ( formatType === this.dateFormat.formatDotYYYYMMDDHHMM
                    && length === this.dateFormat.formatYYYYMMDDHHMM.length )
            {
                format = this.dateFormat.formatYYYYMMDDHHMM;
                convert = this.dateFormat.convertDotYYYYMMDDHHMM;
            } else if ( formatType === this.dateFormat.formatDotYYYYMMDDHH
                    && length === this.dateFormat.formatYYYYMMDDHH.length )
            {
                format = this.dateFormat.formatYYYYMMDDHH;
                convert = this.dateFormat.convertDotYYYYMMDDHH;
            } else if ( formatType === this.dateFormat.formatDotYYYYMMDD
                    && length === this.dateFormat.formatYYYYMMDD.length )
            {
                format = this.dateFormat.formatYYYYMMDD;
                convert = this.dateFormat.convertDotYYYYMMDD;
            } else if ( formatType === this.dateFormat.formatDotYYYYMM
                    && length === this.dateFormat.formatYYYYMM.length )
            {
                format = this.dateFormat.formatYYYYMM;
                convert = this.dateFormat.convertDotYYYYMM;
            } else if ( formatType === this.dateFormat.formatDotYYMMDD
                    && length === this.dateFormat.formatYYYYMMDD.length )
            {
                format = this.dateFormat.formatYYYYMMDD;
                convert = this.dateFormat.convertDotYYMMDD;
            } else if ( formatType === this.dateFormat.formatYYMMDD && length === this.dateFormat.formatYYYYMMDD.length )
            {
                format = this.dateFormat.formatYYYYMMDD;
                convert = this.dateFormat.convertYYMMDD;
            } else if ( formatType === this.dateFormat.formatYYYY && length === this.dateFormat.formatYYYY.length )
            {
                format = this.dateFormat.formatYYYY;
                convert = this.dateFormat.convertYYYY;
            }

            date = new Date ( getDateFromFormat ( string, format ) );

            return formatDate ( date, convert );
        },
        // 포맷화된 string형식 날짜를 pure 형태의 string 형식으로 리턴(yyyy-mm-dd -> yyyymmdd)
        // ex) util.convertDateStringToPureFormat('2016-05-24 09:44') -> 201605240944
        convertDateStringToPureFormat : function ( string )
        {
            string = string.replace ( /\-/g, '' );
            string = string.replace ( /\:/g, '' );
            string = string.replace ( /\s/g, '' );

            return string;
        },
        // 시간타입에 따라 fromDate - toDate 리턴
        // ex) var date = util.getFromToDate('MI', false, 3);
        // date.fromDate -> "2016-05-24 07:57"
        // date.toDate -> "2016-05-24 09:59"
        getFromToDate : function ( timeType, toDateInterval, fromDateInterval )
        {
            var now = new Date ();
            var toDate = null;
            var fromDate = null;
            var date = null;

            // 유효하지 않은 값이 왔을 경우 YE로 기본 세팅
            if ( !(timeType === 'YE' || timeType === 'MO' || timeType === 'DA' || timeType === 'HO'
                    || timeType === 'MI' || timeType === 'SE') )
            {
                timeType = 'YE';
            }

            if ( timeType === 'YE' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 2;
                }

                toDate = formatDate ( now, this.dateFormat.convertYYYY );
                now.setFullYear ( now.getFullYear () - toDateInterval + 1 );
                fromDate = formatDate ( now, this.dateFormat.convertYYYY );
            } else if ( timeType === 'MO' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 12;
                }

                toDate = formatDate ( now, this.dateFormat.convertYYYYMM );
                now.setMonth ( now.getMonth () - toDateInterval + 1 );
                fromDate = formatDate ( now, this.dateFormat.convertYYYYMM );
            } else if ( timeType === 'DA' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 31;
                }

                // 현재일의 하루전
                date = now.getDate ();
                now.setDate ( date - 1 );

                toDate = formatDate ( now, this.dateFormat.convertYYYYMMDD );
                now.setDate ( now.getDate () - toDateInterval + 1 );
                fromDate = formatDate ( now, this.dateFormat.convertYYYYMMDD );
            } else if ( timeType === 'HO' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 48;
                }

                now.setMinutes ( 0 );

                if ( fromDateInterval )
                {
                    now.setHours ( now.getHours () - fromDateInterval );
                    toDateInterval = toDateInterval + fromDateInterval;
                }

                toDate = formatDate ( now, this.dateFormat.convertYYYYMMDDHHMM );
                now.setHours ( now.getHours () - toDateInterval + 1 );
                now.setMinutes ( 0 );
                fromDate = formatDate ( now, this.dateFormat.convertYYYYMMDDHHMM );
            } else if ( timeType === 'MI' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 120;
                }

                if ( fromDateInterval )
                {
                    now.setMinutes ( now.getMinutes () - fromDateInterval );
                    toDateInterval = toDateInterval + fromDateInterval;
                }

                toDate = formatDate ( now, this.dateFormat.convertYYYYMMDDHHMM );
                now.setMinutes ( now.getMinutes () - toDateInterval + 1 );
                fromDate = formatDate ( now, this.dateFormat.convertYYYYMMDDHHMM );
            } else if ( timeType === 'SE' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 600;
                }

                if ( !fromDateInterval )
                {
                    fromDateInterval = 0;
                }

                toDate = formatDate ( now, this.dateFormat.convertYYYYMMDDHHMMSS );
                now.setSeconds ( now.getSeconds () - toDateInterval );
                fromDate = formatDate ( now, this.dateFormat.convertYYYYMMDDHHMMSS );
            }

            return {
                fromDate : fromDate,
                toDate : toDate
            };
        },
        // local 시간의 시간타입에 따라 fromDate - toDate 리턴
        // Y - year, M - month, D - day, MI - Minute
        // 
        // ex) var date = util.getFromToDate(date, 'D', false, 3);
        // date.fromDate -> "2016-05-24 07:57"
        // date.toDate -> "2016-05-24 09:59"
        getLocalFromToDate : function ( localDate, dateType, toDateInterval, fromDateInterval )
        {
            var toDate = null;
            var fromDate = null;
            var localDateByDate = null;
            var localCopyDate = null;

            // 객체값 변경을 막기 위해 deep copy
            if ( typeof localDate !== 'undefined' && localDate !== null )
            {
                localCopyDate = new Date ();
                localCopyDate.setTime ( localDate.getTime () );
            }

            // 유효하지 않은 날짜 타입일 경우 D로 세팅
            if ( !(dateType === 'Y' || dateType === 'M' || dateType === 'D' || dateType === 'H' || dateType === 'MI') )
            {
                dateType = 'D';
            }

            if ( dateType === 'Y' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 6;
                }

                toDate = formatDate ( localCopyDate, this.dateFormat.convertYYYY );
                localCopyDate.setFullYear ( localCopyDate.getFullYear () - toDateInterval + 1 );
                fromDate = formatDate ( localCopyDate, this.dateFormat.convertYYYY );
            } else if ( dateType === 'M' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 12;
                }

                toDate = formatDate ( localCopyDate, this.dateFormat.convertYYYYMM );
                localCopyDate.setMonth ( localCopyDate.getMonth () - toDateInterval + 1 );
                fromDate = formatDate ( localCopyDate, this.dateFormat.convertYYYYMM );
            } else if ( dateType === 'D' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 7;
                }

                toDate = formatDate ( localCopyDate, this.dateFormat.convertYYYYMMDD );
                localCopyDate.setDate ( localCopyDate.getDate () - toDateInterval + 1 );
                fromDate = formatDate ( localCopyDate, this.dateFormat.convertYYYYMMDD );
            } else if ( dateType === 'H' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 24;
                }

                localCopyDate.setMinutes ( 0 );

                if ( fromDateInterval )
                {
                    localCopyDate.setHours ( localCopyDate.getHours () - fromDateInterval );
                    toDateInterval = toDateInterval + fromDateInterval;
                }

                toDate = formatDate ( localCopyDate, this.dateFormat.convertYYYYMMDDHHMM );
                localCopyDate.setHours ( localCopyDate.getHours () - toDateInterval + 1 );
                localCopyDate.setMinutes ( 0 );
                fromDate = formatDate ( localCopyDate, this.dateFormat.convertYYYYMMDDHHMM );
            } else if ( dateType === 'MI' )
            {
                if ( !toDateInterval )
                {
                    toDateInterval = 1440;
                }

                toDate = formatDate ( localCopyDate, this.dateFormat.convertYYYYMMDDHHMM );
                localCopyDate.setMinutes ( localCopyDate.getMinutes () - toDateInterval + 1 );
                fromDate = formatDate ( localCopyDate, this.dateFormat.convertYYYYMMDDHHMM );
            }

            return {
                fromDate : fromDate,
                toDate : toDate
            };
        },
        // 해당 날짜에 간격에 해당하는 날짜 리턴
        // ex) var date = util.getIntervalDate(new Date(), 'MI', 3);
        // 현재시간 : 2016-05-24 10:14 -> date : 2016-05-24 10:17
        getIntervalDate : function ( paramDate, selectedType, interval )
        {
            var intervalDate = null;
            var date = null;

            // 객체값 변경을 막기 위해 deep copy
            if ( typeof paramDate !== 'undefined' && paramDate !== null )
            {
                date = new Date ();
                date.setTime ( paramDate.getTime () );
            }

            if ( selectedType === 'YE' )
            {
                date.setFullYear ( date.getFullYear () + interval );
                intervalDate = formatDate ( date, this.dateFormat.convertYYYY );
            } else if ( selectedType === 'MO' )
            {
                date.setMonth ( date.getMonth () + interval );
                intervalDate = formatDate ( date, this.dateFormat.convertYYYYMM );
            } else if ( selectedType === 'DA' )
            {
                date.setDate ( date.getDate () + interval );
                intervalDate = formatDate ( date, this.dateFormat.convertYYYYMMDD );
            } else if ( selectedType === 'HO' )
            {
                date.setHours ( date.getHours () + interval );
                date.setMinutes ( 0 );
                intervalDate = formatDate ( date, this.dateFormat.convertYYYYMMDDHHMM );
            } else if ( selectedType === 'MI' )
            {
                date.setMinutes ( date.getMinutes () + interval );
                intervalDate = formatDate ( date, this.dateFormat.convertYYYYMMDDHHMM );
            }

            return intervalDate;
        },
        // 해당 날짜에 간격에 해당하는 날짜 리턴 (시작/종료 날짜를 동시에 선택하지 않을 때 사용)
        // ex) var date = util.getSearchIntervalDate('2016-05-24', 'D', 3);
        // 현재시간 : 2016-05-24 10:14 -> date : 2016-05-27 10:14
        getSearchIntervalDate : function ( paramDate, selectedType, interval )
        {
            var intervalDate = null;
            var date = new Date ();
            var pureDate = this.convertDateStringToPureFormat ( paramDate );
            date.setTime ( this.convertDateStringToLong ( pureDate ) );

            if ( selectedType === 'Y' )
            {
                if ( !interval )
                {
                    interval = 6;
                }

                date.setFullYear ( date.getFullYear () + interval );
                intervalDate = formatDate ( date, this.dateFormat.convertYYYY );
            } else if ( selectedType === 'M' )
            {
                if ( !interval )
                {
                    interval = 12;
                }

                date.setMonth ( date.getMonth () + interval );
                intervalDate = formatDate ( date, this.dateFormat.convertYYYYMM );
            } else if ( selectedType === 'D' )
            {

                if ( !interval )
                {
                    interval = 7;
                }
                date.setDate ( date.getDate () + interval );
                intervalDate = formatDate ( date, this.dateFormat.convertYYYYMMDD );
            }
            return intervalDate;

        },
        // util.getPeriodDate(); -> 현재달의 첫날부터 오늘-1일 날짜 리턴
        // util.getPeriodDate('201604'); -> 20160401 ~ 20160430 : 해당달의 1일부터 마지막날
        getPeriodDate : function ( yearMonth )
        {
            var now = new Date ();
            var year = now.getFullYear ();
            var month = now.getMonth () + 1;
            var date = now.getDate ();
            var yyyymm = year.toString () + this.lpad ( month, 2, '0' );

            var fromDate = null;
            var toDate = null;

            // 요청날짜(yearMonth)가 이번달일 경우 1일부터 ~ 오늘 -1일로 리턴
            // 오늘날짜가 1일일 경우 전달 1일부터 마지막날까지 리턴
            if ( !yearMonth || yyyymm === yearMonth )
            {
                // 이번달 첫 날짜
                fromDate = yyyymm + this.lpad ( '1', 2, '0' );

                var lastDate = new Date ( year, month - 1, date );
                toDate = lastDate.getFullYear ().toString () + this.lpad ( lastDate.getMonth () + 1, 2, '0' )
                        + this.lpad ( lastDate.getDate (), 2, '0' );

                // 조회날짜가 이번달의 첫 날짜일 경우 이전달 첫날짜로 세팅
                if ( fromDate === toDate )
                {
                    now.setDate ( 0 );

                    year = now.getFullYear ();
                    month = now.getMonth () + 1;

                    fromDate = year.toString () + this.lpad ( month.toString (), 2, '0' ) + this.lpad ( '1', 2, '0' );

                    // 해당월의 마지막 날짜
                    lastDate = new Date ( year, month, 1 );
                    lastDate.setDate ( 0 );

                    toDate = lastDate.getFullYear ().toString () + this.lpad ( lastDate.getMonth () + 1, 2, '0' )
                            + this.lpad ( lastDate.getDate (), 2, '0' );
                } else
                {
                    // 하루전 날짜 세팅
                    lastDate.setDate ( lastDate.getDate () - 1 );
                    toDate = lastDate.getFullYear ().toString () + this.lpad ( lastDate.getMonth () + 1, 2, '0' )
                            + this.lpad ( lastDate.getDate (), 2, '0' );
                }
            }
            // 요청날짜(yearMonth)의 1일부터 ~ 마지막날짜 리턴
            else
            {
                year = yearMonth.substring ( 0, 4 );
                month = yearMonth.substring ( 4, 6 );

                lastDate = new Date ( year, parseInt ( month, 10 ) - 1, 1 );
                fromDate = lastDate.getFullYear ().toString () + this.lpad ( lastDate.getMonth () + 1, 2, '0' )
                        + this.lpad ( lastDate.getDate (), 2, '0' );

                lastDate.setMonth ( parseInt ( month, 10 ) );
                lastDate.setDate ( 0 );
                toDate = lastDate.getFullYear ().toString () + this.lpad ( lastDate.getMonth () + 1, 2, '0' )
                        + this.lpad ( lastDate.getDate (), 2, '0' );
            }

            return {
                fromDate : fromDate,
                toDate : toDate
            };
        },
        // target date에 dayCount만큼 더한 날짜를 반환한다. (yyyymmdd)
        // util.getDayFromTargetDate('20160524',3); -> 20160527
        getDayFromTargetDate : function ( yyyyMMdd, dayCount )
        {
            var date = new Date ( yyyyMMdd.substring ( 0, 4 ), parseInt ( yyyyMMdd.substring ( 4, 6 ), 10 ) - 1,
                    parseInt ( yyyyMMdd.substring ( 6, 8 ), 10 ) );
            date.setDate ( date.getDate () + dayCount );
            var year = date.getFullYear ();
            var month = date.getMonth () + 1;
            var day = date.getDate ();

            return year.toString () + this.lpad ( month.toString (), 2, '0' ) + this.lpad ( day.toString (), 2, '0' );
        },
        // 파라미터로 전달하는 날짜를 포맷에 맞게 리턴
        // homUtil.getParamFormatDate( date, homUtil.dateFormat.convertYYYYMMDD ) -> 2016-05-24
        getParamFormatDate : function ( date, convert )
        {
            return formatDate ( date, convert );
        },
        // 현재날짜를 포맷에 맞게 리턴
        // util.getToday(util.dateFormat.convertYYYYMMDD) -> 2016-05-24
        getToday : function ( convert )
        {
            var date = new Date ();
            return formatDate ( date, convert );
        },
        // 현재년도 리턴
        // util.getCurrenYear(); -> 2016
        getCurrentYear : function ()
        {
            var date = new Date ();
            return parseInt ( formatDate ( date, this.dateFormat.convertYYYY ), 10 );
        },
        // yyyyMMdd 형태에서 yyyyMM 리턴
        // util.getYearMonth('20160524', util.dateFormat.formatYYYYMM); -> 201605
        getYearMonth : function ( yyyyMMdd, format )
        {
            var date = new Date ( getDateFromFormat ( yyyyMMdd, this.dateFormat.formatYYYYMMDD ) );
            return formatDate ( date, format );
        },
        // yyyyMMdd 형태에서 월 리턴
        // util.getMonth('20160524'); -> 5
        getMonth : function ( yyyyMMdd )
        {
            var date = new Date ( getDateFromFormat ( yyyyMMdd, this.dateFormat.formatYYYYMMDD ) );
            var month = formatDate ( date, this.dateFormat.convertMM );

            return parseInt ( month, 10 );
        },
        // yyyyMM 형태에서 이전달 yyyyMM 리턴
        // util.getPrevYearMonth('201605') -> 201604
        getPrevYearMonth : function ( yyyyMM )
        {
            var date = new Date ( yyyyMM.substring ( 0, 4 ), parseInt ( yyyyMM.substring ( 4, 6 ), 10 ) - 1, 1 );
            date.setMonth ( date.getMonth () - 1 );

            var year = date.getFullYear ();
            var month = date.getMonth () + 1;

            return year.toString () + this.lpad ( month.toString (), 2, '0' );
        },
        // yyyyMM 형태에서 다음달 yyyyMM 리턴
        // util.getNextYearMonth('201605') -> 201606
        getNextYearMonth : function ( yyyyMM )
        {
            var date = new Date ( yyyyMM.substring ( 0, 4 ), parseInt ( yyyyMM.substring ( 4, 6 ), 10 ) - 1, 1 );
            date.setMonth ( date.getMonth () + 1 );

            var year = date.getFullYear ();
            var month = date.getMonth () + 1;

            return year.toString () + this.lpad ( month.toString (), 2, '0' );
        },
        // 날짜 유효성 체크
        // util.isDate('201605241037','MI'); -> false
        // util.isDate('2016-05-24 10:37','MI'); -> true
        isDate : function ( paramDate, type )
        {
            var format = null;

            if ( type === 'Y' )
            {
                format = this.dateFormat.convertYYYY;
            } else if ( type === 'M' )
            {
                format = this.dateFormat.convertYYYYMM;
            } else if ( type === 'D' )
            {
                format = this.dateFormat.convertYYYYMMDD;
            } else if ( type === 'H' )
            {
                format = this.dateFormat.convertYYYYMMDDHHMM;
            } else if ( type === 'MI' )
            {
                format = this.dateFormat.convertYYYYMMDDHHMM;
            }

            return isDate ( paramDate, format );
        },

        // 값 반올림 처리
        // util.mathRound(1234.1234, 2) -> 1234.12
        mathRound : function ( value, digit )
        {
            var returnValue = '';

            if ( $.isNumeric ( value ) )
            {
                var divisor = Math.pow ( 10, digit );
                returnValue = Math.round ( value * divisor ) / divisor;
            }

            return returnValue;
        },
        
        // 값 반올림 처리 - 숫자가 아닐 경우 null이 리턴됨
        // util.mathRound(1234.1234, 2) -> 1234.12
        mathRoundChart : function ( value, digit )
        {
            var returnValue = null;

            if ( $.isNumeric ( value ) )
            {
                var divisor = Math.pow ( 10, digit );
                returnValue = Math.round ( value * divisor ) / divisor;
            }

            return returnValue;
        },
        
        // 값 반올림 처리 숫자 콤마 처리 return  - 숫자일 경우 floor 및 콤마 처리된 문자 - 숫자가 아닐 경우 '-' 리턴됨
        // util.mathRound(1234.1234, 2) -> 1,234.12 homUtil.mathRound('test', 1) -> '-'
        mathRoundComma : function ( value, digit )
        {
        	var regEx = /(^[+-]?\d+)(\d{3})/;
        	 
            var returnValue = '';

            if ( $.isNumeric ( value ) )
            {
                var divisor = Math.pow ( 10, digit );
                returnValue = Math.round ( value * divisor ) / divisor;
            }
            
            if ( $.isNumeric ( returnValue ) )
            {
                returnValue = returnValue.toFixed ( digit );
                while ( regEx.test ( returnValue ) )
                {
                    returnValue = returnValue.replace ( regEx, '$1' + ',' + '$2' );
                }
            } else
            {
                returnValue = '-';
            }

            return returnValue;
        },
        /*
         * 값 버림 처리 return - 숫자일 경우 floor 처리된 숫자 - 숫자가 아닐 경우 null이 리턴됨
         * 
         * homUtil.mathFloor(1234.1656, 1) -> 1234.1 homUtil.mathFloor('test', 1) -> null
         */
        mathFloor : function ( value, digit )
        {
            var returnValue = null;
            var parseValue = parseFloat ( value );
            var flag = false;

            // digit 값이 유효하지 않을 경우 소수점 1자리 표현으로 default 처리
            if ( !$.isNumeric ( digit ) )
            {
                digit = 1;
            }

            if ( $.isNumeric ( parseValue ) )
            {
                if ( parseValue < 0 )
                {
                    flag = true;
                }

                parseValue = Math.abs ( parseValue );

                var divisor = Math.pow ( 10, digit );
                returnValue = Math.floor ( parseValue * divisor ) / divisor;

                if ( flag )
                {
                    returnValue = -returnValue;
                }
            }

            return returnValue;
        },
        /*
         * 값 버림 + 숫자 콤마 처리 return - 숫자일 경우 floor 및 콤마 처리된 문자 - 숫자가 아닐 경우 '-' 리턴됨
         * 
         * homUtil.mathFloorComma(1234.1656, 1) -> 1,234.1 homUtil.mathFloorComma('test', 1) -> '-'
         */
        mathFloorComma : function ( value, digit )
        {
            var regEx = /(^[+-]?\d+)(\d{3})/;

            // digit 값이 유효하지 않을 경우 소수점 1자리 표현으로 default 처리
            if ( !$.isNumeric ( digit ) )
            {
                digit = 1;
            }

            var returnValue = this.mathFloor ( value, digit );

            if ( $.isNumeric ( returnValue ) )
            {
                returnValue = returnValue.toFixed ( digit );
                while ( regEx.test ( returnValue ) )
                {
                    returnValue = returnValue.replace ( regEx, '$1' + ',' + '$2' );
                }
            } else
            {
                returnValue = '-';
            }

            return returnValue;
        },
        /*
         * 값 버림 + 절대값 처리 return - 숫자일 경우 floor 및 절대값 처리된 숫자 - 숫자가 아닐 경우 null 리턴됨
         * 
         * homUtil.mathAbsFloor(-1234.1656, 1) -> 1234.1 homUtil.mathAbsFloor('test', 1) -> null
         */
        mathAbsFloor : function ( value, digit )
        {
            var returnValue = this.mathFloor ( value, digit );

            if ( $.isNumeric ( returnValue ) )
            {
                returnValue = Math.abs ( returnValue );
            }

            return returnValue;
        },
        /*
         * 값 버림 + 절대값 + 숫자 콤마 처리 return - 숫자일 경우 floor 및 절대값 및 콤마 처리된 문자 - 숫자가 아닐 경우 '-' 리턴됨
         * 
         * homUtil.mathAbsFloorComma(-1234.1656, 1) -> 1,234.1 homUtil.mathAbsFloorComma('test', 1) -> null
         */
        mathAbsFloorComma : function ( value, digit )
        {
            var regEx = /(^[+-]?\d+)(\d{3})/;

            // digit 값이 유효하지 않을 경우 소수점 1자리 표현으로 default 처리
            if ( !$.isNumeric ( digit ) )
            {
                digit = 1;
            }

            var returnValue = this.mathAbsFloor ( value, digit );

            if ( $.isNumeric ( returnValue ) )
            {
                returnValue = returnValue.toFixed ( digit );
                while ( regEx.test ( returnValue ) )
                {
                    returnValue = returnValue.replace ( regEx, '$1' + ',' + '$2' );
                }
            } else
            {
                returnValue = '-';
            }

            return returnValue;
        },
        // 숫자 콤마 처리
        // util.addNumberComma(123456789.1234) -> 123,456,789.1234
        addNumberComma : function ( value )
        {
            if ( !$.isNumeric ( value ) )
            {
                return value;
            }

            var regEx = /(^[+-]?\d+)(\d{3})/;
            var returnValue = value.toString ();

            while ( regEx.test ( returnValue ) )
            {
                returnValue = returnValue.replace ( regEx, '$1' + ',' + '$2' );
            }

            return returnValue;
        },
        // 숫자 콤마 제거 처리
        // util.removeNumberComma('123,456,789.1234'); -> 123456789.1234
        removeNumberComma : function ( value )
        {
            value = String ( value );
            return value.replace ( /(,)/g, '' );
        },
        removeNumberCommaDash : function ( value )
        {
            return this.removeNumberComma ( value ).replace ( /(-)/g, '' );
        },
        // 숫자면 숫자 데이터 그대로 리턴, 숫자가 아니면 0으로 처리, 숫자여도 parse 해서 데이터 처리(0123 -> 123)
        // util.getPositiveNumber('00001234.1234') -> 1234.1234
        getPositiveNumber : function ( value )
        {
            var number = parseFloat ( value.toString () );
            if ( !($.isNumeric ( value ) && number > 0) )
            {
                return 0;
            } else
            {
                return number;
            }
        },
        // clear highcharts
        // Util.clearHighcharts([$('.graph_box').highcharts()]);
        clearHighcharts : function ( charts )
        {
            if ( charts !== null && charts.length > 0 )
            {
                _.each ( charts, function ( chart )
                {
                    if ( chart )
                    {
                        chart.destroy ();
                        chart = null;
                    }
                } );
            }

            charts = null;
        },
        // 정규식 관련 정의
        regularExpression : {
            email : /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
            phone : /^(\+([0-9]{1,3})-?([0-9]{0,3})|([0-9]{2,3}))-?([0-9]{3,4})-?([0-9]{4})$/,
            id : /^[a-z0-9_-]{4,20}$/,
            pwd : /^[A-Za-z0-9_-`~!@#$%^&*|\\\'\";:\/?]{4,20}$/,
            number : /^[0-9]{0,10}$/
        },
        // 정규식 유효성 체크
        // util.checkRegularExpression('비밀번호값', util.regularExpression.pwd)
        checkRegularExpression : function ( string, regex )
        {
            return regex.test ( string );
        },
        // utf8 string의 byte size 반환 (aa : 2, 하하: 6, \r\n : 1)
        // util.getUTF8StringBytesSize('aaaaa'); -> 5
        getUTF8StringByteSize : function ( string )
        {
            var byteSize = 0;

            if ( !(string === null || string === undefined) )
            {
                var utf8 = unescape ( encodeURIComponent ( string ) );

                if ( !(utf8 === null || utf8 === undefined) )
                {
                    byteSize = utf8.length;
                }
            }

            return byteSize;
        },
        // 최대 글자 수 이하이면 true / false 리턴
        // util.isLessThanMaxStringLength('123456789',8) > false
        // util.isLessThanMaxStringLength('123456789',9) > true
        isLessThanMaxStringLength : function ( string, maxLength )
        {
            var isLess = false;

            if ( string.length <= maxLength )
            {
                isLess = true;
            }

            return isLess;
        },
        // string의 길이가 length 내일 경우 true, 아니면 false
        // util.isLessThanMaxSize('aaaaa',4) -> false
        // util.isLessThanMaxSize('aaaaa',5) -> true
        isLessThanMaxSize : function ( string, length )
        {
            var stringByteSize = this.getUTF8StringByteSize ( string );
            var maxSize = length;
            if ( stringByteSize > maxSize )
            {
                return false;
            }
            return true;
        },
        fileExtensionFormat : {
            image : '.jpg,.jpeg,.gif,.png',
            excel : '.xls,.xlsx',
            general : '.jpe,.jpeg,.jpg,.gif,.png,.pdf,.hwp,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.dwg'
        },
        // 파일 확장자 체크
        // true 일경우 포함되는 확장자 있음, false일 경우 포함되는 확장자 없음
        checkFileExtension : function ( fileName, fileExtensions )
        {
            var fileExtensionArray = fileExtensions.split ( ',' );
//            var fileNameExtension = '.' + fileName.split ( '.' )[1].toLowerCase ();
            var fileNameExtension = fileName.substring ( fileName.lastIndexOf('.') ).toLowerCase ();
            var flag = false;

            $.each ( fileExtensionArray, function ( i, extension )
            {
                if ( extension === fileNameExtension )
                {
                    flag = true;
                    return false; // break;
                }
            } );

            return flag;
        },
        // Datetimepicker 검색 기간 제한
        //
        setStartEndDatetimepicker : function ( $fromDatetimepicker, $toDatetimepicker, $fromDate, $toDate )
        {
            $toDatetimepicker.datetimepicker ( 'setStartDate', $fromDate.val () );
            $fromDatetimepicker.datetimepicker ( 'setEndDate', $toDate.val () );
        },
        // 날짜 유효성 체크
        // 시간 비교시 앞에 같은 날짜 채워서 비교
        // util.comparedates('2016-01-01 02:00','2016-01-01 01:00,'yyyy-MM-dd HH:mm'); -> 1
        // util.comparedates('2016-01-01 01:00','2016-01-01 03:00,'yyyy-MM-dd HH:mm'); -> 0
        // util.comparedates('2016-01-01 00:00','2016-01-01 00:00,'yyyy-MM-dd HH:mm'); -> -1
        compareDates : function ( date1, date2, type )
        {
            var format = null;

            if ( type === 'yyyy-MM-dd HH:mm' )
            {
                format = this.dateFormat.convertYYYYMMDDHHMM;
            }

            return compareDates ( date1, format, date2, format );
        },
        // highcharts generate tooltip
        generateTooltip : function ( dateType, digit )
        {
            return {
                useHTML : true,
                style : {
                    zIndex : 300
                },
                shared : true,
                formatter : function ()
                {
                    var tooltip = '';

                    $.each ( this.points, function ( i, point )
                    {

                        tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> ' + point.series.name
                                + ': ' + homUtil.mathFloorComma ( point.y, digit ) + '<br />';
                    } );

                    var tooltipDate = homUtil.convertDateLongToString ( this.x, dateType );

                    return '<strong>' + tooltipDate + '</strong><br />' + tooltip;
                }
            };
        },
        // highcharts generate tooltip
        generateLabelTooltip : function ( digit )
        {
            return {
                useHTML : true,
                style : {
                    zIndex : 300
                },
                shared : true,
                formatter : function ()
                {
                    var tooltip = '';

                    $.each ( this.points, function ( i, point )
                    {

                        tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> ' + point.series.name
                                + ': ' + homUtil.mathFloorComma ( point.y, digit ) + '<br />';
                    } );

                    return '<strong>' + this.x + '</strong><br />' + tooltip;
                }
            };
        },
        // highcharts color info
        highchartsColorInfo : {
            type1 : 'type1',
            colorSet1 : [ '#a9aeb6', '#e0dcd8', '#ff881e', '#4bc5c3', '#0068b7', '#ffb230' ],
            type2 : 'type2',
            colorSet2 : [ '#ffd183', '#da8d2a', '#4bc5c3', '#ff881e' ],
            type3 : 'type3',
            colorSet3 : [ '#8585a8', '#a9aeb6', '#e0dcd8', '#ff881e', '#0068b7', '#ffb230', '#4bc5c3' ],
            type4 : 'type4',
            colorSet4 : [ '#8585a8', '#a9aeb6', '#ff881e', '#0068b7', '#ffb230', '#4bc5c3' ],
            type5 : 'type5',
            colorSet5 : [ '#fc5d2a', '#cce198', '#80c269', '#32b16c', '#556fb5', '#7a418c', '#f19ec2', '#Ffd75f',
                    '#d2a54e', '#49351f', '#7b2f2f', '#8585a8', '#e98287', '#36478a', '#926a74', '#f29a76', '#ae8ea9',
                    '#0068b7', '#4bc5c3', '#00732b', '#63a8c7', '#36478a', '#4bc5c3', '#e95fe7', '#c81526', '#4c4743' ],
            type6 : 'type6',
            colorSet6 : [ '#6e7591', '#bebebd', '#ffda9c' ],
            type7 : 'type7',
            colorSet7 : [ '#fabd17', '#7ab800', '#910000', '#00b2ff', '#492970', '#492970', '#fc5d2a' ],
            // type8 : type5의 opacity 적용..
            type8 : 'type8',
            colorSet8 : [ 'rgba(252,93,42,.5)', 'rgba(204,225,152,.5)', 'rgba(128,194,105,.5)', 'rgba(50,177,108,.5)',
                    'rgba(85,111,181,.5)', 'rgba(122,65,140,.5)', 'rgba(241,158,194,.5)', 'rgba(255,215,95,.5)',
                    'rgba(210,165,78,.5)', 'rgba(73,53,31,.5)', 'rgba(123,47,47,.5)', 'rgba(133,133,168,.5)',
                    'rgba(233,130,135,.5)', 'rgba(54,71,138,.5)', 'rgba(146,106,116,.5)', 'rgba(242,154,118,.5)',
                    'rgba(174,142,169,.5)', 'rgba(0,104,183,.5)', 'rgba(75,197,195,.5)', 'rgba(0,115,43,.5)',
                    'rgba(99,168,199,.5)', 'rgba(54,71,138,.5)', 'rgba(75,197,195,.5)', 'rgba(233,95,231,.5)',
                    'rgba(200,21,38,.5)', 'rgba(76,71,67,.5)' ],
            type9 : 'type9',
            colorSet9 : [ '#73a6f3', '#7e4eac', '#6c738f', '#ff702a', ],
            type10 : 'type10',
            colorSet10 : [ '#6c738f', '#3893cd', '#ff743d', '#ababab', '#4ac4c5' ],
            type11 : 'type11',
            colorSet11 : [ '#7b819b', '#a6a6a6', '#ff702a' ],
            type12 : 'type12',
            colorSet12 : [ '#cce198', '#80c269', '#32b16c', '#556fb5', '#7a418c', '#f19ec2', '#Ffd75f',
                    '#d2a54e', '#49351f', '#7b2f2f', '#8585a8', '#e98287', '#36478a', '#926a74', '#f29a76', '#ae8ea9',
                    '#0068b7', '#4bc5c3', '#00732b', '#63a8c7', '#36478a', '#4bc5c3', '#e95fe7', '#c81526', '#4c4743' ]
            
        },
        // highcharts color info array return
        getHighchartsColors : function ( type )
        {
            var colorSet = this.highchartsColorInfo.colorSet1;

            if ( type === this.highchartsColorInfo.type1 )
            {
                colorSet = this.highchartsColorInfo.colorSet1;
            } else if ( type === this.highchartsColorInfo.type2 )
            {
                colorSet = this.highchartsColorInfo.colorSet2;
            } else if ( type === this.highchartsColorInfo.type3 )
            {
                colorSet = this.highchartsColorInfo.colorSet3;
            } else if ( type === this.highchartsColorInfo.type4 )
            {
                colorSet = this.highchartsColorInfo.colorSet4;
            } else if ( type === this.highchartsColorInfo.type5 )
            {
                colorSet = this.highchartsColorInfo.colorSet5;
            } else if ( type === this.highchartsColorInfo.type6 )
            {
                colorSet = this.highchartsColorInfo.colorSet6;
            } else if ( type === this.highchartsColorInfo.type7 )
            {
                colorSet = this.highchartsColorInfo.colorSet7;
            } else if ( type === this.highchartsColorInfo.type8 )
            {
                colorSet = this.highchartsColorInfo.colorSet8;
            } else if ( type === this.highchartsColorInfo.type9 )
            {
                colorSet = this.highchartsColorInfo.colorSet9;
            } else if ( type === this.highchartsColorInfo.type10 )
            {
                colorSet = this.highchartsColorInfo.colorSet10;
            } else if ( type === this.highchartsColorInfo.type11 )
            {
                colorSet = this.highchartsColorInfo.colorSet11;
            } else if ( type === this.highchartsColorInfo.type12 )
            {
                colorSet = this.highchartsColorInfo.colorSet12;
            }

            return colorSet;
        },
        // 접두/접미 구분자로 해당 단어를 감싼 결과를 리턴 ex) ton -> (ton)
        wrapWord : function ( word, prefixDelimiter, suffixDelimiter )
        {
            var resultWord = '';

            // default prefixDelimiter setting
            if ( typeof prefixDelimiter === 'undefined' || prefixDelimiter === null )
            {
                prefixDelimiter = '(';
            }
            // default suffixDelimiter setting
            if ( typeof suffixDelimiter === 'undefined' || suffixDelimiter === null )
            {
                suffixDelimiter = ')';
            }

            if ( typeof word !== 'undefined' && word !== null )
            {
                resultWord = prefixDelimiter + word + suffixDelimiter;
            }

            return resultWord;
        },
        // 시작 - 종료일자 유효성 체크
        fromToDateValidate : function ( fromDate, toDate, dateType )
        {
            fromDate = $.trim ( fromDate );
            toDate = $.trim ( toDate );

            if ( fromDate === '' )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validRequiredDateFromDate,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

                return false;
            }

            if ( toDate === '' )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validRequiredDateToDate,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

                return false;
            }

            if ( !homUtil.isDate ( fromDate, dateType ) )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validRequiredDateFromDate,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

                return false;
            }

            if ( !homUtil.isDate ( toDate, dateType ) )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validRequiredDateToDate,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

                return false;
            }

            if ( fromDate > toDate )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validFromDateFutureToDate,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

                return false;
            }

            return true;
        }
    };
}) ( jQuery );