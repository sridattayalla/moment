const MomentComparitor = require('../lib/MomentComparator');
const Moment = require('../lib/Moment');

let a = new Moment(new Date());
let b = new Moment(new Date(2020, 1, 23));
let momentComparitor = new MomentComparitor(a.momentContainer.moment, b.momentContainer.moment);
console.log(momentComparitor.calendar())