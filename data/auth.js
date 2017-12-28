const getOmConnection = require('./omData')

const login = (req, callback) => {

    getOmConnection((err, con) => {
        let query = `SELECT * FROM OMLogin where username = '${req.username}'`;
        console.log(query)
        con.query(query, (err, result, field) => {
            con.release()

            if (result && result.length > 0) {
                if (result[0].password == req.password) {
                    console.log(result[0].password);
                    let token = `token-${result[0].password}-${result[0].role}`;
                    callback({ result: true, authentication: result[0].role, message: token });
                }
                else {
                    callback({ result: false, authentication: null, message: "password is wrong" });
                }
            }
            else {
                callback({ result: false, authentication: null, message: "username is wrong" });

            }
        })
    })

}


module.exports = {
    login,
}