const MomentContainer = require('./MomentContainer');

class MomentComparator {
    constructor(a, b) {
        this.a = a;
        this.b = b;

        //add offset
        let offsetA = (this.a['ZZ'].substring(0,1)=='-' ? -1 : 1 )*(parseInt(this.a['ZZ'].substring(1,2)*100 + parseInt(this.a['ZZ'].substring(2, this.a['ZZ'].length))))* 60 * 1000
        let offsetB = (this.a['ZZ'].substring(0,1)=='-' ? -1 : 1 )*(parseInt(this.b['ZZ'].substring(1,2)*100 + parseInt(this.b['ZZ'].substring(2, this.b['ZZ'].length))))* 60 * 1000
        this.a_ms_gmt  = this.a['x'] - offsetA;
        this.b_ms_gmt = this.b['x'] - offsetB;
    }

    compare(){
        let diffInMs = this.b['x'] - this.a['x'];
        if(diffInMs==0){
            return [0]
        }

        let diff = 0;
        let sign = diffInMs/Math.abs(diffInMs);
        let units = null;

        if(Math.abs(diffInMs)<1000){
            diff = Math.abs(diffInMs);
            units = "milliSecond";
        }

        else if(Math.abs(diffInMs)<1000*60){
            diff = Math.floor(Math.abs(diffInMs)/1000);
            units = "second";
        }

        else if(Math.abs(diffInMs)<1000*60*60){
            diff = Math.floor(Math.abs(diffInMs)/(1000*60));
            units = "minute";
        }

        else if(Math.abs(diffInMs)<1000*60*60*24){
            diff = Math.floor(Math.abs(diffInMs)/(1000*60*60));
            units = 'hour';
        }

        else if(Math.abs(diffInMs)<1000*60*60*24*7){
            diff = Math.floor(Math.abs(diffInMs)/(1000*60*60*24));
            units = 'day'
        }

        else if(Math.abs(diffInMs)<1000*60*60*24*31){
            diff = Math.floor(Math.abs(diffInMs)/(1000*60*60*24*7));
            units = 'week';
        }

        else if(Math.abs(this.a['YYYY'] - this.b['YYYY']) == 1){
            if(this.a['YYYY']>this.b['YYYY']){
                diff = 12-this.b['M'] + this.a['M'];
                units = 'month';
            }else{
                diff = 12-this.a['M'] + this.b['M'];
                units = 'month';
            }
            if(diff>11){
                diff = 1;
                units = "year";
            }
        }

        else if(Math.abs(this.a['YYYY'] - this.b['YYYY']) > 1){
            diff = Math.abs(this.a['YYYY'] - this.b['YYYY'])
            units = 'year'
        }

        else{
            diff = Math.abs(this.a['M'] - this.b['M']);
            units = 'month'
        }

        return [sign, diff, units]

    }

    calendar(){
        let diffIndays = Math.floor(this.b_ms_gmt/(1000*60*60*24)) - Math.floor(this.a_ms_gmt/(1000*60*60*24));
        return diffIndays;
    }

    getDiff(units){
        if(!units){
            return Math.floor(this.b_ms_gmt/(1000*60*60*24)) - Math.floor(this.a_ms_gmt/(1000*60*60*24));
        }
        let unitstoValue = {
            "milliSeconds" : 1,
            "seconds" :1000,
            "minutes": 1000*60,
            "hours": 1000*60*60,
            "days": 1000*60*60*24,
            "weeks": 1000*60*60*24*7,
        }
        return Math.floor(this.b_ms_gmt/unitstoValue[units]) - Math.floor(this.a_ms_gmt/unitstoValue[units]);
    }
}

module.exports = MomentComparator;