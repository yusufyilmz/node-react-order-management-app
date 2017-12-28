// Requires
const { wrap } = require('co')
const { join } = require('path')
// const moment = require('moment')
const pdf = require('html-pdf')
// const thunkify = require('thunkify')
// const read = thunkify(require('fs').readFile)
const handlebars = require('handlebars')
const fs = require('fs')
const _ = require('lodash')
// PDF Options

// format: 'A4', quality: 300, orientation:'landscape', 
// const pdf_options = { border: '0' }
const pdf_options = { format: 'A4', quality: 300,  orientation:'landscape', border: '0' }

// GeneratePDF
const generatePDF = wrap((callback) => {
  fs.readFile(join(`${__dirname}/template.html`), 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    console.log(data)

    const template = handlebars.compile(data)

    const html = template()

	// Generate PDF and thunkify the toFile function
    // const p = pdf.create(html, pdf_options)
    // p.toFile = thunkify(p.toFile)
    // console.log(data)

    // p.toFile(`${join(__dirname, 'invoice.pdf')}`)

    pdf.create(html, pdf_options).toFile(`${join(__dirname, 'invoice.pdf')}`, function (err, res) {
      console.log(res.filename)
      callback(res.filename)
    })
  })
})


// GeneratePDF
const generatePDFWithData = wrap((body, callback) => {
  fs.readFile(join(`${__dirname}/template.html`), 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }

console.log(`${__dirname}/template.html`);
    data = data.replace(/{invoice_name}/g, body.invoice_name)
    data = data.replace(/{invoice_surname}/g, body.invoice_surname)
    data = data.replace(/{invoice_city}/g, body.invoice_city )
    data = data.replace(/{invoice_gsm}/g, body.invoice_gsm )
    data = data.replace(/{invoice_address1}/g, body.invoice_address1 )
    data = data.replace(/{invoice_address2}/g, body.invoice_address2 )
    data = data.replace(/{invoice_vax}/g, body.invoice_vax )

    data = data.replace(/{time}/g, body.time )
    data = data.replace(/{date}/g, body.date)
    data = data.replace(/{total_price}/g, body.total_price)
    data = data.replace(/{total_discount}/g, body.total_discount)
    data = data.replace(/{total_price_with_tax}/g, body.total_price_with_tax )
    data = data.replace(/{total_price_text}/g, body.total_price_text)
    data = data.replace(/{tax}/g, body.tax )
    // data = data.replace(/{products}/g, body.products  )

    const table_template = ` <tr class="handle react-draggable" style="touch-action: none; font-size: 6px; font-weight: bold; letter-spacing: 0px; font-family: helvetica, sans-serif; border-spacing: 10px; color: black; transform: translate(0px, 0px);">
                                 <td style="font-size: 6px; font-weight: bold; letter-spacing: 0px; font-family: helvetica, sans-serif; border-spacing: 10px; color: black;">
                                    <!-- react-text: 3213 -->{product_quantity}<!-- /react-text --><!-- react-text: 3214 --> Adet<!-- /react-text -->
                                 </td>
                                 <td style="font-size: 6px; font-weight: bold; letter-spacing: 0px; font-family: helvetica, sans-serif; border-spacing: 11px; padding-left: 10px; width: 95px;">{product_name}</td>
                                 <td style="font-size: 6px; font-weight: bold; letter-spacing: 0px; font-family: helvetica, sans-serif; border-spacing: 11px; padding-right: 15px;">
                                    <!-- react-text: 3217 -->{product_unit_price}<!-- /react-text --><!-- react-text: 3218 --> TL<!-- /react-text -->
                                 </td>
                                 <td style="font-size: 6px; font-weight: bold; letter-spacing: 0px; font-family: helvetica, sans-serif; border-spacing: 7px; padding-left: 10px;">
                                    <!-- react-text: 3220 --> <!-- /react-text --><!-- react-text: 3221 -->{product_price}<!-- /react-text --><!-- react-text: 3222 --> TL <!-- /react-text -->
                                 </td>
                              </tr`


    let products = ''
    _.forEach(body.products, (product) => {
      products += table_template

      products = products.replace(/{product_quantity}/g, product.product_quantity)
      products = products.replace(/{product_unit_price}/g, product.product_unit_price)
      products = products.replace(/{product_price}/g, product.product_price )
      products = products.replace(/{product_name}/g, product.product_name )
    })

    console.log(products)
    data = data.replace(/{products}/g, products)

    const template = handlebars.compile(data)

    let html = template()

    pdf.create(html, pdf_options).toFile(`${join(__dirname, 'invoice.pdf')}`, function (err, res) {
      console.log(res.filename)
      callback(res.filename)
    })
  })
})

const generatePDFWithTemplate = wrap((data, callback) => {

  const template = handlebars.compile(data)

  const html = template()

  pdf.create(html, pdf_options).toFile(`${join(__dirname, 'invoice.pdf')}`, function (err, res) {
    console.log(res.filename)
    callback(res.filename)
  })
})

//   const source =  read(join(`${__dirname}/template.html`), 'utf-8')

	// Convert to Handlebars template and add the data
//   const html = template()

// 	// Generate PDF and thunkify the toFile function
//   const p = pdf.create(html, pdf_options)
//   p.toFile = thunkify(p.toFile)

	// Saves the file to the File System as invoice.pdf in the current directory
    //     const url= `${join(__dirname, 'invoice.pdf')}`
    // console.log(url)
//    p.toFile(`${join(__dirname, 'invoice.pdf')}`)

module.exports = {
  generatePDF,
  generatePDFWithData,
  generatePDFWithTemplate
}
