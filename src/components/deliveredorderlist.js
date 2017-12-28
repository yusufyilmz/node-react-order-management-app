import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDeliveredOrdersDetail, searchOrders } from '../actions/index';
import DeliveredOrderDetailItem from './deliveredorderdetail';
import OrderDetailItem from './orderdetail';
import Search from './search';
import Modal from 'react-modal';
import Loading from './loading';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import {getCustomStyle } from '../utils/index';


class DeliveredOrderList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false,
      orders: [],
      checked: false,
      statusOrder: false,
      customerOrder: false,
      dateOrder: false,
    }

    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }


  afterOpenModal() {
    this.subtitle.style.color = '#f00'
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  componentDidMount() {
    this.props.getDeliveredOrdersDetail()
  }



  componentWillReceiveProps(nextProps) {
    if (nextProps.orderDetail) {
      var orders = _.filter(nextProps.orderDetail, (item) => {

        if (item != undefined) {
          return item;
        }
      });
      const sortedOrders = _.sortByOrder(orders, [item => Date.parse(item.date_added)], ['desc']);
      this.setState({ orders: sortedOrders })
    }
  }

  filterOrders() {
    var checked = this.state.checked;
    if (checked) {
      this.setState({ orders: this.props.orderDetail, checked: !checked });

    }
    else {

      var filteredArray = _.filter(this.props.orderDetail, (order) => { return order && order.invoice_created == 0 });
      this.setState({ orders: filteredArray, checked: !checked });

    }
  }


  renderOrdersDetails() {
    let index = 1544;
    return _.map(this.state.orders, (order) => {
      if (order) {
        index++
           return <OrderDetailItem key={index} item={order} reactKey={index}  />
//callBack={this.update.bind(this)}
         // return <DeliveredOrderDetailItem key={index} item={order} reactKey={index}  />
      }
    })
  }


  

  searchOrdersHere(values) {
    this.setState({ modalIsOpen: false })
    this.props.searchOrders(values)
  }


  orderProductStatus() {

    let orderType = '';
    if (this.state.statusOrder == true) {
      orderType = 'asc';
    }
    else {
      orderType = 'desc';
    }

    const sortedOrders = _.sortByOrder(this.state.orders, [item => item.order_state_id], [orderType]);
    this.setState({ orders: sortedOrders, statusOrder: !this.state.statusOrder });
  }

  orderProductOrderDate() {

    _.forEach(this.state.orders, item => {
      var a = Date.parse(item.date_added);
      console.log(a);
    })

    let orderType = '';
    if (this.state.dateOrder == true) {
      orderType = 'asc';
    }
    else {
      orderType = 'desc';
    }


    const sortedOrders = _.sortByOrder(this.state.orders, [item => Date.parse(item.date_added)], [orderType]);
    this.setState({ orders: sortedOrders, dateOrder: !this.state.dateOrder });


  }

  orderProductCustomer() {

    let orderType = '';
    if (this.state.customerOrder == true) {
      orderType = 'asc';
    }
    else {
      orderType = 'desc';
    }

    const sortedOrders = _.sortByOrder(this.state.orders, [item => item.customer_name], [orderType]);
    this.setState({ orders: sortedOrders, customerOrder: !this.state.customerOrder });

  }

  render() {
    if (this.props.isLoading) {
      return <Loading />
    }


    const customerArrow = this.state.customerOrder == true ? <FaArrowUp /> : <FaArrowDown />;
    const dateArrow = this.state.dateOrder == true ? <FaArrowDown /> : <FaArrowUp />;
    const statusArrow = this.state.statusOrder == true ? <FaArrowUp /> : <FaArrowDown />;

    return (

      <div className='ordersDetail'>


        <div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={getCustomStyle()}
            contentLabel='Example Modal2'
          >
            <Search searchOrders={this.searchOrdersHere.bind(this)} />
          </Modal>
        </div>

        <div className='addTradeWrapper'>

          <button
            onClick={() => {
              this.openModal()
            }}
            className='tradeBtn addItemBtn'>
            Search Orders
          </button>


          <label style={{ float: 'right' }}><input type="checkbox" name="checkbox" checked={this.state.checked} onChange={this.filterOrders.bind(this)} />Show orders without invoice</label>

        </div>

        <div >
          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th></th>
                
                <th>Reference</th>
                <th onClick={this.orderProductStatus.bind(this)} >Status {statusArrow}</th>
                <th onClick={this.orderProductCustomer.bind(this)} >Customer {customerArrow} </th>
                <th onClick={this.orderProductOrderDate.bind(this)}> Order {dateArrow}</th>
                <th>Shipping</th>
                <th>Archive</th>
                <th>Invoice</th>
                
              </tr>
            </thead>
            <tbody>
              {this.renderOrdersDetails()}
            </tbody>

          </table>

        </div>
      </div>

    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    isLoading: state.order.itemsIsLoading,
    orderDetail: state.order.orderDetail,
    hasErrored: state.order.itemsHasErrored
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchOrders: (values) => dispatch(searchOrders(values)),
    getDeliveredOrdersDetail: () => { dispatch(getDeliveredOrdersDetail()) },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveredOrderList)
