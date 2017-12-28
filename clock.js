// const prestaworker = require('./worker/prestaworker');
const httpworker = require('./worker/httpworker');
const shippingworker = require('./worker/shippingworker');

// var threeSecondInterval = function(){
//     console.log("Another 3 seconds have gone by. What did you do in them?");
// }
// setInterval(threeSecondInterval, 3000)

shippingworker.start();
// prestaworker.start();

//For specific times, use a chron job
var startWorker = function () {
  console.log("worker started");
  httpworker.start();

}

var CronJob = require('cron').CronJob;
new CronJob({
  cronTime: "*/10 * * * *",//15 seconds after every minute
  onTick: startWorker,
  start: true,
  timeZone: "America/Los_Angeles"
});