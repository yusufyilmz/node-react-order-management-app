const express = require('express')
const product = require('../data/product')
const router = express.Router()
router.get('/get',  (req, res) => {
  console.log("sdddd");
  product.getProduct((err, result) => {
  console.log(result)
    
      res.send(result)
    });
});



router.get('/update',  (req, res, next) => {

  product.updateProduct(req.query, (err, result) => {
    console.log('updateresult')
    console.log(result)
    res.send(result)
  })
});

module.exports = router
