const getOmConnection = require('../data/omData')
const getPrestaConnection = require('../data/prestaData')
const order = require('../data/omorder');
const product = require('../data/product');

// const _ = require('lodash');
const parameter = require('../data/parameter');

var y = 0;
var x = 0;

function start() {
    // setInterval(() => {
    //     console.log("checking orders status");
    //     order.getPrestaOrders();
    // }, 20000); // every 5 minutes (300000)

    // parameter.getTimer('presta', (result) => {
    //     setInterval(() => {
    //         console.log("checking orders status");
    //     order.getPrestaOrders();
    //     }, result.data[0].presta_timer); // every 5 minutes (300000)
    // });

            getProducts();
            

}


// setInterval(function () {
//     console.log("checking order shipping status");
//     checkOrderShippingStatus();
// }, 1200000); // every 5 minutes (300000)


function getProducts() {
    let query = `SELECT p.id_product as product_id, 
                    p.reference as product_code, 
                    pl.name as product_name,
                    p.price as product_price,
                    p.price*1.18 as product_price_with_tax,
                    s.quantity as product_quantity 
                    FROM ps77_product p
                    left join ps77_stock_available s on (p.id_product=s.id_product)
                    left join ps77_product_lang pl on (p.id_product=pl.id_product)
                    WHERE pl.id_lang = 2`

    getPrestaConnection(function (err, prestaCon) {
        prestaCon.query(query, function (err, result, field) {
            // console.log(result)
            prestaCon.release()

            y = 0;
            loopProductArray(result);


            // _.forEach(result, (item) => {
            //     console.log("item")

            //     product.addProduct(item, 1, function (err, result) {
            //         if (err) {
            //             console.log(err)
            //         }
            //     })
            // })
        })
    })
}



var loopProductArray = (productList) => {

    console.log(productList);

    product.addProduct(productList[y], 1, function (err, result) {
        if (err) {
            console.log(err)
        }
        else {
            if (undefined !== productList && productList.length && y < productList.length) {
                y++
                loopProductArray(productList)
            }
        }
    })

}



module.exports = {
    start
}


