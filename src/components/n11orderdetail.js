import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash';
import Modal from 'react-modal';
import Loading from './loading';
import { getOrdersDetail, archiveOrder } from '../actions/index';
import { getOrderStatusOptions, camelize, getDateOptions, getCollapseCustomStyle, getCustomStyle } from '../utils/index';
import FaArrowCircleODown from 'react-icons/lib/fa/arrow-circle-o-down';
import FaArrowCircleOUp from 'react-icons/lib/fa/arrow-circle-o-up';

import OrderCollapse from './ordercollapse';

class N11OrderDetailItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapseModalIsOpen: false,
      order_archived: this.props.item.order_archived == true ? 1 : 0,
    }

    this.collapseOpenModal = this.collapseOpenModal.bind(this);
    this.collapseCloseModal = this.collapseCloseModal.bind(this);


  }

  componentWillReceiveProps(nextProps) {
    const orderid = this.props.item.order_id;
    if (!_.isEmpty(nextProps.archiveList)) {
      var object = _.find(nextProps.archiveList, (o) => { return o.order_id === orderid })

      if (object) {
        console.log(object);

        this.setState({ order_archived: object.archive_state })

      }

    }
  }


  collapseOpenModal() {
    this.setState({ collapseModalIsOpen: true })
  }

  collapseCloseModal() {
    this.setState({ collapseModalIsOpen: false })
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

  archiveOrder(e) {

    const values = {
      archive_state: !this.state.order_archived == true ? 1 : 0,
      order_id: this.props.item.order_id,
      platform_id: 2
    }

    this.props.archiveOrder(values);

  }


  render() {
    const link = `/invoicen11/${this.props.item.order_id}`;
    let price = this.calculatePrice(Number(this.props.item.total_price), 2)
    return (
      <tr >
        <td data-toggle="collapse" onClick={() => this.collapseOpenModal()} >
          <Modal
            isOpen={this.state.collapseModalIsOpen}
            onRequestClose={this.collapseCloseModal}
            style={getCollapseCustomStyle()}
            contentLabel='eee2'
          >
            <OrderCollapse reactKey={this.props.item.order_id} item={this.props.item} />
          </Modal>
          <FaArrowCircleODown /></td>
        <td className='orderDetailGsm'>{this.props.item.order_number} <br /> ({this.props.item.order_id})</td>
        <td> {camelize(this.props.item.invoice_name)} {camelize(this.props.item.invoice_surname)} </td>

        <td>{this.props.item.customer_gsm} </td>
        <td> {this.props.item.date_added} </td>
        <td>{price}TL </td>


        <td>
          <input type="checkbox" name="checkbox" checked={this.state.order_archived} onChange={this.archiveOrder.bind(this)} />
        </td>
        <td>
          <input type="checkbox" checked={this.props.item.invoice_created == 1} />
        </td>
        <td className="noborder">
          <button className='orderDetailButton'>
            <Link to={link} >Generate Invoice</Link>
          </button>
        </td>
      </tr>
    )
  };

};





function mapStateToProps(state, ownProps) {

  return {
    archive: state.order.archive,
    archiveList: state.order.archiveList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    archiveOrder: (values) => dispatch(archiveOrder(values)),
    getOrdersDetail: () => { dispatch(getOrdersDetail()) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(N11OrderDetailItem)
