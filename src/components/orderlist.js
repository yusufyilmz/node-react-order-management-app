import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getOrdersDetail, searchOrders, filterOrders, checkNewOrders, checkNewOrder, filterOrderStatus, initInvoice } from '../actions/index';
import { getCustomStyle, getOrderStatusOptions } from '../utils/index';
import ReactPaginate from 'react-paginate';

import OrderDetailItem from './orderdetail';
import Search from './search';

import Modal from 'react-modal';
// import Loading from '../Loading/index'
import Loading from './loading';
// import '../../styles/global.scss'
// import '../../styles/react-select.scss'
import OrderCollapse from './ordercollapse';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import Select from 'react-select';



const options = [{ value: '0', label: 'Not specified' },
{ value: '2', label: 'Ödeme tamamlandı' },
{ value: '3', label: 'Paket hazırlanıyor' },
{ value: '4', label: 'Kargoya verildi' },
{ value: '5', label: 'Teslim edildi' },
{ value: '6', label: 'İptal edildi' },
{ value: '7', label: 'Ücret iade edildi' },
{ value: '8', label: 'Ödeme hatası' },
{ value: '10', label: 'Banka ödemesi bekliyor' }];

class OrderList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false,
      orders: [],
      unfilteredOrders: [],
      checked: false,
      statusOrder: false,
      customerOrder: false,
      dateOrder: false,
      order_state: '',
      order_state_id: 0,
      value: 'select',
      options: options,
      checkedOrderId: ''
    }

    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  checkOrders() {
    this.props.checkNewOrders();
  }

  getAllOrders() {
    this.props.getOrdersDetail()

  }


  afterOpenModal() {
    this.subtitle.style.color = '#f00'
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  componentDidMount() {
    this.props.getOrdersDetail()
  }

  componentWillMount() {
    this.props.initInvoice()

  }


  onChangeFilter() {
    this.props.filterOrders();
  }


  componentWillReceiveProps(nextProps) {


    var orders = _.filter(nextProps.orderDetail, (item) => {

      if (item != undefined && item.order_state_id != 5) {
        return item;
      }
    });

    // if (orders && orders.length > 0) {

    // }

    console.log(orders);

    const sortedOrders = _.sortByOrder(orders, [item => Date.parse(item.date_added)], ['desc']);

    this.setState({ orders: sortedOrders })

  }


  onChangeStatus(e) {

    var filteredArray = _.filter(this.props.orderDetail, (order) => { return order && order.order_state_id == e.target.value });

    console.log(filteredArray);

    this.setState({
      orders: filteredArray,
      value: e.target.value,
      checked: false
    });

  }

  filterOrders() {

    var checked = this.state.checked;

    if (checked) {

      // var filteredArray = _.filter(this.state.orders, (order) => { return order && order.order_state_id != 5 });
      this.setState({ orders: this.state.unfilteredOrders, unfilteredOrders: [], checked: !checked });

    }
    else {
      var filteredArray = _.filter(this.state.orders, (order) => { return order && order.invoice_created == 0 && order.order_state_id != 5 });
      this.setState({ unfilteredOrders: this.state.orders, orders: filteredArray, checked: !checked });

    }

    // if (checked) {

    //   var filteredArray = _.filter(this.props.orderDetail, (order) => { return order && order.order_state_id != 5 });
    //   this.setState({ orders: filteredArray, checked: !checked });

    // }
    // else {
    //   var filteredArray = _.filter(this.props.orderDetail, (order) => { return order && order.invoice_created == 0 && order.order_state_id != 5 });
    //   this.setState({ orders: filteredArray, checked: !checked });

    // }

  }



  renderOrdersDetails() {
    let array = [];
    _.forEach(this.state.orders, (item) => {
      array.push(item);
      array.push(item);
    })

    if (_.isEmpty(array)) {
      return <tr><td>No order</td></tr>;
    }


    let index = -1
    return _.map(this.state.orders, (order) => {
      if (order) {
        index++

        return (
          <OrderDetailItem key={index} item={order} reactKey={index} callBack={this.update.bind(this)} />
        )
      }

    })
  }


  searchOrdersHere(values) {
    this.setState({ modalIsOpen: false })
    this.props.searchOrders(values)
  }

  update() {
    console.log("updated")
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



  handlePageClick = (data) => {
    // let selected = data.selected;
    // console.log(data);
    // let offset = Math.ceil(selected * this.state.perPage);
    // console.log(offset);


    // const values = {
    //   pageid: selected,
    //   perpage: this.state.perpage
    // }

    // this.setState({ offset: offset }, () => {
    //   this.props.getArchivedOrdersDetail(values);
    //   //this.loadCommentsFromServer();
    // });
  };

  orderPage() {
    return 1;
  }


  onChangeOrderId(e) {
    this.setState({ checkedOrderId: e.target.value });

  }

  checkNewOrder() {
    if (this.state.checkedOrderId !== "" && this.state.checkedOrderId.length > 2) {
      this.props.checkNewOrder(this.state.checkedOrderId)

    }
  }


  render() {
    if (this.props.isLoading) {
      console.log("aaaa")
      return <Loading />
    }
    console.log(this.state);

    const customerArrow = this.state.customerOrder == true ? <FaArrowUp /> : <FaArrowDown />;
    const dateArrow = this.state.dateOrder == true ? <FaArrowDown /> : <FaArrowUp />;
    const statusArrow = this.state.statusOrder == true ? <FaArrowUp /> : <FaArrowDown />;

    const orderstatus = getOrderStatusOptions();
    return (

      <div className='ordersDetail'>


        {
          this.props.hasErrored !== null && <div className="dangerPrice alert alert-danger">
            <strong>Warning!</strong>  {this.props.hasErrored}
          </div>
        }

        <div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={getCustomStyle()}
            contentLabel='Example Modal'
          >
            <Search searchOrders={this.searchOrdersHere.bind(this)} />
          </Modal>
        </div>

        <div className='addTradeWrapper'>

          <div>
            <button
              onClick={() => {
                this.openModal()
              }}
              className='tradeBtn addItemBtn'>
              Search Orders
          </button>

            <button
              onClick={() => {
                this.checkOrders()
              }}
              className='tradeBtn addItemBtn'>
              Check New Orders
          </button>

            <button
              onClick={() => {
                this.getAllOrders()
              }}
              className='tradeBtn addItemBtn'>
              Get All Orders
          </button>



          </div>

          <div style={{ paddingTop: 10 }}>
            <input type='text' value={this.state.checkedOrderId} onChange={this.onChangeOrderId.bind(this)} />
            <button
              onClick={this.checkNewOrder.bind(this)}
              className='tradeBtn addItemBtn'>
              Check Order
          </button>
          </div>

          <div className="selectOrderStatus form-group">
            <select value={this.state.value} onChange={this.onChangeStatus.bind(this)} className="form-control">
              <option value="select">Select a status</option>

              <option value="2">Ödeme tamamlandı</option>
              <option value="3">Paket hazırlanıyor</option>
              <option value="4">Kargoya verildi</option>
              <option value="5">Teslim edildi</option>
              <option value="6">İptal edildi</option>
              <option value="7">Ücret iade edildi</option>
              <option value="8">Ödeme hatası</option>
              <option value="10">Banka ödemesi bekliyor</option>
            </select>
          </div>

          <div>

            <label><input type="checkbox" name="checkbox" checked={this.state.checked} onChange={this.filterOrders.bind(this)} />Show orders without invoice</label>
            <label>Order count: {this.state.orders.length}</label>
          </div>

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



        <ReactPaginate previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={<a href="">...</a>}
          breakClassName={"break-me"}
          pageCount={this.orderPage()}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} />

      </div>

    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    isLoading: state.order.itemsIsLoading,
    orderDetail: state.order.orderDetail,
    hasErrored: state.order.itemsHasErrored,
    invoicePdf: state.invoice.pdf
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    filterOrders: () => dispatch(filterOrders()),
    checkNewOrders: () => dispatch(checkNewOrders()),
    checkNewOrder: (id) => dispatch(checkNewOrder(id)),
    searchOrders: (values) => dispatch(searchOrders(values)),
    filterOrderStatus: (id) => dispatch(filterOrderStatus(id)),
    initInvoice: () => dispatch(initInvoice()),
    getOrdersDetail: () => { dispatch(getOrdersDetail()) },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList)
