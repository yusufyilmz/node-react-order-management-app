var express = require('express');
const router = express.Router();
const shipping = require('../data/shipping');


router.post('/upload', function (req, res) {
    shipping.uploadShippings(req, res, (result) => {

        console.log(result);
        if (result.error_code = 0) {
            res.send(result.error_desc);
        }
        else {
            res.send(result.data);
        }

    });
});


router.post('/update', function (req, res) {
    console.log(req);
    shipping.updateShippings(req, (result) => {

        if (result.error_code = 0) {
            res.send(result.error_desc);
        }
        else {
            res.send(result.data);
        }
    });
});

module.exports = router
