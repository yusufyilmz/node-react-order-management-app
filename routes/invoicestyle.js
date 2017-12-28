
const express = require('express');
const order = require('../data/omorder');
const invoicestyle = require('../data/invoicestyle');
const router = express.Router()


router.post('/savestyle', function (req, res, next) {

  console.log("savestyle");

  console.log(req.body);
  invoicestyle.addStyle(req.body, (err, result) => {
    console.log('result')

    // console.log(result)
    res.send(result)
  })
})


router.get('/getstyle', function (req, res, next) {

  invoicestyle.getStyle(req.body, (err, result) => {
    console.log('result')

    // console.log(result)
    res.send(result)
  })
})



router.get('/deletestyle', function (req, res, next) {
  invoicestyle.deleteStyle(req.body, (err, result) => {
    console.log('result')

    // console.log(result)
    res.send(result)
  })

})



module.exports = router
