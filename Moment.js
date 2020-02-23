/*
* Author : SriDattaYalla
* */

const MomentContainer = require('./MomentContainer');
const MomentParser = require('./MomentParser');
const LocaleSupport = require('./LocaleSupport');
const MomentFormator = require('./MomentFormator');
const MomentComparitor = require('./MomentComparitor');

class Moment {

    /*
     date(String)
     format(String)
     */
    constructor(date, format, strict) {

        this.date = date;
        this.format = format;
        this.locale = 'en';
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
        return (new MomentFormator(this.momentContainer, givenFormat)).formatTime();
    }

    from(b){
        let res = new MomentComparitor(this.momentContainer.moment, b.momentContainer.moment);
        if(res[0]==0){
            return "same"
        }else  if(res[0]==1){
            return res[1] + " " + res[2] + (res[1]>1 ? "s" : "") + " ago";
        }else{
            return "in " + res[1] + " " + res[2] +(res[1]>1 ? "s" : "");
        }
    }

}

module.exports = Moment;