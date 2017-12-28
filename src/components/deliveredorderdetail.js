import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Select from 'react-select';
import { updateOrderStatus, updateOrderShippingId, getOrdersDetail } from '../actions/index';
import _ from 'lodash';
import Modal from 'react-modal';
import Loading from './loading';
import { getOrderStatusOptions, camelize, getCustomStyle, getDateOptions } from '../utils/index';
import FaArrowCircleODown from 'react-icons/lib/fa/arrow-circle-o-down';
import FaArrowCircleOUp from 'react-icons/lib/fa/arrow-circle-o-up';



class DeliveredOrderDetailItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: this.props.isOpened,
      isCustomerOpened: this.props.isCustomerOpened,
      isDeliveryOpened: this.props.isDeliveryOpened,
      isInvoiceOpened: this.props.isInvoiceOpened,
      isProductsOpened: this.props.isProductsOpened,
      order_state: this.props.item.order_state,
      order_state_id: this.props.item.order_state_id,
      shipping_number: this.props.item.shipping_number,
      itemIsLoading: false,
      modalIsOpen: false
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading && nextProps.isLoading.order_id == this.props.item.order_id) {
      document.getElementById('root').disabled = nextProps.isLoading.isLoading
    }

    if (nextProps.success && nextProps.success.order_id == this.props.item.order_id) {

      this.setState({ modalIsOpen: true })
    }

    if (nextProps.item.order_state_is) {
      this.setState({ order_state_id: nextProps.item.order_state_id, order_state: nextProps.item.order_state })

    }


    if (nextProps.item.shipping_number) {
      this.setState({ shipping_number: nextProps.item.shipping_number })

    }
  }


  onChangeStatus(val) {
    this.setState({
      order_state: val.label,
      order_state_id: val.value
    });
  }

  onChangeShippingId(e) {

    const options = getOrderStatusOptions()
    const status = options.filter(function (a) {
      return a.value === '4'
    })

    this.setState({
      shipping_number: e.target.value,
      order_state: status[0].label,
      order_state_id: status[0].value,
    });
  }

  updateOrderStatus() {

    this.props.updateOrderStatus({
      order_id: this.props.item.order_id,
      order_state: this.state.order_state,
      order_state_id: this.state.order_state_id,
      shipping_number: this.state.shipping_number

    });
  }

  updateOrderShippingId() {

    this.props.updateOrderShippingId({
      order_id: this.props.item.order_id,
      order_state: this.state.order_state,
      order_state_id: this.state.order_state_id,
      shipping_number: this.state.shipping_number
    });

    // this.props.updateOrderShippingId(this.state.shipping_id)
  }



  render() {
    const { isOpened, isCustomerOpened, isDeliveryOpened, isProductsOpened, isInvoiceOpened, order_state_id } = this.state
    let modalDiv = ''

    // if (this.state.itemIsLoading) {
    //   console.log('success')
    //   modalDiv = <div><Loading /></div>
    // }

    //   if (this.props.isLoading) {
    //   console.log("aaaa")
    //   return <Loading />
    // }

    // if (this.state.modalIsOpen) {
    //   console.log('success')
    //   modalDiv = <div><MessageModel /></div>
    // }
    // var date = this.props.item.date_added.split('GMT')[0].slice(0, -4);

        var dateDate = new Date(this.props.item.date_added);
    var date = dateDate.toLocaleTimeString("tr-TR", getDateOptions());


    var state = this.props.item.invoice_created == 1 ? true : false;
    const link = `/invoice/${this.props.item.id}`;
    const id = this.props.reactKey;
    const otherId = '#' + id;

    return (

      // <tbody  >
      <tr >
        
        <td  className='orderDetailGsm'>{this.props.item.order_code} <br /> ({this.props.item.order_id})</td>

        {/*<td className='orderDetailStatus'> <Select
          name='form-field-name'
          value={`${order_state_id}`}
          options={getOrderStatusOptions()}
          onChange={this.onChangeStatus.bind(this)}
        /></td>*/}

        <td> Name: {camelize(this.props.item.customer_name)} {camelize(this.props.item.customer_surname)} <br />
          Gsm: {this.props.item.customer_gsm}
        </td>
        <td>Date: {date} <br />
          Price: {this.props.item.total_price_with_tax}TL
        </td>
        <td><input className='orderDetailInput' type='text' value={this.state.shipping_number} onChange={this.onChangeShippingId.bind(this)} /> </td>
        <td className="noborder">

          {/*<button className='orderDetailButton' onClick={this.updateOrderStatus.bind(this)}>Update Status</button>*/}
          {/*<button className='orderDetailButton' onClick={this.updateOrderShippingId.bind(this)}>Update Shipping</button>*/}
          <button className='orderDetailButton'>
            <Link to={link} >Generate Invoice</Link>
          </button>
          <label>          <input
            type="checkbox"
            checked={state}
          >Invoice </input></label>

          <label>        <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={getCustomStyle()}
            contentLabel='eee22'
          >

            <button onClick={this.closeModal}>close</button>
            <div>Update is successful</div>
          </Modal></label>


        </td>

      </tr>

    )
  };

};



function mapStateToProps(state, ownProps) {
  // console.log(state.itemUpdateSuccess.id)

  return {
    success: state.order.itemUpdateSuccess,
    hasErrored: state.order.itemsHasErrored,
    isLoading: state.order.orderItemIsLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateOrderStatus: (values) => dispatch(updateOrderStatus(values)),
    updateOrderShippingId: (values) => dispatch(updateOrderShippingId(values)),
    getOrdersDetail: () => { dispatch(getOrdersDetail()) }


  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveredOrderDetailItem)


