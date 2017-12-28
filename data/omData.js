// import mysql from 'mysql';
const mysql = require('mysql')
// const connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: '532404Yy',
// 	database: 'OrderManagement',
// 		multipleStatements: true
// });

// var pool = mysql.createPool({
//   host: '5.189.130.143',
//   user: 'db_manager_test',
//   password: '9A&18tsg',
//   database: 'aromania_manager_test',
//   multipleStatements: true
// });

//staging


//prod

var pool = mysql.createPool({
  host: '5.189.130.143',
  user: 'db_manager',
  password: '9A&18tsg',
  database: 'aromania_manager',
  multipleStatements: true
});


const getOmConnection = function (cb) {
  pool.getConnection(function (err, connection) {
    // if(err) throw err;
    // pass the error to the cb instead of throwing it
    if (err) {
      console.log('error' + err)
      return cb(err)
    }


    cb(null, connection)
  });
};

module.exports = getOmConnection

getOmConnection(function (err, connection) {
  if (err) throw err


  var sql = 'CREATE TABLE IF NOT EXISTS Platform( \
		`id` int AUTO_INCREMENT NOT NULL,\
		`platform_name` nvarchar(100) NULL,\
		CONSTRAINT `PK_Platform` PRIMARY KEY (`id` ASC) \
	); '
  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })

  sql = 'CREATE TABLE IF NOT EXISTS OMProduct( \
	`id` int AUTO_INCREMENT NOT NULL,\
	`product_name` nvarchar(100) NULL,\
	`product_quantity` int  NOT NULL DEFAULT 0,\
  `platform_id` int NOT NULL,\
	`product_refid` int NOT NULL,\
	`product_refcode` nvarchar(100) NULL,\
	`product_refprice` double NULL,\
  CONSTRAINT FK_Platform_PlatformId FOREIGN KEY (platform_id) REFERENCES Platform(`id`),\
 	 CONSTRAINT `PK_Product` PRIMARY KEY (`id` ASC) \
	); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })



  sql = 'CREATE TABLE IF NOT EXISTS `OMN11Order`( \
	`id` int AUTO_INCREMENT NOT NULL,\
	`platform_id` int NOT NULL,\
  `order_id` int NOT NULL DEFAULT 0,\
	`order_number` nvarchar(100) NULL,\
  `order_archived` int NOT NULL DEFAULT 0,\
	`date_added` nvarchar(100) NULL,\
  `total_price` nvarchar(20) NULL,\
  `total_shipping` nvarchar(20) NULL,\
  `tax` nvarchar(20) NULL,\
  `total_discount` nvarchar(20) NULL,\
  `campaign_code` nvarchar(50) NULL,\
  `customer_name` nvarchar(100) NULL,\
        `customer_surname` nvarchar(100) NULL,\
        `customer_email` nvarchar(100) NULL,\
      	`customer_gsm` nvarchar(100) NULL,\
  `invoice_created` int NOT NULL DEFAULT 0,\
              	`invoice_name` nvarchar(100) NULL,\
        `invoice_surname` nvarchar(100) NULL,\
      	`invoice_gsm` nvarchar(100) NULL,\
        `invoice_phone` nvarchar(100) NULL,\
      	`invoice_address1` nvarchar(300) NULL,\
        `invoice_address2` nvarchar(300) NULL,\
        `invoice_postcode` nvarchar(50) NULL,\
        `invoice_city` nvarchar(50) NULL,\
        `invoice_state` nvarchar(100) NULL,\
        `invoice_note` nvarchar(300) NULL,\
        `invoice_tckn` nvarchar(20) NULL,\
        `invoice_vat_number` nvarchar(20) NULL,\
        `invoice_vat_daire` nvarchar(20) NULL,\
        `invoice_company` nvarchar(100) NULL,\
              	`delivery_name` nvarchar(50) NULL,\
        `delivery_surname` nvarchar(50) NULL,\
        `delivery_email` nvarchar(50) NULL,\
      	`delivery_gsm` nvarchar(20) NULL,\
      	`delivery_address1` nvarchar(300) NULL,\
        `delivery_address2` nvarchar(300) NULL,\
        `delivery_postcode` nvarchar(50) NULL,\
        `delivery_city` nvarchar(50) NULL,\
        `delivery_state` nvarchar(100) NULL,\
        `delivery_note` nvarchar(300) NULL,\
        `delivery_tckn` nvarchar(20) NULL,\
        `delivery_vat_number` nvarchar(20) NULL,\
                `delivery_vat_daire` nvarchar(20) NULL,\
        `delivery_company` nvarchar(100) NULL,\
        CONSTRAINT FK_Order_PlatformId FOREIGN KEY (platform_id) REFERENCES Platform(`id`),\
        CONSTRAINT `PK_Order` PRIMARY KEY (`id` ASC) ); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })


  sql = 'CREATE TABLE IF NOT EXISTS `OMN11OrderProduct`( \
		`id` int AUTO_INCREMENT NOT NULL,\
    `order_id` int  NULL,\
		`product_id` int  NULL,\
      	`product_name` nvarchar(100) NULL,\
        `product_code` nvarchar(50) NULL,\
      	`product_quantity` int NULL,\
      	`product_unit_price` nvarchar(50) NULL,\
      	`product_price` nvarchar(50) NULL,\
        CONSTRAINT FK_OrderProduct_OrderId FOREIGN KEY (order_id) REFERENCES OMN11Order(`id`),\
	 	CONSTRAINT `PK_OrderProduct` PRIMARY KEY (`id` ASC) ); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })


  sql = 'CREATE TABLE IF NOT EXISTS `OMOrder`( \
	`id` int AUTO_INCREMENT NOT NULL,\
	`platform_id` int NOT NULL,\
  `order_id` int NOT NULL DEFAULT 0,\
  `order_archived` int NOT NULL DEFAULT 0,\
  `shipping_number` nvarchar(100) NULL,\
	`order_code` nvarchar(100) NULL,\
  `order_state` nvarchar(100) NULL,\
	`date_added` nvarchar(100) NULL,\
  `order_state_id` int NOT NULL DEFAULT 0,\
    `total_price_with_tax` nvarchar(20) NULL,\
  `total_price` nvarchar(20) NULL,\
  `total_shipping_with_tax` nvarchar(20) NULL,\
  `total_shipping` nvarchar(20) NULL,\
  `tax` nvarchar(20) NULL,\
    `total_discount_with_tax` nvarchar(20) NULL,\
  `total_discount` nvarchar(20) NULL,\
  `payment_type` nvarchar(70) NULL,\
  `invoice_created` int NOT NULL DEFAULT 0,\
       	`customer_name` nvarchar(100) NULL,\
        `customer_surname` nvarchar(100) NULL,\
        `customer_email` nvarchar(100) NULL,\
      	`customer_gsm` nvarchar(100) NULL,\
              	`invoice_name` nvarchar(100) NULL,\
        `invoice_surname` nvarchar(100) NULL,\
      	`invoice_gsm` nvarchar(100) NULL,\
        `invoice_phone` nvarchar(100) NULL,\
      	`invoice_address1` nvarchar(300) NULL,\
        `invoice_address2` nvarchar(300) NULL,\
        `invoice_postcode` nvarchar(50) NULL,\
        `invoice_city` nvarchar(50) NULL,\
        `invoice_note` nvarchar(300) NULL,\
        `invoice_tckn` nvarchar(20) NULL,\
        `invoice_vat_number` nvarchar(20) NULL,\
        `invoice_company` nvarchar(100) NULL,\
        `invoice_state` nvarchar(100) NULL,\
              	`delivery_name` nvarchar(50) NULL,\
        `delivery_surname` nvarchar(50) NULL,\
        `delivery_email` nvarchar(50) NULL,\
      	`delivery_gsm` nvarchar(20) NULL,\
      	`delivery_address1` nvarchar(300) NULL,\
        `delivery_address2` nvarchar(300) NULL,\
        `delivery_postcode` nvarchar(50) NULL,\
        `delivery_city` nvarchar(50) NULL,\
        `delivery_note` nvarchar(300) NULL,\
        `delivery_tckn` nvarchar(20) NULL,\
        `delivery_vat_number` nvarchar(20) NULL,\
        `delivery_company` nvarchar(100) NULL,\
        `delivery_state` nvarchar(100) NULL,\
        CONSTRAINT FK_Order_PlatformId FOREIGN KEY (platform_id) REFERENCES Platform(`id`),\
        CONSTRAINT `PK_Order` PRIMARY KEY (`id` ASC) ); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })

  // connection.query(sql, function (err, result) {
  //   if (err) throw err
  //   console.log(result)
  // })

  sql = 'CREATE TABLE IF NOT EXISTS `OrderProduct`( \
		`id` int AUTO_INCREMENT NOT NULL,\
    `order_id` int  NULL,\
		`product_id` int  NULL,\
      	`product_name` nvarchar(100) NULL,\
        `product_code` nvarchar(50) NULL,\
      	`product_quantity` int NULL,\
        `product_unit_price_with_tax` nvarchar(50) NULL,\
      	`product_unit_price` nvarchar(50) NULL,\
       `product_price_with_tax` nvarchar(50) NULL,\
      	`product_price` nvarchar(50) NULL,\
        CONSTRAINT FK_OrderProduct_OrderId FOREIGN KEY (order_id) REFERENCES OMOrder(`id`),\
	 	CONSTRAINT `PK_OrderProduct` PRIMARY KEY (`id` ASC) ); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })




  sql = 'CREATE TABLE IF NOT EXISTS `OMParameters2`( \
		`id` int AUTO_INCREMENT NOT NULL,\
    `parameter_name` nvarchar(100)  NULL,\
    `parameter_value` nvarchar(100)  NULL,\
	 	CONSTRAINT `PK_OMParameters2` PRIMARY KEY (`id` ASC) ); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })



  sql = 'CREATE TABLE IF NOT EXISTS `OMLogin`( \
		`id` int AUTO_INCREMENT NOT NULL,\
    `username` nvarchar(100)  NULL,\
		`password` nvarchar(100)  NULL,\
    `role` nvarchar(100)  NULL,\
	 	CONSTRAINT `PK_OMAuth` PRIMARY KEY (`id` ASC) ); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })


  sql = 'CREATE TABLE IF NOT EXISTS `OMInvoiceStyle`( \
		`id` int AUTO_INCREMENT NOT NULL,\
    `customerlabel` nvarchar(200)  NULL,\
		`invoicepricetextlabel` nvarchar(200)  NULL,\
		`invoicepricetable` nvarchar(200)  NULL,\
		`invoiceproducttable` nvarchar(200)  NULL,\
    `customercontrolledpositionx` int  NULL,\
    `customercontrolledpositiony` int  NULL,\
    `invoicepricetextcontrolledpositionx` int  NULL,\
    `invoicepricetextcontrolledpositiony` int  NULL,\
    `invoicepricecontrolledpositionx` int  NULL,\
    `invoicepricecontrolledpositiony` int  NULL,\
    `invoicepricetablecontrolledpositionx` int  NULL,\
    `invoicepricetablecontrolledpositiony` int  NULL,\
    `datecontrolledpositiony` int  NULL,\
    `datecontrolledpositionx` int  NULL,\
    `producttablecontrolledpositionx` int  NULL,\
    `producttablecontrolledpositiony` int  NULL,\
    `taxlabelcontrolledpositionx` int  NULL,\
    `taxlabelcontrolledpositiony` int  NULL,\
	 	CONSTRAINT `PK_OMInvoiceStyle` PRIMARY KEY (`id` ASC) ); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })


  sql = 'CREATE TABLE IF NOT EXISTS `OMInvoice`( \
		`id` int AUTO_INCREMENT NOT NULL,\
    `order_id` int  NULL,\
    `order_invoice_id` int  NULL,\
    `invoice_seri_no` nvarchar(50)  NULL,\
		`invoice_sira_no` nvarchar(50)  NULL,\
		`invoice_total_price` nvarchar(50)  NULL,\
		`invoice_tax_price` nvarchar(50)  NULL,\
    `invoice_prepare_date` nvarchar(50)  NULL,\
    `invoice_prepare_time` nvarchar(50)  NULL,\
	 	CONSTRAINT `PK_OMInvoice` PRIMARY KEY (`id` ASC) ); '

  connection.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
  })





})
