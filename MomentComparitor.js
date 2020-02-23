const MomentContainer = require('./MomentContainer');

class MomentComparitor {
    constructor(a, b) {
        this.a = a;
        this.b = b;

        return this.compare();
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
}

module.exports = MomentComparitor;