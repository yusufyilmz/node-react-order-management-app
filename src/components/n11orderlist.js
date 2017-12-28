import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getN11OrdersDetail, getAllN11OrdersDetail } from '../actions/index';
import { getCustomStyle, getOrderStatusOptions } from '../utils/index';
import OrderDetailItem from './orderdetail';
import Search from './search';
import Loading from './loading';
import OrderCollapse from './ordercollapse';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import N11OrderDetailItem from './n11orderdetail';



class N11OrderList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // modalIsOpen: false,
      orders: [],
      // unfilteredOrders: [],
      // checked: false,
      statusOrder: false,
      customerOrder: false,
      dateOrder: false,
      // order_state: '',
      // order_state_id: 0,
      // value: 'select',
      // options: options,
    }

    // this.openModal = this.openModal.bind(this)
    // this.afterOpenModal = this.afterOpenModal.bind(this)
    // this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    this.props.getAllN11OrdersDetail()

  }

  componentWillReceiveProps(nextProps) {

    console.log("componentWillReceiveProps")
    console.log(nextProps.orderDetail)

    // this.setState({ orders: nextProps.orderDetail })

    // if (nextProps.orderDetail.length > 0) {
    this.setState({ orders: nextProps.orderDetail })

    // }

    // console.log(this.state.orders);

    // if (nextProps.orderDetail) {
    //   this.setState({ orders: nextProps.orderDetail })
    // }

  }
  renderOrdersDetails() {
    console.log("renderOrdersDetails")

    // if (this.state.orders.length > 0) {

    console.log(this.state.orders);
    let index = -1
    return _.map(this.state.orders, (order) => {
      if (order) {
        index++

        return (
          <N11OrderDetailItem key={index} item={order} reactKey={index} />
        )
      }

    })
    // }
    // else {
    //   return <div>No order</div>
    // }
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

  checkOrders() {
    this.props.getN11OrdersDetail();
  }


  render() {
    if (this.props.isLoading) {
      console.log("aaaa")
      return <Loading />
    }

    const customerArrow = this.state.customerOrder == true ? <FaArrowUp /> : <FaArrowDown />;
    const dateArrow = this.state.dateOrder == true ? <FaArrowDown /> : <FaArrowUp />;
    const statusArrow = this.state.statusOrder == true ? <FaArrowUp /> : <FaArrowDown />;

    // const orderstatus = getOrderStatusOptions();
    return (

      <div className='ordersDetail'>

        {
          this.props.hasErrored !== null && <div className="dangerPrice alert alert-danger">
            <strong>Warning!</strong>  {this.props.hasErrored}
          </div>
        }


        <div className='addTradeWrapper'>

          <button
            onClick={() => {
              this.checkOrders()
            }}
            className='tradeBtn addItemBtn'>
            Check New Orders
          </button>


        </div>
        <div>

          {/*<label><input type="checkbox" name="checkbox" checked={this.state.checked} onChange={this.filterOrders.bind(this)} />Show orders without invoice</label>*/}
          {/*<label>Order count: {this.state.orders.length}</label>*/}

        </div>


        <div >
          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th></th>
                <th>Reference</th>
                {/*<th onClick={this.orderProductStatus.bind(this)} >Status {statusArrow}</th>*/}
                <th onClick={this.orderProductCustomer.bind(this)} >Customer {customerArrow} </th>
                <th>Gsm</th>
                <th onClick={this.orderProductOrderDate.bind(this)}> Date {dateArrow}</th>
                <th>Price</th>
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


  console.log("mapStateToProps")

  console.log(state)
  console.log(state.order.orderDetail)


  return {
    isLoading: state.order.itemsIsLoading,
    orderDetail: state.order.orderDetail,
    hasErrored: state.order.itemsHasErrored,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getN11OrdersDetail: () => dispatch(getN11OrdersDetail()),
    getAllN11OrdersDetail: () => dispatch(getAllN11OrdersDetail())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(N11OrderList)
