const express = require('express');
const getOmConnection = require('./omData');
const _ = require('lodash');
// var request = require("request");
// var parseString = require('xml2js').parseString;

const addStyle = (request, callback) => {
  getOmConnection((err, con) => {
    let query = `UPDATE OMInvoiceStyle SET 
                customerlabel = '${request.customerLabel}',
                invoicepricetextlabel = '${request.invoicePriceTextlabel}',
                invoicepricetable = '${request.invoicePriceTable}',
                invoiceproducttable  =  '${request.invoiceProductTable}', 
                customercontrolledpositionx = ${request.customerControlledPositionX},
                customercontrolledpositiony = ${request.customerControlledPositionY},
                invoicepricecontrolledpositionx = ${request.invoicePriceControlledPositionX},
                invoicepricecontrolledpositiony = ${request.invoicePriceControlledPositionY},
                invoicepricetextcontrolledpositionx = ${request.invoicePriceTextControlledPositionX},
                invoicepricetextcontrolledpositiony = ${request.invoicePriceTextControlledPositionY},
                invoicepricetablecontrolledpositionx = ${request.invoicePriceTableControlledPositionX},
                invoicepricetablecontrolledpositiony = ${request.invoicePriceTableControlledPositionY},
                datecontrolledpositionx = ${request.dateControlledPositionX},
                datecontrolledpositiony = ${request.dateControlledPositionY},
                 producttablecontrolledpositionx = ${request.productTableControlledPositionX},
                producttablecontrolledpositiony = ${request.productTableControlledPositionY},
                 taxlabelcontrolledpositionx = ${request.taxLabelControlledPositionX},
                taxlabelcontrolledpositiony = ${request.taxLabelControlledPositionY}
                where id = 1;`

    console.log(query);
    con.query(query, (err, result, field) => {
      let query = `SELECT * FROM OMInvoiceStyle;`
      console.log(query);
      con.query(query, (err, result, field) => {
        console.log(result[0]);
        con.release();
        callback(null, result);
      })
    })
  })
}

const getStyle = (request, callback) => {
  getOmConnection((err, con) => {
    let query = `SELECT * FROM OMInvoiceStyle;`

    console.log(query)
    con.query(query, (err, result, field) => {
      console.log(result);
      con.release()
      callback(null, result)
    })
  })
}

const deleteStyle = (request, callback) => {
  getOmConnection((err, con) => {

    let query = `DELETE * FROM OMInvoiceStyle WHERE id = ${request.id};;`

    console.log(query)
    con.query(query, (err, result, field) => {
      con.release()

      callback(null, result)
    })
  })
}

module.exports = {
  addStyle,
  getStyle,
  deleteStyle
}