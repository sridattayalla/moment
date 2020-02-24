const Moment = require('./Moment');

let moment = new Moment("Todays time is 2020 2 24T2:18:25.256 pm", 'YYYY M DTh:m:s.SSS a');
console.assert(moment.Format("hh-mm-ss.SSS a") === "02-18-25.256 pm" )
console.assert(moment.Format("hh-mm-ss.SSS a ZZ") === "02-18-25.256 pm +000" )
console.assert(moment.Format("h/mm/ss.SSS A") === "2/18/25.256 PM" )
console.assert(moment.Format("Do MMMM Y h A") === "24th Febraury 2020 2 PM" )

let a = new Moment(new Date(1984, 2, 26, 13, 15, 15, 400));
console.assert(a.Format("hh-mm-ss.SSS a") === "01-15-15.400 pm" )
console.assert(a.Format() === "1984-03-26 13:15:15.400 -3:30")
console.assert(a.Format('l') === "26/03/1984")

let b = new Moment("3 2", "W E");
console.assert(b.Format("Do MMM Y") === "14th Jan 2020")

let c = new Moment("1582527929", 'X');
console.assert(c.Format('X') === "1582527929" )

let d = new Moment("September 12 2019", 'MMMM D Y');
console.assert(d.Format('M') === "9" )

//comparing
console.assert(d.from(b) == "4 months ago")
console.assert(a.from(moment)=="36 years ago")

//is valid
let e = new Moment("September 31 2020", "MMMM D Y");
console.assert(!e.isValid())