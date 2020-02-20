const MomentContainer = require('./moment_container');

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

    constructor(date, format) {
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


    parseIsoShortOrdinalDateFormat() {
        let tokens = this.iso8601FullShortOrdinalDateFormat(this.date);
        return this.parseOrdinalDateFormat(tokens);
    }

    parseFromFormat() {
        return undefined;
    }
}

module.exports = MomentParser;