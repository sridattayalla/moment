const LocaleSupport = require('./LocaleSupport');

class MomentContainer{
    /*
    * timeStamp : int
    * offset : String
    * year : int
    * month: int[0-11]
    * date: int
    * day : int[0-6]
    * hour : int[0-23]
    * min : int
    * sec : int
    * millisec : int*/
    constructor(timeStamp, offset, locale){

        let time = new Date(timeStamp);
        let year = time.getFullYear();
        let month = time.getMonth();
        let date = time.getDate();
        let day = time.getDay();
        let hour = time.getHours();
        let min = time.getMinutes();
        let sec = time.getSeconds();
        let milliSec = time.getMilliseconds();

        this.days = LocaleSupport[locale]['days'];
        this.daysShorthand = LocaleSupport[locale]['daysShortHand'];
        this.months = LocaleSupport[locale]['months'];
        this.monthShorthand =  LocaleSupport[locale]['monthsShortHand'];
        this.shortHands = ['x', 'X', 'ZZ', 'Z', 'z', 'zz', 'SSSS ... SSSSSSSSS', 'SSS', 'SS', 'S', 'ss', 's',
            'mm', 'm', 'kk', 'k', 'hh', 'h', 'HH', 'H', 'a', 'A', 'GGGG', 'GG', 'gggg', 'gg', 'YYYY', 'YY', 'Y',
            'WW', 'Wo', 'W', 'ww', 'wo', 'w', 'E', 'e', 'dddd', 'ddd', 'dd', 'do', 'd', 'DDDD', 'DDDo', 'DDD', 'Do',
            'D', 'Qo', 'Q', 'MMMM', 'MMM', 'MM', 'Mo', 'M'];

        this.moment = {};

        //timestamp
        this.moment['x'] = timeStamp;
        this.moment['X'] = timeStamp/1000;

        //timezone
        offset = offset ? offset.toString() : '+000'
        this.moment['ZZ'] = offset;
        this.moment['Z'] = offset.substring(0, 2) + ':' + offset.substring(2, offset.length);

        //fractional seconds
        let msLength = milliSec.toString().length;
        this.moment['SSS'] = '00'.substring(0, 3-msLength) + milliSec.toString();
        this.moment['SS'] = '0'.substring(0, 2-(milliSec/10).toString().length) + (milliSec/10).toString();
        this.moment['S'] = (milliSec/100).toString();

        //seconds
        this.moment['ss'] = '0'.substring(0, 2-sec.toString().length) + sec.toString();
        this.moment['s'] = sec.toString();

        //minutes
        this.moment['mm'] = '0'.substring(0, 2-min.toString().length) + min.toString();
        this.moment['m'] = min.toString();

        //hours
        let kHour = hour==0 ? 24 : hour;
        this.moment['kk'] = '0'.substring(0, 2-kHour.toString().length) + kHour.toString();
        this.moment['k'] = kHour.toString();
        let usualHour = kHour >= 12 ? kHour-12 : kHour;
        this.moment['hh'] = '0'.substring(0, 2-(usualHour).toString().length) + usualHour.toString();
        this.moment['h'] = usualHour.toString();
        this.moment['HH'] = '0'.substring(0, 2-hour.toString().length) + hour.toString();
        this.moment['H'] = hour.toString();

        //a
        this.moment['a'] = hour>11 ? 'pm' : 'am';
        this.moment['A'] = hour>11 ? 'PM' : 'AM';

        //week year(iso)
        let weekYear = year;
        if(month==0 & date<4 & !(day<date+3)){
            weekYear--;
        }
        else if(month==11 & date>27 & day<date-27){
            weekYear++;
        }
        this.moment['GGGG'] = '0000'.substring(0, 4-weekYear.toString().length) + weekYear.toString();
        this.moment['GG'] = (this.moment['GGGG']).substring(weekYear.toString().length-2, weekYear.toString().length);

        //week year
        this.moment['gggg'] = '0000'.substring(0, 4-year.toString().length) + year.toString();
        this.moment['gg'] = (this.moment['gggg']).substring(year.toString().length-2, year.toString().length);

        //year
        this.moment['YYYY'] = year.toString().length < 5 ?'0000'.substring(0, 4-year.toString().length) + year.toString() : year.toString();
        this.moment['YY'] = year.toString().substring(year.toString().length-2, year.toString().length);
        this.moment['Y'] = year.toString();

        //week of year (iso)
        let weekOfYearIso;
        if(weekYear>year){
            weekOfYearIso = 1;
        }
        else {
            let yearStart = new Date(weekYear, 0, 1, 0, 0, 0);
            let startDay = yearStart.getDay() == 0 ? 7 : yearStart.getDay();

            let daysInFirstWeek = 7 - (startDay - 1);
            let daysRemaining = MomentContainer.convert((timeStamp - yearStart.getTime()) / 1000 - MomentContainer.convert(daysInFirstWeek, 'days', 'seconds'), 'seconds', 'days');
            weekOfYearIso = startDay <= 4 ? 1 : 0;
            weekOfYearIso += MomentContainer.convert(daysRemaining, 'days', 'weeks');
        }
        this.moment['WW'] = '0'.substring(0, 2-weekOfYearIso.toString().length) + weekOfYearIso.toString();
        this.moment['Wo'] = weekOfYearIso.toString() + MomentContainer.getPrefix(weekOfYearIso);
        this.moment['W'] = weekOfYearIso.toString();

        //week of year
        let weekOfYear = 1;
        let yearStart = new Date(year, 0, 1, 0, 0, 0);
        let startDay = yearStart.getDay();

        let daysInFirstWeek = 7 - (startDay);
        let daysRemaining = MomentContainer.convert((timeStamp - yearStart.getTime()) / 1000 - MomentContainer.convert(daysInFirstWeek, 'days', 'seconds'), 'seconds', 'days');
        weekOfYear += MomentContainer.convert(daysRemaining, 'days', 'weeks');

        this.moment['ww'] = '0'.substring(0, 2-weekOfYear.toString().length) + weekOfYear.toString();
        this.moment['wo'] = weekOfYear.toString() + MomentContainer.getPrefix(weekOfYear);
        this.moment['w'] = weekOfYear.toString();

        //day of week(iso)
        this.moment['E'] = day+1;

        //day of week (locale)
        this.moment['e'] = day;

        //day of week
        this.moment['dddd'] = this.days[day];
        this.moment['ddd'] = this.daysShorthand[day];
        this.moment['dd'] = this.daysShorthand[day].substring(0,2);
        this.moment['do'] = day.toString() + MomentContainer.getPrefix(day);
        this.moment['d'] = day;

        //day of year
        yearStart = new Date(year, 0, 1, 0, 0, 0);
        let dayOfYear = MomentContainer.convert((timeStamp-yearStart.getTime())/1000, 'seconds', 'days', true) + 1;
        this.moment['DDDD'] = '00'.substring(0, 3-dayOfYear.toString().length) + dayOfYear.toString();
        this.moment['DDDo'] = dayOfYear.toString() + MomentContainer.getPrefix(dayOfYear);
        this.moment['DDD'] = dayOfYear;

        //day of month
        let monthStart = new Date(year, month, 1, 0, 0, 0);
        let dayOfMonth = MomentContainer.convert((timeStamp-monthStart.getTime())/1000, 'seconds', 'days', true)+1;
        this.moment['DD'] = '0'.substring(0, 2-dayOfMonth.toString().length) + dayOfMonth.toString();
        this.moment['Do'] = dayOfMonth.toString() + MomentContainer.getPrefix(dayOfMonth);
        this.moment['D'] = dayOfMonth;

        //quarter
        let quater = 4;
        if(month<4){quater=1}
        else if(month<7){quater=2}
        else if(month<10){quater=3}
        this.moment['Qo'] = quater.toString() + MomentContainer.getPrefix(quater);
        this.moment['Q'] = quater;

        //month
        let monthToShow = month+1;
        this.moment['MMMM'] = this.months[month];
        this.moment['MMM'] = this.monthShorthand[month];
        this.moment['MM'] = '0'.substring(0, 2- monthToShow.toString().length) + monthToShow.toString();
        this.moment['Mo'] = monthToShow.toString() + MomentContainer.getPrefix(monthToShow);
        this.moment['M'] = monthToShow;
    }

    static convert(val, type1, type2, terminate){

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

        return Math.ceil((val*divideFactors[type1]) / divideFactors[type2]);
    }

    static getPrefix(x){
        let oPrefix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th',];

        if(x>10 && x<20){
            return "th";
        }

        return oPrefix[x%10]
    }

}

module.exports = MomentContainer;