const Moment = require('./Moment');

let moment = new Moment("2018 3 2 3 43 25",  "YYYY M D H m s");
let momentb = new Moment("2019 2 25 9 43 25",  "YYYY M D H m s")
moment.setLocale('hi');
console.log(moment.from(momentb));