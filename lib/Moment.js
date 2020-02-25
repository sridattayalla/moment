/*
* Author : SriDattaYalla
* */

const MomentParser = require('./MomentParser');
const LocaleSupport = require('./LocaleSupport');
const MomentFormator = require('./MomentFormator');
const MomentComparitor = require('./MomentComparator');
const MomentDuration = require('./Duration');

class Moment {
    /*
     date: String
     format: String
     strict: bool
     locale: String
     */
    constructor(date, format, strict, locale) {
        this.date = date;
        this.format = format;
        this.locale = locale || 'en';
        this.isStrict = strict;

        this.parseTime();
    }

    parseTime(){
        this.momentParser = new MomentParser(this.date, this.format, this.locale, this.isStrict);
        this.momentContainer = this.momentParser.parseMoment();
    }

    setLocale(locale){
        if(LocaleSupport.hasOwnProperty(locale)) {
            this.locale = locale;
            this.parseTime()
        }
    }

    isValid(){
        return this.momentParser.isValidTime();
    }

    Format(givenFormat){
        return (new MomentFormator(this.momentContainer, givenFormat, this.locale)).formatTime();
    }

    from(b){
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, b.momentContainer.moment);
        let res = momentComparitor.compare();
        if(res[0]==0){
            return "same"
        }else  if(res[0]==1){
            return res[1] + " " + res[2] + (res[1]>1 ? "s" : "") + " ago";
        }else{
            return "in " + res[1] + " " + res[2] +(res[1]>1 ? "s" : "");
        }
    }

    to(b){
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, b.momentContainer.moment);
        let res = momentComparitor.compare();
        if(res[0]==0){
            return "same"
        }else  if(res[0]==1){
            return res[1] + " " + res[2] + (res[1]>1 ? "s" : "") + " ago";
        }else{
            return "in " + res[1] + " " + res[2] +(res[1]>1 ? "s" : "");
        }
    }

    fromNow(){
        let curr_moment = new MomentParser(new Date(), null, this.locale)
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, curr_moment.parseMoment().moment);
        let res = momentComparitor.compare();
        if(res[0]==0){
            return "same"
        }else  if(res[0]==1){
            return res[1] + " " + res[2] + (res[1]>1 ? "s" : "") + " ago";
        }else{
            return "in " + res[1] + " " + res[2] +(res[1]>1 ? "s" : "");
        }
    }

    calendar(rt){
        let referenceTime = rt;
        if(!referenceTime){
            referenceTime = new Moment(new Date());
        }
        let time = "at " + referenceTime.Format("h:m A");
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, referenceTime.momentContainer.moment);
        let res = momentComparitor.calendar()
        let weekNames = LocaleSupport.en.days;

        if(Math.abs(res) > 7){
            return referenceTime.Format("D/M/Y")
        }

        switch (res) {
            case 0: return "Today " + time;
            case 1: return "Tommorow " + time;
            case -1: return "Yesterday " + time;
        }
        let curr_day = this.momentContainer.moment['e'];
        let ref_day = null;
        if(res < 0){
            if(curr_day+res < 0){
                ref_day = 7 + curr_day + res;
            }else{
                ref_day = curr_day+res;
            }
            return "Last " + weekNames[ref_day] + " " + time;
        }else{
            if(curr_day+res > 6){
                ref_day = curr_day + res - 7;
            }else{
                ref_day = curr_day+res;
            }
            return weekNames[ref_day] + " " + time;
        }

    }

    diff(rt, units){
        let referenceTime = rt;
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, referenceTime.momentContainer.moment);
        return [Math.abs(momentComparitor.getDiff(units)), units]
    }

    valueOf(){
        return this.momentContainer.moment['x'];
    }

    unix(){
        return this.momentContainer.moment['X']
    }

    daysInMonth(){
        let validDatesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if(this.momentContainer.moment['M'] == 2){
            let year = this.momentContainer.moment['Y'];
            if((year%4==0 && year%100!=0) || year%400==0){
                return 29
            }
        }
        return validDatesOfMonth[this.momentContainer.moment['M']-1]
    }

    asJavaScriptDate(){
        let temp = this.momentContainer.moment;
        return new Date(temp['Y'], temp['M']-1, temp['D'], temp['H'], temp['m'], temp['s'], temp['SSS'])
    }

    toArray(){
        let temp = this.momentContainer.moment;
        return [temp['Y'], temp['M']-1, temp['D'], temp['H'], temp['m'], temp['s'], temp['SSS']];
    }

    toJSON(){
        return this.momentContainer.moment;
    }

    toISOString(){
        return this.Format();
    }

    toObject(){
        return this.momentContainer.moment;
    }

    asString(){
        return this.Format("ddd MMM D Y HH:mm:ss ZZ");
    }

    isBefore(rt, units){
        let referenceTime = rt;
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, referenceTime.momentContainer.moment);
        if(momentComparitor.getDiff(units) > 0){
            return true;
        }
        return false;
    }

    isBeforeOrSame(rt, units){
        let referenceTime = rt;
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, referenceTime.momentContainer.moment);
        if(momentComparitor.getDiff(units) >= 0){
            return true;
        }
        return false;
    }

    isAfter(rt, units){
        let referenceTime = rt;
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, referenceTime.momentContainer.moment);
        if(momentComparitor.getDiff(units) < 0){
            return true;
        }
        return false;
    }

    isAfterOrSame(rt, units){
        let referenceTime = rt;
        let momentComparitor = new MomentComparitor(this.momentContainer.moment, referenceTime.momentContainer.moment);
        if(momentComparitor.getDiff(units) <= 0){
            return true;
        }
        return false;
    }

    isBetween(tr1, rt2, units){
        let referenceTime1 = rt1;
        let referenceTime2 = rt2;
        let momentComparitor1 = new MomentComparitor(this.momentContainer.moment, referenceTime1.momentContainer.moment);
        let momentComparitor2 = new MomentComparitor(this.momentContainer.moment, referenceTime2.momentContainer.moment);
        if((momentComparitor1.getDiff(units) < 0 && momentComparitor2.getDiff(units)>0 ) || momentComparitor1.getDiff(units)>0 && momentComparitor2.getDiff(units)<0){
            return true;
        }
        return false;
    }

    isDst(){
        let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
        let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
        return Math.max(jan, jul) != d.getTimezoneOffset();
    }

    isLeapYear(){
        let year = this.momentContainer.moment['Y'];
        if((year%4==0 && yeare%100!=0) || year%400==0){
            return true;
        }
        return false;
    }

    static isMoment(moment){
        if(moment instanceof Moment){
            return true;
        }
        return false;
    }

    static isMoment(date){
        if(date instanceof Date){
            return true;
        }
        return false;
    }

    static updateLocale(locale, update){
        if(LocaleSupport.hasOwnProperty(locale)){
            Object.keys(update).forEach(function(key){
                LocaleSupport[locale][key] = update[key];
            })
        }
    }

    Duration(time, units){
        this.duration = MomentDuration(time, units);
        return this.duration;
    }

    static isDuration(duration){
        if(duration instanceof MomentDuration){
            return true;
        }
        return false;
    }
}

module.exports = Moment;