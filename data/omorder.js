const express = require('express');
const getOmConnection = require('./omData');
const getPrestaConnection = require('./prestaData')
const product = require('../data/product')


const _ = require('lodash');
// const prestaWorker = require('../worker/prestaworker');
var request = require("request");
var parseString = require('xml2js').parseString;



function getAlln11Orders(callback) {

    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {
            let query = `select *, o.id as id , o.order_id as order_id
              FROM OMN11Order o
              LEFT JOIN OMN11OrderProduct p ON ( o.id = p.order_id )  where o.order_archived = 0; `

            con.query(query, (err, result, field) => {
                con.release()

                if (err != null) {
                    callback({ error: err, result: false, data: null });
                }
                else {


                    var orderList = []

                    // console.log(result[0])

                    _.forEach(result, (order) => {
                        if (order) {
                            if (orderList[`"${order.order_id}"`] == undefined) {
                                orderList[`"${order.order_id}"`] = order
                                const products = [{
                                    // 'product_id': order.product_id,
                                    'product_name': order.product_name,
                                    'product_code': order.product_code,
                                    'product_quantity': order.product_quantity,
                                    'product_price': order.product_price,
                                    'product_unit_price': order.product_unit_price,
                                }]

                                orderList[`"${order.order_id}"`].products = products
                            } else {
                                const product = {
                                    // 'product_id': order.product_id,
                                    'product_name': order.product_name,
                                    'product_code': order.product_code,
                                    'product_quantity': order.product_quantity,
                                    'product_unit_price': order.product_unit_price,
                                    'product_price': order.product_price,
                                }

                                orderList[`"${order.order_id}"`].products.push(product)
                            }
                        }
                    })


                    console.log("orderList")

                    console.log(orderList[0])

                    callback({ error: null, result: true, data: _.mapKeys(orderList, 'order_id') });
                }
            })
        }
    })


}
function getn11Orders(callback) {

    var options = {
        method: 'POST',
        url: 'https://api.n11.com/ws/orderService/',
        headers:
        {
            // 'postman-token': '231107e6-27b1-84a2-50b1-67730eafbd85',
            // 'cache-control': 'no-cache',
            'content-type': 'text/xml'
        },
        body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                xmlns:sch="http://www.n11.com/ws/schemas">\r\n
                   <soapenv:Header/>\r\n   <soapenv:Body>\r\n 
                        <sch:OrderListRequest>\r\n  
                               <auth>\r\n    
                                           <appKey>70d0fd93-8fca-44c1-99d8-d69510724fa8</appKey>\r\n   
                                                    <appSecret>eOhcGcesy4KZ0MVm</appSecret>\r\n 
                                </auth>\r\n       
                                  <searchData>\r\n   
                                   <status>Approved</status> \r\n  
                                   </searchData>\r\n   
                                     </sch:OrderListRequest>\r\n
                                </soapenv:Body>\r\n</soapenv:Envelope>` };

    request(options, function (error, response, body) {
        if (error) {
            callback({ error: error, result: null, data: null });
        }
        else {

            console.log("abc");
            parseString(body, function (err, xmlResult) {
                if (err != null) {
                    callback({ error: err, result: null, data: null });
                }
                else {
                    let resp = xmlResult["env:Envelope"]["env:Body"][0]["ns3:OrderListResponse"][0];
                    console.log(resp)
                    let orderList = []

                    if (resp.result[0].status[0] == "success") {


                        n11Index = 0;
                        let orders = resp["orderList"][0].order;

                        // orders = [
                        //     resp["orderList"][0]["order"][0],
                        //     resp["orderList"][0]["order"][1],
                        //     resp["orderList"][0]["order"][2],
                        //     resp["orderList"][0]["order"][3],
                        //     resp["orderList"][0]["order"][4],
                        //     resp["orderList"][0]["order"][5],
                        //     resp["orderList"][0]["order"][5],
                        //     resp["orderList"][0]["order"][6],
                        //     resp["orderList"][0]["order"][7],
                        //     resp["orderList"][0]["order"][8],
                        //     resp["orderList"][0]["order"][9],
                        //     resp["orderList"][0]["order"][10],
                        //     resp["orderList"][0]["order"][11],
                        // ]

                        console.log(resp["orderList"][0])
                        console.log(resp["orderList"][0].order)

                        if (resp["orderList"][0].order == undefined) {
                            callback({ error: "No N11 order", result: false, data: null });
                        }
                        else if (orders.length > 0) {

                            // let objectArray = resp["orderList"][0]["order"];

                            getOmConnection((err, con) => {
                                if (err) {
                                    callback({ error: err, result: false, data: null });
                                } else {

                                    loopN11OrderAray(orders, orderList, con, n11Result => {
                                        console.log("abc")
                                        callback({ error: null, result: n11Result.result, data: n11Result.data });
                                        //insertN11Orders(n11Result.data);
                                        return
                                    });

                                }
                            })
                        }
                        else {
                            callback({ error: "No new N11 order", result: true, data: orderList });
                        }
                    }
                    else {

                        callback({ error: resp.result[0].status[0], result: null, data: null });
                    }
                }
            });
        }
    });
}

let n11Index = 0;

function loopN11OrderAray(n11OrderList, orderList, con, callback) {

    if (n11Index < n11OrderList.length) {

        getN11OrderDetails(n11OrderList[n11Index], orderDetails => {
            n11Index++;

            if (orderDetails.result) {
                insertN11Order(orderDetails.data, con, res => {
                    if (res.result == true) {
                        orderList.push(res.data);
                        loopN11OrderAray(n11OrderList, orderList, con, callback);
                    }
                    else {
                        loopN11OrderAray(n11OrderList, orderList, con, callback);
                    }
                });
            }
            else {
                loopN11OrderAray(n11OrderList, orderList, con, callback);
            }

            // n11Index++;

        });
    }
    else {
        callback({ result: true, data: orderList });
    }
}


function getN11OrderDetails(order, callback) {


    var options = {
        method: 'POST',
        url: 'https://api.n11.com/ws/orderService/',
        headers:
        {
            'content-type': 'text/xml'
        },
        body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.n11.com/ws/schemas">\r\n   <soapenv:Header/>\r\n  
         <soapenv:Body>\r\n      <sch:OrderDetailRequest>\r\n       
           <auth>\r\n            <appKey>70d0fd93-8fca-44c1-99d8-d69510724fa8</appKey>\r\n            <appSecret>eOhcGcesy4KZ0MVm</appSecret>\r\n         </auth>\r\n  
                  <orderRequest>\r\n       
                           <id>${order.id}</id>\r\n      
                              </orderRequest>\r\n  
                                  </sch:OrderDetailRequest>\r\n 
                                    </soapenv:Body>\r\n</soapenv:Envelope>\r\n`
    };

    request(options, function (error, response, body) {

        if (error) {
            callback({ error: error, result: false, data: null });
        }
        else {

            parseString(body, function (err, xmlResult) {
                console.log("xmlResult");

                let resp = xmlResult["env:Envelope"]["env:Body"][0]["ns3:OrderDetailResponse"][0];


                if (resp["result"][0]["status"][0] == "success") {

                    //insertN11Orders(resp["orderDetail"])

                    let request = resp["orderDetail"][0];
                    console.log(request);
                    let order = {
                        order_id: request["id"][0],
                        order_code: request["orderNumber"][0],
                        date_added: request["createDate"][0],
                        total_price: Number(request["billingTemplate"][0]["sellerInvoiceAmount"]),
                        total_shipping: Number(request["billingTemplate"][0]["totalServiceItemOriginalPrice"][0]) / (1.18),
                        tax: (0.18 / 1.18) * Number(request["billingTemplate"][0]["sellerInvoiceAmount"]),
                        total_discount: request["billingTemplate"][0]["totalSellerDiscount"][0],
                        invoice_created: 0,
                        customer_name: request["buyer"][0]["fullName"][0],
                        customer_surname: '',
                        order_archived: 0,
                        customer_gsm: request["billingAddress"][0]["gsm"][0],
                        customer_email: request["buyer"][0]["email"][0],
                        invoice_name: request["billingAddress"][0]["fullName"][0],
                        invoice_address1: request["billingAddress"][0]["address"][0],
                        invoice_gsm: request["billingAddress"][0]["gsm"][0],
                        invoice_postcode: request["billingAddress"][0]["postalCode"][0],
                        invoice_city: request["billingAddress"][0]["city"][0],
                        invoice_state: request["billingAddress"][0]["district"][0],
                        invoice_tckn: request["buyer"][0]["tcId"][0],
                        invoice_vat_number: request["buyer"][0]["taxId"][0],
                        invoice_vat_daire: request["buyer"][0]["taxOffice"][0],
                        delivery_name: request["shippingAddress"][0]["fullName"][0],
                        delivery_address1: request["shippingAddress"][0]["address"][0],
                        delivery_gsm: request["shippingAddress"][0]["gsm"][0],
                        delivery_postcode: request["shippingAddress"][0]["postalCode"][0],
                        delivery_city: request["shippingAddress"][0]["city"][0],
                        delivery_state: request["shippingAddress"][0]["district"][0],
                        delivery_tckn: request["buyer"][0]["tcId"][0],
                        delivery_vat_number: request["buyer"][0]["taxId"][0],
                        delivery_vat_daire: request["buyer"][0]["taxOffice"][0],
                        campaign_code: '',
                        products: []
                    };

                    // KDV: (0,18/1,18)*orderDetail.itemList.item.sellerInvoiceAmount
                    // Genel Toplam: billingTemplate.sellerInvoiceAmount

                    let campaigncode = ""
                    console.log(request.itemList[0].item);
                    _.map(request.itemList[0].item, (item) => {

                        let name = item.productName[0].replace("Premium", "").replace("Konsantre", "").replace("Aroma", "").replace("Karisimi", "").replace("15ml", "").replace("-", "").replace("Gida", "").replace("Aromasi", "").trim()


                        order.products.push({
                            product_name: name,
                            product_quantity: item.quantity[0],
                            product_unit_price: Number(item.price[0]) / 1.18,
                            product_price: Number(item.sellerInvoiceAmount[0]) / 1.18
                        })

                        if (campaigncode === "") {
                            campaigncode = item.shipmenCompanyCampaignNumber
                        }

                    })
                    order.campaign_code = campaigncode;

                    // orderList.push(order);
                    console.log(order);
                    callback({ error: null, result: true, data: order });

                }

                // callback({ error: null, result: resp["result"][0]["status"][0], data: resp["orderList"] });
            });
        }

    });
}

function insertN11Order(request, con, callback) {


    let query = `SELECT * FROM OMN11Order where order_id= ${request.order_id}`
    console.log(query)

    con.query(query, (err, result, field) => {

        console.log(result)

        if (result.length > 0) {
            callback({ error: null, result: true, data: request });
        }
        else {
            let orderId = ''
            query = `INSERT INTO OMN11Order
                        (
                        platform_id,
                        order_id,
                        order_number,
                        date_added,
                        total_price,
                        total_shipping,
                        tax,
                        total_discount,
                        customer_name,
                        customer_surname,
                        customer_email,
                        customer_gsm,
                        order_archived,
                        invoice_created,
                        invoice_name,
                        invoice_surname,
                        invoice_gsm,
                        invoice_phone,
                        invoice_address1,
                        invoice_address2,
                        invoice_postcode,
                        invoice_city,
                        invoice_state,
                        invoice_note,
                        invoice_tckn,
                        invoice_vat_number,
                        invoice_vat_daire,
                        invoice_company,
                        delivery_name,
                        delivery_surname,
                        delivery_email,
                        delivery_gsm,
                        delivery_address1,
                        delivery_address2,
                        delivery_postcode,
                        delivery_city,
                        delivery_state,
                        delivery_note,
                        delivery_tckn,
                        delivery_vat_number,
                        delivery_vat_daire,
                        delivery_company,
                        campaign_code
                        )
                        VALUES
                        (
                        2,
                        ${request.order_id},
                        '${request.order_code}',
                        '${request.date_added}',
                        '${request.total_price}',
                        '${request.total_shipping}',
                        '${request.tax}',
                        '${request.total_discount}',
                        '${request.customer_name}',
                        '',
                        '${request.customer_email}',
                        '${request.customer_gsm}',
                        0,
                        0,
                        '${request.invoice_name}',
                        '',
                        '${request.invoice_gsm}',
                        '',
                        '${request.invoice_address1}',
                        '',
                        '${request.invoice_postcode}',
                        '${request.invoice_city}',
                        '${request.invoice_state}',
                        '',
                        '${request.invoice_tckn}',
                        '${request.invoice_vat_number}',
                        '${request.invoice_vat_daire}',
                        '',
                        '${request.delivery_name}',
                        '',
                        '',
                        '${request.delivery_gsm}',
                        '${request.delivery_address1}',
                        '',
                        '${request.delivery_postcode}',
                        '${request.delivery_city}',
                        '${request.delivery_state}',
                        '',
                        '${request.delivery_tckn}',
                        '${request.delivery_vat_number}',
                        '${request.delivery_vat_daire}',
                        '',
                        '${request.campaign_code}');`

            console.log(query);
            con.query(query, function (err, result, field) {
                if (err) {
                    console.error(err)
                    callback({ error: err, result: false, data: null });
                } else {
                    orderId = result.insertId
                    query = "";

                    _.map(request.products, (product) => {

                        query += `INSERT INTO OMN11OrderProduct
                                        (
                                        order_id,
                                        product_name,
                                        product_code,
                                        product_quantity,
                                        product_unit_price,
                                        product_price
                                        )
                                        VALUES
                                        (
                                            ${orderId},
                                            '${product.product_name}',
                                            '',
                                            ${product.product_quantity},
                                            '${product.product_unit_price}',
                                            '${product.product_price}'
                                        );`
                    })


                    console.log(query);
                    con.query(query, function (err, result, field) {
                        if (err) {
                            console.error(err)
                            callback({ error: err, result: false, data: null });

                        } else {
                            callback({ error: null, result: true, data: request });
                        }
                    })

                }
            })
        }
    })
}


function insertN11Orders(orderList) {

    _.map(orderList, request => {

        let query = `SELECT * FROM OMN11Order where order_id= ${request.order_id}`
        console.log(query)

        getOmConnection((err, con) => {
            if (err) {
                console.log(err)
            } else {

                con.query(query, (err, result, field) => {

                    if (result.length > 0) {
                    }
                    else {


                        let orderId = ''

                        query = `INSERT INTO OMN11Order
                        (
                        platform_id,
                        order_id,
                        order_number,
                        date_added,
                        total_price,
                        total_shipping,
                        tax,
                        total_discount,
                        customer_name,
                        customer_surname,
                        customer_email,
                        customer_gsm,
                        order_archived,
                        invoice_created,
                        invoice_name,
                        invoice_surname,
                        invoice_gsm,
                        invoice_phone,
                        invoice_address1,
                        invoice_address2,
                        invoice_postcode,
                        invoice_city,
                        invoice_state,
                        invoice_note,
                        invoice_tckn,
                        invoice_vat_number,
                        invoice_vat_daire,
                        invoice_company,
                        delivery_name,
                        delivery_surname,
                        delivery_email,
                        delivery_gsm,
                        delivery_address1,
                        delivery_address2,
                        delivery_postcode,
                        delivery_city,
                        delivery_state,
                        delivery_note,
                        delivery_tckn,
                        delivery_vat_number,
                        delivery_vat_daire,
                        delivery_company)
                        VALUES
                        (
                        2,
                        ${request.order_id},
                        '${request.order_code}',
                        '${request.date_added}',
                        '${request.total_price}',
                        '${request.total_shipping}',
                        '0.15',
                        '${request.total_discount}',
                        '${request.customer_name}',
                        '',
                        '${request.customer_email}',
                        '${request.customer_gsm}',
                        0,
                        0,
                        '${request.invoice_name}',
                        '',
                        '${request.invoice_gsm}',
                        '',
                        '${request.invoice_address1}',
                        '',
                        '${request.invoice_postcode}',
                        '${request.invoice_city}',
                        '${request.invoice_state}',
                        '',
                        '${request.invoice_tckn}',
                        '${request.invoice_vat_number}',
                        '${request.invoice_vat_daire}',
                        '',
                        '${request.delivery_name}',
                        '',
                        '',
                        '${request.delivery_gsm}',
                        '${request.delivery_address1}',
                        '',
                        '${request.delivery_postcode}',
                        '${request.delivery_city}',
                        '${request.delivery_state}',
                        '',
                        '${request.delivery_tckn}',
                        '${request.delivery_vat_number}',
                        '${request.delivery_vat_daire}',
                        '');`

                        console.log(query);
                        con.query(query, function (err, result, field) {
                            if (err) {
                                console.error(err)
                                //            callback(null, false)
                            } else {
                                orderId = result.insertId
                                query = "";

                                _.map(request.products, (product) => {

                                    query = `INSERT INTO OMN11OrderProduct
                                        (
                                        order_id,
                                        product_name,
                                        product_code,
                                        product_quantity,
                                        product_unit_price,
                                        product_price
                                        )
                                        VALUES
                                        (
                                            ${orderId},
                                            '${product.product_name}',
                                            '',
                                            ${product.product_quantity},
                                            '${product.product_unit_price}',
                                            '${product.product_price}'
                                        );`

                                    console.log(query);
                                    con.query(query, function (err, result, field) {
                                        if (err) {
                                            console.error(err)
                                            //callback(null, false)

                                        } else {
                                            //callback(null, true)

                                        }
                                    })

                                })




                            }
                        })
                    }
                })
            }
        })
    })
}





function getInvoiceDetails(request, callback) {


    if (request.orderId) {
        getOmConnection((err, con) => {
            let query = `SELECT *,  o.order_id as order_id FROM OMOrder o
              LEFT JOIN OrderProduct p ON ( o.id = p.order_id )
              where o.id = ${request.orderId};`



            console.log(query)
            con.query(query, (err, result, field) => {
                con.release()

                callback(null, result)
            })
        })
    }
    else if (request.n11orderId) {
        getOmConnection((err, con) => {
            let query = `SELECT *,  o.order_id as order_id FROM OMN11Order o
              LEFT JOIN OMN11OrderProduct p ON ( o.id = p.order_id )
              where o.order_id = ${request.n11orderId};`

            console.log(query)
            con.query(query, (err, result, field) => {
                con.release()

                callback(null, result)
            })
        })
    }


};


function getOrdersWithoutInvoice(callback) {
    getOmConnection((err, con) => {

        let query = `SELECT *, o.id as id , o.order_id as order_id FROM OMOrder o
              LEFT JOIN OrderProduct p ON ( o.id = p.order_id ) where o.invoice_created = 0 ; `

        console.log(query)
        con.query(query, (err, result, field) => {
            con.release()

            callback(null, result)
        })
    })
};


function setInvoiceCreated(orderId, platformId, callback) {
    getOmConnection((err, con) => {
        console.log("setInvoiceCreatedse")
        let query = '';

        if (platformId == 2) {
            query = `SELECT invoice_created FROM OMN11Order where order_id = ${orderId};`

        }
        else {
            query = `SELECT invoice_created FROM OMOrder where id = ${orderId};`
        }

        con.query(query, (err, result, field) => {
            console.log("result invvv");
            console.log(result);
            console.log(result[0]);

            if (result[0] && result[0].invoice_created == 1) {
                con.release()
                callback(null, false)

            }
            else {

                if (platformId == 2) {
                    query = `UPDATE OMN11Order SET invoice_created = 1 where order_id = ${orderId}`

                }
                else {
                    query = `UPDATE OMOrder SET invoice_created = 1 where id = ${orderId}`
                }

                console.log(query)
                con.query(query, (err, result, field) => {
                    con.release()

                    callback(null, result)
                })
            }

        })



    })
};



function updateShipping(request, callback) {

    console.log("updateShipping");

    getOmConnection((err, con) => {
        let query = `UPDATE OMOrder SET  shipping_number = "${request.shipping_number}", order_state = "${request.order_state}", order_state_id = ${request.order_state_id}  WHERE order_id = ${request.order_id};
        `

        console.log(query)
        con.query(query, (err, result, field) => {
            con.release()
            if (err) {
                callback(err, null)
            } else {

                getPrestaConnection((err, prestaCon) => {
                    let query = `UPDATE ps77_order_carrier SET tracking_number = "${request.shipping_number}"  WHERE id_order = ${request.order_id};
                    UPDATE ps77_orders SET shipping_number = "${request.shipping_number}"  WHERE id_order = ${request.order_id};`

                    console.log(query)
                    prestaCon.query(query, (err, result, field) => {
                        prestaCon.release()

                        updatePrestaStatus(request, (result) => {
                            callback(null, result)
                        });

                    })
                });


                // updatePrestaStatus(request, (result) => {
                //     // var str = JSON.stringify(xmlResult);
                //     // console.log("str");
                //     // console.dir(str);
                //     // res.send(str)
                //     if (request.shipping_number) {
                //         getPrestaConnection((err, prestaCon) => {
                //             let query = `UPDATE ps77_orders SET shipping_number = ${request.shipping_number}  WHERE id_order = ${request.order_id};`

                //             console.log(query)
                //             prestaCon.query(query, (err, result, field) => {
                //                 prestaCon.release()
                //                 callback(null, result)
                //             })
                //         })
                //     } else {
                //         callback(null, result)
                //     }
                // });

            }
        })
    })
};




function updateStatus(request, callback) {

    console.log("updateStatus");
    console.log(request);

    getOmConnection((err, con) => {
        // let query = `UPDATE OMOrder SET  shipping_number = ${request.shipping_number}, order_state = "${request.order_state}", order_state_id = ${request.order_state_id}  WHERE order_id = ${request.order_id};`
        let query = "";
        if (request.shipping_number) {
            query = `UPDATE OMOrder SET  shipping_number = "${request.shipping_number}", order_state = "${request.order_state}", order_state_id = ${request.order_state_id}  WHERE order_id = ${request.order_id};`
        }
        else {
            query = `UPDATE OMOrder SET order_state = "${request.order_state}", order_state_id = ${request.order_state_id}  WHERE order_id = ${request.order_id};`
        }

        console.log(query)

        con.query(query, (err, result, field) => {
            con.release()
            if (err) {
                callback(err, null)
            } else {

                if (request.shipping_number) {

                    getPrestaConnection((err, prestaCon) => {
                        query = `UPDATE ps77_order_carrier SET tracking_number = "${request.shipping_number}"  WHERE id_order = ${request.order_id};
                        UPDATE ps77_orders SET shipping_number = "${request.shipping_number}"  WHERE id_order = ${request.order_id};`

                        console.log(query)
                        prestaCon.query(query, (err, result, field) => {

                            console.log(result);

                            prestaCon.release();

                            updatePrestaStatus(request, (result) => {
                                callback(null, result)
                            });

                        })
                    });


                } else {

                    updatePrestaStatus(request, (result) => {
                        callback(null, result)
                    });

                    // getPrestaConnection((err, prestaCon) => {

                    //            updatePrestaStatus(request, (result) => {
                    //             prestaCon.release()
                    //             callback(null, result)
                    //         });

                    //     let query = `UPDATE ps77_orders SET shipping_number = ${request.shipping_number}  WHERE id_order = ${request.order_id};`

                    //     console.log(query)
                    //     prestaCon.query(query, (err, result, field) => {

                    //         prestaCon.release()
                    //         callback(null, result)

                    //     })
                    // });

                }

            }
        })
    })
};


function updateOrder(req, callback) {

    const request = req.body.data;

    getOmConnection((err, con) => {
        let query = `UPDATE OMOrder SET 
                    customer_name = '${request.customer_name}',
                    customer_surname = '${request.customer_surname}',
                    customer_email ='${request.customer_email}',
                    delivery_name = '${request.delivery_name}',
                    delivery_surname =  '${request.delivery_surname}',
                    delivery_email = '${request.delivery_email}',
                    delivery_gsm = '${request.delivery_gsm}',
                    delivery_address1 = "${request.delivery_address1}",
                    delivery_address2 = "${request.delivery_address2}",
                    delivery_postcode ='${request.delivery_postcode}',
                    delivery_city ='${request.delivery_city}',
                    delivery_note = "${request.delivery_note}",
                    delivery_tckn = '${request.delivery_tckn}',
                    delivery_vat_number = '${request.delivery_vat_number}',
                    delivery_company = "${request.delivery_company}",
                    invoice_name = '${request.invoice_name}',
                    invoice_surname =  '${request.invoice_surname}',
                    invoice_gsm = '${request.invoice_gsm}',
                    invoice_phone = '${request.invoice_phone}',
                    invoice_address1=   "${request.invoice_address1}",
                    invoice_address2 =  "${request.invoice_address2}",
                    invoice_postcode = '${request.invoice_postcode}',
                    invoice_city =   "${request.invoice_city}",
                    invoice_note =   "${request.invoice_note}",
                    invoice_tckn =     '${request.invoice_tckn}',
                    invoice_vat_number=  '${request.invoice_vat_number}',
                    invoice_company =  "${request.invoice_company}"
                                  WHERE order_id = ${request.order_id};`

        console.log(query)
        con.query(query, (err, result, field) => {
            con.release()
            if (err) {
                callback(err, null)
            } else {
                callback(err, result)

            }
        })
    })
}





// function filterInvoiceList(callback) {
//     getOmConnection((err, con) => {
//         if (err) {
//             console.log(err)
//         } else {
//             let query = `select *, o.id as id , o.order_id as order_id
//               FROM OMOrder o
//               LEFT JOIN OrderProduct p ON ( o.id = p.order_id ) where o.order_state_id != 5 and o.order_archived = 0; `

//             con.query(query, (err, result, field) => {
//                 con.release()
//                 callback(null, result)
//             })
//         }
//     })
// };


function getOrdersDetail(callback) {
    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {
            let query = `select *, o.id as id , o.order_id as order_id
              FROM OMOrder o
              LEFT JOIN OrderProduct p ON ( o.id = p.order_id ) where o.order_state_id != 5 and o.order_archived = 0; `

            con.query(query, (err, result, field) => {
                con.release()
                callback(null, result)
            })
        }
    })
};

function archiveOrder(req, callback) {

    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {
            console.log("archiveOrder")
            console.log(req.platformid)
            console.log(req.orderid)
            console.log(req.state)

            if (req.platformid == 1) {
                let query = `UPDATE OMOrder SET order_archived = ${req.state} WHERE order_id = ${req.orderid};`
                console.log(query);
                con.query(query, (err, result, field) => {
                    con.release();
                    callback(null, result);
                })
            }
            else if (req.platformid == 2) {
                let query = `UPDATE OMN11Order SET order_archived = ${req.state} WHERE order_id = ${req.orderid};`
                console.log(query);
                con.query(query, (err, result, field) => {
                    con.release();
                    callback(null, result);
                })
            }

        }
    })

};





function getArchivedOrdersCount(callback) {
    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {

            let query = `SELECT COUNT(*)
              FROM OMOrder o
              WHERE o.order_archived = 1 ; `
            console.log(query);
            con.query(query, (err, result, field) => {
                con.release();
                callback(null, result[0]);
            })
        }
    })
};



function getN11ArchivedOrdersCount(callback) {
    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {

            let query = `SELECT COUNT(*)
              FROM OMN11Order o
              WHERE o.order_archived = 1 ; `
            console.log(query);
            con.query(query, (err, result, field) => {
                con.release();
                callback(null, result[0]);
            })
        }
    })
};


function getArchivedOrdersDetail(req, callback) {
    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {

            const orderstartindex = (req.pageid - 1) * req.perpage;

            let query = `SELECT *  FROM (SELECT *
              FROM OMOrder o
              WHERE o.order_archived = 1 LIMIT ${orderstartindex},${req.perpage}) as oo 
              LEFT JOIN OrderProduct p ON ( oo.id = p.order_id ) ; `

            // let query = `SELECT *, o.id as id , o.order_id as order_id
            //   FROM OMOrder o
            //   WHERE o.order_archived = 1 LIMIT ${orderstartindex},${req.perpage};`
            console.log(query);
            con.query(query, (err, result, field) => {
                con.release();
                callback(null, result);
            })
        }
    })
};


function getN11ArchivedOrdersDetail(req, callback) {
    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {

            const orderstartindex = (req.pageid - 1) * req.perpage;

            let query = `SELECT *  FROM (SELECT *
              FROM OMN11Order o
              WHERE o.order_archived = 1 LIMIT ${orderstartindex},${req.perpage}) as oo 
              LEFT JOIN OMN11OrderProduct p ON ( oo.id = p.order_id ) ; `

            // let query = `SELECT *, o.id as id , o.order_id as order_id
            //   FROM OMOrder o
            //   WHERE o.order_archived = 1 LIMIT ${orderstartindex},${req.perpage};`
            console.log(query);
            con.query(query, (err, result, field) => {
                con.release();
                callback(null, result);
            })
        }
    })
};



function getOrdersDetailForShipping(callback) {
    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {
            let query = `select *, o.id as id , o.order_id as order_id
              FROM OMOrder o
              LEFT JOIN OrderProduct p ON ( o.id = p.order_id )
               WHERE o.invoice_created = 1 AND o.shipping_number = '' AND  o.order_state_id = 3`

            // let query = `select *, o.id as id , o.order_id as order_id
            //           FROM OMOrder o
            //           LEFT JOIN OrderProduct p ON ( o.id = p.order_id )
            //            `

            con.query(query, (err, result, field) => {
                con.release()
                callback(null, result)
            })
        }
    })
};


function getDeliveredOrdersDetail(callback) {
    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {
            let query = `select *, o.id as id , o.order_id as order_id
              FROM OMOrder o
              LEFT JOIN OrderProduct p ON ( o.id = p.order_id ) where order_state_id = 5 and o.order_archived = 0 LIMIT 300; `

            con.query(query, (err, result, field) => {
                con.release()
                callback(null, result)
            })
        }
    })
};




function checkNewOrders(callback) {

    getPrestaOrders(callback);


    // getPrestaOrders((result) => {
    //     result();
    // });
};




function searchOrder(request, callback) {
    getOmConnection(function (err, con) {
        if (err) { /* handle your error here */ } else {
            let result = ''
            _.forEach(request, function (value, key) {
                result += `${key} like '%${value}%' and `
            })

            console.log('ressss')
            console.log(result)

            if (result) {
                var lastIndex = result.lastIndexOf('and')
                result = result.substring(0, lastIndex)
            }

            let query = `select *, o.id as id , o.order_id as order_id
              FROM OMOrder o
               LEFT JOIN OrderProduct p ON ( o.id = p.order_id ) 
                WHERE ${result}`
            console.log(query)
            con.query(query, (err, result, field) => {
                if (err) {
                    console.log(err)
                } else {
                    callback(null, result)
                    con.release()
                }
            })
        }
    })
};

function addOrder(request, platformId, callback) {
    let query = `SELECT * FROM OMOrder where order_id= ${request.order_id};`
    console.log(query)

    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {


            // addOrderProduct(request, 1, con, (err, result) => {
            //     con.release()
            //     callback(null, result);
            // })

            con.query(query, (err, result, field) => {
                if (result.length > 0) {
                    addOrderProduct(request, result[0].id, con, (err, result) => {
                        con.release()
                        callback(null, result);
                    })
                } else {
                    addNewOrder(request, platformId, con, (err, result) => {
                        con.release()
                        callback(null, result);
                    })
                }
            })
        }

    })
};



function addOrderProduct(request, orderId, con, callback) {


    // let query = `SELECT * FROM OrderProduct where product_id= ${request.product_id} and order_id= ${orderId};`
    // console.log(query)


    // con.query(query, function (err, result, field) {
    //     if (err) {
    //         console.error(err)
    //     } else {

    //         if (result.length > 0) {
    //             console.error("product exist")
    //             callback(null, false)

    //         } else {

    let query2 = `INSERT INTO OrderProduct
                          (
                          order_id,
                          product_id,
                          product_name,
                          product_code,
                          product_quantity,
                          product_unit_price_with_tax,
                          product_unit_price,
                          product_price_with_tax,
                          product_price
                          )
                          VALUES
                          (
                            ${orderId},
                            ${request.product_id},
                            '${request.product_name}',
                            '${request.product_code}',
                             ${request.product_quantity},
                            '${request.product_unit_price_with_tax}',
                            '${request.product_unit_price}',
                            '${request.product_price_with_tax}',
                            '${request.product_price}'
                          );`

    console.log(query2);
    con.query(query2, function (err, result, field) {
        if (err) {
            console.error(err)
            callback(null, false)
        }
        else {
            callback(null, true)
        }
        // con.release()
    })

}
//         }
//     })
// };

function addNewOrder(request, platformId, con, callback) {
    let orderId = ''


    let query = `INSERT INTO OMOrder
                                        (
                                          platform_id,
                                          order_id,
                                          shipping_number,
                                          order_code,
                                          order_state,
                                          order_state_id,
                                          date_added,
                                          total_price_with_tax,
                                          total_price,
                                          total_shipping_with_tax,
                                          total_shipping,
                                          tax,
                                          total_discount_with_tax,
                                          total_discount,
                                          payment_type,
                                          customer_name,
                    customer_surname,
                    customer_email,
                    delivery_name,
                          delivery_surname,
                          delivery_email,
                          delivery_gsm,
                          delivery_address1,
                          delivery_address2,
                          delivery_postcode,
                          delivery_city,
                          delivery_note,
                          delivery_tckn,
                          delivery_vat_number,
                          delivery_company,
                          delivery_state,
                                   invoice_name,
                                  invoice_surname,
                                  invoice_gsm,
                                  invoice_phone,
                                  invoice_address1,
                                  invoice_address2,
                                  invoice_postcode,
                                  invoice_city,
                                  invoice_note,
                                  invoice_tckn,
                                  invoice_vat_number,
                                  invoice_company,
                                  invoice_state
                    
                                        )
                                        VALUES
                                        (
                                        ${platformId},
                                        ${request.order_id},
                                        '${request.shipping_number}',
                                        '${request.order_code}',
                                        '${request.order_state}',
                                        '${request.order_state_id}',
                                        '${request.date_added}',
                                        '${request.total_price_with_tax}',
                                        '${request.total_price}',
                                        '${request.total_shipping_with_tax}',
                                        '${request.total_shipping}',
                                        '${request.tax}',
                                        '${request.total_discount_with_tax}',
                                        '${request.total_discount}',
                                        '${request.payment_type}',
                                                            '${request.customer_name}',
                    '${request.customer_surname}',
                    '${request.customer_email}',
                                            '${request.delivery_name}',
                        '${request.delivery_surname}',
                        '${request.delivery_email}',
                        '${request.delivery_gsm}',
                        '${request.delivery_address1.replace(/[']/g, "''")}}',
                        '${request.delivery_address2.replace(/[']/g, "''")}}',
                        '${request.delivery_postcode}',
                        '${request.delivery_city.replace(/[']/g, "''")}}',
                        '${request.delivery_note.replace(/[']/g, "''")}}',
                        '${request.delivery_tckn}',
                        '${request.delivery_vat_number}',
                        '${request.delivery_company.replace(/[']/g, "''")}}',
                        '${request.delivery_state}',
                                            '${request.invoice_name}',
                                '${request.invoice_surname}',
                                '${request.invoice_gsm}',
                                '${request.invoice_phone}',
                                '${request.invoice_address1.replace(/[']/g, "''")}}',
                                '${request.invoice_address2.replace(/[']/g, "''")}}',
                                '${request.invoice_postcode}',
                                '${request.invoice_city.replace(/[']/g, "''")}}',
                                '${request.invoice_note.replace(/[']/g, "''")}}',
                                '${request.invoice_tckn}',
                                '${request.invoice_vat_number}',
                                '${request.invoice_company.replace(/[']/g, "''")}}',
                                '${request.invoice_state}'
                                        );`

    //.replace('\'', '\'\'')
    console.log(query);
    con.query(query, function (err, result, field) {
        if (err) {
            console.error(err)
            callback(null, false)

        } else {
            orderId = result.insertId;

            query = `INSERT INTO OrderProduct
                          (
                          order_id,
                          product_id,
                          product_name,
                          product_code,
                          product_quantity,
                          product_unit_price_with_tax,
                          product_unit_price,
                          product_price_with_tax,
                          product_price
                          )
                          VALUES
                          (
                            ${orderId},
                            ${request.product_id},
                            '${request.product_name}',
                            '${request.product_code}',
                             ${request.product_quantity},
                            '${request.product_unit_price_with_tax}',
                            '${request.product_unit_price}',
                            '${request.product_price_with_tax}',
                            '${request.product_price}'
                          );`


            con.query(query, function (err, result, field) {
                if (err) {
                    console.error(err)
                    callback(null, false)

                } else {
                    callback(null, true)

                }
            })


        }
    })
};




function updatePrestaStatus(orderRequest, callback) {

    console.log(orderRequest);
    var options = {
        method: 'POST',
        url: 'https://aromania.com.tr/api/order_histories&ws_key=DZHI9JPHPMHVL7KZG154SIFDIHWPS3XP&sendemail=1',
        headers:
        {
            'content-type': 'application/xml'
        },
        body: `<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">\n  
     <order_history>\n   
        <id_employee>1</id_employee>\n  
         <id_order_state>${orderRequest.order_state_id}</id_order_state>\n   
            <id_order>${orderRequest.order_id}</id_order>\n 
              </order_history>\n
              </prestashop>`
    };
    console.log("updatePrestaStatus");
    console.log(`<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">\n  
     <order_history>\n   
        <id_employee>1</id_employee>\n  
         <id_order_state>${orderRequest.order_state_id}</id_order_state>\n   
            <id_order>${orderRequest.order_id}</id_order>\n 
              </order_histor
              y>\n
              </prestashop>`);

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        parseString(body, function (err, xmlResult) {
            var str = JSON.stringify(xmlResult);
            console.log(str);
            callback(str);
        });
    });
}



function getPrestaOrders(callback) {

    const orderList = []

    getPrestaConnection(function (err, prestaCon) {
        let query = `SELECT MAX(id_order)  as id FROM ps77_orders;`

        prestaCon.query(query, function (err, result, field) {
            var prestaOrderId = result[0].id

            getOmConnection(function (err, omCon) {
                query = `select max(order_id) as id from OMOrder;`

                omCon.query(query, function (err, result, field) {


                    var omOrderId = result[0].id

                    query = ''
                    if (prestaOrderId && omOrderId) {
                        if (prestaOrderId > omOrderId) {
                            for (var i = omOrderId + 1; i <= prestaOrderId; i++) {
                                query += `SELECT d.id_order as order_id,
              o.reference as order_code,
              o.shipping_number as shipping_number,
              o.total_paid_tax_incl as total_price_with_tax, 
              o.total_paid_tax_excl as total_price,
              o.total_shipping_tax_incl as total_shipping_with_tax,
              o.total_shipping_tax_excl as total_shipping,
              (o.total_paid_tax_incl-o.total_paid_tax_excl) as tax,
              o.total_discounts_tax_incl as total_discount_with_tax, 
              o.total_discounts_tax_excl as total_discount, 
              os.name as order_state,
              os.id_order_state as order_state_id,
              o.date_add as date_added,
              d.product_name as product_name,
               d.product_id as product_id,
              d.product_reference as product_code,
              d.product_quantity as product_quantity,
              (d.total_price_tax_incl/d.product_quantity) as product_unit_price_with_tax, 
              (d.total_price_tax_excl/d.product_quantity) as product_unit_price, 
              d.total_price_tax_incl as product_price_with_tax, 
              d.total_price_tax_excl as product_price, 
              o.payment as payment_type, 
              g.firstname as customer_name,
              g.lastname as customer_surname,
              g.email as customer_email,
              ad.firstname as delivery_name,
              ad.lastname as delivery_surname,
              ad.address1 as delivery_address1,
              ad.address2 as delivery_address2,
              ad.postcode as delivery_postcode,
              ad.city as delivery_city,
              ad.other as delivery_note,
              ad.phone as delivery_phone,
              ad.phone_mobile as delivery_gsm,
              ad.dni as delivery_tckn,
              ad.vat_number as delivery_vat_number,
              ad.company as delivery_company, 
                                          ais.name as delivery_state,

              ai.firstname as invoice_name, 
              ai.lastname as invoice_surname,
              ai.address1 as invoice_address1, 
              ai.address2 as invoice_address2,
              ai.postcode as invoice_postcode, 
              ai.city as invoice_city, 
              ai.other as invoice_note,
              ai.phone as invoice_phone,
              ai.phone_mobile as invoice_gsm ,
              ad.dni as invoice_tckn,
              ad.vat_number as invoice_vat_number, 
              ad.company as invoice_company ,
                            ais.name as invoice_state

              FROM ps77_order_detail d
              LEFT JOIN ps77_orders o ON ( d.id_order = o.id_order ) 
              LEFT JOIN ps77_customer g ON ( o.id_customer = g.id_customer ) 
              LEFT JOIN ps77_stock_available s ON (d.product_id = s.id_product)
              LEFT JOIN ps77_address ad ON (o.id_address_delivery = ad.id_address)
              LEFT JOIN ps77_address ai ON (o.id_address_invoice = ai.id_address)
              LEFT JOIN ps77_group_lang gl ON ( g.id_default_group = gl.id_group ) 
              LEFT JOIN ps77_order_state_lang os ON ( o.current_state = os.id_order_state )
                                          LEFT JOIN ps77_state ais ON (ais.id_state = ai.id_state)
              WHERE os.id_lang =2 and o.id_order = ${i}
              GROUP BY d.product_name
ORDER BY d.id_order DESC;`
                            }


                            prestaCon.query(query, (err, result, field) => {
                                query = ''

                                _.forEach(result, (item) => {
                                    if (item instanceof Array) {
                                        _.forEach(item, (childElement) => {
                                            orderList.push(childElement)
                                        })
                                    } else {

                                        orderList.push(item)
                                    }
                                });

                                console.log(orderList);

                                x = 0;
                                callback(orderList);
                                loopArray(orderList);
                                // if (callback == undefined) {
                                //     console.log("callback");
                                //     loopArray(orderList);
                                // }
                                // else {
                                //     callback(orderList);
                                // }



                                prestaCon.release()
                                omCon.release()
                            })
                        }
                        else {
                            prestaCon.release()
                            omCon.release()


                            if (callback != undefined) {
                                callback(orderList);
                            }
                        }
                    }
                    else {
                        omCon.release()
                        prestaCon.release()

                        if (callback != undefined) {
                            callback(orderList);
                        }
                    }
                })

            })
        })
    })

}



function getPrestaOrder(req, callback) {

    const orderList = []
    console.log("req.orderid");


    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
            callback(err, false)

        } else {

            let query = `SELECT * FROM OMOrder where order_id= ${req.orderid};`

            con.query(query, (err, result, field) => {
                if (result.length > 0) {
                    callback("Order exist", false)
                }
                else {

                    console.log(req.orderid);
                    query = `SELECT d.id_order as order_id,
              o.reference as order_code,
              o.shipping_number as shipping_number,
              o.total_paid_tax_incl as total_price_with_tax, 
              o.total_paid_tax_excl as total_price,
              o.total_shipping_tax_incl as total_shipping_with_tax,
              o.total_shipping_tax_excl as total_shipping,
              (o.total_paid_tax_incl-o.total_paid_tax_excl) as tax,
              o.total_discounts_tax_incl as total_discount_with_tax, 
              o.total_discounts_tax_excl as total_discount, 
              os.name as order_state,
              os.id_order_state as order_state_id,
              o.date_add as date_added,
              d.product_name as product_name,
               d.product_id as product_id,
              d.product_reference as product_code,
              d.product_quantity as product_quantity,
              (d.total_price_tax_incl/d.product_quantity) as product_unit_price_with_tax, 
              (d.total_price_tax_excl/d.product_quantity) as product_unit_price, 
              d.total_price_tax_incl as product_price_with_tax, 
              d.total_price_tax_excl as product_price, 
              o.payment as payment_type, 
              g.firstname as customer_name,
              g.lastname as customer_surname,
              g.email as customer_email,
              ad.firstname as delivery_name,
              ad.lastname as delivery_surname,
              ad.address1 as delivery_address1,
              ad.address2 as delivery_address2,
              ad.postcode as delivery_postcode,
              ad.city as delivery_city,
              ad.other as delivery_note,
              ad.phone as delivery_phone,
              ad.phone_mobile as delivery_gsm,
              ad.dni as delivery_tckn,
              ad.vat_number as delivery_vat_number,
              ad.company as delivery_company, 
              ais.name as delivery_state,
              ai.firstname as invoice_name, 
              ai.lastname as invoice_surname,
              ai.address1 as invoice_address1, 
              ai.address2 as invoice_address2,
              ai.postcode as invoice_postcode, 
              ai.city as invoice_city, 
              ai.other as invoice_note,
              ai.phone as invoice_phone,
              ai.phone_mobile as invoice_gsm ,
              ad.dni as invoice_tckn,
              ad.vat_number as invoice_vat_number, 
              ad.company as invoice_company ,
                            ais.name as invoice_state

              FROM ps77_order_detail d
              LEFT JOIN ps77_orders o ON ( d.id_order = o.id_order ) 
              LEFT JOIN ps77_customer g ON ( o.id_customer = g.id_customer ) 
              LEFT JOIN ps77_stock_available s ON (d.product_id = s.id_product)
              LEFT JOIN ps77_address ad ON (o.id_address_delivery = ad.id_address)
              LEFT JOIN ps77_address ai ON (o.id_address_invoice = ai.id_address)
              LEFT JOIN ps77_group_lang gl ON ( g.id_default_group = gl.id_group ) 
              LEFT JOIN ps77_order_state_lang os ON ( o.current_state = os.id_order_state )
                                          LEFT JOIN ps77_state ais ON (ais.id_state = ai.id_state)
              WHERE os.id_lang =2 and o.id_order = ${req.orderid}
              GROUP BY d.product_name
ORDER BY d.id_order DESC;`


                    getPrestaConnection(function (err, prestaCon) {

                        prestaCon.query(query, (err, result, field) => {

                            _.forEach(result, (item) => {
                                if (item instanceof Array) {
                                    _.forEach(item, (childElement) => {
                                        orderList.push(childElement)
                                    })
                                } else {

                                    orderList.push(item)
                                }
                            });

                            console.log("orderList");

                            console.log(orderList);

                            if (orderList.length == 0) {
                                callback("Order not found", false)
                            }
                            else {

                                let firstOrder = orderList[0];

                                query = `INSERT INTO OMOrder
                                        (
                                          platform_id,
                                          order_id,
                                          shipping_number,
                                          order_code,
                                          order_state,
                                          order_state_id,
                                          date_added,
                                          total_price_with_tax,
                                          total_price,
                                          total_shipping_with_tax,
                                          total_shipping,
                                          tax,
                                          total_discount_with_tax,
                                          total_discount,
                                          payment_type,
                                          customer_name,
                    customer_surname,
                    customer_email,
                    delivery_name,
                          delivery_surname,
                          delivery_email,
                          delivery_gsm,
                          delivery_address1,
                          delivery_address2,
                          delivery_postcode,
                          delivery_city,
                          delivery_note,
                          delivery_tckn,
                          delivery_vat_number,
                          delivery_company,
                          delivery_state,
                                   invoice_name,
                                  invoice_surname,
                                  invoice_gsm,
                                  invoice_phone,
                                  invoice_address1,
                                  invoice_address2,
                                  invoice_postcode,
                                  invoice_city,
                                  invoice_note,
                                  invoice_tckn,
                                  invoice_vat_number,
                                  invoice_company,
                                  invoice_state
                    
                                        )
                                        VALUES
                                        (
                                        1,
                                        ${firstOrder.order_id},
                                        '${firstOrder.shipping_number}',
                                        '${firstOrder.order_code}',
                                        '${firstOrder.order_state}',
                                        '${firstOrder.order_state_id}',
                                        '${firstOrder.date_added}',
                                        '${firstOrder.total_price_with_tax}',
                                        '${firstOrder.total_price}',
                                        '${firstOrder.total_shipping_with_tax}',
                                        '${firstOrder.total_shipping}',
                                        '${firstOrder.tax}',
                                        '${firstOrder.total_discount_with_tax}',
                                        '${firstOrder.total_discount}',
                                        '${firstOrder.payment_type}',
                                                            '${firstOrder.customer_name}',
                    '${firstOrder.customer_surname}',
                    '${firstOrder.customer_email}',
                                            '${firstOrder.delivery_name}',
                        '${firstOrder.delivery_surname}',
                        '${firstOrder.delivery_email}',
                        '${firstOrder.delivery_gsm}',
                        '${firstOrder.delivery_address1.replace(/[']/g, "''")}',
                        '${firstOrder.delivery_address2.replace(/[']/g, "''")}',
                        '${firstOrder.delivery_postcode}',
                        '${firstOrder.delivery_city.replace(/[']/g, "''")}',
                        '${firstOrder.delivery_note.replace(/[']/g, "''")}',
                        '${firstOrder.delivery_tckn}',
                        '${firstOrder.delivery_vat_number}',
                        '${firstOrder.delivery_company.replace(/[']/g, "''")}',
                        '${firstOrder.delivery_state}',
                                            '${firstOrder.invoice_name}',
                                '${firstOrder.invoice_surname}',
                                '${firstOrder.invoice_gsm}',
                                '${firstOrder.invoice_phone}',
                                '${firstOrder.invoice_address1.replace(/[']/g, "''")}',
                                '${firstOrder.invoice_address2.replace(/[']/g, "''")}',
                                '${firstOrder.invoice_postcode}',
                                '${firstOrder.invoice_city.replace(/[']/g, "''")}',
                                '${firstOrder.invoice_note.replace(/[']/g, "''")}',
                                '${firstOrder.invoice_tckn}',
                                '${firstOrder.invoice_vat_number}',
                                '${firstOrder.invoice_company.replace(/[']/g, "''")}',
                                '${firstOrder.invoice_state}'
                                        );`

                                getOmConnection((err, con) => {
                                    if (err) {
                                        console.log(err)
                                        callback(err, false)

                                    } else {
                                        console.log(query);
                                        con.query(query, function (err, result, field) {
                                            if (err) {
                                                console.error(err)
                                                callback(err, false)

                                            } else {
                                                let orderId = result.insertId;

                                                console.log("result orderid")
                                                console.log(orderId)

                                                query = '';

                                                _.map(orderList, (orderThat) => {

                                                    query += `INSERT INTO OrderProduct
                                        (
                                        order_id,
                                        product_id,
                                        product_name,
                                        product_code,
                                        product_quantity,
                                        product_unit_price_with_tax,
                                        product_unit_price,
                                        product_price_with_tax,
                                        product_price
                                        )
                                        VALUES
                                        (
                                            ${orderId},
                                            ${orderThat.product_id},
                                            '${orderThat.product_name}',
                                            '${orderThat.product_code}',
                                            ${orderThat.product_quantity},
                                            '${orderThat.product_unit_price_with_tax}',
                                            '${orderThat.product_unit_price}',
                                            '${orderThat.product_price_with_tax}',
                                            '${orderThat.product_price}'
                                        );`
                                                })

                                                console.log(query);

                                                con.query(query, function (err, result, field) {
                                                    if (err) {
                                                        console.error(err)
                                                        callback(err, false)

                                                    } else {
                                                        callback(orderList, true)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }

                        })
                    })

                }
            })

        }

    })
}

function loopArray(orderList) {
    // console.log(orderList)

    // product.decreaseQuantity(orderList[x], (err, result) => {

    // })
    if (undefined !== orderList && orderList.length && x < orderList.length) {
        const newOrder = orderList[x];

        if (newOrder != undefined) {
            addOrder(newOrder, 1, (err, result) => {

                x++
                loopArray(orderList)
            });
        }
    }
};


function filterOrderStatus(req, callback) {
    getOmConnection((err, con) => {
        if (err) {
            console.log(err)
        } else {
            let query = `select *, o.id as id , o.order_id as order_id
              FROM OMOrder o
              LEFT JOIN OrderProduct p ON ( o.id = p.order_id )
              WHERE o.order_state_id = ${req.id} ; `

            con.query(query, (err, result, field) => {
                con.release()
                callback(null, result)
            })
        }
    })
};

module.exports = {
    addOrder,
    getDeliveredOrdersDetail,
    getInvoiceDetails,
    getOrdersWithoutInvoice,
    setInvoiceCreated,
    updateStatus,
    updateShipping,
    getOrdersDetail,
    updateOrder,
    checkNewOrders,
    searchOrder,
    addOrderProduct,
    addNewOrder,
    updatePrestaStatus,
    getPrestaOrders,
    filterOrderStatus,
    getOrdersDetailForShipping,
    getArchivedOrdersDetail,
    getArchivedOrdersCount,
    getN11ArchivedOrdersDetail,
    getN11ArchivedOrdersCount,
    archiveOrder,
    getn11Orders,
    getAlln11Orders,
    getPrestaOrder
}
