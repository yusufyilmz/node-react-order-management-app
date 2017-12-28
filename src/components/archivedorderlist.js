import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getArchivedOrdersDetail, searchOrders, getDeliveredOrdersDetail, getOrderCount, getN11OrderCount, getN11ArchivedOrdersDetail } from '../actions/index';
import DeliveredOrderDetailItem from './deliveredorderdetail';
import OrderDetailItem from './orderdetail';
import N11OrderDetailItem from './n11orderdetail';

import Search from './search';
import Modal from 'react-modal';
import Loading from './loading';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import { getCustomStyle, getPlatformOptions } from '../utils/index';
import Pager from 'react-pager';
import ReactPaginate from 'react-paginate';
import PaginationList from './paginationlist';
import Select from 'react-select';

class App extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      modalIsOpen: false,
      orders: [],
      checked: false,
      statusOrder: false,
      customerOrder: false,
      dateOrder: false,
      total: 11,
      current: 1,
      visiblePage: 1,
      offset: 0,
      perpage: 10,
      pageCount: 0,
      activeIndex: 1,
      platform_id: 0

    };
  }


  componentWillMount() {
    console.log("skajgdhajsdkbashjdas")
    //  this.props.getOrderCount();

  }


  onChangeStatus(val) {
    console.log("val");

    // if (this.state.platform_id == val.value) {
    //   return;
    // }

    console.log(val);
    this.setState({
      platform_id: val.value,
    }, () => {

      console.log("val2");

      console.log(val);
      console.log(val.value);

      if (val.value == 1) {
        this.props.getOrderCount();

        const values = {
          pageid: 1,
          perpage: this.state.perpage
        }

        this.props.getArchivedOrdersDetail(values);
      }
      else if (val.value == 2) {
        this.props.getN11OrderCount();

        const values = {
          pageid: 1,
          perpage: this.state.perpage
        }

        this.props.getN11ArchivedOrdersDetail(values);

      }

    });
  }


  componentDidMount() {

    // console.log("awukydqwıuhdwjd")
    // const values = {
    //   pageid: 0,
    //   perpage: this.state.perpage
    // }

    // this.props.getArchivedOrdersDetail(values);
  }

  componentWillReceiveProps(nextProps) {

    console.log("componentWillReceiveProps")
    if (nextProps.count > 0) {
      this.setState({ pageCount: Math.ceil(nextProps.count / this.state.perpage) })
    }

  }
  // componentWillReceiveProps(nextProps) {

  //   if (nextProps.count > 0) {
  //     this.setState({ pageCount: Math.ceil(nextProps.count / this.state.perpage) })
  //   }

  //   if (nextProps.orderDetail) {
  //     var orders = _.filter(nextProps.orderDetail, (item) => {

  //       if (item != undefined) {
  //         return item;
  //       }
  //     });
  //     const sortedOrders = _.sortByOrder(orders, [item => Date.parse(item.date_added)], ['desc']);

  //     // this.setState({ current: newPage });

  //     this.setState({ orders: sortedOrders })
  //   }
  // }


  // orderPage() {

  //   console.log("orderPage");

  //   console.log(this.state.orders.length);
  //   console.log(this.state.perpage);

  //   let currency = this.state.orders.length / this.state.perpage;
  //   console.log(currency);

  //   if (currency < 1) return 1;

  //   console.log(Math.ceil(currency));
  //   return Math.ceil(currency);



  // }


  handlePageClick = (index) => {
    const values = {
      pageid: index,
      perpage: this.state.perpage
    }

    if (this.state.platform_id == 2) {
      this.setState({ activeIndex: index  }, () => {
        this.props.getN11ArchivedOrdersDetail(values);
        //this.loadCommentsFromServer();
      });
    }
    else if (this.state.platform_id == 1) {
      this.setState({ activeIndex: index }, () => {
        this.props.getArchivedOrdersDetail(values);
        //this.loadCommentsFromServer();
      });
    }

  };

  render() {


    if (this.props.isLoading) {
      return <Loading />
    }

    console.log(this.props.orderDetail)

    return (
      <div>
        <div >
          <Select
            name='form-field-name'
            value={`${this.state.platform_id}`}
            options={getPlatformOptions()}
            onChange={this.onChangeStatus.bind(this)}
          />
        </div>

        <OrderList platformId={this.state.platform_id} data={this.props.orderDetail} />
        <PaginationList count={this.state.pageCount} activeIndex={this.state.activeIndex} onClick={this.handlePageClick.bind(this)} />
      </div>

    );
  }
}

export class OrderList extends Component {


  constructor(props) {
    super(props);
  }

  renderOrdersDetails() {

    let index = 1544;
    return _.map(this.props.data, (order) => {
      if (order) {
        index++

        // alert(this.state.platform_id);
        if (this.props.platformId == 2) {
          return <N11OrderDetailItem key={index} item={order} reactKey={index} />

        }
        else if (this.props.platformId == 1) {
          return <OrderDetailItem key={index} item={order} reactKey={index} />

        }

        // return <DeliveredOrderDetailItem key={index} item={order} reactKey={index} />
      }
    })
  }




  // orderProductStatus() {

  //   let orderType = '';
  //   if (this.state.statusOrder == true) {
  //     orderType = 'asc';
  //   }
  //   else {
  //     orderType = 'desc';
  //   }

  //   const sortedOrders = _.sortByOrder(this.state.orders, [item => item.order_state_id], [orderType]);
  //   this.setState({ orders: sortedOrders, statusOrder: !this.state.statusOrder });
  // }

  // orderProductOrderDate() {

  //   _.forEach(this.state.orders, item => {
  //     var a = Date.parse(item.date_added);
  //     console.log(a);
  //   })

  //   let orderType = '';
  //   if (this.state.dateOrder == true) {
  //     orderType = 'asc';
  //   }
  //   else {
  //     orderType = 'desc';
  //   }


  //   const sortedOrders = _.sortByOrder(this.state.orders, [item => Date.parse(item.date_added)], [orderType]);
  //   this.setState({ orders: sortedOrders, dateOrder: !this.state.dateOrder });


  // }

  // orderProductCustomer() {

  //   let orderType = '';
  //   if (this.state.customerOrder == true) {
  //     orderType = 'asc';
  //   }
  //   else {
  //     orderType = 'desc';
  //   }

  //   const sortedOrders = _.sortByOrder(this.state.orders, [item => item.customer_name], [orderType]);
  //   this.setState({ orders: sortedOrders, customerOrder: !this.state.customerOrder });

  // }
  render() {

    // const customerArrow = this.state.customerOrder == true ? <FaArrowUp /> : <FaArrowDown />;
    // const dateArrow = this.state.dateOrder == true ? <FaArrowDown /> : <FaArrowUp />;
    // const statusArrow = this.state.statusOrder == true ? <FaArrowUp /> : <FaArrowDown />;





    return (
      <div >
        <table className="table table-hover table-responsive">
          <thead>
            <tr>
              <th></th>
              <th> Reference</th>
              <th> Status </th>
              <th> Customer </th>
              <th> Order </th>
              <th> Shipping</th>
              <th> Archive</th>
              <th> Invoice</th>
            </tr>
          </thead>
          <tbody>
            {this.renderOrdersDetails()}
          </tbody>

        </table>

      </div>
    );
  }
};


function mapStateToProps(state) {
  console.log("state")
  console.log(state)
  return {
    isLoading: state.order.itemsIsLoading,
    orderDetail: state.order.archivedOrderDetail,
    hasErrored: state.order.itemsHasErrored,
    count: state.order.count
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchOrders: (values) => dispatch(searchOrders(values)),
    getDeliveredOrdersDetail: () => { dispatch(getDeliveredOrdersDetail()) },
    getArchivedOrdersDetail: (values) => dispatch(getArchivedOrdersDetail(values)),
    getOrderCount: () => dispatch(getOrderCount()),
    getN11ArchivedOrdersDetail: (values) => dispatch(getN11ArchivedOrdersDetail(values)),
    getN11OrderCount: () => dispatch(getN11OrderCount())

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)




