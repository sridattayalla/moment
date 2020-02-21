const Moment = require('./moment');

let moment = new Moment('2200 10 31', 'YYYY M D');
console.log(moment.isValid());