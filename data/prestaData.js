const mysql = require('mysql');
// const connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: '532404Yy',
// 	database: 'OrderManagement',
// 		multipleStatements: true
// });


// var pool = mysql.createPool({
//   host: '5.189.130.143',
//   user: 'prestashop_f',
//   password: 'FAjx9B2i6_',
//   database: 'prestashop_3',
//   multipleStatements: true
// })

//statgi

//prod

var pool = mysql.createPool({
  host: '5.189.130.143',
  user: 'i3427223_ps2',
  password: 'T@eEg(J5De13lx#lP7~31.(2',
  database: 'i3427223_ps2',
  multipleStatements: true
})



const getPrestaConnection = function (cb) {
  pool.getConnection(function (err, connection) {
		// if(err) throw err;
		// pass the error to the cb instead of throwing it
    if (err) {
      return cb(err)
    }
    cb(null, connection)
  })
}

module.exports = getPrestaConnection
