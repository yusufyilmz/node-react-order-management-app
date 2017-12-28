var http = require('http')
const getOmConnection = require('../data/omData')
const _ = require('lodash')
const order = require('../data/omorder')
const parameter = require('../data/parameter');

const start = () => {

  // setInterval(function () {
  //   console.log("checking order shipping status");
  //   checkOrderShippingStatus();
  // }, 1200000); // every 5 minutes (300000)
  parameter.getTimer('shipping', (result) => {
    
    console.log(result.data[0].parameter_value);
    setInterval(() => {
      console.log("checking order shipping status");
      checkOrderShippingStatus();
    }, result.data[0].parameter_value); // every 5 minutes (300000)

  });

}



const checkShipping = (item) => {
  var options = {
    host: 'suratkargo.com.tr',
    path: `/kargoweb/bireysel.aspx?no=${item.shipping_number}`
  }

  var request = http.request(options, (res) => {
    var data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      if (data.includes('Teslim Edildi')) {
        const request = {
          order_id: item.order_id,
          order_state: 'Teslim edildi',
          order_state_id: '5',
          shipping_number: item.shipping_number
        }

        order.updateStatus(request, (err, result) => {
          console.log('Teslim Edildi')
        })
      } else {
        console.log('no log')
      }
    })
  })

  request.on('error', (e) => {
    console.log(e.message)
  })
  request.end();
};

const checkOrderShippingStatus = () => {
  let query = `SELECT order_id, shipping_number FROM OMOrder where order_state_id =4 and order_archived = 0;`

  getOmConnection((err, con) => {
    con.query(query, (err, result, field) => {
      console.log(result)
      _.forEach(result, (item) => {
        checkShipping(item);
      })

      con.release();
    });
  });
};

module.exports = {
  start
}
