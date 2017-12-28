const express = require('express');
// import { getOmConnection } from './orderManagementData';
const getOmConnection = require('./omData');
const getPrestaConnection = require('./prestaData')

function getProduct(callback) {
  getOmConnection((err, con) => {
    if (err) { /* handle your error here */ }

    let query = `SELECT *, p.id as id FROM OMProduct p 
                left join Platform pl on (pl.id = p.platform_id);`

    con.query(query, (err, result, field) => {
      con.release()
      console.log(result)
      callback(null, result)
    });
  });
};
function addProduct(request, platformId, callback) {
  getOmConnection((err, con) => {
    if (err) {
      console.log(err)
      con.release()
      callback(err, null)
    }

    let query = `INSERT INTO OMProduct(product_name, product_quantity, platform_id, product_refid,  product_refcode, product_refprice) VALUES ( '${request.product_name}', ${request.product_quantity} , ${platformId}, ${request.product_id}, '${request.product_code}', ${request.product_price});`
    console.log(query)
    con.query(query, (err, result, field) => {
      if (err) {
        console.error(err)
        con.release()
        callback(err, null)
      } else {
        callback(null, 'ok')
        con.release()
      }
    })
  })
}

const updateProduct = (request, callback) => {
  getOmConnection((err, con) => {
    let query = ''

    query += `UPDATE OMProduct SET  product_quantity = ${request.product_quantity}, product_refprice = ${request.product_refprice}  WHERE product_refid = ${request.product_id};`

    console.log(query)
    con.query(query, (err, result, field) => {
      con.release()

      getPrestaConnection((err, prestacon) => {
        query = `UPDATE ps77_product SET  quantity = ${request.product_quantity} , price = ${request.product_refprice}  WHERE id_product = ${request.product_id};`
        prestacon.query(query, (err, result, field) => {
          prestacon.release()
          callback(null, result)
        })
      })
    })
  })
};

const decreaseQuantity = (request, callback) => {
  console.log('request product_quantity')
  console.log(request.product_quantity)

  getOmConnection((err, con) => {
    let query = ''
    // "product_code": "Ar-MMelon",
    // "product_quantity":

    if (request.product_quantity) {
      query += `UPDATE OMProduct SET  product_quantity = product_quantity - ${request.product_quantity} WHERE product_refid = ${request.product_id};
                SELECT product_quantity FROM  OMProduct WHERE product_refid = ${request.product_id};`
      console.log(query)
      con.query(query, (err, result, field) => {
        con.release()
        // console.log(result)
        // console.log(result[1])
        // console.log(result[1][0].product_quantity)

        const quant = result[1][0].product_quantity;

        if (quant >= 0) {
          getPrestaConnection((err, prestacon) => {
            query = `UPDATE ps77_product SET  quantity = ${quant}  WHERE id_product = ${request.product_id};`
            prestacon.query(query, (err, result, field) => {
              prestacon.release()
              callback(null, result)
            })
          })
        }
        else {
          callback(null, result)
        }
      })
    }
  })
};

module.exports = {
  getProduct,
  addProduct,
  updateProduct,
  decreaseQuantity
}
