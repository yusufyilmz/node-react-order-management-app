const express = require('express');
const compress = require('compression');
var bodyParser = require('body-parser');
var product = require('./routes/product');
var order = require('./routes/order');
var invoice = require('./routes/invoice');
var shipping = require('./routes/shipping');
var parameter = require('./routes/parameter');
var auth = require('./routes/auth');
var invoicestyle = require('./routes/invoicestyle');

const path = require('path');
const port  = process.env.PORT || 8080;
const app = express();
const xmlparser = require('express-xml-bodyparser');
const prestaworker = require('./worker/prestaworker');
const shippingworker = require('./worker/shippingworker');

app.use(compress());

app.use('/static', express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(xmlparser());

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use('/api/product', product);
app.use('/api/order', order);
app.use('/api/invoice', invoice);
app.use('/api/shipping', shipping);
app.use('/api/parameter', parameter);
app.use('/api/auth', auth);
app.use('/api/invoicestyle', invoicestyle);

//  shippingworker.start();
//prestaworker.start();
app.use(express.static(__dirname));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});


var env = process.env.NODE_ENV || 'dev';
console.log(env);
app.listen(port);
console.log('server started');