const MomentContainer = require('./moment_container');

class MomentParser {

    constructor(date, format) {
        this.iso8601BasicCalenderFormat = /^(\d{4,})\D(\d{1,2})\D(\d{1,2})(.*)?/;
        this.iso8601CalenderTail = /^([\sT](\d{1,2}))?(:(\d{1,2}))?(:(\d{1,2}))?([:.](\d{1,3}))?([-+]\d{1,2}:?\d{2}?)?/;
        this.iso8601FullCalenderTailWithoutMinutes = /^\D(\d{1,2})([-+]\d{2}:?\d{2})/
        this.iso8601BasicShortCalenderFormat =  /^\d{4}\d{2}\d{2}(.*)/;
        this.iso8601FullShortCalenderFormat = /^(\d{4,})(\d{1,2})(\d{1,2})(\d{1,2})(\d{1,2})(\d{1,2})\D(\d{1,3})/;
        this.iso8601BasicWeekDateFormat = /^(\d{4,})\DW(\d{1,2})\D(\d{1})(.*)?/;
        this.iso8601WeekDateFormatTail = /^([\sT](\d{1,2}))?(:(\d{1,2}))?(:(\d{1,2}))?([:.](\d{1,3}))?/;
        this.iso8601BasicShortWeekDateFormat = /^\d{4,}W\d{2}/;
        this.iso8601FullShortWeekDateFormat = /^\d{4,}W\d{2}\d{1,2}/;
        this.iso8601BasicOrdinalDateFormat = /^\d{4,}\D\d{3}/;
        this.iso8601FullOrdinalDateFormat = /^(\d{4})\D(\d{3})\D(\d{1,2})\D(\d{1,2})\D(\d{1,2})\D(\d{1,3})/;
        this.iso8601BasicShortOrdinalDateFormat = /^\d{4}\d{3}/;
        this.iso8601FullShortOrdinalDateFormat = /^\d{4}\d{3}\D(\d{1,2})\D(\d{1,2})\D(\d{1,2})\D(\d{1,3})/;
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
    }

    parseFromDefaults() {

        console.log(this.date);

        if(this.iso8601BasicCalenderFormat.test(this.date)){
            let tokens = this.iso8601BasicCalenderFormat.exec(this.date);

            let year = parseInt(tokens[1]);
            let month = parseInt(tokens[2]);
            let date = parseInt(tokens[3]);
            let hour = 0;
            let minute = 0;
            let second = 0;
            let milliSecond = 0;
            let offset = 0;

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
            return this.parseIsoShortCalenderFormat();
        }

        else if(this.iso8601BasicWeekDateFormat.test(this.date)){
            return this.parseIsoWeekDateFormat();
        }

        else if(this.iso8601BasicShortWeekDateFormat.test(this.date)){
            return this.parseIsoShortWeekDateFormat();
        }

        else if(this.iso8601BasicOrdinalDateFormat.test(this.date)){
            return this.parseIsoOrdinalDateFormat();
        }

        else if(this.iso8601BasicShortOrdinalDateFormat.test(this.date)){
            return this.parseIsoShortOrdinalDateFormat();
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
            +milliSecond, offset)
    }

    parseIsoShortCalenderFormat() {
        let tokens = this.iso8601FullShortCalenderFormat.exec(this.date);
        return this.parseCalenderFormat(tokens);
    }

    parseIsoCalenderFormat() {
        let tokens = this.iso8601BasicCalenderFormat.exec(this.date);
        return this.parseCalenderFormat(tokens);
    }

    parseIsoWeekDateFormat() {
        let tokens = this.iso8601BasicWeekDateFormat.exec(this.date);
        console.log(tokens)
        return this.parseWeekDateFormat(tokens);
    }

    parseIsoShortWeekDateFormat() {
        let tokens = this.iso8601FullShortWeekDateFormat.exec(this.date);
        return undefined;
    }

    parseIsoOrdinalDateFormat() {
        let tokens = this.iso8601FullOrdinalDateFormat(this.date);
        return this.parseOrdinalDateFormat(tokens);
    }

    parseIsoShortOrdinalDateFormat() {
        let tokens = this.iso8601FullShortOrdinalDateFormat(this.date);
        return this.parseOrdinalDateFormat(tokens);
    }

    parseCalenderFormat(tokens){

        let year = parseInt(tokens[1]);
        let month = parseInt(tokens[2]);
        let date = parseInt(tokens[3]);


        let timeStamp = (new Date(year, month-1, date)).getTime();
        if(this.iso8601FullCalenderTailWithoutMinutes.test(tokens[4])){
            let matches  = this.iso8601FullCalenderTailWithoutMinutes.exec(this.date);
            let hour = matches[1];
            timeStamp += hour*60*60*1000;
            let offset = getOffset(matches[2])
            return new MomentContainer(timeStamp, offset);
        }

        else if(this.iso8601CalenderTail.test(tokens[4])){
            let matches = this.iso8601CalenderTail.exec(tokens[4]);
            console.log(matches[2], matches[4], matches[6])
            timeStamp += MomentContainer.convert(parseInt(matches[2]), 'hours', 'seconds')*1000
            + MomentContainer.convert(parseInt(matches[4]), 'minutes', 'seconds') * 1000
            + parseInt((matches[6])?matches[6]:0)*1000
            + parseInt(matches[8]?matches[8]:0);

            let offset = 0;
            console.log(matches)
            if(matches[9]){
                offset = getOffset(matches[9]);
            }

            return new MomentContainer(timeStamp, offset);
        }

        console.log(tokens[4])

        return new MomentContainer(timeStamp, 0);
    }

    parseWeekDateFormat(tokens){
        let year = parseInt(tokens[1]);
        let weekOfYear = parseInt(tokens[2]);
        let day = 0;
        if(tokens[3]){
            day = parseInt(tokens[3]);
        }

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
                timeStamp += firstWeekDates[day]*24*60*60*1000;
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
        if(this.iso8601WeekDateFormatTail.test(tokens[4])){
            let matches = this.iso8601WeekDateFormatTail.exec(tokens[4]);
            console.log(matches[2], matches[4], matches[6])
            timeStamp += MomentContainer.convert(parseInt(matches[2]), 'hours', 'seconds')*1000
                + MomentContainer.convert(parseInt(matches[4]), 'minutes', 'seconds') * 1000
                + parseInt((matches[6])?matches[6]:0)*1000
                + parseInt(matches[8]?matches[8]:0);
        }


        return new MomentContainer(timeStamp, 0);
    }

    parseOrdinalDateFormat(tokens){
        let year = parseInt(tokens[0]);
        let timeStamp = (new Date(year, 0, 0)).getTime();

        let formats = ['weeks', 'days', 'hours', 'minutes', 'seconds'];
        let i=1;
        while (tokens[i]){
            timeStamp += MomentContainer.convert(parseInt(tokens[i]), 'days', 'seconds')*1000;
        }

        return new MomentContainer(timeStamp, 0);
    }
}

module.exports = MomentParser;