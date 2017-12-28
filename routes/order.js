const express = require('express')
const order = require('../data/omorder')
// var parseString = require('xml2js').parseString;
// var request = require("request");

// import { updateProduct, addProduct, getProduct } from '../data/product';
const router = express.Router()



router.get('/getn11orders', (req, res) => {
  order.getn11Orders((result) => {
    console.log('result22222')
    res.send(result);
  })
})

router.get('/getalln11orders', (req, res) => {
  order.getAlln11Orders((callback) => {
    console.log('getalln11orders')
    console.log(callback)

    res.send(callback);
  })
})



router.post('/add', (req, res, next) => {
  console.log(req.body)
  // order.addOrder(req.body, (err, result) => {
  //   res.send(result)
  // })
})

router.get('/search', (req, res) => {
  order.searchOrder(req.query, (err, result) => {
    console.log('result')

    // console.log(result)
    res.send(result)
  })
})

router.get('/get', (req, res) => {
  order.getOrdersDetail((err, result) => {
    console.log('result')
    console.log(result)
    res.send(result)
  })
})

router.get('/getarchived', (req, res) => {
  order.getArchivedOrdersDetail(req.query, (err, result) => {
    console.log('result')
    // console.log(result)
    res.send(result)
  })
})

router.get('/getarchivedcount', (req, res) => {
  order.getArchivedOrdersCount((err, result) => {
    console.log('result')
    console.log(result)
    res.send(result)
  })
})



router.get('/getN11archived', (req, res) => {
  order.getN11ArchivedOrdersDetail(req.query, (err, result) => {
    console.log('result')
    // console.log(result)
    res.send(result)
  })
})

router.get('/getN11archivedcount', (req, res) => {
  order.getN11ArchivedOrdersCount((err, result) => {
    console.log('result')
    console.log(result)
    res.send(result)
  })
})



router.get('/archive', (req, res) => {
  order.archiveOrder(req.query, (err, result) => {
    console.log('result')
    // console.log(result)
    res.send(result)
  })
})


router.get('/filter', (req, res) => {
  order.filterOrderStatus(req.query, (err, result) => {
    console.log('result')
    console.log(result)
    res.send(result)
  })
})



router.get('/getdelivered', (req, res) => {
  order.getDeliveredOrdersDetail((err, result) => {
    console.log('result')
    console.log(result)
    res.send(result)
  })
})

router.get('/check', (req, res) => {
  order.checkNewOrders((orderList) => {
    console.log('result')
    console.log(orderList)
    res.send(orderList)
  })
})


router.get('/checkorder', (req, res) => {
  order.getPrestaOrder(req.query, (value, result) => {
    console.log('result')
    console.log(value)
    res.send({ result: result, value: value })
  })
})



router.get('/updatestatus', (req, res) => {
  order.updateStatus(req.query, (err, result) => {
    console.log('result')

    console.log(result)
    res.send(result)
  })
})

router.get('/updateshipping', (req, res) => {
  order.updateShipping(req.query, (err, result) => {
    console.log('result')

    // console.log(result)
    res.send(result)
  })
})


router.post('/update', (req, res) => {
  order.updateOrder(req, (err, result) => {
    // console.log(result)
    res.send(result)
  })
})


router.get('/withoutinvoice', (req, res) => {
  order.getOrdersWithoutInvoice((err, result) => {
    console.log('result')

    console.log(result)
    res.send(result)
  })
})



// router.get('/sta', (req, res) => {

//   updateStatus((result) => {
//     parseString(result, function (err, xmlResult) {
//       var str = JSON.stringify(xmlResult);
//       console.log("str");
//       console.dir(str);
//       res.send(str)
//     });

//   })
// })



// const updateStatus = (callback) => {


//   var options = {
//     method: 'POST',
//     url: 'http://aromania.com.tr/api/order_histories&ws_key=DZHI9JPHPMHVL7KZG154SIFDIHWPS3XP',
//     headers:
//     {
//       'content-type': 'application/xml'
//     },
//     body: `<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">\n  
//      <order_history>\n   
//         <id_employee>1</id_employee>\n  
//          <id_order_state>6</id_order_state>\n   
//             <id_order>1320</id_order>\n 
//               </order_history>\n</prestashop>`
//   };

//   request(options, function (error, response, body) {
//     if (error) throw new Error(error);

//     console.log(body);
//     callback(body);
//   });

// }


module.exports = router
