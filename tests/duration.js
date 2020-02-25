const Duration = require("../lib/Duration");
const Moment = require("../lib/Moment");

let duration = new Duration([3, "days"]);
// duration.add(2, 'hours')
duration.add((new Moment(new Date())).diff(new Moment(new Date(2020, 1, 25, 19)), 'days'))
duration.subtract(4, 'days')
duration.add(24, 'hours')
console.log(duration.as('hours'));