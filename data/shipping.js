var express = require('express');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
const router = express.Router()
var _ = require('lodash');
// var levenshtein = require('fast-levenshtein');
const order = require('./omorder');


var fs = require('fs');



var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
        cb(null, file.fieldname + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])

    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        console.log(file.originalname);

        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            console.log('Wrong extension type');

            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');


var x = 0
var loopArray = (shippingList, callback) => {

    var item = {
        shipping_number: shippingList[x].shipping_number,
        order_state: 'Kargoya verildi',
        order_state_id: '4',
        order_id: shippingList[x].order_id
    }

    order.updateShipping(item, (err, result) => {

        if (err) {
            callback({ error_code: 1, error_desc: err, data: null });
            return;
        }

        x++
        if (undefined !== shippingList && shippingList.length && x < shippingList.length) {
            loopArray(shippingList, callback)
        }
        else {
            callback({ error_code: 0, error_desc: null, data: result });
        }
    })
}


const updateShippings = (request, callback) => {


    console.log(request.body);
    if (request.body.items.length > 0) {
        x = 0;
        loopArray(request.body.items, callback);
    }
    else {
        console.log("updateShippings null shipping list");
        callback({ error_code: 1, error_desc: "null shipping list", data: null });
    }
    //  '4', label: 'Kargoya verildi'

};

const uploadShippings = (req, res, callback) => {
    var exceltojson;
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            callback({ error_code: 1, err_desc: err, data: null });
            return;
        }
        // console.log(req.file);

        /** Multer gives us file info in req.file object */
        if (!req.file) {
            callback({ error_code: 1, err_desc: "No file passed", data: null });
            return;
        }
        /** Check the extension of the incoming file and 
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        // console.log(req.file.path);
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true
            }, function (err, result) {
                if (err) {
                    callback({ error_code: 1, err_desc: err, data: null });
                }
                manageShippings(result, (shippingSimilarResult) => {
                    // console.log("2");
                    // console.log(shippingSimilarResult);

                    callback({ error_code: 0, err_desc: null, data: shippingSimilarResult });
                });
            });
        } catch (e) {
            callback({ error_code: 1, err_desc: "Corupted excel file", data: null });
        }
    })


}

var manageShippings = (data, callback) => {


    var array = _.map(data, function (object) {
        return _.pick(object, ['takipno', 'alici']);
    });


    var filteredArray = _.filter(array, (item) => { return item.takipno && item.alici })

    console.log(filteredArray);

    order.getOrdersDetailForShipping((err, orders) => {


        var finalResult = _.map(filteredArray, (value) => {


            var result = _.map(orders, (order) => {
                var name = order.invoice_name + " " + order.invoice_surname;


                // var distance = levenshtein.get(value.alici, name);   // 2
                var distance = levenshtein(value.alici.toLowerCase(), name.toLowerCase());   // 2


                // if (value.alici.indexOf("Muhammet Ahmet") != -1) {
                //     var json = { order_id: order.order_id, order_customer: name, shipping_customer: value.alici, shipping_number: value.takipno, difference: (distance / value.alici.length * 100) };
                //     console.log(json);
                // }
                return { shipping_customer: value.alici, shipping_number: value.takipno, order_id: order.order_id, order_customer: name, difference: (distance / value.alici.length * 100) };
            });

            var lowest = _.min(result, function (o) { return o.difference });



            return lowest;
        });

         console.log(finalResult);

        finalResult = _.uniq(finalResult, function (e) {
            return e.shipping_customer;
        });
         console.log(finalResult);
        callback(finalResult);

    })
}

function levenshtein(str1, str2) {
    var m = str1.length,
        n = str2.length,
        d = [],
        i, j;
    if (!m) return n;
    if (!n) return m;

    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (j = 1; j <= n; j++) {
        for (i = 1; i <= m; i++) {
            if (str1[i - 1] === str2[j - 1]) {
                d[i][j] = d[i - 1][j - 1];
            } else {
                d[i][j] = Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]) + 1;
            }
        }
    }
    return d[m][n];
}



module.exports = {
    uploadShippings,
    updateShippings
}
