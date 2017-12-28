import React, { Component } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import {
    invoiceBoxStyle, invoiceCustomer, invoiceDate, invoicePrice, invoicePriceText, invoiceProduct, invoiceTax, tableGeneralPrice,
    table, tableInvoiceProduct, labelTax, tableProduct, invoiceCampaignCode, labelCampaignCode, labelGeneral, tableUnitPrice, invoicePriceTextLabel2, invoicePriceIn, tableName, tablePrice, label, labelDateDiv, labelDiv, labelFDateDiv, labelTimeDiv, customerLabel
} from './invoicestyle';
import { createInvoice, getInvoiceDetails, saveInvoiceStyle, getInvoiceStyle, updateOrderStatus, initInvoice, addInvoice, setInvoiceParameter, getInvoiceParameter, getN11InvoiceDetails } from '../actions/index';
import { convertNumber } from '../utils/index';
import Loading from './loading';
import { camelize, getInvoiceDateOptions, getOrderStatusOptions } from '../utils/index';
import Modal from 'react-modal';
import moment from 'moment';

class Invoice extends Component {
    constructor(props) {
        super(props)

        this.state = {
            finalized: false,
            orderId: '',
            customerLabel: "13px",
            invoicePriceTextlabel: "13px",
            invoicePriceTable: "13px",
            invoiceProductTable: "10px",
            invoice: null,
            dateTime: (new Date().toLocaleString("tr-TR")).split(' '),
            // dateTime: (new Date().toLocaleString().split(',')),

            activeDrags: 0,
            deltaPosition: {
                x: 0, y: 0
            },
            customerControlledPosition: {
                x: 0, y: 0
            },
            invoicePriceTextControlledPosition: {
                x: 0, y: 0
            },
            invoicePriceControlledPosition: {
                x: 0, y: 0
            },
            invoicePriceTableControlledPosition: {
                x: 0, y: 0
            },
            dateControlledPosition: {
                x: 0, y: 0
            },
            productTableControlledPosition: {
                x: 0, y: 0
            },

            taxLabelControlledPosition: {
                x: 0, y: 0
            },
            campaigncodeControlledPosition: {
                x: 17, y: 177
            },
            modalIsOpen: false,
            invoiceSeriNo: "A",
            invoiceSıraNo: 12
        }


        // this.openModal = this.openModal.bind(this);

        // this.afterOpenModal = this.afterOpenModal.bind(this);
        // this.closeModal = this.closeModal.bind(this);

    }

    // openModal() {
    //     this.setState({ modalIsOpen: true })
    // }

    // afterOpenModal() {
    //     // references are now sync'd and can be accessed.
    //     // this.subtitle.style.color = '#f00'
    // }

    // closeModal() {
    //     // this.forceUpdate();
    //     this.setState({ modalIsOpen: false });
    // }

    static contextTypes = {
        router: React.PropTypes.object
    }

    //   this.context.router.history.push('/');

    componentWillMount() {
        const { orderId } = this.props.match.params
        const { n11orderId } = this.props.match.params

        console.log(orderId + " " + n11orderId);

        if (orderId) {
            this.setState({ orderId })
            this.props.getInvoiceDetails(orderId)
        }
        else if (n11orderId) {
            this.setState({ orderId: n11orderId })
            this.props.getN11InvoiceDetails(n11orderId)
        }

        this.props.getInvoiceStyle();
        this.props.getInvoiceParameter();

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.parameters) {
            this.setState({
                invoiceSeriNo: nextProps.parameters.invoice_seri_no[0].parameter_value,
                invoiceSıraNo: nextProps.parameters.invoice_sira_no[0].parameter_value
            });
        }

        if (nextProps.setParameterResult) {
            this.setState({
                invoiceSeriNo: nextProps.setParameterResult.invoice_seri_no,
                invoiceSıraNo: nextProps.setParameterResult.invoice_sira_no
            });
        }





        if (nextProps.invoice) {
            this.setState({ invoice: nextProps.invoice });
        }


        if (nextProps.invoiceStyle) {
            console.log("componentWillReceiveProps")

            console.log(nextProps.invoiceStyle)


            var jsonData = JSON.parse(nextProps.invoiceStyle)[0];
            console.log(jsonData)

            this.setState({
                invoicePriceTable: jsonData.invoicepricetable,
                invoicePriceTextlabel: jsonData.invoicepricetextlabel,
                invoiceProductTable: jsonData.invoiceproducttable,
                customerLabel: jsonData.customerlabel,
                customerControlledPosition: {
                    x: jsonData.customercontrolledpositionx,
                    y: jsonData.customercontrolledpositiony
                },
                invoicePriceControlledPosition: {
                    x: jsonData.invoicepricecontrolledpositionx,
                    y: jsonData.invoicepricecontrolledpositiony
                },
                invoicePriceTextControlledPosition: {
                    x: jsonData.invoicepricetextcontrolledpositionx,
                    y: jsonData.invoicepricetextcontrolledpositiony
                },
                invoicePriceTableControlledPosition: {
                    x: jsonData.invoicepricetablecontrolledpositionx,
                    y: jsonData.invoicepricetablecontrolledpositiony
                },
                dateControlledPosition: {
                    x: jsonData.datecontrolledpositionx,
                    y: jsonData.datecontrolledpositiony
                },
                productTableControlledPosition: {
                    x: jsonData.producttablecontrolledpositionx,
                    y: jsonData.producttablecontrolledpositiony
                },
                taxLabelControlledPosition: {
                    x: jsonData.taxlabelcontrolledpositionx,
                    y: jsonData.taxlabelcontrolledpositiony
                },
            })
            // alert(nextProps.invoiceStyle);
        }


        if (nextProps.orderSuccess) {
            if (!_.isEmpty(this.state.invoice)) {
                if (nextProps.orderSuccess.order_id == this.state.invoice.order_id) {
                    console.log("aslkdajsmkflasmsakdlsdakskdsmd");
                    // this.setState({modalIsOpen: true});
                    // console.log(nextProps);
                    this.context.router.history.push('/orders');
                    return;
                }
            }
        }

        if (nextProps.invoicePdf != null) {
            console.log('sdsds')
            var url = window.URL.createObjectURL(nextProps.invoicePdf)
            var a = document.createElement('a')
            a.href = url
            a.download = 'fatura.pdf'
            a.click()

            this.props.initInvoice();
        }

    }

    updateOrderStatus() {

        const options = getOrderStatusOptions()
        const status = options.filter(function (a) {
            return a.value === '3'
        })

        this.props.updateOrderStatus({
            order_id: this.state.invoice.order_id,
            order_state: status[0].label,
            order_state_id: status[0].value,
        });

    }


    removeElementsByClass(clasname) {
        var paras = document.getElementsByClassName(clasname);

        while (paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }

    }


    finalizeInvoiceFromTemplate() {

        this.removeElementsByClass('cln');

        let divs = Array.prototype.slice.call(document.getElementsByTagName('div'))

        divs.forEach((div) => {


            if (div.classList.contains('react-draggable')) {
                var newstyle = window.getComputedStyle(div)
                var tr = newstyle.getPropertyValue('-webkit-transform') ||
                    newstyle.getPropertyValue('-moz-transform') ||
                    newstyle.getPropertyValue('-ms-transform') ||
                    newstyle.getPropertyValue('-o-transform') ||
                    newstyle.getPropertyValue('transform')

                var partsOfStr = tr.replace('(', '').replace(')', '').split(',')
                div.style.position = 'absolute'

                div.style.marginLeft = div.style.marginLeft + partsOfStr[4] + 'px'
                div.style.marginTop = div.style.marginTop + partsOfStr[5] + 'px'
                div.style.transform = ''
                div.style.whiteSpace = 'nowrap'
            }
        })

        var itm = document.getElementById('invoiceElement')
        var cln = itm.cloneNode(true)
        cln.style.marginLeft = '70mm';
        cln.className = "cln";
        cln.id = "cln1";

        document.getElementById('page').appendChild(cln)
        var otherCln = cln.cloneNode(true)
        otherCln.style.marginLeft = '140mm'
        otherCln.className = "cln";
        otherCln.id = "cln2";

        document.getElementById('page').appendChild(otherCln)

        this.setState({ finalized: true })
    }

    createInvoiceFromTemplate(e) {

        this.removeElementsByClass('styleadder');
        this.removeElementsByClass('ombuttonicon');
        this.removeElementsByClass('addItemBtn');
        this.removeElementsByClass('invoiceparameter');
        this.removeElementsByClass('dangerPrice');


        if (!this.state.finalized) {
            this.finalizeInvoiceFromTemplate();
        }


        var object = document.getElementById('header')
        object.remove();
        // var generateObject = document.getElementById('pdfGenerate')
        // generateObject.remove();
        // document.getElementById('pdfFinalize').remove();


        var cln1 = document.getElementById('cln1');
        cln1.style.paddingLeft = "0.5cm";
        var cln2 = document.getElementById('cln2');
        cln2.style.paddingLeft = "1cm";


        // document.body.style.marginLeft = '0px'
        // document.body.style.marginTop = '2px'
        var template = document.documentElement.outerHTML

        document.body.insertBefore(object, document.body.firstChild)




        const values = {
            template: template,
            orderId: this.state.orderId,
            platformId: this.state.invoice.platform_id,
            invoice: {

                order_invoice_id: this.state.orderId,
                order_id: this.state.invoice.order_id,
                invoice_seri_no: this.state.invoiceSeriNo,
                invoice_sira_no: this.state.invoiceSıraNo,
                invoice_total_price: this.state.invoice.total_price_with_tax,
                invoice_tax_price: this.state.invoice.tax,
                invoice_prepare_date: moment().format(),
                // invoice_prepare_time: this.state.dateTime[1].toString().substring(0, this.state.dateTime[1].lastIndexOf(':')),
            }
        }


        console.log(template);
        this.props.createInvoice(values)


        // document.documentElement.insertBefore(generateObject)

        // this.props.history.push('/orderlist')
    }

    generateDummyInvoice() {

        let { invoice } = this.state;
        invoice.total_discount = "0";
        invoice.total_shipping = "0";
        invoice.tax = "0.76";
        invoice.total_price_with_tax = "5";
        invoice.products = [{
            product_name: "Karışık Aroma Paketi",
            product_quantity: 1,
            product_unit_price: "4.24",
            product_price: "4.24"
        }];

        console.log("generateDummyInvoice");
        console.log(invoice);

        this.setState({ invoice: invoice })

    }


    changeFontSize(increase, type) {

        var thisLabel = this.state.customerLabel;

        if (type == 'customer') {
            thisLabel = this.state.customerLabel;
        }
        if (type == 'invoicepricetext') {
            thisLabel = this.state.invoicePriceTextlabel;
        }
        if (type == 'invoiceprice') {
            thisLabel = this.state.invoicePriceTable;
        }
        if (type == 'invoiceproduct') {
            thisLabel = this.state.invoiceProductTable;
        }


        thisLabel = thisLabel.substring(0, thisLabel.indexOf("px"));

        if (increase) {
            var size = parseInt(thisLabel) + 1;
        }
        else {
            var size = parseInt(thisLabel) - 1;
        }

        thisLabel = size + "px";


        if (type == 'customer') {
            this.setState({ customerLabel: thisLabel });
        }
        if (type == 'invoicepricetext') {
            this.setState({ invoicePriceTextlabel: thisLabel });
        }
        if (type == 'invoiceprice') {
            this.setState({ invoicePriceTable: thisLabel });
        }
        if (type == 'invoiceproduct') {
            this.setState({ invoiceProductTable: thisLabel });
        }

    }

    saveInvoiceStyle() {


        var invoiceStyle = {
            customerLabel: this.state.customerLabel,
            invoicePriceTextlabel: this.state.invoicePriceTextlabel,
            invoicePriceTable: this.state.invoicePriceTable,
            invoiceProductTable: this.state.invoiceProductTable,
            customerControlledPositionX: this.state.customerControlledPosition.x,
            customerControlledPositionY: this.state.customerControlledPosition.y,
            invoicePriceTextControlledPositionX: this.state.invoicePriceTextControlledPosition.x,
            invoicePriceTextControlledPositionY: this.state.invoicePriceTextControlledPosition.y,
            invoicePriceControlledPositionX: this.state.invoicePriceControlledPosition.x,
            invoicePriceControlledPositionY: this.state.invoicePriceControlledPosition.y,
            invoicePriceTableControlledPositionX: this.state.invoicePriceTableControlledPosition.x,
            invoicePriceTableControlledPositionY: this.state.invoicePriceTableControlledPosition.y,
            dateControlledPositionX: this.state.dateControlledPosition.x,
            dateControlledPositionY: this.state.dateControlledPosition.y,
            productTableControlledPositionX: this.state.productTableControlledPosition.x,
            productTableControlledPositionY: this.state.productTableControlledPosition.y,
            taxLabelControlledPositionX: this.state.taxLabelControlledPosition.x,
            taxLabelControlledPositionY: this.state.taxLabelControlledPosition.y,

        }
        console.log("saveInvoiceStyle");

        console.log(invoiceStyle);
        this.props.saveInvoiceStyle(invoiceStyle)

        //           customerLabel: customerLabel,
        //       invoicePriceTextlabel: label,
        //       invoicePriceTable: tableGeneralPrice,
        //       invoiceProductTable: tableInvoiceProduct,
        // JSON.stringify(session)
    }


    removeProduct(id) {

        var invoice = this.state.invoice;
        _.remove(invoice.products, (n) => {
            return n.product_id == id;
        });
        this.setState({ invoice: invoice });
    }

    calculatePrice(number, decimalCount) {

        number = parseFloat(Math.round(number * 100) / 100).toFixed(3).toString();

        if (number.match(/\./)) {
            number = number.replace(/\.?0+$/, '');
        }

        if (number.indexOf(".") != -1) {
            if (number.substring(number.indexOf(".") + 1).length == 1) {
                number += "0";
            }
        }

        return number;
    }



    renderInvoiceProducts() {


        console.log(this.state.invoice.products);
        return _.map(this.state.invoice.products, (product) => {

            var productName = product.product_name.replace('AROMANIA', 'AR');

            return (<tr style={tableInvoiceProduct}>

                <td style={tableInvoiceProduct}>{product.product_quantity} Adet</td>
                <td style={{ ...tableInvoiceProduct, ...tableName }}>{productName}</td>
                <td style={{ ...tableInvoiceProduct, ...tableUnitPrice }}>{this.calculatePrice(product.product_unit_price, 2)}TL</td>
                <td style={{ ...tableInvoiceProduct, ...tablePrice }}> {this.calculatePrice(product.product_price, 2)}TL </td>


                {/*<td style={tableQuantity}>{product.product_quantity} Adet</td>
        <td style={tableName}>{product.product_name}</td>
        <td style={tableUnitPrice}>{product.product_unit_price} TL</td>
        <td style={tablePrice}> {product.product_price} TL </td>*/}
                <td style={tableInvoiceProduct}>
                    <button className='ombuttonicon removeicon glyphicon-remove' onClick={() => this.removeProduct(product.product_id)}></button>
                    <button className='ombuttonicon plusbutton plusbuttonIcon glyphicon-plus' onClick={() => this.changeFontSize(true, 'invoiceproduct')}></button>
                    <button className='ombuttonicon minusbutton minusbuttonIcon glyphicon-minus' onClick={() => this.changeFontSize(false, 'invoiceproduct')}></button>
                </td>
            </tr>
            )
        });

    }


    calculateTotalPrice() {
        var sum = _.reduce(this.state.invoice.products, (sum, product) => {
            return sum + parseFloat(product.product_price);
        }, 0);

        return this.calculatePrice(sum, 2);
    }


    handleDrag(e, ui) {
        const { x, y } = this.state.deltaPosition;
        this.setState({
            deltaPosition: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }


    onCustomerControlledDrag(e, position) {
        const { x, y } = position;
        this.setState({ customerControlledPosition: { x, y } });
    }

    onPriceTextControlledDrag(e, position) {
        const { x, y } = position;
        this.setState({ invoicePriceTextControlledPosition: { x, y } });
    }

    onPriceTableControlledDrag(e, position) {
        const { x, y } = position;
        this.setState({ invoicePriceTableControlledPosition: { x, y } });
    }


    onDateControlledDrag(e, position) {
        const { x, y } = position;
        this.setState({ dateControlledPosition: { x, y } });
    }

    onProductTableControlledDrag(e, position) {
        const { x, y } = position;
        this.setState({ productTableControlledPosition: { x, y } });
    }

    onTaxLabelControlledDrag(e, position) {
        const { x, y } = position;
        this.setState({ taxLabelControlledPosition: { x, y } });
    }


    onCampaignCodeLabelControlledDrag(e, position) {
        const { x, y } = position;
        this.setState({ campaigncodeControlledPosition: { x, y } });
    }


    renderInvoicePhone(gsm) {
        if (gsm && gsm != '') {
            return (<label style={customerLabel} >Telefon: {gsm}</label>);
        }
        else
            return '';

    }

    renderInvoiceAddress(address) {

        if (address == '') return;
        var number = Number(customerLabel.fontSize.substring(0, customerLabel.fontSize.indexOf('px')))
        console.log("renderInvoiceAddress");
        console.log(number);
        console.log(address.length);
        console.log(number * address.length);

        if (number * address.length > 225) {
            var a = Math.round(225 / number);
            var n = address.substring(0, a).lastIndexOf(' ');
            var address1 = address.substring(0, n);
            var address2 = address.substring(n + 1, address.length);

            if (number * address2.length > 225) {
                n = address2.substring(0, a).lastIndexOf(' ');
                var address3 = address2.substring(0, n);
                var address4 = address2.substring(n + 1, address2.length);

                return (
                    <p style={customerLabel}  >
                        {camelize(address1)} <br />
                        {camelize(address3)} <br />
                        {camelize(address4)}
                    </p>
                );
            }
            else {

                return (<p style={customerLabel}  >{camelize(address1)} <br />
                    {camelize(address2)} </p>
                );
            }
        }
        else {
            return (<p style={customerLabel}  >{camelize(address)} </p>);

        }

    }

    changeInvoiceOrderNo() {

        let value = {
            invoice_sira_no: this.state.invoiceSıraNo,
            invoice_seri_no: this.state.invoiceSeriNo,
        }
        this.props.setInvoiceParameter(value);

    }

    updateSeriNo(e) {
        this.setState({ invoiceSeriNo: e.target.value });
    }

    updateSiraNo(e) {
        this.setState({ invoiceSıraNo: e.target.value });
    }

    renderInvoiceSiraSeri() {

        if (this.state.invoice.invoice_created == 0) {
            return (
                <div style={{ width: '210mm', marginBottom: '10px' }} className="row invoiceparameter">
                    <div className="col-sm-4"> <label> Seri No </label> <input style={{ width: '70%' }} className="" type="text" value={this.state.invoiceSeriNo} onChange={this.updateSeriNo.bind(this)} /></div>
                    <div className="col-sm-4"> <label> Sira No </label> <input style={{ width: '70%' }} className="" type="text" value={this.state.invoiceSıraNo} onChange={this.updateSiraNo.bind(this)} /></div>
                    <div className="col-sm-4"><button style={{ width: '100%', marginTop: '7px', maxHeight: '28px' }} className="btn btn-default styleadder tradeBtn addItemBtn" type="button" onClick={this.changeInvoiceOrderNo.bind(this)} >Update Parameters</button></div>
                </div>
            )
        }


    }
    render() {
        console.log(this.state);
        const { invoicePdf, isLoading, orderIsLoading } = this.props
        const { invoice } = this.state

        console.log(invoice);
        console.log(this.props);

        if (_.isEmpty(invoice) || isLoading || orderIsLoading.isLoading) {
            return <Loading />
        }

        console.log("this.props.parameterIsLoading");
        console.log(this.props.parameterIsLoading);
        if (this.props.parameterIsLoading) {
            return <Loading />
        }

        const { deltaPosition, customerControlledPosition } = this.state;
        customerLabel.fontSize = this.state.customerLabel;
        tableGeneralPrice.fontSize = this.state.invoicePriceTable;
        invoicePriceTextLabel2.fontSize = this.state.invoicePriceTextlabel;
        tableInvoiceProduct.fontSize = this.state.invoiceProductTable;

        let customerName = "";
        let customerTcknVatNo = "";

        if (invoice.invoice_vat_number) {
            customerName = camelize(invoice.invoice_company);
            customerTcknVatNo = invoice.invoice_vat_number;
        }
        else {
            customerName = camelize(invoice.invoice_name) + (invoice.invoice_surname == "" ? "" : (" " + camelize(invoice.invoice_surname)))
            customerTcknVatNo = invoice.invoice_tckn;
        }

        if (invoice.invoice_vat_daire) {
            customerTcknVatNo = invoice.invoice_vat_daire + " " + customerTcknVatNo;
        }

        let price = ""

        if (invoice.total_price_with_tax) {
            price = invoice.total_price_with_tax;


        }
        else {
            price = Number(invoice.total_price);

        }

        var totalPrice = this.calculateTotalPrice();
        var discountPrice = this.calculatePrice(invoice.total_discount, 2);
        var shippingPrice = this.calculatePrice(invoice.total_shipping, 2);
        var taxPrice = this.calculatePrice(invoice.tax, 2);
        var generalPrice = this.calculatePrice(price, 2);

        let priceError = false;
        let difference = Number(generalPrice) - ( Number(totalPrice) + Number(discountPrice) + Number(shippingPrice) + Number(taxPrice) );
        if (difference > 1) priceError = true;
        return (
            <div>
                {
                    priceError && <div  className="dangerPrice alert alert-danger">
                        <strong>Error!</strong> There is an error price and product price.
                    </div>
                }
                <div style={{ width: '210mm', marginBottom: '10px' }} className="btn-group">

                    <button style={{ width: '42mm' }} id='pdfGenerate' className='btn btn-default tradeBtn addItemBtn' onClick={this.createInvoiceFromTemplate.bind(this)} > Generate</button>
                    <button style={{ width: '42mm' }} id='pdfFinalize' className='btn btn-default tradeBtn addItemBtn' onClick={this.finalizeInvoiceFromTemplate.bind(this)} > Finalize </button>
                    <button style={{ width: '42mm' }} id='pdfFinalize' className='btn btn-default tradeBtn addItemBtn' onClick={this.generateDummyInvoice.bind(this)} > Create Dummy</button>
                    <button style={{ width: '42mm' }} className='btn btn-default styleadder tradeBtn addItemBtn' onClick={this.saveInvoiceStyle.bind(this)}>Save Style</button>
                    <button style={{ width: '42mm' }} className='btn btn-default styleadder tradeBtn addItemBtn' onClick={this.updateOrderStatus.bind(this)}>Prepare Package</button>
                </div>
                {this.renderInvoiceSiraSeri()}

                <div id='page' style={invoiceBoxStyle} >
                    <div id='invoiceElement'>
                        <div style={invoiceCustomer} >
                            <button className='ombuttonicon plusbutton glyphicon glyphicon-plus' onClick={() => this.changeFontSize(true, 'customer')}></button>
                            <button className='ombuttonicon minusbutton glyphicon glyphicon-minus' onClick={() => this.changeFontSize(false, 'customer')}></button>

                            <Draggable
                                handle='.handle'
                                position={customerControlledPosition}
                                onDrag={this.onCustomerControlledDrag.bind(this)} grid={[3, 3]}>
                                <div style={{ maxWidth: '120px' }} className='handle '>
                                    {/*<label style={customerLabel}  >{camelize(invoice.invoice_name)} {camelize(invoice.invoice_surname)} </label><br />*/}
                                    <label style={customerLabel} >{customerName} </label><br />
                                    {this.renderInvoiceAddress(invoice.invoice_address1 + " " + invoice.invoice_address2 + " " + invoice.invoice_city + " " + invoice.invoice_state)} <br />
                                    {this.renderInvoicePhone(invoice.invoice_gsm)} <br />
                                </div>
                            </Draggable>

                        </div>

                        <div style={invoiceTax}>
                            <Draggable
                                handle='.handle'
                                position={this.state.taxLabelControlledPosition}
                                onDrag={this.onTaxLabelControlledDrag.bind(this)} grid={[1, 1]}>

                                <div className='handle'>
                                    {/*<label style={labelTax} >{invoice.invoice_tax && invoice.invoice_tax != undefined && invoice.invoice_tax != "" ? invoice.invoice_tax : invoice.invoice_tckn}</label>*/}
                                    <label style={labelTax} >{customerTcknVatNo}</label>
                                </div>
                            </Draggable>
                        </div>

                        <div style={{ ...labelGeneral, ...invoiceDate }} >

                            <Draggable
                                handle='.handle'
                                position={this.state.dateControlledPosition}
                                onDrag={this.onDateControlledDrag.bind(this)} grid={[1, 1]}>

                                <div className='handle'>
                                    <label style={labelTimeDiv} >{this.state.dateTime[1].toString().substring(0, this.state.dateTime[1].lastIndexOf(':'))}</label><br />
                                    <label style={labelDateDiv} >{this.state.dateTime[0]}</label><br />
                                    <label style={labelFDateDiv} >{this.state.dateTime[0]}</label><br />
                                </div>
                            </Draggable>
                        </div>
                        {
                            invoice.campaign_code &&
                            <div style={invoiceCampaignCode}>
                                <Draggable
                                    handle='.handle'
                                    position={this.state.campaigncodeControlledPosition}
                                    onDrag={this.onCampaignCodeLabelControlledDrag.bind(this)} grid={[1, 1]}>

                                    <div className='handle'>
                                        {/*<label style={labelTax} >{invoice.invoice_tax && invoice.invoice_tax != undefined && invoice.invoice_tax != "" ? invoice.invoice_tax : invoice.invoice_tckn}</label>*/}
                                        <label style={labelCampaignCode} >N11 kampanya kodu: {invoice.campaign_code}</label>
                                    </div>
                                </Draggable>
                            </div>
                        }


                        <div  >
                            <Draggable
                                handle='.handle'
                                position={this.state.productTableControlledPosition}
                                onDrag={this.onProductTableControlledDrag.bind(this)} grid={[3, 3]}>
                                <div style={{ position: 'absolute' }} className="handle"  >

                                    <table cellSpacing='10' style={tableInvoiceProduct}>
                                        <tbody style={tableInvoiceProduct}>
                                            {this.renderInvoiceProducts()}
                                        </tbody>
                                    </table>
                                </div>
                            </Draggable>
                        </div>
                        <div style={invoicePrice} >

                            <button style={{ marginTop: '450px', marginLeft: '160px' }} className='ombuttonicon plusbutton glyphicon glyphicon-plus' onClick={() => this.changeFontSize(true, 'invoiceprice')}></button>
                            <button style={{ marginTop: '450px', marginLeft: '170px' }} className='ombuttonicon minusbutton glyphicon glyphicon-minus' onClick={() => this.changeFontSize(false, 'invoiceprice')}></button>


                            <Draggable
                                handle='.handle'
                                position={this.state.invoicePriceTableControlledPosition}
                                onDrag={this.onPriceTableControlledDrag.bind(this)} grid={[3, 3]}>

                                <div style={invoicePriceIn} className='handle'>
                                    <table style={tableGeneralPrice} >
                                        <tbody style={tableGeneralPrice}>
                                            <tr style={tableGeneralPrice}>
                                                <td style={tableGeneralPrice}> Toplam:</td>
                                                <td style={tableGeneralPrice}> {totalPrice} TL</td>
                                            </tr>
                                            <tr style={tableGeneralPrice}>
                                                <td style={tableGeneralPrice}> Toplam indirim:</td>
                                                <td style={tableGeneralPrice}> {discountPrice} TL</td>
                                            </tr>
                                            <tr style={tableGeneralPrice}>
                                                <td> Kargo Hizmet Bedeli:</td>
                                                <td> {shippingPrice} TL</td>
                                            </tr>
                                            <tr style={tableGeneralPrice}>
                                                <td> KDV(%18):</td>
                                                <td> {taxPrice} TL</td>
                                            </tr>
                                            <tr style={tableGeneralPrice}>
                                                <td> Genel Toplam:</td>
                                                <td> {generalPrice} TL</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </Draggable>

                        </div>
                        <div style={invoicePriceText} >

                            <button style={{ marginTop: '450px', marginLeft: '0px' }} className='ombuttonicon plusbutton glyphicon glyphicon-plus' onClick={() => this.changeFontSize(true, 'invoicepricetext')}></button>
                            <button style={{ marginTop: '450px', marginLeft: '10px' }} className='ombuttonicon minusbutton glyphicon glyphicon-minus' onClick={() => this.changeFontSize(false, 'invoicepricetext')}></button>

                            <Draggable
                                handle='.handle'
                                position={this.state.invoicePriceTextControlledPosition}
                                onDrag={this.onPriceTextControlledDrag.bind(this)} grid={[3, 3]}>
                                <div className='handle'>
                                    <label style={invoicePriceTextLabel2}>Yalnız:</label> <br />
                                    <label style={invoicePriceTextLabel2} >{convertNumber(this.calculatePrice(price, 2))}</label>
                                </div>
                            </Draggable>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
}

function mapStateToProps(state) {
    var invoicePdf = null;
    console.log(state);
    if (state.order.itemUpdateSuccess && state.order.itemUpdateSuccess.order_id) {
        invoicePdf = null
    }
    else {
        invoicePdf = state.invoice.pdf;
    }

    return {
        invoicePdf: invoicePdf,
        invoice: state.invoice.details,
        hasErrored: state.invoice.invoiceHasErrored,
        isLoading: state.invoice.invoiceIsLoading,
        invoiceStyle: state.invoice.invoiceStyle,
        orderSuccess: state.order.itemUpdateSuccess,
        orderHasErrored: state.order.itemsHasErrored,
        orderIsLoading: state.order.orderItemIsLoading,
        parameters: (state.parameter.parameters),
        error: (state.parameter.error),
        setParameterResult: (state.parameter.setParameterResult),
        parameterIsLoading: state.parameter.parameterIsLoading,
    }
}

const mapDispatchToProps = (dispatch) => {


    return {
        createInvoice: (values) => dispatch(createInvoice(values)),
        getInvoiceDetails: (id) => dispatch(getInvoiceDetails(id)),
        getN11InvoiceDetails: (id) => dispatch(getN11InvoiceDetails(id)),


        saveInvoiceStyle: (invoice) => dispatch(saveInvoiceStyle(invoice)),
        getInvoiceStyle: () => dispatch(getInvoiceStyle()),
        updateOrderStatus: (values) => dispatch(updateOrderStatus(values)),
        setInvoiceParameter: (values) => dispatch(setInvoiceParameter(values)),
        addInvoice: (values) => dispatch(addInvoice(values)),
        initInvoice: () => dispatch(initInvoice()),
        getInvoiceParameter: () => dispatch(getInvoiceParameter()),
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Invoice))
