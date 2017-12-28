import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getInvoices, addInvoice, filterInvoiceList } from '../actions/index';
// import './styles.scss'
import InvoiceItem from './invoiceitem';
// import OrderDetailItem from '../OrderDetailItem/index'
// import Search from '../Search/index'
import Loading from './loading';
import { convertNumber } from '../utils/index';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class InvoiceList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      startDate: moment(),
      endDate: moment(),
      invoices: []

    };

    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
  }

  handleStartChange(date) {
    console.log(date);
    this.setState({
      startDate: date
    });
  }

  handleEndChange(date) {
    console.log(date);

    this.setState({
      endDate: date
    });
  }

  componentDidMount() {
    // this.props.getInvoices()
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.invoices) {
      this.setState({ invoices: nextProps.invoices, notChangedInvoices: nextProps.invoices });
    }
  }

  renderInvoicesDetails() {
    let index = 1

    console.log('orders')
    console.log(this.state.invoices)

    return _.map(this.state.invoices, (invoice) => {
      index++
      return <InvoiceItem key={index} item={invoice} />

    })
  }

  filterInvoicesDetails() {


    let startDate = this.state.startDate.format();
        let endDate = this.state.endDate.format();

    let date = {
      startDate: startDate.split('T')[0] + " 00:00", 
      endDate: endDate.split('T')[0] + " 23:59"
    }
    console.log(date)
    this.props.filterInvoiceList(date);
  }


  orderPage() {
    return 1
  }



  render() {
    if (this.props.isLoading) {
      return <Loading />
    }


    return (

      <div className='ordersDetail'>

        <div style={{ flexDirection: 'row', display: 'flex', float: 'right' }}>
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleStartChange}
          />

          <DatePicker
            selected={this.state.endDate}
            onChange={this.handleEndChange}
          />
          <button onClick={this.filterInvoicesDetails.bind(this)} >Filter Invoices</button>
        </div>

        {this.state.invoices.length > 0 &&
          <div >

            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="table-to-xls"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Download as XLS"
            />
            <table id="table-to-xls" className="table table-hover table-striped table-responsive">
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Order No</th>
                  <th>Set No</th>
                  <th>Total Price</th>
                  <th>Tax Price</th>
                  <th>Invoice Generate Date</th>
                </tr>
              </thead>
              <tbody>
                {this.renderInvoicesDetails()}
              </tbody>
            </table>
          </div>

        }
      </div>

    )
  }
}
function mapStateToProps(state) {
  console.log(state)
  return {
    // invoicePdf: state.invoice.pdf,
    // orders: state.order.orderWithoutInvoice,
    // hasErrored: state.order.itemsHasErrored,
    isLoading: state.invoice.invoiceIsLoading,
    hasErrored: state.invoice.invoiceHasErrored,
    invoices: state.invoice.invoices,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInvoices: () => { dispatch(getInvoices()) },
    addInvoice: (data) => { dispatch(addInvoice(data)) },
    filterInvoiceList: (data) => { dispatch(filterInvoiceList(data)) }


    //getOrdersWithoutInvoice : () => { dispatch(getOrdersWithoutInvoice()) },
    //createInvoiceWithData: (data) => { dispatch(createInvoiceWithData(data)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceList)
