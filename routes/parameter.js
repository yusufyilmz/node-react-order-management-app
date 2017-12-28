const express = require('express');
const parameter = require('../data/parameter');

// import { updateProduct, addProduct, getProduct } from '../data/product';
const router = express.Router()

router.get('/set', (req, res) => {

    parameter.setTimer(req.query, (result) => {
        if (result.err_desc) {
            res.send(result.error_desc);
        }
        else {
            res.send(result.data);
        }
    });
});

router.get('/getall', (req, res) => {

    parameter.getAllTimers(req.query, (result) => {
        if (result.err_desc) {
            res.send(result.error_desc);
        }
        else {
            console.log(result.data);
            res.send(result.data);
        }
    });
});

router.get('/setinvoice', (req, res) => {

    parameter.updateInvoiceParameter(req.query, (result) => {
        if (result.err_desc) {
            res.send(result.error_desc);
        }
        else {
            console.log(result.data);
            res.send(result.data);
        }
    });
});

router.get('/getinvoice', (req, res) => {

    parameter.getInvoiceParameter(req.query, (result) => {
        if (result.err_desc) {
            res.send(result.error_desc);
        }
        else {
            console.log(result.data);
            res.send(result.data);
        }
    });
});





router.get('/get', (req, res) => {

    console.log(req.query);
    parameter.getTimer(req.query, (result) => {
        if (result.err_desc) {
            console.log(result.err_desc);
            res.send(result.error_desc);
        }
        else {
            console.log(result.data);
            res.send(result.data);
        }
    });
});

module.exports = router
