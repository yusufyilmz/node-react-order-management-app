import React, { Component } from 'react';
import { uploadShipping } from '../actions/index';
import { connect } from 'react-redux';
import _ from 'lodash';
import ShippingDetail from './shippingdetail';
import { updateOrderAllShippingIds } from '../actions/index';
import Loading from './loading';
import Modal from 'react-modal';
import { getCustomStyle } from '../utils/index';

class Shipping extends Component {

  constructor(props) {
    super(props);
    this.state = { shippingItems: [], modalIsOpen: false, shipping_file: null }

    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }



  onChangeShippingFile(event) {
    this.setState({
      shipping_file: event.target.files[0]
    })
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

  handleUploadFile = () => {
    console.log(this.state.shipping_file);
    if (this.state.shipping_file) {
      this.props.uploadShipping(this.state.shipping_file);
    }
  }

  handleUpdateShipping = () => {

    var filteredItems = _.filter(this.state.shippingItems, (item) => { return item.checked; });

    console.log(filteredItems);
    this.props.updateOrderAllShippingIds(filteredItems);
  }



  componentWillReceiveProps(nextProps) {


    if (nextProps.success) {
      this.setState({ modalIsOpen: true })
    }

    console.log(nextProps.shippings);
    var items = _.map(nextProps.shippings, (item) => {


      if (Number(item.difference) < 40) {
        item.checked = true;
      }
      else {
        item.checked = false;
      }

      return {
        difference: item.difference,
        order_customer: item.order_customer,
        order_id: item.order_id,
        shipping_customer: item.shipping_customer,
        shipping_number: item.shipping_number,
        checked: item.checked
      }
    })

    const sortedItems = _.sortByOrder(items, [item => item.difference], ['asc']);

    if (sortedItems && sortedItems.length > 0) {
      this.setState({ shippingItems: sortedItems });
    }
  }



  renderShippings() {
    console.log(this.state.shippingItems);
    return _.map(this.state.shippingItems, (item) => {

      return (
        <ShippingDetail key={item.shipping_number} item={item} handleClick={this.setElementChecked.bind(this)} />
      )
    })
  }

  setElementChecked(shippingId) {

    let shippingItems = _.map(this.state.shippingItems, (shipping) => {



      if (shipping.shipping_number == shippingId) {
        

        let object = {
          checked: !shipping.checked,
          difference: shipping.difference,
          order_customer: shipping.order_customer,
          order_id: shipping.order_id,
          shipping_number: shipping.shipping_number,
          shipping_customer: shipping.shipping_customer
        }
        console.log(object);
        return object;
      }
      else {
        return shipping;

      }
    });


    console.log("shippingItems");
    console.log(shippingItems);
    this.setState({ shippingItems: shippingItems })
  }



  render() {

    if (this.props.isLoading) {
      return <Loading />
    }

    return (
      <div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={getCustomStyle()}
          contentLabel='eee'
        >
          <button onClick={this.closeModal.bind(this)}>close</button>
          <div>Update is successful</div>
        </Modal>
        <div className="shippingExcelUpload">
          <input type='file' onChange={this.onChangeShippingFile.bind(this)} />
          <button onClick={this.handleUploadFile.bind(this)} >Upload Excel File</button>
        </div>
        <div>
          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th>Shipping Customer</th>
                <th>Shipping Id</th>
                <th>Order Customer</th>
                <th>Order Id</th>
                <th>Difference(%)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.renderShippings()}
            </tbody>
          </table>
        </div>

        <div>
          <button style={{ width: '100%' }} onClick={this.handleUpdateShipping.bind(this)} >Update</button>
        </div>


      </div>
    )
  }
}



function mapStateToProps(state) {

  return {
    shippings: state.shipping.items,
    hasErrored: state.shipping.hasErrored,
    isLoading: state.shipping.isLoading,
    success: state.shipping.success
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadShipping: (values) => dispatch(uploadShipping(values)),
    updateOrderAllShippingIds: (values) => dispatch(updateOrderAllShippingIds(values))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shipping)
