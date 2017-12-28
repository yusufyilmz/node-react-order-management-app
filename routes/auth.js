
const express = require('express');
const auth = require('../data/auth');

// import { updateProduct, addProduct, getProduct } from '../data/product';
const router = express.Router()

router.post('/login', function (req, res, next) {
    console.log(req.body);
    auth.login(req.body, (result) => {
        console.log("login");

        console.log(result);
        res.send(result);
    })
})


module.exports = router
