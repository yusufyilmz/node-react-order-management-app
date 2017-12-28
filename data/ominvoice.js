// const express = require('express');
const getOmConnection = require('./omData');
// const getPrestaConnection = require('./prestaData')
// const product = require('../data/product')


const _ = require('lodash');


function addInvoice(request, callback) {

 getOmConnection((err, con) => {
        let query = 
        `INSERT INTO OMInvoice
        (
        order_id,
        order_invoice_id,
        invoice_seri_no,
        invoice_sira_no,
        invoice_total_price,
        invoice_tax_price,
        invoice_prepare_date,
        invoice_prepare_time)
        VALUES
        (
            ${request.order_id},
            ${request.order_invoice_id},
            
            
            '${request.invoice_seri_no}',
            '${request.invoice_sira_no}',
            '${request.invoice_total_price}',
            '${request.invoice_tax_price}',
            '${request.invoice_prepare_date}',
            '${request.invoice_prepare_time}'   
        );`


        console.log(query)
        con.query(query, (err, result, field) => {
            con.release()

            callback(null, result)
        })
    })

}


function getInvoices(request, callback) {

 getOmConnection((err, con) => {
        let query = `SELECT * FROM OMInvoice;`
        console.log(query)

         con.query(query, (err, result, field) => {
                con.release()
                callback(null, result)
            })


        // con.query(query, (err, result, field) => {
        //     con.release()
        //     callback(null, result)
        // })
    })

}


function filterInvoices(request, callback) {

 getOmConnection((err, con) => {
        let query = `SELECT * FROM OMInvoice WHERE invoice_prepare_date >= "${request.startdate}" 
        and invoice_prepare_date <= "${request.enddate}";`
        console.log(query)

         con.query(query, (err, result, field) => {
                con.release()
                callback(null, result)
            })
    })

}

module.exports = {
    addInvoice,
    getInvoices,
    filterInvoices
    
}
