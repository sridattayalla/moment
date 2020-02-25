const MomemtContainer = require('./MomentContainer');

class Duration{
    constructor(time, units) {
        this.time = time;
        this.units = units;
        this.parseTime();
    }

    parseTime(){
        this.timeStamp = 0;
        if(this.time.constructor === ({}).constructor){
            Object.keys(this.time).forEach(function (key) {
                this.timeStamp += this.convert(this.time[key], key, 'seconds');
            })
            this.timeStamp *= 1000;
        }
        else if(this.time.constructor === ([]).constructor){
            this.timeStamp += this.convert(this.time[0], this.time[1], 'seconds') * 1000;
        }
        else{
            this.timeStamp += this.convert(this.time, this.units, 'seconds') * 1000;
        }
    }

    humanize(units){
        let prefix = Math.abs(this.convert(Math.ceil(this.timeStamp/1000), "seconds", units));
        if(prefix == 1){
            prefix = (units=="hours" ? "an" : "a");
        }

        let body = (prefix == "an" || prefix == "a" ) ? units.substring(0, units.length-1) : units;

        let suffix = this.timeStamp < 0 ? " ago" : "";

        return prefix + " " + body + suffix
    }

    asMilliseconds(){
        return this.timeStamp;
    }

    asMinutes(){
        return this.convert(Math.ceil(this.timeStamp/1000), 'seconds', 'minutes');
    }

    asSeconds(){
        return Math.ceil(this.timeStamp/1000);
    }

    asHours(){
        return this.convert(Math.ceil(this.timeStamp/1000), 'seconds', 'hours')
    }

    asDays(){
        return this.convert(Math.ceil(this.timeStamp/1000), 'seconds', 'days')
    }

    asWeeks(){
        return this.convert(Math.ceil(this.timeStamp/1000), 'seconds', 'weeks')
    }

    as(units){
        if(units=="milliseconds"){
            return this.timeStamp;
        }
        return this.convert(Math.ceil(this.timeStamp/1000), 'seconds', units);
    }

    add(time, units){
        if(time.constructor === ({}).constructor){
            Object.keys(time).forEach(function (key) {
                this.timeStamp += this.convert(this.time[key], key, 'seconds');
            })
            this.timeStamp *= 1000;
        }
        else if(time.constructor === ([]).constructor){
            this.timeStamp += this.convert(time[0], time[1], 'seconds') * 1000;
        }
        else{
            this.timeStamp += this.convert(time, units, 'seconds') * 1000;
        }
    }

    subtract(time, units){
        if(time.constructor === ({}).constructor){
            Object.keys(time).forEach(function (key) {
                this.timeStamp -= this.convert(this.time[key], key, 'seconds');
            })
            this.timeStamp *= 1000;
        }
        else if(time.constructor === ([]).constructor){
            this.timeStamp -= this.convert(time[0], time[1], 'seconds') * 1000;
        }
        else{
            this.timeStamp -= this.convert(time, units, 'seconds') * 1000;
        }
    }

    toISOString(units){
        if(units=="milliseconds"){
            return this.timeStamp;
        }
        return this.convert(Math.ceil(this.timeStamp/1000), 'seconds', units);

    }

    convert(val, type1, type2, terminate){

        let divideFactors = {
            'seconds':1000,
            'minutes': 1000* 60,
            'hours': 1000*60*60,
            'days': 1000*60*60*24,
            'weeks': 1000*60*60*24*7
        }

        if(terminate){
            return Math.floor((val*divideFactors[type1]) / divideFactors[type2]);
        }

        return (val*divideFactors[type1]) / divideFactors[type2];
    }
}

module.exports = Duration;