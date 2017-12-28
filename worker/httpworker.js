var http = require("http");

function start() {

    http.get("http://opmanager3.herokuapp.com");

    // setInterval(function() {
    //     console.log("http get successfull");
    //     http.get("http://opmanager3.herokuapp.com");
    // }, 1200000); // every 5 minutes (300000)
}


module.exports = {
    start
};