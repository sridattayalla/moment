const MomentContainer = require('./moment_container');
const LocaleSupport = require('./localeSupport');

/*
    * supportedFormats
    *
    1. Month Date
    2013-02-08
    2013-02-08T09
    2013-02-08 09
    2013-02-08 09:30
    2013-02-08 09:30:26
    2013-02-08 09:30:26.123
    2013-02-08 09+07:00
    2013-02-08 09:30:26.123-6000
    20130208
    20130208T080910,123

    2. Week Date(ISO)
    2013-W06-5
    2013-W06-5 09:24:08[:,.]300
    2013W065T092408[:,.]300

    3. Year Date
    2020-065
    2020-065[T ]09:24:25[:,.]300
    2020065[T ]092425[:,.]300
    * */
class MomentParser {

    constructor(date, format, locale, parseStrict) {
        this.iso8601BasicCalenderFormat = /^(\d{4,})\D(\d{1,2})\D(\d{1,2})(.*)?/;
        this.iso8601CalenderTail = /^([\sT](\d{1,2}))?(:(\d{1,2}))?(:(\d{1,2}))?([:.](\d{1,3}))?([-+]\d{1,2}:?\d{2}?)?/;
        this.iso8601FullCalenderTailWithoutMinutes = /^\D(\d{1,2})([-+]\d{2}:?\d{2})/

        this.iso8601BasicShortCalenderFormat =  /^(\d{4})(\d{2})(\d{2})(.*)?/;
        this.iso8601ShortCalenderFormatTail = /^T(\d{2})?(\d{2})?(\d{2})?([,.](\d{3}))?/;

        this.iso8601BasicWeekDateFormat = /^(\d{4,})\DW(\d{1,2})\D(\d{1})(.*)?/;
        this.iso8601WeekDateFormatTail = /^[\sT](\d{1,2})?(:(\d{1,2}))?(:(\d{1,2}))?([:.,](\d{1,3}))?/;

        this.iso8601BasicShortWeekDateFormat = /^(\d{4})W(\d{2})(\d{1})?(.*)?/;
        this.iso8601ShortWeekDateFormatTail = /^[\sT](\d{2})?(\d{2})?(\d{2})?([:.,](\d{3}))?/;

        this.iso8601BasicOrdinalDateFormat = /^(\d{4})\D(\d{3})(.*)?/;
        this.iso8601OrdinalDateFormatTail = /^[\sT](\d{1,2})?(:(\d{1,2}))?(:(\d{1,2}))?([:.,](\d{1,3}))?/;

        this.iso8601BasicShortOrdinalDateFormat = /^(\d{4})(\d{3})(.*)?/;
        this.iso8601ShortOrdinalDateFormatTail = /^[\sT](\d{2})?(\d{2})?(\d{2})?([:.,](\d{3}))?/;
        this.date = date;
        this.format = format;
        this.parseStrict = parseStrict || false;
        this.locale = locale;

        this.userGivenInputTime = {}
    }

    parseMoment(){
        if(this.date==null){
            let time = new Date();
            return new MomentContainer(time.getTime(), 0);
        }

        else if(this.format==null){
            return this.parseFromDefaults();
        }

        else{
            return this.parseFromFormat();
        }
    }

    parseFromDefaults() {
        let year = 0;
        let month = 0;
        let date = 0;
        let hour = 0;
        let minute = 0;
        let second = 0;
        let milliSecond = 0;
        let offset = 0;
        let day = 0;
        let weekOfYear = 0;
        let dayOfYear = 0;

        if(this.iso8601BasicCalenderFormat.test(this.date)){
            let tokens = this.iso8601BasicCalenderFormat.exec(this.date);

            year = parseInt(tokens[1]);
            month = parseInt(tokens[2]);
            date = parseInt(tokens[3]);
            hour = 0;
            minute = 0;
            second = 0;
            milliSecond = 0;
            offset = 0;

            if(this.iso8601FullCalenderTailWithoutMinutes.test(tokens[4])){
                let matches  = this.iso8601FullCalenderTailWithoutMinutes.exec(this.date);
                hour = matches[1];
                offset = getOffset(matches[2])
            }

            else if(this.iso8601CalenderTail.test(tokens[4])){
                let matches = this.iso8601CalenderTail.exec(tokens[4]);

                hour = matches[2] ? parseInt(matches[2]) : 0;
                minute = matches[4] ? parseInt(matches[4]) : 0;
                second = matches[6] ? parseInt(matches[6]) : 0;
                milliSecond = matches[8] ? parseInt(matches[8]) : 0

                console.log(matches)
                if(matches[9]){
                    offset = getOffset(matches[9]);
                }
            }

            function getOffset(utcOffset) {
                let rex = /([-+]\d{1,2}):?(\d{2})/;
                let matches = rex.exec(utcOffset);
                return (parseInt(matches[1])*60 + parseInt(matches[2]))*60*1000;
            }

            return this.parseFromDate(year, month, date, hour, minute, second, milliSecond, offset);
        }

        else if(this.iso8601BasicShortCalenderFormat.test(this.date)){
            let tokens = this.iso8601BasicShortCalenderFormat.exec(this.date);
            console.log(tokens)
            year = parseInt(tokens[1]);
            month = parseInt(tokens[2])
            date = parseInt(tokens[3])

            if(this.iso8601ShortCalenderFormatTail.test(tokens[4])){
                let matches = this.iso8601ShortCalenderFormatTail.exec(tokens[4]);
                hour = matches[1] ? parseInt(matches[1]) : 0;
                minute = matches[2] ? parseInt(matches[2]) : 0;
                second = matches[3] ? parseInt(matches[3]) : 0;
                milliSecond = matches[5] ? parseInt(matches[5]) : 0;
            }

            return this.parseFromDate(year, month, date, hour, minute, second, milliSecond, offset);
        }

        else if(this.iso8601BasicWeekDateFormat.test(this.date)){
            let tokens = this.iso8601BasicWeekDateFormat.exec(this.date);

            year = parseInt(tokens[1]);
            weekOfYear = parseInt(tokens[2]);

            if(tokens[3]){
                day = parseInt(tokens[3]);
            }

            if(this.iso8601WeekDateFormatTail.test(tokens[4])){
                let matches = this.iso8601WeekDateFormatTail.exec(tokens[4]);
                console.log(matches)
                hour = matches[1] ? parseInt(matches[1]) : 0;
                minute = matches[3] ? parseInt(matches[3]) : 0;
                second = matches[4] ? parseInt(matches[5]) : 0;
                milliSecond = matches[7] ? parseInt(matches[7]) : 0;
            }

            return this.parseWeekDateFormat(year, weekOfYear, day, hour, minute, second, milliSecond, offset);
        }

        else if(this.iso8601BasicShortWeekDateFormat.test(this.date)){
            let tokens = this.iso8601BasicShortWeekDateFormat.exec(this.date);
            year = parseInt(tokens[1]);
            weekOfYear = parseInt(tokens[2]);
            day = tokens[3] ? parseInt(tokens[3]) : 0;

            if(tokens[4] && this.iso8601ShortWeekDateFormatTail.test(tokens[4])){
                let matches = this.iso8601ShortWeekDateFormatTail.exec(tokens[4]);
                hour = matches[1] ? parseInt(matches[1]) : 0;
                minute = matches[2] ? parseInt(matches[2]) : 0;
                second = matches[3] ? parseInt(matches[3]) : 0;
                milliSecond = matches[5] ? parseInt(matches[5]) : 0;
            }

            return this.parseWeekDateFormat(year, weekOfYear, day, hour, minute, second, milliSecond, offset);
        }

        else if(this.iso8601BasicOrdinalDateFormat.test(this.date)){
            let tokens = this.iso8601BasicOrdinalDateFormat.exec(this.date);
            year = parseInt(tokens[1]);
            dayOfYear = parseInt(tokens[2]);

            if(tokens[3] && this.iso8601OrdinalDateFormatTail.test(tokens[3])){
                let matches = this.iso8601OrdinalDateFormatTail.exec(tokens[3]);
                console.log(matches)
                hour = matches[1] ? parseInt(matches[1]) : 0;
                minute = matches[3] ? parseInt(matches[3]) : 0;
                second = matches[5] ? parseInt(matches[5]) : 0;
                milliSecond = matches[7] ? parseInt(matches[7]) : 0;
            }

            return this.parseOrdinalDateFormat(year, dayOfYear, hour, minute, second, milliSecond, offset);
        }

        else if(this.iso8601BasicShortOrdinalDateFormat.test(this.date)){
            let tokens = this.iso8601BasicShortOrdinalDateFormat.exec(this.date);
            year = parseInt(tokens[1]);
            dayOfYear = parseInt(tokens[2]);
            console.log(tokens)
            if(tokens[3] && this.iso8601ShortOrdinalDateFormatTail.test(tokens[3])){
                let matches = this.iso8601ShortOrdinalDateFormatTail.exec(tokens[3]);
                console.log(matches)
                hour = matches[1] ? parseInt(matches[1]) : 0;
                minute = matches[2] ? parseInt(matches[2]) : 0;
                second = matches[3] ? parseInt(matches[3]) : 0;
                milliSecond = matches[5] ? parseInt(matches[5]) : 0;
            }

            return this.parseOrdinalDateFormat(year, dayOfYear, hour, minute, second, milliSecond, offset);

        }

        throw "Date format error";

        return ;
    }

    parseFromDate(year, month, date, hour, minute, second, milliSecond, offset){
        let timeStamp = (new Date(year, month-1, date)).getTime();

        return new MomentContainer(timeStamp+(
                MomentContainer.convert(hour, "hours", "seconds")
                + MomentContainer.convert(minute, "minutes", "seconds")
                + second
            )*1000
            +milliSecond, offset);
    }

    parseWeekDateFormat(year, weekOfYear, day, hour, minute, second, milliSecond, offset){
        let timeStamp = (new Date(year, 0, 0)).getTime();

        let yearStartingDay = (new Date(year, 0, 0)).getDay();
        if(yearStartingDay==0){yearStartingDay=7;}

        let isLastYearIncluded = yearStartingDay <= 4 ? true : false;
        if(weekOfYear==1){
            if(isLastYearIncluded){
                let firstWeekDates = [];
                for(let i=1; i<yearStartingDay; i++){
                    firstWeekDates.push(i-yearStartingDay);
                }
                for(let i=0 ; i<7-firstWeekDates.length; i++){
                    firstWeekDates.push(i)
                }
                timeStamp += firstWeekDates[day-1]*24*60*60*1000;
            }
            else{
                timeStamp += (7-(yearStartingDay-1))*24*60*60*1000;
            }
        }

        else{
            if(isLastYearIncluded){
                let lastDate = 7-(yearStartingDay-1);
                timeStamp += lastDate*24*60*60*1000;
                weekOfYear--;
            }

            timeStamp += ((--weekOfYear)*7+(day-1))*24*60*60*1000;
        }

        // if hours mentioned
        timeStamp += MomentContainer.convert(hour, 'hours', 'seconds')*1000
            + MomentContainer.convert(minute, 'minutes', 'seconds') * 1000
            + second*1000
            + milliSecond;

        return new MomentContainer(timeStamp, offset);
    }

    parseOrdinalDateFormat(year, dayOfYear, hour, minute, second, milliSecond, offset){
        let timeStamp = (new Date(year, 0, 1)).getTime();
        console.log(timeStamp)

        return new MomentContainer(timeStamp
            +(
                MomentContainer.convert(dayOfYear-1, "days", "seconds")
                +MomentContainer.convert(hour, "hours", "seconds")
                + MomentContainer.convert(minute, "minutes", "seconds")
                + second
            )*1000
            +milliSecond, offset);
    }

    parseFromFormat() {
        let parsedTime = {
            'YYYY':(new Date()).getFullYear(),
            'YY' : (new Date()).getFullYear().toString().substring(2, 4),
            'Y': null,

            'gggg':(new Date()).getFullYear(),
            'gg' : (new Date()).getFullYear().toString().substring(2, 4),

            'Q': null,
            'MM':null,
            'M':null,
            'MMM': null,
            'MMMM': null,

            'ww': null,
            'w': null,

            'DDD': null,
            'DDDD': null,

            'DD': null,
            'D': null,
            'Do': null,
        }

        let format = null;

        if(LocaleSupport[this.locale]['localFormats'].hasOwnProperty(this.format)){
            format = LocaleSupport[this.locale]['localFormats'][this.format];
        }else{
            format = this.format;
        }

        return this.parseToCustomFormatRegex(format);
    }

    parseToCustomFormatRegex(format) {
        let tempFormat = format;
        Object.keys(LocaleSupport.formatRegex).forEach(function (key) {
            tempFormat = tempFormat.replace(new RegExp(key, 'g'), LocaleSupport.formatRegex[key]);
        })
        if(tempFormat==format){
            throw "error"
        }
        let regex = this.parseStrict ? new RegExp("^ *"+tempFormat+" *$") : new RegExp(tempFormat);
        return this.makeOrderfromFormat(format, regex);
    }

    makeOrderfromFormat(format, regex){
        console.log("regex ", regex)
        let formatedDate = regex.exec(this.date);
        let tempFormat = format;
        let containedTypes = {};
        Object.keys(LocaleSupport.formatRegex).forEach(function (key) {
            if(tempFormat.includes(key)){
                let pos = tempFormat.indexOf(key);
                tempFormat = tempFormat.replace(new RegExp(key), '          '.substring(0, key.length));
                containedTypes[pos] = key;
            }
        });

        //arrange contained types in order
        let order = [null]
        Object.values(containedTypes).forEach(function(value){
            order.push(value)
        });

        return this.parseToCustomFormat(order, regex);
    }

    parseToCustomFormat(order, regex) {
        let tokens = regex.exec(this.date);
        console.log("tokens ", tokens);
        console.log("order ", order);

        for(let i=1; i<order.length; i++){
            this.userGivenInputTime[order[i]] = isNaN(parseInt(tokens[i])) ? tokens[i] : parseInt(tokens[i]);
        }

        console.log("paarsed time ", this.userGivenInputTime);

        if(this.userGivenInputTime['YY']){
            this.userGivenInputTime['YY'] = parseInt(this.userGivenInputTime['YY']>68 ? 19 : 20 + this.userGivenInputTime['YY'].toString());
        }

        if(this.userGivenInputTime['gg']){
            this.userGivenInputTime['gg'] = parseInt(this.userGivenInputTime['gg']>68 ? 19 : 20 + this.userGivenInputTime['gg'].toString());
        }

        let year = this.userGivenInputTime['YYYY'] || this.userGivenInputTime['YY'] || this.userGivenInputTime['Y'] || this.userGivenInputTime['GGGG'] || this.userGivenInputTime['GG'] || (new Date()).getFullYear()

        let hour = this.userGivenInputTime['HH']
        || this.userGivenInputTime['H']
        || (this.userGivenInputTime['kk'] ? this.userGivenInputTime['kk']-1 : null)
        || (this.userGivenInputTime['k'] ? this.userGivenInputTime['k']-1 : null)
        || 0

        if(this.userGivenInputTime['hh']){
            this.userGivenInputTime['hh'];
            if(this.userGivenInputTime['a']){
                if(this.userGivenInputTime['a']=='pm'){
                    this.userGivenInputTime['hh'] += 12
                }
            }
            else if(this.userGivenInputTime['A']){
                if(this.userGivenInputTime['A']=='PM'){
                    this.userGivenInputTime['hh'] += 12
                }
            }
            hour = this.userGivenInputTime['hh'];
        }

        if(this.userGivenInputTime['h']){
            this.userGivenInputTime['h'];
            if(this.userGivenInputTime['a']){
                if(this.userGivenInputTime['a']=='pm'){
                    this.userGivenInputTime['h'] += 12
                }
            }
            else if(this.userGivenInputTime['A']){
                if(this.userGivenInputTime['A']=='PM'){
                    this.userGivenInputTime['h'] += 12
                }
            }
            hour = this.userGivenInputTime['h'];
        }

        let minute = this.userGivenInputTime['mm'] || this.userGivenInputTime['m'] || 0

        let second = this.userGivenInputTime['ss'] || this.userGivenInputTime['s'] || 0

        let milliSecond = this.userGivenInputTime['SSS'] || 0

        let offset = 0

        if(this.userGivenInputTime['DDDD'] || this.userGivenInputTime['DDD']){
            console.log("type is in year-date format")
            return this.parseOrdinalDateFormat(year, this.userGivenInputTime['DDDD'] || this.userGivenInputTime['DD'], hour, minute, second, milliSecond, offset);
        }

        else if(this.userGivenInputTime['WW'] || this.userGivenInputTime['W']){
            console.log("type is in week-day format")
            return this.parseWeekDateFormat(year, this.userGivenInputTime['WW'] || this.userGivenInputTime['W'], this.userGivenInputTime['E']||1, hour, minute, second, milliSecond, offset);
        }


        let month = this.userGivenInputTime['MM']
        || this.userGivenInputTime['M']
        || (this.userGivenInputTime['MMM'] ? (LocaleSupport[this.locale].monthsShortHand).indexOf(this.userGivenInputTime['MMM']) + 1 : null)
        || (this.userGivenInputTime['MMMM'] ? (LocaleSupport[this.locale].months).indexOf(this.userGivenInputTime['MMMM']) + 1 : null)
        || (this.userGivenInputTime['Q'] ? (this.userGivenInputTime['Q'] * 3) + 1 : null)
        || 1

        console.log("month ", month)
        let date = this.userGivenInputTime['DD']
        || this.userGivenInputTime['D']
        || (this.userGivenInputTime['Do'] ? this.userGivenInputTime['Do'].substring(0, this.userGivenInputTime['Do'].length-2) : null)
        || 1

        console.log('year ', year)
        console.log("Date ", date)
        console.log("minutes ", minute)
        console.log("hour ", hour)
        console.log("second ", second)
        console.log("ms ", milliSecond)

        return this.parseFromDate(year, month, date, hour, minute, second, milliSecond, offset);
    }

    isValidTime(){
        function checkValidIsoWeek(year, week) {
            let startYear = new Date(year, 0, 1);
            let startYearTimeStamp = startYear.getTime();
            let endYear = new Date(year+1, 0, 1);
            let endYearTimeStamp = endYear.getTime();

            let weekCount = 0;
            let startYearStartingDay = (startYear.getDay()==0 ? 7 : startYear.getDay());
            if(startYearStartingDay<5){
                weekCount++;
                startYearTimeStamp += MomentContainer.convert(7 - (startYearStartingDay-1), "days", "seconds") * 1000
            }else{
                startYearTimeStamp -= MomentContainer.convert(startYearStartingDay-1)*1000;
            }

            let endYearStartingDay = (endYear.getDay()==0 ? 7 : endYear.getDay());
            if(endYearStartingDay<5){
                endYearTimeStamp -= MomentContainer.convert(endYearStartingDay-1, "days", "seconds")*1000;
            }else{
                endYearTimeStamp += MomentContainer.convert(7-(endYearStartingDay-1), "days", "seconds")*1000
            }

            weekCount += MomentContainer.convert((endYearTimeStamp - startYearTimeStamp)/1000 , "seconds", "days") / 7;
            console.log("weekcount ", weekCount)
            console.log("startyear ", startYearTimeStamp)
            console.log("endyear ",endYearTimeStamp)
            if(week>weekCount){
                return false;
            }
            return  true;
        }

        function checkValidDayOfMonth(year, month, date){
            let validDatesOfMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            if(validDatesOfMonth[month-1]<date){
                return false;
            }
            if(month==2){
                // if not a leap year
                if(!(year%4==0 && (year%100!=0 || year%400==0))){
                    return (date<29 ? true : false)
                }
            }
            return true;
        }

        let flag = true;
        let userGivenInputTime = this.userGivenInputTime;
        (Object.keys(LocaleSupport.validationRegex)).forEach(function (key) {
            if((userGivenInputTime).hasOwnProperty(key)){
                let currRegex = new RegExp((LocaleSupport.validationRegex)[key])
                if(!currRegex.test(userGivenInputTime[key])){
                    console.log(key)
                    flag = false;
                }
            }
        })

        //
        let year = (this.userGivenInputTime['YYYY'] || this.userGivenInputTime['YY'] || this.userGivenInputTime['Y'] || this.userGivenInputTime['GGGG'] || this.userGivenInputTime['GG'] || (new Date()).getFullYear());
        let month = (this.userGivenInputTime['MM']
            || this.userGivenInputTime['M']
            || (this.userGivenInputTime['MMM'] ? (LocaleSupport[this.locale].monthsShortHand).indexOf(this.userGivenInputTime['MMM']) + 1 : null)
            || (this.userGivenInputTime['MMMM'] ? (LocaleSupport[this.locale].months).indexOf(this.userGivenInputTime['MMMM']) + 1 : null)
            || (this.userGivenInputTime['Q'] ? (this.userGivenInputTime['Q'] * 3) + 1 : null)
            || 1);
        let date = this.userGivenInputTime['DD']
            || this.userGivenInputTime['D']
            || (this.userGivenInputTime['Do'] ? this.userGivenInputTime['Do'].substring(0, this.userGivenInputTime['Do'].length-2) : null)
            || 1;
        let inputWeek = userGivenInputTime['WW'] || userGivenInputTime['W'] || -1

        //valid week ?
        if(inputWeek!=-1){
            flag = checkValidIsoWeek(year, inputWeek)
        }

        flag = checkValidDayOfMonth(year, month, date);

        return flag;
    }
}

module.exports = MomentParser;