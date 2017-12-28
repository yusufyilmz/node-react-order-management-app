


import React, { Component } from 'react';
import { updateOrder } from '../actions/index';
import { connect } from 'react-redux'
import { camelize } from '../utils/index';
import Modal from 'react-modal';

class OrderCollapse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpened: this.props.isOpened,
            item: this.props.item
        }

        this.openModal = this.openModal.bind(this)
        this.afterOpenModal = this.afterOpenModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }


    openModal() {
        this.setState({ modalIsOpen: true })
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#f00'
    }

    closeModal() {
        // this.forceUpdate();
        this.setState({ modalIsOpen: false });
    }

    changeContent(e) {

        const name = e.target.name;

        let value = "";
        // if (name == "customer_name" || name == "customer_surname" ||
        //     name == "delivery_name" || name == "delivery_surname" || name == "delivery_address1" ||
        //     name == "delivery_address2" || name == "delivery_city" || name == "delivery_company" ||
        //     name == "invoice_name" || name == "invoice_surname" || name == "invoice_address1" ||
        //     name == "invoice_address2" || name == "invoice_city" || name == "invoice_company") {

        //  value = decamelize(e.target.value);

        // }
        // else {
        //  value = e.target.value;

        // }

        value = e.target.value;

        var item = this.state.item;
        console.log(name);
        console.log(value);
        console.log(item);
        item[name] = value;

        this.setState({ item: item });
    }

    // renderProducts() {
    //     return _.map(this.props.item.products, (product) => {
    //         return (
    //             <tr>
    //                 <td >Id :{product.product_id}  {product.product_code} <br /> {product.product_name} <br /> {product.product_quantity} adet {product.product_price_with_tax} TL</td>
    //             </tr >
    //         )
    //     })
    // }
    renderProducts() {
        return _.map(this.props.item.products, (product) => {
            return (
                <tr>
                    <td > {product.product_name} </td>
                    <td > {product.product_unit_price_with_tax} TL </td>
                    <td > {product.product_quantity}  adet </td>
                    <td >{product.product_price_with_tax} TL </td>
                </tr >
            )
        })
    }


    updateChanges() {
        console.log(this.state.item);
        this.props.updateOrder(this.state.item);

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.item) {
            this.setState({ item: nextProps.item });

        }
    }

    // componentWillReceiveProps(nextProps) {
    //     // if (nextProps.isLoading && nextProps.isLoading.order_id == this.props.item.order_id) {
    //     //     document.getElementById('root').disabled = nextProps.isLoading.isLoading
    //     // }

    //     if (nextProps.success && nextProps.success.order_id == this.props.item.order_id) {

    //         this.setState({ modalIsOpen: true })
    //     }
    // }


    // render() {

    //     return (
    //         // <tbody>
    //         //     <tr>
    //         //         <td>
    //         //             <button onClick={this.openModal.bind(this)}>close</button>
    //         <div>
    //             <button onClick={this.closeModal.bind(this)}>close</button>
    //             <div>Update is successful</div>
    //         </div>
    //         //         </td>
    //         //     </tr>
    //         // </tbody>
    //     )
    // }

    render() {

        return (

            <div>
      <div className="panel panel-default">
                                     <div className="panel-body table-responsive">    
                                                         <table className=" table table-bordered table-condensed f11">
                        <tbody>


                            {/*<td colspan="2" align="center" className="info"><b>Customer</b></td>*/}
                            <tr className=" table table-bordered table-condensed f11">
                                <td colspan="2" align="center" className="info"><b>Customer</b></td>
                            </tr>
                            <tr className=" table table-bordered table-condensed f11" id={this.props.reactKey}>
                                <td >Name: <br />
                                    <input name="customer_name" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.customer_name)} className="editableContent" type="text" ></input>
                                </td>
                                <td >Surname:<br />
                                    <input name="customer_surname" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.customer_surname)} className="editableContent" type="text"></input>
                                </td>
                                <td >Email:<br />
                                    <input name="customer_email" onChange={this.changeContent.bind(this)} value={this.state.item.customer_email} className="editableContent" type="text" ></input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
</div>
      <div className="panel panel-default">
                                     <div className="panel-body table-responsive">
                                                             <table className="table table-bordered table-condensed f11">
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="2" align="center" className="info"><b>Invoice</b></td>
                            </tr>
                            <tr>
                                <td >Name:<br />
                                    <input name="invoice_name" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_name)} className="editableContent" type="text" ></input>
                                </td>
                                <td >Surname:<br />
                                    <input name="invoice_surname" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_surname)} className="editableContent" type="text" ></input>
                                </td>
                                {/*<td >Email:<br />
                                    <input name="invoice_email" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_email} className="editableContent" type="text" ></input>
                                </td>*/}
                                <td >Gsm:<br />
                                    <input name="invoice_gsm" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_gsm} className="editableContent" type="text" ></input>
                                </td>
                                <td >Phone:<br />
                                    <input name="invoice_phone" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_phone} className="editableContent" type="text" ></input>
                                </td>

                                {/*<td >Note :<br />
                                    <input name="invoice_note" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_note} className="editableContent" type="text" ></input>

                                </td>*/}
                                <td >TCKN :<br />
                                    <input name="invoice_tckn" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_tckn} className="editableContent" type="text" ></input>
                                </td>
                                <td >Vat Number:<br />
                                    <input name="invoice_vat_number" onChange={this.changeContent.bind(this)} value={this.state.item.invoicevat_number} className="editableContent" type="text" ></input>
                                </td>

                            </tr>

                            <tr>
                                <td >Address1:<br />
                                    <input name="invoice_address1" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_address1)} className="editableContent" type="text" ></input>
                                </td>
                                <td >Address2:<br />
                                    <input name="invoice_address2" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_address2)} className="editableContent" type="text" ></input>
                                </td>
                                <td > PostCode:<br />
                                    <input name="invoice_postcode" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_postcode} className="editableContent" type="text" ></input>
                                </td>
                                <td >City:<br />
                                    <input name="invoice_city" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_city)} className="editableContent" type="text" ></input>
                                </td>
                                <td >State:<br />
                                    <input name="invoice_state" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_state)} className="editableContent" type="text" ></input>
                                </td>
                                <td >Company:<br />
                                    <input name="invoice_company" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_company)} className="editableContent" type="text" ></input>
                                </td>
                            </tr>
                            {/*<tr>
                                <td style={{ width: '200px' }}>
                                    <div className="panel panel-default">
                                        <div className="panel-body table-responsive">
                                            <button className='orderDetailButton' onClick={this.updateChanges.bind(this)}>Update Changes</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>*/}
                        </tbody>
                    </table>

</div>
</div>
      <div className="panel panel-default">
                                     <div className="panel-body table-responsive">
                                         <table className="table table-bordered table-condensed f11">
                    <tbody>
                           
                                             {/*<thead>
                                             </thead>
                                             <tbody>*/}
                                                 <tr>
                                                     <td colspan="2" align="center" className="info"><b>Delivery</b></td>
                                                 </tr>
                                                 <tr>
                                                     <td >Name:<br />
                                                         <input name="delivery_name" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_name)} className="editableContent" type="text" ></input>
                                                     </td>
                                                     <td >Surname:<br />
                                                         <input name="delivery_surname" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_surname)} className="editableContent" type="text" ></input>
                                                     </td>
                                                     {/*<td >Email:<br />
                                                         <input name="delivery_email" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_email} className="editableContent" type="text" ></input>
                                                     </td>*/}
                                                     <td >Gsm:<br />
                                                         <input name="delivery_gsm" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_gsm} className="editableContent" type="text" ></input>
                                                     </td>
                                                     <td >TCKN :<br />
                                                         <input name="delivery_tckn" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_tckn} className="editableContent" type="text" ></input>
                                                     </td>
                                                     <td >Vat Number:<br />
                                                         <input name="delivery_vat_number" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_vat_number} className="editableContent" type="text" ></input>
                                                     </td>
                                                 </tr>
                                                 <tr>
                                                     <td >Address1:<br />
                                                         <input name="delivery_address1" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_address1)} className="editableContent" type="text" ></input>
                                                     </td>
                                                     <td >Address2:<br />
                                                         <input name="delivery_address2" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_address2)} className="editableContent" type="text" ></input>
                                                     </td>
                                                     <td > PostCode:<br />
                                                         <input name="delivery_postcode" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_postcode} className="editableContent" type="text" ></input>
                                                     </td>
                                                     <td >State:<br />
                                                         <input name="delivery_state" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_state)} className="editableContent" type="text" ></input>

                                                     </td>
                                                     <td >City:<br />
                                                         <input name="delivery_city" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_city)} className="editableContent" type="text" ></input>
                                                     </td>
                                                     <td >Company:<br />
                                                         <input name="delivery_company" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_company)} className="editableContent" type="text" ></input>

                                                     </td>
                                                 </tr>
                                                 {/*<tr>
                                                     <td >Note :<br />
                                                         <input name="delivery_note" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_note} className="editableContent" type="text" ></input>

                                                     </td>
                                                 </tr>*/}
                                             
                                </tbody>
                            </table>
                        </div>
                      </div>

                                    <div style ={{width:'100%'}} className="panel panel-default">
                                            <button style ={{height:'50px'}} className='orderDetailButton' onClick={this.updateChanges.bind(this)}>Update Changes</button>
                                    </div>

      <div className="panel panel-default">

                         <div className="panel-body table-responsive">
                                         <table className="table table-bordered table-condensed f11">
                                            <b>Order Details</b>
                                            <table className="table table-bordered table-condensed f11">
                                                <thead>
                                                    <tr>
                                                    <td colspan="2" align="center" className="info">Product Name </td>
                                                    <td colspan="2" align="center" className="info"> Unit Price </td>
                                                    <td colspan="2" align="center" className="info"> Quantity</td>
                                                    <td colspan="2" align="center" className="info"> Total Amount </td>
                                                    </tr>
                                                    
                                                </thead>
                                                <tbody>

                                                 
                                                    {this.renderProducts()}
                                                </tbody>
                                            </table>
                    </table>
                </div>
                </div>



                {/*<table>
                    <tbody>
                        <tr>
                            <td style={{ width: '200px' }}>
                                <div className="panel panel-default">
                                    <div className="panel-body table-responsive">
                                        <table className="table table-bordered table-condensed f11">
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colspan="2" align="center" className="info"><b>Invoice</b></td>
                                                </tr>
                                                <tr>
                                                    <td >Name:<br />
                                                        <input name="invoice_name" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_name)} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >Surname:<br />
                                                        <input name="invoice_surname" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_surname)} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >Email:<br />
                                                        <input name="invoice_email" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_email} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >Gsm:<br />
                                                        <input name="invoice_gsm" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_gsm} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >Phone:<br />
                                                        <input name="invoice_phone" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_phone} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >Address1:<br />
                                                        <input name="invoice_address1" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_address1)} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >Address2:<br />
                                                        <input name="invoice_address2" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_address2)} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td > PostCode:<br />
                                                        <input name="invoice_postcode" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_postcode} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >City:<br />
                                                        <input name="invoice_city" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_city)} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >State:<br />
                                                        <input name="invoice_state" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_state)} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td >Company:<br />
                                                        <input name="invoice_company" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_company)} className="editableContent" type="text" ></input>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >Note :<br />
                                                        <input name="invoice_note" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_note} className="editableContent" type="text" ></input>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >TCKN :<br />
                                                        <input name="invoice_tckn" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_tckn} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >Vat Number:<br />
                                                        <input name="invoice_vat_number" onChange={this.changeContent.bind(this)} value={this.state.item.invoicevat_number} className="editableContent" type="text" ></input>
                                                    </td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>


                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: '200px' }}>
                                <div className="panel panel-default">
                                    <div className="panel-body table-responsive">
                                        <table className="table table-bordered table-condensed f11">
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colspan="2" align="center" className="info"><b>Product</b></td>
                                                </tr>
                                                {this.renderProducts()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </td>


                            <td style={{ width: '200px' }}>
                                <div className="panel panel-default">
                                    <div className="panel-body table-responsive">
                                        <button className='orderDetailButton' onClick={this.updateChanges.bind(this)}>Update Changes</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>*/}

            </div >

        )
    };

};




const mapDispatchToProps = (dispatch) => {
    return {
        updateOrder: (values) => dispatch(updateOrder(values)),
    }
}

export default connect(null, mapDispatchToProps)(OrderCollapse)








// import React, {Component} from 'react';
// import {updateOrder} from '../actions/index';
// import {connect} from 'react-redux'
// import {camelize} from '../utils/index';

// class OrderCollapse extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             isOpened: this.props.isOpened,
//             item: this.props.item
//         }
//     }

//     changeContent(e) {

//         const name = e.target.name;

//         let value = "";
//         // if (name == "customer_name" || name == "customer_surname" ||
//         //     name == "delivery_name" || name == "delivery_surname" || name == "delivery_address1" ||
//         //     name == "delivery_address2" || name == "delivery_city" || name == "delivery_company" ||
//         //     name == "invoice_name" || name == "invoice_surname" || name == "invoice_address1" ||
//         //     name == "invoice_address2" || name == "invoice_city" || name == "invoice_company") {

//         //  value = decamelize(e.target.value);

//         // }
//         // else {
//         //  value = e.target.value;

//         // }

//         value = e.target.value;

//         var item = this.state.item;
//         console.log(name);
//         console.log(value);
//         console.log(item);
//         item[name] = value;

//         this.setState({ item: item });
//     }

//     renderProducts() {
//         return _.map(this.props.item.products, (product) => {
//             return (
//                 <tr>
//                     <td >Id :{product.product_id}  {product.product_code} <br /> {product.product_name} <br /> {product.product_quantity} adet {product.product_price_with_tax} TL</td>
//                 </tr >
//             )
//         })
//     }

//     updateChanges() {
//         console.log(this.state.item);
//         this.props.updateOrder(this.state.item);

//     }

//     componentWillReceiveProps(nextProps) {

//         if (nextProps.item) {
//             this.setState({ item: nextProps.item });

//         }
//     }

//     // componentWillReceiveProps(nextProps) {
//     //     // if (nextProps.isLoading && nextProps.isLoading.order_id == this.props.item.order_id) {
//     //     //     document.getElementById('root').disabled = nextProps.isLoading.isLoading
//     //     // }

//     //     if (nextProps.success && nextProps.success.order_id == this.props.item.order_id) {

//     //         this.setState({ modalIsOpen: true })
//     //     }
//     // }


//     render() {

//         return (
//             <tr className="collapse table table-bordered table-condensed f11" id={this.props.reactKey}>
//                 <td ></td>
//                 <td style={{ width: '200px' }}>

//                     <div className="panel panel-default">
//                         <div className="panel-body table-responsive">
//                             <table className="table table-bordered table-condensed f11">
//                                 <thead>
//                                 </thead>
//                                 <tbody>
//                                     <tr>
//                                         <td colspan="2" align="center" className="info"><b>Customer</b></td>
//                                     </tr>
//                                     <tr>
//                                         <td >Name: <br />
//                                             <input name="customer_name" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.customer_name)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Surname:<br />
//                                             <input name="customer_surname" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.customer_surname)} className="editableContent" type="text"></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Email:<br />
//                                             <input name="customer_email" onChange={this.changeContent.bind(this)} value={this.state.item.customer_email} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Gsm:<br />
//                                             <input name="customer_gsm" onChange={this.changeContent.bind(this)} value={this.state.item.customer_gsm} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </td>


//                 <td style={{ width: '200px' }}>
//                     <div className="panel panel-default">
//                         <div className="panel-body table-responsive">
//                             <table className="table table-bordered table-condensed f11">
//                                 <thead>
//                                 </thead>
//                                 <tbody>
//                                     <tr>
//                                         <td colspan="2" align="center" className="info"><b>Delivery</b></td>
//                                     </tr>
//                                     <tr>
//                                         <td >Name:<br />
//                                             <input name="delivery_name" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_name)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Surname:<br />
//                                             <input name="delivery_surname" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_surname)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Email:<br />
//                                             <input name="delivery_email" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_email} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Gsm:<br />
//                                             <input name="delivery_gsm" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_gsm} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Address1:<br />
//                                             <input name="delivery_address1" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_address1)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Address2:<br />
//                                             <input name="delivery_address2" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_address2)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td > PostCode:<br />
//                                             <input name="delivery_postcode" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_postcode} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >State:<br />
//                                             <input name="delivery_state" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_state)} className="editableContent" type="text" ></input>

//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >City:<br />
//                                             <input name="delivery_city" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_city)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>


//                                     <tr>
//                                         <td >Company:<br />
//                                             <input name="delivery_company" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.delivery_company)} className="editableContent" type="text" ></input>

//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Note :<br />
//                                             <input name="delivery_note" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_note} className="editableContent" type="text" ></input>

//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >TCKN :<br />
//                                             <input name="delivery_tckn" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_tckn} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Vat Number:<br />
//                                             <input name="delivery_vat_number" onChange={this.changeContent.bind(this)} value={this.state.item.delivery_vat_number} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                 </tbody>
//                             </table>

//                         </div>
//                     </div>
//                 </td>


//                 <td style={{ width: '200px' }}>
//                     <div className="panel panel-default">
//                         <div className="panel-body table-responsive">
//                             <table className="table table-bordered table-condensed f11">
//                                 <thead>
//                                 </thead>
//                                 <tbody>
//                                     <tr>
//                                         <td colspan="2" align="center" className="info"><b>Invoice</b></td>
//                                     </tr>
//                                     <tr>
//                                         <td >Name:<br />
//                                             <input name="invoice_name" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_name)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Surname:<br />
//                                             <input name="invoice_surname" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_surname)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Email:<br />
//                                             <input name="invoice_email" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_email} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Gsm:<br />
//                                             <input name="invoice_gsm" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_gsm} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Phone:<br />
//                                             <input name="invoice_phone" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_phone} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Address1:<br />
//                                             <input name="invoice_address1" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_address1)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Address2:<br />
//                                             <input name="invoice_address2" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_address2)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td > PostCode:<br />
//                                             <input name="invoice_postcode" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_postcode} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >City:<br />
//                                             <input name="invoice_city" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_city)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >State:<br />
//                                             <input name="invoice_state" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_state)} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>

//                                     <tr>
//                                         <td >Company:<br />
//                                             <input name="invoice_company" onChange={this.changeContent.bind(this)} value={camelize(this.state.item.invoice_company)} className="editableContent" type="text" ></input>

//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Note :<br />
//                                             <input name="invoice_note" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_note} className="editableContent" type="text" ></input>

//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >TCKN :<br />
//                                             <input name="invoice_tckn" onChange={this.changeContent.bind(this)} value={this.state.item.invoice_tckn} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td >Vat Number:<br />
//                                             <input name="invoice_vat_number" onChange={this.changeContent.bind(this)} value={this.state.item.invoicevat_number} className="editableContent" type="text" ></input>
//                                         </td>
//                                     </tr>
//                                 </tbody>

//                             </table>
//                         </div>
//                     </div>
//                 </td>


//                 <td style={{ width: '200px' }}>
//                     <div className="panel panel-default">
//                         <div className="panel-body table-responsive">
//                             <table className="table table-bordered table-condensed f11">
//                                 <thead>
//                                 </thead>
//                                 <tbody>
//                                     <tr>
//                                         <td colspan="2" align="center" className="info"><b>Product</b></td>
//                                     </tr>
//                                     {this.renderProducts()}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </td>


//                 <td style={{ width: '200px' }}>
//                     <div className="panel panel-default">
//                         <div className="panel-body table-responsive">
//                             <button className='orderDetailButton' onClick={this.updateChanges.bind(this)}>Update Changes</button>
//                         </div>
//                     </div>
//                 </td>
//             </tr>

//         )
//     };

// };




// const mapDispatchToProps = (dispatch) => {
//     return {
//         updateOrder: (values) => dispatch(updateOrder(values)),
//     }
// }

// export default connect(null, mapDispatchToProps)(OrderCollapse)





