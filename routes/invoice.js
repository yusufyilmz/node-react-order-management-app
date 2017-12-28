
const express = require('express');
const order = require('../data/omorder');
const pdf = require('../data/pdf');
const invoice = require('../data/ominvoice');
var nodeExcel = require('excel-export');
const parameter = require('../data/parameter');

// import { updateProduct, addProduct, getProduct } from '../data/product';
const router = express.Router()

router.get('/getpdf', function (req, res, next) {
  const pdfurl = pdf.generatePDF((data) => {
    res.download(data)
  })
  console.log(pdfurl)
  // res.send("ok")
})

router.get('/details', function (req, res, next) {
  order.getInvoiceDetails(req.query, (err, result) => {
    res.send(result)
  })
})




router.post('/create', function (req, res, next) {
  // res.send("ok")
  console.log(req.body.orderId)
  pdf.generatePDFWithTemplate(req.body.template, (data) => {
    order.setInvoiceCreated(req.body.orderId, req.body.platformId, (err, result) => {

      if (result == false) {
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment;filename=filename.pdf');
        res.download(data);
      }
      else {
        invoice.addInvoice(req.body.invoice, (err, result) => {
          parameter.increaseInvoiceSiraNo(req.body.invoice, (callback) => {
            res.set('Content-Type', 'application/pdf');
            res.set('Content-Disposition', 'attachment;filename=filename.pdf');
            res.download(data);
          });
        });
      }
    })
  })
})


router.post('/createwithdata', function (req, res, next) {
  // res.send("ok")
  console.log(req.body)
  pdf.generatePDFWithData(req.body.data, (data) => {
    order.setInvoiceCreated(req.body.orderId, (err, result) => {
      // res.send(result)
    })

    res.set('Content-Type', 'application/pdf')
    res.set('Content-Disposition', 'attachment;filename=filename.pdf')
    res.download(data)
  })
})


router.get('/default', function (req, res, next) {
  // res.send("ok")

  pdf.generatePDF((data) => {
    res.set('Content-Type', 'application/pdf')
    res.set('Content-Disposition', 'attachment;filename=filename.pdf')

    res.download(data)
  })
})

router.post('/get', function (req, res, next) {
  const pdfurl = generatePDF(req.body, (data) => {
    res.download(data)
  })
  console.log(pdfurl)
  // res.send("ok")
})

router.get('/getinvoices', function (req, res, next) {


  invoice.getInvoices(req, (err, result) => {
    console.log('result')

    console.log(result)
    res.send(result)
  })

})

router.get('/filter', function (req, res, next) {
  invoice.filterInvoices(req.query, (err, result) => {
        console.log('result')

    console.log(result)
    res.send(result)
  })
})




router.post('/addinvoice', function (req, res, next) {


  invoice.addInvoice(req, (err, result) => {
    console.log('result')

    console.log(result)
    res.send(result)
  })

})




module.exports = router
