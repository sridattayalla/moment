const MomentFormator = require('../lib/MomentFormator');
const MomentContainer = require('../lib/MomentContainer');

let momentFormator = new MomentFormator(new MomentContainer(1582535452000, 0, 'en'), "", 'en');
console.log(momentFormator.formatTime());