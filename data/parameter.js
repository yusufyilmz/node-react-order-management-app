const getOmConnection = require('./omData');

const getTimer = (type, callback) => {
  getOmConnection((err, con) => {
    let query = `SELECT parameter_value FROM OMParameters2 where parameter_name = '${type}_timer'`
    con.query(query, (err, result, field) => {
      con.release();
      callback({ error_code: 0, err_desc: err, data: result });
    })
  })
}

const updateInvoiceParameter = (req, callback) => {
  getOmConnection((err, con) => {
    let query = `UPDATE OMParameters2 SET parameter_value = '${req.invoice_seri_no}' where parameter_name = 'invoice_seri_no';`
    query += `UPDATE OMParameters2 SET parameter_value = '${req.invoice_sira_no}' where parameter_name = 'invoice_sira_no';`

    con.query(query, (err, result, field) => {
      con.release();
      callback({ error_code: 0, err_desc: err, data: result });
    })
  })
}


const increaseInvoiceSiraNo = (req, callback) => {
  getOmConnection((err, con) => {

    let value = Number(req.invoice_sira_no) + 1;
    let query = `UPDATE OMParameters2 SET parameter_value = '${value}' where parameter_name = 'invoice_sira_no';`

    console.log(query);
    con.query(query, (err, result, field) => {
      con.release();
      callback({ error_code: 0, err_desc: err, data: result });
    })
  })
}



const getInvoiceParameter = (req, callback) => {

  let value = {}
  getOmConnection((err, con) => {
    let query = `SELECT *  FROM OMParameters2 where parameter_name = 'invoice_seri_no';`

    con.query(query, (err, result, field) => {
      value.invoice_seri_no = result;

      query = `SELECT * FROM OMParameters2 where parameter_name = 'invoice_sira_no';`
      con.query(query, (err, result, field) => {

        value.invoice_sira_no = result;
        con.release();
        callback({ error_code: 0, err_desc: err, data: value });
      })
    })
  })
}


const getAllTimers = (type, callback) => {
  getOmConnection((err, con) => {
    let query = `SELECT * FROM OMParameters2;`
    con.query(query, (err, result, field) => {
      con.release();
      callback({ error_code: 0, err_desc: err, data: result[0] });
    })
  })
}




const setTimer = (req, callback) => {
  console.log(req.query);
  getOmConnection((err, con) => {
    let query = `UPDATE OMParameters2 SET parameter_value =  ${req.timer_time} where parameter_name =  '${req.timer_type}_timer' ;`
    con.query(query, (err, result, field) => {
      con.release();
      callback({ error_code: 0, err_desc: err, data: result });

    })
  })
}



module.exports = {
  getTimer,
  setTimer,
  getAllTimers,
  getInvoiceParameter,
  updateInvoiceParameter,
  increaseInvoiceSiraNo
}