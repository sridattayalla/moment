/*
* Author : SriDattaYalla
* */

const MomentContainer = require('./moment_container');
const MomentParser = require('./moment_parser');
const LocaleSupport = require('./localeSupport');

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

        this.momentParser = new MomentParser(date, format, this.locale, this.isStrict);
        this.momentContainer = this.momentParser.parseMoment();

    }

    setLocale(locale){
        if(LocaleSupport.hasOwnProperty(locale)) {
            this.locale = locale;
        }
    }

    isValid(){
        return this.momentParser.isValidTime();
    }

}

module.exports = Moment;