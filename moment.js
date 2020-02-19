/*
* Author : SriDattaYalla
* */

const MomentContainer = require('./moment_container');
const MomentParser = require('./moment_parser');

class Moment {

    /*
     date(String)
     format(String)
     */
    constructor(date, format) {

        this.formats = {'/^\\d{4,}.\\d{2}.\\d{2}$/': "YYYY-MM-DD"}

        this.date = date;
        this.format = format;

        let momentParser = new MomentParser(date, format);
        this.momentContainer = momentParser.parseMoment();

        //testing
        //this.momentContainer = new MomentContainer(1582022862233, "+100");

    }

}

module.exports = Moment;